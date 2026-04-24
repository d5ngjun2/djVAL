import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

class Settings:
    # Riot API Key (환경변수에서 로드)
    RIOT_API_KEY: str = os.getenv("RIOT_API_KEY", "")
    
    # Riot API Base URL (일반적으로 한국 서버 기준 kr.api.riotgames.com 또는 아시아 서버 asia.api.riotgames.com)
    # val-content-v1은 지역별 URL을 사용합니다.
    RIOT_API_KR_BASE_URL: str = "https://kr.api.riotgames.com"
    RIOT_API_ASIA_BASE_URL: str = "https://asia.api.riotgames.com"

settings = Settings()
