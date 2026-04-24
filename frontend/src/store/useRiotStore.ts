import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/riot';

interface RiotState {
  content: any | null;
  playerInfo: any | null;
  recentMatches: any[] | null;
  isLoading: boolean;
  searchLoading: boolean;
  error: string | null;
  
  fetchContent: () => Promise<void>;
  searchPlayer: (gameName: string, tagLine: string) => Promise<void>;
}

export const useRiotStore = create<RiotState>((set, get) => ({
  content: null,
  playerInfo: null,
  recentMatches: null,
  isLoading: false,
  searchLoading: false,
  error: null,
  
  fetchContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_BASE_URL}/content`);
      set({ content: response.data, isLoading: false });
    } catch (err: any) {
      set({ 
        error: err.response?.data?.detail || err.message || '데이터를 불러오는 중 오류가 발생했습니다.', 
        isLoading: false 
      });
    }
  },

  searchPlayer: async (gameName: string, tagLine: string) => {
    set({ searchLoading: true, error: null, playerInfo: null, recentMatches: null });
    
    let puuid = '';
    
    // 1. 플레이어 PUUID 조회
    try {
      const accountRes = await axios.get(`${API_BASE_URL}/account/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      puuid = accountRes.data.puuid;
      set({ playerInfo: accountRes.data });
    } catch (err: any) {
      set({ 
        error: err.response?.status === 404 ? '해당 닉네임과 태그를 가진 플레이어를 찾을 수 없습니다.' : '플레이어 정보를 검색하는 중 오류가 발생했습니다.', 
        searchLoading: false 
      });
      return; // 계정을 못 찾으면 여기서 중단
    }

    // 2. 최근 매치 상세 정보 조회
    try {
      const matchesRes = await axios.get(`${API_BASE_URL}/matches/recent/${puuid}`);
      set({ recentMatches: matchesRes.data.matches, searchLoading: false });
    } catch (err: any) {
      // 403 에러 처리 (API 키 권한 문제)
      if (err.response?.status === 403) {
        set({ 
          error: '라이엇 API 권한 문제(403 Forbidden)로 매치 전적 데이터를 불러올 수 없습니다. 프로덕션 API 키가 필요합니다.', 
          searchLoading: false,
          recentMatches: []
        });
      } else {
        set({ 
          error: err.response?.data?.detail || '전적을 검색하는 중 오류가 발생했습니다.', 
          searchLoading: false,
          recentMatches: []
        });
      }
    }
  }
}));
