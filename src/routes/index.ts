import { Router } from 'express';
import { indexHandler, loginHandler } from '../handlers';

const router = Router();

router.get('/', indexHandler);

router.post('/login', loginHandler);

export default router;
