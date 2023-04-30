/* Twilight Slideshow 0.7 */
/* Andrew Marcus & Love Media, 2010 */
/* Licensed under MIT */

(function($) {
	$.fn.extend({
		twilight: function(settings) {
			var defaults = {
				startingSlide: 0,
				outOpacity: 0.3,								// Opacity of corner images when mouse is out of the arrow
				overOpacity: 0.7,								// Opacity of corner images when mouse is over the arrow
				animTime: 2000,									// Time of animation
				animFadeTime: 500,								// Speed the central slide fades with
				animHoverTime: 250,								// Speed the corner images fade with
				easingMargin: 'easeOutExpo',							// Easing for the margin animation
				easingCss: 'swing',							// Easing for the css one
				boxSelector: this.selector + ' .twilight-box',
				arrowLeftSelector: this.selector + ' .arrow-left',
				arrowRightSelector: this.selector + ' .arrow-right',
				updateURL: true,								// Update the url anchor or not
				listenEvent: true,
				forceCss: false,
				showId: '',
				slideCompleteCallback: function(N, direction) { },		// Sliding is complete
				prevNextClickCallback: function(N, direction) { }		// Prev/next clicked
			}
			
			if (!settings) settings = defaults;
			
			if (settings.startingSlide == 'url') {
				var slide = Number(window.location.hash.substring(1)) - 1;
				if (slide < 1 || slide > 1000 || isNaN(slide)) slide = 0;
				settings.startingSlide = slide;
			}
			
			for (option in defaults) {
				if (!(option in settings) || settings[option] === undefined) settings[option] = defaults[option];
			}
			
			var BACK = -1;
			var FORWARD = 1;
			
			/* We will use CSS animation on iPhone and iPad devices because margin animation is too slow for they */
			var useCssAnim = false;
			var isiPad = navigator.userAgent.match(/iPad/i) != null;
			var isiPhone = navigator.userAgent.match(/iPhone/i) != null;
			var isiPod = navigator.userAgent.match(/iPod/i) != null;
			if (isiPad || isiPhone || isiPod || settings.forceCss) useCssAnim = true;
			
			return this.each(function() {
				var box = $(settings.boxSelector);
				var slide = 2;
				var outerSlCounter = 0;
				var limitTimer;
				var animTimeMargin;
				var innerCycleTimeout;
				
				if (settings.startingSlide > 0 && settings.startingSlide < box.children().length) {
					box.append(box.children('*:lt(' + settings.startingSlide + ')').detach());
					outerSlCounter = settings.startingSlide;
				}
				
				/* The show is designed to work with at least 5 images */
				switch(box.children().length) {
					case 1:
						box.append(box.children().clone());
						box.append(box.children().clone());
						box.append(box.children().clone());
						box.append(box.children().clone());
					break;
					
					case 2:
						box.append(box.children().clone());
						box.append(box.children().clone());
					break;
					
					case 3:
						box.append(box.children().clone());
					break;
					
					case 4:
						box.append(box.children().clone());
					break;
				}
				
				/* Adding corner images to the left side */
				box.prepend(box.children().last().detach());
				box.prepend(box.children().last().detach());
					
				var cornerWidth = ($(this).width() - box.children().eq(2).width())/2;
				var preShift = box.children().eq(0).width() + box.children().eq(1).width() - cornerWidth + (useCssAnim === true ? 0 : 10000);
				box.css('margin-left', parseInt(box.css('margin-left')) || 0 - preShift);
				
				var showMarginLeft = parseInt(box.css('margin-left'));
				var showWidth = $(this).width();
					
				box.children().first().css('margin-left', (useCssAnim === true ? 0 : 10000));
				
				/* Fading initial slide */
				fadeSlide(slide);
				
				function SlideMarginTo(slideIndex) {
					/* The show cannot work faster by design */
					if (!limitTimer) limitTimer = setTimeout(function() { limitTimer = null; }, animTimeMargin/2)
					else return false;
					
					var firstSlide = box.children().first();
					var lastSlide = box.children().last();
					
					var prevPrevSlide = box.children().eq(slide - 2);
					var prevSlide = box.children().eq(slide - 1);
					var currSlide = box.children().eq(slide);
					var nextSlide = box.children().eq(slide + 1);
					var nextNextSlide = box.children().eq(slide + 2);
											
					var direction = 0;
					
					if (outerSlCounter < slideIndex) direction = BACK;
					else if (outerSlCounter > slideIndex) direction = FORWARD;
					
					switch (direction) {
						case BACK:
							var cornerWidth = (showWidth - nextSlide.width())/2;
							var delta = -showMarginLeft - (currSlide.width() - cornerWidth + prevSlide.width());
							var shift = parseInt(firstSlide.css('margin-left')) || 0;
							
							/* Moving the first slide to the tail */
							box.append(firstSlide.detach());
							box.children().stop(true, true).first().css('margin-left', firstSlide.width() + shift).animate({
								'margin-left': delta
							}, animTimeMargin, settings.easingMargin, function() {
								transAnim = false;
								outerSlCounter++;
								if (outerSlCounter < slideIndex) setTimeout(function(){ SlideMarginTo(slideIndex) }, 0);
								settings.slideCompleteCallback(outerSlCounter, BACK);
							});
							box.children('*:gt(0)').css('margin-left', 0);
							fadeSlide(slide);
							updateURL(slideIndex);

						break;
						
						case FORWARD:								
							var cornerWidth = (showWidth - prevSlide.width())/2;
							var delta = -showMarginLeft - (prevPrevSlide.width() - cornerWidth + lastSlide.width());
							var shift = -parseInt(firstSlide.css('margin-left'));
								
							var preMarginShift = -(lastSlide.width() + shift);

							/* Moving the last slide to the head */
							box.prepend(lastSlide.detach());
							box.children().stop(true, true).first().css('margin-left', preMarginShift).animate({
								'margin-left': delta
							}, animTimeMargin, settings.easingMargin, function() { 
								transAnim = false;
								outerSlCounter--;
								if (outerSlCounter > slideIndex) setTimeout(function(){ SlideMarginTo(slideIndex) }, 0);
								settings.slideCompleteCallback(outerSlCounter, FORWARD);
							});
								
							box.children('*:gt(0)').css('margin-left', 0);
							prevSlide.css('opacity', settings.overOpacity);
							fadeSlide(slide);
							updateURL(slideIndex);

						break;
							
						default: return false;
					}
				}
				
				function SlideCssTo(slideIndex) {
					var firstSlide = box.children().first();
					var lastSlide = box.children().last();
					
					var prevPrevSlide = box.children().eq(slide - 2);
					var prevSlide = box.children().eq(slide - 1);
					var currSlide = box.children().eq(slide);
					var nextSlide = box.children().eq(slide + 1);
					var nextNextSlide = box.children().eq(slide + 2);
									
					var direction;
						
					if (outerSlCounter < slideIndex) direction = BACK;
					else if(outerSlCounter > slideIndex) direction = FORWARD;
							
					switch (direction) {
						case BACK:
							var cornerWidth = (showWidth - nextSlide.width())/2;
							var delta = -showMarginLeft - (currSlide.width() - cornerWidth + prevSlide.width());
							var shift = firstSlide.width() - delta;
								
							box.css({
									'-webkit-transition-timing-function': settings.easingCss,
									'-webkit-transition-duration': animTimeCss,
									'-webkit-transform': 'translate3d(-' + shift + 'px, 0px, 0px)',
									'transition-timing-function': settings.easingCss,
									'transition-duration': animTimeCss,
									'transform': 'translate3d(-' + shift + 'px, 0px, 0px)'
								})
								.bind('webkitTransitionEnd transitionEnd', function() {
									box.css({
										'-webkit-transition-duration': '0s',
										'-webkit-transform': 'translate3d(' + delta + 'px, 0px, 0px)',
										'transition-duration': '0s',
										'transform': 'translate3d(' + delta + 'px, 0px, 0px)'
									});
									box.append(firstSlide.detach());
										
									outerSlCounter++;
									innerCycleTimeout = setTimeout(function() { SlideCssTo(slideIndex) }, 0);

									box.unbind('webkitTransitionEnd transitionEnd');
									transAnim = false;
									
									settings.slideCompleteCallback(outerSlCounter, BACK);
								});
								
							fadeSlide(slide + 1);
							updateURL(slideIndex);
						break;
						
						case FORWARD:
							var cornerWidth = (showWidth - prevSlide.width())/2;
							var delta = -showMarginLeft - (prevPrevSlide.width() - cornerWidth + lastSlide.width());
							var shift = lastSlide.width() + delta;

							box.css({
									'-webkit-transition-timing-function': settings.easingCss,
									'-webkit-transition-duration': animTimeCss,
									'-webkit-transform': 'translate3d(' + shift + 'px, 0px, 0px)',
									'transition-timing-function': settings.easingCss,
									'transition-duration': animTimeCss,
									'transform': 'translate3d(' + shift + 'px, 0px, 0px)'
								})
								.bind('webkitTransitionEnd transitionEnd', function() {
									box.css({
										'-webkit-transition-duration': '0s',
										'-webkit-transform': 'translate3d(' + delta + 'px, 0px, 0px)',
										'transition-duration': '0s',
										'transform': 'translate3d(' + delta + 'px, 0px, 0px)'
									});
									box.prepend(lastSlide.detach());
									prevPrevSlide.css('opacity', settings.overOpacity);
									
									outerSlCounter--;
									innerCycleTimeout = setTimeout(function() { SlideCssTo(slideIndex) }, 0);
										
									box.unbind('webkitTransitionEnd transitionEnd');
									transAnim = false;
									
									settings.slideCompleteCallback(outerSlCounter, FORWARD);
								});
							
							fadeSlide(slide - 1);
							updateURL(slideIndex);
						break;
							
						default: return false;
					}
				}

				function fadeSlide(n) {
					if (useCssAnim) {
						box.children().eq(n).css('opacity', 1);
						box.children('*:lt(' + n.toString() + '), *:gt(' + n.toString() + ')').css({
							'opacity': settings.outOpacity,
							'-webkit-transition-duration': (settings.animTime / 1000).toString() + 's'
						});
					}
					else {
						box.children().eq(n).animate({opacity: 1}, {queue: false, duration: settings.animFadeTime});
						box.children('*:lt(' + n.toString() + '), *:gt(' + n.toString() + ')')
							.animate({opacity: settings.outOpacity}, {queue: false, duration: settings.animFadeTime});
					}
				}
				
				function fadeArrow(direction, opacity) {
					if (direction == BACK) var corner = slide + 1; else var corner = slide - 1;
					var cornerSlide = box.children().eq(corner);
						
					if (!useCssAnim) cornerSlide.animate({opacity: opacity}, {queue: false, duration: settings.animHoverTime}); 
				}
					
				function SlideTo(slideIndex) {
					box.unbind('webkitTransitionEnd transitionEnd');
					
					animTimeMargin = parseInt(settings.animTime/Math.abs(outerSlCounter - slideIndex));
					animTimeCss = animTimeMargin/1000 + 's';
					
					if (useCssAnim) SlideCssTo(slideIndex); else SlideMarginTo(slideIndex);
					
					return false;
				}
					
				function updateURL(n) {
					if (settings.updateURL) {
						n++;
						var N = box.children().length;
						var url = window.location.toString();
						url = url.substring(0, url.indexOf('#'));
						if (n <= 0) n += N; else if (n > N) n -= N;
						window.location.replace(url + '#' + n.toString());
					}
				}

				$(settings.arrowLeftSelector)
						.bind('click dblclick', function() { 
							settings.prevNextClickCallback(outerSlCounter, FORWARD);
							return SlideTo(outerSlCounter - 1); 
						})
						.hover(function() { fadeArrow(FORWARD, settings.overOpacity); }, 
								function() { fadeArrow(FORWARD, settings.outOpacity); });
								
				$(settings.arrowRightSelector)
						.bind('click dblclick', function() {
							settings.prevNextClickCallback(outerSlCounter, BACK);
							return SlideTo(outerSlCounter + 1); 
						})
						.hover(function() { fadeArrow(BACK, settings.overOpacity); }, 
								function() { fadeArrow(BACK, settings.outOpacity); });
				
				
				if (settings.listenEvent) {
					$(document).bind('twilight', function(transEvent) {
						if (settings.showId == transEvent.showId || settings.showId == '') {
							var N = transEvent.index;
							
							if (N < 0) N = 0;
							else if	(N >= box.children().length) N = box.children().length - 1;
								
							SlideTo(N);
						}
					}, false);
				}
			});
		}
	});
})(jQuery);