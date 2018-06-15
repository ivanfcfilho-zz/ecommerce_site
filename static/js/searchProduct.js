// Pega lista de produtos
// Inicialmente pega lista de produtos em destaque
// Se usuario filtrar produtos pega nova lista

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

$(document).ready(function () {
    
    var page = $.urlParam('page');
        if (page == null) {
            $("#btnPrevPage, #btnPrevPage2").attr("disabled", true)
    }

    if (window.location.port) {
        var url = window.location.protocol+"//"+window.location.hostname+":"+window.location.port+window.location.pathname;
    } else {
        var url = window.location.protocol+"//"+window.location.hostname+window.location.pathname;
    }
    var params = window.location.href.replace(url,'');
    
    $.getJSON( "/ajax/product_search/"+params, function( data ) {
        var items = [];
        $.each( data, function(index, value) {
            items.push('<tr><td><img class="img-thumbnail" style="height: 100px;" alt="Image" id="imageUrl" src="'+value["imageUrl"]+'"></td><td class="text-capitalize">'+value["name"].toLowerCase()+'</td><td>R$ '+value["price"].toFixed(2)+'</td><td><a href="/product/'+value["id"]+'">Ir Para Página</a></td></tr>');
        });
        if (items.length != 0) {
            $(items.join("")).appendTo("tbody");
        }
    })
        .fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );
        });
        
    $('#btnNextPage, #btnNextPage2').click(function(){
        if (params == '') {
            var newUrl = location.href + "?page=2";
        } else {
            var page = $.urlParam('page');
            if (page == null) {
                var newUrl = location.href + "&page=2";
            } else {
                newPage = Number(page) + 1;
                var newUrl = location.href.replace("page="+page, "page="+newPage);
            }
        }
        window.location.href = newUrl;
    });
    
    $('#btnPrevPage, #btnPrevPage2').click(function(){
        newPage = Number(page) - 1;
        var newUrl = location.href.replace("page="+page, "page="+newPage);
        window.location.href = newUrl;
    });
    
    $('#btnFilter').click(function(){
        var newParams = {}
        if ($("#categoryId").text()) {newParams.category_id = $("#categoryId").text(); }
        if ($("#nameFilter").val()) {newParams.name = $("#nameFilter").val(); }
        if ($("#minPriceFilter").val()) {newParams.min_price = $("#minPriceFilter").val(); }
        if ($("#maxPriceFilter").val()) {newParams.max_price = $("#maxPriceFilter").val(); }
        if ($("#brandFilter").val()) {newParams.brand = $("#brandFilter").val(); }
        if ($("#highlightFilter").is(":checked")) {newParams.highlight = $("#highlightFilter").is(":checked"); }
        window.location.href = url +"?"+ $.param(newParams);
    });
    
    $('#btnCategory').click(function(){
        if ($("#categoryFilter").val()) {
            var categoryId = null
            param = $("#categoryFilter").val()
            $.getJSON( "/ajax/category_search/?name="+param.toUpperCase(), function( dataCategory ) {
                if(dataCategory.length == 0) {
                    alert("Categoria invalida!")
                    return null
                }
                $("#categoryId").text(dataCategory[0]["id"]);
                $("#category").text(dataCategory[0]["name"].toLowerCase());
                
            })
                .fail(function( jqxhr, textStatus, error ) {
                    var err = textStatus + ", " + error
                    console.log( "Category Request Failed: " + err )
                });
        }
    });
    
    $('#btnCategoryReset').click(function(){
        $("#categoryId").text("");
        $("#category").text("todas");
    });
    
});


