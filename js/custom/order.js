var productPrices = {};

$(function () {

    // Fetch product list and populate dropdown
    $.get(productListApiUrl, function (response) {
        productPrices = {};

        if (response) {
            let options = '<option value="">--Select--</option>';

            $.each(response, function (index, product) {
                options +=
                    '<option value="' + product.product_id + '">' +
                    product.name +
                    '</option>';

                productPrices[product.product_id] = product.price_per_unit;
            });

            $(".product-box").find("select").html(options);
        }
    });
});


// Add more product rows
$("#addMoreButton").click(function () {
    var row = $(".product-box").html();
    $(".product-box-extra").append(row);

    // Fix new row defaults
    var lastRow = $(".product-box-extra .row").last();
    lastRow.find(".remove-row").removeClass("hideit");
    lastRow.find(".product-price").val("0.0");
    lastRow.find(".product-qty").val("1");
    lastRow.find(".product-total").val("0.0");
});


// Remove product row
$(document).on("click", ".remove-row", function () {
    $(this).closest(".row").remove();
    calculateValue();
});


// When user selects product
$(document).on("change", ".cart-product", function () {
    var product_id = $(this).val();
    var price = productPrices[product_id] || 0;

    var $row = $(this).closest(".row");
    $row.find(".product-price").val(price);

    calculateValue();
});


// When quantity changes
$(document).on("change", ".product-qty", function () {
    calculateValue();
});


// Save Order
$("#saveOrder").on("click", function () {

    var payload = {
        customer_name: $("#customerName").val().trim(),
        total: $("#product_grand_total").val(),
        order_details: []
    };

    $("#itemsInOrder .product-item").each(function () {
        var $row = $(this);

        var product_id = $row.find(".cart-product").val();
        if (!product_id) return;

        payload.order_details.push({
            product_id: product_id,
            quantity: $row.find(".product-qty").val(),
            unit_price: $row.find(".product-price").val(),
            total_price: $row.find(".product-total").val()
        });
    });

    console.log("ORDER PAYLOAD →", payload);

    $.ajax({
        url: orderSaveApiUrl,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (res) {
            console.log("Order saved:", res);
            alert("Order saved");
            window.location = "index.html";
        },
        error: function (xhr, status, err) {
            console.error("Order save FAILED:", xhr.responseText);
            alert("Error saving order — check console");
        }
    });
});


// ----------------------
// CALCULATE VALUES
// ----------------------
function calculateValue() {
    var grandTotal = 0;

    $("#itemsInOrder .product-item").each(function () {
        var $row = $(this);

        var qty = parseFloat($row.find(".product-qty").val()) || 0;
        var price = parseFloat($row.find(".product-price").val()) || 0;

        var total = qty * price;

        $row.find(".product-total").val(total.toFixed(2));

        grandTotal += total;
    });

    $("#product_grand_total").val(grandTotal.toFixed(2));
}
