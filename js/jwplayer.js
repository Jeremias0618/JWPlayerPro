const player = jwplayer("miPlayer");
const buttonsOverlay = document.getElementById('jw-buttons');

function loadVideo() {
  const videoUrl = document.getElementById("url-input").value.trim();
  if (!videoUrl) return alert("Por favor ingresa una URL válida.");

  const miPlayerDiv = document.getElementById("miPlayer");
  const isYouTube = /youtu\.be|youtube\.com/.test(videoUrl);
  const isVimeo = /vimeo\.com/.test(videoUrl);
  const isFacebook = /facebook\.com/.test(videoUrl);
  const isTwitch = /twitch\.tv/.test(videoUrl);
  const isMkv = videoUrl.toLowerCase().endsWith(".mkv");

    if (isYouTube) {
    const videoId = getYouTubeVideoId(videoUrl);
    if (videoId) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      iframe.width = "100%";
      iframe.height = "450";
      iframe.frameBorder = "0";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;

      miPlayerDiv.innerHTML = "";
      miPlayerDiv.appendChild(iframe);
    } else {
      alert("No se pudo extraer el ID del video de YouTube.");
    }
    return;
  }

  if (isMkv) {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.controls = true;
    video.autoplay = true;
    video.style.width = "100%";
    miPlayerDiv.innerHTML = "";
    miPlayerDiv.appendChild(video);
    return;
  }

  player.setup({
    file: videoUrl,
    width: "50%",
    aspectratio: "16:9",
    controls: true,
    autostart: false,
    ...(isVimeo && { type: "vimeo" }),
    ...(isFacebook && { type: "mp4" }),
    ...(isTwitch && { type: "mp4" })
  });

  player.on('ready', () => {
    moveButtonsToPlayer();
    const playerContainer = player.getContainer();
    playerContainer.addEventListener('click', showButtons);
    playerContainer.addEventListener('touchstart', showButtons);
  });

  player.on('fullscreen', () => {
    moveButtonsToPlayer();
  });

  player.on('pause', () => {
    document.getElementById("playpause-icon").src = "img/play_button.png";
    showButtons();
  });

  player.on('play', () => {
    document.getElementById("playpause-icon").src = "img/paused_button.png";
    showButtons();
  });

  player.on('controlbarVisibility', (event) => {
    if (!event.visible) hideButtons();
  });
}

function moveButtonsToPlayer() {
  const container = player.getContainer();
  container.appendChild(buttonsOverlay);
}

function getYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
