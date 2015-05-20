<!DOCTYPE html>
<html lang="pt_BR">
	<head>
		<title>Cesium Explorer!</title>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<meta charset="UTF-8">
			
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
				
				<a id="restart" href="#">restart</a>
			</div>
			
			<div id="controls">
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
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">up</b></div>
			                                <div>Subir</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">down</b></div>
			                                <div>Descer</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">left</b></div>
			                                <div>Virar à esquerda</div>
			                            </div>
										
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">right</b></div>
			                                <div>Virar à direita</div>
			                            </div>
										
			                            <div>
			                                <h4>Outros</h4>
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
		
		<script type="text/javascript" src="/js/jquery.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/mousetrap.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/EventEmitter.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/attitude_indicator.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/variables.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/latlon_v1.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/gamepad.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/audioMonkey.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/box2d.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/math3d.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/vehicle.min.js?{{version}}"></script>
		<script type="text/javascript" src="/js/physics.min.js?{{version}}"></script>
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
				
				cesiumExplorer.goto(window.lat, window.lon, window.alt, window.speed, window.heading);
			});
			
			window.SITE_URL = 'http://andresantos.cloudapp.net';
			
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
			window.audioMonkey.add("chat-notify", window.SITE_URL+"/sounds/chat_v2.ogg");
			window.audioMonkey.add("ringtone", window.SITE_URL+"/sounds/ringtone.ogg");
			window.audioMonkey.add("ringback", window.SITE_URL+"/sounds/ringback.ogg");
			window.audioMonkey.add("checkpoint-cleared", window.SITE_URL+"/sounds/smw_coin.ogg");
			window.audioMonkey.add("gameover", window.SITE_URL+"/sounds/fail-trombone-03.ogg");
			window.audioMonkey.add("gamewon", window.SITE_URL+"/sounds/Ta_Da.ogg");
			window.audioMonkey.add("warning", window.SITE_URL+"/sounds/warning_sound.ogg");
			
			// Physics initial data
			window.unit = 'Km';
			window.lat = -22.758453448852343;
			window.lon = -43.1103515625;
			window.alt = 200;
			window.speed = 100;
			window.heading = -0.5235985725678303;
			window.tilt = -0.0014993722426054328;
			window.roll = 0;
			
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
                        if(v.sound && v.sound.ogg && v.sound.ogg!="" && !Platform.isIE()) {
                            window.audioMonkey.add("forward", v.sound.ogg.url);
                        }//if
                        else if(v.sound && v.sound.mp3 && v.sound.mp3!="") {
                            window.audioMonkey.add("forward", v.sound.mp3.url);
                        }//if
                        else {
                            window.audioMonkey.remove("forward");
                        }//else

                        if(v.slip && v.slip.ogg && v.slip.ogg!="" && !Platform.isIE()) {
                            window.audioMonkey.add("slip", v.slip.ogg.url);
                        }//if
                        else if(v.slip && v.slip.mp3 && v.slip.mp3!="") {
                            window.audioMonkey.add("slip", v.slip.mp3.url);
                        }//if
                        else {
                            window.audioMonkey.remove("slip");
                        }//else

                        if(v.crashSound && v.crashSound.ogg!="" && !Platform.isIE()) {
                            var sound = v.crashSound;

                            window.audioMonkey.add("vehicleCrash", sound.ogg.url);
                        }//if
                        else if(v.crashSound && v.crashSound.mp3!="") {
                            var sound = v.crashSound;

                            window.audioMonkey.add("vehicleCrash", sound.mp3.url);
                        }//if
                        else {
                            //window.audioMonkey.remove("vehicleCrash");
                            if(!Platform.isIE()) window.audioMonkey.add("vehicleCrash", window.SITE_URL+"/sounds/crashSound3.ogg");
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
        if(v.sound && v.sound.ogg!="" && !Platform.isIE()) {
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

        if(v.slip && v.slip.ogg!="" && !Platform.isIE()) {
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

        if(v.crashSound && v.crashSound.ogg!="" && !Platform.isIE()) {
            var sound = v.crashSound;

            window.audioMonkey.add("vehicleCrash", sound.ogg.url);
        }//if
        else if(v.crashSound && v.crashSound.mp3!="") {
            var sound = v.crashSound;

            window.audioMonkey.add("vehicleCrash", sound.mp3.url);
        }//if
        else {
            //window.audioMonkey.remove("vehicleCrash");
            if(!Platform.isIE()) window.audioMonkey.add("vehicleCrash", window.SITE_URL+"/sounds/crashSound3.ogg");
            else window.audioMonkey.add("vehicleCrash", window.SITE_URL+"/sounds/crashSound3.mp3");
        }//else

    } catch(err) {}
			
			cesiumExplorer.goto(window.lat, window.lon, window.alt, window.speed, window.heading);
		</script>
	</body>
</html>
