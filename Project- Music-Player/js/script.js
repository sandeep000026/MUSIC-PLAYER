console.log("Let's Write Javascript");

let currentSong = new Audio();
let songs = [];
let currFolder = "";
let currentIndex = 0;

// Control buttons (make them global)
let play, previous, next;

// Convert seconds to mm:ss
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${m}:${s}`;
}

// Fetch songs from folder
async function getSongs(folderName) {
    currFolder = folderName;
    let responseText = "";
    try {
        let res = await fetch(`/songs/`);
        responseText = await res.text();
    } catch (e) {
        console.error("Cannot fetch songs folder:", e);
    }

    let div = document.createElement("div");
    div.innerHTML = responseText;

    let anchors = div.getElementsByTagName("a");
    songs = [];
    for (let a of anchors) {
        if (a.href.endsWith(".mp3")) songs.push(a.href.split("/songs/")[1]);
    }

    // Display playlist
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    songs.forEach((song, idx) => {
        let songName = decodeURIComponent(song);
        songUL.innerHTML += `<li data-index="${idx}">
            <img class="invert" width="34" src="../img/music.svg" alt="">
            <div class="info">
                <div>${songName}</div>
                <div>Sandeep</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="../img/play.svg" alt="">
            </div>
        </li>`;
    });

    // Attach click to each song
    Array.from(document.querySelectorAll(".songList li")).forEach(e => {
        e.addEventListener("click", () => {
            let index = parseInt(e.dataset.index);
            currentIndex = index;
            playSong(currentIndex);
        });
    });

    return songs;
}

// Play a song by index
function playSong(index) {
    if (!songs[index]) return;

    currentSong.src = `/songs/${songs[index]}`;
    currentSong.play();
    play.src = "../img/pause.svg";
    currentIndex = index;

    document.querySelector(".songinfo").innerText = decodeURIComponent(songs[index]);
    document.querySelector(".songtime").innerText = "00:00 / 00:00";
}

// Main function
async function main() {
    // Define buttons
    play = document.getElementById("play");
    previous = document.getElementById("previous");
    next = document.getElementById("next");

    // Load songs
    await getSongs("songs/ncs");
    currentIndex = 0;
    playSong(currentIndex);

    // Play/Pause toggle
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "../img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "../img/play.svg";
        }
    });

    // Previous button
    previous.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            playSong(currentIndex);
        }
    });

    // Next button
    next.addEventListener("click", () => {
        if (currentIndex < songs.length - 1) {
            currentIndex++;
            playSong(currentIndex);
        }
    });

    // Timeupdate
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerText = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Seekbar click
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width);
        currentSong.currentTime = currentSong.duration * percent;
        document.querySelector(".circle").style.left = (percent * 100) + "%";
    });

    // Hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // Close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Volume control
    const volumeInput = document.querySelector(".range input");
    const volumeIcon = document.querySelector(".volume > img");

    volumeInput.addEventListener("change", e => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) volumeIcon.src = "../img/volume.svg";
    });

    volumeIcon.addEventListener("click", () => {
        if (volumeIcon.src.includes("volume.svg")) {
            volumeIcon.src = "../img/mute.svg";
            currentSong.volume = 0;
            volumeInput.value = 0;
        } else {
            volumeIcon.src = "../img/volume.svg";
            currentSong.volume = 0.1;
            volumeInput.value = 10;
        }
    });
}

// Run
main();

// Album Card Click → Play Songs From That Folder
document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", async () => {
        const folder = card.getAttribute("data-folder");
        if (!folder) return;

        // Fetch songs from clicked album
        await getSongs(folder);
        currentIndex = 0;
        playSong(currentIndex);
    });
});



document.querySelector(".loginbtn").addEventListener("click",()=>{
    window.open("login.html","_same");
})
let a=document.querySelector(".loginbtn");
console.log(a);