const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = async function(){

    const email=document.getElementById("email").value.trim();

    const password=document.getElementById("password").value;

    const response=await fetch("http://localhost:3000/api/login",{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            email,
            password

        })

    });

    const data=await response.json();

    if(!response.ok){

        alert(data.message);

        return;

    }

    localStorage.setItem("token",data.token);

    location.href="index.html";

}