module.exports = function (secureIO, Users) {

    const users = new Users();

    secureIO.on('connection', (socket) => {
        console.log('User connected');
        socket.on('join', (params, callback) => {
            socket.join(params.room);
            users.AddUserData(socket.id, params.name, params.room);
            //console.log(users);
            secureIO.to(params.room).emit('usersList', users.GetUsersList(params.room));
            callback();
        })
        socket.on('createMessage', (message, callback) => {
            console.log(message);
            secureIO.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.from,
            });
            callback();
        });
        socket.on('disconnect', () => {
            var user = users.RemoveUser(socket.id);
            if(user){
                secureIO.to(user.room).emit('usersList', users.GetUsersList(user.room));
            }
        })
    });
}