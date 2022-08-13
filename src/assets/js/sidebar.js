$('.hamburger').on('click', function() {
    const sidebarExtension = $("#sidebarExtension");
    sidebarExtension.toggleClass("closed");

    if (sidebarExtension.hasClass("closed")) {
        $(".module").css({"width": "90%"});
    } else {
        $(".module").css({"width": "75%"});
    }
});