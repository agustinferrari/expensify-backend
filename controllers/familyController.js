const FamilySql = require('../models/familySQL');
const createKey = require('../library/jwtSupplier');
const DuplicateError = require('../errors/DuplicateFamilyError');
const sequelize = require("sequelize");
const WordValidator = require("../utilities/inputValidators");


class FamilyController {

    static async createNewFamily(name, transaction) {
        try {
            const apiKey = await FamilyController.createApiKey(name);
            WordValidator.validate(name, "family name", 20);
            const family = await FamilySql.instance.create({ name, apiKey }, transaction);
            return family;
        } catch (err) {
            console.log(err);
            if (err instanceof sequelize.UniqueConstraintError) throw (new DuplicateError(name));
        }
    }

    static async updateApiKey(req, res, next) {
        try {
            const { familyId } = req.params;
            const family = await FamilySql.instance.findOne({ where: { id: familyId } });
            const apiKey = await FamilyController.createApiKey(family.name);
            await FamilySql.instance.update({ apiKey }, { where: { id: familyId } });
            res.status(200).json({ message: 'Family API KEY updated successfully' });
        } catch (err) {
            console.log(err.message);
            next(err);
        }
    }

    static async createApiKey(familyName) {
        const todayDate = new Date();
        const data = { createdAt: todayDate, name: familyName };
        const apiKey = await createKey({ data });
        return apiKey;

    }

}

module.exports = FamilyController;