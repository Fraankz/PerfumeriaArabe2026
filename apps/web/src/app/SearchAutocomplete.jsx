// SearchAutocomplete.jsx
// Componente de búsqueda interactiva con autocompletado estilo Fragrantica
// Uso: <SearchAutocomplete perfumes={perfumes} onSelect={(perfume) => navigate(`/perfume/${perfume.slug}`)} />

import { useState, useRef, useEffect } from 'react';

function HighlightText({ text, query }) {
  if (!query.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <strong key={i} style={{ color: '#c9a84c', fontWeight: 600 }}>{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function SearchAutocomplete({ perfumes, onSelect, onSearchChange }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const results = query.trim().length > 0
    ? perfumes.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
        );
      }).slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex];
      if (item) item.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(val.trim().length > 0);
    setActiveIndex(-1);
    if (onSearchChange) onSearchChange(val);
  }

  function handleKeyDown(e) {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setQuery('');
        setIsOpen(false);
        if (onSearchChange) onSearchChange('');
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          onSelect(results[activeIndex]);
          setQuery('');
          setIsOpen(false);
          if (onSearchChange) onSearchChange('');
        }
        break;
      case 'Escape':
        setQuery('');
        setIsOpen(false);
        if (onSearchChange) onSearchChange('');
        break;
    }
  }

  function handleSelect(perfume) {
    onSelect(perfume);
    setQuery('');
    setIsOpen(false);
    if (onSearchChange) onSearchChange('');
  }

  function handleClear() {
    setQuery('');
    setIsOpen(false);
    setActiveIndex(-1);
    if (onSearchChange) onSearchChange('');
    inputRef.current?.focus();
  }

  return (
    <>
      <style>{`
        .autocomplete-wrap {
          max-width: 520px;
          margin: 0 auto 32px;
          padding: 0 24px;
          position: relative;
          z-index: 50;
        }

        .autocomplete-input-wrap {
          position: relative;
        }

        .autocomplete-input {
          width: 100%;
          background: #111;
          border: 1px solid #2a2218;
          border-radius: 2px;
          color: #e8dcc8;
          font-family: 'Raleway', sans-serif;
          font-size: 13px;
          letter-spacing: 1px;
          padding: 14px 40px 14px 44px;
          outline: none;
          transition: border-color 0.3s;
        }
        .autocomplete-input::placeholder { color: #4a3f2f; }
        .autocomplete-input:focus { border-color: #c9a84c55; }
        .autocomplete-input.has-results {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          border-bottom-color: #1a1510;
        }

        .autocomplete-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #c9a84c66;
          font-size: 14px;
          pointer-events: none;
        }

        .autocomplete-clear {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #4a3f2f;
          font-size: 16px;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s;
        }
        .autocomplete-clear:hover { color: #c9a84c; }

        .autocomplete-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #111;
          border: 1px solid #2a2218;
          border-top: none;
          border-bottom-left-radius: 2px;
          border-bottom-right-radius: 2px;
          max-height: 400px;
          overflow-y: auto;
          box-shadow: 0 12px 32px rgba(0,0,0,0.5);
        }

        .autocomplete-dropdown::-webkit-scrollbar { width: 3px; }
        .autocomplete-dropdown::-webkit-scrollbar-track { background: #111; }
        .autocomplete-dropdown::-webkit-scrollbar-thumb { background: #2a2218; border-radius: 2px; }

        .autocomplete-section-label {
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #5a4f3f;
          padding: 10px 16px 6px;
          border-bottom: 1px solid #1a1510;
        }

        .autocomplete-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid #1a151008;
        }
        .autocomplete-item:hover,
        .autocomplete-item.active {
          background: #1a1510;
        }

        .autocomplete-item-img {
          width: 40px;
          height: 50px;
          object-fit: contain;
          border-radius: 2px;
          flex-shrink: 0;
          background: #0e0e0e;
        }

        .autocomplete-item-img-placeholder {
          width: 40px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0e0e0e;
          border-radius: 2px;
          color: #2a2218;
          font-size: 14px;
          flex-shrink: 0;
        }

        .autocomplete-item-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .autocomplete-item-brand {
          font-size: 10px;
          letter-spacing: 1px;
          color: #7a6a50;
        }

        .autocomplete-item-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          color: #e8dcc8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .autocomplete-no-results {
          padding: 20px 16px;
          text-align: center;
          color: #4a3f2f;
          font-size: 12px;
          font-style: italic;
        }

        .autocomplete-hint {
          padding: 8px 16px;
          text-align: right;
          font-size: 9px;
          letter-spacing: 1px;
          color: #2a2218;
          border-top: 1px solid #1a1510;
        }

        .autocomplete-hint kbd {
          background: #1a1510;
          padding: 1px 4px;
          border-radius: 2px;
          font-family: inherit;
          font-size: 8px;
          color: #4a3f2f;
        }
      `}</style>

      <div className="autocomplete-wrap" ref={wrapperRef}>
        <div className="autocomplete-input-wrap">
          <span className="autocomplete-search-icon">✦</span>
          <input
            ref={inputRef}
            className={`autocomplete-input ${isOpen && results.length > 0 ? 'has-results' : ''}`}
            type="text"
            placeholder="Buscar por nombre, marca..."
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (query.trim().length > 0) setIsOpen(true); }}
          />
          {query.length > 0 && (
            <button className="autocomplete-clear" onClick={handleClear} title="Limpiar">
              ×
            </button>
          )}
        </div>

        {isOpen && query.trim().length > 0 && (
          <div className="autocomplete-dropdown" ref={listRef}>
            {results.length > 0 ? (
              <>
                <div className="autocomplete-section-label">
                  Perfumes
                </div>
                {results.map((p, i) => (
                  <div
                    key={p.id}
                    className={`autocomplete-item ${i === activeIndex ? 'active' : ''}`}
                    onClick={() => handleSelect(p)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    {p.image_url ? (
                      <img
                        className="autocomplete-item-img"
                        src={p.image_url}
                        alt={p.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="autocomplete-item-img-placeholder"
                      style={{ display: p.image_url ? 'none' : 'flex' }}
                    >
                      ◈
                    </div>
                    <div className="autocomplete-item-info">
                      <span className="autocomplete-item-brand">
                        <HighlightText text={p.brand} query={query} />
                      </span>
                      <span className="autocomplete-item-name">
                        <HighlightText text={p.name} query={query} />
                      </span>
                    </div>
                  </div>
                ))}
                <div className="autocomplete-hint">
                  <kbd>↑</kbd> <kbd>↓</kbd> navegar · <kbd>Enter</kbd> seleccionar · <kbd>Esc</kbd> cerrar
                </div>
              </>
            ) : (
              <div className="autocomplete-no-results">
                No se encontraron resultados para "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}