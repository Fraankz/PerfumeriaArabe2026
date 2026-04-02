import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

//const API_URL = 'https://catalogo-fr-2026.onrender.com/api/perfumes'; // URL directa en caso de que no funcione la línea de abajo
const API_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? 'https://catalogo-fr-2026.onrender.com/api/perfumes'
  : 'http://localhost:3001/api/perfumes';

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

function NotesPyramid({ top, middle, base }) {
  const layers = [
    { label: 'Salida', notes: top, icon: '◇' },
    { label: 'Corazón', notes: middle, icon: '◈' },
    { label: 'Fondo', notes: base, icon: '◆' },
  ];

  return (
    <div className="pyramid">
      {layers.map(({ label, notes, icon }) =>
        notes ? (
          <div key={label} className="pyramid-layer">
            <div className="pyramid-header">
              <span className="pyramid-icon">{icon}</span>
              <span className="pyramid-label">{label}</span>
            </div>
            <div className="pyramid-notes">
              {notes.split(',').map((n) => (
                <span key={n.trim()} className="note-tag">
                  {n.trim()}
                </span>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

export default function PerfumePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setPerfume(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const accentColor = perfume
    ? FAMILY_COLORS[perfume.fragrance_family] || '#c9a84c'
    : '#c9a84c';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Raleway:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }

        body {
          background: #0a0a0a;
          color: #e8dcc8;
          font-family: 'Raleway', sans-serif;
        }

        .detail-root {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0a0a0a;
          background-image: radial-gradient(ellipse at 70% 0%, var(--accent-glow) 0%, transparent 60%);
          overflow: hidden;
        }

        .back-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 100;
          background: #0a0a0acc;
          border: 1px solid #2a2218;
          color: #c9a84c;
          font-family: 'Raleway', sans-serif;
          font-size: 9px;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 8px 14px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.25s;
          border-radius: 1px;
        }

        .back-btn:hover {
          background: #c9a84c12;
          border-color: #c9a84c;
        }

        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          flex: 1;
          overflow: hidden;
        }

        .hero-img-side {
          position: relative;
          overflow: hidden;
          background: #0e0e0e;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center center;
          filter: brightness(0.92);
          padding: 24px;
        }

        .hero-img-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #111 0%, #1a1508 100%);
          font-family: 'Cormorant Garamond', serif;
          font-size: 100px;
          color: #c9a84c11;
        }

        .hero-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 55%, #0a0a0a 100%);
        }

        .hero-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px 44px 32px;
          overflow: hidden;
          gap: 0;
        }

        .hero-eyebrow {
          font-size: 8px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hero-eyebrow::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 1px;
          background: var(--accent);
        }

        .hero-brand {
          font-size: 9px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 6px;
        }

        .hero-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(26px, 3vw, 48px);
          font-weight: 300;
          color: #f0e6d0;
          line-height: 1;
          letter-spacing: -0.5px;
          margin-bottom: 14px;
        }

        .badges {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .badge {
          font-size: 8px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 4px 10px;
          border: 1px solid;
          border-radius: 1px;
        }

        .badge-family {
          border-color: var(--accent);
          color: var(--accent);
          background: #c9a84c08;
        }

        .badge-gender {
          border-color: #2a2218;
          color: #7a6a50;
        }

        .description {
          font-size: 13px;
          line-height: 1.65;
          color: #7a6a50;
          margin-bottom: 16px;
          max-width: 380px;
          font-weight: 300;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .divider {
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, var(--accent), transparent);
          margin-bottom: 16px;
        }

        .pyramid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pyramid-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }

        .pyramid-icon {
          color: var(--accent);
          font-size: 9px;
        }

        .pyramid-label {
          font-size: 8px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #5a4f3f;
        }

        .pyramid-notes {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          padding-left: 17px;
        }

        .note-tag {
          background: #111;
          border: 1px solid #2a2218;
          color: #9a8a6a;
          font-size: 9px;
          letter-spacing: 0.5px;
          padding: 3px 9px;
          border-radius: 1px;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .note-tag:hover {
          border-color: var(--accent);
          color: var(--accent);
        }

        .detail-footer {
          border-top: 1px solid #1a1510;
          padding: 10px 44px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .detail-footer-text {
          font-size: 8px;
          letter-spacing: 3px;
          color: #2a2218;
          text-transform: uppercase;
        }

        .center-state {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .loading-ring {
          width: 34px;
          height: 34px;
          border: 1px solid #2a2218;
          border-top-color: #c9a84c;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 9px;
          letter-spacing: 4px;
          color: #5a4f3f;
          text-transform: uppercase;
        }

        .not-found {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-style: italic;
          color: #3a3020;
        }

        @media (max-width: 768px) {
          html, body { overflow: auto; }
          .detail-root { height: auto; overflow: auto; }
          .hero { grid-template-columns: 1fr; }
          .hero-img-side { height: 44vh; }
          .hero-img-overlay { background: linear-gradient(to bottom, transparent 60%, #0a0a0a 100%); }
          .hero-info { padding: 28px 20px 36px; }
          .back-btn { top: 12px; left: 12px; }
          .detail-footer { padding: 14px 20px; flex-direction: column; gap: 6px; }
          .description { -webkit-line-clamp: 3; }
        }
      `}</style>

      {loading ? (
        <div className="center-state">
          <div className="loading-ring" />
          <p className="loading-text">Cargando fragancia</p>
        </div>
      ) : !perfume ? (
        <div className="center-state">
          <p className="not-found">Fragancia no encontrada</p>
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Volver
          </button>
        </div>
      ) : (
        <div
          className="detail-root"
          style={{ '--accent': accentColor, '--accent-glow': accentColor + '08' }}
        >
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Catálogo
          </button>

          <div className="hero">
            <div className="hero-img-side">
              {perfume.image_url && !imgError ? (
                <img
                  className="hero-img"
                  src={perfume.image_url}
                  alt={perfume.name}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="hero-img-placeholder">◈</div>
              )}
              <div className="hero-img-overlay" />
            </div>

            <div className="hero-info">
              <div className="divider" />
              <p className="hero-brand">{perfume.brand}</p>
              <h1 className="hero-name">{perfume.name}</h1>

              <div className="badges">
                {perfume.fragrance_family && (
                  <span className="badge badge-family">
                    {FAMILY_LABELS[perfume.fragrance_family] || perfume.fragrance_family}
                  </span>
                )}
                {perfume.gender && (
                  <span className="badge badge-gender">
                    {GENDER_LABELS[perfume.gender] || perfume.gender}
                  </span>
                )}
              </div>

              {perfume.description && (
                <p className="description">{perfume.description}</p>
              )}

              <div className="divider" />

              <NotesPyramid
                top={perfume.top_notes}
                middle={perfume.middle_notes}
                base={perfume.base_notes}
              />
            </div>
          </div>

          <footer className="detail-footer">
            <span className="detail-footer-text">Perfumería Árabe 2026</span>
            <span className="detail-footer-text">
              {perfume.brand} · {perfume.name}
            </span>
          </footer>
        </div>
      )}
    </>
  );
}