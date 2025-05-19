
import { memo } from 'react';

const InfoButtons = memo(() => {
  return (
    <div className="button-container">
      <a
        href="https://console.deepgram.com/signup"
        className="info-button sign-up"
        target="_blank"
        rel="noopener noreferrer"
      >
        Sign Up
      </a>
      <a
        href="https://developers.deepgram.com/docs/introduction"
        className="info-button docs"
        target="_blank"
        rel="noopener noreferrer"
      >
        Read the Docs
      </a>
    </div>
  );
});

InfoButtons.displayName = 'InfoButtons';

export default InfoButtons;
