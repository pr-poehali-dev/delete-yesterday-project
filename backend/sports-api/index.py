import json
import urllib.request
import urllib.error
from datetime import datetime, timedelta

# TheSportsDB — бесплатный публичный API, ключ не нужен
BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3'

# Russian league IDs in TheSportsDB
LEAGUES = [
    {'id': '4355', 'sport': 'football',   'name': 'РПЛ'},
    {'id': '4920', 'sport': 'hockey',     'name': 'КХЛ'},
    {'id': '4476', 'sport': 'basketball', 'name': 'Единая Лига ВТБ'},
    {'id': '4545', 'sport': 'volleyball', 'name': 'Суперлига'},
]

LEAGUE_BY_ID = {l['id']: l for l in LEAGUES}

SPORT_EMOJIS = {
    'football': '⚽',
    'hockey': '🏒',
    'basketball': '🏀',
    'volleyball': '🏐',
}


def api_get(path: str) -> dict:
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, headers={'User-Agent': 'SportLiveApp/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        return {'error': f'HTTP {e.code}'}
    except Exception as e:
        return {'error': str(e)}


def normalize_event(raw: dict, league: dict) -> dict:
    """Convert TheSportsDB event to unified match format"""
    # Date & time
    date_str = raw.get('dateEvent', '')
    time_str = raw.get('strTime', '') or ''
    if time_str and len(time_str) >= 5:
        time_str = time_str[:5]

    # Scores
    home_score_raw = raw.get('intHomeScore')
    away_score_raw = raw.get('intAwayScore')
    home_score = int(home_score_raw) if home_score_raw not in (None, '', 'null') else 0
    away_score = int(away_score_raw) if away_score_raw not in (None, '', 'null') else 0

    # Status
    status_raw = raw.get('strStatus', '') or ''
    progress = raw.get('strProgress', '') or ''

    if status_raw.lower() in ('live', 'in progress', '1h', '2h', 'ht', 'et', 'pen', 'progress'):
        status = 'live'
    elif home_score_raw not in (None, '', 'null') and status_raw.lower() not in ('', 'ns', 'not started'):
        status = 'finished'
    elif status_raw.lower() in ('ft', 'aet', 'pen', 'finished', 'complete'):
        status = 'finished'
    else:
        status = 'upcoming'

    # Format display date: YYYY-MM-DD → DD.MM.YYYY
    display_date = date_str
    if date_str and len(date_str) == 10:
        parts = date_str.split('-')
        if len(parts) == 3:
            display_date = f"{parts[2]}.{parts[1]}.{parts[0]}"

    home_logo = raw.get('strHomeTeamBadge', '') or ''
    away_logo = raw.get('strAwayTeamBadge', '') or ''

    return {
        'id': str(raw.get('idEvent', '')),
        'sport': league['sport'],
        'league': league['name'],
        'venue': raw.get('strVenue', '') or '',
        'homeTeam': {
            'id': str(raw.get('idHomeTeam', '')),
            'name': raw.get('strHomeTeam', ''),
            'logo': home_logo,
        },
        'awayTeam': {
            'id': str(raw.get('idAwayTeam', '')),
            'name': raw.get('strAwayTeam', ''),
            'logo': away_logo,
        },
        'homeScore': home_score,
        'awayScore': away_score,
        'status': status,
        'minute': progress if progress else None,
        'period': progress if progress else None,
        'date': display_date,
        'rawDate': date_str,
        'time': time_str,
    }


def get_past_events(league: dict, days_back: int = 7) -> list:
    """Fetch last N days of results for a league"""
    data = api_get(f"/eventspastleague.php?id={league['id']}")
    events = data.get('events') or []
    cutoff = (datetime.now() - timedelta(days=days_back)).strftime('%Y-%m-%d')
    result = []
    for e in events:
        date = e.get('dateEvent', '')
        if date >= cutoff:
            result.append(normalize_event(e, league))
    return result


def get_next_events(league: dict) -> list:
    """Fetch upcoming events for a league"""
    data = api_get(f"/eventsnextleague.php?id={league['id']}")
    events = data.get('events') or []
    return [normalize_event(e, league) for e in events]


def get_live_events(league: dict) -> list:
    """Try to fetch live events (requires Patreon key for real livescore)"""
    data = api_get(f"/eventslive.php?l={league['id']}")
    events = data.get('events') or data.get('livescore') or []
    return [normalize_event(e, league) for e in events if e]


def handler(event: dict, context) -> dict:
    """
    Получение матчей российских чемпионатов через TheSportsDB.
    РПЛ, КХЛ, Единая Лига ВТБ, Суперлига.
    Query: type (live|upcoming|finished|all), sport (football|hockey|basketball|volleyball|all)
    Прокси изображений: ?img=<url> — возвращает картинку через сервер (обход CORS/hotlink)
    """
    CORS_HEADERS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS_HEADERS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    params = event.get('queryStringParameters') or {}

    # Image proxy — fetch image from thesportsdb and return as base64
    img_url = params.get('img', '')
    if img_url:
        allowed_hosts = ('www.thesportsdb.com', 'thesportsdb.com')
        from urllib.parse import urlparse
        parsed = urlparse(img_url)
        if parsed.hostname not in allowed_hosts:
            return {'statusCode': 403, 'headers': CORS_HEADERS, 'body': 'Forbidden'}
        try:
            import base64
            req = urllib.request.Request(img_url, headers={'User-Agent': 'SportLiveApp/1.0', 'Referer': 'https://www.thesportsdb.com/'})
            with urllib.request.urlopen(req, timeout=8) as resp:
                content_type = resp.headers.get('Content-Type', 'image/png')
                img_data = base64.b64encode(resp.read()).decode()
            return {
                'statusCode': 200,
                'headers': {**CORS_HEADERS, 'Content-Type': content_type, 'Cache-Control': 'public, max-age=86400'},
                'body': img_data,
                'isBase64Encoded': True,
            }
        except Exception as e:
            return {'statusCode': 502, 'headers': CORS_HEADERS, 'body': str(e)}

    match_type = params.get('type', 'all')
    sport_filter = params.get('sport', 'all')

    leagues = LEAGUES if sport_filter == 'all' else [l for l in LEAGUES if l['sport'] == sport_filter]

    try:
        matches = []

        if match_type == 'live':
            for league in leagues:
                matches.extend(get_live_events(league))
            # fallback: today's matches from past if live is empty
            if not matches:
                today = datetime.now().strftime('%Y-%m-%d')
                for league in leagues:
                    past = get_past_events(league, days_back=1)
                    matches.extend([m for m in past if m['rawDate'] == today])

        elif match_type == 'upcoming':
            for league in leagues:
                matches.extend(get_next_events(league))

        elif match_type == 'finished':
            for league in leagues:
                matches.extend(get_past_events(league, days_back=14))

        else:  # all
            for league in leagues:
                past = get_past_events(league, days_back=3)
                upcoming = get_next_events(league)
                live = get_live_events(league)
                live_ids = {m['id'] for m in live}
                all_ids = {m['id'] for m in past + upcoming}
                matches.extend(live)
                matches.extend(past)
                for m in upcoming:
                    if m['id'] not in all_ids:
                        matches.append(m)
                for m in live:
                    if m['id'] not in {x['id'] for x in past + upcoming}:
                        matches.append(m)

        # deduplicate by id
        seen = set()
        unique = []
        for m in matches:
            if m['id'] not in seen:
                seen.add(m['id'])
                unique.append(m)

        # sort: live first, then upcoming by date, then finished
        order = {'live': 0, 'upcoming': 1, 'finished': 2}
        unique.sort(key=lambda m: (order.get(m['status'], 1), m.get('rawDate', '')))

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            'body': json.dumps({'matches': unique, 'total': len(unique), 'source': 'thesportsdb'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e), 'matches': []})
        }