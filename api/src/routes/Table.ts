import express from "express";
import controller from "../controllers/Table";
import { Schemas, ValidateSchema } from '../middleware/validateSchema';

const router = express.Router();

router.post("/", ValidateSchema(Schemas.table.create) ,controller.CreateTable);
router.get("/", controller.readAll);
router.get("/:tableId", controller.readTable);
router.patch("/:tableId", controller.updateTable);
router.delete("/:tableId", controller.deleteTable);

export = router;