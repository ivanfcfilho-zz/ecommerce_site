$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

$(function(){
    function getUser (email) {
        return $.getJSON( "/ajax/get_user/"+email, function(data) {
            return data;
        })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
    }

    var ticketId = $.urlParam('ticketId');
    if (ticketId == null) {
        var compraId = $.urlParam('compraId');
        $("#ticketTitle").text("Novo Ticket");
    } else {
        $("#ticketTitle").text("Nova Mensagem");
    }
    new Date().valueOf()
    console.log(Date.now());

    $.getJSON( "/ajax/get_email", function(data) {
        clientData = getUser(data);
        $.when(clientData).done(function(client) {
            id = client["data"][0]["id"];

        });
    });

    $('#btnSendTicket').click(function(){
        var form = $("#formMessage").serialize();
        form +=
        $.ajax({
            url: '/ajax/register_delivery',
            data: form,
            type: 'POST',
            success: function(data, textStatus, xhr){
                if(xhr.status == 200) {
                    console.log(data);
                } else {
                    alert('Error', xhr.status);
                }
            },
            error: function(data, request, error){
                console.log(error);
            }
        });
    });

});