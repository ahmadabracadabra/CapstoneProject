function applyFontSize(size) {
  document.body.style.fontSize =
    size === 'large' ? '18px' :
    size === 'small' ? '12px' : '16px';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#ffffff';
  } else if (theme === 'light') {
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
  } else {
    console.warn(`Invalid theme: ${theme}. Defaulting to 'dark' theme.`);
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#ffffff';
  }
}

function applyLanguage(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

async function loadUserSettings() {
  const token = localStorage.getItem('token');
  const fontSizeSelector = document.getElementById('fontSizeSelector');
  const themeSelector = document.getElementById('themeSelector');
  const languageSelector = document.getElementById('languageSelector');

  if (!token) {
    console.log("No token found. Loading settings from localStorage...");
    const localFontSize = localStorage.getItem('fontSize') || 'default';
    const localTheme = localStorage.getItem('theme') || 'dark'; 
    const localLanguage = localStorage.getItem('language') || 'en';

    if (fontSizeSelector) fontSizeSelector.value = localFontSize;
    if (themeSelector) themeSelector.value = localTheme;
    if (languageSelector) languageSelector.value = localLanguage;

    applyFontSize(localFontSize);
    applyLanguage(localLanguage);
    applyTheme(localTheme);
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/preferences", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch user preferences");

    const settings = await res.json();

    const theme = settings.theme !== undefined ? settings.theme : "dark";
    const fontSize = settings.font_size !== undefined ? settings.font_size : "default";
    const language = settings.language !== undefined ? settings.language : "en";

    if (fontSizeSelector) fontSizeSelector.value = fontSize;
    if (themeSelector) themeSelector.value = theme;
    if (languageSelector) languageSelector.value = language;

    applyFontSize(fontSize);
    applyTheme(theme);
    applyLanguage(language);

    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("language", language);

  } catch (error) {
    console.error("Error loading settings from server:", error);
    
    const fallbackFontSize = localStorage.getItem('fontSize') || 'default';
    const fallbackTheme = localStorage.getItem('theme') || 'dark'; 
    const fallbackLanguage = localStorage.getItem('language') || 'en';

    if (fontSizeSelector) fontSizeSelector.value = fallbackFontSize;
    if (themeSelector) themeSelector.value = fallbackTheme;
    if (languageSelector) languageSelector.value = fallbackLanguage;

    applyFontSize(fallbackFontSize);
    applyTheme(fallbackTheme);
    applyLanguage(fallbackLanguage);
  }
}

