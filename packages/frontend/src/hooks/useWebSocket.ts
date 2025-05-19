
import { useState, useEffect, useCallback } from 'react';
import { WebSocketState } from '../types/transcription';

export const useWebSocket = (url: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    error: null
  });

  useEffect(() => {
    const webSocket = new WebSocket(url);
    
    webSocket.onopen = () => {
      console.log('WebSocket connected');
      setState({ isConnected: true, error: null });
    };
    
    webSocket.onclose = () => {
      console.log('WebSocket disconnected');
      setState(prev => ({ ...prev, isConnected: false }));
    };
    
    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setState(prev => ({ ...prev, error: 'Connection error' }));
    };
    
    setSocket(webSocket);
    
    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, [url]);
  
  const sendMessage = useCallback((data: Blob) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(data);
      return true;
    }
    return false;
  }, [socket]);
  
  return {
    socket,
    state,
    sendMessage
  };
};
