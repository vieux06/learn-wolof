import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const LessonPage = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState({ completedExercises: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/lessons/${lessonId}`);
        setLesson(response.data);
        const progressResponse = await api.get(`/progress/${lessonId}`);
        setProgress(progressResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Échec du chargement de la leçon :', err);
        setError(
          err.response?.status === 403
            ? 'Cette leçon est verrouillée. Terminez les leçons du palier précédent pour y accéder.'
            : 'Impossible de charger cette leçon. Veuillez réessayer.'
        );
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (loading) return <div className="page-state">Chargement de la leçon…</div>;
  if (error) return <div className="page-state error">{error}</div>;
  if (!lesson) return <div className="page-state">Leçon introuvable.</div>;

  const exercises = lesson.exercises || [];
  const completedExerciseIds = new Set(
    (progress.completedExercises || []).map((exercise) =>
      typeof exercise === 'string' ? exercise : exercise._id
    )
  );
  const nextExerciseIndex = exercises.findIndex(
    (exercise) => !completedExerciseIds.has(exercise._id)
  );
  const lessonCompleted = exercises.length > 0 && nextExerciseIndex === -1;

  return (
    <div className="lesson-page content-page">
      <header className="page-heading">
        <p className="eyebrow">VOTRE PARCOURS · LEÇON</p>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
      </header>
      {exercises.length > 0 ? (
        <section className="lesson-session-card">
          <div className="lesson-session-progress" role="progressbar" aria-valuenow={completedExerciseIds.size} aria-valuemin="0" aria-valuemax={exercises.length} aria-label="Progression de la leçon">
            <span style={{ width: `${(completedExerciseIds.size / exercises.length) * 100}%` }} />
          </div>
          {lessonCompleted ? (
            <>
              <p className="eyebrow">LEÇON TERMINÉE</p>
              <h2>Excellent travail !</h2>
              <p>Vous avez terminé tous les exercices de cette leçon.</p>
              <button onClick={() => navigate(`/unit/${lesson.unit._id}`)}>
                Continuer le parcours <span aria-hidden="true">→</span>
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow">VOTRE LEÇON · {completedExerciseIds.size + 1} / {exercises.length}</p>
              <h2>Prêt à vous entraîner ?</h2>
              <p>Répondez aux exercices un par un et gagnez des XP à chaque bonne réponse.</p>
              <button onClick={() => navigate(`/exercise/${exercises[nextExerciseIndex]._id}`, {
                state: { lessonId: lesson._id, lessonTitle: lesson.title, unitId: lesson.unit._id, exercises, exerciseIndex: nextExerciseIndex }
              })}>
                {completedExerciseIds.size ? 'Reprendre la leçon' : 'Commencer la leçon'} <span aria-hidden="true">→</span>
              </button>
            </>
          )}
        </section>
      ) : (
          <p className="empty-state">Aucun exercice n’est encore disponible dans cette leçon.</p>
      )}
      <button onClick={() => navigate(`/unit/${lesson.unit._id}`)}>
        Retour à l’unité
      </button>
    </div>
  );
};

export default LessonPage;