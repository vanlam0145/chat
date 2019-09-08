$(document).ready(function () {
    var socket = io();
    var room = $('#groupName').val();
    var sender = $('#sender').val();
    socket.on('connect', function () {
        var params = {
            room: room,
            name: sender,
        }
        socket.emit('join', params, function () {
            console.log('User has join this channel');
        })
    })
    socket.on('newMessage', (message) => {
        console.log(message);
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: message.text,
            room: message.room,
            sender: message.from,
        })
        $('#messages').append(message);
    })
    socket.on('usersList', function (users) {
        var ol = $('<ol></ol>');
        for (var i = 0; i < users.length; i++) {
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">' + users[i] + '</a></p>')
        }
        $(document).on('click','#val',function(){
            $('#name').text('@'+$(this).text());
            $('#receiverName').val($(this).text());
            $('#nameLink').attr('href','/profile/'+$(this).text())
        })
        $('#numValue').text('(' + users.length + ')');
        $('#users').html(ol);
    })
    $('#message-form').on('submit', function (e) {
        e.preventDefault();
        var msg = $('#msg').val();
        socket.emit('createMessage', {
            text: msg,
            room: room,
            from: sender
        }, function () {
            $('#msg').val('');
        })
    })
})