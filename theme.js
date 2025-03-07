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

// Custom cursor
const cursor = document.querySelector(".cursor")
const cursorFollower = document.querySelector(".cursor-follower")
const links = document.querySelectorAll("a, button, .service-card, .release-card, .playlist-track, .faq-question")

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px"
  cursor.style.top = e.clientY + "px"

  setTimeout(() => {
    cursorFollower.style.left = e.clientX + "px"
    cursorFollower.style.top = e.clientY + "px"
  }, 100)
})

links.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    cursor.style.width = "20px"
    cursor.style.height = "20px"
    cursorFollower.style.width = "40px"
    cursorFollower.style.height = "40px"
  })

  link.addEventListener("mouseleave", () => {
    cursor.style.width = "10px"
    cursor.style.height = "10px"
    cursorFollower.style.width = "30px"
    cursorFollower.style.height = "30px"
  })
})

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
})

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
      answer.style.maxHeight = answer.scrollHeight + "px"
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

// Tracks data
const tracks = [
  {
    title: "Amontestado Ft. Yisus",
    artist: "DJ Paco",
    duration: 215, // in seconds
    url: "https://www.youtube.com/embed/M113AVvcjC4?si=p7nfBLLidEZVj88N",
  },
  {
    title: "Paquito Dimisión Ft.Suno",
    artist: "DJ Paco",
    duration: 252, // in seconds
    url: "https://www.youtube.com/embed/Yz_5vIRSYKc?si=aK5o-LyxBjtBBVKv",
  },
]

if (playPauseBtn) {
  let isPlaying = false
  let currentTrack = 0
  let currentTime = 0
  let timer

  // Format time function
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  // Update progress bar
  function updateProgress() {
    if (isPlaying) {
      currentTime++
      const percent = (currentTime / tracks[currentTrack].duration) * 100
      progressBar.style.width = `${percent}%`
      currentTimeEl.textContent = formatTime(currentTime)

      if (currentTime >= tracks[currentTrack].duration) {
        nextTrack()
      }
    }
  }

  // Play/Pause function
  function togglePlay() {
    isPlaying = !isPlaying

    if (isPlaying) {
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'
      timer = setInterval(updateProgress, 1000)
    } else {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
      clearInterval(timer)
    }
  }

  // Change track function
  function changeTrack(index) {
    clearInterval(timer)
    currentTrack = index
    currentTime = 0

    // Update active track in playlist
    playlistTracks.forEach((track, i) => {
      if (i === index) {
        track.classList.add("active")
      } else {
        track.classList.remove("active")
      }
    })

    // Update track info
    trackTitle.textContent = tracks[index].title
    trackArtist.textContent = tracks[index].artist
    totalTimeEl.textContent = formatTime(tracks[index].duration)
    currentTimeEl.textContent = "0:00"
    progressBar.style.width = "0%"

    // If was playing, keep playing
    if (isPlaying) {
      timer = setInterval(updateProgress, 1000)
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
  nextTrackBtn.addEventListener("click", nextTrack)
  prevTrackBtn.addEventListener("click", prevTrack)

  // Click on progress bar to seek
  if (progressBarContainer) {
    progressBarContainer.addEventListener("click", function (e) {
      const width = this.clientWidth
      const clickX = e.offsetX
      const duration = tracks[currentTrack].duration

      currentTime = (clickX / width) * duration
      currentTimeEl.textContent = formatTime(currentTime)
      progressBar.style.width = (clickX / width) * 100 + "%"
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
  changeTrack(0)
}

// Legal popup
const legalPopup = document.getElementById("legal-popup")
const openLegalBtn = document.getElementById("open-legal-popup")
const acceptLegalBtn = document.getElementById("accept-legal")

// Show legal popup on first visit
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("legalAccepted")) {
    setTimeout(() => {
      legalPopup.classList.add("active")
    }, 1000)
  }
})

// Open legal popup when button is clicked
if (openLegalBtn) {
  openLegalBtn.addEventListener("click", () => {
    legalPopup.classList.add("active")
  })
}

// Accept legal terms
if (acceptLegalBtn) {
  acceptLegalBtn.addEventListener("click", () => {
    localStorage.setItem("legalAccepted", "true")
    legalPopup.classList.remove("active")
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

