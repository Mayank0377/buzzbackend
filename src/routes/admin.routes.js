import { Router } from 'express';
import { loginAdmin, registerAdmin, logoutAdmin } from '../controllers/admin.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);


router.route("/logout").post(verifyJWT,logoutAdmin);

export default router;