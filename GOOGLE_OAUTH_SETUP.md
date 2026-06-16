# Configuration Google OAuth pour WorkBridgeDe

## 🔴 Problème actuel
Erreur rencontrée : `"Unsupported provider: provider is not enabled"`

**Cause identifiée :** Google OAuth n'est pas activé ou configuré dans votre instance Supabase.

---

## ✅ Solution : Configuration complète Google OAuth

### Étape 1 : Créer un projet Google Cloud

1. **Accédez à Google Cloud Console** : https://console.cloud.google.com/
2. **Créez un nouveau projet** (ou sélectionnez un projet existant)
   - Nom suggéré : "WorkBridgeDe Auth"
3. **Activez l'API Google+ :**
   - Dans le menu : APIs & Services → Library
   - Recherchez "Google+ API"
   - Cliquez sur "Enable"

### Étape 2 : Configurer l'écran de consentement OAuth

1. **Menu** : APIs & Services → OAuth consent screen
2. **Type d'utilisateur** : Externe (ou Interne si G Suite)
3. **Remplissez les informations requises :**
   - Nom de l'application : `WorkBridgeDe`
   - Email d'assistance utilisateur : votre email
   - Logo : (optionnel)
   - Domaine autorisé : `softgen.dev` et votre domaine de production
   - Email du développeur : votre email
4. **Scopes OAuth** (ajoutez ces 3 scopes) :
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
5. **Enregistrez et continuez**

### Étape 3 : Créer les identifiants OAuth 2.0

1. **Menu** : APIs & Services → Credentials
2. **Créer des identifiants** → ID client OAuth 2.0
3. **Type d'application** : Application Web
4. **Nom** : `WorkBridgeDe Web Client`
5. **Origines JavaScript autorisées** (ajoutez ces 3 URLs) :
   ```
   https://dxzjmarpkeddgyemykof.supabase.co
   https://3000-95a04083-bca9-475f-b389-f3d1a03e359d.softgen.dev
   http://localhost:3000
   ```
6. **URI de redirection autorisés** (ajoutez ces 3 URLs) :
   ```
   https://dxzjmarpkeddgyemykof.supabase.co/auth/v1/callback
   https://3000-95a04083-bca9-475f-b389-f3d1a03e359d.softgen.dev/auth/callback
   http://localhost:3000/auth/callback
   ```
7. **Créer** → Vous recevrez :
   - **Client ID** (ressemble à : `123456789-abc123.apps.googleusercontent.com`)
   - **Client Secret** (ressemble à : `GOCSPX-abcdefghijklmnop`)
   
   ⚠️ **Copiez ces deux valeurs immédiatement** (vous en aurez besoin à l'étape suivante)

### Étape 4 : Configurer Supabase

1. **Accédez à votre dashboard Supabase** : https://supabase.com/dashboard/project/dxzjmarpkeddgyemykof
2. **Menu** : Authentication → Providers
3. **Trouvez "Google"** dans la liste des providers
4. **Activez Google** (toggle à ON)
5. **Remplissez les champs :**
   - **Client ID** : Collez votre Client ID de l'étape 3
   - **Client Secret** : Collez votre Client Secret de l'étape 3
6. **Site URL** (devrait être pré-rempli) :
   ```
   https://3000-95a04083-bca9-475f-b389-f3d1a03e359d.softgen.dev
   ```
7. **Redirect URLs** (devrait être pré-rempli) :
   ```
   https://dxzjmarpkeddgyemykof.supabase.co/auth/v1/callback
   ```
8. **Sauvegardez**

### Étape 5 : Tester la connexion

1. **Accédez à votre application** : https://3000-95a04083-bca9-475f-b389-f3d1a03e359d.softgen.dev/auth/login
2. **Cliquez sur "Continuer avec Google"**
3. **Attendu :**
   - Popup ou redirection vers Google
   - Sélection/connexion compte Google
   - Demande de permissions (email, profile)
   - Redirection vers `/auth/role-select`
   - Création automatique du profil
   - Email de confirmation envoyé

---

## 🔍 Debugging

### Vérifier la configuration dans le code

Ouvrez la console du navigateur (F12) lors du clic sur "Continuer avec Google" :

```javascript
// Vous devriez voir ces logs :
=== Google OAuth Debug ===
Redirect URL: https://3000-95a04083-bca9-475f-b389-f3d1a03e359d.softgen.dev/auth/role-select
Supabase URL: https://dxzjmarpkeddgyemykof.supabase.co
```

### Erreurs courantes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `provider is not enabled` | Google OAuth non activé dans Supabase | Suivre Étape 4 |
| `redirect_uri_mismatch` | URI de redirection non autorisée dans Google Cloud | Vérifier Étape 3 point 6 |
| `invalid_client` | Client ID/Secret invalides | Revérifier Étape 4 point 5 |
| `access_denied` | Utilisateur a refusé les permissions | L'utilisateur doit accepter |

### Vérifier dans Supabase SQL

Exécutez cette requête dans l'éditeur SQL Supabase :

```sql
-- Vérifier si Google est activé
SELECT 
  name,
  enabled,
  client_id IS NOT NULL as has_credentials
FROM auth.sso_providers
WHERE name = 'google';
```

**Résultat attendu :**
```
name   | enabled | has_credentials
-------|---------|----------------
google | true    | true
```

---

## 📧 Configuration des emails de confirmation

Les emails sont envoyés automatiquement par Supabase Auth lors de :
- Création de compte via Google (première connexion)
- Changement d'email

**Templates d'emails personnalisables** dans Supabase Dashboard :
- Authentication → Email Templates
- Vous pouvez personnaliser :
  - Confirmation Email
  - Magic Link
  - Change Email
  - Reset Password

---

## 🔐 Sécurité

✅ **Implémenté dans le code :**
- Scopes minimum : `openid`, `email`, `profile`
- Pas de stockage de tokens OAuth côté client
- Gestion automatique du refresh de session (50 min)
- Protection CSRF via Supabase
- RLS (Row Level Security) sur toutes les tables

✅ **À vérifier côté Google Cloud :**
- Limitez les origines JavaScript aux domaines légitimes uniquement
- Restreignez les URI de redirection aux URLs officielles
- Activez la détection des abus Google
- Configurez le domain verification pour production

---

## 📱 URLs de l'application

### Environnement actuel (Softgen Dev)
- **Application** : https://3000-95a04083-bca9-475f-b389-f3d1a03e359d.softgen.dev
- **Supabase** : https://dxzjmarpkeddgyemykof.supabase.co
- **Redirect OAuth** : https://dxzjmarpkeddgyemykof.supabase.co/auth/v1/callback

### Après déploiement en production
Vous devrez :
1. Ajouter votre domaine de production dans Google Cloud Console (Étape 3)
2. Mettre à jour la variable `NEXT_PUBLIC_SITE_URL` dans Vercel
3. Vérifier que Supabase a bien le bon Site URL configuré

---

## ✅ Checklist finale

- [ ] Projet Google Cloud créé
- [ ] Google+ API activée
- [ ] Écran de consentement OAuth configuré
- [ ] Client ID OAuth 2.0 créé
- [ ] Client Secret copié
- [ ] Origines JavaScript ajoutées (3 URLs)
- [ ] URI de redirection ajoutées (3 URLs)
- [ ] Google activé dans Supabase Dashboard
- [ ] Client ID et Secret collés dans Supabase
- [ ] Test de connexion Google réussi
- [ ] Email de confirmation reçu

---

## 🆘 Support

Si l'erreur persiste après avoir suivi toutes les étapes :

1. **Vérifiez les logs du navigateur** (F12 → Console)
2. **Vérifiez les logs Supabase** (Dashboard → Logs → Auth)
3. **Vérifiez Google Cloud Console** (Credentials → Usage)
4. **Contactez le support Supabase** si nécessaire

---

**Date de création :** 2026-06-16  
**Dernière mise à jour :** 2026-06-16  
**Version :** 1.0