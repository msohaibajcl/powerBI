url="http://127.0.0.1:7702"

function login(){
    var name=document.getElementById("email").value;
    var password=document.getElementById("password").value;
    if(name){
        if(password){
            request=url+'/api/bd/signin/';
            data={"email":name,"password":password};
            postData=JSON.stringify(data);
            $.ajax({
                headers: {
                    'Content-Type': 'application/json'
                },
                type: 'POST',
                url: request,
                data: postData,
                success: function(data2){
                    if(data2["response"]=="success"){
                        if(data2["domain"]=="all"){
                            localStorage.setItem("linkTnt",data2["link"][0]);
                            localStorage.setItem("linkJholding",data2["link"][1]);
                            localStorage.setItem("linkFinance",data2["link"][2]);
                        }
                        else{
                            localStorage.setItem("link",data2["link"]);
                        }
                        
                        localStorage.setItem("username",data2["name"]);
                        localStorage.setItem("email",name);
                        localStorage.setItem("domain",data2["domain"]);
                        console.log(data2);
                        window.location.href="dashboard.html"
                    }
                    else if(data2["response"]=="Invalid Password"){
                        document.getElementById("error").innerHTML=String(data2["response"]);
                        document.getElementById("password").style.border="1px solid";
                        document.getElementById("password").style.borderColor="red";
                    }
                    else{
                        document.getElementById("error").innerHTML="Invalid Email or Password"
                        document.getElementById("email").style.border="1px solid";
                        document.getElementById("email").style.borderColor="red";
                    }
                }
            })
        }
        else{
            document.getElementById("error").innerHTML="Invalid Password"
            document.getElementById("password").style.border="1px solid";
            document.getElementById("password").style.borderColor="red";
        }
    }
    else{
        document.getElementById("error").innerHTML="Invalid Email or Password"
        document.getElementById("email").style.border="1px solid";
        document.getElementById("email").style.borderColor="red";
    } 
}

function logout(){
    var email=localStorage.getItem("email");
    request=url+'/api/bd/logout/';
    data={"email":email};
    postData=JSON.stringify(data);
    $.ajax({
        headers: {
        'Content-Type': 'application/json'
    },
        type: 'POST',
        url: request,
        data: postData,
        success: function(data2){
            window.location.replace("http://crms.ajcl.net")
        }
    });
}
function loadDashboard(){
    document.getElementById("user").innerHTML=localStorage.getItem("username");
    document.getElementById("domain").innerHTML=localStorage.getItem("domain");
    if(localStorage.getItem("domain")=="all"){
        document.getElementById("allAccess").style.display="block";
        $("#allAccess").append("<button class='accessButton' id='linkTnt' onclick='changeAccess(this)'>TNT</button>");
        $("#allAccess").append("<button class='accessButton' id='linkJholding' onclick='changeAccess(this)'>JHOLDINGS</button>");
        $("#allAccess").append("<button class='accessButton' id='linkFinance' onclick='changeAccess(this)'>FINANCE</button>");
    }
    else{
        document.getElementById("dashboard").src=localStorage.getItem("link");
    }
}
function changeAccess(param){
    link=localStorage.getItem(param.id);
    document.getElementById("dashboard").src=link;
    document.getElementById(param.id).style.background="black";
    document.getElementById(param.id).style.color="white";
    if(param.id=="linkTnt"){
        document.getElementById("linkJholding").style.background="white";
        document.getElementById("linkJholding").style.color="black"; 
        document.getElementById("linkFinance").style.background="white";
        document.getElementById("linkFinance").style.color="black";
    }
    else if(param.id=="linkJholding"){
        document.getElementById("linkFinance").style.background="white";
        document.getElementById("linkFinance").style.color="black";
        document.getElementById("linkTnt").style.background="white";
        document.getElementById("linkTnt").style.color="black";
    }
    else{
        document.getElementById("linkJholding").style.background="white";
        document.getElementById("linkJholding").style.color="black";
        document.getElementById("linkTnt").style.background="white";
        document.getElementById("linkTnt").style.color="black";
    }
}