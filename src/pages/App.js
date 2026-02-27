import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard"; // path tumhare folder structure ke hisaab se

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // toggle dark mode
  const handleToggleDark = () => setDarkMode(prev => !prev);

  // apply dark class to body
  useEffect(() => {
    if (darkMode) document.body.classList.add("dark");
    else document.body.classList.remove("dark");
  }, [darkMode]);

  // optional: persist dark mode in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <Dashboard
      user="Sachu"
      darkMode={darkMode}       // pass state
      onToggleDark={handleToggleDark}  // pass toggle function
      onLogout={() => console.log("logout")}
    />
  );
}

export default App;