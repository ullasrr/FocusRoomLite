beginning code of page


'use client'
import React, { use } from 'react'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:3001') // Adjust the URL as needed

const page = () => {
  const {roomId}=useParams()
  const localVideoRef= useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pcRef=useRef<RTCPeerConnection | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const userId = socket.id;

    socket.emit('joinRoom', { roomId, userId });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection();

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            roomId,
            candidate: event.candidate,
          });
        }
      };

      pcRef.current = pc;

      socket.on('user-connected', async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { roomId, offer });
      });

      socket.on('offer', async ({ offer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, answer });
      });

      socket.on('answer', async ({ answer }) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on('ice-candidate', async ({ candidate }) => {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });

      socket.on('chat-message', (message: string) => {
        setMessages((prev) => [...prev, message]);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
  socket.emit('chat-message', { roomId, message: chatInput });
  setMessages((prev) => [...prev, `Me: ${chatInput}`]);
  setChatInput('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Room ID: {roomId}</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <video ref={localVideoRef} autoPlay muted style={{ width: '50%' }} />
        <video ref={remoteVideoRef} autoPlay style={{ width: '50%' }} />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default page
