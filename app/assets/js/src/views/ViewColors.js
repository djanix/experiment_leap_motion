define([
	'mootools',
	'class.mutators',
	'src/views/View',
], function () {
	var className = 'ViewColors';

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
			self.hueChange();
		},

		//-- Functions
		//--------------------------------------------------------------
		bindEvents: function () {
			var self = this;
			self.parent();
		},

		hueChange: function() {
			var self = this;

			self.controller.loop(function(obj) {
				if (obj.hands.length < 1) return;

				var hand = obj.hands[0];

				var x = hand.palmPosition[0];
				var y = hand.palmPosition[1];

				var hue = Math.round(x/2) % 360;
				var saturation = Math.round(y/3);

				self.el.find('.hueChange').css('-webkit-filter', 'hue-rotate(' + hue + 'deg) saturate(' + saturation + '%)');
			});
		},

		empty: null
	});

	return $[className];
});