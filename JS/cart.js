$(document).ready(function() {
  console.log("Enhanced Cart page is ready.");

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const cartContainer = $('#cart-items');
  const selectedTotal = $('#selected-total');
  const checkoutBtn = $('#checkout-btn');
  const selectAllCheckbox = $('#select-all');
  const removeAllBtn = $('#remove-all');
  const cartControls = $('.cart-controls');

  
  function renderCart() {
      cartContainer.empty();
      
      let totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      $('#cart-count').text(totalQty);

      if (cart.length === 0) {
          cartContainer.html('<p>Your cart is empty.</p>');
          
          cartContainer.addClass('empty-cart-message');
          
          cartControls.removeClass('show');
          
          selectedTotal.text('$0.00');
          selectAllCheckbox.prop('checked', false);
          return;
      } else {
          cartContainer.removeClass('empty-cart-message');
          
          cartControls.addClass('show');
      }

      cart.forEach((item, index) => {
          const itemPriceValue = parseFloat(item.price.replace('$', '')) || 0;
          const itemQty = item.quantity || 1;
          const itemTotal = (itemPriceValue * itemQty).toFixed(2);

          const cartItem = $(`
              <div class="cart-item">
                  <!-- Checkbox to select for purchase -->
                  <input type="checkbox" class="select-to-buy" data-index="${index}" />
                  
                  <!-- Product Image -->
                  <img src="${item.image}" alt="${item.name}" />
                  
                  <!-- Cart Item Info -->
                  <div class="cart-item-info">
                      <h3>${item.name}</h3>
                      ${item.description ? `<p>${item.description}</p>` : ''}
                      
                      <p class="price">Unit Price: ${item.price}</p>

                      <!-- Quantity & total price row -->
                      <div class="quantity-container">
                          <label for="quantity-${index}">Qty:</label>
                          <select id="quantity-${index}" class="quantity-selector" data-index="${index}">
                              ${generateQuantityOptions(itemQty)}
                          </select>
                      </div>

                      <p class="item-total-price">Item Total: $${itemTotal}</p>

                      <button class="remove" data-index="${index}">Remove</button>
                  </div>
              </div>
          `);

          cartContainer.append(cartItem);
      });

      updateSelectedTotal();
  }

  
  function generateQuantityOptions(selectedQuantity) {
      let options = '';
      for (let i = 1; i <= 10; i++) {
          options += `<option value="${i}" ${i === selectedQuantity ? 'selected' : ''}>${i}</option>`;
      }
      return options;
  }

  
  function updateSelectedTotal() {
      let total = 0;
      $('.select-to-buy:checked').each(function() {
          const index = $(this).data('index');
          const itemPrice = parseFloat(cart[index].price.replace('$', '')) || 0;
          const itemQuantity = cart[index].quantity || 1;
          total += itemPrice * itemQuantity;
      });
      selectedTotal.text(`$${total.toFixed(2)}`);
  }

  
  $(document).on('click', '.remove', function() {
      const index = $(this).data('index');
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
  });

  
  $(document).on('change', '.select-to-buy', function() {
      updateSelectedTotal();

      const totalItems = $('.select-to-buy').length;
      const checkedItems = $('.select-to-buy:checked').length;
      if (checkedItems !== totalItems) {
          selectAllCheckbox.prop('checked', false);
      } else {
          selectAllCheckbox.prop('checked', true);
      }
  });

  
  $(document).on('change', '.quantity-selector', function() {
      const index = $(this).data('index');
      const newQty = parseInt($(this).val());
      cart[index].quantity = newQty;

      const itemPriceValue = parseFloat(cart[index].price.replace('$', '')) || 0;
      const newItemTotal = (itemPriceValue * newQty).toFixed(2);
      $(this).closest('.cart-item-info').find('.item-total-price').text(`Item Total: $${newItemTotal}`);

      localStorage.setItem('cart', JSON.stringify(cart));

      let totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      $('#cart-count').text(totalQty);

      updateSelectedTotal();
  });

  
  checkoutBtn.on('click', function() {
      const selectedIndexes = [];
      $('.select-to-buy:checked').each(function() {
          selectedIndexes.push($(this).data('index'));
      });

      if (selectedIndexes.length === 0) {
          alert('No items selected for checkout.');
          return;
      }

      alert('Thank you for your purchase of the selected items!');

      selectedIndexes.sort((a, b) => b - a).forEach(idx => {
          cart.splice(idx, 1);
      });

      localStorage.setItem('cart', JSON.stringify(cart));

      renderCart();
  });

 
  selectAllCheckbox.on('change', function() {
      const isChecked = $(this).is(':checked');
      $('.select-to-buy').prop('checked', isChecked);
      updateSelectedTotal();
  });

  
  removeAllBtn.on('click', function() {
      if (!confirm('Are you sure you want to remove ALL items from your cart?')) {
          return;
      }
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
  });

  
  renderCart();
});
