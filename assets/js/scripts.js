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


