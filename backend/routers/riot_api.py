from fastapi import APIRouter, HTTPException
import httpx
import asyncio
from core.config import settings

router = APIRouter(
    prefix="/api/riot",
    tags=["riot"]
)

# 공통 HTTP 헤더 설정 (Riot API 인증)
def get_riot_headers():
    if not settings.RIOT_API_KEY:
        raise HTTPException(status_code=500, detail="RIOT_API_KEY가 설정되지 않았습니다.")
    return {
        "X-Riot-Token": settings.RIOT_API_KEY
    }

@router.get("/content")
async def get_val_content(locale: str = "ko-KR"):
    """
    발로란트 게임 콘텐츠(캐릭터, 맵, 스킨 등) 정보를 가져옵니다.
    """
    url = f"{settings.RIOT_API_KR_BASE_URL}/val/content/v1/contents"
    params = {"locale": locale}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=get_riot_headers(), params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Riot API 에러: {response.text}")
        return response.json()

@router.get("/account/{riot_id}/{tag_line}")
async def get_account_by_riot_id(riot_id: str, tag_line: str):
    """
    Riot ID(닉네임)와 태그라인을 사용하여 사용자의 PUUID를 검색합니다.
    """
    url = f"{settings.RIOT_API_ASIA_BASE_URL}/riot/account/v1/accounts/by-riot-id/{riot_id}/{tag_line}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=get_riot_headers())
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Riot API 계정 검색 에러: {response.text}")
        return response.json()

@router.get("/matches/recent/{puuid}")
async def get_recent_matches(puuid: str):
    """
    PUUID를 기반으로 최근 5경기의 매치 ID 목록을 가져오고,
    해당 매치들의 세부 정보를 비동기적으로 동시에 조회하여 반환합니다.
    """
    matchlist_url = f"{settings.RIOT_API_KR_BASE_URL}/val/match/v1/matchlists/by-puuid/{puuid}"
    
    async with httpx.AsyncClient() as client:
        # 1. 매치 ID 목록 조회
        matchlist_response = await client.get(matchlist_url, headers=get_riot_headers())
        if matchlist_response.status_code != 200:
            raise HTTPException(status_code=matchlist_response.status_code, detail=f"매치리스트 조회 에러: {matchlist_response.text}")
            
        matchlist_data = matchlist_response.json()
        history = matchlist_data.get("history", [])
        
        # 최근 5경기만 추출
        recent_match_ids = [match["matchId"] for match in history[:5]]
        
        if not recent_match_ids:
            return {"matches": []}
            
        # 2. 세부 매치 정보 비동기 동시 조회 함수 정의
        async def fetch_match_detail(match_id: str):
            detail_url = f"{settings.RIOT_API_KR_BASE_URL}/val/match/v1/matches/{match_id}"
            res = await client.get(detail_url, headers=get_riot_headers())
            if res.status_code == 200:
                return res.json()
            return None
            
        # 3. 비동기 실행 및 결과 대기
        tasks = [fetch_match_detail(mid) for mid in recent_match_ids]
        matches_details = await asyncio.gather(*tasks)
        
        # None(실패한 요청) 제거 후 반환
        valid_matches = [m for m in matches_details if m is not None]
        
        return {"matches": valid_matches}
