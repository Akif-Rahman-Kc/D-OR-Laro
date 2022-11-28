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

function counting(proId, price, Cartcount) {
    let quantity = parseInt(document.getElementById(proId).innerHTML)
    Cartcount = parseInt(Cartcount)
    $.ajax({
        url: '/cart_quantity',
        data: {
            _id: proId,
            count: Cartcount,
            quantity: quantity,
            Price: price
        },
        method: 'post',
        success: (response) => {
            if (response) {
                document.getElementById(proId).innerHTML = quantity + Cartcount
                document.getElementById('total').innerHTML = response.totalAmount
                document.getElementById('discount').innerHTML = response.discountPrice
                document.getElementById('coupon-discount').innerHTML = response.couponDiscount
                document.getElementById('lastPrice').innerHTML = response.totalLast
                document.getElementById(`countDiscount${proId}`).innerHTML = response.countDiscount
                document.getElementById(`countTotal${proId}`).innerHTML = response.countTotal
                document.getElementById(`countTotalSummery${proId}`).innerHTML = response.countTotal
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