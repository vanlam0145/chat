$(document).ready(function () {
    var socket = io();
    var room = $('#groupName').val();
    var sender = $('#sender').val();
    socket.on('connect', function () {
        var params = {
            sender: sender,
        }
        socket.emit('joinRequest', params, function () {
            console.log('Joined');
        })
    })
    socket.on('newFriendRequest', function (friend) {
        console.log(friend);
        $('#reload').load(location.href + ' #reload');
        $(document).on('click', '#accept_friend', function () {
            var senderId = $('#senderId').val();
            var senderName = $('#senderName').val();
            console.log({ senderId, senderName });
            $.ajax({
                url: '/group/' + room,
                type: 'post',
                data: {
                    senderId, senderName
                },
                success: function () {
                    $(this).parent().eq(1).remove();
                }
            })
            $('#reload').load(location.href + ' #reload');
        })
        $(document).on('click', '#cancel_friend', function () {
            var user_Id = $('#user_Id').val();
            $.ajax({
                url: '/group/' + room,
                type: 'post',
                data: {
                    user_Id
                },
                success: function () {
                    $(this).parent().eq(1).remove();
                }
            })
            $('#reload').load(location.href + ' #reload');
        })
    })
    $('#add_friend').on('submit', function (e) {
        e.preventDefault();
        var receiverName = $('#receiverName').val();
        $.ajax({
            url: '/group/' + room,
            type: 'POST',
            data: {
                receiverName: receiverName,
                //sender: sender,
            },
            success: function () {
                socket.emit('friendRequest', {
                    receiver: receiverName,
                    sender: sender,
                }, function () {
                    console.log('Request Sent')
                })
            }
        })
    })
    $('#accept_friend').on('click', function () {
        var senderId = $('#senderId').val();
        var senderName = $('#senderName').val();
        console.log({ senderId, senderName });
        $.ajax({
            url: '/group/' + room,
            type: 'post',
            data: {
                senderId, senderName
            },
            success: function () {
                $(this).parent().eq(1).remove();
            }
        })
        $('#reload').load(location.href + ' #reload');
    })
    $('#cancel_friend').on('click', function () {
        var user_Id = $('#user_Id').val();
        console.log("can");
        $.ajax({
            url: '/group/' + room,
            type: 'post',
            data: {
                user_Id
            },
            success: function () {
                $(this).parent().eq(1).remove();
            }
        })
        $('#reload').load(location.href + ' #reload');
    })
})