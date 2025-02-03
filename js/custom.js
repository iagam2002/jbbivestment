/* ------------------------------------- */
/*  TABLE OF CONTENTS
/* ------------------------------------- */
/*   Preloader                           */
/*   WOW                                 */
/*   Menu                                */
/*   isotope                             */
/*   Lightbox popup  
 */
(function ($) {
 "use strict";

	/* ------------------------------------- */
	/*	preloader
	/* ------------------------------------- */
 !function(){function t(){document.body.classList.add("loaded")}var e=document.getElementById("preloader-wrapper");if(e){if(window.addEventListener("load",function(e){t()}),e.dataset&&e.dataset.showCloseTime){var a=parseInt(e.dataset.showCloseTime,10),n=!1,o=e.getElementsByClassName("preloader-close");a&&o.length&&(setTimeout(function(){o[0].style.display=""},a),o[0].addEventListener("click",function(e){t()}))}e.dataset.maxLoadTime&&(n=e.dataset.maxLoadTime,(n=parseInt(n,10))&&setTimeout(function(){t()},n))}}();

	/* ------------------------------------- */
	/*	Scroll single page
	/* ------------------------------------- */
    function scrollIndicator() {
        $(window).on('scroll', function() {
            var wintop = $(window).scrollTop(), docheight = 
            $(document).height(), winheight = $(window).height();
 	        var scrolled = (wintop/(docheight-winheight))*100;
  	        $('.scroll-line').css('width', (scrolled + '%'));
        });
    }
	scrollIndicator(); //Init
	/* ------------------------------------- */
	/*	cursor
	/* ------------------------------------- */
	jQuery('.mouse-cursor.style1, .mouse-cursor.style2, .mouse-cursor.style3, .mouse-cursor.style4').each(function() {
		var $this = jQuery(this);
		jQuery(window).on('mousemove', function(event) {
			$this.css({
				'top' : event.pageY + 'px',
				'left' : event.pageX + 'px'
			});
		});
	});
	jQuery('.mouse-cursor.style1, .mouse-cursor.style2, .mouse-cursor.style3, .mouse-cursor.style4').each(function() {
		jQuery('body').addClass('cursor-default');
	});
	
	$("a, .button, .menu-toggle, .owl-prev, .owl-next").hover(function(){
        $(".mouse-cursor").toggleClass("bigCursor");
    });
	$(".footer_v1, .footer_v2, .bg-dark, .bg-color-main").hover(function(){
        $(".mouse-cursor").toggleClass("whiteCursor");
	});
	$(".owl-stage-outer").hover(function(){
        $(".mouse-cursor").toggleClass("nextCursor");
    });
	$(".portfolio-effect1 .img-inner, .portfolio-effect3 .wrapper img, .portfolio-effect4").hover(function(){
        $(".mouse-cursor").toggleClass("openCursor");
    });
	/* ------------------------------------- */
	/*   Image animation
	/* ------------------------------------- */
	VanillaTilt.init(document.querySelectorAll(".img-perspective"), {
		max: 15,
		speed: 400,   
		perspective: 600,  
        scale: 1.08, 
	});
	VanillaTilt.init(document.querySelectorAll(".image-box-style4"), {
		max: 10,
		speed: 300,   
		perspective: 1000,  
	});  
    /* ------------------------------------- */
    /*   Menu
    /* ------------------------------------- */
	  //Close responsive nav
	  $('#navigation li a').on('click', function() {
		if ($(window).width() < 768) {
		  $('.navbar-toggle').on();
		}
	  });
	 //mo-header-v1 (menu-toggle open )
	  $('.menu-toggle , #menu-close, .sidepanel-left .menu-item a').on('click', function(event) {
		$('.sidepanel').toggleClass('open');
		$('body').toggleClass('sidepanel-open');
	  });
	  //close nav-header-v1
	  $('.onepage-nav a').on(function(event) {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
		  var target = $(this.hash);
		  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		  if (target.length) {
			$('html,body').animate({
			  scrollTop: target.offset().top
			}, 700);
		  }
		}    
		setTimeout(function(e){      
		  $('.menu-toggle').trigger('click');
		}, 700)
		return false;
	  }); 
	  $('.sidepanel-overlay').on('click',function(){
			$('.sidepanel').removeClass('open');
		    $('body').removeClass('sidepanel-open');
	  });
	
	/* search-trigger(wide) */ 
	if ( jQuery('.search-trigger').length ) {
		jQuery('.search-trigger').on('click',function(){
			jQuery('body').toggleClass('search-is-opened');
		});
		jQuery('.main-search-overlay , .main-search-close').on('click',function(){
			jQuery('body').removeClass('search-is-opened');
		});
     }

	/* Open the hide mini search(box) */
	function SagaOpenMiniSearchSidebar() {
		$('.box-search > a').on('click', function() {
			$(this).toggleClass('active');
			$('.mo-cart-header > a.mo-icon').removeClass('active');
			$('.mo-header-menu .header_search').toggle();
			$('.mo-cart-content').hide();
		});
	}
	SagaOpenMiniSearchSidebar();

	function SagaOpenMiniCartSidebar() {
			$('.mo-cart-header > a.mo-icon').on('click', function() {
				$(this).toggleClass('active');
				$('.mo-search-sidebar > a').removeClass('active');
				//$('.mo-cart-content').toggle();
				
				$('.mo-cart-content').toggleClass('active');
				
				$('.header_search').hide();
			});
		}
	SagaOpenMiniCartSidebar();

	/* Open the hide menu */
	function SagaOpenMenu() {
		$('#mo-header-icon').on('click', function() {
			$(this).toggleClass('active');
			$('.mo-menu-list').toggleClass('hidden-xs');
			$('.mo-menu-list').toggleClass('hidden-sm');
		});
	}
	SagaOpenMenu();
	/* Mobile Menu Dropdown Icon Header */
	function SagaMobileMenuDropdown() {
		var hasChildren = $('.mo-sidepanel .mo-menu-list ul li.menu-item-has-children, .mo-header-v2 .mo-menu-list ul li.menu-item-has-children, .mo-header-v3 .mo-menu-list ul li.menu-item-has-children , .mo-header-v4 .mo-menu-list ul li.menu-item-has-children, .mo-header-v5 .mo-menu-list ul li.menu-item-has-children , .mo-header-v6 .mo-menu-list ul li.menu-item-has-children, .mo-header-v7 .mo-menu-list ul li.menu-item-has-children');
		hasChildren.each( function() {
			var $btnToggle = $('<a class="mb-dropdown-icon hidden-lg hidden-md" href="#"></a>');
			$( this ).append($btnToggle);
			$btnToggle.on( 'click', function(e) {
				e.preventDefault();
				$( this ).toggleClass('open');
				$( this ).parent().children('ul').toggle('slow');
			} );
		} );
	}
    SagaMobileMenuDropdown();
	
	/* large media Menu children Icon Header  */
	function SagaMenuDropdown() {
		var hasChildren = $('.mo-header-v2 .mo-menu-list > ul > li.menu-item-has-children, .mo-header-v3 .mo-menu-list > ul > li.menu-item-has-children, .mo-header-v4 .mo-menu-list > ul > li.menu-item-has-children, .mo-header-v5 .mo-menu-list > ul > li.menu-item-has-children, .mo-header-v6 .mo-menu-list > ul > li.menu-item-has-children, .mo-header-v7 .mo-menu-list > ul > li.menu-item-has-children');
		hasChildren.each( function() {
			var $btnToggle = $('<span class="l-dropdown-icon"></span>');
			$( this ).append($btnToggle);
		} );
	}
    SagaMenuDropdown();
	
	/* Menu Dropdown Icon Header Canvas, Header Canvas Border */
	function SagaNavigationDropdown() {
		var hasChildren = $('.nav-sidepanel > ul > li.menu-item-has-children, .mo-left-navigation .mo-menu-list ul li.menu-item-has-children');

		hasChildren.each( function() {
			var $btnToggle = $('<a class="mb-dropdown-icon" href="#"></a>');
			$( this ).append($btnToggle);
			$btnToggle.on( 'click', function(e) {
				e.preventDefault();
				$( this ).toggleClass('open');
				$( this ).parent().children('ul').toggle('slow');
			} );
		} );
	}
	SagaNavigationDropdown();

	/* Header Stick */
	function SagaHeaderStick() {
		if($( '.mo-sidepanel, .mo-header-v2, .mo-header-v3, .mo-header-v4, .mo-header-v5, .mo-header-v6, .mo-header-v7 ' ).hasClass( 'mo-header-stick' )) {
			var header_offset = $('#mo_header .mo-header-menu').offset();

			if ($(window).scrollTop() > header_offset.top) {
				$('body').addClass('mo-stick-active');
			} else {
				$('body').removeClass('mo-stick-active');
			}
			$(window).on('scroll', function() {
				if ($(window).scrollTop() > header_offset.top) {
					$('body').addClass('mo-stick-active');
				} else {
					$('body').removeClass('mo-stick-active');
				}
			});

			$(window).on('load', function() {
				if ($(window).scrollTop() > header_offset.top) {
					$('body').addClass('mo-stick-active');
				} else {
					$('body').removeClass('mo-stick-active');
				}
			});
			$(window).on('resize', function() {
				if ($(window).scrollTop() > header_offset.top) {
					$('body').addClass('mo-stick-active');
				} else {
					$('body').removeClass('mo-stick-active');
				}
			});
		}
	}
	SagaHeaderStick();

    $(document).ready(function () {
	// scroll-pane 
	$(function(){
		$('.scroll-pane').jScrollPane();
	});
	$(".search-submit").after('<i class="fa fa-search"></i>');
	/* ------------------------------------- */
	/*   portfolio cursor
	/* ------------------------------------- */
	// Move title with cursor
	function mousemove_for_portfolio_large() {
		if (jQuery( window ).width() > 1279 ) {
			if ( jQuery('.main-content').find(".mo-element-mo-portfolio").length > 0 ) {
				jQuery(".portfolio-effect2").each(function() {
					let $Target = jQuery(this);
					let $TargetInner = $Target.find('.content-block');
					$Target.mousemove(function(event){
						let y = event.pageY - $Target.offset().top + 20;
						let x = event.pageX - $Target.offset().left + 20;
						$TargetInner.css({'top': y,'left': x,'bottom': "auto",'right': "auto",'opacity': 1 });
					})
						.mouseleave(function() {
							$TargetInner.css({'top': "auto",'left': 30,'bottom': 30,'right': "auto",'opacity': 0 });
						});
				});
			}
		}
	}
	mousemove_for_portfolio_large();
	/* ------------------------------------- */
	/*   stickem sticky
	/* ------------------------------------- */
	$('body').stickem({
		item:'.sticky-buttons',
		container:'.mo-blog',
		stickClass:'is-sticky',
		endStickClass:'is-bottom',
		offset:90,
	});
	/* ------------------------------------- */
	/*  fixed footer
	/* ------------------------------------- */
	var footerFixed = $('.footer-fixed').outerHeight();
	if($(document).width() > 991) {
		$('.main-content').css('margin-bottom',footerFixed);
	}
	/* ------------------------------------- */
	/*  BacktoTop
	/* ------------------------------------- */
	var offset = 300,
	offset_opacity = 1200,
	scroll_top_duration = 700,
	$back_to_top = $('#back-to-top');

	//hide or show the "back to top" link
	$(window).scroll(function(){
		( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
		if( $(this).scrollTop() > offset_opacity ) { 
			$back_to_top.addClass('cd-fade-out');
		}
	});
	//smooth scroll to top
	$back_to_top.on('click', function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0 ,
			}, scroll_top_duration
		);
	});
/* ------------------------------------- */
/*  BacktoTop SVG animation
/* ------------------------------------- */
  var progressPath = document.querySelector('.progress path');
  var pathLength = progressPath.getTotalLength();
  progressPath.style.transition = progressPath.style.WebkitTransition =
  'none';
  progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
  progressPath.style.strokeDashoffset = pathLength;
  progressPath.getBoundingClientRect();
  progressPath.style.transition = progressPath.style.WebkitTransition =
  'stroke-dashoffset 300ms linear';

  var updateProgress = function () {
  var scroll = $(window).scrollTop();
  var height = $(document).height() - $(window).height();
  var percent = Math.round(scroll * 100 / height);
  var progress = pathLength - (scroll * pathLength / height);
  progressPath.style.strokeDashoffset = progress;
  $('.percent').text(percent+"%");
  };

  updateProgress();
  $(window).scroll(updateProgress);

/* ------------------------------------- */
/*  parallaxMoveElemnt
/* ------------------------------------- */
	const o = $(window),
	i = $("body");
	var l = !0;
	l = (function () {
	return {
		parallaxImgHover: function () {
			const t = $('[data-mo="parallax"]');
			0 === t.length ||
				o.width() < 992 ||
				t.each(function () {
					var t = $(this),
						n = (moGrid.removeAttr(t, "data-mo"), moGrid.removeAttr(t, "data-mo-speed")),
						a = moGrid.removeAttr(t, "data-mo-move"),
						o = !1;
					t.hasClass("image-zoom") && (o = !0), moGrid.parallaxMoveElemnt(t, a, n, void 0, o);
				});
		},
		allInt: function () {
			this.parallaxImgHover();
		},
	};
	})();
	l.allInt();
  /* ------------------------------------- */
  /*  woocommerce
  /* ------------------------------------- */
	/* Add Product Quantity Up Down icon */
	$('form.cart .quantity, .product-quantity .quantity').each(function() {
		$(this).prepend('<span class="qty-minus"><i class="fa fa-minus"></i></span>');
		$(this).append('<span class="qty-plus"><i class="fa fa-plus"></i></span>');
	});
	/* Plus Qty */
	$(document).on('click', '.qty-plus', function() {
		var parent = $(this).parent();
		$('input.qty', parent).val( parseInt($('input.qty', parent).val()) + 1);
	})
	/* Minus Qty */
	$(document).on('click', '.qty-minus', function() {
		var parent = $(this).parent();
		if( parseInt($('input.qty', parent).val()) > 1) {
			$('input.qty', parent).val( parseInt($('input.qty', parent).val()) - 1);
		}
	})
	/* Minus Qty grouped product list */
	$(document).on('click', '.woocommerce-grouped-product-list .qty-minus', function() {
		var parent = $(this).parent();
		if( parseInt($('input.qty', parent).val()) > 0) {
			$('input.qty', parent).val( parseInt($('input.qty', parent).val()) - 1);
		}
	})

	/* Single image gallery */
	if($('.mo-slick-slider').length > 0) {
		$('.mo-slick-slider').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: true,
			prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
			nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
			fade: true,
			asNavFor: '.mo-slick-slider-nav'
		});
	}
	if($('.mo-slick-slider-nav').length > 0) {
		$('.mo-slick-slider-nav').slick({
			slidesToShow: 3,
			slidesToScroll: 1,
			arrows: false,
			asNavFor: '.mo-slick-slider',
			centerMode: true,
			focusOnSelect: true
		});
	}
  });
})(jQuery);