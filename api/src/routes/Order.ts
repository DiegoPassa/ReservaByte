import express from "express";
import controller from "../controllers/Order";
import verifyRoles from "../middleware/verifyRole";
import { UserRole } from "../models/User";

const router = express.Router();

router.get("/", verifyRoles(UserRole.Bartender, UserRole.Cook), controller.readAll);
router.get("/:orderId", verifyRoles(UserRole.Bartender, UserRole.Cook), controller.readOrder);
router.patch("/:orderId", verifyRoles(UserRole.Bartender, UserRole.Cook), controller.updateOrder);
router.delete("/:orderId", verifyRoles(UserRole.Bartender, UserRole.Cook), controller.deleteOrder);

export = router;