$(function() {

    function get_products(value) {
        var products = [];
        var deferreds = [];
        var preco = 0;
        $.each(value, function(index, value_items) {
            deferreds.push($.getJSON( "/ajax/product_details/"+value_items["item_id"]/*, function( product_data ) {
                products.push('<tr><td class="text-capitalize">'+product_data["name"].toLowerCase()+'</td><td>'+value_items["quantidade"]+'</td><td>'+value_items["preco"].toFixed(2)+'</td></tr>');
                preco += product_data["preco"];
            }*/)
                .fail(function( jqxhr, textStatus, error ) {
                    var err = textStatus + ", " + error;
                    console.log( "Request Failed: " + err );
                }));
        });
        return deferreds;
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

    function check_payment(value) {
        return $.getJSON( "/ajax/check_payment/"+value, function( payment_data ) {
            return payment_data;
        })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
    }

    $.getJSON( "/ajax/get_orders", function( data ) {
        if (!jQuery.isEmptyObject(data)) {
            var orders = [];
            $.each(data["orders"], function(index, value) {
                var retProducts = get_products(value["itens_do_pedido"]);
                var retDelivery = check_delivery(value["cod_rastreio_logistica"]);
                if (value['id_pagamento'] != 'undefined'){
                    var payment = check_payment(value["id_pagamento"]);
                } else {
                    var payment = null;
                }
                $.when(retDelivery, payment).done(function() {
                    if (payment == null) {
                        payment_status = "OK";
                    }
                    else{

                        payment_status = payment['responseJSON']["status"];
                    }
                    $.when.apply($, retProducts).then(function() {
                        var products = [];
                        var preco = 0;
                        $.each(retProducts, function(index2, product_data_all) {
                            var product_data = product_data_all["responseJSON"];
                            var value_items = value["itens_do_pedido"][index2];
                            products.push('<tr><td class="text-capitalize">'+product_data["name"].toLowerCase()+'</td><td>'+value_items["quantidade"]+'</td><td>'+parseFloat(value_items["preco"]).toFixed(2)+'</td></tr>');
                            preco += parseFloat(value_items["preco"]);
                        });
                        var delD = retDelivery["responseJSON"];
                        var delivery = [];
                        $.each(delD["historicoRastreio"], function(index, historico) {
                            if (index == 0){
                                estado = historico["mensagem"];
                            }
                            delivery.push('<tr><td>'+historico["hora"]+'</td><td>'+historico["local"]+'</td><td>'+historico["mensagem"]+'</td></tr>');
                        });
                        preco += parseFloat(value["frete"]);
                        $("#orders").append(`
                          <div class="panel panel-success">
                            <div class="row">
                              <div id="compraId`+index+`" class="col-sm-4"><h6><b>Pedido ID: `+value["order_id"]+`</h6></b></div>
                              <div class="col-sm-8"></div>
                            </div>
                            <div class="row">
                              <div class="col-sm-4"><h5>`+products.length+` produtos</h5></div>
                              <div class="col-sm-4"><h5><b>R$ `+preco.toFixed(2)+`</b></h5></div>
                              <div class="col-sm-4"><button id="btnMessage`+index+`" type="button" class="btn btn-sm">Enviar Menssagem</button></div>
                            </div>
                            <div class="row">
                              <div class="col-sm-4"><h6><b>Estado da entrega:<b></h6></div>
                              <div class="col-sm-4"><h6>`+delD["historicoRastreio"][0]["mensagem"]+`</h6></div>
                              <div class="col-sm-4"></div>
                            </div>
                            <div class="row">
                              <div class="col-sm-4"><h6><b>Estado do Pagamento:<b></h6></div>
                              <div class="col-sm-4"><h6>`+payment_status+`</h6></div>
                              <div class="col-sm-4"><button id="btnDetails`+index+`" type="button" class="btn btn-success btn-sm">Ver Detalhes</button></div>
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
                                        <th class="col-md-2 text-center">Quantidade</th>
                                        <th class="col-md-2 text-center">Preço</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      `+products.join("")+`
                                      <tr>
                                        <td class="text-capitalize">Frete</td>
                                        <td></td>
                                        <td>`+parseFloat(value["frete"]).toFixed(2)+`</td>
                                      </tr>
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
            });
        }
    })
        .fail(function( jqxhr, textStatus, error ) {
            console.log( error );
        });

    $("#orders").on('click', "button[id^='btnDetails']", function() {
        id = $(this).attr( "id" );
        n = id.replace("btnDetails", "");
        id2 = "#details"+n;
        $(id2).toggleClass('hidden');
    });

    $("#orders").on('click', "button[id^='btnMessage']", function() {
        id = $(this).attr( "id" );
        n = id.replace("btnMessage", "");
        compraText = $('#compraId'+n).text();
        compraId = compraText.replace("Pedido ID: ", "");
        window.location.href = "/new_ticket?compraId="+compraId;
    });
});
