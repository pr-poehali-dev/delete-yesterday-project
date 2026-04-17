import { useState } from 'react';
import { SportType, SPORT_CONFIG, SPORT_LEAGUES } from '@/data/sportsData';

interface LogoProps {
  size?: number;
  className?: string;
}

// Логотип основной лиги по виду спорта (первая топ-лига)
export function SportLeagueLogo({ sport, size = 32, className = '' }: { sport: SportType; size?: number; className?: string }) {
  const [err, setErr] = useState(false);
  const cfg = SPORT_CONFIG[sport];
  const topLeague = SPORT_LEAGUES[sport].find(l => l.tier === 'top');
  const logo = topLeague?.logo;

  if (logo && !err) {
    return (
      <img
        src={logo}
        alt={topLeague?.shortName ?? sport}
        width={size}
        height={size}
        className={`object-contain flex-shrink-0 ${className}`}
        onError={() => setErr(true)}
      />
    );
  }
  return <span style={{ fontSize: size * 0.7 }} className={`flex-shrink-0 leading-none ${className}`}>{cfg.emoji}</span>;
}

export function LogoAllSports({ size = 32, className = '' }: LogoProps) {
  return (
    <span style={{ fontSize: size * 0.85 }} className={`flex-shrink-0 leading-none ${className}`}>🏆</span>
  );
}
