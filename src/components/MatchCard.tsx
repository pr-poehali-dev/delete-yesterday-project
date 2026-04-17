import { Match, SPORT_CONFIG } from '@/data/sportsData';

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
  compact?: boolean;
}

export default function MatchCard({ match, onClick, compact = false }: MatchCardProps) {
  const sport = SPORT_CONFIG[match.sport];
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <div
      onClick={onClick}
      className={`glass glass-hover rounded-xl p-4 cursor-pointer transition-all duration-200 ${isLive ? 'neon-border-green' : 'border border-border'} ${onClick ? 'hover:scale-[1.01]' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sport.tagClass}`}>
          {sport.emoji} {sport.label}
        </span>
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping-slow" />
              </div>
              <span className="text-xs font-bold text-red-400">
                {match.minute ? `${match.minute}'` : match.period}
              </span>
            </div>
          )}
          {isFinished && <span className="text-xs text-muted-foreground">Завершён</span>}
          {!isLive && !isFinished && <span className="text-xs text-muted-foreground">{match.time}</span>}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{match.homeTeam.emoji}</span>
            <span className={`font-semibold truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {compact ? match.homeTeam.shortName : match.homeTeam.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">{match.awayTeam.emoji}</span>
            <span className={`font-semibold truncate ${compact ? 'text-sm' : 'text-base'} text-muted-foreground`}>
              {compact ? match.awayTeam.shortName : match.awayTeam.name}
            </span>
          </div>
        </div>

        {(isLive || isFinished) ? (
          <div className="text-center flex-shrink-0">
            <div className={`score-display ${isLive ? 'neon-text-green' : 'text-foreground'}`}>
              {match.homeScore}
            </div>
            <div className="text-muted-foreground text-xs my-0.5">—</div>
            <div className={`score-display ${isLive ? 'neon-text-green' : 'text-foreground'}`}>
              {match.awayScore}
            </div>
          </div>
        ) : (
          <div className="text-center flex-shrink-0">
            <div className="font-display text-3xl text-muted-foreground/40">vs</div>
            <div className="text-xs text-muted-foreground mt-1">{match.date}</div>
          </div>
        )}
      </div>

      {!compact && (
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>{match.league}</span>
          <span>{match.venue}</span>
        </div>
      )}
    </div>
  );
}
