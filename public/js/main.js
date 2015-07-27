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

    /*
    cesiumExplorer.physics.lastIndex = false;
    $('#progress').css('width', '0%');
    $('#progress_glider').css('left', '0%');
    $('#sound-notification').html('');
    $('#area-notification').html('');

    $('#placemarks .poi img').attr('src', window.SITE_URL+"img/placemark_outline.png");
    */
});

$('#accel-multiplier').on('change', function(e) {
    window.speedMultiplier = $(this).val();
    $(this).blur();
});

var format = (new Audio().canPlayType('audio/ogg') !== '' ? 'ogg' : 'mp3');

window.POIS = [
    { id: 'start_game', lat: -22.983772, lon: -43.238004, startLat: -22.983772, startLon: -43.238004, alt: 400, altOffset: 10, heading: 0, radius: 3700, label: false, showPlacemark: false,
        area: new Math3D.geometry.Polygon2([
            new Math3D.geometry.Vector2(-22.9693018, -43.2283258),
            new Math3D.geometry.Vector2(-22.9692993, -43.2526588),
            new Math3D.geometry.Vector2(-22.9969554, -43.2538605),
            new Math3D.geometry.Vector2(-22.996836800000004, -43.2179404),
            new Math3D.geometry.Vector2(-22.9693018, -43.2283258)
        ])
    },
    { id: 'copacabana', lat: -22.971414, lon: -43.183009, startLat: -22.979869, startLon: -43.217513, alt: 400, altOffset: 10, heading: 0, radius: 3700, label: 'Copacabana', showPlacemark: true,
        area: new Math3D.geometry.Polygon2([
            new Math3D.geometry.Vector2(-22.9674446, -43.2234094),
            new Math3D.geometry.Vector2(-22.996906, -43.2116317),
            new Math3D.geometry.Vector2(-22.9972714, -43.129921),
            new Math3D.geometry.Vector2(-22.9008459, -43.1292343),
            new Math3D.geometry.Vector2(-22.9014784, -43.1665706),
            new Math3D.geometry.Vector2(-22.9674446, -43.2234094)
        ])
    },
    { id: 'maracana', lat: -22.912134, lon: -43.230128, startLat: -22.914867, startLon: -43.186163, alt: 400, altOffset: 0, heading: 0, radius: 3700, label: 'Maracanã', text: 'Maracanã', showPlacemark: false,
        area: new Math3D.geometry.Polygon2([
            new Math3D.geometry.Vector2(-22.9002677, -43.1747407),
            new Math3D.geometry.Vector2(-22.8691369, -43.3014965),
            new Math3D.geometry.Vector2(-22.8966553, -43.318490999999995),
            new Math3D.geometry.Vector2(-22.9346026, -43.20459369999999),
            new Math3D.geometry.Vector2(-22.9002677, -43.1747407)
        ])
    },
    { id: 'deodoro', lat: -22.853387, lon: -43.405504, startLat: -22.845967, startLon: -43.384060, alt: 400, altOffset: 10, heading: 0, radius: 2700, label: 'Deodoro', showPlacemark: true },
    { id: 'barra-da-tijuca', lat: -22.979135, lon: -43.393849, startLat: -23.003253, startLon: -43.359519, alt: 400, altOffset: 10, heading: 0, radius: 3000, label: 'Barra da Tijuca', showPlacemark: true,
        area: new Math3D.geometry.Polygon2([
            new Math3D.geometry.Vector2(-22.968192900000002, -43.3491326),
            new Math3D.geometry.Vector2(-22.9676397, -43.4095574),
            new Math3D.geometry.Vector2(-22.999799700000004, -43.4409714),
            new Math3D.geometry.Vector2(-23.0171803, -43.4914398),
            new Math3D.geometry.Vector2(-23.043089, -43.4912682),
            new Math3D.geometry.Vector2(-23.0484596, -43.47049710000001),
            new Math3D.geometry.Vector2(-23.0392977, -43.4608841),
            new Math3D.geometry.Vector2(-23.0263437, -43.45676420000001),
            new Math3D.geometry.Vector2(-23.0165483, -43.3558273),
            new Math3D.geometry.Vector2(-23.0070682, -43.3520508),
            new Math3D.geometry.Vector2(-22.968192900000002, -43.3491326)
        ])
    }
];

window.SUBPOIS = [
    { id: 'vila_olimpica', lat: -22.983681100000002, lon: -43.4141063, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Vila Olímpica', showPlacemark: true, font: "14px sans-serif" },
    { id: 'campo_golfe_olimpico', lat: -23.0047376, lon: -43.4074545, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Campo de Golfe Olímpico', showPlacemark: true, font: "14px sans-serif" },
    { id: 'complexo_desportivo_deodoro', lat: -22.8582625, lon: -43.410244, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Complexo Esportivo Deodoro', showPlacemark: true, font: "14px sans-serif" },
    { id: 'riocentro', lat: -22.9779029, lon: -43.4114778, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Riocentro', showPlacemark: true, font: "14px sans-serif" },
    { id: 'sambodromo', lat: -22.911452, lon: -43.196804, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Sambódromo', showPlacemark: true, font: "14px sans-serif" },
    //{ id: 'estadio_maracana', lat: -22.9121122, lon: -43.2301497, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Estádio do Maracanã', showPlacemark: false, font: "14px sans-serif" },
    { id: 'engenhao', lat: -22.8935716, lon: -43.292141, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Engenhão', showPlacemark: false, font: "14px sans-serif" },
    { id: 'maracanazinho', lat: -22.9139306, lon: -43.2292163, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Maracanãzinho', showPlacemark: true, font: "14px sans-serif" },
    { id: 'marina_gloria', lat: -22.920205, lon: -43.169906, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Marina da Glória', showPlacemark: true, font: "14px sans-serif" },
    { id: 'lagoa_rodrigo_freitas', lat: -22.9764311, lon: -43.2175112, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Lagoa Rodrigo de Freitas', showPlacemark: true, font: "14px sans-serif" },
    { id: 'forte_copacabana', lat: -22.9883825, lon: -43.1946373, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Forte Copacabana', showPlacemark: true, font: "14px sans-serif" },
    //{ id: 'copacabana', lat: -22.9645577, lon: -43.1716347, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Copacabana', showPlacemark: true, font: "14px sans-serif" },
    { id: 'pontal', lat: -23.0319125, lon: -43.4711409, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Pontal', showPlacemark: true, font: "14px sans-serif" },
    { id: 'parque_olimpico', lat: -22.9769053, lon: -43.3947944, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Parque Olímpico', showPlacemark: true, font: "14px sans-serif" },
    { id: 'linha_48', lat: -23.006961, lon: -43.282948, alt: 0, altOffset: 0, heading: 0, radius: 0, label: 'Linha 48', showPlacemark: true, font: "14px sans-serif" }
];

window.POISPOLYLINE = [
    { id: 'start_game', lat: -22.983772, lon: -43.238004, alt: 400, heading: 0, label: '' },
    { id: 'copacabana', lat: -22.979869, lon: -43.217513, alt: 400, heading: 0, label: '' },
    { id: 'start_game_copacabana_1', lat: -22.973226, lon: -43.202312, alt: 400, heading: 0, label: '' },
    { id: 'start_game_copacabana_2', lat: -22.960310, lon: -43.190569, alt: 450, heading: 0, label: 'Copacabana' },
    { id: 'copacabana_maracana_1', lat: -22.943564, lon: -43.185581, alt: 550, heading: 0, label: '' },
    { id: 'copacabana_maracana_2', lat: -22.925170, lon: -43.183540, alt: 600, heading: 0, label: '' },
    { id: 'maracana', lat: -22.912584, lon: -43.191695, alt: 700, heading: 0, label: '' },
    { id: 'copacabana_maracana_3', lat: -22.906469, lon: -43.209593, alt: 800, heading: 0, label: '' },
    { id: 'copacabana_maracana_4', lat: -22.903986, lon: -43.228818, alt: 700, heading: 0, label: '' },
    { id: 'maracana_deodoro_1', lat: -22.901007, lon: -43.248223, alt: 700, heading: 0, label: '' },
    { id: 'maracana_deodoro_2', lat: -22.885896, lon: -43.291846, alt: 650, heading: 0, label: '' },
    { id: 'maracana_deodoro_3', lat: -22.864475, lon: -43.333393, alt: 600, heading: 0, label: '' },
    { id: 'maracana_deodoro_4', lat: -22.852523, lon: -43.353655, alt: 500, heading: 0, label: '' },
    { id: 'deodoro', lat: -22.845967, lon: -43.384060, alt: 400, heading: 0, label: '' },
    { id: 'maracana_deodoro_5', lat: -22.853387, lon: -43.405504, alt: 400, heading: 0, label: 'Deodoro' },
    { id: 'deodoro-barra-da-tijuca_1', lat: -22.863374, lon: -43.413788, alt: 400, heading: 0, label: '' },
    { id: 'deodoro-barra-da-tijuca_2', lat: -22.871595, lon: -43.414145, alt: 450, heading: 0, label: '' },
    { id: 'deodoro-barra-da-tijuca_3', lat: -22.899870, lon: -43.397193, alt: 550, heading: 0, label: '' },
    { id: 'deodoro-barra-da-tijuca_4', lat: -22.950823, lon: -43.356545, alt: 450, heading: 0, label: '' },
    { id: 'deodoro-barra-da-tijuca_5', lat: -22.982299, lon: -43.345044, alt: 450, heading: 0, label: '' },
    { id: 'deodoro-barra-da-tijuca_6', lat: -22.995980, lon: -43.346118, alt: 450, heading: 0, label: '' },
    { id: 'barra-da-tijuca', lat: -23.003253, lon: -43.359519, alt: 450, heading: 0, label: '' },
    { id: 'barra-da-tijuca_1', lat: -23.005210, lon: -43.369574, alt: 450, heading: 0, label: '' },
    { id: 'barra-da-tijuca_2', lat: -23.001914, lon: -43.402520, alt: 450, heading: 0, label: '' },
    { id: 'barra-da-tijuca_3', lat: -23.012956, lon: -43.445493, alt: 350, heading: 0, label: '' },
    { id: 'barra-da-tijuca_1', lat: -23.031083, lon: -43.471277, alt: 250, heading: 0, label: '' },
    { id: 'end', lat: -23.050438, lon: -43.479223, alt: 0, heading: 0, label: '' }
];

window.models = [
    {
        name: "Maracana",
        url: window.SITE_URL+"models/maracana/gltf/Maracana_1.gltf",
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
        url: window.SITE_URL+"models/engenhao/gltf/estadioengenhao.gltf",
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
        url: window.SITE_URL+"models/christ_redeemer/gltf/Cristo_Redentor_1.gltf",
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
        url: window.SITE_URL+"models/niteroi/gltf/niteroi_1.gltf",
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
        url: window.SITE_URL+"models/catedral/gltf/catedral_1.gltf",
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
        url: window.SITE_URL+"models/camara_municipal/gltf/camara_municipal_1.gltf",
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

window.userId = "folhasaopaulo";
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
window.defaultLat = window.lat = -22.984206; //-22.888286010415;
window.defaultLon = window.lon = -43.248414; //-43.17069974208982;
window.defaultAlt = window.alt = 300;
window.defaultSpeed = window.speed = 100;
window.defaultHeading = window.heading = 90;
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

createjs.FlashAudioPlugin.swfPath = "/js/flashaudio";
createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.FlashAudioPlugin]); // Adds FlashAudioPlugin as a fallback if WebAudio and HTMLAudio do not work.
createjs.Sound.alternateExtensions = ["mp3"];

// begin loading content (only sounds to load)
var assetsPath = "/sounds/";

try {
    
    window.audioMonkey.add("up", { ogg: '/sounds/wind_up.ogg', mp3: '/sounds/wind_up.mp3' });
    window.audioMonkey.add("down", { ogg: '/sounds/wind_down.ogg', mp3: '/sounds/wind_down.mp3' });
    window.audioMonkey.add("altitude", { ogg: '/sounds/altitude_warning.ogg', mp3: '/sounds/altitude_warning.mp3' });

    window.audioMonkey.add("start_game", { ogg: '/sounds/intro.ogg', mp3: '/sounds/intro.mp3' });
    window.audioMonkey.add("copacabana", { ogg: '/sounds/copa.ogg', mp3: '/sounds/copa.mp3' });
    window.audioMonkey.add("maracana", { ogg: '/sounds/maraca.ogg', mp3: '/sounds/maraca.mp3' });
    window.audioMonkey.add("deodoro", { ogg: '/sounds/deodoro.ogg', mp3: '/sounds/deodoro.mp3' });
    window.audioMonkey.add("barra-da-tijuca", { ogg: '/sounds/barra.ogg', mp3: '/sounds/barra.mp3' });

    window.audioMonkey.add("forward", { ogg: v.sound.ogg.url, mp3: v.sound.mp3.url });
    window.audioMonkey.add("slip", { ogg: v.slip.ogg.url, mp3: v.slip.mp3.url });
    window.audioMonkey.add("vehicleCrash", { ogg: v.crashSound.ogg.url, mp3: v.crashSound.mp3.url });

} catch(err) {}

cesiumExplorer.goto(window.defaultLat, window.defaultLon, window.defaultAlt, window.defaultSpeed, window.defaultHeading);
