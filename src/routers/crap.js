const { Router } = require("express");

const crapController = require("../controllers/crap.js");
const isAuthenticated = require("../middleware/isAuthenticated.js");
const router = Router();

router.get("/", isAuthenticated, crapController.getAll);
router.get("/:id", isAuthenticated, crapController.getOne);
router.delete("/:id", isAuthenticated, crapController.deleteOne);
router.post("/", isAuthenticated, crapController.createOne);
router.patch("/:id", isAuthenticated, crapController.updateOne);
router.put("/:id", isAuthenticated, crapController.replaceOne);
router.post("/:id/interested", isAuthenticated, crapController.isInterested);
router.post("/:id/agreed", isAuthenticated, crapController.agreed);

module.exports = router;
