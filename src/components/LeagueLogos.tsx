import { SportType } from '@/data/sportsData';

interface LogoProps {
  size?: number;
  className?: string;
}

// РПЛ — Российская Премьер-Лига
export function LogoRPL({ size = 32, className = '' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="30" fill="#1a3a6e" stroke="#c8a84b" strokeWidth="3"/>
      <polygon points="32,10 37,26 54,26 40,36 45,52 32,42 19,52 24,36 10,26 27,26" fill="#c8a84b"/>
      <text x="32" y="60" textAnchor="middle" fontSize="7" fill="#c8a84b" fontWeight="bold" fontFamily="sans-serif">РПЛ</text>
    </svg>
  );
}

// КХЛ — Континентальная Хоккейная Лига
export function LogoKHL({ size = 32, className = '' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="30" fill="#0a1628" stroke="#e63329" strokeWidth="3"/>
      <rect x="18" y="20" width="8" height="24" rx="2" fill="white"/>
      <rect x="18" y="29" width="16" height="7" rx="1" fill="white"/>
      <rect x="30" y="20" width="8" height="24" rx="2" fill="white"/>
      <rect x="42" y="20" width="4" height="24" rx="2" fill="#e63329"/>
      <rect x="38" y="20" width="12" height="4" rx="2" fill="#e63329"/>
      <rect x="38" y="40" width="12" height="4" rx="2" fill="#e63329"/>
    </svg>
  );
}

// ВТБ Единая Лига — Баскетбол
export function LogoVTB({ size = 32, className = '' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="30" fill="#003087" stroke="#f7941d" strokeWidth="3"/>
      <circle cx="32" cy="32" r="14" fill="none" stroke="#f7941d" strokeWidth="2.5"/>
      <path d="M18 32 Q32 18 46 32" stroke="#f7941d" strokeWidth="2" fill="none"/>
      <path d="M18 32 Q32 46 46 32" stroke="#f7941d" strokeWidth="2" fill="none"/>
      <line x1="32" y1="18" x2="32" y2="46" stroke="#f7941d" strokeWidth="2"/>
      <text x="32" y="57" textAnchor="middle" fontSize="6" fill="#f7941d" fontWeight="bold" fontFamily="sans-serif">ВТБ</text>
    </svg>
  );
}

// Суперлига — Волейбол
export function LogoSuperliga({ size = 32, className = '' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="30" fill="#6b21a8" stroke="#a855f7" strokeWidth="3"/>
      <circle cx="32" cy="32" r="13" fill="none" stroke="white" strokeWidth="2.5"/>
      <path d="M32 19 C38 22 38 28 32 32 C26 36 26 42 32 45" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M19 27 C23 24 29 26 32 32 C35 38 41 40 45 37" stroke="white" strokeWidth="2" fill="none"/>
      <path d="M19 37 C22 42 28 42 32 32 C36 22 42 22 45 27" stroke="white" strokeWidth="2" fill="none"/>
    </svg>
  );
}

// Универсальный компонент по виду спорта
export function SportLeagueLogo({ sport, size = 32, className = '' }: { sport: SportType; size?: number; className?: string }) {
  switch (sport) {
    case 'football':   return <LogoRPL size={size} className={className} />;
    case 'hockey':     return <LogoKHL size={size} className={className} />;
    case 'basketball': return <LogoVTB size={size} className={className} />;
    case 'volleyball': return <LogoSuperliga size={size} className={className} />;
  }
}

// Иконка «Все виды спорта»
export function LogoAllSports({ size = 32, className = '' }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="32" cy="32" r="30" fill="#1a1a2e" stroke="#4ade80" strokeWidth="2"/>
      <text x="32" y="38" textAnchor="middle" fontSize="24" fontFamily="sans-serif">🏆</text>
    </svg>
  );
}
