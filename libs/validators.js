function username(username) {
    return /^[0-9a-zA-Z_.-]+$/.test(username);
}

function password(password) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(password);
}

module.exports = { username, password };