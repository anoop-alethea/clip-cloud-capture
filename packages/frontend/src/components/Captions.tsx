
import { memo } from 'react';

interface CaptionsProps {
  text: string;
}

const Captions = memo(({ text }: CaptionsProps) => {
  return (
    <div className="captions" aria-live="polite">
      <span>{text}</span>
    </div>
  );
});

Captions.displayName = 'Captions';

export default Captions;
