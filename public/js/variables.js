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

window.myVehicle = {"__v":7,"_id":"533468b0a03300b0691ad397","accountType":1,"crashsoundtime":1,"description":"","fastsoundtime":1,"modelheight":1,"name":"Heli VIP","r0":0.01,"r1":0.01,"rolldamp":-0.16,"rollspring":0.5,"soundtime":1,"speedmaxturn":5,"speedminturn":50,"suspensiondamping":0.5,"suspensiondeltatime":0.25,"suspensionstiffness":1,"tiltdamp":-0.15,"tiltspring":0.7,"turnspeedmax":60,"turnspeedmin":20,"wheelmodelxscale":1,"wheelmodelyscale":1,"wheelmodelzscale":1,"createdAt":"2014-03-27T18:06:40.000Z","showRPM":false,"showAltitude":true,"showSpeed":true,"keys":{"fa-minus":"Zoom Out","fa-plus":"Zoom In","fa-arrow-right":"Steer Right","fa-arrow-left":"Steer Left","fa-arrow-down":"Brake / Reverse","fa-arrow-up":"Accelerate"},"location":{"lat":1,"lon":1},"fourWheelDrive":false,"absoluteCeiling":13000,"maxGear":5,"sixthGearRatioTopSpeed":1.2,"fifthGearRatioTopSpeed":1,"fourthGearRatioTopSpeed":0.8,"thirdGearRatioTopSpeed":0.6,"secondGearRatioTopSpeed":0.4,"firstGearRatioTopSpeed":0.2,"reverseGearRatioTopSpeed":0.2,"sixthGearRatio":0.5,"fifthGearRatio":0.74,"fourthGearRatio":1,"thirdGearRatio":1.3,"secondGearRatio":1.78,"firstGearRatio":2.66,"reverseGearRatio":-0.275,"brakeRatio":1,"liftOffMinSpeed":70,"slipFactor":0,"slipMinimumRate":0.5,"slipLoopEnd":0,"slipLoopStart":0,"soundMinimumRate":0.5,"soundLoopEnd":3,"soundLoopStart":0,"sound":{"duration":3,"mp3":{"filename":"","path":"","size":0,"filetype":"","url":""},"ogg":{"filename":"heli_YBQ.ogg","path":"public/uploads","size":50489,"filetype":"video/ogg","url":"/uploads/heli_YBQ.ogg"}},"tireMarkDelay":1000,"tireMarkSizeY":0.5,"tireMarkSizeX":0.1,"tireMarkPosOffset":0,"tireMarkDirOffset":0,"shadowY":9.275,"shadowX":9.275,"shadowPosOffset":0,"shadowDirOffset":0,"shadow":{"tire":{"filename":"","path":"","size":0,"filetype":"","url":""},"body":{"filename":"prime_heli.png","path":"public/uploads","size":19339,"filetype":"image/png","url":"/uploads/prime_heli.png"}},"wheelsoffset":0.01,"wheelsheight":0.01,"wheelsdistance":2,"axisdistance":2,"minGroundAlt":59.80105302874212,"minVolume":10,"maxVolume":60,"tiltFactor":0.35,"traction":1,"vehicleagility":0.00005,"massI":20000,"mass":1000,"traildistance":13,"camtilt":1,"camheight":3.1,"gravity":2.8,"decel":20,"maxrevspeed":30,"minaccelstep":5,"accelstep":15,"accel":5,"maxspeed":250,"rudderAngleScale":3,"maxSteeringAngle":3,"suspensionDamper":8000,"suspensionSpring":10000,"suspensionMass":5000,"suspensionrestlength":1,"rollDamper":8000,"rollSpring":10000,"rollMass":3000,"rollclamp":20,"steerroll":10,"tiltDamper":3000,"tiltSpring":5000,"tiltMass":3000,"tiltclamp":20,"steertilt":-10,"bodyWidth":1.81,"bodyLength":4.495,"rearY":1.296,"wheelBase":2.65,"tread":1.4,"wheelRadius":0.35,"upOffset":0,"vehiclealt":3.1,"modelzscale":1,"modelyscale":1,"modelxscale":1,"chassi":{"filename":"heli_vip.gltf","path":"public/uploads","size":2325254,"filetype":"application/octet-stream","url":"/uploads/heli_vip.gltf"},"chassimodel":{"filename":"prime_heli_1.kmz","path":"public/uploads","size":183297,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/prime_heli_1.kmz"},"logo":{"filename":"prime_heli_profile_small.png","path":"public/uploads","size":12760,"filetype":"image/png","url":"/uploads/prime_heli_profile_small.png"},"order":-1,"vehicleCameras":null,"vehicleComponents":[{"__v":0,"_id":"5334728bd111fee16dc56ca9","description":"Heli VIP Smoke Left","dirOffset":-0.8,"name":"Heli VIP Smoke Left","posOffset":-0.45,"upOffset":2.7,"damper":5000,"spring":80000,"mass":375,"sacalable":true,"maxComponentsZScale":2,"maxComponentsYScale":2,"maxComponentsXScale":2,"minComponentsZScale":0.05,"minComponentsYScale":0.05,"minComponentsXScale":0.05,"componentsZScale":0.05,"componentsYScale":0.05,"componentsXScale":0.05,"speed":0,"maxAltitude":-1,"maxAlt":0,"maxTilt":0,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0,"createdAt":"2014-03-27T18:48:43.000Z","modelGl":{"filename":"youbeq_smoke.gltf","path":"public/uploads","size":1187412,"filetype":"application/octet-stream","url":"/uploads/youbeq_smoke.gltf"},"model":{"filename":"youbeq_smoke.kmz","path":"public/uploads","size":215211,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/youbeq_smoke.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"other","type":"smoke"},{"__v":0,"_id":"53347368d111fee16dc56cb7","description":"Heli VIP Smoke Right","dirOffset":-0.8,"name":"Heli VIP Smoke Right","posOffset":0.45,"upOffset":2.7,"damper":5000,"spring":80000,"mass":375,"sacalable":true,"maxComponentsZScale":2,"maxComponentsYScale":2,"maxComponentsXScale":2,"minComponentsZScale":0.05,"minComponentsYScale":0.05,"minComponentsXScale":0.05,"componentsZScale":0.05,"componentsYScale":0.05,"componentsXScale":0.05,"speed":0,"maxAltitude":-1,"maxAlt":0,"maxTilt":0,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0,"createdAt":"2014-03-27T18:52:24.000Z","modelGl":{"filename":"youbeq_smoke.gltf","path":"public/uploads","size":1187412,"filetype":"application/octet-stream","url":"/uploads/youbeq_smoke.gltf"},"model":{"filename":"youbeq_smoke.kmz","path":"public/uploads","size":215211,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/youbeq_smoke.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"other","type":"smoke"},{"__v":0,"_id":"534d05bee6709514186619f0","description":"Heli VIP Rotor","dirOffset":0,"name":"Heli VIP Rotor","posOffset":0,"upOffset":3.1,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":0.88,"minComponentsYScale":0.88,"minComponentsXScale":0.88,"componentsZScale":0.88,"componentsYScale":0.88,"componentsXScale":0.88,"speed":75,"maxAltitude":-1,"maxAlt":0,"maxTilt":0,"maxRoll":0,"maxRotation":360,"tilt":0,"roll":0,"rotation":0.001,"createdAt":"2014-04-15T10:11:10.000Z","modelGl":{"filename":"heli_rotor_3.gltf","path":"public/uploads","size":148248,"filetype":"application/octet-stream","url":"/uploads/heli_rotor_3.gltf"},"model":{"filename":"heli_rotor_3.kmz","path":"public/uploads","size":66832,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/heli_rotor_3.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"rotate","type":"helice"},{"__v":0,"_id":"538870dea920379e5f531b1e","description":"Heli VIP Red","dirOffset":-4,"name":"Heli VIP Red","posOffset":-0.88,"upOffset":1.78,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":2,"componentsYScale":2,"componentsXScale":2,"speed":1250,"maxAltitude":-1,"maxAlt":0,"maxTilt":0,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0,"createdAt":"2014-05-30T11:51:58.000Z","modelGl":{"filename":"red_heli_vip.gltf","path":"public/uploads","size":40328,"filetype":"application/octet-stream","url":"/uploads/red_heli_vip.gltf"},"model":{"filename":"red_heli_vip.kmz","path":"public/uploads","size":24144,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/red_heli_vip.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"blink","type":"other"},{"__v":0,"_id":"538897dfad5e20915fdf1602","description":"Heli VIP Green","dirOffset":-4,"name":"Heli VIP Green","posOffset":0.85,"upOffset":1.78,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":2,"componentsYScale":2,"componentsXScale":2,"speed":1000,"maxAltitude":-1,"maxAlt":0,"maxTilt":0,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0,"createdAt":"2014-05-30T14:38:23.000Z","modelGl":{"filename":"green_heli_vip.gltf","path":"public/uploads","size":42388,"filetype":"application/octet-stream","url":"/uploads/green_heli_vip.gltf"},"model":{"filename":"green_heli_vip.kmz","path":"public/uploads","size":25692,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/green_heli_vip.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"blink","type":"other"},{"__v":0,"_id":"538897eda920379e5f531bc6","description":"Heli VIP White","dirOffset":-7.1,"name":"Heli VIP White","posOffset":0.19,"upOffset":3.14,"damper":5000,"spring":80000,"mass":375,"sacalable":false,"maxComponentsZScale":1,"maxComponentsYScale":1,"maxComponentsXScale":1,"minComponentsZScale":1,"minComponentsYScale":1,"minComponentsXScale":1,"componentsZScale":1,"componentsYScale":1,"componentsXScale":1,"speed":750,"maxAltitude":-1,"maxAlt":0,"maxTilt":0,"maxRoll":0,"maxRotation":0,"tilt":0,"roll":0,"rotation":0,"createdAt":"2014-05-30T14:38:37.000Z","modelGl":{"filename":"white_heli_vip.gltf","path":"public/uploads","size":34528,"filetype":"application/octet-stream","url":"/uploads/white_heli_vip.gltf"},"model":{"filename":"white_heli_vip.kmz","path":"public/uploads","size":19797,"filetype":"application/vnd.google-earth.kmz","url":"/uploads/white_heli_vip.kmz"},"order":-1,"joints":[],"siblings":[],"specialBehaviour":"blink","type":"other"}],"locations":[{"__v":1,"_id":"534d4e24691594cd26fc1707","description":"Washington","name":"Washington","limits":[],"requiredMeters":0,"createdAt":"2014-04-15T15:20:04.000Z","circuits":["53c94afd019e69f11f1b9f0a"],"speed":0,"altitude":-1,"heading":0,"longitude":-77.036519050598,"latitude":38.893057119236,"order":-1,"published":true},{"__v":0,"_id":"534d4c43691594cd26fc16a7","description":"Paris","name":"Paris","limits":[],"requiredMeters":200000,"createdAt":"2014-04-15T15:12:03.000Z","circuits":[],"speed":0,"altitude":-1,"heading":320,"longitude":2.302545011044,"latitude":48.853108037537,"order":-1,"published":true},{"__v":0,"_id":"534d4c1f691594cd26fc16a1","description":"Barcelona","name":"Barcelona","limits":[],"requiredMeters":300000,"createdAt":"2014-04-15T15:11:27.000Z","circuits":[],"speed":0,"altitude":-1,"heading":90,"longitude":2.184624373913,"latitude":41.402870893411,"order":-1,"published":true},{"__v":0,"_id":"534d4c5f691594cd26fc16ad","description":"London","name":"London","limits":[],"requiredMeters":400000,"createdAt":"2014-04-15T15:12:31.000Z","circuits":[],"speed":0,"altitude":-1,"heading":230,"longitude":-0.139370262623,"latitude":51.502394792273,"order":-1,"published":true},{"__v":0,"_id":"534d4c84691594cd26fc16b3","description":"Berlin","name":"Berlin","limits":[],"requiredMeters":500000,"createdAt":"2014-04-15T15:13:08.000Z","circuits":[],"speed":0,"altitude":-1,"heading":90,"longitude":13.373613568652,"latitude":52.5186425683,"order":-1,"published":true},{"__v":0,"_id":"534d4dad691594cd26fc16d5","description":"Beijing","name":"Beijing","limits":[],"requiredMeters":600000,"createdAt":"2014-04-15T15:18:05.000Z","circuits":[],"speed":0,"altitude":-1,"heading":0,"longitude":116.391381025314,"latitude":39.9040609647,"order":-1,"published":true},{"__v":0,"_id":"534d4ccd691594cd26fc16bf","description":"Cape Town","name":"Cape Town","limits":[],"requiredMeters":700000,"createdAt":"2014-04-15T15:14:21.000Z","circuits":[],"speed":0,"altitude":-1,"heading":0,"longitude":18.410575389862,"latitude":-33.907866889865,"order":-1,"published":true},{"__v":0,"_id":"534d4de6691594cd26fc16f6","description":"Shanghai","name":"Shanghai","limits":[],"requiredMeters":800000,"createdAt":"2014-04-15T15:19:02.000Z","circuits":[],"speed":0,"altitude":-1,"heading":0,"longitude":121.501278877258,"latitude":31.238370218922,"order":-1,"published":true},{"__v":0,"_id":"534d4caa691594cd26fc16b9","description":"Moscow","name":"Moscow","limits":[],"requiredMeters":900000,"createdAt":"2014-04-15T15:13:46.000Z","circuits":[],"speed":0,"altitude":-1,"heading":330,"longitude":37.6231823203,"latitude":55.751285487726,"order":-1,"published":true},{"__v":0,"_id":"534d4d59691594cd26fc16cb","description":"Brasília","name":"Brasília","limits":[],"requiredMeters":1000000,"createdAt":"2014-04-15T15:16:41.000Z","circuits":[],"speed":0,"altitude":-1,"heading":270,"longitude":-47.87262976169586,"latitude":-15.796959601296173,"order":-1,"published":true},{"__v":0,"_id":"534d4e5d2281a525285269bf","description":"Ottawa","name":"Ottawa","limits":[],"requiredMeters":1100000,"createdAt":"2014-04-15T15:21:01.000Z","circuits":[],"speed":0,"altitude":-1,"heading":330,"longitude":-75.698867825162,"latitude":45.423926976704,"order":-1,"published":true},{"__v":0,"_id":"534d4e07691594cd26fc16fe","description":"Sydney","name":"Sydney","limits":[],"requiredMeters":1200000,"createdAt":"2014-04-15T15:19:35.000Z","circuits":[],"speed":0,"altitude":-1,"heading":0,"longitude":151.214984866489,"latitude":-33.861601087988,"order":-1,"published":true}],"hidden":false,"requiredShares":25,"requiredMeters":750000,"requiredPoints":0,"type":"heli","category":"helicopter","mainCategory":"air","published":true};
window.vehicles = {
	'533468b0a03300b0691ad397': window.myVehicle
};

window.keybindings = {"gamepad":{"pause":{"key":9,"type":"button"},"gearDown":{"key":12,"type":"button"},"gearUp":{"key":11,"type":"button"},"automatic":{"key":10,"type":"button"},"fps":{"key":16,"type":"button"},"compass":{"key":15,"type":"button"},"cruiseControl":{"key":8,"type":"button"},"camera":{"key":0,"type":"button"},"lookBack":{"key":2,"type":"button"},"lookFront":{"key":3,"type":"button"},"lookRight":{"key":5,"type":"button"},"lookLeft":{"key":4,"type":"button"},"handbrake":{"key":1,"type":"button"},"down":{"key":1,"type":"axis"},"up":{"key":1,"type":"axis"},"right":{"key":0,"type":"axis"},"left":{"key":0,"type":"axis"},"brake":{"key":6,"type":"button"},"throttle":{"key":7,"type":"button"}},"keyboard":{"pause":"p","gearDown":"s","gearUp":"w","automatic":"t","fps":"u","compass":"o","cruiseControl":"v","camera":"c","lookBack":"e","lookFront":"q","lookRight":"d","lookLeft":"a","handbrake":"space","down":"s","up":"w","right":"right","left":"left","brake":"down","throttle":"up"}};
