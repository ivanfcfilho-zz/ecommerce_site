$(function() {

    function get_products(value) {
        var products = [];
        $.each(value, function(index, value_items) {
            $.getJSON( "/ajax/product_details/"+value_items["item_id"], function( product_data ) {
                products.push('<tr><td class="text-capitalize">'+product_data["name"].toLowerCase()+'</td><td>'+value_items["quantidade"]+'</td></tr>');
            })
                .fail(function( jqxhr, textStatus, error ) {
                    var err = textStatus + ", " + error;
                    console.log( "Request Failed: " + err );
                });
        });
        return products;
    }

    function check_delivery(value) {
        return $.getJSON( "/ajax/check_delivery/"+value, function( delivery_data ) {
            return delivery_data;
        })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
    }

    /*function check_payment(value) {
        return $.getJSON( "/ajax/check_payment/"+value, function( payment_data ) {
            return payment_data;
        })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
    }*/

    $.getJSON( "/ajax/get_orders", function( data ) {
        if (!jQuery.isEmptyObject(data)) {
            var orders = [];
            $.each(data["orders"], function(index, value) {
                var retProducts = get_products(value["itens_do_pedido"]);
                var retDelivery = check_delivery(value["cod_rastreio_logistica"]);
                /*if (value['id_pagamento'] != null){
                    var payment = check_payment(value["id_pagamento"]);
                } else {
                    var payment = "Pagamento Completo";
                }*/
                $.when(retProducts, retDelivery).done(function(products, delivery_data) {
                    var delD = delivery_data[0];
                    var delivery = [];
                    $.each(delD["historicoRastreio"], function(index, historico) {
                        if (index == 0){
                            estado = historico["mensagem"];
                        }
                        delivery.push('<tr><td>'+historico["hora"]+'</td><td>'+historico["local"]+'</td><td>'+historico["mensagem"]+'</td></tr>');
                    });
                    $("#orders").append(`
                      <div class="panel panel-success">
                        <div class="row">
                          <div class="col-sm-4"><h6><b>Pedido nº `+value["order_id"]+`</h6></b></div>
                          <div class="col-sm-8"></div>
                        </div>
                        <div class="row">
                          <div class="col-sm-4"><h5>`+products.length+` produtos</h5></div>
                          <div class="col-sm-4"><h5><b>R$ ---</b></h5></div>
                          <div class="col-sm-4"><button id="btnDetails`+index+`" type="button" class="btn btn-success btn-sm">Ver Detalhes</button></div>
                        </div>
                        <div class="row">
                          <div class="col-sm-4"><h6><b>Estado da entrega:<b></h6></div>
                          <div class="col-sm-4"><h6>`+delD["historicoRastreio"][0]["mensagem"]+`</h6></div>
                          <div class="col-sm-4"></div>
                        </div>
                        <div class="row">
                          <div class="col-sm-4"><h6><b>Estado do Pagamento:<b></h6></div>
                          <div class="col-sm-4"><h6>Pagamento Completo</h6></div>
                          <div class="col-sm-4"></div>
                        </div>
                        <br>
                        <div id="details`+index+`" class="row hidden">
                          <div class="col-sm-1"></div>
                          <div class="col-sm-10 panel panel-success">
                            <div class="row">
                              <h4><b>Produtos</b></h4>
                              <table class="table table-condensed table-hover">
                                <thead>
                                  <tr>
                                    <th class="col-md-4 text-center">Item</th>
                                    <th class="col-md-4 text-center">Quantidade</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  `+products.join("")+`
                                </tbody>
                              </table>
                            </div>
                            <br>
                            <div class="row">
                              <h4><b>Informações de Entrega</b></h4>
                              <h6>CEP de Entrega: `+delD["tipoEntrega"]+`</h6>
                              <h6>Tipo de Entrega: `+delD["cepDestino"]+`</h6>
                              <h5><b>Historico de Rastreio:</b></h5>
                              <table class="table table-condensed table-hover">
                                <thead>
                                  <tr>
                                    <th class="col-md-4 text-center">Hora</th>
                                    <th class="col-md-4 text-center">Local</th>
                                    <th class="col-md-4 text-center">Mensagem</th>
                                  </tr>
                                </thead>
                                <tbody>
                                    `+delivery.join("")+`
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div class="col-sm-1"></div>
                        </div>
                      </div>`);
                });
            });
        }
    })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });

    $("#orders").on('click', "button[id^='btnDetails']", function() {
        id = $(this).attr( "id" );
        n = id.replace("btnDetails", "");
        id2 = "#details"+n;
        $(id2).toggleClass('hidden');
    });
});