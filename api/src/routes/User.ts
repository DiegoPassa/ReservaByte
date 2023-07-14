import express from 'express';
import controller from '../controllers/User';

const router = express.Router();

router.post('/new', controller.CreateUser);
router.get('/get', controller.readAll);
router.get('/get/:userId', controller.readUser);
router.patch('/update/:userId', controller.updateUser);
router.delete('/delete/:userId', controller.deleteUser);

export = router;