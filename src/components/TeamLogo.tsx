import { useState } from 'react';

interface TeamLogoProps {
  logo?: string;
  emoji: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  sm: { img: 'w-7 h-7',   text: 'text-base' },
  md: { img: 'w-9 h-9',   text: 'text-xl'   },
  lg: { img: 'w-12 h-12', text: 'text-3xl'  },
  xl: { img: 'w-16 h-16', text: 'text-5xl'  },
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

  return <span className={`${s.text} flex-shrink-0 leading-none`}>{emoji}</span>;
}