
import { useState, useEffect, useCallback } from 'react';
import { MicrophoneState } from '../types/transcription';

export const useMicrophone = (onDataAvailable: (data: Blob) => void) => {
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [state, setState] = useState<MicrophoneState>({
    isRecording: false,
    error: null
  });

  const startRecording = useCallback(async () => {
    try {
      if (recorder) {
        setState(prev => ({ ...prev, isRecording: true }));
        recorder.start(1000);
        return true;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      newRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onDataAvailable(event.data);
        }
      };

      newRecorder.onstart = () => {
        setState({ isRecording: true, error: null });
        console.log('Started recording');
      };

      newRecorder.onstop = () => {
        setState(prev => ({ ...prev, isRecording: false }));
        console.log('Stopped recording');
      };

      newRecorder.onerror = (event) => {
        setState(prev => ({ 
          ...prev, 
          error: 'Recording error: ' + (event as any).error?.message || 'Unknown error' 
        }));
        console.error('Recorder error:', event);
      };
      
      setRecorder(newRecorder);
      newRecorder.start(1000);
      
      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to access microphone' 
      }));
      return false;
    }
  }, [recorder, onDataAvailable]);

  const stopRecording = useCallback(() => {
    if (recorder && state.isRecording) {
      recorder.stop();
      return true;
    }
    return false;
  }, [recorder, state.isRecording]);

  useEffect(() => {
    return () => {
      if (recorder && state.isRecording) {
        recorder.stop();
      }
    };
  }, [recorder, state.isRecording]);

  return {
    state,
    startRecording,
    stopRecording
  };
};
