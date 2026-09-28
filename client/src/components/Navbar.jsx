import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <h2>Learn Wolof</h2>
        </Link>
        <div className="navbar-menu">
          {user && (
            <>
              <span className="navbar-user">
                {user.name || user.email || 'Mon compte'}
              </span>
              <Link to="/dashboard" className="navbar-link">Tableau de bord</Link>
              <Link to="/profile" className="navbar-link">Mon profil</Link>
              <button onClick={logout} className="navbar-logout">
                Déconnexion
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="navbar-link">Connexion</Link>
              <Link to="/register" className="navbar-link navbar-link-primary">Créer un compte</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;