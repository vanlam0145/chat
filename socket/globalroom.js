module.exports = function (secureIO, Global,_) {
    const client = new Global();
    secureIO.on('connection', (socket) => {
        socket.on('global room', (global) => {
            socket.join(global.room);
            client.EnterRoom(socket.id, global.name, global.room, global.img,global.email);
            var nameProp=client.GetRoomList(global.room);
            const arr=_.uniqBy(nameProp,"email");
            secureIO.to(global.room).emit('loggedInUser',arr);
        })
    })
}