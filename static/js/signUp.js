$(function(){
    $("form").validate({
        rules: {
            // no quoting necessary
            name: "required",
            email: {
                required: true,
                email: true
            },
            cep: {
                required: true,
                digits: true,
                minlength: 8,
                maxlength: 8
            },
            phone1: {
                required: true,
                digits: true,
                minlength: 11,
                maxlength: 11
            },
            phone2: {
                required: true,
                digits: true,
                minlength: 11,
                maxlength: 11
            },
            cpf: {
                required: true,
                digits: true,
                minlength: 11,
                maxlength: 11
            },
            date: {
                required: true,
                date: true
            }
        },
        messages: {
            // no quoting necessary
            name: "Por favor, Digite um nome",
            email: {
                required: "Por favor, digite um email",
                email: "Formato de e-mail invalido"
            },
            cep: {
                required: "Por favor, digite um cep",
                digits: "Somente numeros sao permitidos",
                minlength: "O numero de caracteres deve ser 8",
                maxlength: "O numero de caracteres deve ser 8"
            },
            phone1: {
                required: "Por favor, digite um telefone",
                digits: "Somente numeros sao permitidos",
                minlength: "O numero de caracteres deve ser 11",
                maxlength: "O numero de caracteres deve ser 11"
            },
            phone2: {
                required: "Por favor, digite um telefone",
                digits: "Somente numeros sao permitidos",
                minlength: "O numero de caracteres deve ser 11",
                maxlength: "O numero de caracteres deve ser 11"
            },
            cpf: {
                required: "Por favor, digite um CPF",
                digits: "Somente numeros sao permitidos",
                minlength: "O numero de caracteres deve ser 11",
                maxlength: "O numero de caracteres deve ser 11"
            },
            date: {
                required: "Por favor, digite uma data",
                date: "Digite um formato de data valido"
            }
        }
    });

	$('#btnSignUp').click(function(){
	    if( $('form').valid()) {	
            $.ajax({
                url: '/ajax/signup',
                data: $('form').serialize(),
                type: 'POST',
                success: function(data, textStatus, xhr){
                    if(xhr.status == 200) {
                        alert('Sucesso')
                        window.location.href = "/login";
                    } else {
                        res = JSON.parse(data)
                        alert('Error'+res.message)
                    }
                },
                error: function(data, request, error){
                    var res = ''
                    if(data != '')
                        res = JSON.parse(data.responseText)
                    alert('Erro'+res.Message)
                    console.log(error);
                }
            });
        }
    });
});
