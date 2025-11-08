'use client'

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';
import { Users, ArrowRight, Sparkles } from 'lucide-react';

const CreateRoom = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(''); 
    const [joinRoomId, setJoinRoomId] = useState('');
    const router = useRouter();
    const { data: session } = useSession();


    const createRoom = async ()=>{
        setLoading(true);
        setError('');

        try {
            // Get user email from session
            let userId: string;
            if (session?.user?.email) {
                userId = session.user.email;
            } else {
                // Fallback to localStorage or default
                const userIdFromStorage = localStorage.getItem('userId');
                if (!userIdFromStorage) {
                    userId = uuidv4();
                    localStorage.setItem('userId', userId);
                } else {
                    userId = userIdFromStorage;
                }
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/room`,{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email:userId}),
            });
            
            const data=await response.json();

            if (response.ok) {
        router.push(`/room/${data.roomId}`);
      } else {
        setError(data.message || 'Failed to create room');
      }

        } catch (error) {
            console.error('Error creating room:', error);
            setError('Network error occurred');
        }
        finally {
      setLoading(false);
    }
};

    const joinRoom=()=>{
        if(joinRoomId.trim()){
            router.push(`/room/${joinRoomId.trim()}`);
        }
    };

        

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Study Rooms
          </h1>
          <p className="text-gray-400">Connect and collaborate with others</p>
        </div>

        {/* Main cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Create Room */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <Users className="w-10 h-10 text-blue-400 mb-4" />
            
            <h2 className="text-xl font-bold text-white mb-2">Create New Room</h2>
            <p className="text-gray-400 mb-4 text-sm">Start a new study session</p>
            
            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-2 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={createRoom}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  Create Room
                </>
              )}
            </button>
          </div>

          {/* Join Room */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <ArrowRight className="w-10 h-10 text-blue-400 mb-4" />
            
            <h2 className="text-xl font-bold text-white mb-2">Join Existing Room</h2>
            <p className="text-gray-400 mb-4 text-sm">Enter a room ID to join</p>
            
            <div className="space-y-3">
              <input
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Enter Room ID"
                className="w-full p-3 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && joinRoom()}
              />
              <button
                onClick={joinRoom}
                disabled={!joinRoomId.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Join Room
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-white">Getting Started</h3>
              <p className="text-gray-400 text-sm">Quick guide to using study rooms</p>
            </div>
          </div>
          
          <ul className="space-y-2">
            {[
              "Create a room and share the Room ID with others",
              "Or join an existing room using a shared Room ID",
              "Allow camera and microphone permissions when prompted",
              "Use controls to toggle audio/video",
              "Chat with participants in real-time"
            ].map((instruction, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-300 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs text-blue-400 font-semibold">
                  {index + 1}
                </span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CreateRoom
