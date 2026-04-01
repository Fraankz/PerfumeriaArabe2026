import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const API_URL = 'http://localhost:3001/api/perfumes';

const GENDER_LABELS = { Men: 'Hombre', Women: 'Mujer', Unisex: 'Unisex' };

const FAMILY_LABELS = {
  Oriental: 'Oriental',
  'Aromatic Fruity': 'Aromática afrutada',
  Fresh: 'Fresca',
  'Oriental Vanilla': 'Oriental vainillada',
  Woody: 'Amaderada',
  Floral: 'Floral',
  'Woody Aromatic': 'Amaderada aromática',
  'Oriental Floral': 'Oriental floral',
  'Floral Fruity Gourmand': 'Floral frutal gourmand',
  'Aromatic Aquatic': 'Aromática acuática',
  Aromatic: 'Aromática',
  'Aromatic Green': 'Aromática verde',
};

const FAMILY_COLORS = {
  Oriental: '#c9a84c',
  'Oriental Vanilla': '#d8b26e',
  'Oriental Floral': '#c9967a',
  Floral: '#d4a0a0',
  'Floral Fruity Gourmand': '#d8a8b8',
  Woody: '#a07850',
  'Woody Aromatic': '#8c7a5a',
  Fresh: '#7ab8c0',
  Aromatic: '#7fa88b',
  'Aromatic Fruity': '#9bbd7a',
  'Aromatic Aquatic': '#74a9c7',
  'Aromatic Green': '#6f9a64',
};

export default function CatalogPage() {
  const [perfumes, setPerfumes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeGender, setActiveGender] = useState('Todos');
  const [activeFamily, setActiveFamily] = useState('Todas');
  const [activeBrand, setActiveBrand] = useState('Todas');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
        setPerfumes(sorted);
        setFiltered(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = perfumes;

    if (activeGender !== 'Todos') {
      result = result.filter((p) => p.gender === activeGender);
    }

    if (activeFamily !== 'Todas') {
      result = result.filter((p) => p.fragrance_family === activeFamily);
    }

    if (activeBrand !== 'Todas') {
      result = result.filter((p) => p.brand === activeBrand);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    setFiltered(result);
  }, [search, activeGender, activeFamily, activeBrand, perfumes]);

  const families = ['Todas', ...new Set(perfumes.map((p) => p.fragrance_family).filter(Boolean))];
  const genders = ['Todos', 'Men', 'Women', 'Unisex'];
  const brands = ['Todas', ...new Set(perfumes.map((p) => p.brand).filter(Boolean))];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Raleway:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0a;
          color: #e8dcc8;
          font-family: 'Raleway', sans-serif;
          min-height: 100vh;
        }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #c9a84c44; border-radius: 2px; }

        .catalog-root {
          min-height: 100vh;
          background: #0a0a0a;
          background-image:
            radial-gradient(ellipse at 20% 0%, #c9a84c08 0%, transparent 60%),
            radial-gradient(ellipse at 80% 100%, #c9a84c05 0%, transparent 50%);
        }

        .header {
          text-align: center;
          padding: 64px 24px 40px;
          position: relative;
        }
        .header::after {
          content: '';
          display: block;
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          margin: 24px auto 0;
        }
        .header-eyebrow {
          font-family: 'Raleway', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 6px;
          color: #c9a84c;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 7vw, 80px);
          font-weight: 300;
          color: #f0e6d0;
          line-height: 1;
          letter-spacing: -1px;
        }
        .header-title em {
          font-style: italic;
          color: #c9a84c;
        }
        .header-sub {
          font-size: 12px;
          letter-spacing: 3px;
          color: #7a6a50;
          margin-top: 12px;
          text-transform: uppercase;
        }

        .search-wrap {
          max-width: 480px;
          margin: 0 auto 32px;
          padding: 0 24px;
          position: relative;
        }
        .search-input {
          width: 100%;
          background: #111;
          border: 1px solid #2a2218;
          border-radius: 2px;
          color: #e8dcc8;
          font-family: 'Raleway', sans-serif;
          font-size: 13px;
          letter-spacing: 1px;
          padding: 14px 20px 14px 44px;
          outline: none;
          transition: border-color 0.3s;
        }
        .search-input::placeholder { color: #4a3f2f; }
        .search-input:focus { border-color: #c9a84c55; }
        .search-icon {
          position: absolute;
          left: 40px;
          top: 50%;
          transform: translateY(-50%);
          color: #c9a84c66;
          font-size: 14px;
          pointer-events: none;
        }

        .filters {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 0 24px 40px;
        }
        .filter-block {
          width: 100%;
          max-width: 1100px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .filter-row-brands {
          width: 100%;
          max-width: 1400px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
        }
        .filter-label {
          font-size: 9px;
          letter-spacing: 4px;
          color: #5a4f3f;
          text-transform: uppercase;
          width: 100%;
          text-align: center;
        }
        .filter-btn {
          background: transparent;
          border: 1px solid #2a2218;
          color: #7a6a50;
          font-family: 'Raleway', sans-serif;
          font-size: 10px;
          letter-spacing: 2px;
          padding: 7px 16px;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.25s;
          white-space: nowrap;
        }
        .filter-btn:hover { border-color: #c9a84c55; color: #c9a84c; }
        .filter-btn.active {
          background: #c9a84c12;
          border-color: #c9a84c;
          color: #c9a84c;
        }

        .stats {
          text-align: center;
          font-size: 10px;
          letter-spacing: 3px;
          color: #3a3020;
          text-transform: uppercase;
          margin-bottom: 40px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2px;
          padding: 0 2px 80px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .card {
          background: #0e0e0e;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          aspect-ratio: 3/4;
          display: flex;
          flex-direction: column;
        }
        .card:hover { transform: scale(1.01); z-index: 2; }
        .card:hover .card-overlay { opacity: 1; }
        .card:hover .card-img { transform: scale(1.06); }
        .card:hover .card-cta { opacity: 1; transform: translateY(0); }

        .card-img-wrap {
          flex: 1;
          overflow: hidden;
          position: relative;
          background: #111;
        }

        .card-img {
          position: absolute;
          top: 50px;
          left: 0;
          width: 100%;
          height: calc(100% - 28px);
          object-fit: contain;
          object-position: center;
          padding-bottom: 28px;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .card:hover .card-img {
          transform: scale(1.12);
        }

        .card-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #111 0%, #1a1508 100%);
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          color: #c9a84c22;
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #0a0a0aee 0%, #0a0a0a44 50%, transparent 100%);
          opacity: 0.7;
          transition: opacity 0.4s;
        }

        .card-family-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          font-size: 8px;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 4px 10px;
          border: 1px solid currentColor;
          border-radius: 1px;
          font-family: 'Raleway', sans-serif;
        }

        .card-gender-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 8px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #7a6a50;
          font-family: 'Raleway', sans-serif;
        }

        .card-body {
          padding: 20px;
          background: #0e0e0e;
          border-top: 1px solid #1a1510;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          min-height: 140px;
        }

        .card-brand {
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 6px;
        }

        .card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          color: #f0e6d0;
          line-height: 1.1;
          margin-bottom: 10px;
          min-height: 52px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-notes {
          font-size: 10px;
          letter-spacing: 0.5px;
          color: #5a4f3f;
          line-height: 1.6;
          min-height: 32px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-notes span { color: #7a6a50; }

        .card-cta {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          border: 1px solid #c9a84c55;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a84c;
          font-size: 14px;
          opacity: 0;
          transform: translateY(4px);
          transition: all 0.3s;
        }

        .brand-section { padding: 0 2px; }
        .brand-section + .brand-section {
          margin-top: 15px;
        }

        .brand-divider {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 8px 24px;
        }
        .brand-divider-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          font-weight: 300;
          font-style: italic;
          color: #f0e6d0;
          white-space: nowrap;
          letter-spacing: 1px;
        }
        .brand-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, #2a2218, transparent);
        }
        .brand-divider-count {
          font-size: 9px;
          letter-spacing: 3px;
          color: #3a3020;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .brand-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2px;
        }

        .empty {
          grid-column: 1/-1;
          text-align: center;
          padding: 80px 24px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-style: italic;
          color: #3a3020;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 16px;
        }
        .loading-ring {
          width: 40px;
          height: 40px;
          border: 1px solid #2a2218;
          border-top-color: #c9a84c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text {
          font-size: 10px;
          letter-spacing: 4px;
          color: #5a4f3f;
          text-transform: uppercase;
        }

        .footer {
          text-align: center;
          padding: 24px;
          border-top: 1px solid #1a1510;
          font-size: 9px;
          letter-spacing: 3px;
          color: #2a2218;
          text-transform: uppercase;
        }

        @media (max-width: 600px) {
          .grid { grid-template-columns: repeat(2, 1fr); gap: 1px; padding: 0 1px 60px; }
          .card-name { font-size: 16px; }
          .card-body { padding: 12px; }
        }
      `}</style>

      <div className="catalog-root">
        <header className="header">
          <p className="header-eyebrow">Colección Exclusiva</p>
          <h1 className="header-title">
            Perfumería <em>Árabe</em>
          </h1>
          <p className="header-sub">Fragancias de Oriente</p>
        </header>

        <div className="search-wrap">
          <span className="search-icon">✦</span>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar por nombre, marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-block">
            <span className="filter-label">Género</span>
            <div className="filter-row">
              {genders.map((g) => (
                <button
                  key={g}
                  className={`filter-btn ${activeGender === g ? 'active' : ''}`}
                  onClick={() => setActiveGender(g)}
                >
                  {g === 'Men' ? 'Hombre' : g === 'Women' ? 'Mujer' : g}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <span className="filter-label">Familia Olfativa</span>
            <div className="filter-row">
              {families.map((f) => (
                <button
                  key={f}
                  className={`filter-btn ${activeFamily === f ? 'active' : ''}`}
                  onClick={() => setActiveFamily(f)}
                >
                  {f === 'Todas' ? f : FAMILY_LABELS[f] || f}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-block">
            <span className="filter-label">Marca</span>
            <div className="filter-row-scroll">
              <div className="filter-row">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    className={`filter-btn ${activeBrand === brand ? 'active' : ''}`}
                    onClick={() => setActiveBrand(brand)}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-ring" />
            <p className="loading-text">Cargando colección</p>
          </div>
        ) : (
          <>
            <div className="stats">
              {filtered.length} {filtered.length === 1 ? 'fragancia encontrada' : 'fragancias encontradas'}
            </div>

            <div style={{ paddingBottom: '80px' }}>
              {filtered.length === 0 ? (
                <div className="empty">No se encontraron fragancias</div>
              ) : (
                (() => {
                  const groups = filtered.reduce((acc, p) => {
                    if (!acc[p.brand]) acc[p.brand] = [];
                    acc[p.brand].push(p);
                    return acc;
                  }, {});

                  return Object.entries(groups).map(([brand, items]) => (
                    <div key={brand} className="brand-section">
                      <div className="brand-divider">
                        <span className="brand-divider-name">{brand}</span>
                        <div className="brand-divider-line" />
                        <span className="brand-divider-count">
                          {/*items.length} {items.length === 1 ? 'fragancia' : 'fragancias'*/}
                        </span>
                      </div>

                      <div className="brand-grid">
                        {items.map((p) => (
                          <div key={p.id} className="card" onClick={() => navigate(`/perfume/${p.slug}`)}>
                            <div className="card-img-wrap">
                              {p.image_url ? (
                                <img
                                  className="card-img"
                                  src={p.image_url}
                                  alt={p.name}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}

                              <div
                                className="card-img-placeholder"
                                style={{ display: p.image_url ? 'none' : 'flex' }}
                              >
                                ◈
                              </div>

                              <div className="card-overlay" />

                              {p.fragrance_family && (
                                <span
                                  className="card-family-badge"
                                  style={{ color: FAMILY_COLORS[p.fragrance_family] || '#c9a84c' }}
                                >
                                  {FAMILY_LABELS[p.fragrance_family] || p.fragrance_family}
                                </span>
                              )}

                              {p.gender && (
                                <span className="card-gender-badge">
                                  {GENDER_LABELS[p.gender] || p.gender}
                                </span>
                              )}
                            </div>

                            <div className="card-body">
                              <p className="card-brand">{p.brand}</p>
                              <h2 className="card-name">{p.name}</h2>
                              {p.top_notes && (
                                <p className="card-notes">
                                  <span>Salida · </span>{p.top_notes}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>
          </>
        )}

        <footer className="footer">
          Perfumería Árabe 2026 · Colección Exclusiva
        </footer>
      </div>
    </>
  );
}