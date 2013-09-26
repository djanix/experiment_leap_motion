define([
	'mootools',
	'class.mutators',
	'src/views/View',
	'vendor/bxslider-4/jquery.bxslider.min',
	'vendor/LeapCameraControls',
	'vendor/threejs/examples/js/loaders/BinaryLoader'
], function () {
	var className = 'ViewHome';

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
		canvasHeight: 400,
		canvasWidth: 400,
		controller: null,

		//-- Init
		//--------------------------------------------------------------
		init: function () {
			var self = this;
			self.parent();

			self.controller = new Leap.Controller({
				enableGestures: true
			});

			self.trackFingers();
			self.swipe();
			self.hueChange();
			self.object3d();
		},

		//-- Functions
		//--------------------------------------------------------------
		bindEvents: function () {
			var self = this;
			self.parent();
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

		swipe: function() {
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

		object3d: function() {
			var self = this;
			var camaroMatIndex = 0;
			var WIDTH = 900,
				HEIGHT = 600;

			var VIEW_ANGLE = 45,
				ASPECT = WIDTH / HEIGHT,
				NEAR = 0.1,
				FAR = 10000;

			if (!Detector.webgl) Detector.addGetWebGLMessage();

			var $container = self.el.find('#object3d');

			var renderer = new THREE.WebGLRenderer();
			var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
			var scene = new THREE.Scene();
			var material = new THREE.MeshFaceMaterial();

			var cameraControls = new THREE.LeapCameraControls(camera);
//			cameraControls.rotateSpeed    = 3;
			cameraControls.zoomSpeed      = 25;
			cameraControls.zoomMin        = 50;
			cameraControls.zoomMax        = 3500;
			cameraControls.panSpeed       = 10;

			scene.add(camera);
			camera.position.z = 1900;
			renderer.setSize(WIDTH, HEIGHT);
			renderer.setFaceCulling(THREE.CullFaceNone);
			$container.append(renderer.domElement);

			var r = "./assets/js/vendor/threejs/examples/textures/cube/SwedishRoyalCastle/";
			var urls = [ r + "px.jpg", r + "nx.jpg", r + "py.jpg", r + "ny.jpg", r + "pz.jpg", r + "nz.jpg" ];
			var textureCube = THREE.ImageUtils.loadTextureCube(urls);
			var camaroMaterials = {
				body: [
					new THREE.MeshLambertMaterial({
						color: 0xff6600,
						envMap: textureCube,
						combine: THREE.MixOperation,
						reflectivity: 0.3
					}),

					new THREE.MeshLambertMaterial({
						color: 0x4acff0,
						envMap: textureCube,
						combine: THREE.MixOperation,
						reflectivity: 0.3
					}),

					new THREE.MeshLambertMaterial({
						color: 0xffffff,
						envMap: textureCube,
						combine: THREE.MixOperation,
						reflectivity: 0.3
					}),

					new THREE.MeshLambertMaterial({
						color: 0x660000,
						envMap: textureCube,
						combine: THREE.MixOperation,
						reflectivity: 0.3
					}),

					new THREE.MeshLambertMaterial({
						color: 0x24d212,
						envMap: textureCube,
						combine: THREE.MixOperation,
						reflectivity: 0.3
					})
				],

				chrome: new THREE.MeshLambertMaterial({
					color: 0xffffff,
					envMap: textureCube
				}),

				darkchrome: new THREE.MeshLambertMaterial({
					color: 0x444444,
					envMap: textureCube
				}),

				glass: new THREE.MeshBasicMaterial({
					color: 0x424242,
					envMap: textureCube,
					opacity: 0.25,
					combine: THREE.MixOperation,
					reflectivity: 0.25,
					transparent: true
				}),

				tire: new THREE.MeshLambertMaterial({
					color: 0x050505
				}),

				interior: new THREE.MeshPhongMaterial({
					color: 0x050505,
					shininess: 20
				}),

				black: new THREE.MeshLambertMaterial({
					color: 0x000000
				})

			};

			var loader = new THREE.BinaryLoader();
			loader.load("./assets/js/vendor/threejs/examples/obj/camaro/CamaroNoUv_bin.js", function (geometry) {
				var s = 75;

				material.materials[0] = camaroMaterials.body[camaroMatIndex]; // car body
				material.materials[1] = camaroMaterials.chrome; // wheels chrome
				material.materials[2] = camaroMaterials.chrome; // grille chrome
				material.materials[3] = camaroMaterials.darkchrome; // door lines
				material.materials[4] = camaroMaterials.glass; // windshield
				material.materials[5] = camaroMaterials.interior; // interior
				material.materials[6] = camaroMaterials.tire; // tire
				material.materials[7] = camaroMaterials.black; // tireling
				material.materials[8] = camaroMaterials.black; // behind grille

				var mesh = new THREE.Mesh(geometry, material);
				mesh.rotation.y = 1;
				mesh.scale.set(s, s, s);
				scene.add(mesh);
			});

			// lights
			var ambient = new THREE.AmbientLight(0x020202);
			scene.add(ambient);

			var directionalLight = new THREE.DirectionalLight(0xffffff);
			directionalLight.position.set(1, 1, 0.5).normalize();
			scene.add(directionalLight);

			var pointLight = new THREE.PointLight(0xffffff);
			pointLight.position.set(0, 0, 0);
			scene.add(pointLight);

			self.controller.loop(function(obj) {
				cameraControls.update(obj);
				pointLight.position = camera.position;

				$.each(obj.gestures, function (index, value) {
					var currentGesture = $(this)[0];

					if (currentGesture.type == 'swipe' && currentGesture.state == 'stop') {
						var strengthX = Math.abs(currentGesture.direction[0]);
						var strengthY = Math.abs(currentGesture.direction[1]);

						if (strengthX > strengthY) {
							if (currentGesture.direction[0] < 0) {
								camaroMatIndex--;
							} else if (currentGesture.direction[0] > 0) {
								camaroMatIndex++;
							}

							if (camaroMatIndex > camaroMaterials.body.length - 1) {
								camaroMatIndex = 0;
							} else if (camaroMatIndex < 0) {
								camaroMatIndex = camaroMaterials.body.length - 1;
							}

							material.materials[0] = camaroMaterials.body[camaroMatIndex];
						}
					}
				});

				renderer.render(scene, camera);
			});
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