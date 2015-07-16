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
    { id: 'centro', lat: -22.906948, lon: -43.182830, alt: 400, altOffset: 10, heading: 0, radius: 200, label: 'Centro' },
    { id: 'copacabana', lat: -22.972560, lon: -43.184092, alt: 400, altOffset: 10, heading: 0, radius: 3700, label: 'Copacabana' },
    { id: 'maracana', lat: -22.912134, lon: -43.230128, alt: 400, altOffset: 50, heading: 0, radius: 3700, label: 'Maracanã' },
    { id: 'deodoro', lat: -22.856096, lon: -43.385161, alt: 400, altOffset: 10, heading: 0, radius: 1960, label: 'Deodoro' },
    { id: 'barra-da-tijuca', lat: -23.000138, lon: -43.366109, alt: 400, altOffset: 10, heading: 0, radius: 3000, label: 'Barra da Tijuca' }
];

window.SUBPOIS = [
    { id: 'vila_olimpica', lat: -22.983681100000002, lon: -43.4141063, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Vila Olímpica', showPlacemark: true },
    { id: 'campo_golfe_olimpico', lat: -23.0047376, lon: -43.4074545, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Campo de Golfe Olímpico', showPlacemark: true },
    { id: 'complexo_desportivo_deodoro', lat: -22.8582625, lon: -43.410244, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Complexo Esportivo Deodoro', showPlacemark: true },
    { id: 'riocentro', lat: -22.9779029, lon: -43.4114778, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Riocentro', showPlacemark: true },
    { id: 'area_campo_golfe', lat: -23.004545, lon: -43.406640, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Área do campo de golfe', showPlacemark: true },
    { id: 'sambodromo', lat: -22.911452, lon: -43.196804, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Sambódromo', showPlacemark: true },
    { id: 'estadio_maracana', lat: -22.9121122, lon: -43.2301497, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Estádio do Maracanã', showPlacemark: false },
    { id: 'engenhao', lat: -22.8935716, lon: -43.292141, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Engenhão', showPlacemark: false },
    { id: 'maracanazinho', lat: -22.9139306, lon: -43.2292163, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Maracanãzinho', showPlacemark: true },
    { id: 'marina_gloria', lat: -22.920205, lon: -43.169906, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Marina da Glória', showPlacemark: true },
    { id: 'lagoa_rodrigo_freitas', lat: -22.9764311, lon: -43.2175112, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Lagoa Rodrigo de Freitas', showPlacemark: true },
    { id: 'forte_copacabana', lat: -22.9883825, lon: -43.1946373, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Forte Copacabana', showPlacemark: true },
    { id: 'copacabana', lat: -22.9645577, lon: -43.1716347, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Copacabana', showPlacemark: true },
    { id: 'pontal', lat: -23.0319125, lon: -43.4711409, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Pontal', showPlacemark: true },
    { id: 'parque_olimpico', lat: -22.9769053, lon: -43.3947944, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Parque Olímpico', showPlacemark: true },
    { id: 'linha_48', lat: -23.006961, lon: -43.282948, alt: 0, altOffset: 10, heading: 0, radius: 0, label: 'Linha 48', showPlacemark: true }
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

window.models = [
    {
        name: "Maracana",
        url: "http://andresantos.cloudapp.net/models/maracana/gltf/Maracana_1.gltf",
        lat: -22.91221,
        lng: -43.23046,
        alt: 15,
        heading: 0.55,
        tilt: 0,
        roll: 0,
        x: 0.5,
        y: 0.5,
        z: 0.5
    },
    {
        name: "Engenhao",
        url: "http://andresantos.cloudapp.net/models/engenhao/gltf/estadioengenhao.gltf",
        lat: -22.893334,
        lng: -43.2919855,
        alt: 27,
        heading: 0,
        tilt: 0,
        roll: 0,
        x: 1.1,
        y: 1.1,
        z: 1.1
    },
    {
        name: "Christ the Redeemer",
        url: "http://andresantos.cloudapp.net/models/christ_redeemer/gltf/Cristo_Redentor_1.gltf",
        lat: -22.9518,
        lng: -43.2118,
        alt: 637,
        heading: 0,
        tilt: 0,
        roll: 0,
        x: 1,
        y: 1,
        z: 1
    },
    {
        name: "River Niteroi bridge",
        url: "http://andresantos.cloudapp.net/models/niteroi/gltf/niteroi_1.gltf",
        lat: -22.8683,
        lng: -43.1980,
        alt: 0,
        heading: -0.007,
        tilt: 0,
        roll: 0,
        x: 1,
        y: 1,
        z: 1
    },
    {
        name: "Catedral",
        url: "http://andresantos.cloudapp.net/models/catedral/gltf/catedral_1.gltf",
        lat: -22.910786,
        lng: -43.180679,
        alt: 0,
        heading: 0,
        tilt: 0,
        roll: 0,
        x: 1,
        y: 1,
        z: 1
    },
    {
        name: "Camara Municipal",
        url: "http://andresantos.cloudapp.net/models/camara_municipal/gltf/camara_municipal_1.gltf",
        lat: -22.910076,
        lng: -43.176663,
        alt: 7,
        heading: 0,
        tilt: 0,
        roll: 0,
        x: 1,
        y: 1,
        z: 1
    }
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

    /*
    window.audioMonkey.add("barra-da-tijuca", { ogg: '/sounds/barra_da_tijuca.ogg', mp3: '/sounds/barra_da_tijuca.mp3' });
    window.audioMonkey.add("centro", { ogg: '/sounds/centro.ogg', mp3: '/sounds/centro.mp3' });
    window.audioMonkey.add("copacabana", { ogg: '/sounds/copacabana.ogg', mp3: '/sounds/copacabana.mp3' });
    window.audioMonkey.add("deodoro", { ogg: '/sounds/deodoro.ogg', mp3: '/sounds/deodoro.mp3' });
    window.audioMonkey.add("maracana", { ogg: '/sounds/maracana.ogg', mp3: '/sounds/maracana.mp3' });
    */

    window.audioMonkey.add("barra-da-tijuca", { ogg: '/sounds/test/Air_Raid.ogg', mp3: '/sounds/test/Air_Raid.mp3' });
    window.audioMonkey.add("centro", { ogg: '/sounds/test/Exploding_Hearts.ogg', mp3: '/sounds/test/Exploding_Hearts.mp3' });
    window.audioMonkey.add("copacabana", { ogg: '/sounds/test/Hawk_Land.ogg', mp3: '/sounds/test/Hawk_Land.mp3' });
    window.audioMonkey.add("deodoro", { ogg: '/sounds/test/The_End_is_Nigh.ogg', mp3: '/sounds/test/The_End_is_Nigh.mp3' });
    window.audioMonkey.add("maracana", { ogg: '/sounds/test/Welcomed_Death.ogg', mp3: '/sounds/test/Welcomed_Death.mp3' });

    window.audioMonkey.add("forward", { ogg: v.sound.ogg.url, mp3: v.sound.mp3.url });
    window.audioMonkey.add("slip", { ogg: v.slip.ogg.url, mp3: v.slip.mp3.url });
    window.audioMonkey.add("vehicleCrash", { ogg: v.crashSound.ogg.url, mp3: v.crashSound.mp3.url });

} catch(err) {}

cesiumExplorer.goto(window.defaultLat, window.defaultLon, window.defaultAlt, window.defaultSpeed, window.defaultHeading);
