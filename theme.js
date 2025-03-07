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
const audioPlayer = new Audio() // Crear un elemento de audio nativo

// Tracks data - Corregir las rutas de los archivos de audio
const tracks = [
  {
    title: "Amontestado Ft. Yisus",
    artist: "DJ Paco",
    duration: 215, // in seconds
    url: "https://www.youtube.com/embed/M113AVvcjC4?si=p7nfBLLidEZVj88N",
    audioUrl: "/audio/amontestado.mp3", // Ruta correcta al archivo de audio
  },
  {
    title: "Paquito Dimisión Ft.Suno",
    artist: "DJ Paco",
    duration: 252, // in seconds
    url: "https://www.youtube.com/embed/Yz_5vIRSYKc?si=aK5o-LyxBjtBBVKv",
    audioUrl: "/audio/paquito_dimision.mp3", // Ruta correcta al archivo de audio
  },
]

// Función para mostrar mensajes de estado de audio
function showAudioStatus(message, isError = false) {
  console.log(message)
  // Opcional: mostrar un mensaje visual al usuario
  if (isError && trackTitle) {
    const originalText = trackTitle.textContent
    trackTitle.textContent = message
    setTimeout(() => {
      trackTitle.textContent = originalText
    }, 3000)
  }
}

if (playPauseBtn && progressBar) {
  let isPlaying = false
  let currentTrack = 0
  let currentTime = 0
  let timer
  let audioLoaded = false

  // Configurar eventos del reproductor de audio
  audioPlayer.addEventListener("timeupdate", () => {
    if (!isNaN(audioPlayer.duration)) {
      const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100
      progressBar.style.width = `${percent}%`
      currentTime = audioPlayer.currentTime
      currentTimeEl.textContent = formatTime(currentTime)
    }
  })

  audioPlayer.addEventListener("ended", () => {
    nextTrack()
  })

  audioPlayer.addEventListener("canplaythrough", () => {
    audioLoaded = true
    showAudioStatus("Audio cargado correctamente")
  })

  audioPlayer.addEventListener("error", (e) => {
    const errorTypes = [
      "Error desconocido",
      "Error de abortado",
      "Error de red",
      "Error de decodificación",
      "Formato no soportado",
    ]

    const errorMessage = errorTypes[audioPlayer.error.code] || "Error desconocido"
    showAudioStatus(`Error de audio: ${errorMessage}`, true)
    console.error("Error de audio:", audioPlayer.error)

    // Activar el fallback de simulación
    activateFallbackMode()
  })

  // Activar modo de fallback si hay problemas con el audio
  function activateFallbackMode() {
    audioLoaded = false
    if (!timer && isPlaying) {
      timer = setInterval(updateProgress, 1000)
    }
  }

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

      // Intentar reproducir el audio
      const playPromise = audioPlayer.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Reproducción exitosa
            showAudioStatus("Reproduciendo...")
            clearInterval(timer) // Limpiar el timer de fallback si estaba activo
          })
          .catch((error) => {
            console.error("Error al reproducir:", error)
            showAudioStatus("Error al reproducir", true)
            // Activar fallback para simulación
            activateFallbackMode()
          })
      } else {
        // Navegador antiguo que no soporta promesas en play()
        activateFallbackMode()
      }
    } else {
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
      audioPlayer.pause()
      clearInterval(timer)
    }
  }

  // Update progress bar (fallback si no hay audio)
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

  // Precargar el audio para mejorar la experiencia
  function preloadAudio(url) {
    return new Promise((resolve, reject) => {
      const tempAudio = new Audio()
      tempAudio.src = url
      tempAudio.preload = "auto"

      tempAudio.addEventListener("canplaythrough", () => {
        resolve(true)
      })

      tempAudio.addEventListener("error", (err) => {
        reject(err)
      })

      // Timeout para evitar esperar indefinidamente
      setTimeout(() => {
        resolve(false)
      }, 5000)
    })
  }

  // Change track function
  async function changeTrack(index) {
    clearInterval(timer)
    currentTrack = index
    currentTime = 0
    audioLoaded = false

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
    trackTitle.textContent = tracks[index].title
    trackArtist.textContent = tracks[index].artist
    totalTimeEl.textContent = formatTime(tracks[index].duration)
    currentTimeEl.textContent = "0:00"
    progressBar.style.width = "0%"

    // Configurar nueva fuente de audio
    if (tracks[index].audioUrl) {
      try {
        // Intentar precargar el audio
        showAudioStatus("Cargando audio...")
        const preloaded = await preloadAudio(tracks[index].audioUrl).catch(() => false)

        // Configurar el audio principal
        audioPlayer.src = tracks[index].audioUrl
        audioPlayer.load()

        if (preloaded) {
          showAudioStatus("Audio precargado correctamente")
        }
      } catch (error) {
        console.error("Error al precargar audio:", error)
        showAudioStatus("Error al cargar audio", true)
        activateFallbackMode()
      }
    } else {
      showAudioStatus("No hay audio disponible para esta pista", true)
      activateFallbackMode()
    }

    // If was playing, keep playing
    if (isPlaying) {
      if (tracks[index].audioUrl) {
        audioPlayer.play().catch((error) => {
          console.error("Error al reproducir:", error)
          showAudioStatus("Error al reproducir", true)
          activateFallbackMode()
        })
      } else {
        activateFallbackMode()
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
  nextTrackBtn.addEventListener("click", nextTrack)
  prevTrackBtn.addEventListener("click", prevTrack)

  // Click on progress bar to seek
  if (progressBarContainer) {
    progressBarContainer.addEventListener("click", function (e) {
      const width = this.clientWidth
      const clickX = e.offsetX
      const duration = tracks[currentTrack].duration

      currentTime = (clickX / width) * duration

      // Si hay audio disponible, actualizar la posición
      if (audioLoaded) {
        audioPlayer.currentTime = currentTime
      } else {
        // Actualizar manualmente si estamos en modo fallback
        currentTimeEl.textContent = formatTime(currentTime)
        progressBar.style.width = (clickX / width) * 100 + "%"
      }
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

