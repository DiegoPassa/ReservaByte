import express from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/refresh', AuthController.handleRefresh);
router.get('/logout', AuthController.logout);

export = router;