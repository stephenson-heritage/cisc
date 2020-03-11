const db = require("../config/db");
const crypto = require("crypto");
module.exports = {
  setCookieHash: async function(user, chash) {
    let conn = await db.getConnection();
    const row = await conn.query(
      "UPDATE `users` SET `cookieHash`=? WHERE `username`=?",
      [chash, user]
    );
    conn.end();
    return true;
  },

  getAuthorized: async function(user, pwd) {
    let conn = await db.getConnection();
    const row = await conn.query(
      "SELECT username, passHash,userId,`first` FROM users WHERE username = ?",
      [user]
    );
    conn.end();
    const hash = crypto
      .createHash("sha1")
      .update(pwd)
      .digest("base64");

    if (row[0] !== undefined) {
      if (hash === row[0].passHash) {
        // if the user is authenticated
        const chash = crypto
          .createHash("sha1")
          .update(hash)
          .digest("base64");
        this.setCookieHash(user, chash);
        return { auth: true, user: row[0], cookieHash: chash };
      }
    }
    return { auth: false };
  }
};
