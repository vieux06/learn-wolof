import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const recommendedLesson = {
    title: 'Les salutations',
    unit: 'Premiers mots',
    description: 'Apprenez à dire bonjour et à échanger vos premiers mots en wolof.'
  };
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    api.get('/progress/summary')
      .then(({ data }) => {
        if (!cancelled) setDashboardData(data);
      })
      .catch((requestError) => {
        console.error('Échec du chargement de la progression :', requestError);
        if (!cancelled) {
          setError(
            requestError.response?.status === 401
              ? 'Votre session n’est plus valide. Déconnectez-vous et reconnectez-vous. Si votre compte n’existe plus, créez-en un nouveau.'
              : 'Impossible de charger votre progression.'
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleStartLearning = () => {
    navigate('/learning-path');
  };

  if (error) return <div className="page-state error">{error}</div>;
  if (!dashboardData) return <div className="page-state">Chargement de votre progression…</div>;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header page-hero">
        <p className="eyebrow">NANGA DEF ? · COMMENT ALLEZ-VOUS ?</p>
        <h1>Bonjour, {user?.name || user?.email?.split('@')[0] || 'apprenant'} !</h1>
        <p>Chaque jour est une belle occasion de faire un pas en wolof.</p>
      </header>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Points d’expérience</h3>
          <p className="stat-value">{dashboardData.xp} <span>XP</span></p>
          <p>Niveau {dashboardData.level}</p>
        </div>
        <div className="stat-card">
          <h3>Série quotidienne</h3>
          <p>{dashboardData.streak} {dashboardData.streak === 1 ? 'jour' : 'jours'}</p>
        </div>
        <div className="stat-card">
          <h3>Leçons terminées</h3>
          <p>{dashboardData.completedLessons} / {dashboardData.totalLessons}</p>
        </div>
        <div className="stat-card">
          <h3>Palier d’apprentissage</h3>
          <p>{dashboardData.unlockedLevel === 1 ? 'Débutant' : 'Intermédiaire'} · {dashboardData.unlockedLevel}</p>
          <p>{dashboardData.unlockedLevel > 1 ? 'Le palier suivant est débloqué !' : 'Terminez les 9 leçons débutantes pour continuer.'}</p>
        </div>
      </div>

      <div className="dashboard-lower">
        <section className="dashboard-recommandé">
          <div className="section-heading">
            <p className="eyebrow">POUR BIEN COMMENCER</p>
            <h2>Votre prochaine leçon</h2>
          </div>
          <div className="lesson-card featured-lesson">
            <span className="lesson-badge">LEÇON CONSEILLÉE</span>
            <h3>{recommendedLesson.title}</h3>
            <p className="lesson-unit">{recommendedLesson.unit}</p>
            <p>{recommendedLesson.description}</p>
            <button onClick={handleStartLearning}>Découvrir les leçons <span aria-hidden="true">→</span></button>
          </div>
        </section>

        <section className="dashboard-progression">
          <div className="section-heading">
            <p className="eyebrow">VOTRE PARCOURS</p>
            <h2>Votre progression</h2>
          </div>
          <div className="progression-card">
            <div className="progression-count">
              <strong>{dashboardData.completedLessons}</strong>
              <span>sur {dashboardData.totalLessons} leçons</span>
            </div>
            <div className="progress-bar" role="progressbar" aria-valuenow={dashboardData.completedLessons} aria-valuemin="0" aria-valuemax={dashboardData.totalLessons} aria-label="Progression des leçons">
              <div
                className="progress-fill"
                style={{ width: `${dashboardData.totalLessons ? (dashboardData.completedLessons / dashboardData.totalLessons) * 100 : 0}%` }}
              ></div>
            </div>
            <p>Vos progrès apparaîtront ici au fil de votre apprentissage.</p>
            <button className="button-secondary" onClick={handleStartLearning}>Voir le parcours</button>
          </div>
        </section>
        </div>
      <p className="dashboard-footer">Petit à petit, le wolof devient vôtre. Jërëjëf !</p>
    </div>
  );
};

export default Dashboard;