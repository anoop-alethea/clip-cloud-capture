
import { memo } from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

const ConnectionStatus = memo(({ isConnected, error }: ConnectionStatusProps) => {
  if (error) {
    return (
      <div className="connection-status error">
        <span>Error: {error}</span>
      </div>
    );
  }
  
  return (
    <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
      <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
    </div>
  );
});

ConnectionStatus.displayName = 'ConnectionStatus';

export default ConnectionStatus;
