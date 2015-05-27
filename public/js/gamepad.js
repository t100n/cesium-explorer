/**
 * Created by t100n on 28/07/14.
 */
function Gamepad(keybindings) {
    this.keybindings = keybindings;

    this.axes = {
        leftStickX: 0,
        leftStickY: 1
    };

    this.buttons = {
        throttle: 2,
        brake: 3,
        handbrake: 1,
        camera: 0,
        cruiseControl: 8,
        compass: 15,
        fps: 16,
        autopilot: 17,
        pause: 9,
        tiltUp: 6,
        tiltDown: 7,
        lookFront: 10,
        lookBack: 11,
        lookLeft: 4,
        lookRight: 5,
        automatic: 12,
        gearUp: 13,
        gearDown: 14
    };

    this.viewX = 0;
    this.viewY = 0;
    this.tilt = 0;
    this.steering = 0;
    this.throttle = 0;
    this.brake = 0;
    this.handbrake = 0;
    this.camera = 0;
    this.cruiseControl = 0;
    this.compass = 0;
    this.fps = 0;
    this.autopilot = 0;
    this.automatic = 0;
    this.gearUp = 0;
    this.gearDown = 0;
    this.pause = false;

    this.isDown = {};
    this.isUp = {};
    this.isPressed = {};

    this.pollInterval = false;

    this.gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

    this.startVibrate = function() {
        if (typeof navigator.mozVibrate == "function") {
            // Shake that device!
            // Vibrate once for 1 second
            navigator.mozVibrate(50);
        }
        else if (typeof navigator.vibrate == "function") {
            // Shake that device!
            // Vibrate once for 1 second
            navigator.vibrate(50);
        }
        else {
            // Not supported
        }
    };

    this.stopVibrate = function() {
        if (typeof navigator.mozVibrate == "function") {
            // Stop vibrating
            navigator.mozVibrate(0);
        }
        else if (typeof navigator.vibrate == "function") {
            // Stop vibrating
            navigator.vibrate(0);
        }
        else {
            // Not supported
        }
    };

    this.poll = function() {
        this.gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

        for(var i= 0, n=this.gamepads.length; i<n; i++) {
            var gamepad = this.gamepads[i];

            //log("info", gamepad);

            if(gamepad) {
                this.updateControls(gamepad);
            }//if
        }//for
    };

    this.buttonPressed = function(button) {
        if (typeof(button) == "object")
            return button.pressed;

        return button > 0.5;
    };

    this.getButtonPressed = function() {
        this.gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

        for(var i= 0, n=this.gamepads.length; i<n; i++) {
            var controller = this.gamepads[i];

            if(controller) {

                for (var j = 0; j < controller.buttons.length; j++) {
                    // Only continue if button is pressed
                    if (!this.buttonPressed(controller.buttons[j])) {
                        continue;
                    }

                    return {
                        type: "button",
                        key: j
                    };
                }//for

                // Axes (joysticks and triggers)
                for (var k = 0; k < controller.axes.length; k++) {
                    if(parseInt(controller.axes[k]) != 0) {
                        return {
                            type: "axis",
                            key: k
                        };
                    }//if
                }//for

            }//if
        }//for

        return false;
    };

    this.updateControls = function(controller) {
        this.tilt = 0;
        this.throttle = 0;
        this.brake = 0;
        this.handbrake = 0;
        this.camera = 0;
        this.cruiseControl = 0;
        this.compass = 0;
        this.fps = 0;
        this.autopilot = 0;
        this.automatic = 0;
        this.gearUp = 0;
        this.gearDown = 0;
        this.viewX = 0;
        this.viewY = 0;

        for (var j = 0; j < controller.buttons.length; j++) {
            // Only continue if button is pressed
            if (!this.buttonPressed(controller.buttons[j])) {
                this.isUp[j] = true;

                continue;
            }

            this.isDown[j] = true;

            if(this.keybindings.gamepad.left.type == "button" && this.keybindings.gamepad.left.key == j) {
                this.steering = -1;
            }//if
            if(this.keybindings.gamepad.right.type == "button" && this.keybindings.gamepad.right.key == j) {
                this.steering = 1;
            }//if
            if(this.keybindings.gamepad.throttle.type == "button" && this.keybindings.gamepad.throttle.key == j) {
                this.throttle = 1;
            }//if
            if(this.keybindings.gamepad.brake.type == "button" && this.keybindings.gamepad.brake.key == j) {
                this.brake = 1;
            }//if
            if(this.keybindings.gamepad.pause.type == "button" && this.keybindings.gamepad.pause.key == j && this.isUp[j] && cesiumExplorer.physics) {
                cesiumExplorer.physics.pause = this.pause = !this.pause;

                if(this.pause) {

                    clearInterval(this.pollInterval);

                    var that = this;
                    this.pollInterval = setInterval(function() {
                        that.poll();
                    }, 50);

                    google.earth.removeEventListener(cesiumExplorer.physics.ge, "frameend", $bind(cesiumExplorer.physics, cesiumExplorer.physics.update))

                    window.audioMonkey.stopAll();
                    //window.audioMonkey.pauseAll();
                }//if
                else {
                    clearInterval(this.pollInterval);

                    cesiumExplorer.game.lastUpdate = Date.now();

                    google.earth.addEventListener(cesiumExplorer.physics.ge, "frameend", $bind(cesiumExplorer.physics, cesiumExplorer.physics.update))

                    //window.audioMonkey.resumeAll();
                }//else
            }//if
            if(this.keybindings.gamepad.handbrake.type == "button" && this.keybindings.gamepad.handbrake.key == j) {
                this.handbrake = 1;
            }//if
            if(this.keybindings.gamepad.camera.type == "button" && this.keybindings.gamepad.camera.key == j) {
                this.camera = 1;
            }//if
            if(this.keybindings.gamepad.cruiseControl.type == "button" && this.keybindings.gamepad.cruiseControl.key == j) {
                this.cruiseControl = 1;
            }//if
            if(this.keybindings.gamepad.compass.type == "button" && this.keybindings.gamepad.compass.key == j) {
                this.compass = 1;
            }//if
            if(this.keybindings.gamepad.fps.type == "button" && this.keybindings.gamepad.fps.key == j) {
                this.fps = 1;
            }//if
            if(this.keybindings.gamepad.autopilot.type == "button" && this.keybindings.gamepad.autopilot.key == j) {
                this.autopilot = 1;
            }//if
            if(this.keybindings.gamepad.automatic.type == "button" && this.keybindings.gamepad.automatic.key == j) {
                this.automatic = 1;
            }//if
            if(this.keybindings.gamepad.gearUp.type == "button" && this.keybindings.gamepad.gearUp.key == j) {
                this.gearUp = 1;
            }//if
            if(this.keybindings.gamepad.gearDown.type == "button" && this.keybindings.gamepad.gearDown.key == j) {
                this.gearDown = 1;
            }//if
            if(this.keybindings.gamepad.lookLeft.type == "button" && this.keybindings.gamepad.lookLeft.key == j) {
                this.viewX = -1;
            }//if
            if(this.keybindings.gamepad.lookRight.type == "button" && this.keybindings.gamepad.lookRight.key == j) {
                this.viewX = 1;
            }//if
            if(this.keybindings.gamepad.lookBack.type == "button" && this.keybindings.gamepad.lookBack.key == j) {
                this.viewY = -1;
            }//if
            if(this.keybindings.gamepad.lookFront.type == "button" && this.keybindings.gamepad.lookFront.key == j) {
                this.viewY = 1;
            }//if
            if(this.keybindings.gamepad.up.type == "button" && this.keybindings.gamepad.up.key == j) {
                this.tilt = -1;
            }//if
            if(this.keybindings.gamepad.down.type == "button" && this.keybindings.gamepad.down.key == j) {
                this.tilt = 1;
            }//if

            this.isUp[j] = false;

            //log("info", j);

            //log("info", this.buttons[type].cross, this.buttons[type].square, this.buttons[type].a, this.buttons[type].x, j, this.rightStickY);
        }//for

        // Axes (joysticks and triggers)
        for (var k = 0; k < controller.axes.length; k++) {
            //log("info", k, controller.axes[k]);

            if(this.keybindings.gamepad.left.type == "axis" && this.keybindings.gamepad.left.key == k) {
                this.steering = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.right.type == "axis" && this.keybindings.gamepad.right.key == k) {
                this.steering = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.throttle.type == "axis" && this.keybindings.gamepad.throttle.key == k) {
                this.throttle = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.brake.type == "axis" && this.keybindings.gamepad.brake.key == k) {
                this.brake = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.pause.type == "axis" && this.keybindings.gamepad.pause.key == k && parseInt(Math.abs(controller.axes[k])) > 0 && cesiumExplorer.physics) {
                cesiumExplorer.physics.pause = this.pause = !this.pause;

                if(this.pause) {
                    clearInterval(this.pollInterval);

                    var that = this;
                    this.pollInterval = setInterval(function() {
                        that.poll();
                    }, 50);

                    google.earth.removeEventListener(cesiumExplorer.physics.ge, "frameend", $bind(cesiumExplorer.physics, cesiumExplorer.physics.update))

                    window.audioMonkey.stopAll();
                    //window.audioMonkey.pauseAll();
                }//if
                else {
                    clearInterval(this.pollInterval);

                    cesiumExplorer.game.lastUpdate = Date.now();

                    google.earth.addEventListener(cesiumExplorer.physics.ge, "frameend", $bind(cesiumExplorer.physics, cesiumExplorer.physics.update))

                    //window.audioMonkey.resumeAll();
                }//else
            }//if
            if(this.keybindings.gamepad.handbrake.type == "axis" && this.keybindings.gamepad.handbrake.key == k) {
                this.handbrake = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.camera.type == "axis" && this.keybindings.gamepad.camera.key == k) {
                this.camera = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.cruiseControl.type == "axis" && this.keybindings.gamepad.cruiseControl.key == k) {
                this.cruiseControl = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.compass.type == "axis" && this.keybindings.gamepad.compass.key == k) {
                this.compass = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.fps.type == "axis" && this.keybindings.gamepad.fps.key == k) {
                this.fps = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.autopilot.type == "axis" && this.keybindings.gamepad.autopilot.key == k) {
                this.autopilot = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.automatic.type == "axis" && this.keybindings.gamepad.automatic.key == k) {
                this.automatic = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.gearUp.type == "axis" && this.keybindings.gamepad.gearUp.key == k) {
                this.gearUp = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.gearDown.type == "axis" && this.keybindings.gamepad.gearDown.key == k) {
                this.gearDown = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.lookLeft.type == "axis" && this.keybindings.gamepad.lookLeft.key == k) {
                this.viewX = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.lookRight.type == "axis" && this.keybindings.gamepad.lookRight.key == k) {
                this.viewX = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.lookBack.type == "axis" && this.keybindings.gamepad.lookBack.key == k) {
                this.viewY = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.lookFront.type == "axis" && this.keybindings.gamepad.lookFront.key == k) {
                this.viewY = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.up.type == "axis" && this.keybindings.gamepad.up.key == k) {
                this.tilt = controller.axes[k];
            }//if
            if(this.keybindings.gamepad.down.type == "axis" && this.keybindings.gamepad.down.key == k) {
                this.tilt = controller.axes[k];
            }//if

            //if(this.axes.leftStickX == k) this.steering = controller.axes[k];
            //if(this.axes.leftStickY == k) this.viewY = controller.axes[k]*-1;
        }//for
    };

    this.getLeftStickX = function() {
        return this.steering;
    };

    this.getLeftTilt = function() {
        return parseInt(this.tilt);
    };

    this.getThrottle = function() {
        return this.throttle;
    };

    this.getBrake = function() {
        return this.brake;
    };

    this.getPause = function() {
        return this.pause;
    };

    this.getHandbrake = function() {
        return this.handbrake;
    };

    this.getCamera = function() {
        return this.camera;
    };

    this.getCruiseControl = function() {
        return this.cruiseControl;
    };

    this.getCompass = function() {
        return this.compass;
    };

    this.getFps = function() {
        return this.fps;
    };

    this.getAutopilot = function() {
        return this.autopilot;
    };

    this.getAutomatic = function() {
        return this.automatic;
    };

    this.getGearUp = function() {
        return this.gearUp;
    };

    this.getGearDown = function() {
        return this.gearDown;
    };

    this.getViewX = function() {
        return this.viewX;
    };

    this.getViewY = function() {
        return this.viewY;
    };

    var that = this;

    if ('ongamepadconnected' in window) {
        window.addEventListener('gamepadconnected',
            function(e) {
                log("info", e);

                that.gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);

            }, false);

        window.addEventListener('gamepaddisconnected',
            function(e) { log("info", e); }, false);
    }

}
