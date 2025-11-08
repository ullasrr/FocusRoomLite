import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageCircle } from 'lucide-react';

interface ControlBarProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleChat: () => void;
}

const ControlBar: React.FC<ControlBarProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  onToggleChat
}) => {
  return (
    <div className="flex justify-center items-center space-x-4 p-6 bg-gray-800">
      <button
        onClick={onToggleAudio}
        className={`p-3 rounded-full transition-colors ${
          isAudioEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'
        }`}
      >
        {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
      </button>

      <button
        onClick={onToggleVideo}
        className={`p-3 rounded-full transition-colors ${
          isVideoEnabled ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-500'
        }`}
      >
        {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
      </button>

      <button
        onClick={onEndCall}
        className="p-4 bg-red-600 hover:bg-red-500 rounded-full transition-colors"
      >
        <PhoneOff size={24} />
      </button>

      <button
        onClick={onToggleChat}
        className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default ControlBar;
