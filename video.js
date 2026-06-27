const params = new URLSearchParams(window.location.search);
const videoId = params.get("id");

const currentVideo = videos.find(function(video) {
    return video.id === videoId;
});

const suggestedList = document.getElementById("suggested-list");

const youtubePlayer = document.getElementById("youtube-player");
const sitePlayer = document.getElementById("site-player");
const sitePlayerSource = document.getElementById("site-player-source");

const videoErrorBox = document.getElementById("video-error-box");
const videoErrorText = document.getElementById("video-error-text");
const downloadVideoBtn = document.getElementById("download-video-btn");
const openVideoBtn = document.getElementById("open-video-btn");

const videoTitle = document.getElementById("video-title");
const channelName = document.getElementById("channel-name");
const videoSubscribers = document.getElementById("video-subscribers");
const videoViews = document.getElementById("video-views");
const videoDate = document.getElementById("video-date");
const videoDescription = document.getElementById("video-description");
const channelAvatar = document.getElementById("channel-avatar");

function createSuggestedCard(video) {

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

function renderSuggestedVideos() {

    suggestedList.innerHTML = "";

    const suggestedVideos = videos.filter(function(video) {

        return video.id !== currentVideo.id;

    });

    suggestedVideos.forEach(function(video) {

        suggestedList.innerHTML += createSuggestedCard(video);

    });

    const suggestedCards = document.querySelectorAll(".suggested-card");

    suggestedCards.forEach(function(card){

      card.addEventListener("click",function(){

        const id = card.dataset.id;

        window.location.href = `video.html?id=${id}`;

      });

    });

}

function hideAllPlayersAndErrors() {
    youtubePlayer.style.display = "none";
    sitePlayer.style.display = "none";
    
}

function setupDownloadAndOpenButtons(videoUrl) {
    downloadVideoBtn.href = videoUrl;
    openVideoBtn.href = videoUrl;
}

function setupSiteVideo(videoUrl) {
    hideAllPlayersAndErrors();

    youtubePlayer.src = "";

    sitePlayer.pause();
    sitePlayerSource.src = videoUrl;

    const lowerUrl = videoUrl.toLowerCase();

    if (lowerUrl.endsWith(".mp4")) {
        sitePlayerSource.type = "video/mp4";
    } else if (lowerUrl.endsWith(".webm")) {
        sitePlayerSource.type = "video/webm";
    } else {
        sitePlayerSource.removeAttribute("type");
    }

    sitePlayer.style.display = "block";
    sitePlayer.load();

    setupDownloadAndOpenButtons(videoUrl);
}

function showVideoError(message) {
    sitePlayer.style.display = "none";
    videoErrorBox.style.display = "block";
    videoErrorText.textContent = message;
}

if (currentVideo) {
    videoTitle.textContent = currentVideo.title;
    channelName.textContent = currentVideo.channel;
    videoSubscribers.textContent = currentVideo.subscribers;
    videoViews.textContent = currentVideo.views;
    videoDate.textContent = currentVideo.date;
    videoDescription.textContent = currentVideo.description;
    channelAvatar.textContent = currentVideo.avatar;

    if (currentVideo.type === "youtube") {
        hideAllPlayersAndErrors();
        youtubePlayer.style.display = "block";
        youtubePlayer.src = currentVideo.src;
    }

    else if (currentVideo.type === "site") {
        setupSiteVideo(currentVideo.src);
    }
}
else {
    hideAllPlayersAndErrors();
    videoTitle.textContent = "ویدئو پیدا نشد";
    videoDescription.textContent = "شناسهٔ این ویدئو معتبر نیست.";
}

renderSuggestedVideos();



/* اگر فایل site لود نشد */
sitePlayer.addEventListener("error", function() {
    showVideoError("این فایل ویدئویی در مرورگر پخش نشد. می‌توانی آن را دانلود کنی یا لینک مستقیمش را باز کنی.");
});

/* اگر source داخل video خطا داد */
sitePlayerSource.addEventListener("error", function() {
    showVideoError("منبع ویدئو بارگذاری نشد. احتمالاً فرمت فایل، سرور، یا لینک برای پخش مستقیم مناسب نیست.");
});



const subscribeButton = document.getElementById("subscribe-btn");

if (subscribeButton) {
    subscribeButton.addEventListener("click", function() {
        if (subscribeButton.classList.contains("subscribed")) {
            subscribeButton.classList.remove("subscribed");
            subscribeButton.textContent = "Subscribe";
        } else {
            subscribeButton.classList.add("subscribed");
            subscribeButton.textContent = "Subscribed";
        }
    });
}






const likeButton = document.getElementById("like-btn");
const likeCountElement = document.getElementById("like-count");

if (likeButton && likeCountElement) {
    let likeCount = Number(likeCountElement.textContent);
    let isLiked = false;
    const likeStorageKey = "like-" + currentVideo.id;

    const savedLike = localStorage.getItem(likeStorageKey);

    if(savedLike === "true"){

        isLiked = true;

        likeButton.classList.add("liked");

        likeCount++;

    }

    function formatLikeCount(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1).replace(".0", "") + "M";
        }

        if (number >= 1000) {
            return (number / 1000).toFixed(1).replace(".0", "") + "K";
        }

        return number;
    }

    likeCountElement.textContent = formatLikeCount(likeCount);

    likeButton.addEventListener("click", function() {
        if (isLiked) {
            likeCount--;
            isLiked = false;
            likeButton.classList.remove("liked");
            localStorage.setItem(likeStorageKey,"false");
        } else {
            likeCount++;
            isLiked = true;
            likeButton.classList.add("liked");
            localStorage.setItem(likeStorageKey,"true");
        }

        likeCountElement.textContent = formatLikeCount(likeCount);
    });
}


const themeButton = document.getElementById("theme-btn");

if(themeButton){

    if(localStorage.getItem("theme")==="dark"){

        document.body.classList.add("dark-mode");
        themeButton.textContent="☀️";

    }

    themeButton.addEventListener("click",function(){

        document.body.classList.toggle("dark-mode");

        if(document.body.classList.contains("dark-mode")){

            localStorage.setItem("theme","dark");

            themeButton.textContent="☀️";

        }else{

            localStorage.setItem("theme","light");

            themeButton.textContent="🌙";

        }

    });

}