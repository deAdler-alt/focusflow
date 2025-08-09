import { useState, useEffect, useRef } from 'react'; // Dodajemy useRef
import './FocusMode.css';

interface FocusModeProps {
  taskText: string;
  onClose: () => void;
}

const FocusMode = ({ taskText, onClose }: FocusModeProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // useRef to "uchwyt" do elementu audio, dzięki niemu możemy go kontrolować
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (timeLeft === 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Prosta funkcja do włączania/wyłączania muzyki
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="focus-overlay">
      <div className="focus-box">
        <p className="focus-task-text">Skupiasz się na:</p>
        <h2>{taskText}</h2>
        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>

        <div className="music-controls">
          <button onClick={toggleMusic} className="music-button">
            {isMusicPlaying ? 'Wyłącz muzykę' : 'Włącz muzykę'}
          </button>
        </div>

        <button onClick={onClose} className="end-focus-button">
          Zakończ sesję
        </button>

        {/* Standardowy tag audio. Jest niewidoczny, ale kontrolujemy go z kodu. */}
        <audio ref={audioRef} src="/focus-music.mp3" loop />
      </div>
    </div>
  );
};

export default FocusMode;