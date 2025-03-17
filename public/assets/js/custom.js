(function($) {
    'use strict';
    
    // Mean Menu JS
	jQuery('.mean-menu').meanmenu({ 
		meanScreenWidth: "991"
    });

    // Navbar Area
    $(window).on('scroll', function() {
		if ($(this).scrollTop() >150){  
			$('.navbar-area').addClass("sticky-nav");
		}
		else{
			$('.navbar-area').removeClass("sticky-nav");
		}
	});

    // Banner Into Slider 
    $('.banner-into-slider').owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        rtl: true,
        autoplay: true,
        autoplayHoverPause: true,
        responsive:{
            0:{
                items: 2
            },
            1000:{
                items: 3
            }
        }
    })

    // Service Slider 
    $('.service-slider').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        rtl: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [
            "<i class='bx bxs-chevron-right'></i>",
            "<i class='bx bxs-chevron-left'></i>"
        ],
        responsive:{
            0:{
              items: 1
            },
            768:{
                items: 2
            },
            1000:{
              items: 3
            }
        }

    })

    // Tabs
    $('#tabs-item li a').on('click', function(e) {
        $('#tabs-item li, #prices-conten .active').removeClass('active').removeClass('fadeInUp');
        $(this).parent().addClass('active');
        var activeTab = $(this).attr('href');
        $( activeTab).addClass('active fadeInUp');
        e.preventDefault();
    });	

    // Testimonial Slider 
    $('.testimonial-slider').owlCarousel({
        loop: true,
        items: 1,
        margin: 30,
        nav: true,
        rtl: true,
        dots: false,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [
            "<i class='bx bxs-chevron-right'></i>",
            "<i class='bx bxs-chevron-left'></i>"
        ],
    })

    // Home Slider 
    $('.home-slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        nav: true,
        dots: false,
        autoplay: true,
        rtl: true,
        autoplayHoverPause: true,
        navText: [
            "<i class='bx bxs-chevron-right'></i>",
            "<i class='bx bxs-chevron-left'></i>"
        ],
    })

    // Product Images Slider 
    $('.product-images-slider').owlCarousel({
        loop: true,
        margin: 30,
        nav: true,
        dots: false,
        autoplay: true,
        rtl: true,
        autoplayHoverPause: true,
        navText: [
            "<i class='bx bxs-chevron-right'></i>",
            "<i class='bx bxs-chevron-left'></i>"
        ],
        responsive:{
            0:{
                items: 2
            },
            1000:{
                items: 4
            }
        }
    })

    // Testimonial Slider 
    $('.testimonial-slider-two').owlCarousel({
        loop: true,
        items: 1,
        margin: 30,
        rtl: true,
        nav: true,
        dots: false,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [
            "<i class='bx bxs-chevron-right'></i>",
            "<i class='bx bxs-chevron-left'></i>"
        ],
    })

    // Tabs Single Page
    $('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');
    $('.tab ul.tabs li a').on('click', function (g) {
        var tab = $(this).closest('.tab'), 
        index = $(this).closest('li').index();
        tab.find('ul.tabs > li').removeClass('current');
        $(this).closest('li').addClass('current');
        tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
        tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();
        g.preventDefault();
    });

    // Service Dtls Sliser 
    $('.service-dtls-slider').owlCarousel({
        loop: true,
        margin: 30,
        items: 1,
        nav: true,
        dots: false,
        rtl: true,
        autoplay: true,
        autoplayHoverPause: true,
        navText: [
            "<i class='bx bxs-chevron-right'></i>",
            "<i class='bx bxs-chevron-left'></i>"
        ],
    })

    // FAQ Accordion JS
	$('.accordion').find('.accordion-title').on('click', function(){
		// Adds Active Class
		$(this).toggleClass('active');
		// Expand or Collapse This Panel
		$(this).next().slideToggle('fast');
		// Hide The Other Panels
		$('.accordion-content').not($(this).next()).slideUp('fast');
		// Removes Active Class From Other Titles
		$('.accordion-title').not($(this)).removeClass('active');		
    });

    // Nice Select JS
    $('select').niceSelect();
   
    // Input Plus & Minus Number JS
    $('.input-counter').each(function() {
        var spinner = jQuery(this),
        input = spinner.find('input[type="text"]'),
        btnUp = spinner.find('.plus-btn'),
        btnDown = spinner.find('.minus-btn'),
        min = input.attr('min'),
        max = input.attr('max');
        btnUp.on('click', function() {
            var oldValue = parseFloat(input.val());
            if (oldValue >= max) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue + 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });
        btnDown.on('click', function() {
            var oldValue = parseFloat(input.val());
            if (oldValue <= min) {
                var newVal = oldValue;
            } else {
                var newVal = oldValue - 1;
            }
            spinner.find("input").val(newVal);
            spinner.find("input").trigger("change");
        });
    });

    // Back To Top Js
    $('body').append('<div id="toTop" class="top-btn"><i class="bx bx-chevrons-up"></i></div>');
    $(window).on('scroll',function () {
        if ($(this).scrollTop() != 0) {
            $('#toTop').fadeIn();
        } else {
            $('#toTop').fadeOut();
        }
    }); 
    $('#toTop').on('click',function(){
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });
    
})(jQuery);