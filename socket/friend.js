module.exports = function (secureIO) {
    secureIO.on('connection', (socket) => {
        socket.on('joinRequest', (myRequest, callback) => {
            socket.join(myRequest.sender);
            callback();
        });
        socket.on('friendRequest', (friend, callback) => {
            //console.log(friend.sender,friend.receiver);
            secureIO.to(friend.receiver).emit('newFriendRequest', {
                from: friend.sender,
                to: friend.receiver
            });
            callback();
        })
    });
}