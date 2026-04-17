import { useState } from 'react';

interface TeamLogoProps {
  logo?: string;
  emoji: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  sm: { container: 'w-7 h-7', img: 'w-7 h-7', text: 'text-base' },
  md: { container: 'w-9 h-9', img: 'w-9 h-9', text: 'text-xl' },
  lg: { container: 'w-12 h-12', img: 'w-12 h-12', text: 'text-3xl' },
  xl: { container: 'w-16 h-16', img: 'w-16 h-16', text: 'text-5xl' },
};

export default function TeamLogo({ logo, emoji, name, size = 'md' }: TeamLogoProps) {
  const [imgError, setImgError] = useState(false);
  const s = SIZE_MAP[size];

  if (logo && !imgError) {
    return (
      <img
        src={logo}
        alt={name}
        className={`${s.img} object-contain drop-shadow-sm flex-shrink-0`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span className={`${s.text} flex-shrink-0 leading-none`}>{emoji}</span>
  );
}
