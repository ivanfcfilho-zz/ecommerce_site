cartData = {};
$.getJSON( "/ajax/get_cart/", function( data ) {
    cartData = data;
    var items = [];
    var totalValue = 0;
    if (!jQuery.isEmptyObject(data)) {
        $.each(data, function(index, value) {
            items.push('<tr><td><img class="img-thumbnail" style="width:30%" alt="Image" id="imageUrl" src="'+value["imageUrl"]+'"></td><td class="text-capitalize">'+value["name"].toLowerCase()+'</td><td>R$ '+value["price"].toFixed(2)+'</td><td><a href="/product/'+value["id"]+'">Ir Para Página</a><br><a href="/remove?id='+value["id"]+'">Remover</a></td><td><button onclick=add(this)  id="duplicate'+index+'" class="btn btn-sm btn-success" type="button" >+</button></td></tr>');
            totalValue += value["price"];
        });
    }
    if (items.length != 0) {
        $(items.join("")).appendTo("tbody");
        $("#btnPurchase").attr("disabled", false);
    }
    $('<tr><td></td><td class="text-capitalize"><b>Preço Total: </b></td><td><b>R$ '+totalValue.toFixed(2)+'</b></td></tr>').appendTo("tbody");
})            
    .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    });;
function add(elem) {
                id = $(elem).attr( "id" );
                n = id.replace("duplicate", "");
                
            $.ajax({
                url: '/add_to_cart',
                data: JSON.stringify(cartData[parseInt(n)]),
                contentType: 'application/json',
                type: 'POST',
                success: function(data, textStatus, xhr)
                {
                    window.location = '/cart';
                },
                error: function(data, request, error){
                    res = JSON.parse(data.responseText)
                    alert('Error'+res.Message)
                    console.log(error);
                }
            });
}

$( document ).ready(function() {
    $('#cancelCart').click(function() {
            $.ajax({
                url: '/ajax/sendEmailCancel',
                contentType: 'application/json',
                type: 'GET',
                success: function(data, textStatus, xhr) {
                    $.ajax({
                        url: '/ajax/clearCart',
                        contentType: 'application/json',
                        type: 'GET',
                        success: function(data, textStatus, xhr)
                        {

                            window.location = "/cart";
                        },
                        error: function(data, request, error){
                            res = JSON.parse(data.responseText)
                            alert('Error'+res.Message)
                            console.log(error);
                        }
                    });
                },
                error: function(data, request, error){
                    res = JSON.parse(data.responseText)
                    alert('Error'+res.Message)
                    console.log(error);
                }
            });

    });
});
