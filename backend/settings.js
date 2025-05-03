const translations = {
  en: {
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    fontSize: "Font Size",
    dangerZone: "Danger Zone",
    deleteAccount: "Delete Account",
    overview: "Overview",
    company: "SADAS",
    search: "Search",
    viewNotifications: "View notifications",
    notifications: "Notifications",
    profile: "Profile",
    signOut: "Sign Out",
    openUserMenu: "Open User Menu",
    clearAll: "Clear All",
    toggleSidebar: "Toggle Sidebar",
    calendar: "Calendar",
    videochat: "Video Chat",
    messages: "Messages",
    help: "Help",
    areYou: "Are you ready to get your day started?",
    taskList: "Task List",
    urgent: "Urgent",
    add: "Add",
    upcoming: "Upcoming Assignments",
    addNew: "Add New Assignment",
    unstarted: "Unstarted",
    inprogress: "In Progress",
    done: "Done",
    upcomingEvents: "📅 Upcoming Events",
    dailyMotivation: "✨ Daily Motivation",
    start: "▶ Start",
    pause: "⏸ Pause",
    reset: "🔄 Reset",
    addTrans: "Add Transaction",
    income: "💸 Income",
    expense: "💳 Expense",
    trans: "Transaction",
    total: "Total:",
  },
  es: {
    settings: "Configuración",
    language: "Idioma",
    theme: "Tema",
    fontSize: "Tamaño de fuente",
    dangerZone: "Zona de peligro",
    deleteAccount: "Eliminar cuenta",
    overview: "Resumen",
    company: "SADAS",
    search: "Buscar",
    viewNotifications: "Ver notificaciones",
    notifications: "Notificaciones",
    profile: "Perfil",
    signOut: "Cerrar sesión",
    openUserMenu: "Abrir menú de usuario",
    clearAll: "Borrar todo",
    toggleSidebar: "Alternar barra lateral",
    calendar: "Calendario",
    videochat: "Videollamada",
    messages: "Mensajes",
    help: "Ayuda",
    areYou: "¿Estás listo para comenzar tu día?",
    taskList: "Lista de tareas",
    urgent: "Urgente",
    add: "Añadir",
    upcoming: "Próximas tareas",
    addNew: "Añadir nueva tarea",
    unstarted: "No comenzado",
    inprogress: "En progreso",
    done: "Hecho",
    upcomingEvents: "📅 Próximos eventos",
    dailyMotivation: "✨ Motivación diaria",
    start: "▶ Iniciar",
    pause: "⏸ Pausar",
    reset: "🔄 Reiniciar",
    addTrans: "Añadir transacción",
    income: "💸 Ingreso",
    expense: "💳 Gasto",
    trans: "Transacción",
    total: "Total:",
    studyTimer: "Temporizador de estudio",
  },
  fr: {
    settings: "Paramètres",
    language: "Langue",
    theme: "Thème",
    fontSize: "Taille de la police",
    dangerZone: "Zone dangereuse",
    deleteAccount: "Supprimer le compte",
    overview: "Aperçu",
    company: "SADAS",
    search: "Recherche",
    viewNotifications: "Voir les notifications",
    notifications: "Notifications",
    profile: "Profil",
    signOut: "Se déconnecter",
    openUserMenu: "Ouvrir le menu utilisateur",
    clearAll: "Tout effacer",
    toggleSidebar: "Basculer la barre latérale",
    calendar: "Calendrier",
    videochat: "Appel vidéo",
    messages: "Messages",
    help: "Aide",
    areYou: "Êtes-vous prêt à commencer votre journée ?",
    taskList: "Liste des tâches",
    urgent: "Urgent",
    add: "Ajouter",
    upcoming: "Devoirs à venir",
    addNew: "Ajouter un nouveau devoir",
    unstarted: "Non commencé",
    inprogress: "En cours",
    done: "Fait",
    upcomingEvents: "📅 Événements à venir",
    dailyMotivation: "✨ Motivation quotidienne",
    start: "▶ Démarrer",
    pause: "⏸ Pause",
    reset: "🔄 Réinitialiser",
    addTrans: "Ajouter une transaction",
    income: "💸 Revenu",
    expense: "💳 Dépense",
    trans: "Transaction",
    total: "Total :",
    studyTimer: "Minuteur d'étude"
  },
  de: {
    settings: "Einstellungen",
    language: "Sprache",
    theme: "Thema",
    fontSize: "Schriftgröße",
    dangerZone: "Gefahrenzone",
    deleteAccount: "Konto löschen",
    overview: "Übersicht",
    company: "SADAS",
    search: "Suche",
    viewNotifications: "Benachrichtigungen anzeigen",
    notifications: "Benachrichtigungen",
    profile: "Profil",
    signOut: "Abmelden",
    openUserMenu: "Benutzermenü öffnen",
    clearAll: "Alles löschen",
    toggleSidebar: "Seitenleiste umschalten",
    calendar: "Kalender",
    videochat: "Videoanruf",
    messages: "Nachrichten",
    help: "Hilfe",
    areYou: "Bist du bereit, deinen Tag zu beginnen?",
    taskList: "Aufgabenliste",
    urgent: "Dringend",
    add: "Hinzufügen",
    upcoming: "Bevorstehende Aufgaben",
    addNew: "Neue Aufgabe hinzufügen",
    unstarted: "Nicht begonnen",
    inprogress: "In Bearbeitung",
    done: "Erledigt",
    upcomingEvents: "📅 Bevorstehende Ereignisse",
    dailyMotivation: "✨ Tägliche Motivation",
    start: "▶ Starten",
    pause: "⏸ Pause",
    reset: "🔄 Zurücksetzen",
    addTrans: "Transaktion hinzufügen",
    income: "💸 Einkommen",
    expense: "💳 Ausgabe",
    trans: "Transaktion",
    total: "Gesamt:",
    studyTimer: "Lern-Timer"
  }
};


function applyFontSize(size) {
  document.body.style.fontSize = size === 'large' ? '18px' : size === 'small' ? '12px' : '16px';
}

function applyTheme(theme) {
  const header = document.querySelector("header");
  const cards = document.querySelectorAll("main > div");

  if (theme === "dark") { 
    document.documentElement.classList.add("dark");
    document.body.style.backgroundColor = "#121212";
    document.body.style.color = "#ffffff";
    if (header) header.style.backgroundColor = "#1e2938";
    cards.forEach(c => { c.style.backgroundColor = "#101828"; c.style.color = "#ffffff"; });
  } else {
    document.documentElement.classList.remove("dark");
    document.body.style.backgroundColor = "#b6b6b8";
    document.body.style.color = "#000000";
    if (header) header.style.backgroundColor = "#f9f9f9";
    cards.forEach(c => { c.style.backgroundColor = "#f9f9f9"; c.style.color = "#000000"; });
  }
}

function applyLanguage(language) {
  const textElements = document.querySelectorAll("[data-i18n]");
  textElements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[language][key] || key;
  });
}

function applySettingsFromLocalStorage() {
  const theme = localStorage.getItem("theme") || "dark";
  const fontSize = localStorage.getItem("fontSize") || "default";
  const language = localStorage.getItem("language") || "en";

  applyTheme(theme);
  applyFontSize(fontSize);
  applyLanguage(language);
}

document.addEventListener("DOMContentLoaded", applySettingsFromLocalStorage);
