import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const Exercise = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    lessonId,
    lessonTitle,
    unitId,
    exercises = [],
    exerciseIndex = 0
  } = location.state || {};
  const exercise = exercises[exerciseIndex];

  useEffect(() => {
    if (!lessonId || !exercise) {
      navigate('/learning-path', { replace: true });
    }
  }, [exercise, lessonId, navigate]);

  if (!lessonId || !exercise) return null;

  return (
    <ExerciseSession
      key={exercise._id}
      lessonId={lessonId}
      lessonTitle={lessonTitle}
      unitId={unitId}
      exercises={exercises}
      exerciseIndex={exerciseIndex}
      exercise={exercise}
    />
  );
};

const ExerciseSession = ({
  lessonId,
  lessonTitle,
  unitId,
  exercises,
  exerciseIndex,
  exercise
}) => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/progress/answer', {
        lessonId,
        exerciseId: exercise._id,
        answer
      });
      if (!data.correct && data.attempts === 1) {
        setAnswer('');
      }
      setFeedback(data);
    } catch (requestError) {
      console.error('Échec de la vérification de la réponse :', requestError);
      setError('Impossible d’enregistrer votre réponse. Vérifiez votre connexion et réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    const nextIndex = exerciseIndex + 1;
    if (nextIndex < exercises.length) {
      navigate(`/exercise/${exercises[nextIndex]._id}`, {
        state: { lessonId, lessonTitle, unitId, exercises, exerciseIndex: nextIndex }
      });
      return;
    }

    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div className={`exercise-session ${feedback ? feedback.correct || feedback.revealAnswer ? 'answer-correct' : 'answer-incorrect' : ''}`}>
      <div className="exercise-session-top">
        <button className="exercise-close" onClick={() => navigate(`/lesson/${lessonId}`)} aria-label="Quitter la leçon">
          ×
        </button>
        <div className="exercise-session-progress" role="progressbar" aria-valuenow={exerciseIndex} aria-valuemin="0" aria-valuemax={exercises.length} aria-label="Progression de la leçon">
          <span style={{ width: `${(exerciseIndex / exercises.length) * 100}%` }} />
        </div>
        <span className="exercise-xp-total">{exerciseIndex} / {exercises.length}</span>
      </div>

      <div className="exercise-session-content">
        <p className="eyebrow">{lessonTitle || 'VOTRE LEÇON'} · EXERCICE {exerciseIndex + 1}</p>
        <h1>{exercise.question}</h1>
        {exercise.listenText && (
          <div className="exercise-phrase">
            <span>Phrase en wolof</span>
            <p lang="wo">{exercise.listenText}</p>
          </div>
        )}

        {exercise.options?.length > 0 ? (
          <div className="exercise-choices">
            {exercise.options.map((option) => (
              <label key={option} className={answer === option ? 'choice-selected' : ''}>
                <input
                  type="radio"
                  name="exercise-answer"
                  value={option}
                  checked={answer === option}
                  onChange={(event) => setAnswer(event.target.value)}
                  disabled={Boolean(feedback)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <label className="exercise-answer-field">
            <span>Votre réponse en wolof</span>
            <input
              type="text"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Écrivez votre réponse…"
              disabled={Boolean(feedback)}
              autoComplete="off"
              autoFocus
            />
          </label>
        )}

        {error && <p className="exercise-request-error" role="alert">{error}</p>}
      </div>

      {feedback ? (
        <div className="exercise-feedback">
          <div className="exercise-feedback-inner">
            <div>
              <h2>
                {feedback.correct
                  ? 'Bonne réponse !'
                  : feedback.revealAnswer
                    ? 'Voici la bonne réponse'
                    : 'Pas tout à fait…'}
              </h2>
              <p>
                {feedback.correct
                  ? feedback.xpAwarded > 0
                    ? `+${feedback.xpAwarded} XP ajoutés à votre total !`
                    : 'Vous aviez déjà gagné les XP de cet exercice.'
                  : feedback.revealAnswer
                    ? Array.isArray(feedback.correctAnswer)
                      ? `La bonne réponse était : ${feedback.correctAnswer.join(', ')}.`
                      : `La bonne réponse était : ${feedback.correctAnswer}.`
                    : 'Ce n’est pas grave, vous avez encore un essai.'}
              </p>
            </div>
            {feedback.correct || feedback.revealAnswer ? (
              <button onClick={handleContinue}>Continuer</button>
            ) : (
              <button
                className="retry-button"
                onClick={() => {
                  setFeedback(null);
                }}
              >
                Réessayer
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="exercise-submit-bar">
          <button onClick={() => navigate(`/lesson/${lessonId}`)} className="button-secondary">
            Quitter
          </button>
          <button onClick={handleSubmit} disabled={loading || !answer.trim()}>
            {loading ? 'Vérification…' : 'Vérifier'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Exercise;
