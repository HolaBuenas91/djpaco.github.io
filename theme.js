document.addEventListener("DOMContentLoaded", (event) => {
    const themeToggle = document.getElementById("theme-toggle")
    const body = document.body
  
    // Función para establecer el tema
    function setTheme(theme) {
      if (theme === "dark") {
        body.classList.add("dark-theme")
        themeToggle.textContent = "☀️"
      } else {
        body.classList.remove("dark-theme")
        themeToggle.textContent = "🌓"
      }
      localStorage.setItem("theme", theme)
    }
  
    // Comprobar si hay un tema guardado
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
    }
  
    // Evento de clic para cambiar el tema
    themeToggle.addEventListener("click", () => {
      if (body.classList.contains("dark-theme")) {
        setTheme("light")
      } else {
        setTheme("dark")
      }
    })
  })
  
  