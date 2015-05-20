window.cesiumExplorer = {};

window.VIEW_DISTANCE = 10000;
window.TREE_VIEW_DISTANCE = 1000;

window.flashMessages = [];

window.lastGlobalVolume = 1;

window.search = false;
window.searchId = false;

window.unreadMessages = 0;

window.mapMarkers = [];
window.onCall = false;
window.notFocused = false;
window.requestLocationsUpdate = false;
window.requestedLocationsUpdate = false;
window.teleportInputIsVisible = false;

window.map = false;
window.markers = {};

window.destinationSet = false;
window.destinationMarker = false;
window.dblclicked = false;

window.stalking = false;
window.stalkingUserId = false;

window.ghostView = false;
window.ghostUserId = false;

window.pendingCalls = {};
window.protocol = document.documentURI ? document.documentURI.match(/https?:\/\//)[0] : document.URL.match(/https?:\/\//)[0];
window.lastTitle = "Cesium Explorer";
window.titleBlinkInterval = false;
window.currentVehicle = false;

window.socketRegistered = false;
window.socketQueue = [];

window.maxDistance = 10000;

window.cancelCall = false;
window.callProfile = false;
window.callEndButtonFlag = false;
window.callIds = {};

window.transmitting = false;
window.watchingNow = 0;
window.watchers = {};
window.watchersCalls = {};

window.maxSoundDistance = 500;

window.swapTimeout = false;

window.teleportLocation = false;

window.existingCall = false;
window.callProfile = false;

window.checkGamepad = null;
window.checkGamepadInterval = null;

window.buildings = {};

window.defaultTiltOffset = 182;

var peer = false;
var peerPing = false;

Platform = function () {};
Platform.isChrome = function () {
    return Platform.userAgentContains("Chrome")
};
Platform.isFirefox = function () {
    return Platform.userAgentContains("Firefox")
};
Platform.isIE = function () {
    return Platform.userAgentContains("MSIE")
};
Platform.isSafari = function () {
    return Platform.userAgentContains("Safari") && Platform.vendorContains("Apple Computer")
};
Platform.isiPhone = function () {
    return Platform.userAgentContains("iPhone")
};
Platform.isiPad = function () {
    return Platform.userAgentContains("iPad")
};
Platform.isiOS = function () {
    return Platform.isiPhone() || Platform.isiPad()
};
Platform.isAndroid = function () {
    return Platform.userAgentContains("Android")
};
Platform.isWebKit = function () {
    return Platform.userAgentContains("WebKit")
};
Platform.isMobile = function () {
    return Platform.isiOS() || Platform.isAndroid()
};
Platform.isTouchDevice = function () {
    return Platform.isMobile()
};
Platform.isTablet = function () {
    var isAndroidTablet = Platform.isAndroid() && !Platform.userAgentContains("mobile");
    var isiOSTablet = Platform.isiPad();
    return isAndroidTablet || isiOSTablet
};
Platform.getLanguage = function () {
    try {
        return (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 2)
    } catch (e) {
        return null
    }
};
Platform.getUserAgent = function () {
    return window.navigator.userAgent
};
Platform.userAgentContains = function (keyword) {
    return Platform.getUserAgent().indexOf(keyword) >= 0
};
Platform.vendorContains = function (keyword) {
    var navigator = window.navigator;
    return navigator.vendor.indexOf(keyword) >= 0
};

var dateStr = function (date) {
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mi = date.getMinutes();
    var s = date.getSeconds();
    return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s)
};
var cca = function (s, index) {
    function displayKeyCode(value) {
        if (value == "backspace") return 8; //  backspace
        if (value == "tab") return 9; //  tab
        if (value == "enter") return 13; //  enter
        if (value == "shift") return 16; //  shift
        if (value == "ctrl") return 17; //  ctrl
        if (value == "alt") return 18; //  alt
        if (value == "pause/break") return 19; //  pause/break
        if (value == "caps lock") return 20; //  caps lock
        if (value == "escape") return 27; //  escape
        if (value == "space") return 32; //  space
        if (value == "page up") return 33; // page up, to avoid displaying alternate character and confusing people
        if (value == "page down") return 34; // page down
        if (value == "end") return 35; // end
        if (value == "home") return 36; // home
        if (value == "left") return 37; // left arrow
        if (value == "up") return 38; // up arrow
        if (value == "right") return 39; // right arrow
        if (value == "down") return 40; // down arrow
        if (value == "insert") return 45; // insert
        if (value == "delete") return 46; // delete
        if (value == "left window") return 91; // left window
        if (value == "right window") return 92; // right window
        if (value == "select key") return 93; // select key
        if (value == "numpad 0") return 96; // numpad 0
        if (value == "numpad 1") return 97; // numpad 1
        if (value == "numpad 2") return 98; // numpad 2
        if (value == "numpad 3") return 99; // numpad 3
        if (value == "numpad 4") return 100; // numpad 4
        if (value == "numpad 5") return 101; // numpad 5
        if (value == "numpad 6") return 102; // numpad 6
        if (value == "numpad 7") return 103; // numpad 7
        if (value == "numpad 8") return 104; // numpad 8
        if (value == "numpad 9") return 105; // numpad 9
        if (value == "multiply") return 106; // multiply
        if (value == "add") return 107; // add
        if (value == "subtract") return 109; // subtract
        if (value == "decimal point") return 110; // decimal point
        if (value == "divide") return 111; // divide
        if (value == "F1") return 112; // F1
        if (value == "F2") return 113; // F2
        if (value == "F3") return 114; // F3
        if (value == "F4") return 115; // F4
        if (value == "F5") return 116; // F5
        if (value == "F6") return 117; // F6
        if (value == "F7") return 118; // F7
        if (value == "F8") return 119; // F8
        if (value == "F9") return 120; // F9
        if (value == "F10") return 121; // F10
        if (value == "F11") return 122; // F11
        if (value == "F12") return 123; // F12
        if (value == "num lock") return 144; // num lock
        if (value == "scroll lock") return 145; // scroll lock
        if (value == ";") return 186; // semi-colon
        if (value == "=") return 187; // equal-sign
        if (value == ",") return 188; // comma
        if (value == "-") return 189; // dash
        if (value == ".") return 190; // period
        if (value == "/") return 191; // forward slash
        if (value == "`") return 192; // grave accent
        if (value == "[") return 219; // open bracket
        if (value == "\\") return 220; // back slash
        if (value == "]") return 221; // close bracket
        if (value == "'") return 222; // single quote

        return false;
    }

    var y = displayKeyCode(s);
    if(y) return y;

    var x = s.toUpperCase().charCodeAt(index);
    if (x != x) return undefined;
    return x
};
var substr = function (s, pos, len) {
    if (pos != null && pos != 0 && len != null && len < 0) return "";
    if (len == null) len = s.length;
    if (pos < 0) {
        pos = s.length + pos;
        if (pos < 0) pos = 0
    } else if (len < 0) len = s.length + len - pos;
    return s.substr(pos, len)
};
var remove = function (a, obj) {
    var i = 0;
    var l = a.length;
    while (i < l) {
        if (a[i] == obj) {
            a.splice(i, 1);
            return true
        }
        i++
    }
    return false
};
var iter = function (a) {
    return {
        cur: 0,
        arr: a,
        hasNext: function () {
            return this.cur < this.arr.length
        },
        next: function () {
            return this.arr[this.cur++]
        }
    }
};

var LatLng = function (_lat, _lng) {
    this._lat = _lat > 89.9 ? -89.89 : (_lat < -89.9 ? 89.89 : _lat);
    this._lng = _lng > 179.9 ? -179.89 : (_lng < -179.9 ? 179.89 : _lng);
    this._alt = 0;

    this.lat = function (){
        return this._lat;
    };

    this.lng = function() {
        return this._lng;
    };

    this.altitude = function () {
        return this._alt;
    };

    this.copy = function () {
        return new LatLng(this.lat(), this.lng())
    };

    this.createOffset = function (heading, meter) {
        var lat = this.lat() * .0174532925199433;
        var lng = this.lng() * .0174532925199433;
        meter /= 6371e3;
        var lat2 = Math.asin(Math.sin(lat) * Math.cos(meter) + Math.cos(lat) * Math.sin(meter) * Math.cos(heading));
        var lng2 = lng + Math.atan2(Math.sin(heading) * Math.sin(meter) * Math.cos(lat2), Math.cos(meter) - Math.sin(lat) * Math.sin(lat2));
        return new LatLng(lat2.toDeg(), lng2.toDeg());
    };

    this.distance = function (other) {
        var a = Math.sin(this.lat() * .0174532925199433) * Math.sin(other.lat() * .0174532925199433);
        var b = Math.cos(this.lat() * .0174532925199433) * Math.cos(other.lat() * .0174532925199433) * Math.cos((other.lng() - this.lng()) * .0174532925199433);
        return 6371e3 * Math.acos(a + b);
    };

    // Keep an angle in [-180,180]
    /**
     * Keep an angle in the [-180, 180] range
     * @param {number} a Angle in degrees
     * @return {number} The angle in the [-180, 180] degree range
     */
    this.fixAngle = function(a) {
        while (a < -180)
            a += 360;

        while (a > 180)
            a -= 360;

        return a;
    };

    /**
     * Calculates the heading/bearing between two locations. Taken from the formula
     * provided at http://mathforum.org/library/drmath/view/55417.html
     * @param {LatLngAlt} loc1 The start location
     * @param {LatLngAlt} loc2 The destination location
     * @return {number} The heading from loc1 to loc2, in degrees
     */
    this.heading = function(loc2) {
        var lat1 = this.lat().toRad();
        var lon1 = this.lng().toRad();

        var lat2 = loc2.lat().toRad();
        var lon2 = loc2.lng().toRad();

        var heading = this.fixAngle(Math.atan2(
            Math.sin(lon2 - lon1) * Math.cos(lat2),
            Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) *
                Math.cos(lon2 - lon1)).toDeg());

        return heading.toRad();
    };

    this.slope = function (loc2) {
        var x1=this.distance(loc2);
        var x2=0;
        var y1=this.altitude();
        var y2=loc2.altitude();

        var xdist=x2-x1;
        var ydist=y2-y1;

        var slope=(ydist/xdist);
        var slopeang=(Math.atan(slope));

        return slopeang;
    };

    /**
     * Calculates an intermediate lat/lon, (100 * f)% between loc1 and loc2
     * @param {LatLngAlt} loc1 The start location
     * @param {LatLngAlt} loc2 The end location
     * @return {LatLngAlt} An intermediate location between loc1 and loc2
     */
    this.interpolateLoc = function(loc2, f) {
        return new LatLngAlt(
            this.lat() + f * (loc2.lat() - this.lat()),
            this.lng() + f * (loc2.lng() - this.lng())
        );
    };
};

var LatLngAlt = function (_lat, _lng, _alt) {
    this._lat = _lat > 89.9 ? -89.89 : (_lat < -89.9 ? 89.89 : _lat);
    this._lng = _lng > 179.9 ? -179.89 : (_lng < -179.9 ? 179.89 : _lng);
    this._alt = _alt;

    this.lat = function () {
        return this._lat;
    };

    this.lng = function () {
        return this._lng;
    };

    this.alt = function () {
        return this._alt;
    };

    this.altitude = function () {
        return this._alt;
    };

    this.set = function (_lat, _lng, _alt) {
        this._lat = _lat;
        this._lng = _lng;
        this._alt = _alt;
    };

    this.copy = function (o) {
        this._lat = o.lat();
        this._lng = o.lng();
        this._alt = o.alt();
    };

    // Keep an angle in [-180,180]
    /**
     * Keep an angle in the [-180, 180] range
     * @param {number} a Angle in degrees
     * @return {number} The angle in the [-180, 180] degree range
     */
    this.fixAngle = function(a) {
        while (a < -180)
            a += 360;

        while (a > 180)
            a -= 360;

        return a;
    };

    this.createOffset = function (heading, meter) {
        var lat = this.lat() * .0174532925199433;
        var lng = this.lng() * .0174532925199433;
        meter /= 6371e3;
        var lat2 = Math.asin(Math.sin(lat) * Math.cos(meter) + Math.cos(lat) * Math.sin(meter) * Math.cos(heading));
        var lng2 = lng + Math.atan2(Math.sin(heading) * Math.sin(meter) * Math.cos(lat2), Math.cos(meter) - Math.sin(lat) * Math.sin(lat2));
        return new LatLngAlt(lat2.toDeg(), lng2.toDeg(), this.altitude());
    };

    /**
     * Calculates the heading/bearing between two locations. Taken from the formula
     * provided at http://mathforum.org/library/drmath/view/55417.html
     * @param {LatLngAlt} loc1 The start location
     * @param {LatLngAlt} loc2 The destination location
     * @return {number} The heading from loc1 to loc2, in degrees
     */
    this.heading = function(loc2) {
        var lat1 = this.lat().toRad();
        var lon1 = this.lng().toRad();

        var lat2 = loc2.lat().toRad();
        var lon2 = loc2.lng().toRad();

        var heading = this.fixAngle(Math.atan2(
            Math.sin(lon2 - lon1) * Math.cos(lat2),
            Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) *
                Math.cos(lon2 - lon1)).toDeg());

        return heading.toRad();
    };

    this.slope = function (loc2) {
        var x1=this.distance(loc2);
        var x2=0;
        var y1=this.altitude();
        var y2=loc2.altitude();

        var xdist=x2-x1;
        var ydist=y2-y1;

        var slope=(ydist/xdist);
        var slopeang=(Math.atan(slope));

        return slopeang;
    };

    /**
     * Calculates an intermediate lat/lon, (100 * f)% between loc1 and loc2
     * @param {LatLngAlt} loc1 The start location
     * @param {LatLngAlt} loc2 The end location
     * @return {LatLngAlt} An intermediate location between loc1 and loc2
     */
    this.interpolateLoc = function(loc2, f) {
        return new LatLngAlt(
            this.lat() + f * (loc2.lat() - this.lat()),
            this.lng() + f * (loc2.lng() - this.lng()),
            this.altitude() + f * (loc2.altitude() - this.altitude())
        );
    };

    /**
     * Gets the earth distance between two locations, factoring in ground altitudes
     * provided by the associated Google Earth plugin instance
     * @param {LatLngAlt} loc1 The first location
     * @param {LatLngAlt} loc2 The second location
     * @return {number} The distance from loc1 to loc2, in meters
     */
    this.distance = function(loc2) {
        var p1 = Math3D.geometry.Vector3.latLonAltToCartesian({
            x: this.lat(),
            y: this.lng(),
            z: this.altitude()
        });

        var p2 = Math3D.geometry.Vector3.latLonAltToCartesian({
            x: loc2.lat(),
            y: loc2.lng(),
            z: loc2.altitude()
        });

        return Math3D.geometry.Vector3.earthDistance(p1, p2);
    };
};

var $estr = function () {
    return js.Boot.__string_rec(this, "")
};

function $extend(from, fields) {
    function Inherit() {}
    Inherit.prototype = from;
    var proto = new Inherit;
    for (var name in fields) proto[name] = fields[name];
    if (fields.toString !== Object.prototype.toString) proto.toString = fields.toString;
    return proto
}

function log() {
    var str = "";

    function getErrorObject(){
        try { throw Error('') } catch(err) { return err; }
    }

    var err = getErrorObject();
    var caller_line = err.stack ? err.stack.split("\n")[4] : "";
    var index = caller_line.indexOf("at ");
    var clean = caller_line.slice(index+2, caller_line.length);

    if(arguments[0] == "error" || (arguments[0] == "warning" && window.loglevel > 0) || (arguments[0] == "info" && window.loglevel > 1)) {
        for(var i=0; i<arguments.length; i++) {
            str += typeof arguments[i] == "object" ? JSON.stringify(arguments[i]) : arguments[i];

            if(i<arguments.length-1) str += ", ";
        }

        if(typeof console != "undefined") {
            console.log(clean, str);
        }//if
    }//if
}

var cesiumExplorer = function () {};

window.myVehicle = {"__v":10,"_id":"533d9853bcf8e598037b601d","crashsoundtime":1,"description":"Good for exploring the city from above.<br/>Cruise Speed: 140mph","fastsoundtime":1,"modelheight":1.5,"name":"4seat Aircraft","soundtime":16000,"createdAt":"2014-04-03T17:20:19.000Z","showRPM":false,"showAltitude":true,"showSpeed":true,"keys":{"fa-minus":"Zoom Out","fa-plus":"Zoom In","fa-arrow-right":"Steer Right","fa-arrow-left":"Steer Left","fa-arrow-down":"Brake / Reverse","fa-arrow-up":"Accelerate"},"location":{"lat":37.2321326,"lon":-115.790874},"fourWheelDrive":false,"absoluteCeiling":4100,"maxGear":5,"sixthGearRatioTopSpeed":1.2,"fifthGearRatioTopSpeed":1,"fourthGearRatioTopSpeed":0.8,"thirdGearRatioTopSpeed":0.6,"secondGearRatioTopSpeed":0.4,"firstGearRatioTopSpeed":0.2,"reverseGearRatioTopSpeed":0.2,
	"sixthGearRatio":0.1,"fifthGearRatio":0.1,"fourthGearRatio":0.1,"thirdGearRatio":0.1,"secondGearRatio":0.1,"firstGearRatio":0.1,"reverseGearRatio":-0.275,"brakeRatio":0.01,
	"liftOffMinSpeed":20,"slipFactor":0,"slipMinimumRate":0.8,"slipLoopEnd":0.6,"slipLoopStart":0.2,"slip":{"ogg":{"filename":"Tires Squealing-SoundBible.com-1814115127.ogg","path":"public/uploads","size":12185,"filetype":"audio/ogg","url":"/uploads/Tires Squealing-SoundBible.com-1814115127.ogg"}},"soundMinimumRate":0.1,"soundLoopEnd":2,"soundLoopStart":0,"sound":{"duration":5,"mp3":{"filename":"","path":"","size":0,"filetype":"","url":""},"ogg":{"filename":"glider_sound.ogg","path":"public/uploads","size":20000,"filetype":"audio/ogg","url":"/uploads/glider_sound.ogg"}},"tireMarkDelay":1000,"tireMarkSizeY":0.5,"tireMarkSizeX":0.5,"tireMarkPosOffset":0,"tireMarkDirOffset":0,"shadowY":7,"shadowX":7,"shadowPosOffset":0,"shadowDirOffset":0,"shadow":{"body":{"filename":"4seat Aircraft shadow.png","path":"public/uploads","size":22287,"filetype":"image/png","url":"/uploads/4seat Aircraft shadow.png"}},"wheelsoffset":-0.2,"wheelsheight":1.5,"wheelsdistance":2,"axisdistance":1.5,"minGroundAlt":69.52291361316318,"minVolume":20,"maxVolume":50,"tiltFactor":0.35,"traction":5,"vehicleagility":0.00005,"massI":31000,"mass":1200,"traildistance":15,"camtilt":0,"camheight":3.5,"gravity":2.8,"decel":50,"maxrevspeed":50,"minaccelstep":5,"accelstep":50,"accel":5,"maxspeed":280,"rudderAngleScale":5,"maxSteeringAngle":3,"suspensionDamper":8000,"suspensionSpring":10000,"suspensionMass":5000,"suspensionrestlength":1,"rollDamper":500,"rollSpring":500,"rollMass":375,"rollclamp":68,"steerroll":1,"tiltDamper":8000,"tiltSpring":10000,"tiltMass":375,"tiltclamp":360,"steertilt":-5,"bodyWidth":2.8,"bodyLength":4.14,"rearY":1,"wheelBase":0.65,"tread":1.4,"wheelRadius":0.35,"upOffset":0,"vehiclealt":2.72,"modelzscale":1,"modelyscale":1,"modelxscale":1,
	//"chassi":{"filename":"4seat.gltf","path":"public/uploads","size":2610509,"filetype":"application/octet-stream","url":"/uploads/4seat.gltf"},
	"chassi":{"filename":"T2C_Red_Hang_glider.gltf","path":"public/uploads","size":2610509,"filetype":"application/octet-stream","url":"/uploads/T2C_Red_Hang_glider.gltf"},
	"chassimodel":{"filename":"4seat_body.kmz","path":"public/uploads","size":656853,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/4seat_body.kmz"},"logo":{"filename":"plane_cab_profile_small.png","path":"public/uploads","size":16232,"filetype":"image/png","url":"/uploads/plane_cab_profile_small.png"},"order":-1,"vehicleCameras":[{"__v":0,"_id":"54071dd5da1b111a265ca6f7","description":"4seat Aircraft wing left","name":"4seat Aircraft wing left","createdAt":"2014-09-03T13:55:33.000Z","heading":-50,"tilt":90,"dir":-30,"offset":0,"altitude":2,"type":"normal"},{"__v":0,"_id":"54071ddbe6176d1f2661eb2d","description":"4seat Aircraft wing right","name":"4seat Aircraft wing right","createdAt":"2014-09-03T13:55:39.000Z","heading":50,"tilt":90,"dir":30,"offset":0,"altitude":2,"type":"normal"}],"vehicleComponents":[{"__v":0,"_id":"53878aa3ad5e20915fdf143c","description":"4seat_green","dirOffset":-0.88,"name":"4seat_green","posOffset":5.5,"upOffset":2.4,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":3,"componentsYScale":3,"componentsXScale":3,"speed":1000,"maxAltitude":-1,"maxAlt":0,"maxTilt":0,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0,"createdAt":"2014-05-29T19:29:39.000Z","modelGl":{"filename":"4seat_green_plane.gltf","path":"public/uploads","size":42388,"filetype":"application/octet-stream","url":"/uploads/4seat_green_plane.gltf"},"model":{"filename":"4seat_green_plane.kmz","path":"public/uploads","size":25692,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/4seat_green_plane.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"blink","type":"other"},{"__v":0,"_id":"53878a9aa920379e5f531a77","description":"4seat_red","dirOffset":-0.88,"name":"4seat_red","posOffset":-5.5,"upOffset":2.4,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":3,"componentsYScale":3,"componentsXScale":3,"speed":1250,"maxAltitude":-1,"maxAlt":0,"maxTilt":0,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0,"createdAt":"2014-05-29T19:29:30.000Z","modelGl":{"filename":"4seat_red_plane.gltf","path":"public/uploads","size":40328,"filetype":"application/octet-stream","url":"/uploads/4seat_red_plane.gltf"},"model":{"filename":"4seat_red_plane.kmz","path":"public/uploads","size":24144,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/4seat_red_plane.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"blink","type":"other"},{"__v":0,"_id":"53878aabcf7dce965f349937","description":"4seat_white","dirOffset":-6.45,"name":"4seat_white","posOffset":0,"upOffset":3.28,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":2,"componentsYScale":2,"componentsXScale":2,"speed":750,"maxAltitude":-1,"maxAlt":0,"maxTilt":0,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0,"createdAt":"2014-05-29T19:29:47.000Z","modelGl":{"filename":"4seat_white_plane.gltf","path":"public/uploads","size":34528,"filetype":"application/octet-stream","url":"/uploads/4seat_white_plane.gltf"},"model":{"filename":"4seat_white_plane.kmz","path":"public/uploads","size":19797,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/4seat_white_plane.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"blink","type":"other"},{"__v":0,"_id":"539b1a244c99042b318e5f10","description":"4seat_aileron_left","dirOffset":-0.9,"name":"4seat_aileron_left","posOffset":-4,"upOffset":2.4,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":1,"componentsYScale":1,"componentsXScale":1,"speed":0,"maxAltitude":-1,"maxAlt":0,"maxTilt":45,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0.001,"createdAt":"2014-06-13T15:35:00.000Z","modelGl":{"filename":"4seat_aileron_left.gltf","path":"public/uploads","size":20805,"filetype":"application/octet-stream","url":"/uploads/4seat_aileron_left.gltf"},"model":{"filename":"4seat_aileron_left.kmz","path":"public/uploads","size":3187,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/4seat_aileron_left.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"other","type":"aileron"},{"__v":0,"_id":"539b1a334c99042b318e5f11","description":"4seat_aileron_right","dirOffset":-0.9,"name":"4seat_aileron_right","posOffset":3.7,"upOffset":2.4,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":1,"componentsYScale":1,"componentsXScale":1,"speed":0,"maxAltitude":-1,"maxAlt":0,"maxTilt":45,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0.001,"createdAt":"2014-06-13T15:35:15.000Z","modelGl":{"filename":"4seat_aileron_right.gltf","path":"public/uploads","size":20817,"filetype":"application/octet-stream","url":"/uploads/4seat_aileron_right.gltf"},"model":{"filename":"4seat_aileron_right.kmz","path":"public/uploads","size":3183,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/4seat_aileron_right.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"other","type":"aileron"},{"__v":0,"_id":"539b1ad570931c1e31c9f09e","description":"4seat_elevator","dirOffset":-5.6,"name":"4seat_elevator","posOffset":0,"upOffset":1.4,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":1,"componentsYScale":1,"componentsXScale":1,"speed":0,"maxAltitude":-1,"maxAlt":0,"maxTilt":25,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0.001,"createdAt":"2014-06-13T15:37:57.000Z","modelGl":{"filename":"4seat_elevator.gltf","path":"public/uploads","size":25156,"filetype":"application/octet-stream","url":"/uploads/4seat_elevator.gltf"},"model":{"filename":"4seat_elevator.kmz","path":"public/uploads","size":4797,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/4seat_elevator.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"other","type":"elevator"},{"__v":0,"_id":"539b1aa04c99042b318e5f12","description":"4seat_flap","dirOffset":-1,"name":"4seat_flap","posOffset":0,"upOffset":2.35,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":1,"componentsYScale":1,"componentsXScale":1,"speed":0,"maxAltitude":-1,"maxAlt":0,"maxTilt":45,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0.001,"createdAt":"2014-06-13T15:37:04.000Z","modelGl":{"filename":"4seat_flap.gltf","path":"public/uploads","size":20803,"filetype":"application/octet-stream","url":"/uploads/4seat_flap.gltf"},"model":{"filename":"4seat_flap.kmz","path":"public/uploads","size":2586,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/4seat_flap.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"other","type":"flap"},{"__v":0,"_id":"539b1a1036c04a2231ff67d4","description":"4seat_rudder","dirOffset":-6.05,"name":"4seat_rudder","posOffset":0,"upOffset":1.63,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":1,"componentsYScale":1,"componentsXScale":1,"speed":0,"maxAltitude":-1,"maxAlt":0,"maxTilt":0,"maxRoll":0,"maxRotation":45,"tilt":0,"roll":0,"rotation":0.001,"createdAt":"2014-06-13T15:34:40.000Z","modelGl":{"filename":"4seat_rudder.gltf","path":"public/uploads","size":31103,"filetype":"application/octet-stream","url":"/uploads/4seat_rudder.gltf"},"model":{"filename":"4seat_rudder.kmz","path":"public/uploads","size":4872,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/4seat_rudder.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"other","type":"rudder"}],"locations":[{"__v":0,"_id":"544a52416774c8467be4a7d7","description":"Courchevel altiport","name":"Courchevel altiport Approach","limits":[],"requiredMeters":7000,"createdAt":"2014-10-24T13:21:05.000Z","circuits":[],"speed":300,"altitude":400,"heading":220,"longitude":6.665685539917,"latitude":45.420382308847,"order":-1,"published":true},{"__v":0,"_id":"544a524398a3b6407b809bd4","description":"Mountain Air, Burnsville","name":"Mountain Air, Burnsville Approach","limits":[],"requiredMeters":30000,"createdAt":"2014-10-24T13:21:07.000Z","circuits":[],"speed":290,"altitude":600,"heading":315,"longitude":-82.30944318642,"latitude":35.840297246449,"order":-1,"published":true},{"__v":0,"_id":"544a524324f21e3a7b80725d","description":"Meribel Airport","name":"Meribel Airport Approach","limits":[],"requiredMeters":40000,"createdAt":"2014-10-24T13:21:07.000Z","circuits":[],"speed":300,"altitude":350,"heading":155,"longitude":6.566325957581,"latitude":45.423507926387,"order":-1,"published":true},{"__v":0,"_id":"544a5244a430b4397b49ba54","description":"Megeve Airport","name":"Megeve Airport Approach","limits":[],"requiredMeters":50000,"createdAt":"2014-10-24T13:21:08.000Z","circuits":[],"speed":310,"altitude":300,"heading":160,"longitude":6.631325724731,"latitude":45.851279259839,"order":-1,"published":true},{"__v":0,"_id":"544a524498a3b6407b809bd6","description":"Alpe d'Huez Airport","name":"Alpe d'Huez Airport Approach","limits":[],"requiredMeters":60000,"createdAt":"2014-10-24T13:21:08.000Z","circuits":[],"speed":240,"altitude":800,"heading":60,"longitude":6.045012560547,"latitude":45.073217154411,"order":-1,"published":true},{"__v":0,"_id":"544a524698a3b6407b809bd7","description":"Chagual Airport, Peru","name":"Chagual Airport Approach","limits":[],"requiredMeters":70000,"createdAt":"2014-10-24T13:21:10.000Z","circuits":[],"speed":230,"altitude":50,"heading":135,"longitude":-77.68174409051,"latitude":-7.766151419473,"order":-1,"published":true},{"__v":0,"_id":"534d58a5f30c9a1b2bc2eca0","description":"Tenzing-Hillary Airport","name":"Tenzing-Hillary Airport","limits":[],"requiredMeters":125000,"createdAt":"2014-04-15T16:04:53.000Z","circuits":[],"speed":0,"altitude":-1,"heading":240,"longitude":86.731700136246,"latitude":27.687901503917,"order":-1,"published":true},{"__v":0,"_id":"544e9a8d1b85536739c2f675","description":"Chaves Airport","name":"Chaves Airport","limits":[],"requiredMeters":175000,"createdAt":"2014-10-27T19:18:37.000Z","circuits":[],"speed":0,"altitude":0,"heading":153,"longitude":-7.46498465538,"latitude":41.725301596205,"order":-1,"published":true},{"__v":0,"_id":"534d5f6486ff665e2eb83a17","description":"Prague Airport","name":"Prague Airport","limits":[],"requiredMeters":200000,"createdAt":"2014-04-15T16:33:40.000Z","circuits":[],"speed":0,"altitude":-1,"heading":247,"longitude":14.272836952454,"latitude":50.115796755453,"order":-1,"published":true},{"__v":0,"_id":"534d5e7707b608f62d92558c","description":"Albrook Airport","name":"Albrook Airport","limits":[],"requiredMeters":225000,"createdAt":"2014-04-15T16:29:43.000Z","circuits":[],"speed":0,"altitude":-1,"heading":0,"longitude":-79.555950164795,"latitude":8.969126019414,"order":-1,"published":true},{"__v":0,"_id":"534d5fed86ff665e2eb83a22","description":"Salzburg Airport","name":"Salzburg Airport","limits":[],"requiredMeters":250000,"createdAt":"2014-04-15T16:35:57.000Z","circuits":[],"speed":0,"altitude":-1,"heading":160,"longitude":12.996371681168,"latitude":47.805259119204,"order":-1,"published":true},{"__v":0,"_id":"534d6625dc38fca33009ac0b","description":"Oporto Airport","name":"Oporto Airport","limits":[],"requiredMeters":275000,"createdAt":"2014-04-15T17:02:29.000Z","circuits":[],"speed":0,"altitude":-1,"heading":350,"longitude":-8.677305579185,"latitude":41.233153301246,"order":-1,"published":true}],"hidden":false,"requiredShares":15,"requiredMeters":300000,"requiredPoints":0,"type":"plane","category":"plane","mainCategory":"air","published":true};
window.vehicles = {};
window.vehicles[window.myVehicle._id] = window.myVehicle;

window.keybindings = {
	"gamepad":{"pause":{"key":9,"type":"button"},"gearDown":{"key":12,"type":"button"},"gearUp":{"key":11,"type":"button"},"automatic":{"key":10,"type":"button"},"fps":{"key":16,"type":"button"},"compass":{"key":15,"type":"button"},"cruiseControl":{"key":8,"type":"button"},"camera":{"key":0,"type":"button"},"lookBack":{"key":2,"type":"button"},"lookFront":{"key":3,"type":"button"},"lookRight":{"key":5,"type":"button"},"lookLeft":{"key":4,"type":"button"},"handbrake":{"key":1,"type":"button"},"down":{"key":1,"type":"axis"},"up":{"key":1,"type":"axis"},"right":{"key":0,"type":"axis"},"left":{"key":0,"type":"axis"},
		"brake":{"key":6,"type":"button"},
		"throttle":{"key":7,"type":"button"}
	},
	"keyboard":{"pause":"p","gearDown":"s","gearUp":"w","automatic":"t","fps":"u","compass":"o","cruiseControl":"v","camera":"c","lookBack":"e","lookFront":"q","lookRight":"d","lookLeft":"a",
		"handbrake":"space",
		"down":"down",
		"up":"up",
		"right":"right",
		"left":"left",
		"brake":"s",
		"throttle":"w"
	}
};
