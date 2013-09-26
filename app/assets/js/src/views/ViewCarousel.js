define([
	'mootools',
	'class.mutators',
	'src/views/View',
	'vendor/bxslider-4/jquery.bxslider.min',
	'vendor/LeapCameraControls'
], function () {
	var className = 'ViewCarousel';

	$[className] = new Class({
		jQuery: className,
		Extends: $.View,
		options: {},

		//-- init
		//---------------------------------------------
		initialize: function (el, options) {
			el = $(el);
			var self = this;

			self.parent(el, options);
		},

		//-- Vars
		//--------------------------------------------------------------

		//-- Init
		//--------------------------------------------------------------
		init: function () {
			var self = this;
			self.parent();

			self.carousel();
		},

		//-- Functions
		//--------------------------------------------------------------
		bindEvents: function () {
			var self = this;
			self.parent();
		},

		carousel: function() {
			var self = this;
			var slider = self.el.find('.bxslider').bxSlider();

			self.controller.loop(function(obj) {
				if (obj.gestures.length === 0) { return; }

				$.each(obj.gestures, function (index, value) {
					var currentGesture = $(this)[0];

					if (currentGesture.type == 'circle' && currentGesture.state == 'stop') {
						slider.startAuto();
						return;
					}

					if (currentGesture.type != 'swipe' || currentGesture.state != 'stop') { return; }

					var strengthX = Math.abs(currentGesture.direction[0]);
					var strengthY = Math.abs(currentGesture.direction[1]);

					slider.stopAuto();

					if (strengthX < strengthY) {
						if (currentGesture.direction[0] < 0) {
							slider.goToSlide(slider.getSlideCount() - 1);
						} else if (currentGesture.direction[0] > 0) {
							slider.goToSlide(0);
						}
					} else {
						if (currentGesture.direction[0] < 0) {
							slider.goToPrevSlide();
						} else if (currentGesture.direction[0] > 0) {
							slider.goToNextSlide();
						}
					}
				});
			});
		},

		empty: null
	});

	return $[className];
});