
export interface TranscriptionData {
  channel?: {
    alternatives?: Array<{
      transcript?: string;
    }>;
  };
  metadata?: any;
  is_final?: boolean;
}

export interface WebSocketState {
  isConnected: boolean;
  error: string | null;
}

export interface MicrophoneState {
  isRecording: boolean;
  error: string | null;
}
