(function ($) {
   "use strict";
  
   var SagaElements = {
    init: function(){     
    //  SagaElements.initDebouncedresize();
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-counter.default', SagaElements.elementCounter);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-countdown.default', SagaElements.elementDountdown);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-tabs.default', SagaElements.elementTab);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-pricing-block.default', SagaElements.elementPricing);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-video-box.default', SagaElements.elementVideo);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-testimonials.default', SagaElements.elementTestimonial);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-teams.default', SagaElements.elementTeams);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-teams-carousel.default', SagaElements.elementTeamsCarousel);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-marquee-carousel.default', SagaElements.elementMarqueeCarousel);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-portfolio.default', SagaElements.elementPortfolio);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-portfolio-carousel.default', SagaElements.elementPortfolioCarousel);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-posts.default', SagaElements.elementPosts);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-information.default', SagaElements.elementInformation);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-brand.default', SagaElements.elementBrand);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-box-hover.default', SagaElements.elementBoxHover);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-locations_map.default', SagaElements.elementLocationMap);
      elementorFrontend.hooks.addAction('frontend/element_ready/mo-heading-fancy.default', SagaElements.elementHeadingFancy);
      elementorFrontend.hooks.addAction('frontend/element_ready/column', SagaElements.elementColumn);
    },

    elementColumn: function($scope){
      if( ($scope).hasClass('column-style-bg-overflow-right') ){
          var left = $scope.offset().left;
          var rwidth = $(window).width() - left + 10;
          // if( ($scope).width() > $(window).width()/2 + 10){
          //   rwidth = $(window).width() + 10;
          // }
          $scope.children('.elementor-column-wrap').append('<div class="bg-overfolow"></div>');
          $scope.children('.elementor-column-wrap').children('.bg-overfolow').css('width', rwidth);
          $(window).on("debouncedresize", function(event) {
            var left = $scope.offset().left;
            rwidth = $(window).width() - left + 10;
            // if( ($scope).width() > $(window).width()/2 + 10){
            //   rwidth = $(window).width() + 10;
            // }
            $scope.children('.elementor-column-wrap').children('.bg-overfolow').css('width', rwidth);
          });
      }
      if( ($scope).hasClass('column-style-bg-overflow-left') ){
        var right = $(window).width() - ($scope.offset().left + $scope.outerWidth());
        var lwidth = $(window).width() - right + 10;
        // if( ($scope).width() > $(window).width()/2 + 10){
        //   lwidth = $(window).width() + 10;
        // }
        $scope.children('.elementor-column-wrap').append('<div class="bg-overfolow"></div>');
        $scope.children('.elementor-column-wrap').children('.bg-overfolow').css('width', lwidth);
        $(window).on("debouncedresize", function(event) {
          lwidth = $(window).width() - right + 10;
          // if( ($scope).width() > $(window).width()/2 + 10){
          //   lwidth = $(window).width() + 10;
          // }
         $scope.children('.elementor-column-wrap').children('.bg-overfolow').css('width', lwidth);
        });
      }
    },

    elementTestimonial: function($scope){
      var $carousel = $scope.find('.init-carousel-owl');
      SagaElements.initCarousel($carousel);
    },
    
    elementPosts: function($scope){
      var $carousel = $scope.find('.init-carousel-owl');
      SagaElements.initCarousel($carousel);
    },

    elementPortfolioCarousel: function($scope){
      var $carousel = $scope.find('.init-carousel-owl');
      SagaElements.initCarousel($carousel);
      jQuery('.lightbox-gallery').each(function() {
        jQuery(this).magnificPopup({
          type:'image',
          image: {
            titleSrc: 'title',
            verticalFit: true
          },
          gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0, 1]
          },
        });
      });
    },

    elementTeamsCarousel: function($scope){
      var $carousel = $scope.find('.init-carousel-owl');
      SagaElements.initCarousel($carousel);
    },

    elementPortfolio: function($scope){
      $scope.find('.projects-grid').each( function(){
        var $container = $(this); 
          $container.imagesLoaded(function(){
          $container.isotope({ 
            itemSelector : '.project-item', 
              animationEngine : 'css',
            });
        });
        var $optionSets = $('.project_filters'),
          $optionLinks = $optionSets.find('a');
          $optionLinks.on('click', function(){
          var $this = $(this);
          if ( $this.hasClass('selected') ) {
            return false;
          }
          var $optionSet = $this.parents('.project_filters');
            $optionSets.find('.selected').removeClass('selected');
            $this.addClass('selected');
    
          var selector = $(this).attr('data-filter');
            $container.isotope({ 
              filter: selector 
            });
          return false;
        });

        
        jQuery('.lightbox-gallery').each(function() {
          jQuery(this).magnificPopup({
            type:'image',
            image: {
              titleSrc: 'title',
              verticalFit: true
            },
            gallery: {
              enabled: true,
              navigateByImgClick: true,
              preload: [0, 1]
            },
          });
        });
        
      });
    },
    
    elementInformation: function($scope){
      var $carousel = $scope.find('.init-carousel-owl');
      SagaElements.initCarousel($carousel);
    },

    elementBrand: function($scope){
      var $carousel = $scope.find('.init-carousel-owl');
      SagaElements.initCarousel($carousel);
    },

    elementCounter: function($scope){
      $scope.find('.counter').counterUp({
        delay: 10,
        time: 2000
      });
    },
    
    elementTab: function($scope){
      var customTabs = function () {
        $('.mo-tabs').each(function() {
          $(this).find('.tabs-heading li').first().addClass('current');
          $(this).find('.tab-content').first().addClass('current');
        });
        $('.tabs-heading li').on( 'click', function(){
          var tab_id = $(this).attr('data-tab');
          $(this).siblings().removeClass('current');
          $(this).parents('.mo-tabs').find('.tab-content').removeClass('current');
          $(this).addClass('current');
          $("#"+tab_id).addClass('current');
        });
      };
      customTabs();
  },

  elementDountdown: function($scope){
      $('.mo-countdown').each( function() {
          var date   = $(this).data('date'),
              day    = $(this).data('day'),
              days   = $(this).data('days'),
              hour   = $(this).data('hour'),
              hours  = $(this).data('hours'),
              min    = $(this).data('min'),
              mins   = $(this).data('mins'),
              second = $(this).data('second'),
              seconds = $(this).data('seconds');
          $(this).countdown({
              date: date,
              day: day,
              days: days,
              hour: hour,
              hours: hours,
              minute: min,
              minutes: mins,
              second: second,
              seconds: seconds
          }, function () {
              alert('Done!');
          });
      });
    },

    elementPricing: function($scope){
      $('.pricing').waypoint(function () {
        $('.pricing-best').addClass('depth');
      });
      $(".pricing-item").on("mouseenter",function(){
        $(this).closest(".vc_row .vc_inner, .elementor-section .elementor-container").find(".pricing-item").removeClass("active"),$(this).addClass("active");
      });
    },

    elementVideo: function($scope){
      jQuery('.lightbox-video').each(function() {
        jQuery(this).magnificPopup({
           type:'iframe',
          mainClass: 'mfp-fade',
          removalDelay: 160,
          preloader: false,
          fixedContentPos: false,
          iframe: {
            patterns: {
              youtube: {
                index: 'youtube.com/',
                id: 'v=',
                src: 'https://www.youtube.com/embed/%id%?autoplay=1'
              },
              youtube_short: {
                index: 'youtu.be/',
                id: 'youtu.be/',
                src: '//www.youtube.com/embed/%id%?autoplay=1'
              },
              vimeo: {
                index: 'vimeo.com/',
                id: '/',
                src: '//player.vimeo.com/video/%id%?autoplay=1'
              }
            }
          }
        });
      });
    },

    elementBoxHover: function($scope){
      var $carousel = $scope.find('.init-carousel-owl');
      SagaElements.initCarousel($carousel);
    },

    elementLocationMap: function($scope){
      var location_data = [];
      var i = 0;
      $('#locations_map_content .maker-item').each(function(){
        var location_item = [];
        location_item['id'] = $(this).data('id');
        var lat = $(this).data('lat');
        if(lat){
            lat = lat.split(",");
            location_item['latLng'] = [lat[0], lat[1]];
        }
        location_item['data'] = '';
        location_item['options'] = {};
        location_data[i] = location_item;
        i++;
      }); 

      $('#map_canvas_mo_01').gmap3({
        map:{
          options:{
            "draggable": true,
            "mapTypeControl": true,
            "mapTypeId": google.maps.MapTypeId.ROADMAP,
            "scrollwheel": false,
            "panControl": true,
            "rotateControl": false,
            "scaleControl": true,
            "streetViewControl": true,
            "zoomControl": true,
            "center": location_data[0]['latLng'],
            "zoom": 12,
           }
         },
         marker:{
           values: location_data,
           options:{
             draggable: false
           },
           events:{
             click: function(marker, event, context){
               var id = context.id;
               var content = $('div[data-id=' + id + '].maker-item .marker-hidden-content').html();
                 var map = $(this).gmap3("get"),
                   infowindow = $(this).gmap3({get:{name:"infowindow"}});
                 if (infowindow){
                   infowindow.open(map, marker);
                   infowindow.setContent(content);
                 } else {
                   $(this).gmap3({
                     infowindow:{
                       anchor:marker, 
                       options:{content: content}
                     }
                   });
                 }
             }
           }
         }
      });
        
      var map = $('#map_canvas_mo_01').gmap3("get");
      $(".location-item").on('click', function(){
        $('.location-item .location-item-inner').removeClass('active');
        $(this).find('.location-item-inner').first().addClass('active');
        var id = $(this).data('id');
        var marker = $('#map_canvas_mo_01').gmap3({ get: { id: id } });
        new google.maps.event.trigger(marker, 'click');
        map.setCenter(marker.getPosition());
      });
    },

    initCarousel: function($target){
      if (!$target.length) { return; }
      var items = $target.data('items') ? $target.data('items') : 5;
      var items_lg = $target.data('items_lg') ? $target.data('items_lg') : 4;
      var items_md = $target.data('items_md') ? $target.data('items_md') : 3;
      var items_sm = $target.data('items_sm') ? $target.data('items_sm') : 2;
      var items_xs = $target.data('items_xs') ? $target.data('items_xs') : 1;
      var items_xx = $target.data('items_xx') ? $target.data('items_xx') : 1;
      var loop = $target.data('loop') ? $target.data('loop') : false;
      var speed = $target.data('speed') ? $target.data('speed') : 200;
      var auto_play = $target.data('auto_play') ? $target.data('auto_play') : false;
      var auto_play_speed = $target.data('auto_play_speed') ? $target.data('auto_play_speed') : false;
      var auto_play_timeout = $target.data('auto_play_timeout') ? $target.data('auto_play_timeout') : 1000;
      var auto_play_hover = $target.data('auto_play_hover') ? $target.data('auto_play_hover') : false;
      var navigation = $target.data('navigation') ? $target.data('navigation') : false;
      var pagination = $target.data('pagination') ? $target.data('pagination') : false;
      var mouse_drag = $target.data('mouse_drag') ? $target.data('mouse_drag') : false;
      var touch_drag = $target.data('touch_drag') ? $target.data('touch_drag') : false;
      var center = $target.hasClass('carousel-center') ? true : false;

      $target.owlCarousel({
        center: center,
        nav: navigation,
        autoplay: auto_play,// auto_play,
        autoplayTimeout: auto_play_timeout,
        autoplaySpeed: auto_play_speed,
        autoplayHoverPause: auto_play_hover,
        navText: [ '<span><i class="fas fa-chevron-left"></i></span>', '<span><i class="fas fa-chevron-right"></i></span>' ],
        autoHeight: false,
        loop: loop, 
        dots: pagination,
        rewind: true,
        smartSpeed: speed,
        mouseDrag: mouse_drag,
        touchDrag: touch_drag,
        merge:true,
        responsive : {
          0 : {
            items: 1,
            nav: false
          },
          320 : {
            items: items_xx,
            nav: false
          },
          640 : {
            items : items_xs,
            nav: false
          },
          768 : {
            items : items_sm,
          },
          992: {
            items : items_md
          },
          1200: {
            items: items_lg
          },
          1400: {
            items: items
          }
        }
      }); 

      $target.find('.owl-item.active').eq(1).addClass('center');
      $target.on('translated.owl.carousel', function(e){
        $target.find('.owl-item.center').removeClass('center');
        $target.find('.owl-stage .active').eq(1).addClass('center');
      });
    }
  };
  $(window).on('elementor/frontend/init', SagaElements.init);   
}(jQuery));