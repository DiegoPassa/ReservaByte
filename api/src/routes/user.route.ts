import express from 'express';
import controller from '../controllers/user.controller';
import { Schemas, ValidateSchema } from '../middleware/validateSchema';
import verifyRoles from '../middleware/verifyRole';
import { UserRole } from '../models/User';

const router = express.Router();

router.post('/', verifyRoles(), ValidateSchema(Schemas.user.create), controller.createUser);
router.get('/', controller.readAll);
router.get('/:userId', controller.readUser);
router.patch('/:userId', ValidateSchema(Schemas.user.update), controller.updateUser);
router.delete('/:userId', verifyRoles(), controller.deleteUser);

router.patch('/:userId/password', controller.updatePassword);

export = router;