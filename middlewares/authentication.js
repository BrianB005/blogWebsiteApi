const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const AuthorizationHeader = req.headers.authorization;
  if (!AuthorizationHeader || !AuthorizationHeader.startsWith("Bearer")) {
    throw new CustomError.UnauthenticatedError("Invalid authentication xx");
  }
  const token = AuthorizationHeader.split(" ")[1];
  // console.log(token);
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Invalid authentication");
  }
};
//   const token = req.signedCookies.token;
//   if (!token) {
//     throw new CustomError.UnauthenticatedError("Invalid authentication!!");
//   }
//   try {
//     const { name, userId, role } = isTokenValid({ token });
//     req.user = { name, userId, role };
//     next();
//   } catch (error) {
//     throw new CustomError.UnauthenticatedError("Invalid authentication xx");
//   }
// };
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "NOt Authorized to access this route"
      );
    }
    next();
  };
};

module.exports = {
  authorizePermissions,
  authenticateUser,
};
