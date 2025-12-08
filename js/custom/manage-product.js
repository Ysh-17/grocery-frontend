// ------------------------------
// API URLs
// ------------------------------
var productListApiUrl = 'https://grocery-backend-zkw7.onrender.com/getProducts';
var uomListApiUrl = 'https://grocery-backend-zkw7.onrender.com/getUOM';
var productSaveApiUrl = 'https://grocery-backend-zkw7.onrender.com/insertProduct';
var productDeleteApiUrl = 'https://grocery-backend-zkw7.onrender.com/deleteProduct';

var productModal = $("#productModal");


// ------------------------------------------------
// PREVENT FORM FROM SUBMITTING (main fix!!!)
// ------------------------------------------------
$("#productForm").on("submit", function (e) {
    e.preventDefault();
});


// ------------------------------------------------
// LOAD PRODUCT LIST
// ------------------------------------------------
$(function () {
    $.get(productListApiUrl, function (response) {
        if (response) {
            var table = "";

            $.each(response, function (index, product) {
                table += `
                    <tr data-id="${product.product_id}" data-name="${product.name}">
                        <td>${product.name}</td>
                        <td>${product.uom_name}</td>
                        <td>${product.price_per_unit}</td>
                        <td>
                            <span class="btn btn-xs btn-danger delete-product">Delete</span>
                        </td>
                    </tr>`;
            });

            $("table tbody").html(table);
        }
    });
});


// ------------------------------------------------
// SAVE PRODUCT
// ------------------------------------------------
$("#saveProduct").off("click").on("click", function (e) {
    e.preventDefault(); // stop form auto-submit

    var formData = $("#productForm").serializeArray();

    var payload = {
        name: "",
        uom_id: "",
        price_per_unit: ""
    };

    // map form values
    formData.forEach(item => {
        if (item.name === "name") payload.name = item.value;
        if (item.name === "uoms") payload.uom_id = item.value;
        if (item.name === "price") payload.price_per_unit = item.value;
    });

    // validation
    if (!payload.name || !payload.uom_id || !payload.price_per_unit) {
        alert("Please fill all fields!");
        return;
    }

    // API call
    $.ajax({
        url: productSaveApiUrl,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: function (res) {
            alert("Product added successfully!");
            location.reload();
        },
        error: function (xhr) {
            console.error("Insert Product Error:", xhr.responseText);
            alert("Failed to add product");
        }
    });
});


// ------------------------------------------------
// DELETE PRODUCT
// ------------------------------------------------
// Delete product click event
$("table").on("click", ".delete-product", function() {
    var productId = $(this).closest("tr").data("id");
    console.log("Deleting product ID:", productId); // Debug
    deleteProduct(productId);
});

// Delete API function
function deleteProduct(productId) {
    if (!productId) {
        alert("Invalid product ID");
        return;
    }

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }

    $.ajax({
        method: "POST", // or "DELETE" depending on API
        url: productDeleteApiUrl,
        contentType: "application/json",
        data: JSON.stringify({ product_id: productId }),
        success: function(response) {
            alert("Product deleted successfully!");
            window.location.reload();
        },
        error: function(xhr) {
            console.error("Delete Product Error:", xhr.responseText);
            alert("Failed to delete product");
        }
    });
}




// ------------------------------------------------
// RESET FORM ON MODAL CLOSE
// ------------------------------------------------
productModal.on("hide.bs.modal", function () {
    $("#productForm")[0].reset();
});


// ------------------------------------------------
// LOAD UOM DROPDOWN
// ------------------------------------------------
productModal.on('show.bs.modal', function () {
    $.get(uomListApiUrl, function (response) {

        var options = '<option value="">--Select--</option>';

        $.each(response, function (index, uom) {
            options += `<option value="${uom.uom_id}">${uom.uom_name}</option>`;
        });

        $("#uoms").html(options);
    });
});

