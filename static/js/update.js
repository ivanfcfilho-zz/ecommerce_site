function getUser (email) {
    $.getJSON( "/ajax/get_user/"+email, function(data) {
        $.each(data, function(index, value) {
            userData = value[0];
            $("#inputName").val(userData["name"]);
            $("#inputCep").val(userData["cep"]);
            $("#inputPhone1").val(userData["phone1"]);
            $("#inputPhone2").val(userData["phone2"]);
            $("#inputCpf").val(userData["cpf"]);
            $("#inputBirthday").val(userData["birthday"]);
        });
    })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
}

$(function(){
    var email = null;
    $.getJSON( "/ajax/get_email", function(data) {
        email = data;
        getUser(email);
        $("#btnEdit").attr("disabled", false);
    })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });

    $('#btnEdit').click(function(){
        $("#edit").removeClass('hidden');
        $("#notEdit").addClass('hidden');

        $(this).closest('form').find('input').prop('disabled', false);
    });

    $('#btnCancel').click(function(){
        $("#notEdit").removeClass('hidden');
        $("#edit").addClass('hidden');
        $(this).closest('form').find('input').prop('disabled', true);
    });

    $('#btnUpdate').click(function(){
        data = $('form').serialize();
        data += "&email="+email;
        $.ajax({
            url: '/ajax/update',
            data: data,
            type: 'POST',
            success: function(data, textStatus, xhr){
                if(xhr.status == 200) {
                    $("#notEdit").removeClass('hidden');
                    $("#edit").addClass('hidden');
                    $("#btnUpdate").closest('form').find('input').prop('disabled', true);
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
    });
});