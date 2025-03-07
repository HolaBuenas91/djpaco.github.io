/**
 * Reproductor de audio mejorado para DJ Paco
 * Este script maneja la reproducción de audio con manejo de errores y fallbacks
 */

class AudioPlayerManager {
  constructor(options = {}) {
    // Elementos DOM
    this.playPauseBtn = document.getElementById(options.playPauseBtn || "play-pause")
    this.prevTrackBtn = document.getElementById(options.prevTrackBtn || "prev-track")
    this.nextTrackBtn = document.getElementById(options.nextTrackBtn || "next-track")
    this.trackTitle = document.getElementById(options.trackTitle || "track-title")
    this.trackArtist = document.getElementById(options.trackArtist || "track-artist")
    this.currentTimeEl = document.getElementById(options.currentTimeEl || "current-time")
    this.totalTimeEl = document.getElementById(options.totalTimeEl || "total-time")
    this.progressBar = document.querySelector(options.progressBar || ".progress")
    this.progressBarContainer = document.querySelector(options.progressBarContainer || ".progress-bar")
    this.playlistTracks = document.querySelectorAll(options.playlistTracks || ".playlist-track")
    this.playTrackBtns = document.querySelectorAll(options.playTrackBtns || ".play-track")
    this.audioStatusEl = document.getElementById(options.audioStatusEl || "audio-status")
    this.debugAudio = document.getElementById(options.debugAudio || "debug-audio")

    // Estado del reproductor
    this.isPlaying = false
    this.currentTrack = 0
    this.currentTime = 0
    this.timer = null
    this.audioLoaded = false

    // Crear elemento de audio
    this.audioPlayer = new Audio()

    // Lista de pistas
    this.tracks = options.tracks || [
      {
        title: "Amontestado Ft. Yisus",
        artist: "DJ Paco",
        duration: 215,
        url: "https://www.youtube.com/embed/M113AVvcjC4?si=p7nfBLLidEZVj88N",
        audioUrl: "/audio/amontestado.mp3",
      },
      {
        title: "Paquito Dimisión Ft.Suno",
        artist: "DJ Paco",
        duration: 252,
        url: "https://www.youtube.com/embed/Yz_5vIRSYKc?si=aK5o-LyxBjtBBVKv",
        audioUrl: "/audio/paquito_dimision.mp3",
      },
    ]

    // Inicializar
    this.init()
  }

  init() {
    if (!this.playPauseBtn || !this.progressBar) {
      console.warn("Elementos del reproductor no encontrados")
      return
    }

    // Configurar eventos del reproductor de audio
    this.setupAudioEvents()

    // Configurar eventos de la interfaz
    this.setupUIEvents()

    // Inicializar reproductor
    this.changeTrack(0)
  }

  setupAudioEvents() {
    // Evento de actualización de tiempo
    this.audioPlayer.addEventListener("timeupdate", () => {
      if (!isNaN(this.audioPlayer.duration)) {
        const percent = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100
        this.progressBar.style.width = `${percent}%`
        this.currentTime = this.audioPlayer.currentTime
        this.currentTimeEl.textContent = this.formatTime(this.currentTime)
      }
    })

    // Evento de fin de reproducción
    this.audioPlayer.addEventListener("ended", () => {
      this.nextTrack()
    })

    // Evento de audio listo para reproducir
    this.audioPlayer.addEventListener("canplaythrough", () => {
      this.audioLoaded = true
      this.showAudioStatus("Audio listo", "success")
    })

    // Evento de error de audio
    this.audioPlayer.addEventListener("error", (e) => {
      const errorTypes = [
        "Error desconocido",
        "Error de abortado",
        "Error de red",
        "Error de decodificación",
        "Formato no soportado",
      ]

      const errorCode = this.audioPlayer.error ? this.audioPlayer.error.code : 0
      const errorMessage = errorTypes[errorCode] || "Error desconocido"

      this.showAudioStatus(`Error: ${errorMessage}`, "error")
      console.error("Error de audio:", this.audioPlayer.error)

      // Activar el fallback de simulación
      this.activateFallbackMode()

      // Intentar con audio de depuración si está disponible
      if (this.debugAudio) {
        this.debugAudio.style.display = "block"
        this.debugAudio.src = this.tracks[this.currentTrack].audioUrl
      }
    })
  }

  setupUIEvents() {
    // Botón de reproducir/pausar
    this.playPauseBtn.addEventListener("click", () => this.togglePlay())

    // Botones de pista anterior/siguiente
    if (this.prevTrackBtn) {
      this.prevTrackBtn.addEventListener("click", () => this.prevTrack())
    }

    if (this.nextTrackBtn) {
      this.nextTrackBtn.addEventListener("click", () => this.nextTrack())
    }

    // Barra de progreso
    if (this.progressBarContainer) {
      this.progressBarContainer.addEventListener("click", (e) => {
        const width = this.progressBarContainer.clientWidth
        const clickX = e.offsetX
        const duration = this.tracks[this.currentTrack].duration

        this.currentTime = (clickX / width) * duration

        // Si hay audio disponible, actualizar la posición
        if (this.audioLoaded) {
          this.audioPlayer.currentTime = this.currentTime
        } else {
          // Actualizar manualmente si estamos en modo fallback
          this.currentTimeEl.textContent = this.formatTime(this.currentTime)
          this.progressBar.style.width = (clickX / width) * 100 + "%"
        }
      })
    }

    // Playlist tracks
    this.playlistTracks.forEach((track, index) => {
      track.addEventListener("click", () => {
        this.changeTrack(index)
        if (!this.isPlaying) {
          this.togglePlay()
        }
      })
    })

    // Play track buttons
    this.playTrackBtns.forEach((btn, index) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        this.changeTrack(index)
        if (!this.isPlaying) {
          this.togglePlay()
        }
      })
    })
  }

  // Mostrar mensaje de estado de audio
  showAudioStatus(message, type = "") {
    console.log(message)

    if (this.audioStatusEl) {
      this.audioStatusEl.textContent = message
      this.audioStatusEl.className = "audio-status"

      if (type) {
        this.audioStatusEl.classList.add(type)
      }

      // Limpiar mensaje después de un tiempo si no es un error
      if (type !== "error") {
        setTimeout(() => {
          this.audioStatusEl.textContent = ""
          this.audioStatusEl.className = "audio-status"
        }, 3000)
      }
    }
  }

  // Activar modo de fallback si hay problemas con el audio
  activateFallbackMode() {
    this.audioLoaded = false
    if (!this.timer && this.isPlaying) {
      this.timer = setInterval(() => this.updateProgress(), 1000)
    }
  }

  // Formatear tiempo en minutos:segundos
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  // Reproducir/Pausar
  togglePlay() {
    this.isPlaying = !this.isPlaying

    if (this.isPlaying) {
      this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'

      // Intentar reproducir el audio
      const playPromise = this.audioPlayer.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Reproducción exitosa
            this.showAudioStatus("Reproduciendo...", "success")
            clearInterval(this.timer) // Limpiar el timer de fallback si estaba activo
          })
          .catch((error) => {
            console.error("Error al reproducir:", error)
            this.showAudioStatus("Error al reproducir", "error")
            // Activar fallback para simulación
            this.activateFallbackMode()
          })
      } else {
        // Navegador antiguo que no soporta promesas en play()
        this.activateFallbackMode()
      }
    } else {
      this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'
      this.audioPlayer.pause()
      clearInterval(this.timer)
      this.showAudioStatus("Pausado")
    }
  }

  // Actualizar barra de progreso (fallback)
  updateProgress() {
    if (this.isPlaying) {
      this.currentTime++
      const percent = (this.currentTime / this.tracks[this.currentTrack].duration) * 100
      this.progressBar.style.width = `${percent}%`
      this.currentTimeEl.textContent = this.formatTime(this.currentTime)

      if (this.currentTime >= this.tracks[this.currentTrack].duration) {
        this.nextTrack()
      }
    }
  }

  // Precargar audio
  async preloadAudio(url) {
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

  // Cambiar pista
  async changeTrack(index) {
    clearInterval(this.timer)
    this.currentTrack = index
    this.currentTime = 0
    this.audioLoaded = false

    // Detener reproducción actual
    this.audioPlayer.pause()

    // Actualizar pista activa en la playlist
    this.playlistTracks.forEach((track, i) => {
      if (i === index) {
        track.classList.add("active")
      } else {
        track.classList.remove("active")
      }
    })

    // Actualizar información de la pista
    this.trackTitle.textContent = this.tracks[index].title
    this.trackArtist.textContent = this.tracks[index].artist
    this.totalTimeEl.textContent = this.formatTime(this.tracks[index].duration)
    this.currentTimeEl.textContent = "0:00"
    this.progressBar.style.width = "0%"

    // Configurar nueva fuente de audio
    if (this.tracks[index].audioUrl) {
      try {
        // Intentar precargar el audio
        this.showAudioStatus("Cargando audio...")

        // Configurar el audio principal
        this.audioPlayer.src = this.tracks[index].audioUrl
        this.audioPlayer.load()

        // También configurar el audio de depuración si está disponible
        if (this.debugAudio) {
          this.debugAudio.src = this.tracks[index].audioUrl
        }

        // Intentar precargar en paralelo
        this.preloadAudio(this.tracks[index].audioUrl)
          .then((preloaded) => {
            if (preloaded) {
              this.showAudioStatus("Audio precargado correctamente", "success")
            }
          })
          .catch(() => {
            this.showAudioStatus("Error en precarga", "error")
          })
      } catch (error) {
        console.error("Error al precargar audio:", error)
        this.showAudioStatus("Error al cargar audio", "error")
        this.activateFallbackMode()
      }
    } else {
      this.showAudioStatus("No hay audio disponible para esta pista", "error")
      this.activateFallbackMode()
    }

    // Si estaba reproduciendo, seguir reproduciendo
    if (this.isPlaying) {
      if (this.tracks[index].audioUrl) {
        this.audioPlayer.play().catch((error) => {
          console.error("Error al reproducir:", error)
          this.showAudioStatus("Error al reproducir", "error")
          this.activateFallbackMode()
        })
      } else {
        this.activateFallbackMode()
      }
    }
  }

  // Siguiente pista
  nextTrack() {
    let nextIndex = this.currentTrack + 1
    if (nextIndex >= this.tracks.length) {
      nextIndex = 0
    }
    this.changeTrack(nextIndex)
  }

  // Pista anterior
  prevTrack() {
    let prevIndex = this.currentTrack - 1
    if (prevIndex < 0) {
      prevIndex = this.tracks.length - 1
    }
    this.changeTrack(prevIndex)
  }
}

// Inicializar el reproductor cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si estamos en la página de éxitos
  if (document.getElementById("play-pause")) {
    window.audioPlayerManager = new AudioPlayerManager()
  }
})

