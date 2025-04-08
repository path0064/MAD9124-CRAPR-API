const { Router } = require("express");

const crapController = require("../controllers/crap.js");
const sanitizeBody = require("../middleware/sanitizeBody");
const validObjectId = require("../middleware/validateObject");
const isAuthenticated = require("../middleware/isAuthenticated.js");
const { validateBuyer, validateOwner } = require("../middleware/isOwn.js");
const router = Router();

router.get("/", isAuthenticated, crapController.getAll);
router.get("/:id", isAuthenticated, validObjectId, crapController.getOne);
router.delete("/:id", isAuthenticated, validObjectId, crapController.deleteOne);
router.post("/", sanitizeBody, isAuthenticated, crapController.createOne);
router.patch(
  "/:id",
  sanitizeBody,
  isAuthenticated,
  validObjectId,
  crapController.updateOne
);
router.put(
  "/:id",
  sanitizeBody,
  isAuthenticated,
  validObjectId,
  crapController.replaceOne
);
router.post(
  "/:id/interested",
  isAuthenticated,
  validObjectId,
  crapController.isInterested
);

router.post(
  "/:id/suggest",
  sanitizeBody,
  isAuthenticated,
  validObjectId,
  validateOwner,
  crapController.suggestion
);

router.post(
  "/:id/flush",
  isAuthenticated,
  validObjectId,
  validateOwner,
  crapController.flushed
);
router.post(
  "/:id/agree",
  isAuthenticated,
  validObjectId,
  validateBuyer,
  crapController.agreed
);
router.post(
  "/:id/disagree",
  isAuthenticated,
  validObjectId,
  validateBuyer,
  crapController.disagree
);
router.post(
  "/:id/reset",
  isAuthenticated,
  validObjectId,
  validateBuyer,
  crapController.reset
);

module.exports = router;
