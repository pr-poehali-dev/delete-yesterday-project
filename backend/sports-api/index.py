import os
import json
import urllib.request
import urllib.error
from datetime import datetime, timedelta

API_KEY = os.environ.get('API_SPORTS_KEY', '')
BASE_HEADERS = {
    'x-apisports-key': API_KEY,
    'Content-Type': 'application/json',
}

# Russian league IDs
LEAGUE_IDS = {
    'football': 235,      # Russian Premier League
    'hockey': 57,         # KHL
    'basketball': 270,    # VTB United League
    'volleyball': 24,     # Russian Superliga (Volleyball)
}

LEAGUE_NAMES = {
    235: 'РПЛ',
    57: 'КХЛ',
    270: 'Единая Лига ВТБ',
    24: 'Суперлига',
}

SPORT_ENDPOINTS = {
    'football': 'https://v3.football.api-sports.io',
    'hockey': 'https://v1.hockey.api-sports.io',
    'basketball': 'https://v1.basketball.api-sports.io',
    'volleyball': 'https://v1.volleyball.api-sports.io',
}


def api_request(sport: str, path: str) -> dict:
    url = f"{SPORT_ENDPOINTS[sport]}{path}"
    req = urllib.request.Request(url, headers=BASE_HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return {'error': str(e), 'status': e.code}
    except Exception as e:
        return {'error': str(e)}


def normalize_match(sport: str, raw: dict) -> dict:
    """Normalize match data to unified format"""
    if sport == 'football':
        fixture = raw.get('fixture', {})
        teams = raw.get('teams', {})
        goals = raw.get('goals', {})
        status = fixture.get('status', {})
        elapsed = status.get('elapsed')
        short = status.get('short', '')
        if short in ('1H', '2H', 'HT', 'ET', 'BT', 'P'):
            match_status = 'live'
        elif short in ('FT', 'AET', 'PEN'):
            match_status = 'finished'
        else:
            match_status = 'upcoming'
        return {
            'id': str(fixture.get('id', '')),
            'sport': 'football',
            'league': LEAGUE_NAMES.get(raw.get('league', {}).get('id'), 'РПЛ'),
            'venue': fixture.get('venue', {}).get('name', ''),
            'homeTeam': {
                'id': str(teams.get('home', {}).get('id', '')),
                'name': teams.get('home', {}).get('name', ''),
                'logo': teams.get('home', {}).get('logo', ''),
            },
            'awayTeam': {
                'id': str(teams.get('away', {}).get('id', '')),
                'name': teams.get('away', {}).get('name', ''),
                'logo': teams.get('away', {}).get('logo', ''),
            },
            'homeScore': goals.get('home') or 0,
            'awayScore': goals.get('away') or 0,
            'status': match_status,
            'minute': elapsed,
            'date': fixture.get('date', '')[:10],
            'time': fixture.get('date', '')[11:16] if fixture.get('date') else '',
        }
    elif sport == 'hockey':
        game = raw.get('game', raw)
        teams = raw.get('teams', {})
        scores = raw.get('scores', {})
        status = raw.get('status', {})
        short = status.get('short', '') if isinstance(status, dict) else str(status)
        if short in ('LIVE', 'HT', 'OT', 'SO'):
            match_status = 'live'
        elif short in ('FT', 'AOT', 'APN'):
            match_status = 'finished'
        else:
            match_status = 'upcoming'
        return {
            'id': str(raw.get('id', '')),
            'sport': 'hockey',
            'league': LEAGUE_NAMES.get(raw.get('league', {}).get('id'), 'КХЛ'),
            'venue': raw.get('arena', {}).get('name', '') if isinstance(raw.get('arena'), dict) else '',
            'homeTeam': {
                'id': str(teams.get('home', {}).get('id', '')),
                'name': teams.get('home', {}).get('name', ''),
                'logo': teams.get('home', {}).get('logo', ''),
            },
            'awayTeam': {
                'id': str(teams.get('away', {}).get('id', '')),
                'name': teams.get('away', {}).get('name', ''),
                'logo': teams.get('away', {}).get('logo', ''),
            },
            'homeScore': scores.get('home') or 0,
            'awayScore': scores.get('away') or 0,
            'status': match_status,
            'period': status.get('long', '') if isinstance(status, dict) else '',
            'date': raw.get('date', '')[:10] if raw.get('date') else '',
            'time': raw.get('time', '') or (raw.get('date', '')[11:16] if raw.get('date') else ''),
        }
    elif sport == 'basketball':
        game = raw
        teams = game.get('teams', {})
        scores = game.get('scores', {})
        status = game.get('status', {})
        short = status.get('short', '') if isinstance(status, dict) else ''
        if short in ('LIVE', 'HT', 'OT'):
            match_status = 'live'
        elif short in ('FT', 'AOT'):
            match_status = 'finished'
        else:
            match_status = 'upcoming'
        home_score = scores.get('home', {})
        away_score = scores.get('away', {})
        return {
            'id': str(game.get('id', '')),
            'sport': 'basketball',
            'league': LEAGUE_NAMES.get(game.get('league', {}).get('id'), 'Единая Лига ВТБ'),
            'venue': game.get('arena', '') or '',
            'homeTeam': {
                'id': str(teams.get('home', {}).get('id', '')),
                'name': teams.get('home', {}).get('name', ''),
                'logo': teams.get('home', {}).get('logo', ''),
            },
            'awayTeam': {
                'id': str(teams.get('away', {}).get('id', '')),
                'name': teams.get('away', {}).get('name', ''),
                'logo': teams.get('away', {}).get('logo', ''),
            },
            'homeScore': home_score.get('total') or 0,
            'awayScore': away_score.get('total') or 0,
            'status': match_status,
            'period': status.get('long', '') if isinstance(status, dict) else '',
            'date': game.get('date', '')[:10] if game.get('date') else '',
            'time': game.get('time', '') or (game.get('date', '')[11:16] if game.get('date') else ''),
        }
    elif sport == 'volleyball':
        game = raw
        teams = game.get('teams', {})
        scores = game.get('scores', {})
        status = game.get('status', {})
        short = status.get('short', '') if isinstance(status, dict) else ''
        if short in ('LIVE', 'HT'):
            match_status = 'live'
        elif short in ('FT',):
            match_status = 'finished'
        else:
            match_status = 'upcoming'
        return {
            'id': str(game.get('id', '')),
            'sport': 'volleyball',
            'league': LEAGUE_NAMES.get(game.get('league', {}).get('id'), 'Суперлига'),
            'venue': game.get('arena', '') or '',
            'homeTeam': {
                'id': str(teams.get('home', {}).get('id', '')),
                'name': teams.get('home', {}).get('name', ''),
                'logo': teams.get('home', {}).get('logo', ''),
            },
            'awayTeam': {
                'id': str(teams.get('away', {}).get('id', '')),
                'name': teams.get('away', {}).get('name', ''),
                'logo': teams.get('away', {}).get('logo', ''),
            },
            'homeScore': scores.get('home') or 0,
            'awayScore': scores.get('away') or 0,
            'status': match_status,
            'period': status.get('long', '') if isinstance(status, dict) else '',
            'date': game.get('date', '')[:10] if game.get('date') else '',
            'time': game.get('time', '') or '',
        }
    return raw


def get_matches_for_sport(sport: str, date_str: str) -> list:
    league_id = LEAGUE_IDS[sport]
    season = datetime.now().year

    if sport == 'football':
        path = f"/fixtures?league={league_id}&season={season}&date={date_str}"
    elif sport == 'hockey':
        path = f"/games?league={league_id}&season={season}&date={date_str}"
    elif sport == 'basketball':
        path = f"/games?league={league_id}&season={season}-{season+1}&date={date_str}"
    elif sport == 'volleyball':
        path = f"/games?league={league_id}&season={season}-{season+1}&date={date_str}"
    else:
        return []

    data = api_request(sport, path)
    response = data.get('response', [])
    return [normalize_match(sport, m) for m in response]


def get_live_matches() -> list:
    """Get all live matches across all sports"""
    result = []
    for sport in LEAGUE_IDS:
        league_id = LEAGUE_IDS[sport]
        if sport == 'football':
            path = f"/fixtures?live=all&league={league_id}"
        else:
            path = f"/games?live=all&league={league_id}"
        data = api_request(sport, path)
        response = data.get('response', [])
        result.extend([normalize_match(sport, m) for m in response])
    return result


def handler(event: dict, context) -> dict:
    """
    Получение матчей российских чемпионатов из API-Sports.
    Поддерживает: live, upcoming (расписание), finished (история).
    Query params: type (live|upcoming|finished|all), sport (football|hockey|basketball|volleyball|all), date
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    if not API_KEY:
        return {
            'statusCode': 503,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API_SPORTS_KEY не настроен', 'matches': []})
        }

    params = event.get('queryStringParameters') or {}
    match_type = params.get('type', 'all')
    sport_filter = params.get('sport', 'all')

    today = datetime.now()
    sports_to_fetch = list(LEAGUE_IDS.keys()) if sport_filter == 'all' else [sport_filter]

    try:
        if match_type == 'live':
            matches = get_live_matches()
            if sport_filter != 'all':
                matches = [m for m in matches if m['sport'] == sport_filter]

        elif match_type == 'upcoming':
            matches = []
            for d in range(1, 8):
                date_str = (today + timedelta(days=d)).strftime('%Y-%m-%d')
                for sport in sports_to_fetch:
                    day_matches = get_matches_for_sport(sport, date_str)
                    matches.extend([m for m in day_matches if m['status'] == 'upcoming'])

        elif match_type == 'finished':
            matches = []
            for d in range(0, 7):
                date_str = (today - timedelta(days=d)).strftime('%Y-%m-%d')
                for sport in sports_to_fetch:
                    day_matches = get_matches_for_sport(sport, date_str)
                    matches.extend([m for m in day_matches if m['status'] == 'finished'])

        else:  # all — today
            matches = []
            date_str = today.strftime('%Y-%m-%d')
            for sport in sports_to_fetch:
                matches.extend(get_matches_for_sport(sport, date_str))
            # add live from all sports
            live = get_live_matches()
            live_ids = {m['id'] for m in matches}
            for m in live:
                if m['id'] not in live_ids:
                    matches.append(m)

        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'matches': matches, 'total': len(matches)})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e), 'matches': []})
        }
