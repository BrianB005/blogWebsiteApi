const express = require("express");

const app = express();
require("dotenv").config();
require("express-async-errors");
const connectDb = require("./db/connect");

const cookieParser = require("cookie-parser");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");

// routers
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const commentsRouter = require("./routes/comments");
const postsRouter = require("./routes/posts");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

app.use(express.json());
// the secret key passed to the function below is used to sign the cookie
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);
app.use(express.urlencoded({ extended: false }));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const Port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(Port, () =>
      console.log(`Server is currently listening on port ${Port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
