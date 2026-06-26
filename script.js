const categoryButtons = document.querySelectorAll(".category-btn");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-btn");
const videosGrid = document.getElementById("videos-grid");
const menuButton = document.querySelector(".menu-btn");
const pageContent = document.querySelector(".page-content");

let selectedCategory = "همه";
let searchText = "";

/* ---------------------------
   ساخت HTML هر کارت ویدئو
--------------------------- */
function createVideoCard(video) {
    return `
        <div class="video-card" data-id="${video.id}" data-category="${video.category}">
            <div class="thumbnail-box">
                <img src="${video.image}" alt="${video.title}">
                <span class="video-time">${video.duration}</span>
            </div>

            <div class="video-details">
                <div class="channel-avatar">${video.avatar}</div>

                <div class="video-text">
                    <h3>${video.title}</h3>
                    <p>${video.channel}</p>
                    <p>${video.views} • ${video.date}</p>
                </div>

                <div class="video-menu-wrapper">
                    <button class="more-btn">⋮</button>

                    <div class="video-menu">
                        <div class="video-menu-item">Save to Watch later</div>
                        <div class="video-menu-item">Add to queue</div>
                        <div class="video-menu-item">Share</div>
                        <div class="video-menu-item">Not interested</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* ---------------------------
   فیلتر کردن ویدئوها
   بر اساس دسته‌بندی + جستجو
--------------------------- */
function getFilteredVideos() {
    return videos.filter(function(video) {
        const categoryMatch =
            selectedCategory === "همه" ||
            video.category.toLowerCase() === selectedCategory.toLowerCase();

        const titleMatch =
            video.title.toLowerCase().includes(searchText);

        return categoryMatch && titleMatch;
    });
}

/* ---------------------------
   رندر کردن ویدئوها
--------------------------- */
function renderVideos() {
    const filteredVideos = getFilteredVideos();

    videosGrid.innerHTML = "";

    filteredVideos.forEach(function(video) {
        videosGrid.innerHTML += createVideoCard(video);
    });

    attachVideoCardEvents();
    attachMoreMenuEvents();
}

/* ---------------------------
   رویداد کلیک روی کارت ویدئو
--------------------------- */
function attachVideoCardEvents() {
    const videoCards = document.querySelectorAll(".video-card");

    videoCards.forEach(function(card) {
        card.addEventListener("click", function(event) {

            if (
                event.target.closest(".more-btn") ||
                event.target.closest(".video-menu")
            ) {
                return;
            }

            const videoId = card.dataset.id;
            window.location.href = `video.html?id=${videoId}`;
        });
    });
}

/* ---------------------------
   رویداد منوی سه‌نقطه
--------------------------- */
function attachMoreMenuEvents() {
    const moreButtons = document.querySelectorAll(".more-btn");

    moreButtons.forEach(function(button) {
        button.addEventListener("click", function(event) {
            event.stopPropagation();

            const menuWrapper = button.parentElement;
            const menu = menuWrapper.querySelector(".video-menu");

            document.querySelectorAll(".video-menu").forEach(function(otherMenu) {
                if (otherMenu !== menu) {
                    otherMenu.classList.remove("show");
                }
            });

            menu.classList.toggle("show");
        });
    });
}

/* ---------------------------
   کلیک روی دکمه‌های دسته‌بندی
--------------------------- */
categoryButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        categoryButtons.forEach(function(btn) {
            btn.classList.remove("active-category");
        });

        button.classList.add("active-category");
        selectedCategory = button.textContent.trim();

        renderVideos();
    });
});

/* ---------------------------
   جستجو با دکمه Search
--------------------------- */
if (searchButton) {
    searchButton.addEventListener("click", function() {
        searchText = searchInput.value.toLowerCase().trim();
        renderVideos();
    });
}

/* ---------------------------
   جستجو با Enter
--------------------------- */
if (searchInput) {
    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            searchText = searchInput.value.toLowerCase().trim();
            renderVideos();
        }
    });

    /* ---------------------------
       جستجو زنده هنگام تایپ
    --------------------------- */
    searchInput.addEventListener("input", function() {
        searchText = searchInput.value.toLowerCase().trim();
        renderVideos();
    });
}

/* ---------------------------
   بستن همه منوها با کلیک روی صفحه
--------------------------- */
document.addEventListener("click", function() {
    document.querySelectorAll(".video-menu").forEach(function(menu) {
        menu.classList.remove("show");
    });
});

/* ---------------------------
   باز و بسته شدن سایدبار
--------------------------- */
if (menuButton) {
    menuButton.addEventListener("click", function() {
        pageContent.classList.toggle("sidebar-closed");
    });
}

/* ---------------------------
   اولین بار که صفحه باز می‌شود
--------------------------- */
renderVideos();