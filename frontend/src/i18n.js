import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.browse': 'Browse',
      'nav.upload': 'Upload',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.logout': 'Logout',
      'nav.profile': 'Profile',
      'nav.moderator': 'Moderator',

      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.view': 'View',
      'common.download': 'Download',
      'common.search': 'Search',
      'common.filter': 'Filter',
      'common.sort': 'Sort',
      'common.language': 'Language',

      // Auth
      'auth.username': 'Username',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.confirmPassword': 'Confirm Password',
      'auth.login': 'Login',
      'auth.register': 'Register',
      'auth.forgotPassword': 'Forgot Password?',
      'auth.noAccount': "Don't have an account?",
      'auth.hasAccount': 'Already have an account?',

      // Documents
      'documents.title': 'Title',
      'documents.description': 'Description',
      'documents.category': 'Category',
      'documents.tags': 'Tags',
      'documents.license': 'License',
      'documents.uploadedBy': 'Uploaded by',
      'documents.uploadDate': 'Upload date',
      'documents.fileSize': 'File size',
      'documents.downloads': 'Downloads',
      'documents.views': 'Views',
      'documents.report': 'Report',

      // Categories
      'categories.all': 'All Categories',
      'categories.government': 'Government Documents',
      'categories.education': 'Education',
      'categories.health': 'Health & Medicine',
      'categories.agriculture': 'Agriculture',
      'categories.business': 'Business & Economy',
      'categories.culture': 'Culture & Heritage',
      'categories.history': 'History',
      'categories.legal': 'Legal Documents',
      'categories.science': 'Science & Technology',
      'categories.environment': 'Environment',
      'categories.humanRights': 'Human Rights',
      'categories.other': 'Other',

      // Upload
      'upload.title': 'Upload Document',
      'upload.selectFile': 'Select File',
      'upload.dragDrop': 'or drag and drop',
      'upload.fileTypes': 'PDF files up to 50MB',
      'upload.submit': 'Upload Document',

      // Footer
      'footer.about': 'About IsokoDocs',
      'footer.terms': 'Terms of Service',
      'footer.privacy': 'Privacy Policy',
      'footer.takedown': 'DMCA Takedown',
      'footer.contact': 'Contact',

      // Errors
      'error.network': 'Network error. Please try again.',
      'error.validation': 'Please check your input.',
      'error.unauthorized': 'You are not authorized to perform this action.',
      'error.notFound': 'The requested resource was not found.',
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.browse': 'Parcourir',
      'nav.upload': 'Télécharger',
      'nav.login': 'Connexion',
      'nav.register': 'Inscription',
      'nav.logout': 'Déconnexion',
      'nav.profile': 'Profil',
      'nav.moderator': 'Modérateur',

      // Common
      'common.loading': 'Chargement...',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.cancel': 'Annuler',
      'common.save': 'Enregistrer',
      'common.delete': 'Supprimer',
      'common.edit': 'Modifier',
      'common.view': 'Voir',
      'common.download': 'Télécharger',
      'common.search': 'Rechercher',
      'common.filter': 'Filtrer',
      'common.sort': 'Trier',
      'common.language': 'Langue',

      // Auth
      'auth.username': 'Nom d\'utilisateur',
      'auth.email': 'Email',
      'auth.password': 'Mot de passe',
      'auth.confirmPassword': 'Confirmer le mot de passe',
      'auth.login': 'Connexion',
      'auth.register': 'Inscription',
      'auth.forgotPassword': 'Mot de passe oublié?',
      'auth.noAccount': 'Pas de compte?',
      'auth.hasAccount': 'Déjà un compte?',

      // Documents
      'documents.title': 'Titre',
      'documents.description': 'Description',
      'documents.category': 'Catégorie',
      'documents.tags': 'Étiquettes',
      'documents.license': 'Licence',
      'documents.uploadedBy': 'Téléchargé par',
      'documents.uploadDate': 'Date de téléchargement',
      'documents.fileSize': 'Taille du fichier',
      'documents.downloads': 'Téléchargements',
      'documents.views': 'Vues',
      'documents.report': 'Signaler',

      // Categories
      'categories.all': 'Toutes les catégories',
      'categories.government': 'Documents gouvernementaux',
      'categories.education': 'Éducation',
      'categories.health': 'Santé et Médecine',
      'categories.agriculture': 'Agriculture',
      'categories.business': 'Affaires et Économie',
      'categories.culture': 'Culture et Patrimoine',
      'categories.history': 'Histoire',
      'categories.legal': 'Documents juridiques',
      'categories.science': 'Sciences et Technologie',
      'categories.environment': 'Environnement',
      'categories.humanRights': 'Droits de l\'homme',
      'categories.other': 'Autre',

      // Upload
      'upload.title': 'Télécharger un document',
      'upload.selectFile': 'Sélectionner un fichier',
      'upload.dragDrop': 'ou glisser-déposer',
      'upload.fileTypes': 'Fichiers PDF jusqu\'à 50 Mo',
      'upload.submit': 'Télécharger le document',

      // Footer
      'footer.about': 'À propos d\'IsokoDocs',
      'footer.terms': 'Conditions d\'utilisation',
      'footer.privacy': 'Politique de confidentialité',
      'footer.takedown': 'Retrait DMCA',
      'footer.contact': 'Contact',

      // Errors
      'error.network': 'Erreur réseau. Veuillez réessayer.',
      'error.validation': 'Veuillez vérifier vos données.',
      'error.unauthorized': 'Vous n\'êtes pas autorisé à effectuer cette action.',
      'error.notFound': 'La ressource demandée n\'a pas été trouvée.',
    }
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
