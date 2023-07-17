import express from "express";
import controller from "../controllers/Menu";
import { Schemas, ValidateSchema } from '../middleware/validateSchema';

const router = express.Router();

router.post("/", ValidateSchema(Schemas.menu.create), controller.CreateMenu)
router.get("/", controller.readAll)
router.get("/dishes", controller.readDishes)
router.get("/drinks", controller.readDrinks)
router.get("/:menuId", controller.readMenu)
router.patch("/:menuId", controller.updateMenu)
router.delete("/:menuId", controller.deleteMenu)

export = router;