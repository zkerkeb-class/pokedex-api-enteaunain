## Concepts à Comprendre
1. REST API
   - Méthodes HTTP (GET, POST, PUT, DELETE)
   - Codes de statut HTTP
   - Structure des URL
   - CORS (Cross-Origin Resource Sharing)

2. Express.js
   - Routing
   - Middleware
   - Gestion des requêtes et réponses
   - Configuration CORS

3. Sécurité de Base
   - Validation des entrées
   - Authentification
   - Gestion des erreurs
   - Politiques CORS

## Configuration CORS
CORS (Cross-Origin Resource Sharing) est un mécanisme qui permet à de nombreuses ressources (polices, JavaScript, etc.) d'une page web d'être demandées à partir d'un autre domaine que celui du domaine d'origine.

Pour utiliser l'API depuis un autre domaine :
1. L'API est configurée avec CORS activé
2. Toutes les origines sont autorisées dans cette version de développement
3. En production, vous devriez restreindre les origines autorisées

Pour une configuration plus restrictive, vous pouvez modifier les options CORS :

```javascript
app.use(cors({
  origin: 'https://votre-domaine.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Ressources Additionnelles
- [Documentation Express.js](https://expressjs.com/fr/)
- [Guide des Status HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)

## Support
Pour toute question ou problème :
1. Vérifiez la documentation
2. Consultez les messages d'erreur dans la console
3. Demandez de l'aide à votre formateur

## Prochaines Étapes
- Ajout d'une base de données (MongoDB)
- Implémentation de tests automatisés
- Déploiement de l'API
- Documentation avec Swagger

## Gestion des Fichiers Statiques
Le serveur expose le dossier `assets` pour servir les images des Pokémon. Les images sont accessibles via l'URL :
```
http://localhost:3000/assets/pokemons/{id}.png
```

Par exemple, pour accéder à l'image de Pikachu (ID: 25) :
```
http://localhost:3000/assets/pokemons/25.png
```

### Configuration
Le middleware `express.static` est utilisé pour servir les fichiers statiques :
```javascript
app.use('/assets', express.static(path.join(__dirname, '../assets')));
```

### Sécurité
- Seuls les fichiers du dossier `assets` sont exposés
- Les autres dossiers du projet restent inaccessibles
- En production, considérez l'utilisation d'un CDN pour les fichiers statiques

### YOUTUBE ###

https://youtu.be/WhrvaEHo9qE

### Installation

#### Prérequis
- Node.js (version 16 ou supérieure)
- MongoDB (en local ou via un service cloud)
- Un gestionnaire de paquets comme `npm` ou `yarn`

#### Backend
1. Clonez le dépôt :
   ```bash
   git clone <url-du-repo>
   cd <nom-du-repo>

2. Installez les dépendances

   npm install

3. Configurez les variables d'environnement :

Copiez le fichier .env fourni ou créez-en un nouveau à la racine du projet.
Assurez-vous que les variables suivantes sont correctement définies :
   API_URL=http://localhost:3000
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/pokedex
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=<votre-secret-jwt>
   JWT_EXPIRES_IN=12h

4. Lancez le serveur en mode développement :
   npm run dev

*** Documentation de l'API ***

*** Authentification ***

   POST /auth/login
      Authentifie un utilisateur et retourne un token JWT.
      Body :

      {
      "email": "user@example.com",
      "password": "password123"
      }
      Réponse :

      {
      "token": "<jwt-token>"
      }

   POST /auth/register
      Enregistre un nouvel utilisateur.
      Body :

      {
      "email": "user@example.com",
      "name": "John Doe",
      "password": "password123"
      }

   GET /auth/profile
   Retourne le profil de l'utilisateur connecté.

   En-tête requis :

   Authorization: Bearer <jwt-token>
   Réponse :

   {
   "message": "Profil utilisateur récupéré avec succès.",
   "user": {
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "score": 100,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
   }
   }
   GET /auth/getScore
   Retourne le score de l'utilisateur connecté.

   En-tête requis :

   Authorization: Bearer <jwt-token>
   Réponse :

   {
   "message": "Score récupéré avec succès.",
   "score": 150
   }
   PUT /auth/setScore
   Met à jour le score de l'utilisateur connecté.

   En-tête requis :

   Authorization: Bearer <jwt-token>
   Body :

   {
   "score": 150
   }
   Body :

   {
   "message": "Score mis à jour avec succès.",
   "user": {
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "score": 150,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
   }
   }

*** Pokémon ***

   GET /pokemons
   Retourne la liste des Pokémon.

   Paramètres :
      page (optionnel) : Numéro de la page à récupérer
      limit (optionnel) : Nombre de pokémon par page

   GET /pokemons/:id
   Retourne les détails d'un Pokémon spécifique.

   Paramètres :

   id : ID du Pokémon.
   POST /pokemons (Admin uniquement)
   Ajoute un nouveau Pokémon.
   Body :

   {
   "id": 152,
   "name": {
      "english": "Chikorita",
      "japanese": "チコリータ",
      "chinese": "菊草叶",
      "french": "Germignon"
   },
   "type": ["Grass"],
   "base": {
      "HP": 45,
      "Attack": 49,
      "Defense": 65,
      "Sp. Attack": 49,
      "Sp. Defense": 65,
      "Speed": 45
   },
   "image": "http://localhost:3000/assets/pokemons/152.png"
   }

   PUT /pokemons/:id (Admin uniquement)
   Met à jour un Pokémon existant.
   Body : similaire à l'exemple ci-dessus.

   DELETE /pokemons/:id (Admin uniquement)
   Supprime un Pokémon.

Sécurité
   Les routes protégées nécessitent un token JWT dans l'en-tête Authorization :
   Authorization: Bearer <jwt-token>

Statut HTTP
   200 OK : Requête réussie.
   400 Bad Request : Erreur dans les données envoyées.
   401 Unauthorized : Authentification requise.
   403 Forbidden : Accès interdit.
   404 Not Found : Ressource non trouvée.
   500 Internal Server Error : Erreur serveur.