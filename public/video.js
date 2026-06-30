// ======================================
// Video Page
// Part 1
// ======================================

// ----------------------------
// URL Parameters
// ----------------------------

const params = new URLSearchParams(window.location.search);
const videoId = params.get("id");

// ----------------------------
// Data
// ----------------------------

let videos = [];
let currentVideo = null;

// ----------------------------
// HTML Elements
// ----------------------------

const videoTitle = document.getElementById("video-title");
const channelName = document.getElementById("channel-name");
const channelAvatar = document.getElementById("channel-avatar");

const videoSubscribers =
document.getElementById("video-subscribers");

const videoViews =
document.getElementById("video-views");

const videoDate =
document.getElementById("video-date");

const videoDescription =
document.getElementById("video-description");

const suggestedList =
document.getElementById("suggested-list");

// ----------------------------
// Players
// ----------------------------

const youtubePlayer =
document.getElementById("youtube-player");

const sitePlayer =
document.getElementById("site-player");

const sitePlayerSource =
document.getElementById("site-player-source");

// ----------------------------
// Error Box
// ----------------------------

const videoErrorBox =
document.getElementById("video-error-box");

const videoErrorText =
document.getElementById("video-error-text");

const downloadVideoBtn =
document.getElementById("download-video-btn");

const openVideoBtn =
document.getElementById("open-video-btn");

// ======================================
// Helper Functions
// ======================================

function hideEverything(){

    youtubePlayer.style.display = "none";
    sitePlayer.style.display = "none";
    videoErrorBox.style.display = "none";

}

function showError(message){

    hideEverything();

    videoErrorBox.style.display = "block";

    videoErrorText.textContent = message;

}

function setupDownloadButtons(url){

    downloadVideoBtn.href = url;
    openVideoBtn.href = url;

}

// ======================================
// Site Player
// ======================================

function playSiteVideo(url){

    hideEverything();

    youtubePlayer.src = "";

    sitePlayer.pause();

    sitePlayerSource.src = url;

    const lower = url.toLowerCase();

    if(lower.endsWith(".mp4")){

        sitePlayerSource.type = "video/mp4";

    }

    else if(lower.endsWith(".webm")){

        sitePlayerSource.type = "video/webm";

    }

    else{

        sitePlayerSource.removeAttribute("type");

    }

    sitePlayer.style.display = "block";

    sitePlayer.load();

    setupDownloadButtons(url);

}

// ======================================
// Youtube Player
// ======================================

function playYoutubeVideo(url){

    hideEverything();

    youtubePlayer.style.display = "block";

    youtubePlayer.src = url;

}

// ======================================
// Suggested Videos
// ======================================

function createSuggestedCard(video){

    return `

    <div class="suggested-card" data-id="${video.id}">

        <img src="${video.image}" alt="${video.title}">

        <div class="suggested-info">

            <h4>${video.title}</h4>

            <p>${video.channel}</p>

            <p>${video.views} • ${video.date}</p>

        </div>

    </div>

    `;

}

function renderSuggestedVideos(){

    if(!currentVideo){

        return;

    }

    suggestedList.innerHTML = "";

    const suggestedVideos = videos.filter(function(video){

        return video.id !== currentVideo.id;

    });

    suggestedVideos.forEach(function(video){

        suggestedList.innerHTML += createSuggestedCard(video);

    });

    const cards =
    document.querySelectorAll(".suggested-card");

    cards.forEach(function(card){

        card.addEventListener("click",function(){

            window.location.href =
            "video.html?id=" + card.dataset.id;

        });

    });

}

// ======================================
// Player Errors
// ======================================

sitePlayer.addEventListener("error",function(){

    showError(
        "This video cannot be played in your browser."
    );

});

sitePlayerSource.addEventListener("error",function(){

    showError(
        "Video source could not be loaded."
    );

});

// ======================================
// Load Video Information
// ======================================

function loadVideo(){

    if(!currentVideo){

        showError("Video not found.");

        return;

    }

    videoTitle.textContent = currentVideo.title;

    channelName.textContent = currentVideo.channel;

    channelAvatar.textContent = currentVideo.avatar;

    videoSubscribers.textContent =
    currentVideo.subscribers;

    videoViews.textContent =
    currentVideo.views;

    videoDate.textContent =
    currentVideo.date;

    videoDescription.textContent =
    currentVideo.description;

    if(currentVideo.type === "youtube"){

        playYoutubeVideo(currentVideo.src);

    }

    else if(currentVideo.type === "site"){

        playSiteVideo(currentVideo.src);

    }

    else{

        showError("Unknown video type.");

    }

    renderSuggestedVideos();

    initializeSubscribe();

    initializeLike();

}

// ======================================
// Subscribe
// ======================================

function initializeSubscribe(){

    const button =
    document.getElementById("subscribe-btn");

    if(!button){

        return;

    }

    const key =
    "subscribe-" + currentVideo.channel;

    const subscribed =
    localStorage.getItem(key) === "true";

    if(subscribed){

        button.classList.add("subscribed");

        button.textContent = "Subscribed";

    }

    else{

        button.classList.remove("subscribed");

        button.textContent = "Subscribe";

    }

    button.onclick = function(){

        const state =
        button.classList.contains("subscribed");

        if(state){

            button.classList.remove("subscribed");

            button.textContent = "Subscribe";

            localStorage.setItem(key,"false");

        }

        else{

            button.classList.add("subscribed");

            button.textContent = "Subscribed";

            localStorage.setItem(key,"true");

        }

    };

}

// ======================================
// Like Button
// ======================================

function initializeLike(){

    const button =
    document.getElementById("like-btn");

    const counter =
    document.getElementById("like-count");

    if(!button || !counter){

        return;

    }

    const key =
    "like-" + currentVideo.id;

    let liked =
    localStorage.getItem(key) === "true";

    let likes =
    Number(counter.dataset.likes || 0);

    if(liked){

        button.classList.add("liked");

        likes++;

    }

    updateLikeText();

    button.onclick = function(){

        if(liked){

            liked = false;

            likes--;

            button.classList.remove("liked");

            localStorage.setItem(key,"false");

        }

        else{

            liked = true;

            likes++;

            button.classList.add("liked");

            localStorage.setItem(key,"true");

        }

        updateLikeText();

    };

    function updateLikeText(){

        counter.textContent =
        formatNumber(likes);

    }

}

// ======================================
// Number Formatter
// ======================================

function formatNumber(number){

    if(number >= 1000000){

        return (
            number / 1000000
        ).toFixed(1).replace(".0","") + "M";

    }

    if(number >= 1000){

        return (
            number / 1000
        ).toFixed(1).replace(".0","") + "K";

    }

    return number;

}

// ======================================
// Dark Mode
// ======================================

const themeButton =
document.getElementById("theme-btn");

if(themeButton){

    if(localStorage.getItem("theme")==="dark"){

        document.body.classList.add("dark-mode");

        themeButton.textContent="☀️";

    }

    themeButton.onclick=function(){

        document.body.classList.toggle("dark-mode");

        if(document.body.classList.contains("dark-mode")){

            localStorage.setItem("theme","dark");

            themeButton.textContent="☀️";

        }

        else{

            localStorage.setItem("theme","light");

            themeButton.textContent="🌙";

        }

    };

}

// ======================================
// Load Data
// ======================================

Promise.all([

    fetch("/api/videos")
    .then(function(response){

        return response.json();

    }),

    fetch("/api/videos/" + videoId)
    .then(function(response){

        return response.json();

    })

])

.then(function(result){

    videos = result[0];

    currentVideo = result[1];

    loadVideo();

})

.catch(function(error){

    console.log(error);

    showError("Unable to load video.");

});