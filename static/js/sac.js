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

    function check_sac(id) {
        $.getJSON( "/ajax/check_tickets/"+id.toString(), function( data ) {
            console.log(data);
            tickets = [];
            $.each(data["ticketsList"], function(index, value) {
                messages = [];
                $.each(value["messagesList"], function(index2, mes) {
                    messages.unshift(`     <div class="container">
                                            <div class="col-md-3 text-center">`+mes["timestamp"]+`</div>
                                            <div class="col-md-3 text-center">`+mes["sender"]+`</div>
                                            <div class="col-md-6">`+mes["message"]+`</div>
                                        </div>
                                        <br>
                                      `);
                });

                if (value["compraId"] == null) {
                    var compra = "-";
                } else {
                    var compra = value["compraId"];
                }
                tickets.unshift(`  <div class="row">
                                    <div class="col-md-3 text-center">`+value["ticketId"]+`</div>
                                    <div class="col-md-3 text-center">`+compra+`</div>
                                    <div class="col-md-3 text-center">`+value["messageSize"]+`</div>
                                    <div class="col-md-3 text-center"><button id="btnDetails`+index+`" type="button" class="btn btn-success btn-sm">Ver Ticket</button></div>
                                </div>
                                <br>
                                <div id="messagesDetails`+index+`" class="panel panel-success hidden">
                                    <div>
                                      <br>
                                      <div class="col-md-3 text-center"><b>Data</b></div>
                                      <div class="col-md-3 text-center"><b>Escrito Por</b></div>
                                      <div class="col-md-3 text-center"><b>Mensagem</b></div>
                                      <div class="col-md-3 text-center"><a href="/new_ticket?ticketId=`+value["ticketId"]+`"> Nova Mensagem</a></div>
                                    </div>
                                    <div>`+messages.join("")+`</div>
                                </div>
                              `);
            });
            $("#messages").append(tickets.join(""));
        })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
                $("#messages").append("<h5>Nenhuma mensagem encrontrada.</h5>");
            });
    }

    $.getJSON( "/ajax/get_email", function(data) {
        clientData = getUser(data);
        $.when(clientData).done(function(client) {
            id = client["data"][0]["id"];
            check_sac(id);

        });
    });

    $("#messages").on('click', "button[id^='btnDetails']", function() {
        id = $(this).attr( "id" );
        n = id.replace("btnDetails", "");
        id2 = "#messagesDetails"+n;
        $(id2).toggleClass('hidden');
    });

    $('#btnNewTicket').click(function(){
        window.location.href = "/new_ticket";
    });
});