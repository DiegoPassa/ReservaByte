import express from "express";
import controller from "../controllers/Table";
import { Schemas, ValidateSchema } from '../middleware/validateSchema';
import verifyRoles from "../middleware/verifyRole";
import { UserRole } from "../models/User";

const router = express.Router();

router.post("/", ValidateSchema(Schemas.table.create), controller.createTable); // create a new table
router.get("/", controller.readAll); // get all tables
router.get("/:tableId", controller.readTable); // get a table by tableId
router.patch("/:tableId", verifyRoles(UserRole.Waiter), controller.updateTable); // update a table by tableId
router.delete("/:tableId", verifyRoles(), controller.deleteTable); // delete a table by tableId

router.post("/:tableId/queue/:menuId", verifyRoles(UserRole.Waiter), controller.createOrder); // add an order to table queue by tableId and menuId
router.get("/:tableId/queue", verifyRoles(UserRole.Waiter)); // get queue from a table by tableId
router.delete("/:tableId/queue/:orderId", verifyRoles(UserRole.Waiter)); // delete an order from table's order queue


export = router;