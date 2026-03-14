// ------------------------------
// API URLs
// ------------------------------
var productListApiUrl = 'https://grocery-backend-1-g7tn.onrender.com/getProducts';
var uomListApiUrl = 'https://grocery-backend-1-g7tn.onrender.com/getUOM';
var productSaveApiUrl = 'https://grocery-backend-1-g7tn.onrender.com/insertProduct';
var productDeleteApiUrl = 'https://grocery-backend-1-g7tn.onrender.com/deleteProduct';
var orderListApiUrl = 'https://grocery-backend-1-g7tn.onrender.com/getAllOrders';
var orderSaveApiUrl = 'https://grocery-backend-1-g7tn.onrender.com/insertOrder';

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
