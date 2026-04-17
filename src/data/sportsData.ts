export type SportType = 'football' | 'hockey' | 'basketball' | 'volleyball';
export type MatchStatus = 'live' | 'upcoming' | 'finished';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  logo?: string;
  sport: SportType;
  city: string;
  wins: number;
  losses: number;
  draws?: number;
}

export interface Match {
  id: string;
  sport: SportType;
  leagueId: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  period?: string;
  date: string;
  time: string;
  league: string;
  venue: string;
  events?: MatchEvent[];
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'penalty' | 'card' | 'timeout' | 'puck';
  team: 'home' | 'away';
  player: string;
}

export interface PlayerStat {
  name: string;
  position: string;
  games: number;
  goals?: number;
  assists?: number;
  points?: number;
  rating?: number;
  minutes?: number;
  rebounds?: number;
  blocks?: number;
  aces?: number;
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  sport: SportType;
  country: string;
  flag: string;
  logo?: string;
  tier: 'top' | 'european';
}

const CDN = 'https://cdn.poehali.dev/projects/53ad149e-d188-410f-a242-754571d71c84/bucket/logos';

// Все лиги
export const LEAGUES: League[] = [
  // Российские
  { id: 'rpl',        name: 'Российская Премьер-Лига', shortName: 'РПЛ',           sport: 'football',   country: 'Россия',   flag: '🇷🇺', logo: `${CDN}/league_football.png`,   tier: 'top' },
  { id: 'khl',        name: 'КХЛ',                     shortName: 'КХЛ',           sport: 'hockey',     country: 'Россия',   flag: '🇷🇺', logo: `${CDN}/league_hockey.png`,     tier: 'top' },
  { id: 'vtb',        name: 'Единая Лига ВТБ',         shortName: 'Лига ВТБ',      sport: 'basketball', country: 'Россия',   flag: '🇷🇺', logo: `${CDN}/league_basketball.png`, tier: 'top' },
  { id: 'superliga',  name: 'Суперлига',               shortName: 'Суперлига',     sport: 'volleyball', country: 'Россия',   flag: '🇷🇺', logo: `${CDN}/league_volleyball.png`, tier: 'top' },
  // Топ европейский футбол
  { id: 'pl',         name: 'Английская Премьер-Лига', shortName: 'АПЛ',           sport: 'football',   country: 'Англия',   flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', logo: 'https://media.api-sports.io/football/leagues/39.png',  tier: 'top' },
  { id: 'laliga',     name: 'Ла Лига',                 shortName: 'Ла Лига',       sport: 'football',   country: 'Испания',  flag: '🇪🇸', logo: 'https://media.api-sports.io/football/leagues/140.png', tier: 'top' },
  { id: 'bundesliga', name: 'Бундеслига',              shortName: 'Бундеслига',    sport: 'football',   country: 'Германия', flag: '🇩🇪', logo: 'https://media.api-sports.io/football/leagues/78.png',  tier: 'top' },
  { id: 'seriea',     name: 'Серия А',                 shortName: 'Серия А',       sport: 'football',   country: 'Италия',   flag: '🇮🇹', logo: 'https://media.api-sports.io/football/leagues/135.png', tier: 'top' },
  { id: 'ligue1',     name: 'Лига 1',                  shortName: 'Лига 1',        sport: 'football',   country: 'Франция',  flag: '🇫🇷', logo: 'https://media.api-sports.io/football/leagues/61.png',  tier: 'top' },
  { id: 'ucl',        name: 'Лига Чемпионов',          shortName: 'ЛЧ',            sport: 'football',   country: 'Европа',   flag: '🇪🇺', logo: 'https://media.api-sports.io/football/leagues/2.png',   tier: 'european' },
  { id: 'uel',        name: 'Лига Европы',             shortName: 'ЛЕ',            sport: 'football',   country: 'Европа',   flag: '🇪🇺', logo: 'https://media.api-sports.io/football/leagues/3.png',   tier: 'european' },
  // Топ хоккей
  { id: 'nhl',        name: 'НХЛ',                     shortName: 'НХЛ',           sport: 'hockey',     country: 'США',      flag: '🇺🇸', logo: 'https://media.api-sports.io/hockey/leagues/57.png',    tier: 'top' },
  // Топ баскетбол
  { id: 'nba',        name: 'НБА',                     shortName: 'НБА',           sport: 'basketball', country: 'США',      flag: '🇺🇸', logo: 'https://media.api-sports.io/basketball/leagues/12.png', tier: 'top' },
  { id: 'euroleague', name: 'Евролига',                shortName: 'Евролига',      sport: 'basketball', country: 'Европа',   flag: '🇪🇺', logo: 'https://media.api-sports.io/basketball/leagues/120.png', tier: 'european' },
];

export const LEAGUE_MAP: Record<string, League> = Object.fromEntries(LEAGUES.map(l => [l.id, l]));

export const SPORT_CONFIG: Record<SportType, { label: string; emoji: string; color: string; tagClass: string }> = {
  football:   { label: 'Футбол',    emoji: '⚽', color: 'hsl(var(--sport-football))',   tagClass: 'sport-tag-football'   },
  hockey:     { label: 'Хоккей',    emoji: '🏒', color: 'hsl(var(--sport-hockey))',     tagClass: 'sport-tag-hockey'     },
  basketball: { label: 'Баскетбол', emoji: '🏀', color: 'hsl(var(--sport-basketball))', tagClass: 'sport-tag-basketball' },
  volleyball: { label: 'Волейбол',  emoji: '🏐', color: 'hsl(var(--sport-volleyball))', tagClass: 'sport-tag-volleyball' },
};

export const SPORT_LEAGUES: Record<SportType, League[]> = {
  football:   LEAGUES.filter(l => l.sport === 'football'),
  hockey:     LEAGUES.filter(l => l.sport === 'hockey'),
  basketball: LEAGUES.filter(l => l.sport === 'basketball'),
  volleyball: LEAGUES.filter(l => l.sport === 'volleyball'),
};

export const ALL_TEAMS: Team[] = [
  // Россия — Футбол
  { id: 'spartak',     name: 'Спартак',          shortName: 'СПА', emoji: '🔴', logo: `${CDN}/football_spartak.png`,   sport: 'football',   city: 'Москва',        wins: 18, losses: 6,  draws: 6 },
  { id: 'cska-f',      name: 'ЦСКА',             shortName: 'ЦСК', emoji: '🟡', logo: `${CDN}/football_cska.png`,      sport: 'football',   city: 'Москва',        wins: 20, losses: 4,  draws: 6 },
  { id: 'zenit',       name: 'Зенит',            shortName: 'ЗЕН', emoji: '🔵', logo: `${CDN}/football_zenit.png`,     sport: 'football',   city: 'СПб',           wins: 22, losses: 4,  draws: 4 },
  { id: 'lokomotiv',   name: 'Локомотив',        shortName: 'ЛОК', emoji: '🟢', logo: `${CDN}/football_lokomotiv.png`, sport: 'football',   city: 'Москва',        wins: 14, losses: 10, draws: 6 },
  { id: 'krasnodar',   name: 'Краснодар',        shortName: 'КРД', emoji: '🟤', logo: `${CDN}/football_krasnodar.png`, sport: 'football',   city: 'Краснодар',     wins: 16, losses: 8,  draws: 6 },
  { id: 'dynamo-f',    name: 'Динамо',           shortName: 'ДИН', emoji: '⚪', logo: `${CDN}/football_dynamo.png`,    sport: 'football',   city: 'Москва',        wins: 12, losses: 12, draws: 6 },
  // АПЛ
  { id: 'mancity',  name: 'Манчестер Сити', shortName: 'MCI', emoji: '🔵', sport: 'football', city: 'Манчестер', wins: 22, losses: 5, draws: 6 },
  { id: 'arsenal',  name: 'Арсенал',        shortName: 'ARS', emoji: '🔴', sport: 'football', city: 'Лондон',    wins: 21, losses: 5, draws: 7 },
  { id: 'liverpool',name: 'Ливерпуль',      shortName: 'LIV', emoji: '🔴', sport: 'football', city: 'Ливерпуль', wins: 23, losses: 4, draws: 6 },
  { id: 'chelsea',  name: 'Челси',          shortName: 'CHE', emoji: '🔵', sport: 'football', city: 'Лондон',    wins: 15, losses: 9, draws: 9 },
  { id: 'manutd',   name: 'Манчестер Юнайтед', shortName: 'MUN', emoji: '🔴', sport: 'football', city: 'Манчестер', wins: 12, losses: 12, draws: 9 },
  { id: 'tottenham',name: 'Тоттенхэм',      shortName: 'TOT', emoji: '⚪', sport: 'football', city: 'Лондон',    wins: 14, losses: 10, draws: 9 },
  // Ла Лига
  { id: 'realmadrid', name: 'Реал Мадрид',  shortName: 'RMA', emoji: '⚪', sport: 'football', city: 'Мадрид',    wins: 24, losses: 4, draws: 5 },
  { id: 'barcelona',  name: 'Барселона',    shortName: 'BAR', emoji: '🔴', sport: 'football', city: 'Барселона', wins: 22, losses: 5, draws: 6 },
  { id: 'atletico',   name: 'Атлетико',     shortName: 'ATM', emoji: '🔴', sport: 'football', city: 'Мадрид',    wins: 19, losses: 7, draws: 7 },
  // Бундеслига
  { id: 'bayernm',   name: 'Бавария',       shortName: 'BAY', emoji: '🔴', sport: 'football', city: 'Мюнхен',    wins: 23, losses: 4, draws: 6 },
  { id: 'dortmund',  name: 'Боруссия Д',    shortName: 'BVB', emoji: '🟡', sport: 'football', city: 'Дортмунд',  wins: 18, losses: 8, draws: 7 },
  // Серия А
  { id: 'inter',     name: 'Интер',         shortName: 'INT', emoji: '🔵', sport: 'football', city: 'Милан',     wins: 24, losses: 3, draws: 6 },
  { id: 'juventus',  name: 'Ювентус',       shortName: 'JUV', emoji: '⚫', sport: 'football', city: 'Турин',     wins: 20, losses: 5, draws: 8 },
  { id: 'acmilan',   name: 'Милан',         shortName: 'MIL', emoji: '🔴', sport: 'football', city: 'Милан',     wins: 17, losses: 8, draws: 8 },
  { id: 'napoli',    name: 'Наполи',        shortName: 'NAP', emoji: '🔵', sport: 'football', city: 'Неаполь',   wins: 19, losses: 7, draws: 7 },
  // Лига 1
  { id: 'psg',       name: 'ПСЖ',           shortName: 'PSG', emoji: '🔵', sport: 'football', city: 'Париж',     wins: 25, losses: 3, draws: 5 },
  { id: 'monaco',    name: 'Монако',        shortName: 'MON', emoji: '🔴', sport: 'football', city: 'Монако',    wins: 18, losses: 7, draws: 8 },
  // Хоккей
  { id: 'ska',         name: 'СКА',       shortName: 'СКА', emoji: '⚡', logo: `${CDN}/hockey_ska.png`,      sport: 'hockey', city: 'СПб',          wins: 34, losses: 12 },
  { id: 'cska-h',      name: 'ЦСКА',      shortName: 'ЦСК', emoji: '🔴', logo: `${CDN}/hockey_cska.png`,     sport: 'hockey', city: 'Москва',       wins: 36, losses: 10 },
  { id: 'ak-bars',     name: 'Ак Барс',   shortName: 'АКБ', emoji: '🐯', logo: `${CDN}/hockey_akbars.png`,   sport: 'hockey', city: 'Казань',       wins: 30, losses: 16 },
  { id: 'metallurg',   name: 'Металлург', shortName: 'МЕТ', emoji: '⚙️', logo: `${CDN}/hockey_metallurg.png`,sport: 'hockey', city: 'Магнитогорск', wins: 28, losses: 18 },
  { id: 'avangard',    name: 'Авангард',  shortName: 'АВА', emoji: '🦅', logo: `${CDN}/hockey_avangard.png`, sport: 'hockey', city: 'Омск',         wins: 25, losses: 21 },
  { id: 'dynamo-h',    name: 'Динамо',    shortName: 'ДИН', emoji: '🔵', logo: `${CDN}/hockey_dynamo.png`,   sport: 'hockey', city: 'Москва',       wins: 22, losses: 24 },
  // Баскетбол
  { id: 'cska-b',      name: 'ЦСКА',             shortName: 'ЦСК', emoji: '🏆', logo: `${CDN}/basketball_cska.png`,      sport: 'basketball', city: 'Москва',    wins: 28, losses: 4  },
  { id: 'zenit-b',     name: 'Зенит',            shortName: 'ЗЕН', emoji: '🔵', logo: `${CDN}/basketball_zenit.png`,     sport: 'basketball', city: 'СПб',       wins: 20, losses: 12 },
  { id: 'unics',       name: 'УНИКС',            shortName: 'УНИ', emoji: '🟡', logo: `${CDN}/basketball_unics.png`,     sport: 'basketball', city: 'Казань',    wins: 18, losses: 14 },
  { id: 'lokomotiv-b', name: 'Локомотив-Кубань', shortName: 'ЛОК', emoji: '🔴', logo: `${CDN}/basketball_lokomotiv.png`, sport: 'basketball', city: 'Краснодар', wins: 16, losses: 16 },
  // Волейбол
  { id: 'zenit-v',     name: 'Зенит-Казань', shortName: 'ЗЕН', emoji: '🏐', logo: `${CDN}/volleyball_zenit.png`,     sport: 'volleyball', city: 'Казань',      wins: 22, losses: 4  },
  { id: 'kuzbasss',    name: 'Кузбасс',      shortName: 'КУЗ', emoji: '⚫', logo: `${CDN}/volleyball_kuzbass.png`,   sport: 'volleyball', city: 'Кемерово',    wins: 18, losses: 8  },
  { id: 'belgorod',    name: 'Белогорье',    shortName: 'БЕЛ', emoji: '⚪', logo: `${CDN}/volleyball_belgorod.png`,  sport: 'volleyball', city: 'Белгород',    wins: 16, losses: 10 },
  { id: 'lokomotiv-v', name: 'Локомотив',    shortName: 'ЛОК', emoji: '🟢', logo: `${CDN}/volleyball_lokomotiv.png`,sport: 'volleyball', city: 'Новосибирск', wins: 14, losses: 12 },
];

const t = (id: string): Team => ALL_TEAMS.find(x => x.id === id)!;

export const DEMO_MATCHES: Match[] = [
  // ===== LIVE =====
  { id: 'l1', sport: 'football', leagueId: 'pl', league: 'АПЛ', venue: 'Энфилд',
    homeTeam: t('liverpool'), awayTeam: t('arsenal'),
    homeScore: 2, awayScore: 1, status: 'live', minute: 71,
    date: '18.04.2026', time: '17:00', events: [
      { minute: 14, type: 'goal', team: 'home', player: 'Салах' },
      { minute: 38, type: 'goal', team: 'away', player: 'Сака' },
      { minute: 62, type: 'goal', team: 'home', player: 'Нуньес' },
    ]},
  { id: 'l2', sport: 'football', leagueId: 'laliga', league: 'Ла Лига', venue: 'Бернабеу',
    homeTeam: t('realmadrid'), awayTeam: t('barcelona'),
    homeScore: 1, awayScore: 1, status: 'live', minute: 58,
    date: '18.04.2026', time: '22:00', events: [
      { minute: 22, type: 'goal', team: 'home', player: 'Мбаппе' },
      { minute: 45, type: 'goal', team: 'away', player: 'Ямаль' },
    ]},
  { id: 'l3', sport: 'football', leagueId: 'rpl', league: 'РПЛ', venue: 'Лужники',
    homeTeam: t('spartak'), awayTeam: t('zenit'),
    homeScore: 2, awayScore: 0, status: 'live', minute: 83,
    date: '18.04.2026', time: '19:00', events: [
      { minute: 34, type: 'goal', team: 'home', player: 'Промес' },
      { minute: 67, type: 'goal', team: 'home', player: 'Соболев' },
    ]},
  { id: 'l4', sport: 'hockey', leagueId: 'khl', league: 'КХЛ', venue: 'ЦСКА Арена',
    homeTeam: t('cska-h'), awayTeam: t('ska'),
    homeScore: 3, awayScore: 2, status: 'live', period: '3 пер • 14:22',
    date: '18.04.2026', time: '19:30', events: []},
  { id: 'l5', sport: 'basketball', leagueId: 'vtb', league: 'Лига ВТБ', venue: 'ЦСКА Арена',
    homeTeam: t('cska-b'), awayTeam: t('unics'),
    homeScore: 81, awayScore: 74, status: 'live', period: '4 четв • 5:12',
    date: '18.04.2026', time: '18:30', events: []},
  { id: 'l6', sport: 'football', leagueId: 'bundesliga', league: 'Бундеслига', venue: 'Альянц Арена',
    homeTeam: t('bayernm'), awayTeam: t('dortmund'),
    homeScore: 2, awayScore: 2, status: 'live', minute: 45,
    date: '18.04.2026', time: '21:30', events: []},

  // ===== UPCOMING =====
  { id: 'u1', sport: 'football', leagueId: 'ucl', league: 'Лига Чемпионов', venue: 'Ноу Камп',
    homeTeam: t('barcelona'), awayTeam: t('inter'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '20.04.2026', time: '22:00', events: []},
  { id: 'u2', sport: 'football', leagueId: 'pl', league: 'АПЛ', venue: 'Этихад',
    homeTeam: t('mancity'), awayTeam: t('chelsea'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '20.04.2026', time: '17:00', events: []},
  { id: 'u3', sport: 'football', leagueId: 'seriea', league: 'Серия А', venue: 'Сан-Сиро',
    homeTeam: t('acmilan'), awayTeam: t('juventus'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '19.04.2026', time: '21:45', events: []},
  { id: 'u4', sport: 'football', leagueId: 'rpl', league: 'РПЛ', venue: 'ВТБ Арена',
    homeTeam: t('cska-f'), awayTeam: t('lokomotiv'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '19.04.2026', time: '17:00', events: []},
  { id: 'u5', sport: 'hockey', leagueId: 'khl', league: 'КХЛ', venue: 'Татнефть Арена',
    homeTeam: t('ak-bars'), awayTeam: t('metallurg'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '19.04.2026', time: '17:00', events: []},
  { id: 'u6', sport: 'football', leagueId: 'laliga', league: 'Ла Лига', venue: 'Метрополитано',
    homeTeam: t('atletico'), awayTeam: t('realmadrid'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '21.04.2026', time: '22:00', events: []},
  { id: 'u7', sport: 'basketball', leagueId: 'euroleague', league: 'Евролига', venue: 'ЦСКА Арена',
    homeTeam: t('cska-b'), awayTeam: t('barcelona'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '22.04.2026', time: '20:00', events: []},
  { id: 'u8', sport: 'volleyball', leagueId: 'superliga', league: 'Суперлига', venue: 'Зенит-Арена',
    homeTeam: t('zenit-v'), awayTeam: t('kuzbasss'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '21.04.2026', time: '15:00', events: []},

  // ===== FINISHED =====
  { id: 'f1', sport: 'football', leagueId: 'pl', league: 'АПЛ', venue: 'Стэмфорд Бридж',
    homeTeam: t('chelsea'), awayTeam: t('tottenham'),
    homeScore: 2, awayScore: 0, status: 'finished',
    date: '17.04.2026', time: '20:00', events: []},
  { id: 'f2', sport: 'football', leagueId: 'laliga', league: 'Ла Лига', venue: 'Камп Ноу',
    homeTeam: t('barcelona'), awayTeam: t('atletico'),
    homeScore: 3, awayScore: 1, status: 'finished',
    date: '16.04.2026', time: '22:00', events: []},
  { id: 'f3', sport: 'football', leagueId: 'rpl', league: 'РПЛ', venue: 'Газпром Арена',
    homeTeam: t('zenit'), awayTeam: t('krasnodar'),
    homeScore: 2, awayScore: 2, status: 'finished',
    date: '15.04.2026', time: '19:00', events: []},
  { id: 'f4', sport: 'hockey', leagueId: 'khl', league: 'КХЛ', venue: 'СКА Арена',
    homeTeam: t('ska'), awayTeam: t('ak-bars'),
    homeScore: 4, awayScore: 2, status: 'finished',
    date: '16.04.2026', time: '19:30', events: []},
  { id: 'f5', sport: 'football', leagueId: 'bundesliga', league: 'Бундеслига', venue: 'Сигнал Идуна',
    homeTeam: t('dortmund'), awayTeam: t('bayernm'),
    homeScore: 1, awayScore: 3, status: 'finished',
    date: '15.04.2026', time: '21:30', events: []},
  { id: 'f6', sport: 'football', leagueId: 'ucl', league: 'Лига Чемпионов', venue: 'Бернабеу',
    homeTeam: t('realmadrid'), awayTeam: t('acmilan'),
    homeScore: 3, awayScore: 0, status: 'finished',
    date: '15.04.2026', time: '22:00', events: []},
  { id: 'f7', sport: 'football', leagueId: 'seriea', league: 'Серия А', venue: 'Меацца',
    homeTeam: t('inter'), awayTeam: t('napoli'),
    homeScore: 2, awayScore: 1, status: 'finished',
    date: '14.04.2026', time: '21:45', events: []},
  { id: 'f8', sport: 'basketball', leagueId: 'vtb', league: 'Лига ВТБ', venue: 'Баскет-холл',
    homeTeam: t('unics'), awayTeam: t('zenit-b'),
    homeScore: 89, awayScore: 74, status: 'finished',
    date: '14.04.2026', time: '18:00', events: []},
];

export const LIVE_MATCHES  = DEMO_MATCHES.filter(m => m.status === 'live');
export const UPCOMING_MATCHES = DEMO_MATCHES.filter(m => m.status === 'upcoming');
export const FINISHED_MATCHES = DEMO_MATCHES.filter(m => m.status === 'finished');

export const TEAM_STATS: Record<string, { topScorers: PlayerStat[]; teamStats: { label: string; value: string }[] }> = {
  football: {
    topScorers: [
      { name: 'Мбаппе',  position: 'НП', games: 30, goals: 28, assists: 10, rating: 9.1 },
      { name: 'Салах',   position: 'ПЗ', games: 31, goals: 24, assists: 14, rating: 8.9 },
      { name: 'Ямаль',   position: 'ПЗ', games: 29, goals: 18, assists: 16, rating: 8.7 },
      { name: 'Клаудиньо',position: 'ПЗ', games: 28, goals: 16, assists: 11, rating: 8.2 },
    ],
    teamStats: [{ label: 'Голов в туре', value: '2.7' }, { label: 'Угловых', value: '5.4' }, { label: 'Владение', value: '58%' }, { label: 'Удары', value: '14.2' }],
  },
  hockey: {
    topScorers: [
      { name: 'Капризов',  position: 'ЛНП', games: 46, goals: 32, assists: 28, rating: 9.1 },
      { name: 'Гусев',     position: 'ПЗ',  games: 44, goals: 18, assists: 34, rating: 8.7 },
      { name: 'Никишин',   position: 'ЗАЩ', games: 46, goals: 8,  assists: 22, rating: 8.2 },
      { name: 'Марченко',  position: 'ЦНП', games: 42, goals: 20, assists: 16, rating: 7.9 },
    ],
    teamStats: [{ label: 'Шайб за игру', value: '3.8' }, { label: 'Броски', value: '29.1' }, { label: '% реализации', value: '13.9%' }, { label: 'ПП голов', value: '24%' }],
  },
  basketball: {
    topScorers: [
      { name: 'Де Коло', position: 'РЗ', games: 32, points: 18.4, assists: 6.7, rebounds: 2.3 },
      { name: 'Хайнс',   position: 'ЦН', games: 30, points: 16.8, rebounds: 9.4, assists: 1.8 },
      { name: 'Уикс',    position: 'МГ', games: 28, points: 14.2, assists: 8.1, rebounds: 3.2 },
      { name: 'Шенгелия',position: 'ЛФ', games: 31, points: 15.1, assists: 3.2, rebounds: 5.1 },
    ],
    teamStats: [{ label: 'Очков за игру', value: '88.4' }, { label: 'Подборов', value: '37.2' }, { label: 'Передач', value: '21.5' }, { label: '% бросков', value: '47.3%' }],
  },
  volleyball: {
    topScorers: [
      { name: 'Михайлов',  position: 'ДО',  games: 26, points: 312, blocks: 28, aces: 18 },
      { name: 'Спиридонов',position: 'ДО',  games: 24, points: 287, blocks: 19, aces: 22 },
      { name: 'Кобзарь',   position: 'ПАС', games: 26, points: 48,  aces: 31, assists: 824 },
      { name: 'Подлесных', position: 'ЦБ',  games: 25, points: 198, blocks: 67, aces: 14 },
    ],
    teamStats: [{ label: 'Очков атаки', value: '1847' }, { label: 'Блоков', value: '312' }, { label: 'Эйсов', value: '128' }, { label: '% атаки', value: '51.4%' }],
  },
};
