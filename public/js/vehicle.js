var vehicle = {};
vehicle.Accelerometer = function () {
    this.prevPosition = new Math3D.geometry.Vector3(0, 0, 0);
    this.prevVelocity = new Math3D.geometry.Vector3(0, 0, 0);
    this.position = new Math3D.geometry.Vector3(0, 0, 0);
    this.velocity = new Math3D.geometry.Vector3(0, 0, 0);
    this.acceleration = new Math3D.geometry.Vector3(0, 0, 0);

    this.update = function (deltaTime, newPosition) {
        var _this = this.prevPosition;
        var v = this.position;
        _this.x = v.x;
        _this.y = v.y;
        _this.z = v.z;
        var _this = this.position;
        _this.x = newPosition.x;
        _this.y = newPosition.y;
        _this.z = newPosition.z;
        var _this = this.prevVelocity;
        var v = this.velocity;
        _this.x = v.x;
        _this.y = v.y;
        _this.z = v.z;
        this.velocity = Math3D.geometry.Vector3.subVV(this.position, this.prevPosition).div(deltaTime);
        this.acceleration = Math3D.geometry.Vector3.subVV(this.velocity, this.prevVelocity).div(deltaTime)
    };

    this.getG = function () {
        return this.acceleration.get_magnitude() / 9.80665
    };

    this.getVector = function () {
        return this.acceleration.clone()
    };
};

vehicle.Box2DUtils = function () {};
vehicle.Box2DUtils.toKmh = function (mps) {
    return mps * 3600 / 1e3
};

vehicle.Box2DUtils.toMps = function (kmh) {
    return kmh * 1e3 / 3600
};

vehicle.Box2DUtils.createBox = function (world, x, y, w, h, position, radian, density, friction, restitution) {
    if (restitution == null) restitution = .2;
    if (friction == null) friction = .5;
    if (density == null) density = 1;
    if (radian == null) radian = 0;
    var bodyDef = new box2D.dynamics.B2BodyDef;
    bodyDef.type = box2D.dynamics.B2Body.b2_staticBody;
    bodyDef.position.set(x, y);
    var fixDef = new box2D.dynamics.B2FixtureDef;
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    var shape = new box2D.collision.shapes.B2PolygonShape;
    shape.setAsBox(w, h);
    fixDef.shape = shape;
    var body = world.createBody(bodyDef);
    if (position != null) body.setPosition(position);
    body.setAngle(radian);
    body.createFixture(fixDef);
    return body
};

vehicle.Box2DUtils.createCircle = function (world, x, y, radius, density, friction, restitution) {
    if (restitution == null) restitution = .2;
    if (friction == null) friction = .5;
    if (density == null) density = 1;
    var bodyDef = new box2D.dynamics.B2BodyDef;
    bodyDef.type = box2D.dynamics.B2Body.b2_dynamicBody;
    bodyDef.position.set(x, y);
    var fixDef = new box2D.dynamics.B2FixtureDef;
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    var shape = new box2D.collision.shapes.B2CircleShape;
    shape.setRadius(radius);
    fixDef.shape = shape;
    var body = world.createBody(bodyDef);
    body.createFixture(fixDef);
    return body
};

vehicle.Box2DUtils.createEdge = function (world, x1, y1, x2, y2) {
    var bodyDef = new box2D.dynamics.B2BodyDef;
    bodyDef.type = box2D.dynamics.B2Body.b2_staticBody;
    var v1 = new box2D.common.math.B2Vec2(x1, y1);
    var v2 = new box2D.common.math.B2Vec2(x2, y2);
    var shape = new box2D.collision.shapes.B2PolygonShape;
    shape.setAsEdge(v1, v2);
    var body = world.createBody(bodyDef);
    body.createFixture2(shape);
    return body
};

vehicle.Box2DUtils.createPolygon = function (world, vertices, position, radian, density, friction, restitution, categoryBits, maskBits) {
    if (maskBits == null) maskBits = 65535;
    if (categoryBits == null) categoryBits = 1;
    if (restitution == null) restitution = .2;
    if (friction == null) friction = .5;
    if (density == null) density = 1;
    if (radian == null) radian = 0;
    if (vertices.length >= 3) {
        var sum = 0;
        var l = vertices.length;
        var _g = 0;
        while (_g < l) {
            var i = _g++;
            sum += (vertices[i].x + vertices[(i + 1) % l].x) * (vertices[(i + 1) % l].y - vertices[i].y)
        }
        if (sum < 0) vertices.reverse()
    }
    var bodyDef = new box2D.dynamics.B2BodyDef;
    bodyDef.type = box2D.dynamics.B2Body.b2_staticBody;
    if (position != null) bodyDef.position.set(position.x, position.y);
    bodyDef.angle = radian;
    var shape = new box2D.collision.shapes.B2PolygonShape;
    shape.setAsVector(vertices);
    var fixDef = new box2D.dynamics.B2FixtureDef;
    fixDef.density = density;
    fixDef.friction = friction;
    fixDef.restitution = restitution;
    fixDef.shape = shape;
    fixDef.filter.categoryBits = categoryBits;
    fixDef.filter.maskBits = maskBits;
    var body = world.createBody(bodyDef);
    body.createFixture(fixDef);
    return body
};

vehicle.Box2DUtils.getFrontVector = function (body) {
    return body.getWorldVector(new box2D.common.math.B2Vec2(0, -1))
};

vehicle.Box2DUtils.project = function (vector, normal) {
    return box2D.common.math.B2Math.mulFV(box2D.common.math.B2Math.dot(vector, normal), vector)
};

vehicle.GearBox = function () {
    this.gear = 1;

    this.differentialRatio = 3.42;

    this.gearRatio = {
    	"-1": -2.9,
    	1: 2.66,
    	2: 1.78,
    	3: 1.3,
    	4: 1.0,
    	5: 0.74,
    	6: 0.5
    };
    this.gearRatioTopSpeed = {
        "-1": 0.2,
        1: 0.2,
        2: 0.4,
        3: 0.6,
        4: 0.8,
        5: 1,
        6: 1.2
    };
    this.maxGear = 6;

    this.getGearRatio = function () {
        var _g = this.gear;

        return this.gearRatio[_g];
    };

    this.getPreviousGearRatio = function () {
        var _g = this.gear - 1;

        return this.gearRatio[_g];
    };

    this.gearUp = function () {
    	if(this.gear < this.maxGear) {
        	this.gear += 1
        }//if

        if(this.gear == 0) this.gear = 1;
    };
    this.gearDown = function () {
    	if(this.gear > -1) {
        	this.gear -= 1
        }//if

        if(this.gear == 0) this.gear = -1;
    };
    this.getCurrentGear = function () {
        return this.gear
    };
};

vehicle.Light = function () {
    this.targetBrightness = 0;
    this.brightness = 0;

    this.turnOn = function () {
        this.targetBrightness = 1;
    };

    this.turnOff = function () {
        this.targetBrightness = 0
    };

    this.update = function (deltaTime) {
        var value = this.brightness;
        this.brightness = value + (this.targetBrightness - value) * (1 - Math.exp(-20 * deltaTime));
    };
};

// Longitudinal forces
// Pacejka Magic Formula, Pacejka96 formula
// http://www.racer.nl/reference/pacejka.htm
// http://www.miata.net/sport/Physics/Part21.html
vehicle.MagicFormula = function (b, c, d, e) {
    this.b = b; // wheel load
    this.c = c; // slip angle
    this.d = d; // slip ratio
    this.e = e; // camber

    this.calc = function (k) {
        return this.d * Math.sin(this.c * Math.atan(this.b * (1 - this.e) * k + this.e * Math.atan(this.b * k)))
    };
};

vehicle.Steering = function (maxAngleDegree, rudderAngleScale) {
    this.deltaAngle = 0;
    this.lever = 0;
    this.angle = 0;
    this.maxAngle = maxAngleDegree;
    this.rudderAngleScale = rudderAngleScale;

    this.update = function (deltaTime, speedKmh, slipAngleDegree) {
        this.deltaAngle = this.lever * 8.72664625997165 * deltaTime;
        this.angle += this.deltaAngle;
        var f = Math3D.MyMath.linearClampMap(Math.abs(slipAngleDegree), 10, 20, 1, 0);
        if (Math.isNaN(f)) f = 0;
        var factor = Math3D.MyMath.linearMap(Math3D.MyMath.clamp(speedKmh*0.5,-100,100), 0, 70, 0, 8);
        var value = this.angle;
        this.angle = value + (0 - value) * (1 - Math.exp(-(factor * f) * deltaTime));
        this.angle = Math3D.MyMath.clamp(this.angle, -this.maxAngle, this.maxAngle)

        if(isNaN(this.angle)) this.angle = 0;
    };

    this.setLever = function (lever) {
        this.lever = lever
    };

    this.setDeltaAngle = function (deltaAngle) {
        this.deltaAngle = deltaAngle
    };

    this.getRudderAngle = function () {
        return this.angle / this.rudderAngleScale
    };
};

vehicle.Suspension = function (position, targetPosition, mass, spring, damper) {
    if (damper == null) damper = 5e3;
    if (spring == null) spring = 8e4;
    if (mass == null) mass = 375;
    this.velocity = 0;
    this.position = position;
    this.targetPosition = targetPosition;
    this.mass = mass;
    this.spring = spring;
    this.damper = damper;
    this.loop = false;

    this.update = function (deltaTime) {
        var f = this.loop ? this.spring * (this.position) - this.damper * this.velocity : this.spring * (this.targetPosition - this.position) - this.damper * this.velocity;
        if(isNaN(f)) f = 0;
        var a = f / this.mass;
        if(isNaN(a)) a = 0;
        this.velocity += a * deltaTime;
        if(isNaN(this.velocity)) this.velocity = 0;

        this.position += this.velocity * deltaTime;
        if(isNaN(this.position)) this.position = 0;
    };
};

vehicle.Scaler = function (position, targetPosition, mass, spring, damper) {
    if (damper == null) damper = 0.25;
    if (spring == null) spring = 1;
    if (mass == null) mass = 0.5;

    this.velocity = 0;
    this.position = position;
    this.targetPosition = targetPosition;
    this.velocity = 0;
    this.mass = mass;
    this.spring = spring;
    this.damper = damper;

    this.update = function (deltaTime) {
        var f = (this.spring + this.targetPosition * deltaTime) - this.damper;

        this.velocity += parseInt(f);
        if(isNaN(this.velocity)) this.velocity = 0;

        if(this.position < this.targetPosition) {
            this.position += this.velocity * deltaTime;
        }//if
        else if(this.position > this.targetPosition) {
            this.position -= this.velocity * deltaTime;
        }//if
    };
};

vehicle.Vehicle = function (world, vertices, spec, x, y, heading, automatic, data, username, other) {
    this.vehicleData = data;
    this.username = username;
    this.other = other;
    this.dTilt = 0;
    this.roll = 0;
    this.tilt = 0;
    this.upCount = 0;
    this.downCount = 0;
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.wheelie = false;
    this.crashed = false;
    this.crashedTime = false;
    this.crashedWithLimits = false;
    this.crashedWithLimitsData = false;
    this.crashedWithUser = false;
    this.crashedWithUserData = false;
    this.airborne = false;
    this.airborneTime = false;
    this.wasAirborne = false;
    this.dropping = false;
    this.droppingForce = 0;
    this.isHoverAbsoluteCeiling = false;
    this.altitudeOffset = 0;
    this.tiltOffset = 180;
    this.rollOffset = 0;
    this.liftOffMinSpeed = 70;
    this.brakeRatio = 1;
    this.handbrake = 0;
    this.squealLevel = 0;
    this.gearChangeTime = 0;
    this.brakeLock = true;
    this.spec = spec;
    this.automatic = automatic;

    this.speedForward = 0;

    this.konamiCodeFast = false;
    this.konamiCodeSuperFast = false;
    this.konamiCodeFourWheels = false;
    this.konamiCodeFly = false;

    this.steering = new vehicle.Steering(this.vehicleData.maxSteeringAngle, this.vehicleData.rudderAngleScale);

    this.gearBox = new vehicle.GearBox;
    this.accelerometer = new vehicle.Accelerometer;
    this.gVector = new Math3D.geometry.Vector3(0, 0, 0);
    var bodyDef = new box2D.dynamics.B2BodyDef;
    bodyDef.type = box2D.dynamics.B2Body.b2_dynamicBody;
    bodyDef.position.set(x, y);
    bodyDef.angle = heading;
    var shape = new box2D.collision.shapes.B2PolygonShape;
    shape.setAsVector(vertices);

    this.body = world.createBody(bodyDef);

    //log("info", bodyDef, this.body);

    if(this.body) {
        this.body.createFixture2(shape);
        this.body.setUserData(this);
        var massData = new box2D.collision.shapes.B2MassData;
        massData.I = this.vehicleData.massI;
        massData.mass = this.vehicleData.mass;
        massData.center = new box2D.common.math.B2Vec2(0, -(1-this.vehicleData.slipFactor));
        this.body.setMassData(massData);
    }//if
    else {
        //log("info", this.body, world);

        return false;
    }//else

    var frontY = spec.rearY - spec.wheelBase;
    this.wheels = [];

    if(this.vehicleData.type == "plane") {
        //log("info", "vehicle plane create wheels");

        var backY = spec.rearY + spec.wheelBase;

        // These four control the vehicle direction
            this.wheels.push(new vehicle.Wheel(this, "Rear Left", -spec.tread / 2, backY, .1, 0, heading));
            this.wheels.push(new vehicle.Wheel(this, "Rear Right", spec.tread / 2, backY, -.1, 0, heading));

            this.wheels.push(new vehicle.Wheel(this, "Front Left", -spec.tread / 2, -backY, .1, 0, heading));
            this.wheels.push(new vehicle.Wheel(this, "Front Right", spec.tread / 2, -backY, -.1, 0, heading));

            //this.wheels.push(new vehicle.Wheel(this, "Middle Middle", 0, 0, .1, 0, heading));
        // <!---

        this.wheels.push(new vehicle.Wheel(this, "Middle Left", -spec.tread / 2, 0, .1, 0, heading));
        this.wheels.push(new vehicle.Wheel(this, "Middle Right", spec.tread / 2, 0, -.1, 0, heading));
    }//if
    else if(this.vehicleData.type == "person") {
        //log("info", "vehicle person create wheels");

        var backY = spec.rearY + spec.wheelBase;

        this.wheels.push(new vehicle.Wheel(this, "Front Left", -spec.tread / 2, -backY, .1, 0, heading));
        this.wheels.push(new vehicle.Wheel(this, "Front Right", spec.tread / 2, -backY, -.1, 0, heading));

        //this.wheels.push(new vehicle.Wheel(this, "Rear Middle", 0, spec.rearY, .1, 0, heading));

        this.wheels.push(new vehicle.Wheel(this, "Rear Left", -spec.tread / 2, backY, .1, 0, heading));
        this.wheels.push(new vehicle.Wheel(this, "Rear Right", spec.tread / 2, backY, -.1, 0, heading));
    }//else
    else {
        //log("info", "vehicle other create wheels");

        this.wheels.push(new vehicle.Wheel(this, "Front Left", -spec.tread / 2, frontY, .1, 0, heading));
        this.wheels.push(new vehicle.Wheel(this, "Front Right", spec.tread / 2, frontY, -.1, 0, heading));

        //if(this.vehicleData.mainCategory != "air" && this.vehicleData.type != "person") {
        this.wheels.push(new vehicle.Wheel(this, "Rear Left", -spec.tread / 2, spec.rearY, .1, 0, heading));
        this.wheels.push(new vehicle.Wheel(this, "Rear Right", spec.tread / 2, spec.rearY, -.1, 0, heading));
        //}//if
    }//else

    this.destroy = function() {
        for(var i= 0, n = this.wheels.length; i<n; i++) {
            //cesiumExplorer.physics.world.destroyBody(this.wheels[i].body);
            cesiumExplorer.physics.removeBodies.push(this.wheels[i].body);
        }//for

        //cesiumExplorer.physics.world.destroyBody(this.body);
        cesiumExplorer.physics.removeBodies.push(this.body);
    };

    this.setSteeringDeltaAngle = function (steeringDeltaAngle) {
        this.steering.setDeltaAngle(steeringDeltaAngle)
    };

    this.setSteeringLever = function (steeringLever) {
        this.steering.setLever(steeringLever)
    };

    this.setThrottle = function (throttle) {
        this.throttle = Math3D.MyMath.clamp(throttle, 0, 1*window.speedMultiplier)
    };

    this.setBrake = function (brake) {
        this.brake = Math3D.MyMath.clamp(brake, 0, 1)
    };

    this.setHandbrake = function (handbrake) {
        this.handbrake = Math3D.MyMath.clamp(handbrake, 0, 1)
    };

    this.setUp = function (up) {
        this.up = up;
    };

    this.setDown = function (down) {
        this.down = down;
    };

    this.setLeft = function (up) {
        this.left = up;
    };

    this.setRight = function (down) {
        this.right = down;
    };

    this.gearUp = function () {
        if (!this.automatic) this.gearBox.gearUp()
    };

    this.gearDown = function () {
        if (!this.automatic) this.gearBox.gearDown()
    };

    this.getRPM = function () {
        var _g = this.gearBox.getCurrentGear();
        var maxSpeed = (this.vehicleData.maxspeed);

        var last = _g > 1 ? (this.gearBox.gearRatioTopSpeed[_g-1] * maxSpeed) : 0;

        var rpm = ((this.speedKmh-last)*100) / ((this.gearBox.gearRatioTopSpeed[_g] * maxSpeed) - last);

        return Math.max(rpm, rpm+(_g*10));
    };

    this.update = function (deltaTime) {
        this.speed = this.body.getLinearVelocity().length();
        this.speedKmh = vehicle.Box2DUtils.toKmh(this.speed);

        var slipAngleDegree = 0;

        if(this.vehicleData.mainCategory != "air") {
            slipAngleDegree = ((this.wheels[0].slipAngle + this.wheels[1].slipAngle) / 2).toDeg() * 1;
        }//if

        this.steering.update(deltaTime, this.speedKmh / 1, slipAngleDegree);

        var rudderAngle = this.steering.getRudderAngle();
        var turningRadiusFromRearCenter = Math.tan(Math.PI / 2 - rudderAngle) * Math.max(this.spec.wheelBase, 1);

        if(this.vehicleData.type == "plane") {
            this.frontLAngle = -Math.atan(Math.max(this.spec.wheelBase, 1) / (turningRadiusFromRearCenter + this.spec.tread / 2));
            this.frontRAngle = -Math.atan(Math.max(this.spec.wheelBase, 1) / (turningRadiusFromRearCenter - this.spec.tread / 2));
        }//if
        else {
            this.frontLAngle = Math.atan(Math.max(this.spec.wheelBase, 1) / (turningRadiusFromRearCenter + this.spec.tread / 2));
            this.frontRAngle = Math.atan(Math.max(this.spec.wheelBase, 1) / (turningRadiusFromRearCenter - this.spec.tread / 2));
        }//else

        var a = Math.abs(turningRadiusFromRearCenter) + this.spec.tread / 2;
        var b = Math.max(this.spec.wheelBase, 1);
        var turningRadius = Math.sqrt(a * a + b * b);

        /*if(this.vehicleData.mainCategory == "air" || this.vehicleData.type == "person") {
         this.frontLAngle = rudderAngle;
         this.frontRAngle = rudderAngle;
         }//if*/

        if(this.wheels.length > 0) this.wheels[0].setAngle(this.frontLAngle);
        if(this.wheels.length > 1) this.wheels[1].setAngle(this.frontRAngle);

        if(/*this.vehicleData.mainCategory == "air" ||*/ this.vehicleData.type == "person") {
            if(this.wheels.length > 2) this.wheels[2].setAngle(-this.frontLAngle);
            if(this.wheels.length > 3) this.wheels[3].setAngle(-this.frontRAngle);
        }//if

        this.speedForward = box2D.common.math.B2Math.dot(this.body.getLinearVelocity(), vehicle.Box2DUtils.getFrontVector(this.body));
        var _g = this.gearBox.getCurrentGear();
        var maxSpeed = this.vehicleData.maxspeed;

        //log("info", this.speedForward+" | "+this.brake);

        if (this.automatic || this.vehicleData.mainCategory == "air") {
            switch (_g) {
                case 1:
                    if (this.speedForward < 1 && this.brake > .1) {
                        this.brakeLock = true;
                        this.gearChangeTime += deltaTime;
                        if (this.gearChangeTime > .4) this.gearBox.gearDown()
                    }
                    else {
                        this.gearChangeTime = 0;

                        var ratio = this.gearBox.getGearRatio();
                        var prevRatio = this.gearBox.getPreviousGearRatio();

                        //log("info", this.speedKmh +" | "+ (maxSpeed / ratio));

                        if(this.speedKmh >= this.gearBox.gearRatioTopSpeed[_g] * maxSpeed) {
                            this.gearBox.gearUp()
                        }//if
                        /*else if(this.speedKmh <= this.gearBox.gearRatioTopSpeed[(_g-1)] * maxSpeed) {
                         this.gearBox.gearDown()
                         }//else if*/
                    }//else

                    if (this.throttle > 0) this.brakeLock = false;
                    if (this.brakeLock) this.brake = 1;

                    break;
                case -1:
                    if (this.speedForward > -1 && this.throttle > .1) {
                        this.brakeLock = true;
                        this.gearChangeTime += deltaTime;
                        if (this.gearChangeTime > .4) this.gearBox.gearUp()
                    } else this.gearChangeTime = 0;

                    var tmp = this.throttle;
                    this.throttle = this.brake;
                    this.brake = tmp;

                    if (this.throttle > 0) this.brakeLock = false;
                    if (this.brakeLock) this.brake = 1;

                    break
                default:
                    var ratio = this.gearBox.getGearRatio();
                    var prevRatio = this.gearBox.getPreviousGearRatio();

                    //log("info", (maxSpeed/ratio) + " | " + (maxSpeed/prevRatio) + " | " + this.speedKmh);

                    if(this.speedKmh >= this.gearBox.gearRatioTopSpeed[_g] * maxSpeed) {
                        this.gearBox.gearUp()
                    }//if
                    else if(this.speedKmh <= this.gearBox.gearRatioTopSpeed[(_g-1)] * maxSpeed) {
                        this.gearBox.gearDown()
                    }//else if

                    break;
            }
        }

        // If the air vehicle is tilting too much
        if(this.vehicleData.mainCategory == "air" && this.vehicleData.category != "helicopter") {
            if(this.tilt < 0 && this.tilt > -3 && this.throttle < 1) {
                this.throttle = Math.abs(this.tilt);
            }//else if
        }//if

        //log("info", this.speedForward+", "+this.airborne+", "+this.throttle);
        if(this.throttle <= 0 && this.brake <= 0) this.brake = 0.1;

        var bumpDragForce = Math.abs(this.dTilt * 1e3);
        var accelerationForce = 0;

        if((this.speedForward > 0 && this.airborne && this.vehicleData.mainCategory != "air" && !this.konamiCodeFly)/* || this.dropping*/) {
            //log("info", "check2", this.speedForward, this.airborne, this.vehicleData.mainCategory, this.dropping);
            accelerationForce = -this.throttle * /*this.vehicleData.traction **/ 2e3 * (this.gearBox.getGearRatio() * (this.konamiCodeSuperFast ? 4 : (this.konamiCodeFast ? 2 : 1)));
        }//if
        else if(_g > 0 && this.vehicleData.category == "helicopter" && !this.airborne) {
            //log("info", "check3", _g, this.vehicleData.category, this.airborne);
            accelerationForce = 0;
        }//else if
        else if(_g < 0 && this.vehicleData.category == "helicopter" && !this.airborne) {
            //log("info", "check4", _g, this.vehicleData.category, this.airborne);
            accelerationForce = 0;
        }//else if
        else if(this.speedKmh < ((this.vehicleData.maxspeed) * (this.konamiCodeSuperFast ? 4 : (this.konamiCodeFast ? 2 : 1)))) {

            /*if(this.tilt < 0) {
             this.throttle = -this.tilt;

             if(this.speedKmh < (this.vehicleData.maxspeed * (this.konamiCodeSuperFast ? 4 : (this.konamiCodeFast ? 2 : 1)))) {
             accelerationForce = this.throttle * 2e3 * (this.gearBox.getGearRatio() * (this.konamiCodeSuperFast ? 4 : (this.konamiCodeFast ? 2 : 1)));
             }//if
             else {
             accelerationForce = -this.throttle * 2e3 * (this.gearBox.getGearRatio() * (this.konamiCodeSuperFast ? 4 : (this.konamiCodeFast ? 2 : 1)));
             }//else
             }//if
             else {*/
            //log("info", "check5", this.speedKmh, this.vehicleData.maxspeed, this.gearBox.getGearRatio());
            accelerationForce = this.throttle * /*this.vehicleData.traction **/ 2e3 * (this.gearBox.getGearRatio() * (this.konamiCodeSuperFast ? 4 : (this.konamiCodeFast ? 2 : 1)));
            //}//else

        }//else if
        else {
            //log("info", "check6", this.throttle, this.gearBox.getGearRatio());
            accelerationForce = -this.throttle * /*this.vehicleData.traction **/ 2e3 * (this.gearBox.getGearRatio() * (this.konamiCodeSuperFast ? 4 : (this.konamiCodeFast ? 2 : 1)));
        }//else

        if (!this.automatic && this.vehicleData.mainCategory != "air" && _g > 0) {
            if(this.speedKmh >= this.gearBox.gearRatioTopSpeed[_g] * maxSpeed) {
                accelerationForce *= -1;
            }//if
        }//if
        else if(this.vehicleData.mainCategory != "air" && _g < 0) {
            if(this.speedKmh >= this.gearBox.gearRatioTopSpeed[_g] * maxSpeed) {
                accelerationForce = 0;
            }//if
        }//else if

        // If the air vehicle is above the max altitude or is tilting too much
        if(this.vehicleData.mainCategory == "air") {
            if(this.isHoverAbsoluteCeiling && this.tilt > 0.1 && this.tilt < 3.0) {
                if(accelerationForce > 0) accelerationForce *= -1;
            }//if
            else if(this.tilt > 0.5 && this.tilt < 2.5) {
                accelerationForce -= accelerationForce-this.tilt;
            }//else if
        }//if

        var brakeForce = this.brake * 5e3 * this.brakeRatio;

        if(this.wheels.length > 2 && !this.vehicleData.fourWheelDrive && !this.konamiCodeFourWheels) {
            if(this.vehicleData.mainCategory != "air" && !this.konamiCodeFly) {
                for(var i= 2, n = this.wheels.length; i<n; i++) {
                    this.wheels[i].drivingForce = accelerationForce-bumpDragForce;
                }//for
                //this.wheels[2].drivingForce = accelerationForce-bumpDragForce;
                //this.wheels[3].drivingForce = accelerationForce-bumpDragForce;
            }//if
            else {
                for(var i= 2, n = this.wheels.length; i<n; i++) {
                    this.wheels[i].drivingForce = accelerationForce;
                }//for
                //this.wheels[2].drivingForce = accelerationForce;
                //this.wheels[3].drivingForce = accelerationForce;
            }//else
        }//if
        else if(this.wheels.length > 0) {
            if(this.vehicleData.mainCategory != "air" && !this.konamiCodeFly) {
                for(var i= 0, n = this.wheels.length; i<n; i++) {
                    this.wheels[i].drivingForce = this.vehicleData.fourWheelDrive || this.konamiCodeFourWheels ? (accelerationForce-bumpDragForce)*0.5 : accelerationForce-bumpDragForce;
                }//for
                //this.wheels[2].drivingForce = accelerationForce-bumpDragForce;
                //this.wheels[3].drivingForce = accelerationForce-bumpDragForce;
            }//if
            else {
                for(var i= 0, n = this.wheels.length; i<n; i++) {
                    this.wheels[i].drivingForce = accelerationForce;
                }//for
                //this.wheels[2].drivingForce = accelerationForce;
                //this.wheels[3].drivingForce = accelerationForce;
            }//else
        }//if
        /*else {
         if(this.vehicleData.mainCategory != "air") {
         //this.wheels[0].drivingForce = accelerationForce-bumpDragForce;
         //this.wheels[1].drivingForce = accelerationForce-bumpDragForce;

         var center = this.body.getWorldCenter();
         var front = vehicle.Box2DUtils.getFrontVector(this.body);
         var driveV = box2D.common.math.B2Math.mulFV(accelerationForce-bumpDragForce, front);
         this.body.applyForce(driveV, center);
         }//if
         else {
         //this.wheels[0].drivingForce = accelerationForce;
         //this.wheels[1].drivingForce = accelerationForce;

         var center = this.body.getWorldCenter();
         var front = vehicle.Box2DUtils.getFrontVector(this.body);
         var driveV = box2D.common.math.B2Math.mulFV(accelerationForce, front);
         this.body.applyForce(driveV, center)
         }//else
         }//else*/

        if(this.wheels.length > 0) this.wheels[0].brakeForce = brakeForce + 25 + bumpDragForce;
        if(this.wheels.length > 1) this.wheels[1].brakeForce = brakeForce + 25 + bumpDragForce;

        if(this.vehicleData.mainCategory != "air" && !this.konamiCodeFly) {
            var handbrakeForce = this.handbrake*5e3;

            if(this.handbrake) {
                var factor = accelerationForce ? Math.min(accelerationForce/this.vehicleData.massI,1) : 1;
                var angularVelocityIncrement = (this.getSteeringAngle()*this.speedForward*factor)*Math.PI/180;
                //log("info", angularVelocityIncrement);

                this.body.m_angularVelocity+=angularVelocityIncrement;
            }//if

            if(this.wheels.length >= 2) {
                for(var i= 2, n = this.wheels.length; i<n; i++) {
                    this.wheels[i].brakeForce = brakeForce + handbrakeForce + 25 + bumpDragForce;
                }//for
            }//if
            //this.wheels[2].brakeForce = brakeForce + handbrakeForce + 25 + bumpDragForce;
            //this.wheels[3].brakeForce = brakeForce + handbrakeForce + 25 + bumpDragForce;
        }//if
        else {
            if(this.wheels.length >= 2) {
                for(var i= 2, n = this.wheels.length; i<n; i++) {
                    this.wheels[i].brakeForce = brakeForce + 25 + bumpDragForce;
                }//for
            }//if
            //this.wheels[2].brakeForce = brakeForce + 25 + bumpDragForce;
            //this.wheels[3].brakeForce = brakeForce + 25 + bumpDragForce;
        }//else

        var loadY = -this.gVector.y * .025;
        var loadX = this.gVector.x * .015;

        /*var loadY = -this.gVector.y * window.loadYFactor;
         var loadX = this.gVector.x * window.loadXFactor;*/

        if(this.vehicleData.mainCategory != "air" && !this.konamiCodeFly) {
            if(this.wheels.length > 0) {
                this.wheels[0].set_loadFactor(1 - loadY - loadX);
                this.wheels[1].set_loadFactor(1 - loadY + loadX);

                if(this.wheels.length >= 2) {
                    for(var i= 2, n = this.wheels.length; i<n; i=i+2) {
                        this.wheels[i].set_loadFactor(1 + loadY - loadX);
                        if(this.wheels.length > i+1) this.wheels[i+1].set_loadFactor(1 + loadY + loadX);
                    }//for
                }//if
            }//if
        }//if

        this.squealLevel = 0;

        //if(this.vehicleData.mainCategory != "air") {
        var debug_i = 0;
        var _g = 0;
        var _g1 = this.wheels;
        while (_g < _g1.length) {
            var wheel = _g1[_g];
            ++_g;
            wheel.update(deltaTime);
            this.squealLevel += wheel.getSquealLevel()
        }
        this.squealLevel /= 4;
        if(this.wasAirborne && !this.airborne) this.squealLevel = 0.5;
        else if(((this.handbrake && this.vehicleData.mainCategory != "air") || this.crashed) && this.squealLevel < 0.5 && this.speed > 0.1 && !this.airborne) this.squealLevel = 0.5;
        //}//if

        // Aerodynamic drag
        /*
         When the car is in motion, an aerodynamic drag will develop that will resist
         the motion of the car. Drag force is proportional to the square of the velocity
         and the formula to calculate the force is as follows.

         Fdrag = -Cdrag * V * |V| (3-1)

         Where V is the velocity vector and Cdrag is a constant, which is proportional to
         the frontal area of the car
         */
        if((this.vehicleData.mainCategory != "air" && !this.konamiCodeFly) || (this.tilt > 0.5 && this.tilt < 2.5 && (this.tilt > 0 || this.speedKmh < (this.vehicleData.maxspeed)*1.5))) {
            this.airDragForce = this.speedKmh * this.speedKmh * .04861111111111111;
            //this.airDragForce = this.speedKmh * this.speedKmh * (window.airDragForceFactor);
            var airDragV = this.body.getLinearVelocity().copy();
            airDragV.negativeSelf();
            airDragV.normalize();
            airDragV.multiply(this.airDragForce);
            this.body.applyForce(airDragV, this.body.getWorldCenter());
        }//if

        // Rolling resistance
        /*
         Rolling resistance is caused by friction between the rubber and road surfaces
         as the wheels roll along and is proportional to the velocity.

         Frr = -Crr * V (3-2)

         Where V is the velocity vector and Crr is a constant
         */
        if((this.vehicleData.mainCategory != "air" && !this.konamiCodeFly) || !this.airborne) {
            this.rrForce = this.speedKmh * .04861111111111111;
            //this.airDragForce = this.speedKmh * this.speedKmh * (window.airDragForceFactor);
            var rrV = this.body.getLinearVelocity().copy();
            rrV.negativeSelf();
            rrV.normalize();
            rrV.multiply(this.rrForce);
            this.body.applyForce(rrV, this.body.getWorldCenter());
        }//if

        // Gravity
        /*
         Gravity pulls the car towards the earth. The parallel component of
         gravitational force, Fg = mgsinÎ¸ (Î¸ is the angle of the slope), can pull the car
         either forwards or backwards depending on whether the car is pointing uphill
         or downhill.
         */
        if((this.vehicleData.mainCategory != "air" && !this.konamiCodeFly) || (this.tilt > 0.5 && this.tilt < 2.5 && (this.tilt > 0 || this.speedKmh < (this.vehicleData.maxspeed)*1.5))) {
            var tiltForceV = this.body.getWorldVector(new box2D.common.math.B2Vec2(0, -1));
            var tiltForce = -this.getMass() * this.vehicleData.gravity * Math.sin(this.tilt);
            //var tiltForce = -this.getMass() * window.tiltForceFactor * Math.sin(this.tilt);
            tiltForceV.multiply(tiltForce);
            this.body.applyForce(tiltForceV, this.body.getWorldCenter());
        }//if

        if((this.vehicleData.mainCategory != "air" && !this.konamiCodeFly) || (this.tilt > 0.5 && this.tilt < 2.5 && (this.tilt > 0 || this.speedKmh < (this.vehicleData.maxspeed)*1.5))) {
            var rollForceV = this.body.getWorldVector(new box2D.common.math.B2Vec2(1, 0));
            var rollForce = -this.getMass() * this.vehicleData.gravity * Math.sin(this.roll);
            if (Math.abs(rollForce) > 3e3) {
                rollForceV.multiply(rollForce);
                this.body.applyForce(rollForceV, this.body.getWorldCenter())
            }
        }//if
    };

    this.lateUpdate = function (deltaTime) {
        var boxPosition = this.body.getWorldCenter();
        var position = new Math3D.geometry.Vector3(boxPosition.x, boxPosition.y, 0);
        this.accelerometer.update(deltaTime, position);
        this.gVector = this.accelerometer.getVector();
        this.gVector.y = -this.gVector.y;
        this.gVector.rotateZ(this.body.getAngle() + Math.PI)
    };

    this.getGear = function () {
        return this.gearBox.getCurrentGear()
    };

    this.getPosition = function () {
        var center = this.body.getWorldCenter();
        return new Math3D.geometry.Vector3(center.x, center.y, 0)
    };

    this.getMass = function () {
        return this.body.getMass()
    };

    this.getAirDragForce = function () {
        return this.airDragForce
    };

    this.getTurningRadius = function () {
        return this.turningRadius
    };

    this.getSteeringAngle = function () {
        return this.steering.angle
    };

    this.getHeading = function () {
        return this.body.getAngle()
    };

    this.getSpec = function () {
        return this.spec
    };

    this.getSquealLevel = function () {
        return this.squealLevel
    };

    this.setAttitude = function (tilt, roll) {
        this.dTilt = (tilt - this.tilt);
        this.tilt = tilt;
        this.roll = roll
    };

    this.getSpeedKmh = function () {
        return this.speedKmh
    };

    this.getSpeedMph = function () {
        return vehicle.Box2DUtils.toKmh(Math.abs(this.speed)) / 1.609344
    };

    this.getGVector = function () {
        return this.gVector
    };

    this.getWheelNumber = function () {
        return this.wheels.length
    };

    this.getWheel = function (index) {
        if (index < 0 || index >= this.wheels.length) throw "Out of wheel index";
        return this.wheels[index]
    };

    this.getWheelPosition = function (index) {
        return this.getWheel(index).getPosition()
    };
};

vehicle.VehicleSpec = function () {};

vehicle.Wheel = function (_vehicle, name, bodyAnchorX, bodyAnchorY, wheelAnchorX, wheelAnchorY, heading, isDrivingWheel) {
    if (isDrivingWheel == null) isDrivingWheel = true;

    this.loadFactor = 1;
    this.brakeForce = 0;
    this.drivingForce = 0;
    this.name = name;
    this.isDrivingWheel = isDrivingWheel;
    this.magicFormula = new vehicle.MagicFormula(window.pacejkaWheelLoad, window.pacejkaSlipAngle, window.pacejkaSlipRatio, window.pacejkaCamber);
    var bodyDef = new box2D.dynamics.B2BodyDef;
    bodyDef.type = box2D.dynamics.B2Body.b2_dynamicBody;
    var vehiclePos = _vehicle.body.getPosition();
    var offset = new Math3D.geometry.Vector2(bodyAnchorX, bodyAnchorY);
    offset.rotate(heading);
    bodyDef.position.set(vehiclePos.x + offset.x, vehiclePos.y + offset.y);
    bodyDef.angle = heading;
    var shape = new box2D.collision.shapes.B2PolygonShape;
    shape.setAsBox(.08, .3);
    this.body = _vehicle.body.getWorld().createBody(bodyDef);
    this.body.setUserData(_vehicle);
    var fixtureDef = new box2D.dynamics.B2FixtureDef;
    fixtureDef.shape = shape;
    fixtureDef.density = 1;

    fixtureDef.friction=1;

    fixtureDef.filter.categoryBits = 2;
    fixtureDef.filter.maskBits = 32767;
    this.body.createFixture(fixtureDef);
    var jointDef = new box2D.dynamics.joints.B2RevoluteJointDef;
    jointDef.enableLimit = true;
    jointDef.lowerAngle = 0;
    jointDef.upperAngle = 0;
    jointDef.bodyA = _vehicle.body;
    jointDef.bodyB = this.body;
    jointDef.localAnchorA.set(bodyAnchorX, bodyAnchorY);
    jointDef.localAnchorB.set(wheelAnchorX, wheelAnchorY);
    this.joint = _vehicle.body.getWorld().createJoint(jointDef);

    this.setAngle = function (angle) {
        this.joint.setLimits(angle, angle)
    };

    this.getSquealLevel = function () {
        return this.squealLevel
    };

    this.getPosition = function () {
        var p = this.body.getPosition();
        return new Math3D.geometry.Vector2(p.x, p.y)
    };

    this.set_loadFactor = function (loadFactor) {
        this.loadFactor = Math3D.MyMath.clamp(loadFactor, 0, 2);
        return this.loadFactor
    };

    this.update = function (deltaTime) {
        var center = this.body.getWorldCenter();
        var movingFront = this.body.getLinearVelocity();
        var wheelFront = vehicle.Box2DUtils.getFrontVector(this.body);
        if (this.isDrivingWheel) {
            var driveV = box2D.common.math.B2Math.mulFV(this.drivingForce, wheelFront);
            this.body.applyForce(driveV, center)
        }

        var p = box2D.common.math.B2Math.dot(movingFront, wheelFront);
        var f1 = Math3D.MyMath.clamp(p * 4 / (deltaTime * 60), -1, 1);
        var brakeV = box2D.common.math.B2Math.mulFV(-this.brakeForce * f1, wheelFront);
        this.body.applyForce(brakeV, center);
        var l = wheelFront.length() * movingFront.length();
        this.slipAngle = 0;
        if (l != 0) this.slipAngle = box2D.common.math.B2Math.crossVV(wheelFront, movingFront) / l;
        var lateralForce = this.magicFormula.calc(this.slipAngle.toDeg());
        //var lateralForce = this.magicFormula.calc(this.slipAngle * window.slipFactor);

        //if(_vehicle.vehicleData.mainCategory != "air") {
        lateralForce *= this.loadFactor;
        //}//if

        //if (lateralForce != 0) {
        var f = Math.min(movingFront.length() / (deltaTime * 60), 1);
        var lateralVector = this.body.getWorldVector(new box2D.common.math.B2Vec2(-1, 0));

        // Remove lateral instability
        //if(_vehicle.vehicleData.mainCategory != "air") {
        lateralVector.multiply(lateralForce * f);
        //}//if
        //else {
        //    lateralVector.multiply(lateralForce);
        //}//else

        this.body.applyForce(lateralVector, center);
        var slide = Math.abs(box2D.common.math.B2Math.dot(movingFront, lateralVector));
        this.squealLevel = Math3D.MyMath.clamp(Math3D.MyMath.linearMap(slide, 1e4, 3e4, 0, 1), 0, 1)
        //}
    }
};
