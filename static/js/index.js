$(document).ready(function () {


    $.getJSON( "/ajax/product_search/?highlight=true", function( data ) {
        var items = [];
        var iter = 0;
        $.each( data, function(index, value) {

        items.push(`<div class="col-sm-4" >
              <div class="panel panel-primary">
                <div class="panel-heading">`+value['name']+`</div>
                <div class="panel-body"><a href="/product/`+value["id"]+`"><img style="width: 190px;" src="`+ value['imageUrl'] +` " class="img-responsive" style="width:100%" alt="Image"><a/></div>
                <div class="panel-footer">R$: `+value['price']+`</div>
              </div>
            </div>`);

            iter++;
            if(iter == 6) {
                return false;
            }
        });
            if (items.length != 0) {
                $(items.join("")).appendTo("#highlight");
            }
        
    }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
    });

});
