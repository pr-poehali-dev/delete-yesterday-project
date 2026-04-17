import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import MatchCard from '@/components/MatchCard';
import MatchDetail from '@/components/MatchDetail';
import NotificationBell from '@/components/NotificationBell';
import { useSportsData } from '@/hooks/useSportsData';
import { proxyImg } from '@/components/TeamLogo';
import {
  ALL_TEAMS,
  SPORT_CONFIG,
  Match,
  SportType,
} from '@/data/sportsData';

function SportFilterBar({ value, onChange }: { value: SportType | 'all'; onChange: (v: SportType | 'all') => void }) {
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});
  const items: { id: SportType | 'all'; label: string; emoji: string; logo?: string }[] = [
    { id: 'all', label: 'Все', emoji: '🏆' },
    ...(['football', 'hockey', 'basketball', 'volleyball'] as SportType[]).map(s => ({
      id: s,
      label: SPORT_CONFIG[s].leagueName,
      emoji: SPORT_CONFIG[s].emoji,
      logo: SPORT_CONFIG[s].leagueLogo,
    })),
  ];
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${value === item.id ? 'tab-active' : 'glass text-muted-foreground hover:text-foreground'}`}
        >
          {item.logo && !logoErrors[item.id] ? (
            <img
              src={proxyImg(item.logo)}
              alt={item.label}
              className="w-4 h-4 object-contain"
              onError={() => setLogoErrors(e => ({ ...e, [item.id]: true }))}
            />
          ) : (
            <span>{item.emoji}</span>
          )}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

type Tab = 'home' | 'favorites' | 'schedule' | 'history';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'favorites', label: 'Избранное', icon: 'Star' },
  { id: 'schedule', label: 'Расписание', icon: 'Calendar' },
  { id: 'history', label: 'История', icon: 'Trophy' },
];


const STORAGE_KEY = 'sport_fav_teams';

function loadFavTeams(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveFavTeams(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [sportFilter, setSportFilter] = useState<SportType | 'all'>('all');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [favTeamIds, setFavTeamIds] = useState<string[]>(loadFavTeams);
  const [notifTeamIds, setNotifTeamIds] = useState<string[]>(loadFavTeams);
  const [mounted, setMounted] = useState(false);

  const { liveMatches, upcomingMatches, finishedMatches, loading, error, usingFallback, refresh } = useSportsData();
  const liveScores = liveMatches;

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleFav = (teamId: string) => {
    setFavTeamIds(prev => {
      const next = prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId];
      saveFavTeams(next);
      return next;
    });
  };

  const toggleNotif = (teamId: string) => {
    setNotifTeamIds(prev => prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]);
  };

  const filterBySport = (matches: Match[]) =>
    sportFilter === 'all' ? matches : matches.filter(m => m.sport === sportFilter);

  const favTeams = ALL_TEAMS.filter(t => favTeamIds.includes(t.id));
  const favMatches = [
    ...liveScores.filter(m => favTeamIds.includes(m.homeTeam.id) || favTeamIds.includes(m.awayTeam.id)),
    ...upcomingMatches.filter(m => favTeamIds.includes(m.homeTeam.id) || favTeamIds.includes(m.awayTeam.id)),
    ...finishedMatches.filter(m => favTeamIds.includes(m.homeTeam.id) || favTeamIds.includes(m.awayTeam.id)),
  ];

  if (selectedMatch) {
    return <MatchDetail match={selectedMatch} onClose={() => setSelectedMatch(null)} />;
  }

  return (
    <div className={`min-h-screen bg-background ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-display text-2xl tracking-wider">
            <span className="neon-text-green">SPORT</span>
            <span className="text-foreground/40 mx-1">·</span>
            <span className="text-foreground">LIVE</span>
          </div>
          <div className="flex items-center gap-2">
            {loading && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg glass">
                <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-xs text-muted-foreground">Загрузка...</span>
              </div>
            )}
            {!loading && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg glass">
                <div className="relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live-pulse" />
                  <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping-slow" />
                </div>
                <span className="text-xs font-bold text-red-400">{liveScores.length} ЛАЙВ</span>
              </div>
            )}
            <button onClick={refresh} className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" title="Обновить">
              <Icon name="RefreshCw" size={14} className="text-muted-foreground" />
            </button>
            <NotificationBell />
          </div>
        </div>
        {usingFallback && !loading && (
          <div className="max-w-lg mx-auto px-4 pb-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70 bg-white/3 border border-border/50 rounded-lg px-3 py-1.5">
              <Icon name="Info" size={12} />
              <span>Демо-данные · Матчи в российских лигах сейчас не транслируются</span>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 pb-24">

        {/* HOME */}
        {activeTab === 'home' && (
          <div className="pt-4">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping-slow" />
                </div>
                <h2 className="font-display text-2xl text-red-400">LIVE МАТЧИ</h2>
              </div>
              <div className="space-y-3">
                {liveScores.map((match, i) => (
                  <div key={match.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                    <MatchCard match={match} onClick={() => setSelectedMatch(match)} />
                  </div>
                ))}
              </div>
            </div>

            <SportFilterBar value={sportFilter} onChange={setSportFilter} />

            <div>
              <h2 className="font-display text-xl text-muted-foreground mb-3">БЛИЖАЙШИЕ МАТЧИ</h2>
              <div className="space-y-3">
                {filterBySport(upcomingMatches).slice(0, 4).map((match, i) => (
                  <div key={match.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                    <MatchCard match={match} onClick={() => setSelectedMatch(match)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="pt-4">
            <h2 className="font-display text-2xl mb-4">МОИ КОМАНДЫ</h2>

            {(['football', 'hockey', 'basketball', 'volleyball'] as SportType[]).map(sport => {
              const teams = ALL_TEAMS.filter(t => t.sport === sport);
              const sc = SPORT_CONFIG[sport];
              return (
                <div key={sport} className="mb-6">
                  <div className={`text-sm font-medium mb-3 px-3 py-1 rounded-lg inline-flex items-center gap-1.5 ${sc.tagClass}`}>
                    {sc.emoji} {sc.label}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {teams.map(team => {
                      const isFav = favTeamIds.includes(team.id);
                      const hasNotif = notifTeamIds.includes(team.id);
                      return (
                        <div key={team.id} className={`glass rounded-xl p-3 transition-all duration-200 ${isFav ? 'neon-border-green' : 'border border-border'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-2xl">{team.emoji}</span>
                            <button
                              onClick={() => toggleFav(team.id)}
                              className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                              <Icon
                                name="Star"
                                size={14}
                                className={isFav ? 'text-yellow-400' : 'text-muted-foreground'}
                                style={isFav ? { fill: '#facc15' } : {}}
                              />
                            </button>
                          </div>
                          <div className="font-semibold text-sm leading-tight">{team.name}</div>
                          <div className="text-xs text-muted-foreground">{team.city}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {team.wins}В · {team.draws !== undefined ? `${team.draws}Н · ` : ''}{team.losses}П
                          </div>
                          {isFav && (
                            <button
                              onClick={() => toggleNotif(team.id)}
                              className={`mt-2 w-full text-xs py-1 rounded-lg flex items-center justify-center gap-1 transition-colors ${hasNotif ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground hover:text-foreground'}`}
                            >
                              <Icon name={hasNotif ? "BellRing" : "Bell"} size={11} />
                              {hasNotif ? 'Уведомления вкл' : 'Уведомить'}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {favTeams.length > 0 && favMatches.length > 0 && (
              <div className="mt-2">
                <h3 className="font-display text-xl mb-3 text-muted-foreground">МАТЧИ МОИХ КОМАНД</h3>
                <div className="space-y-3">
                  {favMatches.map(match => (
                    <MatchCard key={match.id} match={match} onClick={() => setSelectedMatch(match)} />
                  ))}
                </div>
              </div>
            )}

            {favTeams.length === 0 && (
              <div className="glass rounded-2xl p-8 text-center text-muted-foreground mt-2">
                <div className="text-4xl mb-3">⭐</div>
                <p className="font-medium">Выберите любимые команды</p>
                <p className="text-sm mt-1 opacity-70">Нажмите ★ рядом с командой выше</p>
              </div>
            )}
          </div>
        )}

        {/* SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="pt-4">
            <h2 className="font-display text-2xl mb-4">РАСПИСАНИЕ</h2>

            <SportFilterBar value={sportFilter} onChange={setSportFilter} />

            {(() => {
              const filtered = filterBySport(upcomingMatches);
              const byDate: Record<string, Match[]> = {};
              filtered.forEach(m => {
                if (!byDate[m.date]) byDate[m.date] = [];
                byDate[m.date].push(m);
              });
              const entries = Object.entries(byDate);
              if (entries.length === 0) {
                return (
                  <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
                    <div className="text-4xl mb-3">📅</div>
                    <p className="font-medium">Нет запланированных матчей</p>
                  </div>
                );
              }
              return entries.map(([date, matches]) => (
                <div key={date} className="mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-semibold text-muted-foreground bg-background px-2">{date}</span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-3">
                    {matches.map((match, i) => (
                      <div key={match.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                        <MatchCard match={match} onClick={() => setSelectedMatch(match)} />
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div className="pt-4">
            <h2 className="font-display text-2xl mb-4">РЕЗУЛЬТАТЫ</h2>

            <SportFilterBar value={sportFilter} onChange={setSportFilter} />

            <div className="space-y-3">
              {filterBySport(finishedMatches).map((match, i) => (
                <div key={match.id} className={`animate-slide-up stagger-${Math.min(i + 1, 6)}`}>
                  <MatchCard match={match} onClick={() => setSelectedMatch(match)} />
                </div>
              ))}
            </div>

            {filterBySport(finishedMatches).length === 0 && (
              <div className="glass rounded-2xl p-8 text-center text-muted-foreground">
                <div className="text-4xl mb-3">🏆</div>
                <p className="font-medium">Нет завершённых матчей</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/50">
        <div className="max-w-lg mx-auto px-2 h-16 flex items-center justify-around">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSportFilter('all'); }}
                className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-primary/10" />
                )}
                <Icon name={tab.icon} size={20} />
                <span className={`text-[10px] font-medium relative ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}