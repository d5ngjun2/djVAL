from fastapi import APIRouter, HTTPException
import httpx
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
    참고: https://developer.riotgames.com/apis#val-content-v1
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
    계정 정보는 아시아(asia) 서버 라우팅을 사용해야 합니다.
    """
    url = f"{settings.RIOT_API_ASIA_BASE_URL}/riot/account/v1/accounts/by-riot-id/{riot_id}/{tag_line}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=get_riot_headers())
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=f"Riot API 에러: {response.text}")
            
        return response.json()
