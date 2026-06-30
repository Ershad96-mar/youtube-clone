/*==========================================================
    script.js (Part 1 / 4)
==========================================================*/

/* ---------------- DOM ---------------- */

const videosGrid = document.getElementById("videos-grid");

const categoryButtons =
document.querySelectorAll(".category-btn");

const searchInput =
document.querySelector(".search-input");

const searchButton =
document.querySelector(".search-btn");

const menuButton =
document.querySelector(".menu-btn");

const pageContent =
document.querySelector(".page-content");

const playlistSidebar =
document.querySelector(".playlist-sidebar");

const homeSidebar =
document.querySelector(".home-sidebar");

const themeButton =
document.getElementById("theme-btn");

/* ---------- Navbar ---------- */

const loginBtn =
document.getElementById("login-btn");

const registerBtn =
document.getElementById("register-btn");

const logoutBtn =
document.getElementById("logout-btn");

const profileBtn =
document.getElementById("profile-btn");

const createBtn =
document.getElementById("create-btn");

/* ---------------- Variables ---------------- */

let videos = [];

let playlist =
JSON.parse(
localStorage.getItem("playlist")
) || [];

let selectedCategory = "همه";

let searchText = "";

let showingPlaylist = false;

let visibleVideos = 8;

const LOAD_MORE = 8;

/*==========================================================
                    NAVBAR
==========================================================*/

function updateNavbar(){

    const token =
    localStorage.getItem("token");

    const username =
    localStorage.getItem("username");

    if(token){

        loginBtn.style.display="none";

        registerBtn.style.display="none";

        logoutBtn.style.display="inline-flex";

        profileBtn.style.display="flex";

        createBtn.style.display="inline-flex";

        if(username){

            profileBtn.textContent =
            username.charAt(0).toUpperCase();

        }

    }

    else{

        loginBtn.style.display="inline-flex";

        registerBtn.style.display="inline-flex";

        logoutBtn.style.display="none";

        profileBtn.style.display="none";

        createBtn.style.display="none";

    }

}

updateNavbar();

/*==========================================================
                  NAVBAR EVENTS
==========================================================*/

loginBtn.addEventListener("click",function(){

    location.href="login.html";

});

registerBtn.addEventListener("click",function(){

    location.href="register.html";

});

createBtn.addEventListener("click",function(){

    location.href="studio.html";

});

profileBtn.addEventListener("click",function(){

    location.href="channel.html";

});

logoutBtn.addEventListener("click",function(){

    localStorage.removeItem("token");

    localStorage.removeItem("username");

    localStorage.removeItem("role");

    location.reload();

});

/*==========================================================
                    DARK MODE
==========================================================*/

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

        }

        else{

            localStorage.setItem("theme","light");

            themeButton.textContent="🌙";

        }

    });

}

/*==========================================================
                PLAYLIST FUNCTIONS
==========================================================*/

function savePlaylist(){

    localStorage.setItem(

        "playlist",

        JSON.stringify(playlist)

    );

}

function togglePlaylist(id){

    if(playlist.includes(id)){

        playlist = playlist.filter(function(item){

            return item!==id;

        });

    }

    else{

        playlist.push(id);

    }

    savePlaylist();

}


/*==========================================================
    script.js (Part 2 / 4)
==========================================================*/

/*==========================================================
            CREATE VIDEO CARD
==========================================================*/

function createVideoCard(video){

    const playlistText =

    playlist.includes(video.id)

    ?

    "✔ Remove from Playlist"

    :

    "➕ Save to Playlist";

    return `

    <div

        class="video-card"

        data-id="${video.id}"

        data-category="${video.category}"

    >

        <div class="thumbnail-box">

            <img

                src="${video.image}"

                alt="${video.title}"

            >

            <span class="video-time">

                ${video.duration}

            </span>

        </div>

        <div class="video-details">

            <div class="channel-avatar">

                ${video.avatar}

            </div>

            <div class="video-text">

                <h3>${video.title}</h3>

                <p>${video.channel}</p>

                <p>

                    ${video.views}

                    •

                    ${video.date}

                </p>

            </div>

            <div class="video-menu-wrapper">

                <button

                    class="more-btn"

                >

                    ⋮

                </button>

                <div class="video-menu">

                    <div

                        class="video-menu-item playlist-btn"

                        data-id="${video.id}"

                    >

                        ${playlistText}

                    </div>

                    <div class="video-menu-item">

                        Add to Queue

                    </div>

                    <div class="video-menu-item">

                        Share

                    </div>

                    <div class="video-menu-item">

                        Not Interested

                    </div>

                </div>

            </div>

        </div>

    </div>

    `;

}

/*==========================================================
          FILTER VIDEOS
==========================================================*/

function getFilteredVideos(){

    return videos.filter(function(video){

        const categoryMatch =

            selectedCategory==="همه"

            ||

            video.category.toLowerCase()

            ===

            selectedCategory.toLowerCase();

        const titleMatch =

            video.title

            .toLowerCase()

            .includes(searchText);

        const playlistMatch =

            !showingPlaylist

            ||

            playlist.includes(video.id);

        return (

            categoryMatch &&

            titleMatch &&

            playlistMatch

        );

    });

}

/*==========================================================
              RENDER VIDEOS
==========================================================*/

function renderVideos(){

    const filteredVideos =

    getFilteredVideos();

    if(filteredVideos.length===0){

        videosGrid.innerHTML=`

        <h2

            style="

            width:100%;

            text-align:center;

            margin-top:40px;

            "

        >

        No Videos Found

        </h2>

        `;

        return;

    }

    videosGrid.innerHTML="";

    const visible=

    filteredVideos.slice(

        0,

        visibleVideos

    );

    visible.forEach(function(video){

        videosGrid.innerHTML+=

        createVideoCard(video);

    });

    attachVideoEvents();

    attachMenuEvents();

    attachPlaylistEvents();

}

/*==========================================================
          PLAYLIST EVENTS
==========================================================*/

function attachPlaylistEvents(){

    const buttons=

    document.querySelectorAll(

        ".playlist-btn"

    );

    buttons.forEach(function(button){

        button.addEventListener(

            "click",

            function(event){

                event.stopPropagation();

                togglePlaylist(

                    button.dataset.id

                );

                renderVideos();

            }

        );

    });

}

/*==========================================================
            VIDEO CLICK
==========================================================*/

function attachVideoEvents(){

    const cards=

    document.querySelectorAll(

        ".video-card"

    );

    cards.forEach(function(card){

        card.addEventListener(

            "click",

            function(event){

                if(

                    event.target.closest(".more-btn")

                    ||

                    event.target.closest(".video-menu")

                ){

                    return;

                }

                location.href=

                "video.html?id="+

                card.dataset.id;

            }

        );

    });

}



/*==========================================================
    script.js (Part 3 / 4)
==========================================================*/

/*==========================================================
            MORE MENU
==========================================================*/

function attachMenuEvents(){

    const buttons=

    document.querySelectorAll(

        ".more-btn"

    );

    buttons.forEach(function(button){

        button.addEventListener(

            "click",

            function(event){

                event.stopPropagation();

                const menu=

                button.parentElement.querySelector(

                    ".video-menu"

                );

                document

                .querySelectorAll(".video-menu")

                .forEach(function(item){

                    if(item!==menu){

                        item.classList.remove("show");

                    }

                });

                menu.classList.toggle("show");

            }

        );

    });

}

/*==========================================================
            CLOSE MENUS
==========================================================*/

document.addEventListener(

    "click",

    function(){

        document

        .querySelectorAll(".video-menu")

        .forEach(function(menu){

            menu.classList.remove("show");

        });

    }

);

/*==========================================================
            CATEGORY FILTER
==========================================================*/

categoryButtons.forEach(function(button){

    button.addEventListener(

        "click",

        function(){

            categoryButtons.forEach(function(btn){

                btn.classList.remove(

                    "active-category"

                );

            });

            button.classList.add(

                "active-category"

            );

            selectedCategory=

            button.textContent.trim();

            visibleVideos=8;

            renderVideos();

        }

    );

});

/*==========================================================
                SEARCH
==========================================================*/

function doSearch(){

    searchText=

    searchInput.value

    .toLowerCase()

    .trim();

    visibleVideos=8;

    renderVideos();

}

if(searchButton){

    searchButton.addEventListener(

        "click",

        doSearch

    );

}

if(searchInput){

    searchInput.addEventListener(

        "keyup",

        function(event){

            if(event.key==="Enter"){

                doSearch();

            }

        }

    );

    searchInput.addEventListener(

        "input",

        doSearch

    );

}

/*==========================================================
            SIDEBAR
==========================================================*/

if(menuButton){

    menuButton.addEventListener(

        "click",

        function(){

            pageContent.classList.toggle(

                "sidebar-closed"

            );

        }

    );

}

/*==========================================================
            PLAYLIST PAGE
==========================================================*/

playlistSidebar.addEventListener(

    "click",

    function(){

        showingPlaylist=true;

        visibleVideos=8;

        renderVideos();

    }

);

homeSidebar.addEventListener(

    "click",

    function(){

        showingPlaylist=false;

        visibleVideos=8;

        renderVideos();

    }

);

/*==========================================================
            INFINITE SCROLL
==========================================================*/

window.addEventListener(

    "scroll",

    function(){

        const scroll=

        window.innerHeight+

        window.scrollY;

        const page=

        document.body.offsetHeight;

        if(scroll>=page-200){

            visibleVideos+=LOAD_MORE;

            renderVideos();

        }

    }

);


/*==========================================================
    script.js (Part 4 / 4)
==========================================================*/

/*==========================================================
            LOAD VIDEOS
==========================================================*/

async function loadVideos(){

    try{

        const response = await fetch("/api/videos");

        if(!response.ok){

            throw new Error("Cannot load videos");

        }

        videos = await response.json();

        renderVideos();

    }

    catch(error){

        console.error(error);

        videosGrid.innerHTML=`

        <div
            style="
                width:100%;
                text-align:center;
                margin-top:50px;
                font-size:20px;
                color:red;
            "
        >

            Failed to load videos.

        </div>

        `;

    }

}

/*==========================================================
            AUTHORIZATION HEADER
==========================================================*/

function getAuthHeaders(){

    const token = localStorage.getItem("token");

    if(!token){

        return {};

    }

    return{

        Authorization:`Bearer ${token}`

    };

}

/*==========================================================
            DELETE VIDEO
==========================================================*/

async function deleteVideo(id){

    if(!confirm("Delete this video?")){

        return;

    }

    try{

        const response = await fetch(

            "/api/videos/"+id,

            {

                method:"DELETE",

                headers:getAuthHeaders()

            }

        );

        const data = await response.json();

        alert(data.message);

        loadVideos();

    }

    catch(error){

        console.log(error);

    }

}

/*==========================================================
            UPDATE VIDEO
==========================================================*/

async function updateVideo(id,video){

    try{

        const response = await fetch(

            "/api/videos/"+id,

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json",

                    ...getAuthHeaders()

                },

                body:JSON.stringify(video)

            }

        );

        const data = await response.json();

        console.log(data);

        loadVideos();

    }

    catch(error){

        console.log(error);

    }

}

/*==========================================================
            ADD VIDEO
==========================================================*/

async function addVideo(video){

    try{

        const response = await fetch(

            "/api/videos",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    ...getAuthHeaders()

                },

                body:JSON.stringify(video)

            }

        );

        const data = await response.json();

        console.log(data);

        loadVideos();

    }

    catch(error){

        console.log(error);

    }

}

/*==========================================================
            WINDOW LOAD
==========================================================*/

window.addEventListener(

    "load",

    function(){

        updateNavbar();

        loadVideos();

    }

);

/*==========================================================
            EXPORT (Future)
==========================================================*/

window.YouTubeClone={

    loadVideos,

    addVideo,

    updateVideo,

    deleteVideo,

    renderVideos

};

/*==========================================================
                    END OF FILE
==========================================================*/