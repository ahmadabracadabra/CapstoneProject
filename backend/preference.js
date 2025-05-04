const translations = {
  en: { settings: "Settings", language: "Language", theme: "Theme", fontSize: "Font Size", dangerZone: "Danger Zone", deleteAccount: "Delete Account" },
  es: { settings: "Configuración", language: "Idioma", theme: "Tema", fontSize: "Tamaño de fuente", dangerZone: "Zona de peligro", deleteAccount: "Eliminar cuenta" },
  fr: { settings: "Paramètres", language: "Langue", theme: "Thème", fontSize: "Taille de la police", dangerZone: "Zone dangereuse", deleteAccount: "Supprimer le compte" },
  de: { settings: "Einstellungen", language: "Sprache", theme: "Thema", fontSize: "Schriftgröße", dangerZone: "Gefahrenzone", deleteAccount: "Konto löschen" }
};

function applySettings(theme, fontSize, language) {
  applyTheme(theme);
  applyFontSize(fontSize);
  applyLanguage(language);

  document.getElementById("themeSelector").value = theme;
  document.getElementById("fontSizeSelector").value = fontSize;
  document.getElementById("languageSelector").value = language;
}

async function loadUserSettings() {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/login';

  try {
    const response = await fetch('http://localhost:8080/preferences', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error("Failed to fetch preferences");

    const data = await response.json();

    const theme = data.theme || 'dark';
    const fontSize = data.fontSize || 'default';
    const language = data.language || 'en';

    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("language", language);

    applySettings(theme, fontSize, language);
  } catch (error) {
    console.error("Error loading user settings:", error);

    const theme = localStorage.getItem("theme") || "dark";
    const fontSize = localStorage.getItem("fontSize") || "default";
    const language = localStorage.getItem("language") || "en";
    applySettings(theme, fontSize, language);
  }
}

async function saveSettings() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const theme = document.getElementById("themeSelector").value;
  const fontSize = document.getElementById("fontSizeSelector").value;
  const language = document.getElementById("languageSelector").value;

  const settings = { theme, fontSize, language };

  localStorage.setItem("theme", theme);
  localStorage.setItem("fontSize", fontSize);
  localStorage.setItem("language", language);

  try {
    const res = await fetch("http://localhost:8080/preferences/update", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(settings)
    });

    if (!res.ok) throw new Error("Failed to save to database");

    console.log("Settings saved successfully");
    applySettings(theme, fontSize, language);
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

function applyFontSize(size) {
  document.body.style.fontSize = size === 'large' ? '18px' : size === 'small' ? '12px' : '16px';
}

function applyTheme(theme) {
const themeableElements = document.querySelectorAll(".themeable");
const header = document.querySelector("header");
const cards = document.querySelectorAll("main > div");
const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, a, li, label");
const icons = document.querySelectorAll("svg, i");
const buttons = document.querySelectorAll("button, input[type='submit'], input[type='button']");
const inputs = document.querySelectorAll("input, textarea, select");
const welcomeMessage = document.querySelector(".welcomeMessage");
const moduleGrid = document.querySelector(".module-grid");
const notifications = document.querySelector(".notifications");
const sidebar = document.querySelector(".sidebar");


localStorage.setItem("theme", theme);


document.body.style.transition = "background-color 0.3s, color 0.3s";


[header, ...cards, ...textElements, ...icons, ...buttons, ...inputs].forEach(el => {
if (el) el.style.transition = "background-color 0.3s, color 0.3s, border-color 0.3s, fill 0.3s";
});


const root = document.documentElement; 
if (theme === "dark") {
root.classList.add("dark");
document.body.style.backgroundColor = "#121212";
document.body.style.color = "#ffffff";

if (header) header.style.backgroundColor = "#1e2938";
if (welcomeMessage) welcomeMessage.style.color = "#ffffff";
if (moduleGrid) moduleGrid.style.backgroundColor = "#2d3748";
if (notifications) notifications.style.backgroundColor = "#2d3748";
if (sidebar) sidebar.style.backgroundColor = "#1e2938";

cards.forEach(card => {
  card.style.backgroundColor = "#2d3748";
  card.style.color = "#ffffff";
});

textElements.forEach(el => el.style.color = "#ffffff");

icons.forEach(icon => {
  icon.style.color = "#ffffff";
  icon.style.fill = "#ffffff";
});

buttons.forEach(btn => {
  btn.style.backgroundColor = "#3c4a5a";
  btn.style.color = "#ffffff";
  btn.style.borderColor = "#5a5a5a";
});

inputs.forEach(input => {
  input.style.backgroundColor = "#2d2d2d";
  input.style.color = "#ffffff";
  input.style.borderColor = "#444";
});

themeableElements.forEach(el => {
  el.style.backgroundColor = "#2d3748";
  el.style.color = "#ffffff";
});

} else {
root.classList.remove("dark"); 
document.body.style.backgroundColor = "#b6b6b8";
document.body.style.color = "#000000";

if (header) header.style.backgroundColor = "#f9f9f9";
if (welcomeMessage) welcomeMessage.style.color = "#000000";
if (moduleGrid) moduleGrid.style.backgroundColor = "#f9f9f9";
if (notifications) notifications.style.backgroundColor = "#f9f9f9";
if (sidebar) sidebar.style.backgroundColor = "#f9f9f9";

cards.forEach(card => {
  card.style.backgroundColor = "#f9f9f9";
  card.style.color = "#000000";
});

textElements.forEach(el => el.style.color = "#000000");

icons.forEach(icon => {
  icon.style.color = "#000000";
  icon.style.fill = "#000000";
});

buttons.forEach(btn => {
  btn.style.backgroundColor = "#e0e0e0";
  btn.style.color = "#000000";
  btn.style.borderColor = "#ccc";
});

inputs.forEach(input => {
  input.style.backgroundColor = "#ffffff";
  input.style.color = "#000000";
  input.style.borderColor = "#ccc";
});

themeableElements.forEach(el => {
  el.style.backgroundColor = "#f9f9f9";
  el.style.color = "#000000";
});
}
}


function applyLanguage(language) {
  const textElements = document.querySelectorAll("[data-i18n]");
  textElements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[language][key] || key;
  });
}

function confirmDelete() {
  if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
    console.log("Account deleted (not implemented)");
  }
}


window.onload = loadUserSettings;



const theme = localStorage.getItem("theme") || "dark";
const fontSize = localStorage.getItem("fontSize") || "default";
const language = localStorage.getItem("language") || "en";

document.documentElement.style.fontSize = fontSize === 'large' ? '18px' : fontSize === 'small' ? '12px' : '16px';
if (theme === "dark") {
document.documentElement.classList.add("dark");
document.body.style.backgroundColor = "#121212";
document.body.style.color = "#ffffff";
} else {
document.documentElement.classList.remove("dark");
document.body.style.backgroundColor = "#b6b6b8";
document.body.style.color = "#000000";
}
