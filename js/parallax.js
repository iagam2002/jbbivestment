window.moPageLoaded = false;
window.moIsElementor = window.moIsElementor || document.body.classList.contains('elementor-page');

window.moElements = $ => {
  window.$moWindow = $(window);
  window.$moHtml = $('html');
  window.$moBody = $('body');
  window.$moSiteWrap = $('.wrapper');
  window.$moContents = $('.main-content');
  window.$moContentsWrap = $('.main-content');
  window.$moMainHeader = $('#mo_header');
  window.$moMainFooter = $('footer');
  window.$moSectionsWrapper = $moContentsWrap;
 

  if (moIsElementor) {
    const $secWrap = $('.elementor-section-wrap', $moContentsWrap).first();
    window.$moSectionsWrapper = $secWrap.legth ? $secWrap : $('> .elementor', $moContentsWrap).first();
  }


  const elementorSectionsSelector = `
	> .elementor-section-wrap > .elementor-section,
	> .elementor-section,
	> .e-container,
	> .e-container > .e-container,
	> .elementor-section-wrap > .elementor-top-section > .elementor-container > .elementor-column > .elementor-widget-wrap > .elementor-inner-section,
	> .elementor-top-section > .elementor-container > .elementor-column > .elementor-widget-wrap > .elementor-inner-section,
	> .elementor-section-wrap > .elementor-top-section > .elementor-container > .elementor-column > .elementor-widget-wrap > .e-container,
	> .elementor-top-section > .elementor-container > .elementor-column > .elementor-widget-wrap > .e-container`;
 // const $elementorFooterSections = $('> .elementor', $moMainFooter).find(elementorSectionsSelector);
 // window.$moSections = moIsElementor ? $moSectionsWrapper.find(elementorSectionsSelector).add($elementorFooterSections) : $moSectionsWrapper.add($moMainFooter).find('> .vc_row, > .vc_section, > .vc_section > .vc_row, > .mo-section-scroll-sections > .vc_row, > .vc_element');

};

moElements(jQuery);
window.moCheckedFonts = [];

window.moIsMobile = function () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0 || navigator.platform === 'iPad';
};

if (moIsMobile()) {
  document.documentElement.classList.add('vc_mobile');
  document.body.setAttribute('data-elementor-device-mode', 'mobile');
}

;



window.moWindowWidth = function () {
  return window.innerWidth;
};

window.moWindowHeight = function () {
  return window.innerHeight;
};

window.moDocHeight = function () {
  return document.body.clientHeight;
};

const restArguments = function (func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;

    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }

    switch (startIndex) {
      case 0:
        return func.call(this, rest);

      case 1:
        return func.call(this, arguments[0], rest);

      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
    }

    var args = Array(startIndex + 1);

    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }

    args[startIndex] = rest;
    return func.apply(this, args);
  };
};

const moDelay = restArguments(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args);
  }, wait);
});

const moNow = Date.now || function () {
  return new Date().getTime();
};

window.moThrottle = function (func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function () {
    previous = options.leading === false ? 0 : moNow();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function () {
    var now = moNow();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};

window.moDebounce = function (func, wait, immediate) {
  var timeout, result;

  var later = function (context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  var debounced = restArguments(function (args) {
    if (timeout) clearTimeout(timeout);

    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = moDelay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};

window.moGetMousePos = (ev, basedOnElement) => {
  let posx = 0;
  let posy = 0;
  if (!ev) ev = window.event;

  if (ev.pageX || ev.pageY) {
    posx = ev.pageX;
    posy = ev.pageY;
  } else if (ev.clientX || ev.clientY) {
    posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  if (basedOnElement) {
    const rect = ev.currentTarget.getBoundingClientRect();
    posx = posx - rect.left - window.scrollX;
    posy = posy - rect.top - window.scrollY;
  }

  return {
    x: posx,
    y: posy
  };
};

class MoSectionsDetails {


  static getInstance() {
    if (!this.instance) {
      this.instance = new MoSectionsDetails();
    }

    return this.instance;
  }

  static getDetails() {
    const instance = this.getInstance();
    return new Promise(async resolve => {
      if (instance.sections.length < 1) {
        instance.sections = [];
        const moContentsRect = await instance.getElementRect({
          element: $moContents[0]
        });
        await Promise.all(instance.init(moContentsRect, instance));
        const mainContentSections = instance.sections.filter(section => section.isInMainContent);

        if (mainContentSections.length < 1) {
          const DOM = {
            element: $moContents[0],
            $element: $moContents
          };
          await instance.createDetailsObj(moContentsRect, moContentsRect, DOM, true).then(detailsObj => {
            instance.sections.unshift(detailsObj);
          });
        }

        instance.addParentSections(instance);
        instance.addInnerSections(instance);
        await instance.addLuminosity(instance);
      }

      resolve(instance.sections);
    });
  }

  init(moContentsRect, instance) {
    const promises = [];
    $moSections.each((i, row) => {
      const promise = new Promise(resolve => {
        const DOM = {
          element: row,
          $element: jQuery(row),
          parent: row.parentElement
        };
        this.getElementRect(DOM).then(rowRect => {
          this.createDetailsObj(moContentsRect, rowRect, DOM, false).then(detailsObj => {
            instance.sections[i] = detailsObj;
            resolve(detailsObj);
          });
        });
      });
      promises.push(promise);
    });
    return promises;
  }

  getElementRect(DOM) {
    return new Promise(resolve => {
      new IntersectionObserver(([entry], observer) => {
        fastdom.measure(() => {
          observer.disconnect();
          resolve(entry.boundingClientRect);
        });
      }).observe(DOM.element);
    });
  }

  createDetailsObj(moContentsRect, rowRect, DOM, isMoContentElement) {
    return new Promise(resolve => {
      fastdom.measure(async () => {
        const {
          scrollY,
          scrollX
        } = window;
        const styles = getComputedStyle(DOM.element);
        const obj = {};
        obj.el = DOM.element;
        obj.$el = DOM.$element;
        obj.rect = {
          initialOffset: {
            x: rowRect.x + scrollX,
            y: rowRect.y + scrollY
          },
          width: rowRect.width,
          height: rowRect.height,
          x: rowRect.x,
          y: rowRect.y
        };
        obj.backgroundColor = styles.backgroundColor;

        if (isMoContentElement) {
          obj.isMainContentElement = true;
          return resolve(obj);
        }

        const footerParent = moIsElementor ? DOM.element.closest('.main-footer') : DOM.parent;
        const elementorTopContainer = DOM.$element.parents('.e-container');
        obj.borderColor = styles.borderColor;
        obj.isOuterSection = moIsElementor ? DOM.element.classList.contains('elementor-top-section') || !!!elementorTopContainer.length : DOM.element.classList.contains('vc_section');
        obj.isInnerSection = moIsElementor ? DOM.element.classList.contains('elementor-inner-section') || !!elementorTopContainer.length : DOM.parent.classList.contains('vc_section');
        obj.isInFooter = moIsElementor ? footerParent != null : footerParent.classList.contains('main-footer');
        obj.isInMainContent = DOM.element.closest('#mo-site-content') != null;
        obj.isHidden = obj.rect.width < 1 && obj.rect.height < 1;
        obj.predefinedLuminosity = null;
        obj.parentSection = null;
        obj.innerSections = [];

        if (obj.el.hasAttribute('data-section-luminosity')) {
          obj.predefinedLuminosity = obj.el.getAttribute('data-section-luminosity');
        }

        if (obj.isInFooter) {
          obj.parentFooter = footerParent;

          if (footerParent.hasAttribute('data-sticky-footer')) {
            const footerOffsetTop = moContentsRect.height;
            const footerHeight = document.body.offsetHeight - (moContentsRect.y + scrollY) - moContentsRect.height;
            const elPositionTop = Math.abs(window.innerHeight - footerHeight - obj.rect.y);
            obj.rect.initialOffset.y = footerOffsetTop + elPositionTop;
            obj.rect.y = footerOffsetTop + elPositionTop;
          }
        }

        resolve(obj);
      });
    });
  }



  getLuminosity(obj, instance) {
    let {
      backgroundColor
    } = obj;

    if (obj.isInnerSection && tinycolor(backgroundColor).getAlpha() === 0) {
      backgroundColor = obj.parentSection.backgroundColor;
    }

    if (tinycolor(backgroundColor).getAlpha() === 0) {
      if (obj.isInFooter) {
        backgroundColor = instance.footerBg;
      }
    }

    return tinycolor(backgroundColor).isDark() ? 'dark' : 'light';
  }

  async addLuminosity(instance) {
    instance.sections.forEach(async sec => {
      sec.isBgTransparent = tinycolor(sec.backgroundColor).getAlpha() === 0;
      sec.luminosity = sec.predefinedLuminosity ? sec.predefinedLuminosity : instance.getLuminosity(sec, instance);
      await fastdomPromised.mutate(() => {
        sec.el.setAttribute('data-section-luminosity', sec.luminosity);
      });
    });
  }

};





(function ($) {
  'use strict';

  const pluginName = 'moCustomAnimations';
  let defaults = {
    delay: 160,
    startDelay: 0,
    direction: 'forward',
    duration: 1600,
    ease: 'power4.out',
    animationTarget: 'this',
    addPerspective: true,
    perspectiveVal: 1400,
    addChildTimelines: false,
    initValues: {
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      opacity: 1,
      transformOriginX: 50,
      transformOriginY: 50,
      transformOriginZ: '0px'
    },
    animations: {
      transformOriginX: 50,
      transformOriginY: 50,
      transformOriginZ: '0px'
    },
    randomizeInitValues: false,
    randomizeTargets: false,
    clearProps: 'transform,opacity,transform-origin'
  };

  class Plugin {
    constructor(element, options) {
      this._defaults = defaults;
      this._name = pluginName;
      this.options = { ...defaults,
        ...options
      };
      this.options.duration = this.options.duration / 1000;
      this.options.offDuration = this.options.offDuration / 1000;
      this.options.offDelay = this.options.offDelay / 1000;
      this.options.delay = this.options.delay / 1000;
      this.options.startDelay = this.options.startDelay / 1000;
      this.element = element;
      this.$element = $(element);
      this.animationTargets = [];
      this.animationsTimeline = null;
      this.shouldPause = false;
      this.animationsStarted = false;
      this.needPerspective = this.options.addPerspective && this._needPerspective();
      const $parentCustomAnimation = this.$element.parents('[data-custom-animations]');

      if ($parentCustomAnimation.length && $parentCustomAnimation.attr('data-ca-options') != null) {
        const parentCaOpts = JSON.parse($parentCustomAnimation.attr('data-ca-options'));

        if (parentCaOpts.addChildTimelines) {
          this.shouldPause = true;
        }
      }

      this.animationsInitiatedPromise = new Promise(resolve => {
        this.$element.on('moanimationsinitiated', resolve.bind(this, this));
      });
      this.animationsDonePromise = new Promise(resolve => {
        this.$element.on('moanimationsdone', resolve.bind(this, this));
      });
      new IntersectionObserver(([entry], observer) => {
        if (entry.isIntersecting) {
          observer.disconnect();

          this._build();
        }
      }, {
        rootMargin: '8%'
      }).observe(this.element);
    }

    _build() {
      const $rowBgParent = this.$element.closest('[data-row-bg]');
      const $slideshowBgParent = this.$element.closest('[data-slideshow-bg]');
      const promises = [];

      if (!this.element.classList.contains('vc_row')) {
        const $splitTextEls = this.$element.find('[data-split-text]');

        if (this.element.hasAttribute('data-split-text')) {
          $splitTextEls.push(this.element);
        }

        if ($splitTextEls.length) {
          $splitTextEls.each((i, el) => {
            const $el = $(el);
            $el.moSplitText({
              forceApply: true
            });
            const prom = $el.data('plugin_moSplitText');
            prom && promises.push(prom.splitDonePormise);
          });
        }
      }

      if ($rowBgParent.length) {
        const prom = $rowBgParent.data('plugin_moRowBG');
        prom && promises.push(prom.rowBgInitPromise);
      }

      if ($slideshowBgParent.length) {
        const prom = $slideshowBgParent.data('plugin_moSlideshowBG');
        prom && promises.push(prom.slideshowBgInitPromise);
      }

      if (promises.length > 0) {
        Promise.all(promises).then(() => {
          this._init();
        });
      } else {
        this._init();
      }
    }

    _init() {
      this._getAnimationTargets();

      this._createTimeline();

      this._initValues();

      this._runAnimations();

      this._initPlugins();
    }

    _getAnimationTargets() {
      const {
        direction,
        animationTarget
      } = this.options;
      let targets = null;

      switch (animationTarget) {
        case 'this':
          targets = this.element;
          break;

        case 'all-childs':
          targets = this._getChildElments();
          break;

        default:
          targets = this.element.querySelectorAll(animationTarget);
          break;
      }

      this.animationTargets = Array.from(targets);

      if (direction === 'backward') {
        this.animationTargets = this.animationTargets.reverse();
      } else if (direction === 'random') {
        this.animationTargets = gsap.utils.shuffle(this.animationTargets);
      }
    }

    _getChildElments() {
      let $childs = this.$element.children();
      return this._getInnerChildElements($childs);
    }

    _getInnerChildElements(elements) {
      const elementsArray = [];
      let $elements = $(elements).map((i, element) => {
        const $element = $(element);

        if ($element.hasClass('vc_inner') || $element.hasClass('vc_vc_row_inner')) {
          return $element.find('.wpb_wrapper').children().get();
        } else if ($element.hasClass('row')) {
          return $element.find('.mo-column').children().get();
        } else if ($element.hasClass('mo-slideelement-visible') || $element.hasClass('mo-slideelement-hidden')) {
          return $element.children().children().get();
        } else if ($element.hasClass('elementor-container')) {
          return $element.children('.elementor-column').get();
        } else if ($element.hasClass('elementor-widget-wrap')) {
          return $element.children('.elementor-element').get();
        } else {
          return $element.not('style, .heading-fancy').get();
        }
      });
      $.each($elements, (i, element) => {
        const $element = $(element);

        if (element.hasAttribute('data-custom-animations')) {
          return elementsArray.push(element);
        }

        if (element.querySelector('[data-custom-animations]')) {
          return element.querySelectorAll('[data-custom-animations]').forEach(el => {
            elementsArray.push(el);
          });
        }

        if (element.tagName === 'UL') {
          return $.each($element.children(), (i, li) => {
            elementsArray.push(li);
          });
        }

        if (element.classList.contains('mo-custom-menu')) {
          return $.each($element.find('> ul > li'), (i, li) => {
            elementsArray.push(li);
          });
        }

        if (element.classList.contains('accordion')) {
          return $.each($element.children(), (i, accordionItem) => {
            elementsArray.push(accordionItem);
          });
        }

        if (element.classList.contains('vc_inner') || element.classList.contains('vc_vc_row_inner')) {
          return $.each($element.find('.wpb_wrapper'), (i, innerColumn) => {
            elementsArray.push(innerColumn);
          });
        }

        if (element.classList.contains('row')) {
          return $.each($element.find('.mo-column'), (i, innerColumn) => {
            elementsArray.push(innerColumn);
          });
        }

        if (element.classList.contains('mo-pb-container')) {
          return $.each($element.find('.mo-pb'), (i, processBoxElement) => {
            elementsArray.push(processBoxElement);
          });
        }

        if ($element.find('[data-split-text]').length || element.hasAttribute('data-split-text')) {
          if (element.classList.contains('btn') || element.classList.contains('vc_ld_button')) {
            return elementsArray.push($element[0]);
          } else {
            return $.each($element.find('.split-inner'), (i, splitInner) => {
              const $innerSplitInner = $(splitInner).find('.split-inner');

              if ($innerSplitInner.length) {
                elementsArray.push($innerSplitInner[0]);
              } else {
                elementsArray.push(splitInner);
              }
            });
          }
        }

        if (!element.classList.contains('vc_empty_space') && !element.classList.contains('mo-empty-space') && !element.classList.contains('vc_ld_spacer') && !element.classList.contains('mo-particles-container') && !element.classList.contains('elementor-widget-spacer') && !element.hasAttribute('data-split-text') && element.tagName !== 'STYLE') {
          return elementsArray.push($element[0]);
        }
      });
      return elementsArray;
    }

    _needPerspective() {
      const initValues = this.options.initValues;
      const valuesNeedPerspective = ["z", "rotationX", "rotationY"];
      let needPerspective = false;

      for (let prop in initValues) {
        for (let i = 0; i <= valuesNeedPerspective.length - 1; i++) {
          const val = valuesNeedPerspective[i];

          if (prop === val) {
            needPerspective = true;
            break;
          }
        }
      }

      return needPerspective;
    }

    _generateRandomValues(valuesObject) {
      const obj = { ...valuesObject
      };

      for (const ky in valuesObject) {
        if (ky.search('transformOrigin') < 0 && ky.search('opacity') < 0) {
          obj[ky] = () => gsap.utils.random(0, valuesObject[ky]);
        }

        ;
      }

      return obj;
    }

    _createTimeline() {
      const {
        ease,
        duration,
        clearProps
      } = this.options;
      this.animationsTimeline = gsap.timeline({
        paused: this.shouldPause,
        defaults: {
          duration,
          ease,
          clearProps
        },
        onComplete: this._onTimelineAnimationComplete.bind(this)
      });
    }

    async _getChildTimelines() {
      const promises = [];
      this.animationTargets.forEach((el, i) => {
        const $el = $(el);
        let $caEl = $el;

        if ($el.hasClass('elementor-widget-container')) {
          $caEl = $el.parent();
        }

        const customAnimData = $caEl.data(`plugin_${pluginName}`);

        if (customAnimData && customAnimData.animationsInitiatedPromise) {
          promises[i] = customAnimData.animationsInitiatedPromise;
        }
      });

      if (promises.length > 0) {
        const childrenCustomAnimData = await Promise.all(promises);
        childrenCustomAnimData.forEach((childCaData, i) => {
          if (childCaData && childCaData.animationsTimeline) {
            this.animationTargets.splice(i + 1, 0, childCaData.animationsTimeline);
          }
        });
      }
    }

    _initValues() {
      const {
        options
      } = this;
      const {
        randomizeInitValues,
        initValues
      } = options;
      const $animationTargets = $(this.animationTargets);
      const initProps = !randomizeInitValues ? initValues : this._generateRandomValues(initValues);
      $animationTargets.css({
        transition: 'none',
        transitionDelay: 0
      }).addClass('will-change');

      if (this.needPerspective) {
        $animationTargets.parent().parent().addClass('perspective');
        $animationTargets.each((i, animTarget) => {
          const $animTarget = $(animTarget);

          if (!$animTarget.hasClass('mo-img-fancy')) {
            $animTarget.parent().addClass('transform-style-3d');
          }
        });
      }

      gsap.set(this.animationTargets, { ...initProps
      });
      this.element.classList.add('ca-initvalues-applied');
      this.$element.trigger('moanimationsinitiated', this);
    }

    async _runAnimations() {
      const {
        delay,
        startDelay,
        animations,
        addChildTimelines
      } = this.options;

      if (addChildTimelines) {
        await this._getChildTimelines();
      }

      this.animationTargets.forEach((target, i) => {
        if (!target.vars) {
          this.animationsTimeline.to(target, { ...animations,
            onStart: () => {
              this.animationsStarted = true;
            },
            onComplete: this._onUnitsAnimationsComplete.bind(this, target)
          }, i * delay + startDelay);
        } else {
          target.restart(true);
          this.animationsTimeline.add(target, '<');
        }
      });
    }

    _onTimelineAnimationComplete() {
      if (this.needPerspective) {
        $(this.animationTargets).parent().parent().removeClass('perspective');
        $(this.animationTargets).parent().removeClass('transform-style-3d');
      }

      this.$element.addClass('mo-animations-done');
      this.$element.trigger('moanimationsdone', this);
    }

    _onUnitsAnimationsComplete(element) {
      if (!element) return;
      element.style.transition = '';
      element.style.transitionDelay = '';
      element.classList.remove('will-change');

      if (element.classList.contains('split-inner')) {
        element.parentElement.classList.add('mo-unit-animation-done');
      } else {
        element.classList.add('mo-unit-animation-done');
      }
    }

    _initPlugins() {
      this.$element.find('[data-slideelement-onhover]').filter((i, element) => {
        return element.clientHeight > 0;
      }).moSlideElement();
      this.element.hasAttribute('data-slideelement-onhover') && this.$element.moSlideElement();
    }

    destroy() {
      this.element.classList.remove('ca-initvalues-applied', 'mo-animations-done', 'transform-style-3d');
      this.animationTargets.forEach(target => {
        if (!target.vars) {
          target.classList.remove('will-change');

          if (target.classList.contains('split-inner')) {
            target.parentElement.classList.remove('mo-unit-animation-done');
          } else {
            target.classList.remove('mo-unit-animation-done');
          }

          gsap.set(target, {
            clearProps: 'all'
          });
        } else {
          this.animationsTimeline.killTweensOf(target);
        }
      });

      if (this.animationsTimeline) {
        this.animationsTimeline.kill();
        this.animationsTimeline.clear();
      }

      $.data(this.element, 'plugin_' + pluginName, null);
    }

  }

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      const $this = $(this);
      const plugin = `plugin_${pluginName}`;
      const pluginOptions = { ...$this.data('ca-options'),
        ...options
      };
      let {
        initValues,
        animations
      } = pluginOptions;

      function handleTransformOrigins(opts) {
        if (!opts) return;
        const {
          transformOriginX,
          transformOriginY,
          transformOriginZ
        } = opts;

        if (transformOriginX && typeof transformOriginX === 'number') {
          opts.transformOriginX = transformOriginX + '%';
        }

        if (transformOriginY && typeof transformOriginY === 'number') {
          opts.transformOriginY = transformOriginY + '%';
        }

        if (transformOriginZ && typeof transformOriginZ === 'number') {
          opts.transformOriginZ = transformOriginZ + '%';
        }

        if (transformOriginX && transformOriginY && transformOriginZ) {
          opts.transformOrigin = `${opts.transformOriginX} ${opts.transformOriginY} ${opts.transformOriginZ}`;
          delete opts.transformOriginX;
          delete opts.transformOriginY;
          delete opts.transformOriginZ;
        }

        return opts;
      }

      initValues = handleTransformOrigins(initValues);
      animations = handleTransformOrigins(animations);

      if (!$.data(this, plugin)) {
        $.data(this, `plugin_${pluginName}`, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery);

jQuery(document).ready(function ($) {
  const anims = $('[data-custom-animations]').filter((i, element) => {
    const $element = $(element);
    const stackOptions = $moContents.length && $moContents[0].getAttribute('data-stack-options');
    const stackDisableOnMobile = stackOptions && JSON.parse(stackOptions).disableOnMobile === true;
    return (!stackOptions || stackOptions && stackDisableOnMobile && moIsMobile()) && !$element.hasClass('carousel-items');
  }).get().reverse();

  if (anims.length < 1) {
    return;
  };
  if (moIsMobile() && document.body.hasAttribute('data-disable-animations-onmobile')) {
    return $(anims).addClass('ca-initvalues-applied');
  };
  if ($moBody.hasClass('mo-preloader-activated') && $('.mo-preloader-wrap').length) {
    document.addEventListener('mo-preloader-anim-done', () => {
      $(anims).moCustomAnimations();
    });
  } else {
    $(anims).moCustomAnimations();
  }
});




(function ($) {
  'use strict';

  const pluginName = 'moHover3d';
  let defaults = {};

  class Plugin {
    constructor(element, options) {
      this._defaults = defaults;
      this._name = pluginName;
      this.options = { ...defaults,
        ...options
      };
      this.element = element;
      this.$element = $(element);
      this.hoverable = this.element.querySelector('[data-stacking-factor]');
      this.stackingFactor = this.hoverable.getAttribute('data-stacking-factor');
      this.rect = {};
      this.maxRotation = 8;
      this.maxTranslation = 4;
      this.build();
    }

    build() {
      fastdom.measure(() => {
        new IntersectionObserver(([entry], observer) => {
          observer.disconnect();
          const {
            boundingClientRect
          } = entry;
          this.rect = {
            width: boundingClientRect.width,
            height: boundingClientRect.height
          };
          this.init();
          this.$element.addClass('hover-3d-applied');
        }).observe(this.element);
      });
    }

    measure() {
      return fastdomPromised.measure(() => {
        return new Promise(resolve => {
          new IntersectionObserver(([entry], observer) => {
            observer.disconnect();
            resolve(entry.boundingClientRect);
          }).observe(this.element);
        });
      }).then(rect => {
        this.rect = {
          width: rect.width,
          height: rect.height
        };
      });
    }

    init() {
      this.eventHandlers();
    }

    eventHandlers() {
      this.$element.on('mousemove.moHover3d', this.hover.bind(this));
      this.$element.on('mouseleave.moHover3d', this.leave.bind(this));
      $moWindow.on('resize.moHover3d', this.onWindowLoad.bind(this));
    }

    async onWindowLoad() {
      await this.measure();
    }

    animate(config, isIn) {
      fastdom.mutate(() => {
        if (isIn) {
          this.element.classList.add('mouse-in');
        } else {
          this.element.classList.remove('mouse-in');
        }

        this.hoverable.style.transition = 'none';
        gsap.to(this.hoverable, {
          x: config.xTranslationPercentage * -1 * config.maxTranslationX,
          y: config.yTranslationPercentage * -1 * config.maxTranslationY,
          rotateX: config.xRotationPercentage * -1 * config.maxRotationX,
          rotateY: config.yRotationPercentage * -1 * config.maxRotationY,
          duration: 0.8,
          ease: 'power2.out'
        });
      });
    }

    calculateRotationPercentage(offset, dimension) {
      return -2 / dimension * offset + 1;
    }

    calculateTranslationPercentage(offset, dimension) {
      return -2 / dimension * offset + 1;
    }

    hover(e) {
      const mouseOffsetInside = {
        x: e.pageX - this.$element.offset().left,
        y: e.pageY - this.$element.offset().top
      };
      const transVals = {
        xRotationPercentage: this.calculateRotationPercentage(mouseOffsetInside.y, this.rect.height),
        yRotationPercentage: this.calculateRotationPercentage(mouseOffsetInside.x, this.rect.width) * -1,
        xTranslationPercentage: this.calculateTranslationPercentage(mouseOffsetInside.x, this.rect.width),
        yTranslationPercentage: this.calculateTranslationPercentage(mouseOffsetInside.y, this.rect.height)
      };
      this.animate({
        maxTranslationX: this.maxTranslation * this.stackingFactor,
        maxTranslationY: this.maxTranslation * this.stackingFactor,
        maxRotationX: this.maxRotation * this.stackingFactor,
        maxRotationY: this.maxRotation * this.stackingFactor,
        xRotationPercentage: transVals.xRotationPercentage,
        yRotationPercentage: transVals.yRotationPercentage,
        xTranslationPercentage: transVals.xTranslationPercentage,
        yTranslationPercentage: transVals.yTranslationPercentage
      }, true);
    }

    leave() {
      this.animate({
        maxTranslationX: 0,
        maxTranslationY: 0,
        maxRotationX: 0,
        maxRotationY: 0,
        xRotationPercentage: 0,
        yRotationPercentage: 0,
        xTranslationPercentage: 0,
        yTranslationPercentage: 0
      }, false);
    }

    destroy() {
      this.$element.off('mousemove.moHover3d mouseleave.moHover3d');
      $moWindow.off('resize.moHover3d');
    }

  }

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      const pluginOptions = { ...$(this).data('hover3d-options'),
        ...options
      };

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery);

jQuery(document).ready(function ($) {
  if (moIsMobile()) return false;
  $('[data-hover3d]').filter((i, element) => !$(element).closest('.mo-tabs-pane').not('.active').length).moHover3d();
});







(function ($) {
  'use strict';

  const pluginName = 'moSplitText';
  let defaults = {
    type: "words",
    forceApply: false
  };

  class Plugin {
    constructor(element, options) {
      this._defaults = defaults;
      this._name = pluginName;
      this.options = { ...defaults,
        ...options
      };
      this.splittedTextList = {
        lines: [],
        words: [],
        chars: []
      };
      this.splitTextInstance = null;
      this.isRTL = $('html').attr('dir') === 'rtl';
      this.element = element;
      this.$element = $(element);
      this.fontInfo = {};
      this.splitDonePormise = new Promise(resolve => {
        this.$element.on('mosplittext', resolve.bind(this, this));
      });

      if (!this.options.forceApply) {
        new IntersectionObserver(([entry], observer) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            this.init();
          }
        }, {
          rootMargin: '20%'
        }).observe(this.element);
      } else {
        this.init();
      }
    }

    async init() {
      await this._measure();
      await this._onFontsLoad();

      this._windowResize();
    }

    _measure() {
      return fastdomPromised.measure(() => {
        const styles = getComputedStyle(this.element);
        this.fontInfo.elementFontFamily = styles.fontFamily.replace(/"/g, '').replace(/'/g, '').split(',')[0];
        this.fontInfo.elementFontWeight = styles.fontWeight;
        this.fontInfo.elementFontStyle = styles.fontStyle;
        this.fontInfo.lowecaseFontFamily = this.fontInfo.elementFontFamily.toLowerCase();
      });
    }

    _onFontsLoad() {
      return fastdomPromised.measure(() => {
        if (window.moCheckedFonts && window.moCheckedFonts.length && window.moCheckedFonts.indexOf(this.fontInfo.lowecaseFontFamily) >= 0) {
          return this._doSplit();
        }

        const font = new FontFaceObserver(this.fontInfo.elementFontFamily, {
          weight: this.fontInfo.elementFontWeight,
          style: this.fontInfo.elementFontStyle
        });
        font.load().finally(() => {
          window.moCheckedFonts.push(this.fontInfo.lowecaseFontFamily);

          this._doSplit();
        });
      });
    }

    getSplitTypeArray() {
      const {
        type
      } = this.options;
      const splitTypeArray = type.split(',').map(item => item.replace(' ', ''));

      if (!this.isRTL) {
        return splitTypeArray;
      } else {
        return splitTypeArray.filter(type => type !== 'chars');
      }
    }

    async _doSplit() {
      await this._split();
      await this._unitsOp();
      await this._onSplittingDone();
    }

    _split() {
      const splitType = this.getSplitTypeArray();
      const fancyHeadingInner = this.element.classList.contains('mo-txt') && this.element.querySelector('.mo-txt-inner') != null;
      const el = fancyHeadingInner ? this.element.querySelector('.mo-txt-inner') : this.element;
      let splittedText;
      return fastdomPromised.mutate(() => {
        splittedText = new SplitText(el, {
          type: splitType,
          charsClass: 'split-unit mo-chars',
          linesClass: 'split-unit mo-lines',
          wordsClass: 'split-unit mo-words'
        });
        splitType.forEach(type => {
          splittedText[type].forEach(element => {
            this.splittedTextList[type].push(element);
          });
        });
        this.element.classList.add('split-text-applied');
        this.splitTextInstance = splittedText;
      });
    }

    _unitsOp() {
      return fastdomPromised.mutate(() => {
        for (const [splitType, splittedTextArray] of Object.entries(this.splittedTextList)) {
          if (splittedTextArray && splittedTextArray.length > 0) {
            splittedTextArray.forEach((splitElement, i) => {
              splitElement.style.setProperty(`--${splitType}-index`, i);
              splitElement.style.setProperty(`--${splitType}-last-index`, splittedTextArray.length - 1 - i);
              $(splitElement).wrapInner(`<span class="split-inner" />`);
            });
          }

          ;
        }

        ;
      });
    }

    _onSplittingDone() {
      return fastdomPromised.mutate(() => {
        this.element.dispatchEvent(new CustomEvent('mosplittext'));
      });
    }

    _windowResize() {
      $(window).on('resize.moSplitText', this._onWindowResize.bind(this));
    }

    _onWindowResize() {
      if (this.splitTextInstance) {
        this.splitTextInstance.revert();
        this.element.classList.remove('split-text-applied');
      }

      this._onAfterWindowResize();
    }

    _onAfterWindowResize() {
      this._doSplit();

      this._onSplittingDone();

      this.$element.find('.split-unit').addClass('mo-unit-animation-done');
    }

    destroy() {
      $(window).off('resize.moSplitText');
    }

  }

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      const pluginOptions = { ...$(this).data('split-options'),
        ...options
      };

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery);

jQuery(document).ready(function ($) {
  const $elements = $('[data-split-text]').filter((i, el) => {
    const $el = $(el);
    const isCustomAnimation = el.hasAttribute('data-custom-animations');
    const hasCustomAnimationParent = $el.closest('[data-custom-animations]').length;
    const hasAccordionParent = $el.closest('.accordion-content').length;
    const hasTabParent = $el.closest('.mo-tabs-pane').length;
    const webglSlideshowParent = $el.closest('[data-mo-webgl-slideshow]').length;
    return !isCustomAnimation && !hasCustomAnimationParent && !hasAccordionParent && !hasTabParent && !webglSlideshowParent;
  });
  $elements.moSplitText();
});




(function ($) {
  'use strict';

  const pluginName = 'moSlideElement';
  let defaults = {
    hiddenElement: null,
    visibleElement: null,
    hiddenElementOnHover: null,
    alignMid: false,
    waitForSplitText: false,
    triggerElement: 'self'
  };

  class Plugin {
    constructor(element, options) {
      this._defaults = defaults;
      this._name = pluginName;
      this.options = { ...defaults,
        ...options
      };
      this.element = element;
      this.$element = $(element);
      this.$triggerElement = this.options.triggerElement === 'self' ? this.$element : this.$element.closest(this.options.triggerElement);
      this.timeline = gsap.timeline();

      if (this.options.waitForSplitText) {
        const $splitTextEls = this.$element.find('[data-split-text]');
        const promises = [];

        if ($splitTextEls.length) {
          $splitTextEls.moSplitText({
            forceApply: true
          });
          $splitTextEls.each((i, el) => {
            const $el = $(el);
            const splitTextData = $el.data('plugin_moSplitText');

            if (splitTextData) {
              promises.push(splitTextData.splitDonePormise);
            }
          });
        }

        if (promises.length > 0) {
          Promise.all(promises).then(this.init.bind(this));
        }
      } else {
        this.init();
      }
    }

    init() {
      this.getElements();

      if (!this.$hiddenElement.length || !this.$visibleElement.length) {
        return;
      }

      imagesLoaded(this.element, () => {
        this.hiddenElementHeight = this.getHiddenElementHeight();
        this.$element.addClass('hide-target');
        this.createTimeline();
        this.moveElements();
        this.eventListeners();
      });
    }

    getElements() {
      this.$hiddenElement = $(this.options.hiddenElement, this.element);
      this.$visibleElement = $(this.options.visibleElement, this.element);
      this.$hiddenElementOnHover = $(this.options.hiddenElementOnHover, this.element);
      this.$hiddenElement.wrap('<div class="mo-slideelement-hidden" />').wrap('<div class="mo-slideelement-hidden-inner" />');
      this.$visibleElement.wrap('<div class="mo-slideelement-visible" />').wrap('<div class="mo-slideelement-visible-inner" />');
      this.$hiddenElementWrap = this.$hiddenElement.closest('.mo-slideelement-hidden');
      this.$hiddenElementInner = this.$hiddenElement.closest('.mo-slideelement-hidden-inner');
      this.$visibleElementWrap = this.$visibleElement.closest('.mo-slideelement-visible');
      this.$visibleElementInner = this.$visibleElement.closest('.mo-slideelement-visible-inner');
    }

    getHiddenElementHeight() {
      let height = 0;
      $.each(this.$hiddenElement, (i, element) => {
        height += $(element).outerHeight(true);
      });
      return height;
    }

    getHiddenElementChilds() {
      return this.$hiddenElementInner.children().map((i, childElement) => $(childElement).parent().get(0));
    }

    getVisibleElementChilds() {
      return this.$visibleElementInner.children().map((i, childElement) => $(childElement).parent().get(0));
    }

    moveElements() {
      const translateVal = this.options.alignMid ? this.hiddenElementHeight / 2 : this.hiddenElementHeight;
      this.$visibleElementWrap.css({
        transform: `translateY(${translateVal}px)`
      });
      this.$hiddenElementWrap.css({
        transform: `translateY(${translateVal}px)`
      });
    }

    createTimeline() {
      const {
        options
      } = this;
      const hiddenElementHeight = this.hiddenElementHeight;
      const childElements = [...this.getVisibleElementChilds(), ...this.getHiddenElementChilds()];
      let translateVal = options.alignMid ? hiddenElementHeight / 2 : hiddenElementHeight;

      if (options.hiddenElementOnHover) {
        const elementHeight = this.$hiddenElementOnHover.outerHeight(true);
        translateVal = options.alignMid ? (hiddenElementHeight + elementHeight) / 2 : hiddenElementHeight + elementHeight;
      }

      this.timeline.to(childElements, {
        y: translateVal * -1,
        opacity: (i, element) => {
          if ($(element).is($(this.$hiddenElementOnHover).parent())) {
            return 0;
          }

          return 1;
        },
        ease: 'power3.out',
        duration: 0.65,
        stagger: 0.065
      }).pause();
    }

    eventListeners() {
      this.$triggerElement.on('mouseenter.moSlideElementOnHover', this.onMouseEnter.bind(this));
      this.$triggerElement.on('mouseleave.moSlideElementOnHover', this.onMouseLeave.bind(this));
    }

    onMouseEnter() {
      this.timeline.play();
    }

    onMouseLeave() {
      this.timeline.reverse();
    }

    destroy() {
      this.$triggerElement.off('mouseenter.moSlideElementOnHover mouseleave.moSlideElementOnHover');
    }

  }

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      const pluginOptions = { ...$(this).data('slideelement-options'),
        ...options
      };

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery);

jQuery(document).ready(function ($) {
  const $elements = $('[data-slideelement-onhover]').filter((i, element) => {
    return !$(element).parents('[data-custom-animations]').length && !element.hasAttribute('data-custom-animations') && element.clientHeight > 0;
  });
  $elements.moSlideElement();
});





(function ($) {
  'use strict';

  const pluginName = 'moTextRotator';
  let defaults = {
    delay: 2,
    duration: 0.8,
    easing: 'power4.inOut',
    animationType: 'slide',
    marquee: false
  };

  class Plugin {
    constructor(element, options) {
      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.activeKeywordIndex = 0;
      this.nextKeywordIndex = 1;
      this.isFirstItterate = true;
      this.basicAnimationTimeline = null;
      this.basicAnimationsResetTimeout = null;
      this.$keywordsContainer = null;
      this.keywordsContainer = null;
      this.$keywords = null;
      this.keywordsLength = 0;
      this.keywordsDimensions = [];
      this.slideInTimeout = null;
      this.slideOutTimeout = null;
      this.build();
    }

    async init() {
      await this._measure();
      await this._onFontsLoad();
    }

    _measure() {
      return fastdomPromised.measure(() => {
        const styles = getComputedStyle(this.element);
        this.fontInfo.elementFontFamily = styles.fontFamily.replace(/"/g, '').replace(/'/g, '').split(',')[0];
        this.fontInfo.elementFontWeight = styles.fontWeight;
        this.fontInfo.elementFontStyle = styles.fontStyle;
        this.fontInfo.lowecaseFontFamily = this.fontInfo.elementFontFamily.toLowerCase();
      });
    }

    _onFontsLoad() {
      return fastdomPromised.measure(() => {
        if (window.moCheckedFonts && window.moCheckedFonts.length && window.moCheckedFonts.indexOf(this.fontInfo.lowecaseFontFamily) >= 0) {
          return this.build();
        }

        const font = new FontFaceObserver(this.fontInfo.elementFontFamily, {
          weight: this.fontInfo.elementFontWeight,
          style: this.fontInfo.elementFontStyle
        });
        font.load().finally(() => {
          window.moCheckedFonts.push(this.fontInfo.lowecaseFontFamily);
          this.build();
        });
      });
    }

    build() {
      const promises = [];
      const $customAnimationParent = this.$element.closest('[data-custom-animations]');
      const $customAnimationChild = this.$element.children('[data-custom-animations]');
      const $splitTextChild = this.$element.children('[data-split-text]');

      if (this.element.hasAttribute('data-split-text')) {
        const data = this.$element.data('plugin_moSplitText');
        data && promises.push(data.splitDonePormise);
      }

      if ($splitTextChild.length) {
        const data = $splitTextChild.data('plugin_moSplitText');
        data && promises.push(data.splitDonePormise);
      }

      if ($customAnimationParent.length) {
        const data = $customAnimationParent.data('plugin_moCustomAnimations');
        data && promises.push(data.animationsDonePromise);
      }

      if ($customAnimationChild.length) {
        const data = $customAnimationChild.data('plugin_moCustomAnimations');
        data && promises.push(data.animationsDonePromise);
      }

      if (this.element.hasAttribute('data-custom-animations')) {
        const data = this.$element.data('plugin_moCustomAnimations');
        data && promises.push(data.animationsDonePromise);
      }

      if (promises.length) {
        Promise.all(promises).finally(() => {
          this.init();
        });
      } else {
        this.init();
      }
    }

    async init() {
      this._handleWindowResize = moDebounce(this._handleWindowResize.bind(this), 350);
      this.$keywordsContainer = $('.txt-rotate-keywords', this.element);
      if (!this.$keywordsContainer.length) { return console.warn('Could not find keywords container');};
      this.keywordsContainer = this.$keywordsContainer[0];
      this.keywordsInner = this.keywordsContainer.querySelector('.txt-rotate-keywords-inner');
      this.$keywords = $('.txt-rotate-keyword', this.$keywordsContainer);
      this.$keywords.attr('class', 'txt-rotate-keyword').eq(0).addClass('active');
      this.keywordsLength = this.$keywords.length - 1;
      this.keywordsDimensions = await this.getKeywordsDimensions();
      this.setContainerWidth(0);
      this.initAnimations();
      this._windowResize();
      this.$element.addClass('text-rotator-activated');
    }

    async getKeywordsDimensions() {
      const promises = [];
      this.$keywords.each((i, keyword) => {
        const promise = new Promise(resolve => {
          new IntersectionObserver(([entry], observer) => {
            observer.disconnect();
            const {
              boundingClientRect: {
                width,
                height
              }
            } = entry;
            resolve({
              width,
              height
            });
          }).observe(keyword);
        });
        promises.push(promise);
      });
      const widths = await Promise.all(promises);
      return widths;
    }

    updateActiveIndex() {
      this.activeKeywordIndex = this.activeKeywordIndex + 1 > this.keywordsLength ? 0 : this.activeKeywordIndex + 1;
    }

    updateNextIndex() {
      this.nextKeywordIndex = this.nextKeywordIndex + 1 > this.keywordsLength ? 0 : this.nextKeywordIndex + 1;
    }

    setActiveClass() {
      this.$keywords.removeClass('active');
      this.$keywords.eq(this.activeKeywordIndex).addClass('active');
    }

    setNextClass() {
      this.$keywords.removeClass('is-next');
      this.$keywords.eq(this.nextKeywordIndex).addClass('is-next');
    }

    setContainerWidth(index) {
      const keywordContainer = this.$keywordsContainer[0];

      if (this.options.animationType === 'list') {
        return keywordContainer.style.width = `${Math.max(...this.keywordsDimensions.map(dim => parseInt(dim.width, 10)))}px`;
      }

      keywordContainer.style.width = `${this.keywordsDimensions[index].width}px`;
    }

    slideInNextKeyword() {
      const $nextKeyword = this.$keywords.eq(this.nextKeywordIndex);
      const delay = this.isFirstItterate ? this.options.delay / 2 : this.options.delay;
      this.slideInTimeout = setTimeout(() => {
        this.setContainerWidth(this.nextKeywordIndex);
        $nextKeyword.removeClass('mo-keyword-slide-out').addClass('mo-keyword-slide-in');
        this.isFirstItterate = false;
        this.updateNextIndex();
        this.setNextClass();
        this.slideOutAciveKeyword();
        clearTimeout(this.slideInTimeout);
      }, delay * 1000);
    }

    slideOutAciveKeyword() {
      const $activeKeyword = this.$keywords.eq(this.activeKeywordIndex);
      const delay = this.isFirstItterate ? this.options.delay / 2 : this.options.delay;
      $activeKeyword.removeClass('mo-keyword-slide-in').addClass('mo-keyword-slide-out');
      this.updateActiveIndex();
      this.setActiveClass();
      this.slideOutTimeout = setTimeout(() => {
        this.slideInNextKeyword();
        clearTimeout(this.slideOutTimeout);
      }, delay * 1000);
    }

    buildBaiscAnimation() {
      this.$element.addClass('txt-rotator-basic');
      this.basicAnimationTimeline = gsap.timeline({
        easing: 'power2.inOut',
        onStart: () => {
          this.isFirstItterate = false;

          if (this.basicAnimationsResetTimeout) {
            clearTimeout(this.basicAnimationsResetTimeout);
          }

          this.setContainerWidth(this.nextKeywordIndex);
        },
        onComplete: () => {
          this.updateActiveIndex();
          this.updateNextIndex();
          this.setActiveClass();
          this.setNextClass();
          this.basicAnimationsResetTimeout = setTimeout(() => this.basicAnimationTimeline && this.basicAnimationTimeline.restart(), this.options.delay * 1000);
        }
      });
      this.$keywords.each((i, keyword) => {
        this.basicAnimationTimeline.to(keyword, {
          duration: 0.125,
          opacity: 1,
          onStart: () => {
            const $keyword = $(keyword);
            this.$keywords.not($keyword).removeClass('active');
            $keyword.addClass('active');
          }
        });
      });
    }

    buildListAnimation() {
      const duration = 2;
      const visibleWords = parseInt(getComputedStyle(this.keywordsContainer).getPropertyValue('--visible-words'), 10);
      const totalHeight = this.keywordsDimensions.map(dim => dim.height).reduce((prevVal, newVal) => prevVal + newVal, 0);
      const listHeight = this.keywordsDimensions.slice(0, visibleWords).map(dim => dim.height).reduce((prevVal, newVal) => prevVal + newVal, 0);
      const totalKeywords = this.$keywords.length;
      const timer = gsap.delayedCall(this.options.delay, animateTo.bind(this));
      let currentKeyword = 1;
      let nextKeyword = currentKeyword + 1;
      let offset = 0;
      let wrapping = false;
      const mainTimeline = gsap.timeline({
        defaults: {
          repeat: -1,
          duration,
          ease: 'none'
        },
        paused: true
      });
      this.keywordsInnerClone = this.keywordsInner.cloneNode(true);
      this.keywordsInnerClone.classList.add('txt-rotate-keywords-inner-clone', 'mo-overlay', 'flex-column');
      this.keywordsContainer.append(this.keywordsInnerClone);
      this.keywordsContainer.style.height = `${listHeight}px`;
      this.keywordsContainer.style.overflow = `hidden`;
      this.$keywords.add($(this.keywordsInnerClone).children()).each((i, keyword) => {
        i = i % totalKeywords;
        const keywordHeight = this.keywordsDimensions[i].height;
        const wrap = gsap.utils.wrap(keywordHeight * -1, totalHeight - keywordHeight);
        gsap.set(keyword, {
          position: 'absolute',
          y: offset
        });
        mainTimeline.to(keyword, {
          y: `-=${totalHeight}`,
          modifiers: {
            y: gsap.utils.unitize(wrap)
          }
        }, 0).add(`keyword-${i + 1}`, gsap.utils.mapRange(0, totalKeywords, 0, duration)(i));
        offset += keywordHeight;
      });

      const slideKeywordsInner = () => {
        gsap.set([this.keywordsInner, this.keywordsInnerClone], {
          '--current-keyword-height': `${this.keywordsDimensions[currentKeyword - 1].height / 2 * -1}px`
        });
      };

      slideKeywordsInner();

      const scrubTimeline = (from, to) => {
        if (wrapping) {
          return new gsap.timeline().add(mainTimeline.tweenFromTo(from, duration, {
            duration: this.options.duration,
            ease: this.options.easing
          })).add(mainTimeline.tweenFromTo(0, to, {
            duration: this.options.duration,
            ease: this.options.easing,
            immediateRender: false
          }));
        }

        return mainTimeline.tweenFromTo(from, to, {
          duration: this.options.duration,
          ease: this.options.easing
        });
      };

      function animateTo() {
        timer && timer.restart(true);
        currentKeyword === totalKeywords ? wrapping = true : wrapping = false;

        if (!wrapping) {
          scrubTimeline(`keyword-${currentKeyword}`, `keyword-${nextKeyword}`);
        } else {
          scrubTimeline(`keyword-${totalKeywords}`, `keyword-${1}`);
        }

        slideKeywordsInner();
        currentKeyword = currentKeyword >= totalKeywords ? 1 : currentKeyword + 1;
        nextKeyword = currentKeyword === totalKeywords ? 1 : currentKeyword + 1;
      }

      ;
      animateTo();
    }

    initAnimations() {
      const {
        animationType
      } = this.options;

      switch (animationType) {
        case 'basic':
          this.buildBaiscAnimation();
          break;

        case 'list':
          this.buildListAnimation();
          break;

        default:
          this.slideInNextKeyword();
      }
    }

    _windowResize() {
      $(window).on('resize.moTextRotator', this._handleWindowResize.bind(this));
    }

    _handleWindowResize() {
      gsap.killTweensOf(this.$keywordsContainer[0]);
      this.keywordsInner && gsap.killTweensOf(this.keywordsInner);
      this.$keywords.each((i, keyword) => {
        gsap.killTweensOf(keyword);
      });

      if (this.keywordsInnerClone) {
        gsap.killTweensOf(this.keywordsInnerClone);
        $(this.keywordsInnerClone).children().each((i, keyword) => {
          gsap.killTweensOf(keyword);
        });
      }

      this.destroy();

      this._onWindowResize();
    }

    _onWindowResize() {
      this.activeKeywordIndex = 0;
      this.nextKeywordIndex = 1;
      this.isFirstItterate = true;
      this.basicAnimationTimeline = null;
      this.basicAnimationsResetTimeout = null;
      this.slideInTimeout && clearTimeout(this.slideInTimeout);
      this.slideOutTimeout && clearTimeout(this.slideOutTimeout);
      this.build();
    }

    destroy() {
      $(window).off('resize.moTextRotator');
      this.keywordsInnerClone && this.keywordsInnerClone.remove();
    }

  }

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      const pluginOptions = { ...$(this).data('text-rotator-options'),
        ...options
      };

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery);

jQuery(document).ready(function ($) {
  $('[data-text-rotator]').moTextRotator();
});








(function ($) {
  'use strict';

  const pluginName = 'moReveal';
  let defaults = {
    isContentHidden: true,
    animteWhenInView: true,
    delay: 0,
    revealSettings: {
      direction: 'lr',
      bgcolor: '#f0f0f0',
      duration: 0.5,
      ease: 'power4.inOut',
      coverArea: 0,
      onCover: function (contentEl, revealerEl) {
        return false;
      },
      onStart: function (contentEl, revealerEl) {
        return false;
      },
      onComplete: function (contentEl, revealerEl) {
        return false;
      },
      onCoverAnimations: null
    }
  };

  class Plugin {
    constructor(element, options) {
      this.options = { ...defaults,
        ...options
      };
      this._defaults = defaults;
      this._name = pluginName;
      this.element = element;
      this.$element = $(element);
      this.$content = this.$element.children();
      this.revealer = null;
      this.init();
    }

    init() {
      this._layout();

      if (this.options.animteWhenInView) {
        this.setIntersectionObserver();
      } else {
        imagesLoaded(this.element, this.doTheReveal.bind(this));
      }
    }

    _createDOMEl(type, className, content) {
      var el = document.createElement(type);
      el.className = className || '';
      el.innerHTML = content || '';
      return el;
    }

    _layout() {
      const position = getComputedStyle(this.element).position;

      if (position !== 'fixed' && position !== 'absolute' && position !== 'relative') {
        this.element.style.position = 'relative';
      }

      if (this.options.isContentHidden) {
        this.$content.css('opacity', 0);
      }

      this.revealer = this._createDOMEl('div', 'block-revealer__element');
      this.element.classList.add('block-revealer');
      this.element.appendChild(this.revealer);
    }

    _getTransformSettings(direction) {
      var val, origin, origin_2;

      switch (direction) {
        case 'lr':
          val = 'scaleX(0)';
          origin = '0 50%';
          origin_2 = '100% 50%';
          break;

        case 'rl':
          val = 'scaleX(0)';
          origin = '100% 50%';
          origin_2 = '0 50%';
          break;

        case 'tb':
          val = 'scaleY(0)';
          origin = '50% 0';
          origin_2 = '50% 100%';
          break;

        case 'bt':
          val = 'scaleY(0)';
          origin = '50% 100%';
          origin_2 = '50% 0';
          break;

        default:
          val = 'scaleX(0)';
          origin = '0 50%';
          origin_2 = '100% 50%';
          break;
      }

      return {
        val: val,
        origin: {
          initial: origin,
          halfway: origin_2
        }
      };
    }

    reveal(revealSettingsArg) {
      if (this.isAnimating) {
        return false;
      }

      this.isAnimating = true;

      var defaults = {
        duration: 0.5,
        ease: 'power4.inOut',
        delay: this.options.delay ? this.options.delay / 1000 : 0,
        bgcolor: '#f0f0f0',
        direction: 'lr',
        coverArea: 0
      },
          revealSettings = revealSettingsArg || this.options.revealSettings,
          direction = revealSettings.direction || defaults.direction,
          transformSettings = this._getTransformSettings(direction);

      this.revealer.style.WebkitTransform = this.revealer.style.transform = transformSettings.val;
      this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin = transformSettings.origin.initial;

      if (!moIsElementor) {
        this.revealer.style.background = revealSettings.bgcolor || defaults.bgcolor;
      }

      this.revealer.style.opacity = 1;
      var self = this,
          animationSettings_2 = {
        onComplete: function () {
          self.isAnimating = false;

          if (typeof revealSettings.onComplete === 'function') {
            revealSettings.onComplete(self.content, self.revealer);
          }

          $(self.element).addClass('revealing-ended').removeClass('revealing-started');
        }
      },
          animationSettings = {
        delay: revealSettings.delay ? revealSettings.delay / 1000 : defaults.delay,
        onComplete: function () {
          self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway;

          if (typeof revealSettings.onCover === 'function') {
            revealSettings.onCover(self.content, self.revealer);
          }

          $(self.element).addClass('element-uncovered');
          gsap.to(self.revealer, { ...animationSettings_2
          });
        }
      };
      animationSettings.duration = animationSettings_2.duration = revealSettings.duration ? revealSettings.duration / 1000 : defaults.duration;
      animationSettings.ease = animationSettings_2.ease = revealSettings.ease || defaults.ease;
      var coverArea = revealSettings.coverArea || defaults.coverArea;

      if (direction === 'lr' || direction === 'rl') {
        animationSettings.keyframes = [{
          scaleX: 0
        }, {
          scaleX: 1,
          duration: animationSettings.duration
        }];
        animationSettings_2.keyframes = [{
          scaleX: 1
        }, {
          scaleX: coverArea / 100,
          duration: animationSettings.duration
        }];
      } else {
        animationSettings.keyframes = [{
          scaleY: 0
        }, {
          scaleY: 1,
          duration: animationSettings.duration
        }];
        animationSettings_2.keyframes = [{
          scaleY: 1
        }, {
          scaleY: coverArea / 100,
          duration: animationSettings.duration
        }];
      }

      if (typeof revealSettings.onStart === 'function') {
        revealSettings.onStart(self.content, self.revealer);
      }

      $(self.element).addClass('revealing-started');
      gsap.to(self.revealer, { ...animationSettings
      });
    }

    setIntersectionObserver() {
      new IntersectionObserver(([entry], observer) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          $(entry.target).imagesLoaded(this.doTheReveal.bind(this));
        }
      }).observe(this.element);
    }

    doTheReveal() {
      const onCoverAnimations = this.options.revealSettings.onCoverAnimations || [{
        "scale": 0.9
      }, {
        "scale": 1
      }];
      const onCover = {
        onCover: () => {
          if (this.options.isContentHidden) {
            this.$content.css('opacity', 1);
          }

          gsap.fromTo(this.element.querySelector('figure'), { ...onCoverAnimations[0]
          }, {
            duration: 0.8,
            ease: 'power4.out',
            ...onCoverAnimations[1]
          });
        }
      };
      const options = { ...this.options,
        ...onCover
      };
      this.reveal(options);
    }

  }

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      const pluginOptions = { ...$(this).data('reveal-options'),
        ...options
      };

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };

  /* ------------------------------------- */
	/*  preloader
	/* ------------------------------------- */
	function preloader() {
		const preloader = $(".preloader"),
			progress_title = preloader.find(".preloader-content .text-fill"),
			persent = {value: 0};
		jQuery(window).on("load", function() {
		gsap.timeline()
			.to(persent, 1, {
				value: 100, onUpdate: function () {
					progress_title.css("clip-path", "inset(" + (100 - persent.value) + "% 0% 0% 0%)");
				},
			})
			.to(preloader.find('> *'), {y: -30, autoAlpha: 0})
			
			.set(persent, {value: 0})
			.to(persent, 0.8, {
				value: 100, onUpdate: function () {
					preloader.css("clip-path", "inset(" + (persent.value) + "% 0% 0% 0%)");
				},
				ease: Power2.easeInOut,
			}, "+=0.5")
		});
	}
	preloader();


})(jQuery);

jQuery(document).ready(function ($) {
  if (!$moContents.length) return;
  $('[data-reveal]').filter((i, element) => {
    const $element = $(element);
    const $lazyloadImg = $element.find('.mo-lazyload');
    return !window.$moContents[0].hasAttribute('data-mo-stack') && !$lazyloadImg.length;
  }).moReveal();
});


