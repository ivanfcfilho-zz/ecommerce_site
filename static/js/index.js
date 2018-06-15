$(document).ready(function () {


    $.getJSON( "/ajax/product_search/?highlight=true", function( data ) {
        var items = [];
        var iter = 0;
        $.each( data, function(index, value) {

        items.push(`<a href="/product/`+value["id"]+`">
                        <div class="col-sm-4" >
                          <div class="panel panel-primary">
                                <div class="panel-heading" style="height: 41px;">`+value['name']+`</div>
                                <div class="panel-body"><img style="height: 250px;" src="`+ value['imageUrl'] +` " class="img-responsive" style="width:100%" alt="Image"></div>
                                <div class="panel-footer">R$: `+value['price'].toFixed(2)+`</div>
                          </div>
                        </div><a/>`);

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
