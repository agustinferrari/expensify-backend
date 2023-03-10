const RoleError = require("../../errors/auth/RoleError");
const TokenError = require("../../errors/auth/TokenError");
const { decryptKey } = require("../../library/jwtSupplier");

const authMiddleware = (roleArray) => async (req, res, next) => {
    const token = req.cookies.access_token;
    let user;
    try {
        user = await decryptKey(token);
    } catch (err) {
        return next(new TokenError());
    }
    req.user = user;
    const role = roleArray.find((role) => role.id === user.role);
    if (!role) {
        const availableRoles = roleArray.map((role) => role.name);
        return next(new RoleError(availableRoles.join(", ")));
    }
    next();
};

module.exports = authMiddleware;
