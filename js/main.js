$(document).ready(function() {
    $.getJSON( "version.json", function(data) {
        $("#version").html("Wersja interfejsu: " + data['interface-version'] + " Wersja silnika: " + data['engine-version'] + "");
      })
    $.get('include/menu.html', function(data) {
        $("#main_menu").replaceWith(data);
        $("#accordionSidebar li a").click(function() {
            $(this).parent().addClass('active');
        });
    });
    $.ajax({
        url : "http://localhost:3080/api/get_user/",
        xhrFields: {
            withCredentials: true
        },
        dataType : "json"
    })
    .done(function(res) {
        if(res['status'] == 0) {
            window.location.href = 'login.html';
        }
        else {
            change_page();
        }
    });
});
function change_page(page) {
    if(page) {
        $('#accordionSidebar li.active').removeClass('active');
    }
    var page_name;
    switch (page) { 
        case 'index':
        default: 
            page_name = "Panel Kontrolny";
            $('#page_body').load('pages/dashboard.html', function() {
                $('#dataTable').DataTable({
                    ajax: {
                        url: "http://localhost:3080/api/get_day_payments/",
                        dataSrc: "data",
                        xhrFields: {
                            withCredentials: true
                        }
                    },
                    order: [[ 0, "desc" ]]
                });
                $("#page_body").append($("<div>").load("pages/dashboard_modals.html"));
                refresh();
            });
            break;
        case 'reservations': 
            page_name = "Rezerwacje";
            $('#page_body').html('<div class="text-center"><div class="error mx-auto" data-text="W trakcie tworzenia">W trakcie tworzenia</div><p class="lead text-gray-800 mb-5">Funkcjonalność zostanie dopiero dodana</p><p class="text-gray-500 mb-0">Póki co zapraszam do korzystania z reszty funkcji</p></div>');
            break;
        case 'pass': 
            page_name = "Karnety";
            $('#page_body').load('pages/pass.html', function() {
                $('#dataTable').DataTable({
                    searching: true
                });
                $("#page_body").append($("<div>").load("pages/pass_modals.html"));
            });
            break;		
        case 'tokens': 
            page_name = "Bony";
            $('#page_body').load('pages/tokens.html', function() {
                $('#dataTable').DataTable({
                    searching: true
                });
                $("#page_body").append($("<div>").load("pages/tokens_modals.html"));
            });
            break;
        case 'reports': 
            page_name = "Raporty";
            $('#page_body').load('pages/reports.html', function() {
                var d = new Date();
                var currMonth = d.getMonth();
                var currYear = d.getFullYear();
                var startDate = new Date(currYear, currMonth, 1);

                $.fn.datepicker.dates['pl'] = {
                    days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
                    daysShort: ["Niedz", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"],
                    daysMin: ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"],
                    months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
                    monthsShort: ["STY", "LUT", "MAR", "KWI", "MAJ", "CZE", "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU"]
                };
                $('#date').datepicker({
                    language: 'pl',
                    format: "yyyy-mm-01",
                    minViewMode: "months"
                })
                .on('changeDate', function(ev){
                    $("#dataTable").DataTable().destroy()
                    $('#dataTable').DataTable({
                        ajax: "include/php/form_data.php?p=day_reports&date="+ev.format(),
                        order: [[ 0, "desc" ]]
                    });
                });
                $('#date').datepicker('update', startDate);
                $('#dataTable').DataTable({
                    ajax: "include/php/form_data.php?p=day_reports",
                    order: [[ 0, "desc" ]]
                });
            });
            break;
        case 'stats': 
            page_name = "Statystyki";
            $('#page_body').load('pages/stats.html', function() {
                var d = new Date();
                var currDay = d.getDate();
                var currMonth = d.getMonth();
                var currYear = d.getFullYear();
                var startDate = new Date(currYear, currMonth, currDay);
                $.fn.datepicker.dates['pl'] = {
                    days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
                    daysShort: ["Niedz", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"],
                    daysMin: ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"],
                    months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
                    monthsShort: ["STY", "LUT", "MAR", "KWI", "MAJ", "CZE", "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU"]
                };
                $('#date').datepicker({
                language: 'pl',
                format: "yyyy-mm-01",
                minViewMode: "months"
                })
                .on('changeDate', function(ev){
                    $.get('include/php/form_data.php?p=gen_stats&date='+ev.format(), function(d) {
                        $("#dataTable").DataTable().destroy();
                        $('#dataTable').html(d);
                        $('#dataTable').DataTable();
                    });
                });
                $.get('include/php/form_data.php?p=gen_stats', function(d) {
                    $('#dataTable').html(d);
                    $('#dataTable').DataTable();
                });
                $('#date').datepicker('update', startDate);
            });
            break;
        case 'day_report': 
            page_name = "Statystyki Dzienne";
            $('#page_body').load('pages/day_report.html', function() {
                var d = new Date();
                var currDay = d.getDate();
                var currMonth = d.getMonth();
                var currYear = d.getFullYear();
                var startDate = new Date(currYear, currMonth, currDay);

                $.fn.datepicker.dates['pl'] = {
                    days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
                    daysShort: ["Niedz", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"],
                    daysMin: ["Nd", "Pn", "Wt", "Śr", "Czw", "Pt", "Sb", "Nd"],
                    months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
                    monthsShort: ["STY", "LUT", "MAR", "KWI", "MAJ", "CZE", "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU"]
                };
                $('#date').datepicker({
                    language: 'pl',
                    format: "yyyy-mm-dd",
                    weekStart: 1
                })
                .on('changeDate', function(ev){
                    $("#dataTable").DataTable().destroy();
                    $('#dataTable').DataTable({
                        ajax: {
                            url: "http://localhost:3080/api/get_day_payments/"+ev.format(),
                            dataSrc: "data",
                            xhrFields: {
                                withCredentials: true
                            }
                        },
                        order: [[ 0, "desc" ]]
                    });
                });
                $('#date').datepicker('update', startDate);
                $('#dataTable').DataTable({
                    ajax: {
                        url: "http://localhost:3080/api/get_day_payments/",
                        dataSrc: "data",
                        xhrFields: {
                            withCredentials: true
                        }
                    },
                    order: [[ 0, "desc" ]]
                });
            });
            break;
        case 'edit_products': 
            page_name = "Edycja Produktów";
            $('#page_body').load('pages/edit_products.html', function() {
                $('#dataTable').DataTable({
                    searching: false,
                    ajax: "include/php/form_data.php?p=product_list",
                    order: [[ 0, "asc" ]]
                });
            });
            break;
    }
    $.get('include/top_menu.html', function( data ) {
        $.ajax({
            url : "http://localhost:3080/api/get_user/",
            xhrFields: {
                withCredentials: true
            },
            dataType : "json"
        })
        .done(function(res) {
            if(res['status'] != 0) {
                data = data.replace("%%PAGE%%", page_name);
                data = data.replace("%%USER%%", res['data']['Name']);
                $('#top_menu').html(data);
            }
            else {
                window.location.href = 'login.html';
            }
        });
    });
    return false;
}