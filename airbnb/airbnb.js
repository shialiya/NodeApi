const deasync = require('deasync');
window.crypto = require('crypto')

var arkoseLabsClientApi7f09c9f9;
!function () {
    var t, e, n, r, o = {
        4964: function (t) {
            t.exports = function (t) {
                "use strict";
                var e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
                function n(t, e) {
                    var n = t[0]
                        , r = t[1]
                        , o = t[2]
                        , i = t[3];
                    r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & o | ~r & i) + e[0] - 680876936 | 0) << 7 | n >>> 25) + r | 0) & r | ~n & o) + e[1] - 389564586 | 0) << 12 | i >>> 20) + n | 0) & n | ~i & r) + e[2] + 606105819 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & n) + e[3] - 1044525330 | 0) << 22 | r >>> 10) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & o | ~r & i) + e[4] - 176418897 | 0) << 7 | n >>> 25) + r | 0) & r | ~n & o) + e[5] + 1200080426 | 0) << 12 | i >>> 20) + n | 0) & n | ~i & r) + e[6] - 1473231341 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & n) + e[7] - 45705983 | 0) << 22 | r >>> 10) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & o | ~r & i) + e[8] + 1770035416 | 0) << 7 | n >>> 25) + r | 0) & r | ~n & o) + e[9] - 1958414417 | 0) << 12 | i >>> 20) + n | 0) & n | ~i & r) + e[10] - 42063 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & n) + e[11] - 1990404162 | 0) << 22 | r >>> 10) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & o | ~r & i) + e[12] + 1804603682 | 0) << 7 | n >>> 25) + r | 0) & r | ~n & o) + e[13] - 40341101 | 0) << 12 | i >>> 20) + n | 0) & n | ~i & r) + e[14] - 1502002290 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & n) + e[15] + 1236535329 | 0) << 22 | r >>> 10) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & i | o & ~i) + e[1] - 165796510 | 0) << 5 | n >>> 27) + r | 0) & o | r & ~o) + e[6] - 1069501632 | 0) << 9 | i >>> 23) + n | 0) & r | n & ~r) + e[11] + 643717713 | 0) << 14 | o >>> 18) + i | 0) & n | i & ~n) + e[0] - 373897302 | 0) << 20 | r >>> 12) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & i | o & ~i) + e[5] - 701558691 | 0) << 5 | n >>> 27) + r | 0) & o | r & ~o) + e[10] + 38016083 | 0) << 9 | i >>> 23) + n | 0) & r | n & ~r) + e[15] - 660478335 | 0) << 14 | o >>> 18) + i | 0) & n | i & ~n) + e[4] - 405537848 | 0) << 20 | r >>> 12) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & i | o & ~i) + e[9] + 568446438 | 0) << 5 | n >>> 27) + r | 0) & o | r & ~o) + e[14] - 1019803690 | 0) << 9 | i >>> 23) + n | 0) & r | n & ~r) + e[3] - 187363961 | 0) << 14 | o >>> 18) + i | 0) & n | i & ~n) + e[8] + 1163531501 | 0) << 20 | r >>> 12) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & i | o & ~i) + e[13] - 1444681467 | 0) << 5 | n >>> 27) + r | 0) & o | r & ~o) + e[2] - 51403784 | 0) << 9 | i >>> 23) + n | 0) & r | n & ~r) + e[7] + 1735328473 | 0) << 14 | o >>> 18) + i | 0) & n | i & ~n) + e[12] - 1926607734 | 0) << 20 | r >>> 12) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r ^ o ^ i) + e[5] - 378558 | 0) << 4 | n >>> 28) + r | 0) ^ r ^ o) + e[8] - 2022574463 | 0) << 11 | i >>> 21) + n | 0) ^ n ^ r) + e[11] + 1839030562 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ n) + e[14] - 35309556 | 0) << 23 | r >>> 9) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r ^ o ^ i) + e[1] - 1530992060 | 0) << 4 | n >>> 28) + r | 0) ^ r ^ o) + e[4] + 1272893353 | 0) << 11 | i >>> 21) + n | 0) ^ n ^ r) + e[7] - 155497632 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ n) + e[10] - 1094730640 | 0) << 23 | r >>> 9) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r ^ o ^ i) + e[13] + 681279174 | 0) << 4 | n >>> 28) + r | 0) ^ r ^ o) + e[0] - 358537222 | 0) << 11 | i >>> 21) + n | 0) ^ n ^ r) + e[3] - 722521979 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ n) + e[6] + 76029189 | 0) << 23 | r >>> 9) + o | 0,
                        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r ^ o ^ i) + e[9] - 640364487 | 0) << 4 | n >>> 28) + r | 0) ^ r ^ o) + e[12] - 421815835 | 0) << 11 | i >>> 21) + n | 0) ^ n ^ r) + e[15] + 530742520 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ n) + e[2] - 995338651 | 0) << 23 | r >>> 9) + o | 0,
                        r = ((r += ((i = ((i += (r ^ ((n = ((n += (o ^ (r | ~i)) + e[0] - 198630844 | 0) << 6 | n >>> 26) + r | 0) | ~o)) + e[7] + 1126891415 | 0) << 10 | i >>> 22) + n | 0) ^ ((o = ((o += (n ^ (i | ~r)) + e[14] - 1416354905 | 0) << 15 | o >>> 17) + i | 0) | ~n)) + e[5] - 57434055 | 0) << 21 | r >>> 11) + o | 0,
                        r = ((r += ((i = ((i += (r ^ ((n = ((n += (o ^ (r | ~i)) + e[12] + 1700485571 | 0) << 6 | n >>> 26) + r | 0) | ~o)) + e[3] - 1894986606 | 0) << 10 | i >>> 22) + n | 0) ^ ((o = ((o += (n ^ (i | ~r)) + e[10] - 1051523 | 0) << 15 | o >>> 17) + i | 0) | ~n)) + e[1] - 2054922799 | 0) << 21 | r >>> 11) + o | 0,
                        r = ((r += ((i = ((i += (r ^ ((n = ((n += (o ^ (r | ~i)) + e[8] + 1873313359 | 0) << 6 | n >>> 26) + r | 0) | ~o)) + e[15] - 30611744 | 0) << 10 | i >>> 22) + n | 0) ^ ((o = ((o += (n ^ (i | ~r)) + e[6] - 1560198380 | 0) << 15 | o >>> 17) + i | 0) | ~n)) + e[13] + 1309151649 | 0) << 21 | r >>> 11) + o | 0,
                        r = ((r += ((i = ((i += (r ^ ((n = ((n += (o ^ (r | ~i)) + e[4] - 145523070 | 0) << 6 | n >>> 26) + r | 0) | ~o)) + e[11] - 1120210379 | 0) << 10 | i >>> 22) + n | 0) ^ ((o = ((o += (n ^ (i | ~r)) + e[2] + 718787259 | 0) << 15 | o >>> 17) + i | 0) | ~n)) + e[9] - 343485551 | 0) << 21 | r >>> 11) + o | 0,
                        t[0] = n + t[0] | 0,
                        t[1] = r + t[1] | 0,
                        t[2] = o + t[2] | 0,
                        t[3] = i + t[3] | 0
                }
                function r(t) {
                    var e, n = [];
                    for (e = 0; e < 64; e += 4)
                        n[e >> 2] = t.charCodeAt(e) + (t.charCodeAt(e + 1) << 8) + (t.charCodeAt(e + 2) << 16) + (t.charCodeAt(e + 3) << 24);
                    return n
                }
                function o(t) {
                    var e, n = [];
                    for (e = 0; e < 64; e += 4)
                        n[e >> 2] = t[e] + (t[e + 1] << 8) + (t[e + 2] << 16) + (t[e + 3] << 24);
                    return n
                }
                function i(t) {
                    var e, o, i, a, c, u, s = t.length, f = [1732584193, -271733879, -1732584194, 271733878];
                    for (e = 64; e <= s; e += 64)
                        n(f, r(t.substring(e - 64, e)));
                    for (o = (t = t.substring(e - 64)).length,
                        i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        e = 0; e < o; e += 1)
                        i[e >> 2] |= t.charCodeAt(e) << (e % 4 << 3);
                    if (i[e >> 2] |= 128 << (e % 4 << 3),
                        e > 55)
                        for (n(f, i),
                            e = 0; e < 16; e += 1)
                            i[e] = 0;
                    return a = (a = 8 * s).toString(16).match(/(.*?)(.{0,8})$/),
                        c = parseInt(a[2], 16),
                        u = parseInt(a[1], 16) || 0,
                        i[14] = c,
                        i[15] = u,
                        n(f, i),
                        f
                }
                function a(t) {
                    var e, r, i, a, c, u, s = t.length, f = [1732584193, -271733879, -1732584194, 271733878];
                    for (e = 64; e <= s; e += 64)
                        n(f, o(t.subarray(e - 64, e)));
                    for (r = (t = e - 64 < s ? t.subarray(e - 64) : new Uint8Array(0)).length,
                        i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        e = 0; e < r; e += 1)
                        i[e >> 2] |= t[e] << (e % 4 << 3);
                    if (i[e >> 2] |= 128 << (e % 4 << 3),
                        e > 55)
                        for (n(f, i),
                            e = 0; e < 16; e += 1)
                            i[e] = 0;
                    return a = (a = 8 * s).toString(16).match(/(.*?)(.{0,8})$/),
                        c = parseInt(a[2], 16),
                        u = parseInt(a[1], 16) || 0,
                        i[14] = c,
                        i[15] = u,
                        n(f, i),
                        f
                }
                function c(t) {
                    var n, r = "";
                    for (n = 0; n < 4; n += 1)
                        r += e[t >> 8 * n + 4 & 15] + e[t >> 8 * n & 15];
                    return r
                }
                function u(t) {
                    var e;
                    for (e = 0; e < t.length; e += 1)
                        t[e] = c(t[e]);
                    return t.join("")
                }
                function s(t) {
                    return /[\u0080-\uFFFF]/.test(t) && (t = unescape(encodeURIComponent(t))),
                        t
                }
                function f(t, e) {
                    var n, r = t.length, o = new ArrayBuffer(r), i = new Uint8Array(o);
                    for (n = 0; n < r; n += 1)
                        i[n] = t.charCodeAt(n);
                    return e ? i : o
                }
                function l(t) {
                    return String.fromCharCode.apply(null, new Uint8Array(t))
                }
                function p(t, e, n) {
                    var r = new Uint8Array(t.byteLength + e.byteLength);
                    return r.set(new Uint8Array(t)),
                        r.set(new Uint8Array(e), t.byteLength),
                        n ? r : r.buffer
                }
                function h(t) {
                    var e, n = [], r = t.length;
                    for (e = 0; e < r - 1; e += 2)
                        n.push(parseInt(t.substr(e, 2), 16));
                    return String.fromCharCode.apply(String, n)
                }
                function v() {
                    this.reset()
                }
                return u(i("hello")),
                    "undefined" == typeof ArrayBuffer || ArrayBuffer.prototype.slice || function () {
                        function e(t, e) {
                            return (t = 0 | t || 0) < 0 ? Math.max(t + e, 0) : Math.min(t, e)
                        }
                        ArrayBuffer.prototype.slice = function (n, r) {
                            var o, i, a, c, u = this.byteLength, s = e(n, u), f = u;
                            return r !== t && (f = e(r, u)),
                                s > f ? new ArrayBuffer(0) : (o = f - s,
                                    i = new ArrayBuffer(o),
                                    a = new Uint8Array(i),
                                    c = new Uint8Array(this, s, o),
                                    a.set(c),
                                    i)
                        }
                    }(),
                    v.prototype.append = function (t) {
                        return this.appendBinary(s(t)),
                            this
                    }
                    ,
                    v.prototype.appendBinary = function (t) {
                        this._buff += t,
                            this._length += t.length;
                        var e, o = this._buff.length;
                        for (e = 64; e <= o; e += 64)
                            n(this._hash, r(this._buff.substring(e - 64, e)));
                        return this._buff = this._buff.substring(e - 64),
                            this
                    }
                    ,
                    v.prototype.end = function (t) {
                        var e, n, r = this._buff, o = r.length, i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        for (e = 0; e < o; e += 1)
                            i[e >> 2] |= r.charCodeAt(e) << (e % 4 << 3);
                        return this._finish(i, o),
                            n = u(this._hash),
                            t && (n = h(n)),
                            this.reset(),
                            n
                    }
                    ,
                    v.prototype.reset = function () {
                        return this._buff = "",
                            this._length = 0,
                            this._hash = [1732584193, -271733879, -1732584194, 271733878],
                            this
                    }
                    ,
                    v.prototype.getState = function () {
                        return {
                            buff: this._buff,
                            length: this._length,
                            hash: this._hash.slice()
                        }
                    }
                    ,
                    v.prototype.setState = function (t) {
                        return this._buff = t.buff,
                            this._length = t.length,
                            this._hash = t.hash,
                            this
                    }
                    ,
                    v.prototype.destroy = function () {
                        delete this._hash,
                            delete this._buff,
                            delete this._length
                    }
                    ,
                    v.prototype._finish = function (t, e) {
                        var r, o, i, a = e;
                        if (t[a >> 2] |= 128 << (a % 4 << 3),
                            a > 55)
                            for (n(this._hash, t),
                                a = 0; a < 16; a += 1)
                                t[a] = 0;
                        r = (r = 8 * this._length).toString(16).match(/(.*?)(.{0,8})$/),
                            o = parseInt(r[2], 16),
                            i = parseInt(r[1], 16) || 0,
                            t[14] = o,
                            t[15] = i,
                            n(this._hash, t)
                    }
                    ,
                    v.hash = function (t, e) {
                        return v.hashBinary(s(t), e)
                    }
                    ,
                    v.hashBinary = function (t, e) {
                        var n = u(i(t));
                        return e ? h(n) : n
                    }
                    ,
                    v.ArrayBuffer = function () {
                        this.reset()
                    }
                    ,
                    v.ArrayBuffer.prototype.append = function (t) {
                        var e, r = p(this._buff.buffer, t, !0), i = r.length;
                        for (this._length += t.byteLength,
                            e = 64; e <= i; e += 64)
                            n(this._hash, o(r.subarray(e - 64, e)));
                        return this._buff = e - 64 < i ? new Uint8Array(r.buffer.slice(e - 64)) : new Uint8Array(0),
                            this
                    }
                    ,
                    v.ArrayBuffer.prototype.end = function (t) {
                        var e, n, r = this._buff, o = r.length, i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                        for (e = 0; e < o; e += 1)
                            i[e >> 2] |= r[e] << (e % 4 << 3);
                        return this._finish(i, o),
                            n = u(this._hash),
                            t && (n = h(n)),
                            this.reset(),
                            n
                    }
                    ,
                    v.ArrayBuffer.prototype.reset = function () {
                        return this._buff = new Uint8Array(0),
                            this._length = 0,
                            this._hash = [1732584193, -271733879, -1732584194, 271733878],
                            this
                    }
                    ,
                    v.ArrayBuffer.prototype.getState = function () {
                        var t = v.prototype.getState.call(this);
                        return t.buff = l(t.buff),
                            t
                    }
                    ,
                    v.ArrayBuffer.prototype.setState = function (t) {
                        return t.buff = f(t.buff, !0),
                            v.prototype.setState.call(this, t)
                    }
                    ,
                    v.ArrayBuffer.prototype.destroy = v.prototype.destroy,
                    v.ArrayBuffer.prototype._finish = v.prototype._finish,
                    v.ArrayBuffer.hash = function (t, e) {
                        var n = u(a(new Uint8Array(t)));
                        return e ? h(n) : n
                    }
                    ,
                    v
            }()
        },
    }, i = {};
    function a(t) {
        var e = i[t];
        if (void 0 !== e)
            return e.exports;
        var n = i[t] = {
            id: t,
            loaded: !1,
            exports: {}
        };
        return o[t].call(n.exports, n, n.exports, a),
            n.loaded = !0,
            n.exports
    }
    a.m = o,
        a.n = function (t) {
            var e = t && t.__esModule ? function () {
                return t.default
            }
                : function () {
                    return t
                }
                ;
            return a.d(e, {
                a: e
            }),
                e
        }
        ,
        e = Object.getPrototypeOf ? function (t) {
            return Object.getPrototypeOf(t)
        }
            : function (t) {
                return t.__proto__
            }
        ,
        a.t = function (n, r) {
            if (1 & r && (n = this(n)),
                8 & r)
                return n;
            if ("object" == typeof n && n) {
                if (4 & r && n.__esModule)
                    return n;
                if (16 & r && "function" == typeof n.then)
                    return n
            }
            var o = Object.create(null);
            a.r(o);
            var i = {};
            t = t || [null, e({}), e([]), e(e)];
            for (var c = 2 & r && n; "object" == typeof c && !~t.indexOf(c); c = e(c))
                Object.getOwnPropertyNames(c).forEach((function (t) {
                    i[t] = function () {
                        return n[t]
                    }
                }
                ));
            return i.default = function () {
                return n
            }
                ,
                a.d(o, i),
                o
        }
        ,
        a.d = function (t, e) {
            for (var n in e)
                a.o(e, n) && !a.o(t, n) && Object.defineProperty(t, n, {
                    enumerable: !0,
                    get: e[n]
                })
        }
        ,
        a.f = {},
        a.e = function (t) {
            return Promise.all(Object.keys(a.f).reduce((function (e, n) {
                return a.f[n](t, e),
                    e
            }
            ), []))
        }
        ,
        a.u = function (t) {
            return "vendors." + t + ".680e9fec55645f785d2cc2dbf0b3e151.js"
        }
        ,
        a.hmd = function (t) {
            return (t = Object.create(t)).children || (t.children = []),
                Object.defineProperty(t, "exports", {
                    enumerable: !0,
                    set: function () {
                        throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: " + t.id)
                    }
                }),
                t
        }
        ,
        a.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }
        ,
        n = {},
        r = "arkoseLabsClientApi7f09c9f9:",
        a.l = function (t, e, o, i) {
            if (n[t])
                n[t].push(e);
            else {
                var c, u;
                if (void 0 !== o)
                    for (var s = document.getElementsByTagName("script"), f = 0; f < s.length; f++) {
                        var l = s[f];
                        if (l.getAttribute("src") == t || l.getAttribute("data-webpack") == r + o) {
                            c = l;
                            break
                        }
                    }
                c || (u = !0,
                    (c = document.createElement("script")).charset = "utf-8",
                    c.timeout = 120,
                    a.nc && c.setAttribute("nonce", a.nc),
                    c.setAttribute("data-webpack", r + o),
                    c.src = t,
                    0 !== c.src.indexOf(window.location.origin + "/") && (c.crossOrigin = "anonymous"),
                    c.integrity = a.sriHashes[i],
                    c.crossOrigin = "anonymous"),
                    n[t] = [e];
                var p = function (e, r) {
                    c.onerror = c.onload = null,
                        clearTimeout(h);
                    var o = n[t];
                    if (delete n[t],
                        c.parentNode && c.parentNode.removeChild(c),
                        o && o.forEach((function (t) {
                            return t(r)
                        }
                        )),
                        e)
                        return e(r)
                }
                    , h = setTimeout(p.bind(null, void 0, {
                        type: "timeout",
                        target: c
                    }), 12e4);
                c.onerror = p.bind(null, c.onerror),
                    c.onload = p.bind(null, c.onload),
                    u && document.head.appendChild(c)
            }
        }
        ,
        a.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }),
                Object.defineProperty(t, "__esModule", {
                    value: !0
                })
        }
    a.sriHashes = {
        991: "sha384-QA4iYMT2t7aziZIzd4cS1CgKx9Hismd9FhxvveCXZNLVmiHpjRsBxwObS/mzYCLf"
    },
        arkoseLabsClientApi7f09c9f9 = a
}();

var on = arkoseLabsClientApi7f09c9f9(4964)
    , an = arkoseLabsClientApi7f09c9f9.n(on);


var Nn = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 10, 11, 12, 13, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 11, 12, 13, 14, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var Qn = function (t) {
    if (window['TextEncoder'])
        return (new TextEncoder)['encode'](t);
    for (var u = new Uint8Array(t['length']), s = 0; s < u['length']; s += 1)
        u[s] = t['charCodeAt'](s);
    return u
},
    Un = function (t, e) {
        var h = new t(e)
            , d = window["crypto"] || window["msCrypto"];
        if (d && d['getRandomValues'] && typeof d['getRandomValues'] == 'function')
            return d['getRandomValues'](h);
        for (var g = 0; g < h['length']; g += 1)
            h[g] = Rn(256);
        return h
    },
    er = function (t) {
        for (var e = 196, n = 184, r = 222, o = 212, i = 198, c = [], u = 0; u < t["length"]; u += 1)
            c[u] = t[u];
        return c['map']((function (t) {
            return t["toString"](16)['padStart'](2, "0")
        }
        ))["join"]("")
    },
    tr = function (t, e) {
        var c = t + function (t) {
            for (var e, n, l = t['length'], p = "", h = 0; l > 1;)
                e = t['charAt'](h++)['charCodeAt'](0),
                    n = t['charAt'](h++)['charCodeAt'](0),
                    p += String['fromCharCode']((Nn[e] << 4) + Nn[n]),
                    l -= 2;
            return p
        }(e)
            , u = [];
        u[0] = an()["hashBinary"](c, !0);
        for (var s = u[0], f = 1; f < 3; f++)
            u[f] = an()["hashBinary"](u[f - 1] + c, !0),
                s += u[f];
        return function (t) {
            for (var i = new Uint8Array(t['length']), a = 0, c = t['length']; a < c; ++a)
                i[a] = t["charCodeAt"](a);
            return i
        }(s['substring'](0, 32))
    },
    $n = function (t) {
        for (var c = "", u = new Uint8Array(t), s = u['byteLength'], f = 0; f < s; f++)
            c += String['fromCharCode'](u[f]);
        return window['btoa'](c)
    },
    kn = {
        code: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function (t, e) {
            e = void 0 !== e && e;
            var n, r, o, i, a, c, u, s, f = [], l = "", p = kn.code;
            if ((c = (u = e ? jn.encode(t) : t).length % 3) > 0)
                for (; c++ < 3;)
                    l += "=",
                        u += "\0";
            for (c = 0; c < u.length; c += 3)
                r = (n = u.charCodeAt(c) << 16 | u.charCodeAt(c + 1) << 8 | u.charCodeAt(c + 2)) >> 18 & 63,
                    o = n >> 12 & 63,
                    i = n >> 6 & 63,
                    a = 63 & n,
                    f[c / 3] = p.charAt(r) + p.charAt(o) + p.charAt(i) + p.charAt(a);
            return s = (s = f.join("")).slice(0, s.length - l.length) + l
        },
        decode: function (t, e) {
            e = void 0 !== e && e;
            var n, r, o, i, a, c, u, s, f = [], l = kn.code;
            s = e ? jn.decode(t) : t;
            for (var p = 0; p < s.length; p += 4)
                n = (c = l.indexOf(s.charAt(p)) << 18 | l.indexOf(s.charAt(p + 1)) << 12 | (i = l.indexOf(s.charAt(p + 2))) << 6 | (a = l.indexOf(s.charAt(p + 3)))) >>> 16 & 255,
                    r = c >>> 8 & 255,
                    o = 255 & c,
                    f[p / 4] = String.fromCharCode(n, r, o),
                    64 == a && (f[p / 4] = String.fromCharCode(n, r)),
                    64 == i && (f[p / 4] = String.fromCharCode(n));
            return u = f.join(""),
                e ? jn.decode(u) : u
        }
    }

function encrypt(ua, data) {
    let result;
    const callback = function (error, res) {
        if (error) {
            throw error;
        } else {
            result = res;
        }
    };
    var f, p, v, h, g, m, y, b, w, O;
    f = (new Date)["getTime"]() / 1e3,
        p = Math['round'](f - f % 21600),
        h = JSON['stringify'](data),
        v = Qn(h),
        g = ua + p,
        m = Un(Uint8Array, 16),
        y = Un(Uint8Array, 8),
        b = er(m),
        w = er(y),
        O = tr(g, w)
    var Wt = {};
    Wt['name'] = "AES-CBC"
    var pk = window["crypto"]['subtle']['importKey']('raw', O, Wt, !1, ['encrypt'])
    pk.then(S => {
        var Xt = {};
        Xt["name"] = 'AES-CBC'
        Xt.iv = m
        var pks = window['crypto']['subtle']['encrypt'](Xt, S, v)
        pks.then(E => {
            var res = JSON.stringify({
                ct: $n(E),
                s: w,
                iv: b
            })
            callback(null, {
                bda: kn.encode(res),
                time: p + ''
            })
            // return btoa(y)
        }
        )
    }
    )
    deasync.loopWhile(function () {
        return result === undefined;
    });

    return result

}

/**
 * 随机生成整数
 * @param max 最大值
 * @param min 最小值
 * @returns {*}
 */
function generateRandomInteger(max, min) {

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getAirBnbbda(ua) {
    //宽度,这里乘以10的倍数
    let width = generateRandomInteger(30, 9) * 10;
    let height = generateRandomInteger(20, 7) * 10;
    //高度
    var data = [
        {
            "key": "api_type",
            "value": "js"
        },
        {
            "key": "f",
            "value": "4d675f9ea747c9c09a3ad431895fab19"
        },
        {
            "key": "n",
            "value": btoa(Math.round(Date.now() / 1000) + "")
        },
        {
            "key": "wh",
            "value": "d8cb38e19416e00a01e96834a79be91c|72627afbfd19a741c7da1732218301ac"
        },
        {
            "key": "enhanced_fp",
            "value": [
                {
                    "key": "webgl_extensions",
                    "value": "ANGLE_instanced_arrays;EXT_blend_minmax;EXT_clip_control;EXT_color_buffer_half_float;EXT_depth_clamp;EXT_disjoint_timer_query;EXT_float_blend;EXT_frag_depth;EXT_polygon_offset_clamp;EXT_shader_texture_lod;EXT_texture_compression_bptc;EXT_texture_compression_rgtc;EXT_texture_filter_anisotropic;EXT_texture_mirror_clamp_to_edge;EXT_sRGB;KHR_parallel_shader_compile;OES_element_index_uint;OES_fbo_render_mipmap;OES_standard_derivatives;OES_texture_float;OES_texture_float_linear;OES_texture_half_float;OES_texture_half_float_linear;OES_vertex_array_object;WEBGL_blend_func_extended;WEBGL_color_buffer_float;WEBGL_compressed_texture_s3tc;WEBGL_compressed_texture_s3tc_srgb;WEBGL_debug_renderer_info;WEBGL_debug_shaders;WEBGL_depth_texture;WEBGL_draw_buffers;WEBGL_lose_context;WEBGL_multi_draw;WEBGL_polygon_mode"
                },
                {
                    "key": "webgl_extensions_hash",
                    "value": generateRandomHash()
                },
                {
                    "key": "webgl_renderer",
                    "value": "WebKit WebGL"
                },
                {
                    "key": "webgl_vendor",
                    "value": "WebKit"
                },
                {
                    "key": "webgl_version",
                    "value": "WebGL 1.0 (OpenGL ES 2.0 Chromium)"
                },
                {
                    "key": "webgl_shading_language_version",
                    "value": "WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)"
                },
                {
                    "key": "webgl_aliased_line_width_range",
                    "value": "[1, 1]"
                },
                {
                    "key": "webgl_aliased_point_size_range",
                    "value": "[1, 511]"
                },
                {
                    "key": "webgl_antialiasing",
                    "value": "yes"
                },
                {
                    "key": "webgl_bits",
                    "value": "8,8,24,8,8,0"
                },
                {
                    "key": "webgl_max_params",
                    "value": "16,32,16384,1024,16384,16,16384,30,16,16,1024"
                },
                {
                    "key": "webgl_max_viewport_dims",
                    "value": "[16384, 16384]"
                },
                {
                    "key": "webgl_unmasked_vendor",
                    "value": "Google Inc. (Intel)"
                },
                {
                    "key": "webgl_unmasked_renderer",
                    "value": "ANGLE (Intel, ANGLE Metal Renderer: Intel(R) Iris(TM) Plus Graphics, Unspecified Version)"
                },
                {
                    "key": "webgl_vsf_params",
                    "value": "23,127,127,23,127,127,23,127,127"
                },
                {
                    "key": "webgl_vsi_params",
                    "value": "0,31,30,0,31,30,0,31,30"
                },
                {
                    "key": "webgl_fsf_params",
                    "value": "23,127,127,23,127,127,23,127,127"
                },
                {
                    "key": "webgl_fsi_params",
                    "value": "0,31,30,0,31,30,0,31,30"
                },
                {
                    "key": "webgl_hash_webgl",
                    "value": generateRandomHash()
                },
                {
                    "key": "user_agent_data_brands",
                    "value": "Google Chrome,Chromium,Not_A Brand"
                },
                {
                    "key": "user_agent_data_mobile",
                    "value": false
                },
                {
                    "key": "navigator_connection_downlink",
                    "value": 10
                },
                {
                    "key": "navigator_connection_downlink_max",
                    "value": null
                },
                {
                    "key": "network_info_rtt",
                    "value": 200
                },
                {
                    "key": "network_info_save_data",
                    "value": false
                },
                {
                    "key": "network_info_rtt_type",
                    "value": null
                },
                {
                    "key": "screen_pixel_depth",
                    "value": 24
                },
                {
                    "key": "navigator_device_memory",
                    "value": 8
                },
                {
                    "key": "navigator_pdf_viewer_enabled",
                    "value": true
                },
                {
                    "key": "navigator_languages",
                    "value": "zh-CN,zh,en"
                },
                {
                    "key": "window_inner_width",
                    "value": 0
                },
                {
                    "key": "window_inner_height",
                    "value": 0
                },
                {
                    "key": "window_outer_width",
                    "value": width
                },
                {
                    "key": "window_outer_height",
                    "value": height
                },
                {
                    "key": "browser_detection_firefox",
                    "value": false
                },
                {
                    "key": "browser_detection_brave",
                    "value": false
                },
                {
                    "key": "browser_api_checks",
                    "value": [
                        "permission_status: true",
                        "eye_dropper: true",
                        "audio_data: true",
                        "writable_stream: true",
                        "css_style_rule: true",
                        "navigator_ua: true",
                        "barcode_detector: true",
                        "display_names: true",
                        "contacts_manager: false",
                        "svg_discard_element: false",
                        "usb: defined",
                        "media_device: defined",
                        "playback_quality: true"
                    ]
                },
                {
                    "key": "browser_object_checks",
                    "value": generateRandomHash()
                },
                {
                    "key": "29s83ih9",
                    "value": "68934a3e9455fa72420237eb05902327⁣"
                },
                {
                    "key": "audio_codecs",
                    "value": "{\"ogg\":\"probably\",\"mp3\":\"probably\",\"wav\":\"probably\",\"m4a\":\"maybe\",\"aac\":\"probably\"}"
                },
                {
                    "key": "audio_codecs_extended_hash",
                    "value": generateRandomHash()
                },
                {
                    "key": "video_codecs",
                    "value": "{\"ogg\":\"\",\"h264\":\"probably\",\"webm\":\"probably\",\"mpeg4v\":\"\",\"mpeg4a\":\"\",\"theora\":\"\"}"
                },
                {
                    "key": "video_codecs_extended_hash",
                    "value": generateRandomHash()
                },
                {
                    "key": "media_query_dark_mode",
                    "value": false
                },
                {
                    "key": "css_media_queries",
                    "value": 0
                },
                {
                    "key": "css_color_gamut",
                    "value": "p3"
                },
                {
                    "key": "css_contrast",
                    "value": "no-preference"
                },
                {
                    "key": "css_monochrome",
                    "value": false
                },
                {
                    "key": "css_pointer",
                    "value": "fine"
                },
                {
                    "key": "css_grid_support",
                    "value": false
                },
                {
                    "key": "headless_browser_phantom",
                    "value": false
                },
                {
                    "key": "headless_browser_selenium",
                    "value": false
                },
                {
                    "key": "headless_browser_nightmare_js",
                    "value": false
                },
                {
                    "key": "headless_browser_generic",
                    "value": 4
                },
                {
                    "key": "1l2l5234ar2",
                    "value": Date.now() + "⁢"
                },
                {
                    "key": "document__referrer",
                    "value": "https://zh.airbnb.com/"
                },
                {
                    "key": "window__ancestor_origins",
                    "value": [
                        "https://zh.airbnb.com"
                    ]
                },
                {
                    "key": "window__tree_index",
                    "value": [
                        4
                    ]
                },
                {
                    "key": "window__tree_structure",
                    "value": "[[[]],[],[],[],[]]"
                },
                {
                    "key": "window__location_href",
                    "value": "https://airbnb-api.arkoselabs.com/v2/2.11.2/enforcement.680e9fec55645f785d2cc2dbf0b3e151.html"
                },
                {
                    "key": "client_config__sitedata_location_href",
                    "value": "https://zh.airbnb.com/signup_login"
                },
                {
                    "key": "client_config__language",
                    "value": "en"
                },
                {
                    "key": "client_config__surl",
                    "value": "https://airbnb-api.arkoselabs.com"
                },
                {
                    "key": "c8480e29a",
                    "value": "891a0d06d529c7bcfdec8a5763895831⁢"
                },
                {
                    "key": "client_config__triggered_inline",
                    "value": false
                },
                {
                    "key": "mobile_sdk__is_sdk",
                    "value": false
                },
                {
                    "key": "audio_fingerprint",
                    "value": "124.04347657808103"
                },
                {
                    "key": "navigator_battery_charging",
                    "value": true
                },
                {
                    "key": "media_device_kinds",
                    "value": [
                        "audioinput",
                        "videoinput",
                        "audiooutput"
                    ]
                },
                {
                    "key": "media_devices_hash",
                    "value": generateRandomHash()
                },
                {
                    "key": "navigator_permissions_hash",
                    "value": generateRandomHash()
                },
                {
                    "key": "math_fingerprint",
                    "value": generateRandomHash()
                },
                {
                    "key": "supported_math_functions",
                    "value": generateRandomHash()
                },
                {
                    "key": "screen_orientation",
                    "value": "landscape-primary"
                },
                {
                    "key": "rtc_peer_connection",
                    "value": 5
                },
                {
                    "key": "4b4b269e68",
                    "value": "139a5bfa-1e8c-47b2-b0e2-caa34a2f8241"
                },
                {
                    "key": "6a62b2a558",
                    "value": generateRandomHash()
                },
                {
                    "key": "speech_default_voice",
                    "value": generateRandomHash5 + " || en-US"
                },
                {
                    "key": "speech_voices_hash",
                    "value": generateRandomHash()
                },
                {
                    "key": "4ca87df3d1",
                    "value": "Ow=="
                },
                {
                    "key": "867e25e5d4",
                    "value": "Ow=="
                },
                {
                    "key": "d4a306884c",
                    "value": "Ow=="
                }
            ]
        },
        {
            "key": "fe",
            "value": [
                "DNT:unknown",
                "L:zh-CN",
                "D:24",
                "PR:2",
                "S:1680,1050",
                "AS:1680,1050",
                "TO:-480",
                "SS:true",
                "LS:true",
                "IDB:true",
                "B:false",
                "ODB:false",
                "CPUC:unknown",
                "PK:MacIntel",
                "CFP:-1608791517",
                "FR:false",
                "FOS:false",
                "FB:false",
                "JSF:",
                "P:Chrome PDF Viewer,Chromium PDF Viewer,Microsoft Edge PDF Viewer,PDF Viewer,WebKit built-in PDF",
                "T:0,false,false",
                "H:8",
                "SWF:false"
            ]
        },
        {
            "key": "ife_hash",
            "value": "35b4eb9b68c110df2b7e6c2239adbba9"
        },
        {
            "key": "jsbd",
            "value": "{\"HL\":49,\"NCE\":true,\"DT\":\"\",\"NWD\":\"false\",\"DMTO\":1,\"DOTO\":1}"
        }
    ]
    res = encrypt(ua, data)
    return res
}
// function generateRandomHash() {
//     const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'; // 包含小写字母和数字的字符集
//     const length = 32; // 目标字符串长度
//     let hash = '';
//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length); // 随机选择字符
//         hash += characters[randomIndex];
//     }
//     return hash;
// }
function generateRandomHash() {
    const characters = 'abcdef0123456789';
    const length = 32;
    let hash = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        hash += characters[randomIndex];
    }
    return hash;
}
function generateRandomHash5() {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'; // 包含小写字母和数字的字符集
    const length = 5; // 目标字符串长度
    let hash = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length); // 随机选择字符
        hash += characters[randomIndex];
    }
    return hash;
}
function generateAudioFingerprint() {
    // 随机生成一个类似浮点数的值，范围可以调整
    const min = 100; // 最小值
    const max = 200; // 最大值
    const randomValue = (Math.random() * (max - min) + min).toFixed(14); // 保留14位小数
    return randomValue;
}

var ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
console.log(getAirBnbbda(ua));

module.exports = {
    getAirBnbbda
};