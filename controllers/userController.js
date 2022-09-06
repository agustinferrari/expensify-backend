const UserSQL = require("../models/userSQL");
const FamilyController = require("./familyController");
const bcrypt = require("bcrypt");
const UserDTO = require("../DTO/userDTO");
const createToken = require("../library/tokenManager");

class UserController {
    static async createNewUser(req, res, next) {
        try {
            const { name, email, role, familyName, password } = req.body;
            const family = await FamilyController.createNewFamily(familyName);
            const salt = await bcrypt.genSalt(10);
            const encriptedPassword = await bcrypt.hash(password.toString(), salt);
            const user = await UserSQL.instance.create({ name, email, role, familyId: family.dataValues.id, password: encriptedPassword });
            const token = await createToken(user.id, user.role, user.email, user.familyId);
            res.send({ token: token });
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}

module.exports = UserController;