$(function(){
    cartData = {};
    var totalValue = 0;
    $.getJSON( "/ajax/get_cart/", function( data ) {
        cartData = data;
        var items = [];
        $.each(data, function(index, value) {
            items.push('<tr><td class="text-capitalize">'+value["name"].toLowerCase()+'</td><td>R$ '+value["price"].toFixed(2)+'</td></tr>');
            totalValue += value["price"];
        });
        if (items.length != 0) { $(items.join("")).appendTo("tbody"); }
        $('<tr><td class="text-capitalize"><b>Preço Total: </b></td><td><b>R$ '+totalValue.toFixed(2)+'</b></td></tr>').appendTo("tbody");
    })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });

    $('#btnPay').click(function(){
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

    $('#btnPayTicket').click(function(){
        if( $('#formTicket').valid()) {
            data = $('#formTicket').serialize();
            data += "&value="+totalValue;
            $.ajax({
                url: '/ajax/pay_ticket',
                data: data,
                type: 'POST',
                success: function(data, textStatus, xhr){
                    if(xhr.status == 200) {
                        res = JSON.parse(data)
                        alert("AUTHORIZED")
                        console.log(data);
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
            },
            address: "required",
            cep: {
                required: true,
                digits: true,
                minlength: 8,
                maxlength: 8
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
            },
            address: "Por favor, digite um endereço",
            cep: {
                required: "CEP inválido",
                digits: "CEP inválido",
                minlength: "CEP inválido",
                maxlength: "CEP inválido"
            }
        }
    });

});