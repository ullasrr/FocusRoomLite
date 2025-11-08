'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LeftSidebar from './LeftSidebar';
import Todo from './Todo';
import Notes from './Notes';
import { SessionProvider } from 'next-auth/react';
import PomodoroTimer from './PomodoroTimer';
import TodaySchedule from './TodaySchedule';
import StudyGPT from './StudyGPT';
import SpotifyWrapper from './SpotifyWrapper';
import ThemeSelector from './ThemeSelector';
import CreateRoom from './CreateRoom';

interface Theme {
  url: string;
}

interface Link {
  icon: string;
  label: string;
}

interface Props {
  sidebarLinks: Link[];
}

const ClientDashboard = ({ sidebarLinks }: Props) => {
  const router = useRouter();
  const [showTodo, setShowTodo] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCal, setShowCal] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showGpt, setShowGpt] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    async function fetchThemes() {
      try {
        const res = await fetch('http://localhost:3001/api/themes');
        if (!res.ok) throw new Error('Failed to fetch themes');
        const data: string[] = await res.json();
        setThemes(data.map((url) => ({ url })));
      } catch (err) {
        setError('Could not load themes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchThemes();
  }, []);

  // Listen for theme changes from localStorage
  useEffect(() => {
    const updateBackground = () => {
      const savedTheme = localStorage.getItem('selectedTheme');
      if (savedTheme) {
        setBackgroundImage(`url(http://localhost:3001${savedTheme})`);
      }
    };

    // Initial load
    updateBackground();

    // Listen for storage changes
    window.addEventListener('storage', updateBackground);
    
    // Custom event for same-tab updates
    const handleThemeChange = () => updateBackground();
    window.addEventListener('themeChanged', handleThemeChange);

    return () => {
      window.removeEventListener('storage', updateBackground);
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);


  const handleSidebarClick = (label: string) => {
    if (label === 'Users') {
      router.push('/createroom');
      return;
    }
    if (label === 'Todo') setShowTodo((prev) => !prev);
    if (label === 'Notes') setShowNotes((prev) => !prev);
    if (label === 'Timer') setShowCal((prev) => !prev);
    if (label === 'Study GPT') setShowGpt((prev) => !prev);
    if (label === 'Music') setShowSpotify((prev) => !prev);
    if (label === 'Themes') setShowTheme((prev) => !prev);
  };

  return (
    <SessionProvider>
      <div 
        className="flex h-screen text-white overflow-hidden relative"
        style={{
          backgroundImage: backgroundImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <LeftSidebar sidebar={sidebarLinks} onItemClick={handleSidebarClick} />

        {/* Themes */}
        <div className="flex-1 relative">
          {showTheme && (
            <div className="absolute top-4 left-2 z-20">
              {loading && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-4">
                  <p className="text-gray-200">Loading themes...</p>
                </div>
              )}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-300">{error}</p>
                </div>
              )}
              {!loading && !error && themes.length > 0 && (
                <ThemeSelector themes={themes} />
              )}
            </div>
          )}

          {/* Timer */}
          <div className="flex justify-center items-center ">
            <div className="rounded-lg ">
              <PomodoroTimer />
            </div>
          </div>

          {/* Notes */}
          {showNotes && (
            <div className="absolute top-4 right-4 z-10">
              <Notes />
            </div>
          )}
          
          {/* show calendar */}
          {showCal && (
            <div className='absolute left-0 z-100 top-0'>
              <TodaySchedule />
            </div>
          )}

          {showGpt && (
            <div className='absolute right-0 top-10'>
              <StudyGPT />
            </div>
          )}
          
          {showSpotify && (
            <div className='absolute right-0 top-10'>
              <SpotifyWrapper />
            </div>
          )}

          {/* Todo */}
          {showTodo && (
            <div className="absolute bottom-4 left-4 z-10">
              <Todo showtodo={showTodo} onClose={() => setShowTodo(false)} />
            </div>
          )}
        </div>
      </div>
    </SessionProvider>
  );
};

export default ClientDashboard;