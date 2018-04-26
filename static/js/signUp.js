$(function(){
	$('#btnSignUp').click(function(){
		
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
	});
});
