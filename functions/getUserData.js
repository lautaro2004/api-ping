const db = require('../db.js');

function getUserData(user_id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT user_id, username, first_name, last_name FROM users WHERE user_id = ?';
    db.query(sql, [user_id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results.length === 0) {
          resolve(null); // Usuario no encontrado
        } else {
          resolve(results[0]);
        }
      }
    });
  });
}

module.exports = {
  getUserData,
};

