import express from "express";
import controller from "../controllers/Table";
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post("/new", ValidateSchema(Schemas.table.create) ,controller.CreateTable);
router.get("/", controller.readAll);
router.get("/:tableId", controller.readTable);
router.patch("/update/:tableId", controller.updateTable);
router.delete("/delete/:tableId", controller.deleteTable);

export = router;