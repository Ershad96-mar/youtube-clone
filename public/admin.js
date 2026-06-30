// ===========================================
// YouTube Studio Admin Dashboard
// admin.js
// Part 1
// ===========================================

// ===========================================
// Elements
// ===========================================

const table =
document.getElementById("videos-table");

const searchInput =
document.getElementById("search-input");

const refreshButton =
document.getElementById("refresh-btn");

const uploadButton =
document.getElementById("new-video-btn");

const themeButton =
document.getElementById("theme-btn");

const logoutButton =
document.getElementById("logout-btn");

const sidebar =
document.getElementById("sidebar");

const menuButton =
document.getElementById("menu-btn");

const toast =
document.getElementById("toast");

const loadingScreen =
document.getElementById("loading-screen");

const editModal =
document.getElementById("edit-modal");

const deleteModal =
document.getElementById("delete-modal");

const closeEditModal =
document.getElementById("close-edit-modal");

const cancelEdit =
document.getElementById("cancel-edit");

const cancelDelete =
document.getElementById("cancel-delete");

const confirmDelete =
document.getElementById("confirm-delete");

const editForm =
document.getElementById("edit-form");

// ===========================================
// Statistics
// ===========================================

const totalVideos =
document.getElementById("total-videos");

const totalUsers =
document.getElementById("total-users");

const totalViews =
document.getElementById("total-views");

const totalComments =
document.getElementById("total-comments");

// ===========================================
// Edit Inputs
// ===========================================

const editId =
document.getElementById("edit-id");

const editTitle =
document.getElementById("edit-title");

const editChannel =
document.getElementById("edit-channel");

const editCategory =
document.getElementById("edit-category");

const editViews =
document.getElementById("edit-views");

const editSubscribers =
document.getElementById("edit-subscribers");

const editDescription =
document.getElementById("edit-description");

// ===========================================
// Data
// ===========================================

let videos = [];

let deleteVideoId = null;

// ===========================================
// Helpers
// ===========================================

function showLoading(){

    loadingScreen.style.display="flex";

}

function hideLoading(){

    loadingScreen.style.display="none";

}

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(function(){

        toast.classList.remove("show");

    },2500);

}

// ===========================================
// Render Table
// ===========================================

function renderVideos(data){

    table.innerHTML = "";

    data.forEach(function(video){

        table.innerHTML += `

<tr>

<td>

<img
src="${video.image}"
alt="">

</td>

<td>

${video.title}

</td>

<td>

${video.channel}

</td>

<td>

${video.views}

</td>

<td>

${video.date}

</td>

<td>

${video.category}

</td>

<td>

<div class="action-buttons">

<button
class="edit-btn"
data-id="${video.id}">

Edit

</button>

<button
class="delete-btn"
data-id="${video.id}">

Delete

</button>

</div>

</td>

</tr>

`;

    });

    attachButtons();

}

// ===========================================
// Statistics
// ===========================================

function updateStatistics(){

    totalVideos.textContent =
    videos.length;

    totalUsers.textContent =
    "1";

    totalComments.textContent =
    "0";

    let total = 0;

    videos.forEach(function(video){

        const number =
        parseInt(

            String(video.views)
            .replace(/[^0-9]/g,"")

        );

        if(!isNaN(number)){

            total += number;

        }

    });

    totalViews.textContent =
    total.toLocaleString();

}

// ===========================================
// Load Videos
// ===========================================

async function loadVideos(){

    showLoading();

    try{

        const response =
        await fetch("/api/videos");

        videos =
        await response.json();

        renderVideos(videos);

        updateStatistics();

    }

    catch(error){

        console.log(error);

        showToast("Cannot load videos");

    }

    finally{

        hideLoading();

    }

}

// ===========================================
// Search
// ===========================================

searchInput.addEventListener(

    "input",

    function(){

        const value =
        this.value
        .toLowerCase()
        .trim();

        const filtered =
        videos.filter(function(video){

            return (

                video.title
                .toLowerCase()
                .includes(value)

                ||

                video.channel
                .toLowerCase()
                .includes(value)

                ||

                video.category
                .toLowerCase()
                .includes(value)

            );

        });

        renderVideos(filtered);

    }

);

// ===========================================
// Buttons
// ===========================================

function attachButtons(){

    document

    .querySelectorAll(".edit-btn")

    .forEach(function(button){

        button.onclick=function(){

            openEdit(

                button.dataset.id

            );

        };

    });

    document

    .querySelectorAll(".delete-btn")

    .forEach(function(button){

        button.onclick=function(){

            deleteVideoId =
            button.dataset.id;

            deleteModal
            .classList
            .add("show");

        };

    });

}

// ===========================================
// Edit
// ===========================================

function openEdit(id){

    const video =
    videos.find(function(item){

        return String(item.id)
        === String(id);

    });

    if(!video){

        return;

    }

    editId.value =
    video.id;

    editTitle.value =
    video.title;

    editChannel.value =
    video.channel;

    editCategory.value =
    video.category;

    editViews.value =
    video.views;

    editSubscribers.value =
    video.subscribers;

    editDescription.value =
    video.description;

    editModal
    .classList
    .add("show");

}

// ===========================================
// Save Edit
// ===========================================

editForm.onsubmit =
async function(event){

    event.preventDefault();

    const body={

        title:
        editTitle.value,

        channel:
        editChannel.value,

        category:
        editCategory.value,

        views:
        editViews.value,

        subscribers:
        editSubscribers.value,

        description:
        editDescription.value

    };

    try{

        await fetch(

            "/api/videos/" +
            editId.value,

            {

                method:"PUT",

                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:
                JSON.stringify(body)

            }

        );

        editModal
        .classList
        .remove("show");

        showToast(
            "Video Updated"
        );

        loadVideos();

    }

    catch(error){

        console.log(error);

    }

};

// ===========================================
// Delete
// ===========================================

confirmDelete.onclick =
async function(){

    try{

        await fetch(

            "/api/videos/" +
            deleteVideoId,

            {

                method:"DELETE"

            }

        );

        deleteModal
        .classList
        .remove("show");

        showToast(
            "Video Deleted"
        );

        loadVideos();

    }

    catch(error){

        console.log(error);

    }

};

// ===========================================
// Close Modals
// ===========================================

closeEditModal.onclick=function(){

    editModal
    .classList
    .remove("show");

};

cancelEdit.onclick=function(){

    editModal
    .classList
    .remove("show");

};

cancelDelete.onclick=function(){

    deleteModal
    .classList
    .remove("show");

};

// ===========================================
// Refresh
// ===========================================

refreshButton.onclick=function(){

    loadVideos();

};

// ===========================================
// Upload Page
// ===========================================

uploadButton.onclick=function(){

    window.location.href =
    "studio.html";

};

// ===========================================
// Sidebar
// ===========================================

menuButton.onclick=function(){

    sidebar.classList.toggle(
        "collapsed"
    );

};

// ===========================================
// Dark Mode
// ===========================================

if(localStorage.getItem("theme")==="dark"){

    document.body
    .classList
    .add("dark-mode");

    if(themeButton){

        themeButton.textContent="☀️";

    }

}

themeButton.onclick=function(){

    document.body
    .classList
    .toggle("dark-mode");

    if(document.body
    .classList
    .contains("dark-mode")){

        localStorage.setItem(
            "theme",
            "dark"
        );

        themeButton.textContent="☀️";

    }

    else{

        localStorage.setItem(
            "theme",
            "light"
        );

        themeButton.textContent="🌙";

    }

};

// ===========================================
// Logout
// ===========================================

logoutButton.onclick=function(){

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "username"
    );

    window.location.href =
    "login.html";

};

// ===========================================
// Start
// ===========================================

loadVideos();