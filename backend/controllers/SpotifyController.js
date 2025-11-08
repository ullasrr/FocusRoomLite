import axios from 'axios'
import querystring from 'querystring'

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

export const loginToSpotify = (req,res)=>{
      const scope = 'user-read-playback-state user-read-currently-playing';
  const authUrl = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
    });
  res.redirect(authUrl);
}