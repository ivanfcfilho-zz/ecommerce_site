cartData = {};
$.getJSON( "/ajax/get_cart/", function( data ) {
    cartData = data;
    var items = [];
    var totalValue = 0;
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
    });;
