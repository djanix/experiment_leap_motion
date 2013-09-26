var App;

(function () {
	requirejs.config({
		paths: {
			'jquery': [
				'./vendor/jquery/jquery.min'
			],
			'mootools': './vendor/mootools-core-1.4.5',
			'class.mutators': './vendor/Class.Mutators.jQuery',
			'threejs': './vendor/threejs/build/three.min',
			'leapMotion': './vendor/leapjs/leap.min'
		},
		shim: {
			'src/App': {
				deps: [
					'jquery'
				]
			},
			'class.mutators': {
				deps: [
					'mootools'
				],
				exports: 'classmutators'
			},
			'threejs': {
				deps: [
					'./assets/js/vendor/Detector.js'
				]
			}
		},
		waitSeconds: 15
	});

	requirejs([
		'jquery',
		'./src/App'
	], function () {
		$(function () {
			App = new $.App($('#site'));
		});
	});

})();