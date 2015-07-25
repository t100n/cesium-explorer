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
		
		<!--<audio id="audioplayer" preload="true" autoplay="" src="http://66.55.145.43:7008/;"></audio>!-->
		
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

			<div id="notifications">
				<span id="sound-notification"></span>
				<div id="area-notification"></div>
            </div>
			
			<div id="minimap">
			</div>
			
			<div id="controls">
				<div class="row">
					<div class="accel-container">
						<p>Aceleração</p>
						<span>min </span><input id="accel-multiplier" type="range" name="points" min="3" max="6" value="3"><span> máx</span>
					</div>
				</div>
				
				<div class="row">
					<button id="up">Cima</button>
				</div>
				<div class="row">
					<button id="left">Esquerda</button>
					<button id="options">Comandos</button>
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
			                <h4 class="explorer-modal-title">Comandos</h4>
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
                                        
			                            <div style="min-height: 35px">
			                                <div class="explorer-pull-left" style="min-width: 60px;"><b class="explorer-sc-key">l</b></div>
			                                <div>Nome das ruas</div>
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
		
		<script>
			
			window.SITE_URL = location.protocol+'//'+document.domain+location.pathname.replace(/[a-zA-Z\.]+$/, '');
			
		</script>
		<script type="text/javascript" src="/js/jquery.min.js"></script>
		<script type="text/javascript" src="/js/mousetrap.min.js"></script>
		<script type="text/javascript" src="/js/EventEmitter.min.js"></script>
		<script type="text/javascript" src="/js/attitude_indicator.min.js"></script>
		<script type="text/javascript" src="/js/variables.min.js"></script>
		<script type="text/javascript" src="/js/latlon_v1.min.js"></script>
		<script type="text/javascript" src="/js/gamepad.min.js"></script>
		<script type="text/javascript" src="/js/audioMonkey.min.js"></script>
		<script type="text/javascript" src="/js/box2d.min.js"></script>
		<script type="text/javascript" src="/js/math3d.min.js"></script>
		<script type="text/javascript" src="/js/vehicle.min.js"></script>
		<script type="text/javascript" src="/js/physics.min.js"></script>
		<script type="text/javascript" src="/js/Cesium/Cesium.js"></script>
		<script type="text/javascript" src="/js/main.min.js"></script>
	</body>
</html>
