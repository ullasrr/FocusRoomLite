import express from 'express';
import { Router } from 'express';
import { config } from 'dotenv';
config();
const router = Router();

import { getData } from '../controllers/leftSidebarController.js';

router.get('/',getData);

export default router;