const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

$(function () {
    var isLoggedin = false;
    if ($('#hiddenId').val())
        isLoggedin = true;
    setScreen(isLoggedin);
});

function setScreen(isLogin) {

    console.log('setScreen');

    if (!isLogin) {

        $("#divChat").hide();
        $("#divLogin").show();

        
        $('#particles').particleground({
            minSpeedX: 0.1,
            maxSpeedX: 0.7,
            minSpeedY: 0.1,
            maxSpeedY: 0.7,
            directionX: 'center', // 'center', 'left' or 'right'. 'center' = dots bounce off edges
            directionY: 'center', // 'center', 'up' or 'down'. 'center' = dots bounce off edges
            density: 10000, // How many particles will be generated: one particle every n pixels
            dotColor: '#eee',
            lineColor: '#eee',
            particleRadius: 7, // Dot size
            lineWidth: 1,
            curvedLines: true,
            proximity: 100, // How close two dots need to be before they join
            parallax: false
        });
    }
    else {

        $("#divChat").show();
        $("#divLogin").hide();
    }

}

$("#inputMsg").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#btnChat").click();
    }
});

connection.on("onNewUserConnected", (name, language) => {
    console.log('onNewUserConnected - name: ' + name + ' - language: ' + language);
    const msg = name + " joined chat."
    $("#messagesList").append($("<li class='list-group-item list-group-item-success'>").html(msg));
    $("#usersList").append($("<li class='list-group-item list-group-item-info'>").html("<span class='glyphicon glyphicon-user' style='padding - right: 5px'></span>&nbsp;" + name + " - lang: " + language));
});

connection.on("onConnected", (users, name, id, language) => {
    console.log('onConnected - name: ' + name + ' - language: ' + language);
    console.log(users);
    for (i = 0; i < users.length; ++i) {
        $("#usersList").append(
            $("<li class='list-group-item list-group-item-info'>").html("<span class='glyphicon glyphicon-check' style='padding - right: 5px'></span>&nbsp;" + users[i].name + " - lang: " + users[i].languagePreference)
        );
    }

    $('#hiddenId').val(id);
    $('#hiddenUserName').val(name);
    $('#spanUserName').html(name);
    $('#spanLanguage').html(language);
});

connection.on("onDisconnected", (name) => {
    $("#usersList li:contains('" + name + "')").remove();
    const msg = name + " left chat."
    $("#messagesList").append($("<li class='list-group-item list-group-item-danger'>").html(msg));
});

connection.on("ReceiveMessage", (name, msg) => {
    $("#messagesList").append($("<li class='list-group-item list-group-item-info'>").html(name + ": " + msg));
});


$("#btnExitChat").click(function () {

    connection.invoke("Disconnect").catch(err => console.error(err.toString()));
    connection.stop()
    $('#hiddenId').val('');
    $('#hiddenUserName').val('');
    $('#spanUserName').html('');
    $("#usersList").empty();
    $("#messagesList").empty();
    setScreen(false);
});

$("#btnChat").click(function () {
    var msg = $("#inputMsg").val();
    if (msg.length > 0) {
        connection.invoke("SendMessage", $("#hiddenUserName").val(), msg).catch(err => console.error(err.toString()));
        $("#inputMsg").val('');
        $("#messagesList").append($("<li class='list-group-item list-group-item-warning'>").html($("#hiddenUserName").val() + ": " + msg));
    }
});

$("#btnLogin").click(function () {
    console.log('btnLogin - name: ' + $("#name").val() + ' - slLanguage: ' + $("#slLanguage").val());
    connection.start().then(function () {
        connection.invoke("Connect", $("#name").val(), $("#slLanguage").val()).catch(err => console.error(err.toString()));
        setScreen(true);
    });
});
