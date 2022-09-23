const Router = require("express");
const router = Router({ mergeParams: true });
const expenseController = require("../../api/controllers/expenseController");
const authMiddleware = require("../middleware/auth");
const Roles = require("../../library/roles");

router.post("/", authMiddleware([Roles.Member, Roles.Administrator]), expenseController.createNewExpense);
router.delete("/:expenseId", authMiddleware([Roles.Administrator]), expenseController.deleteExpense);
router.put("/:expenseId", authMiddleware([Roles.Administrator]), expenseController.updateExpense);
router.get("/", authMiddleware([Roles.Member, Roles.Administrator]), expenseController.getExpensesPaginated);
router.get("/count", authMiddleware([Roles.Member, Roles.Administrator]), expenseController.getExpensesCount);
router.get("/:categoryId", authMiddleware([Roles.Administrator]), expenseController.getExpensesByCategory);

module.exports = router;