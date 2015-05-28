<!DOCTYPE html>
<html lang="pt_BR">
	<head>
		<title>Cesium Explorer!</title>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<meta charset="UTF-8">
			
			<link type="text/css" rel="stylesheet" href="/css/font-awesome.min.css">
			<link type="text/css" rel="stylesheet" href="/css/main.css" />
			<link type="text/css" rel="stylesheet" href="/js/Cesium/Widgets/widgets.css" />
	</head>
	<body>
		<div id="explorer-container">
			<div id="map3d-container">
				<div id="map3d"></div>
				
				<div id="paused" style="display: none;">
		            <div class="paused-content">
		                <h2>Pausado</h2>
		            </div>
		        </div>
				
				<a id="restart" href="#"><i class="fa fa-repeat"></i></a>
			</div>
			
			<div id="path">
				<div id="placemarks"></div>
				
				<div id="progress_glider">
					<img src="/img/handglider.png"/>
				</div>
				
				<div id="progress"></div>
				<div id="position"></div>
			</div>
			
			<div id="minimap">
			</div>
			
			<div id="controls">
				<div class="row">
					<div class="accel-container">
						<p>Aceleração</p>
						<span>min </span><input id="accel-multiplier" type="range" name="points" min="1" max="5" value="1"><span> máx</span>
					</div>
				</div>
				
				<div class="row">
					<button id="up">Cima</button>
				</div>
				<div class="row">
					<button id="left">Esquerda</button>
					<button id="options">Opções</button>
					<button id="right">Direita</button>
				</div>
				<div class="row">
					<button id="down">Baixo</button>
				</div>
			</div>
			
			<div id="controls-modal" class="explorer-modal explorer-fade explorer-in" aria-hidden="false" style="display: none;">
			    <div class="explorer-modal-dialog">
			        <div class="explorer-modal-content">
			            <div class="explorer-modal-header">
			                <button class="explorer-close" type="button" data-dismiss="modal" aria-hidden="true">x</button>
			                <h4 class="explorer-modal-title">Opções</h4>
			            </div>
			            <div class="explorer-modal-body clearfix">
			                <div class="explorer-tab-content">
			                    <div id="explorer-keyboard" class="explorer-tab-pane explorer-active">
			                        <div class="explorer-dl-horizontal">
			                            <div>
			                                <h4>Movimento</h4>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key"><i class="fa fa-chevron-up"></i></b></div>
			                                <div>Subir</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key"><i class="fa fa-chevron-down"></i></b></div>
			                                <div>Descer</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key"><i class="fa fa-chevron-left"></i></b></div>
			                                <div>Virar à esquerda</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key"><i class="fa fa-chevron-right"></i></b></div>
			                                <div>Virar à direita</div>
			                            </div>
										
			                            <div>
			                                <h4>Outros</h4>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">v</b></div>
			                                <div>Piloto Automático</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">o</b></div>
			                                <div>Instrumentos de orientação</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">p</b></div>
			                                <div>Pausa</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">u</b></div>
			                                <div>FPS</div>
			                            </div>
			                        </div>
									
			                        <div class="explorer-dl-horizontal">
			                            <div>
			                                <h4>Câmera</h4>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">a</b></div>
			                                <div>Olhar para a esquerda</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">d</b></div>
			                                <div>Olhar para a direita</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">q</b></div>
			                                <div>Olhar para a frente</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">e</b></div>
			                                <div>Olhar para trás</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">c</b></div>
			                                <div>Mudar a Câmera</div>
			                            </div>
										
			                        </div>
			                    </div>
			                </div>
			            </div>
			
			            <div class="explorer-modal-footer">
			                <button class="explorer-btn explorer-btn-default" type="button" data-dismiss="modal">Close</button>
			            </div>
			        </div>
			    </div>
			</div>

		</div>
		
		<script type="text/javascript" src="/js/jquery.min.js"></script>
		<script type="text/javascript" src="/js/mousetrap.min.js"></script>
		<script type="text/javascript" src="/js/EventEmitter.min.js"></script>
		<script type="text/javascript" src="/js/attitude_indicator.min.js"></script>
		<script type="text/javascript" src="/js/variables.js"></script>
		<script type="text/javascript" src="/js/latlon_v1.min.js"></script>
		<script type="text/javascript" src="/js/gamepad.js"></script>
		<script type="text/javascript" src="/js/audioMonkey.js"></script>
		<script type="text/javascript" src="/js/box2d.min.js"></script>
		<script type="text/javascript" src="/js/math3d.min.js"></script>
		<script type="text/javascript" src="/js/vehicle.js"></script>
		<script type="text/javascript" src="/js/physics.js"></script>
		<script type="text/javascript" src="/js/Cesium/Cesium.js"></script>
		<script>
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
				$('#placemarks .poi img').attr('src', window.SITE_URL+"/img/placemark_outline.png");
			});
			
			$('#accel-multiplier').on('change', function(e) {
				window.speedMultiplier = $(this).val();
				$(this).blur();
			});
			
			var format = (new Audio().canPlayType('audio/ogg') !== '' ? 'ogg' : 'mp3');
			
			window.POIS = [
				{ id: 'centro', lat: -22.906948, lon: -43.182830, alt: 55, heading: 0, label: 'Centro' },
				{ id: 'copacabana', lat: -22.972560, lon: -43.184092, alt: 55, heading: 0, label: 'Copacabana' },
				{ id: 'maracana', lat: -22.912134, lon: -43.230128, alt: 55, heading: 0, label: 'Maracanã' },
				{ id: 'deodoro', lat: -22.856096, lon: -43.385161, alt: 55, heading: 0, label: 'Deodoro' },
				{ id: 'barra-da-tijuca', lat: -23.000138, lon: -43.366109, alt: 55, heading: 0, label: 'Barra da Tijuca' }
			];
			
			window.POISPOLYLINE = [
				{ id: 'start', lat: -22.899599, lon: -43.183192, alt: 150, heading: 0, label: '' },
				{ id: 'centro', lat: -22.906948, lon: -43.182830, alt: 200, heading: 0, label: 'Centro' },
				{ id: 'centro_copacabana', lat: -22.952560, lon: -43.183092, alt: 300, heading: 0, label: '' },
				{ id: 'copacabana', lat: -22.972560, lon: -43.184092, alt: 250, heading: 0, label: 'Copacabana' },
				{ id: 'copacabana_maracana_1', lat: -22.977084, lon: -43.194288, alt: 350, heading: 0, label: '' },
				{ id: 'copacabana_maracana_2', lat: -22.971717, lon: -43.210723, alt: 500, heading: 0, label: '' },
				{ id: 'copacabana_maracana_3', lat: -22.957938, lon: -43.219971, alt: 700, heading: 0, label: '' },
				{ id: 'copacabana_maracana_4', lat: -22.943529, lon: -43.220543, alt: 800, heading: 0, label: '' },
				{ id: 'maracana', lat: -22.912134, lon: -43.230128, alt: 150, heading: 0, label: 'Maracanã' },
				{ id: 'maracana_deodoro_1', lat: -22.877181, lon: -43.293723, alt: 300, heading: 0, label: '' },
				{ id: 'maracana_deodoro_2', lat: -22.850427, lon: -43.336085, alt: 200, heading: 0, label: '' },
				{ id: 'maracana_deodoro_3', lat: -22.851215, lon: -43.370183, alt: 150, heading: 0, label: '' },
				{ id: 'deodoro', lat: -22.856096, lon: -43.385161, alt: 100, heading: 0, label: 'Deodoro' },
				{ id: 'deodoro-barra-da-tijuca_1', lat: -22.869822, lon: -43.396160, alt: 250, heading: 0, label: '' },
				{ id: 'deodoro-barra-da-tijuca_2', lat: -22.888635, lon: -43.375008, alt: 350, heading: 0, label: '' },
				{ id: 'deodoro-barra-da-tijuca_3', lat: -22.921269, lon: -43.363363, alt: 450, heading: 0, label: '' },
				{ id: 'deodoro-barra-da-tijuca_4', lat: -22.953611, lon: -43.368828, alt: 150, heading: 0, label: '' },
				{ id: 'barra-da-tijuca', lat: -23.000138, lon: -43.366109, alt: 50, heading: 0, label: 'Barra da Tijuca' },
				{ id: 'barra-da-tijuca_1', lat: -23.007742, lon: -43.366201, alt: 50, heading: 0, label: '' },
				{ id: 'barra-da-tijuca_2', lat: -23.011035, lon: -43.363473, alt: 50, heading: 0, label: '' },
				{ id: 'barra-da-tijuca_3', lat: -23.010944, lon: -43.358813, alt: 0, heading: 0, label: '' }
			];
			
			//window.SITE_URL = 'http://andresantos.cloudapp.net';
			window.SITE_URL = 'http://localhost:3000';
			
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
			window.defaultAlt = window.alt = 150; //400;
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
			
			window.physics = {
				absSpeed: 0,
				
				clamp: function (value, min, max) {
					if (min > max) {
						var temp = min;
						min = max;
						max = temp
					}
					if (value < min) return min;
					if (value > max) return max;
					return value
				},
				
				teleport: function(id, lat, lng, alt, speed, head, event, callback) {
					if(lat && lng) {
						cesiumExplorer.goto(lat, lng, alt, speed, head ? head : 0);
					}//if
					
					if(typeof callback == "function") callback();
				},
				
				getVehicleHeading: function() {
					return cesiumExplorer.physics.getVehicleHeading();
				},
				
				getVehicleTilt: function() {
					return cesiumExplorer.physics.vehicleTilt.position;
				},
				
				getVehicleRoll: function() {
					return cesiumExplorer.physics.vehicleRoll.position;
				}
			};
			
			window.full = {
				R: 6371000,
				queue: [],
				init: function() {
					var that = this;
					
					// Listen for physics updates
					cesiumExplorer.physics.ee.addListener('postUpdate', function() {
						if(cesiumExplorer.physics && !cesiumExplorer.physics.isSpawning) {
							// There is work to be done
							if(that.queue.length > 0) {
								// Get the first element in the queue
								for(var i= 0, n=Math.min(that.queue.length, 10);i<n;i++) {
									var el = that.queue.splice(0, 1)[0];
									
									el.callback.apply(null, el.params);
								}//for
							}//if
						}//if
					});
				},
				swapVehicle: function(id, vehicleId, gender, process) {
					if(!cesiumExplorer.physics || cesiumExplorer.physics.isSpawning || !process) {
                        this.queue.push({
                            "callback": function(a,b,c,d) {
                                window.full.swapVehicle(a, b, c, d);
                            },
                            "params": [id, vehicleId, gender, true]
                        });

                        return;
                    }//if

                    var v = false;

                    if(typeof vehicleId == "string")
                        v = window.vehicles[vehicleId];
                    else
                        v = vehicleId;

                    if(!v) v = window.userDefaultVehicle;

                    window.myVehicle = v;

                    //console.log("swapVehicle", id, v);

                    window.defaultMinVolume = window.minVolume = v.minVolume ? v.minVolume : 0;
                    window.defaultMaxVolume = window.maxVolume = v.maxVolume ? v.maxVolume : 80;
					
                    if(window.audioMonkey) {
                        if(v.sound && v.sound.ogg && v.sound.ogg!="" && (!Platform.isIE() && format == 'ogg')) {
                            window.audioMonkey.add("forward", v.sound.ogg.url);
                        }//if
                        else if(v.sound && v.sound.mp3 && v.sound.mp3!="") {
                            window.audioMonkey.add("forward", v.sound.mp3.url);
                        }//if
                        else {
                            window.audioMonkey.remove("forward");
                        }//else

                        if(v.slip && v.slip.ogg && v.slip.ogg!="" && (!Platform.isIE() && format == 'ogg')) {
                            window.audioMonkey.add("slip", v.slip.ogg.url);
                        }//if
                        else if(v.slip && v.slip.mp3 && v.slip.mp3!="") {
                            window.audioMonkey.add("slip", v.slip.mp3.url);
                        }//if
                        else {
                            window.audioMonkey.remove("slip");
                        }//else

                        if(v.crashSound && v.crashSound.ogg!="" && (!Platform.isIE() && format == 'ogg')) {
                            var sound = v.crashSound;

                            window.audioMonkey.add("vehicleCrash", sound.ogg.url);
                        }//if
                        else if(v.crashSound && v.crashSound.mp3!="") {
                            var sound = v.crashSound;

                            window.audioMonkey.add("vehicleCrash", sound.mp3.url);
                        }//if
                        else {
                            //window.audioMonkey.remove("vehicleCrash");
                            if((!Platform.isIE() && format == 'ogg')) window.audioMonkey.add("vehicleCrash", window.SITE_URL+"/sounds/crashSound3.ogg");
                            else window.audioMonkey.add("vehicleCrash", window.SITE_URL+"/sounds/crashSound3.mp3");
                        }//else

                    }//if

                    window.teleportLocation = false;

                    cesiumExplorer.physics.vehicleData = v;
                    cesiumExplorer.physics.bodyModel.loaded = false;
                    cesiumExplorer.physics.teleported = true;
                    cesiumExplorer.physics.onReLoad();
				},
				destroy: function() {
				}
			};
			
			var v = window.myVehicle;
			
			window.world = new box2D.dynamics.B2World(new box2D.common.math.B2Vec2(0, 0), true); // no gravity
			cesiumExplorer.main(window.myVehicle);
			
			window.defaultMinVolume = window.minVolume = v.minVolume ? v.minVolume : 0;
			window.defaultMaxVolume = window.maxVolume = v.maxVolume ? v.maxVolume : 80;
			
			try {
						if((!Platform.isIE() && format == 'ogg')) {
							window.audioMonkey.add("up", '/sounds/wind_up.ogg');
							window.audioMonkey.add("down", '/sounds/wind_down.ogg');
							window.audioMonkey.add("altitude", '/sounds/altitude_warning.ogg');
							
							window.audioMonkey.add("barra-da-tijuca", '/sounds/barra_da_tijuca.ogg');
							window.audioMonkey.add("centro", '/sounds/centro.ogg');
							window.audioMonkey.add("copacabana", '/sounds/copacabana.ogg');
							window.audioMonkey.add("deodoro", '/sounds/deodoro.ogg');
							window.audioMonkey.add("maracana", '/sounds/maracana.ogg');
						}//if
						else {
							window.audioMonkey.add("up", '/sounds/wind_up.mp3');
							window.audioMonkey.add("down", '/sounds/wind_down.mp3');
							window.audioMonkey.add("altitude", '/sounds/altitude_warning.mp3');
							
							window.audioMonkey.add("barra-da-tijuca", '/sounds/barra_da_tijuca.mp3');
							window.audioMonkey.add("centro", '/sounds/centro.mp3');
							window.audioMonkey.add("copacabana", '/sounds/copacabana.mp3');
							window.audioMonkey.add("deodoro", '/sounds/deodoro.mp3');
							window.audioMonkey.add("maracana", '/sounds/maracana.mp3');
						}//else
						
        if(v.sound && v.sound.ogg!="" && (!Platform.isIE() && format == 'ogg')) {
            var sound = v.sound;

            window.audioMonkey.add("forward", sound.ogg.url);
        }//if
        else if(v.sound && v.sound.mp3!="") {
            var sound = v.sound;

            window.audioMonkey.add("forward", sound.mp3.url);
        }//if
        else {
            window.audioMonkey.remove("forward");
        }//else

        if(v.slip && v.slip.ogg!="" && (!Platform.isIE() && format == 'ogg')) {
            var sound = v.slip;

            window.audioMonkey.add("slip", sound.ogg.url);
        }//if
        else if(v.slip && v.slip.mp3!="") {
            var sound = v.slip;

            window.audioMonkey.add("slip", sound.mp3.url);
        }//if
        else {
            window.audioMonkey.remove("slip");
        }//else

        if(v.crashSound && v.crashSound.ogg!="" && (!Platform.isIE() && format == 'ogg')) {
            var sound = v.crashSound;

            window.audioMonkey.add("vehicleCrash", sound.ogg.url);
        }//if
        else if(v.crashSound && v.crashSound.mp3!="") {
            var sound = v.crashSound;

            window.audioMonkey.add("vehicleCrash", sound.mp3.url);
        }//if
        else {
            //window.audioMonkey.remove("vehicleCrash");
            if((!Platform.isIE() && format == 'ogg')) window.audioMonkey.add("vehicleCrash", window.SITE_URL+"/sounds/crashSound3.ogg");
            else window.audioMonkey.add("vehicleCrash", window.SITE_URL+"/sounds/crashSound3.mp3");
        }//else

    } catch(err) {}
			
			cesiumExplorer.goto(window.defaultLat, window.defaultLon, window.defaultAlt, window.defaultSpeed, window.defaultHeading);
		</script>
	</body>
</html>
