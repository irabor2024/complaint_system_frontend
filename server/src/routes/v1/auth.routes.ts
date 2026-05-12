import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from '../../controllers/auth.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import {
  loginSchema,
  registerSchema,
  twoFactorDisableSchema,
  twoFactorLoginVerifySchema,
  twoFactorSetupCompleteSchema,
} from '../../validation/auth.schema';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const twoFactorLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const twoFactorSetupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRouter = Router();

authRouter.post('/register', loginLimiter, validateBody(registerSchema), authController.register);
authRouter.post('/login', loginLimiter, validateBody(loginSchema), authController.login);
authRouter.post(
  '/2fa/login/verify',
  twoFactorLoginLimiter,
  validateBody(twoFactorLoginVerifySchema),
  authController.verifyTwoFactorLogin
);
authRouter.post('/2fa/setup/init', requireAuth, twoFactorSetupLimiter, authController.beginTwoFactorSetup);
authRouter.post(
  '/2fa/setup/complete',
  requireAuth,
  twoFactorSetupLimiter,
  validateBody(twoFactorSetupCompleteSchema),
  authController.completeTwoFactorSetup
);
authRouter.post(
  '/2fa/disable',
  requireAuth,
  loginLimiter,
  validateBody(twoFactorDisableSchema),
  authController.disableTwoFactor
);
authRouter.get('/me', requireAuth, authController.me);
