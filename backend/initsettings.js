(function applyStoredSettings() {
    const theme = localStorage.getItem("theme");
    const fontSize = localStorage.getItem("fontSize");
  
    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  
    // Apply font size
    if (fontSize) {
      document.documentElement.classList.remove("text-sm", "text-base", "text-lg");
      document.documentElement.classList.add(`text-${fontSize}`);
    }
  })();