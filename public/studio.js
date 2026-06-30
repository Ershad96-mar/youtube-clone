// ======================================
// YouTube Studio
// Part 1
// ======================================

// ----------------------------
// Elements
// ----------------------------

const form =
document.getElementById("upload-form");

const title =
document.getElementById("title");

const description =
document.getElementById("description");

const category =
document.getElementById("category");

const channel =
document.getElementById("channel");

const thumbnail =
document.getElementById("thumbnail");

const video =
document.getElementById("video");

const thumbnailPreview =
document.getElementById("thumbnail-preview");

const videoPreview =
document.getElementById("video-preview");

const progressBar =
document.getElementById("progress-bar");

const uploadStatus =
document.getElementById("upload-status");

// ----------------------------
// Thumbnail Preview
// ----------------------------

thumbnail.addEventListener(

    "change",

    function(){

        const file =
        thumbnail.files[0];

        if(!file){

            thumbnailPreview.src="";

            return;

        }

        const reader =
        new FileReader();

        reader.onload=function(e){

            thumbnailPreview.src =
            e.target.result;

        };

        reader.readAsDataURL(file);

    }

);

// ----------------------------
// Video Preview
// ----------------------------

video.addEventListener(

    "change",

    function(){

        const file =
        video.files[0];

        if(!file){

            videoPreview.removeAttribute("src");

            videoPreview.load();

            return;

        }

        const url =
        URL.createObjectURL(file);

        videoPreview.src =
        url;

        videoPreview.load();

    }

);

// ----------------------------
// Reset Button
// ----------------------------

form.addEventListener(

    "reset",

    function(){

        thumbnailPreview.src="";

        videoPreview.removeAttribute("src");

        videoPreview.load();

        progressBar.style.width="0%";

        uploadStatus.textContent="";

    }

);

// ======================================
// Upload Validation
// ======================================

function validateForm(){

    if(title.value.trim()===""){

        alert("Please enter title");

        title.focus();

        return false;

    }

    if(channel.value.trim()===""){

        alert("Please enter channel name");

        channel.focus();

        return false;

    }

    if(!thumbnail.files[0]){

        alert("Please select thumbnail");

        return false;

    }

    if(!video.files[0]){

        alert("Please select video file");

        return false;

    }

    return true;

}

// ======================================
// Upload Progress Animation
// ======================================

function simulateProgress(callback){

    let progress = 0;

    progressBar.style.width="0%";

    uploadStatus.textContent="Uploading...";

    const timer = setInterval(function(){

        progress += 5;

        progressBar.style.width =
        progress + "%";

        if(progress >= 100){

            clearInterval(timer);

            callback();

        }

    },100);

}

// ======================================
// Create FormData
// ======================================

function createUploadData(){

    const formData = new FormData();

    formData.append(

        "title",

        title.value.trim()

    );

    formData.append(

        "description",

        description.value.trim()

    );

    formData.append(

        "category",

        category.value

    );

    formData.append(

        "channel",

        channel.value.trim()

    );

    formData.append(

        "thumbnail",

        thumbnail.files[0]

    );

    formData.append(

        "video",

        video.files[0]

    );

    return formData;

}

// ======================================
// Upload Request
// ======================================

function uploadVideo(){

    const formData =
    createUploadData();
      fetch(



        "/api/videos",



        {

            method:"POST",



            body:formData



        }



    )



    .then(function(response){



        return response.json();



    })



    .then(function(data){



        if(data.success){



            uploadStatus.textContent =

            "Video Uploaded Successfully";



            progressBar.style.width =

            "100%";



        }



        else{



            uploadStatus.textContent =

            "Upload Failed";



        }



    })



    .catch(function(error){



        console.log(error);



        uploadStatus.textContent =

        "Server Error";



    });
}
// ======================================
// Submit Form
// ======================================

form.addEventListener(

    "submit",

    function(event){

        event.preventDefault();

        if(!validateForm()){

            return;

        }

        simulateProgress(function(){

            uploadVideo();

        });

    }

);

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

    themeButton.addEventListener(

        "click",

        function(){

            document.body.classList.toggle("dark-mode");

            if(document.body.classList.contains("dark-mode")){

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

        }

    );

}

// ======================================
// Profile
// ======================================

const profileBtn =
document.getElementById("profile-btn");

const username =
localStorage.getItem("username");

if(profileBtn && username){

    profileBtn.textContent =
    username.charAt(0).toUpperCase();

}

// ======================================
// Check Login
// ======================================

const token =
localStorage.getItem("token");

if(!token){

    alert("Please login first.");

    window.location.href="login.html";

}

// ======================================
// Finish
// ======================================

console.log(

    "YouTube Studio Ready"

);