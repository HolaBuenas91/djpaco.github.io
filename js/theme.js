// Mobile navigation
const burger = document.querySelector(".burger")
const nav = document.querySelector(".nav-links")
const navLinks = document.querySelectorAll(".nav-links li")

// Detección de dispositivo móvil
function isMobileDevice() {
  return (
    window.innerWidth <= 768 ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

// Variable global para saber si estamos en móvil
const isMobile = isMobileDevice()

// Aplicar cursor personalizado solo en dispositivos de escritorio
if (!isMobile) {
  document.body.classList.add("custom-cursor")
} else {
  document.body.classList.add("mobile-device")
}

burger.addEventListener("click", () => {
  // Toggle Nav
  nav.classList.toggle("nav-active")

  // Animate Links
  navLinks.forEach((link, index) => {
    if (link.style.animation) {
      link.style.animation = ""
    } else {
      link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
    }
  })

  // Burger Animation
  burger.classList.toggle("toggle")
})

// Scroll header effect
const header = document.querySelector("header")

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})

// Custom cursor - solo inicializar en dispositivos de escritorio
const cursor = document.querySelector(".cursor")
const cursorFollower = document.querySelector(".cursor-follower")

// Solo inicializar el cursor si los elementos existen y no es un dispositivo móvil
if (cursor && cursorFollower && !isMobile) {
  // Función para actualizar la posición del cursor
  function updateCursorPosition(e) {
    cursor.style.left = `${e.clientX}px`
    cursor.style.top = `${e.clientY}px`

    // Usar requestAnimationFrame para un movimiento más suave del follower
    requestAnimationFrame(() => {
      cursorFollower.style.left = `${e.clientX}px`
      cursorFollower.style.top = `${e.clientY}px`
    })
  }

  // Evento para actualizar la posición del cursor
  document.addEventListener("mousemove", updateCursorPosition)

  // Seleccionar todos los elementos interactivos, incluyendo elementos del popup
  const interactiveElements = document.querySelectorAll(
    "a, button, input, textarea, select, .service-card, .release-card, .playlist-track, .faq-question, .progress-bar, .dot, .legal-popup-content, #accept-legal",
  )

  // Añadir eventos para cambiar el tamaño del cursor en elementos interactivos
  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor-hover")
      cursorFollower.classList.add("follower-hover")
    })

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor-hover")
      cursorFollower.classList.remove("follower-hover")
    })
  })

  // Ocultar el cursor cuando sale del documento
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0"
    cursorFollower.style.opacity = "0"
  })

  // Mostrar el cursor cuando entra al documento
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1"
    cursorFollower.style.opacity = "1"
  })
}

// Page transitions
const pageTransition = document.querySelector(".page-transition")
const links = document.querySelectorAll('a[href]:not([target="_blank"])')

links.forEach((link) => {
  link.addEventListener("click", function (e) {
    // Verificar que el enlace es interno y no es un ancla
    if (this.hostname === window.location.hostname && !this.getAttribute("href").startsWith("#")) {
      e.preventDefault()
      const href = this.getAttribute("href")

      pageTransition.style.transform = "translateY(0)"

      setTimeout(() => {
        window.location.href = href
      }, 500)
    }
  })
})

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    pageTransition.style.transform = "translateY(100%)"
  }
})

window.addEventListener("load", () => {
  setTimeout(() => {
    pageTransition.style.transform = "translateY(100%)"
  }, 500)
})

// Testimonial slider
const testimonials = document.querySelectorAll(".testimonial")
const dots = document.querySelectorAll(".dot")
const prevBtn = document.querySelector(".prev-testimonial")
const nextBtn = document.querySelector(".next-testimonial")
let currentTestimonial = 0

function showTestimonial(n) {
  if (!testimonials.length) return

  testimonials.forEach((testimonial) => {
    testimonial.classList.remove("active")
  })

  dots.forEach((dot) => {
    dot.classList.remove("active")
  })

  testimonials[n].classList.add("active")
  dots[n].classList.add("active")
}

function nextTestimonial() {
  if (!testimonials.length) return

  currentTestimonial++
  if (currentTestimonial >= testimonials.length) {
    currentTestimonial = 0
  }
  showTestimonial(currentTestimonial)
}

function prevTestimonial() {
  if (!testimonials.length) return

  currentTestimonial--
  if (currentTestimonial < 0) {
    currentTestimonial = testimonials.length - 1
  }
  showTestimonial(currentTestimonial)
}

if (nextBtn && prevBtn) {
  nextBtn.addEventListener("click", nextTestimonial)
  prevBtn.addEventListener("click", prevTestimonial)

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentTestimonial = index
      showTestimonial(currentTestimonial)
    })
  })

  // Auto slide
  let testimonialInterval

  function startTestimonialInterval() {
    testimonialInterval = setInterval(nextTestimonial, 5000)
  }

  // Iniciar el intervalo
  if (testimonials.length > 0) {
    startTestimonialInterval()
  }
  // Detener el intervalo al interactuar con los controles
  ;[nextBtn, prevBtn, ...dots].forEach((control) => {
    if (control) {
      control.addEventListener("mouseenter", () => {
        clearInterval(testimonialInterval)
      })

      control.addEventListener("mouseleave", () => {
        startTestimonialInterval()
      })
    }
  })
}

// FAQ accordion
const faqItems = document.querySelectorAll(".faq-item")

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question")
  const answer = item.querySelector(".faq-answer")

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active")

    // Close all items
    faqItems.forEach((faqItem) => {
      faqItem.classList.remove("active")
      const faqAnswer = faqItem.querySelector(".faq-answer")
      if (faqAnswer) {
        faqAnswer.style.maxHeight = null
      }
    })

    // Open clicked item if it wasn't active
    if (!isActive && answer) {
      item.classList.add("active")
      answer.style.maxHeight = answer.scrollHeight + "px"
    }
  })
})

// Contact form
const contactForm = document.getElementById("contact-form")
const formSuccess = document.getElementById("form-success")

if (contactForm) {
  // Asegurarse de que los inputs tengan el atributo placeholder
  const formInputs = contactForm.querySelectorAll("input, textarea, select")
  formInputs.forEach((input) => {
    if (!input.hasAttribute("placeholder")) {
      const label = contactForm.querySelector(`label[for="${input.id}"]`)
      if (label) {
        input.setAttribute("placeholder", " ") // Espacio en blanco para activar el efecto
      }
    }
  })

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Simulate form submission
    contactForm.style.display = "none"
    if (formSuccess) {
      formSuccess.style.display = "block"
    }

    // Reset form
    contactForm.reset()
  })
}

// Music player functionality
const playPauseBtn = document.getElementById("play-pause")
const prevTrackBtn = document.getElementById("prev-track")
const nextTrackBtn = document.getElementById("next-track")
const trackTitle = document.getElementById("track-title")
const trackArtist = document.getElementById("track-artist")
const currentTimeEl = document.getElementById("current-time")
const totalTimeEl = document.getElementById("total-time")
const progressBar = document.querySelector(".progress")
const progressBarContainer = document.querySelector(".progress-bar")
const playlistTracks = document.querySelectorAll(".playlist-track")
const playTrackBtns = document.querySelectorAll(".play-track")
const audioPlayer = document.createElement("audio")

// Tracks data
const tracks = [
  {
    title: "Amontestado Ft. Yisus",
    artist: "DJ Paco",
    duration: 215, // in seconds
    url: "https://www.youtube.com/embed/M113AVvcjC4?si=p7nfBLLidEZVj88N",
    audioUrl: "https://example.com/audio/amontestado.mp3", // URL de ejemplo, reemplazar con URL real
  },
  {
    title: "Paquito Dimisión Ft.Suno",
    artist: "DJ Paco",
    duration: 252, // in seconds
    url: "https://www.youtube.com/embed/Yz_5vIRSYKc?si=aK5o-LyxBjtBBVKv",
    audioUrl: "https://example.com/audio/paquito-dimision.mp3", // URL de ejemplo, reemplazar con URL real
  },
]

if (playPauseBtn && progressBar) {
  let isPlaying = false
  let currentTrack = 0
  let currentTime = 0
  let timer

  // Añadir el elemento de audio al DOM
  document.body.appendChild(audioPlayer)
  audioPlayer.style.display = "none"

  // Configurar eventos del reproductor de audio
  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration)) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100
      progressBar.style.width = `${percent}%`
      currentTime = audioPlayer.currentTime
      if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(currentTime)
      }
    }
  })

  audioPlayer.addEventListener("ended", () => {
    nextTrack()
  })

  // Format time function
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  // Play/Pause function
  function togglePlay() {
    isPlaying = !isPlaying

    if (isPlaying) {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
      audioPlayer.play().catch((error) => {
        console.error("Error al reproducir:", error)
        // Fallback para simulación si no hay audio disponible
        timer = setInterval(updateProgress, 1000)
      })
    } else {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
      audioPlayer.pause()
      clearInterval(timer)
    }
  }

  // Update progress bar (fallback si no hay audio)
  function updateProgress() {
    if (isPlaying && currentTrack < tracks.length) {
      currentTime++
      const percent = (currentTime / tracks[currentTrack].duration) * 100
      progressBar.style.width = `${percent}%`
      if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(currentTime)
      }

      if (currentTime >= tracks[currentTrack].duration) {
        nextTrack()
      }
    }
  }

  // Change track function
  function changeTrack(index) {
    clearInterval(timer)
    currentTrack = index
    currentTime = 0

    // Detener reproducción actual
    audioPlayer.pause()

    // Update active track in playlist
    playlistTracks.forEach((track, i) => {
      if (i === index) {
        track.classList.add("active")
      } else {
        track.classList.remove("active")
      }
    })

    // Update track info
    if (trackTitle) trackTitle.textContent = tracks[index].title
    if (trackArtist) trackArtist.textContent = tracks[index].artist
    if (totalTimeEl) totalTimeEl.textContent = formatTime(tracks[index].duration)
    if (currentTimeEl) currentTimeEl.textContent = "0:00"
    if (progressBar) progressBar.style.width = "0%"

    // Configurar nueva fuente de audio
    if (tracks[index].audioUrl) {
      audioPlayer.src = tracks[index].audioUrl
      audioPlayer.load()
    }

    // If was playing, keep playing
    if (isPlaying) {
      if (tracks[index].audioUrl) {
        audioPlayer.play().catch((error) => {
          console.error("Error al reproducir:", error)
          timer = setInterval(updateProgress, 1000)
        })
      } else {
        timer = setInterval(updateProgress, 1000)
      }
    }
  }

  // Next track function
  function nextTrack() {
    let nextIndex = currentTrack + 1
    if (nextIndex >= tracks.length) {
      nextIndex = 0
    }
    changeTrack(nextIndex)
  }

  // Previous track function
  function prevTrack() {
    let prevIndex = currentTrack - 1
    if (prevIndex < 0) {
      prevIndex = tracks.length - 1
    }
    changeTrack(prevIndex)
  }

  // Event listeners
  playPauseBtn.addEventListener("click", togglePlay)
  if (nextTrackBtn) nextTrackBtn.addEventListener("click", nextTrack)
  if (prevTrackBtn) prevTrackBtn.addEventListener("click", prevTrack)

  // Click on progress bar to seek
  if (progressBarContainer) {
    progressBarContainer.addEventListener("click", function (e) {
      const width = this.clientWidth
      const clickX = e.offsetX
      const duration = tracks[currentTrack].duration

      currentTime = (clickX / width) * duration

      // Si hay audio disponible, actualizar la posición
      if (audioPlayer.src) {
        audioPlayer.currentTime = currentTime
      }

      if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime)
      if (progressBar) progressBar.style.width = (clickX / width) * 100 + "%"
    })
  }

  // Playlist track click
  playlistTracks.forEach((track, index) => {
    track.addEventListener("click", () => {
      changeTrack(index)
      if (!isPlaying) {
        togglePlay()
      }
    })
  })

  // Play track buttons
  playTrackBtns.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      changeTrack(index)
      if (!isPlaying) {
        togglePlay()
      }
    })
  })

  // Initialize player
  if (tracks.length > 0) {
    changeTrack(0)
  }
}

// Legal popup
const legalPopup = document.getElementById("legal-popup")
const openLegalBtn = document.getElementById("open-legal-popup")
const acceptLegalBtn = document.getElementById("accept-legal")

// Función para verificar si el aviso legal ya fue aceptado
function checkLegalAccepted() {
  return localStorage.getItem("legalAccepted") === "true"
}

// Función para mostrar el popup legal
function showLegalPopup() {
  if (legalPopup) {
    legalPopup.classList.add("active")

    // Asegurarse de que el cursor siga visible en el popup
    if (cursor && cursorFollower && !isMobile) {
      cursor.style.zIndex = "10000"
      cursorFollower.style.zIndex = "9999"
    }
  }
}

// Función para ocultar el popup legal
function hideLegalPopup() {
  if (legalPopup) {
    legalPopup.classList.remove("active")
  }
}

// Show legal popup on first visit
document.addEventListener("DOMContentLoaded", () => {
  if (!checkLegalAccepted() && legalPopup) {
    setTimeout(showLegalPopup, 1000)
  }
})

// Open legal popup when button is clicked
if (openLegalBtn) {
  openLegalBtn.addEventListener("click", showLegalPopup)
}

// Accept legal terms
if (acceptLegalBtn) {
  acceptLegalBtn.addEventListener("click", () => {
    localStorage.setItem("legalAccepted", "true")
    hideLegalPopup()
  })
}

// AOS-like scroll animations
const animateElements = document.querySelectorAll(".service-card, .release-card, .info-item, .skill, .news-card")

function checkScroll() {
  const triggerBottom = window.innerHeight * 0.8

  animateElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top

    if (elementTop < triggerBottom) {
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }
  })
}

// Set initial styles
animateElements.forEach((element) => {
  element.style.opacity = "0"
  element.style.transform = "translateY(30px)"
  element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
})

window.addEventListener("scroll", checkScroll)
window.addEventListener("load", checkScroll)

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Check if elements exist before initializing
  const testimonials = document.querySelectorAll(".testimonial")
  if (testimonials && testimonials.length > 0) {
    showTestimonial(currentTestimonial)
  }

  // Check if first FAQ item exists and open it
  const faqItems = document.querySelectorAll(".faq-item")
  if (faqItems && faqItems.length > 0) {
    faqItems[0].classList.add("active")
    const firstAnswer = faqItems[0].querySelector(".faq-answer")
    if (firstAnswer) {
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + "px"
    }
  }
})

// Añadir estilos para la clase toggle del burger
document.head.insertAdjacentHTML(
  "beforeend",
  `
  <style>
    .burger.toggle .line1 {
      transform: rotate(-45deg) translate(-5px, 6px);
    }
    .burger.toggle .line2 {
      opacity: 0;
    }
    .burger.toggle .line3 {
      transform: rotate(45deg) translate(-5px, -6px);
    }
    
    @keyframes navLinkFade {
      from {
        opacity: 0;
        transform: translateX(50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    /* Estilos para dispositivos móviles */
    .mobile-device .cursor,
    .mobile-device .cursor-follower {
      display: none !important;
    }
    
    /* Estilos para cursor personalizado */
    .custom-cursor {
      cursor: none;
    }
    
    .custom-cursor a,
    .custom-cursor button,
    .custom-cursor input,
    .custom-cursor textarea,
    .custom-cursor select,
    .custom-cursor .service-card,
    .custom-cursor .release-card,
    .custom-cursor .playlist-track,
    .custom-cursor .faq-question,
    .custom-cursor .progress-bar,
    .custom-cursor .dot {
      cursor: none;
    }
  </style>
`,
)

