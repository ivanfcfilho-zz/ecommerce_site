$(function(){

    function saveOrder(codigoRastreio, codigoPay, cep) {
        var form = "cod_rastreio_logistica="+codigoRastreio+"&id_pagamento="+codigoPay+"&cep_de_entrega="+cep;
        $.ajax({
            url: '/ajax/save_order',
            data: form,
            type: 'POST',
            success: function(data, textStatus, xhr){
                if(xhr.status == 200) {
                    alert('Sucesso')
                    
                } else {
                    alert('Error', xhr.status);
                }
            },
            error: function(data, request, error){
                console.log(error);
            }
        });
    }

    function registerDelivery(cartData, codigoPay){
        if (!jQuery.isEmptyObject(cartData)) {
            var form = "idProduto=1"
            $.each(cartData, function(index, value) {
                 form += value["id"]+","
            });
            form = form.slice(0, -1);
            form += "&tipoEntrega=PAC&cepOrigem=13084762&peso=10&tipoPacote=Caixa&altura=10&largura=10&comprimento=10&cepDestino="
            form += $('#inputCep').val();
            $.ajax({
                dataType: "json",
                url: '/ajax/register_delivery',
                data: form,
                type: 'POST',
                success: function(dataResult, textStatus, xhr){
                    if(xhr.status == 200) {
                        console.log(dataResult);
                        saveOrder(dataResult["codigoRastreio"], codigoPay, $('#inputCep').val());
                    } else {
                        alert('Error', xhr.status);
                    }
                },
                error: function(data, request, error){
                    console.log(error);
                }
            });
        }
    }

    function checkShipping(cep_val){
        query = 'tipoEntrega=PAC&cepOrigem=13084762&peso=1&tipoPacote=Caixa&comprimento=1&altura=1&largura=1&cepDestino='+cep_val;
        $.ajax({
            dataType: "json",
            url: "/ajax/get_shipping/?"+query,
            type: 'GET',
            success: function(data, textStatus, xhr){
                if(xhr.status == 200) {
                    var preco = parseFloat(data["preco"]);
                    preco = preco/100;
                    $('<tr><td class="text-capitalize">Frete: </td><td>R$ '+preco.toFixed(2)+'</td></tr>').appendTo("tbody");
                    totalValue += preco;
                    $('<tr><td class="text-capitalize"><b>Preço Total (com frete): </b></td><td><b>R$ '+totalValue.toFixed(2)+'</b></td></tr>').appendTo("tbody");
                } else {
                    alert('Error', xhr.status);
                }
            },
            error: function(data, request, error, xhr){
                console.log(error);
            }
        });
    }

    function validateCep(){
        var cep_val = $('#inputCep').val();
        $.ajax({
            url: "/ajax/get_cep/"+cep_val,
            type: 'GET',
            success: function(data, textStatus, xhr){
                if(xhr.status == 200) {
                    res = JSON.parse(data)
                    $("#inputAddress").val(res["logradouro"]+", "+res["bairro"]+", "+res["cidade"]+", "+res["uf"])
                    $("#btnPayTicket").attr("disabled", false);
                    $("#btnPay").attr("disabled", false);
                    checkShipping(cep_val);
                } else {
                    alert('Error', xhr.status);
                }
            },
            error: function(data, request, error, xhr){
                var validator = $( "#formAddress" ).validate();
                validator.showErrors({
                  "cep": "CEP não existe"
                });
            }
        });
    }

    function getStatusCredit(cpf) {
        $.ajax({
            url: "/ajax/getStatusCredit/"+cpf,
            type: 'GET',
            success: function(data, textStatus, xhr){

            },
            error: function(data, request, error, xhr){
                console.log('********************')
                console.log('SUCCESS')
                console.log('data: ' + data)
                console.log('request: ' + request)
                console.log('error: ' + error)
                console.log('xhr: ' + xhr)
            }
        });
        
    }

    var cartData = {};
    var totalValue = 0;
    var lastCep = 0;
    $.getJSON( "/ajax/get_cart/", function( data ) {
        if (!jQuery.isEmptyObject(data)) {
            cartData = data;
            var items = [];
            $.each(data, function(index, value) {
                items.push('<tr><td class="text-capitalize">'+value["name"].toLowerCase()+'</td><td>R$ '+value["price"].toFixed(2)+'</td></tr>');
                totalValue += value["price"];
            });
            if (items.length != 0) { $(items.join("")).appendTo("tbody"); }
            $('<tr><td class="text-capitalize"><b>Preço Total: </b></td><td><b>R$ '+totalValue.toFixed(2)+'</b></td></tr>').appendTo("tbody");
        }
    })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });

    $('#btnPay').click(function(){
        score = getStatusCredit($('#inputCpf').val())
        if(score < 200) {
            alert('Mau pagador Salafrario');
        } else {
            if( $('#formCredit').valid()) {
                data = $('#formCredit').serialize();
                data += "&instalments="+$("#inputinstalments option:selected").text();
                data += "&value="+totalValue;
                $.ajax({
                    url: '/ajax/pay_credit',
                    data: data,
                    type: 'POST',
                    success: function(data, textStatus, xhr){
                        if(xhr.status == 200) {
                            res = JSON.parse(data)
                            alert(res["result"])
                            console.log(data);
                            registerDelivery(cartData);
                        } else {
                            alert('Error', xhr.status);
                        }
                    },
                    error: function(data, request, error){
                        console.log(error);
                    }
                });
            }
        }
    });

    $('#btnPayTicket').click(function(){
        if( $('#formTicket').valid()) {
            data = $('#formTicket').serialize();
            data += "&" + $('#formAddress').serialize();
            data += "&value="+totalValue;
            $.ajax({
                url: '/ajax/pay_ticket',
                data: data,
                type: 'POST',
                success: function(data, textStatus, xhr){
                    if(xhr.status == 200) {
                        res = JSON.parse(data)
                        console.log(data);
                        registerDelivery(cartData, res["code"]);
                    } else {
                        alert('Error', xhr.status);
                    }
                },
                error: function(data, request, error){
                    console.log(error);
                }
            });
        }
    });

    $('#btnCredit').click(function(){
        $("#formCredit").removeClass('hidden');
        $("#formTicket").addClass('hidden');
    });

    $('#btnTicket').click(function(){
        $("#formCredit").addClass('hidden');
        $("#formTicket").removeClass('hidden');
    });

    $('#inputCep')
        .keypress(function (e) {
            if ($('#inputCep').val() != lastCep) {
                $("#btnPayTicket").attr("disabled", true);
                $("#btnPay").attr("disabled", true);
                lastCep=$('#inputCep').val();
                if (e.which == 13) {
                    validateCep();
                    return false;
                }
            }
        })
        .focusout(function(){
            if ($('#inputCep').val() != lastCep) {
                $("#btnPayTicket").attr("disabled", true);
                $("#btnPay").attr("disabled", true);
                validateCep();
                lastCep=$('#inputCep').val();
            }
        });

    $("#formCredit").validate({
        rules: {
            // no quoting necessary
            clientCardName: "required",
            cpf: {
                required: true,
                digits: true,
                minlength: 11,
                maxlength: 11
            },
            cardNumber: {
                required: true,
                digits: true,
                minlength: 16,
                maxlength: 16
            },
            securityCode: {
                required: true,
                digits: true,
                minlength: 3,
                maxlength: 4
            },
            month: {
                required: true,
                digits: true,
                minlength: 1,
                maxlength: 2
            },
            year: {
                required: true,
                digits: true,
                minlength: 4,
                maxlength: 4
            }
        },
        messages: {
            // no quoting necessary
            clientCardName: "Por favor, digite um nome",
            cpf: {
                required: "CPF inválido",
                digits: "CPF inválido",
                minlength: "CPF inválido",
                maxlength: "CPF inválido"
            },
            cardNumber: {
                required: "Numero inválido",
                digits: "Numero inválido",
                minlength: "Numero inválido",
                maxlength: "Numero inválido"
            },
            securityCode: {
                required: "Numero inválido",
                digits: "Numero inválido",
                minlength: "Numero inválido",
                maxlength: "Numero inválido"
            },
            month: {
                required: "Mês inválido",
                digits: "Mês inválido",
                minlength: "Mês inválido",
                maxlength: "Mês inválido"
            },
            year: {
                required: "Ano inválido",
                digits: "Ano inválido",
                minlength: "Ano inválido",
                maxlength: "Ano inválido"
            },
        }
    });

    $("#formTicket").validate({
        rules: {
            // no quoting necessary
            clientName: "required",
            cpf: {
                required: true,
                digits: true,
                minlength: 11,
                maxlength: 11
            }
        },
        messages: {
            // no quoting necessary
            clientName: "Por favor, digite um nome",
            cpf: {
                required: "CPF inválido",
                digits: "CPF inválido",
                minlength: "CPF inválido",
                maxlength: "CPF inválido"
            }
        }
    });

    $("#formAddress").validate({
        rules: {
            cep: {
                required: true,
                digits: true,
                minlength: 8,
                maxlength: 8
            }
        },
        messages: {
            cep: {
                required: "CEP inválido",
                digits: "CEP inválido",
                minlength: "CEP inválido",
                maxlength: "CEP inválido"
            }
        }
    });

});
