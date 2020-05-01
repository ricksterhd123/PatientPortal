function username(username) {
    return /^[0-9a-zA-Z_.-]+$/.test(username);
}

function password(password) {
    return /^[0-9a-zA-Z_,-]+$/.test(password) && password.length >= 5;
}

module.exports = { username, password };