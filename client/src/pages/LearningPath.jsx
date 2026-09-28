import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const LearningPath = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const response = await api.get('/units');
        setUnits(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Échec du chargement du parcours :', err);
        setError('Impossible de charger le parcours. Vérifiez votre connexion au serveur.');
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  if (loading) return <div className="page-state">Chargement de votre parcours…</div>;
  if (error) return <div className="page-state error">{error}</div>;
  const levels = [...new Set(units.map((unit) => unit.level))].sort((a, b) => a - b);

  return (
    <div className="learning-path-page content-page">
      <header className="page-heading">
        <p className="eyebrow">VOTRE APPRENTISSAGE</p>
        <h1>Parcours d’apprentissage</h1>
        <p>Choisissez une étape et apprenez le wolof à votre rythme.</p>
      </header>
      {units.length === 0 ? (
        <p className="empty-state">Aucune unité n’est disponible pour le moment.</p>
      ) : (
        levels.map((level) => {
          const levelUnits = units.filter((unit) => unit.level === level);
          const isLocked = levelUnits.every((unit) => unit.isLocked);
          const firstUnit = levelUnits[0];
          return (
            <section key={level} className="learning-level">
              <div className="learning-level-heading">
                <div>
                  <p className="eyebrow">PALIER {level}</p>
                  <h2>{level === 1 ? 'Les bases' : 'Pour aller plus loin'}</h2>
                </div>
                {isLocked && (
                  <p>
                    {firstUnit.completedPreviousLessons}/{firstUnit.requiredPreviousLessons} leçons prérequises terminées
                  </p>
                )}
              </div>
              <div className="units-grid">
                {levelUnits.map((unit) => (
                  <div key={unit._id} className={`unit-card${unit.isLocked ? ' unit-locked' : ''}`}>
                    <span className="unit-number">UNITÉ {unit.order}</span>
                    <h3>{unit.title}</h3>
                    <p>{unit.description}</p>
                    {unit.isLocked && (
                      <p className="unit-lock-message" role="status">
                        Terminez les {unit.requiredPreviousLessons} leçons du palier précédent pour débloquer cette unité.
                      </p>
                    )}
                    <button disabled={unit.isLocked} onClick={() => navigate(`/unit/${unit._id}`)}>
                      {unit.isLocked ? 'Unité verrouillée' : 'Découvrir l’unité'}
                      {!unit.isLocked && <span aria-hidden="true">→</span>}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
};

export default LearningPath;