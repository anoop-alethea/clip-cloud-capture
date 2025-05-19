
import { useState, useEffect, useCallback } from 'react';
import MicButton from './components/MicButton';
import Captions from './components/Captions';
import InfoButtons from './components/InfoButtons';
import ConnectionStatus from './components/ConnectionStatus';
import { useWebSocket } from './hooks/useWebSocket';
import { useMicrophone } from './hooks/useMicrophone';
import { TranscriptionData } from './types/transcription';
import './styles/app.css';

// Import the image
import clickImage from './assets/click.png';

function App() {
  const [transcript, setTranscript] = useState<string>('Realtime speech transcription API');
  const [isMicrophoneSupported, setIsMicrophoneSupported] = useState<boolean>(true);
  
  // Check if microphone is supported
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsMicrophoneSupported(false);
      console.error('Media devices or getUserMedia not supported in this browser.');
    }
  }, []);

  // Initialize WebSocket connection
  const { socket, state: wsState, sendMessage } = useWebSocket('ws://localhost:3001/ws');
  
  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!socket) return;
    
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data === '') return;
      
      try {
        const data: TranscriptionData = JSON.parse(event.data);
        if (data?.channel?.alternatives?.[0]?.transcript) {
          setTranscript(data.channel.alternatives[0].transcript);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };
    
    socket.addEventListener('message', handleMessage);
    
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket]);
  
  // Handle microphone data
  const handleAudioData = useCallback((data: Blob) => {
    sendMessage(data);
  }, [sendMessage]);
  
  // Initialize microphone
  const { state: micState, startRecording, stopRecording } = useMicrophone(handleAudioData);
  
  // Handle record button click
  const handleRecordClick = useCallback(() => {
    if (micState.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [micState.isRecording, startRecording, stopRecording]);

  return (
    <div className="app-container">
      <div className="content">
        <img className="click" src={clickImage} alt="Click indicator" />
        <div className="button-container">
          <MicButton 
            isRecording={micState.isRecording} 
            onClick={handleRecordClick} 
            disabled={!isMicrophoneSupported || !wsState.isConnected}
          />
        </div>
      </div>
      
      <h1>Captions by Deepgram</h1>
      
      {(wsState.error || micState.error) && (
        <div className="error-container">
          {wsState.error && <p className="error">WebSocket error: {wsState.error}</p>}
          {micState.error && <p className="error">Microphone error: {micState.error}</p>}
        </div>
      )}
      
      {!isMicrophoneSupported && (
        <div className="error-container">
          <p className="error">
            Microphone access is not supported in this browser. 
            Please try using a modern browser like Chrome or Firefox.
          </p>
        </div>
      )}
      
      <ConnectionStatus isConnected={wsState.isConnected} error={wsState.error} />
      
      <Captions text={transcript} />
      
      <InfoButtons />
    </div>
  );
}

export default App;
