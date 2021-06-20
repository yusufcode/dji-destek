/* NAVBAR */

/* when scroll the page add background to navbar */
$(document).scroll(function () {
    if ($('.navbar').offset().top > 1) {
        $('.navbar').addClass('background');
    } else {
        $('.navbar').removeClass('background');
    }
});

/* when hovered to navbar-menu-item */
$(document).on('mouseover', '.navbar-menu-item.dropable', function () {
    if ($(window).width() > 768) {
        $(this).addClass('hovered');
        $(this).children('.navbar-drop-menu').fadeIn(200).addClass('show');
    }
});

/* when hovered to out of navbar-menu-item */
$(document).on('mouseleave', '.navbar-menu-item.dropable', function () {
    if ($(window).width() > 768) {
        $(this).removeClass('hovered');
        $(this).find('.navbar-drop-menu').fadeOut(200).removeClass('show');
    }
});

/* collapse navbar-menu on mobile */
$(document).on('click', '.navbar-menu-collapser button', function () {

    if (!$('.navbar-menu').hasClass('show')) {
        $('.navbar-top').addClass('dark');
        $('.navbar-menu').addClass('show');
        $('.navbar-brand').addClass('dark');
        $('.navbar-menu-collapser').addClass('dark');
        $('body').addClass('noscroll');
    } else {
        $('.navbar-top').removeClass('dark');
        $('.navbar-menu').removeClass('show');
        $('.navbar-brand').removeClass('dark');
        $('.navbar-menu-collapser').removeClass('dark');
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

/* SLIDER */

const swiper = new Swiper('.swiper-container', {
    
    direction: 'horizontal',
    autoplay: {
        delay: 3000
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





