interface MatchCardProps {
  match: any;
  puuid: string;
}

export default function MatchCard({ match, puuid }: MatchCardProps) {
  if (!match || !match.players) return null;

  // 현재 검색한 플레이어 찾기
  const player = match.players.find((p: any) => p.puuid === puuid);
  if (!player) return null;

  // 팀 정보 찾기 (승리 여부 확인)
  const team = match.teams?.find((t: any) => t.teamId === player.teamId);
  const isWin = team?.won;
  
  // 테마 색상 결정
  const bgColor = isWin ? 'rgba(0, 255, 135, 0.1)' : 'rgba(255, 70, 85, 0.1)';
  const borderColor = isWin ? 'rgba(0, 255, 135, 0.3)' : 'rgba(255, 70, 85, 0.3)';
  const statusText = isWin ? '승리' : '패배';
  const statusColor = isWin ? '#00ff87' : 'var(--valo-red)';

  const { kills, deaths, assists } = player.stats;
  const kdaRatio = deaths === 0 ? kills : ((kills + assists) / deaths).toFixed(2);

  // 맵 이름 추출 (URL 경로에서 마지막 부분 추출)
  const mapName = match.matchInfo?.mapId?.split('/').pop() || '알 수 없는 맵';

  return (
    <div className="glass-panel animate-fade-in" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '20px',
      marginBottom: '15px',
      background: bgColor,
      borderLeft: `4px solid ${statusColor}`,
      borderTop: `1px solid ${borderColor}`,
      borderRight: `1px solid ${borderColor}`,
      borderBottom: `1px solid ${borderColor}`,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{ color: statusColor, fontWeight: 'bold', fontSize: '1.2rem' }}>{statusText}</span>
        <span style={{ color: 'var(--valo-light-gray)', fontSize: '0.9rem' }}>{match.matchInfo?.queueId || '일반'} • {mapName}</span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>
          {kills} <span style={{ color: 'gray' }}>/</span> <span style={{ color: 'var(--valo-red)' }}>{deaths}</span> <span style={{ color: 'gray' }}>/</span> {assists}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--valo-light-gray)', marginTop: '4px' }}>
          KDA {kdaRatio}
        </div>
      </div>

      <div style={{ textAlign: 'right', width: '100px' }}>
        <span style={{ fontSize: '1rem', color: 'var(--valo-white)' }}>
          스코어: {player.stats?.score || 0}
        </span>
      </div>
    </div>
  );
}
