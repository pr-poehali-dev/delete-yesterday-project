import { useState } from 'react';
import { SportType, SPORT_CONFIG } from '@/data/sportsData';

interface LogoProps {
  size?: number;
  className?: string;
}

// Универсальный компонент логотипа лиги — грузит из нашего CDN, fallback на emoji
export function SportLeagueLogo({ sport, size = 32, className = '' }: { sport: SportType; size?: number; className?: string }) {
  const [err, setErr] = useState(false);
  const cfg = SPORT_CONFIG[sport];

  if (!err) {
    return (
      <img
        src={cfg.leagueLogo}
        alt={cfg.leagueName}
        width={size}
        height={size}
        className={`object-contain flex-shrink-0 ${className}`}
        onError={() => setErr(true)}
      />
    );
  }
  return <span style={{ fontSize: size * 0.6 }} className={`flex-shrink-0 leading-none ${className}`}>{cfg.emoji}</span>;
}

// Иконка «Все виды спорта»
export function LogoAllSports({ size = 32, className = '' }: LogoProps) {
  return (
    <span style={{ fontSize: size * 0.85 }} className={`flex-shrink-0 leading-none ${className}`}>🏆</span>
  );
}
