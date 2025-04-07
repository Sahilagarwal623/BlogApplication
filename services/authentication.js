const JWT = require('jsonwebtoken');

const secret="7b45d891427b782202c87ca85b1e98a23c309f0e9bce70e73c7fff9d163a23c5";

function createTokenForUser(user) {

    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        profileImageURL: user.profileImageURL,
        fullName: user.fullName,
    }
    const token = JWT.sign(payload, secret);
    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
}