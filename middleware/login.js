const userModel = require("../model/userModel");
module.exports = async (req, res, next) => {
  if (
    req.body.username !== undefined &&
    req.body.password !== undefined
  ) {
    let user = req.body.username.trim().toLowerCase();
    let pwd = req.body.password;

    const userStatus = await userModel.getAuthorizedWithPassword(
      user,
      pwd
    );
    req.user = userStatus;
    if (userStatus.auth) {
      res.cookie("user", userStatus.user.username, {
        maxAge: 1000 * 60 * 60
      });
      res.cookie("chash", userStatus.cookieHash, {
        maxAge: 1000 * 60 * 60
      });
    }
  } else if (
    req.cookies.user !== undefined &&
    req.cookies.chash !== undefined
  ) {
    req.user = await userModel.getAuthorizedWithHash(
      req.cookies.user,
      req.cookies.chash
    );
  }
  next();
};
