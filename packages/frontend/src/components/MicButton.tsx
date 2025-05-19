
import { useState } from 'react';

interface MicButtonProps {
  isRecording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const MicButton = ({ isRecording, onClick, disabled = false }: MicButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="perspective-container">
      <input 
        type="checkbox" 
        id="record" 
        className="mic-checkbox" 
        checked={isRecording}
        readOnly
      />
      <label 
        htmlFor="record" 
        className={`mic-button ${disabled ? 'mic-button-disabled' : ''}`}
        onClick={disabled ? undefined : onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        <div className="mic">
          <div className="mic-button-loader"></div>
          <div className="mic-base"></div>
        </div>
        <div className="button-message">
          <span>&nbsp;</span>
          <span>{isRecording ? 'STOP' : 'START'}</span>
        </div>
      </label>
      {disabled && isHovered && (
        <div className="tooltip">
          Microphone access is required
        </div>
      )}
    </div>
  );
};

export default MicButton;
