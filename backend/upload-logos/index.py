import os
import json
import urllib.request
import urllib.error
import boto3

AWS_KEY = os.environ.get('AWS_ACCESS_KEY_ID', '')
AWS_SECRET = os.environ.get('AWS_SECRET_ACCESS_KEY', '')
BUCKET = 'files'
CDN_BASE = f"https://cdn.poehali.dev/projects/{AWS_KEY}/bucket/logos"

# Логотипы с Wikimedia Commons — надёжный публичный CDN без ограничений
# media.api-sports.io — публичный CDN логотипов, без авторизации
# ID команд и лиг: football teams, hockey teams и т.д.
LOGOS = {
    # ===== ЛИГИ (api-sports league logos) =====
    'league_football':   'https://media.api-sports.io/football/leagues/235.png',
    'league_hockey':     'https://media.api-sports.io/hockey/leagues/57.png',
    'league_basketball': 'https://media.api-sports.io/basketball/leagues/270.png',
    'league_volleyball': 'https://media.api-sports.io/volleyball/leagues/24.png',

    # ===== ФУТБОЛ (RPL team IDs) =====
    'football_spartak':   'https://media.api-sports.io/football/teams/211.png',
    'football_cska':      'https://media.api-sports.io/football/teams/213.png',
    'football_zenit':     'https://media.api-sports.io/football/teams/244.png',
    'football_lokomotiv': 'https://media.api-sports.io/football/teams/212.png',
    'football_krasnodar': 'https://media.api-sports.io/football/teams/215.png',
    'football_dynamo':    'https://media.api-sports.io/football/teams/214.png',

    # ===== ХОККЕЙ (KHL team IDs) =====
    'hockey_ska':       'https://media.api-sports.io/hockey/teams/11.png',
    'hockey_cska':      'https://media.api-sports.io/hockey/teams/6.png',
    'hockey_akbars':    'https://media.api-sports.io/hockey/teams/4.png',
    'hockey_metallurg': 'https://media.api-sports.io/hockey/teams/17.png',
    'hockey_avangard':  'https://media.api-sports.io/hockey/teams/3.png',
    'hockey_dynamo':    'https://media.api-sports.io/hockey/teams/8.png',

    # ===== БАСКЕТБОЛ (VTB League team IDs) =====
    'basketball_cska':      'https://media.api-sports.io/basketball/teams/163.png',
    'basketball_zenit':     'https://media.api-sports.io/basketball/teams/164.png',
    'basketball_unics':     'https://media.api-sports.io/basketball/teams/165.png',
    'basketball_lokomotiv': 'https://media.api-sports.io/basketball/teams/166.png',

    # ===== ВОЛЕЙБОЛ =====
    'volleyball_zenit':     'https://media.api-sports.io/volleyball/teams/63.png',
    'volleyball_kuzbass':   'https://media.api-sports.io/volleyball/teams/64.png',
    'volleyball_belgorod':  'https://media.api-sports.io/volleyball/teams/65.png',
    'volleyball_lokomotiv': 'https://media.api-sports.io/volleyball/teams/66.png',
}

FALLBACK_LOGOS: dict = {}


def download_image(url: str, key: str) -> tuple[bool, str]:
    """Скачивает картинку и сохраняет в S3, возвращает (успех, cdn_url)"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; SportLogoBot/1.0)',
        'Referer': 'https://en.wikipedia.org/',
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = resp.read()
            content_type = resp.headers.get('Content-Type', 'image/png').split(';')[0]

        if len(data) < 500:
            return False, 'too small'

        ext = 'png' if 'png' in content_type else ('svg' if 'svg' in content_type else 'png')
        s3_key = f"logos/{key}.{ext}"

        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=AWS_KEY,
            aws_secret_access_key=AWS_SECRET,
        )
        s3.put_object(
            Bucket=BUCKET,
            Key=s3_key,
            Body=data,
            ContentType=content_type,
            CacheControl='public, max-age=2592000',
        )
        cdn_url = f"{CDN_BASE}/{key}.{ext}"
        return True, cdn_url

    except Exception as e:
        return False, str(e)


def handler(event: dict, context) -> dict:
    """
    Скачивает логотипы команд и лиг с Wikimedia и сохраняет в S3.
    GET /?action=upload — загрузить все логотипы
    GET /?action=list   — показать список загруженных
    """
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'upload')
    only_key = params.get('key', '')  # загрузить только один логотип

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if action == 'list':
        s3 = boto3.client('s3', endpoint_url='https://bucket.poehali.dev',
                          aws_access_key_id=AWS_KEY, aws_secret_access_key=AWS_SECRET)
        try:
            resp = s3.list_objects_v2(Bucket=BUCKET, Prefix='logos/')
            files = [f"{CDN_BASE}/{o['Key'].replace('logos/', '')}"
                     for o in resp.get('Contents', [])]
            return {'statusCode': 200, 'headers': headers,
                    'body': json.dumps({'files': files, 'count': len(files)})}
        except Exception as e:
            return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': str(e)})}

    # action == 'upload'
    results = {}
    logos_to_process = {only_key: LOGOS[only_key]} if only_key and only_key in LOGOS else LOGOS

    for key, url in logos_to_process.items():
        ok, result = download_image(url, key)
        if not ok and key in FALLBACK_LOGOS:
            ok, result = download_image(FALLBACK_LOGOS[key], key)
        results[key] = {'ok': ok, 'url': result if ok else None, 'error': result if not ok else None}

    success = sum(1 for r in results.values() if r['ok'])
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'uploaded': success,
            'total': len(results),
            'results': results,
            'cdn_base': CDN_BASE,
        })
    }