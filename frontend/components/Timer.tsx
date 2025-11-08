// 'use client';
// import React, { useEffect, useState } from 'react';

// interface TimerProps {
//   initialTime: number;
// }

// const WORK_DURATION = 25 * 60;
// const SHORT_BREAK = 5 * 60;
// const LONG_BREAK = 15 * 60;

// const Timer = ({ initialTime }: TimerProps) => {
//   const [time, setTime] = useState(initialTime || WORK_DURATION);
//   const [isRunning, setIsRunning] = useState(false);
//   const [isBreak, setIsBreak] = useState(false);
//   const [sessionCount, setSessionCount] = useState(0);
//   const [mode, setMode] = useState<'work' | 'break'>('work');

//   const maxTime =
//     mode === 'work'
//       ? WORK_DURATION
//       : (sessionCount + 1) % 4 === 0
//       ? LONG_BREAK
//       : SHORT_BREAK;

//   const playSound = () => {
//     const audio = new Audio('/ding.mp3');
//     audio.play().catch(() => {});
//   };

//   const notify = () => {
//     if (Notification.permission === 'granted') {
//       new Notification(mode === 'work' ? 'Break Time!' : 'Back to Work!');
//     }
//   };

//   useEffect(() => {
//     if (Notification.permission !== 'granted') Notification.requestPermission();
//   }, []);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (isRunning && time > 0) {
//       interval = setInterval(() => setTime((prev) => prev - 1), 1000);
//     } else if (isRunning && time === 0) {
//       playSound();
//       notify();

//       setIsRunning(false);
//       if (mode === 'work') {
//         setSessionCount((count) => count + 1);
//         setMode('break');
//         setTime((sessionCount + 1) % 4 === 0 ? LONG_BREAK : SHORT_BREAK);
//       } else {
//         setMode('work');
//         setTime(WORK_DURATION);
//       }
//     }

//     return () => clearInterval(interval);
//   }, [isRunning, time, mode, sessionCount]);

//   const handleReset = () => {
//     setIsRunning(false);
//     setMode('work');
//     setTime(WORK_DURATION);
//     setSessionCount(0);
//   };

//   const percentage = Math.round((time / maxTime) * 100);

//   return (
//     <div className="text-center p-6 max-w-md mx-auto bg-neutral-900 rounded-xl shadow-md text-white">
//       <h1 className="text-3xl font-bold mb-4">
//         {mode === 'work' ? 'Focus Mode 🔥' : 'Break Time ☕'}
//       </h1>

//       <div className="relative w-40 h-40 mx-auto mb-6">
//         <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
//           <circle
//             cx="50"
//             cy="50"
//             r="45"
//             stroke="#4b5563"
//             strokeWidth="10"
//             fill="none"
//           />
//           <circle
//             cx="50"
//             cy="50"
//             r="45"
//             stroke="#10b981"
//             strokeWidth="10"
//             strokeDasharray="283"
//             strokeDashoffset={283 - (283 * percentage) / 100}
//             strokeLinecap="round"
//             fill="none"
//           />
//         </svg>
//         <div className="absolute inset-0 flex items-center justify-center text-4xl font-mono">
//           {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
//         </div>
//       </div>

//       <div className="space-x-4">
//         <button
//           onClick={() => setIsRunning(!isRunning)}
//           className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
//         >
//           {isRunning ? 'Pause' : 'Start'}
//         </button>
//         <button
//           onClick={handleReset}
//           className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
//         >
//           Reset
//         </button>
//       </div>

//       <p className="mt-6 text-sm text-gray-400">
//         Session: {sessionCount} &bull; {mode === 'work' ? 'Working...' : 'Resting...'}
//       </p>
//     </div>
//   );
// };

// export default Timer;


