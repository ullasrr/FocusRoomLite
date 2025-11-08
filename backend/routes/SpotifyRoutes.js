import express from "express"
const router = express.Router();
import {
  loginToSpotify,
  spotifyCallback,
  getCurrentlyPlaying,
} from './controllers/SpotifyController.js';

router.get('/spotify/login',loginToSpotify);
router.get('/spotify/callback',spotifyCallback);
router.get('/spotify/current',getCurrentlyPlaying);


export default router;