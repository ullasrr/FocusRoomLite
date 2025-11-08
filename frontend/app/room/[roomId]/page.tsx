'use client'
import React from 'react'
import { useState,useRef,useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Video, Mic, MicOff, VideoOff, Users, Copy, Check, Share2, MessageSquare, Send, Phone, PhoneOff } from 'lucide-react'
import io from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001')

const page = () => {

  const [room, setroom] = useState('')
  const [copied, setCopied] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState<Array<{text: string, from: string, timestamp: string}>>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState<string[]>([])

  const params = useParams()
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof params.roomId === 'string') {
      setroom(params.roomId)
    }
  }, [params.roomId])

  useEffect(() => {
    if (!room) return

    const userId = socket.id || `user-${Date.now()}`

    // Initialize WebRTC
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        })

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream)
        })

        pc.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0]
            setIsConnected(true)
          }
        }

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', {
              roomId: room,
              candidate: event.candidate,
            })
          }
        }

        pc.oniceconnectionstatechange = () => {
          console.log('ICE connection state:', pc.iceConnectionState)
          if (pc.iceConnectionState === 'connected') {
            setIsConnected(true)
          } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
            setIsConnected(false)
          }
        }

        pcRef.current = pc

        // Join room
        socket.emit('joinRoom', { roomId: room, userId })

        // Socket event handlers
        socket.on('room-joined', ({ connectedUsers }: { connectedUsers: string[] }) => {
          console.log('Joined room, connected users:', connectedUsers)
          setConnectedUsers(connectedUsers)
        })

        socket.on('user-connected', async ({ userId: newUserId, connectedUsers }: { userId: string, connectedUsers: string[] }) => {
          console.log('User connected:', newUserId)
          setConnectedUsers(connectedUsers)
          
          // Create and send offer
          const offer = await pc.createOffer()
          await pc.setLocalDescription(offer)
          socket.emit('offer', { roomId: room, offer })
        })

        socket.on('offer', async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
          console.log('Received offer')
          await pc.setRemoteDescription(new RTCSessionDescription(offer))
          const answer = await pc.createAnswer()
          await pc.setLocalDescription(answer)
          socket.emit('answer', { roomId: room, answer })
        })

        socket.on('answer', async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
          console.log('Received answer')
          await pc.setRemoteDescription(new RTCSessionDescription(answer))
        })

        socket.on('ice-candidate', async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
          } catch (e) {
            console.error('Error adding ice candidate:', e)
          }
        })

        socket.on('chat-message', ({ message, from, timestamp }: { message: string, from: string, timestamp: string }) => {
          setMessages((prev) => [...prev, { text: message, from, timestamp }])
        })

        socket.on('user-disconnected', ({ userId: disconnectedUserId }: { userId: string }) => {
          console.log('User disconnected:', disconnectedUserId)
          setConnectedUsers(prev => prev.filter(id => id !== disconnectedUserId))
          setIsConnected(false)
        })

        socket.on('error', ({ type, message }: { type: string, message: string }) => {
          console.error('Socket error:', type, message)
        })
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error)
      })

    return () => {
      // Cleanup
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }
      if (pcRef.current) {
        pcRef.current.close()
      }
      socket.emit('leave-room')
      socket.off('room-joined')
      socket.off('user-connected')
      socket.off('offer')
      socket.off('answer')
      socket.off('ice-candidate')
      socket.off('chat-message')
      socket.off('user-disconnected')
      socket.off('error')
    }
  }, [room])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const copyRoomId = () => {
    navigator.clipboard.writeText(room)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
        socket.emit('media-state-change', {
          roomId: room,
          mediaState: { audio: audioTrack.enabled, video: isVideoEnabled }
        })
      }
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
        socket.emit('media-state-change', {
          roomId: room,
          mediaState: { audio: isAudioEnabled, video: videoTrack.enabled }
        })
      }
    }
  }

  const sendMessage = () => {
    if (chatInput.trim()) {
      const messageData = {
        roomId: room,
        message: chatInput,
        timestamp: new Date().toISOString()
      }
      socket.emit('chat-message', messageData)
      setChatInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col p-4">
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-blue-400" />
                <div>
                  <h2 className="text-white font-semibold">Room: <span className="text-blue-400 font-mono">{room}</span></h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span>{isConnected ? 'Connected' : 'Waiting...'}</span>
                    <span className="ml-2">• {connectedUsers.length + 1} online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={copyRoomId}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy ID
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Videos */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Remote video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video border border-gray-700">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400">Waiting for others to join</p>
                    <p className="text-gray-500 text-sm mt-1">Share the room ID above</p>
                  </div>
                </div>
              )}
            </div>

            {/* Local video */}
            <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video border border-gray-700">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-sm">
                You
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={toggleAudio}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                    isAudioEnabled
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isAudioEnabled ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={toggleVideo}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                    isVideoEnabled
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isVideoEnabled ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-white" />
                  )}
                </button>

                <button
                  onClick={() => {
                    if (localStreamRef.current) {
                      localStreamRef.current.getTracks().forEach(track => track.stop())
                    }
                    window.location.href = '/createroom'
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 transition"
                >
                  <PhoneOff className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="flex flex-col bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">Chat</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="bg-gray-700 rounded-lg p-2">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-blue-400 text-sm font-medium">{msg.from === socket.id ? 'You' : msg.from}</span>
                      <span className="text-gray-500 text-xs">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-white text-sm">{msg.text}</p>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
