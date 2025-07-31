const crypto = require('crypto');
const pool = require("../config/database");

// TODO
function validPassword(password, storedPassword) {
    const [salt, originalHash] = storedPassword.split('$');
    const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return originalHash === hashVerify;
}

async function findUserByUsername(username) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0];
}

async function findUserById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
}

function genPassword(password) {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
        .toString(`hex`);
    return `${salt}$${hash}`;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.findUserByUsername = findUserByUsername;
module.exports.findUserById = findUserById;