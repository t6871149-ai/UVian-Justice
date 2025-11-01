
'use client';

import { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypingEffect({ text, speed = 15, className, onComplete }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText(''); // Start fresh

    const typingInterval = setInterval(() => {
      if (i < text.length) {
        // Type in small, slightly random chunks for a more natural feel
        const chunk = text.substring(i, i + Math.floor(Math.random() * 3) + 1);
        setDisplayedText(prev => prev + chunk);
        i += chunk.length;
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
