import React, { ReactNode, useRef, useState, useEffect } from 'react';

interface TruncateTextProps {
  children: ReactNode;
  lines?: number;
  className?: string;
}

export const TruncateText: React.FC<TruncateTextProps> = ({
  children,
  lines = 1,
  className = '',
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const element = textRef.current;
      if (!element) return;

      // Check if the content is overflowing
      setIsTruncated(element.scrollWidth > element.clientWidth);
    };

    checkTruncation();

    // Recheck on window resize
    window.addEventListener('resize', checkTruncation);
    return () => {
      window.removeEventListener('resize', checkTruncation);
    };
  }, [children]);

  return (
    <div
      ref={textRef}
      className={`truncate ${className}`}
      style={{
        WebkitLineClamp: lines,
        display: lines > 1 ? '-webkit-box' : 'block',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%',
      }}
      title={isTruncated && typeof children === 'string' ? children : undefined}
    >
      {children}
    </div>
  );
};

export default TruncateText;
