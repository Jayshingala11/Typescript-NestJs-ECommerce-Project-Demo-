$(document).ready(function () {
  $('.editBtn').click(function (event) {
    event.preventDefault();

    const prodId = $(this).data('id');
    const title = $(this).data('title');
    const price = $(this).data('price');
    const description = $(this).data('description');

    $('#admin-product').empty();
    appendEditPage({ prodId, title, price, description });
  });
});

$(document).ready(function () {
  $('.deleteBtn').click(function (event) {
    event.preventDefault();

    const prodId = $(this).data('id');
    const deleteButton = $(this);

    $.ajax({
      url: '/product/delete-product',
      type: 'POST',
      data: {
        prodId,
      },
      success: function (response) {
        if (response.success) {
          deleteButton.closest('.card').remove();
        }
      },
      error: function (error) {
        console.error('Error getting Delete post!', error);
      },
    });
  });
});

function appendEditPage(product) {
  let html = `
          <form class="product-form" action="/product/edit-product" method="POST" enctype="multipart/form-data">
          <div class="form-control">
              <label for="title">Title</label>
              <input 
                  class=""
                  type="text" 
                  name="title" 
                  id="title" 
                  value="${product.title}">
          </div>
          <div class="form-control">
              <label for="image">Image</label>
              <input 
                  type="file" 
                  name="image" 
                  id="image" >
          </div>
          <div class="form-control">
              <label for="price">Price</label>
              <input 
                  class=""
                  type="text" 
                  name="price" 
                  id="price" 
                  step="0.01" 
                  value="${product.price}">
          </div>
          <div class="form-control">
              <label for="description">Description</label>
              <textarea 
                  class=""
                  name="description" 
                  id="description" 
                  cols="30" 
                  rows="5">${product.description}</textarea>
          </div>
          <input type="hidden" value="${product.prodId}" name="prodId">
          <input type="hidden" name="token" value="<%= Token %>">
          <button class="btn" type="submit"> Update Product </button>
          </form>
      `;
  $('#admin-product').append(html);
}
