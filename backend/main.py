from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import riot_api

app = FastAPI(
    title="Valorant Tracker API",
    description="발로란트 전적 검색 플랫폼 백엔드 API",
    version="1.0.0"
)

# CORS 설정 (프론트엔드 React 앱에서의 요청 허용)
origins = [
    "http://localhost:5173", # Vite 기본 포트
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(riot_api.router)

@app.get("/")
def read_root():
    return {"message": "Valorant Tracker API가 정상적으로 실행 중입니다!"}
