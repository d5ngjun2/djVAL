import { useRiotStore } from './store/useRiotStore';
import SearchBar from './components/SearchBar';
import MatchCard from './components/MatchCard';

function App() {
  const { playerInfo, recentMatches, error } = useRiotStore();

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', letterSpacing: '2px', textShadow: '0 0 20px rgba(255, 70, 85, 0.4)' }}>
          VALORANT <span style={{ color: 'var(--valo-red)' }}>TRACKER</span>
        </h1>
        <p style={{ color: 'var(--valo-light-gray)', fontWeight: '500', marginBottom: '2rem' }}>
          전적을 검색하고 싶은 플레이어의 닉네임과 태그를 입력하세요
        </p>
        
        <SearchBar />
      </header>

      <main>
        {error && (
          <div className="glass-panel animate-fade-in" style={{ borderColor: 'var(--valo-red)', marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--valo-red)', marginTop: 0 }}>오류 발생</h3>
            <p>{error}</p>
          </div>
        )}

        {playerInfo && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '60px', height: '60px', 
                borderRadius: 'var(--radius-lg)', 
                background: 'var(--glass-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--glass-border)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🎮</span>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>
                  {playerInfo.gameName} <span style={{ color: 'var(--valo-light-gray)', fontSize: '1.2rem', fontWeight: 'normal' }}>#{playerInfo.tagLine}</span>
                </h2>
                <span style={{ color: 'var(--valo-red)', fontSize: '0.9rem' }}>레벨 정보는 추가 API 연동 필요</span>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem', color: 'var(--valo-light-gray)' }}>최근 5경기 전적</h3>
            
            {!recentMatches && !error && (
              <p style={{ color: 'var(--valo-light-gray)', fontStyle: 'italic' }}>전적 데이터를 불러오는 중...</p>
            )}

            {recentMatches && recentMatches.length === 0 && (
              <div className="glass-panel text-center">
                <p>최근 플레이한 전적이 없습니다.</p>
              </div>
            )}

            {recentMatches && recentMatches.map((match: any, idx: number) => (
              <MatchCard key={match.matchInfo?.matchId || idx} match={match} puuid={playerInfo.puuid} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
