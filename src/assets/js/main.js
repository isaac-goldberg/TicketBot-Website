$(function () {
    $('[data-toggle="tooltip"]').tooltip();

    new jBox("Confirm", {
        confirmButton: "Okay",
        cancelButton: "Cancel",
    });
});