import { useEffect } from 'react';
import { useRiotStore } from './store/useRiotStore';

function App() {
  const { content, isLoading, error, fetchContent } = useRiotStore();

  useEffect(() => {
    // 최초 렌더링 시 백엔드에서 데이터 로드 (연동 테스트)
    fetchContent();
  }, [fetchContent]);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', letterSpacing: '2px' }}>VALORANT TRACKER</h1>
        <p style={{ color: 'var(--valo-red)', fontWeight: '600' }}>프리미엄 전적 검색 및 통계 플랫폼</p>
      </header>

      <main>
        <section className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Riot API 연동 상태</h2>
          
          {isLoading && <p>데이터를 불러오는 중입니다...</p>}
          
          {error && (
            <div style={{ padding: '1rem', borderLeft: '4px solid var(--valo-red)', backgroundColor: 'rgba(255, 70, 85, 0.1)', marginTop: '1rem' }}>
              <h3 style={{ color: 'var(--valo-red)', marginTop: 0 }}>오류 발생</h3>
              <p>{error}</p>
              <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.5rem' }}>
                * 확인사항: 백엔드 서버가 실행 중인가요? backend/.env 파일에 RIOT_API_KEY가 올바르게 입력되었나요?
              </p>
            </div>
          )}
          
          {content && (
            <div style={{ marginTop: '1rem' }}>
              <p style={{ color: 'var(--valo-white)' }}>
                ✅ API 연동 성공!
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--valo-light-gray)' }}>
                데이터 버전: {content.version}
              </p>
              <button className="btn-primary" onClick={fetchContent} style={{ marginTop: '1rem' }}>
                데이터 다시 불러오기
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
