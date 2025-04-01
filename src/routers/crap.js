const { Router } = require("express");

const crapController = require("../controllers/crap.js");
const router = Router();

router.get("/", crapController.getAll);
router.get("/:id", crapController.getOne);
router.delete("/:id", crapController.deleteOne);
router.post("/", crapController.createOne);

module.exports = router;
