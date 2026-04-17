import { Match } from '@/data/sportsData';
import TeamLogo from '@/components/TeamLogo';

interface MatchRowProps {
  match: Match;
  onClick: () => void;
}

function StatusCell({ match }: { match: Match }) {
  if (match.status === 'live') {
    const label = match.minute ? `${match.minute}'` : (match.period ?? 'LIVE');
    return (
      <div className="flex flex-col items-center gap-0.5">
        <div className="live-dot" />
        <span className="text-[11px] font-bold text-red-400 leading-none">{label}</span>
      </div>
    );
  }
  if (match.status === 'finished') {
    return <span className="text-[11px] text-muted-foreground text-center leading-tight">ОК<br />ЗАВ</span>;
  }
  return (
    <div className="flex flex-col items-center">
      <span className="text-[13px] font-semibold text-foreground/80">{match.time}</span>
    </div>
  );
}

export default function MatchRow({ match, onClick }: MatchRowProps) {
  const isLive = match.status === 'live';
  const hasScore = match.status !== 'upcoming';

  return (
    <div className="match-row" onClick={onClick}>
      {/* Status / time */}
      <StatusCell match={match} />

      {/* Teams */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <TeamLogo logo={match.homeTeam.logo} emoji={match.homeTeam.emoji} name={match.homeTeam.name} size="sm" />
          <span className={`text-[13px] font-medium truncate leading-tight ${isLive && match.homeScore > match.awayScore ? 'text-foreground' : 'text-foreground/80'}`}>
            {match.homeTeam.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TeamLogo logo={match.awayTeam.logo} emoji={match.awayTeam.emoji} name={match.awayTeam.name} size="sm" />
          <span className={`text-[13px] font-medium truncate leading-tight ${isLive && match.awayScore > match.homeScore ? 'text-foreground' : 'text-foreground/75'}`}>
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Score */}
      <div className="flex flex-col items-center justify-center">
        {hasScore ? (
          <>
            <span className={`score-col leading-tight ${isLive ? 'text-red-400' : 'text-foreground'}`}>
              {match.homeScore}
            </span>
            <span className={`score-col leading-tight ${isLive ? 'text-red-400' : 'text-foreground/70'}`}>
              {match.awayScore}
            </span>
          </>
        ) : (
          <span className="text-[13px] text-muted-foreground font-medium">—</span>
        )}
      </div>
    </div>
  );
}
