# Application d'apprentissage du wolof

Cette application web moderne permet d'apprendre le wolof, principalement destinée aux personnes qui ne parlent pas encore wolof et qui souhaitent apprendre progressivement la langue.

## Fonctionnalités

- Parcours d'apprentissage structuré avec niveaux et unités
- Deux paliers de neuf leçons, le second étant débloqué après les neuf leçons de base
- Exercices interactifs variés (traduction, choix multiples, mise en ordre, etc.)
- Exercices de compréhension écrite avec des phrases en wolof
- Système de gamification (XP, niveaux, séries, badges, récompenses)
- Tableau de bord pour suivre sa progression
- Authentification utilisateur avec suivi de progression
- Architecture permettant d'ajouter des fichiers audio pour la prononciation
- Design moderne inspiré de la culture sénégalaise

## Technologies utilisées

- Frontend : React avec Vite
- Backend : Node.js avec Express et MongoDB (en développement avec mongodb-memory-server)
- Authentification : JWT (JSON Web Tokens)
- Gestion d'état : React Context

## Structure du projet

```
learn-wolof/
├── backend/          # API Node.js/Express
├── client/           # Application React/Vite
└── README.md         # Ce fichier
```

## Installation et démarrage

### Prérequis
- Node.js (version 14 ou supérieure)
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm run dev   # Démarre le serveur en développement avec mémoire MongoDB
```

### Frontend
```bash
cd client
npm install
npm run dev   # Démarre l'application frontend
```

L'application sera accessible à http://localhost:5173 (frontend) et l'API à http://localhost:5000 (backend). Le port frontend peut varier si 5173 est déjà utilisé.

## Fonctionnalité principale

L'application propose :
1. Inscription/connexion utilisateur
2. Processus d'onboarding pour définir les objectifs d'apprentissage
3. Tableau de bord montrant la progression, XP, séries, etc.
4. Parcours d'apprentissage organisé par unités et leçons
5. Exercices interactifs avec feedback immédiat
6. Système de gamification pour motiver l'apprentissage

## Notes de développement

En développement, `mongodb-memory-server` conserve les données localement entre les redémarrages. En production, il faut configurer une vraie instance MongoDB.

Les fonctionnalités de lecture et de reconnaissance vocales sont prévues pour une amélioration future. Pour le moment, les phrases des exercices sont présentées à l'écrit.

Les commentaires dans le code sont écrits en français pour faciliter la compréhension par l'équipe francophone.