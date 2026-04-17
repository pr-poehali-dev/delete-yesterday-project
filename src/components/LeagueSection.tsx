import { useState } from 'react';
import { Match, LEAGUE_MAP } from '@/data/sportsData';
import MatchRow from '@/components/MatchRow';
import Icon from '@/components/ui/icon';

interface LeagueSectionProps {
  leagueId: string;
  matches: Match[];
  onMatchClick: (m: Match) => void;
  defaultOpen?: boolean;
}

export default function LeagueSection({ leagueId, matches, onMatchClick, defaultOpen = true }: LeagueSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const league = LEAGUE_MAP[leagueId];
  if (!league || matches.length === 0) return null;

  const liveCount = matches.filter(m => m.status === 'live').length;

  return (
    <div>
      <div className="league-header" onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer' }}>
        {league.logo ? (
          <img src={league.logo} alt={league.shortName} className="w-5 h-5 object-contain flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <span className="text-base leading-none flex-shrink-0">{league.flag}</span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-foreground truncate">{league.name}</span>
            {liveCount > 0 && (
              <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-full">{liveCount} live</span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">{league.flag} {league.country}</span>
        </div>
        <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={14} className="text-muted-foreground flex-shrink-0" />
      </div>

      {open && (
        <div>
          {matches.map(m => (
            <MatchRow key={m.id} match={m} onClick={() => onMatchClick(m)} />
          ))}
        </div>
      )}
    </div>
  );
}
