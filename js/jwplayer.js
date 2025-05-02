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
    ...(isYouTube && { type: "youtube" }),
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
