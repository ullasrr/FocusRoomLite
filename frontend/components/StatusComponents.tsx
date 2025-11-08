import React from 'react';

// Connection Status Component
export const ConnectionStatus: React.FC<{
  isConnected: boolean;
  userCount: number;
}> = ({ isConnected, userCount }) => (
  <div className="absolute top-4 left-4">
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
      isConnected ? 'bg-green-600' : 'bg-red-600'
    }`}>
      <div className="w-2 h-2 bg-white rounded-full"></div>
      <span className="text-sm">
        {isConnected ? `Connected (${userCount}/2)` : 'Disconnected'}
      </span>
    </div>
  </div>
);

// Error Display Component
export const ErrorDisplay: React.FC<{
  error: string | null;
  onClearError: () => void;
}> = ({ error, onClearError }) => {
  if (!error) return null;
  
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg z-10">
      {error}
      <button onClick={onClearError} className="ml-2 text-white">×</button>
    </div>
  );
};

// Debug Info Component
export const DebugInfo: React.FC<{
  isConnected: boolean;
  localStream: MediaStream | null;
  remoteUserConnected: boolean;
  remoteStream: MediaStream | null;
  peerConnection: RTCPeerConnection | null;
}> = ({ isConnected, localStream, remoteUserConnected, remoteStream, peerConnection }) => (
  <div className="absolute top-16 left-4 bg-gray-800 bg-opacity-75 rounded p-2 text-xs">
    <div>Socket: {isConnected ? '✓' : '✗'}</div>
    <div>Local Stream: {localStream ? '✓' : '✗'}</div>
    <div>Remote User: {remoteUserConnected ? '✓' : '✗'}</div>
    <div>Remote Stream: {remoteStream ? '✓' : '✗'}</div>
    <div>Peer Connection: {peerConnection ? '✓' : '✗'}</div>
  </div>
);
