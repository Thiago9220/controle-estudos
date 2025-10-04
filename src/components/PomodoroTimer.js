import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Book } from 'lucide-react';
import './PomodoroTimer.css';

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const audioRef = useRef(null);

  const pomodoroDuration = 25 * 60;
  const shortBreakDuration = 5 * 60;
  const longBreakDuration = 15 * 60;

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      clearInterval(interval);
      setIsActive(false);
      if (audioRef.current) {
        audioRef.current.play();
      }
      // Automatically switch modes
      switch (mode) {
        case 'pomodoro':
          setMode('shortBreak');
          setTime(shortBreakDuration);
          break;
        case 'shortBreak':
          setMode('pomodoro');
          setTime(pomodoroDuration);
          break;
        case 'longBreak':
          setMode('pomodoro');
          setTime(pomodoroDuration);
          break;
        default:
          break;
      }
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    switch (mode) {
      case 'pomodoro':
        setTime(pomodoroDuration);
        break;
      case 'shortBreak':
        setTime(shortBreakDuration);
        break;
      case 'longBreak':
        setTime(longBreakDuration);
        break;
      default:
        setTime(pomodoroDuration);
    }
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    switch (newMode) {
      case 'pomodoro':
        setTime(pomodoroDuration);
        break;
      case 'shortBreak':
        setTime(shortBreakDuration);
        break;
      case 'longBreak':
        setTime(longBreakDuration);
        break;
      default:
        setTime(pomodoroDuration);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={`pomodoro-timer-container ${mode}`}>
      <div className="timer-modes">
        <button onClick={() => switchMode('pomodoro')} className={mode === 'pomodoro' ? 'active' : ''}><Book size={16} /> Foco</button>
        <button onClick={() => switchMode('shortBreak')} className={mode === 'shortBreak' ? 'active' : ''}><Coffee size={16} /> Pausa Curta</button>
        <button onClick={() => switchMode('longBreak')} className={mode === 'longBreak' ? 'active' : ''}><Coffee size={16} /> Pausa Longa</button>
      </div>
      <div className="timer-display">
        {formatTime(time)}
      </div>
      <div className="timer-controls">
        <button onClick={toggleTimer} className="control-button">
          {isActive ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button onClick={resetTimer} className="control-button">
          <RotateCcw size={32} />
        </button>
      </div>
      <audio ref={audioRef} src="/notification.mp3" />
    </div>
  );
};

export default PomodoroTimer;
