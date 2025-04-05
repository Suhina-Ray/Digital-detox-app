const audioPlayer = document.getElementById("audioPlayer");
const musicSelect = document.getElementById("musicSelect");

musicSelect.addEventListener("change", () => {
  audioPlayer.src = musicSelect.value;
  audioPlayer.play();
});
