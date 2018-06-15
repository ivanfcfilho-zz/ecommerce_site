$(function(){
    $("form").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            new_email: {
                required: true,
                email: true
            }
        },
        messages: {
            // no quoting necessary
            name: "Por favor, Digite um nome",
            email: {
                required: "Por favor, digite o email",
                email: "Formato de e-mail invalido"
            },
            new_email:{
                required: "Por favor, digite o email",
                email: "Formato de e-mail invalido"
            }
        }
    });

	$('#btnUpdate').click(function(){
	    if( $('form').valid()) {
            $.ajax({
                url: '/ajax/change_email',
                data: $('form').serialize(),
                type: 'POST',
                success: function(data, textStatus, xhr){
                    if(xhr.status == 200) {
                        alert('Sucesso')
                        window.location.href = "/change_email";
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
