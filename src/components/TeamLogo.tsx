import { useState } from 'react';

const PROXY_BASE = 'https://functions.poehali.dev/6f1d15be-b247-4e59-a9b1-281f24dcb669';

export function proxyImg(url?: string): string | undefined {
  if (!url) return undefined;
  return `${PROXY_BASE}?img=${encodeURIComponent(url)}`;
}

interface TeamLogoProps {
  logo?: string;
  emoji: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  sm: { img: 'w-7 h-7',  text: 'text-base' },
  md: { img: 'w-9 h-9',  text: 'text-xl'  },
  lg: { img: 'w-12 h-12', text: 'text-3xl' },
  xl: { img: 'w-16 h-16', text: 'text-5xl' },
};

export default function TeamLogo({ logo, emoji, name, size = 'md' }: TeamLogoProps) {
  const [imgError, setImgError] = useState(false);
  const s = SIZE_MAP[size];
  const src = proxyImg(logo);

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        className={`${s.img} object-contain drop-shadow-sm flex-shrink-0`}
        onError={() => setImgError(true)}
      />
    );
  }

  return <span className={`${s.text} flex-shrink-0 leading-none`}>{emoji}</span>;
}
