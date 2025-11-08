import express from 'express'
const router = express.Router()
import {fetchThemes} from '../controllers/themesController.js'

router.get('/',fetchThemes);


export default router;