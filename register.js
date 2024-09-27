document.addEventListener('DOMContentLoaded',()=>{

    const registerForm=document.getElementById("regsitration-form")
    const registerUsername=document.getElementById("reg-username")
    const registerPassword=document.getElementById("reg-password")
    const registerCpassword=document.getElementById("reg-cpassword")
    const displayMessage=document.getElementById("display-message")
    const loginForm=document.getElementById("login-form")
    const loginUsername=document.getElementById("log-username")
    const loginPassword=document.getElementById("log-password")
    const registrationContainer=document.getElementById("registration")
    const loginContainer=document.getElementById("login")
    const gotoLogin=document.getElementById("to-login")
    const gotoRegister=document.getElementById("to-register")

    registerForm.addEventListener("submit",function(e){
        e.preventDefault()
        const username=registerUsername.value
        const password=registerPassword.value
        const cPassword=registerCpassword.value
        if(password===cPassword){
            const userData={
                username:username,
                password:password,
            }
            localStorage.setItem("user",JSON.stringify(userData))
            registrationContainer.style.display="none"
            loginContainer.style.display="block"
        }
        else{
            displayMessage.textContent="Password Not Matching"
            setTimeout(()=>displayMessage.textContent="",1500)
        }
    })

    loginForm.addEventListener("submit",function(e){
        e.preventDefault()
        const storedUserData=JSON.parse(localStorage.getItem("user"))
        if(storedUserData){
            if(storedUserData.username===loginUsername.value && storedUserData.password===loginPassword.value){
                window.location.href="index.html"
            }
            else{
                displayMessage.textContent="Incorrect Username or Password"
                setTimeout(()=>displayMessage.textContent=" ",1500)
            }
        }
        else{
            displayMessage.textContent="Please Register First"
            setTimeout(() => displayMessage.textContent="",1500);
        }
    })
    gotoLogin.addEventListener("click",function(e){
        e.preventDefault()
        registrationContainer.style.display="none"
        loginContainer.style.display="block"
    })
    gotoRegister.addEventListener("click",function(e){
        e.preventDefault()
        registrationContainer.style.display="block"
        loginContainer.style.display="none"
    })
})