
var socket=io();
socket.on("connected",function(){
    console.log("connection "+socket.id);
})

var UserName="";
var ImageURL="";
// function signOut(googleUser)
// {
//     var auth2 = gapi.auth2.getAuthInstance();
//     auth2.signOut().then(function () {
//         console.log('User signed out.');
//         $(".g-signin2").show();
//         $(".data").hide();
//     });
// }


function onSignIn(googleUser)
{
    console.log("hello")
    var profile=googleUser.getBasicProfile();

    $(".g-signin2").hide();
    $(".data").show();
    $("#google-sign").hide();

    // $("#pic").attr('src',profile.getImageUrl())

    // var email=$("#email")

    // email.text(profile.getEmail())
    // getUser(profile.getName());

    ImageURL=profile.getImageUrl();
    UserName=profile.getName()

    $("#start").show();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
}

$(function () {



    var list= $("#list");
    var img=$("#img")
    var imgText=$("#imgText")
    var text=$("#text");
    var btn=$("#btn");
    var usersOnline=$("#users");

    var loginbtn=$("#login-btn");
    var user=$("#user");

    var divlogin=$("#login");
    var divmsg=$("#msg");

    function getUser(Name) {
        socket.emit('login',{user:Name})
        divlogin.hide();
        divmsg.show();
        imgText.text(Name)
        $("#userImg").attr('src',ImageURL)
        usersOnline.show();
        $("#last_last").show()
        $("#last").show()


    }


    function startTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        $("#date").text(" Time:"+h+":"+m+":"+s);
        var t = setTimeout(startTime, 500);
    }
    function checkTime(i) {
        if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
        return i;
    }

     startTime()



    $("#start").click(function()
    {
        getUser(UserName);
        $("#start").hide()

    })


    // loginbtn.click(function () {
    //     socket.emit('login',{user:user.val()})
    //     divlogin.hide();
    //     divmsg.show();
    //     imgText.text(user.val())
    //     usersOnline.show();
    //     $("#last").show()
    //
    //
    // })

    $('#imagefile').on('change',function(e){

        var file=e.originalEvent.target.files[0];
        var reader=new FileReader();

        reader.onload=function(evt){
            list.append(
                $("<div class=\"d-flex justify-content-end mb-4\">")
                    .append($("<div class=\"img_cont_msg\">").append($("<img class=\"rounded-circle user_img_msg\">").attr('src',ImageURL)),'<a target="blank" href="'+evt.target.result+'"><img class="rounded-circle" style="height: 150px;width:150px" src="'+evt.target.result+'"></a>'

                    ))
            socket.emit('User_Img',ImageURL,evt.target.result);
        }
        reader.readAsDataURL(file);


    })

    socket.on('add_Image',function (msg,base64image) {
        list.append(
            $("<div class=\"d-flex justify-content-start mb-4\">")
                .append($("<div class=\"img_cont_msg\">").append($("<img class=\"rounded-circle user_img_msg\">").attr('src',msg)),'<a target="blank" href="'+base64image+'"><img class="rounded-circle" style="height: 150px;width:150px" src="'+base64image+'"></a>'

            ))

    })

    socket.on('online',function(data){
        // console.log(usersOnline.children.length)
        $("#users").empty()

        // while (usersOnline.hasChildNodes()){
        //     usersOnline.removeChild(usersOnline.lastChild);
        // }
         for(i=0;i<data.length;i++)
        {

                usersOnline.append(
                    $("<li>")
                        .append($("<div class=\"d-flex bd-highlight\">")
                            .append($("<div class=\"user_info\">").append($("<span>").text(data[i])))))


            // usersOnline.append("<li>"+data[i]+"</li>")
        }
    })


    btn.click(function () {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);

        if(text.val().length>0)
        {

            list.append(
                $("<div class=\"d-flex justify-content-end mb-4\">")
                    .append($("<div class=\"msg_cotainer_send\">").text(text.val())
                        .append($("<span class='msg_time_send'>").text(h+":"+m+":"+s)))
                    .append($("<div class='img_cont_msg'>")
                        .append($("<img class=\"rounded-circle user_img_msg\">").attr('src',ImageURL)))


            )
            // list.append("<li style='color: green'>"+text.val()+"<sub>"+h+":"+m+":"+s+"</sub>"+"</li>")
            // list.append("<div class='list-group-item' style='text-align:right;background-color:burlywood;width:400px'>"+"<span class='badge'>"+h+":"+m+":"+s+"</span>"+"<b >"+text.val()+"</b>"+"<br>"+"</div>")
            // list.append("<li class='list-group-item' style='text-align: right;width: 250px'>"+"<span class='badge'>"+h+":"+m+":"+s+"</span>"+text.val()+"</li>")
            socket.emit('send',{user:UserName,message:text.val(),url:ImageURL})
            text.val("");
        }


    })

    // socket.on('receiveImg',function(data)
    // {
    //     console.log(data)
    //     list.append(($("<img  width='100' height='100' alt='Not Found'>").attr('src',data)))
    // })

    socket.on('receive',function (data) {

        console.log("hello")
        console.log(data.user+" "+data.url)
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        m = checkTime(m);
        s = checkTime(s);
        $("#date").text(h+":"+m+":"+s);
        // $("#pic").attr('src',profile.getImageUrl())
        // list.append("<img src=data.url alt='sorry'>"+data.url)

        list.append(
            $("<div class=\"d-flex justify-content-start mb-4\">")
                .append($("<div class='img_cont_msg'>")
                    .append($("<img class=\"rounded-circle user_img_msg\">").attr('src',data.url)))
                .append($("<div class=\"msg_cotainer\">").text(data.message)
                    .append($("<span class='msg_time'>").text(h+":"+m+":"+s)))

              )


        // list.append("<div class='list-group-item' style='background-color:lightgoldenrodyellow;width:400px'>"+"<span class='badge'>"+h+":"+m+":"+s+"</span>"+"<b>"+"<img class='pic' class='img-circle' width='20' height='20' src=''+data.url>"+data.user+":"+"<i>"+data.message+"</i>"+"</b>"+"</div>")
        // $("#pic").attr('src',data.url)
        // $("img").removeClass("pic");


    })

})


