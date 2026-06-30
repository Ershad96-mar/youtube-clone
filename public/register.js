const registerBtn = document.getElementById("registerBtn");

registerBtn.onclick = async function () {

    const username = document.getElementById("username").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    if(username==="" || email==="" || password===""){

        alert("Please fill all fields");

        return;

    }

    const response = await fetch("http://localhost:3000/api/register",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username,
            email,
            password

        })

    });

    const data = await response.json();

    alert(data.message);

    if(response.ok){

        location.href="login.html";

    }

}