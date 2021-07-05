

$(function () {
$('#friends-container .badge').click(function(event)
{
    event.preventDefault();
    $('#user-chatbox').toggleClass('d-none');
})
});
