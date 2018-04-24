$(function(){
	$('#btnSignUp').click(function(){
		
		$.ajax({
            url: '/ajax/signup',
			data: $('form').serialize(),
			type: 'POST',
			success: function(response){
				console.log(response);
			},
			error: function(request, error){
				console.log(error);
			}
		});
	});
});
