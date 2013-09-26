define([
	'mootools',
	'class.mutators',
	'src/views/View',
	'vendor/LeapCameraControls',
	'vendor/threejs/examples/js/loaders/BinaryLoader'
], function () {
	var className = 'ViewThreejs';

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
		camaroMatIndex: 0,

		height: 500,
		width: 700,

		view_angle: 45,
		near: 0.1,
		far: 10000,

		//-- Init
		//--------------------------------------------------------------
		init: function () {
			var self = this;
			self.parent();
			self.object3d();
		},

		//-- Functions
		//--------------------------------------------------------------
		bindEvents: function () {
			var self = this;
			self.parent();
		},

		object3d: function() {
			var self = this;

			if (!Detector.webgl) Detector.addGetWebGLMessage();

			var scene = new THREE.Scene();
			var material = new THREE.MeshFaceMaterial();
			var textures = self.textures();
			var lights = self.lights(scene);
			var renderer = self.renderer();

			// camera
			var aspect = self.width / self.height;
			var camera = new THREE.PerspectiveCamera(self.view_angle, aspect, self.near, self.far);
			var cameraControls = new THREE.LeapCameraControls(camera);
			cameraControls.rotateSpeed = 2;
			cameraControls.zoomSpeed = 25;
			cameraControls.zoomMin = 50;
			cameraControls.zoomMax = 3500;
			cameraControls.panSpeed = 10;
			scene.add(camera);
			camera.position.z = 1900;

			//load 3d object
			var loader = new THREE.BinaryLoader();
			loader.load("./assets/js/vendor/threejs/examples/obj/camaro/CamaroNoUv_bin.js", function (geometry) {
				material.materials[0] = textures.body[self.camaroMatIndex]; // car body
				material.materials[1] = textures.chrome; // wheels chrome
				material.materials[2] = textures.chrome; // grille chrome
				material.materials[3] = textures.darkchrome; // door lines
				material.materials[4] = textures.glass; // windshield
				material.materials[5] = textures.interior; // interior
				material.materials[6] = textures.tire; // tire
				material.materials[7] = textures.black; // tireling
				material.materials[8] = textures.black; // behind grille

				var mesh = new THREE.Mesh(geometry, material);
				mesh.rotation.y = 1;
				mesh.scale.set(75, 75, 75);
				scene.add(mesh);
			});

			self.controller.loop(function(obj) {
				cameraControls.update(obj);
				lights.pointLight.position = camera.position;

				$.each(obj.gestures, function (index, value) {
					var currentGesture = $(this)[0];

					if (currentGesture.type == 'swipe' && currentGesture.state == 'stop') {
						var strengthX = Math.abs(currentGesture.direction[0]);
						var strengthY = Math.abs(currentGesture.direction[1]);

						if (strengthX > strengthY) {
							if (currentGesture.direction[0] < 0) {
								self.camaroMatIndex--;
							} else if (currentGesture.direction[0] > 0) {
								self.camaroMatIndex++;
							}

							if (self.camaroMatIndex > textures.body.length - 1) {
								self.camaroMatIndex = 0;
							} else if (self.camaroMatIndex < 0) {
								self.camaroMatIndex = textures.body.length - 1;
							}

							material.materials[0] = textures.body[self.camaroMatIndex];
						}
					}
				});

				renderer.render(scene, camera);
			});
		},

		renderer: function() {
			var self = this;
			var container = self.el.find('#object3d');
			var renderer = new THREE.WebGLRenderer();

			renderer.setSize(self.width, self.height);
			renderer.setFaceCulling(THREE.CullFaceNone);
			container.append(renderer.domElement);

			return renderer;
		},

		lights: function(scene) {
			var lights = {};

			lights.ambient = new THREE.AmbientLight(0x020202);
			scene.add(lights.ambient);

			lights.directionalLight = new THREE.DirectionalLight(0xffffff);
			lights.directionalLight.position.set(1, 1, 0.5).normalize();
			scene.add(lights.directionalLight);

			lights.pointLight = new THREE.PointLight(0xffffff);
			lights.pointLight.position.set(0, 0, 0);
			scene.add(lights.pointLight);

			return lights;
		},

		textures: function() {
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

			return camaroMaterials;
		},

		empty: null
	});

	return $[className];
});