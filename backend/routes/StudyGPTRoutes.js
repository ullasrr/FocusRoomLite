import express from 'express'
const router = express.Router();
import { handleStudyGPT } from '../controllers/StudyGPTController.js';

router.post('/studygpt',handleStudyGPT);

export default router;