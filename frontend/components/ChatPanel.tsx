import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Socket } from 'socket.io-client';

interface Message {
  message: string;
  from: string;
  fromSocketId: string;
  timestamp: string;
  roomId: string;
}

interface ChatPanelProps {
  socket: ReturnType<typeof io> | null;
  messages: Message[];
  roomId: string;
  userId: string;
  onSendMessage: (message: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  roomId,
  userId,
  onSendMessage
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-80 bg-gray-800 flex flex-col border-l border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold">Chat</h3>
        <p className="text-sm text-gray-400">Room: {roomId}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.from === userId ? 'bg-blue-600 ml-8' : 'bg-gray-700 mr-8'
            }`}
          >
            <p className="text-sm">{msg.message}</p>
            <div className="flex justify-between items-center mt-1 text-xs text-gray-300">
              <span>{msg.from === userId ? 'You' : msg.from}</span>
              <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={500}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
