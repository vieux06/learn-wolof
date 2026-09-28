import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [motivation, setMotivation] = useState('');
  const [level, setLevel] = useState('');
  const [dailyGoal, setDailyGoal] = useState('');
  const [motivationOther, setMotivationOther] = useState('');

  const navigate = useNavigate();

  const motivations = [
    'Voyage',
    'Famille et amis',
    'Travail',
    'Culture'
  ];

  const levels = [
    'Débutant',
    'Quelques notions',
    'Intermédiaire'
  ];

  const goals = [
    '5 minutes',
    '10 minutes',
    '15 minutes',
    '20 minutes'
  ];

  const canContinue =
    (step === 1 && Boolean(motivation) && (motivation !== 'Autre' || Boolean(motivationOther.trim()))) ||
    (step === 2 && Boolean(level)) ||
    (step === 3 && Boolean(dailyGoal));

  const handleNext = () => {
    if (!canContinue) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      console.log('Parcours configuré :', {
        motivation: motivation === 'Autre' ? motivationOther : motivation,
        level,
        dailyGoal
      });
      navigate('/dashboard');
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="onboarding-page">
      <p className="eyebrow">PERSONNALISONS VOTRE PARCOURS</p>
      <div className="onboarding-progress" aria-label={`Étape ${step} sur 3`}>
        {[1, 2, 3].map((item) => (
          <span key={item} className={item <= step ? 'step-active' : ''} />
        ))}
      </div>
      <p className="step-label">ÉTAPE {step} SUR 3</p>
      <h2>Bienvenue sur Learn Wolof !</h2>
      <p className="form-intro">Un parcours adapté à vos envies et à votre rythme.</p>

      {step === 1 && (
        <>
          <h3>Pourquoi souhaitez-vous apprendre le wolof ?</h3>
          {motivations.map((m) => (
            <label key={m} className={`motivation-option ${motivation === m ? 'option-selected' : ''}`}>
              <input
                type="radio"
                value={m}
                checked={motivation === m}
                onChange={(e) => setMotivation(e.target.value)}
              />
              {m}
            </label>
          ))}
          <label className={`motivation-option other-option ${motivation === 'Autre' ? 'option-selected' : ''}`}>
            <input
              type="radio"
              value="Autre"
              checked={motivation === 'Autre'}
              onChange={(e) => setMotivation(e.target.value)}
            />
            <input
              type="text"
              value={motivationOther}
              aria-label="Précisez votre motivation"
              disabled={motivation !== 'Autre'}
              onChange={(e) => {
                setMotivationOther(e.target.value);
                setMotivation('Autre');
              }}
              placeholder="Autre, précisez…"
            />
          </label>
        </>
      )}

      {step === 2 && (
        <>
          <h3>Quel est votre niveau actuel ?</h3>
          {levels.map((l) => (
            <label key={l} className={`level-option ${level === l ? 'option-selected' : ''}`}>
              <input
                type="radio"
                value={l}
                checked={level === l}
                onChange={(e) => setLevel(e.target.value)}
              />
              {l}
            </label>
          ))}
        </>
      )}

      {step === 3 && (
        <>
          <h3>Quel temps souhaitez-vous consacrer chaque jour ?</h3>
          {goals.map((g) => (
            <label key={g} className={`goal-option ${dailyGoal === g ? 'option-selected' : ''}`}>
              <input
                type="radio"
                value={g}
                checked={dailyGoal === g}
                onChange={(e) => setDailyGoal(e.target.value)}
              />
              {g}
            </label>
          ))}
        </>
      )}

      <div className="onboarding-actions">
        {step > 1 && (
          <button className="button-secondary" onClick={handlePrev}>
            Précédent
          </button>
        )}
        <button onClick={handleNext} disabled={!canContinue}>
          {step === 3 ? 'Terminer' : 'Continuer'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;