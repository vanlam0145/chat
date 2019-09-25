$(document).ready(function () {
    var socket = io();
    socket.on('connect', function () {
        var room = 'GlobalRoom';
        var name = $('#name-user').val();
        var img = $('#name-image').val();
        var email=$('#name-email').val();
        socket.emit('global room',{
            room,name,img,email
        });
    })
    socket.on('loggedInUser',function(arr){
        var friends=$('.fr').text();
        var friend=friends.split('@');
        var name=$('#name-user').val();
        var ol=$('<ol></ol>');
        var array=[];
        for(var i=0;i<arr.length;i++){
            if(friend.indexOf(arr[i].name)>-1){
                array.push(arr[i]);
                ol.append('<p>' + arr[i].name + '</p>');
            }
        }
        $('#numOfFriends').text('('+array.length+')');
        $('.onlineFriends').html(ol);
    })
})