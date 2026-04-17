export type SportType = 'football' | 'hockey' | 'basketball' | 'volleyball';
export type MatchStatus = 'live' | 'upcoming' | 'finished';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  sport: SportType;
  city: string;
  wins: number;
  losses: number;
  draws?: number;
}

export interface Match {
  id: string;
  sport: SportType;
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

export const SPORT_CONFIG: Record<SportType, { label: string; emoji: string; color: string; tagClass: string }> = {
  football: { label: 'Футбол', emoji: '⚽', color: 'hsl(var(--sport-football))', tagClass: 'sport-tag-football' },
  hockey: { label: 'Хоккей', emoji: '🏒', color: 'hsl(var(--sport-hockey))', tagClass: 'sport-tag-hockey' },
  basketball: { label: 'Баскетбол', emoji: '🏀', color: 'hsl(var(--sport-basketball))', tagClass: 'sport-tag-basketball' },
  volleyball: { label: 'Волейбол', emoji: '🏐', color: 'hsl(var(--sport-volleyball))', tagClass: 'sport-tag-volleyball' },
};

export const ALL_TEAMS: Team[] = [
  // Football
  { id: 'spartak', name: 'Спартак', shortName: 'СПА', emoji: '🔴', sport: 'football', city: 'Москва', wins: 18, losses: 6, draws: 6 },
  { id: 'cska-f', name: 'ЦСКА', shortName: 'ЦСК', emoji: '🟡', sport: 'football', city: 'Москва', wins: 20, losses: 4, draws: 6 },
  { id: 'zenit', name: 'Зенит', shortName: 'ЗЕН', emoji: '🔵', sport: 'football', city: 'СПб', wins: 22, losses: 4, draws: 4 },
  { id: 'lokomotiv', name: 'Локомотив', shortName: 'ЛОК', emoji: '🟢', sport: 'football', city: 'Москва', wins: 14, losses: 10, draws: 6 },
  { id: 'krasnodar', name: 'Краснодар', shortName: 'КРД', emoji: '🟤', sport: 'football', city: 'Краснодар', wins: 16, losses: 8, draws: 6 },
  { id: 'dynamo-f', name: 'Динамо', shortName: 'ДИН', emoji: '⚪', sport: 'football', city: 'Москва', wins: 12, losses: 12, draws: 6 },
  // Hockey
  { id: 'ska', name: 'СКА', shortName: 'СКА', emoji: '⚡', sport: 'hockey', city: 'СПб', wins: 34, losses: 12 },
  { id: 'cska-h', name: 'ЦСКА', shortName: 'ЦСК', emoji: '🔴', sport: 'hockey', city: 'Москва', wins: 36, losses: 10 },
  { id: 'ak-bars', name: 'Ак Барс', shortName: 'АКБ', emoji: '🐯', sport: 'hockey', city: 'Казань', wins: 30, losses: 16 },
  { id: 'metallurg', name: 'Металлург', shortName: 'МЕТ', emoji: '⚙️', sport: 'hockey', city: 'Магнитогорск', wins: 28, losses: 18 },
  { id: 'avangard', name: 'Авангард', shortName: 'АВА', emoji: '🦅', sport: 'hockey', city: 'Омск', wins: 25, losses: 21 },
  { id: 'dynamo-h', name: 'Динамо', shortName: 'ДИН', emoji: '🔵', sport: 'hockey', city: 'Москва', wins: 22, losses: 24 },
  // Basketball
  { id: 'cska-b', name: 'ЦСКА', shortName: 'ЦСК', emoji: '🏆', sport: 'basketball', city: 'Москва', wins: 28, losses: 4 },
  { id: 'zenit-b', name: 'Зенит', shortName: 'ЗЕН', emoji: '🔵', sport: 'basketball', city: 'СПб', wins: 20, losses: 12 },
  { id: 'unics', name: 'УНИКС', shortName: 'УНИ', emoji: '🟡', sport: 'basketball', city: 'Казань', wins: 18, losses: 14 },
  { id: 'lokomotiv-b', name: 'Локомотив-Кубань', shortName: 'ЛОК', emoji: '🔴', sport: 'basketball', city: 'Краснодар', wins: 16, losses: 16 },
  // Volleyball
  { id: 'zenit-v', name: 'Зенит-Казань', shortName: 'ЗЕН', emoji: '🏐', sport: 'volleyball', city: 'Казань', wins: 22, losses: 4 },
  { id: 'kuzbasss', name: 'Кузбасс', shortName: 'КУЗ', emoji: '⚫', sport: 'volleyball', city: 'Кемерово', wins: 18, losses: 8 },
  { id: 'belgorod', name: 'Белогорье', shortName: 'БЕЛ', emoji: '⚪', sport: 'volleyball', city: 'Белгород', wins: 16, losses: 10 },
  { id: 'lokomotiv-v', name: 'Локомотив', shortName: 'ЛОК', emoji: '🟢', sport: 'volleyball', city: 'Новосибирск', wins: 14, losses: 12 },
];

const getTeam = (id: string): Team => ALL_TEAMS.find(t => t.id === id)!;

export const LIVE_MATCHES: Match[] = [
  {
    id: 'l1', sport: 'football', league: 'РПЛ', venue: 'Лужники',
    homeTeam: getTeam('spartak'), awayTeam: getTeam('zenit'),
    homeScore: 2, awayScore: 1, status: 'live', minute: 67,
    date: '17.04.2026', time: '19:00',
    events: [
      { minute: 23, type: 'goal', team: 'home', player: 'Промес' },
      { minute: 45, type: 'goal', team: 'home', player: 'Соболев' },
      { minute: 58, type: 'goal', team: 'away', player: 'Клаудиньо' },
    ]
  },
  {
    id: 'l2', sport: 'hockey', league: 'КХЛ', venue: 'Лужники-Арена',
    homeTeam: getTeam('cska-h'), awayTeam: getTeam('ska'),
    homeScore: 3, awayScore: 2, status: 'live', period: '3 период 14:22',
    date: '17.04.2026', time: '20:00',
    events: [
      { minute: 8, type: 'puck', team: 'home', player: 'Капризов' },
      { minute: 19, type: 'puck', team: 'away', player: 'Гусев' },
      { minute: 28, type: 'puck', team: 'home', player: 'Никишин' },
      { minute: 36, type: 'puck', team: 'away', player: 'Марченко' },
      { minute: 52, type: 'puck', team: 'home', player: 'Капризов' },
    ]
  },
  {
    id: 'l3', sport: 'basketball', league: 'Единая Лига ВТБ', venue: 'ЦСКА Арена',
    homeTeam: getTeam('cska-b'), awayTeam: getTeam('unics'),
    homeScore: 78, awayScore: 71, status: 'live', period: '4 четв. 6:14',
    date: '17.04.2026', time: '18:30',
    events: []
  },
  {
    id: 'l4', sport: 'volleyball', league: 'Суперлига', venue: 'Дворец спорта',
    homeTeam: getTeam('zenit-v'), awayTeam: getTeam('kuzbasss'),
    homeScore: 2, awayScore: 1, status: 'live', period: '4 сет 18:14',
    date: '17.04.2026', time: '17:00',
    events: []
  },
];

export const UPCOMING_MATCHES: Match[] = [
  {
    id: 'u1', sport: 'football', league: 'РПЛ', venue: 'ВТБ Арена',
    homeTeam: getTeam('cska-f'), awayTeam: getTeam('lokomotiv'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '19.04.2026', time: '17:00',
    events: []
  },
  {
    id: 'u2', sport: 'hockey', league: 'КХЛ Плей-офф', venue: 'Татнефть Арена',
    homeTeam: getTeam('ak-bars'), awayTeam: getTeam('metallurg'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '18.04.2026', time: '19:30',
    events: []
  },
  {
    id: 'u3', sport: 'basketball', league: 'Единая Лига ВТБ', venue: 'Зенит Арена',
    homeTeam: getTeam('zenit-b'), awayTeam: getTeam('cska-b'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '20.04.2026', time: '20:00',
    events: []
  },
  {
    id: 'u4', sport: 'volleyball', league: 'Суперлига', venue: 'Дворец молодёжи',
    homeTeam: getTeam('belgorod'), awayTeam: getTeam('lokomotiv-v'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '21.04.2026', time: '15:00',
    events: []
  },
  {
    id: 'u5', sport: 'football', league: 'РПЛ', venue: 'Краснодар Стадион',
    homeTeam: getTeam('krasnodar'), awayTeam: getTeam('dynamo-f'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '22.04.2026', time: '19:00',
    events: []
  },
  {
    id: 'u6', sport: 'hockey', league: 'КХЛ Плей-офф', venue: 'Арена Омск',
    homeTeam: getTeam('avangard'), awayTeam: getTeam('dynamo-h'),
    homeScore: 0, awayScore: 0, status: 'upcoming',
    date: '22.04.2026', time: '17:00',
    events: []
  },
];

export const FINISHED_MATCHES: Match[] = [
  {
    id: 'f1', sport: 'football', league: 'РПЛ', venue: 'Газпром Арена',
    homeTeam: getTeam('zenit'), awayTeam: getTeam('krasnodar'),
    homeScore: 3, awayScore: 1, status: 'finished',
    date: '15.04.2026', time: '20:00',
    events: [
      { minute: 12, type: 'goal', team: 'home', player: 'Клаудиньо' },
      { minute: 34, type: 'goal', team: 'away', player: 'Олег Иванов' },
      { minute: 61, type: 'goal', team: 'home', player: 'Мостовой' },
      { minute: 88, type: 'goal', team: 'home', player: 'Сергеев' },
    ]
  },
  {
    id: 'f2', sport: 'hockey', league: 'КХЛ', venue: 'СКА Арена',
    homeTeam: getTeam('ska'), awayTeam: getTeam('ak-bars'),
    homeScore: 4, awayScore: 2, status: 'finished',
    date: '16.04.2026', time: '19:30',
    events: []
  },
  {
    id: 'f3', sport: 'basketball', league: 'Единая Лига ВТБ', venue: 'Баскет-холл',
    homeTeam: getTeam('unics'), awayTeam: getTeam('lokomotiv-b'),
    homeScore: 89, awayScore: 74, status: 'finished',
    date: '15.04.2026', time: '18:00',
    events: []
  },
  {
    id: 'f4', sport: 'volleyball', league: 'Суперлига', venue: 'Дворец спорта',
    homeTeam: getTeam('lokomotiv-v'), awayTeam: getTeam('belgorod'),
    homeScore: 3, awayScore: 2, status: 'finished',
    date: '14.04.2026', time: '16:00',
    events: []
  },
  {
    id: 'f5', sport: 'football', league: 'РПЛ', venue: 'Арена ЦСКА',
    homeTeam: getTeam('cska-f'), awayTeam: getTeam('spartak'),
    homeScore: 1, awayScore: 1, status: 'finished',
    date: '13.04.2026', time: '18:00',
    events: []
  },
  {
    id: 'f6', sport: 'hockey', league: 'КХЛ', venue: 'ЦСКА Арена',
    homeTeam: getTeam('cska-h'), awayTeam: getTeam('avangard'),
    homeScore: 5, awayScore: 1, status: 'finished',
    date: '12.04.2026', time: '20:30',
    events: []
  },
];

export const TEAM_STATS: Record<string, { topScorers: PlayerStat[]; teamStats: { label: string; value: string }[] }> = {
  football: {
    topScorers: [
      { name: 'Клаудиньо', position: 'ПЗ', games: 30, goals: 18, assists: 12, rating: 8.4 },
      { name: 'Капризов', position: 'НП', games: 28, goals: 15, assists: 8, rating: 8.1 },
      { name: 'Промес', position: 'ПЗ', games: 26, goals: 13, assists: 11, rating: 7.9 },
      { name: 'Соболев', position: 'НП', games: 29, goals: 12, assists: 4, rating: 7.6 },
    ],
    teamStats: [
      { label: 'Голов забито', value: '64' },
      { label: 'Голов пропущено', value: '31' },
      { label: 'Удары в створ', value: '187' },
      { label: 'Владение мячом', value: '57%' },
    ]
  },
  hockey: {
    topScorers: [
      { name: 'Капризов', position: 'ЛНП', games: 46, goals: 32, assists: 28, rating: 9.1 },
      { name: 'Гусев', position: 'ПЗ', games: 44, goals: 18, assists: 34, rating: 8.7 },
      { name: 'Никишин', position: 'ЗАЩ', games: 46, goals: 8, assists: 22, rating: 8.2 },
      { name: 'Марченко', position: 'ЦНП', games: 42, goals: 20, assists: 16, rating: 7.9 },
    ],
    teamStats: [
      { label: 'Шайб забито', value: '186' },
      { label: 'Шайб пропущено', value: '121' },
      { label: 'Броски в створ', value: '1340' },
      { label: '% реализации', value: '13.9%' },
    ]
  },
  basketball: {
    topScorers: [
      { name: 'Воронцевич', position: 'ТФ', games: 32, points: 18.4, rebounds: 7.2, assists: 3.1 },
      { name: 'Хайнс', position: 'ЦН', games: 30, points: 16.8, rebounds: 9.4, assists: 1.8 },
      { name: 'Де Коло', position: 'РЗ', games: 32, points: 15.9, assists: 6.7, rebounds: 2.3 },
      { name: 'Уикс', position: 'МГ', games: 28, points: 14.2, assists: 8.1, rebounds: 3.2 },
    ],
    teamStats: [
      { label: 'Очков в игре', value: '88.4' },
      { label: 'Подборов', value: '37.2' },
      { label: 'Передач', value: '21.5' },
      { label: '% бросков', value: '47.3%' },
    ]
  },
  volleyball: {
    topScorers: [
      { name: 'Михайлов', position: 'ДО', games: 26, points: 312, blocks: 28, aces: 18 },
      { name: 'Спиридонов', position: 'ДО', games: 24, points: 287, blocks: 19, aces: 22 },
      { name: 'Кобзарь', position: 'ПАС', games: 26, points: 48, aces: 31, assists: 824 },
      { name: 'Подлесных', position: 'ЦБ', games: 25, points: 198, blocks: 67, aces: 14 },
    ],
    teamStats: [
      { label: 'Очков атаки', value: '1847' },
      { label: 'Блоков', value: '312' },
      { label: 'Эйсов', value: '128' },
      { label: '% атаки', value: '51.4%' },
    ]
  },
};
