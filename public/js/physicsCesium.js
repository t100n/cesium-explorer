/**
 * Apply rotations to cam orientation matrix, which originally points to the center of
 * an ellipsoid and it's 'up' is pointing north.
 * The resulting matrix will have a camera pointing to the correct heading, with
 * a specified up-down tilt and rotation around its direction.
 *
 * @see https://developers.google.com/kml/documentation/cameras
 *
 * @param {Cesium.Matrix3} mat Cam orientation matrix (R U D)
 * @param {number} h Heading as compass angle in degrees (0 < h < 360), 0 = North
 * @param {number} t Tilt Horizontal tilting angle in degrees. (-180 < t < 180), 0 = Down, 90 = Head forward
 * @param {number} r Left-right rotation angle in degrees. (-180 < t < 180)
 *
 * @returns {Cesium.Matrix3} Matrix having rotations applied to.
 */
var rotCameraMatrix = function(mat, h, t, r){
    var mh, mt;

    // Heading
    if (h === 0) {
        mh = Cesium.Matrix3.IDENTITY;
    } else {
        mh = Cesium.Matrix3.fromRotationZ(-h);
    }

    // Tilt
    if (t !== 0) {
        mt = Cesium.Matrix3.fromRotationX(-t);
    } else {
        // TBD
        mt = Cesium.Matrix3.IDENTITY;
    }

    // perform these two rotations so that we can determine the direction vector for roll
    Cesium.Matrix3.multiply(mat, mh, mat);
    Cesium.Matrix3.multiply(mat, mt, mat);

    // Roll (-180 < 0 < 180)
    // Roll around the calculated direction axis
    if (r !== 0) {
        var right = new Cesium.Cartesian3();
        Cesium.Matrix3.getColumn(mat, 0, right);
        var up = new Cesium.Cartesian3();
        Cesium.Matrix3.getColumn(mat, 1, up);
        var direction = new Cesium.Cartesian3();
        Cesium.Matrix3.getColumn(mat, 2, direction);

        var rad = r;
        var mr = Cesium.Matrix3.fromQuaternion(Cesium.Quaternion.fromAxisAngle(direction, rad));

        Cesium.Matrix3.multiplyByVector(mr, right, right);
        Cesium.Matrix3.multiplyByVector(mr, up, up);
        Cesium.Matrix3.multiplyByVector(mr, direction, direction);

        Cesium.Matrix3.setColumn(mat, 0, right, mat);
        Cesium.Matrix3.setColumn(mat, 1, up, mat);
        Cesium.Matrix3.setColumn(mat, 2, direction, mat);
    }

    return mat;
};

function Placemark(scene, lat, lng, name, url) {
    this.scene = scene;
    this.visibility = true;
    this.lat = lat;
    this.lng = lng;
    this.alt = 0;

    this.billboards = this.scene.primitives.add(new Cesium.BillboardCollection());
    this.labels = this.scene.primitives.add(new Cesium.LabelCollection());

    this.billboards.add({
        image : url,
        position : new Cesium.Cartesian3(0.0, 0.0, 0.0),
        //eyeOffset: new Cesium.Cartesian3(0,0,0),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER
    });

    if(name) {
        this.labels.add({
            text: name,
            position: new Cesium.Cartesian3(0, 0, 5),
            //eyeOffset: new Cesium.Cartesian3(0,0,0),
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
            font : '18px sans-serif'
        });

        for(var i= 0, n=this.labels.length;i<n;i++) {
            var x = this.labels.get(i);
            x.position = Cesium.Cartesian3.fromDegrees(lng, lat, 0);
        }//for
    }//if

    for(var i= 0, n=this.billboards.length;i<n;i++) {
        var x = this.billboards.get(i);
        x.position = Cesium.Cartesian3.fromDegrees(lng, lat, 0);
    }//for

    this.setLatLng = function (lat, lng) {
    	if(isNaN(lat)) lat = 0;
    	if(isNaN(lng)) lng = 0;

        for(var i= 0, n=this.billboards.length;i<n;i++) {
            var x = this.billboards.get(i);
            x.position = Cesium.Cartesian3.fromDegrees(lng, lat, 0);
        }//for

        for(var i= 0, n=this.labels.length;i<n;i++) {
            var x = this.labels.get(i);
            x.position = Cesium.Cartesian3.fromDegrees(lng, lat, 0);
        }//for

        this.lat = lat;
        this.lng = lng;
    };

    this.setLatLngAlt = function (lat, lng, alt) {
    	if(isNaN(lat)) lat = 0;
    	if(isNaN(lng)) lng = 0;
    	if(isNaN(alt)) alt = 0;

        for(var i= 0, n=this.billboards.length;i<n;i++) {
            var x = this.billboards.get(i);
            x.position = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
        }//for

        for(var i= 0, n=this.labels.length;i<n;i++) {
            var x = this.labels.get(i);
            x.position = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
        }//for

        this.lat = lat;
        this.lng = lng;
        this.alt = alt;
    };

    this.getVisibility = function() {
        return this.visibility;
    };

    this.setVisibility = function (flag) {
        if(this.visibility != flag) {
            //this.billboards.show = flag;
            if(this.billboards) {
                for(var i= 0, n=this.billboards.length;i<n;i++) {
                    var x = this.billboards.get(i);
                    x.show = flag;
                }//for
            }//if

            if(this.labels) {
                for(var i= 0, n=this.labels.length;i<n;i++) {
                    var x = this.labels.get(i);
                    x.show = flag;
                }//for
            }//if

            this.visibility = flag;
        }//if
    };

    this.remove = function() {
        log("info", "Placemark", "remove");

        this.scene.primitives.remove(this.billboards);

        if(this.labels) {
            this.scene.primitives.remove(this.labels);
        }//if
    };
};

function Label(scene, lat, lng, name) {
    this.scene = scene;
    this.visibility = true;
    this.lat = lat;
    this.lng = lng;
    this.alt = 0;

    this.labels = this.scene.primitives.add(new Cesium.LabelCollection());
    this.labels.add({
        text: name,
        position: new Cesium.Cartesian3(0, 0, 5),
        //eyeOffset: new Cesium.Cartesian3(0,0,0),
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        font : '18px sans-serif'
    });

    for(var i= 0, n=this.labels.length;i<n;i++) {
        var x = this.labels.get(i);
        x.position = Cesium.Cartesian3.fromDegrees(lng, lat, 0);
    }//for

    this.setName = function (name) {
        for(var i= 0, n=this.labels.length;i<n;i++) {
            var x = this.labels.get(i);
            x.text = name;
        }//for
    };

    this.setLatLng = function (lat, lng) {
    	if(isNaN(lat)) lat = 0;
    	if(isNaN(lng)) lng = 0;

        for(var i= 0, n=this.labels.length;i<n;i++) {
            var x = this.labels.get(i);
            x.position = Cesium.Cartesian3.fromDegrees(lng, lat, 0);
        }//for

        this.lat = lat;
        this.lng = lng;
    };

    this.setLatLngAlt = function (lat, lng, alt) {
    	if(isNaN(lat)) lat = 0;
    	if(isNaN(lng)) lng = 0;
    	if(isNaN(alt)) alt = 0;

        for(var i= 0, n=this.labels.length;i<n;i++) {
            var x = this.labels.get(i);
            x.position = Cesium.Cartesian3.fromDegrees(lng, lat, alt);
        }//for

        this.lat = lat;
        this.lng = lng;
        this.alt = alt;
    };

    this.getVisibility = function() {
        return this.visibility;
    };

    this.setVisibility = function (flag) {
        if(this.visibility != flag) {
            if(this.labels) {
                for(var i= 0, n=this.labels.length;i<n;i++) {
                    var x = this.labels.get(i);
                    x.show = flag;
                }//for
            }//if

            this.visibility = flag;
        }//if
    };

    this.remove = function() {
        log("info", "Placemark", "remove");

        if(this.labels) {
            this.scene.primitives.remove(this.labels);
            this.labels = null;
        }//if
    };
};

function Model(scene, url, name, icon, scaleX, scaleY, scaleZ, spec) {
    this.loading = false;
    this.loaded = false;
    this.scene = scene;
    this.url = url;
    this.name = name;
    this.icon = icon;
    this.nameModel = false;
    this.spec = spec;
    this.headingOffset = 0;
    this.tiltOffset = 0;
    this.rollOffset = 0;
    this.altitudeOffset = 0;
    this.modelMatrix = false;
    this.initialModelMatrix = false;
    this.componentAltitude = new vehicle.Suspension(0, 0, spec ? spec.mass : 0, spec ? spec.spring : 0, spec ? spec.damper : 0);
    this.componentTilt = new vehicle.Suspension(0, 0, spec ? spec.mass : 0, spec ? spec.spring : 0, spec ? spec.damper : 0);
    this.componentRoll = new vehicle.Suspension(0, 0, spec ? spec.mass : 0, spec ? spec.spring : 0, spec ? spec.damper : 0);
    this.componentXScale = new vehicle.Scaler(0.1,0.1);
    this.componentYScale = new vehicle.Scaler(0.1,0.1);
    this.componentZScale = new vehicle.Scaler(0.1,0.1);
    this.timer = 0;
    this.retract = false;

    this.lat = false;
    this.lng = false;
    this.alt = false;
    this.heading = false;
    this.tilt = false;
    this.roll = false;
    this.scaleX = scaleX ? scaleX : 1;
    this.scaleY = scaleY ? scaleY : 1;
    this.scaleZ = scaleZ ? scaleZ : 1;
    this.scale = new Cesium.Cartesian3(this.scaleX, this.scaleY, this.scaleZ);
    this.visibility = true;

    this.loaded = false;

    this.billboards = this.scene.primitives.add(new Cesium.BillboardCollection());
    this.labels = this.scene.primitives.add(new Cesium.LabelCollection());

    this.load = function (id) {
        var that = this;

        this.loading = true;

        this.model = this.scene.primitives.add(Cesium.Model.fromGltf({
            url : url
            //modelMatrix : modelMatrix,
            //minimumPixelSize : 128,
            //scale: new Cesium.Cartesian3(this.scaleX, this.scaleY, this.scaleZ)
        }));

        this.model.readyToRender.addEventListener(function(modelObj) {
            // Play and loop all animations at half-spead
            /*modelObj.activeAnimations.addAll({
                speedup : 1,
                loop : Cesium.ModelAnimationLoop.REPEAT
            });*/

            that.modelObj = modelObj;

            if(id) that.model.id = id;

            that.onFetched();
        });
    };

    this.remove = function () {
        if(this.model) this.scene.primitives.remove(this.model);
        if(this.nameModel) this.scene.primitives.remove(this.nameModel);
    };

    this.onFetched = function () {
        try {
            //log("info", "loaded");

            this.loaded = true;
            this.loading = false;

            this.setLocation(this.lat, this.lng, this.alt, this.heading, this.tilt, this.roll);
        } catch (e) {
            //log("error", e)
        }
    };

    this.setLocation = function (lat, lng, alt, heading, tilt, roll) {
    	if(isNaN(lat)) lat = 0;
    	if(isNaN(lng)) lng = 0;
    	if(isNaN(alt)) alt = 0;
    	if(isNaN(heading)) heading = 0;
    	if(isNaN(tilt)) tilt = 0;
    	if(isNaN(roll)) roll = 0;

        if (this.loaded) {
            var position = Cesium.Cartesian3.fromDegrees(lng, lat, alt, this.scene.globe.ellipsoid, new Cesium.Cartesian3());

            //var modelMatrix = Cesium.Transforms.northEastDownToFixedFrame(position);
            var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

            if(!this.initialModelMatrix) {
                this.model.modelMatrix = this.modelMatrix = modelMatrix;
                this.initialModelMatrix = modelMatrix.clone();

                var currentTranslation = new Cesium.Cartesian3();
                var currentRotation = new Cesium.Matrix3();
                Cesium.Matrix4.getRotation(modelMatrix, currentRotation);

                currentRotation = rotCameraMatrix(currentRotation, -heading, -tilt, roll);

                var position = Cesium.Cartesian3.fromDegrees(lng, lat, alt, this.scene.globe.ellipsoid, new Cesium.Cartesian3());
                //var modelMatrix = Cesium.Transforms.northEastDownToFixedFrame(position);
                var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
                Cesium.Matrix4.getTranslation(modelMatrix, currentTranslation);

                Cesium.Matrix4.fromRotationTranslation(
                    currentRotation,
                    currentTranslation,
                    this.model.modelMatrix
                );
            }//if
            else {
                //this.modelMatrix = modelMatrix;
                //this.initialModelMatrix = modelMatrix.clone();

                var currentTranslation = new Cesium.Cartesian3();
                var currentRotation = new Cesium.Matrix3();
                Cesium.Matrix4.getRotation(modelMatrix, currentRotation);

                var position = Cesium.Cartesian3.fromDegrees(lng, lat, alt, this.scene.globe.ellipsoid, new Cesium.Cartesian3());
                //var modelMatrix = Cesium.Transforms.northEastDownToFixedFrame(position);
                var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
                Cesium.Matrix4.getTranslation(modelMatrix, currentTranslation);

                var rotateQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, -heading);
                var turnQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_X, -tilt);
                var rollQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Y, -roll);

                var frontWheelQuat = Cesium.Quaternion.multiply(rotateQuat, turnQuat, new Cesium.Quaternion());
                Cesium.Quaternion.multiply(frontWheelQuat, rollQuat, frontWheelQuat);

                var rM = new Cesium.Matrix3();
                Cesium.Matrix3.fromQuaternion(frontWheelQuat, rM);

                Cesium.Matrix3.multiply(currentRotation, rM, currentRotation);

                Cesium.Matrix4.fromRotationTranslation(
                    currentRotation,
                    currentTranslation,
                    this.model.modelMatrix
                );

                /*
                var currentTranslation = new Cesium.Cartesian3();
                var currentRotation = new Cesium.Matrix3();
                Cesium.Matrix4.getRotation(this.initialModelMatrix, currentRotation);

                var position = Cesium.Cartesian3.fromDegrees(lng, lat, alt, this.scene.globe.ellipsoid, new Cesium.Cartesian3());
                var modelMatrix = Cesium.Transforms.northEastDownToFixedFrame(position);
                //var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
                Cesium.Matrix4.getTranslation(modelMatrix, currentTranslation);

                var rotateQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, heading);
                var turnQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Y, -tilt);
                var rollQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_X, -roll);

                var cQ = new Cesium.Quaternion();
                Cesium.Quaternion.fromRotationMatrix(currentRotation, cQ);

                var frontWheelQuat = Cesium.Quaternion.multiply(cQ, rotateQuat, new Cesium.Quaternion());
                Cesium.Quaternion.multiply(frontWheelQuat, turnQuat, frontWheelQuat);
                Cesium.Quaternion.multiply(frontWheelQuat, rollQuat, frontWheelQuat);

                this.model.modelMatrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
                    currentTranslation,
                    frontWheelQuat,
                    this.scale
                );
                */
            }//if

            Cesium.Matrix4.multiplyByScale(this.model.modelMatrix, this.scale, this.model.modelMatrix);

            if(this.nameModel && this.nameModel != 1) {
                var altOffset = 1;
                if(this.spec) altOffset += this.spec.vehiclealt;

                for(var i= 0, n=this.billboards.length;i<n;i++) {
                    var x = this.billboards.get(i);
                    x.position = Cesium.Cartesian3.fromDegrees(lng, lat, alt+altOffset);
                }//for

                for(var i= 0, n=this.labels.length;i<n;i++) {
                    var x = this.labels.get(i);
                    x.position = Cesium.Cartesian3.fromDegrees(lng, lat, alt+altOffset);
                }//for
            }//if
        }//if

        this.lat = lat;
        this.lng = lng;
        this.alt = alt;

        this.heading = heading;
        this.tilt = tilt;
        this.roll = roll;
    };

    this.setLocationRotation = function (lat, lng, alt, quaternion) {
    	if(isNaN(lat)) lat = 0;
    	if(isNaN(lng)) lng = 0;
    	if(isNaN(alt)) alt = 0;

        if (this.loaded) {
            var position = Cesium.Cartesian3.fromDegrees(lng, lat, alt, this.scene.globe.ellipsoid, new Cesium.Cartesian3());

            var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

            if(!this.initialModelMatrix) {
                this.model.modelMatrix = this.modelMatrix = modelMatrix;
                this.initialModelMatrix = modelMatrix.clone();
            }//if

            var currentTranslation = new Cesium.Cartesian3();
            var currentRotation = new Cesium.Matrix3.fromQuaternion(quaternion);

            //var currentRotation = new Cesium.Matrix3();
            //Cesium.Matrix4.getRotation(this.initialModelMatrix, currentRotation);
            //Cesium.Matrix3.multiply(new Cesium.Matrix3.fromQuaternion(quaternion), currentRotation, currentRotation);

            var modelTranslation = Cesium.Matrix4.getTranslation(this.model.modelMatrix, new Cesium.Cartesian3());

            var position = Cesium.Cartesian3.fromDegrees(lng, lat, alt, this.scene.globe.ellipsoid, new Cesium.Cartesian3());
            var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
            Cesium.Matrix4.getTranslation(modelMatrix, currentTranslation);

            Cesium.Matrix4.fromRotationTranslation(
                currentRotation,
                currentTranslation,
                this.model.modelMatrix
            );

            Cesium.Matrix4.multiplyByScale(this.model.modelMatrix, this.scale, this.model.modelMatrix);

            //this.model.modelMatrix[14] = alt;

            //this.location.setLatLngAlt(lat, lng, alt);

            this.lat = lat;
            this.lng = lng;
            this.alt = alt;

            //var gAlt = this.getAltitude(new LatLng(lat, lng));

            if(this.nameModel && this.nameModel != 1) {
                this.nameModel.modelMatrix = modelMatrix;
            }//if

            //this.orientation.set(heading.toDeg(), tilt.toDeg(), roll.toDeg());
        }//if
    };

    // TODO: Load name object
    this.setName = function(lat, lng, alt, name, img) {
    	if(isNaN(lat)) lat = 0;
    	if(isNaN(lng)) lng = 0;
    	if(isNaN(alt)) alt = 0;

        if (this.loaded) {
            if(this.nameModel == 1) return;

            if(this.nameModel) {
                return;
            }//if

            if(name) {
                this.nameModel = 1;

                /*if(img) {
                    this.billboards.add({
                        image : img,
                        position : Cesium.Cartesian3.fromDegrees(lng, lat, alt+this.spec.vehiclealt+1),
                        //eyeOffset: new Cesium.Cartesian3(0,0,0),
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER
                    });

                    this.nameModel = this.billboards;
                }//if
                else*/ if(name) {
                    this.labels.add({
                        text: name,
                        position: Cesium.Cartesian3.fromDegrees(lng, lat, alt+this.spec.vehiclealt+1),
                        //eyeOffset: new Cesium.Cartesian3(0,0,0),
                        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                        font : '18px sans-serif'
                    });

                    this.nameModel = this.labels;
                }//if
            }//if
        }//if
    };

    this.setScale = function (x, y, z) {
        if (this.model && this.loaded) {
            // TODO: Set scale for each AXIS
            if(this.scaleX != x || this.scaleY != y || this.scaleZ != z) {
                this.model.scale = new Cesium.Cartesian3(x, y, z);
            }//if
        }//if
    };

    this.getVisibility = function() {
        return this.visibility;
    };

    this.setVisibility = function (flag) {
        if (this.visibility != flag) {
            if(this.model) this.model.show = flag;

            if(this.billboards) {
                for(var i= 0, n=this.billboards.length;i<n;i++) {
                    var x = this.billboards.get(i);
                    x.show = flag;
                }//for
            }//if

            if(this.labels) {
                for(var i= 0, n=this.labels.length;i<n;i++) {
                    var x = this.labels.get(i);
                    x.show = flag;
                }//for
            }//if

            this.visibility = flag;
        }//if
    }
};

function Attitude(scene) {
    this.loaded = false;
    this.scene = scene;
    this.opacity = 1;
    this.visibility = true;
    this.drawOrder = false;
    this.sizeX = Infinity;
    this.sizeY = Infinity;
    this.tilt = Infinity;
    this.roll = Infinity;
    this.positionX = Infinity;
    this.positionY = Infinity;
    this.anchorX = Infinity;
    this.anchorY = Infinity;

    this.load = function() {
        this.overlay = $(document.createElement('div')).appendTo('#map3d-container');
        this.overlay.addClass('attitude_indicator');
        this.overlay.css({
            position: "absolute",
            top: "50px",
            left: "100px",
            right: "100px",
            bottom: "50px"
        });

        this.attitude = new AttitudeIndicator('.attitude_indicator');

        this.loaded = true;
    };

    this.remove = function () {
        this.loaded = false;

        this.overlay.remove();
    };

    this.setPosition = function(x, y, anchorX, anchorY) {
        var that = this;

        if(this.loaded) {
            this.overlay.css({
                position: "absolute",
                top: (anchorY+y)+"px",
                left: (anchorX+x)+"px"
            });

            this.anchorX = anchorX;
            this.anchorY = anchorY;
            this.positionX = x;
            this.positionY = y;
        }
    };

    this.setAttitude = function(tilt, roll) {
        if(!this.loaded) return;

        if(this.tilt != tilt || this.roll != roll) {
            this.attitude.updateAngles(-roll.toFixed(2), -tilt.toFixed(2));

            this.tilt = tilt;
            this.roll = roll;
        }//if
    };

    this.setSize = function(x, y) {
        if(!this.loaded) return;

        if(this.sizeX != x || this.sizeY != y) {
            this.overlay.css({
                width: x+"px",
                height: y+"px"
            });

            this.sizeX = x;
            this.sizeY = y;
        }//if
    };

    this.setOpacity = function(opacity) {
        if(!this.loaded) return;

        if (this.opacity != opacity) {
            if (this.opacity > 0 && opacity == 0) this.setVisibility(false);
            if (this.opacity == 0 && opacity > 0) this.setVisibility(true);
            this.opacity = opacity;
            this.overlay.css('opacity', opacity);
        }
    };

    this.getVisibility = function() {
        return this.visibility;
    };

    this.setVisibility = function(visibility) {
        if(!this.loaded) return;

        if(this.visibility != visibility) {
            this.overlay.css("visibility", visibility ? 'visible' : 'hidden');
            this.visibility = visibility;
        }//if
    };

    this.setDrawOrder = function (drawOrder) {
        if(this.drawOrder != drawOrder) {
            this.overlay.css('zIndex', drawOrder);

            this.drawOrder = drawOrder;
        }//if
    };
};

function Sprite(scene, url, spec) {
    this.loaded = false;
    this.scene = scene;
    this.url = url;
    this.spec = spec;
    this.opacity = 1;
    this.visibility = true;
    this.drawOrder = false;
    this.sizeX = Infinity;
    this.sizeY = Infinity;
    this.rotation = Infinity;
    this.positionX = Infinity;
    this.positionY = Infinity;
    this.anchorX = Infinity;
    this.anchorY = Infinity;

    this.load = function() {
        this.overlay = $(document.createElement('div')).appendTo('#map3d-container');
        this.overlay.css({
            position: "absolute",
            top: "0px",
            left: "0px"
        });
        this.image = $(document.createElement('img')).appendTo(this.overlay);
        this.image.attr('src', url);

        this.loaded = true;
    };

    this.remove = function () {
        this.loaded = false;

        this.overlay.remove();
    };

    this.setPosition = function(x, y, anchorX, anchorY) {
        var that = this;

        if(this.loaded) {
            this.overlay.css({
                position: "absolute",
                top: (anchorY+y)+"px",
                left: (anchorX+x)+"px"
            });

            this.anchorX = anchorX;
            this.anchorY = anchorY;
            this.positionX = x;
            this.positionY = y;
        }
    };

    this.setRotation = function(angle) {
        if(!this.loaded) return;

        if(this.rotation != angle) {
            //this.overlay.setRotation(angle);
            this.overlay.css({
                '-ms-transform': 'rotate('+angle+'deg)', /* IE 9 */
                '-webkit-transform': 'rotate('+angle+'deg)', /* Chrome, Safari, Opera */
                'transform': 'rotate('+angle+'deg)'
            });

            this.rotation = angle;
        }//if
    };

    this.setSize = function(x, y) {
        if(!this.loaded) return;

        if(this.sizeX != x || this.sizeY != y) {
            this.overlay.css({
                width: x+"px",
                height: y+"px"
            });

            this.sizeX = x;
            this.sizeY = y;
        }//if
    };

    this.setOpacity = function(opacity) {
        if(!this.loaded) return;

        if (this.opacity != opacity) {
            if (this.opacity > 0 && opacity == 0) this.setVisibility(false);
            if (this.opacity == 0 && opacity > 0) this.setVisibility(true);
            this.opacity = opacity;
            this.overlay.css('opacity', opacity);
        }
    };

    this.getVisibility = function() {
        return this.visibility;
    };

    this.setVisibility = function(visibility) {
        if(!this.loaded) return;

        if(this.visibility != visibility) {
            this.overlay.css("visibility", visibility ? 'visible' : 'hidden');
            this.visibility = visibility;
        }//if
    };

    this.setDrawOrder = function (drawOrder) {
        if(this.drawOrder != drawOrder) {
            this.overlay.css('zIndex', drawOrder);

            this.drawOrder = drawOrder;
        }//if
    };
};

function SpriteNumber(scene, left, right, top, bottom, unit) {
    this.loaded = false;
    this.scene = scene;
    this.value = Infinity;
    this.positionX = Infinity;
    this.positionY = Infinity;
    this.lastUpdate = 0;

    this.object = $(document.createElement('div')).appendTo('#map3d-container');
    this.object.addClass('sprite-number-container');
    this.object.css('position', 'absolute');

    if(left) this.object.css('left', left+'px');
    else if(right) this.object.css('right', right+'px');

    if(top) this.object.css('top', top+'px');
    else if(bottom) this.object.css('bottom', bottom+'px');

    this.valueContainer = $(document.createElement('span')).appendTo(this.object);
    this.valueContainer.addClass('sprite-number-value');
    this.unitContainer = $(document.createElement('span')).appendTo(this.object);

    if(unit) {
        this.unitContainer.addClass('sprite-number-unit');
        this.unitContainer.html(unit);
    }//if

    this.loaded = true;

    this.setPosition = function(left, right, top, bottom) {
        if(!this.loaded) return;

        if(left) this.object.css('left', left+'px');
        else if(right) this.object.css('right', right+'px');

        if(top) this.object.css('top', top+'px');
        else if(bottom) this.object.css('bottom', bottom+'px');
    };

    this.setValue = function(value) {
        if(!this.loaded) return;

        if(this.value != value) {
            this.valueContainer.html(value);

            this.value = value;
        }//if
    };

    this.remove = function() {
        this.object.remove();

        this.loaded = false;
    };
};

function Text(scene, left, right, top, bottom, unit) {
    this.loaded = false;
    this.scene = scene;
    this.value = Infinity;
    this.positionX = Infinity;
    this.positionY = Infinity;
    this.lastUpdate = 0;

    this.object = $(document.createElement('div')).appendTo('#map3d-container');
    this.object.addClass('sprite-number-container');
    this.object.css('position', 'absolute');

    if(left) this.object.css('left', left+'px');
    else if(right) this.object.css('right', right+'px');

    if(top) this.object.css('top', top+'px');
    else if(bottom) this.object.css('bottom', bottom+'px');

    this.unitContainer = $(document.createElement('span')).appendTo(this.object);

    if(unit) {
        this.unitContainer.addClass('sprite-number-unit');
        this.unitContainer.html(unit);
    }//if

    this.loaded = true;

    this.setPosition = function(left, right, top, bottom) {
        if(!this.loaded) return;

        if(left) this.object.css('left', left+'px');
        else if(right) this.object.css('right', right+'px');

        if(top) this.object.css('top', top+'px');
        else if(bottom) this.object.css('bottom', bottom+'px');
    };

    this.remove = function() {
        this.object.remove();

        this.loaded = false;
    };
};

// TODO: Convert to HTML elements
function SpriteRPM(scene, left, right, top, bottom, fontW, fontH, figures, digitImagePrefix) {
    this.loaded = false;
    this.scene = scene;
    this.value = Infinity;
    this.positionX = Infinity;
    this.positionY = Infinity;
    this.lastUpdate = 0;

    this.object = $(document.createElement('div')).appendTo('#map3d-container');
    this.object.css({
        'position': 'absolute',
        'width': (fontW*(figures+1))+'px',
        'height': (fontH)+'px'
    });

    if(left) this.object.css('left', left+'px');
    else if(right) this.object.css('right', right+'px');

    if(top) this.object.css('top', top+'px');
    else if(bottom) this.object.css('bottom', bottom+'px');

    this.sprites = [];
    var _g = 1;
    while (_g <= figures) {
        var i = _g++;
        this.sprites[i] = [];

        this.sprites[i][0] = $(document.createElement('img')).appendTo(this.object);
        this.sprites[i][0].attr('src', digitImagePrefix + "background_" + i + ".png");
        this.sprites[i][0].css({
            'position': 'absolute',
            'left': (fontW * i)+'px',
            'top': '0px',
            'opacity': 1,
            'zIndex': 1
        });

        this.sprites[i][1] = $(document.createElement('img')).appendTo(this.object);
        this.sprites[i][1].attr('src', digitImagePrefix + i + ".png");
        this.sprites[i][1].css({
            'position': 'absolute',
            'left': (fontW * i)+'px',
            'top': '0px',
            'opacity':.005,
            'zIndex': 2
        });
    }

    this.loaded = true;

    this.setPosition = function(left, right, top, bottom) {
        if(!this.loaded) return;

        if(left) this.object.css('left', left+'px');
        else if(right) this.object.css('right', right+'px');

        if(top) this.object.css('top', top+'px');
        else if(bottom) this.object.css('bottom', bottom+'px');

    };

    this.setValue = function(value) {
        if(!this.loaded) return;

        if(this.value != value) {
            var x = value * figures / 100;

            var _g = 1;
            while (_g <= figures) {
                var i = _g++;

                if(i < x) {
                    this.sprites[i][1].css('opacity', 1);
                }//if
                else {
                    this.sprites[i][1].css('opacity', .005);
                }//else
            }

            this.value = value;
        }//if
    };

    this.remove = function() {
        this.object.remove();

        this.loaded = false;
    };
};

DrivingSimulator = function () {
    this.ee = new EventEmitter();

    this.tooFar = false;
    this.isSpawning = true;
    this.startTime = Date.now();
    this.currentTime = Date.now();
    this.prevTime = Date.now();
    this.deltaTime = 0;

    this.fps = 0;
    this.framesCounter = 0;
    this.frameCheckTimer = Date.now();

    this.doUpdate = false;
    this.lastUpdate = 0;
    this.other = false;
    this.wheelAngle = 0;
    this.isRightHandDrive = false;
    this.viewPointIndex = 0;
    this.vehicle = false;
    this.vehicleData = false;
    this.name = false;
    this.icon = false;
    this.teleported = true;
    this.isSpawningDiv = false;
    this.isSpawningStart = 0;
    this.active = true;
    this.element = false;
    this.keyState = [];
    this.keyStates = [];
    this.keyCount = [];
    this.preventKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
    var _g = 1;
    while (_g < 100) {
        var i = _g++;
        this.keyCount[i] = 0
    }

    this.hasLandingGear = false;

    this.pause = false;
    this.gearDownCount = 0;
    this.gearUpCount = 0;
    this.viewY = 0;
    this.viewX = 0;
    this.handbrake = 0;
    this.handbrakeCount = 0;
    this.displayPositionCount = 0;
    this.switchDriverSheetCount = 0;
    this.changeViewPointCount = 0;
    this.changeCruiseControlCount = 0;
    this.cruiseControl = 0;
    this.changeCompassCount = 0;
    this.changeFpsCount = 0;
    this.showCompass = 0;
    this.showFps = 0;
    this.brake = 0;
    this.throttle = 0;
    this.steeringDelta = 0;
    this.altitudeOffset = 0;
    this.tiltOffset = 0;
    this.rollOffset = 0;
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;

    this.lastSpeedKmh = 0;
    this.lastTiltOffset =
    this.removeBodies = [];
    this.components = [];
    this.componentsForces = {};

    this.totalkms = 0;
    this.totalmeters = 0;

    this.checker = false;

    this.clouds = false;

    this.intersection = new Math3D.geometry.Intersection();

    this.destroy = function() {
	this.viewer.clock.onTick.removeEventListener($bind(this, this.update));

        if(this.bodyModel) this.bodyModel.remove();
        if(this.components) {
            for(var j= 0, n=this.components.length; j<n; j++) {
                delete this.componentsForces[this.components[j].spec._id];
                this.components[j].remove();
            }//if
        }//if
        //if(this.shadow) this.shadow.remove();

        if(this.clouds) this.clouds.remove();

        this.removeOverlays();

        try {
            if(window.audioMonkey) {
                window.audioMonkey.remove(this.username+"_forward");
                window.audioMonkey.remove(this.username+"_slip");
                window.audioMonkey.remove(this.username+"_vehicleCrash");
            }//if
        } catch(err) {
            log("error", err);
        }
    };

    // TODO: Keep checking if it still works after Cesiumjs updates. Hopefully the API will provide with a function for this
    this.getLoadingPercentage = function() {
        if (typeof this.scene.globe._surface != "undefined" && typeof this.scene.globe._surface._tileLoadQueue != "undefined" && typeof this.scene.globe._surface._tileLoadQueue.length != "undefined") {
            return Math.max(0, 100 - this.scene.globe._surface._tileLoadQueue.length);
        }//if
        else {
            return 100;
        }//else
    };

    this.init = function (v) {
        this.vehicleData = v;

        this.onSuccess(false);
    };

    this.onSuccess = function (ge) {
        //log("info", "onSuccess");
        //log("info", ge);

        this.ge = ge;

        // Configure Cesium viewer

        this.setupKeyboard();
        this.onLoad()
    };

    this.onFailure = function(errorCode){
        // Its an error due to changing tabs so we have to ignore it
        if(document.location.pathname.match(/\/explorer/g)) return;

        log("info", "Our army of slave pidgeons detected an issue while trying to create the 3D World for you", errorCode);

        this.ge = false;

        var html = '<div class="error-message">';

        if(errorCode == "ERR_UPDATE_FUNCTION" || errorCode == "ERR_LOADPERCENT_FUNCTION") {

            html += '<div class="error-message-container"><p>'+window.langs[window.language]['ERROR_PLUGIN_TITLE']+'</p><p>'+window.langs[window.language]['ERROR_PLUGIN_MESSAGE1']+'</p><p>'+window.langs[window.language]['ERROR_PLUGIN_MESSAGE2']+'</p><p><a class="qbtn" href="/">'+window.langs[window.language]['reload_3d']+'</a></div></p></div>';
        }//if
        else if(errorCode == "ERR_CREATE_PLUGIN") {

            return;
        }//else if
        else {

            //html += '<div style="width: 315px; position: absolute; bottom: 60px; left: 40px; z-index: 1; background-color: rgba(0, 0, 0, 0.6); padding: 20px; color: white;"><p><a href="http://en.wikipedia.org/wiki/Houston,_We\'ve_Got_a_Problem" target="_blank">Houston, We\'ve Got a Problem</a></p><p>There was a problem loading the Google Earth Plugin.</p><p>Maybe it\'s missing.. You can download it from <a href="http://www.google.com/earth/explore/products/plugin.html" target="_blank">here</a></p><p><a class="btn btn-large btn-success" href="/">Reload 3D</a></div></p></div>';
            html += '<div class="error-message-container"><p>'+window.langs[window.language]['ERROR_PLUGIN_TITLE']+'</p><p>'+window.langs[window.language]['ERROR_PLUGIN_MESSAGE1']+'</p><p><a class="qbtn" href="/">'+window.langs[window.language]['reload_3d']+'</a></div></p></div>';
        }//else

        html += '</div>';

        $('#map3d').html(html);
    };

    this.setViewPoints = function() {
        // Default viewpoints
        this.viewPoints = [
            //new ViewPoint("fps", this.vehicleData.camheight*0.5, 0, 90, 0, 0),
            new ViewPoint("normal", this.vehicleData.camheight, -this.vehicleData.traildistance, 83, 0, 0),
            new ViewPoint("normal", this.vehicleData.camheight*2.5, -this.vehicleData.traildistance*2, 79, 0, 0),
            new ViewPoint("top_panoramic", this.vehicleData.camheight*10, -this.vehicleData.traildistance*2, 45, 0, 0),
            new ViewPoint("top", this.vehicleData.camheight*20, 0, 0, 0, 0)
        ];

        if(this.vehicleData.vehicleCameras && this.vehicleData.vehicleCameras.length > 0) {
            for(var i= 0, n= this.vehicleData.vehicleCameras.length; i<n; i++) {
                var c = this.vehicleData.vehicleCameras[i];

                this.viewPoints.push(new ViewPoint(c.type, c.altitude, c.offset, c.tilt, c.dir, c.heading));
            }//for
        }//if
    };

    this.drawOverlays = function(resetLeft, resetRight) {
        log("info", "drawOverlays", this.username);

        try {
            if(this.vehicleData.showSpeed) {
                if(!this.speedOverlay || resetRight) {
                    if(this.speedOverlay) this.speedOverlay.remove();

                    var temp = this.vehicleData.maxspeed*4;
                    var counter = 1;
                    while((temp = parseInt(temp/10)) > 0) {
                        counter++;
                    }//while

                    if(this.vehicleData.showAltitude) {
                        if(window.unit.toLowerCase() == "km") this.speedOverlay = new SpriteNumber(this.scene, false, 25, false, 78, "km/h");
                        if(window.unit.toLowerCase() == "mi") this.speedOverlay = new SpriteNumber(this.scene, false, 25, false, 78, "mph");
                    }//if
                    else {
                        if(window.unit.toLowerCase() == "km") this.speedOverlay = new SpriteNumber(this.scene, false, 25, false, 53, "km/h");
                        if(window.unit.toLowerCase() == "mi") this.speedOverlay = new SpriteNumber(this.scene, false, 25, false, 53, "mph");
                    }//else
                }//if
            }//if
            else {
                if(this.speedOverlay) this.speedOverlay.remove();

                this.speedOverlay = null;
            }//else

            if(this.vehicleData.showAltitude) {
                if(!this.altitudeOverlay || resetRight) {
                    if(this.altitudeOverlay) this.altitudeOverlay.remove();
                    //this.altitudeOverlay = new SpriteNumber(this.ge, window.SITE_URL+"/img/units_mph.png");

                    var counter = 10;

                    if(window.unit.toLowerCase() == "km") this.altitudeOverlay = new SpriteNumber(this.scene, false, 25, false, 53, "m");
                    if(window.unit.toLowerCase() == "mi") this.altitudeOverlay = new SpriteNumber(this.scene, false, 25, false, 53, "ft");
                }//if
            }//if
            else {
                if(this.altitudeOverlay) this.altitudeOverlay.remove();

                this.altitudeOverlay = null;

            }//else

            if(this.vehicleData.showRPM) {
                if(!this.rpmOverlay || resetRight) {
                    if(this.gearOverlay) this.gearOverlay.remove();

                    var temp = this.vehicleData.maxGear;
                    var counter = 2;
                    while((temp = parseInt(temp/10)) > 0) {
                        counter++;
                    }//while

                    if(!this.vehicleData.showAltitude && !this.vehicleData.showSpeed) {
                        this.gearOverlay = new SpriteNumber(this.scene, false, 60, false, 53);
                    }//if
                    else if(!this.vehicleData.showAltitude) {
                        this.gearOverlay = new SpriteNumber(this.scene, false, 60, false, 78);
                    }//else if
                    else {
                        this.gearOverlay = new SpriteNumber(this.scene, false, 60, false, 103);
                    }//else

                    if(this.rpmOverlay) this.rpmOverlay.remove();

                    var counter = 5;

                    if(!this.vehicleData.showAltitude && !this.vehicleData.showSpeed) {
                        this.rpmOverlay = new SpriteRPM(this.scene, false, 25, false, 55, 6, 19, counter, window.SITE_URL+"/img/bar_v2_");
                    }//if
                    else if(!this.vehicleData.showAltitude) {
                        this.rpmOverlay = new SpriteRPM(this.scene, false, 25, false, 80, 6, 19, counter, window.SITE_URL+"/img/bar_v2_");
                    }//else if
                    else {
                        this.rpmOverlay = new SpriteRPM(this.scene, false, 25, false, 105, 6, 19, counter, window.SITE_URL+"/img/bar_v2_");
                    }//else
                }//if
            }//if
            else {
                if(this.rpmOverlay) this.rpmOverlay.remove();
                if(this.gearOverlay) this.gearOverlay.remove();

                this.rpmOverlay = null;
                this.gearOverlay = null;
            }//else

            if(this.cruiseControl) {
                if(!this.cruiseControlOverlay || resetLeft) {
                    if(this.cruiseControlOverlay) this.cruiseControlOverlay.remove();

                    var yOffset = 0;
                    if(window.transmittingVideo) yOffset += 110;

                    if(this.vehicleData.mainCategory == "ground") {
                        this.cruiseControlOverlay = new Text(this.scene, 25, false, false, (53+yOffset), "cruise");
                    }//if
                    else {
                        this.cruiseControlOverlay = new Text(this.scene, 25, false, false, (53+yOffset), "autopilot");
                    }//else
                    this.cruiseControlOverlay.unitContainer.css('padding-left','0px');
                }//if
            }//if
            else {
                if(this.cruiseControlOverlay) this.cruiseControlOverlay.remove();
                this.cruiseControlOverlay = null;
            }//else

            if(!this.vehicle.automatic && this.vehicleData.mainCategory == "ground") {
                if(!this.transmissionOverlay || resetLeft) {
                    if(this.transmissionOverlay) this.transmissionOverlay.remove();
                    this.transmissionOverlay = new Sprite(this.scene, window.SITE_URL+"/img/manual_transmission_v2.png?"+window.version);
                    this.transmissionOverlay.load();

                    var yOffset = 0;

                    if(this.cruiseControlOverlay) yOffset += 23;
                    if(window.transmittingVideo) yOffset += 110;

                    this.transmissionOverlay.setPosition(25, $('#map3d').height()-(80+yOffset), 0, 0);
                    this.transmissionOverlay.setOpacity(1);
                    this.transmissionOverlay.setDrawOrder(100);
                }//if
            }//if
            else {
                if(this.transmissionOverlay) this.transmissionOverlay.remove();
                this.transmissionOverlay = null;
            }//else

            if(this.showCompass) {
                if(!this.compassOverlay || (resetRight && resetLeft)) {
                    if(this.compassOverlay) this.compassOverlay.remove();
                    if(this.compassNeedleOverlay) this.compassNeedleOverlay.remove();

                    this.compassOverlay = new Sprite(this.scene, window.SITE_URL+"/img/compass_gauge_v2.png?"+window.version);
                    //this.compassOverlay = new Sprite(this.ge, "http://i315.photobucket.com/albums/ll450/Zamagames/compass2.png");
                    this.compassOverlay.load();

                    //this.compassOverlay.setSize(120, 120);
                    this.compassOverlay.setPosition($('#map3d').width()/2-50, $('#map3d').height()-105, 0, 0);
                    this.compassOverlay.setOpacity(0.6);
                    this.compassOverlay.setDrawOrder(100);

                    this.compassNeedleOverlay = new Sprite(this.scene, window.SITE_URL+"/img/compass_needle_v2.png?"+window.version);
                    this.compassNeedleOverlay.load();

                    //this.compassNeedleOverlay.setSize(120, 120);
                    this.compassNeedleOverlay.setPosition($('#map3d').width()/2-50, $('#map3d').height()-105, 0, 0);
                    this.compassNeedleOverlay.image.css('-webkit-filter', 'invert(100%)');
                    this.compassNeedleOverlay.image.css('filter', 'invert(100%)');
                    this.compassNeedleOverlay.setOpacity(1);
                    this.compassNeedleOverlay.setDrawOrder(150);
                }//if

                if(this.vehicleData.mainCategory == "air") {
                    if (!this.attitudeOverlay || (resetRight && resetLeft)) {
                        if (this.attitudeOverlay) this.attitudeOverlay.remove();

                        this.attitudeOverlay = new Attitude(this.scene);
                        this.attitudeOverlay.load();

                        this.attitudeOverlay.setDrawOrder(50);
                    }//if
                }//if
                else {
                    if (this.attitudeOverlay) this.attitudeOverlay.remove();
                }//else
            }//if
            else {
                if(this.attitudeOverlay) this.attitudeOverlay.remove();
                if(this.compassOverlay) this.compassOverlay.remove();
                if(this.compassNeedleOverlay) this.compassNeedleOverlay.remove();

                this.attitudeOverlay = null;
                this.compassOverlay = null;
                this.compassNeedleOverlay = null;
            }//else

            if(this.showFps) {
                if(!this.fpsOverlay || (resetRight && resetLeft)) {
                    if(this.fpsOverlay) this.fpsOverlay.remove();

                    this.fpsOverlay = new SpriteNumber(this.scene, false, 25, 30, false, "fps");
                }//if
            }//if
            else {
                if(this.fpsOverlay) this.fpsOverlay.remove();

                this.fpsOverlay = null;
            }//else
        } catch (err) {
            log("error", "drawOverlays", err);
        };
    };

    this.removeOverlays = function() {
        try {
            if(this.speedOverlay) this.speedOverlay.remove();
            this.speedOverlay = null;

            if(this.altitudeOverlay) this.altitudeOverlay.remove();
            this.altitudeOverlay = null;
            if(this.rpmOverlay) this.rpmOverlay.remove();
            this.rpmOverlay = null;
            if(this.gearOverlay) this.gearOverlay.remove();
            this.gearOverlay = null;
            if(this.fpsOverlay) this.fpsOverlay.remove();
            this.fpsOverlay = null;
            if(this.attitudeOverlay) this.attitudeOverlay.remove();
            this.attitudeOverlay = null;
            if(this.compassOverlay) this.compassOverlay.remove();
            if(this.compassNeedleOverlay) this.compassNeedleOverlay.remove();
            this.compassOverlay = null;
            this.compassNeedleOverlay = null;
            if(this.transmissionOverlay) this.transmissionOverlay.remove();
            this.transmissionOverlay = null;
            if(this.cruiseControlOverlay) this.cruiseControlOverlay.remove();
            this.cruiseControlOverlay = null;
        } catch (err) {
            log("error", "removeOverlays", err);
        };
    };

    // TODO: Convert to Cesium object
    this.loadCloudCover = function() {
        //if(!this.ge) return null;

        var sphere = {};

        sphere = new Model(this.scene, window.SITE_URL+"/models/sphere_2.gltf", false, false, false, false, false, false);
        sphere.load("cloudCover");

        /*
        sphere.placemark = this.ge.createPlacemark('');
        sphere.model = this.ge.createModel('');
        sphere.placemark.setGeometry(sphere.model);
        sphere.link = this.ge.createLink('');
        sphere.link.setHref(window.SITE_URL+"/models/sphere.dae");
        sphere.model.setLink(sphere.link);
        sphere.orientation = sphere.model.getOrientation();
        sphere.location = sphere.model.getLocation();
        sphere.scale = sphere.model.getScale();
        sphere.model.setAltitudeMode(this.ge.ALTITUDE_ABSOLUTE);
        this.ge.getFeatures()
            .appendChild(sphere.placemark);
            */

        return sphere;
    };

    // TODO: Convert to Cesium object
    this.updateCloudCover = function() {
        //if(!this.ge) return null;

        function fixAngle(a) {
            while (a <= -180) {
                a += 360
            }
            while (a >= 180) {
                a -= 360
            }
            return a
        };

        if (this.clouds) {
            // TODO: Get from Camera data
            /*
            this.clouds.location.setLatLngAlt(this.vehiclePosition.lat(), this.vehiclePosition.lng(), (-6278100 / 10) + 8000 - (this.vehicleAltitude.position * 1));
            this.clouds.orientation.set(180, this.vehiclePosition.lat(), fixAngle(-this.vehiclePosition.lng() + 180));
            */
            var scale = 0.1 + (this.vehicleAltitude.position / 2000000);
            //this.clouds.scale.set(scale, scale, scale);

            this.clouds.scale = new Cesium.Cartesian3(scale, scale, scale);
            this.clouds.setLocation(this.vehiclePosition.lat(), this.vehiclePosition.lng(), (-6278100 / 10) + 8000 - (this.vehicleAltitude.position * 1), 3.141592653589793, this.vehiclePosition.lat().toRad(), fixAngle(-this.vehiclePosition.lng() + 180).toRad());
        }//if
    };

    this.onLoad = function () {
        //log("info", "onLoad start");

        window.currentVehicle = this.vehicleData._id.toString();

        this.setViewPoints();

        //this.clouds = this.loadCloudCover();

        if(this.bodyModel) this.bodyModel.remove();
        this.bodyModel = new Model(this.scene, this.vehicleData.chassi ? this.vehicleData.chassi.url : "https://dl.dropboxusercontent.com/u/3050123/Archive3.gltf", false, false, this.vehicleData.modelxscale, this.vehicleData.modelyscale, this.vehicleData.modelzscale, this.vehicleData);
        this.bodyModel.load(this.username);

        if(this.components) {
            for(var j= 0, n=this.components.length; j<n; j++) {
                delete this.componentsForces[this.components[j].spec._id];
                this.components[j].remove();
            }//if
        }
        this.components = [];
        if(this.vehicleData.vehicleComponents) {
            for(var j= 0, n=this.vehicleData.vehicleComponents.length; j<n; j++) {
                var c = this.vehicleData.vehicleComponents[j];
                var obj = false;

                //if(c && c.modelGl) {
                    if(c.type == "landingGear") {
                        this.hasLandingGear = true;
                    }//if

                    obj = new Model(this.scene, false, false, false, c.componentsXScale, c.componentsYScale, c.componentsZScale, c);
                    //obj.load();

                    this.components.push(obj);

                    this.componentsForces[c._id] = {
                        force: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        impulse: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        torque: {
                            x: 0,
                            y: 0,
                            z: 0
                        }
                    };
                    //i++;
                //}//if
            }//for
        }//if

        this.setupVehicle(window.lat, window.lon, window.heading, this.getAltitude(new LatLng(window.lat, window.lon), "startLocation"));
        this.prevCamera = new LatLngAlt(0, 0, 0);
        //log("info", "onLoad finished");
        this.currentTime = Date.now();
        //log("info", "Setup Frameend Handler");

        this.drawOverlays(true, true);

        var that = this;

        this.viewer.clock.onTick.addEventListener($bind(this, this.update));

        //log("info", "onLoad end");
    };

    this.onReLoad = function () {
        //this.overlay.setVisibility(true);

        this.setViewPoints();

        this.cruiseControl = false;

        if(this.stallOverlay) this.stallOverlay.remove();
        if(this.cruiseControlOverlay) this.cruiseControlOverlay.remove();
        if(this.transmissionOverlay) this.transmissionOverlay.remove();

        this.stallOverlay = null;
        this.cruiseControlOverlay = null;
        this.transmissionOverlay = null;

        if(this.bodyModel) this.bodyModel.remove();
        this.bodyModel = new Model(this.scene, this.vehicleData.chassi ? this.vehicleData.chassi.url : "https://dl.dropboxusercontent.com/u/3050123/Archive3.gltf", false, false, this.vehicleData.modelxscale, this.vehicleData.modelyscale, this.vehicleData.modelzscale, this.vehicleData);
        this.bodyModel.load(this.username);

        if(this.components) {
            for(var j= 0, n=this.components.length; j<n; j++) {
                delete this.componentsForces[this.components[j].spec._id];
                this.components[j].remove();
            }//if
        }
        this.components = [];
        if(this.vehicleData.vehicleComponents) {
            for(var j= 0, n=this.vehicleData.vehicleComponents.length; j<n; j++) {
                var c = this.vehicleData.vehicleComponents[j];

                //this.wheelModels[i] = new Model(this.ge, cesiumExplorer.modelsURL + "wheel.kmz");
                //if(c && c.modelGl) {
                    var obj = false;

                    if(c.type == "landingGear") {
                        this.hasLandingGear = true;
                    }//if

                    obj = new Model(this.scene, false, false, false, c.componentsXScale, c.componentsYScale, c.componentsZScale, c);
                    //obj.load();

                    this.components.push(obj);

                    this.componentsForces[c._id] = {
                        force: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        impulse: {
                            x: 0,
                            y: 0,
                            z: 0
                        },
                        torque: {
                            x: 0,
                            y: 0,
                            z: 0
                        }
                    };
                //}//if
                //i++;
            }//for
        }//if

        this.setupVehicle(window.lat, window.lon, window.heading, this.getAltitude(new LatLng(window.lat, window.lon), "startLocation"));

        this.drawOverlays(true, true);

    };

    this.changeViewPoint = function (newViewPoint) {
        if (newViewPoint != null) {
            this.viewPointIndex = newViewPoint;
        }//if
        else if (++this.viewPointIndex >= this.viewPoints.length) {
            this.viewPointIndex = 0;
        }//else if

        return;
    };

    this.onMouseUp = function () {
        this.setKeyFocus()
    };

    this.createFocusControl = function(containerid) {
    };

    this.setKeyFocus = function () {
        var canvas = this.scene.canvas;
        canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
        canvas.focus();

        this.setActive(true)
    };

    this.previousDestinationHeading = 0;
    this.previousDestinationDistance = Infinity;

    this.updateKeyStatus = function (deltaTime) {
            this.steeringDelta = 0;
            this.throttle = 0;
            this.brake = 0;
            this.viewX = 0;
            this.viewY = 0;
            this.up = false;
            this.down = false;
            this.left = false;
            this.right = false;

        if(this.isSpawning) return;

        if (this.getStickX() != 0) this.steeringDelta = this.getStickX();
        else if (this.gamepad && this.gamepad.getLeftStickX() != 0) this.steeringDelta = this.gamepad.getLeftStickX();
        else {
            if(this.cruiseControl) {
                //if(this.vehicle.steering.angle < this.lastSteeringAngle) this.steeringDelta = 1;
                //else if(this.vehicle.steering.angle > this.lastSteeringAngle) this.steeringDelta = -1;

                this.vehicle.steering.angle = this.lastSteeringAngle;
            }//if
        }//else

        if (this.gamepad && this.gamepad.getThrottle() > 0) this.throttle = 1;
        else if (this.gamepad && this.gamepad.getBrake() > 0) this.brake = 1;
        else {
            //if (this.isDown(38)) this.throttle = 1;
            //if (this.isDown(40)) this.brake = 1;
            if (this.isDown(cca(this.keybindings.keyboard.throttle, 0))) this.throttle = 1;
            else if (this.isDown(cca(this.keybindings.keyboard.brake, 0))) this.brake = 1;
            else {
                if(this.cruiseControl) {
                    if(this.lastSpeedKmh > this.vehicle.getSpeedKmh()) {
                        this.throttle = 1;
                    }//if
                    else if(this.lastSpeedKmh < this.vehicle.getSpeedKmh()) {
                        this.throttle = 0;
                    }//else if
                }//if
                else {
                    this.throttle = this.brake = 0;
                }//else
            }//else
        }//else

        if (this.gamepad && this.gamepad.getCamera() > 0) this.changeViewPointCount++;
        //else if (this.isDown(cca("V", 0)) > 0) this.changeViewPointCount++;
        else if (this.isDown(cca(this.keybindings.keyboard.camera, 0)) > 0) this.changeViewPointCount++;
        else this.changeViewPointCount = 0;

        if (this.gamepad && this.gamepad.getCruiseControl() > 0) this.changeCruiseControlCount++;
        else if (this.isDown(cca(this.keybindings.keyboard.cruiseControl, 0)) > 0) this.changeCruiseControlCount++;
        else this.changeCruiseControlCount = 0;

        if (this.gamepad && this.gamepad.getAutomatic() > 0) this.changeAutomaticCount++;
        else if (this.isDown(cca(this.keybindings.keyboard.automatic, 0)) > 0) this.changeAutomaticCount++;
        else this.changeAutomaticCount = 0;

        if (this.gamepad && this.gamepad.getGearUp() > 0) this.changeGearUpCount++;
        else if (this.isDown(cca(this.keybindings.keyboard.gearUp, 0)) > 0) this.changeGearUpCount++;
        else this.changeGearUpCount = 0;

        if (this.gamepad && this.gamepad.getGearDown() > 0) this.changeGearDownCount++;
        else if (this.isDown(cca(this.keybindings.keyboard.gearDown, 0)) > 0) this.changeGearDownCount++;
        else this.changeGearDownCount = 0;

        if (this.gamepad && this.gamepad.getCompass() > 0) this.changeCompassCount++;
        else if (this.isDown(cca(this.keybindings.keyboard.compass, 0)) > 0) this.changeCompassCount++;
        else this.changeCompassCount = 0;

        if (this.gamepad && this.gamepad.getFps() > 0) this.changeFpsCount++;
        else if (this.isDown(cca(this.keybindings.keyboard.fps, 0)) > 0) this.changeFpsCount++;
        else this.changeFpsCount = 0;

        //if (this.isDown(cca("P", 0))) this.displayPositionCount++;
        //else this.displayPositionCount = 0;
        if (this.isDown(cca("R", 0)) > 0) this.gearUpCount++;
        else this.gearUpCount = 0;
        if (this.isDown(cca("F", 0)) > 0) this.gearDownCount++;
        else this.gearDownCount = 0;

        if (this.gamepad && this.gamepad.getViewX() != 0) this.viewX = this.gamepad.getViewX();
        else {
            //if (this.isDown(cca("D", 0))) this.viewX = 1;
            //if (this.isDown(cca("A", 0))) this.viewX = -1;
            if (this.isDown(cca(this.keybindings.keyboard.lookRight, 0))) this.viewX = 1;
            else if (this.isDown(cca(this.keybindings.keyboard.lookLeft, 0))) this.viewX = -1;
            else this.viewX = 0;
        }//else
        if (this.gamepad && this.gamepad.getViewY() != 0) this.viewY = this.gamepad.getViewY();
        else {
            //if (this.isDown(cca("Q", 0))) this.viewY = 1;
            //if (this.isDown(cca("E", 0))) this.viewY = -1;
            if (this.isDown(cca(this.keybindings.keyboard.lookFront, 0))) this.viewY = 1;
            else if (this.isDown(cca(this.keybindings.keyboard.lookBack, 0))) this.viewY = -1;
            else this.viewY = 0;
        }//else
        if (this.gamepad && this.gamepad.getLeftTilt() < 0) this.up = true;
        else if (this.gamepad && this.gamepad.getLeftTilt() > 0) this.down = true;
        else {
            //if (this.isDown(cca("W", 0))) this.up = true;
            //if (this.isDown(cca("S", 0))) this.down = true;
            if (this.isDown(cca(this.keybindings.keyboard.up, 0))) this.up = true;
            else if (this.isDown(cca(this.keybindings.keyboard.down, 0))) this.down = true;
            else {
                if(this.cruiseControl) {
                        if(this.vehicleData.category != "helicopter") {
                            if(this.vehicle.tiltOffset > this.lastTiltOffset) {
                                this.vehicle.tiltOffset -= 0.2*this.vehicle.speedForward*deltaTime;
                            }//if
                            else if(this.vehicle.tiltOffset < this.lastTiltOffset) {
                                this.vehicle.tiltOffset += 0.2*this.vehicle.speedForward*deltaTime;
                            }//else if
                            else {
                                this.vehicle.tiltOffset = this.lastTiltOffset;
                            }//else
                        }//if
                        else if(this.vehicleData.category == "helicopter") {
                            this.up = this.lastUp;
                            this.down = this.lastDown;
                        }//else if
                }//if
                else {
                    this.up = false;
                    this.down = false;
                }//else
            }//else
        }//else
        if (this.isDown(cca("T", 0))) this.left = true;
        else this.left = false;
        if (this.isDown(cca("G", 0))) this.right = true;
        else this.right = false;
        if (this.gamepad && this.gamepad.getHandbrake() > 0) this.handbrake = 1;
        //else if (this.isDown(32)) this.handbrake = 1;
        else if (this.isDown(cca(this.keybindings.keyboard.handbrake, 0))) this.handbrake = 1;
        else this.handbrake = 0;

	if(this.vehicle.tiltOffset < 185) {
		this.throttle = 1;
	}//if
	else if(this.vehicle.tiltOffset > 190) {
		this.throttle = -0.1;
	}//if
	else {
		this.throttle = 0.3;
	}//else
	
	if(this.up) {
		$('#up').addClass('active');
	}//if
	else {
		$('#up').removeClass('active');
	}//else
	if(this.down) {
		$('#down').addClass('active');
	}//if
	else {
		$('#down').removeClass('active');
	}//else
	if(this.steeringDelta < 0) {
		$('#left').addClass('active');
	}//if
	else {
		$('#left').removeClass('active');
	}//else
	if(this.steeringDelta > 0) {
		$('#right').addClass('active');
	}//if
	else {
		$('#right').removeClass('active');
	}//else
	if(this.changeViewPointCount > 0) {
		$('#camera').addClass('active');
	}//if
	else {
		$('#camera').removeClass('active');
	}//else
	
        if(this.cruiseControl) {
        }//if
        else {
            try {
                this.lastSpeedKmh = this.vehicle.getSpeedKmh();
                this.lastTiltOffset = this.vehicle.tiltOffset;
                this.lastRollOffset = this.vehicle.rollOffset;
                this.lastSteeringDelta = this.steeringDelta;
                this.lastSteeringAngle = this.vehicle.steering.angle;
                this.lastAltitude = this.vehicleAltitude.position;
                this.lastUp = this.up;
                this.lastDown = this.down;
            } catch (err) {}
        }//else
    };
    this.getSteeringDelta = function () {
        return this.steeringDelta
    };
    this.getThrottle = function () {
        return this.throttle
    };
    this.getBrake = function () {
        return this.brake
    };
    this.getHandbrake = function () {
        return this.handbrake;
    };
    this.getUp = function () {
        return this.up
    };
    this.getDown = function () {
        return this.down
    };
    this.getLeft = function () {
        return this.left
    };
    this.getRight = function () {
        return this.right
    };
    this.gearUpPressed = function () {
        return this.gearUpCount == 1
    };
    this.gearDownPressed = function () {
        return this.gearDownCount == 1
    };
    this.changeViewPointPressed = function () {
        return this.changeViewPointCount == 1
    };
    this.changeCruiseControlPressed = function () {
        return this.changeCruiseControlCount == 1
    };
    this.changeAutomaticPressed = function () {
        return this.changeAutomaticCount == 1
    };
    this.changeGearUpPressed = function () {
        return this.changeGearUpCount == 1
    };
    this.changeGearDownPressed = function () {
        return this.changeGearDownCount == 1
    };
    this.changeCompassPressed = function () {
        return this.changeCompassCount == 1
    };
    this.changeFpsPressed = function (){
        return this.changeFpsCount == 1
    };
    this.switchDriverSheetPressed = function () {
        return this.switchDriverSheetCount == 1
    };
    this.displayPositionPressed = function () {
        return this.displayPositionCount == 1
    };
    this.getViewX = function () {
        return this.viewX
    };
    this.getViewY = function () {
        return this.viewY
    };

    this.onKeyDown = function (e) {
        if (!this.active) return;
        var $window = window;
        var keyCode;
        if ($window.event) keyCode = $window.event.keyCode;
        else keyCode = e.keyCode;
        this.keyState[keyCode] = true;

        var _g = 0;
        var _g1 = this.preventKeys;
        while (_g < _g1.length) {
            var code = _g1[_g];
            ++_g;
            if (keyCode == code) {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false
            }
        }
    };

    this.onKeyUp = function (e) {
        var $window = window;
        var keyCode;
        if ($window.event) keyCode = $window.event.keyCode;
        else keyCode = e.keyCode;
        this.keyState[keyCode] = false;

        var _g = 0;
        var _g1 = this.preventKeys;
        while (_g < _g1.length) {
            var code = _g1[_g];
            ++_g;
            if (keyCode == code) {
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false
            }
        }
    };

    this.updateKeys = function () {
        var _g = 1;
        while (_g < 100) {
            var i = _g++;
            if (this.keyState && this.keyState[i]) this.keyCount[i]++;
            else this.keyCount[i] = 0
        }
    };

    this.isDown = function (keyCode) {
        return this.keyState ? this.keyState[keyCode] : false
    };

    this.getStickX = function () {
        if (this.keyState && this.keyState[39]) return 1;
        if (this.keyState && this.keyState[37]) return -1;
        return 0
    };

    this.getStickY = function () {
        if (this.keyState && this.keyState[38]) return 1;
        if (this.keyState && this.keyState[40]) return -1;
        return 0
    };

    this.isPressed = function (keyCode) {
        return this.keyCount[keyCode] == 1
    };

    this.isKeyPressed = function () {
        if (this.keyState && (this.keyState[32] || this.keyState[17])) return true;
        return false
    };

    this.setupKeyboard = function () {
        //try {
        var that = this;
        var keys = []; //['space', 't', 'g', 'q', 'e', 'w', 's', 'a', 'd', 'v', 'x', 'up', 'down', 'left', 'right'];

        for(var i in this.keybindings.keyboard) {
            keys.push(this.keybindings.keyboard[i]);
        }//for

        Mousetrap.bind(keys, function(e) {
            if(!that.pause) {
                that.onKeyDown(e);
            }//if
        }, 'keydown');
        Mousetrap.bind(keys, function(e) {
            if(!that.pause) {
                that.onKeyUp(e);
            }//if
        }, 'keyup');

        Mousetrap.bind(this.keybindings.keyboard.pause, function(e) {
            that.pause = !that.pause;

            if(that.pause) {
                that.viewer.clock.onTick.removeEventListener($bind(that, that.update));

                try {
                    window.audioMonkey.stopAll();
                    //window.audioMonkey.pauseAll();
                } catch(err) {
                    log("error", err);
                }

                $('#paused').show();
            }//if
            else {
                cesiumExplorer.physics.prevTime = Date.now();

                that.viewer.clock.onTick.addEventListener($bind(that, that.update));

                //window.audioMonkey.resumeAll();

                $('#paused').hide();
            }//else
        }, 'keyup');

        // konami codes!
        Mousetrap.bind('i a m f a s t', function() {
            //log("info", 'konami code');

            if(!that.vehicle.konamiCodeFast) {
                var el = $('<div class="alert alert-info">'+window.langs[window.language]["konami_code"]+'.<a href="#" class="pull-right alert-close">x</a></div>');
                flashMessage(el);
            }//if

            that.vehicle.konamiCodeFast = !that.vehicle.konamiCodeFast;
        });

        Mousetrap.bind('i a m s u p e r f a s t', function() {
            //log("info", 'konami code');

            if(!that.vehicle.konamiCodeSuperFast) {
                var el = $('<div class="alert alert-info">'+window.langs[window.language]["konami_code"]+'.<a href="#" class="pull-right alert-close">x</a></div>');
                flashMessage(el);
            }//if

            that.vehicle.konamiCodeSuperFast = !that.vehicle.konamiCodeSuperFast;
        });

        Mousetrap.bind('i h a v e f o u r w h e e l s', function() {
            //log("info", 'konami code');

            if(!that.vehicle.konamiCodeFourWheels) {
                var el = $('<div class="alert alert-info">'+window.langs[window.language]["konami_code"]+'.<a href="#" class="pull-right alert-close">x</a></div>');
                flashMessage(el);
            }//if

            that.vehicle.konamiCodeFourWheels = !that.vehicle.konamiCodeFourWheels;
        });

        Mousetrap.bind('i b e l i e v e i c a n f l y', function() {
            //log("info", 'konami code');

            if(!that.vehicle.konamiCodeFly) {
                var el = $('<div class="alert alert-info">'+window.langs[window.language]["konami_code"]+'.<a href="#" class="pull-right alert-close">x</a></div>');
                flashMessage(el);
            }//if

            that.vehicle.konamiCodeFly = !that.vehicle.konamiCodeFly;
        });

        this.gamepad = new Gamepad(this.keybindings);

        //} catch(e) {}
    };

    this.setupDebug = function () {
        if(this.vehicleBackPlacemark) this.vehicleBackPlacemark.remove();
        this.vehicleBackPlacemark = new Placemark(this.scene, window.lat, window.lon, "vehicle back", window.SITE_URL+"/img/my_marker.png");
        this.vehicleBackPlacemark.setVisibility(true);

        if(this.vehicleFrontPlacemark) this.vehicleFrontPlacemark.remove();
        this.vehicleFrontPlacemark = new Placemark(this.scene, window.lat, window.lon, "vehicle front", window.SITE_URL+"/img/my_marker.png");
        this.vehicleFrontPlacemark.setVisibility(true);

        if(this.vehicleLeftPlacemark) this.vehicleLeftPlacemark.remove();
        this.vehicleLeftPlacemark = new Placemark(this.scene, window.lat, window.lon, "vehicle left", window.SITE_URL+"/img/my_marker.png");
        this.vehicleLeftPlacemark.setVisibility(true);

        if(this.vehicleRightPlacemark) this.vehicleRightPlacemark.remove();
        this.vehicleRightPlacemark = new Placemark(this.scene, window.lat, window.lon, "vehicle right", window.SITE_URL+"/img/my_marker.png");
        this.vehicleRightPlacemark.setVisibility(true);
    };

    this.setupVehicle = function (lat, lng, heading, alt) {
        this.vehiclePosition = new LatLng(parseFloat(lat), parseFloat(lng));
        this.partialDistance = 0;
        this.vehicleTargetPosition = new LatLng(parseFloat(lat), parseFloat(lng));

        //this.vehicleAltitude = new vehicle.Suspension(parseFloat(alt), parseFloat(alt), 375, 80000, 5000);

        this.vehicleAltitude = new vehicle.Suspension(parseFloat(alt), parseFloat(alt), this.vehicleData.suspensionMass, this.vehicleData.suspensionSpring, this.vehicleData.suspensionDamper);
        this.vehicleAltitude.velocity=0.1;

        this.vehicleTilt = new vehicle.Suspension(0, 0, this.vehicleData.tiltMass, this.vehicleData.tiltSpring, this.vehicleData.tiltDamper);
        this.vehicleTilt.velocity=0.1;

        this.vehicleRoll = new vehicle.Suspension(0, 0, this.vehicleData.rollMass, this.vehicleData.rollSpring, this.vehicleData.rollDamper);
        this.vehicleRoll.velocity=0.1;

        this.setupPhysics(heading);
        this.cameraHeadingBase = this.getVehicleHeading();
        this.startTime = Date.now();

	this.setKeyFocus()
    };

    this.setupPhysics = function (heading) {
        this.vehicleSpec = new vehicle.VehicleSpec;
        this.vehicleSpec.bodyWidth = this.vehicleData.bodyWidth; //1.81;
        this.vehicleSpec.bodyLength = this.vehicleData.bodyLength; //4.495;
        this.vehicleSpec.rearY = this.vehicleData.rearY; //1.296;
        this.vehicleSpec.wheelBase = this.vehicleData.wheelBase; //2.65;
        this.vehicleSpec.tread = this.vehicleData.tread; //1.4;
        this.vehicleSpec.wheelRadius = this.vehicleData.wheelRadius; //.3106;
        var vertices = PolygonData.getCarVertices(this.vehicleData.bodyLength, this.vehicleData.bodyWidth, this.vehicleData.type);
        if(this.vehicle) this.vehicle.destroy();

	this.vehicle = new vehicle.Vehicle(this.world, vertices, this.vehicleSpec, 0, 0, heading, true, this.vehicleData, this.username);

        this.vehicle.gearBox.gearRatio["-1"] = this.vehicleData.reverseGearRatio;
        this.vehicle.gearBox.gearRatio[1] = this.vehicleData.firstGearRatio;
        this.vehicle.gearBox.gearRatio[2] = this.vehicleData.secondGearRatio;
        this.vehicle.gearBox.gearRatio[3] = this.vehicleData.thirdGearRatio;
        this.vehicle.gearBox.gearRatio[4] = this.vehicleData.fourthGearRatio;
        this.vehicle.gearBox.gearRatio[5] = this.vehicleData.fifthGearRatio;
        this.vehicle.gearBox.gearRatio[6] = this.vehicleData.sixthGearRatio;
        this.vehicle.gearBox.maxGear = this.vehicleData.maxGear;

        this.vehicle.gearBox.gearRatioTopSpeed["-1"] = this.vehicleData.reverseGearRatioTopSpeed;
        this.vehicle.gearBox.gearRatioTopSpeed[1] = this.vehicleData.firstGearRatioTopSpeed;
        this.vehicle.gearBox.gearRatioTopSpeed[2] = this.vehicleData.secondGearRatioTopSpeed;
        this.vehicle.gearBox.gearRatioTopSpeed[3] = this.vehicleData.thirdGearRatioTopSpeed;
        this.vehicle.gearBox.gearRatioTopSpeed[4] = this.vehicleData.fourthGearRatioTopSpeed;
        this.vehicle.gearBox.gearRatioTopSpeed[5] = this.vehicleData.fifthGearRatioTopSpeed;
        this.vehicle.gearBox.gearRatioTopSpeed[6] = this.vehicleData.sixthGearRatioTopSpeed;

        this.vehicle.brakeRatio = this.vehicleData.brakeRatio;

        this.vehicle.liftOffMinSpeed = this.vehicleData.liftOffMinSpeed;

        this.prevPosition = this.vehicle.getPosition();
        this.currentPosition = this.vehicle.getPosition();

        var canvas = window.document.getElementById("debug_canvas");
        if (canvas != null) {
            this.enableDebugCanvas = true;
            var ctx = canvas.getContext("2d");
            var debugDraw = new box2D.dynamics.B2DebugDraw;
            debugDraw.setDrawScale(10);
            debugDraw.setCanvas(canvas);
            debugDraw.setFillAlpha(.3);
            debugDraw.setLineThickness(1);
            debugDraw.setFlags(box2D.dynamics.B2DebugDraw.e_shapeBit | box2D.dynamics.B2DebugDraw.e_jointBit);
            this.world.setDebugDraw(debugDraw)
        }

        var _g = 0;
        while (_g < 100) {
            var i = _g++;
            this.updatePhysics(.016666666666666666)
        }
    };

    this.cleanupBodies = function() {
        while(this.removeBodies.length > 0) {
            var body = this.removeBodies.splice(0,1)[0];

            var ud = body.getUserData();

		this.world.destroyBody(body);
        }//while
    };

    this.updatePhysics = function (deltaTime, deltaTimeLimited) {
        this.vehicle.setSteeringLever(this.getSteeringDelta());
        this.vehicle.setThrottle(this.getThrottle());
        this.vehicle.setBrake(this.getBrake());
        this.vehicle.setHandbrake(this.getHandbrake());
        this.vehicle.setUp(this.getUp());
        this.vehicle.setDown(this.getDown());
        this.vehicle.setLeft(this.getLeft());
        this.vehicle.setRight(this.getRight());
        this.vehicle.update(deltaTime);

        this.vehicleAltitude.update(deltaTime);
        this.vehicleTilt.update(deltaTime);
        this.vehicleRoll.update(deltaTime);

        this.cleanupBodies();

        this.world.step(deltaTime, 8, 3);
        this.world.clearForces();
        this.vehicle.lateUpdate(deltaTime)
    };

    this.update = function (time) {
        //log("info", "update start", time);

        if(Date.now()-this.frameCheckTimer < 1000) {
            this.framesCounter++;
        }//if
        else {
            this.fps = this.framesCounter;
            this.framesCounter = 0;
            this.frameCheckTimer = Date.now();
        }//else

        if(this.fpsOverlay) this.fpsOverlay.setValue(this.fps);

        this.ee.emitEvent('preUpdate');

        var deltaTime = (Date.now() - this.prevTime) / 1e3;

            var that = this;

            this.batchedUpdate();

            if (this.enableDebugCanvas) this.world.drawDebugData();

        this.ee.emitEvent('postUpdate');

    };

    this.handleKeysPressed = function (deltaTime) {
        if (this.changeViewPointPressed()) this.changeViewPoint();
        if (this.changeCruiseControlPressed()) {
            this.cruiseControl = !this.cruiseControl;

            this.drawOverlays(true, false);
        }//if
        if (this.changeCompassPressed()) {
            this.showCompass = !this.showCompass;

            this.drawOverlays(false, false);
        }//if
        if (this.changeFpsPressed()) {
            this.showFps = !this.showFps;

            this.drawOverlays(false, false);
        }//if
        if (this.switchDriverSheetPressed()) {
            this.isRightHandDrive = !this.isRightHandDrive;
            this.changeViewPoint(0)
        }//if
        if (this.changeAutomaticPressed()) {
            if(this.vehicleData.mainCategory == "ground") {
                this.vehicle.automatic = !this.vehicle.automatic;

                this.drawOverlays(true, false);
            }//if
        }//if
        if (this.changeGearUpPressed()) this.vehicle.gearUp();
        if (this.changeGearDownPressed()) this.vehicle.gearDown();

        if (this.gearUpPressed()) this.vehicle.gearUp();
        if (this.gearDownPressed()) this.vehicle.gearDown();

        if(this.vehicleData.category == "plane" || this.vehicle.konamiCodeFly) {
            var speedForward = box2D.common.math.B2Math.dot(this.vehicle.body.getLinearVelocity(), vehicle.Box2DUtils.getFrontVector(this.vehicle.body));

            if(this.vehicle.up) {
                this.vehicle.tiltOffset+=0.1*speedForward*deltaTime;
            }//if
            else if(this.vehicle.down) {
                this.vehicle.tiltOffset-=0.1*speedForward*deltaTime;
            }//else if
            else {
                if(this.vehicle.tiltOffset>185+0.1*speedForward*deltaTime) {
                    this.vehicle.tiltOffset-=0.1*speedForward*deltaTime;
                }
                else if(this.vehicle.tiltOffset<185-0.1*speedForward*deltaTime) {
                    this.vehicle.tiltOffset+=0.1*speedForward*deltaTime;
                }
                else {
                    this.vehicle.tiltOffset=185;
                }
            }//else

        }//if
        else if(this.vehicleData.category == "jetpack") {

            if(this.vehicle.up) {
                this.vehicle.upCount+=0.05;
                this.vehicleAltitude.targetPosition+=deltaTime*Math3D.MyMath.clamp(this.vehicle.upCount, 0, 20);
            }
            else {
                this.vehicle.upCount = 0;
            }
            if(this.vehicle.down) {
                this.vehicle.downCount+=0.05;
                this.vehicleAltitude.targetPosition-=deltaTime*Math3D.MyMath.clamp(this.vehicle.downCount, 0, 20);
            }
            else {
                this.vehicle.downCount = 0;
            }

        }//else if
        else if(this.vehicleData.category == "helicopter") {

            if(this.vehicle.up) {
                this.vehicle.upCount+=0.1;
                this.vehicleAltitude.targetPosition+=deltaTime*Math3D.MyMath.clamp(this.vehicle.upCount, 0, 30);
            }
            else {
                this.vehicle.upCount = 0;
            }
            if(this.vehicle.down) {
                this.vehicle.downCount+=0.1;
                this.vehicleAltitude.targetPosition-=deltaTime*Math3D.MyMath.clamp(this.vehicle.downCount, 0, 30);
            }
            else {
                this.vehicle.downCount = 0;
            }

        }//else if
    };

    this.handleSpawning = function (deltaTime) {
    	var wasSpawning = this.isSpawning;

    	if(!this.bodyModel || !this.bodyModel.loaded || !this.bodyModel.initialModelMatrix || (this.teleported && this.getLoadingPercentage() < 99 && Date.now()-this.isSpawningStart < 15000)) {
                if (!this.isSpawningDiv) {
                    this.isSpawningDiv = $(document.createElement('div')).appendTo('#map3d-container');
                    this.isSpawningDiv.css({
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        right: '0px',
                        bottom: '0px',
                        fontSize: '24px',
                        fontWeight: '600',
                        textAlign: 'center',
                        backgroundColor: 'rgba(0,0,0,0.35)',
                        color: '#fff',
                        lineHeight: ($('#map3d-container').height()) + 'px'
                    });
                    this.isSpawningDiv.html('<div style="display:inline-block; vertical-align:middle"><div class="loading_dots" style="padding: 0px;"><span></span><span style="margin: 0 5px 0 5px;"></span><span></span></div></div>');

                    this.isSpawningStart = Date.now();
                }//if

            this.isSpawning = true;
        }//if
    	else {
                if (this.isSpawningDiv) {
                    this.isSpawningDiv.remove();
                    this.isSpawningDiv = false;

                    this.teleported = false;
                }//if

            this.isSpawning = false;
            this.isSpawningStart = Date.now();
        }//else

        if(wasSpawning && !this.isSpawning) {

            try {
                window.audioMonkey.init();
            } catch(err) {
                log("error", err);
            }

        }//if
    };

    this.handleOverlays = function (deltaTime) {
        if(this.vehicleData.mainCategory == "air") {
            if(this.vehicle.tilt > 0.5 || (this.vehicle.isHoverAbsoluteCeiling && this.vehicle.tilt > 0.1)) {
                if(this.stallOverlay) this.stallOverlay.remove();
                this.stallOverlay = new Text(this.scene, $('#map3d').width()/2-26, false, 53, false, "STALL");
                this.stallOverlay.unitContainer.css('padding-left','0px');
                this.stallOverlay.unitContainer.css('font-weight','800');

                    if (window.audioMonkey) window.audioMonkey.play("warning", 0, 0, 3, true);
                    window.audioMonkey.rate("warning", 3);

            }//if
            else {
                if(this.stallOverlay) this.stallOverlay.remove();

                    if (window.audioMonkey) window.audioMonkey.stop("warning");
            }//else
        }//if
    };

    this.handleSounds = function (deltaTime, speedKmh) {
        var rate = speedKmh/this.vehicleData.maxspeed+this.vehicleData.soundMinimumRate;

        //console.log("handleSounds", 1);

        if((this.vehicleData.category == "car" || this.vehicleData.category == "bike") && this.vehicleData.type != "person") {
            var _g = this.vehicle.gearBox.getCurrentGear();

            if(this.vehicle.airborne) {
                rate = 1+this.vehicleData.soundMinimumRate;
            }//if
            else {
                rate = _g*0.1 + (speedKmh/(this.vehicle.gearBox.gearRatioTopSpeed[_g] * this.vehicleData.maxspeed)+this.vehicleData.soundMinimumRate);
            }//if

            if(this.vehicle.wheelie) {
                rate += 0.2;
            }//if
        }//if

        //console.log("handleSounds", 2);

        // Increase / Decrease sound rate when moving up or down
        if(this.vehicleData.category == "helicopter" || this.vehicleData.category == "jetpack") {
            if(this.vehicle.airborne) rate += 0.2;
            if(this.getUp()) rate += 0.2;
            else if(this.getDown() && this.vehicle.airborne) rate -= 0.2;
        }//if

        //console.log("handleSounds", 3);

        //log("info", rate);
        var distanceFactor = 0;
        var dist = 0;

        if(distanceFactor < 0) distanceFactor = 0;
        //else if(distanceFactor > 1) distanceFactor = 1;

        //console.log("handleSounds", 6);

        var forwardVolume = Math3D.MyMath.clamp(speedKmh/this.vehicleData.maxspeed, window.defaultMinVolume/100, window.defaultMaxVolume/100)-distanceFactor;
        if(forwardVolume < 0) forwardVolume = 0;

        var slipVolume = Math3D.MyMath.clamp(speedKmh/this.vehicleData.maxspeed, window.defaultMinVolume/100, window.defaultMaxVolume/100)-distanceFactor;
        if(slipVolume < 0) slipVolume = 0;

        //console.log("handleSounds", 7);

        try {
            window.audioMonkey.play("forward", speedKmh/this.vehicleData.maxspeed, 0, rate, true, this.vehicleData.soundLoopStart, this.vehicleData.soundLoopEnd, forwardVolume);
            window.audioMonkey.volume("forward", forwardVolume);
            window.audioMonkey.rate("forward", rate);
        } catch(err) {
            log("error", err);
        }

        //console.log("handleSounds", 8);

        if(this.vehicle.squealLevel > 0.35 && !this.vehicle.airborne) {
            var rate = Math3D.MyMath.clamp(this.vehicle.squealLevel+this.vehicleData.slipMinimumRate, this.vehicleData.slipMinimumRate, 1);

            try {
                window.audioMonkey.play("slip", speedKmh/this.vehicleData.maxspeed, 0, rate, true, this.vehicleData.slipLoopStart, this.vehicleData.slipLoopEnd, slipVolume);
                window.audioMonkey.volume("slip", slipVolume);
                window.audioMonkey.rate("slip", rate);
            } catch(err) {
                log("error", err);
            }

            try {
                if(this.gamepad) this.gamepad.startVibrate();
            } catch(err) {
                log("error", err);
            }

        }//if
        else {
            try {
                window.audioMonkey.stop("slip");
            } catch(err) {
                log("error", err);
            }
        }//else

        //console.log("handleSounds", 9);
    };

    this.batchedUpdate = function () {
        //log("info", "batchedUpdate start");

        var oldPos = new LatLon(this.vehiclePosition.lat(), this.vehiclePosition.lng(), window.full.R);

        this.prevTime = this.currentTime;
        this.currentTime = Date.now();

        //var deltaTime = Math3D.MyMath.clamp(this.currentTime - this.prevTime, 1, 150) / 1e3;
        var deltaTime, deltaTimeLimited;
        deltaTime = deltaTimeLimited = Math3D.MyMath.clamp(this.currentTime - this.prevTime, 1, 50) / 1e3;
        //var deltaTime = Math3D.MyMath.clamp(this.currentTime - this.prevTime, 1, 50) / 1e3;
        var deltaOffset = deltaTime-deltaTimeLimited;
        if(deltaOffset<0) deltaOffset = 0;
        else deltaOffset = deltaOffset / deltaTimeLimited;

        this.handleSpawning(deltaTimeLimited);

        if(this.gamepad) this.gamepad.poll();
        this.updateKeyStatus(deltaTimeLimited);
        this.handleKeysPressed(deltaTimeLimited);

        var _this = this.prevPosition;
        var v = this.currentPosition;
        _this.x = v.x;
        _this.y = v.y;
        _this.z = v.z;
        this.updatePhysics(deltaTime, deltaTimeLimited);
        this.currentPosition = this.vehicle.getPosition();

        var vx = this.currentPosition.x - this.prevPosition.x;
        var vy = this.currentPosition.y - this.prevPosition.y;
        var length = Math.sqrt(vx * vx + vy * vy);// * 1.28;
        length += length*deltaOffset;
        var heading = Math.atan2(vy, vx) + 1.5707963267948966;

        if(isNaN(heading) || isNaN(length)) {
            this.setupPhysics(0);

            return;
        }//if

        // This makes it fluid but messes with the real distance traveled
        deltaTime = deltaTimeLimited = 0.03;

            this.vehicle.crashedWithLimits = false;
            this.vehicle.crashedWithUser = false;

            this.vehiclePosition = this.vehiclePosition.createOffset(heading, length-(this.vehicle.airborne && this.vehicleData.category != "helicopter" ? length*Math3D.MyMath.clamp(Math.abs(this.vehicle.tilt)*0.8, 0, 2) : 0));

        this.updateVehicle(deltaTimeLimited, false);
        this.updateCamera(deltaTimeLimited);

            this.updateSpeedMeter(Math.round(this.vehicle.getSpeedKmh()), Math.round(this.vehicle.getSpeedMph()));
            this.updateAltitudeMeter(this.vehicleAltitude.position);
            this.updateRPMMeter(this.vehicle.getRPM());
            this.updateCompass(this.bodyModel.heading*180/Math.PI);
            this.updateAttitude(this.vehicleTilt.position.toDeg(), this.vehicleRoll.position.toDeg());

        if(!window.physics) return;
        var speedKmh = window.physics.absSpeed = this.vehicle.getSpeedKmh();

        this.handleSounds(deltaTimeLimited, speedKmh);

        this.handleOverlays(deltaTimeLimited);

        //log("info", "batchedUpdate end");
    };

    this.latestAltitude = false;
    this.latestAltitudes = {};

    this.getAltitude = function (location, id) {
        if(location && !isNaN(location.lat()) && !isNaN(location.lng())) {
            var position = Cesium.Cartesian3.fromDegrees(location.lng(), location.lat(), 0, this.ellipsoid, new Cesium.Cartesian3());

            var altitude = this.scene.globe.getHeight(Cesium.Ellipsoid.WGS84.cartesianToCartographic(position));

            if(altitude && altitude <= 0) altitude = 0.1;

            //console.log(location, altitude);

            if(altitude) {
                this.latestAltitude = altitude;
                this.latestAltitudes[id ? id : location.lng()+"_"+location.lat()] = altitude;

                return altitude;
            }//if
            else if(this.latestAltitudes[id ? id : location.lng()+"_"+location.lat()]) {
                //log("info", "No valid altitude acquired at ("+location.lng()+"_"+location.lat()+")", "last given", altitude);

                return this.latestAltitudes[id ? id : location.lng()+"_"+location.lat()];
            }//else if
            else if(this.latestAltitude) {
                //log("info", "No valid altitude acquired at ("+location.lng()+"_"+location.lat()+")", "latest given", altitude);

                return altitude; //this.latestAltitude;
            }//else if
            else {
                //log("info", "No valid altitude acquired at ("+location.lng()+"_"+location.lat()+")", altitude);

                return altitude;
            }//else
        }//if
        else {
            log("info", id, "No valid location provided", location);

            return 1;
        }//else
    };

    this.getAltitudeNoCache = function (location) {
        if(location && !isNaN(location.lat()) && !isNaN(location.lng())) {
            var position = Cesium.Cartesian3.fromDegrees(location.lng(), location.lat(), 0, this.ellipsoid, new Cesium.Cartesian3());

            var altitude = this.scene.globe.getHeight(Cesium.Ellipsoid.WGS84.cartesianToCartographic(position));

            return altitude;
        }//if
        else {
            return undefined;
        }//else
    };

    // http://www.grc.nasa.gov/WWW/k-12/WindTunnel/Activities/lift_formula.html
    this.getAirDensity = function (altitude) {
        altitude *= 3.28084; //feet

        if(altitude <= 0) return .002377;
        else if(altitude <= 1000) return .002308;
        else if(altitude <= 2000) return .002241;
        else if(altitude <= 3000) return .002175;
        else if(altitude <= 4000) return .002111;
        else if(altitude <= 5000) return .002048;
        else if(altitude <= 6000) return .001987;
        else if(altitude <= 7000) return .001927;
        else if(altitude <= 8000) return .001868;
        else if(altitude <= 9000) return .001811;
        else if(altitude <= 10000) return .001755;
        else if(altitude <= 15000) return .001496;
        else if(altitude <= 20000) return .001266;
        else if(altitude <= 25000) return .001065;
        else if(altitude <= 30000) return .000889;
        else if(altitude <= 35000) return .000737;
        else if(altitude <= 36089) return .000706;
        else if(altitude <= 40000) return .000585;
        else if(altitude <= 45000) return .000460;
        else if(altitude <= 50000) return .000362;
        else return .000285;

        /*
         I.C.A.O. Standard Atmosphere Table

        Altitude          Density     Speed of Sound
        (Feet)             (d)         (Knots)
        0          .002377          661.7
        1,000          .002308          659.5
        2,000          .002241          657.2
        3,000          .002175          654.9
        4,000          .002111          652.6
        5,000          .002048          650.3
        6,000          .001987          647.9
        7,000          .001927          645.6
        8,000          .001868          643.3
        9,000          .001811          640.9
        10,000          .001755          638.6
        15,000          .001496          626.7
        20,000          .001266          614.6
        25,000          .001065          602.2
        30,000          .000889          589.5
        35,000          .000737          576.6
        36,089*         .000706          573.8
        40,000          .000585          573.8
        45,000          .000460          573.8
        50,000          .000362          573.8
        55,000          .000285          573.8
        */
    };

    this.applyHorizontalForces = function(rollImpulse, speedForward, lastTerrainRoll, deltaTime, other) {
            if(this.vehicle.airborne) {
                this.terrainTilt = 0;
                this.terrainRoll = 0;
            }//if

            if(this.vehicleData.category == "plane" || this.vehicle.konamiCodeFly) {
                if(!this.vehicle.airborne) {
                    //this.terrainRoll += rollImpulse;
                    //this.terrainRoll = (this.vehicle.getSteeringAngle()*(this.vehicle.body.getLinearVelocity().length())*-0.1)*deltaTime;
                }//if
                else {
                    if(this.vehicleData.category == "plane") this.terrainRoll = (this.vehicle.getSteeringAngle()*(this.vehicle.body.getLinearVelocity().length())*-this.vehicleData.steerroll)*deltaTime;
                    else this.terrainRoll = (-this.vehicle.getSteeringAngle()*(this.vehicle.body.getLinearVelocity().length())*this.vehicleData.steerroll)*deltaTime;

                    this.terrainRoll = Math3D.MyMath.clamp(this.terrainRoll, -this.vehicleData.rollclamp/180*Math.PI, this.vehicleData.rollclamp/180*Math.PI);
                }//else
            }//else if
            else if(this.vehicleData.category == "bike") {
                this.terrainRoll += rollImpulse;

                this.terrainRoll = (this.vehicle.getSteeringAngle()*(this.vehicle.body.getLinearVelocity().length()/20)*this.vehicleData.steerroll)*deltaTime;

                this.terrainRoll = Math3D.MyMath.clamp(this.terrainRoll, -this.vehicleData.rollclamp/180*Math.PI, this.vehicleData.rollclamp/180*Math.PI);
            }//if
            else if(this.vehicleData.category == "jetpack" || this.vehicleData.category == "helicopter") {
                if(!this.vehicle.airborne) {
                    rollImpulse = 0;
                }//if

                if (this.throttle > 0) {
                    this.terrainTilt = ((this.vehicle.body.getLinearVelocity().length()/70)*-this.vehicleData.steertilt)*deltaTime;
                }//if
                else if (this.throttle < 0) {
                    this.terrainTilt = ((this.vehicle.body.getLinearVelocity().length()/70)*this.vehicleData.steertilt)*deltaTime;
                }//else if

                if(!this.vehicle.airborne) {
                    this.terrainRoll += rollImpulse;
                }//if
                else {
                    this.terrainRoll = (this.vehicle.getSteeringAngle()*(this.vehicle.body.getLinearVelocity().length()/20)*-this.vehicleData.steerroll)*deltaTime;
                }//else

                this.terrainTilt = Math3D.MyMath.clamp(this.terrainTilt, -this.vehicleData.tiltclamp/180*Math.PI, this.vehicleData.tiltclamp/180*Math.PI);
                this.terrainRoll = Math3D.MyMath.clamp(this.terrainRoll, -this.vehicleData.rollclamp/180*Math.PI, this.vehicleData.rollclamp/180*Math.PI);
            }//else if
            else {
                var movingFront = this.vehicle.body.getLinearVelocity();
                var vehicleFront = vehicle.Box2DUtils.getFrontVector(this.vehicle.body);
                var l = vehicleFront.length() * movingFront.length();
                var slipAngle = 0;
                if (l != 0) slipAngle = box2D.common.math.B2Math.crossVV(vehicleFront, movingFront) / l;

                //var altDiff = Math.abs(this.vehicleAltitude.targetPosition-this.vehicleAltitude.position);

                // Oh god! we could roll over and die
                if(Math.abs(slipAngle) > 0.9 && Math.abs(this.vehicleTilt.velocity) > 0.3) {
                    //log("info", this.terrainRoll, lastTerrainRoll, slipAngle);

                    this.terrainRoll = lastTerrainRoll+this.terrainRoll+rollImpulse*deltaTime;
                    this.rollOverAndDie = true;
                }//if
                else if(Math.abs(slipAngle) > 0.1 && this.rollOverAndDie && Math.abs(this.vehicleTilt.velocity) > 0.3) {
                    //log("info", this.terrainRoll, lastTerrainRoll, slipAngle);

                    this.terrainRoll = lastTerrainRoll+this.terrainRoll+rollImpulse*deltaTime;
                }//else if
                else {
                    this.rollOverAndDie = false;
                    this.terrainRoll += rollImpulse*deltaTime;

                    // Make the loop transition fluid
                    if(this.vehicleRoll.position.toDeg() < -179) {
                        this.terrainRoll = 3.1396936244990847+this.terrainRoll;
                        this.vehicleRoll.position = 3.1396936244990847;
                        this.vehicleRoll.targetPosition = 3.1396936244990847;
                    }//if
                    else if(this.vehicleRoll.position.toDeg() > 179) {
                        this.terrainRoll = -3.1396936244990847+this.terrainRoll;
                        this.vehicleRoll.position = -3.1396936244990847;
                        this.vehicleRoll.targetPosition = -3.1396936244990847;
                    }//if

                    this.terrainTilt += ((speedForward/70)*this.vehicleData.steertilt)*deltaTime;
                }//else
            }//else

        //log("info", "applyHorizontalForces end");
    };

    this.applyVerticalForces = function(speedForward, newAlt, rightWingHeight, leftWingHeight, deltaTime, other) {
        //log("info", "applyVerticalForces start");

        if(this.vehicleData.category == "plane" || this.vehicle.konamiCodeFly) {
            // Make the loop transition fluid
            if(this.vehicle.tiltOffset > 360) {
                if(this.vehicleTilt.position.toDeg() < -179) {
                    this.vehicle.tiltOffset -= 360;
                    this.vehicleTilt.position = 3.1396936244990847;
                    this.vehicleTilt.targetPosition = 3.1396936244990847;
                }//if
            }//if
            else if(this.vehicle.tiltOffset < 0) {
                if(this.vehicleTilt.position.toDeg() > 179) {
                    this.vehicle.tiltOffset += 360;
                    this.vehicleTilt.position = -3.1396936244990847;
                    this.vehicleTilt.targetPosition = -3.1396936244990847;
                }//if
            }//else if

            //http://www.grc.nasa.gov/WWW/k-12/WindTunnel/Activities/lift_formula.html
            //var meterPerSecond = this.vehicle.speedKmh*0.2778;
            //var feetPerSecond = meterPerSecond*0.3048;

            var feetPerSecond = this.vehicle.getSpeedKmh()*0.911344;

            // http://www.airfieldmodels.com/information_source/math_and_science_of_model_aircraft/formulas/straight_tapered_and_delta_wing_area.htm
            var averageChord = ( this.vehicleData.bodyLength*0.4 + this.vehicleData.bodyLength*0.2 ) / 2;
            var wingArea = (this.vehicleData.bodyWidth * averageChord);// * 10.764; // square feet

            var angleOfAttack = -this.vehicleTilt.position; //(this.vehicle.tiltOffset-185).toRad();

            var weight = this.vehicle.getMass() * 9.8;
            var weightForce = !this.vehicle.airborne ? (weight / 2e3)*deltaTime : 0;
            var Cl = 2 * 3.14159265 * angleOfAttack - weightForce;

            if(this.vehicle.tiltOffset != 185) {
                // L = (1/2) d v2 s CL
                this.lift = 0.5*(this.getAirDensity(this.vehicleAltitude.position)*(feetPerSecond*2)*wingArea*Cl)-(weight / 2e3)*deltaTime;

                var x = this.vehicle.getMass() / (this.getAirDensity(this.vehicleAltitude.position)*wingArea*(feetPerSecond*feetPerSecond));
            }//if

            var tilt = Math.abs(185-this.vehicle.tiltOffset);
            var tiltDirection = (185-this.vehicle.tiltOffset) > 0 ? -1 : 1;
            var speedMass = this.vehicle.speedKmh/this.vehicleData.mass;
            if(speedMass < 0) speedMass = this.vehicle.speedKmh;

            if(this.vehicle.speedKmh < this.vehicle.liftOffMinSpeed) {
                    var value = Math.abs(Math.max(speedMass, 100)*deltaTime*((weight / 2e3)));
                    this.vehicleAltitude.targetPosition-=(value-(tilt*tiltDirection*0.05))*deltaTime;
            }//if
            else if(this.vehicle.tiltOffset > 185 || (this.vehicle.tiltOffset > 275 && this.vehicle.speedKmh < this.vehicle.liftOffMinSpeed*0.7)) {
                this.vehicleAltitude.targetPosition+=tiltDirection*(tilt*deltaTime*Math.max(speedMass, 25)*deltaTime);
            }//if
            else if(this.vehicle.tiltOffset < 185) {
                this.vehicleAltitude.targetPosition+=tiltDirection*(tilt*deltaTime*Math.max(speedMass, 25)*deltaTime);
            }//else if

            var wasAirborne = this.vehicle.wasAirborne = this.vehicle.airborne;
            var aboveGroundValue = this.vehicleAltitude.position - newAlt;
            var rightWingLatLngAlt = this.getLatLngAlt(this.vehicleData.bodyWidth*2, 0, this.vehicleData.vehiclealt);
            var rightWingAboveGroundValue = rightWingLatLngAlt.altitude() - rightWingHeight;
            //if(rightWingAboveGroundValue < 0) log("info", rightWingLatLngAlt.altitude(), rightWingHeight, rightWingAboveGroundValue);
            var leftWingLatLngAlt = this.getLatLngAlt(-this.vehicleData.bodyWidth*2, 0, this.vehicleData.vehiclealt);
            var leftWingAboveGroundValue = leftWingLatLngAlt.altitude() - leftWingHeight;
            //if(leftWingAboveGroundValue < 0) log("info", leftWingLatLngAlt.altitude(), leftWingHeight, leftWingAboveGroundValue);

            // Wings crash
            if(leftWingAboveGroundValue <= 0 || rightWingAboveGroundValue <= 0) {
                var angularVelocityIncrement = leftWingAboveGroundValue <= 0 ? -Math3D.MyMath.clamp(speedForward+this.terrainRoll, 0, 10)*Math.PI/180 : Math3D.MyMath.clamp(speedForward+this.terrainRoll, 0, 10)*Math.PI/180;

                //log("info", angularVelocityIncrement, Math3D.MyMath.clamp(speedForward*Math.abs(this.terrainRoll)*deltaTime, 0, 0.5));

                if(!isNaN(angularVelocityIncrement)) this.vehicle.body.m_angularVelocity+=angularVelocityIncrement;

                var airborneTime = (Date.now() - this.vehicle.airborneTime) / 50000 + 0.01;

                if(this.vehicle.speedKmh > this.vehicle.liftOffMinSpeed*0.7) {
                    var v = this.vehicle.body.getLinearVelocity().copy();
                    v.multiply(Math3D.MyMath.clamp(speedForward*Math.abs(this.terrainRoll)*deltaTime, 0, 0.5));
                    v.negativeSelf();
                    var vC = this.vehicle.body.getLinearVelocity();
                    vC.add(v);
                    //this.vehicle.body.setLinearVelocity(v);
                }//if

                if(window.audioMonkey) {
                    try {
                        window.audioMonkey.play("vehicleCrash", 0, 0, 1, false);
                        window.audioMonkey.volume("vehicleCrash", 0.01+(this.vehicle.speedKmh/this.vehicleData.maxspeed));
                        window.audioMonkey.rate("vehicleCrash", Math.min(0.5+(this.vehicle.speedKmh/this.vehicleData.maxspeed),1));
                    } catch(err) {
                        log("error", err);
                    }

                    try {
                        if(this.gamepad) this.gamepad.startVibrate();
                    } catch(err) {
                        log(err);
                    }

                }//if
            }//else

            if(aboveGroundValue > 0.5 && rightWingAboveGroundValue > 0 && leftWingAboveGroundValue > 0) this.vehicle.airborne = true;
            else this.vehicle.airborne = false;

            if(this.vehicle.crashed) {
                if(Date.now()-this.vehicle.crashedTime > 150) {
                    this.vehicle.crashed = false;
                }//if
            }//if

            var isDropping = (this.vehicle.airborne && wasAirborne && this.vehicle.speedKmh < this.vehicle.liftOffMinSpeed*0.3) || ((this.vehicle.airborne || wasAirborne) && this.vehicle.dropping);
            var isCrashed = (!this.vehicle.airborne && (this.vehicle.speedKmh <= this.vehicle.liftOffMinSpeed || wasAirborne)) && (this.vehicle.dropping || this.vehicle.speedKmh > this.vehicle.liftOffMinSpeed);

            var altOffset = Math.abs(this.vehicle.tiltOffset - 180)*0.01;
            newAlt += altOffset;

            if(isDropping) {
                if(!this.vehicle.airborneTime) this.vehicle.airborneTime = Date.now();

                this.vehicle.dropping = true;

                //log("info", this.vehicle.tiltOffset, newAlt, aboveGroundValue, "droppinggg!!!!");

                if(this.vehicle.speedKmh < this.vehicle.liftOffMinSpeed*0.3) {
                    this.vehicle.tiltOffset-=0.1*speedForward*deltaTime+0.5;
                    this.terrainRoll = 0;
                }//if

                if(this.vehicleData.minGroundAlt > newAlt) this.vehicleData.minGroundAlt-=aboveGroundValue*deltaTime+deltaTime;
                else if(this.vehicleData.minGroundAlt < newAlt) this.vehicleData.minGroundAlt=newAlt;

                if(this.vehicle.up && this.vehicle.speedKmh >= this.vehicle.liftOffMinSpeed) {
                    this.terrainTilt = (180-this.vehicle.tiltOffset)*Math.PI/180;

                    this.terrainTilt = Math3D.MyMath.clamp(this.terrainTilt, -this.vehicleData.tiltclamp, this.vehicleData.tiltclamp);

                    this.vehicleTilt.targetPosition = this.terrainTilt;

                    if(this.vehicle.tiltOffset >= 170 && this.vehicle.speedKmh > this.vehicle.liftOffMinSpeed) {
                        this.vehicle.dropping = false;
                    }//if
                }//else
                else {
                    this.vehicle.tiltOffset = Math3D.MyMath.clamp(this.vehicle.tiltOffset, 90, this.vehicleData.tiltclamp);

                    this.terrainTilt = (180-this.vehicle.tiltOffset)*Math.PI/180;

                    this.vehicleTilt.targetPosition = this.terrainTilt;
                }//else
            }//else
            else if(isCrashed) {
                if(aboveGroundValue <= 0.5 && (this.vehicle.dropping || (this.vehicle.speedKmh > this.vehicle.liftOffMinSpeed) || wasAirborne)) {
                    //log("info", this.vehicle.tiltOffset, aboveGroundValue, "crashed");

                    this.vehicle.crashed = true;
                    this.vehicle.crashedTime = Date.now();

                    var airborneTime = (Date.now() - this.vehicle.airborneTime) / 50000 + 0.01;

                    if(this.vehicle.speedKmh > this.vehicle.liftOffMinSpeed*0.7) {
                        var v = this.vehicle.body.getLinearVelocity().copy();
                        v.multiply(Math3D.MyMath.clamp(speedForward*deltaTime*deltaTime+(185-this.vehicle.tiltOffset)*0.5*deltaTime, 0, 1));
                        v.negativeSelf();
                        var vC = this.vehicle.body.getLinearVelocity();
                        vC.add(v);
                        //this.vehicle.body.setLinearVelocity(v);
                    }//if

                    if(!this.hasLandingGear) {
                        // Draw tire marks
                        var frontWheel = this.vehiclePosition.createOffset(this.getVehicleHeading(), this.vehicleData.axisdistance);

                        var backWheelLeft = this.vehiclePosition.createOffset(this.getVehicleHeading()+(3.141592/(this.vehicleData.axisdistance+this.vehicleData.wheelsdistance)), -this.vehicleData.axisdistance);

                        var backWheelRight = this.vehiclePosition.createOffset(this.getVehicleHeading()-(3.141592
                            /(this.vehicleData.axisdistance+this.vehicleData.wheelsdistance)), -this.vehicleData.axisdistance);
                    }//if

                    this.vehicle.dropping = false;
                }//if

                //log("info", this.vehicle.tiltOffset, aboveGroundValue, "not ready for take off");

                if(aboveGroundValue<0 /*|| this.vehicle.speedKmh < this.vehicle.liftOffMinSpeed*0.7*/) {
                    //var altOffset = 0;//Math.abs(this.vehicle.tiltOffset - 180)*0.01;

                    this.vehicleData.minGroundAlt = newAlt+altOffset;
                    this.vehicleAltitude.targetPosition = newAlt+altOffset;
                    this.vehicleAltitude.position = newAlt+altOffset;

                    this.vehicleTilt.position = this.terrainTilt;
                    this.vehicleRoll.position = this.terrainRoll;
                }//if

                this.vehicleTilt.targetPosition = this.terrainTilt;
                this.vehicleRoll.targetPosition = this.terrainRoll;
                this.vehicle.tiltOffset = !this.vehicle.airborne ? 180 : 185;
                //this.terrainRoll = 0;
            }//if
            else {
                //log("info", this.vehicle.tiltOffset, aboveGroundValue, "take off");
                if(wasAirborne && this.vehicle.airborne) {
                    this.vehicle.crashed = true;
                    this.vehicle.crashedTime = Date.now();
                }//if

                if(aboveGroundValue<0 /*|| this.vehicle.speedKmh < this.vehicle.liftOffMinSpeed*0.7*/) {
                    //var altOffset = (this.vehicle.tiltOffset - 180)*0.05;
                    //if(altOffset < 0) altOffset = 0;

                    this.vehicleData.minGroundAlt = newAlt+altOffset;
                    this.vehicleAltitude.targetPosition = newAlt+altOffset;
                    this.vehicleAltitude.position = newAlt+altOffset;

                    if(this.vehicle.tiltOffset > 188) this.vehicle.tiltOffset-=0.2*speedForward*deltaTime;
                }//if

                this.terrainTilt = (180-this.vehicle.tiltOffset)*Math.PI/180;
                this.terrainTilt = Math3D.MyMath.clamp(this.terrainTilt, -this.vehicleData.tiltclamp, this.vehicleData.tiltclamp);

                //log("info", this.vehicleTilt.targetPosition.toDeg(), Math.abs(this.vehicleTilt.targetPosition-this.vehicleTilt.position));

                this.vehicleTilt.targetPosition = this.terrainTilt;
                if(!this.vehicle.airborne && !wasAirborne && this.vehicle.speedKmh < this.vehicle.liftOffMinSpeed) this.vehicle.tiltOffset = 180;
            }//else
        }//else if
        else if(this.vehicleData.category == "jetpack") {
            var aboveGroundValue = this.vehicleAltitude.position - newAlt;

            var wasAirborne = this.vehicle.airborne;
            if(aboveGroundValue > this.vehicleData.vehiclealt) this.vehicle.airborne = true;
            else this.vehicle.airborne = false;

            if(aboveGroundValue<0) {
                this.vehicleData.minGroundAlt = newAlt;
                this.vehicleAltitude.targetPosition = newAlt;
                this.vehicleAltitude.position = newAlt;
            }//if

            if(!this.vehicle.airborne && wasAirborne) {
                //log("info", "crashed");

                var v = this.vehicle.body.getLinearVelocity().copy();
                v.multiply(Math3D.MyMath.clamp(speedForward*deltaTime, 0, 1));
                v.negativeSelf();
                var vC = this.vehicle.body.getLinearVelocity();
                vC.add(v);
                //this.vehicle.body.setLinearVelocity(v);
            }//if
        }//if
        else if(this.vehicleData.category == "helicopter") {
            var aboveGroundValue = this.vehicleAltitude.position - newAlt;

            var wasAirborne = this.vehicle.airborne;
            if(aboveGroundValue > 0) this.vehicle.airborne = true;
            else this.vehicle.airborne = false;

            if(aboveGroundValue<0) {
                this.vehicleData.minGroundAlt = newAlt;
                this.vehicleAltitude.targetPosition = newAlt;
                this.vehicleAltitude.position = newAlt;
            }//if

            if(!this.vehicle.airborne && wasAirborne) {
                //log("info", "crashed");

                var airborneTime = (Date.now() - this.vehicle.airborneTime) / 50000 + 0.01;

                var v = this.vehicle.body.getLinearVelocity().copy();
                v.multiply(Math3D.MyMath.clamp(speedForward*deltaTime, 0, 1));
                v.negativeSelf();
                var vC = this.vehicle.body.getLinearVelocity();
                vC.add(v);
                //this.vehicle.body.setLinearVelocity(v);
            }//if
        }//else if
        else {
            var aboveGroundValue = this.vehicleAltitude.position - newAlt;
            var wasAirborne = this.vehicle.wasAirborne = this.vehicle.airborne;

            if(aboveGroundValue > this.vehicleData.vehiclealt) this.vehicle.airborne = true;
            else this.vehicle.airborne = false;

            //log("info", this.vehicle.airborne+": "+aboveGroundValue);

            if(aboveGroundValue<0) {
                this.vehicleData.minGroundAlt = newAlt;
                this.vehicleAltitude.targetPosition = newAlt;
                this.vehicleAltitude.position = newAlt;
            }//if

            if(this.vehicle.airborne && wasAirborne) {
                //log("info", "vehicle airborne");

                if(!this.vehicle.airborneTime) this.vehicle.airborneTime = Date.now();

                var airborneTime = (Date.now() - this.vehicle.airborneTime) / 10000 + 0.01;

                this.vehicle.droppingForce = this.vehicle.getMass() * this.vehicleData.gravity * airborneTime * deltaTime;// * Math.sin(this.vehicle.tiltOffset);

                //log("info", this.vehicle.droppingForce, this.vehicle.droppingForce*deltaTime, this.vehicle.tiltOffset);

                this.vehicleAltitude.targetPosition-=this.vehicle.droppingForce*deltaTime;

                //log("info", airborneTime);

                this.vehicle.dropping = true;

                if(this.vehicleData.category == "bike") {
                    if(this.vehicle.up) {
                        if(this.vehicle.airborne) {
                            this.vehicle.tiltOffset+=5-speedForward*deltaTime;
                        }//if
                        else if(this.vehicle.tiltOffset < 200) {
                            this.vehicle.tiltOffset+=(Math3D.MyMath.linearMap(this.vehicle.speed, 0, vehicle.Box2DUtils.toMps(this.vehicleData.maxspeed), 0, 10)*deltaTime)-
                                Math3D.MyMath.linearMap(this.vehicle.speed, 0, vehicle.Box2DUtils.toMps(this.vehicleData.maxspeed), 0, 5)*Math.abs(this.vehicle.getSteeringAngle());
                        }//if
                    }//if
                    else if(this.vehicle.down) {
                        if(this.vehicle.airborne) {
                            this.vehicle.tiltOffset-=5-speedForward*deltaTime;
                        }//if
                        else if(((this.vehicle.brake && this.vehicle.tiltOffset > 120))) {
                            this.vehicle.tiltOffset-=(Math3D.MyMath.linearMap(this.vehicle.speed, 0, vehicle.Box2DUtils.toMps(this.vehicleData.maxspeed), 0, 10)*deltaTime)-
                                Math3D.MyMath.linearMap(this.vehicle.speed, 0, vehicle.Box2DUtils.toMps(this.vehicleData.maxspeed), 0, 5)*Math.abs(this.vehicle.getSteeringAngle());
                        }//if
                    }//else if
                    else {
                        this.vehicle.tiltOffset-=this.vehicle.droppingForce*deltaTime;
                    }//else
                }//if
                else {
                    this.vehicle.tiltOffset-=this.vehicle.droppingForce*deltaTime;
                }//else

                // Make the loop transition fluid
                if(this.vehicle.tiltOffset > 360) {
                    if(this.vehicleTilt.position.toDeg() < -179) {
                        this.vehicle.tiltOffset -= 360;
                        this.vehicleTilt.position = 3.1396936244990847;
                        this.vehicleTilt.targetPosition = 3.1396936244990847;
                    }//if
                }//if
                else if(this.vehicle.tiltOffset < 0) {
                    if(this.vehicleTilt.position.toDeg() > 179) {
                        this.vehicle.tiltOffset += 360;
                        this.vehicleTilt.position = -3.1396936244990847;
                        this.vehicleTilt.targetPosition = -3.1396936244990847;
                    }//if
                }//else if

                this.terrainTilt = (180-this.vehicle.tiltOffset)*Math.PI/180;

                this.vehicleTilt.targetPosition = this.vehicleTilt.position = this.terrainTilt;

                //console.log("dropping update", this.vehicle.tiltOffset, this.vehicleTilt.position, this.vehicle.airborne);
            }//if
            else {
                if(this.vehicle.dropping) {
                    var airborneTime = (Date.now() - this.vehicle.airborneTime) / 10000 + 0.05;

                    //log("info", "crashed!!!!");

                    var v = this.vehicle.body.getLinearVelocity().copy();
                    v.multiply(airborneTime);
                    v.negativeSelf();
                    var vC = this.vehicle.body.getLinearVelocity();
                    vC.add(v);
                    //this.vehicle.body.setLinearVelocity(v);

                    var angularVelocityIncrement = (this.vehicle.getSteeringAngle()*speedForward+airborneTime)*Math.PI/180;
                    //log("info", angularVelocityIncrement);

                    if(!isNaN(angularVelocityIncrement)) this.vehicle.body.m_angularVelocity+=angularVelocityIncrement;

                    this.vehicleRoll.position = this.terrainRoll;

                    this.vehicle.dropping = false;
                    this.vehicle.airborneTime = false;
                    this.vehicle.droppingForce = 0;
                }//if

                if(!this.vehicle.airborne) this.vehicleAltitude.targetPosition = newAlt;
                else this.vehicleAltitude.targetPosition = newAlt-this.vehicleData.vehiclealt;

                if(this.vehicleData.category == "bike") {
                    if(this.vehicle.up || this.vehicle.down) {
                        var value = (
                            Math3D.MyMath.linearMap(this.vehicle.speed, 0, vehicle.Box2DUtils.toMps(this.vehicleData.maxspeed), 20, 5)*deltaTime-
                                Math3D.MyMath.linearMap(this.vehicle.speed, 0, vehicle.Box2DUtils.toMps(this.vehicleData.maxspeed), 0, 5)*deltaTime
                            )-Math.abs(this.vehicle.getSteeringAngle());

                        if(this.vehicle.speedKmh > 5 && this.vehicle.up) {
                            if(this.vehicle.tiltOffset < 200) {
                                if(value > 0 || this.vehicle.tiltOffset > 180)
                                    this.vehicle.tiltOffset+=value;
                            }//if
                        }//if
                        else if(this.vehicle.speedKmh > 5 && this.vehicle.down) {
                            if(((this.vehicle.brake && this.vehicle.tiltOffset > 120))) {
                                this.vehicle.tiltOffset-=value;
                            }//if
                        }//else if
                        /*if(this.vehicle.up) {
                         if(((this.vehicle.speedKmh > 15 && this.vehicle.tiltOffset < 200))) this.vehicle.tiltOffset+=5-speedForward*deltaTime;
                         }//if
                         else if(this.vehicle.down && ((this.vehicle.brake && this.vehicle.speedKmh > 15 && this.vehicle.tiltOffset > 120))) {
                         this.vehicle.tiltOffset-=5-speedForward*deltaTime;
                         }//if*/
                        else {
                            if(this.vehicle.tiltOffset>180+value) {
                                this.vehicle.tiltOffset-=value;
                            }
                            else if(this.vehicle.tiltOffset<180-value) {
                                this.vehicle.tiltOffset+=value;
                            }
                            else {
                                this.vehicle.tiltOffset=180;
                            }
                        }//else

                        if(this.vehicle.tiltOffset > 180) {
                            this.vehicle.wheelie = true;
                        }//if
                        else {
                            this.vehicle.wheelie = false;
                        }//else

                        this.vehicle.tiltOffset = Math3D.MyMath.clamp(this.vehicle.tiltOffset, 120, 200);

                        this.terrainTilt = (180-this.vehicle.tiltOffset)*Math.PI/180;
                        this.vehicleTilt.targetPosition = this.vehicleTilt.position = this.terrainTilt;
                    }//else if
                    else {
                        this.vehicle.tiltOffset = 180-this.vehicleTilt.position.toDeg();
                        this.vehicle.wheelie = false;
                    }//else
                }//if
                else {
                    this.vehicle.tiltOffset = 180-(this.vehicleTilt.position*1.5).toDeg();

                    //console.log("dropping start", this.vehicle.tiltOffset, this.vehicleTilt.position, this.vehicle.airborne);
                }//else
            }//else

            // Make the loop transition fluid
            if(this.vehicle.tiltOffset > 360) {
                if(this.vehicleTilt.position.toDeg() < -179) {
                    this.vehicle.tiltOffset -= 360;
                    this.vehicleTilt.position = 3.1396936244990847;
                    this.vehicleTilt.targetPosition = 3.1396936244990847;
                }//if
            }//if
            else if(this.vehicle.tiltOffset < 0) {
                if(this.vehicleTilt.position.toDeg() > 179) {
                    this.vehicle.tiltOffset += 360;
                    this.vehicleTilt.position = -3.1396936244990847;
                    this.vehicleTilt.targetPosition = -3.1396936244990847;
                }//if
            }//else if
        }//if

        if(this.vehicleAltitude.position > this.vehicleData.absoluteCeiling) {
            this.vehicle.isHoverAbsoluteCeiling = true;
        }//if
        else {
            this.vehicle.isHoverAbsoluteCeiling = false;
        }//else

        if(this.vehicleAltitude.position < 0) this.vehicleAltitude.position = 0;

        //log("info", "applyVerticalForces end");
    };

    this.applyTurningForces = function(speedForward, deltaTime, other) {
        //log("info", "applyTurningForces start");

        var heading = Math3D.Angle.wrap(this.getVehicleHeading());

        if(this.vehicleData.type == "person" && !this.vehicle.konamiCodeFly) {
            if(Math.abs(speedForward) < 1) {
                //heading += this.vehicle.frontLAngle*deltaTime;

                if(this.getStickX() != 0) {
                    if(speedForward >= -0.1) {
                        this.vehicle.body.setAngle(this.vehicle.body.getAngle()+this.vehicle.frontLAngle*0.1);
                    }//if
                    else if(speedForward < -0.1) {
                        this.vehicle.body.setAngle(this.vehicle.body.getAngle()-this.vehicle.frontLAngle*0.1);
                    }//else
                }//if
            }//if
        }//if
        else if(this.vehicleData.type == "jetpack" && !this.vehicle.konamiCodeFly) {
            if(Math.abs(speedForward) < 1) {
                if(this.getStickX() != 0) {
                    if(speedForward >= -0.1) {
                        this.vehicle.body.setAngle(this.vehicle.body.getAngle()+this.vehicle.frontLAngle*deltaTime);
                    }//if
                    else if(speedForward < -0.1) {
                        this.vehicle.body.setAngle(this.vehicle.body.getAngle()-this.vehicle.frontLAngle*deltaTime);
                    }//else
                }//if
            }//if
        }//else if
        else if(this.vehicleData.category == "helicopter") {
            if(Math.abs(speedForward) < 1) {
                //heading += this.vehicle.frontLAngle*deltaTime;

                if(this.getStickX() > 0) {
                    if(speedForward >= -0.1) {
                        this.vehicle.body.setAngle(this.vehicle.body.getAngle()+Math.abs(this.vehicle.frontLAngle)*0.01);
                    }//if
                    else if(speedForward < -0.1) {
                        this.vehicle.body.setAngle(this.vehicle.body.getAngle()-Math.abs(this.vehicle.frontLAngle)*0.01);
                    }//else
                }//if
                else if(this.getStickX() < 0) {
                    if(speedForward >= -0.1) {
                        this.vehicle.body.setAngle(this.vehicle.body.getAngle()-Math.abs(this.vehicle.frontLAngle)*0.01);
                    }//if
                    else if(speedForward < -0.1) {
                        this.vehicle.body.setAngle(this.vehicle.body.getAngle()+Math.abs(this.vehicle.frontLAngle)*0.01);
                    }//else
                }//if
            }//if
        }//else if

        //log("info", "applyTurningForces end");

        return heading;
    };

    this.applyVehicleAttitude = function(tilt, roll) {
        //log("info", "applyVehicleAttitude start");

        return this.vehicle.setAttitude(0, 0);

        if((this.vehicleData.mainCategory != "air" && this.vehicleData.type != "person" && !this.vehicle.konamiCodeFly) || this.vehicle.dropping) {
            this.vehicle.setAttitude(-tilt, roll);
        }//if
        else {
            if(this.vehicleData.type == "person" && !this.vehicle.konamiCodeFly) {
                this.vehicle.setAttitude(0, 0.01);
            }//if
            else {
                //this.vehicle.setAttitude(-0.01, roll);
                this.vehicle.setAttitude(-tilt, roll);
            }//else
        }//else

        //log("info", "applyVehicleAttitude end");
    };

    var quadraticFunction = function(x) {
        //return -Math.pow(x,2)+4*x-3;
        return Math.pow(x,2)-4*x+3;
    }

    // Airplane forces
    // https://www.khanacademy.org/partner-content/mit-k12/mit-k12-physics/v/the-forces-on-an-airplane
    /*
    Downward forces:
        Weight -    w=m*g
                    g=9.81 m/s^2
                    m=vehicle mass
    Upward forces:
        Lift -      L=1/2*p*Cl*v^2
                    p=density of the air (lower by increasing altitude) = 1.2754 kg/m^3
                    v=speed of the vehicle
                    Cl=coeficient of lift (changes with the angle of attack - angle formed by the direction of movement and the direction of the plane - nose)

                    stall - point where the coeficient of lift starts decreasing while the point of attack increases)
    Forward forces:
        Thrust
    Backward forces:
        Drag (pressure drag by the wind) -      D=1/2*p*Cd*v^2
                                                Cd=coeficient of drag (changes with the angle of attack) - while the angle of attack increases the Cd also increases

     */

    this.updateVehicleComponents = function(_g, qVehicle, speedForward, deltaTime, other) {
        //log("info", "updateVehicleComponents start");

        if(this.components.length > 0) {
            for(var i= 0, n=this.components.length; i<n; i++) {
                var c = this.components[i];

                var scale = new Cesium.Cartesian3(1.0, 1.0, 1.0);

                // TODO:
                //  Jetpack flames:
                //      set maxComponentsXScale=maxComponentsYScale=minComponentsXScale=spec.minComponentsYScale=maxComponentsZScale=1;
                //      set minComponentsZScale=0.5;
                // flame_left | flame_right | head | body | chassi | wheel_front_left | wheel_front_right | wheel_back_left | wheel_back_right
                try {
                    if(c.spec.type == "steeringwheel") {
                        // Steering wheel component
                        c.setRotation(function ($this) {
                            var $r;
                            var radian = -$this.vehicle.getSteeringAngle();
                            $r = radian.toDeg();
                            return $r
                        }(this));

                        /*var q1 = Cesium.Quaternion.fromAxisAngle(new Cesium.Cartesian3(1, 0, 0), -1.3962634015954638);
                        var q2 = Cesium.Quaternion.fromAxisAngle(new Cesium.Cartesian3(0, 0, 1), this.vehicle.getSteeringAngle());
                        var e = new Cesium.Quaternion();
                        Cesium.Quaternion.multiply(q2, q1, e);
                        var e2 = new Cesium.Quaternion();
                        Cesium.Quaternion.multiply(e, qVehicle, e2);

                        var eulerAngles = new Cesium.Cartesian3();
                        Cesium.Quaternion.computeAxis(e2, eulerAngles);

                        e = {
                            heading: eulerAngles.z, //heading
                            pitch: eulerAngles.x, //tilt
                            bank: eulerAngles.y //roll
                        };*/

                        var q1 = Math3D.geometry.Quaternion.angleAxis(-1.3962634015954638, new Math3D.geometry.Vector3(1, 0, 0));
                        var q2 = Math3D.geometry.Quaternion.angleAxis(this.vehicle.getSteeringAngle(), new Math3D.geometry.Vector3(0, 0, 1));
                        var qComponent = q2.mul(q1).mul(qVehicle);
                        var e = qComponent.get_eulerAngles();
                        var p = this.getLatLngAlt(.35 * (this.isRightHandDrive ? 1 : -1), .75, .8799999999999999);
                        //c.setLocation(p.lat(), p.lng(), p.altitude(), e.heading, e.pitch, e.bank);
                        c.setLocationRotation(p.lat(), p.lng(), qComponent);
                    }//if
                    else if(c.spec.type == "wheel") {
                        var updateWheelModel = function (c, x, y, z, flip, rudderAngle) {
                            var latLngAlt = _g.getLatLngAlt(x, y, z);
                            var wheelHeading = rudderAngle;
                            var wheelTilt = _g.wheelAngle;
                            if (flip) {
                                wheelHeading += 3.141592653589794;
                                wheelTilt = -wheelTilt
                            }

                            //log("info", x+", "+y+", "+z+", "+flip+", "+rudderAngle);

                            var wheelSpeedForward = box2D.common.math.B2Math.dot(_g.vehicle.body.getLinearVelocity(), vehicle.Box2DUtils.getFrontVector(_g.vehicle.body))*-0.1;

                            var q1 = Math3D.geometry.Quaternion.angleAxis(wheelHeading, new Math3D.geometry.Vector3(0, 0, 1));
                            var q2 = Math3D.geometry.Quaternion.angleAxis(wheelTilt+wheelSpeedForward, new Math3D.geometry.Vector3(1, 0, 0));
                            var qComponent = q2.mul(q1).mul(qVehicle);
                            var e = qComponent.get_eulerAngles();

                            //var gAlt = _g.getAltitude(latLngAlt, "updateWheelModel");

                            //if(!gAlt) return;

                            var pitch = e.pitch;
                            var bank = e.bank;
                            var heading = e.heading;

                            c.componentAltitude.targetPosition = latLngAlt.altitude();

                            if(!_g.vehicle.airborne) {
                                c.componentAltitude.update(deltaTime);
                            }//if
                            else {
                                c.componentAltitude.position = latLngAlt.altitude();
                            }//else
                            c.componentTilt.targetPosition = pitch;
                            c.componentTilt.update(deltaTime);
                            c.componentRoll.targetPosition = bank;
                            c.componentRoll.update(deltaTime);

                            var setTranslationOrientation = function(node, heading, tilt, roll, scale) {
                            	if(isNaN(heading)) heading = 0;
                            	if(isNaN(tilt)) tilt = 0;
                            	if(isNaN(roll)) roll = 0;

                                var rotateQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, -heading);
                                var turnQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_X, tilt);
                                var rollQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Y, roll);

                                var nodeQuat = Cesium.Quaternion.multiply(rollQuat, rotateQuat, new Cesium.Quaternion());
                                Cesium.Quaternion.multiply(nodeQuat, turnQuat, nodeQuat);

                                var translationArray = _g.bodyModel.model.gltf.nodes[node.id].translation ? _g.bodyModel.model.gltf.nodes[node.id].translation : false;
                                if(!translationArray) {
                                    var m = Cesium.Matrix4.fromColumnMajorArray(_g.bodyModel.model.gltf.nodes[node.id].matrix, new Cesium.Matrix4());
                                    var mC = Cesium.Matrix4.getTranslation(m, new Cesium.Cartesian3());
                                    translationArray = [mC.x, mC.y, mC.z];
                                }//if
                                var translation = new Cesium.Cartesian3(translationArray[0], translationArray[1], translationArray[2]);

                                //var alt = _g.getAltitude(latLngAlt, node.id);
                                //if(alt) translation.y = _g.vehicleAltitude.position-alt;

                                node.matrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(translation, nodeQuat, scale);
                            };

                            if(c.spec.dirOffset > 0) {

                                if(c.spec.posOffset < 0) {
                                    var node = _g.bodyModel.model.getNode('wheel_front_left');
                                    if(node) {
                                        setTranslationOrientation(node, wheelHeading, -(wheelTilt+wheelSpeedForward), 0, scale);
                                    }//if
                                }//if

                                else {
                                    var node = _g.bodyModel.model.getNode('wheel_front_right');
                                    if(node) {
                                        setTranslationOrientation(node, wheelHeading+Math.PI, wheelTilt+wheelSpeedForward, 0, scale);
                                    }//if
                                }//if

                                var node = _g.bodyModel.model.getNode('wheel_front');
                                if(node) {
                                    setTranslationOrientation(node, wheelHeading, -(wheelTilt+wheelSpeedForward), 0, scale);
                                }//if

                            }//if
                            else {

                                if(c.spec.posOffset < 0) {
                                    var node = _g.bodyModel.model.getNode('wheel_back_left');
                                    if(node) {
                                        setTranslationOrientation(node, wheelHeading, -(wheelTilt+wheelSpeedForward), 0, scale);
                                    }//if
                                }//if

                                else {
                                    var node = _g.bodyModel.model.getNode('wheel_back_right');
                                    if(node) {
                                        setTranslationOrientation(node, wheelHeading+Math.PI, wheelTilt+wheelSpeedForward, 0, scale);
                                    }//if
                                }//if

                                var node = _g.bodyModel.model.getNode('wheel_back');
                                if(node) {
                                    setTranslationOrientation(node, wheelHeading, -(wheelTilt+wheelSpeedForward), 0, scale);
                                }//if

                            }//else
                        };

                        if(c.spec.specialBehaviour == "turn") {
                            if(c.spec.rotation == 0) {
                                updateWheelModel(c, c.spec.posOffset, c.spec.dirOffset, this.vehicleData.wheelRadius+c.spec.upOffset, false, this.vehicle.frontLAngle);
                            }//if
                            else {
                                updateWheelModel(c, c.spec.posOffset, c.spec.dirOffset, this.vehicleData.wheelRadius+c.spec.upOffset, true, this.vehicle.frontRAngle);
                            }//if
                        }//if
                        else {
                            if(c.spec.rotation == 0) {
                                updateWheelModel(c, c.spec.posOffset, c.spec.dirOffset, this.vehicleData.wheelRadius+c.spec.upOffset, false, 0);
                            }//if
                            else {
                                updateWheelModel(c, c.spec.posOffset, c.spec.dirOffset, this.vehicleData.wheelRadius+c.spec.upOffset, true, 0);
                            }//else
                        }//if
                    }//else
                    else if(c.spec.type == "bodyPart") {
                        // https://www.scirra.com/tutorials/65/physics-in-construct-2-forces-impulses-torque-and-joints
                        // http://www.rubberbug.com/walking.htm
                        var updateModel = function (c, x, y, z, rotation, rudderAngle) {
                            var fZ = _g.componentsForces[c.spec._id].force.z;
                            var fY = _g.componentsForces[c.spec._id].force.y;
                            var iZ = _g.componentsForces[c.spec._id].impulse.z;

                            // Apply constant forces and impulses
                            x += _g.componentsForces[c.spec._id].force.x;
                            x += _g.componentsForces[c.spec._id].impulse.x;
                            y += _g.componentsForces[c.spec._id].force.y;
                            y += _g.componentsForces[c.spec._id].impulse.y;
                            z += _g.componentsForces[c.spec._id].force.z;
                            z += _g.componentsForces[c.spec._id].impulse.z;

                            var speedFactor = speedForward*deltaTime;
                            var speedFactor2 = speedForward*0.3*deltaTime;
                            var speedFactor3 = speedForward*deltaTime*deltaTime;

                            //log("info", speedFactor);

                            var tempX=0, tempY= 0, tempZ=0;

                            if(c.spec.specialBehaviour == "foot") {
                                if(speedForward < 0.1) {
                                    c.tiltOffset=0;
                                    c.altitudeOffset=0;
                                }//if

                                // Use Math.sin & Math.cos to position foot y, z
                                if(x < 0) {
                                    tempZ = _g.mmV.getValue2(c.altitudeOffset, 0)*speedFactor; //quadraticFunction(c.altitudeOffset)*speedFactor; //(Math.cos(c.altitudeOffset)/1.5*Math.sin(c.altitudeOffset)/1.5);
                                    tempY = _g.mmV.getValue(c.tiltOffset, 0)*(speedForward*0.2); //quadraticFunction(c.tiltOffset)*speedFactor; //(Math.cos(c.tiltOffset)*Math.sin(c.tiltOffset));
                                    if(tempZ < 0 && tempY < 0) tempZ *= -1;
                                    else if(tempZ < 0) tempZ = 0;

                                    if(c.altitudeOffset < 28) {
                                        tempY = tempZ = 0;
                                    }//if
                                    else if(c.altitudeOffset < 50) {
                                        c.tiltOffset=50;
                                        c.altitudeOffset=50;
                                    }//else

                                    c.tiltOffset+=1+parseInt(speedForward*0.5);
                                    c.altitudeOffset+=1+parseInt(speedForward*0.5);

                                    //log("info", "altitudeOffset: "+c.altitudeOffset, "tempZ: "+tempZ);

                                    if(tempZ != 0) _g.componentsForces[c.spec._id].torque.z = tempZ;
                                    if(tempY > 0) _g.componentsForces[c.spec._id].torque.z *= -0.2;

                                    // Send rotations to the leg
                                    for(var i= 0, n= c.spec.joints.length;i<n; i++) {
                                        _g.componentsForces[c.spec.joints[i]].force.z = tempY < 0 ? tempZ : tempZ+tempY*0.2-(0.05-tempZ);
                                        _g.componentsForces[c.spec.joints[i]].force.y = tempY < 0 ? tempY*0.8+tempZ : (tempY+tempZ);

                                        //_g.componentsForces[c.spec.joints[i]].torque.x = -wheelRoll;
                                        //_g.componentsForces[c.spec.joints[i]].torque.y = -wheelHeading;
                                        _g.componentsForces[c.spec.joints[i]].torque.z = tempY < 0 ? -(tempY*1.4+tempZ) : -(tempY*1.2+tempZ);
                                    }//for

                                }//if
                                // Right foot
                                else {
                                    tempZ = _g.mmV.getValue2(c.altitudeOffset, 0)*speedFactor; //quadraticFunction(c.altitudeOffset)*speedFactor; //(Math.cos(c.altitudeOffset)/1.5*Math.sin(c.altitudeOffset)/1.5);
                                    if(tempZ < 0) tempZ = 0;
                                    tempY = _g.mmV.getValue(c.tiltOffset, 0)*(speedForward*0.2); //quadraticFunction(c.tiltOffset)*speedFactor; //(Math.cos(c.tiltOffset)*Math.sin(c.tiltOffset));

                                    c.tiltOffset+=1+parseInt(speedForward*0.5);
                                    c.altitudeOffset+=1+parseInt(speedForward*0.5);

                                    //log("info", "altitudeOffset: "+c.altitudeOffset, "tempZ: "+tempZ);

                                    if(tempZ != 0) _g.componentsForces[c.spec._id].torque.z = tempZ;
                                    if(tempY > 0) _g.componentsForces[c.spec._id].torque.z *= -0.2;

                                    for(var i= 0, n= c.spec.joints.length;i<n; i++) {
                                        _g.componentsForces[c.spec.joints[i]].force.z = tempY < 0 ? tempZ : tempZ+tempY*0.2-(0.05-tempZ);
                                        _g.componentsForces[c.spec.joints[i]].force.y = tempY < 0 ? tempY*0.8+tempZ : (tempY+tempZ);

                                        //_g.componentsForces[c.spec.joints[i]].torque.x = -wheelRoll;
                                        //_g.componentsForces[c.spec.joints[i]].torque.y = -wheelHeading;
                                        _g.componentsForces[c.spec.joints[i]].torque.z = tempY < 0 ? -(tempY*1.4+tempZ) : -(tempY*1.2+tempZ);
                                    }//for
                                }//else

                                z+=tempZ*1.2;
                                y+=tempY > 0 ? tempY*1.4 : tempY*1.2;
                            }//if
                            else if(c.spec.specialBehaviour == "hand") {
                                if(speedForward < 0.1) {
                                    c.tiltOffset=0;
                                    c.altitudeOffset=0;
                                }//if

                                // Use Math.sin & Math.cos to position hand y, z
                                if(x < 0) {
                                    tempZ = _g.mmV.getValue2(c.altitudeOffset, 0)*speedFactor3; //quadraticFunction(c.altitudeOffset)*speedFactor; //(Math.cos(c.altitudeOffset)/1.5*Math.sin(c.altitudeOffset)/1.5);
                                    tempY = _g.mmV.getValue(c.tiltOffset, 0)*speedFactor; //quadraticFunction(c.tiltOffset)*speedFactor; //(Math.cos(c.tiltOffset)*Math.sin(c.tiltOffset));
                                    if(tempZ < 0 && tempY < 0) tempZ *= -1;
                                    else if(tempZ < 0) tempZ = 0;

                                    c.tiltOffset+=1+parseInt(speedForward*0.5);
                                    c.altitudeOffset+=1+parseInt(speedForward*0.5);

                                    //log("info", "altitudeOffset: "+c.altitudeOffset, "tempZ: "+tempZ);

                                    _g.componentsForces[c.spec._id].torque.z=tempY != 0 ? -(tempY*Math.PI) : 0;

                                    // Send rotations to the leg
                                    for(var i= 0, n= c.spec.joints.length;i<n; i++) {
                                        _g.componentsForces[c.spec.joints[i]].force.z = tempZ*0.2;
                                        _g.componentsForces[c.spec.joints[i]].force.y = (tempY-tempZ)*0.2;

                                        //_g.componentsForces[c.spec.joints[i]].torque.x = -wheelRoll;
                                        //_g.componentsForces[c.spec.joints[i]].torque.y = -wheelHeading;
                                        _g.componentsForces[c.spec.joints[i]].torque.z = -(tempY*Math.PI-tempZ);
                                    }//for

                                }//if
                                // Right hand
                                else {
                                    tempZ = _g.mmV.getValue2(c.altitudeOffset, 0)*speedFactor3; //quadraticFunction(c.altitudeOffset)*speedFactor; //(Math.cos(c.altitudeOffset)/1.5*Math.sin(c.altitudeOffset)/1.5);
                                    if(tempZ < 0) tempZ = 0;
                                    tempY = _g.mmV.getValue(c.tiltOffset, 0)*speedFactor; //quadraticFunction(c.tiltOffset)*speedFactor; //(Math.cos(c.tiltOffset)*Math.sin(c.tiltOffset));

                                    if(c.altitudeOffset < 25) {
                                        tempY = tempZ = 0;
                                    }//if
                                    else if(c.altitudeOffset < 50) {
                                        c.tiltOffset=50;
                                        c.altitudeOffset=50;
                                    }//else

                                    c.tiltOffset+=1+parseInt(speedForward*0.5);
                                    c.altitudeOffset+=1+parseInt(speedForward*0.5);

                                    //log("info", "altitudeOffset: "+c.altitudeOffset, "tempZ: "+tempZ);

                                    _g.componentsForces[c.spec._id].torque.z=tempY != 0 ? -(tempY*Math.PI) : 0;

                                    for(var i= 0, n= c.spec.joints.length;i<n; i++) {
                                        _g.componentsForces[c.spec.joints[i]].force.z = tempZ*0.2;
                                        _g.componentsForces[c.spec.joints[i]].force.y = (tempY-tempZ)*0.2;

                                        //_g.componentsForces[c.spec.joints[i]].torque.x = -wheelRoll;
                                        //_g.componentsForces[c.spec.joints[i]].torque.y = -wheelHeading;
                                        _g.componentsForces[c.spec.joints[i]].torque.z = -(tempY*Math.PI-tempZ);
                                    }//for
                                }//else

                                z+=tempZ;
                                y+=tempY;
                            }//if

                            var latLngAlt = _g.getLatLngAlt(x, y, z);

                            //var speedForward = box2D.common.math.B2Math.dot(_g.vehicle.body.getLinearVelocity(), vehicle.Box2DUtils.getFrontVector(_g.vehicle.body))*0.1;

                            // Apply rotational forces
                            var wheelHeading = 0;//c.headingOffset;
                            if(typeof _g.componentsForces[c.spec._id] != "undefined") wheelHeading+=_g.componentsForces[c.spec._id].torque.y;
                            var wheelTilt = 0;//c.tiltOffset;
                            if(typeof _g.componentsForces[c.spec._id] != "undefined") wheelTilt+=_g.componentsForces[c.spec._id].torque.z;
                            var wheelRoll = 0;//c.rollOffset;
                            if(typeof _g.componentsForces[c.spec._id] != "undefined") wheelRoll+=_g.componentsForces[c.spec._id].torque.x;

                            wheelHeading += rotation*Math.PI/180;

                            if(c.spec.specialBehaviour != "foot" && c.spec.specialBehaviour != "hand") {
                                var tZ = (wheelTilt+fZ+fY*-1.3+iZ);

                                //log("info", fZ, iZ, tZ);

                                for(var i= 0, n= c.spec.joints.length;i<n; i++) {
                                    //_g.componentsForces[c.spec.joints[i]].force.z = c.altitudeOffset;
                                    //_g.componentsForces[c.spec.joints[i]].force.y = c.tiltOffset*0.7;

                                    _g.componentsForces[c.spec.joints[i]].torque.x = -wheelRoll;
                                    _g.componentsForces[c.spec.joints[i]].torque.y = -wheelHeading;
                                    _g.componentsForces[c.spec.joints[i]].torque.z = fY < 0 ? tZ*0.6 : tZ;
                                }//for
                            }//if

                            for(var i= 0, n= c.spec.joints.length;i<n; i++) {
                                var ftZ = (fZ+tempZ)*.5;

                                if(ftZ != 0) _g.componentsForces[c.spec.joints[i]].force.z = ftZ;
                            }//for

                            var q1 = Math3D.geometry.Quaternion.angleAxis(wheelHeading, new Math3D.geometry.Vector3(0, 0, 1));
                            var q2 = Math3D.geometry.Quaternion.angleAxis(wheelRoll, new Math3D.geometry.Vector3(0, 1, 0));
                            var q3 = Math3D.geometry.Quaternion.angleAxis(wheelTilt, new Math3D.geometry.Vector3(1, 0, 0));
                            var qComponent = q3.mul(q2).mul(q1).mul(qVehicle);
                            var e = qComponent.get_eulerAngles();

                            var pitch = e.pitch;
                            var bank = e.bank;
                            var heading = e.heading;

                            //var altDiff = (latLngAlt.altitude()+c.altitudeOffset) - _g.getAltitude(latLngAlt, "updateModel");

                            //log("info", c.spec.name, latLngAlt.lat(), latLngAlt.lng(), latLngAlt.altitude()+c.altitudeOffset, heading, pitch, bank);

                            if(c.getVisibility()) {
                                c.setLocation(latLngAlt.lat(), latLngAlt.lng(), latLngAlt.altitude(), heading, pitch, bank);
                                //c.setLocationRotation(latLngAlt.lat(), latLngAlt.lng(), latLngAlt.altitude()-_g.vehicleData.upOffset, qComponent);
                            }//if

                            _g.componentsForces[c.spec._id].torque.x = 0;
                            _g.componentsForces[c.spec._id].torque.y = 0;
                            _g.componentsForces[c.spec._id].torque.z = 0;

                            _g.componentsForces[c.spec._id].impulse.x = 0;
                            _g.componentsForces[c.spec._id].impulse.y = 0;
                            _g.componentsForces[c.spec._id].impulse.z = 0;
                        };

                        updateModel(c, c.spec.posOffset, c.spec.dirOffset, c.spec.upOffset, c.spec.rotation, 0);
                    }//else
                    else {
                        var updateModel = function (c, x, y, z) {
                            // Hack until in production
                            if(c.spec.type == "flame") {
                                //c.spec.maxComponentsXScale=c.spec.maxComponentsYScale=c.spec.minComponentsXScale=c.spec.minComponentsYScale=c.spec.maxComponentsZScale=1;
                                //c.spec.minComponentsZScale=0.5;
                            }//if
                            else if(c.spec.type == "smoke") {
                                c.spec.maxComponentsXScale=c.spec.maxComponentsYScale=c.spec.maxComponentsZScale=2;
                                //c.spec.minComponentsXScale=c.spec.minComponentsYScale=c.spec.minComponentsZScale=0.5;
                            }//else if
                            else if(c.spec.type == "air") {
                                c.spec.maxComponentsXScale=c.spec.maxComponentsYScale=c.spec.maxComponentsZScale=200;
                                //c.spec.minComponentsXScale=c.spec.minComponentsYScale=c.spec.minComponentsZScale=0.5;
                            }//else if
                            else if(c.spec.type == "aileron" || c.spec.type == "flap" || c.spec.type == "rudder" || c.spec.type == "elevator" || c.spec.type == "tower" || c.spec.type == "rotor" || c.spec.type == "helice") {
                                c.spec.rotation=0.001;
                                c.spec.roll=0;
                                c.spec.tilt=0;
                            }//else if

                            //log("info", x+", "+y+", "+z+", "+_g.getVehicleHeading()+", "+_g.vehicleTilt.position);

                            var latLngAlt = _g.getLatLngAlt(x, y, z);

                            var currentGroundAltitude = _g.getAltitude(latLngAlt, "updateModel");

                            if(!currentGroundAltitude) return;

                            var altDiff = (latLngAlt.altitude()+c.altitudeOffset) - currentGroundAltitude;

                            var speedForward = box2D.common.math.B2Math.dot(_g.vehicle.body.getLinearVelocity(), vehicle.Box2DUtils.getFrontVector(_g.vehicle.body))*0.1;

                            var componentSpeed = (c.spec.speed > 0 ? c.spec.speed*deltaTime : deltaTime);

                            // http://howthingsfly.si.edu/flight-dynamics/roll-pitch-and-yaw
                            // http://science.howstuffworks.com/transport/flight/modern/airplanes4.htm
                            // Controls airplane roll (situated around the far sides of the wings)
                            if(c.spec.type == "aileron") {
                                if(c.spec.rotation != 0) c.headingOffset = c.spec.rotation*Math.PI/180;
                                if(c.spec.roll != 0) c.rollOffset = c.spec.roll*Math.PI/180;
                                //if(c.spec.tilt != 0) c.tiltOffset += c.spec.tilt*Math.PI/180;

                                if(x < 0) {
                                    var targetPosition = Math.abs(_g.vehicleRoll.position) > Math.abs(c.spec.tilt*Math.PI/180) ? _g.vehicleRoll.position : c.spec.tilt*Math.PI/180;

                                    if(_g.getStickX() < 0) c.tiltOffset += componentSpeed;
                                    else if(_g.getStickX() > 0) c.tiltOffset -= componentSpeed;
                                    else if(c.tiltOffset > targetPosition) c.tiltOffset -= (c.tiltOffset - targetPosition)*componentSpeed;
                                    else if(c.tiltOffset < targetPosition) c.tiltOffset += (targetPosition - c.tiltOffset)*componentSpeed;
                                    else c.tiltOffset = c.spec.tilt*Math.PI/180;
                                }//if
                                else {
                                    var targetPosition = Math.abs(_g.vehicleRoll.position) > Math.abs(c.spec.tilt*Math.PI/180) ? -_g.vehicleRoll.position : c.spec.tilt*Math.PI/180;

                                    if(_g.getStickX() < 0) c.tiltOffset -= componentSpeed;
                                    else if(_g.getStickX() > 0) c.tiltOffset += componentSpeed;
                                    else if(c.tiltOffset > targetPosition) c.tiltOffset -= (c.tiltOffset - targetPosition)*componentSpeed;
                                    else if(c.tiltOffset < targetPosition) c.tiltOffset += (targetPosition - c.tiltOffset)*componentSpeed;
                                    else c.tiltOffset = c.spec.tilt*Math.PI/180;
                                }//else

                                if(c.spec.maxTilt != 0) c.tiltOffset = Math3D.MyMath.clamp(c.tiltOffset, -c.spec.maxTilt/180*Math.PI, c.spec.maxTilt/180*Math.PI);
                            }//if
                            // Controls airplane tilt (situated near the chassi of the plane on both wings)
                            else if(c.spec.type == "flap") {
                                if(c.spec.rotation != 0) c.headingOffset = c.spec.rotation*Math.PI/180;
                                if(c.spec.roll != 0) c.rollOffset = c.spec.roll*Math.PI/180;

                                //c.tiltOffset = -_g.vehicleTilt.position;

                                if(_g.vehicle.up) c.tiltOffset -= componentSpeed;
                                else if(_g.vehicle.down) c.tiltOffset += componentSpeed;
                                else {
                                    if(c.tiltOffset-deltaTime > _g.vehicleTilt.position) c.tiltOffset -= componentSpeed;
                                    else if(c.tiltOffset+deltaTime < _g.vehicleTilt.position) c.tiltOffset += componentSpeed;
                                    else c.tiltOffset = _g.vehicleTilt.position;
                                }//else

                                if(c.spec.tilt != 0) c.tiltOffset += c.spec.tilt*Math.PI/180;

                                var value = Math3D.MyMath.linearMap(Math.abs(_g.vehicleRoll.position*_g.vehicle.getSteeringAngle()), 0, 1.3, 0, 0.8);
                                c.tiltOffset -= value;

                                if(c.spec.maxTilt != 0) c.tiltOffset = Math3D.MyMath.clamp(c.tiltOffset, -c.spec.maxTilt/180*Math.PI, c.spec.maxTilt/180*Math.PI);
                            }//if
                            // Controls airplane tilt (situated on the tail of the airplane)
                            else if(c.spec.type == "elevator") {
                                if(c.spec.rotation != 0) c.headingOffset = c.spec.rotation*Math.PI/180;
                                if(c.spec.roll != 0) c.rollOffset = c.spec.roll*Math.PI/180;

                                //c.tiltOffset = -_g.vehicleTilt.position;

                                if(_g.vehicle.up) c.tiltOffset += componentSpeed;
                                else if(_g.vehicle.down) c.tiltOffset -= componentSpeed;
                                else {
                                    if(c.tiltOffset-deltaTime > -_g.vehicleTilt.position) c.tiltOffset -= componentSpeed;
                                    else if(c.tiltOffset+deltaTime < -_g.vehicleTilt.position) c.tiltOffset += componentSpeed;
                                    else c.tiltOffset = -_g.vehicleTilt.position;
                                }//else

                                if(c.spec.tilt != 0) c.tiltOffset += c.spec.tilt*Math.PI/180;

                                var value = Math3D.MyMath.linearMap(Math.abs(_g.vehicleRoll.position*_g.vehicle.getSteeringAngle()), 0, 1.3, 0, 0.8);
                                c.tiltOffset += value;

                                if(c.spec.maxTilt != 0) c.tiltOffset = Math3D.MyMath.clamp(c.tiltOffset, -c.spec.maxTilt/180*Math.PI, c.spec.maxTilt/180*Math.PI);
                            }//if
                            // Controls airplane heading (situated on the tail of the airplane)
                            else if(c.spec.type == "rudder") {
                                if(c.spec.roll != 0) c.rollOffset = c.spec.roll*Math.PI/180;
                                if(c.spec.tilt != 0) c.tiltOffset = c.spec.tilt*Math.PI/180;

                                //c.headingOffset = -_g.vehicle.getSteeringAngle()+(c.spec.rotation != 0 ? c.spec.rotation*Math.PI/180 : 0);

                                var dest = -_g.vehicle.getSteeringAngle()+(c.spec.rotation != 0 ? c.spec.rotation*Math.PI/180 : 0);

                                if(c.headingOffset - componentSpeed > dest) {
                                    c.headingOffset -= componentSpeed;
                                }//if
                                else if(c.headingOffset + componentSpeed < dest) {
                                    c.headingOffset += componentSpeed;
                                }//else if
                                else {
                                    c.headingOffset = dest;
                                }//else

                                /*
                                var value = Math3D.MyMath.linearMap(Math.abs(_g.vehicleRoll.position), 0, 1.3, 0, 0.8);

                                if(_g.vehicle.getSteeringAngle() < 0) {
                                    c.headingOffset -= Math3D.MyMath.clamp(value,0,c.headingOffset);
                                }//if
                                else {
                                    c.headingOffset += Math3D.MyMath.clamp(value,0,Math.abs(c.headingOffset));
                                }//else
                                */

                                if((_g.vehicle.up || _g.vehicle.down || Math.abs(_g.vehicleTilt.position) > 0.3) && Math.abs(_g.vehicleRoll.position) > 0.3) {
                                    if(_g.vehicle.getSteeringAngle() < 0) {
                                        c.headingOffset += _g.vehicleTilt.targetPosition*1.57;
                                    }//if
                                    else {
                                        c.headingOffset -= _g.vehicleTilt.targetPosition*1.57;
                                    }//else
                                }//if

                                if(c.spec.maxRotation != 0) c.headingOffset = Math3D.MyMath.clamp(c.headingOffset, -c.spec.maxRotation/180*Math.PI, c.spec.maxRotation/180*Math.PI);
                            }//if
                            else if(c.spec.type == "head") {
                                if(c.spec.roll != 0) c.rollOffset = c.spec.roll*Math.PI/180;
                                if(c.spec.tilt != 0) c.tiltOffset = c.spec.tilt*Math.PI/180;

                                //c.headingOffset = -_g.vehicle.getSteeringAngle()+(c.spec.rotation != 0 ? c.spec.rotation*Math.PI/180 : 0);

                                var dest = _g.vehicle.getSteeringAngle()+(c.spec.rotation != 0 ? c.spec.rotation*Math.PI/180 : 0);

                                if(c.headingOffset - componentSpeed > dest) {
                                    c.headingOffset -= componentSpeed;
                                }//if
                                else if(c.headingOffset + componentSpeed < dest) {
                                    c.headingOffset += componentSpeed;
                                }//else if
                                else {
                                    c.headingOffset = dest;
                                }//else

                                if(c.spec.maxRotation != 0) c.headingOffset = Math3D.MyMath.clamp(c.headingOffset, -c.spec.maxRotation/180*Math.PI, c.spec.maxRotation/180*Math.PI);
                            }//if
                            else if(c.spec.type == "tower") {
                                if(c.spec.roll != 0) c.rollOffset = c.spec.roll*Math.PI/180;

                                if(_g.vehicle.up) {
                                    c.headingOffset -= 0.01;
                                }//if

                                if(_g.vehicle.down) {
                                    c.headingOffset += 0.01;
                                }//if
                            }//if
                            else if(c.spec.type == "landingGear") {
                                if(c.spec.specialBehaviour == "turn") {
                                    c.headingOffset = _g.vehicle.getSteeringAngle()+(c.spec.rotation != 0 ? c.spec.rotation*Math.PI/180 : 0);

                                    if(c.spec.maxRotation != 0) c.headingOffset = Math3D.MyMath.clamp(c.headingOffset, -c.spec.maxRotation/180*Math.PI, c.spec.maxRotation/180*Math.PI);
                                }//if

                                if((altDiff > c.spec.maxAltitude && c.spec.maxAltitude >= 0)) {
                                    if(c.spec.maxTilt != 0) {
                                        if(c.tiltOffset+componentSpeed < (c.spec.maxTilt+c.spec.maxTilt*0.2)/180*Math.PI) {
                                            c.tiltOffset += componentSpeed;
                                        }//if
                                        else if(c.tiltOffset-componentSpeed > (c.spec.maxTilt+c.spec.maxTilt*0.2)/180*Math.PI) {
                                            c.tiltOffset -= componentSpeed;
                                        }//else if
                                        else {
                                            c.tiltOffset = (c.spec.maxTilt+c.spec.maxTilt*0.2)/180*Math.PI;
                                        }//else

                                        c.tiltOffset = Math3D.MyMath.clamp(c.tiltOffset, -(c.spec.maxTilt+c.spec.maxTilt*0.2)/180*Math.PI, (c.spec.maxTilt+c.spec.maxTilt*0.2)/180*Math.PI);

                                        if(Math.abs(c.tiltOffset) >= Math.abs((c.spec.maxTilt+c.spec.maxTilt*0.2)/180*Math.PI)) {
                                            c.setVisibility(false);
                                            scale.x = 0.001;
                                            scale.y = 0.001;
                                            scale.z = 0.001;
                                        }//if
                                    }//if
                                    else if(c.spec.maxRoll != 0) {
                                        if(c.rollOffset+componentSpeed < (c.spec.maxRoll+c.spec.maxRoll*0.2)/180*Math.PI) {
                                            c.rollOffset += componentSpeed;
                                        }//if
                                        else if(c.rollOffset-componentSpeed > (c.spec.maxRoll+c.spec.maxRoll*0.2)/180*Math.PI) {
                                            c.rollOffset -= componentSpeed;
                                        }//else if
                                        else {
                                            c.rollOffset = (c.spec.maxRoll+c.spec.maxRoll*0.2)/180*Math.PI;
                                        }//else

                                        c.rollOffset = Math3D.MyMath.clamp(c.rollOffset, -(c.spec.maxRoll+c.spec.maxRoll*0.2)/180*Math.PI, (c.spec.maxRoll+c.spec.maxRoll*0.2)/180*Math.PI);

                                        if(Math.abs(c.rollOffset) >= Math.abs((c.spec.maxRoll+c.spec.maxRoll*0.2)/180*Math.PI)) {
                                            c.setVisibility(false);
                                            scale.x = 0.001;
                                            scale.y = 0.001;
                                            scale.z = 0.001;
                                        }//if
                                    }//if
                                    else if(c.spec.maxAlt != 0) {
                                        if(c.altitudeOffset+componentSpeed < (c.spec.maxAlt)) {
                                            c.altitudeOffset += componentSpeed;
                                        }//if
                                        else if(c.altitudeOffset-componentSpeed > (c.spec.maxAlt)) {
                                            c.altitudeOffset -= componentSpeed;
                                        }//else if
                                        else {
                                            c.altitudeOffset = (c.spec.maxAlt);
                                        }//else

                                        c.altitudeOffset = Math3D.MyMath.clamp(c.altitudeOffset, -(c.spec.maxAlt), (c.spec.maxAlt));

                                        if(Math.abs(c.altitudeOffset) >= Math.abs((c.spec.maxAlt))) {
                                            c.setVisibility(false);
                                            scale.x = 0.001;
                                            scale.y = 0.001;
                                            scale.z = 0.001;
                                        }//if
                                    }//if
                                }//if
                                else {
                                    if(c.spec.maxTilt != 0) {
                                        if(c.tiltOffset+componentSpeed < 0) {
                                            c.tiltOffset += componentSpeed;
                                        }//if
                                        else if(c.tiltOffset-componentSpeed > 0) {
                                            c.tiltOffset -= componentSpeed;
                                        }//else if
                                        else {
                                            c.tiltOffset = 0;
                                        }//else

                                        if(Math.abs(c.tiltOffset) <= Math.abs((c.spec.maxTilt+c.spec.maxTilt*0.2)/180*Math.PI)) {
                                            c.setVisibility(true);
                                        }//if
                                    }//if
                                    else if(c.spec.maxRoll != 0) {
                                        if(c.rollOffset+componentSpeed < 0) {
                                            c.rollOffset += componentSpeed;
                                        }//if
                                        else if(c.rollOffset-componentSpeed > 0) {
                                            c.rollOffset -= componentSpeed;
                                        }//else if
                                        else {
                                            c.rollOffset = 0;
                                        }//else

                                        if(Math.abs(c.rollOffset) <= Math.abs((c.spec.maxRoll+c.spec.maxRoll*0.2)/180*Math.PI)) {
                                            c.setVisibility(true);
                                        }//if
                                    }//if
                                    else if(c.spec.maxAlt != 0) {
                                        if(c.altitudeOffset+componentSpeed < 0) {
                                            c.altitudeOffset += componentSpeed;
                                        }//if
                                        else if(c.altitudeOffset-componentSpeed > 0) {
                                            c.altitudeOffset -= componentSpeed;
                                        }//else if
                                        else {
                                            c.altitudeOffset = 0;
                                        }//else

                                        if(Math.abs(c.altitudeOffset) <= Math.abs((c.spec.maxAlt))) {
                                            c.setVisibility(true);
                                        }//if
                                    }//if
                                }//else
                            }//else if
                            else if(c.spec.specialBehaviour == "rotate") {
                                if(c.spec.type == "rotor") {
                                    //log("info", speedForward);

                                    //c.rollOffset += c.spec.speed*Math.PI/180;
                                    c.rollOffset -= c.spec.speed*Math.PI/180+(Math3D.MyMath.clamp(speedForward,0,0.6)-0.4);

                                    //c.rollOffset += speedForward;

                                    //if(c.rollOffset >= c.spec.maxRotation*Math.PI/180) c.rollOffset = -c.spec.maxRotation*Math.PI/180 + (c.rollOffset-c.spec.maxRotation*Math.PI/180);
                                    if(c.rollOffset <= -c.spec.maxRotation*Math.PI/180) c.rollOffset = c.spec.maxRotation*Math.PI/180 - (c.spec.maxRotation*Math.PI/180 - c.rollOffset);
                                }//if
                                else {
                                    //c.headingOffset += c.spec.speed*Math.PI/180;
                                    c.headingOffset -= c.spec.speed*Math.PI/180+(Math3D.MyMath.clamp(speedForward,0,0.6)-0.4);

                                    //c.headingOffset += speedForward;

                                    //if(c.headingOffset >= c.spec.maxRotation*Math.PI/180) c.headingOffset = -c.spec.maxRotation*Math.PI/180 + (c.headingOffset-c.spec.maxRotation*Math.PI/180);
                                    if(c.headingOffset <= -c.spec.maxRotation*Math.PI/180) c.headingOffset = c.spec.maxRotation*Math.PI/180 - (c.spec.maxRotation*Math.PI/180 - c.headingOffset);
                                }//else

                                if(c.spec.rotation != 0) c.headingOffset += c.spec.rotation*Math.PI/180;
                                if(c.spec.roll != 0) c.rollOffset += c.spec.roll*Math.PI/180;
                                if(c.spec.tilt != 0) c.tiltOffset = c.spec.tilt*Math.PI/180;
                            }//if
                            else {
                                if(c.spec.rotation != 0) c.headingOffset = c.spec.rotation*Math.PI/180;
                                if(c.spec.roll != 0) c.rollOffset = c.spec.roll*Math.PI/180;
                                if(c.spec.tilt != 0) c.tiltOffset = c.spec.tilt*Math.PI/180;
                            }//else

                            var wheelHeading = c.headingOffset;
                            var wheelTilt = c.tiltOffset;
                            var wheelRoll = c.rollOffset;

                            var q1 = Math3D.geometry.Quaternion.angleAxis(wheelHeading, new Math3D.geometry.Vector3(0, 0, 1));
                            var q2 = Math3D.geometry.Quaternion.angleAxis(wheelRoll, new Math3D.geometry.Vector3(0, 1, 0));
                            var q3 = Math3D.geometry.Quaternion.angleAxis(wheelTilt, new Math3D.geometry.Vector3(1, 0, 0));
                            var qComponent = false;
                            var e = false;
                            if(c.spec.roll != 0) {
                                qComponent = q3.mul(q2).mul(q1).mul(qVehicle);
                                e = qComponent.get_eulerAngles();
                            }//if
                            else if(c.spec.tilt != 0) {
                                qComponent = q1.mul(q2).mul(q3).mul(qVehicle);
                                e = qComponent.get_eulerAngles();
                            }//else if
                            else {
                                qComponent = q2.mul(q1).mul(q3).mul(qVehicle);
                                e = qComponent.get_eulerAngles();
                            }//else

                            var pitch = e.pitch;
                            var bank = e.bank;
                            var heading = e.heading;

                            var hideComponent = false;
                            if(c.spec.specialBehaviour == "brake") hideComponent = _g.vehicle.brake > .1 || _g.vehicle.handbrake ? false : true;
                            else if(c.spec.specialBehaviour == "reverse") hideComponent = _g.vehicle.gearBox.getCurrentGear() < 0 ? false : true;
                            else if(c.spec.specialBehaviour == "turnsignal") hideComponent = (_g.getStickX() < 0 && c.spec.posOffset < 0) || (_g.getStickX() > 0 && c.spec.posOffset > 0) ? false : true;
                            else if(c.spec.specialBehaviour == "blink") {
                                if(typeof c.state == "undefined") c.state = 0;

                                var maxState = ((c.spec.speed/1000)/deltaTime);
                                c.state=(c.state+1)%maxState;
                                // Off
                                if(c.state < maxState/3 || c.state > maxState-maxState/3) {
                                    //log("info", "blink hide", c.state);

                                    hideComponent = true;
                                }//if
                                // Blink
                                else {
                                    var blinkStart = maxState/3;
                                    var step = 1.5;
                                    var blinkEnd = blinkStart + step;

                                    var blink2Start = blinkEnd + step;
                                    var step2 = 1.5;
                                    var blink2End = blink2Start + step2;

                                    if(c.state > blinkStart && c.state < blinkEnd || c.state > blink2Start && c.state < blink2End) {
                                        //log("info", "blink blink show", c.state);

                                        hideComponent = false;
                                    }//if
                                    else {
                                        //log("info", "blink blink hide", c.state);

                                        hideComponent = true;
                                    }//else
                                }//else
                                //hideComponent = Date.now() - c.timer > c.spec.speed ? c.getVisibility() : !c.getVisibility();
                            }//else if

                            if(c.spec.sacalable) {
                                if(c.spec.type == "flame") {
                                    if(_g.vehicleData.category == "plane") {
                                        // Turning left delta < 0 | Turning right delta > 0
                                        if((_g.getThrottle() > 0)) {
                                            c.componentXScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speedKmh / (_g.vehicleData.maxspeed) + Math.random()*(0.05+_g.vehicle.speedKmh*0.05), c.spec.minComponentsXScale, c.spec.maxComponentsXScale);
                                            c.componentXScale.update(deltaTime);
                                            c.componentYScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speedKmh / (_g.vehicleData.maxspeed) + Math.random()*(0.05+_g.vehicle.speedKmh*0.05), c.spec.minComponentsYScale, c.spec.maxComponentsYScale);
                                            c.componentYScale.update(deltaTime);
                                            c.componentZScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speedKmh / (_g.vehicleData.maxspeed) + Math.random()*(0.05+_g.vehicle.speedKmh*0.05), c.spec.minComponentsZScale, c.spec.maxComponentsZScale);
                                            c.componentZScale.update(deltaTime);
                                        }//if
                                        else {
                                            c.componentXScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speedKmh / (_g.vehicleData.maxspeed*0.5) + Math.random()*(0.05+_g.vehicle.speedKmh*0.05), c.spec.minComponentsXScale, c.spec.maxComponentsXScale);
                                            c.componentXScale.update(deltaTime);
                                            c.componentYScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speedKmh / (_g.vehicleData.maxspeed*0.5) + Math.random()*(0.05+_g.vehicle.speedKmh*0.05), c.spec.minComponentsYScale, c.spec.maxComponentsYScale);
                                            c.componentYScale.update(deltaTime);
                                            c.componentZScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speedKmh / (_g.vehicleData.maxspeed*0.5) + Math.random()*(0.05+_g.vehicle.speedKmh*0.05), c.spec.minComponentsZScale, c.spec.maxComponentsZScale);
                                            c.componentZScale.update(deltaTime);
                                        }//else
                                    }//if
                                    else {
                                        if(_g.vehicle.up || _g.getStickY() != 0) {
                                            c.componentXScale.targetPosition = Math3D.MyMath.clamp(c.spec.maxComponentsXScale*0.8 - Math.random()*0.1, c.spec.minComponentsXScale, c.spec.maxComponentsXScale);
                                            c.componentXScale.update(deltaTime);
                                            c.componentYScale.targetPosition = Math3D.MyMath.clamp(c.spec.maxComponentsYScale*0.8 - Math.random()*0.1, c.spec.minComponentsYScale, c.spec.maxComponentsYScale);
                                            c.componentYScale.update(deltaTime);
                                            c.componentZScale.targetPosition = Math3D.MyMath.clamp(c.spec.maxComponentsZScale*0.8 - Math.random()*0.1, c.spec.minComponentsZScale, c.spec.maxComponentsZScale);
                                            c.componentZScale.update(deltaTime);
                                        }//if
                                        else
                                        if(_g.vehicle.down) {
                                            c.componentXScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speedKmh / (_g.vehicleData.maxspeed*5) + Math.random()*(0.05+_g.vehicle.speedKmh*0.001), c.spec.minComponentsXScale, c.spec.maxComponentsXScale);
                                            c.componentXScale.update(deltaTime);
                                            c.componentYScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speedKmh / (_g.vehicleData.maxspeed*5) + Math.random()*(0.05+_g.vehicle.speedKmh*0.001), c.spec.minComponentsYScale, c.spec.maxComponentsYScale);
                                            c.componentYScale.update(deltaTime);
                                            c.componentZScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speedKmh / (_g.vehicleData.maxspeed*5) + Math.random()*(0.05+_g.vehicle.speedKmh*0.001), c.spec.minComponentsZScale, c.spec.maxComponentsZScale);
                                            c.componentZScale.update(deltaTime);
                                        }//else if
                                        // Turning left delta < 0 | Turning right delta > 0
                                        else if((_g.getSteeringDelta() > 0 && c.spec.posOffset < 0) || (_g.getSteeringDelta() < 0 && c.spec.posOffset > 0)) {
                                            c.componentXScale.targetPosition = Math3D.MyMath.clamp(Math.max(_g.vehicle.speedKmh, _g.vehicleData.maxspeed*0.2) / (_g.vehicleData.maxspeed*2) + Math.random()*(0.05+_g.vehicle.speedKmh*0.001), c.spec.minComponentsXScale, c.spec.maxComponentsXScale);
                                            c.componentXScale.update(deltaTime);
                                            c.componentYScale.targetPosition = Math3D.MyMath.clamp(Math.max(_g.vehicle.speedKmh, _g.vehicleData.maxspeed*0.2) / (_g.vehicleData.maxspeed*2) + Math.random()*(0.05+_g.vehicle.speedKmh*0.001), c.spec.minComponentsYScale, c.spec.maxComponentsYScale);
                                            c.componentYScale.update(deltaTime);
                                            c.componentZScale.targetPosition = Math3D.MyMath.clamp(Math.max(_g.vehicle.speedKmh, _g.vehicleData.maxspeed*0.2) / (_g.vehicleData.maxspeed*2) + Math.random()*(0.05+_g.vehicle.speedKmh*0.001), c.spec.minComponentsZScale, c.spec.maxComponentsZScale);
                                            c.componentZScale.update(deltaTime);
                                        }//if
                                        else {
                                            c.componentXScale.targetPosition = Math3D.MyMath.clamp(Math.max(_g.vehicle.speedKmh, _g.vehicle.airborne ? _g.vehicleData.maxspeed*0.4 : 0) / (_g.vehicleData.maxspeed*5) + Math.random()*(0.05+_g.vehicle.speedKmh*0.001), c.spec.minComponentsXScale, c.spec.maxComponentsXScale);
                                            c.componentXScale.update(deltaTime);
                                            c.componentYScale.targetPosition = Math3D.MyMath.clamp(Math.max(_g.vehicle.speedKmh, _g.vehicle.airborne ? _g.vehicleData.maxspeed*0.4 : 0) / (_g.vehicleData.maxspeed*5) + Math.random()*(0.05+_g.vehicle.speedKmh*0.001), c.spec.minComponentsYScale, c.spec.maxComponentsYScale);
                                            c.componentYScale.update(deltaTime);
                                            c.componentZScale.targetPosition = Math3D.MyMath.clamp(Math.max(_g.vehicle.speedKmh, _g.vehicle.airborne ? _g.vehicleData.maxspeed*0.4 : 0) / (_g.vehicleData.maxspeed*5) + Math.random()*(0.05+_g.vehicle.speedKmh*0.001), c.spec.minComponentsZScale, c.spec.maxComponentsZScale);
                                            c.componentZScale.update(deltaTime);
                                        }//else
                                    }//else
                                }//if
                                else if(c.spec.type == "air") {
                                    c.componentYScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speed / (_g.vehicleData.maxspeed) + Math.random()*(0.01+_g.vehicle.speed*0.05), c.spec.minComponentsXScale, c.spec.maxComponentsXScale)*(Math3D.MyMath.linearMap(_g.vehicle.speed, 0, _g.vehicleData.maxspeed/2, 1, 15));
                                    c.componentYScale.update(deltaTime);
                                    c.componentXScale.targetPosition = 2; //c.spec.minComponentsYScale;
                                    c.componentXScale.update(deltaTime);
                                    c.componentZScale.targetPosition = 2; //c.spec.minComponentsZScale; //Math3D.MyMath.clamp(_g.vehicle.speed / (_g.vehicleData.maxspeed) + Math.random()*(0.01+_g.vehicle.speed*0.05), c.spec.minComponentsZScale, c.spec.maxComponentsZScale);
                                    c.componentZScale.update(deltaTime);
                                }//else if
                                else {
                                    c.componentXScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speed / (_g.vehicleData.maxspeed*5) + Math.random()*(0.01+_g.vehicle.speed*0.05), c.spec.minComponentsXScale, c.spec.maxComponentsXScale);
                                    c.componentXScale.update(deltaTime);
                                    c.componentYScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speed / (_g.vehicleData.maxspeed*5) + Math.random()*(0.01+_g.vehicle.speed*0.05), c.spec.minComponentsYScale, c.spec.maxComponentsYScale);
                                    c.componentYScale.update(deltaTime);
                                    c.componentZScale.targetPosition = Math3D.MyMath.clamp(_g.vehicle.speed / (_g.vehicleData.maxspeed*5) + Math.random()*(0.01+_g.vehicle.speed*0.05), c.spec.minComponentsZScale, c.spec.maxComponentsZScale);
                                    c.componentZScale.update(deltaTime);
                                }//else

                                scale.x = c.componentXScale.targetPosition;
                                scale.y = c.componentYScale.targetPosition;
                                scale.z = c.componentZScale.targetPosition;
                            }//if

                            if(c.spec.type == "landingGear") {
                            }//if
                            else {
                                if((altDiff > c.spec.maxAltitude && c.spec.maxAltitude >= 0) || hideComponent) {
                                    if(c.getVisibility()) c.timer = Date.now();

                                    c.setVisibility(false);
                                    scale.x = 0.001;
                                    scale.y = 0.001;
                                    scale.z = 0.001;
                                }//if
                                else {
                                    if(!c.getVisibility()) c.timer = Date.now();

                                    c.setVisibility(true);
                                }//else
                            }//else

                            var setTranslationOrientation = function(id, node, heading, tilt, roll, xOffset, yOffset, zOffset, scale) {
                            	if(isNaN(heading)) heading = 0;
                            	if(isNaN(tilt)) tilt = 0;
                            	if(isNaN(roll)) roll = 0;

                                if(node) {
                                    var rotateQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Z, -heading);
                                    var turnQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_X, -tilt);
                                    var rollQuat = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_Y, -roll);

                                    var nodeQuat = Cesium.Quaternion.multiply(rollQuat, rotateQuat, new Cesium.Quaternion());
                                    Cesium.Quaternion.multiply(nodeQuat, turnQuat, nodeQuat);

                                    var translationArray = _g.bodyModel.model.gltf.nodes[node.id].translation ? _g.bodyModel.model.gltf.nodes[node.id].translation : false;
                                    if(!translationArray) {
                                        var m = Cesium.Matrix4.fromColumnMajorArray(_g.bodyModel.model.gltf.nodes[node.id].matrix, new Cesium.Matrix4());
                                        var mC = Cesium.Matrix4.getTranslation(m, new Cesium.Cartesian3());
                                        translationArray = [mC.x, mC.y, mC.z];
                                    }//if
                                    var translation = new Cesium.Cartesian3(translationArray[0]-xOffset, translationArray[1]-yOffset, translationArray[2]-zOffset);

                                    /*if(id == 'wheel_back_right') {
                                        var modelTranslation = new Cesium.Cartesian3();
                                        Cesium.Matrix4.getTranslation(_g.bodyModel.model.modelMatrix, modelTranslation);

                                        var finalTranslation = new Cesium.Cartesian3();
                                        Cesium.Cartesian3.subtract(modelTranslation, translation, finalTranslation);
                                        var finalTranslation2 = new Cesium.Cartesian3();
                                        Cesium.Cartesian3.subtract(modelTranslation, Cesium.Cartesian3.normalize(translation, new Cesium.Cartesian3()), finalTranslation2);

                                        var finalLocation = new Cesium.Cartographic();
                                        _g.ellipsoid.cartesianToCartographic(finalTranslation, finalLocation);

                                        finalTranslation.z = finalTranslation2.z;
                                        //console.log(id, finalLocation);
                                        for(var i= 0, n=_g.labels.length;i<n;i++) {
                                            var x = _g.labels.get(i);
                                            x.position = finalTranslation;
                                        }//for
                                    }//if*/

                                    node.matrix = Cesium.Matrix4.fromTranslationQuaternionRotationScale(translation, nodeQuat, scale);
                                }//if
                            };

                            if(c.spec.type == "helice") {
                                setTranslationOrientation('rotor_main', _g.bodyModel.model.getNode('rotor_main'), wheelHeading, 0, 0, 0,0,c.altitudeOffset, scale);
                                setTranslationOrientation('rotor_back', _g.bodyModel.model.getNode('rotor_back'), 0, wheelHeading, 0, 0,0,c.altitudeOffset, scale);
                            }//else if

                            else if(c.spec.type == "rotor") {
                                if(c.spec.posOffset < 0) {
                                    setTranslationOrientation('rotor_left_1', _g.bodyModel.model.getNode('rotor_left_1'), 0, 0, wheelRoll, 0,0,c.altitudeOffset, scale);

                                    setTranslationOrientation('rotor_left_2', _g.bodyModel.model.getNode('rotor_left_2'), 0, 0, wheelRoll, 0,0,c.altitudeOffset, scale);
                                }//if
                                else {
                                    setTranslationOrientation('rotor_right_1', _g.bodyModel.model.getNode('rotor_right_1'), 0, 0, wheelRoll, 0,0,c.altitudeOffset, scale);

                                    setTranslationOrientation('rotor_right_2', _g.bodyModel.model.getNode('rotor_right_2'), 0, 0, wheelRoll, 0,0,c.altitudeOffset, scale);
                                }//else
                            }//else if

                            else if(c.spec.type == "rudder") {
                                setTranslationOrientation('rudder', _g.bodyModel.model.getNode('rudder'), wheelHeading, 0, 0, 0,0,c.altitudeOffset, scale);

                                setTranslationOrientation('rudder_left', _g.bodyModel.model.getNode('rudder_left'), wheelHeading, 0, 0, 0,0,c.altitudeOffset, scale);

                                setTranslationOrientation('rudder_right', _g.bodyModel.model.getNode('rudder_right'), wheelHeading, 0, 0, 0,0,c.altitudeOffset, scale);
                            }//else if

                            else if(c.spec.type == "head") {
                                setTranslationOrientation('head', _g.bodyModel.model.getNode('head'), wheelHeading, 0, 0, 0,0,c.altitudeOffset, scale);
                            }//else if

                            else if(c.spec.type == "tower") {
                                setTranslationOrientation('tower', _g.bodyModel.model.getNode('tower'), wheelHeading, 0, 0, 0,0,c.altitudeOffset, scale);
                            }//else if

                            else if(c.spec.type == "landingGear") {
                                if(c.spec.dirOffset > 0) {
                                    setTranslationOrientation('wheel_front', _g.bodyModel.model.getNode('wheel_front'), wheelHeading, wheelTilt, wheelRoll, 0,0,c.altitudeOffset, scale);
                                }//if
                                else {
                                    if(c.spec.posOffset < 0) {
                                        setTranslationOrientation('wheel_back_left', _g.bodyModel.model.getNode('wheel_back_left'), wheelHeading, wheelTilt, wheelRoll, 0,0,c.altitudeOffset, scale);
                                    }//if
                                    else {
                                        setTranslationOrientation('wheel_back_right', _g.bodyModel.model.getNode('wheel_back_right'), wheelHeading, wheelTilt, wheelRoll, 0,0,c.altitudeOffset, scale);
                                    }//else
                                }//else
                            }//else if

                            else if(c.spec.type == "elevator") {
                                setTranslationOrientation('elevator', _g.bodyModel.model.getNode('elevator'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);

                                if(c.spec.posOffset < 0) {
                                    setTranslationOrientation('elevator_back_left', _g.bodyModel.model.getNode('elevator_back_left'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                    setTranslationOrientation('elevator_left', _g.bodyModel.model.getNode('elevator_left'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                }//if
                                else {
                                    setTranslationOrientation('elevator_back_right', _g.bodyModel.model.getNode('elevator_back_right'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                    setTranslationOrientation('elevator_right', _g.bodyModel.model.getNode('elevator_right'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                }//if
                            }//else if

                            else if(c.spec.type == "flame") {
                                setTranslationOrientation('flame', _g.bodyModel.model.getNode('flame'), 0, 0, 0, 0,0,c.altitudeOffset, scale);

                                if(c.spec.posOffset < 0) {
                                    setTranslationOrientation('flame_left', _g.bodyModel.model.getNode('flame_left'), 0, 0, 0, 0,0,c.altitudeOffset, scale);
                                }//if
                                else {
                                    setTranslationOrientation('flame_right', _g.bodyModel.model.getNode('flame_right'), 0, 0, 0, 0,0,c.altitudeOffset, scale);
                                }//else
                            }//else if

                            else if(c.spec.type == "smoke") {
                                setTranslationOrientation('smoke', _g.bodyModel.model.getNode('smoke'), 0, 0, 0, 0,0,c.altitudeOffset, scale);

                                if(c.spec.posOffset < 0) {
                                    setTranslationOrientation('smoke_left', _g.bodyModel.model.getNode('smoke_left'), 0, 0, 0, 0,0,c.altitudeOffset, scale);
                                }//if
                                else {
                                    setTranslationOrientation('smoke_right', _g.bodyModel.model.getNode('smoke_right'), 0, 0, 0, 0,0,c.altitudeOffset, scale);
                                }//else
                            }//else if

                            else if(c.spec.type == "air") {
                                //scale.x = scale.z = 5;
                                //scale.y += 50;

                                if(c.spec.posOffset < 0) {
                                    //console.log("air_wing_left", scale);

                                    setTranslationOrientation('air_wing_left', _g.bodyModel.model.getNode('air_wing_left'), 0, 0, 0, 0,scale.y*0.05,0, scale);
                                }//if
                                else {
                                    //console.log("air_wing_right", scale);

                                    setTranslationOrientation('air_wing_right', _g.bodyModel.model.getNode('air_wing_right'), 0, 0, 0, 0,scale.y*0.05,0, scale);
                                }//else
                            }//else if

                            else if(c.spec.type == "flap") {
                                setTranslationOrientation('flap', _g.bodyModel.model.getNode('flap'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);

                                if(c.spec.posOffset < 0) {
                                    setTranslationOrientation('flap_left', _g.bodyModel.model.getNode('flap_left'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                    setTranslationOrientation('elevator_front_left', _g.bodyModel.model.getNode('elevator_front_left'), wheelHeading, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                }//if
                                else {
                                    setTranslationOrientation('flap_right', _g.bodyModel.model.getNode('flap_right'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                    setTranslationOrientation('elevator_front_right', _g.bodyModel.model.getNode('elevator_front_right'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                }//else
                            }//else if

                            else if(c.spec.type == "aileron") {
                                if(c.spec.posOffset < 0) {
                                    setTranslationOrientation('aileron_left', _g.bodyModel.model.getNode('aileron_left'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                }//if
                                else {
                                    setTranslationOrientation('aileron_right', _g.bodyModel.model.getNode('aileron_right'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                }//else

                                if(c.spec.dirOffset < 0) {
                                    if(c.spec.posOffset < 0) {
                                        setTranslationOrientation('aileron_front_left', _g.bodyModel.model.getNode('aileron_front_left'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                    }//if
                                    else {
                                        setTranslationOrientation('aileron_front_right', _g.bodyModel.model.getNode('aileron_front_right'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                    }//else
                                }//if
                                else {
                                    if(c.spec.posOffset < 0) {
                                        setTranslationOrientation('aileron_back_left', _g.bodyModel.model.getNode('aileron_back_left'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                    }//if
                                    else {
                                        setTranslationOrientation('aileron_back_right', _g.bodyModel.model.getNode('aileron_back_right'), 0, wheelTilt, 0, 0,0,c.altitudeOffset, scale);
                                    }//else
                                }//else
                            }//else if

                            else {
                                // Deal with the lights
                                // brake | brake_
                                if(c.spec.specialBehaviour == "brake") {
                                    setTranslationOrientation('brake', _g.bodyModel.model.getNode('brake'), 0, 0, 0, 0,0,0, scale);

                                    if(c.spec.posOffset < 0) {
                                        setTranslationOrientation('brake_left', _g.bodyModel.model.getNode('brake_left'), 0, 0, 0, 0,0,0, scale);
                                    }//if
                                    else {
                                        setTranslationOrientation('brake_right', _g.bodyModel.model.getNode('brake_right'), 0, 0, 0, 0,0,0, scale);
                                    }//else
                                }//if
                                else if(c.spec.specialBehaviour == "reverse") {
                                    setTranslationOrientation('reverse', _g.bodyModel.model.getNode('reverse'), 0, 0, 0, 0,0,0, scale);

                                    if(c.spec.posOffset < 0) {
                                        setTranslationOrientation('reverse_left', _g.bodyModel.model.getNode('reverse_left'), 0, 0, 0, 0,0,0, scale);
                                    }//if
                                    else {
                                        setTranslationOrientation('reverse_right', _g.bodyModel.model.getNode('reverse_right'), 0, 0, 0, 0,0,0, scale);
                                    }//else
                                }//else if
                                else if(c.spec.specialBehaviour == "turnsignal") {
                                }//else if
                                else if(c.spec.specialBehaviour == "blink") {

                                    if(c.spec.posOffset < 0) {
                                        setTranslationOrientation('red', _g.bodyModel.model.getNode('red'), 0, 0, 0, 0,0,0, scale);
                                    }//if
                                    else if(c.spec.posOffset > 0) {
                                        setTranslationOrientation('green', _g.bodyModel.model.getNode('green'), 0, 0, 0, 0,0,0, scale);
                                    }//else if
                                    else {
                                        setTranslationOrientation('white', _g.bodyModel.model.getNode('white'), 0, 0, 0, 0,0,0, scale);
                                    }//else
                                }//else if
                            }//else
                        };

                        if(c.spec.rotation == 0) {
                            updateModel(c, c.spec.posOffset ? c.spec.posOffset : 0, c.spec.dirOffset ? c.spec.dirOffset : 0, c.spec.upOffset ? c.spec.upOffset : 0);
                        }//if
                        else {
                            updateModel(c, c.spec.posOffset ? c.spec.posOffset : 0, c.spec.dirOffset ? c.spec.dirOffset : 0, c.spec.upOffset ? c.spec.upOffset : 0);
                        }//else
                    }//else
                } catch(err) {
                    //log("info", err);
                }
            }//for
            //}//if
        }//if

        //this.walkingIndex = (this.walkingIndex+1)%this.walkingAnimation.length;
        //log("info", "updateVehicleComponents end");
    };

    this.updateVehicle = function (deltaTime, other) {
    	//log("info", "updateVehicle start");

        //deltaTime = 0.027;

        var _g = this;

        var lastTerrainRoll = this.terrainRoll;
        var lastTerrainTilt = this.terrainTilt;

        var frontHeight;
        var locationFront = this.vehiclePosition.createOffset(this.getVehicleHeading(), this.vehicleData.axisdistance);
        frontHeight = this.getAltitude(locationFront, "locationFront");
        var backHeight;
        var locationBack = this.vehiclePosition.createOffset(this.getVehicleHeading(), -this.vehicleData.axisdistance);
        backHeight = this.getAltitude(locationBack, "locationBack");

        if(!frontHeight || !backHeight) return;

        this.terrainTilt = -Math.atan((frontHeight - backHeight) / (this.vehicleData.axisdistance*2));

        var leftHeight;
        var locationLeft = this.vehiclePosition.createOffset(this.getVehicleHeading() - 1.570796326794897, this.vehicleData.wheelsdistance/2);
        leftHeight = this.getAltitude(locationLeft, "locationLeft");
        var rightHeight;
        var locationRight = this.vehiclePosition.createOffset(this.getVehicleHeading() + 1.570796326794897, this.vehicleData.wheelsdistance/2);
        rightHeight = this.getAltitude(locationRight, "locationRight");

        if(!leftHeight || !rightHeight) return;

        this.terrainRoll = Math.atan((rightHeight - leftHeight) / this.vehicleData.wheelsdistance);

        var leftWingHeight;
        var locationLeftWing = this.vehiclePosition.createOffset(this.getVehicleHeading() - 1.570796326794897, this.vehicleData.bodyWidth*2);
        leftWingHeight = this.getAltitude(locationLeftWing, "locationLeftWing");
        var rightWingHeight;
        var locationRightWing = this.vehiclePosition.createOffset(this.getVehicleHeading() + 1.570796326794897, this.vehicleData.bodyWidth*2);
        rightWingHeight = this.getAltitude(locationRightWing, "locationRightWing");

        if(!leftWingHeight || !rightWingHeight) return;

        var rollImpulse = (
                (
                    this.vehicle.getSteeringAngle()*
                    Math3D.MyMath.linearMap(this.vehicle.speed, 0, vehicle.Box2DUtils.toMps(this.vehicleData.maxspeed), 0, 10)*
                    deltaTime*
                    this.vehicleData.steerroll
                )*
                (this.vehicleData.rollSpring*-this.terrainRoll+this.vehicleData.rollDamper)
            )
            *Math3D.MyMath.linearMap(this.vehicle.getSquealLevel(), 0, 1, 0, 0.3)*deltaTime;

        var speedForward = box2D.common.math.B2Math.dot(this.vehicle.body.getLinearVelocity(), vehicle.Box2DUtils.getFrontVector(this.vehicle.body));

        if(!this.isSpawning) this.applyHorizontalForces(rollImpulse, speedForward, lastTerrainRoll, deltaTime, other);

        var lat = this.vehiclePosition.lat();
        var lng = this.vehiclePosition.lng();
        var location = this.vehiclePosition;

        //var gAlt = this.getAltitude(location, "vehiclePosition);
        var gAlt = 0;
        if(this.vehicle.wheelie && this.vehicle.tiltOffset > 190) {
            gAlt = (backHeight)+Math3D.MyMath.linearMap(this.vehicle.tiltOffset, 180, 270, 0, 20)*deltaTime;
        }//if
        else if(this.vehicle.wheelie && this.vehicle.tiltOffset < 170) {
            gAlt = (frontHeight)+Math3D.MyMath.linearMap(360-this.vehicle.tiltOffset, 180, 270, 0, 20)*deltaTime;
        }//else if
        else {
            gAlt = (frontHeight+backHeight+leftHeight+rightHeight) / 4;
        }//if

        locationBack = null;
        locationFront = null;
        locationLeft = null;
        locationRight = null;

        var newAlt = gAlt + this.vehicleData.upOffset;
        var alt = 0;

        if(this.vehicleData.minGroundAlt > newAlt) {
            this.vehicleData.minGroundAlt = newAlt;
        }//if

        if(!this.isSpawning) this.applyVerticalForces(speedForward, newAlt, rightWingHeight, leftWingHeight, deltaTime, other);

        if (this.isSpawning) {
        } else {
            //this.overlay.setVisibility(false);
            if(this.vehicleData.category != "plane" && !this.vehicle.konamiCodeFly) {
                this.vehicleTilt.targetPosition = this.terrainTilt;
                this.vehicleTilt.update(deltaTime);
            }//if

            if(this.vehicleData.mainCategory == "ground" && !this.vehicle.airborne && this.vehicleData.category != "bike" && !this.vehicle.konamiCodeFly) {
                var angularVelocityIncrement = (this.vehicle.getSteeringAngle()*speedForward*Math.abs(this.vehicleRoll.velocity)*0.25)*Math.PI/180;

                if(!isNaN(angularVelocityIncrement)) this.vehicle.body.m_angularVelocity+=angularVelocityIncrement;
            }//if

            this.vehicleRoll.targetPosition = this.terrainRoll;

            this.vehicleRoll.update(deltaTime)
        }//else

        this.vehicleAltitude.update(deltaTime);

        alt = this.vehicleAltitude.position;

        if (this.vehicleAltitude.position < newAlt) {
            alt = newAlt;
        }//if

        var heading = this.applyTurningForces(speedForward, deltaTime, other);

        var tilt = this.vehicleTilt.position;
        var roll = this.vehicleRoll.position;

        if(!this.isSpawning) this.applyVehicleAttitude(tilt, roll);

        this.vehicleAltitude.position = alt;

        this.bodyModel.setLocation(lat, lng, alt, heading, tilt, roll);

        //log("info", lat+", "+lng+", "+alt+", "+heading+", "+tilt+", "+roll);

        var deltaWheelAngle = this.vehicle.getSpeedKmh() * .2777777777777778 * deltaTime / this.vehicleSpec.wheelRadius;
        if (this.vehicle.getGear() == -1) deltaWheelAngle = -deltaWheelAngle;
        deltaWheelAngle = Math3D.MyMath.clamp(deltaWheelAngle, -.34906585039886595, .34906585039886595);
        this.wheelAngle += deltaWheelAngle;
        var qVehicle = Math3D.geometry.Quaternion.euler(heading, tilt, roll);

        window.lat = this.vehiclePosition.lat();
        window.lon = this.vehiclePosition.lng();
        window.heading = heading;
        window.tilt = tilt;
        window.roll = roll;

        if(!this.isSpawning) this.updateVehicleComponents(_g, qVehicle, speedForward, deltaTime, other);

        //log("info", "updateVehicle end");
    };

    this.updateCamera = function (deltaTime) {
        var target = this;

        var easingFactor = 1 - Math.exp(-6 * deltaTime);
        var headingDist = Math3D.Angle.wrap(target.getVehicleHeading());

        target.cameraHeadingBase += Math3D.Angle.wrap(headingDist - target.cameraHeadingBase) * easingFactor;
        target.cameraHeadingBase = Math3D.Angle.wrap(target.cameraHeadingBase);

        var viewY = target.getViewY();
        var viewX = target.getViewX();
        var lookBehind = viewY < -.5;

        target.viewPointIndex = target.viewPointIndex%target.viewPoints.length;

        var viewPoint = target.viewPoints[target.viewPointIndex];
        var trailDistanceOffset = 0;
        var lookHeading = 0;
        var lookTilt = 0;
        if (viewY > 0) lookTilt = .4363323129985825 * viewY;

        lookHeading = .872664625997165 * viewX + (viewPoint.heading ? viewPoint.heading*Math.PI/180 : 0);

        var cameraTiltBase = -target.vehicleTilt.position;
        var cameraRollBase = viewPoint.type == "normal" && target.vehicleData.type != "plane" ? target.vehicleRoll.position*deltaTime : target.vehicleRoll.position;

        if (lookBehind) {
            lookHeading = 3.141592653589794;
            cameraTiltBase = -cameraTiltBase;
            cameraRollBase = -cameraRollBase
        }

        cameraTiltBase = viewPoint.tilt * .0174532925199433 + cameraTiltBase + lookTilt;
        var lat;
        var lng;
        var alt;
        var cameraAlt;
        var cameraTilt;
        var cameraRoll;
        var cameraOffset;
        var cameraAltitude;

        var _g = target.viewPointIndex;

        switch (viewPoint.type) {
            case "fps":
                target.cameraHeading = target.getVehicleHeading(); //Math3D.Angle.wrap(target.getVehicleHeading()) + lookHeading;
                cameraTilt = cameraTiltBase; //-target.vehicleTilt.position;
                cameraRoll = cameraRollBase; //-target.vehicleRoll.position;

                var camera;
                if (!lookBehind) {
                    camera = target.vehiclePosition.createOffset(target.cameraHeading + viewPoint.dir, -(viewPoint.offset+trailDistanceOffset));
                    target.cameraHeading += viewPoint.dir;
                    cameraOffset = viewPoint.offset+trailDistanceOffset;
                }//if
                else {
                    camera = target.vehiclePosition.createOffset(target.cameraHeading + viewX * .3 + viewPoint.dir, -(viewPoint.offset+trailDistanceOffset));
                    target.cameraHeading += viewX * .3 + viewPoint.dir;
                    cameraOffset = viewPoint.offset+trailDistanceOffset;

                    cameraTilt -= .17453292519943298
                }//else

                lat = camera.lat();
                lng = camera.lng();

                var cAlt = function ($this) {
                    var $r;
                    var location = new LatLng(lat, lng);
                    $r = $this.getAltitude(location, "camera");
                    return $r
                }(this);

                if(!cAlt) return;

                cameraAlt = target.vehicleAltitude.position + viewPoint.altitude;
                alt = target.vehicleAltitude.position + viewPoint.altitude - cAlt;
                break;
            case "fixed":
                target.cameraHeading = target.cameraHeadingBase;
                cameraTilt = cameraTiltBase;
                cameraRoll = 0;//cameraRollBase;
                cameraOffset = viewPoint.offset+trailDistanceOffset;
                var camera = target.vehiclePosition.createOffset(target.cameraHeading, viewPoint.offset+trailDistanceOffset);
                lat = camera.lat();
                lng = camera.lng();

                var cAlt = function ($this) {
                    var $r;
                    var location = new LatLng(lat, lng);
                    $r = $this.getAltitude(location, "camera");
                    return $r
                }(this);

                if(!cAlt) return;

                cameraAlt = target.vehicleAltitude.position + viewPoint.altitude;
                alt = target.vehicleAltitude.position + viewPoint.altitude - cAlt;
                break;
            case "top_panoramic":
                target.cameraHeading = 0;
                cameraTilt = viewPoint.tilt * .0174532925199433;
                cameraRoll = 0;
                var n;
                var value = target.vehicle.getSpeedKmh();
                n = value * value;
                viewPoint.altitude = Math3D.MyMath.linearMap(n, 0, 1e4, 20, 30);
                viewPoint.offset = Math3D.MyMath.linearMap(n, 0, 1e4, -20, -30);
                var base = target.vehiclePosition.createOffset(target.cameraHeading, viewPoint.offset+trailDistanceOffset);
                var n1;
                var value = target.vehicle.getSpeedKmh();
                n1 = value * value;
                var offset = Math3D.MyMath.linearMap(n1, 0, 1e4, 2, 10);
                var p = base.createOffset(target.getVehicleHeading(), offset);
                lat = p.lat();
                lng = p.lng();
                cameraOffset = viewPoint.offset+trailDistanceOffset;

                var cAlt = function ($this) {
                    var $r;
                    var location = new LatLng(lat, lng);
                    $r = $this.getAltitude(location, "camera");
                    return $r
                }(this);

                if(!cAlt) return;

                cameraAlt = target.vehicleAltitude.position + viewPoint.altitude;
                alt = target.vehicleAltitude.position + viewPoint.altitude - cAlt;
                break;
            case "top":
                target.cameraHeading = target.cameraHeadingBase;
                cameraTilt = viewPoint.tilt * .0174532925199433;
                cameraRoll = 0;
                var n;
                var value = target.vehicle.getSpeedKmh();
                n = value * value;
                viewPoint.altitude = Math3D.MyMath.linearMap(n, 0, 1e4, 50, 60);
                var camera = target.vehiclePosition.createOffset(target.cameraHeading, -(viewPoint.offset+trailDistanceOffset));
                lat = camera.lat();
                lng = camera.lng();
                cameraOffset = viewPoint.offset+trailDistanceOffset;

                var cAlt = function ($this) {
                    var $r;
                    var location = new LatLng(lat, lng);
                    $r = $this.getAltitude(location, "camera");
                    return $r
                }(this);

                if(!cAlt) return;

                cameraAlt = target.vehicleAltitude.position + viewPoint.altitude;
                alt = target.vehicleAltitude.position + viewPoint.altitude - cAlt;
                break;
            default:
                target.cameraHeading = target.cameraHeadingBase + lookHeading;

                if(this.vehicleData.category == "helicopter" && this.vehicle.airborne) {
                    cameraTilt = Math3D.MyMath.clamp(cameraTiltBase, 1.3, 6.2);
                }//if
                else {
                    cameraTilt = cameraTiltBase;
                }//else
                cameraRoll = cameraRollBase;

                trailDistanceOffset = trailDistanceOffset-Math.min(target.vehicle.speed*deltaTime, Math.abs(viewPoint.offset)*0.25);

                var v = new Math3D.geometry.Vector3(viewPoint.dir, viewPoint.offset+trailDistanceOffset, 0);
                v.rotateZ(target.getVehicleHeading() - target.cameraHeading);
                var camera = target.getLatLngAlt(v.x, v.y, viewPoint.altitude);
                lat = camera.lat();
                lng = camera.lng();
                cameraOffset = viewPoint.offset+trailDistanceOffset;

                target.cameraHeading += viewPoint.dir;

                var cAlt = function ($this) {
                    var $r;
                    var location = new LatLng(lat, lng);
                    $r = $this.getAltitude(location, "camera");
                    return $r
                }(this);

                if(!cAlt) return;

                cameraAlt = camera.altitude();
                alt = camera.altitude() - cAlt;
        }
        var threshold = 1e-9;

		if(isNaN(lng) || isNaN(lat) || isNaN(cameraAlt)) return;

        if(this.bodyModel.loaded && this.bodyModel.initialModelMatrix) {
        	var position = Cesium.Cartesian3.fromDegrees(lng, lat, cameraAlt, this.ellipsoid, new Cesium.Cartesian3());

            var transform = Cesium.Transforms.eastNorthUpToFixedFrame(position);
            this.camera.transform = transform;

            var yDir = Cesium.Matrix4.multiplyByPointAsVector(this.bodyModel.modelMatrix, Cesium.Cartesian3.UNIT_Y, new Cesium.Cartesian3());
            Cesium.Matrix4.multiplyByPointAsVector(this.camera.inverseTransform, yDir, yDir);
            Cesium.Cartesian3.negate(yDir, yDir);

            Cesium.Cartesian3.normalize(yDir, yDir); // yDir's magnitude might not be exactly 1 after the rotation
            //var yDir = Cesium.Cartesian3.multiplyByScalar(yDir, 10, new Cesium.Cartesian3());
            
            if(!this.camera.tilt) this.camera.tilt = 0;
            
            this.camera.lookAt(
               position,
               new Cesium.HeadingPitchRange(target.cameraHeading, -(((Math.PI/2)-cameraTilt) - this.camera.tilt), 10)
            );
            
            var transform = this.camera.transform;
            this.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
            this.camera.heading = target.cameraHeading;

            var angle = ((Math.PI/2)-cameraTilt) - this.camera.tilt;
            //this.camera.look(this.camera.right, angle);

            this.camera.lookAtTransform(transform);

            this.camera.twistLeft(cameraRoll);
        }//if
    };

    this.updateSpeedMeter = function (speedKmh, speedMph) {
        try {
            if(this.speedOverlay) {
                if(window.unit.toLowerCase() == "km") this.speedOverlay.setValue(parseInt(speedKmh));
                else this.speedOverlay.setValue(parseInt(speedMph));
            }//if
        } catch (err) {
            log("error", "updateSpeedMeter", err);
        };

        return;

        /*
         var gVector = this.vehicle.getGVector();
         var f = -6.530612244897958;
         this.gravityMarker.setPosition(664 - gVector.x * f, 258 - gVector.y * f, 0, 0)
         */
    };

    this.updateAltitudeMeter = function (altitude) {
        try {
            if(this.altitudeOverlay) {
                if(window.unit == "km") this.altitudeOverlay.setValue(parseInt(altitude));
                else this.altitudeOverlay.setValue(parseInt(altitude*3.28084));
            }//if
        } catch (err) {
            log("error", "updateAltitudeMeter", err);
        };

        return;
    };

    this.updateRPMMeter = function (rpm) {
        try {
            if(this.gearOverlay) {
                this.gearOverlay.setValue(this.vehicle.gearBox.gear);
            }//if

            if(this.rpmOverlay) {
                this.rpmOverlay.setValue(rpm);
            }//if
        } catch (err) {
            log("error", "updateRPMMeter", err);
        };

        return;
    };

    this.updateCompass = function(heading) {
        try {
            if(this.compassOverlay) {
                this.compassOverlay.setRotation(heading);
            }//if
        } catch (err) {
            log("error", "updateCompass", err);
        };

        return;
    };

    this.updateAttitude = function(tilt, roll) {
        try {
            if(this.attitudeOverlay) {
                this.attitudeOverlay.setAttitude(tilt, roll);
            }//if
        } catch (err) {
            log("error", "updateAttitude", err);
        };

        return;
    };

    this.getLatLngAlt = function (x, y, z) {
        var p = new Math3D.geometry.Vector3(x, y, z);
        var m = new Math3D.geometry.Matrix3x3;
        m.setRotationY(-this.vehicleRoll.position);
        p.multiply(m);
        m.setRotationX(-this.vehicleTilt.position);
        p.multiply(m);
        var angle = -Math.atan2(p.y, p.x) + 1.570796326794897;
        var length = Math3D.MyMath.lengthVector(p.x, p.y);
        var latLng = this.vehiclePosition.createOffset(this.getVehicleHeading() + angle, length);
        var alt = 0;

        alt = this.vehicleAltitude.position + p.z;

        return new LatLngAlt(latLng.lat(), latLng.lng(), alt);

        /*var p = new Math3D.geometry.Vector3(x, y, z);
        var m = new Math3D.geometry.Matrix3x3;
        m.setRotationY(-this.vehicleRoll.position);
        p.multiply(m);
        m.setRotationX(-this.vehicleTilt.position);
        p.multiply(m);
        var angle = -Math.atan2(p.y, p.x) + 1.570796326794897;
        var length = Math3D.MyMath.lengthVector(p.x, p.y);
        var latLng = this.vehiclePosition.createOffset(this.getVehicleHeading() + angle, length);
        var alt;
        alt = function ($this) {
            var $r;
            var location = $this.vehiclePosition;
            $r = $this.getAltitude(location);
            return $r
        }(this) + p.z;
        return new LatLngAlt(latLng.lat(), latLng.lng(), alt);*/
    };

    this.getVehicleHeading = function () {
        return this.vehicle.getHeading()
    };

    this.setActive = function (active) {
        this.active = active;
    }
};

cesiumExplorer.tasksQueue = [];

cesiumExplorer.processQueue = function() {
    if(cesiumExplorer.tasksQueue.length > 0) {
        var task = cesiumExplorer.tasksQueue.splice(0, 1)[0];

        if(task && typeof task.work == "function") task.work();
    }//if
};

//-------
// convert calendar to Julian date
// (Julian day number algorithm adopted from Press et al.)
//-------
function cal_to_jd( era, y, m, d, h, mn, s )
{
	var jy, ja, jm;			//scratch

	if( y == 0 ) {
		alert("There is no year 0 in the Julian system!");
        return "invalid";
    }
    if( y == 1582 && m == 10 && d > 4 && d < 15 ) {
		alert("The dates 5 through 14 October, 1582, do not exist in the Gregorian system!");
        return "invalid";
    }

//	if( y < 0 )  ++y;
    if( era == "BCE" ) y = -y + 1;
	if( m > 2 ) {
		jy = y;
		jm = m + 1;
	} else {
		jy = y - 1;
		jm = m + 13;
	}

	var intgr = Math.floor( Math.floor(365.25*jy) + Math.floor(30.6001*jm) + d + 1720995 );

	//check for switch to Gregorian calendar
    var gregcal = 15 + 31*( 10 + 12*1582 );
	if( d + 31*(m + 12*y) >= gregcal ) {
		ja = Math.floor(0.01*jy);
		intgr += 2 - ja + Math.floor(0.25*ja);
	}

	//correct for half-day offset
	var dayfrac = h/24.0 - 0.5;
	if( dayfrac < 0.0 ) {
		dayfrac += 1.0;
		--intgr;
	}

	//now set the fraction of a day
	var frac = dayfrac + (mn + s/60.0)/60.0/24.0;

    //round to nearest second
    var jd0 = (intgr + frac)*100000;
    var jd  = Math.floor(jd0);
    if( jd0 - jd > 0.5 ) ++jd;
    return jd/100000;
}

cesiumExplorer.main = function (v) {
    cesiumExplorer.baseURL = "http://"+window.location.host+"/";
    cesiumExplorer.modelsURL = cesiumExplorer.baseURL + "models/";
    cesiumExplorer.imagesURL = cesiumExplorer.baseURL + "images/";

    cesiumExplorer.physics = new DrivingSimulator;
    cesiumExplorer.physics.world = window.world;
    cesiumExplorer.physics.username = window.userId;
    cesiumExplorer.physics.keybindings = window.keybindings;

    Cesium.BingMapsApi.defaultKey = "AtLFxgtc7NXG2TSUOUyscnuEK24fNrFlr708iSjcQ_IQBWrxQ1_F6Gp6MdZMjnq-";

	var now = new Date();
	var jd = cal_to_jd("CE", now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()) + "";
	
	var currentTime = new Cesium.JulianDate(jd.split('.')[0], jd.split('.')[1]);
	
    cesiumExplorer.physics.viewer = new Cesium.Viewer('map3d', {
        homeButton: false,
        baseLayerPicker: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        navigationInstructionsInitiallyVisible: false,
        geocoder: false,
        animation: false,
        scene3DOnly: true,
	clock : new Cesium.Clock({ currentTime : currentTime }),
        imageryProvider: new Cesium.BingMapsImageryProvider({
            url : '//dev.virtualearth.net',
            key : Cesium.BingMapsApi.defaultKey,
            mapStyle : Cesium.BingMapsStyle.AERIAL,
            hasAlphaChannel : false,
            defaultAlpha : 1.0
        })
        /*contextOptions: {
            webgl : {
                alpha : false, depth : true, stencil : false, antialias : true, premultipliedAlpha : true, preserveDrawingBuffer : true, failIfMajorPerformanceCaveat : true
            },
            allowTextureFilterAnisotropic : true
        }*/
    });

    cesiumExplorer.physics.viewer.scene.globe.enableLighting = true;
    cesiumExplorer.physics.scene = cesiumExplorer.physics.viewer.scene;
    cesiumExplorer.physics.scene.moon=undefined;
    //cesiumExplorer.physics.scene.sun=undefined;

    cesiumExplorer.physics.viewer.scene.globe.depthTestAgainstTerrain = true;

    // Tweek performance
    cesiumExplorer.physics.scene.globe.maximumScreenSpaceError=5; // higher values better performance, less quality
    //cesiumExplorer.physics.viewer.resolutionScale=1; // lower values increases performance but loses quality
    //cesiumExplorer.physics.scene.globe.tileCacheSize=500; // higher values bigger cache

    var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
            url : '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
            //url : '//cesiumjs.org/smallterrain' // contains watermask
        //,   requestVertexNormals : true
    });
    /*var cesiumTerrainProviderMeshes = new Cesium.VRTheWorldTerrainProvider({
        url : '//www.vr-theworld.com/vr-theworld/tiles1.0.0/73/'
    });*/

    cesiumExplorer.physics.scene.terrainProvider = cesiumTerrainProviderMeshes;

    var canvas = cesiumExplorer.physics.scene.canvas;
    canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
    canvas.onclick = function() {
        canvas.focus();
    };
    cesiumExplorer.physics.ellipsoid = cesiumExplorer.physics.scene.globe.ellipsoid;
    cesiumExplorer.physics.camera = cesiumExplorer.physics.scene.camera;
    cesiumExplorer.physics.camera.constrainedAxis = undefined;

    cesiumExplorer.physics.init(v);

    window.full.init();

    var processQueue = $bind(cesiumExplorer, cesiumExplorer.processQueue);

    // Listen for physics updates
    cesiumExplorer.physics.ee.addListener('postUpdate', processQueue);
};
cesiumExplorer.screenshot = function () {
    var imageData = cesiumExplorer.physics.viewer.scene._canvas.toDataURL();

    // Send to server
};
// TODO: Keep capturing screenshots at a constant rate and send them to the server, and then construct the video on the server
cesiumExplorer.captureVideo = function () {
    var imageData = cesiumExplorer.physics.viewer.scene._canvas.toDataURL();

    // Send to server
};
cesiumExplorer.goto = window.cesiumExplorer.goto = function (lat, lng, altOffset, speed, heading) {
    var alt = altOffset;
    var cAlt = cesiumExplorer.physics.getAltitude(new LatLng(lat, lng), "goto") + (alt ? alt : 0);

    if(!cAlt) cAlt = 0;

    alt = cAlt;

    cesiumExplorer.physics.teleported = true;
    cesiumExplorer.physics.bodyModel.initialModelMatrix = false;

    cesiumExplorer.physics.vehicle.body.setLinearVelocity(new box2D.common.math.B2Vec2(0, 0));
    cesiumExplorer.physics.vehicleData.minGroundAlt = alt;
    cesiumExplorer.physics.vehicle.tiltOffset = 180;
    cesiumExplorer.physics.vehicle.altitudeOffset = 0;

    cesiumExplorer.physics.vehiclePosition = new LatLng(parseFloat(lat), parseFloat(lng));
    cesiumExplorer.physics.vehicleAltitude = new vehicle.Suspension(parseFloat(alt), parseFloat(alt), cesiumExplorer.physics.vehicleData.suspensionMass, cesiumExplorer.physics.vehicleData.suspensionSpring, cesiumExplorer.physics.vehicleData.suspensionDamper);
    cesiumExplorer.physics.vehicleTilt = new vehicle.Suspension(0, 0, cesiumExplorer.physics.vehicleData.tiltMass, cesiumExplorer.physics.vehicleData.tiltSpring, cesiumExplorer.physics.vehicleData.tiltDamper);
    cesiumExplorer.physics.vehicleRoll = new vehicle.Suspension(0, 0, cesiumExplorer.physics.vehicleData.rollMass, cesiumExplorer.physics.vehicleData.rollSpring, cesiumExplorer.physics.vehicleData.rollDamper);

    // Now we must setup the new physics so it doesnt mess up with the new heading
    cesiumExplorer.physics.setupPhysics(heading*Math.PI/180);

    var gotoData = {
        alt: altOffset,
        speed: speed,
        lat: lat,
        lng: lng
    };

    var gotoListener = function() {
        var alt = this.alt, lat = this.lat, lng = this.lng, speed = this.speed, gotoData = this;

        //console.log("gotoListener", cesiumExplorer.physics.isSpawning);

        if(!cesiumExplorer.physics.isSpawning) {
            var cAlt = cesiumExplorer.physics.getAltitude(new LatLng(lat, lng), "goto") + (alt ? alt : 0);
            if(cAlt) alt = cAlt;

            cesiumExplorer.physics.ee.removeListener('postUpdate', gotoData.callback);

            cesiumExplorer.physics.vehicle.body.setLinearVelocity(new box2D.common.math.B2Vec2(0, 0));
            cesiumExplorer.physics.vehicleData.minGroundAlt = alt;
            cesiumExplorer.physics.vehicle.tiltOffset = 180;
            cesiumExplorer.physics.vehicle.altitudeOffset = 0;
            cesiumExplorer.physics.vehiclePosition = new LatLng(parseFloat(lat), parseFloat(lng));

            cesiumExplorer.physics.vehicleAltitude = new vehicle.Suspension(parseFloat(alt), parseFloat(alt), cesiumExplorer.physics.vehicleData.suspensionMass, cesiumExplorer.physics.vehicleData.suspensionSpring, cesiumExplorer.physics.vehicleData.suspensionDamper);

            cesiumExplorer.physics.vehicleTilt = new vehicle.Suspension(0, 0, cesiumExplorer.physics.vehicleData.tiltMass, cesiumExplorer.physics.vehicleData.tiltSpring, cesiumExplorer.physics.vehicleData.tiltDamper);
            cesiumExplorer.physics.vehicleRoll = new vehicle.Suspension(0, 0, cesiumExplorer.physics.vehicleData.rollMass, cesiumExplorer.physics.vehicleData.rollSpring, cesiumExplorer.physics.vehicleData.rollDamper);

            // Now we must setup the new physics so it doesnt mess up with the new heading
            cesiumExplorer.physics.setupPhysics(heading*Math.PI/180);

            if (cesiumExplorer.physics) {
                cesiumExplorer.physics.vehicleAltitude.targetPosition = cesiumExplorer.physics.vehicleAltitude.position = alt;
            }//if

            if (speed) {
                var frontVector = vehicle.Box2DUtils.getFrontVector(cesiumExplorer.physics.vehicle.body);
                frontVector.multiply(speed / 3.6);
                cesiumExplorer.physics.vehicle.body.m_linearVelocity.add(frontVector);
            }//if
        }//if
    };

    gotoData.callback = $bind(gotoData, gotoListener);

    cesiumExplorer.physics.ee.addListener('postUpdate', gotoData.callback);
};
cesiumExplorer.activate = window.cesiumExplorer.activate = function () {
    cesiumExplorer.physics.setActive(true)
};
cesiumExplorer.deactivate = window.cesiumExplorer.deactivate = function () {
    cesiumExplorer.physics.setActive(false)
};

var IMap = function () {};
var PolygonData = function () {};
PolygonData.createCarVertices = function (bodyLength, bodyWidth, type) {
    var vertices = false;

    if(type == "plane") {
        vertices = [
            [bodyWidth/5, -bodyLength/2],
            [bodyWidth/4, -bodyLength/3],
            [bodyWidth/4, -bodyLength/7],
            [bodyWidth, 0],
            [bodyWidth, bodyLength/7],
            [bodyWidth/4, bodyLength/7],
            [bodyWidth/4, bodyLength/2]
        ];
    }//if
    else {
        vertices = [
            [bodyWidth/2, -bodyLength/2],
            [bodyWidth/2, bodyLength/2]
        ];
    }//else

    var b2Vertices = [];
    var _g = 0;
    while (_g < vertices.length) {
        var vertex = vertices[_g];
        ++_g;
        b2Vertices.push(new box2D.common.math.B2Vec2(vertex[0], vertex[1]))
    }
    var i = vertices.length;
    while (--i >= 0) {
        var vertex = vertices[i];
        b2Vertices.push(new box2D.common.math.B2Vec2(-vertex[0], vertex[1]))
    }

    return b2Vertices
};
PolygonData.getCarVertices = function (bodyLength, bodyWidth, type) {
    return PolygonData.createCarVertices(bodyLength, bodyWidth, type);
};
var Reflect = function () {};
Reflect.isFunction = function (f) {
    return typeof f == "function" && !(f.__name__ || f.__ename__)
};
var Std = function () {};
Std.string = function (s) {
    return js.Boot.__string_rec(s, "")
};
Std.random = function (x) {
    if (x <= 0) return 0;
    else return Math.floor(Math.random() * x)
};
var StringTools = function () {};
StringTools.hex = function (n, digits) {
    var s = "";
    var hexChars = "0123456789ABCDEF";
    do {
        s = hexChars.charAt(n & 15) + s;
        n >>>= 4
    } while (n > 0);
    if (digits != null)
        while (s.length < digits) s = "0" + s;
    return s
};
var ViewPoint = function (type, altitude, offset, tilt, dir, heading) {
    this.type = type;
    this.altitude = altitude;
    this.offset = offset;
    this.dir = dir;
    this.tilt = tilt;
    this.heading = heading;
};
var haxe = {};
haxe.Timer = function () {};
haxe.Timer.stamp = function () {
    return Date.now() / 1e3
};
haxe.ds = {};
haxe.ds.StringMap = function () {
    this.h = {}
};
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
    set: function (key, value) {
        this.h["$" + key] = value
    },
    get: function (key) {
        return this.h["$" + key]
    },
    keys: function () {
        var a = [];
        for (var key in this.h) {
            if (this.h.hasOwnProperty(key)) a.push(key.substr(1))
        }
        return iter(a)
    }
};
var HxOverrides = function() { }
HxOverrides.__name__ = true;
HxOverrides.dateStr = function(date) {
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mi = date.getMinutes();
    var s = date.getSeconds();
    return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
    switch(s.length) {
        case 8:
            var k = s.split(":");
            var d = new Date();
            d.setTime(0);
            d.setUTCHours(k[0]);
            d.setUTCMinutes(k[1]);
            d.setUTCSeconds(k[2]);
            return d;
        case 10:
            var k = s.split("-");
            return new Date(k[0],k[1] - 1,k[2],0,0,0);
        case 19:
            var k = s.split(" ");
            var y = k[0].split("-");
            var t = k[1].split(":");
            return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
        default:
            throw "Invalid date format : " + s;
    }
}
HxOverrides.cca = function(s,index) {
    var x = s.charCodeAt(index);
    if(x != x) return undefined;
    return x;
}
HxOverrides.substr = function(s,pos,len) {
    if(pos != null && pos != 0 && len != null && len < 0) return "";
    if(len == null) len = s.length;
    if(pos < 0) {
        pos = s.length + pos;
        if(pos < 0) pos = 0;
    } else if(len < 0) len = s.length + len - pos;
    return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
    var i = 0;
    var l = a.length;
    while(i < l) {
        if(a[i] == obj) {
            a.splice(i,1);
            return true;
        }
        i++;
    }
    return false;
}
HxOverrides.iter = function(a) {
    return { cur : 0, arr : a, hasNext : function() {
        return this.cur < this.arr.length;
    }, next : function() {
        return this.arr[this.cur++];
    }};
}
var js = {};
js.Boot = function () {};
js.Boot.__string_rec = function (o, s) {
    if (o == null) return "null";
    if (s.length >= 5) return "<...>";
    var t = typeof o;
    if (t == "function" && (o.__name__ || o.__ename__)) t = "object";
    switch (t) {
        case "object":
            if (o instanceof Array) {
                if (o.__enum__) {
                    if (o.length == 2) return o[0];
                    var str = o[0] + "(";
                    s += "	";
                    var _g1 = 2;
                    var _g = o.length;
                    while (_g1 < _g) {
                        var i = _g1++;
                        if (i != 2) str += "," + js.Boot.__string_rec(o[i], s);
                        else str += js.Boot.__string_rec(o[i], s)
                    }
                    return str + ")"
                }
                var l = o.length;
                var i;
                var str = "[";
                s += "	";
                var _g = 0;
                while (_g < l) {
                    var i1 = _g++;
                    str += (i1 > 0 ? "," : "") + js.Boot.__string_rec(o[i1], s)
                }
                str += "]";
                return str
            }
            var tostr;
            //try {
            tostr = o.toString
            /*} catch (e) {
             return "???"
             }*/
            if (tostr != null && tostr != Object.toString) {
                var s2 = o.toString();
                if (s2 != "[object Object]") return s2
            }
            var k = null;
            var str = "{\n";
            s += "	";
            var hasp = o.hasOwnProperty != null;
            for (var k in o) {
                if (hasp && !o.hasOwnProperty(k)) {
                    continue
                }
                if (k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
                    continue
                }
                if (str.length != 2) str += ", \n";
                str += s + k + " : " + js.Boot.__string_rec(o[k], s)
            }
            s = s.substring(1);
            str += "\n" + s + "}";
            return str;
        case "function":
            return "<function>";
        case "string":
            return o;
        default:
            return String(o)
    }
};
js.Boot.__interfLoop = function (cc, cl) {
    if (cc == null) return false;
    if (cc == cl) return true;
    var intf = cc.__interfaces__;
    if (intf != null) {
        var _g1 = 0;
        var _g = intf.length;
        while (_g1 < _g) {
            var i = _g1++;
            var i1 = intf[i];
            if (i1 == cl || js.Boot.__interfLoop(i1, cl)) return true
        }
    }
    return js.Boot.__interfLoop(cc.__super__, cl)
};
js.Boot.__instanceof = function (o, cl) {
    if (cl == null) return false;
    switch (cl) {
        case Int:
            return (o | 0) === o;
        case Float:
            return typeof o == "number";
        case Bool:
            return typeof o == "boolean";
        case String:
            return typeof o == "string";
        case Dynamic:
            return true;
        default:
            if (o != null) {
                if (typeof cl == "function") {
                    if (o instanceof cl) {
                        if (cl == Array) return o.__enum__ == null;
                        return true
                    }
                    if (js.Boot.__interfLoop(o.__class__, cl)) return true
                }
            } else return false; if (cl == Class && o.__name__ != null) return true;
            if (cl == Enum && o.__ename__ != null) return true;
            return o.__enum__ == cl
    }
};
js.Boot.__cast = function (o, t) {
    if (js.Boot.__instanceof(o, t)) return o;
    else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t)
};

var $_, $fid = 0;

function $bind(o, m) {
    if (m == null) return null;
    if (m.__id__ == null) m.__id__ = $fid++;
    var f;
    if (o.hx__closures__ == null) o.hx__closures__ = {};
    else f = o.hx__closures__[m.__id__]; if (f == null) {
        f = function () {
            return f.method.apply(f.scope, arguments)
        };
        f.scope = o;
        f.method = m;
        o.hx__closures__[m.__id__] = f
    }
    return f
}
if (Array.prototype.indexOf) remove = function (a, o) {
    var i = a.indexOf(o);
    if (i == -1) return false;
    a.splice(i, 1);
    return true
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function (i) {
    return isFinite(i)
};
Math.isNaN = function (i) {
    return isNaN(i)
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.prototype.__class__ = Array;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = {
    __name__: ["Int"]
};
var Dynamic = {
    __name__: ["Dynamic"]
};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = {
    __name__: ["Class"]
};
var Enum = {};
DrivingSimulator.DRIVERS_EYE_X = .35;
DrivingSimulator.DRIVERS_EYE_Y = 0;
DrivingSimulator.DRIVERS_EYE_Z = 1.2;
DrivingSimulator.STEERING_OFFSET_Y = .75;
DrivingSimulator.STEERING_OFFSET_Z = -.32;
DrivingSimulator.VIEWPOINT_DRIVER = 0;
DrivingSimulator.VIEWPOINT_RC = 3;
DrivingSimulator.VIEWPOINT_TOPDOWN = 4;
DrivingSimulator.GRAVITY_X = 616;
DrivingSimulator.GRAVITY_Y = 210;
DrivingSimulator.GRAVITY_MARKER_X = 664;
DrivingSimulator.GRAVITY_MARKER_Y = 258;
LatLng.EARTH_RADIUS = 6371e3;
box2D.collision.B2Collision.b2_nullFeature = 255;
box2D.collision.B2Collision.s_incidentEdge = box2D.collision.B2Collision.makeClipPointVector();
box2D.collision.B2Collision.s_clipPoints1 = box2D.collision.B2Collision.makeClipPointVector();
box2D.collision.B2Collision.s_clipPoints2 = box2D.collision.B2Collision.makeClipPointVector();
box2D.collision.B2Collision.s_edgeAO = new Array;
box2D.collision.B2Collision.s_edgeBO = new Array;
box2D.collision.B2Collision.s_localTangent = new box2D.common.math.B2Vec2;
box2D.collision.B2Collision.s_localNormal = new box2D.common.math.B2Vec2;
box2D.collision.B2Collision.s_planePoint = new box2D.common.math.B2Vec2;
box2D.collision.B2Collision.s_normal = new box2D.common.math.B2Vec2;
box2D.collision.B2Collision.s_tangent = new box2D.common.math.B2Vec2;
box2D.collision.B2Collision.s_tangent2 = new box2D.common.math.B2Vec2;
box2D.collision.B2Collision.s_v11 = new box2D.common.math.B2Vec2;
box2D.collision.B2Collision.s_v12 = new box2D.common.math.B2Vec2;
box2D.collision.B2Collision.b2CollidePolyTempVec = new box2D.common.math.B2Vec2;
box2D.collision.B2Distance.s_simplex = new box2D.collision.B2Simplex;
box2D.collision.B2Distance.s_saveA = new Array;
box2D.collision.B2Distance.s_saveB = new Array;
box2D.collision.B2DynamicTreeNode.currentID = 0;
box2D.collision.B2Manifold.e_circles = 1;
box2D.collision.B2Manifold.e_faceA = 2;
box2D.collision.B2Manifold.e_faceB = 4;
box2D.collision.B2SeparationFunction.e_points = 1;
box2D.collision.B2SeparationFunction.e_faceA = 2;
box2D.collision.B2SeparationFunction.e_faceB = 4;
box2D.collision.B2TimeOfImpact.b2_toiCalls = 0;
box2D.collision.B2TimeOfImpact.b2_toiIters = 0;
box2D.collision.B2TimeOfImpact.b2_toiMaxIters = 0;
box2D.collision.B2TimeOfImpact.b2_toiRootIters = 0;
box2D.collision.B2TimeOfImpact.b2_toiMaxRootIters = 0;
box2D.collision.B2TimeOfImpact.s_cache = new box2D.collision.B2SimplexCache;
box2D.collision.B2TimeOfImpact.s_distanceInput = new box2D.collision.B2DistanceInput;
box2D.collision.B2TimeOfImpact.s_xfA = new box2D.common.math.B2Transform;
box2D.collision.B2TimeOfImpact.s_xfB = new box2D.common.math.B2Transform;
box2D.collision.B2TimeOfImpact.s_fcn = new box2D.collision.B2SeparationFunction;
box2D.collision.B2TimeOfImpact.s_distanceOutput = new box2D.collision.B2DistanceOutput;
box2D.collision.shapes.B2Shape.e_unknownShape = -1;
box2D.collision.shapes.B2Shape.e_circleShape = 0;
box2D.collision.shapes.B2Shape.e_polygonShape = 1;
box2D.collision.shapes.B2Shape.e_edgeShape = 2;
box2D.collision.shapes.B2Shape.e_shapeTypeCount = 3;
box2D.collision.shapes.B2Shape.e_hitCollide = 1;
box2D.collision.shapes.B2Shape.e_missCollide = 0;
box2D.collision.shapes.B2Shape.e_startsInsideCollide = -1;
box2D.collision.shapes.B2PolygonShape.s_mat = new box2D.common.math.B2Mat22;
box2D.common.B2Settings.VERSION = "2.1alpha";
box2D.common.B2Settings.USHRT_MAX = 65535;
box2D.common.B2Settings.b2_pi = Math.PI;
box2D.common.B2Settings.b2_maxManifoldPoints = 2;
box2D.common.B2Settings.b2_aabbExtension = .1;
box2D.common.B2Settings.b2_aabbMultiplier = 2;
box2D.common.B2Settings.b2_polygonRadius = 2 * box2D.common.B2Settings.b2_linearSlop;
box2D.common.B2Settings.b2_linearSlop = .005;
box2D.common.B2Settings.b2_angularSlop = .011111111111111112 * box2D.common.B2Settings.b2_pi;
box2D.common.B2Settings.b2_toiSlop = 8 * box2D.common.B2Settings.b2_linearSlop;
box2D.common.B2Settings.b2_maxTOIContactsPerIsland = 32;
box2D.common.B2Settings.b2_maxTOIJointsPerIsland = 32;
box2D.common.B2Settings.b2_velocityThreshold = 1;
box2D.common.B2Settings.b2_maxLinearCorrection = .2;
box2D.common.B2Settings.b2_maxAngularCorrection = .044444444444444446 * box2D.common.B2Settings.b2_pi;
//box2D.common.B2Settings.b2_maxTranslation = 6;
//box2D.common.B2Settings.b2_maxTranslation = 600;
box2D.common.B2Settings.b2_maxTranslation = 999999;
box2D.common.B2Settings.b2_maxTranslationSquared = box2D.common.B2Settings.b2_maxTranslation * box2D.common.B2Settings.b2_maxTranslation;
//box2D.common.B2Settings.b2_maxRotation = .5 * box2D.common.B2Settings.b2_pi;
box2D.common.B2Settings.b2_maxRotation = 5.5 * box2D.common.B2Settings.b2_pi;
box2D.common.B2Settings.b2_maxRotationSquared = box2D.common.B2Settings.b2_maxRotation * box2D.common.B2Settings.b2_maxRotation;
box2D.common.B2Settings.b2_contactBaumgarte = .2;
box2D.common.B2Settings.b2_timeToSleep = .5;
box2D.common.B2Settings.b2_linearSleepTolerance = .01;
box2D.common.B2Settings.b2_angularSleepTolerance = .011111111111111112 * box2D.common.B2Settings.b2_pi;
box2D.common.math.B2Math.b2Vec2_zero = new box2D.common.math.B2Vec2(0, 0);
box2D.common.math.B2Math.b2Mat22_identity = box2D.common.math.B2Mat22.fromVV(new box2D.common.math.B2Vec2(1, 0), new box2D.common.math.B2Vec2(0, 1));
box2D.common.math.B2Math.b2Transform_identity = new box2D.common.math.B2Transform(box2D.common.math.B2Math.b2Vec2_zero, box2D.common.math.B2Math.b2Mat22_identity);
box2D.common.math.B2Math.MIN_VALUE = 2.2250738585072014e-308;
box2D.common.math.B2Math.MAX_VALUE = 1.7976931348623157e308;
box2D.dynamics.B2Body.s_xf1 = new box2D.common.math.B2Transform;
box2D.dynamics.B2Body.e_islandFlag = 1;
box2D.dynamics.B2Body.e_awakeFlag = 2;
box2D.dynamics.B2Body.e_allowSleepFlag = 4;
box2D.dynamics.B2Body.e_bulletFlag = 8;
box2D.dynamics.B2Body.e_fixedRotationFlag = 16;
box2D.dynamics.B2Body.e_activeFlag = 32;
box2D.dynamics.B2Body.b2_staticBody = 0;
box2D.dynamics.B2Body.b2_kinematicBody = 1;
box2D.dynamics.B2Body.b2_dynamicBody = 2;
box2D.dynamics.B2ContactFilter.b2_defaultFilter = new box2D.dynamics.B2ContactFilter;
box2D.dynamics.B2ContactListener.b2_defaultListener = new box2D.dynamics.B2ContactListener;
box2D.dynamics.B2ContactManager.s_evalCP = new box2D.collision.B2ContactPoint;
box2D.dynamics.B2DebugDraw.e_shapeBit = 1;
box2D.dynamics.B2DebugDraw.e_jointBit = 2;
box2D.dynamics.B2DebugDraw.e_aabbBit = 4;
box2D.dynamics.B2DebugDraw.e_pairBit = 8;
box2D.dynamics.B2DebugDraw.e_centerOfMassBit = 16;
box2D.dynamics.B2DebugDraw.e_controllerBit = 32;
box2D.dynamics.B2Island.s_impulse = new box2D.dynamics.B2ContactImpulse;
box2D.dynamics.B2World.s_timestep2 = new box2D.dynamics.B2TimeStep;
box2D.dynamics.B2World.s_xf = new box2D.common.math.B2Transform;
box2D.dynamics.B2World.s_backupA = new box2D.common.math.B2Sweep;
box2D.dynamics.B2World.s_backupB = new box2D.common.math.B2Sweep;
box2D.dynamics.B2World.s_timestep = new box2D.dynamics.B2TimeStep;
box2D.dynamics.B2World.s_queue = new Array;
box2D.dynamics.B2World.s_jointColor = new box2D.common.B2Color(.5, .8, .8);
box2D.dynamics.B2World.e_newFixture = 1;
box2D.dynamics.B2World.e_locked = 2;
box2D.dynamics.contacts.B2Contact.e_sensorFlag = 1;
box2D.dynamics.contacts.B2Contact.e_continuousFlag = 2;
box2D.dynamics.contacts.B2Contact.e_islandFlag = 4;
box2D.dynamics.contacts.B2Contact.e_toiFlag = 8;
box2D.dynamics.contacts.B2Contact.e_touchingFlag = 16;
box2D.dynamics.contacts.B2Contact.e_enabledFlag = 32;
box2D.dynamics.contacts.B2Contact.e_filterFlag = 64;
box2D.dynamics.contacts.B2Contact.s_input = new box2D.collision.B2TOIInput;
box2D.dynamics.contacts.B2PositionSolverManifold.circlePointA = new box2D.common.math.B2Vec2;
box2D.dynamics.contacts.B2PositionSolverManifold.circlePointB = new box2D.common.math.B2Vec2;
box2D.dynamics.contacts.B2ContactSolver.s_worldManifold = new box2D.collision.B2WorldManifold;
box2D.dynamics.contacts.B2ContactSolver.s_psm = new box2D.dynamics.contacts.B2PositionSolverManifold;
box2D.dynamics.joints.B2Joint.e_unknownJoint = 0;
box2D.dynamics.joints.B2Joint.e_revoluteJoint = 1;
box2D.dynamics.joints.B2Joint.e_prismaticJoint = 2;
box2D.dynamics.joints.B2Joint.e_distanceJoint = 3;
box2D.dynamics.joints.B2Joint.e_pulleyJoint = 4;
box2D.dynamics.joints.B2Joint.e_mouseJoint = 5;
box2D.dynamics.joints.B2Joint.e_gearJoint = 6;
box2D.dynamics.joints.B2Joint.e_lineJoint = 7;
box2D.dynamics.joints.B2Joint.e_weldJoint = 8;
box2D.dynamics.joints.B2Joint.e_frictionJoint = 9;
box2D.dynamics.joints.B2Joint.e_inactiveLimit = 0;
box2D.dynamics.joints.B2Joint.e_atLowerLimit = 1;
box2D.dynamics.joints.B2Joint.e_atUpperLimit = 2;
box2D.dynamics.joints.B2Joint.e_equalLimits = 3;
box2D.dynamics.joints.B2PulleyJoint.b2_minPulleyLength = 2;
box2D.dynamics.joints.B2RevoluteJoint.tImpulse = new box2D.common.math.B2Vec2;
Math3D.Angle.PI2 = 6.283185307179586;
vehicle.GearBox.DRIVE = 1;
vehicle.GearBox.REVERSE = -1;
vehicle.Vehicle.GEAR_CHANGE_TARGET = .4;
vehicle.Vehicle.ROLLING_DRAG_FORCE = 25;
vehicle.Vehicle.BUMP_DRAG_FACTOR = 1e3;
