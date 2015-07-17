Math3D = {};
Math3D.Angle = function () {};
Math3D.Angle.radian = function (degree) {
    return degree * .0174532925199433
};
Math3D.Angle.degree = function (radian) {
    return radian * 57.29577951308232
};
Math3D.Angle.wrap = function (radian) {
    return radian - 6.283185307179586 * Math.floor((radian + Math.PI) / 6.283185307179586)
};
Math3D.BuildDate = function () {};
Math3D.MyMath = function () {};
Math3D.MyMath.random = function (min, max) {
    return min + Math.random() * (max - min)
};
Math3D.MyMath.randomInt = function (min, max) {
    return min + Std.random(max - min + 1)
};
Math3D.MyMath.clamp = function (value, min, max) {
    if (min > max) {
        var temp = min;
        min = max;
        max = temp
    }
    if (value < min) return min;
    if (value > max) return max;
    return value
};
Math3D.MyMath.linearMap = function (value, s0, s1, d0, d1) {
    return d0 + (value - s0) * (d1 - d0) / (s1 - s0)
};
Math3D.MyMath.linearClampMap = function (value, s0, s1, d0, d1) {
    return Math3D.MyMath.clamp(Math3D.MyMath.linearMap(value, s0, s1, d0, d1), d0, d1)
};
Math3D.MyMath.lerp = function (from, to, t) {
    return from + (to - from) * t
};
Math3D.MyMath.inRange = function (value, min, max) {
    return min <= value && value <= max
};
Math3D.MyMath.wrap = function (value, range) {
    if (value > 0) return value % range;
    else return range + value % range
};
Math3D.MyMath.absoluteSub = function (value, sub) {
    if (value > 0) {
        value -= sub;
        if (value < 0) value = 0
    } else {
        value += sub;
        if (value > 0) value = 0
    }
    return value
};
Math3D.MyMath.sign = function (value) {
    if (value > 0) return 1;
    if (value < 0) return -1;
    return 0
};
Math3D.MyMath.square = function (value) {
    return value * value
};
Math3D.MyMath.round = function (value, decimalPlace) {
    var n = Math.pow(10, decimalPlace);
    return Math.round(value * n) / n
};
Math3D.MyMath.lengthVector = function (vx, vy) {
    return Math.sqrt(vx * vx + vy * vy)
};
Math3D.MyMath.ease = function (value, target, factor, deltaTime) {
    return value + (target - value) * (1 - Math.exp(-factor * deltaTime))
};
Math3D.MyMath.valueToTypes = function (value, types) {
    var len = types.length;
    var space = false;
    var _g = 0;
    while (_g < len) {
        var i = _g++;
        var figure = len - 1 - i;
        if (space) types[figure] = -1;
        else types[figure] = value % 10 | 0;
        value = value / 10 | 0;
        if (value == 0) space = true
    }
};
Math3D.MyMath.valueToTypes2 = function (value, types) {
    var len = types.length;
    var space = false;
    var _g = 0;
    while (_g < len) {
        var i = _g++;
        var figure = len - 1 - i;
        if (space) types[figure] = 0;
        else types[figure] = value % 10 | 0;
        value = value / 10 | 0;
        if (value == 0) space = true
    }
};
Math3D.Stopwatch = function () {
    this.start();

    this.start = function () {
        this.startTime = haxe.Timer.stamp()
    };

    this.getTime = function () {
        return haxe.Timer.stamp() - this.startTime
    };
};
Math3D.geometry = {};
Math3D.geometry.EulerAngles = function (heading, pitch, bank) {
    this.heading = heading;
    this.pitch = pitch;
    this.bank = bank;

    this.toString = function () {
        return "heading: " + this.heading + " pitch: " + this.pitch + " bank: " + this.bank
    };
};
Math3D.geometry.LineSegment2 = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
};
Math3D.geometry.LineSegment2.isIntersect = function (a, b) {
    if (((a.p1.x - a.p2.x) * (b.p1.y - a.p1.y) + (a.p1.y - a.p2.y) * (a.p1.x - b.p1.x)) * ((a.p1.x - a.p2.x) * (b.p2.y - a.p1.y) + (a.p1.y - a.p2.y) * (a.p1.x - b.p2.x)) < 0) {
        if (((b.p1.x - b.p2.x) * (a.p1.y - b.p1.y) + (b.p1.y - b.p2.y) * (b.p1.x - a.p1.x)) * ((b.p1.x - b.p2.x) * (a.p2.y - b.p1.y) + (b.p1.y - b.p2.y) * (b.p1.x - a.p2.x)) < 0) return true
    }
    return false
};
Math3D.geometry.Matrix3x3 = function () {
    this.set = function (m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33
    };

    this.setIdentity = function () {
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1
    };

    this.setRotationX = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.m11 = 1;
        this.m12 = 0;
        this.m13 = 0;
        this.m21 = 0;
        this.m22 = c;
        this.m23 = -s;
        this.m31 = 0;
        this.m32 = s;
        this.m33 = c
    };

    this.setRotationY = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.m11 = c;
        this.m12 = 0;
        this.m13 = s;
        this.m21 = 0;
        this.m22 = 1;
        this.m23 = 0;
        this.m31 = -s;
        this.m32 = 0;
        this.m33 = c
    };

    this.setRotationZ = function (angle) {
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        this.m11 = c;
        this.m12 = -s;
        this.m13 = 0;
        this.m21 = s;
        this.m22 = c;
        this.m23 = 0;
        this.m31 = 0;
        this.m32 = 0;
        this.m33 = 1
    };

    this.toString = function () {
        return "[" + this.m11 + " " + this.m12 + " " + this.m13 + "]\n" + "[" + this.m21 + " " + this.m22 + " " + this.m23 + "]\n" + "[" + this.m31 + " " + this.m32 + " " + this.m33 + "]\n"
    };

    this.multiplyVector = function (v) {
        var x = this.m11 * v.x + this.m12 * v.y + this.m13 * v.z;
        var y = this.m21 * v.x + this.m22 * v.y + this.m23 * v.z;
        var z = this.m31 * v.x + this.m32 * v.y + this.m33 * v.z;
        return new Math3D.geometry.Vector3(x, y, z)
    };
};
Math3D.geometry.Polygon2 = function (vertices) {
    if (vertices != null) this.vertices = vertices;
    else this.vertices = [];

    this.addVertex = function (x, y) {
        this.vertices.push(new Math3D.geometry.Vector2(x, y))
    };

    this.translate = function (x, y) {
        var _g = 0;
        var _g1 = this.vertices;
        while (_g < _g1.length) {
            var vertex = _g1[_g];
            ++_g;
            vertex.x += x;
            vertex.y += y
        }
    };

    this.scale = function (sx, sy) {
        var _g = 0;
        var _g1 = this.vertices;
        while (_g < _g1.length) {
            var vertex = _g1[_g];
            ++_g;
            vertex.x *= sx;
            vertex.y *= sy
        }
    };

    this.area = function () {
        var area = 0,
            i,
            j,
            point1,
            point2;

        for (i = 0, j = this.vertices.length - 1; i < this.vertices.length; j=i,i++) {
            point1 = this.vertices[i];
            point2 = this.vertices[j];
            area += point1.x * point2.y;
            area -= point1.y * point2.x;
        }
        area /= 2;

        return area;
    };

    this.centroid = function () {
        var x = 0,
            y = 0,
            i,
            j,
            f,
            point1,
            point2;

        for (i = 0, j = this.vertices.length - 1; i < this.vertices.length; j=i,i++) {
            point1 = this.vertices[i];
            point2 = this.vertices[j];
            f = point1.x * point2.y - point2.x * point1.y;
            x += (point1.x + point2.x) * f;
            y += (point1.y + point2.y) * f;
        }

        f = this.area() * 6;

        return {x: x / f, y: y / f};
    };

    this.computeBoundingBox = function () {
        this.boundingBox = Math3D.geometry.Rect.createBoundingBox();
        var _g = 0;
        var _g1 = this.vertices;
        while (_g < _g1.length) {
            var vertex = _g1[_g];
            ++_g;
            this.boundingBox.extend(vertex.x, vertex.y)
        }
    };

    this.contains = function (x, y) {
        if (this.boundingBox != null && !this.boundingBox.contains(x, y)) return false;
        if (this.vertices.length <= 2) return false;
        var crossCount = 0;
        var p0 = this.vertices[0];
        var p0isRight = x <= p0.x;
        var p0isDown = y <= p0.y;
        var _g1 = 1;
        var _g = this.vertices.length + 1;
        while (_g1 < _g) {
            var i = _g1++;
            var p1 = this.vertices[i % this.vertices.length];
            var p1isRight = x <= p1.x;
            var p1isDown = y <= p1.y;
            if (p0isDown != p1isDown) {
                if (p0isRight == p1isRight) {
                    if (p0isRight) crossCount += p0isDown ? -1 : 1
                } else if (x <= p0.x + (p1.x - p0.x) * (y - p0.y) / (p1.y - p0.y)) crossCount += p0isDown ? -1 : 1
            }
            p0 = p1;
            p0isRight = p1isRight;
            p0isDown = p1isDown
        }
        return crossCount != 0
    };

    this.distanceFromLine = function(p, l1, l2) {

        var xDelta = l2.x - l1.x;
        var yDelta = l2.y - l1.y;

        //	final double u = ((p3.getX() - p1.getX()) * xDelta + (p3.getY() - p1.getY()) * yDelta) / (xDelta * xDelta + yDelta * yDelta);
        var u = ((p.x - l1.x) * xDelta + (p.y - l1.y)*yDelta) / (xDelta * xDelta + yDelta * yDelta);
        if(isNaN(u)) u = 0;

        var closestPointOnLine;
        if (u < 0) {
            closestPointOnLine = l1;
        } else if (u > 1) {
            closestPointOnLine = l2;
        } else {
            closestPointOnLine = { x: l1.x + u * xDelta, y: l1.y + u * yDelta };
        }

        //ofPoint d = p - closestPointOnLine;

        var d = { x: p.x - closestPointOnLine.x, y: p.y - closestPointOnLine.y };

        return Math.sqrt(d.x * d.x + d.y * d.y);

    };

    /**
     *
     * Get the distance between a point to itself
     * @param x
     * @param y
     */
    this.distance = function (x, y) {

        var result = Number.MAX_VALUE,
            i,
            n;

        for (i = 0, n = this.vertices.length-1; i < n; i++) {

            var previousIndex = i - 1;
            if(previousIndex < 0){
                previousIndex = n - 1;
            }//if

            var currentPoint = this.vertices[i];
            var previousPoint = this.vertices[previousIndex];

            var segmentDistance = this.distanceFromLine({ x: x, y: y }, previousPoint, currentPoint);

            if(segmentDistance < result){
                result = segmentDistance;
            }//if

        }//for

        return result;

    };
};
Math3D.geometry.Quaternion = function (x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;

    this.copy = function (q) {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w
    };

    this.mul = function (q) {
        var _x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
        var _y = this.w * q.y + this.y * q.w + this.z * q.x - this.x * q.z;
        var _z = this.w * q.z + this.z * q.w + this.x * q.y - this.y * q.x;
        var _w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
        return new Math3D.geometry.Quaternion(_x, _y, _z, _w)
    };

    this.div = function (f) {
        this.x /= f;
        this.y /= f;
        this.z /= f;
        this.w /= f
    };

    this.norm = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
    };

    this.conjugate = function () {
        return new Math3D.geometry.Quaternion(-this.x, -this.y, -this.z, this.w)
    };

    this.inverse = function () {
        var q = this.conjugate();
        var f = this.norm();
        q.x /= f;
        q.y /= f;
        q.z /= f;
        q.w /= f;
        return q
    };

    this.toString = function () {
        return "(" + this.x + ", " + this.y + ", " + this.z + ", " + this.w + ")"
    };

    this.get_eulerAngles = function () {
        var h;
        var p;
        var b;
        var sp = -2 * (this.z * this.y - this.w * this.x);
        if (Math.abs(sp) > .998) {
            p = Math.PI / 2 * sp;
            h = Math.atan2(-this.x * this.y + this.w * this.z, .5 - this.z * this.z - this.y * this.y);
            b = 0
        } else {
            p = Math.asin(sp);
            h = Math.atan2(this.x * this.y + this.w * this.z, .5 - this.x * this.x - this.z * this.z);
            b = Math.atan2(this.x * this.z + this.w * this.y, .5 - this.x * this.x - this.y * this.y)
        }
        return new Math3D.geometry.EulerAngles(h, p, b)
    };

    this.getAngle = function () {
        return Math.acos(this.w) * 2
    };
};
Math3D.geometry.Quaternion.euler = function (heading, pitch, bank) {
    var hq = Math3D.geometry.Quaternion.angleAxis(heading, new Math3D.geometry.Vector3(0, 0, 1));
    var pq = Math3D.geometry.Quaternion.angleAxis(pitch, new Math3D.geometry.Vector3(1, 0, 0));
    var bq = Math3D.geometry.Quaternion.angleAxis(bank, new Math3D.geometry.Vector3(0, 1, 0));
    return bq.mul(pq).mul(hq)
};
Math3D.geometry.Quaternion.angleAxis = function (radian, axis) {
    var h = radian / 2;
    var s = Math.sin(h);
    return new Math3D.geometry.Quaternion(s * axis.x, s * axis.y, s * axis.z, Math.cos(h))
};
Math3D.geometry.Rect = function (x0, y0, x1, y1) {
    if (y1 == null) y1 = 0;
    if (x1 == null) x1 = 0;
    if (y0 == null) y0 = 0;
    if (x0 == null) x0 = 0;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;

    this.contains = function (x, y) {
        return this.x0 <= x && x < this.x1 && this.y0 <= y && y < this.y1
    };

    this.extend = function (x, y) {
        if (this.x0 > x) this.x0 = x;
        if (this.x1 < x) this.x1 = x;
        if (this.y0 > y) this.y0 = y;
        if (this.y1 < y) this.y1 = y
    };

    this.hitTest = function (other) {
        if (other.x1 < this.x0 || other.x0 > this.x1) return false;
        if (other.y1 < this.y0 || other.y0 > this.y1) return false;
        return true
    };

    this.toString = function () {
        return "(" + this.x0 + ", " + this.y0 + ", " + this.x1 + ", " + this.y1 + ")"
    };
};
Math3D.geometry.Rect.createSquare = function (x, y, radius) {
    return new Math3D.geometry.Rect(x - radius, y - radius, x + radius, y + radius)
};
Math3D.geometry.Rect.createBoundingBox = function () {
    return new Math3D.geometry.Rect(Math.POSITIVE_INFINITY, Math.POSITIVE_INFINITY, Math.NEGATIVE_INFINITY, Math.NEGATIVE_INFINITY)
};
Math3D.geometry.Vector2 = function (x, y) {
    this.x = x;
    this.y = y;

    this.set = function (x, y) {
        this.x = x;
        this.y = y
    };

    this.copy = function (v) {
        this.x = v.x;
        this.y = v.y
    };

    this.clone = function () {
        return new Math3D.geometry.Vector2(this.x, this.y)
    };

    this.toString = function () {
        return "(" + this.x + ", " + this.y + ")"
    };

    this.rotate = function (radian) {
        var c = Math.cos(radian);
        var s = Math.sin(radian);
        var newX = this.x * c - this.y * s;
        var newY = this.x * s + this.y * c;
        this.x = newX;
        this.y = newY
    };

    this.add2 = function (v) {
        this.x += v.x;
        this.y += v.y
    };

    this.mul = function (f) {
        return new Math3D.geometry.Vector2(this.x * f, this.y * f)
    };

    this.div = function (f) {
        return new Math3D.geometry.Vector2(this.x / f, this.y / f)
    };

    this.scale = function (v) {
        this.x *= v.x;
        this.y *= v.y
    };
};
Math3D.geometry.Vector2.distanceSquared = function (v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    return dx * dx + dy * dy
};
Math3D.geometry.Vector2.distance = function (v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy)
};
Math3D.geometry.Vector2.dot = function (p, q) {
    return p.x * q.x + p.y * q.y
};
Math3D.geometry.Vector2.lerp = function (from, to, t) {
    var x = from.x + (to.x - from.x) * t;
    var y = from.y + (to.y - from.y) * t;
    return new Math3D.geometry.Vector2(x, y)
};
Math3D.geometry.Vector3 = function (x, y, z) {
    if (z == null) z = 0;
    if (y == null) y = 0;
    if (x == null) x = 0;
    this.x = x;
    this.y = y;
    this.z = z;

    this.set = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z
    };

    this.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z
    };

    this.clone = function () {
        return new Math3D.geometry.Vector3(this.x, this.y, this.z)
    };

    this.multiply = function (m) {
        var newX = m.m11 * this.x + m.m12 * this.y + m.m13 * this.z;
        var newY = m.m21 * this.x + m.m22 * this.y + m.m23 * this.z;
        var newZ = m.m31 * this.x + m.m32 * this.y + m.m33 * this.z;
        this.x = newX;
        this.y = newY;
        this.z = newZ
    };

    this.toString = function () {
        return "(" + this.x + ", " + this.y + ", " + this.z + ")"
    };

    this.rotate = function (q) {
        var vq = new Math3D.geometry.Quaternion(this.x, this.y, this.z, 0);
        var iq = q.inverse();
        var result = q.mul(vq).mul(iq);
        this.x = result.x;
        this.y = result.y;
        this.z = result.z
    };

    this.rotateZ = function (radian) {
        var c = Math.cos(radian);
        var s = Math.sin(radian);
        var newX = this.x * c - this.y * s;
        var newY = this.x * s + this.y * c;
        this.x = newX;
        this.y = newY
    };

    this.mul = function (f) {
        return new Math3D.geometry.Vector3(this.x * f, this.y * f, this.z * f)
    };

    this.div = function (f) {
        return new Math3D.geometry.Vector3(this.x / f, this.y / f, this.z / f)
    };

    this.scale = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z
    };

    this.normalize = function () {
        var l = this.get_magnitude();
        this.x /= l;
        this.y /= l;
        this.z /= l
    };

    this.get_normalized = function () {
        var l = this.get_magnitude();
        return new Math3D.geometry.Vector3(this.x / l, this.y / l, this.z / l)
    };

    this.get_magnitude = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    };

    this.get_sqrMagnitude = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z
    };
};
Math3D.geometry.Vector3.EARTH_RADIUS = 6378100;
Math3D.geometry.Vector3.scale = function(a, scale) {
    return {x: a.x * scale, y: a.y * scale, z: a.z * scale};
};
Math3D.geometry.Vector3.getLength = function(a) {
    return Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
};
Math3D.geometry.Vector3.normalize = function(a) {
    var len = Math3D.geometry.Vector3.getLength(a);
    if (len <= 0) {
        return {x: NaN, y: NaN, z: NaN};
    }//if
    return Math3D.geometry.Vector3.scale(a, 1.0 / len);
};
Math3D.geometry.Vector3.zero = function () {
    return new Math3D.geometry.Vector3(0, 0, 0)
};
Math3D.geometry.Vector3.axisX = function () {
    return new Math3D.geometry.Vector3(1, 0, 0)
};
Math3D.geometry.Vector3.axisY = function () {
    return new Math3D.geometry.Vector3(0, 1, 0)
};
Math3D.geometry.Vector3.axisZ = function () {
    return new Math3D.geometry.Vector3(0, 0, 1)
};
Math3D.geometry.Vector3.subVV = function (a, b) {
    return new Math3D.geometry.Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
};
Math3D.geometry.Vector3.distanceSquared = function (v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;
    return dx * dx + dy * dy + dz * dz
};
Math3D.geometry.Vector3.distance = function (v1, v2) {
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
};
Math3D.geometry.Vector3.dot = function (p, q) {
    return p.x * q.x + p.y * q.y + p.z * q.z;
};
Math3D.geometry.Vector3.cross = function (p, q) {
    var x = p.y * q.z - p.z * q.y;
    var y = p.z * q.x - p.x * q.z;
    var z = p.x * q.y - p.y * q.x;
    return new Math3D.geometry.Vector3(x, y, z)
};
Math3D.geometry.Vector3.project = function (vector, normal) {
    return vector.mul(Math3D.geometry.Vector3.dot(vector, normal))
};
Math3D.geometry.Vector3.lerp = function (from, to, t) {
    var x = from.x + (to.x - from.x) * t;
    var y = from.y + (to.y - from.y) * t;
    var z = from.z + (to.z - from.z) * t;
    return new Math3D.geometry.Vector3(x, y, z)
};
Math3D.geometry.Vector3.latLonAltToCartesian = function (vert) {
    var sinTheta = Math.sin(vert.y * Math.PI / 180);
    var cosTheta = Math.cos(vert.y * Math.PI / 180);
    var sinPhi = Math.sin(vert.x * Math.PI / 180);
    var cosPhi = Math.cos(vert.x * Math.PI / 180);

    var r = Math3D.geometry.Vector3.EARTH_RADIUS + vert.z;
    var result = {
        x: r * cosTheta * cosPhi,
        y: r * sinPhi,
        z: r * -sinTheta * cosPhi
    };

    return result;
};
// Return the distance between two cartesian 3d points, along the
// surface of the Earth, assuming they are on the surface of the
// Earth.  (If the inputs are not on the surface of the earth, they
// are projected to the surface first.)
Math3D.geometry.Vector3.earthDistance = function(a, b) {
    var dot = Math3D.geometry.Vector3.dot(Math3D.geometry.Vector3.normalize(a), Math3D.geometry.Vector3.normalize(b));
    var angle = Math.acos(dot);
    var dist = Math3D.geometry.Vector3.EARTH_RADIUS * angle;
    return dist;
};
Math3D.geometry.Intersection = function() {
    this.angleBetween2Lines = function(x1, y1, x2, y2, x3, y3, x4, y4) {
        var angle1 = Math.atan2(
            y1 - y2,
            x1 - x2
        );

        var angle2 = Math.atan2(
            y3 - y4,
            x3 - y4
        );

        return angle1-angle2;
    }

    this.intersect = function(x1, y1, x2, y2, x3, y3, x4, y4){
        var same_sign = function(a, b){

            return (( a * b) >= 0);
        }

        var a1, a2, b1, b2, c1, c2;
        var r1, r2 , r3, r4;
        var denom, offset, num;

        // Compute a1, b1, c1, where line joining points 1 and 2
        // is "a1 x + b1 y + c1 = 0".
        a1 = y2 - y1;
        b1 = x1 - x2;
        c1 = (x2 * y1) - (x1 * y2);

        // Compute r3 and r4.
        r3 = ((a1 * x3) + (b1 * y3) + c1);
        r4 = ((a1 * x4) + (b1 * y4) + c1);

        // Check signs of r3 and r4. If both point 3 and point 4 lie on
        // same side of line 1, the line segments do not intersect.
        if ((r3 != 0) && (r4 != 0) && same_sign(r3, r4)){
            return false;
        }

        // Compute a2, b2, c2
        a2 = y4 - y3;
        b2 = x3 - x4;
        c2 = (x4 * y3) - (x3 * y4);

        // Compute r1 and r2
        r1 = (a2 * x1) + (b2 * y1) + c2;
        r2 = (a2 * x2) + (b2 * y2) + c2;

        // Check signs of r1 and r2. If both point 1 and point 2 lie
        // on same side of second line segment, the line segments do
        // not intersect.
        if ((r1 != 0) && (r2 != 0) && (same_sign(r1, r2))){
            return false;
        }

        //Line segments intersect: compute intersection point.
        denom = (a1 * b2) - (a2 * b1);

        var x = 0, y = 0;

        if (denom == 0) {
            return {x:x,y:y};
        }

        if (denom < 0){
            offset = -denom / 2;
        }
        else {
            offset = denom / 2 ;
        }

        // The denom/2 is to get rounding instead of truncating. It
        // is added or subtracted to the numerator, depending upon the
        // sign of the numerator.
        num = (b1 * c2) - (b2 * c1);
        if (num < 0){
            x = (num - offset) / denom;
        }
        else {
            x = (num + offset) / denom;
        }

        num = (a2 * c1) - (a1 * c2);
        if (num < 0){
            y = ( num - offset) / denom;
        }
        else {
            y = (num + offset) / denom;
        }

        // lines_intersect
        return {x:x,y:y,angle:this.angleBetween2Lines(x1, y1, x2, y2, x3, y3, x4, y4)};
    }
}
