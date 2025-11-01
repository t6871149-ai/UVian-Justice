
'use client';

import { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypingEffect({ text, speed = 20, className, onComplete }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText(''); // Start fresh

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed, onComplete]);

  return <p className={className}>{displayedText}</p>;
}
