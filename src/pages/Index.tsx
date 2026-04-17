import { useState, useEffect, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import MatchRow from '@/components/MatchRow';
import LeagueSection from '@/components/LeagueSection';
import MatchDetail from '@/components/MatchDetail';
import NotificationBell from '@/components/NotificationBell';
import { SportLeagueLogo, LogoAllSports } from '@/components/LeagueLogos';
import { useSportsData } from '@/hooks/useSportsData';
import TeamLogo from '@/components/TeamLogo';
import {
  ALL_TEAMS, SPORT_CONFIG, SPORT_LEAGUES, LEAGUE_MAP,
  Match, SportType, League,
} from '@/data/sportsData';

type Tab = 'live' | 'schedule' | 'results' | 'favorites';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'live',      label: 'Live',       icon: 'Radio'    },
  { id: 'schedule',  label: 'Расписание', icon: 'Calendar' },
  { id: 'results',   label: 'Итоги',      icon: 'CheckCircle' },
  { id: 'favorites', label: 'Избранное',  icon: 'Star'     },
];

const SPORTS: { id: SportType | 'all'; label: string }[] = [
  { id: 'all',        label: 'Все'  },
  { id: 'football',   label: '⚽'   },
  { id: 'hockey',     label: '🏒'   },
  { id: 'basketball', label: '🏀'   },
  { id: 'volleyball', label: '🏐'   },
];

const STORAGE_KEY = 'sport_fav_teams_v2';
const loadFavs = (): string[] => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } };
const saveFavs = (ids: string[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));

function groupByLeague(matches: Match[]): Record<string, Match[]> {
  const groups: Record<string, Match[]> = {};
  matches.forEach(m => {
    if (!groups[m.leagueId]) groups[m.leagueId] = [];
    groups[m.leagueId].push(m);
  });
  return groups;
}

export default function Index() {
  const [tab, setTab] = useState<Tab>('live');
  const [sport, setSport] = useState<SportType | 'all'>('all');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [favTeamIds, setFavTeamIds] = useState<string[]>(loadFavs);
  const [notifIds, setNotifIds] = useState<string[]>(loadFavs);
  const [mounted, setMounted] = useState(false);
  const [favSport, setFavSport] = useState<SportType>('football');

  const { liveMatches, upcomingMatches, finishedMatches, loading, usingFallback, refresh } = useSportsData();

  useEffect(() => { setMounted(true); }, []);

  const toggleFav = (id: string) => setFavTeamIds(prev => { const n = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]; saveFavs(n); return n; });
  const toggleNotif = (id: string) => setNotifIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const filterSport = (arr: Match[]) => sport === 'all' ? arr : arr.filter(m => m.sport === sport);

  const liveFiltered     = filterSport(liveMatches);
  const scheduleFiltered = filterSport(upcomingMatches);
  const resultsFiltered  = filterSport(finishedMatches);

  const liveGroups     = useMemo(() => groupByLeague(liveFiltered), [liveFiltered]);
  const scheduleGroups = useMemo(() => groupByLeague(scheduleFiltered), [scheduleFiltered]);
  const resultsGroups  = useMemo(() => groupByLeague(resultsFiltered), [resultsFiltered]);

  const favMatches = useMemo(() => [
    ...liveMatches, ...upcomingMatches, ...finishedMatches
  ].filter(m => favTeamIds.includes(m.homeTeam.id) || favTeamIds.includes(m.awayTeam.id)), [liveMatches, upcomingMatches, finishedMatches, favTeamIds]);

  if (selectedMatch) {
    return <MatchDetail match={selectedMatch} onClose={() => setSelectedMatch(null)} />;
  }

  return (
    <div className={`min-h-screen bg-background flex flex-col max-w-lg mx-auto ${mounted ? 'fade-up' : 'opacity-0'}`}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        {/* Logo row */}
        <div className="flex items-center justify-between px-3 h-12">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-primary tracking-widest">SCORE</span>
            <span className="font-display text-2xl text-foreground/40">LIVE</span>
          </div>
          <div className="flex items-center gap-2">
            {loading && <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
            {!loading && liveMatches.length > 0 && (
              <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5">
                <div className="live-dot" />
                <span className="text-[11px] font-bold text-red-400">{liveMatches.length}</span>
              </div>
            )}
            <button onClick={refresh} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
              <Icon name="RefreshCw" size={14} className="text-muted-foreground" />
            </button>
            <NotificationBell />
          </div>
        </div>

        {/* Sport filter */}
        <div className="flex gap-1.5 px-3 pb-2 overflow-x-auto">
          {SPORTS.map(s => (
            <button
              key={s.id}
              onClick={() => setSport(s.id)}
              className={`sport-pill ${sport === s.id ? 'active' : ''}`}
            >
              {s.id === 'all' ? <LogoAllSports size={14} /> : <SportLeagueLogo sport={s.id} size={14} />}
              {s.label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Tabs ── */}
      <div className="flex border-b border-border sticky top-[96px] z-20 bg-background">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold transition-colors relative ${tab === t.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon name={t.icon} size={13} />
            {t.label}
            {t.id === 'live' && liveMatches.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400" />
            )}
            {tab === t.id && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto pb-20">

        {/* LIVE */}
        {tab === 'live' && (
          <div className="fade-up">
            {liveFiltered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <div className="text-5xl">📡</div>
                <p className="font-semibold">Нет активных матчей</p>
                <p className="text-sm opacity-70">Следующие матчи — в расписании</p>
              </div>
            ) : (
              Object.entries(liveGroups).map(([lid, matches]) => (
                <LeagueSection key={lid} leagueId={lid} matches={matches} onMatchClick={setSelectedMatch} />
              ))
            )}
          </div>
        )}

        {/* SCHEDULE */}
        {tab === 'schedule' && (
          <div className="fade-up">
            {scheduleFiltered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <div className="text-5xl">📅</div>
                <p className="font-semibold">Нет предстоящих матчей</p>
              </div>
            ) : (
              Object.entries(scheduleGroups).map(([lid, matches]) => (
                <LeagueSection key={lid} leagueId={lid} matches={matches} onMatchClick={setSelectedMatch} />
              ))
            )}
          </div>
        )}

        {/* RESULTS */}
        {tab === 'results' && (
          <div className="fade-up">
            {resultsFiltered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <div className="text-5xl">🏆</div>
                <p className="font-semibold">Нет завершённых матчей</p>
              </div>
            ) : (
              Object.entries(resultsGroups).map(([lid, matches]) => (
                <LeagueSection key={lid} leagueId={lid} matches={matches} onMatchClick={setSelectedMatch} />
              ))
            )}
          </div>
        )}

        {/* FAVORITES */}
        {tab === 'favorites' && (
          <div className="fade-up">
            {/* Sport tabs inside favorites */}
            <div className="flex border-b border-border sticky top-0 z-10 bg-background">
              {(['football','hockey','basketball','volleyball'] as SportType[]).map(s => (
                <button
                  key={s}
                  onClick={() => setFavSport(s)}
                  className={`flex-1 flex items-center justify-center py-2.5 transition-colors relative ${favSport === s ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <SportLeagueLogo sport={s} size={18} />
                  {favSport === s && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-t-full" />}
                </button>
              ))}
            </div>

            {/* Team grid */}
            <div className="p-3">
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wider">
                {SPORT_CONFIG[favSport].label} · {SPORT_LEAGUES[favSport].find(l => l.tier === 'top' && l.country === 'Россия')?.shortName ?? ''}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ALL_TEAMS.filter(t => t.sport === favSport).map(team => {
                  const isFav = favTeamIds.includes(team.id);
                  const hasNotif = notifIds.includes(team.id);
                  return (
                    <div
                      key={team.id}
                      className={`rounded-xl border p-3 transition-all ${isFav ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <TeamLogo logo={team.logo} emoji={team.emoji} name={team.name} size="lg" />
                        <button onClick={() => toggleFav(team.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
                          <Icon name="Star" size={14} className={isFav ? 'text-primary' : 'text-muted-foreground'} style={isFav ? { fill: 'hsl(var(--primary))' } : {}} />
                        </button>
                      </div>
                      <p className="text-[13px] font-semibold leading-tight">{team.name}</p>
                      <p className="text-[11px] text-muted-foreground">{team.city}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {team.wins}В {team.draws !== undefined ? `${team.draws}Н ` : ''}{team.losses}П
                      </p>
                      {isFav && (
                        <button
                          onClick={() => toggleNotif(team.id)}
                          className={`mt-2 w-full text-[11px] py-1 rounded-lg flex items-center justify-center gap-1 transition-colors ${hasNotif ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'}`}
                        >
                          <Icon name={hasNotif ? 'BellRing' : 'Bell'} size={10} />
                          {hasNotif ? 'Уведомления вкл' : 'Включить уведомления'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fav matches */}
            {favMatches.length > 0 && (
              <div className="mt-1 border-t border-border">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Матчи избранных команд
                </div>
                {favMatches.map(m => <MatchRow key={m.id} match={m} onClick={() => setSelectedMatch(m)} />)}
              </div>
            )}

            {favTeamIds.length === 0 && (
              <div className="flex flex-col items-center py-10 text-muted-foreground gap-2 px-6 text-center">
                <Icon name="Star" size={36} className="opacity-20" />
                <p className="font-semibold">Выберите любимые команды</p>
                <p className="text-sm opacity-60">Нажмите ★ рядом с командой, чтобы следить за ней</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bottom-nav z-40">
        <div className="flex">
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors relative ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {active && <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-b-full" />}
                <Icon name={t.icon} size={18} />
                <span className="text-[10px] font-medium">{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
