/* NAVBAR */

/* add background class to navbar */
addBackgroundClass = function () {
    if ($('.navbar').offset().top > 1) {
        $('.navbar').addClass('background');
    } else {
        $('.navbar').removeClass('background');
    }
}

/* if page's position bigger than 1 then add background class to navbar */
$(document).ready(addBackgroundClass)

/* if page's position bigger than 1 then add background class to navbar (while scrolling) */
$(document).scroll(addBackgroundClass)

/* when hovered to navbar-menu-item */
$(document).on('click', '.navbar-menu-item.dropable', function () {
    if ($(window).width() > 768) {
        $(this).addClass('hovered');
        $(this).children('.navbar-drop-menu').fadeIn(200).addClass('show');
    }
});

/* when hovered to out of navbar-menu-item */
$(document).on('click', '.navbar-menu-item.dropable.hovered', function () {
    if ($(window).width() > 768) {
        $(this).removeClass('hovered');
        $(this).find('.navbar-drop-menu').fadeOut(200).removeClass('show');
    }
});

/* collapse navbar-menu on mobile */
$(document).on('click', '.navbar-menu-collapser-cover button', function () {

    if (!$('.navbar-menu').hasClass('show')) {
        $('.navbar').addClass('collapsed');
        $('.navbar-menu').addClass('show');
        $('body').addClass('noscroll');
    } else {
        $('.navbar').removeClass('collapsed');
        $('.navbar-menu').removeClass('show');
        $('body').removeClass('noscroll');
    }

});

$(document).on('click', '.navbar-menu-item.dropable', function () {
    if ($(window).width() < 768) {
        if (!$(this).hasClass('hovered')) {
            $(this).addClass('hovered');
            $(this).find('.navbar-drop-menu').slideDown(200).addClass('show');
        } else {
            $(this).removeClass('hovered');
            $(this).find('.navbar-drop-menu').slideUp(200).removeClass('show');
        }
    }

});

/* CART */
/* CART-FUNCTION calculate total price */
function cartCalculateTotalPrice(){
    const allCartProducts = $('.navbar-cart .cart-item')
    let allCartProductsPrices = 0
    for (let i = 0; i < allCartProducts.length; i++) {
        allCartProductsPrices += parseInt(allCartProducts.eq(i).find('.cart-item-current-price .price').text())
    }
    $('.navbar-cart .cart-footer .cart-total-price .price').text(allCartProductsPrices)
}

/* CART-FUNCTION count products */
function cartCountProducts(){
    const allCartProducts = $('.navbar-cart .cart-item').length
    $('.navbar-cart-collapser-cover .cart-count-product p').text(allCartProducts)
}

/* CART-FUNCTION check null */
function cartCheckNull(){
    const cartTotalPrice = $('.navbar-cart .cart-footer .cart-total-price .price').text()
    if(cartTotalPrice == 0){
        $('.navbar-cart .cart-items .cart-null').fadeIn(250).addClass('show')
    } else{
        $('.navbar-cart .cart-items .cart-null.show').fadeOut(0).removeClass('show')
    }
}

/* CART-FUNCTION show cart */
function cartShow() {
    $('.navbar-cart').fadeIn(100).addClass('show')
}

/* CART-FUNCTION close cart  */
function cartClose() {
    $('.navbar-cart').fadeOut(100).removeClass('show')
}

/* CART show button in only magaza page */
$(document).ready(function(){

    const path = window.location.pathname
    const pathArray = path.split('/')

    if(pathArray[1] == 'magaza'){
        $('.navbar-cart-collapser-cover').addClass('show')
    }

    cartCalculateTotalPrice()
    cartCheckNull()
    cartCountProducts()
})

/* CART remove cart item */
$(document).on('click', '.navbar-cart .cart-item .cart-item-remove-cover button', function(){
    $(this).closest('.cart-item').fadeOut(100, function(){
        $(this).remove()
        cartCalculateTotalPrice()
        cartCheckNull()
        cartCountProducts()
    })
})

/* collapse navbar-cart on desktop */
$(document).on('click', '.navbar-cart-collapser-cover button', function () {

    if(!$('.navbar-cart').hasClass('show')){
        cartShow()
    } else{
        cartClose()
    }

})

/* PRODUCT-PAGE - ADD PRODUCT TO CART */
$(document).on('click', '.product-page .add-cart-button button', function(){

    const productId = $(this).attr('productId')
    console.log(productId)

    $.ajax({
        method: 'POST',
        url: '/productAddCart',
        contentType: 'application/json',
        data: JSON.stringify({
            productId: productId
        }),
        success: function(res){

            if(res.status == true){
                
                const productImage = res.product.productImages[0].productImage
                const productName = res.product.productName
                const productOldPrice = res.product.productOldPrice
                const productCurrentPrice = res.product.productCurrentPrice
                const productUrl = res.product.productUrl

                const cartImageHtml = '<div class="cart-item-image"><a href="'+productUrl+'"><img src="/assets/img/products/'+productImage+'" alt=""></a></div>'
                const cartTitleHtml = '<div class="cart-item-title"><a href="'+productUrl+'"><h4>'+productName+'</h4><a/></div>'
                let cartPriceHtml = ''
                if(productOldPrice){
                    cartPriceHtml = '<div class="cart-item-price"><div class="cart-item-old-price"><p><span class="price">'+productOldPrice+'</span><span class="sign">₺</span></p></div><div class="cart-item-current-price"><p><span class="price">'+productCurrentPrice+'</span><span class="sign">₺</span></p></div><div>'
                } else{
                    cartPriceHtml = '<div class="cart-item-price"><div class="cart-item-old-price"></div><div class="cart-item-current-price"><p><span class="price">'+productCurrentPrice+'</span><span class="sign">₺</span></p></div><div>'
                }
                const cartItemHtml = '<div class="cart-item">'+cartImageHtml+'<div class="cart-item-details">'+cartTitleHtml+cartPriceHtml+'</div><div class="cart-item-remove-cover"><button><i class="fas fa-times"></i></button></div></div>'
                
                $('.navbar-cart .cart-items').prepend(cartItemHtml)

                cartCalculateTotalPrice()
                cartCheckNull()
                cartCountProducts()

            } else{
                alert('error')
            }

        }
    })

})

/* SLIDER */
const swiper = new Swiper('.swiper-container', {
    
    direction: 'horizontal',
    autoplay: {
        delay: 3500
      },
    scrollbar: {
      el: '.swiper-scrollbar',
    }
  });

/* SEO TEXT */
$(document).ready(function() {

    const firstH1 = $('.footer .footer-top-seo-text').children('h1').text()
    const firstText = $('.footer .footer-top-seo-text').children('p').first().text()
    $('.footer .footer-top-seo-text').children('h1').remove()
    $('.footer .footer-top-seo-text').children('p').first().remove()

    const otherTexts = $('.footer .footer-top-seo-text').html()
    $('.footer .footer-top-seo-text > *').remove()

    $('<div class="constantSeoText"><h1>'+firstH1+'</h1><p>'+firstText+'</p><p class="slideSeoText">Devamını oku...</p></div>').appendTo('.footer .footer-top-seo-text')
    $('<div class="slidingSeoText">'+otherTexts+'</div>').appendTo('.footer .footer-top-seo-text')

    $('.footer .slidingSeoText').slideUp(0)

    
})

function slideSeoTextButton () {

    if(!$('.footer .slidingSeoText').hasClass('show')){
        $('.footer .slidingSeoText').slideDown(500)
        $('.footer .slidingSeoText').addClass('show')
        $('.footer .slideSeoText').text('Devamını gizle...')
        $('.footer .slideSeoText').appendTo('.slidingSeoText')

    } else {
        $('.footer .slidingSeoText').slideUp(500)
        $('.footer .slidingSeoText').removeClass('show')
        $('.footer .slideSeoText').text('Devamını göster...')
        $('.footer .slideSeoText').appendTo('.constantSeoText')
    }

}

$(document).on('click', '.footer .slideSeoText', slideSeoTextButton)

/* PRODUCT IMAGES */
$(document).on('click', '.product-page .all-images img', function(){

    let currentImage = $('.product-page .current-image img')
    let thisImage = $(this)

    currentImage.attr('src', thisImage.attr('src'))
    $('.image.active').removeClass('active')
    thisImage.closest('.image').addClass('active')

})

/* LIGHT GALLERY */
lightGallery(document.getElementById('bigger-image'), {
    download: false,
    thumbnail: true,
    zoom: true,
    plugins: [lgZoom, lgThumbnail]
});

lightGallery(document.getElementById('lightGallery'), {
    download: false,
    thumbnail: true,
    zoom: true,
    plugins: [lgZoom, lgThumbnail]
});

/* REFRESH PRODUCTS FUNCTION*/
function refreshProducts() {

    /* drone series */
    const productsColumn = $('.store-page .products-column')
    let productDroneSeries = $('.store-page .products-criteria.drone-series input:checked')
    let productDroneSeriesArray = []
    
    for (let i = 0; i < productDroneSeries.length; i++) {
        productDroneSeriesArray[i] = productDroneSeries.eq(i).val()
    }

    /* product price */
    const productMinPrice = $('.store-page .products-criteria.product-price .product-min-price').val()
    const productMaxPrice = $('.store-page .products-criteria.product-price .product-max-price').val()


    $.ajax({
        method: 'POST',
        url: '/magaza',
        contentType: 'application/json',
        data: JSON.stringify({
            productDroneSeries: productDroneSeriesArray,
            productMinPrice: productMinPrice,
            productMaxPrice: productMaxPrice
        }),
        success: function(res){

            if(res.status == true){
                
                productsColumn.find('.product-cover').remove()
                const products = res.products

                for (let i = 0; i < products.length; i++) {
                    
                    let productImage = '<div class="product-image"><img src="/assets/img/products/'+ products[i].productImages[0].productImage +'" alt="'+ products[i].productImages[0].productImage +'" ></div>'

                    let productTitle = '<div class="product-title"><h3>' + products[i].productName + '</h3></div>'

                    let productPrice = ''
                    if(products[i].productCurrentPrice != products[i].productOldPrice){
                        productPrice = '<div class="product-price"><p class="product-old-price"><span class="price">' + products[i].productOldPrice + '</span><span class="sign">₺</span></p><p class="product-current-price"><span class="price">' + products[i].productCurrentPrice + '</span><span class="sign">₺</span></p></div>'
                    } else{
                        productPrice = '<div class="product-price"><p class="product-current-price"><span class="price">' + products[i].productCurrentPrice + '</span><span class="sign">₺</span></p></div>'
                    }

                    let product = '<a class="product" href="/magaza/' + products[i].productUrl + '">' + productImage + productTitle + productPrice + '</a>'

                    let productCover = '<div class="product-cover desktop-4 notebook-3 tablet-2 mobile-2">' + product + '</div>'

                    productsColumn.hide().append(productCover).fadeIn(150)

                }

            } else {
                alert(res.message)
            }

        }
    })
    
}

/* STORE - PRODUCT FILTERING */
$(document).on('change', '.store-page .products-criteria.drone-series input', refreshProducts)
$(document).on('change', '.store-page .products-criteria.product-price input', refreshProducts)

/* close any menu when clicking outsite */
$(document).on('click', function(e){
    if($('.navbar-cart.show, .navbar-cart-collapser-cover.show').has(e.target).length === 0){
        cartClose()
    }
})