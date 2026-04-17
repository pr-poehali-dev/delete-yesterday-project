import { useState } from 'react';
import { Match, SPORT_CONFIG, TEAM_STATS } from '@/data/sportsData';
import Icon from '@/components/ui/icon';
import TeamLogo from '@/components/TeamLogo';

interface MatchDetailProps {
  match: Match;
  onClose: () => void;
}

function LeagueLogo({ src, fallback, name }: { src: string; fallback: string; name: string }) {
  const [err, setErr] = useState(false);
  if (err) return <span className="text-xl">{fallback}</span>;
  return (
    <img
      src={src}
      alt={name}
      className="w-6 h-6 object-contain"
      onError={() => setErr(true)}
    />
  );
}

export default function MatchDetail({ match, onClose }: MatchDetailProps) {
  const sport = SPORT_CONFIG[match.sport];
  const stats = TEAM_STATS[match.sport];
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-lg mx-auto p-4 pb-24">
        <button onClick={onClose} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 mt-2">
          <Icon name="ChevronLeft" size={20} />
          <span className="font-medium">Назад</span>
        </button>

        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-5">
            <span className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full font-medium ${sport.tagClass}`}>
              <LeagueLogo src={sport.leagueLogo} fallback={sport.emoji} name={sport.leagueName} />
              {match.league}
            </span>
            {isLive && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-live-pulse" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping-slow" />
                </div>
                <span className="text-sm font-bold text-red-400">
                  {match.minute ? `${match.minute} мин` : match.period}
                </span>
              </div>
            )}
            {isFinished && <span className="text-sm text-muted-foreground">Завершён · {match.date}</span>}
            {!isLive && !isFinished && <span className="text-sm text-muted-foreground">{match.date} · {match.time}</span>}
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Home team */}
            <div className="flex-1 text-center">
              <div className="flex justify-center mb-3">
                <TeamLogo
                  logo={match.homeTeam.logo}
                  emoji={match.homeTeam.emoji}
                  name={match.homeTeam.name}
                  size="xl"
                />
              </div>
              <div className="font-display text-xl leading-tight">{match.homeTeam.name}</div>
              {match.homeTeam.city && (
                <div className="text-xs text-muted-foreground mt-0.5">{match.homeTeam.city}</div>
              )}
            </div>

            {/* Score / VS */}
            {(isLive || isFinished) ? (
              <div className="text-center flex-shrink-0 px-2">
                <div className={`font-display text-5xl leading-none ${isLive ? 'neon-text-green' : ''}`}>
                  {match.homeScore}
                </div>
                <div className="text-muted-foreground text-sm my-1">:</div>
                <div className={`font-display text-5xl leading-none ${isLive ? 'neon-text-green' : ''}`}>
                  {match.awayScore}
                </div>
              </div>
            ) : (
              <div className="text-center flex-shrink-0 px-2">
                <div className="font-display text-4xl text-muted-foreground/30">vs</div>
                <div className="text-xs text-muted-foreground mt-1">{match.time}</div>
              </div>
            )}

            {/* Away team */}
            <div className="flex-1 text-center">
              <div className="flex justify-center mb-3">
                <TeamLogo
                  logo={match.awayTeam.logo}
                  emoji={match.awayTeam.emoji}
                  name={match.awayTeam.name}
                  size="xl"
                />
              </div>
              <div className="font-display text-xl leading-tight">{match.awayTeam.name}</div>
              {match.awayTeam.city && (
                <div className="text-xs text-muted-foreground mt-0.5">{match.awayTeam.city}</div>
              )}
            </div>
          </div>

          {match.venue && (
            <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Icon name="MapPin" size={12} />
              <span>{match.venue}</span>
            </div>
          )}
        </div>

        {/* Events timeline */}
        {match.events && match.events.length > 0 && (
          <div className="glass rounded-2xl p-5 mb-4">
            <h3 className="font-display text-xl mb-4">События матча</h3>
            <div className="space-y-2">
              {match.events.map((event, i) => (
                <div key={i} className={`flex items-center gap-3 ${event.team === 'away' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full glass flex items-center justify-center text-sm font-bold ${event.team === 'home' ? 'text-primary' : 'text-accent'}`}>
                    {event.minute}'
                  </div>
                  <div className={`flex items-center gap-2 ${event.team === 'away' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-lg">
                      {event.type === 'goal' || event.type === 'puck' ? sport.emoji : event.type === 'penalty' ? '🟨' : '🔄'}
                    </span>
                    <span className="text-sm font-medium">{event.player}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="glass rounded-2xl p-5 mb-4">
          <h3 className="font-display text-xl mb-4">Статистика лиги</h3>
          <div className="grid grid-cols-2 gap-3">
            {stats.teamStats.map((s, i) => (
              <div key={i} className="glass rounded-xl p-3 text-center">
                <div className="font-display text-2xl text-primary">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top scorers */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-display text-xl mb-4">Лучшие игроки</h3>
          <div className="space-y-3">
            {stats.topScorers.map((player, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{player.name}</div>
                  <div className="text-xs text-muted-foreground">{player.position} · {player.games} игр</div>
                </div>
                <div className="text-right flex-shrink-0">
                  {player.goals !== undefined && (
                    <div className="text-sm font-bold text-primary">{player.goals} голов</div>
                  )}
                  {player.points !== undefined && (
                    <div className="text-sm font-bold text-primary">{player.points} очк/иг</div>
                  )}
                  {player.assists !== undefined && (
                    <div className="text-xs text-muted-foreground">{player.assists} пас</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}