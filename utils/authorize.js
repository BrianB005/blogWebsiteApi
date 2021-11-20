const CustomError = require("../errors");

const authorizeUser = (requestUser, resourceId) => {
  if (requestUser.role === "admin") return;
  if ((requestUser.user.userId === resourceId, toString())) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};
module.exports = authorizeUser;
