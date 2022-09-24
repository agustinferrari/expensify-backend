const bcrypt = require("bcryptjs");
const UserSQL = require("../dataAccess/models/userSQL");
const AuthError = require("../errors/auth/AuthError");
const { createKey } = require("../library/jwtSupplier");

class SignInLogic {
    static async signIn(email, password) {
        let user = await UserSQL.instance.findOne({ where: { email: email } });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new AuthError("Your email and password do not match. Please try again.");

        const data = { userId: user.id, role: user.role, email: user.email, familyId: user.familyId };
        const token = await createKey(data);
        return token;
    }
}

module.exports = SignInLogic;