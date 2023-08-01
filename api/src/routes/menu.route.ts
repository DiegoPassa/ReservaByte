import express from "express";
import controller from "../controllers/menu.controller";
import { Schemas, ValidateSchema } from '../middleware/validateSchema';
import verifyRoles from "../middleware/verifyRole";
import { UserRole } from "../models/User";

const router = express.Router();

router.post("/", ValidateSchema(Schemas.menu.create), controller.createMenu)
router.get("/", controller.readAll) // ?type=[dish | drink]&name=[...]&price=[...]
router.get("/:menuId", controller.readMenu)
router.patch("/:menuId", controller.updateMenu)
router.delete("/:menuId", controller.deleteMenu)

export = router;