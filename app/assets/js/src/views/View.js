define([
	'mootools',
	'class.mutators',
	'vendor/leapjs/leap.min'
], function () {
	var className = 'View';

	$[className] = new Class({
		jQuery: className,
		Implements: [Options, Events],
		options: {},

		initialize: function (el, options) {
			var self = this;

			self.el = $(el);

			self.setOptions(options);
			self.init();
		},

		//-- Vars
		//--------------------------------------------------------------
		canvasHeight: 400,
		canvasWidth: 400,
		controller: null,

		//-- Init
		//--------------------------------------------------------------
		init: function () {
			var self = this;
			self.bindEvents();

			self.controller = new Leap.Controller({
				enableGestures: true
			});

			self.trackFingers();
		},

		//-- Hooks
		//--------------------------------------------------------------

    
		//-- Functions
		//--------------------------------------------------------------
		bindEvents: function () {
			var self = this;
		},

		trackFingers: function () {
			var self = this;
			var canvas = self.el.find(".trackFingers")[0];
			var ctx = canvas.getContext("2d");

			canvas.height = self.canvasHeight;
			canvas.width = self.canvasWidth;

			ctx.translate(canvas.width/2,canvas.height);
			ctx.fillStyle = "rgba(255,255,255,0.7)";

			self.controller.loop(function(obj) {
				ctx.clearRect(-canvas.width/2,-canvas.height,canvas.width,canvas.height);

				// render circles based on pointable positions
				var pointablesMap = obj.pointablesMap;
				for (var i in pointablesMap) {
					// get the pointable's position
					var pointable = pointablesMap[i];
					var pos = pointable.tipPosition;

					// create a circle for each pointable
					var radius = Math.min(600/Math.abs(pos[2]),20);
					ctx.beginPath();
					ctx.arc(pos[0]-radius/2,-pos[1]-radius/2,radius,0,2*Math.PI);
					ctx.fill();
				}
			});
		},

		empty: null
	});

	return $[className];
});