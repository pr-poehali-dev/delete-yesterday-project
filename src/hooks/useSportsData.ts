import { useState, useEffect, useCallback } from 'react';
import { Match, SportType, LIVE_MATCHES, UPCOMING_MATCHES, FINISHED_MATCHES } from '@/data/sportsData';

const API_URL = 'https://functions.poehali.dev/6f1d15be-b247-4e59-a9b1-281f24dcb669';

const SPORT_EMOJIS: Record<string, string> = {
  football: '⚽', hockey: '🏒', basketball: '🏀', volleyball: '🏐'
};

// Convert TheSportsDB normalized match to our frontend Match format
function apiMatchToMatch(m: ApiMatch): Match {
  return {
    id: m.id,
    sport: m.sport as SportType,
    league: m.league,
    venue: m.venue || '',
    homeTeam: {
      id: m.homeTeam.id,
      name: m.homeTeam.name,
      shortName: m.homeTeam.name.slice(0, 3).toUpperCase(),
      emoji: SPORT_EMOJIS[m.sport] || '🏆',
      logo: m.homeTeam.logo || undefined,
      sport: m.sport as SportType,
      city: '',
      wins: 0,
      losses: 0,
    },
    awayTeam: {
      id: m.awayTeam.id,
      name: m.awayTeam.name,
      shortName: m.awayTeam.name.slice(0, 3).toUpperCase(),
      emoji: SPORT_EMOJIS[m.sport] || '🏆',
      logo: m.awayTeam.logo || undefined,
      sport: m.sport as SportType,
      city: '',
      wins: 0,
      losses: 0,
    },
    homeScore: m.homeScore,
    awayScore: m.awayScore,
    status: m.status as 'live' | 'upcoming' | 'finished',
    minute: m.minute ?? undefined,
    period: m.period ?? undefined,
    // Backend already formats date as DD.MM.YYYY
    date: m.date || '',
    time: m.time || '',
    events: [],
  };
}

interface ApiMatch {
  id: string;
  sport: string;
  league: string;
  venue: string;
  homeTeam: { id: string; name: string; logo: string };
  awayTeam: { id: string; name: string; logo: string };
  homeScore: number;
  awayScore: number;
  status: string;
  minute?: number | null;
  period?: string | null;
  date: string;
  time: string;
}

interface SportsDataState {
  liveMatches: Match[];
  upcomingMatches: Match[];
  finishedMatches: Match[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
  refresh: () => void;
}

async function fetchMatches(type: string, sport = 'all'): Promise<Match[]> {
  const url = `${API_URL}?type=${type}&sport=${sport}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return (data.matches || []).map(apiMatchToMatch);
}

export function useSportsData(): SportsDataState {
  const [liveMatches, setLiveMatches] = useState<Match[]>(LIVE_MATCHES);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>(UPCOMING_MATCHES);
  const [finishedMatches, setFinishedMatches] = useState<Match[]>(FINISHED_MATCHES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [live, upcoming, finished] = await Promise.all([
        fetchMatches('live'),
        fetchMatches('upcoming'),
        fetchMatches('finished'),
      ]);
      setLiveMatches(live.length > 0 ? live : LIVE_MATCHES);
      setUpcomingMatches(upcoming.length > 0 ? upcoming : UPCOMING_MATCHES);
      setFinishedMatches(finished.length > 0 ? finished : FINISHED_MATCHES);
      setUsingFallback(live.length === 0 && upcoming.length === 0 && finished.length === 0);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setUsingFallback(true);
      // keep demo data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Refresh live every 60s
    const interval = setInterval(() => {
      fetchMatches('live').then(live => {
        if (live.length > 0) setLiveMatches(live);
      }).catch(() => {});
    }, 60000);
    return () => clearInterval(interval);
  }, [load]);

  return { liveMatches, upcomingMatches, finishedMatches, loading, error, usingFallback, refresh: load };
}