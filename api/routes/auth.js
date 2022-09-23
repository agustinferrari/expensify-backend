const Router = require("express");
const router = Router({ mergeParams: true });
const signInController = require("../controllers/signInController");

router.post("/", signInController.logIn);

module.exports = router;