const router = require("express").Router();
const controller = require("./clients.controller");
const { requireLevel } = require("../../shared/middlewares/auth");

router.get("/", requireLevel("superadmin", "admin", "user"), controller.list);
router.post("/", requireLevel("admin", "user"), controller.create);
router.get("/:id", requireLevel("admin"), controller.get);
router.put("/:id", requireLevel("admin"), controller.update);
router.patch("/:id/estado", requireLevel("admin"), controller.toggleStatus);

module.exports = router;