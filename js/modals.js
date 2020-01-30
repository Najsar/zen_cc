function Round(n, k)
{
    var factor = Math.pow(10, k);
    return Math.round(n*factor)/factor;
}
function refresh()
{
    $('#dataTable').DataTable().ajax.reload();
    $.ajax({
        url : "http://localhost:3080/api/get_profit/",
        xhrFields: {
            withCredentials: true
        },
        dataType : "json"
    })
    .done(function(res) {
        $("#day_profit").html( Round(res['data']['day'], 2) );
        $("#month_profit").html( Round(res['data']['month'], 2) );
    });
}
function hasEmptyElement(array){
    for (var i=0; i<array.length; i++){
        if (typeof array[i] == 'undefined'){
          return true; 
        }
    }
}
function modal_sell_box() 
{
    if($('#sell_box_form').val() != undefined) {
        $('#sell_box_form').empty();
    }
    $.ajax({
        url : "http://localhost:3080/api/get_products/",
        xhrFields: {
            withCredentials: true
        },
        dataType : "json"
    })
    .done(function(res) {
        var box_form = "<div class='form-group'><label>Rodzaj</label><select class='form-control' id='product_type_select'><option selected disabled>Wybierz rodzaj</option>";
        var elements = [];
        var res_p = res['data']['products'];
        var res_m = res['data']['payments'];

        for (var i = 0; i < res_p.length; i++) {
            if (!elements.includes(res_p[i][4])) {
            box_form += "<option value='"+res_p[i][4]+"'>"+res_p[i][1]+"</option>";
            elements.push(res_p[i][4]);
            }
            
        }
        box_form += "</select></div>";
        $('#sell_box_form').append(box_form);

        $('#product_type_select').change(function(){
            if($('#product_list_div').val() != undefined) {
                $('#product_list_div').remove();
            }
            if($('#payment_metchod_list_div').val() != undefined) {
                $('#payment_metchod_list_div').remove();
            }
            if($('#return_input_div').val() != undefined) {
                $('#return_input_div').remove();
            }
            var box_form = "<div class='form-group' id='product_list_div'><label>Produkt</label><select class='form-control' id='product_list_select'><option selected disabled>Wybierz produkt</option>";
            for (var i = 0; i < res_p.length; i++) {
                if ( res_p[i][4] == $(this).val() ) {
                    box_form += "<option value='"+res_p[i][3]+"'>"+res_p[i][2]+"</option>";
                } 
            }
            box_form += "</select></div>";
            $('#sell_box_form').append(box_form);
            $('#product_list_select').change(function(){
                if($('#payment_metchod_list_div').val() != undefined) {
                    $('#payment_metchod_list_div').remove();
                }
                if($('#return_input_div').val() != undefined) {
                    $('#return_input_div').remove();
                }
                var box_form = "<div  id='payment_metchod_list_div'><div class='form-group'><label>Ilość</label><div class='input-group'><input type='number' class='form-control' id='value_input' placeholder='1'><div class='input-group-append'><span class='input-group-text'>szt</span></div></div></div>";
                box_form += "<div class='form-group'><label>Sposób płatności</label><select class='form-control' id='payment_metchod_list_select'><option selected disabled>Wybierz sposób płatności</option>";

                for (var i = 0; i < res_m.length; i++) {
                box_form += "<option value='"+res_m[i][0]+"'>"+res_m[i][1]+"</option>";
                }
                box_form += "</select></div></div>";
                $('#sell_box_form').append(box_form);
                $('#payment_metchod_list_select').change(function(){
                    if($('#return_input_div').val() != undefined) {
                        $('#return_input_div').remove();
                    }
                    //return_discount_input
                    if($('#value_input').val() == 0) {
                        var return_input = Number($('#product_list_select').val());
                    }
                    else {
                        var return_input = Number($('#product_list_select').val())*Number($('#value_input').val());
                    }

                    
                    var box_form = "<div id='return_input_div'><div class='form-group'><label>Rabat</label><div class='input-group'><input type='number' class='form-control' id='return_discount_input' placeholder='0'><div class='input-group-append'><span class='input-group-text'>%</span></div></div></div>";
                    box_form += "<div class='form-group'><label>Do zapłaty</label><div class='input-group'><input type='number' readonly class='form-control' value='"+return_input+"' id='return_to_buy'><div class='input-group-append'><span class='input-group-text'>zł</span></div></div></div>";
                    box_form += "<div class='form-group'><label>Zapłacono</label><div class='input-group'><input type='number' class='form-control' id='return_input' placeholder='0'><div class='input-group-append'><span class='input-group-text'>zł</span></div></div></div>";
                    box_form += "<div class='form-group'><label>Reszta</label><div class='input-group'><input type='number' readonly class='form-control' placeholder='0' id='return_exchange_input'><div class='input-group-append'><span class='input-group-text'>zł</span></div></div></div></div>";
                    $('#sell_box_form').append(box_form);
                    
                    if(Number($('#payment_metchod_list_select').val()) != 2) {
                        $('#return_input').val(return_input);
                        $('#return_exchange_input').val(0);
                    }
                    $('#value_input').keyup(function(){
                        var return_input = Number($('#product_list_select').val())*Number($('#value_input').val());
                        $('#return_to_buy').val(return_input);
                    });
                    $('#value_input').change(function(){
                        var return_input = Number($('#product_list_select').val())*Number($('#value_input').val());
                        $('#return_to_buy').val(return_input);
                    });
                    if(Number($('#product_list_select').val()) == 0) {
                        $('#return_input').keyup(function(){
                            var return_to_buy = Number( $('#return_input').val() );
                            $('#return_to_buy').val(return_to_buy);
                            $('#return_exchange_input').val(0);
                        });
                    }
                    else {
                        $('#return_input').keyup(function(){
                            var return_exchange = (Number($('#return_input').val())-Number($('#return_to_buy').val()) );
                            $('#return_exchange_input').val(Round(return_exchange, 2));
                        });

                        $('#return_discount_input').keyup(function(){
                            //var return_exchange = (Number($('#return_input').val())-Number($('#product_list_select').val()) );
                            return_input = Number($('#product_list_select').val())-( (Number($('#return_discount_input').val()) * Number($('#product_list_select').val())) / 100);
                            $('#return_to_buy').val(Round(return_input, 2));
                        });
                    }
                });
            });
        });

    });
}
function modal_expense_box() 
{
    if($('#expense_box_form').val() != undefined) {
        $('#expense_box_form').empty();
    }
    $.ajax({
        url : "http://localhost:3080/api/get_expense/",
        xhrFields: {
            withCredentials: true
        },
        dataType : "json"
    })
    .done(function(res) {
        res = res['data'];
        var box_form = "<div class='form-group'><label>Rodzaj</label><select class='form-control' id='expense_product_type_select'><option selected disabled>Wybierz rodzaj</option>";
        for (var i = 0; i < res.length; i++) {
            box_form += "<option value='"+res[i][0]+"'>"+res[i][1]+"</option>";
        }
        box_form += "</select></div>";
        $('#expense_box_form').append(box_form);

        $('#expense_product_type_select').change(function(){
            if($('#expense_return_input_div').val() != undefined) {
                $('#expense_return_input_div').remove();
            }
            
            var box_form = "<div class='form-group'><label>Kwota</label><div class='input-group'><input type='number' class='form-control' id='expese_cost' placeholder='0'><div class='input-group-append'><span class='input-group-text' id='basic-addon2'>zł</span></div></div></div>";
            box_form += "<div class='form-group'><label>Komentarz</label><input type='text' class='form-control' id='expense_comment'></div";
            $('#expense_box_form').append(box_form);
        });
    });
}
function modal_day_report() 
{
    $.ajax({
        url : "http://localhost:3080/api/get_sum/",
        xhrFields: {
            withCredentials: true
        },
        dataType : "json"
    })
    .done(function(res) {
        res = res['data'];
        $("#start_cash").val( res['start_cash']+"zł" );
        $("#cash").val( res['cash']+"zł" );
        $("#expense").val( res['expense']+"zł" );
        $("#partners_card").val( res['partners_card']+"zł" );
        $("#profit").val( Round( Number(res['partners_card']) + Number(res['cash']) , 2)+"zł" );
        $("#exchange").val( 0-Round( Number(res['start_cash']) + Number(res['cash']) - Number(res['expense'] ), 2)  +"zł" );

        $('#end_cash').keyup(function(){
            $("#exchange").val( Round( Number($('#end_cash').val()) - (Number(res['start_cash'])+ Number(res['cash']) - Number(res['expense']) ), 2)  +"zł" );
        });
    });
}
function send_newsell_modal() 
{
    var data1 = $('#product_type_select').val();
    var data1_1 = $('#product_type_select option:selected').text();

    var data2 = $('#product_list_select').val();
    var data2_1 = $('#product_list_select option:selected').text();

    var data3 = $('#payment_metchod_list_select').val();
    var data3_1 = $('#payment_metchod_list_select option:selected').text();

    var data4 = $('#return_to_buy').val();
    var data5 = $('#return_input').val();
    var data6 = $('#return_exchange_input').val();
    if($('#value_input').val() == 0) {
        var data7 = 1;
    }
    else {
        var data7 = $('#value_input').val();
    }

    var data = [data1, data1_1, data2, data2_1, data3, data3_1, data4, data5, data6, data7];

    if( hasEmptyElement(data) )
    {
        alert("Nie podano wszystkich wartości!");
    }
    else
    {
        $.ajax({
            url : "http://localhost:3080/api/new_payment/",
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            data: { status: 'ok', data: data }
        })
        .done(function(res) {
            refresh();
            $('#newSell').modal('hide');
            if(res['status'] == 0) {
                $.notify({
                    // options
                    message: 'Wystąpił błąd :(' 
                },{
                    // settings
                    type: 'danger'
                });
            }
            else {
                $.notify({
                    // options
                    message: 'Produkt dodany do dzisiejszej spedaży' 
                },{
                    // settings
                    type: 'success'
                })
            }
            
        })
        .fail(function(err) {
            $('#newSell').modal('hide');
            $.notify({
                // options
                message: 'Wystąpił błąd :(' 
            },{
                // settings
                type: 'error'
            });
        });
    }
}
function send_newExpense_modal() 
{
    var data1 = $('#expense_product_type_select option:selected').text();
    var data2 = $('#expense_comment').val();
    var data3 = $('#expese_cost').val();

    var data = [data1, data2, data3];

    if( hasEmptyElement(data) )
    {
        alert("Nie podano wszystkich wartości!");
    }
    else
    {
        $.ajax({
            url : "http://localhost:3080/api/new_expense/",
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            data: { status: 'ok', data: data }
        })
        .done(function(res) {
            $('#newExpense').modal('hide');
            if(res['status'] == 0) {
                $.notify({
                    // options
                    message: 'Wystąpił błąd :(' 
                },{
                    // settings
                    type: 'danger'
                });
            }
            else {
                refresh();
                $.notify({
                    // options
                    message: 'Produkt dodany do dzisiejszych wydatków' 
                },{
                    // settings
                    type: 'success'
                });
            }
        })
        .fail(function(err) {
            $('#newExpense').modal('hide');
            $.notify({
                // options
                message: 'Wystąpił błąd :(' 
            },{
                // settings
                type: 'danger'
            });
        });
    }
}
function send_modal_day_report() 
{
    var data = $('#end_cash').val();

    if( data == undefined )
    {
        alert("Nie podano wszystkich wartości!");
    }
    else
    {
        console.log(data);
        $.ajax({
            url : "http://localhost:3080/api/new_report/",
            xhrFields: {
                withCredentials: true
            },
            type: "POST",
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            data: { status: 'ok', data: data }
        })
        .done(function(res) {
            refresh();
            $('#dayReport').modal('hide');
            if(res['status'] == 0) {
                $.notify({
                    // options
                    message: 'Wystąpił błąd :(' 
                },{
                    // settings
                    type: 'danger'
                });
            }
            else {
                $.notify({
                    // options
                    message: 'Raport został wykonany poprawnie' 
                },{
                    // settings
                    type: 'success'
                });
            }
        })
        .fail(function(err) {
            $('#dayReport').modal('hide');
            $.notify({
                // options
                message: 'Wystąpił błąd :(' 
            },{
                // settings
                type: 'danger'
            });
        });
    }
}