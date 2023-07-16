import express from 'express';
import controller from '../controllers/User';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/new', ValidateSchema(Schemas.user.create), controller.CreateUser);
router.get('/', controller.readAll);
router.get('/:userId', controller.readUser);
router.patch('/update/:userId', ValidateSchema(Schemas.user.update), controller.updateUser);
router.delete('/delete/:userId', controller.deleteUser);

export = router;