const { Router } = require("express");

const crapController = require("../controllers/crap.js");
const sanitizeBody = require("../middleware/sanitizeBody");
const validObjectId = require("../middleware/validateObject");
const addImages = require("../middleware/addImages");
const isAuthenticated = require("../middleware/isAuthenticated.js");
const { validateBuyer, validateOwner } = require("../middleware/isOwn.js");
const router = Router();

router.get("/mine", isAuthenticated, crapController.getMine);
router.get("/", isAuthenticated, crapController.getAll);
router.get("/:id", isAuthenticated, validObjectId, crapController.getOne);
router.delete("/:id", isAuthenticated, validObjectId, crapController.deleteOne);
router.post(
  "/",
  isAuthenticated,
  addImages,
  sanitizeBody,
  crapController.createOne
);
router.patch(
  "/:id",
  sanitizeBody,
  isAuthenticated,
  validObjectId,
  addImages,
  validateOwner,
  crapController.updateOne
);
router.put(
  "/:id",

  isAuthenticated,
  validObjectId,
  addImages,
  sanitizeBody,
  validateOwner,
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
  isAuthenticated,
  // sanitizeBody,
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
router.post("/:id/reset", isAuthenticated, validObjectId, crapController.reset);

module.exports = router;
