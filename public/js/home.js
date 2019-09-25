$(document).ready(function () {
    $('#Favorite').on('submit', function (e) {
        e.preventDefault();
        var id = $('#id').val();
        var clubName = $('#club_Name').val();
        $.ajax({
            url: '/home',
            type: 'post',
            data: {
                id, clubName
            },
            success: function () {
                console.log(clubName);
                $('#Favorite').load(location.href + ' #Favorite');
            }
        })
    })
})