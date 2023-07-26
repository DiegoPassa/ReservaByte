import express from "express";
import controller from "../controllers/Order";

const router = express.Router();

router.get("/", controller.readAll);
router.get("/:orderId", controller.readOrder);
router.patch("/:orderId", controller.updateOrder);
router.delete("/:orderId", controller.deleteOrder);

export = router;