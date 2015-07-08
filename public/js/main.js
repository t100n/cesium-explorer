			$('#options').click(function(e) {
				$('#controls-modal').show();
				$(this).blur();
				
				$('#options').addClass('active');
			});
			
			$('.explorer-modal-content').click(function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
			
			$('.explorer-modal-dialog').click(function(e) {
				$('#controls-modal').hide();
				$(this).blur();
				
				$('#options').removeClass('active');
			});
			
			$('[data-dismiss=modal]').click(function(e) {
				$('#controls-modal').hide();
				$(this).blur();
				
				$('#options').removeClass('active');
			});
			
			$('#camera').click(function(e) {
				cesiumExplorer.physics.changeViewPoint();
				$(this).blur();
			});
			
			$('#left').on('mousedown', function(e) {
				cesiumExplorer.physics.keyState[37] = true;
				$(this).blur();
			});
			$('#left').on('mouseup', function(e) {
				cesiumExplorer.physics.keyState[37] = false;
				$(this).blur();
			});
			
			$('#right').on('mousedown', function(e) {
				cesiumExplorer.physics.keyState[39] = true;
				$(this).blur();
			});
			$('#right').on('mouseup', function(e) {
				cesiumExplorer.physics.keyState[39] = false;
				$(this).blur();
			});
			
			$('#up').on('mousedown', function(e) {
				cesiumExplorer.physics.keyState[38] = true;
				$(this).blur();
			});
			$('#up').on('mouseup', function(e) {
				cesiumExplorer.physics.keyState[38] = false;
				$(this).blur();
			});
			
			$('#down').on('mousedown', function(e) {
				cesiumExplorer.physics.keyState[40] = true;
				$(this).blur();
			});
			$('#down').on('mouseup', function(e) {
				cesiumExplorer.physics.keyState[40] = false;
				$(this).blur();
			});
			
			$('#restart').click(function(e) {
				e.preventDefault();
				
				cesiumExplorer.goto(window.defaultLat, window.defaultLon, window.defaultAlt, window.defaultSpeed, window.defaultHeading);
				
				cesiumExplorer.physics.lastIndex = false;
				$('#progress').css('width', '0%');
				$('#progress_glider').css('left', '0%');
				
				$('#placemarks .poi img').attr('src', window.SITE_URL+"/img/placemark_outline.png");
			});
			
			$('#accel-multiplier').on('change', function(e) {
				window.speedMultiplier = $(this).val();
				$(this).blur();
			});
			
			var format = (new Audio().canPlayType('audio/ogg') !== '' ? 'ogg' : 'mp3');
			
			window.POIS = [
				{ id: 'centro', lat: -22.906948, lon: -43.182830, alt: 400, heading: 0, label: 'Centro' },
				{ id: 'copacabana', lat: -22.972560, lon: -43.184092, alt: 400, heading: 0, label: 'Copacabana' },
				{ id: 'maracana', lat: -22.912134, lon: -43.230128, alt: 400, heading: 0, label: 'Maracanã' },
				{ id: 'deodoro', lat: -22.856096, lon: -43.385161, alt: 400, heading: 0, label: 'Deodoro' },
				{ id: 'barra-da-tijuca', lat: -23.000138, lon: -43.366109, alt: 400, heading: 0, label: 'Barra da Tijuca' }
			];
			
			window.POISPOLYLINE = [
				{ id: 'start', lat: -22.899599, lon: -43.183192, alt: 400, heading: 0, label: '' },
				{ id: 'centro', lat: -22.906948, lon: -43.182830, alt: 400, heading: 0, label: 'Centro' },
				{ id: 'centro_copacabana', lat: -22.952560, lon: -43.183092, alt: 500, heading: 0, label: '' },
				{ id: 'copacabana', lat: -22.972560, lon: -43.184092, alt: 450, heading: 0, label: 'Copacabana' },
				{ id: 'copacabana_maracana_1', lat: -22.977084, lon: -43.194288, alt: 550, heading: 0, label: '' },
				{ id: 'copacabana_maracana_2', lat: -22.971717, lon: -43.210723, alt: 600, heading: 0, label: '' },
				{ id: 'copacabana_maracana_3', lat: -22.957938, lon: -43.219971, alt: 700, heading: 0, label: '' },
				{ id: 'copacabana_maracana_4', lat: -22.943529, lon: -43.220543, alt: 800, heading: 0, label: '' },
				{ id: 'maracana', lat: -22.912134, lon: -43.230128, alt: 450, heading: 0, label: 'Maracanã' },
				{ id: 'maracana_deodoro_1', lat: -22.877181, lon: -43.293723, alt: 400, heading: 0, label: '' },
				{ id: 'maracana_deodoro_2', lat: -22.850427, lon: -43.336085, alt: 450, heading: 0, label: '' },
				{ id: 'maracana_deodoro_3', lat: -22.851215, lon: -43.370183, alt: 400, heading: 0, label: '' },
				{ id: 'deodoro', lat: -22.856096, lon: -43.385161, alt: 100, heading: 0, label: 'Deodoro' },
				{ id: 'deodoro-barra-da-tijuca_1', lat: -22.869822, lon: -43.396160, alt: 400, heading: 0, label: '' },
				{ id: 'deodoro-barra-da-tijuca_2', lat: -22.888635, lon: -43.375008, alt: 450, heading: 0, label: '' },
				{ id: 'deodoro-barra-da-tijuca_3', lat: -22.921269, lon: -43.363363, alt: 550, heading: 0, label: '' },
				{ id: 'deodoro-barra-da-tijuca_4', lat: -22.953611, lon: -43.368828, alt: 450, heading: 0, label: '' },
				{ id: 'barra-da-tijuca', lat: -23.000138, lon: -43.366109, alt: 400, heading: 0, label: 'Barra da Tijuca', last: true },
				{ id: 'barra-da-tijuca_1', lat: -23.007742, lon: -43.366201, alt: 400, heading: 0, label: '' },
				{ id: 'barra-da-tijuca_2', lat: -23.011035, lon: -43.363473, alt: 400, heading: 0, label: '' },
				{ id: 'barra-da-tijuca_3', lat: -23.010944, lon: -43.358813, alt: 0, heading: 0, label: '' }
			];
			
			window.SITE_URL = 'http://andresantos.cloudapp.net';
			//window.SITE_URL = 'http://localhost:3000';
			
			window.userId = "ojogador";
			window.isExploring = true;
			window.masterVolume = 1;
			window.globalVolume = 1;
			window.lastGlobalVolume = 1;
			window.minVolume = 20;
			window.defaultMinVolume = 20;
			window.maxVolume = 80;
			window.defaultMaxVolume = 80;
			
			window.audioMonkey = new AudioMonkey();
			
			window.audioMonkey.init();
			
			window.speedMultiplier = $('#accel-multiplier').val();
			
			// Physics initial data
			window.unit = 'Km';
			window.defaultLat = window.lat = -22.899599; //-22.888286010415;
			window.defaultLon = window.lon = -43.183192; //-43.17069974208982;
			window.defaultAlt = window.alt = 300;
			window.defaultSpeed = window.speed = 100;
			window.defaultHeading = window.heading = 180;
			window.defaultTilt = window.tilt = -0.0014993722426054328;
			window.defaultRoll = window.roll = 0;
			
			window.pacejkaWheelLoad = .1;
			window.pacejkaSlipAngle = 1.4;
			window.pacejkaSlipRatio = 4e3;
			window.pacejkaCamber = 0;
			
			window.rollFactor = 1.5;
			window.tiltFactor = 4;
			window.gravity = 9.81;
			
			// Controls the suspension
			window.tiltDamper = 5000;
			window.rollDamper = 5000;
			window.tiltSpring = 80000;
			window.rollSpring = 80000;
			window.tiltMass = 500;
			window.rollMass = 500;
			
			// Controls turning
			window.maxAngleDegree = 1000;
			window.rudderAngleScale = 15;
			
			window.massI = 3500;
			window.mass = 1500;
			
			// Controls the skidding of the vehicle
			window.slipFactor = 57.29577951308232;
			window.bumpDragForceFactor = 1000;
			
			// Controls forward speed
			//accelerationForceFactor = 2000;
			
			// Controls brake speed
			//brakeForceFactor = 5000;
			
			// Controls air resistence - less equals faster vehicle
			window.airDragForceFactor = .4; //.04861111111111111;
			
			window.tiltForceFactor = 9.81;
			
			// Controls resistence to turning the wheels
			//window.loadYFactor = .025;
			window.loadYFactor = .0001;
			window.loadXFactor = .015;
			
			window.full = {
				R: 6371000
			};
			
			var v = window.myVehicle;
			
			window.world = new box2D.dynamics.B2World(new box2D.common.math.B2Vec2(0, 0), true); // no gravity
			cesiumExplorer.main(window.myVehicle);
			
			window.defaultMinVolume = window.minVolume = v.minVolume ? v.minVolume : 0;
			window.defaultMaxVolume = window.maxVolume = v.maxVolume ? v.maxVolume : 80;
			
			try {
				
				window.audioMonkey.add("up", { ogg: '/sounds/wind_up.ogg', mp3: '/sounds/wind_up.mp3' });
				window.audioMonkey.add("down", { ogg: '/sounds/wind_down.ogg', mp3: '/sounds/wind_down.mp3' });
				window.audioMonkey.add("altitude", { ogg: '/sounds/altitude_warning.ogg', mp3: '/sounds/altitude_warning.mp3' });
				window.audioMonkey.add("barra-da-tijuca", { ogg: '/sounds/barra_da_tijuca.ogg', mp3: '/sounds/barra_da_tijuca.mp3' });
				window.audioMonkey.add("centro", { ogg: '/sounds/centro.ogg', mp3: '/sounds/centro.mp3' });
				window.audioMonkey.add("copacabana", { ogg: '/sounds/copacabana.ogg', mp3: '/sounds/copacabana.mp3' });
				window.audioMonkey.add("deodoro", { ogg: '/sounds/deodoro.ogg', mp3: '/sounds/deodoro.mp3' });
				window.audioMonkey.add("maracana", { ogg: '/sounds/maracana.ogg', mp3: '/sounds/maracana.mp3' });
				window.audioMonkey.add("forward", { ogg: v.sound.ogg.url, mp3: v.sound.mp3.url });
				window.audioMonkey.add("slip", { ogg: v.slip.ogg.url, mp3: v.slip.mp3.url });
				window.audioMonkey.add("vehicleCrash", { ogg: v.crashSound.ogg.url, mp3: v.crashSound.mp3.url });
				
			} catch(err) {}
			
			cesiumExplorer.goto(window.defaultLat, window.defaultLon, window.defaultAlt, window.defaultSpeed, window.defaultHeading);
