$(function () {
    function formatOrderDetails(details) {
        if (!details || details.length === 0) {
            return "No items";
        }
        return details
            .map(item => `${item.product_name} (${parseFloat(item.quantity)} × ${parseFloat(item.price_per_unit)} = ${parseFloat(item.total_price)})`)
            .join("<br>");
    }
    $.get(orderListApiUrl, function (response) {
        if (response) {
            var table = '';
            var totalCost = 0;
            $.each(response, function (index, order) {
                totalCost += parseFloat(order.total);
                table += '<tr>' +
                    '<td>' + order.datetime + '</td>' +
                    '<td>' + order.order_id + '</td>' +
                    '<td>' + order.customer_name + '</td>' +
                    '<td>' + formatOrderDetails(order.order_details) + '</td>' +
                    '<td>' + parseFloat(order.total).toFixed(2) + ' Rs</td></tr>';
            });
            table += '<tr><td colspan="3" style="text-align: end"><b>Total</b></td><td><b>' + totalCost.toFixed(2) + ' Rs</b></td></tr>';
            $("table").find('tbody').empty().html(table);
        }
    });
});
