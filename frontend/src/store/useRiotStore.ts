import { create } from 'zustand';
import axios from 'axios';

// 백엔드 API URL (FastAPI)
const API_BASE_URL = 'http://localhost:8000/api/riot';

interface RiotState {
  content: any | null;
  isLoading: boolean;
  error: string | null;
  fetchContent: () => Promise<void>;
}

export const useRiotStore = create<RiotState>((set) => ({
  content: null,
  isLoading: false,
  error: null,
  
  // 게임 콘텐츠(맵, 요원 등) 데이터 가져오기
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
  }
}));
