function addToCart(){
    $.ajax({
        url:'/add_to_cart',
        data: $('#cart-product').serialize(),
        method:'post',
        success:(response)=>{
            if(response.cart){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Item added to cart',
                    showConfirmButton: false,
                    timer: 1000
                  })
            let count = $('#cart-count').html()
            count = parseInt(count)+1
            $('#cart-count').html(count)
            }else if (response.exist) {
                Swal.fire({
                    position: 'center',
                    title: `Sorry...! 
                    Already added to Cart`,
                    showConfirmButton: false,
                    timer: 1000
                  })
            }else{
                window.location = '/user_login'
            }
        }
    })
}

function addToWishlist(_id){
    $.ajax({
        url:'/add_to_wishlist',
        data:{
            _id:_id,
        },
        method:'post',
        success:(response)=>{
            if(response.wishlist){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Item added to wishlist',
                    showConfirmButton: false,
                    timer: 1000
                  })
            let count = $('#wishlist-count').html()
            count = parseInt(count)+1
            $('#wishlist-count').html(count)
            }else if (response.exist) {
                Swal.fire({
                    position: 'center',
                    title: `Sorry...! 
                    Already added to Wishlist`,
                    showConfirmButton: false,
                    timer: 1000
                  })
            }else{
                window.location = '/user_login'
            }
        }
    })
}

function counting(proId,price,Cartcount){
    let quantity = parseInt(document.getElementById(proId).innerHTML)
    Cartcount = parseInt(Cartcount)
    $.ajax({
        url:'/cart_quantity',
        data:{
            _id:proId,
            count:Cartcount,
            quantity:quantity,
            Price:price
        },
        method:'post',
        success:(response)=>{
            if (response) {
                document.getElementById(proId).innerHTML = quantity+Cartcount
                document.getElementById('total').innerHTML = response.totalAmount
                document.getElementById('discount').innerHTML = response.discountPrice
                document.getElementById('lastPrice').innerHTML = response.totalLast
            }
        }
    })
}

function removeCart(proId){
    $.ajax({
        url:'/cart/delete',
        data:{
            _id:proId
        },
        method:'post',
        success:(response)=>{
            if (response) {
                alert("Cart is removed")
                location.reload()
            }
        }
    })
}

function removeWishlist(proId){
    $.ajax({
        url:'/wishlist/delete',
        data:{
            _id:proId
        },
        method:'post',
        success:(response)=>{
            if (response) {
                alert("Wishlist is removed")
                location.reload()
            }
        }
    })
}