import express from 'express';
import controller from '../controllers/User';
import { Schemas, ValidateSchema } from '../middleware/validateSchema';
import verifyRoles from '../middleware/verifyRole';
import { UserRole } from '../models/User';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.user.create), controller.CreateUser);
router.get('/', controller.readAll);
router.get('/:userId', controller.readUser);
router.patch('/:userId', ValidateSchema(Schemas.user.update), controller.updateUser);
router.delete('/:userId', verifyRoles(UserRole.Admin), controller.deleteUser);

export = router;