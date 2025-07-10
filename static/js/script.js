const commonGifs = [
  "gifs/hi.gif",
  "gifs/hello.gif",
  "gifs/yo.gif",
];

const songs = [
  {
    title: "nope your too late i already died (slowed)",
    artist: "wifiskeleton",
    src: "songs/deds.mp3",
    plays: 12,
    favorite: true,
    weeklySession: true,
  },
  {
    title: "nope your too late i already died",
    artist: "wifiskeleton",
    src: "songs/ded.mp3",
    plays: 5,
    favorite: false,
    weeklySession: true,
  },
  {
    title: "strangers",
    artist: "proderics",
    src: "songs/strange.mp3",
    plays: 22,
    favorite: true,
    weeklySession: true,
  },
  {
    title: "i threw a rock off an overpass and killed a guy",
    artist: "sign crushes motorist",
    src: "songs/tweak.mp3",
    plays: 22,
    favorite: true,
    weeklySession: true,
  },
  {
    title: "Nuts (slowed)",
    artist: "Lil peep",
    src: "songs/nutss.mp3",
    plays: 22,
    favorite: true,
    weeklySession: true,
  },
  {
    title: "Nuts (extended + sped up)",
    artist: "Lil peep",
    src: "songs/nuts.mp3",
    plays: 22,
    favorite: true,
    weeklySession: true,
  },
  {
    title: "The love I lost (slowed + extended version)",
    artist: "Fried by flouride",
    src: "songs/lost.mp3",
    plays: 22,
    favorite: true,
    weeklySession: true,
  },
  {
    title: "Skin",
    artist: "otuka",
    src: "songs/skin.mp3",
    plays: 22,
    favorite: true,
    weeklySession: true,
  },
  {
    title: "August 10 (slowed + reverb)",
    artist: "Julie Doiron",
    src: "songs/august.mp3",
    plays: 22,
    favorite: true,
    weeklySession: true,
  },
  // altre canzoni qui...
];

// Aggiungiamo a ogni canzone le gif comuni
songs.forEach(song => {
  song.coverGifs = commonGifs;
});

let currentSongIndex = 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;
let audio = new Audio();
let coverInterval = null;
let currentGifIndex = 0;

const coverImg = document.getElementById("cover");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");

const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

const menuBtn = document.getElementById("menu-btn");
const dropdown = document.getElementById("dropdown");

const searchInput = document.getElementById("search-input");
const mostListenedEl = document.getElementById("most-listened");
const weeklySessionsEl = document.getElementById("weekly-sessions");
const favoritesEl = document.getElementById("favorites");
const allSongsEl = document.getElementById("all-songs");

function loadSong(index) {
  const song = songs[index];
  currentSongIndex = index;
  audio.src = song.src;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  currentGifIndex = 0;
  clearInterval(coverInterval);
  updateCoverGif();
  if (song.coverGifs.length > 1) {
    coverInterval = setInterval(() => {
      currentGifIndex = (currentGifIndex + 1) % song.coverGifs.length;
      updateCoverGif();
    }, 5000);
  }
}

function updateCoverGif() {
  coverImg.src = songs[currentSongIndex].coverGifs[currentGifIndex];
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function togglePlay() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

function prevSong() {
  if (shuffle) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex--;
    if (currentSongIndex < 0) currentSongIndex = songs.length - 1;
  }
  loadSong(currentSongIndex);
  playSong();
}

function nextSong() {
  if (shuffle) {
    currentSongIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) currentSongIndex = 0;
  }
  loadSong(currentSongIndex);
  playSong();
}

function toggleShuffle() {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active", shuffle);
}

function toggleRepeat() {
  repeat = !repeat;
  repeatBtn.classList.toggle("active", repeat);
}

audio.addEventListener("ended", () => {
  if (repeat) {
    playSong();
  } else {
    nextSong();
  }
});

audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  if (duration) {
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    let currentM = Math.floor(currentTime / 60);
    let currentS = Math.floor(currentTime % 60);
    if (currentS < 10) currentS = "0" + currentS;

    let durM = Math.floor(duration / 60);
    let durS = Math.floor(duration % 60);
    if (durS < 10) durS = "0" + durS;

    currentTimeEl.textContent = `${currentM}:${currentS}`;
    durationEl.textContent = `${durM}:${durS}`;
  }
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
});

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
shuffleBtn.addEventListener("click", toggleShuffle);
repeatBtn.addEventListener("click", toggleRepeat);

menuBtn.addEventListener("click", () => {
  dropdown.classList.toggle("hidden");
  searchInput.value = "";
  renderAllSongs(songs);
});

function renderSongList(container, list) {
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<li>Nessuna canzone</li>";
    return;
  }
  list.forEach((song) => {
    const li = document.createElement("li");
    li.textContent = song.title + " - " + song.artist;
    li.addEventListener("click", () => {
      loadSong(songs.indexOf(song));
      playSong();
      dropdown.classList.add("hidden");
    });
    container.appendChild(li);
  });
}

function renderAllSongs(list) {
  renderSongList(allSongsEl, list);
}

function renderMostListened() {
  const sorted = [...songs].sort((a, b) => b.plays - a.plays);
  renderSongList(mostListenedEl, sorted.slice(0, 5));
}

function renderWeeklySessions() {
  const weekly = songs.filter((s) => s.weeklySession);
  renderSongList(weeklySessionsEl, weekly);
}

function renderFavorites() {
  const favs = songs.filter((s) => s.favorite);
  renderSongList(favoritesEl, favs);
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  const filtered = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(term) ||
      s.artist.toLowerCase().includes(term)
  );
  renderSongList(allSongsEl, filtered);
});

renderMostListened();
renderWeeklySessions();
renderFavorites();

// Carica la prima canzone all'avvio
loadSong(0);
