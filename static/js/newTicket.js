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

    var compraId = null;
    var ticketId = $.urlParam('ticketId');
    if (ticketId == null) {
        $("#ticketTitle").text("Novo Ticket");
        var compraId = $.urlParam('compraId');
        if (compraId != null) {
            $("#purchase").text("ID da Compra: "+compraId);
        }
    } else {
        $("#ticketTitle").text("Nova Mensagem");
        $("#purchase").text("ID do Ticket: "+ticketId);
    }

    var id = null;
    $.getJSON( "/ajax/get_email", function(data) {
        clientData = getUser(data);
        console.log(clientData);
        $.when(clientData).done(function(client) {
            id = client["data"][0]["id"];
            $("#btnSendTicket").attr("disabled", false);
        });
    });

    $('#btnSendTicket').click(function(){
        var form = "message="+$('#formMessage').val();
        form += "&sender=Cliente&client_id="+id;
        if (ticketId != null) {
            form += "&ticketId="+ticketId;
        }
        if (compraId != null) {
            form += "&compraId="+compraId;
        }
        $.ajax({
            url: '/ajax/post_ticket',
            data: form,
            type: 'POST',
            success: function(data, textStatus, xhr){
                console.log(data);
                window.location.href = "/sac";
            },
            error: function(data, request, error){
                console.log(error);
            }
        });
    });

});