import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
  }, []);

  // apply class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <Dashboard
      user="Sachu"
      darkMode={darkMode}
      onToggleDark={() => setDarkMode(prev => !prev)}
      onLogout={() => console.log("Logout")}
    />
  );
}

export default App;