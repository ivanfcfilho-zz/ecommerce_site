$(document).ready(function () {
    productId = window.location.pathname.replace('/product/','');
    prodData = {}
    $.getJSON( "/ajax/product_details/"+productId, function( data ) {
        prodData = data;
        $("#name").text(data["name"].toLowerCase());
        $("#price").text("R$ " + data["price"].toFixed(2));
        
        if (data["stock"] > 0) { 
            $("#stock").text("Produto Disponivel"); 
        } else { 
            $("#stock").text("Produto Indisponivel");
            $("#stock").attr("class", "text-danger")
            $("#btnBuy").attr("disabled", true)
        }
        
        if (data["description"] != null) {
            $("#description").text(data["description"]);
        } else {
            $("#description").text("");
        }
        
        if (data["additionalInfo"] != null) {
            $("#additionalInfo").text(data["additionalInfo"]);
        } else {
            $("#additionalInfo").text("");
        }
        $("#imageUrl").attr("src",data["imageUrl"]);
        
        categoryQuery = "?category_id=" + data["categoryId"];
        $.getJSON( "/ajax/product_search/"+categoryQuery, function(data2) {
            var items = [];
            total = 0;
            $.each( data2, function(index, value) {
                if (total > 2 || index > 3) {
                    return false;
                }
                if (productId != value["id"]) {
                    total += 1;
                    items.push('<a href="/product/'+value["id"]+'"><div class="col-sm-4"><div class="panel panel-success"><div class="panel-heading">'+value["name"]+'</div><div class="panel-body"><img src="'+value["imageUrl"]+'"class="img-responsive" style="width:60%" alt="Image"></div></div></div></a>');
                }
            });
            if (items.length != 0) {
                $("#simProducts").removeClass('hidden');
                $("#simRow").append(items.join(""));
            }
        })
            .fail(function( jqxhr, textStatus, error ) {
                var err = textStatus + ", " + error;
                console.log( "Request Failed: " + err );
            });
    });
    
    $('#btnBuy').click(function(){
        json = JSON.stringify(prodData);
        $.ajax({
            url: '/add_to_cart',
            data: json,
            contentType: 'application/json',
            type: 'POST',
            success: function(data, textStatus, xhr){
                alert('Sucesso')
                window.location.href = "/cart";
            },
            error: function(data, request, error){
                res = JSON.parse(data.responseText)
                alert('Error'+res.Message)
                console.log(error);
            }
        });
            
    });
});
