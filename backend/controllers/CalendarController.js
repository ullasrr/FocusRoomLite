import { google } from 'googleapis';

export const getTodayEvents = async (req, res) => {
  const { accessToken } = req.body;


  if (!accessToken) return res.status(400).json({ error: 'Missing access token' });

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: 'v3', auth });

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: startOfDay,
      timeMax: endOfDay,
      singleEvents: true,
      orderBy: 'startTime',
    });

    res.json(response.data);
  } catch (err) {
    console.error('Failed to fetch today’s events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};
