import { useState } from 'react';
import { useRiotStore } from '../store/useRiotStore';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [inputValue, setInputValue] = useState('');
  const { searchPlayer, searchLoading } = useRiotStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // "이름#태그" 파싱
    const parts = inputValue.split('#');
    if (parts.length !== 2) {
      alert('올바른 형식(닉네임#태그)으로 입력해주세요. 예: Hide on bush#KR1');
      return;
    }

    const [gameName, tagLine] = parts;
    searchPlayer(gameName.trim(), tagLine.trim());
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="닉네임#태그 (예: 플레이어#KR1)"
          style={{
            width: '100%',
            padding: '14px 20px 14px 45px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid var(--glass-border)',
            background: '#ffffff',
            color: 'var(--valo-text-primary)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all var(--transition-fast)',
            boxShadow: 'inset 0 2px 4px rgba(10,25,47,0.02)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--valo-text-primary)';
            e.target.style.boxShadow = '0 0 0 3px rgba(10,25,47,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--glass-border)';
            e.target.style.boxShadow = 'inset 0 2px 4px rgba(10,25,47,0.02)';
          }}
        />
        <Search 
          size={20} 
          style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--valo-text-secondary)' }} 
        />
      </div>
      <button 
        type="submit" 
        className="btn-primary" 
        disabled={searchLoading}
        style={{ opacity: searchLoading ? 0.7 : 1, minWidth: '100px' }}
      >
        {searchLoading ? '검색 중...' : '검색'}
      </button>
    </form>
  );
}
