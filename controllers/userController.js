const UserSQL = require("../models/userSQL");
const FamilyController = require("./familyController");
const bcrypt = require("bcrypt");
const createKey = require("../library/jwtSupplier");
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateUserError');
const sequelize = require("sequelize");

class UserController {
    static async createNewUser(req, res, next) {
        try {
            const { name, email, role, familyName, password } = req.body;

            const user = await UserSQL.connection.transaction(async (t) => {
                const family = await FamilyController.createNewFamily(familyName, { transaction: t });
                const salt = await bcrypt.genSalt(10);
                const encriptedPassword = await bcrypt.hash(password.toString(), salt);
                const user = await UserSQL.instance.create({ name, email, role, familyId: family.dataValues.id, password: encriptedPassword }, { transaction: t });
                return user;
            });

            const data = { userId: user.id, role: user.role, email: user.email, familyId: user.familyId };
            const token = await createKey(data);
            res.send({ token: token });
        } catch (err) {
            console.log(err);
            const { email } = req.body;
            if (err instanceof sequelize.UniqueConstraintError) next(new DuplicateError(email));
            if (err instanceof sequelize.ValidationError) next(new ValidationError(err.errors));
            else next(err);
        }
    }
}

module.exports = UserController;