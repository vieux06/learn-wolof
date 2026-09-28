import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div className="page-state">Chargement du profil…</div>;
  }

  return (
    <div className="profile-page content-page">
      <header className="page-heading">
        <p className="eyebrow">VOTRE ESPACE</p>
        <h1>Mon profil</h1>
        <p>Retrouvez ici les informations de votre compte.</p>
      </header>
      <div className="profile-info">
        <p><strong>Nom</strong><span>{user.name || 'Non renseigné'}</span></p>
        <p><strong>Adresse e-mail</strong><span>{user.email || 'Non renseignée'}</span></p>
      </div>
      <button onClick={logout} className="logout-btn">
        Se déconnecter
      </button>
    </div>
  );
};

export default Profile;