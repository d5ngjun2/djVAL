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
    try {
      // 1. 플레이어 PUUID 조회
      const accountRes = await axios.get(`${API_BASE_URL}/account/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      const puuid = accountRes.data.puuid;
      
      set({ playerInfo: accountRes.data });

      // 2. 최근 매치 상세 정보 조회
      const matchesRes = await axios.get(`${API_BASE_URL}/matches/recent/${puuid}`);
      set({ recentMatches: matchesRes.data.matches, searchLoading: false });
      
    } catch (err: any) {
      set({ 
        error: err.response?.data?.detail || err.message || '전적을 검색하는 중 오류가 발생했습니다. 닉네임과 태그를 확인해주세요.', 
        searchLoading: false 
      });
    }
  }
}));
