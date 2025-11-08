'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import Spotify from './Spotify';

const SpotifyWithSession = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') return null;
  if (!session?.accessToken) return null;

  return <Spotify />;
};

const SpotifyWrapper = () => {
  return (
    <SessionProvider>
      <SpotifyWithSession />
    </SessionProvider>
  );
};

export default SpotifyWithSession;
