import { Router } from 'express';
import { indexHandler, loginHandler } from '../handlers';
import { logoutHandler } from '../handlers/index';

const router = Router();

router.get('/', indexHandler);

router.post('/login', loginHandler);
router.get('/logout', logoutHandler);

export default router;
