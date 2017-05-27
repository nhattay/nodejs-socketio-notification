$(document).ready(function () {
    var socket = io.connect('http://localhost:3000/');
    // var socket = io();
    $("#sendNotification").click(function (event) {
        var table = $('#table').val(),
            floor = $('#floor').val(),
            comment = $('#comment').val();
        socket.emit('booking', {table: table, floor: floor, comment: comment});
    });
    socket.on('booking_notify', function (msg) {
        console.log('Socket IO received data', msg);
        showBrowserNotification(msg);
    });

    Notification.requestPermission(function (permission) {
        if (!('permission' in Notification)) {
            Notification.permission = permission;
        }
        /*if (permission === "granted") {
         }*/
    });
});
function showBrowserNotification(data) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    // Let's check if the user is okay to get some notification
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var options = {
            body: 'Bàn số ' + data.table + ', tầng ' + data.floor + ' gọi món!',
            icon: 'images/launcher-icon-2x.png',
            dir: "ltr"
        };
        var notification = new Notification('Thông báo gọi món!', options);
    }
    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // Whatever the user answers, we make sure we store the information
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }
            // If the user is okay, let's create a notification
            if (permission === "granted") {
                var options = {
                    body: 'Bàn số ' + data.table + ', tầng ' + data.floor + ' gọi món!',
                    icon: 'images/launcher-icon-2x.png',
                    dir: "ltr"
                };
                var notification = new Notification('Thông báo gọi món!', options);
            }
        });
    }
}