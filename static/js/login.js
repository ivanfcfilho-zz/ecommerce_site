$(function(){
    $('#btnLogin').click(function(){

        $.ajax({
            url: '/ajax/login',
            data: $('form').serialize(),
            type: 'POST',
            success: function(data, textStatus, xhr){
                    alert('Sucesso')
                    window.location.href = "/";
            },
            error: function(data, request, error){
                res = JSON.parse(data.responseText)
                alert('Error'+res.Message)
                console.log(error);
            }
        });
    });
});
