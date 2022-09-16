const CategorySQL = require("../models/categorySQL");
const ExpenseSQL = require("../models/expenseSQL");
const sequelize = require("sequelize");
const parseDate = require("../utilities/dateUtils");
const DuplicateError = require("../errors/DuplicateCategoryError");
const ValidationError = require("../errors/ValidationError");

class CategoryController {
    static async createCategory(req, res, next) {
        try {
            console.log(req);
            console.log(req.body);
            console.log(req);
            const { name, description, image, monthlyBudget } = req.body;
            const { familyId } = req.user;
            await CategorySQL.instance.create({
                name,
                description,
                image,
                monthlyBudget,
                familyId,
            });
            res.status(201).json({ message: 'Category created successfully' });
        } catch (err) {
            console.log(err);
            const { name } = req.body;
            if (err instanceof sequelize.UniqueConstraintError) next(new DuplicateError(name));
            else if (err instanceof sequelize.ValidationError) next(new ValidationError(err.errors));
            else next(err);
        }
    }

    static async deleteCategory(req, res, next) {
        try {
            const { categoryId } = req.params;
            await CategorySQL.instance.update({
                active: false,
            }, {
                where: {
                    id: categoryId,
                }
            });
            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (err) {
            console.log(err.message);
            next(err);
        }
    }

    static async updateCategory(req, res, next) {
        try {
            const { categoryId } = req.params;
            const { name, description, image, monthlyBudget } = req.body;
            await CategorySQL.instance.update({
                name: name,
                description: description,
                image: image,
                monthlyBudget: monthlyBudget,
            }, { where: { id: categoryId } });
            res.status(200).json({ message: "Category updated successfully" });
        } catch (err) {
            console.log(err);
            const { name } = req.body;
            if (err instanceof sequelize.UniqueConstraintError) next(new DuplicateError(name));
            else if (err instanceof sequelize.ValidationError) next(new ValidationError(err.errors));
            else next(err);
        }
    }

    static async getCategories(req, res, next) {
        try {
            const { familyId } = req.user;
            const categories = await CategorySQL.instance.findAll({
                attributes: ["name"],
                where: {
                    familyId: familyId,
                    active: true, // only active ones?
                },
            });
            res.json(categories);
        } catch (err) {
            console.log(err.message);
            next(err);
        }
    }

    static async getCategoriesWithMoreExpenses(req, res, next) {
        try {
            const categories = await ExpenseSQL.instance.findAll({
                ...CategoryController.groupByCategory(CategorySQL.instance),
                order: sequelize.literal("total DESC"),
                limit: 3,
            });
            res.json(categories);
        } catch (err) {
            console.log(err.message);
            next(err);
        }
    }

    static async getCategoriesExpensesByPeriod(req, res, next) {
        try {
            let { startDate, endDate } = req.query;
            const categories = await ExpenseSQL.instance.findAll({
                ...CategoryController.groupByCategory(CategorySQL.instance),
                where: {
                    producedDate: {
                        [sequelize.Op.between]: [parseDate(startDate), parseDate(endDate)],
                    },
                },
            });
            res.json(categories);
        } catch (err) {
            console.log(err.message);
            next(err);
        }
    }

    static groupByCategory = (categoryInstance) => ({
        attributes: ["categoryId", [sequelize.fn("sum", sequelize.col("amount")), "total"]],
        include: [{
            model: categoryInstance,
            attributes: [
                "name",
                /*, "description", "image", "monthlyBudget", "familyId", "active"*/
            ],
            where: {
                active: true,
            },
        }, ],
        group: ["categoryId"],
    });
}

module.exports = CategoryController;