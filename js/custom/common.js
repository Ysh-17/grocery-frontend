// ------------------------------
// API URLs
// ------------------------------
var productListApiUrl = 'https://grocery-backend-hrrg.onrender.com/getProducts';
var uomListApiUrl = 'https://grocery-backend-hrrg.onrender.com/getUOM';
var productSaveApiUrl = 'https://grocery-backend-hrrg.onrender.com/insertProduct';
var productDeleteApiUrl = 'https://grocery-backend-hrrg.onrender.com/deleteProduct';
var orderListApiUrl = 'https://grocery-backend-hrrg.onrender.com/getAllOrders';
var orderSaveApiUrl = 'https://grocery-backend-hrrg.onrender.com/insertOrder';

// For dropdown in orders page
var productsApiUrl = 'https://fakestoreapi.com/products';

// ------------------------------
// COMMON API CALL HANDLER
// ------------------------------
function callApi(method, url, payload, isJson = false) {
    $.ajax({
        url: url,
        method: method,
        data: isJson ? payload : payload,
        contentType: isJson ? "application/json" : "application/x-www-form-urlencoded",
        success: function (res) {
            console.log("API success:", res);
            alert("Saved successfully");
            location.reload();
        },
        error: function (xhr) {
            console.error("API ERROR →", xhr.responseText);
            alert("Error saving product. Check console.");
        }
    });
}


// ------------------------------
// PARSERS (MATCH BACKEND RESPONSE)
// ------------------------------

// Product parser
function productParser(product) {
    return {
        id: product.product_id,
        name: product.name,
        unit: product.uom_name,
        price: product.price_per_unit
    };
}

// Order parser
function orderParser(order) {
    return {
        id: order.order_id,
        date: order.order_date,
        orderNo: order.order_id,
        customerName: order.customer_name,
        cost: parseFloat(order.total_price)
    };
}

// Fake products dropdown parser
function productDropParser(product) {
    return {
        id: product.id,
        name: product.title
    };
}

// ------------------------------
// SAVE PRODUCT (INSERT PRODUCT API)
// ------------------------------
$("#saveProduct").on("click", function () {

    var product = {
        name: $("#name").val(),
        uom_id: $("#uoms").val(),
        price_per_unit: $("#price").val()
    };

    if (!product.name || !product.uom_id || !product.price_per_unit) {
        alert("Please fill all fields!");
        return;
    }

    $.ajax({
        method: "POST",
        url: productSaveApiUrl,
        contentType: "application/json",
        data: JSON.stringify(product),
        success: function (response) {
            alert("Product added successfully!");
            location.reload();
        },
        error: function (xhr) {
            console.log("Insert Product Error:", xhr.responseText);
            alert("Error adding product");
        }
    });
});

// ------------------------------
// DELETE PRODUCT
// ------------------------------
function deleteProduct(productId) {
    $.ajax({
        method: "POST",
        url: productDeleteApiUrl,
        contentType: "application/json",
        data: JSON.stringify({ product_id: productId }),
        success: function () {
            alert("Product deleted!");
            window.location.reload();
        },
        error: function (err) {
            console.error("Delete Error:", err);
            alert("Delete failed");
        }
    });
}

// ------------------------------
// ORDER TOTAL CALCULATION
// ------------------------------
function calculateValue() {
    var total = 0;

    $(".product-item").each(function () {
        var qty = parseFloat($(this).find(".product-qty").val()) || 0;
        var price = parseFloat($(this).find(".product-price").val()) || 0;

        var itemTotal = qty * price;

        $(this).find(".item-total").val(itemTotal.toFixed(2));
        total += itemTotal;
    });

    $("#product_grand_total").val(total.toFixed(2));
}
