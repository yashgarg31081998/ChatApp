
var express=require('express');
var app=express();

var http=require('http');
var server=http.createServer(app);

const socketio=require('socket.io');
const io=socketio(server)

var store=[];
var socketIds=[];

var userSocket={};
var userName=[];

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}


io.on('connection',function(socket){
    console.log("connection at"+socket.id)

    socket.emit("connected");

    socket.on('User_Img',function(username,image){
        socket.broadcast.emit('add_Image',username,image);

    })

    socket.on('login',function(data){

          console.log("log in:"+data.user)
        userSocket[data.user]=socket.id
        userName.push(data.user);
        io.emit('online',userName)

    })

    if(!socketIds.includes(socket.id))
    {
        for(i=0;i<store.length;i++)
        {
            console.log("hello this is message:"+store[i].message)
            socket.emit("receive",store[i]);
        }
        socketIds.push(socket.id);
    }

    socket.on('send',function(data){

        console.log(data.message);
        console.log("hi:"+data.url)
        // io is used to send data to all clients
        // io.emit("receive",data);

        // it is used to send to all the client except itself
        if(data.message.startsWith("@"))
        {
            // like @a:hello so split divide into two i.e. @a: and hello the [0]gives @a then substring give name of receiver
            let receiver=data.message.split(":")[0].substr(1);
            let receiveId=userSocket[receiver];
            console.log("receiver:"+receiver)
            let message=data.message.split(":")[1];
            // msg.user=data.user
            console.log(data.user+" "+message)
            io.to(receiveId).emit("receive",{user:data.user,
                message:message,url:data.url});
        }
        else
        {
            socket.broadcast.emit("receive",data);
            store.push({
                user:data.user,
                message:data.message,
                url:data.url

            })
        }

    })




    socket.on('disconnect', function () {

        console.log("disconnected")
        user_name=getKeyByValue(userSocket,socket.id);
        // console.log(user_name)
        index=userName.indexOf(user_name);
        // console.log(index)
        userName.splice(index,1)
        io.emit('online',userName);


    });


})

app.use("/", express.static(__dirname+"/public_static"))


var bodyParser=require('body-parser')
var fileUpload=require('express-fileupload')

var path=require('path')


console.log("hello")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(fileUpload())











server.listen(process.env.PORT || 9090, function(){
    // console.log('listening on', http.address().port);
});



// server.listen('9999',function(){
//     console.log("hello world")
// })