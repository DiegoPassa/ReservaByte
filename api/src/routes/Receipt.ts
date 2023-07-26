import express from "express";
import controller from "../controllers/Receipt";

const router = express.Router();

router.post("/", controller.createReceipt);
router.get("/", controller.readAll);
router.get("/:receiptId", controller.readReceipt);
router.patch("/:receiptId", controller.updateReceipt);
router.delete("/:receiptId", controller.deleteReceipt);

export = router;