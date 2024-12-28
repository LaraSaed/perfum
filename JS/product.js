$(document).ready(function() {
    console.log("Document is ready.");

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        let totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        $('#cart-count').text(totalQuantity);
    }

    function showToast(message) {
        const toast = $(`
            <div class="toast">
                ${message}
            </div>
        `);
        $('body').append(toast);
        toast.fadeIn(400).delay(2000).fadeOut(400, function() {
            $(this).remove();
        });
    }

    function loadProducts() {
        console.log("Fetching products...");
        $.ajax({
            url: 'JSON/prod.json', 
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                console.log("Products fetched successfully:", data);
                displayProducts(data);
            },
            error: function(error) {
                console.error('Error fetching products:', error);
                $('#products-container')
                  .html('<p>Sorry, there was an error loading the products.</p>');
            }
        });
    }

    function displayProducts(products) {
        console.log("Displaying products...");
        const container = $('#products-container');
        container.empty(); 

        products.forEach((product, index) => {
            const productCard = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p class="price">${product.price}</p>
                        <a href="#" class="add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" data-description="${product.description}">Add to Cart</a>
                    </div>
                </div>
            `;
            container.append(productCard);
        });
    }

    $('#search-bar').on('keyup', function() {
        const query = $(this).val().toLowerCase();
        console.log("Search query:", query);

        $('.product-card').filter(function() {
            const productName = $(this).find('h3').text().toLowerCase();
            const match = productName.indexOf(query) > -1;
            $(this).toggle(match);

            if (match) {
                console.log(`Displaying product: ${productName}`);
            }
        });
    });

    $(document).on('click', '.add-to-cart', function(e) {
        e.preventDefault();

        const productName = $(this).data('name');
        const productPrice = $(this).data('price');
        const productImage = $(this).data('image');
        const productDescription = $(this).data('description');

        const existingProductIndex = cart.findIndex(item => item.name === productName);

        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
            showToast(`Increased quantity of "${productName}" to ${cart[existingProductIndex].quantity}.`);
            console.log(`Increased quantity of "${productName}" to ${cart[existingProductIndex].quantity}.`);
        } else {
            const productObj = {
                name: productName,
                price: productPrice,
                image: productImage,
                description: productDescription,
                quantity: 1
            };
            cart.push(productObj);
            showToast(`"${productName}" added to cart!`);
            console.log(`Added "${productName}" to cart.`);
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        updateCartCount();

        $('#cart-icon').addClass('bounce-cart');
        setTimeout(() => {
            $('#cart-icon').removeClass('bounce-cart');
        }, 600);
    });

    loadProducts();
    updateCartCount();
});
