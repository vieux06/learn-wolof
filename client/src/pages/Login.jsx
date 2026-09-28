import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
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
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      login(token); // This will set the token in localStorage and update context
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message;
      setError(
        (message === 'Invalid email or password'
          ? 'Adresse e-mail ou mot de passe incorrect.'
          : message === 'Server error'
            ? 'Une erreur est survenue sur le serveur. Veuillez réessayer dans un instant.'
            : message) ||
          (err.response?.status === 401
            ? 'Adresse e-mail ou mot de passe incorrect.'
            : err.response
              ? 'La connexion a échoué. Veuillez réessayer.'
              : 'Impossible de joindre le serveur. Vérifiez que le serveur est démarré.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <p className="eyebrow">JÀMM REKK · APPRENDRE LE WOLOF</p>
      <h2>Bon retour parmi nous</h2>
      <p className="form-intro">Connectez-vous pour reprendre votre apprentissage.</p>
      <form onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion en cours…' : 'Se connecter'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        Vous n’avez pas encore de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </div>
  );
};

export default Login;