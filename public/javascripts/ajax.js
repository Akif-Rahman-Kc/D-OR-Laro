function addToCart() {
    $.ajax({
        url: '/add_to_cart',
        data: $('#cart-product').serialize(),
        method: 'post',
        success: (response) => {
            if (response.cart) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Item added to cart',
                    customClass: 'swal-wide',
                    showConfirmButton: false,
                    timer: 1000
                })
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $('#cart-count').html(count)
            } else if (response.exist) {
               Swal.fire({
                    position: 'center',
                    title: `Sorry...! 
                    Already added to Cart`,
                    customClass: 'swal-wide',
                    showConfirmButton: false,
                    timer: 1000
                })
            }else if (response.applyCoupon) {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: `Coupon Applied! 
                    
                    Please remove the coupon in cart page`,
                    customClass: 'swal-wide',
                    showConfirmButton: false,
                    timer: 1000
                })
            } else {
                window.location = '/user_login'
            }
        }
    })
}

function addToWishlist(_id) {
    $.ajax({
        url: '/add_to_wishlist',
        data: {
            _id: _id,
        },
        method: 'post',
        success: (response) => {
            if (response.wishlist) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Added to your Wishlist',
                    customClass: 'swal-wide',
                    showConfirmButton: false,
                    timer: 1000
                })
                let count = $('#wishlist-count').html()
                count = parseInt(count) + 1
                $('#wishlist-count').html(count)
                $('#'+_id).removeClass('far')
                $('#'+_id).addClass('fas')
            } else if (response.exist) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'removed from your Wishlist',
                    customClass: 'swal-wide',
                    showConfirmButton: false,
                    timer: 1000
                })
                let count = $('#wishlist-count').html()
                count = parseInt(count) - 1
                $('#wishlist-count').html(count)
                console.log("aaaaa")
                $('#'+_id).removeClass('fas')
                $('#'+_id).addClass('far')
            } else {
                window.location = '/user_login'
            }
        }
    })
}

function plus(proId) {
    let quantity = parseInt(document.getElementById(proId).innerHTML)
    $.ajax({
        url: '/cart_plus',
        data: {
            _id: proId,
            quantity: quantity
        },
        method: 'post',
        success: (response) => {
            if (response) {
                document.getElementById(proId).innerHTML = response.Quantity
                document.getElementById('total').innerHTML = response.totalAmount
                document.getElementById('discount').innerHTML = response.discountPrice
                document.getElementById('coupon-discount').innerHTML = response.couponDiscount
                document.getElementById('lastPrice').innerHTML = response.totalLast
                document.getElementById(`countDiscount${proId}`).innerHTML = response.countDiscount
                document.getElementById(`countTotal${proId}`).innerHTML = response.countTotal
                document.getElementById(`countTotalSummery${proId}`).innerHTML = response.countTotal
            }else{
                Swal.fire(
                    'Out Of Stock',
                    'This product stock is empty',
                    'warning'
                  )
            }
        }
    })
}

function minus(proId) {
    let quantity = parseInt(document.getElementById(proId).innerHTML)
    console.log(quantity);
    $.ajax({
        url: '/cart_minus',
        data: {
            _id: proId,
            quantity: quantity
        },
        method: 'post',
        success: (response) => {
            if (response.true) {
                document.getElementById(proId).innerHTML = response.true.Quantity
                document.getElementById('total').innerHTML = response.true.totalAmount
                document.getElementById('discount').innerHTML = response.true.discountPrice
                document.getElementById('coupon-discount').innerHTML = response.true.couponDiscount
                document.getElementById('lastPrice').innerHTML = response.true.totalLast
                document.getElementById(`countDiscount${proId}`).innerHTML = response.true.countDiscount
                document.getElementById(`countTotal${proId}`).innerHTML = response.true.countTotal
                document.getElementById(`countTotalSummery${proId}`).innerHTML = response.true.countTotal
            }else if(response.false){
                Swal.fire(
                    'Deleted',
                    'Minimum Cart Quantity is 1',
                    'warning'
                  ).then((result)=>{
                    location.reload()
                  })
            }
        }
    })
}

function removeCart(proId) {

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        customClass: 'swal-wide',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/cart/delete',
                data: {
                    _id: proId
                },
                method: 'post',
                success: (response) => {
                    if (response) {
                        document.getElementById('total').innerHTML = response.totalAmount
                        document.getElementById('discount').innerHTML = response.discountPrice
                        document.getElementById('coupon-discount').innerHTML = response.couponDiscount
                        document.getElementById('lastPrice').innerHTML = response.totalLast
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Item is removed the Cart',
                            customClass: 'swal-wide',
                            showConfirmButton: false,
                            timer: 1000
                        }).then((result) => {
                            location.reload()
                        })
                    }else{
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Item is removed the Cart',
                            customClass: 'swal-wide',
                            showConfirmButton: false,
                            timer: 1000
                        }).then((result) => {
                            location.href = '/cart'
                        })
                    }
                }
            })
        }
    })
}

function removeWishlist(proId) {

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        customClass: 'swal-wide',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/wishlist/delete',
                data: {
                    _id: proId
                },
                method: 'post',
                success: (response) => {
                    if (response) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Item is removed the Cart',
                            customClass: 'swal-wide',
                            showConfirmButton: false,
                            timer: 1000
                        }).then((result) => {
                            location.reload()
                        })
                    }
                }
            })
        }
    })
}

async function sendData(e) {
    const resultOl = $('#search-result');
    $.ajax({
      method: 'POST',
      url: '/search',
      data: {
        payload: e.value,
      },
      success:(response)=>{
        if (response.status === 'success') {
            if (response.search < 1) {
                resultOl.empty();
                resultOl.append(`<li class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                Sorry, Nothing found.
                </div>
                
            </li>`);
                $(document).mouseup(function (ev) {
                if (!resultOl.is(ev.target) && resultOl.has(ev.target).length === 0) {
                    resultOl.empty();
                }
                });
            } else {
                const markup = response.search.reduce(
                (acc, cur) =>
                    acc +
                    `<li class="list-group-item d-flex justify-content-between align-items-start rounded">
                <div class="ms-2 me-auto">
                <img style="width:30px" src="/images/${cur.PImage[0]}" alt="">
                <a href="/shops/details?_id=${cur._id}" class="text-dark">${cur.PName}</a>
                </div>
                <span class="text-dark">₹${cur.PPrice}</span>
            </li>`,
                ``
                );
                resultOl.empty();
                resultOl.append(markup);
                $(document).mouseup(function (ev) {
                if (!resultOl.is(ev.target) && resultOl.has(ev.target).length === 0) {
                    resultOl.empty();
                }
                });
            }
            }
      }
    });
    
  }
  