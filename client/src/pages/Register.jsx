import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token } = response.data;
      login(token);
      navigate('/onboarding');
    } catch (err) {
      const message = err.response?.data?.message;
      setError(
        message === 'User already exists'
          ? 'Un compte existe déjà avec cette adresse e-mail.'
          : message === 'Invalid user data'
            ? 'Les informations saisies sont invalides.'
            : message === 'Server error'
              ? 'Une erreur est survenue sur le serveur. Veuillez réessayer dans un instant.'
            : message || (err.response
              ? 'La création du compte a échoué. Veuillez réessayer.'
              : 'Impossible de joindre le serveur. Vérifiez que le serveur est démarré.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <p className="eyebrow">VOTRE VOYAGE COMMENCE ICI</p>
      <h2>Créez votre compte</h2>
      <p className="form-intro">Quelques secondes pour commencer à apprendre le wolof.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            autoComplete="name"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            minLength={6}
            placeholder="6 caractères minimum"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Création du compte…' : 'Créer mon compte'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
};

export default Register;