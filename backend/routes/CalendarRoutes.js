import express from 'express'
import { getTodayEvents } from '../controllers/CalendarController.js';
const router = express.Router();

router.post('/calendar/today', getTodayEvents);

export default router;