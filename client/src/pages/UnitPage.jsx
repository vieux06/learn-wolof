import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const UnitPage = () => {
  const { unitId } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/units/${unitId}`);
        setUnit(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Échec du chargement de l’unité :', err);
        setError(
          err.response?.status === 403
            ? 'Cette unité est verrouillée. Terminez les leçons du palier précédent pour y accéder.'
            : 'Impossible de charger cette unité. Veuillez réessayer.'
        );
        setLoading(false);
      }
    };

    fetchUnit();
  }, [unitId]);

  if (loading) return <div className="page-state">Chargement de l’unité…</div>;
  if (error) return <div className="page-state error">{error}</div>;
  if (!unit) return <div className="page-state">Unité introuvable.</div>;

  return (
    <div className="unit-page content-page">
      <header className="page-heading">
        <p className="eyebrow">VOTRE PARCOURS · UNITÉ</p>
        <h1>{unit.title}</h1>
        <p>{unit.description}</p>
      </header>
      <div className="lessons-list">
        {unit.lessons && unit.lessons.length > 0 ? (
          unit.lessons.map((lesson) => (
            <div key={lesson._id} className="lesson-card">
              <span className="unit-number">LEÇON</span>
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              <p className="lesson-xp">{lesson.xpReward} points d’expérience</p>
              <button onClick={() => navigate(`/lesson/${lesson._id}`)}>
                Commencer la leçon <span aria-hidden="true">→</span>
              </button>
            </div>
          ))
        ) : (
          <p className="empty-state">Aucune leçon n’est encore disponible dans cette unité.</p>
        )}
      </div>
      <button onClick={() => navigate('/learning-path')}>
        Retour au parcours
      </button>
    </div>
  );
};

export default UnitPage;