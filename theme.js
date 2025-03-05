// Page transitions
const pageTransition = document.querySelector(".page-transition")
const links2 = document.querySelectorAll('a[href]:not([target="_blank"])')

links2.forEach((link) => {
  link.addEventListener("click", function (e) {
    if (this.hostname === window.location.hostname) {
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

  // Mostrar el popup legal automáticamente al cargar
  showLegalPopup();
})

// Mobile navigation
const burger = document.querySelector(".burger")
const nav = document.querySelector(".nav-links")
const navLinks = document.querySelectorAll(".nav-links li")

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

// Popup de Aviso Legal
const legalPopup = document.getElementById("legal-popup");
const openLegalBtns = document.querySelectorAll("#open-legal-popup");
const acceptLegalBtns = document.querySelectorAll("#accept-legal");

// Función para mostrar el popup
function showLegalPopup() {
  legalPopup.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevenir scroll
}

// Función para ocultar el popup
function hideLegalPopup() {
  legalPopup.classList.remove("active");
  document.body.style.overflow = ""; // Permitir scroll nuevamente
  
  // Guardar en localStorage que el usuario ha aceptado
  localStorage.setItem("legalAccepted", "true");
}

// Evento para mostrar el popup cuando se hace clic en el enlace
openLegalBtns.forEach(btn => {
  btn.addEventListener("click", showLegalPopup);
});

// Evento para cerrar el popup cuando se hace clic en Aceptar
acceptLegalBtns.forEach(btn => {
  btn.addEventListener("click", hideLegalPopup);
});

// Mostrar el popup al inicio si el usuario no lo ha aceptado antes
document.addEventListener("DOMContentLoaded", function() {
  if (!localStorage.getItem("legalAccepted")) {
    showLegalPopup();
  }
});

// Testimonial slider
const testimonials = document.querySelectorAll(".testimonial")
const dots = document.querySelectorAll(".dot")
const prevBtn = document.querySelector(".prev-testimonial")
const nextBtn = document.querySelector(".next-testimonial")
let currentTestimonial = 0

function showTestimonial(n) {
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
  currentTestimonial++
  if (currentTestimonial >= testimonials.length) {
    currentTestimonial = 0
  }
  showTestimonial(currentTestimonial)
}

function prevTestimonial() {
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
  setInterval(nextTestimonial, 5000)
}

// FAQ accordion
const faqItems = document.querySelectorAll(".faq-item")

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question")

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active")

    // Close all items
    faqItems.forEach((faqItem) => {
      faqItem.classList.remove("active")
      const answer = faqItem.querySelector(".faq-answer")
      answer.style.maxHeight = null
    })

    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add("active")
      const answer = item.querySelector(".faq-answer")
      if (answer) {
        answer.style.maxHeight = answer.scrollHeight + "px"
      }
    }
  })
})

// Contact form
const contactForm = document.getElementById("contact-form")
const formSuccess = document.getElementById("form-success")

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // Simulate form submission
    contactForm.style.display = "none"
    formSuccess.style.display = "block"

    // Reset form
    contactForm.reset()
  })
}

// Music player functionality - UPDATED TO WORK
const playPauseBtn = document.getElementById("play-pause")
const prevTrackBtn = document.getElementById("prev-track")
const nextTrackBtn = document.getElementById("next-track")
const trackTitle = document.getElementById("track-title")
const trackArtist = document.getElementById("track-artist")
const currentTimeEl = document.getElementById("current-time")
const totalTimeEl = document.getElementById("total-time")
const progressBar = document.querySelector(".progress")
const playlistTracks = document.querySelectorAll(".playlist-track")
const playTrackBtns = document.querySelectorAll(".play-track")

if (playPauseBtn) {
  let isPlaying = false
  let currentTrack = 0
  let timer = null;

  // Simulate play/pause
  playPauseBtn.addEventListener("click", function() {
    togglePlayPause();
  });

  function togglePlayPause() {
    isPlaying = !isPlaying

    if (isPlaying) {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
      // Start progress animation
      progressBar.style.animation = "progress 215s linear forwards"
      progressBar.style.animationPlayState = "running"
      startTimer();
    } else {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
      // Pause progress animation
      progressBar.style.animationPlayState = "paused"
      clearInterval(timer);
    }
  }

  // Simulate track change
  function changeTrack(index) {
    currentTrack = index

    // Update active track in playlist
    playlistTracks.forEach((track, i) => {
      if (i === index) {
        track.classList.add("active")
      } else {
        track.classList.remove("active")
      }
    })

    // Update track info
    const trackInfo = playlistTracks[index].querySelector(".track-info")
    trackTitle.textContent = trackInfo.querySelector("h4").textContent
    trackArtist.textContent = trackInfo.querySelector("p").textContent

    // Reset progress and time
    currentSeconds = 0;
    currentTimeEl.textContent = formatTime(currentSeconds);
    clearInterval(timer);
    
    // Reset progress bar
    progressBar.style.animation = "none"
    setTimeout(() => {
      progressBar.style.animation = "progress 215s linear forwards"
    }, 10)

    // If was playing, keep playing
    if (isPlaying) {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
      progressBar.style.animationPlayState = "running"
      startTimer();
    }
  }

  nextTrackBtn.addEventListener("click", () => {
    let nextIndex = currentTrack + 1
    if (nextIndex >= playlistTracks.length) {
      nextIndex = 0
    }
    changeTrack(nextIndex)
  })

  prevTrackBtn.addEventListener("click", () => {
    let prevIndex = currentTrack - 1
    if (prevIndex < 0) {
      prevIndex = playlistTracks.length - 1
    }
    changeTrack(prevIndex)
  })

  // Playlist track click
  playlistTracks.forEach((track, index) => {
    track.addEventListener("click", () => {
      changeTrack(index)
      if (!isPlaying) {
        togglePlayPause();
      }
    })
  })

  // Play track buttons
  playTrackBtns.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
      changeTrack(index)
      isPlaying = true
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
      progressBar.style.animationPlayState = "running"
      startTimer();
    })
  })

  // Simulate time update
  let currentSeconds = 0
  const totalSeconds = 215 // 3:35 in seconds

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(updateTime, 1000);
  }

  function updateTime() {
    if (isPlaying && currentSeconds < totalSeconds) {
      currentSeconds++
      currentTimeEl.textContent = formatTime(currentSeconds)
      
      // Si llega al tiempo máximo, pasar a la siguiente canción
      if (currentSeconds >= totalSeconds) {
        let nextIndex = currentTrack + 1
        if (nextIndex >= playlistTracks.length) {
          nextIndex = 0
        }
        changeTrack(nextIndex)
      }
    }
  }

  totalTimeEl.textContent = formatTime(totalSeconds)

  // Iniciar automáticamente con la primera canción
  changeTrack(0);
}

// Release card play overlay
const releaseCards = document.querySelectorAll(".release-card")

releaseCards.forEach((card) => {
  const playBtn = card.querySelector(".play-overlay")

  playBtn.addEventListener("click", () => {
    // Simulate playing the track
    if (playPauseBtn) {
      isPlaying = true
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
      progressBar.style.animation = "progress 215s linear forwards"
      progressBar.style.animationPlayState = "running"
      startTimer();
    }
  })
})

// AOS-like scroll animations
const animateElements = document.querySelectorAll(".service-card, .release-card, .info-item, .skill")

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
  if (testimonials.length > 0) {
    showTestimonial(currentTestimonial)
  }

  // Check if first FAQ item exists and open it
  if (faqItems.length > 0) {
    faqItems[0].classList.add("active")
    const firstAnswer = faqItems[0].querySelector(".faq-answer")
    if (firstAnswer) {
      firstAnswer.style.maxHeight = firstAnswer.scrollHeight + "px"
    }
  }
})
