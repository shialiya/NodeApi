
window = globalThis;
delete global;
delete globalThis;
delete buffer
self = window;
 function getdata(srpParams,password) {


     document = {
         referrer: '',
         cookie: '',
         toString: function () {
             return '[object HTMLDocument]';
         },
         createElement: function (event) {
             console.log("createElement===>", event)
             if (event === 'canvas') {
                 return canvas;
             }
             if (event === 'span') {
                 return {
                     classList: {
                         value: '',
                         length: 0
                     }
                 }
             }
             return div;
         },
         getElementById: function (event) {
             // console.log('getElementById===>',event);
             return div;
         },
         getElementsByTagName: function (event) {
             // console.log("getElementsByTagName ===>", event);
             return head;
         },
         getElementsByClassName: function (event) {
             // console.log("getElementsByClassName ===>", event);
             return {};
         },
         querySelector: function () {
             console.log("querySelector ===>", arguments);
             return script;
         },
         documentElement: function () {
             console.log("documentElement ===>", arguments);
             return script;
         },
         createEvent: function () {
             console.log("createEvent ===>", arguments);
             return div;
         },
     };

     navigator = {
         cookieEnabled: true,
         toString: function () {
             return '[object Navigator]';
         },
         webdriver: false,
         plugins: [{}],
         languages: ["zh-CN"],
         vendor: 'Google Inc.',
         hasOwnProperty: function (val) {
             console.log('navigator.hasOwnProperty', arguments)
             if (val == 'webdriver') {
                 return true
             }
         },
         userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
         appName: 'Netscape',
         appVersion: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'
     }

     document.contentType = 'text/html';
     document.documentElement = '<!DOCTYPE html><html><body></body></html>';
     setInterval = function () {
     }
     setTimeout = function () {
     }
     !function (t) {
         var e = {};

         function r(n) {
             if (e[n])
                 return e[n].exports;
             var i = e[n] = {
                 i: n,
                 l: !1,
                 exports: {}
             };
             console.log(n)
             return t[n].call(i.exports, i, i.exports, r),
                 i.l = !0,
                 i.exports
         }

         r.m = t,
             r.c = e,
             r.d = function (t, e, n) {
                 r.o(t, e) || Object.defineProperty(t, e, {
                     enumerable: !0,
                     get: n
                 })
             }
             ,
             r.r = function (t) {
                 "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                     value: "Module"
                 }),
                     Object.defineProperty(t, "__esModule", {
                         value: !0
                     })
             }
             ,
             r.t = function (t, e) {
                 if (1 & e && (t = r(t)),
                 8 & e)
                     return t;
                 if (4 & e && "object" == typeof t && t && t.__esModule)
                     return t;
                 var n = Object.create(null);
                 if (r.r(n),
                     Object.defineProperty(n, "default", {
                         enumerable: !0,
                         value: t
                     }),
                 2 & e && "string" != typeof t)
                     for (var i in t)
                         r.d(n, i, function (e) {
                             return t[e]
                         }
                             .bind(null, i));
                 return n
             }
             ,
             r.n = function (t) {
                 var e = t && t.__esModule ? function () {
                         return t.default
                     }
                     : function () {
                         return t
                     }
                 ;
                 return r.d(e, "a", e),
                     e
             }
             ,
             r.o = function (t, e) {
                 return Object.prototype.hasOwnProperty.call(t, e)
             }
             ,
             r.p = "";
         window.pick = r
     }({
         0: function (t, e, r) {
             (function () {
                     var e;

                     function r(t, e, r) {
                         null != t && ("number" == typeof t ? this.fromNumber(t, e, r) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
                     }

                     function n() {
                         return new r(null)
                     }

                     var i = "undefined" != typeof navigator;
                     i && "Microsoft Internet Explorer" == navigator.appName ? (r.prototype.am = function (t, e, r, n, i, o) {
                         for (var s = 32767 & e, a = e >> 15; --o >= 0;) {
                             var u = 32767 & this[t]
                                 , c = this[t++] >> 15
                                 , f = a * u + c * s;
                             i = ((u = s * u + ((32767 & f) << 15) + r[n] + (1073741823 & i)) >>> 30) + (f >>> 15) + a * c + (i >>> 30),
                                 r[n++] = 1073741823 & u
                         }
                         return i
                     }
                         ,
                         e = 30) : i && "Netscape" != navigator.appName ? (r.prototype.am = function (t, e, r, n, i, o) {
                         for (; --o >= 0;) {
                             var s = e * this[t++] + r[n] + i;
                             i = Math.floor(s / 67108864),
                                 r[n++] = 67108863 & s
                         }
                         return i
                     }
                         ,
                         e = 26) : (r.prototype.am = function (t, e, r, n, i, o) {
                         for (var s = 16383 & e, a = e >> 14; --o >= 0;) {
                             var u = 16383 & this[t]
                                 , c = this[t++] >> 14
                                 , f = a * u + c * s;
                             i = ((u = s * u + ((16383 & f) << 14) + r[n] + i) >> 28) + (f >> 14) + a * c,
                                 r[n++] = 268435455 & u
                         }
                         return i
                     }
                         ,
                         e = 28),
                         r.prototype.DB = e,
                         r.prototype.DM = (1 << e) - 1,
                         r.prototype.DV = 1 << e;
                     r.prototype.FV = Math.pow(2, 52),
                         r.prototype.F1 = 52 - e,
                         r.prototype.F2 = 2 * e - 52;
                     var o, s, a = new Array;
                     for (o = "0".charCodeAt(0),
                              s = 0; s <= 9; ++s)
                         a[o++] = s;
                     for (o = "a".charCodeAt(0),
                              s = 10; s < 36; ++s)
                         a[o++] = s;
                     for (o = "A".charCodeAt(0),
                              s = 10; s < 36; ++s)
                         a[o++] = s;

                     function u(t) {
                         return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t)
                     }

                     function c(t, e) {
                         var r = a[t.charCodeAt(e)];
                         return null == r ? -1 : r
                     }

                     function f(t) {
                         var e = n();
                         return e.fromInt(t),
                             e
                     }

                     function h(t) {
                         var e, r = 1;
                         return 0 != (e = t >>> 16) && (t = e,
                             r += 16),
                         0 != (e = t >> 8) && (t = e,
                             r += 8),
                         0 != (e = t >> 4) && (t = e,
                             r += 4),
                         0 != (e = t >> 2) && (t = e,
                             r += 2),
                         0 != (e = t >> 1) && (t = e,
                             r += 1),
                             r
                     }

                     function l(t) {
                         this.m = t
                     }

                     function p(t) {
                         this.m = t,
                             this.mp = t.invDigit(),
                             this.mpl = 32767 & this.mp,
                             this.mph = this.mp >> 15,
                             this.um = (1 << t.DB - 15) - 1,
                             this.mt2 = 2 * t.t
                     }

                     function d(t, e) {
                         return t & e
                     }

                     function v(t, e) {
                         return t | e
                     }

                     function y(t, e) {
                         return t ^ e
                     }

                     function m(t, e) {
                         return t & ~e
                     }

                     function g(t) {
                         if (0 == t)
                             return -1;
                         var e = 0;
                         return 0 == (65535 & t) && (t >>= 16,
                             e += 16),
                         0 == (255 & t) && (t >>= 8,
                             e += 8),
                         0 == (15 & t) && (t >>= 4,
                             e += 4),
                         0 == (3 & t) && (t >>= 2,
                             e += 2),
                         0 == (1 & t) && ++e,
                             e
                     }

                     function b(t) {
                         for (var e = 0; 0 != t;)
                             t &= t - 1,
                                 ++e;
                         return e
                     }

                     function w() {
                     }

                     function x(t) {
                         return t
                     }

                     function S(t) {
                         this.r2 = n(),
                             this.q3 = n(),
                             r.ONE.dlShiftTo(2 * t.t, this.r2),
                             this.mu = this.r2.divide(t),
                             this.m = t
                     }

                     l.prototype.convert = function (t) {
                         return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t
                     }
                         ,
                         l.prototype.revert = function (t) {
                             return t
                         }
                         ,
                         l.prototype.reduce = function (t) {
                             t.divRemTo(this.m, null, t)
                         }
                         ,
                         l.prototype.mulTo = function (t, e, r) {
                             t.multiplyTo(e, r),
                                 this.reduce(r)
                         }
                         ,
                         l.prototype.sqrTo = function (t, e) {
                             t.squareTo(e),
                                 this.reduce(e)
                         }
                         ,
                         p.prototype.convert = function (t) {
                             var e = n();
                             return t.abs().dlShiftTo(this.m.t, e),
                                 e.divRemTo(this.m, null, e),
                             t.s < 0 && e.compareTo(r.ZERO) > 0 && this.m.subTo(e, e),
                                 e
                         }
                         ,
                         p.prototype.revert = function (t) {
                             var e = n();
                             return t.copyTo(e),
                                 this.reduce(e),
                                 e
                         }
                         ,
                         p.prototype.reduce = function (t) {
                             for (; t.t <= this.mt2;)
                                 t[t.t++] = 0;
                             for (var e = 0; e < this.m.t; ++e) {
                                 var r = 32767 & t[e]
                                     ,
                                     n = r * this.mpl + ((r * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
                                 for (t[r = e + this.m.t] += this.m.am(0, n, t, e, 0, this.m.t); t[r] >= t.DV;)
                                     t[r] -= t.DV,
                                         t[++r]++
                             }
                             t.clamp(),
                                 t.drShiftTo(this.m.t, t),
                             t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
                         }
                         ,
                         p.prototype.mulTo = function (t, e, r) {
                             t.multiplyTo(e, r),
                                 this.reduce(r)
                         }
                         ,
                         p.prototype.sqrTo = function (t, e) {
                             t.squareTo(e),
                                 this.reduce(e)
                         }
                         ,
                         r.prototype.copyTo = function (t) {
                             for (var e = this.t - 1; e >= 0; --e)
                                 t[e] = this[e];
                             t.t = this.t,
                                 t.s = this.s
                         }
                         ,
                         r.prototype.fromInt = function (t) {
                             this.t = 1,
                                 this.s = t < 0 ? -1 : 0,
                                 t > 0 ? this[0] = t : t < -1 ? this[0] = t + this.DV : this.t = 0
                         }
                         ,
                         r.prototype.fromString = function (t, e) {
                             var n;
                             if (16 == e)
                                 n = 4;
                             else if (8 == e)
                                 n = 3;
                             else if (256 == e)
                                 n = 8;
                             else if (2 == e)
                                 n = 1;
                             else if (32 == e)
                                 n = 5;
                             else {
                                 if (4 != e)
                                     return void this.fromRadix(t, e);
                                 n = 2
                             }
                             this.t = 0,
                                 this.s = 0;
                             for (var i = t.length, o = !1, s = 0; --i >= 0;) {
                                 var a = 8 == n ? 255 & t[i] : c(t, i);
                                 a < 0 ? "-" == t.charAt(i) && (o = !0) : (o = !1,
                                     0 == s ? this[this.t++] = a : s + n > this.DB ? (this[this.t - 1] |= (a & (1 << this.DB - s) - 1) << s,
                                         this[this.t++] = a >> this.DB - s) : this[this.t - 1] |= a << s,
                                 (s += n) >= this.DB && (s -= this.DB))
                             }
                             8 == n && 0 != (128 & t[0]) && (this.s = -1,
                             s > 0 && (this[this.t - 1] |= (1 << this.DB - s) - 1 << s)),
                                 this.clamp(),
                             o && r.ZERO.subTo(this, this)
                         }
                         ,
                         r.prototype.clamp = function () {
                             for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t;)
                                 --this.t
                         }
                         ,
                         r.prototype.dlShiftTo = function (t, e) {
                             var r;
                             for (r = this.t - 1; r >= 0; --r)
                                 e[r + t] = this[r];
                             for (r = t - 1; r >= 0; --r)
                                 e[r] = 0;
                             e.t = this.t + t,
                                 e.s = this.s
                         }
                         ,
                         r.prototype.drShiftTo = function (t, e) {
                             for (var r = t; r < this.t; ++r)
                                 e[r - t] = this[r];
                             e.t = Math.max(this.t - t, 0),
                                 e.s = this.s
                         }
                         ,
                         r.prototype.lShiftTo = function (t, e) {
                             var r, n = t % this.DB, i = this.DB - n, o = (1 << i) - 1, s = Math.floor(t / this.DB),
                                 a = this.s << n & this.DM;
                             for (r = this.t - 1; r >= 0; --r)
                                 e[r + s + 1] = this[r] >> i | a,
                                     a = (this[r] & o) << n;
                             for (r = s - 1; r >= 0; --r)
                                 e[r] = 0;
                             e[s] = a,
                                 e.t = this.t + s + 1,
                                 e.s = this.s,
                                 e.clamp()
                         }
                         ,
                         r.prototype.rShiftTo = function (t, e) {
                             e.s = this.s;
                             var r = Math.floor(t / this.DB);
                             if (r >= this.t)
                                 e.t = 0;
                             else {
                                 var n = t % this.DB
                                     , i = this.DB - n
                                     , o = (1 << n) - 1;
                                 e[0] = this[r] >> n;
                                 for (var s = r + 1; s < this.t; ++s)
                                     e[s - r - 1] |= (this[s] & o) << i,
                                         e[s - r] = this[s] >> n;
                                 n > 0 && (e[this.t - r - 1] |= (this.s & o) << i),
                                     e.t = this.t - r,
                                     e.clamp()
                             }
                         }
                         ,
                         r.prototype.subTo = function (t, e) {
                             for (var r = 0, n = 0, i = Math.min(t.t, this.t); r < i;)
                                 n += this[r] - t[r],
                                     e[r++] = n & this.DM,
                                     n >>= this.DB;
                             if (t.t < this.t) {
                                 for (n -= t.s; r < this.t;)
                                     n += this[r],
                                         e[r++] = n & this.DM,
                                         n >>= this.DB;
                                 n += this.s
                             } else {
                                 for (n += this.s; r < t.t;)
                                     n -= t[r],
                                         e[r++] = n & this.DM,
                                         n >>= this.DB;
                                 n -= t.s
                             }
                             e.s = n < 0 ? -1 : 0,
                                 n < -1 ? e[r++] = this.DV + n : n > 0 && (e[r++] = n),
                                 e.t = r,
                                 e.clamp()
                         }
                         ,
                         r.prototype.multiplyTo = function (t, e) {
                             var n = this.abs()
                                 , i = t.abs()
                                 , o = n.t;
                             for (e.t = o + i.t; --o >= 0;)
                                 e[o] = 0;
                             for (o = 0; o < i.t; ++o)
                                 e[o + n.t] = n.am(0, i[o], e, o, 0, n.t);
                             e.s = 0,
                                 e.clamp(),
                             this.s != t.s && r.ZERO.subTo(e, e)
                         }
                         ,
                         r.prototype.squareTo = function (t) {
                             for (var e = this.abs(), r = t.t = 2 * e.t; --r >= 0;)
                                 t[r] = 0;
                             for (r = 0; r < e.t - 1; ++r) {
                                 var n = e.am(r, e[r], t, 2 * r, 0, 1);
                                 (t[r + e.t] += e.am(r + 1, 2 * e[r], t, 2 * r + 1, n, e.t - r - 1)) >= e.DV && (t[r + e.t] -= e.DV,
                                     t[r + e.t + 1] = 1)
                             }
                             t.t > 0 && (t[t.t - 1] += e.am(r, e[r], t, 2 * r, 0, 1)),
                                 t.s = 0,
                                 t.clamp()
                         }
                         ,
                         r.prototype.divRemTo = function (t, e, i) {
                             var o = t.abs();
                             if (!(o.t <= 0)) {
                                 var s = this.abs();
                                 if (s.t < o.t)
                                     return null != e && e.fromInt(0),
                                         void (null != i && this.copyTo(i));
                                 null == i && (i = n());
                                 var a = n()
                                     , u = this.s
                                     , c = t.s
                                     , f = this.DB - h(o[o.t - 1]);
                                 f > 0 ? (o.lShiftTo(f, a),
                                     s.lShiftTo(f, i)) : (o.copyTo(a),
                                     s.copyTo(i));
                                 var l = a.t
                                     , p = a[l - 1];
                                 if (0 != p) {
                                     var d = p * (1 << this.F1) + (l > 1 ? a[l - 2] >> this.F2 : 0)
                                         , v = this.FV / d
                                         , y = (1 << this.F1) / d
                                         , m = 1 << this.F2
                                         , g = i.t
                                         , b = g - l
                                         , w = null == e ? n() : e;
                                     for (a.dlShiftTo(b, w),
                                          i.compareTo(w) >= 0 && (i[i.t++] = 1,
                                              i.subTo(w, i)),
                                              r.ONE.dlShiftTo(l, w),
                                              w.subTo(a, a); a.t < l;)
                                         a[a.t++] = 0;
                                     for (; --b >= 0;) {
                                         var x = i[--g] == p ? this.DM : Math.floor(i[g] * v + (i[g - 1] + m) * y);
                                         if ((i[g] += a.am(0, x, i, b, 0, l)) < x)
                                             for (a.dlShiftTo(b, w),
                                                      i.subTo(w, i); i[g] < --x;)
                                                 i.subTo(w, i)
                                     }
                                     null != e && (i.drShiftTo(l, e),
                                     u != c && r.ZERO.subTo(e, e)),
                                         i.t = l,
                                         i.clamp(),
                                     f > 0 && i.rShiftTo(f, i),
                                     u < 0 && r.ZERO.subTo(i, i)
                                 }
                             }
                         }
                         ,
                         r.prototype.invDigit = function () {
                             if (this.t < 1)
                                 return 0;
                             var t = this[0];
                             if (0 == (1 & t))
                                 return 0;
                             var e = 3 & t;
                             return (e = (e = (e = (e = e * (2 - (15 & t) * e) & 15) * (2 - (255 & t) * e) & 255) * (2 - ((65535 & t) * e & 65535)) & 65535) * (2 - t * e % this.DV) % this.DV) > 0 ? this.DV - e : -e
                         }
                         ,
                         r.prototype.isEven = function () {
                             return 0 == (this.t > 0 ? 1 & this[0] : this.s)
                         }
                         ,
                         r.prototype.exp = function (t, e) {
                             if (t > 4294967295 || t < 1)
                                 return r.ONE;
                             var i = n()
                                 , o = n()
                                 , s = e.convert(this)
                                 , a = h(t) - 1;
                             for (s.copyTo(i); --a >= 0;)
                                 if (e.sqrTo(i, o),
                                 (t & 1 << a) > 0)
                                     e.mulTo(o, s, i);
                                 else {
                                     var u = i;
                                     i = o,
                                         o = u
                                 }
                             return e.revert(i)
                         }
                         ,
                         r.prototype.toString = function (t) {
                             if (this.s < 0)
                                 return "-" + this.negate().toString(t);
                             var e;
                             if (16 == t)
                                 e = 4;
                             else if (8 == t)
                                 e = 3;
                             else if (2 == t)
                                 e = 1;
                             else if (32 == t)
                                 e = 5;
                             else {
                                 if (4 != t)
                                     return this.toRadix(t);
                                 e = 2
                             }
                             var r, n = (1 << e) - 1, i = !1, o = "", s = this.t, a = this.DB - s * this.DB % e;
                             if (s-- > 0)
                                 for (a < this.DB && (r = this[s] >> a) > 0 && (i = !0,
                                     o = u(r)); s >= 0;)
                                     a < e ? (r = (this[s] & (1 << a) - 1) << e - a,
                                         r |= this[--s] >> (a += this.DB - e)) : (r = this[s] >> (a -= e) & n,
                                     a <= 0 && (a += this.DB,
                                         --s)),
                                     r > 0 && (i = !0),
                                     i && (o += u(r));
                             return i ? o : "0"
                         }
                         ,
                         r.prototype.negate = function () {
                             var t = n();
                             return r.ZERO.subTo(this, t),
                                 t
                         }
                         ,
                         r.prototype.abs = function () {
                             return this.s < 0 ? this.negate() : this
                         }
                         ,
                         r.prototype.compareTo = function (t) {
                             var e = this.s - t.s;
                             if (0 != e)
                                 return e;
                             var r = this.t;
                             if (0 != (e = r - t.t))
                                 return this.s < 0 ? -e : e;
                             for (; --r >= 0;)
                                 if (0 != (e = this[r] - t[r]))
                                     return e;
                             return 0
                         }
                         ,
                         r.prototype.bitLength = function () {
                             return this.t <= 0 ? 0 : this.DB * (this.t - 1) + h(this[this.t - 1] ^ this.s & this.DM)
                         }
                         ,
                         r.prototype.mod = function (t) {
                             var e = n();
                             return this.abs().divRemTo(t, null, e),
                             this.s < 0 && e.compareTo(r.ZERO) > 0 && t.subTo(e, e),
                                 e
                         }
                         ,
                         r.prototype.modPowInt = function (t, e) {
                             var r;
                             return r = t < 256 || e.isEven() ? new l(e) : new p(e),
                                 this.exp(t, r)
                         }
                         ,
                         r.ZERO = f(0),
                         r.ONE = f(1),
                         w.prototype.convert = x,
                         w.prototype.revert = x,
                         w.prototype.mulTo = function (t, e, r) {
                             t.multiplyTo(e, r)
                         }
                         ,
                         w.prototype.sqrTo = function (t, e) {
                             t.squareTo(e)
                         }
                         ,
                         S.prototype.convert = function (t) {
                             if (t.s < 0 || t.t > 2 * this.m.t)
                                 return t.mod(this.m);
                             if (t.compareTo(this.m) < 0)
                                 return t;
                             var e = n();
                             return t.copyTo(e),
                                 this.reduce(e),
                                 e
                         }
                         ,
                         S.prototype.revert = function (t) {
                             return t
                         }
                         ,
                         S.prototype.reduce = function (t) {
                             for (t.drShiftTo(this.m.t - 1, this.r2),
                                  t.t > this.m.t + 1 && (t.t = this.m.t + 1,
                                      t.clamp()),
                                      this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
                                      this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); t.compareTo(this.r2) < 0;)
                                 t.dAddOffset(1, this.m.t + 1);
                             for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0;)
                                 t.subTo(this.m, t)
                         }
                         ,
                         S.prototype.mulTo = function (t, e, r) {
                             t.multiplyTo(e, r),
                                 this.reduce(r)
                         }
                         ,
                         S.prototype.sqrTo = function (t, e) {
                             t.squareTo(e),
                                 this.reduce(e)
                         }
                     ;
                     var T, E, B,
                         A = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997],
                         k = (1 << 26) / A[A.length - 1];

                     function O() {
                         var t;
                         t = (new Date).getTime(),
                             E[B++] ^= 255 & t,
                             E[B++] ^= t >> 8 & 255,
                             E[B++] ^= t >> 16 & 255,
                             E[B++] ^= t >> 24 & 255,
                         B >= I && (B -= I)
                     }

                     if (r.prototype.chunkSize = function (t) {
                         return Math.floor(Math.LN2 * this.DB / Math.log(t))
                     }
                         ,
                         r.prototype.toRadix = function (t) {
                             if (null == t && (t = 10),
                             0 == this.signum() || t < 2 || t > 36)
                                 return "0";
                             var e = this.chunkSize(t)
                                 , r = Math.pow(t, e)
                                 , i = f(r)
                                 , o = n()
                                 , s = n()
                                 , a = "";
                             for (this.divRemTo(i, o, s); o.signum() > 0;)
                                 a = (r + s.intValue()).toString(t).substr(1) + a,
                                     o.divRemTo(i, o, s);
                             return s.intValue().toString(t) + a
                         }
                         ,
                         r.prototype.fromRadix = function (t, e) {
                             this.fromInt(0),
                             null == e && (e = 10);
                             for (var n = this.chunkSize(e), i = Math.pow(e, n), o = !1, s = 0, a = 0, u = 0; u < t.length; ++u) {
                                 var f = c(t, u);
                                 f < 0 ? "-" == t.charAt(u) && 0 == this.signum() && (o = !0) : (a = e * a + f,
                                 ++s >= n && (this.dMultiply(i),
                                     this.dAddOffset(a, 0),
                                     s = 0,
                                     a = 0))
                             }
                             s > 0 && (this.dMultiply(Math.pow(e, s)),
                                 this.dAddOffset(a, 0)),
                             o && r.ZERO.subTo(this, this)
                         }
                         ,
                         r.prototype.fromNumber = function (t, e, n) {
                             if ("number" == typeof e)
                                 if (t < 2)
                                     this.fromInt(1);
                                 else
                                     for (this.fromNumber(t, n),
                                          this.testBit(t - 1) || this.bitwiseTo(r.ONE.shiftLeft(t - 1), v, this),
                                          this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(e);)
                                         this.dAddOffset(2, 0),
                                         this.bitLength() > t && this.subTo(r.ONE.shiftLeft(t - 1), this);
                             else {
                                 var i = new Array
                                     , o = 7 & t;
                                 i.length = 1 + (t >> 3),
                                     e.nextBytes(i),
                                     o > 0 ? i[0] &= (1 << o) - 1 : i[0] = 0,
                                     this.fromString(i, 256)
                             }
                         }
                         ,
                         r.prototype.bitwiseTo = function (t, e, r) {
                             var n, i, o = Math.min(t.t, this.t);
                             for (n = 0; n < o; ++n)
                                 r[n] = e(this[n], t[n]);
                             if (t.t < this.t) {
                                 for (i = t.s & this.DM,
                                          n = o; n < this.t; ++n)
                                     r[n] = e(this[n], i);
                                 r.t = this.t
                             } else {
                                 for (i = this.s & this.DM,
                                          n = o; n < t.t; ++n)
                                     r[n] = e(i, t[n]);
                                 r.t = t.t
                             }
                             r.s = e(this.s, t.s),
                                 r.clamp()
                         }
                         ,
                         r.prototype.changeBit = function (t, e) {
                             var n = r.ONE.shiftLeft(t);
                             return this.bitwiseTo(n, e, n),
                                 n
                         }
                         ,
                         r.prototype.addTo = function (t, e) {
                             for (var r = 0, n = 0, i = Math.min(t.t, this.t); r < i;)
                                 n += this[r] + t[r],
                                     e[r++] = n & this.DM,
                                     n >>= this.DB;
                             if (t.t < this.t) {
                                 for (n += t.s; r < this.t;)
                                     n += this[r],
                                         e[r++] = n & this.DM,
                                         n >>= this.DB;
                                 n += this.s
                             } else {
                                 for (n += this.s; r < t.t;)
                                     n += t[r],
                                         e[r++] = n & this.DM,
                                         n >>= this.DB;
                                 n += t.s
                             }
                             e.s = n < 0 ? -1 : 0,
                                 n > 0 ? e[r++] = n : n < -1 && (e[r++] = this.DV + n),
                                 e.t = r,
                                 e.clamp()
                         }
                         ,
                         r.prototype.dMultiply = function (t) {
                             this[this.t] = this.am(0, t - 1, this, 0, 0, this.t),
                                 ++this.t,
                                 this.clamp()
                         }
                         ,
                         r.prototype.dAddOffset = function (t, e) {
                             if (0 != t) {
                                 for (; this.t <= e;)
                                     this[this.t++] = 0;
                                 for (this[e] += t; this[e] >= this.DV;)
                                     this[e] -= this.DV,
                                     ++e >= this.t && (this[this.t++] = 0),
                                         ++this[e]
                             }
                         }
                         ,
                         r.prototype.multiplyLowerTo = function (t, e, r) {
                             var n, i = Math.min(this.t + t.t, e);
                             for (r.s = 0,
                                      r.t = i; i > 0;)
                                 r[--i] = 0;
                             for (n = r.t - this.t; i < n; ++i)
                                 r[i + this.t] = this.am(0, t[i], r, i, 0, this.t);
                             for (n = Math.min(t.t, e); i < n; ++i)
                                 this.am(0, t[i], r, i, 0, e - i);
                             r.clamp()
                         }
                         ,
                         r.prototype.multiplyUpperTo = function (t, e, r) {
                             --e;
                             var n = r.t = this.t + t.t - e;
                             for (r.s = 0; --n >= 0;)
                                 r[n] = 0;
                             for (n = Math.max(e - this.t, 0); n < t.t; ++n)
                                 r[this.t + n - e] = this.am(e - n, t[n], r, 0, 0, this.t + n - e);
                             r.clamp(),
                                 r.drShiftTo(1, r)
                         }
                         ,
                         r.prototype.modInt = function (t) {
                             if (t <= 0)
                                 return 0;
                             var e = this.DV % t
                                 , r = this.s < 0 ? t - 1 : 0;
                             if (this.t > 0)
                                 if (0 == e)
                                     r = this[0] % t;
                                 else
                                     for (var n = this.t - 1; n >= 0; --n)
                                         r = (e * r + this[n]) % t;
                             return r
                         }
                         ,
                         r.prototype.millerRabin = function (t) {
                             var e = this.subtract(r.ONE)
                                 , i = e.getLowestSetBit();
                             if (i <= 0)
                                 return !1;
                             var o = e.shiftRight(i);
                             (t = t + 1 >> 1) > A.length && (t = A.length);
                             for (var s = n(), a = 0; a < t; ++a) {
                                 s.fromInt(A[Math.floor(Math.random() * A.length)]);
                                 var u = s.modPow(o, this);
                                 if (0 != u.compareTo(r.ONE) && 0 != u.compareTo(e)) {
                                     for (var c = 1; c++ < i && 0 != u.compareTo(e);)
                                         if (0 == (u = u.modPowInt(2, this)).compareTo(r.ONE))
                                             return !1;
                                     if (0 != u.compareTo(e))
                                         return !1
                                 }
                             }
                             return !0
                         }
                         ,
                         r.prototype.clone = function () {
                             var t = n();
                             return this.copyTo(t),
                                 t
                         }
                         ,
                         r.prototype.intValue = function () {
                             if (this.s < 0) {
                                 if (1 == this.t)
                                     return this[0] - this.DV;
                                 if (0 == this.t)
                                     return -1
                             } else {
                                 if (1 == this.t)
                                     return this[0];
                                 if (0 == this.t)
                                     return 0
                             }
                             return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
                         }
                         ,
                         r.prototype.byteValue = function () {
                             return 0 == this.t ? this.s : this[0] << 24 >> 24
                         }
                         ,
                         r.prototype.shortValue = function () {
                             return 0 == this.t ? this.s : this[0] << 16 >> 16
                         }
                         ,
                         r.prototype.signum = function () {
                             return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1
                         }
                         ,
                         r.prototype.toByteArray = function () {
                             var t = this.t
                                 , e = new Array;
                             e[0] = this.s;
                             var r, n = this.DB - t * this.DB % 8, i = 0;
                             if (t-- > 0)
                                 for (n < this.DB && (r = this[t] >> n) != (this.s & this.DM) >> n && (e[i++] = r | this.s << this.DB - n); t >= 0;)
                                     n < 8 ? (r = (this[t] & (1 << n) - 1) << 8 - n,
                                         r |= this[--t] >> (n += this.DB - 8)) : (r = this[t] >> (n -= 8) & 255,
                                     n <= 0 && (n += this.DB,
                                         --t)),
                                     0 != (128 & r) && (r |= -256),
                                     0 == i && (128 & this.s) != (128 & r) && ++i,
                                     (i > 0 || r != this.s) && (e[i++] = r);
                             return e
                         }
                         ,
                         r.prototype.equals = function (t) {
                             return 0 == this.compareTo(t)
                         }
                         ,
                         r.prototype.min = function (t) {
                             return this.compareTo(t) < 0 ? this : t
                         }
                         ,
                         r.prototype.max = function (t) {
                             return this.compareTo(t) > 0 ? this : t
                         }
                         ,
                         r.prototype.and = function (t) {
                             var e = n();
                             return this.bitwiseTo(t, d, e),
                                 e
                         }
                         ,
                         r.prototype.or = function (t) {
                             var e = n();
                             return this.bitwiseTo(t, v, e),
                                 e
                         }
                         ,
                         r.prototype.xor = function (t) {
                             var e = n();
                             return this.bitwiseTo(t, y, e),
                                 e
                         }
                         ,
                         r.prototype.andNot = function (t) {
                             var e = n();
                             return this.bitwiseTo(t, m, e),
                                 e
                         }
                         ,
                         r.prototype.not = function () {
                             for (var t = n(), e = 0; e < this.t; ++e)
                                 t[e] = this.DM & ~this[e];
                             return t.t = this.t,
                                 t.s = ~this.s,
                                 t
                         }
                         ,
                         r.prototype.shiftLeft = function (t) {
                             var e = n();
                             return t < 0 ? this.rShiftTo(-t, e) : this.lShiftTo(t, e),
                                 e
                         }
                         ,
                         r.prototype.shiftRight = function (t) {
                             var e = n();
                             return t < 0 ? this.lShiftTo(-t, e) : this.rShiftTo(t, e),
                                 e
                         }
                         ,
                         r.prototype.getLowestSetBit = function () {
                             for (var t = 0; t < this.t; ++t)
                                 if (0 != this[t])
                                     return t * this.DB + g(this[t]);
                             return this.s < 0 ? this.t * this.DB : -1
                         }
                         ,
                         r.prototype.bitCount = function () {
                             for (var t = 0, e = this.s & this.DM, r = 0; r < this.t; ++r)
                                 t += b(this[r] ^ e);
                             return t
                         }
                         ,
                         r.prototype.testBit = function (t) {
                             var e = Math.floor(t / this.DB);
                             return e >= this.t ? 0 != this.s : 0 != (this[e] & 1 << t % this.DB)
                         }
                         ,
                         r.prototype.setBit = function (t) {
                             return this.changeBit(t, v)
                         }
                         ,
                         r.prototype.clearBit = function (t) {
                             return this.changeBit(t, m)
                         }
                         ,
                         r.prototype.flipBit = function (t) {
                             return this.changeBit(t, y)
                         }
                         ,
                         r.prototype.add = function (t) {
                             var e = n();
                             return this.addTo(t, e),
                                 e
                         }
                         ,
                         r.prototype.subtract = function (t) {
                             var e = n();
                             return this.subTo(t, e),
                                 e
                         }
                         ,
                         r.prototype.multiply = function (t) {
                             var e = n();
                             return this.multiplyTo(t, e),
                                 e
                         }
                         ,
                         r.prototype.divide = function (t) {
                             var e = n();
                             return this.divRemTo(t, e, null),
                                 e
                         }
                         ,
                         r.prototype.remainder = function (t) {
                             var e = n();
                             return this.divRemTo(t, null, e),
                                 e
                         }
                         ,
                         r.prototype.divideAndRemainder = function (t) {
                             var e = n()
                                 , r = n();
                             return this.divRemTo(t, e, r),
                                 new Array(e, r)
                         }
                         ,
                         r.prototype.modPow = function (t, e) {
                             var r, i, o = t.bitLength(), s = f(1);
                             if (o <= 0)
                                 return s;
                             r = o < 18 ? 1 : o < 48 ? 3 : o < 144 ? 4 : o < 768 ? 5 : 6,
                                 i = o < 8 ? new l(e) : e.isEven() ? new S(e) : new p(e);
                             var a = new Array
                                 , u = 3
                                 , c = r - 1
                                 , d = (1 << r) - 1;
                             if (a[1] = i.convert(this),
                             r > 1) {
                                 var v = n();
                                 for (i.sqrTo(a[1], v); u <= d;)
                                     a[u] = n(),
                                         i.mulTo(v, a[u - 2], a[u]),
                                         u += 2
                             }
                             var y, m, g = t.t - 1, b = !0, w = n();
                             for (o = h(t[g]) - 1; g >= 0;) {
                                 for (o >= c ? y = t[g] >> o - c & d : (y = (t[g] & (1 << o + 1) - 1) << c - o,
                                 g > 0 && (y |= t[g - 1] >> this.DB + o - c)),
                                          u = r; 0 == (1 & y);)
                                     y >>= 1,
                                         --u;
                                 if ((o -= u) < 0 && (o += this.DB,
                                     --g),
                                     b)
                                     a[y].copyTo(s),
                                         b = !1;
                                 else {
                                     for (; u > 1;)
                                         i.sqrTo(s, w),
                                             i.sqrTo(w, s),
                                             u -= 2;
                                     u > 0 ? i.sqrTo(s, w) : (m = s,
                                         s = w,
                                         w = m),
                                         i.mulTo(w, a[y], s)
                                 }
                                 for (; g >= 0 && 0 == (t[g] & 1 << o);)
                                     i.sqrTo(s, w),
                                         m = s,
                                         s = w,
                                         w = m,
                                     --o < 0 && (o = this.DB - 1,
                                         --g)
                             }
                             return i.revert(s)
                         }
                         ,
                         r.prototype.modInverse = function (t) {
                             var e = t.isEven();
                             if (this.isEven() && e || 0 == t.signum())
                                 return r.ZERO;
                             for (var n = t.clone(), i = this.clone(), o = f(1), s = f(0), a = f(0), u = f(1); 0 != n.signum();) {
                                 for (; n.isEven();)
                                     n.rShiftTo(1, n),
                                         e ? (o.isEven() && s.isEven() || (o.addTo(this, o),
                                             s.subTo(t, s)),
                                             o.rShiftTo(1, o)) : s.isEven() || s.subTo(t, s),
                                         s.rShiftTo(1, s);
                                 for (; i.isEven();)
                                     i.rShiftTo(1, i),
                                         e ? (a.isEven() && u.isEven() || (a.addTo(this, a),
                                             u.subTo(t, u)),
                                             a.rShiftTo(1, a)) : u.isEven() || u.subTo(t, u),
                                         u.rShiftTo(1, u);
                                 n.compareTo(i) >= 0 ? (n.subTo(i, n),
                                 e && o.subTo(a, o),
                                     s.subTo(u, s)) : (i.subTo(n, i),
                                 e && a.subTo(o, a),
                                     u.subTo(s, u))
                             }
                             return 0 != i.compareTo(r.ONE) ? r.ZERO : u.compareTo(t) >= 0 ? u.subtract(t) : u.signum() < 0 ? (u.addTo(t, u),
                                 u.signum() < 0 ? u.add(t) : u) : u
                         }
                         ,
                         r.prototype.pow = function (t) {
                             return this.exp(t, new w)
                         }
                         ,
                         r.prototype.gcd = function (t) {
                             var e = this.s < 0 ? this.negate() : this.clone()
                                 , r = t.s < 0 ? t.negate() : t.clone();
                             if (e.compareTo(r) < 0) {
                                 var n = e;
                                 e = r,
                                     r = n
                             }
                             var i = e.getLowestSetBit()
                                 , o = r.getLowestSetBit();
                             if (o < 0)
                                 return e;
                             for (i < o && (o = i),
                                  o > 0 && (e.rShiftTo(o, e),
                                      r.rShiftTo(o, r)); e.signum() > 0;)
                                 (i = e.getLowestSetBit()) > 0 && e.rShiftTo(i, e),
                                 (i = r.getLowestSetBit()) > 0 && r.rShiftTo(i, r),
                                     e.compareTo(r) >= 0 ? (e.subTo(r, e),
                                         e.rShiftTo(1, e)) : (r.subTo(e, r),
                                         r.rShiftTo(1, r));
                             return o > 0 && r.lShiftTo(o, r),
                                 r
                         }
                         ,
                         r.prototype.isProbablePrime = function (t) {
                             var e, r = this.abs();
                             if (1 == r.t && r[0] <= A[A.length - 1]) {
                                 for (e = 0; e < A.length; ++e)
                                     if (r[0] == A[e])
                                         return !0;
                                 return !1
                             }
                             if (r.isEven())
                                 return !1;
                             for (e = 1; e < A.length;) {
                                 for (var n = A[e], i = e + 1; i < A.length && n < k;)
                                     n *= A[i++];
                                 for (n = r.modInt(n); e < i;)
                                     if (n % A[e++] == 0)
                                         return !1
                             }
                             return r.millerRabin(t)
                         }
                         ,
                         r.prototype.square = function () {
                             var t = n();
                             return this.squareTo(t),
                                 t
                         }
                         ,
                         r.prototype.Barrett = S,
                     null == E) {
                         var M;
                         if (E = new Array,
                             B = 0,
                         "undefined" != typeof window && window.crypto)
                             if (window.crypto.getRandomValues) {
                                 var P = new Uint8Array(32);
                                 for (window.crypto.getRandomValues(P),
                                          M = 0; M < 32; ++M)
                                     E[B++] = P[M]
                             } else if ("Netscape" == navigator.appName && navigator.appVersion < "5") {
                                 var D = window.crypto.random(32);
                                 for (M = 0; M < D.length; ++M)
                                     E[B++] = 255 & D.charCodeAt(M)
                             }
                         for (; B < I;)
                             M = Math.floor(65536 * Math.random()),
                                 E[B++] = M >>> 8,
                                 E[B++] = 255 & M;
                         B = 0,
                             O()
                     }

                     function L() {
                         if (null == T) {
                             for (O(),
                                      (T = new j).init(E),
                                      B = 0; B < E.length; ++B)
                                 E[B] = 0;
                             B = 0
                         }
                         return T.next()
                     }

                     function R() {
                     }

                     function j() {
                         this.i = 0,
                             this.j = 0,
                             this.S = new Array
                     }

                     R.prototype.nextBytes = function (t) {
                         var e;
                         for (e = 0; e < t.length; ++e)
                             t[e] = L()
                     }
                         ,
                         j.prototype.init = function (t) {
                             var e, r, n;
                             for (e = 0; e < 256; ++e)
                                 this.S[e] = e;
                             for (r = 0,
                                      e = 0; e < 256; ++e)
                                 r = r + this.S[e] + t[e % t.length] & 255,
                                     n = this.S[e],
                                     this.S[e] = this.S[r],
                                     this.S[r] = n;
                             this.i = 0,
                                 this.j = 0
                         }
                         ,
                         j.prototype.next = function () {
                             var t;
                             return this.i = this.i + 1 & 255,
                                 this.j = this.j + this.S[this.i] & 255,
                                 t = this.S[this.i],
                                 this.S[this.i] = this.S[this.j],
                                 this.S[this.j] = t,
                                 this.S[t + this.S[this.i] & 255]
                         }
                     ;
                     var I = 256;
                     t.exports = {
                         default: r,
                         BigInteger: r,
                         SecureRandom: R
                     }
                 }
             ).call(this)
         },
         2: function (t, e, r) {
             t.exports = function (t) {
                 var e = {};

                 function r(n) {
                     if (e[n])
                         return e[n].exports;
                     var i = e[n] = {
                         i: n,
                         l: !1,
                         exports: {}
                     };
                     return t[n].call(i.exports, i, i.exports, r),
                         i.l = !0,
                         i.exports
                 }

                 window.pick_2 = r
                 return r.m = t,
                     r.c = e,
                     r.d = function (t, e, n) {
                         r.o(t, e) || Object.defineProperty(t, e, {
                             enumerable: !0,
                             get: n
                         })
                     }
                     ,
                     r.r = function (t) {
                         "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                             value: "Module"
                         }),
                             Object.defineProperty(t, "__esModule", {
                                 value: !0
                             })
                     }
                     ,
                     r.t = function (t, e) {
                         if (1 & e && (t = r(t)),
                         8 & e)
                             return t;
                         if (4 & e && "object" == typeof t && t && t.__esModule)
                             return t;
                         var n = Object.create(null);
                         if (r.r(n),
                             Object.defineProperty(n, "default", {
                                 enumerable: !0,
                                 value: t
                             }),
                         2 & e && "string" != typeof t)
                             for (var i in t)
                                 r.d(n, i, function (e) {
                                     return t[e]
                                 }
                                     .bind(null, i));
                         return n
                     }
                     ,
                     r.n = function (t) {
                         var e = t && t.__esModule ? function () {
                                 return t.default
                             }
                             : function () {
                                 return t
                             }
                         ;
                         return r.d(e, "a", e),
                             e
                     }
                     ,
                     r.o = function (t, e) {
                         return Object.prototype.hasOwnProperty.call(t, e)
                     }
                     ,
                     r.p = "",
                     r(r.s = 126);

             }([function (t, e, r) {
                 "use strict";
                 (function (t) {
                         r.d(e, "a", (function () {
                                 return u
                             }
                         ));
                         var n = r(29)
                             , i = r.n(n)
                             , o = r(1)
                             , s = r(69);

                         function a(t, e) {
                             for (var r = 0; r < e.length; r++) {
                                 var n = e[r];
                                 n.enumerable = n.enumerable || !1,
                                     n.configurable = !0,
                                 "value" in n && (n.writable = !0),
                                     Object.defineProperty(t, n.key, n)
                             }
                         }

                         var u = function () {
                             function e() {
                                 !function (t, e) {
                                     if (!(t instanceof e))
                                         throw new TypeError("Cannot call a class as a function")
                                 }(this, e)
                             }

                             var r, n;
                             return r = e,
                             (n = [{
                                 key: "stringToArrayBuffer",
                                 value: function (t) {
                                     return new s.TextEncoder("utf-8").encode(t)
                                 }
                             }, {
                                 key: "hexStringToArrayBufferBE",
                                 value: function (e) {
                                     var r = e.length;
                                     return t.from(e.padStart(r, "0").slice(0, r), "hex")
                                 }
                             }, {
                                 key: "hexStringToArrayBufferLE",
                                 value: function (e) {
                                     var r = e.length
                                         , n = t.from(e.padStart(r, "0").slice(0, r), "hex");
                                     return i()(n),
                                         n
                                 }
                             }, {
                                 key: "signedBigIntegerToUnsigned",
                                 value: function (t, e) {
                                     return t.andNot(new o.BigInteger("-1").shiftLeft(8 * e))
                                 }
                             }, {
                                 key: "arrayBufferToHexString",
                                 value: function (t) {
                                     for (var e, r = t, n = "", i = 0; i < r.byteLength; i++)
                                         (e = r[i].toString(16)).length < 2 && (e = "0" + e),
                                             n += e;
                                     return n
                                 }
                             }, {
                                 key: "byteArrayToInteger",
                                 value: function (t) {
                                     for (var e = 0, r = 0; r < 4; r++) {
                                         var n = 8 * (3 - r);
                                         e += (255 & t[r]) << n
                                     }
                                     return e
                                 }
                             }, {
                                 key: "bufferToBigNumberLE",
                                 value: function (e) {
                                     var r = t.from(e);
                                     i()(r);
                                     var n = r.toString("hex");
                                     return 0 === n.length ? new o.BigInteger(0) : new o.BigInteger(n, 16)
                                 }
                             }, {
                                 key: "bufferToBigNumberBE",
                                 value: function (e) {
                                     var r = t.from(e).toString("hex");
                                     return 0 === r.length ? new o.BigInteger(0) : new o.BigInteger(r, 16)
                                 }
                             }, {
                                 key: "bigNumbertoBufferBE",
                                 value: function (e, r) {
                                     var n = e.toString(16);
                                     return t.from(n.padStart(2 * r, "0").slice(0, 2 * r), "hex")
                                 }
                             }, {
                                 key: "bigNumbertoBufferLE",
                                 value: function (e, r) {
                                     var n = e.toString(16)
                                         , o = t.from(n.padStart(2 * r, "0").slice(0, 2 * r), "hex");
                                     return i()(o),
                                         o
                                 }
                             }]) && a(r, n),
                                 e
                         }()
                     }
                 ).call(this, r(120).Buffer)
             }
                 , function (t, e, r) {
                     (function () {
                             var e;

                             function r(t, e, r) {
                                 null != t && ("number" == typeof t ? this.fromNumber(t, e, r) : null == e && "string" != typeof t ? this.fromString(t, 256) : this.fromString(t, e))
                             }

                             function n() {
                                 return new r(null)
                             }

                             var i = "undefined" != typeof navigator;
                             i && "Microsoft Internet Explorer" == navigator.appName ? (r.prototype.am = function (t, e, r, n, i, o) {
                                 for (var s = 32767 & e, a = e >> 15; --o >= 0;) {
                                     var u = 32767 & this[t]
                                         , c = this[t++] >> 15
                                         , f = a * u + c * s;
                                     i = ((u = s * u + ((32767 & f) << 15) + r[n] + (1073741823 & i)) >>> 30) + (f >>> 15) + a * c + (i >>> 30),
                                         r[n++] = 1073741823 & u
                                 }
                                 return i
                             }
                                 ,
                                 e = 30) : i && "Netscape" != navigator.appName ? (r.prototype.am = function (t, e, r, n, i, o) {
                                 for (; --o >= 0;) {
                                     var s = e * this[t++] + r[n] + i;
                                     i = Math.floor(s / 67108864),
                                         r[n++] = 67108863 & s
                                 }
                                 return i
                             }
                                 ,
                                 e = 26) : (r.prototype.am = function (t, e, r, n, i, o) {
                                 for (var s = 16383 & e, a = e >> 14; --o >= 0;) {
                                     var u = 16383 & this[t]
                                         , c = this[t++] >> 14
                                         , f = a * u + c * s;
                                     i = ((u = s * u + ((16383 & f) << 14) + r[n] + i) >> 28) + (f >> 14) + a * c,
                                         r[n++] = 268435455 & u
                                 }
                                 return i
                             }
                                 ,
                                 e = 28),
                                 r.prototype.DB = e,
                                 r.prototype.DM = (1 << e) - 1,
                                 r.prototype.DV = 1 << e,
                                 r.prototype.FV = Math.pow(2, 52),
                                 r.prototype.F1 = 52 - e,
                                 r.prototype.F2 = 2 * e - 52;
                             var o, s, a = new Array;
                             for (o = "0".charCodeAt(0),
                                      s = 0; s <= 9; ++s)
                                 a[o++] = s;
                             for (o = "a".charCodeAt(0),
                                      s = 10; s < 36; ++s)
                                 a[o++] = s;
                             for (o = "A".charCodeAt(0),
                                      s = 10; s < 36; ++s)
                                 a[o++] = s;

                             function u(t) {
                                 return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t)
                             }

                             function c(t, e) {
                                 var r = a[t.charCodeAt(e)];
                                 return null == r ? -1 : r
                             }

                             function f(t) {
                                 var e = n();
                                 return e.fromInt(t),
                                     e
                             }

                             function h(t) {
                                 var e, r = 1;
                                 return 0 != (e = t >>> 16) && (t = e,
                                     r += 16),
                                 0 != (e = t >> 8) && (t = e,
                                     r += 8),
                                 0 != (e = t >> 4) && (t = e,
                                     r += 4),
                                 0 != (e = t >> 2) && (t = e,
                                     r += 2),
                                 0 != (e = t >> 1) && (t = e,
                                     r += 1),
                                     r
                             }

                             function l(t) {
                                 this.m = t
                             }

                             function p(t) {
                                 this.m = t,
                                     this.mp = t.invDigit(),
                                     this.mpl = 32767 & this.mp,
                                     this.mph = this.mp >> 15,
                                     this.um = (1 << t.DB - 15) - 1,
                                     this.mt2 = 2 * t.t
                             }

                             function d(t, e) {
                                 return t & e
                             }

                             function v(t, e) {
                                 return t | e
                             }

                             function y(t, e) {
                                 return t ^ e
                             }

                             function m(t, e) {
                                 return t & ~e
                             }

                             function g(t) {
                                 if (0 == t)
                                     return -1;
                                 var e = 0;
                                 return 0 == (65535 & t) && (t >>= 16,
                                     e += 16),
                                 0 == (255 & t) && (t >>= 8,
                                     e += 8),
                                 0 == (15 & t) && (t >>= 4,
                                     e += 4),
                                 0 == (3 & t) && (t >>= 2,
                                     e += 2),
                                 0 == (1 & t) && ++e,
                                     e
                             }

                             function b(t) {
                                 for (var e = 0; 0 != t;)
                                     t &= t - 1,
                                         ++e;
                                 return e
                             }

                             function w() {
                             }

                             function x(t) {
                                 return t
                             }

                             function S(t) {
                                 this.r2 = n(),
                                     this.q3 = n(),
                                     r.ONE.dlShiftTo(2 * t.t, this.r2),
                                     this.mu = this.r2.divide(t),
                                     this.m = t
                             }

                             l.prototype.convert = function (t) {
                                 return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t
                             }
                                 ,
                                 l.prototype.revert = function (t) {
                                     return t
                                 }
                                 ,
                                 l.prototype.reduce = function (t) {
                                     t.divRemTo(this.m, null, t)
                                 }
                                 ,
                                 l.prototype.mulTo = function (t, e, r) {
                                     t.multiplyTo(e, r),
                                         this.reduce(r)
                                 }
                                 ,
                                 l.prototype.sqrTo = function (t, e) {
                                     t.squareTo(e),
                                         this.reduce(e)
                                 }
                                 ,
                                 p.prototype.convert = function (t) {
                                     var e = n();
                                     return t.abs().dlShiftTo(this.m.t, e),
                                         e.divRemTo(this.m, null, e),
                                     t.s < 0 && e.compareTo(r.ZERO) > 0 && this.m.subTo(e, e),
                                         e
                                 }
                                 ,
                                 p.prototype.revert = function (t) {
                                     var e = n();
                                     return t.copyTo(e),
                                         this.reduce(e),
                                         e
                                 }
                                 ,
                                 p.prototype.reduce = function (t) {
                                     for (; t.t <= this.mt2;)
                                         t[t.t++] = 0;
                                     for (var e = 0; e < this.m.t; ++e) {
                                         var r = 32767 & t[e]
                                             ,
                                             n = r * this.mpl + ((r * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
                                         for (t[r = e + this.m.t] += this.m.am(0, n, t, e, 0, this.m.t); t[r] >= t.DV;)
                                             t[r] -= t.DV,
                                                 t[++r]++
                                     }
                                     t.clamp(),
                                         t.drShiftTo(this.m.t, t),
                                     t.compareTo(this.m) >= 0 && t.subTo(this.m, t)
                                 }
                                 ,
                                 p.prototype.mulTo = function (t, e, r) {
                                     t.multiplyTo(e, r),
                                         this.reduce(r)
                                 }
                                 ,
                                 p.prototype.sqrTo = function (t, e) {
                                     t.squareTo(e),
                                         this.reduce(e)
                                 }
                                 ,
                                 r.prototype.copyTo = function (t) {
                                     for (var e = this.t - 1; e >= 0; --e)
                                         t[e] = this[e];
                                     t.t = this.t,
                                         t.s = this.s
                                 }
                                 ,
                                 r.prototype.fromInt = function (t) {
                                     this.t = 1,
                                         this.s = t < 0 ? -1 : 0,
                                         t > 0 ? this[0] = t : t < -1 ? this[0] = t + this.DV : this.t = 0
                                 }
                                 ,
                                 r.prototype.fromString = function (t, e) {
                                     var n;
                                     if (16 == e)
                                         n = 4;
                                     else if (8 == e)
                                         n = 3;
                                     else if (256 == e)
                                         n = 8;
                                     else if (2 == e)
                                         n = 1;
                                     else if (32 == e)
                                         n = 5;
                                     else {
                                         if (4 != e)
                                             return void this.fromRadix(t, e);
                                         n = 2
                                     }
                                     this.t = 0,
                                         this.s = 0;
                                     for (var i = t.length, o = !1, s = 0; --i >= 0;) {
                                         var a = 8 == n ? 255 & t[i] : c(t, i);
                                         a < 0 ? "-" == t.charAt(i) && (o = !0) : (o = !1,
                                             0 == s ? this[this.t++] = a : s + n > this.DB ? (this[this.t - 1] |= (a & (1 << this.DB - s) - 1) << s,
                                                 this[this.t++] = a >> this.DB - s) : this[this.t - 1] |= a << s,
                                         (s += n) >= this.DB && (s -= this.DB))
                                     }
                                     8 == n && 0 != (128 & t[0]) && (this.s = -1,
                                     s > 0 && (this[this.t - 1] |= (1 << this.DB - s) - 1 << s)),
                                         this.clamp(),
                                     o && r.ZERO.subTo(this, this)
                                 }
                                 ,
                                 r.prototype.clamp = function () {
                                     for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t;)
                                         --this.t
                                 }
                                 ,
                                 r.prototype.dlShiftTo = function (t, e) {
                                     var r;
                                     for (r = this.t - 1; r >= 0; --r)
                                         e[r + t] = this[r];
                                     for (r = t - 1; r >= 0; --r)
                                         e[r] = 0;
                                     e.t = this.t + t,
                                         e.s = this.s
                                 }
                                 ,
                                 r.prototype.drShiftTo = function (t, e) {
                                     for (var r = t; r < this.t; ++r)
                                         e[r - t] = this[r];
                                     e.t = Math.max(this.t - t, 0),
                                         e.s = this.s
                                 }
                                 ,
                                 r.prototype.lShiftTo = function (t, e) {
                                     var r, n = t % this.DB, i = this.DB - n, o = (1 << i) - 1,
                                         s = Math.floor(t / this.DB), a = this.s << n & this.DM;
                                     for (r = this.t - 1; r >= 0; --r)
                                         e[r + s + 1] = this[r] >> i | a,
                                             a = (this[r] & o) << n;
                                     for (r = s - 1; r >= 0; --r)
                                         e[r] = 0;
                                     e[s] = a,
                                         e.t = this.t + s + 1,
                                         e.s = this.s,
                                         e.clamp()
                                 }
                                 ,
                                 r.prototype.rShiftTo = function (t, e) {
                                     e.s = this.s;
                                     var r = Math.floor(t / this.DB);
                                     if (r >= this.t)
                                         e.t = 0;
                                     else {
                                         var n = t % this.DB
                                             , i = this.DB - n
                                             , o = (1 << n) - 1;
                                         e[0] = this[r] >> n;
                                         for (var s = r + 1; s < this.t; ++s)
                                             e[s - r - 1] |= (this[s] & o) << i,
                                                 e[s - r] = this[s] >> n;
                                         n > 0 && (e[this.t - r - 1] |= (this.s & o) << i),
                                             e.t = this.t - r,
                                             e.clamp()
                                     }
                                 }
                                 ,
                                 r.prototype.subTo = function (t, e) {
                                     for (var r = 0, n = 0, i = Math.min(t.t, this.t); r < i;)
                                         n += this[r] - t[r],
                                             e[r++] = n & this.DM,
                                             n >>= this.DB;
                                     if (t.t < this.t) {
                                         for (n -= t.s; r < this.t;)
                                             n += this[r],
                                                 e[r++] = n & this.DM,
                                                 n >>= this.DB;
                                         n += this.s
                                     } else {
                                         for (n += this.s; r < t.t;)
                                             n -= t[r],
                                                 e[r++] = n & this.DM,
                                                 n >>= this.DB;
                                         n -= t.s
                                     }
                                     e.s = n < 0 ? -1 : 0,
                                         n < -1 ? e[r++] = this.DV + n : n > 0 && (e[r++] = n),
                                         e.t = r,
                                         e.clamp()
                                 }
                                 ,
                                 r.prototype.multiplyTo = function (t, e) {
                                     var n = this.abs()
                                         , i = t.abs()
                                         , o = n.t;
                                     for (e.t = o + i.t; --o >= 0;)
                                         e[o] = 0;
                                     for (o = 0; o < i.t; ++o)
                                         e[o + n.t] = n.am(0, i[o], e, o, 0, n.t);
                                     e.s = 0,
                                         e.clamp(),
                                     this.s != t.s && r.ZERO.subTo(e, e)
                                 }
                                 ,
                                 r.prototype.squareTo = function (t) {
                                     for (var e = this.abs(), r = t.t = 2 * e.t; --r >= 0;)
                                         t[r] = 0;
                                     for (r = 0; r < e.t - 1; ++r) {
                                         var n = e.am(r, e[r], t, 2 * r, 0, 1);
                                         (t[r + e.t] += e.am(r + 1, 2 * e[r], t, 2 * r + 1, n, e.t - r - 1)) >= e.DV && (t[r + e.t] -= e.DV,
                                             t[r + e.t + 1] = 1)
                                     }
                                     t.t > 0 && (t[t.t - 1] += e.am(r, e[r], t, 2 * r, 0, 1)),
                                         t.s = 0,
                                         t.clamp()
                                 }
                                 ,
                                 r.prototype.divRemTo = function (t, e, i) {
                                     var o = t.abs();
                                     if (!(o.t <= 0)) {
                                         var s = this.abs();
                                         if (s.t < o.t)
                                             return null != e && e.fromInt(0),
                                                 void (null != i && this.copyTo(i));
                                         null == i && (i = n());
                                         var a = n()
                                             , u = this.s
                                             , c = t.s
                                             , f = this.DB - h(o[o.t - 1]);
                                         f > 0 ? (o.lShiftTo(f, a),
                                             s.lShiftTo(f, i)) : (o.copyTo(a),
                                             s.copyTo(i));
                                         var l = a.t
                                             , p = a[l - 1];
                                         if (0 != p) {
                                             var d = p * (1 << this.F1) + (l > 1 ? a[l - 2] >> this.F2 : 0)
                                                 , v = this.FV / d
                                                 , y = (1 << this.F1) / d
                                                 , m = 1 << this.F2
                                                 , g = i.t
                                                 , b = g - l
                                                 , w = null == e ? n() : e;
                                             for (a.dlShiftTo(b, w),
                                                  i.compareTo(w) >= 0 && (i[i.t++] = 1,
                                                      i.subTo(w, i)),
                                                      r.ONE.dlShiftTo(l, w),
                                                      w.subTo(a, a); a.t < l;)
                                                 a[a.t++] = 0;
                                             for (; --b >= 0;) {
                                                 var x = i[--g] == p ? this.DM : Math.floor(i[g] * v + (i[g - 1] + m) * y);
                                                 if ((i[g] += a.am(0, x, i, b, 0, l)) < x)
                                                     for (a.dlShiftTo(b, w),
                                                              i.subTo(w, i); i[g] < --x;)
                                                         i.subTo(w, i)
                                             }
                                             null != e && (i.drShiftTo(l, e),
                                             u != c && r.ZERO.subTo(e, e)),
                                                 i.t = l,
                                                 i.clamp(),
                                             f > 0 && i.rShiftTo(f, i),
                                             u < 0 && r.ZERO.subTo(i, i)
                                         }
                                     }
                                 }
                                 ,
                                 r.prototype.invDigit = function () {
                                     if (this.t < 1)
                                         return 0;
                                     var t = this[0];
                                     if (0 == (1 & t))
                                         return 0;
                                     var e = 3 & t;
                                     return (e = (e = (e = (e = e * (2 - (15 & t) * e) & 15) * (2 - (255 & t) * e) & 255) * (2 - ((65535 & t) * e & 65535)) & 65535) * (2 - t * e % this.DV) % this.DV) > 0 ? this.DV - e : -e
                                 }
                                 ,
                                 r.prototype.isEven = function () {
                                     return 0 == (this.t > 0 ? 1 & this[0] : this.s)
                                 }
                                 ,
                                 r.prototype.exp = function (t, e) {
                                     if (t > 4294967295 || t < 1)
                                         return r.ONE;
                                     var i = n()
                                         , o = n()
                                         , s = e.convert(this)
                                         , a = h(t) - 1;
                                     for (s.copyTo(i); --a >= 0;)
                                         if (e.sqrTo(i, o),
                                         (t & 1 << a) > 0)
                                             e.mulTo(o, s, i);
                                         else {
                                             var u = i;
                                             i = o,
                                                 o = u
                                         }
                                     return e.revert(i)
                                 }
                                 ,
                                 r.prototype.toString = function (t) {
                                     if (this.s < 0)
                                         return "-" + this.negate().toString(t);
                                     var e;
                                     if (16 == t)
                                         e = 4;
                                     else if (8 == t)
                                         e = 3;
                                     else if (2 == t)
                                         e = 1;
                                     else if (32 == t)
                                         e = 5;
                                     else {
                                         if (4 != t)
                                             return this.toRadix(t);
                                         e = 2
                                     }
                                     var r, n = (1 << e) - 1, i = !1, o = "", s = this.t, a = this.DB - s * this.DB % e;
                                     if (s-- > 0)
                                         for (a < this.DB && (r = this[s] >> a) > 0 && (i = !0,
                                             o = u(r)); s >= 0;)
                                             a < e ? (r = (this[s] & (1 << a) - 1) << e - a,
                                                 r |= this[--s] >> (a += this.DB - e)) : (r = this[s] >> (a -= e) & n,
                                             a <= 0 && (a += this.DB,
                                                 --s)),
                                             r > 0 && (i = !0),
                                             i && (o += u(r));
                                     return i ? o : "0"
                                 }
                                 ,
                                 r.prototype.negate = function () {
                                     var t = n();
                                     return r.ZERO.subTo(this, t),
                                         t
                                 }
                                 ,
                                 r.prototype.abs = function () {
                                     return this.s < 0 ? this.negate() : this
                                 }
                                 ,
                                 r.prototype.compareTo = function (t) {
                                     var e = this.s - t.s;
                                     if (0 != e)
                                         return e;
                                     var r = this.t;
                                     if (0 != (e = r - t.t))
                                         return this.s < 0 ? -e : e;
                                     for (; --r >= 0;)
                                         if (0 != (e = this[r] - t[r]))
                                             return e;
                                     return 0
                                 }
                                 ,
                                 r.prototype.bitLength = function () {
                                     return this.t <= 0 ? 0 : this.DB * (this.t - 1) + h(this[this.t - 1] ^ this.s & this.DM)
                                 }
                                 ,
                                 r.prototype.mod = function (t) {
                                     var e = n();
                                     return this.abs().divRemTo(t, null, e),
                                     this.s < 0 && e.compareTo(r.ZERO) > 0 && t.subTo(e, e),
                                         e
                                 }
                                 ,
                                 r.prototype.modPowInt = function (t, e) {
                                     var r;
                                     return r = t < 256 || e.isEven() ? new l(e) : new p(e),
                                         this.exp(t, r)
                                 }
                                 ,
                                 r.ZERO = f(0),
                                 r.ONE = f(1),
                                 w.prototype.convert = x,
                                 w.prototype.revert = x,
                                 w.prototype.mulTo = function (t, e, r) {
                                     t.multiplyTo(e, r)
                                 }
                                 ,
                                 w.prototype.sqrTo = function (t, e) {
                                     t.squareTo(e)
                                 }
                                 ,
                                 S.prototype.convert = function (t) {
                                     if (t.s < 0 || t.t > 2 * this.m.t)
                                         return t.mod(this.m);
                                     if (t.compareTo(this.m) < 0)
                                         return t;
                                     var e = n();
                                     return t.copyTo(e),
                                         this.reduce(e),
                                         e
                                 }
                                 ,
                                 S.prototype.revert = function (t) {
                                     return t
                                 }
                                 ,
                                 S.prototype.reduce = function (t) {
                                     for (t.drShiftTo(this.m.t - 1, this.r2),
                                          t.t > this.m.t + 1 && (t.t = this.m.t + 1,
                                              t.clamp()),
                                              this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
                                              this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); t.compareTo(this.r2) < 0;)
                                         t.dAddOffset(1, this.m.t + 1);
                                     for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0;)
                                         t.subTo(this.m, t)
                                 }
                                 ,
                                 S.prototype.mulTo = function (t, e, r) {
                                     t.multiplyTo(e, r),
                                         this.reduce(r)
                                 }
                                 ,
                                 S.prototype.sqrTo = function (t, e) {
                                     t.squareTo(e),
                                         this.reduce(e)
                                 }
                             ;
                             var T, E, B,
                                 A = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997],
                                 k = (1 << 26) / A[A.length - 1];

                             function O() {
                                 var t;
                                 t = (new Date).getTime(),
                                     E[B++] ^= 255 & t,
                                     E[B++] ^= t >> 8 & 255,
                                     E[B++] ^= t >> 16 & 255,
                                     E[B++] ^= t >> 24 & 255,
                                 B >= I && (B -= I)
                             }

                             if (r.prototype.chunkSize = function (t) {
                                 return Math.floor(Math.LN2 * this.DB / Math.log(t))
                             }
                                 ,
                                 r.prototype.toRadix = function (t) {
                                     if (null == t && (t = 10),
                                     0 == this.signum() || t < 2 || t > 36)
                                         return "0";
                                     var e = this.chunkSize(t)
                                         , r = Math.pow(t, e)
                                         , i = f(r)
                                         , o = n()
                                         , s = n()
                                         , a = "";
                                     for (this.divRemTo(i, o, s); o.signum() > 0;)
                                         a = (r + s.intValue()).toString(t).substr(1) + a,
                                             o.divRemTo(i, o, s);
                                     return s.intValue().toString(t) + a
                                 }
                                 ,
                                 r.prototype.fromRadix = function (t, e) {
                                     this.fromInt(0),
                                     null == e && (e = 10);
                                     for (var n = this.chunkSize(e), i = Math.pow(e, n), o = !1, s = 0, a = 0, u = 0; u < t.length; ++u) {
                                         var f = c(t, u);
                                         f < 0 ? "-" == t.charAt(u) && 0 == this.signum() && (o = !0) : (a = e * a + f,
                                         ++s >= n && (this.dMultiply(i),
                                             this.dAddOffset(a, 0),
                                             s = 0,
                                             a = 0))
                                     }
                                     s > 0 && (this.dMultiply(Math.pow(e, s)),
                                         this.dAddOffset(a, 0)),
                                     o && r.ZERO.subTo(this, this)
                                 }
                                 ,
                                 r.prototype.fromNumber = function (t, e, n) {
                                     if ("number" == typeof e)
                                         if (t < 2)
                                             this.fromInt(1);
                                         else
                                             for (this.fromNumber(t, n),
                                                  this.testBit(t - 1) || this.bitwiseTo(r.ONE.shiftLeft(t - 1), v, this),
                                                  this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(e);)
                                                 this.dAddOffset(2, 0),
                                                 this.bitLength() > t && this.subTo(r.ONE.shiftLeft(t - 1), this);
                                     else {
                                         var i = new Array
                                             , o = 7 & t;
                                         i.length = 1 + (t >> 3),
                                             e.nextBytes(i),
                                             o > 0 ? i[0] &= (1 << o) - 1 : i[0] = 0,
                                             this.fromString(i, 256)
                                     }
                                 }
                                 ,
                                 r.prototype.bitwiseTo = function (t, e, r) {
                                     var n, i, o = Math.min(t.t, this.t);
                                     for (n = 0; n < o; ++n)
                                         r[n] = e(this[n], t[n]);
                                     if (t.t < this.t) {
                                         for (i = t.s & this.DM,
                                                  n = o; n < this.t; ++n)
                                             r[n] = e(this[n], i);
                                         r.t = this.t
                                     } else {
                                         for (i = this.s & this.DM,
                                                  n = o; n < t.t; ++n)
                                             r[n] = e(i, t[n]);
                                         r.t = t.t
                                     }
                                     r.s = e(this.s, t.s),
                                         r.clamp()
                                 }
                                 ,
                                 r.prototype.changeBit = function (t, e) {
                                     var n = r.ONE.shiftLeft(t);
                                     return this.bitwiseTo(n, e, n),
                                         n
                                 }
                                 ,
                                 r.prototype.addTo = function (t, e) {
                                     for (var r = 0, n = 0, i = Math.min(t.t, this.t); r < i;)
                                         n += this[r] + t[r],
                                             e[r++] = n & this.DM,
                                             n >>= this.DB;
                                     if (t.t < this.t) {
                                         for (n += t.s; r < this.t;)
                                             n += this[r],
                                                 e[r++] = n & this.DM,
                                                 n >>= this.DB;
                                         n += this.s
                                     } else {
                                         for (n += this.s; r < t.t;)
                                             n += t[r],
                                                 e[r++] = n & this.DM,
                                                 n >>= this.DB;
                                         n += t.s
                                     }
                                     e.s = n < 0 ? -1 : 0,
                                         n > 0 ? e[r++] = n : n < -1 && (e[r++] = this.DV + n),
                                         e.t = r,
                                         e.clamp()
                                 }
                                 ,
                                 r.prototype.dMultiply = function (t) {
                                     this[this.t] = this.am(0, t - 1, this, 0, 0, this.t),
                                         ++this.t,
                                         this.clamp()
                                 }
                                 ,
                                 r.prototype.dAddOffset = function (t, e) {
                                     if (0 != t) {
                                         for (; this.t <= e;)
                                             this[this.t++] = 0;
                                         for (this[e] += t; this[e] >= this.DV;)
                                             this[e] -= this.DV,
                                             ++e >= this.t && (this[this.t++] = 0),
                                                 ++this[e]
                                     }
                                 }
                                 ,
                                 r.prototype.multiplyLowerTo = function (t, e, r) {
                                     var n, i = Math.min(this.t + t.t, e);
                                     for (r.s = 0,
                                              r.t = i; i > 0;)
                                         r[--i] = 0;
                                     for (n = r.t - this.t; i < n; ++i)
                                         r[i + this.t] = this.am(0, t[i], r, i, 0, this.t);
                                     for (n = Math.min(t.t, e); i < n; ++i)
                                         this.am(0, t[i], r, i, 0, e - i);
                                     r.clamp()
                                 }
                                 ,
                                 r.prototype.multiplyUpperTo = function (t, e, r) {
                                     --e;
                                     var n = r.t = this.t + t.t - e;
                                     for (r.s = 0; --n >= 0;)
                                         r[n] = 0;
                                     for (n = Math.max(e - this.t, 0); n < t.t; ++n)
                                         r[this.t + n - e] = this.am(e - n, t[n], r, 0, 0, this.t + n - e);
                                     r.clamp(),
                                         r.drShiftTo(1, r)
                                 }
                                 ,
                                 r.prototype.modInt = function (t) {
                                     if (t <= 0)
                                         return 0;
                                     var e = this.DV % t
                                         , r = this.s < 0 ? t - 1 : 0;
                                     if (this.t > 0)
                                         if (0 == e)
                                             r = this[0] % t;
                                         else
                                             for (var n = this.t - 1; n >= 0; --n)
                                                 r = (e * r + this[n]) % t;
                                     return r
                                 }
                                 ,
                                 r.prototype.millerRabin = function (t) {
                                     var e = this.subtract(r.ONE)
                                         , i = e.getLowestSetBit();
                                     if (i <= 0)
                                         return !1;
                                     var o = e.shiftRight(i);
                                     (t = t + 1 >> 1) > A.length && (t = A.length);
                                     for (var s = n(), a = 0; a < t; ++a) {
                                         s.fromInt(A[Math.floor(Math.random() * A.length)]);
                                         var u = s.modPow(o, this);
                                         if (0 != u.compareTo(r.ONE) && 0 != u.compareTo(e)) {
                                             for (var c = 1; c++ < i && 0 != u.compareTo(e);)
                                                 if (0 == (u = u.modPowInt(2, this)).compareTo(r.ONE))
                                                     return !1;
                                             if (0 != u.compareTo(e))
                                                 return !1
                                         }
                                     }
                                     return !0
                                 }
                                 ,
                                 r.prototype.clone = function () {
                                     var t = n();
                                     return this.copyTo(t),
                                         t
                                 }
                                 ,
                                 r.prototype.intValue = function () {
                                     if (this.s < 0) {
                                         if (1 == this.t)
                                             return this[0] - this.DV;
                                         if (0 == this.t)
                                             return -1
                                     } else {
                                         if (1 == this.t)
                                             return this[0];
                                         if (0 == this.t)
                                             return 0
                                     }
                                     return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
                                 }
                                 ,
                                 r.prototype.byteValue = function () {
                                     return 0 == this.t ? this.s : this[0] << 24 >> 24
                                 }
                                 ,
                                 r.prototype.shortValue = function () {
                                     return 0 == this.t ? this.s : this[0] << 16 >> 16
                                 }
                                 ,
                                 r.prototype.signum = function () {
                                     return this.s < 0 ? -1 : this.t <= 0 || 1 == this.t && this[0] <= 0 ? 0 : 1
                                 }
                                 ,
                                 r.prototype.toByteArray = function () {
                                     var t = this.t
                                         , e = new Array;
                                     e[0] = this.s;
                                     var r, n = this.DB - t * this.DB % 8, i = 0;
                                     if (t-- > 0)
                                         for (n < this.DB && (r = this[t] >> n) != (this.s & this.DM) >> n && (e[i++] = r | this.s << this.DB - n); t >= 0;)
                                             n < 8 ? (r = (this[t] & (1 << n) - 1) << 8 - n,
                                                 r |= this[--t] >> (n += this.DB - 8)) : (r = this[t] >> (n -= 8) & 255,
                                             n <= 0 && (n += this.DB,
                                                 --t)),
                                             0 != (128 & r) && (r |= -256),
                                             0 == i && (128 & this.s) != (128 & r) && ++i,
                                             (i > 0 || r != this.s) && (e[i++] = r);
                                     return e
                                 }
                                 ,
                                 r.prototype.equals = function (t) {
                                     return 0 == this.compareTo(t)
                                 }
                                 ,
                                 r.prototype.min = function (t) {
                                     return this.compareTo(t) < 0 ? this : t
                                 }
                                 ,
                                 r.prototype.max = function (t) {
                                     return this.compareTo(t) > 0 ? this : t
                                 }
                                 ,
                                 r.prototype.and = function (t) {
                                     var e = n();
                                     return this.bitwiseTo(t, d, e),
                                         e
                                 }
                                 ,
                                 r.prototype.or = function (t) {
                                     var e = n();
                                     return this.bitwiseTo(t, v, e),
                                         e
                                 }
                                 ,
                                 r.prototype.xor = function (t) {
                                     var e = n();
                                     return this.bitwiseTo(t, y, e),
                                         e
                                 }
                                 ,
                                 r.prototype.andNot = function (t) {
                                     var e = n();
                                     return this.bitwiseTo(t, m, e),
                                         e
                                 }
                                 ,
                                 r.prototype.not = function () {
                                     for (var t = n(), e = 0; e < this.t; ++e)
                                         t[e] = this.DM & ~this[e];
                                     return t.t = this.t,
                                         t.s = ~this.s,
                                         t
                                 }
                                 ,
                                 r.prototype.shiftLeft = function (t) {
                                     var e = n();
                                     return t < 0 ? this.rShiftTo(-t, e) : this.lShiftTo(t, e),
                                         e
                                 }
                                 ,
                                 r.prototype.shiftRight = function (t) {
                                     var e = n();
                                     return t < 0 ? this.lShiftTo(-t, e) : this.rShiftTo(t, e),
                                         e
                                 }
                                 ,
                                 r.prototype.getLowestSetBit = function () {
                                     for (var t = 0; t < this.t; ++t)
                                         if (0 != this[t])
                                             return t * this.DB + g(this[t]);
                                     return this.s < 0 ? this.t * this.DB : -1
                                 }
                                 ,
                                 r.prototype.bitCount = function () {
                                     for (var t = 0, e = this.s & this.DM, r = 0; r < this.t; ++r)
                                         t += b(this[r] ^ e);
                                     return t
                                 }
                                 ,
                                 r.prototype.testBit = function (t) {
                                     var e = Math.floor(t / this.DB);
                                     return e >= this.t ? 0 != this.s : 0 != (this[e] & 1 << t % this.DB)
                                 }
                                 ,
                                 r.prototype.setBit = function (t) {
                                     return this.changeBit(t, v)
                                 }
                                 ,
                                 r.prototype.clearBit = function (t) {
                                     return this.changeBit(t, m)
                                 }
                                 ,
                                 r.prototype.flipBit = function (t) {
                                     return this.changeBit(t, y)
                                 }
                                 ,
                                 r.prototype.add = function (t) {
                                     var e = n();
                                     return this.addTo(t, e),
                                         e
                                 }
                                 ,
                                 r.prototype.subtract = function (t) {
                                     var e = n();
                                     return this.subTo(t, e),
                                         e
                                 }
                                 ,
                                 r.prototype.multiply = function (t) {
                                     var e = n();
                                     return this.multiplyTo(t, e),
                                         e
                                 }
                                 ,
                                 r.prototype.divide = function (t) {
                                     var e = n();
                                     return this.divRemTo(t, e, null),
                                         e
                                 }
                                 ,
                                 r.prototype.remainder = function (t) {
                                     var e = n();
                                     return this.divRemTo(t, null, e),
                                         e
                                 }
                                 ,
                                 r.prototype.divideAndRemainder = function (t) {
                                     var e = n()
                                         , r = n();
                                     return this.divRemTo(t, e, r),
                                         new Array(e, r)
                                 }
                                 ,
                                 r.prototype.modPow = function (t, e) {
                                     var r, i, o = t.bitLength(), s = f(1);
                                     if (o <= 0)
                                         return s;
                                     r = o < 18 ? 1 : o < 48 ? 3 : o < 144 ? 4 : o < 768 ? 5 : 6,
                                         i = o < 8 ? new l(e) : e.isEven() ? new S(e) : new p(e);
                                     var a = new Array
                                         , u = 3
                                         , c = r - 1
                                         , d = (1 << r) - 1;
                                     if (a[1] = i.convert(this),
                                     r > 1) {
                                         var v = n();
                                         for (i.sqrTo(a[1], v); u <= d;)
                                             a[u] = n(),
                                                 i.mulTo(v, a[u - 2], a[u]),
                                                 u += 2
                                     }
                                     var y, m, g = t.t - 1, b = !0, w = n();
                                     for (o = h(t[g]) - 1; g >= 0;) {
                                         for (o >= c ? y = t[g] >> o - c & d : (y = (t[g] & (1 << o + 1) - 1) << c - o,
                                         g > 0 && (y |= t[g - 1] >> this.DB + o - c)),
                                                  u = r; 0 == (1 & y);)
                                             y >>= 1,
                                                 --u;
                                         if ((o -= u) < 0 && (o += this.DB,
                                             --g),
                                             b)
                                             a[y].copyTo(s),
                                                 b = !1;
                                         else {
                                             for (; u > 1;)
                                                 i.sqrTo(s, w),
                                                     i.sqrTo(w, s),
                                                     u -= 2;
                                             u > 0 ? i.sqrTo(s, w) : (m = s,
                                                 s = w,
                                                 w = m),
                                                 i.mulTo(w, a[y], s)
                                         }
                                         for (; g >= 0 && 0 == (t[g] & 1 << o);)
                                             i.sqrTo(s, w),
                                                 m = s,
                                                 s = w,
                                                 w = m,
                                             --o < 0 && (o = this.DB - 1,
                                                 --g)
                                     }
                                     return i.revert(s)
                                 }
                                 ,
                                 r.prototype.modInverse = function (t) {
                                     var e = t.isEven();
                                     if (this.isEven() && e || 0 == t.signum())
                                         return r.ZERO;
                                     for (var n = t.clone(), i = this.clone(), o = f(1), s = f(0), a = f(0), u = f(1); 0 != n.signum();) {
                                         for (; n.isEven();)
                                             n.rShiftTo(1, n),
                                                 e ? (o.isEven() && s.isEven() || (o.addTo(this, o),
                                                     s.subTo(t, s)),
                                                     o.rShiftTo(1, o)) : s.isEven() || s.subTo(t, s),
                                                 s.rShiftTo(1, s);
                                         for (; i.isEven();)
                                             i.rShiftTo(1, i),
                                                 e ? (a.isEven() && u.isEven() || (a.addTo(this, a),
                                                     u.subTo(t, u)),
                                                     a.rShiftTo(1, a)) : u.isEven() || u.subTo(t, u),
                                                 u.rShiftTo(1, u);
                                         n.compareTo(i) >= 0 ? (n.subTo(i, n),
                                         e && o.subTo(a, o),
                                             s.subTo(u, s)) : (i.subTo(n, i),
                                         e && a.subTo(o, a),
                                             u.subTo(s, u))
                                     }
                                     return 0 != i.compareTo(r.ONE) ? r.ZERO : u.compareTo(t) >= 0 ? u.subtract(t) : u.signum() < 0 ? (u.addTo(t, u),
                                         u.signum() < 0 ? u.add(t) : u) : u
                                 }
                                 ,
                                 r.prototype.pow = function (t) {
                                     return this.exp(t, new w)
                                 }
                                 ,
                                 r.prototype.gcd = function (t) {
                                     var e = this.s < 0 ? this.negate() : this.clone()
                                         , r = t.s < 0 ? t.negate() : t.clone();
                                     if (e.compareTo(r) < 0) {
                                         var n = e;
                                         e = r,
                                             r = n
                                     }
                                     var i = e.getLowestSetBit()
                                         , o = r.getLowestSetBit();
                                     if (o < 0)
                                         return e;
                                     for (i < o && (o = i),
                                          o > 0 && (e.rShiftTo(o, e),
                                              r.rShiftTo(o, r)); e.signum() > 0;)
                                         (i = e.getLowestSetBit()) > 0 && e.rShiftTo(i, e),
                                         (i = r.getLowestSetBit()) > 0 && r.rShiftTo(i, r),
                                             e.compareTo(r) >= 0 ? (e.subTo(r, e),
                                                 e.rShiftTo(1, e)) : (r.subTo(e, r),
                                                 r.rShiftTo(1, r));
                                     return o > 0 && r.lShiftTo(o, r),
                                         r
                                 }
                                 ,
                                 r.prototype.isProbablePrime = function (t) {
                                     var e, r = this.abs();
                                     if (1 == r.t && r[0] <= A[A.length - 1]) {
                                         for (e = 0; e < A.length; ++e)
                                             if (r[0] == A[e])
                                                 return !0;
                                         return !1
                                     }
                                     if (r.isEven())
                                         return !1;
                                     for (e = 1; e < A.length;) {
                                         for (var n = A[e], i = e + 1; i < A.length && n < k;)
                                             n *= A[i++];
                                         for (n = r.modInt(n); e < i;)
                                             if (n % A[e++] == 0)
                                                 return !1
                                     }
                                     return r.millerRabin(t)
                                 }
                                 ,
                                 r.prototype.square = function () {
                                     var t = n();
                                     return this.squareTo(t),
                                         t
                                 }
                                 ,
                                 r.prototype.Barrett = S,
                             null == E) {
                                 var M;
                                 if (E = new Array,
                                     B = 0,
                                 "undefined" != typeof window && window.crypto)
                                     if (window.crypto.getRandomValues) {
                                         var P = new Uint8Array(32);
                                         for (window.crypto.getRandomValues(P),
                                                  M = 0; M < 32; ++M)
                                             E[B++] = P[M]
                                     } else if ("Netscape" == navigator.appName && navigator.appVersion < "5") {
                                         var D = window.crypto.random(32);
                                         for (M = 0; M < D.length; ++M)
                                             E[B++] = 255 & D.charCodeAt(M)
                                     }
                                 for (; B < I;)
                                     M = Math.floor(65536 * Math.random()),
                                         E[B++] = M >>> 8,
                                         E[B++] = 255 & M;
                                 B = 0,
                                     O()
                             }

                             function L() {
                                 if (null == T) {
                                     for (O(),
                                              (T = new j).init(E),
                                              B = 0; B < E.length; ++B)
                                         E[B] = 0;
                                     B = 0
                                 }
                                 return T.next()
                             }

                             function R() {
                             }

                             function j() {
                                 this.i = 0,
                                     this.j = 0,
                                     this.S = new Array
                             }

                             R.prototype.nextBytes = function (t) {
                                 var e;
                                 for (e = 0; e < t.length; ++e)
                                     t[e] = L()
                             }
                                 ,
                                 j.prototype.init = function (t) {
                                     var e, r, n;
                                     for (e = 0; e < 256; ++e)
                                         this.S[e] = e;
                                     for (r = 0,
                                              e = 0; e < 256; ++e)
                                         r = r + this.S[e] + t[e % t.length] & 255,
                                             n = this.S[e],
                                             this.S[e] = this.S[r],
                                             this.S[r] = n;
                                     this.i = 0,
                                         this.j = 0
                                 }
                                 ,
                                 j.prototype.next = function () {
                                     var t;
                                     return this.i = this.i + 1 & 255,
                                         this.j = this.j + this.S[this.i] & 255,
                                         t = this.S[this.i],
                                         this.S[this.i] = this.S[this.j],
                                         this.S[this.j] = t,
                                         this.S[t + this.S[this.i] & 255]
                                 }
                             ;
                             var I = 256;
                             t.exports = {
                                 default: r,
                                 BigInteger: r,
                                 SecureRandom: R
                             }
                         }
                     ).call(this)
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n;

                     function i(t) {
                         throw t
                     }

                     var o = void 0
                         , s = !0
                         , a = !1
                         , u = {
                         cipher: {},
                         hash: {},
                         keyexchange: {},
                         mode: {},
                         misc: {},
                         codec: {},
                         exception: {
                             corrupt: function (t) {
                                 this.toString = function () {
                                     return "CORRUPT: " + this.message
                                 }
                                     ,
                                     this.message = t
                             },
                             invalid: function (t) {
                                 this.toString = function () {
                                     return "INVALID: " + this.message
                                 }
                                     ,
                                     this.message = t
                             },
                             bug: function (t) {
                                 this.toString = function () {
                                     return "BUG: " + this.message
                                 }
                                     ,
                                     this.message = t
                             },
                             notReady: function (t) {
                                 this.toString = function () {
                                     return "NOT READY: " + this.message
                                 }
                                     ,
                                     this.message = t
                             }
                         }
                     };

                     function c(t, e, r) {
                         4 !== e.length && i(new u.exception.invalid("invalid aes block size"));
                         var n = t.d[r]
                             , o = e[0] ^ n[0]
                             , s = e[r ? 3 : 1] ^ n[1]
                             , a = e[2] ^ n[2];
                         e = e[r ? 1 : 3] ^ n[3];
                         var c, f, h, l, p = n.length / 4 - 2, d = 4, v = [0, 0, 0, 0];
                         t = (c = t.A[r])[0];
                         var y = c[1]
                             , m = c[2]
                             , g = c[3]
                             , b = c[4];
                         for (l = 0; l < p; l++)
                             c = t[o >>> 24] ^ y[s >> 16 & 255] ^ m[a >> 8 & 255] ^ g[255 & e] ^ n[d],
                                 f = t[s >>> 24] ^ y[a >> 16 & 255] ^ m[e >> 8 & 255] ^ g[255 & o] ^ n[d + 1],
                                 h = t[a >>> 24] ^ y[e >> 16 & 255] ^ m[o >> 8 & 255] ^ g[255 & s] ^ n[d + 2],
                                 e = t[e >>> 24] ^ y[o >> 16 & 255] ^ m[s >> 8 & 255] ^ g[255 & a] ^ n[d + 3],
                                 d += 4,
                                 o = c,
                                 s = f,
                                 a = h;
                         for (l = 0; 4 > l; l++)
                             v[r ? 3 & -l : l] = b[o >>> 24] << 24 ^ b[s >> 16 & 255] << 16 ^ b[a >> 8 & 255] << 8 ^ b[255 & e] ^ n[d++],
                                 c = o,
                                 o = s,
                                 s = a,
                                 a = e,
                                 e = c;
                         return v
                     }

                     function f(t, e) {
                         var r, n = u.random.P[t], i = [];
                         for (r in n)
                             n.hasOwnProperty(r) && i.push(n[r]);
                         for (r = 0; r < i.length; r++)
                             i[r](e)
                     }

                     function h(t) {
                         "undefined" != typeof window && window.performance && "function" == typeof window.performance.now ? u.random.addEntropy(window.performance.now(), t, "loadtime") : u.random.addEntropy((new Date).valueOf(), t, "loadtime")
                     }

                     function l(t) {
                         t.d = p(t).concat(p(t)),
                             t.Q = new u.cipher.aes(t.d)
                     }

                     function p(t) {
                         for (var e = 0; 4 > e && (t.q[e] = t.q[e] + 1 | 0,
                             !t.q[e]); e++)
                             ;
                         return t.Q.encrypt(t.q)
                     }

                     function d(t, e) {
                         return function () {
                             e.apply(t, arguments)
                         }
                     }

                     t.exports && (t.exports = u),
                     void 0 === (n = function () {
                         return u
                     }
                         .apply(e, [])) || (t.exports = n),
                         u.cipher.aes = function (t) {
                             this.A[0][0][0] || this.J();
                             var e, r, n, o, s = this.A[0][4], a = this.A[1], c = 1;
                             for (4 !== (e = t.length) && 6 !== e && 8 !== e && i(new u.exception.invalid("invalid aes key size")),
                                      this.d = [n = t.slice(0), o = []],
                                      t = e; t < 4 * e + 28; t++)
                                 r = n[t - 1],
                                 (0 == t % e || 8 === e && 4 == t % e) && (r = s[r >>> 24] << 24 ^ s[r >> 16 & 255] << 16 ^ s[r >> 8 & 255] << 8 ^ s[255 & r],
                                 0 == t % e && (r = r << 8 ^ r >>> 24 ^ c << 24,
                                     c = c << 1 ^ 283 * (c >> 7))),
                                     n[t] = n[t - e] ^ r;
                             for (e = 0; t; e++,
                                 t--)
                                 r = n[3 & e ? t : t - 4],
                                     o[e] = 4 >= t || 4 > e ? r : a[0][s[r >>> 24]] ^ a[1][s[r >> 16 & 255]] ^ a[2][s[r >> 8 & 255]] ^ a[3][s[255 & r]]
                         }
                         ,
                         u.cipher.aes.prototype = {
                             encrypt: function (t) {
                                 return c(this, t, 0)
                             },
                             decrypt: function (t) {
                                 return c(this, t, 1)
                             },
                             A: [[[], [], [], [], []], [[], [], [], [], []]],
                             J: function () {
                                 var t, e, r, n, i, o, s, a = this.A[0], u = this.A[1], c = a[4], f = u[4], h = [],
                                     l = [];
                                 for (t = 0; 256 > t; t++)
                                     l[(h[t] = t << 1 ^ 283 * (t >> 7)) ^ t] = t;
                                 for (e = r = 0; !c[e]; e ^= n || 1,
                                     r = l[r] || 1)
                                     for (o = (o = r ^ r << 1 ^ r << 2 ^ r << 3 ^ r << 4) >> 8 ^ 255 & o ^ 99,
                                              c[e] = o,
                                              f[o] = e,
                                              s = 16843009 * (i = h[t = h[n = h[e]]]) ^ 65537 * t ^ 257 * n ^ 16843008 * e,
                                              i = 257 * h[o] ^ 16843008 * o,
                                              t = 0; 4 > t; t++)
                                         a[t][e] = i = i << 24 ^ i >>> 8,
                                             u[t][o] = s = s << 24 ^ s >>> 8;
                                 for (t = 0; 5 > t; t++)
                                     a[t] = a[t].slice(0),
                                         u[t] = u[t].slice(0)
                             }
                         },
                         u.bitArray = {
                             bitSlice: function (t, e, r) {
                                 return t = u.bitArray.ea(t.slice(e / 32), 32 - (31 & e)).slice(1),
                                     r === o ? t : u.bitArray.clamp(t, r - e)
                             },
                             extract: function (t, e, r) {
                                 var n = Math.floor(-e - r & 31);
                                 return (-32 & (e + r - 1 ^ e) ? t[e / 32 | 0] << 32 - n ^ t[e / 32 + 1 | 0] >>> n : t[e / 32 | 0] >>> n) & (1 << r) - 1
                             },
                             concat: function (t, e) {
                                 if (0 === t.length || 0 === e.length)
                                     return t.concat(e);
                                 var r = t[t.length - 1]
                                     , n = u.bitArray.getPartial(r);
                                 return 32 === n ? t.concat(e) : u.bitArray.ea(e, n, 0 | r, t.slice(0, t.length - 1))
                             },
                             bitLength: function (t) {
                                 var e = t.length;
                                 return 0 === e ? 0 : 32 * (e - 1) + u.bitArray.getPartial(t[e - 1])
                             },
                             clamp: function (t, e) {
                                 if (32 * t.length < e)
                                     return t;
                                 var r = (t = t.slice(0, Math.ceil(e / 32))).length;
                                 return e &= 31,
                                 0 < r && e && (t[r - 1] = u.bitArray.partial(e, t[r - 1] & 2147483648 >> e - 1, 1)),
                                     t
                             },
                             partial: function (t, e, r) {
                                 return 32 === t ? e : (r ? 0 | e : e << 32 - t) + 1099511627776 * t
                             },
                             getPartial: function (t) {
                                 return Math.round(t / 1099511627776) || 32
                             },
                             equal: function (t, e) {
                                 if (u.bitArray.bitLength(t) !== u.bitArray.bitLength(e))
                                     return a;
                                 var r, n = 0;
                                 for (r = 0; r < t.length; r++)
                                     n |= t[r] ^ e[r];
                                 return 0 === n
                             },
                             ea: function (t, e, r, n) {
                                 var i;
                                 for (i = 0,
                                      n === o && (n = []); 32 <= e; e -= 32)
                                     n.push(r),
                                         r = 0;
                                 if (0 === e)
                                     return n.concat(t);
                                 for (i = 0; i < t.length; i++)
                                     n.push(r | t[i] >>> e),
                                         r = t[i] << 32 - e;
                                 return i = t.length ? t[t.length - 1] : 0,
                                     t = u.bitArray.getPartial(i),
                                     n.push(u.bitArray.partial(e + t & 31, 32 < e + t ? r : n.pop(), 1)),
                                     n
                             },
                             o: function (t, e) {
                                 return [t[0] ^ e[0], t[1] ^ e[1], t[2] ^ e[2], t[3] ^ e[3]]
                             },
                             byteswapM: function (t) {
                                 var e, r;
                                 for (e = 0; e < t.length; ++e)
                                     r = t[e],
                                         t[e] = r >>> 24 | r >>> 8 & 65280 | (65280 & r) << 8 | r << 24;
                                 return t
                             }
                         },
                         u.codec.utf8String = {
                             fromBits: function (t) {
                                 var e, r, n = "", i = u.bitArray.bitLength(t);
                                 for (e = 0; e < i / 8; e++)
                                     0 == (3 & e) && (r = t[e / 4]),
                                         n += String.fromCharCode(r >>> 24),
                                         r <<= 8;
                                 return decodeURIComponent(escape(n))
                             },
                             toBits: function (t) {
                                 t = unescape(encodeURIComponent(t));
                                 var e, r = [], n = 0;
                                 for (e = 0; e < t.length; e++)
                                     n = n << 8 | t.charCodeAt(e),
                                     3 == (3 & e) && (r.push(n),
                                         n = 0);
                                 return 3 & e && r.push(u.bitArray.partial(8 * (3 & e), n)),
                                     r
                             }
                         },
                         u.codec.hex = {
                             fromBits: function (t) {
                                 var e, r = "";
                                 for (e = 0; e < t.length; e++)
                                     r += (0xf00000000000 + (0 | t[e])).toString(16).substr(4);
                                 return r.substr(0, u.bitArray.bitLength(t) / 4)
                             },
                             toBits: function (t) {
                                 var e, r, n = [];
                                 for (r = (t = t.replace(/\s|0x/g, "")).length,
                                          t += "00000000",
                                          e = 0; e < t.length; e += 8)
                                     n.push(0 ^ parseInt(t.substr(e, 8), 16));
                                 return u.bitArray.clamp(n, 4 * r)
                             }
                         },
                         u.codec.base32 = {
                             D: "0123456789abcdefghjkmnpqrstvwxyz",
                             BITS: 32,
                             BASE: 5,
                             REMAINING: 27,
                             fromBits: function (t) {
                                 var e, r = u.codec.base32.BASE, n = u.codec.base32.REMAINING, i = "", o = 0,
                                     s = u.codec.base32.D, a = 0, c = u.bitArray.bitLength(t);
                                 for (e = 0; i.length * r <= c;)
                                     i += s.charAt((a ^ t[e] >>> o) >>> n),
                                         o < r ? (a = t[e] << r - o,
                                             o += n,
                                             e++) : (a <<= r,
                                             o -= r);
                                 return i
                             },
                             toBits: function (t) {
                                 var e, r, n = u.codec.base32.BITS, o = u.codec.base32.BASE,
                                     s = u.codec.base32.REMAINING, a = [], c = 0, f = u.codec.base32.D, h = 0;
                                 for (e = 0; e < t.length; e++)
                                     0 > (r = f.indexOf(t.charAt(e))) && i(new u.exception.invalid("this isn't base32!")),
                                         c > s ? (c -= s,
                                             a.push(h ^ r >>> c),
                                             h = r << n - c) : h ^= r << n - (c += o);
                                 return 56 & c && a.push(u.bitArray.partial(56 & c, h, 1)),
                                     a
                             }
                         },
                         u.codec.base64 = {
                             D: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                             fromBits: function (t, e, r) {
                                 var n = ""
                                     , i = 0
                                     , o = u.codec.base64.D
                                     , s = 0
                                     , a = u.bitArray.bitLength(t);
                                 for (r && (o = o.substr(0, 62) + "-_"),
                                          r = 0; 6 * n.length < a;)
                                     n += o.charAt((s ^ t[r] >>> i) >>> 26),
                                         6 > i ? (s = t[r] << 6 - i,
                                             i += 26,
                                             r++) : (s <<= 6,
                                             i -= 6);
                                 for (; 3 & n.length && !e;)
                                     n += "=";
                                 return n
                             },
                             toBits: function (t, e) {
                                 t = t.replace(/\s|=/g, "");
                                 var r, n, o = [], s = 0, a = u.codec.base64.D, c = 0;
                                 for (e && (a = a.substr(0, 62) + "-_"),
                                          r = 0; r < t.length; r++)
                                     0 > (n = a.indexOf(t.charAt(r))) && i(new u.exception.invalid("this isn't base64!")),
                                         26 < s ? (s -= 26,
                                             o.push(c ^ n >>> s),
                                             c = n << 32 - s) : c ^= n << 32 - (s += 6);
                                 return 56 & s && o.push(u.bitArray.partial(56 & s, c, 1)),
                                     o
                             }
                         },
                         u.codec.base64url = {
                             fromBits: function (t) {
                                 return u.codec.base64.fromBits(t, 1, 1)
                             },
                             toBits: function (t) {
                                 return u.codec.base64.toBits(t, 1)
                             }
                         },
                         u.codec.bytes = {
                             fromBits: function (t) {
                                 var e, r, n = [], i = u.bitArray.bitLength(t);
                                 for (e = 0; e < i / 8; e++)
                                     0 == (3 & e) && (r = t[e / 4]),
                                         n.push(r >>> 24),
                                         r <<= 8;
                                 return n
                             },
                             toBits: function (t) {
                                 var e, r = [], n = 0;
                                 for (e = 0; e < t.length; e++)
                                     n = n << 8 | t[e],
                                     3 == (3 & e) && (r.push(n),
                                         n = 0);
                                 return 3 & e && r.push(u.bitArray.partial(8 * (3 & e), n)),
                                     r
                             }
                         },
                         u.hash.sha256 = function (t) {
                             this.d[0] || this.J(),
                                 t ? (this.h = t.h.slice(0),
                                     this.e = t.e.slice(0),
                                     this.c = t.c) : this.reset()
                         }
                         ,
                         u.hash.sha256.hash = function (t) {
                             return (new u.hash.sha256).update(t).finalize()
                         }
                         ,
                         u.hash.sha256.prototype = {
                             blockSize: 512,
                             reset: function () {
                                 return this.h = this.m.slice(0),
                                     this.e = [],
                                     this.c = 0,
                                     this
                             },
                             update: function (t) {
                                 "string" == typeof t && (t = u.codec.utf8String.toBits(t));
                                 var e, r = this.e = u.bitArray.concat(this.e, t);
                                 for (e = this.c,
                                          t = this.c = e + u.bitArray.bitLength(t),
                                          e = 512 + e & -512; e <= t; e += 512)
                                     this.k(r.splice(0, 16));
                                 return this
                             },
                             finalize: function () {
                                 var t, e = this.e, r = this.h;
                                 for (t = (e = u.bitArray.concat(e, [u.bitArray.partial(1, 1)])).length + 2; 15 & t; t++)
                                     e.push(0);
                                 for (e.push(Math.floor(this.c / 4294967296)),
                                          e.push(0 | this.c); e.length;)
                                     this.k(e.splice(0, 16));
                                 return this.reset(),
                                     r
                             },
                             m: [],
                             d: [],
                             J: function () {
                                 function t(t) {
                                     return 4294967296 * (t - Math.floor(t)) | 0
                                 }

                                 var e, r = 0, n = 2;
                                 t: for (; 64 > r; n++) {
                                     for (e = 2; e * e <= n; e++)
                                         if (0 == n % e)
                                             continue t;
                                     8 > r && (this.m[r] = t(Math.pow(n, .5))),
                                         this.d[r] = t(Math.pow(n, 1 / 3)),
                                         r++
                                 }
                             },
                             k: function (t) {
                                 var e, r, n = t.slice(0), i = this.h, o = this.d, s = i[0], a = i[1], u = i[2],
                                     c = i[3], f = i[4], h = i[5], l = i[6], p = i[7];
                                 for (t = 0; 64 > t; t++)
                                     16 > t ? e = n[t] : (e = n[t + 1 & 15],
                                         r = n[t + 14 & 15],
                                         e = n[15 & t] = (e >>> 7 ^ e >>> 18 ^ e >>> 3 ^ e << 25 ^ e << 14) + (r >>> 17 ^ r >>> 19 ^ r >>> 10 ^ r << 15 ^ r << 13) + n[15 & t] + n[t + 9 & 15] | 0),
                                         e = e + p + (f >>> 6 ^ f >>> 11 ^ f >>> 25 ^ f << 26 ^ f << 21 ^ f << 7) + (l ^ f & (h ^ l)) + o[t],
                                         p = l,
                                         l = h,
                                         h = f,
                                         f = c + e | 0,
                                         c = u,
                                         u = a,
                                         s = e + ((a = s) & u ^ c & (a ^ u)) + (a >>> 2 ^ a >>> 13 ^ a >>> 22 ^ a << 30 ^ a << 19 ^ a << 10) | 0;
                                 i[0] = i[0] + s | 0,
                                     i[1] = i[1] + a | 0,
                                     i[2] = i[2] + u | 0,
                                     i[3] = i[3] + c | 0,
                                     i[4] = i[4] + f | 0,
                                     i[5] = i[5] + h | 0,
                                     i[6] = i[6] + l | 0,
                                     i[7] = i[7] + p | 0
                             }
                         },
                         u.hash.sha512 = function (t) {
                             this.d[0] || this.J(),
                                 t ? (this.h = t.h.slice(0),
                                     this.e = t.e.slice(0),
                                     this.c = t.c) : this.reset()
                         }
                         ,
                         u.hash.sha512.hash = function (t) {
                             return (new u.hash.sha512).update(t).finalize()
                         }
                         ,
                         u.hash.sha512.prototype = {
                             blockSize: 1024,
                             reset: function () {
                                 return this.h = this.m.slice(0),
                                     this.e = [],
                                     this.c = 0,
                                     this
                             },
                             update: function (t) {
                                 "string" == typeof t && (t = u.codec.utf8String.toBits(t));
                                 var e, r = this.e = u.bitArray.concat(this.e, t);
                                 for (e = this.c,
                                          t = this.c = e + u.bitArray.bitLength(t),
                                          e = 1024 + e & -1024; e <= t; e += 1024)
                                     this.k(r.splice(0, 32));
                                 return this
                             },
                             finalize: function () {
                                 var t, e = this.e, r = this.h;
                                 for (t = (e = u.bitArray.concat(e, [u.bitArray.partial(1, 1)])).length + 4; 31 & t; t++)
                                     e.push(0);
                                 for (e.push(0),
                                          e.push(0),
                                          e.push(Math.floor(this.c / 4294967296)),
                                          e.push(0 | this.c); e.length;)
                                     this.k(e.splice(0, 32));
                                 return this.reset(),
                                     r
                             },
                             m: [],
                             ra: [12372232, 13281083, 9762859, 1914609, 15106769, 4090911, 4308331, 8266105],
                             d: [],
                             ta: [2666018, 15689165, 5061423, 9034684, 4764984, 380953, 1658779, 7176472, 197186, 7368638, 14987916, 16757986, 8096111, 1480369, 13046325, 6891156, 15813330, 5187043, 9229749, 11312229, 2818677, 10937475, 4324308, 1135541, 6741931, 11809296, 16458047, 15666916, 11046850, 698149, 229999, 945776, 13774844, 2541862, 12856045, 9810911, 11494366, 7844520, 15576806, 8533307, 15795044, 4337665, 16291729, 5553712, 15684120, 6662416, 7413802, 12308920, 13816008, 4303699, 9366425, 10176680, 13195875, 4295371, 6546291, 11712675, 15708924, 1519456, 15772530, 6568428, 6495784, 8568297, 13007125, 7492395, 2515356, 12632583, 14740254, 7262584, 1535930, 13146278, 16321966, 1853211, 294276, 13051027, 13221564, 1051980, 4080310, 6651434, 14088940, 4675607],
                             J: function () {
                                 function t(t) {
                                     return 4294967296 * (t - Math.floor(t)) | 0
                                 }

                                 function e(t) {
                                     return 1099511627776 * (t - Math.floor(t)) & 255
                                 }

                                 var r, n = 0, i = 2;
                                 t: for (; 80 > n; i++) {
                                     for (r = 2; r * r <= i; r++)
                                         if (0 == i % r)
                                             continue t;
                                     8 > n && (this.m[2 * n] = t(Math.pow(i, .5)),
                                         this.m[2 * n + 1] = e(Math.pow(i, .5)) << 24 | this.ra[n]),
                                         this.d[2 * n] = t(Math.pow(i, 1 / 3)),
                                         this.d[2 * n + 1] = e(Math.pow(i, 1 / 3)) << 24 | this.ta[n],
                                         n++
                                 }
                             },
                             k: function (t) {
                                 var e, r, n = t.slice(0), i = this.h, o = this.d, s = i[0], a = i[1], u = i[2],
                                     c = i[3], f = i[4], h = i[5], l = i[6], p = i[7], d = i[8], v = i[9], y = i[10],
                                     m = i[11], g = i[12], b = i[13], w = i[14], x = i[15], S = s, T = a, E = u, B = c,
                                     A = f, k = h, O = l, M = p, P = d, D = v, L = y, R = m, j = g, I = b, C = w, _ = x;
                                 for (t = 0; 80 > t; t++) {
                                     if (16 > t)
                                         e = n[2 * t],
                                             r = n[2 * t + 1];
                                     else {
                                         r = n[2 * (t - 15)],
                                             e = ((z = n[2 * (t - 15) + 1]) << 31 | r >>> 1) ^ (z << 24 | r >>> 8) ^ r >>> 7;
                                         var V = (r << 31 | z >>> 1) ^ (r << 24 | z >>> 8) ^ (r << 25 | z >>> 7);
                                         r = n[2 * (t - 2)];
                                         var z = ((N = n[2 * (t - 2) + 1]) << 13 | r >>> 19) ^ (r << 3 | N >>> 29) ^ r >>> 6
                                             , N = (r << 13 | N >>> 19) ^ (N << 3 | r >>> 29) ^ (r << 26 | N >>> 6)
                                             , F = n[2 * (t - 7)]
                                             , U = n[2 * (t - 16)]
                                             , q = n[2 * (t - 16) + 1];
                                         e = e + F + ((r = V + n[2 * (t - 7) + 1]) >>> 0 < V >>> 0 ? 1 : 0),
                                             e += z + ((r += N) >>> 0 < N >>> 0 ? 1 : 0),
                                             e += U + ((r += q) >>> 0 < q >>> 0 ? 1 : 0)
                                     }
                                     n[2 * t] = e |= 0,
                                         n[2 * t + 1] = r |= 0,
                                         F = P & L ^ ~P & j;
                                     var W = D & R ^ ~D & I
                                         , Y = (N = S & E ^ S & A ^ E & A,
                                     T & B ^ T & k ^ B & k)
                                         , G = (U = (T << 4 | S >>> 28) ^ (S << 30 | T >>> 2) ^ (S << 25 | T >>> 7),
                                         q = (S << 4 | T >>> 28) ^ (T << 30 | S >>> 2) ^ (T << 25 | S >>> 7),
                                         o[2 * t])
                                         , K = o[2 * t + 1];
                                     V = C + ((D << 18 | P >>> 14) ^ (D << 14 | P >>> 18) ^ (P << 23 | D >>> 9)) + ((z = _ + ((P << 18 | D >>> 14) ^ (P << 14 | D >>> 18) ^ (D << 23 | P >>> 9))) >>> 0 < _ >>> 0 ? 1 : 0),
                                         C = j,
                                         _ = I,
                                         j = L,
                                         I = R,
                                         L = P,
                                         R = D,
                                         P = O + (V = (V = (V += F + ((z += W) >>> 0 < W >>> 0 ? 1 : 0)) + (G + ((z += K) >>> 0 < K >>> 0 ? 1 : 0))) + (e + ((z = z + r | 0) >>> 0 < r >>> 0 ? 1 : 0))) + ((D = M + z | 0) >>> 0 < M >>> 0 ? 1 : 0) | 0,
                                         O = A,
                                         M = k,
                                         A = E,
                                         k = B,
                                         E = S,
                                         B = T,
                                         S = V + (e = U + N + ((r = q + Y) >>> 0 < q >>> 0 ? 1 : 0)) + ((T = z + r | 0) >>> 0 < z >>> 0 ? 1 : 0) | 0
                                 }
                                 a = i[1] = a + T | 0,
                                     i[0] = s + S + (a >>> 0 < T >>> 0 ? 1 : 0) | 0,
                                     c = i[3] = c + B | 0,
                                     i[2] = u + E + (c >>> 0 < B >>> 0 ? 1 : 0) | 0,
                                     h = i[5] = h + k | 0,
                                     i[4] = f + A + (h >>> 0 < k >>> 0 ? 1 : 0) | 0,
                                     p = i[7] = p + M | 0,
                                     i[6] = l + O + (p >>> 0 < M >>> 0 ? 1 : 0) | 0,
                                     v = i[9] = v + D | 0,
                                     i[8] = d + P + (v >>> 0 < D >>> 0 ? 1 : 0) | 0,
                                     m = i[11] = m + R | 0,
                                     i[10] = y + L + (m >>> 0 < R >>> 0 ? 1 : 0) | 0,
                                     b = i[13] = b + I | 0,
                                     i[12] = g + j + (b >>> 0 < I >>> 0 ? 1 : 0) | 0,
                                     x = i[15] = x + _ | 0,
                                     i[14] = w + C + (x >>> 0 < _ >>> 0 ? 1 : 0) | 0
                             }
                         },
                         u.hash.sha1 = function (t) {
                             t ? (this.h = t.h.slice(0),
                                 this.e = t.e.slice(0),
                                 this.c = t.c) : this.reset()
                         }
                         ,
                         u.hash.sha1.hash = function (t) {
                             return (new u.hash.sha1).update(t).finalize()
                         }
                         ,
                         u.hash.sha1.prototype = {
                             blockSize: 512,
                             reset: function () {
                                 return this.h = this.m.slice(0),
                                     this.e = [],
                                     this.c = 0,
                                     this
                             },
                             update: function (t) {
                                 "string" == typeof t && (t = u.codec.utf8String.toBits(t));
                                 var e, r = this.e = u.bitArray.concat(this.e, t);
                                 for (e = this.c,
                                          t = this.c = e + u.bitArray.bitLength(t),
                                          e = this.blockSize + e & -this.blockSize; e <= t; e += this.blockSize)
                                     this.k(r.splice(0, 16));
                                 return this
                             },
                             finalize: function () {
                                 var t, e = this.e, r = this.h;
                                 for (t = (e = u.bitArray.concat(e, [u.bitArray.partial(1, 1)])).length + 2; 15 & t; t++)
                                     e.push(0);
                                 for (e.push(Math.floor(this.c / 4294967296)),
                                          e.push(0 | this.c); e.length;)
                                     this.k(e.splice(0, 16));
                                 return this.reset(),
                                     r
                             },
                             m: [1732584193, 4023233417, 2562383102, 271733878, 3285377520],
                             d: [1518500249, 1859775393, 2400959708, 3395469782],
                             k: function (t) {
                                 var e, r, n, i, s, a, u = t.slice(0), c = this.h;
                                 for (r = c[0],
                                          n = c[1],
                                          i = c[2],
                                          s = c[3],
                                          a = c[4],
                                          t = 0; 79 >= t; t++)
                                     16 <= t && (u[t] = (u[t - 3] ^ u[t - 8] ^ u[t - 14] ^ u[t - 16]) << 1 | (u[t - 3] ^ u[t - 8] ^ u[t - 14] ^ u[t - 16]) >>> 31),
                                         e = (r << 5 | r >>> 27) + (e = 19 >= t ? n & i | ~n & s : 39 >= t ? n ^ i ^ s : 59 >= t ? n & i | n & s | i & s : 79 >= t ? n ^ i ^ s : o) + a + u[t] + this.d[Math.floor(t / 20)] | 0,
                                         a = s,
                                         s = i,
                                         i = n << 30 | n >>> 2,
                                         n = r,
                                         r = e;
                                 c[0] = c[0] + r | 0,
                                     c[1] = c[1] + n | 0,
                                     c[2] = c[2] + i | 0,
                                     c[3] = c[3] + s | 0,
                                     c[4] = c[4] + a | 0
                             }
                         },
                         u.mode.ccm = {
                             name: "ccm",
                             encrypt: function (t, e, r, n, o) {
                                 var s, a = e.slice(0), c = u.bitArray, f = c.bitLength(r) / 8, h = c.bitLength(a) / 8;
                                 for (o = o || 64,
                                          n = n || [],
                                      7 > f && i(new u.exception.invalid("ccm: iv must be at least 7 bytes")),
                                          s = 2; 4 > s && h >>> 8 * s; s++)
                                     ;
                                 return s < 15 - f && (s = 15 - f),
                                     r = c.clamp(r, 8 * (15 - s)),
                                     e = u.mode.ccm.Y(t, e, r, n, o, s),
                                     a = u.mode.ccm.F(t, a, r, e, o, s),
                                     c.concat(a.data, a.tag)
                             },
                             decrypt: function (t, e, r, n, o) {
                                 o = o || 64,
                                     n = n || [];
                                 var s = u.bitArray
                                     , a = s.bitLength(r) / 8
                                     , c = s.bitLength(e)
                                     , f = s.clamp(e, c - o)
                                     , h = s.bitSlice(e, c - o);
                                 for (c = (c - o) / 8,
                                      7 > a && i(new u.exception.invalid("ccm: iv must be at least 7 bytes")),
                                          e = 2; 4 > e && c >>> 8 * e; e++)
                                     ;
                                 return e < 15 - a && (e = 15 - a),
                                     r = s.clamp(r, 8 * (15 - e)),
                                     f = u.mode.ccm.F(t, f, r, h, o, e),
                                     t = u.mode.ccm.Y(t, f.data, r, n, o, e),
                                 s.equal(f.tag, t) || i(new u.exception.corrupt("ccm: tag doesn't match")),
                                     f.data
                             },
                             Y: function (t, e, r, n, o, s) {
                                 var a = []
                                     , c = u.bitArray
                                     , f = c.o;
                                 if (((o /= 8) % 2 || 4 > o || 16 < o) && i(new u.exception.invalid("ccm: invalid tag length")),
                                 (4294967295 < n.length || 4294967295 < e.length) && i(new u.exception.bug("ccm: can't deal with 4GiB or more data")),
                                     s = [c.partial(8, (n.length ? 64 : 0) | o - 2 << 2 | s - 1)],
                                     (s = c.concat(s, r))[3] |= c.bitLength(e) / 8,
                                     s = t.encrypt(s),
                                     n.length)
                                     for (65279 >= (r = c.bitLength(n) / 8) ? a = [c.partial(16, r)] : 4294967295 >= r && (a = c.concat([c.partial(16, 65534)], [r])),
                                              a = c.concat(a, n),
                                              n = 0; n < a.length; n += 4)
                                         s = t.encrypt(f(s, a.slice(n, n + 4).concat([0, 0, 0])));
                                 for (n = 0; n < e.length; n += 4)
                                     s = t.encrypt(f(s, e.slice(n, n + 4).concat([0, 0, 0])));
                                 return c.clamp(s, 8 * o)
                             },
                             F: function (t, e, r, n, i, o) {
                                 var s, a = u.bitArray;
                                 s = a.o;
                                 var c = e.length
                                     , f = a.bitLength(e);
                                 if (r = a.concat([a.partial(8, o - 1)], r).concat([0, 0, 0]).slice(0, 4),
                                     n = a.bitSlice(s(n, t.encrypt(r)), 0, i),
                                     !c)
                                     return {
                                         tag: n,
                                         data: []
                                     };
                                 for (s = 0; s < c; s += 4)
                                     r[3]++,
                                         i = t.encrypt(r),
                                         e[s] ^= i[0],
                                         e[s + 1] ^= i[1],
                                         e[s + 2] ^= i[2],
                                         e[s + 3] ^= i[3];
                                 return {
                                     tag: n,
                                     data: a.clamp(e, f)
                                 }
                             }
                         },
                     u.beware === o && (u.beware = {}),
                         u.beware["CBC mode is dangerous because it doesn't protect message integrity."] = function () {
                             u.mode.cbc = {
                                 name: "cbc",
                                 encrypt: function (t, e, r, n) {
                                     n && n.length && i(new u.exception.invalid("cbc can't authenticate data")),
                                     128 !== u.bitArray.bitLength(r) && i(new u.exception.invalid("cbc iv must be 128 bits"));
                                     var o = u.bitArray
                                         , s = o.o
                                         , a = o.bitLength(e)
                                         , c = 0
                                         , f = [];
                                     for (7 & a && i(new u.exception.invalid("pkcs#5 padding only works for multiples of a byte")),
                                              n = 0; c + 128 <= a; n += 4,
                                              c += 128)
                                         r = t.encrypt(s(r, e.slice(n, n + 4))),
                                             f.splice(n, 0, r[0], r[1], r[2], r[3]);
                                     return a = 16843009 * (16 - (a >> 3 & 15)),
                                         r = t.encrypt(s(r, o.concat(e, [a, a, a, a]).slice(n, n + 4))),
                                         f.splice(n, 0, r[0], r[1], r[2], r[3]),
                                         f
                                 },
                                 decrypt: function (t, e, r, n) {
                                     n && n.length && i(new u.exception.invalid("cbc can't authenticate data")),
                                     128 !== u.bitArray.bitLength(r) && i(new u.exception.invalid("cbc iv must be 128 bits")),
                                     (127 & u.bitArray.bitLength(e) || !e.length) && i(new u.exception.corrupt("cbc ciphertext must be a positive multiple of the block size"));
                                     var o, s = u.bitArray, a = s.o, c = [];
                                     for (n = 0; n < e.length; n += 4)
                                         o = e.slice(n, n + 4),
                                             r = a(r, t.decrypt(o)),
                                             c.splice(n, 0, r[0], r[1], r[2], r[3]),
                                             r = o;
                                     return (0 == (o = 255 & c[n - 1]) || 16 < o) && i(new u.exception.corrupt("pkcs#5 padding corrupt")),
                                         r = 16843009 * o,
                                     s.equal(s.bitSlice([r, r, r, r], 0, 8 * o), s.bitSlice(c, 32 * c.length - 8 * o, 32 * c.length)) || i(new u.exception.corrupt("pkcs#5 padding corrupt")),
                                         s.bitSlice(c, 0, 32 * c.length - 8 * o)
                                 }
                             }
                         }
                         ,
                         u.mode.ocb2 = {
                             name: "ocb2",
                             encrypt: function (t, e, r, n, o, s) {
                                 128 !== u.bitArray.bitLength(r) && i(new u.exception.invalid("ocb iv must be 128 bits"));
                                 var a, c = u.mode.ocb2.V, f = u.bitArray, h = f.o, l = [0, 0, 0, 0];
                                 r = c(t.encrypt(r));
                                 var p, d = [];
                                 for (n = n || [],
                                          o = o || 64,
                                          a = 0; a + 4 < e.length; a += 4)
                                     l = h(l, p = e.slice(a, a + 4)),
                                         d = d.concat(h(r, t.encrypt(h(r, p)))),
                                         r = c(r);
                                 return p = e.slice(a),
                                     e = f.bitLength(p),
                                     a = t.encrypt(h(r, [0, 0, 0, e])),
                                     p = f.clamp(h(p.concat([0, 0, 0]), a), e),
                                     l = h(l, h(p.concat([0, 0, 0]), a)),
                                     l = t.encrypt(h(l, h(r, c(r)))),
                                 n.length && (l = h(l, s ? n : u.mode.ocb2.pmac(t, n))),
                                     d.concat(f.concat(p, f.clamp(l, o)))
                             },
                             decrypt: function (t, e, r, n, o, s) {
                                 128 !== u.bitArray.bitLength(r) && i(new u.exception.invalid("ocb iv must be 128 bits")),
                                     o = o || 64;
                                 var a, c, f = u.mode.ocb2.V, h = u.bitArray, l = h.o, p = [0, 0, 0, 0],
                                     d = f(t.encrypt(r)), v = u.bitArray.bitLength(e) - o, y = [];
                                 for (n = n || [],
                                          r = 0; r + 4 < v / 32; r += 4)
                                     a = l(d, t.decrypt(l(d, e.slice(r, r + 4)))),
                                         p = l(p, a),
                                         y = y.concat(a),
                                         d = f(d);
                                 return c = v - 32 * r,
                                     a = t.encrypt(l(d, [0, 0, 0, c])),
                                     a = l(a, h.clamp(e.slice(r), c).concat([0, 0, 0])),
                                     p = l(p, a),
                                     p = t.encrypt(l(p, l(d, f(d)))),
                                 n.length && (p = l(p, s ? n : u.mode.ocb2.pmac(t, n))),
                                 h.equal(h.clamp(p, o), h.bitSlice(e, v)) || i(new u.exception.corrupt("ocb: tag doesn't match")),
                                     y.concat(h.clamp(a, c))
                             },
                             pmac: function (t, e) {
                                 var r, n = u.mode.ocb2.V, i = u.bitArray, o = i.o, s = [0, 0, 0, 0],
                                     a = o(a = t.encrypt([0, 0, 0, 0]), n(n(a)));
                                 for (r = 0; r + 4 < e.length; r += 4)
                                     a = n(a),
                                         s = o(s, t.encrypt(o(a, e.slice(r, r + 4))));
                                 return r = e.slice(r),
                                 128 > i.bitLength(r) && (a = o(a, n(a)),
                                     r = i.concat(r, [-2147483648, 0, 0, 0])),
                                     s = o(s, r),
                                     t.encrypt(o(n(o(a, n(a))), s))
                             },
                             V: function (t) {
                                 return [t[0] << 1 ^ t[1] >>> 31, t[1] << 1 ^ t[2] >>> 31, t[2] << 1 ^ t[3] >>> 31, t[3] << 1 ^ 135 * (t[0] >>> 31)]
                             }
                         },
                         u.mode.gcm = {
                             name: "gcm",
                             encrypt: function (t, e, r, n, i) {
                                 var o = e.slice(0);
                                 return e = u.bitArray,
                                     n = n || [],
                                     t = u.mode.gcm.F(s, t, o, n, r, i || 128),
                                     e.concat(t.data, t.tag)
                             },
                             decrypt: function (t, e, r, n, o) {
                                 var s = e.slice(0)
                                     , c = u.bitArray
                                     , f = c.bitLength(s);
                                 return n = n || [],
                                     (o = o || 128) <= f ? (e = c.bitSlice(s, f - o),
                                         s = c.bitSlice(s, 0, f - o)) : (e = s,
                                         s = []),
                                     t = u.mode.gcm.F(a, t, s, n, r, o),
                                 c.equal(t.tag, e) || i(new u.exception.corrupt("gcm: tag doesn't match")),
                                     t.data
                             },
                             pa: function (t, e) {
                                 var r, n, i, o, s, a = u.bitArray.o;
                                 for (i = [0, 0, 0, 0],
                                          o = e.slice(0),
                                          r = 0; 128 > r; r++) {
                                     for ((n = 0 != (t[Math.floor(r / 32)] & 1 << 31 - r % 32)) && (i = a(i, o)),
                                              s = 0 != (1 & o[3]),
                                              n = 3; 0 < n; n--)
                                         o[n] = o[n] >>> 1 | (1 & o[n - 1]) << 31;
                                     o[0] >>>= 1,
                                     s && (o[0] ^= -520093696)
                                 }
                                 return i
                             },
                             t: function (t, e, r) {
                                 var n, i = r.length;
                                 for (e = e.slice(0),
                                          n = 0; n < i; n += 4)
                                     e[0] ^= 4294967295 & r[n],
                                         e[1] ^= 4294967295 & r[n + 1],
                                         e[2] ^= 4294967295 & r[n + 2],
                                         e[3] ^= 4294967295 & r[n + 3],
                                         e = u.mode.gcm.pa(e, t);
                                 return e
                             },
                             F: function (t, e, r, n, i, o) {
                                 var s, a, c, f, h, l, p, d, v = u.bitArray;
                                 for (l = r.length,
                                          p = v.bitLength(r),
                                          d = v.bitLength(n),
                                          a = v.bitLength(i),
                                          s = e.encrypt([0, 0, 0, 0]),
                                          96 === a ? (i = i.slice(0),
                                              i = v.concat(i, [1])) : (i = u.mode.gcm.t(s, [0, 0, 0, 0], i),
                                              i = u.mode.gcm.t(s, i, [0, 0, Math.floor(a / 4294967296), 4294967295 & a])),
                                          a = u.mode.gcm.t(s, [0, 0, 0, 0], n),
                                          h = i.slice(0),
                                          n = a.slice(0),
                                      t || (n = u.mode.gcm.t(s, a, r)),
                                          f = 0; f < l; f += 4)
                                     h[3]++,
                                         c = e.encrypt(h),
                                         r[f] ^= c[0],
                                         r[f + 1] ^= c[1],
                                         r[f + 2] ^= c[2],
                                         r[f + 3] ^= c[3];
                                 return r = v.clamp(r, p),
                                 t && (n = u.mode.gcm.t(s, a, r)),
                                     t = [Math.floor(d / 4294967296), 4294967295 & d, Math.floor(p / 4294967296), 4294967295 & p],
                                     n = u.mode.gcm.t(s, n, t),
                                     c = e.encrypt(i),
                                     n[0] ^= c[0],
                                     n[1] ^= c[1],
                                     n[2] ^= c[2],
                                     n[3] ^= c[3],
                                     {
                                         tag: v.bitSlice(n, 0, o),
                                         data: r
                                     }
                             }
                         },
                         u.misc.hmac = function (t, e) {
                             this.$ = e = e || u.hash.sha256;
                             var r, n = [[], []], i = e.prototype.blockSize / 32;
                             for (this.C = [new e, new e],
                                  t.length > i && (t = e.hash(t)),
                                      r = 0; r < i; r++)
                                 n[0][r] = 909522486 ^ t[r],
                                     n[1][r] = 1549556828 ^ t[r];
                             this.C[0].update(n[0]),
                                 this.C[1].update(n[1]),
                                 this.U = new e(this.C[0])
                         }
                         ,
                         u.misc.hmac.prototype.encrypt = u.misc.hmac.prototype.mac = function (t) {
                             return this.ga && i(new u.exception.invalid("encrypt on already updated hmac called!")),
                                 this.update(t),
                                 this.digest(t)
                         }
                         ,
                         u.misc.hmac.prototype.reset = function () {
                             this.U = new this.$(this.C[0]),
                                 this.ga = a
                         }
                         ,
                         u.misc.hmac.prototype.update = function (t) {
                             this.ga = s,
                                 this.U.update(t)
                         }
                         ,
                         u.misc.hmac.prototype.digest = function () {
                             var t = this.U.finalize();
                             return t = new this.$(this.C[1]).update(t).finalize(),
                                 this.reset(),
                                 t
                         }
                         ,
                         u.misc.pbkdf2 = function (t, e, r, n, o) {
                             r = r || 1e3,
                             (0 > n || 0 > r) && i(u.exception.invalid("invalid params to pbkdf2")),
                             "string" == typeof t && (t = u.codec.utf8String.toBits(t)),
                             "string" == typeof e && (e = u.codec.utf8String.toBits(e)),
                                 t = new (o = o || u.misc.hmac)(t);
                             var s, a, c, f, h = [], l = u.bitArray;
                             for (f = 1; 32 * h.length < (n || 1); f++) {
                                 for (o = s = t.encrypt(l.concat(e, [f])),
                                          a = 1; a < r; a++)
                                     for (s = t.encrypt(s),
                                              c = 0; c < s.length; c++)
                                         o[c] ^= s[c];
                                 h = h.concat(o)
                             }
                             return n && (h = l.clamp(h, n)),
                                 h
                         }
                         ,
                         u.prng = function (t) {
                             this.j = [new u.hash.sha256],
                                 this.u = [0],
                                 this.T = 0,
                                 this.L = {},
                                 this.S = 0,
                                 this.X = {},
                                 this.da = this.n = this.w = this.ma = 0,
                                 this.d = [0, 0, 0, 0, 0, 0, 0, 0],
                                 this.q = [0, 0, 0, 0],
                                 this.Q = o,
                                 this.R = t,
                                 this.K = a,
                                 this.P = {
                                     progress: {},
                                     seeded: {}
                                 },
                                 this.B = this.la = 0,
                                 this.M = 1,
                                 this.O = 2,
                                 this.ia = 65536,
                                 this.W = [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024],
                                 this.ja = 3e4,
                                 this.ha = 80
                         }
                         ,
                         u.prng.prototype = {
                             randomWords: function (t, e) {
                                 var r, n, o = [];
                                 if ((r = this.isReady(e)) === this.B && i(new u.exception.notReady("generator isn't seeded")),
                                 r & this.O) {
                                     r = !(r & this.M),
                                         n = [];
                                     var s, a = 0;
                                     for (this.da = n[0] = (new Date).valueOf() + this.ja,
                                              s = 0; 16 > s; s++)
                                         n.push(4294967296 * Math.random() | 0);
                                     for (s = 0; s < this.j.length && (n = n.concat(this.j[s].finalize()),
                                         a += this.u[s],
                                         this.u[s] = 0,
                                     r || !(this.T & 1 << s)); s++)
                                         ;
                                     for (this.T >= 1 << this.j.length && (this.j.push(new u.hash.sha256),
                                         this.u.push(0)),
                                              this.n -= a,
                                          a > this.w && (this.w = a),
                                              this.T++,
                                              this.d = u.hash.sha256.hash(this.d.concat(n)),
                                              this.Q = new u.cipher.aes(this.d),
                                              r = 0; 4 > r && (this.q[r] = this.q[r] + 1 | 0,
                                         !this.q[r]); r++)
                                         ;
                                 }
                                 for (r = 0; r < t; r += 4)
                                     0 == (r + 1) % this.ia && l(this),
                                         n = p(this),
                                         o.push(n[0], n[1], n[2], n[3]);
                                 return l(this),
                                     o.slice(0, t)
                             },
                             setDefaultParanoia: function (t, e) {
                                 0 === t && "Setting paranoia=0 will ruin your security; use it only for testing" !== e && i("Setting paranoia=0 will ruin your security; use it only for testing"),
                                     this.R = t
                             },
                             addEntropy: function (t, e, r) {
                                 r = r || "user";
                                 var n, s, a = (new Date).valueOf(), c = this.L[r], h = this.isReady(), l = 0;
                                 switch ((n = this.X[r]) === o && (n = this.X[r] = this.ma++),
                                 c === o && (c = this.L[r] = 0),
                                     this.L[r] = (this.L[r] + 1) % this.j.length,
                                     typeof t) {
                                     case "number":
                                         e === o && (e = 1),
                                             this.j[c].update([n, this.S++, 1, e, a, 1, 0 | t]);
                                         break;
                                     case "object":
                                         if ("[object Uint32Array]" === (r = Object.prototype.toString.call(t))) {
                                             for (s = [],
                                                      r = 0; r < t.length; r++)
                                                 s.push(t[r]);
                                             t = s
                                         } else
                                             for ("[object Array]" !== r && (l = 1),
                                                      r = 0; r < t.length && !l; r++)
                                                 "number" != typeof t[r] && (l = 1);
                                         if (!l) {
                                             if (e === o)
                                                 for (r = e = 0; r < t.length; r++)
                                                     for (s = t[r]; 0 < s;)
                                                         e++,
                                                             s >>>= 1;
                                             this.j[c].update([n, this.S++, 2, e, a, t.length].concat(t))
                                         }
                                         break;
                                     case "string":
                                         e === o && (e = t.length),
                                             this.j[c].update([n, this.S++, 3, e, a, t.length]),
                                             this.j[c].update(t);
                                         break;
                                     default:
                                         l = 1
                                 }
                                 l && i(new u.exception.bug("random: addEntropy only supports number, array of numbers or string")),
                                     this.u[c] += e,
                                     this.n += e,
                                 h === this.B && (this.isReady() !== this.B && f("seeded", Math.max(this.w, this.n)),
                                     f("progress", this.getProgress()))
                             },
                             isReady: function (t) {
                                 return t = this.W[t !== o ? t : this.R],
                                     this.w && this.w >= t ? this.u[0] > this.ha && (new Date).valueOf() > this.da ? this.O | this.M : this.M : this.n >= t ? this.O | this.B : this.B
                             },
                             getProgress: function (t) {
                                 return t = this.W[t || this.R],
                                     this.w >= t || this.n > t ? 1 : this.n / t
                             },
                             startCollectors: function () {
                                 this.K || (this.f = {
                                     loadTimeCollector: d(this, this.ua),
                                     mouseCollector: d(this, this.va),
                                     keyboardCollector: d(this, this.sa),
                                     accelerometerCollector: d(this, this.ka),
                                     touchCollector: d(this, this.xa)
                                 },
                                     window.addEventListener ? (window.addEventListener("load", this.f.loadTimeCollector, a),
                                         window.addEventListener("mousemove", this.f.mouseCollector, a),
                                         window.addEventListener("keypress", this.f.keyboardCollector, a),
                                         window.addEventListener("devicemotion", this.f.accelerometerCollector, a),
                                         window.addEventListener("touchmove", this.f.touchCollector, a)) : document.attachEvent ? (document.attachEvent("onload", this.f.loadTimeCollector),
                                         document.attachEvent("onmousemove", this.f.mouseCollector),
                                         document.attachEvent("keypress", this.f.keyboardCollector)) : i(new u.exception.bug("can't attach event")),
                                     this.K = s)
                             },
                             stopCollectors: function () {
                                 this.K && (window.removeEventListener ? (window.removeEventListener("load", this.f.loadTimeCollector, a),
                                     window.removeEventListener("mousemove", this.f.mouseCollector, a),
                                     window.removeEventListener("keypress", this.f.keyboardCollector, a),
                                     window.removeEventListener("devicemotion", this.f.accelerometerCollector, a),
                                     window.removeEventListener("touchmove", this.f.touchCollector, a)) : document.detachEvent && (document.detachEvent("onload", this.f.loadTimeCollector),
                                     document.detachEvent("onmousemove", this.f.mouseCollector),
                                     document.detachEvent("keypress", this.f.keyboardCollector)),
                                     this.K = a)
                             },
                             addEventListener: function (t, e) {
                                 this.P[t][this.la++] = e
                             },
                             removeEventListener: function (t, e) {
                                 var r, n, i = this.P[t], o = [];
                                 for (n in i)
                                     i.hasOwnProperty(n) && i[n] === e && o.push(n);
                                 for (r = 0; r < o.length; r++)
                                     delete i[n = o[r]]
                             },
                             sa: function () {
                                 h(1)
                             },
                             va: function (t) {
                                 var e, r;
                                 try {
                                     e = t.x || t.clientX || t.offsetX || 0,
                                         r = t.y || t.clientY || t.offsetY || 0
                                 } catch (t) {
                                     r = e = 0
                                 }
                                 0 != e && 0 != r && u.random.addEntropy([e, r], 2, "mouse"),
                                     h(0)
                             },
                             xa: function (t) {
                                 t = t.touches[0] || t.changedTouches[0],
                                     u.random.addEntropy([t.pageX || t.clientX, t.pageY || t.clientY], 1, "touch"),
                                     h(0)
                             },
                             ua: function () {
                                 h(2)
                             },
                             ka: function (t) {
                                 if (t = t.accelerationIncludingGravity.x || t.accelerationIncludingGravity.y || t.accelerationIncludingGravity.z,
                                     window.orientation) {
                                     var e = window.orientation;
                                     "number" == typeof e && u.random.addEntropy(e, 1, "accelerometer")
                                 }
                                 t && u.random.addEntropy(t, 2, "accelerometer"),
                                     h(0)
                             }
                         },
                         u.random = new u.prng(6);
                     t: try {
                         var v, y, m, g;
                         if (g = void 0 !== t) {
                             var b;
                             if (b = t.exports) {
                                 var w;
                                 try {
                                     w = r(119)
                                 } catch (t) {
                                     w = null
                                 }
                                 b = (y = w) && y.randomBytes
                             }
                             g = b
                         }
                         if (g)
                             v = y.randomBytes(128),
                                 v = new Uint32Array(new Uint8Array(v).buffer),
                                 u.random.addEntropy(v, 1024, "crypto['randomBytes']");
                         else if ("undefined" != typeof window && "undefined" != typeof Uint32Array) {
                             if (m = new Uint32Array(32),
                             window.crypto && window.crypto.getRandomValues)
                                 window.crypto.getRandomValues(m);
                             else {
                                 if (!window.msCrypto || !window.msCrypto.getRandomValues)
                                     break t;
                                 window.msCrypto.getRandomValues(m)
                             }
                             u.random.addEntropy(m, 1024, "crypto['getRandomValues']")
                         }
                     } catch (t) {
                         "undefined" != typeof window && window.console && (console.log("There was an error collecting entropy from the browser:"),
                             console.log(t))
                     }
                     u.json = {
                         defaults: {
                             v: 1,
                             iter: 1e3,
                             ks: 128,
                             ts: 64,
                             mode: "ccm",
                             adata: "",
                             cipher: "aes"
                         },
                         oa: function (t, e, r, n) {
                             r = r || {},
                                 n = n || {};
                             var o, s = u.json, a = s.p({
                                 iv: u.random.randomWords(4, 0)
                             }, s.defaults);
                             return s.p(a, r),
                                 r = a.adata,
                             "string" == typeof a.salt && (a.salt = u.codec.base64.toBits(a.salt)),
                             "string" == typeof a.iv && (a.iv = u.codec.base64.toBits(a.iv)),
                             (!u.mode[a.mode] || !u.cipher[a.cipher] || "string" == typeof t && 100 >= a.iter || 64 !== a.ts && 96 !== a.ts && 128 !== a.ts || 128 !== a.ks && 192 !== a.ks && 256 !== a.ks || 2 > a.iv.length || 4 < a.iv.length) && i(new u.exception.invalid("json encrypt: invalid parameters")),
                                 "string" == typeof t ? (t = (o = u.misc.cachedPbkdf2(t, a)).key.slice(0, a.ks / 32),
                                     a.salt = o.salt) : u.ecc && t instanceof u.ecc.elGamal.publicKey && (o = t.kem(),
                                     a.kemtag = o.tag,
                                     t = o.key.slice(0, a.ks / 32)),
                             "string" == typeof e && (e = u.codec.utf8String.toBits(e)),
                             "string" == typeof r && (r = u.codec.utf8String.toBits(r)),
                                 o = new u.cipher[a.cipher](t),
                                 s.p(n, a),
                                 n.key = t,
                                 a.ct = u.mode[a.mode].encrypt(o, e, a.iv, r, a.ts),
                                 a
                         },
                         encrypt: function (t, e, r, n) {
                             var i = u.json
                                 , o = i.oa.apply(i, arguments);
                             return i.encode(o)
                         },
                         na: function (t, e, r, n) {
                             r = r || {},
                                 n = n || {};
                             var o, a, c = u.json;
                             return o = (e = c.p(c.p(c.p({}, c.defaults), e), r, s)).adata,
                             "string" == typeof e.salt && (e.salt = u.codec.base64.toBits(e.salt)),
                             "string" == typeof e.iv && (e.iv = u.codec.base64.toBits(e.iv)),
                             (!u.mode[e.mode] || !u.cipher[e.cipher] || "string" == typeof t && 100 >= e.iter || 64 !== e.ts && 96 !== e.ts && 128 !== e.ts || 128 !== e.ks && 192 !== e.ks && 256 !== e.ks || !e.iv || 2 > e.iv.length || 4 < e.iv.length) && i(new u.exception.invalid("json decrypt: invalid parameters")),
                                 "string" == typeof t ? (t = (a = u.misc.cachedPbkdf2(t, e)).key.slice(0, e.ks / 32),
                                     e.salt = a.salt) : u.ecc && t instanceof u.ecc.elGamal.secretKey && (t = t.unkem(u.codec.base64.toBits(e.kemtag)).slice(0, e.ks / 32)),
                             "string" == typeof o && (o = u.codec.utf8String.toBits(o)),
                                 a = new u.cipher[e.cipher](t),
                                 o = u.mode[e.mode].decrypt(a, e.ct, e.iv, o, e.ts),
                                 c.p(n, e),
                                 n.key = t,
                                 1 === r.raw ? o : u.codec.utf8String.fromBits(o)
                         },
                         decrypt: function (t, e, r, n) {
                             var i = u.json;
                             return i.na(t, i.decode(e), r, n)
                         },
                         encode: function (t) {
                             var e, r = "{", n = "";
                             for (e in t)
                                 if (t.hasOwnProperty(e))
                                     switch (e.match(/^[a-z0-9]+$/i) || i(new u.exception.invalid("json encode: invalid property name")),
                                         r += n + '"' + e + '":',
                                         n = ",",
                                         typeof t[e]) {
                                         case "number":
                                         case "boolean":
                                             r += t[e];
                                             break;
                                         case "string":
                                             r += '"' + escape(t[e]) + '"';
                                             break;
                                         case "object":
                                             r += '"' + u.codec.base64.fromBits(t[e], 0) + '"';
                                             break;
                                         default:
                                             i(new u.exception.bug("json encode: unsupported type"))
                                     }
                             return r + "}"
                         },
                         decode: function (t) {
                             (t = t.replace(/\s/g, "")).match(/^\{.*\}$/) || i(new u.exception.invalid("json decode: this isn't json!")),
                                 t = t.replace(/^\{|\}$/g, "").split(/,/);
                             var e, r, n = {};
                             for (e = 0; e < t.length; e++)
                                 (r = t[e].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i)) || i(new u.exception.invalid("json decode: this isn't json!")),
                                     r[3] ? n[r[2]] = parseInt(r[3], 10) : r[4] ? n[r[2]] = r[2].match(/^(ct|salt|iv)$/) ? u.codec.base64.toBits(r[4]) : unescape(r[4]) : r[5] && (n[r[2]] = "true" === r[5]);
                             return n
                         },
                         p: function (t, e, r) {
                             if (t === o && (t = {}),
                             e === o)
                                 return t;
                             for (var n in e)
                                 e.hasOwnProperty(n) && (r && t[n] !== o && t[n] !== e[n] && i(new u.exception.invalid("required parameter overridden")),
                                     t[n] = e[n]);
                             return t
                         },
                         za: function (t, e) {
                             var r, n = {};
                             for (r in t)
                                 t.hasOwnProperty(r) && t[r] !== e[r] && (n[r] = t[r]);
                             return n
                         },
                         ya: function (t, e) {
                             var r, n = {};
                             for (r = 0; r < e.length; r++)
                                 t[e[r]] !== o && (n[e[r]] = t[e[r]]);
                             return n
                         }
                     },
                         u.encrypt = u.json.encrypt,
                         u.decrypt = u.json.decrypt,
                         u.misc.wa = {},
                         u.misc.cachedPbkdf2 = function (t, e) {
                             var r, n = u.misc.wa;
                             return r = (e = e || {}).iter || 1e3,
                                 (r = (n = n[t] = n[t] || {})[r] = n[r] || {
                                     firstSalt: e.salt && e.salt.length ? e.salt.slice(0) : u.random.randomWords(2, 0)
                                 })[n = e.salt === o ? r.firstSalt : e.salt] = r[n] || u.misc.pbkdf2(t, n, e.iter),
                                 {
                                     key: r[n].slice(0),
                                     salt: n.slice(0)
                                 }
                         }
                         ,
                         u.bn = function (t) {
                             this.initWith(t)
                         }
                         ,
                         u.bn.prototype = {
                             radix: 24,
                             maxMul: 8,
                             i: u.bn,
                             copy: function () {
                                 return new this.i(this)
                             },
                             initWith: function (t) {
                                 var e, r = 0;
                                 switch (typeof t) {
                                     case "object":
                                         this.limbs = t.limbs.slice(0);
                                         break;
                                     case "number":
                                         this.limbs = [t],
                                             this.normalize();
                                         break;
                                     case "string":
                                         for (t = t.replace(/^0x/, ""),
                                                  this.limbs = [],
                                                  e = this.radix / 4,
                                                  r = 0; r < t.length; r += e)
                                             this.limbs.push(parseInt(t.substring(Math.max(t.length - r - e, 0), t.length - r), 16));
                                         break;
                                     default:
                                         this.limbs = [0]
                                 }
                                 return this
                             },
                             equals: function (t) {
                                 "number" == typeof t && (t = new this.i(t));
                                 var e, r = 0;
                                 for (this.fullReduce(),
                                          t.fullReduce(),
                                          e = 0; e < this.limbs.length || e < t.limbs.length; e++)
                                     r |= this.getLimb(e) ^ t.getLimb(e);
                                 return 0 === r
                             },
                             getLimb: function (t) {
                                 return t >= this.limbs.length ? 0 : this.limbs[t]
                             },
                             greaterEquals: function (t) {
                                 "number" == typeof t && (t = new this.i(t));
                                 var e, r, n, i = 0, o = 0;
                                 for (e = Math.max(this.limbs.length, t.limbs.length) - 1; 0 <= e; e--)
                                     i |= (r = this.getLimb(e)) - (n = t.getLimb(e)) & ~(o |= n - r & ~i);
                                 return (o | ~i) >>> 31
                             },
                             toString: function () {
                                 this.fullReduce();
                                 var t, e, r = "", n = this.limbs;
                                 for (t = 0; t < this.limbs.length; t++) {
                                     for (e = n[t].toString(16); t < this.limbs.length - 1 && 6 > e.length;)
                                         e = "0" + e;
                                     r = e + r
                                 }
                                 return "0x" + r
                             },
                             addM: function (t) {
                                 "object" != typeof t && (t = new this.i(t));
                                 var e = this.limbs
                                     , r = t.limbs;
                                 for (t = e.length; t < r.length; t++)
                                     e[t] = 0;
                                 for (t = 0; t < r.length; t++)
                                     e[t] += r[t];
                                 return this
                             },
                             doubleM: function () {
                                 var t, e, r = 0, n = this.radix, i = this.radixMask, o = this.limbs;
                                 for (t = 0; t < o.length; t++)
                                     e = (e = o[t]) + e + r,
                                         o[t] = e & i,
                                         r = e >> n;
                                 return r && o.push(r),
                                     this
                             },
                             halveM: function () {
                                 var t, e, r = 0, n = this.radix, i = this.limbs;
                                 for (t = i.length - 1; 0 <= t; t--)
                                     e = i[t],
                                         i[t] = e + r >> 1,
                                         r = (1 & e) << n;
                                 return i[i.length - 1] || i.pop(),
                                     this
                             },
                             subM: function (t) {
                                 "object" != typeof t && (t = new this.i(t));
                                 var e = this.limbs
                                     , r = t.limbs;
                                 for (t = e.length; t < r.length; t++)
                                     e[t] = 0;
                                 for (t = 0; t < r.length; t++)
                                     e[t] -= r[t];
                                 return this
                             },
                             mod: function (t) {
                                 var e = !this.greaterEquals(new u.bn(0));
                                 t = new u.bn(t).normalize();
                                 var r = new u.bn(this).normalize()
                                     , n = 0;
                                 for (e && (r = new u.bn(0).subM(r).normalize()); r.greaterEquals(t); n++)
                                     t.doubleM();
                                 for (e && (r = t.sub(r).normalize()); 0 < n; n--)
                                     t.halveM(),
                                     r.greaterEquals(t) && r.subM(t).normalize();
                                 return r.trim()
                             },
                             inverseMod: function (t) {
                                 var e, r = new u.bn(1), n = new u.bn(0), o = new u.bn(this), s = new u.bn(t), a = 1;
                                 1 & t.limbs[0] || i(new u.exception.invalid("inverseMod: p must be odd"));
                                 do {
                                     for (1 & o.limbs[0] && (o.greaterEquals(s) || (e = o,
                                         o = s,
                                         s = e,
                                         e = r,
                                         r = n,
                                         n = e),
                                         o.subM(s),
                                         o.normalize(),
                                     r.greaterEquals(n) || r.addM(t),
                                         r.subM(n)),
                                              o.halveM(),
                                          1 & r.limbs[0] && r.addM(t),
                                              r.normalize(),
                                              r.halveM(),
                                              e = a = 0; e < o.limbs.length; e++)
                                         a |= o.limbs[e]
                                 } while (a);
                                 return s.equals(1) || i(new u.exception.invalid("inverseMod: p and x must be relatively prime")),
                                     n
                             },
                             add: function (t) {
                                 return this.copy().addM(t)
                             },
                             sub: function (t) {
                                 return this.copy().subM(t)
                             },
                             mul: function (t) {
                                 "number" == typeof t && (t = new this.i(t));
                                 var e, r, n = this.limbs, i = t.limbs, o = n.length, s = i.length, a = new this.i,
                                     u = a.limbs, c = this.maxMul;
                                 for (e = 0; e < this.limbs.length + t.limbs.length + 1; e++)
                                     u[e] = 0;
                                 for (e = 0; e < o; e++) {
                                     for (r = n[e],
                                              t = 0; t < s; t++)
                                         u[e + t] += r * i[t];
                                     --c || (c = this.maxMul,
                                         a.cnormalize())
                                 }
                                 return a.cnormalize().reduce()
                             },
                             square: function () {
                                 return this.mul(this)
                             },
                             power: function (t) {
                                 "number" == typeof t ? t = [t] : t.limbs !== o && (t = t.normalize().limbs);
                                 var e, r, n = new this.i(1), i = this;
                                 for (e = 0; e < t.length; e++)
                                     for (r = 0; r < this.radix; r++)
                                         t[e] & 1 << r && (n = n.mul(i)),
                                             i = i.square();
                                 return n
                             },
                             mulmod: function (t, e) {
                                 return this.mod(e).mul(t.mod(e)).mod(e)
                             },
                             powermod: function (t, e) {
                                 for (var r = new u.bn(1), n = new u.bn(this), i = new u.bn(t); 1 & i.limbs[0] && (r = r.mulmod(n, e)),
                                     i.halveM(),
                                     !i.equals(0);)
                                     n = n.mulmod(n, e);
                                 return r.normalize().reduce()
                             },
                             trim: function () {
                                 var t, e = this.limbs;
                                 do {
                                     t = e.pop()
                                 } while (e.length && 0 === t);
                                 return e.push(t),
                                     this
                             },
                             reduce: function () {
                                 return this
                             },
                             fullReduce: function () {
                                 return this.normalize()
                             },
                             normalize: function () {
                                 var t, e = 0, r = this.placeVal, n = this.ipv, i = this.limbs, o = i.length,
                                     s = this.radixMask;
                                 for (t = 0; t < o || 0 !== e && -1 !== e; t++)
                                     e = ((e = (i[t] || 0) + e) - (i[t] = e & s)) * n;
                                 return -1 === e && (i[t - 1] -= r),
                                     this
                             },
                             cnormalize: function () {
                                 var t, e = 0, r = this.ipv, n = this.limbs, i = n.length, o = this.radixMask;
                                 for (t = 0; t < i - 1; t++)
                                     e = ((e = n[t] + e) - (n[t] = e & o)) * r;
                                 return n[t] += e,
                                     this
                             },
                             toBits: function (t) {
                                 this.fullReduce(),
                                     t = t || this.exponent || this.bitLength();
                                 var e = Math.floor((t - 1) / 24)
                                     , r = u.bitArray
                                     , n = [r.partial((t + 7 & -8) % this.radix || this.radix, this.getLimb(e))];
                                 for (e--; 0 <= e; e--)
                                     n = r.concat(n, [r.partial(Math.min(this.radix, t), this.getLimb(e))]),
                                         t -= this.radix;
                                 return n
                             },
                             bitLength: function () {
                                 this.fullReduce();
                                 for (var t = this.radix * (this.limbs.length - 1), e = this.limbs[this.limbs.length - 1]; e; e >>>= 1)
                                     t++;
                                 return t + 7 & -8
                             }
                         },
                         u.bn.fromBits = function (t) {
                             var e = new this
                                 , r = []
                                 , n = u.bitArray
                                 , i = this.prototype
                                 , o = Math.min(this.bitLength || 4294967296, n.bitLength(t))
                                 , s = o % i.radix || i.radix;
                             for (r[0] = n.extract(t, 0, s); s < o; s += i.radix)
                                 r.unshift(n.extract(t, s, i.radix));
                             return e.limbs = r,
                                 e
                         }
                         ,
                         u.bn.prototype.ipv = 1 / (u.bn.prototype.placeVal = Math.pow(2, u.bn.prototype.radix)),
                         u.bn.prototype.radixMask = (1 << u.bn.prototype.radix) - 1,
                         u.bn.pseudoMersennePrime = function (t, e) {
                             function r(t) {
                                 this.initWith(t)
                             }

                             var n, i, o = r.prototype = new u.bn;
                             for (n = o.modOffset = Math.ceil(i = t / o.radix),
                                      o.exponent = t,
                                      o.offset = [],
                                      o.factor = [],
                                      o.minOffset = n,
                                      o.fullMask = 0,
                                      o.fullOffset = [],
                                      o.fullFactor = [],
                                      o.modulus = r.modulus = new u.bn(Math.pow(2, t)),
                                      o.fullMask = 0 | -Math.pow(2, t % o.radix),
                                      n = 0; n < e.length; n++)
                                 o.offset[n] = Math.floor(e[n][0] / o.radix - i),
                                     o.fullOffset[n] = Math.ceil(e[n][0] / o.radix - i),
                                     o.factor[n] = e[n][1] * Math.pow(.5, t - e[n][0] + o.offset[n] * o.radix),
                                     o.fullFactor[n] = e[n][1] * Math.pow(.5, t - e[n][0] + o.fullOffset[n] * o.radix),
                                     o.modulus.addM(new u.bn(Math.pow(2, e[n][0]) * e[n][1])),
                                     o.minOffset = Math.min(o.minOffset, -o.offset[n]);
                             return o.i = r,
                                 o.modulus.cnormalize(),
                                 o.reduce = function () {
                                     var t, e, r, n, i = this.modOffset, o = this.limbs, s = this.offset,
                                         a = this.offset.length, u = this.factor;
                                     for (t = this.minOffset; o.length > i;) {
                                         for (r = o.pop(),
                                                  n = o.length,
                                                  e = 0; e < a; e++)
                                             o[n + s[e]] -= u[e] * r;
                                         --t || (o.push(0),
                                             this.cnormalize(),
                                             t = this.minOffset)
                                     }
                                     return this.cnormalize(),
                                         this
                                 }
                                 ,
                                 o.fa = -1 === o.fullMask ? o.reduce : function () {
                                     var t, e, r = this.limbs, n = r.length - 1;
                                     if (this.reduce(),
                                     n === this.modOffset - 1) {
                                         for (e = r[n] & this.fullMask,
                                                  r[n] -= e,
                                                  t = 0; t < this.fullOffset.length; t++)
                                             r[n + this.fullOffset[t]] -= this.fullFactor[t] * e;
                                         this.normalize()
                                     }
                                 }
                                 ,
                                 o.fullReduce = function () {
                                     var t, e;
                                     for (this.fa(),
                                              this.addM(this.modulus),
                                              this.addM(this.modulus),
                                              this.normalize(),
                                              this.fa(),
                                              e = this.limbs.length; e < this.modOffset; e++)
                                         this.limbs[e] = 0;
                                     for (t = this.greaterEquals(this.modulus),
                                              e = 0; e < this.limbs.length; e++)
                                         this.limbs[e] -= this.modulus.limbs[e] * t;
                                     return this.cnormalize(),
                                         this
                                 }
                                 ,
                                 o.inverse = function () {
                                     return this.power(this.modulus.sub(2))
                                 }
                                 ,
                                 r.fromBits = u.bn.fromBits,
                                 r
                         }
                     ;
                     var x = u.bn.pseudoMersennePrime;
                     u.bn.prime = {
                         p127: x(127, [[0, -1]]),
                         p25519: x(255, [[0, -19]]),
                         p192k: x(192, [[32, -1], [12, -1], [8, -1], [7, -1], [6, -1], [3, -1], [0, -1]]),
                         p224k: x(224, [[32, -1], [12, -1], [11, -1], [9, -1], [7, -1], [4, -1], [1, -1], [0, -1]]),
                         p256k: x(256, [[32, -1], [9, -1], [8, -1], [7, -1], [6, -1], [4, -1], [0, -1]]),
                         p192: x(192, [[0, -1], [64, -1]]),
                         p224: x(224, [[0, 1], [96, -1]]),
                         p256: x(256, [[0, -1], [96, 1], [192, 1], [224, -1]]),
                         p384: x(384, [[0, -1], [32, 1], [96, -1], [128, -1]]),
                         p521: x(521, [[0, -1]])
                     },
                         u.bn.random = function (t, e) {
                             "object" != typeof t && (t = new u.bn(t));
                             for (var r, n, i = t.limbs.length, o = t.limbs[i - 1] + 1, s = new u.bn; ;) {
                                 do {
                                     0 > (r = u.random.randomWords(i, e))[i - 1] && (r[i - 1] += 4294967296)
                                 } while (Math.floor(r[i - 1] / o) === Math.floor(4294967296 / o));
                                 for (r[i - 1] %= o,
                                          n = 0; n < i - 1; n++)
                                     r[n] &= t.radixMask;
                                 if (s.limbs = r,
                                     !s.greaterEquals(t))
                                     return s
                             }
                         }
                         ,
                         u.ecc = {},
                         u.ecc.point = function (t, e, r) {
                             e === o ? this.isIdentity = s : (e instanceof u.bn && (e = new t.field(e)),
                             r instanceof u.bn && (r = new t.field(r)),
                                 this.x = e,
                                 this.y = r,
                                 this.isIdentity = a),
                                 this.curve = t
                         }
                         ,
                         u.ecc.point.prototype = {
                             toJac: function () {
                                 return new u.ecc.pointJac(this.curve, this.x, this.y, new this.curve.field(1))
                             },
                             mult: function (t) {
                                 return this.toJac().mult(t, this).toAffine()
                             },
                             mult2: function (t, e, r) {
                                 return this.toJac().mult2(t, this, e, r).toAffine()
                             },
                             multiples: function () {
                                 var t, e, r;
                                 if (this.ca === o)
                                     for (r = this.toJac().doubl(),
                                              t = this.ca = [new u.ecc.point(this.curve), this, r.toAffine()],
                                              e = 3; 16 > e; e++)
                                         r = r.add(this),
                                             t.push(r.toAffine());
                                 return this.ca
                             },
                             isValid: function () {
                                 return this.y.square().equals(this.curve.b.add(this.x.mul(this.curve.a.add(this.x.square()))))
                             },
                             toBits: function () {
                                 return u.bitArray.concat(this.x.toBits(), this.y.toBits())
                             }
                         },
                         u.ecc.pointJac = function (t, e, r, n) {
                             e === o ? this.isIdentity = s : (this.x = e,
                                 this.y = r,
                                 this.z = n,
                                 this.isIdentity = a),
                                 this.curve = t
                         }
                         ,
                         u.ecc.pointJac.prototype = {
                             add: function (t) {
                                 var e, r, n, o;
                                 return this.curve !== t.curve && i("sjcl['ecc']['add'](): Points must be on the same curve to add them!"),
                                     this.isIdentity ? t.toJac() : t.isIdentity ? this : (e = this.z.square(),
                                         (r = t.x.mul(e).subM(this.x)).equals(0) ? this.y.equals(t.y.mul(e.mul(this.z))) ? this.doubl() : new u.ecc.pointJac(this.curve) : (e = t.y.mul(e.mul(this.z)).subM(this.y),
                                             n = r.square(),
                                             t = e.square(),
                                             o = r.square().mul(r).addM(this.x.add(this.x).mul(n)),
                                             t = t.subM(o),
                                             e = this.x.mul(n).subM(t).mul(e),
                                             n = this.y.mul(r.square().mul(r)),
                                             e = e.subM(n),
                                             r = this.z.mul(r),
                                             new u.ecc.pointJac(this.curve, t, e, r)))
                             },
                             doubl: function () {
                                 if (this.isIdentity)
                                     return this;
                                 var t = (r = this.y.square()).mul(this.x.mul(4))
                                     , e = r.square().mul(8)
                                     , r = this.z.square()
                                     ,
                                     n = this.curve.a.toString() == new u.bn(-3).toString() ? this.x.sub(r).mul(3).mul(this.x.add(r)) : this.x.square().mul(3).add(r.square().mul(this.curve.a));
                                 return r = n.square().subM(t).subM(t),
                                     t = t.sub(r).mul(n).subM(e),
                                     e = this.y.add(this.y).mul(this.z),
                                     new u.ecc.pointJac(this.curve, r, t, e)
                             },
                             toAffine: function () {
                                 if (this.isIdentity || this.z.equals(0))
                                     return new u.ecc.point(this.curve);
                                 var t = this.z.inverse()
                                     , e = t.square();
                                 return new u.ecc.point(this.curve, this.x.mul(e).fullReduce(), this.y.mul(e.mul(t)).fullReduce())
                             },
                             mult: function (t, e) {
                                 "number" == typeof t ? t = [t] : t.limbs !== o && (t = t.normalize().limbs);
                                 var r, n, i = new u.ecc.point(this.curve).toJac(), s = e.multiples();
                                 for (r = t.length - 1; 0 <= r; r--)
                                     for (n = u.bn.prototype.radix - 4; 0 <= n; n -= 4)
                                         i = i.doubl().doubl().doubl().doubl().add(s[t[r] >> n & 15]);
                                 return i
                             },
                             mult2: function (t, e, r, n) {
                                 "number" == typeof t ? t = [t] : t.limbs !== o && (t = t.normalize().limbs),
                                     "number" == typeof r ? r = [r] : r.limbs !== o && (r = r.normalize().limbs);
                                 var i, s = new u.ecc.point(this.curve).toJac();
                                 e = e.multiples();
                                 var a, c, f = n.multiples();
                                 for (n = Math.max(t.length, r.length) - 1; 0 <= n; n--)
                                     for (a = 0 | t[n],
                                              c = 0 | r[n],
                                              i = u.bn.prototype.radix - 4; 0 <= i; i -= 4)
                                         s = s.doubl().doubl().doubl().doubl().add(e[a >> i & 15]).add(f[c >> i & 15]);
                                 return s
                             },
                             isValid: function () {
                                 var t = (e = this.z.square()).square()
                                     , e = t.mul(e);
                                 return this.y.square().equals(this.curve.b.mul(e).add(this.x.mul(this.curve.a.mul(t).add(this.x.square()))))
                             }
                         },
                         u.ecc.curve = function (t, e, r, n, i, o) {
                             this.field = t,
                                 this.r = new u.bn(e),
                                 this.a = new t(r),
                                 this.b = new t(n),
                                 this.G = new u.ecc.point(this, new t(i), new t(o))
                         }
                         ,
                         u.ecc.curve.prototype.fromBits = function (t) {
                             var e = u.bitArray
                                 , r = this.field.prototype.exponent + 7 & -8;
                             return (t = new u.ecc.point(this, this.field.fromBits(e.bitSlice(t, 0, r)), this.field.fromBits(e.bitSlice(t, r, 2 * r)))).isValid() || i(new u.exception.corrupt("not on the curve!")),
                                 t
                         }
                         ,
                         u.ecc.curves = {
                             c192: new u.ecc.curve(u.bn.prime.p192, "0xffffffffffffffffffffffff99def836146bc9b1b4d22831", -3, "0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1", "0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012", "0x07192b95ffc8da78631011ed6b24cdd573f977a11e794811"),
                             c224: new u.ecc.curve(u.bn.prime.p224, "0xffffffffffffffffffffffffffff16a2e0b8f03e13dd29455c5c2a3d", -3, "0xb4050a850c04b3abf54132565044b0b7d7bfd8ba270b39432355ffb4", "0xb70e0cbd6bb4bf7f321390b94a03c1d356c21122343280d6115c1d21", "0xbd376388b5f723fb4c22dfe6cd4375a05a07476444d5819985007e34"),
                             c256: new u.ecc.curve(u.bn.prime.p256, "0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551", -3, "0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b", "0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296", "0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"),
                             c384: new u.ecc.curve(u.bn.prime.p384, "0xffffffffffffffffffffffffffffffffffffffffffffffffc7634d81f4372ddf581a0db248b0a77aecec196accc52973", -3, "0xb3312fa7e23ee7e4988e056be3f82d19181d9c6efe8141120314088f5013875ac656398d8a2ed19d2a85c8edd3ec2aef", "0xaa87ca22be8b05378eb1c71ef320ad746e1d3b628ba79b9859f741e082542a385502f25dbf55296c3a545e3872760ab7", "0x3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f"),
                             k192: new u.ecc.curve(u.bn.prime.p192k, "0xfffffffffffffffffffffffe26f2fc170f69466a74defd8d", 0, 3, "0xdb4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d", "0x9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d"),
                             k224: new u.ecc.curve(u.bn.prime.p224k, "0x010000000000000000000000000001dce8d2ec6184caf0a971769fb1f7", 0, 5, "0xa1455b334df099df30fc28a169a467e9e47075a90f7e650eb6b7a45c", "0x7e089fed7fba344282cafbd6f7e319f7c0b0bd59e2ca4bdb556d61a5"),
                             k256: new u.ecc.curve(u.bn.prime.p256k, "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 0, 7, "0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8")
                         },
                         u.ecc.basicKey = {
                             publicKey: function (t, e) {
                                 this.l = t,
                                     this.s = t.r.bitLength(),
                                     this.I = e instanceof Array ? t.fromBits(e) : e,
                                     this.get = function () {
                                         var t = this.I.toBits()
                                             , e = u.bitArray.bitLength(t);
                                         return {
                                             x: u.bitArray.bitSlice(t, 0, e / 2),
                                             y: t = u.bitArray.bitSlice(t, e / 2)
                                         }
                                     }
                             },
                             secretKey: function (t, e) {
                                 this.l = t,
                                     this.s = t.r.bitLength(),
                                     this.H = e,
                                     this.get = function () {
                                         return this.H.toBits()
                                     }
                             }
                         },
                         u.ecc.basicKey.generateKeys = function (t) {
                             return function (e, r, n) {
                                 return "number" == typeof (e = e || 256) && (e = u.ecc.curves["c" + e]) === o && i(new u.exception.invalid("no such curve")),
                                     n = n || u.bn.random(e.r, r),
                                     r = e.G.mult(n),
                                     {
                                         pub: new u.ecc[t].publicKey(e, r),
                                         sec: new u.ecc[t].secretKey(e, n)
                                     }
                             }
                         }
                         ,
                         u.ecc.elGamal = {
                             generateKeys: u.ecc.basicKey.generateKeys("elGamal"),
                             publicKey: function (t, e) {
                                 u.ecc.basicKey.publicKey.apply(this, arguments)
                             },
                             secretKey: function (t, e) {
                                 u.ecc.basicKey.secretKey.apply(this, arguments)
                             }
                         },
                         u.ecc.elGamal.publicKey.prototype = {
                             kem: function (t) {
                                 t = u.bn.random(this.l.r, t);
                                 var e = this.l.G.mult(t).toBits();
                                 return {
                                     key: u.hash.sha256.hash(this.I.mult(t).toBits()),
                                     tag: e
                                 }
                             }
                         },
                         u.ecc.elGamal.secretKey.prototype = {
                             unkem: function (t) {
                                 return u.hash.sha256.hash(this.l.fromBits(t).mult(this.H).toBits())
                             },
                             dh: function (t) {
                                 return u.hash.sha256.hash(t.I.mult(this.H).toBits())
                             },
                             dhJavaEc: function (t) {
                                 return t.I.mult(this.H).x.toBits()
                             }
                         },
                         u.ecc.ecdsa = {
                             generateKeys: u.ecc.basicKey.generateKeys("ecdsa")
                         },
                         u.ecc.ecdsa.publicKey = function (t, e) {
                             u.ecc.basicKey.publicKey.apply(this, arguments)
                         }
                         ,
                         u.ecc.ecdsa.publicKey.prototype = {
                             verify: function (t, e, r) {
                                 u.bitArray.bitLength(t) > this.s && (t = u.bitArray.clamp(t, this.s));
                                 var n = u.bitArray
                                     , a = this.l.r
                                     , c = this.s
                                     , f = u.bn.fromBits(n.bitSlice(e, 0, c))
                                     , h = (n = u.bn.fromBits(n.bitSlice(e, c, 2 * c)),
                                     r ? n : n.inverseMod(a));
                                 if (c = u.bn.fromBits(t).mul(h).mod(a),
                                     h = f.mul(h).mod(a),
                                     c = this.l.G.mult2(c, h, this.I).x,
                                 f.equals(0) || n.equals(0) || f.greaterEquals(a) || n.greaterEquals(a) || !c.equals(f)) {
                                     if (r === o)
                                         return this.verify(t, e, s);
                                     i(new u.exception.corrupt("signature didn't check out"))
                                 }
                                 return s
                             }
                         },
                         u.ecc.ecdsa.secretKey = function (t, e) {
                             u.ecc.basicKey.secretKey.apply(this, arguments)
                         }
                         ,
                         u.ecc.ecdsa.secretKey.prototype = {
                             sign: function (t, e, r, n) {
                                 u.bitArray.bitLength(t) > this.s && (t = u.bitArray.clamp(t, this.s));
                                 var i = this.l.r
                                     , o = i.bitLength();
                                 return n = n || u.bn.random(i.sub(1), e).add(1),
                                     e = this.l.G.mult(n).x.mod(i),
                                     t = u.bn.fromBits(t).add(e.mul(this.H)),
                                     r = r ? t.inverseMod(i).mul(n).mod(i) : t.mul(n.inverseMod(i)).mod(i),
                                     u.bitArray.concat(e.toBits(o), r.toBits(o))
                             }
                         },
                         u.keyexchange.srp = {
                             makeVerifier: function (t, e, r, n) {
                                 return t = u.keyexchange.srp.makeX(t, e, r),
                                     t = u.bn.fromBits(t),
                                     n.g.powermod(t, n.N)
                             },
                             makeX: function (t, e, r) {
                                 return t = u.hash.sha1.hash(t + ":" + e),
                                     u.hash.sha1.hash(u.bitArray.concat(r, t))
                             },
                             knownGroup: function (t) {
                                 return "string" != typeof t && (t = t.toString()),
                                 u.keyexchange.srp.Z || u.keyexchange.srp.qa(),
                                     u.keyexchange.srp.ba[t]
                             },
                             Z: a,
                             qa: function () {
                                 var t, e;
                                 for (t = 0; t < u.keyexchange.srp.aa.length; t++)
                                     e = u.keyexchange.srp.aa[t].toString(),
                                         (e = u.keyexchange.srp.ba[e]).N = new u.bn(e.N),
                                         e.g = new u.bn(e.g);
                                 u.keyexchange.srp.Z = s
                             },
                             aa: [1024, 1536, 2048],
                             ba: {
                                 1024: {
                                     N: "EEAF0AB9ADB38DD69C33F80AFA8FC5E86072618775FF3C0B9EA2314C9C256576D674DF7496EA81D3383B4813D692C6E0E0D5D8E250B98BE48E495C1D6089DAD15DC7D7B46154D6B6CE8EF4AD69B15D4982559B297BCF1885C529F566660E57EC68EDBC3C05726CC02FD4CBF4976EAA9AFD5138FE8376435B9FC61D2FC0EB06E3",
                                     g: 2
                                 },
                                 1536: {
                                     N: "9DEF3CAFB939277AB1F12A8617A47BBBDBA51DF499AC4C80BEEEA9614B19CC4D5F4F5F556E27CBDE51C6A94BE4607A291558903BA0D0F84380B655BB9A22E8DCDF028A7CEC67F0D08134B1C8B97989149B609E0BE3BAB63D47548381DBC5B1FC764E3F4B53DD9DA1158BFD3E2B9C8CF56EDF019539349627DB2FD53D24B7C48665772E437D6C7F8CE442734AF7CCB7AE837C264AE3A9BEB87F8A2FE9B8B5292E5A021FFF5E91479E8CE7A28C2442C6F315180F93499A234DCF76E3FED135F9BB",
                                     g: 2
                                 },
                                 2048: {
                                     N: "AC6BDB41324A9A9BF166DE5E1389582FAF72B6651987EE07FC3192943DB56050A37329CBB4A099ED8193E0757767A13DD52312AB4B03310DCD7F48A9DA04FD50E8083969EDB767B0CF6095179A163AB3661A05FBD5FAAAE82918A9962F0B93B855F97993EC975EEAA80D740ADBF4FF747359D041D5C33EA71D281E446B14773BCA97B43A23FB801676BD207A436C6481F1D2B9078717461A5B9D32E688F87748544523B524B0D57D5EA77A2775D2ECFA032CFBDBF52FB3786160279004E57AE6AF874E7303CE53299CCC041C7BC308D82A5698F3A8D0C38271AE35F8E9DBFBB694B5C803D89F7AE435DE236D525F54759B65E372FCD68EF20FA7111F9E4AFF73",
                                     g: 2
                                 }
                             }
                         }
                 }
                 , function (t, e, r) {
                     (function (e) {
                             var r = function (t) {
                                 return t && t.Math == Math && t
                             };
                             t.exports = r("object" == typeof globalThis && globalThis) || r("object" == typeof window && window) || r("object" == typeof self && self) || r("object" == typeof e && e) || Function("return this")()
                         }
                     ).call(this, r(23))
                 }
                 , function (t, e, r) {
                     var n = r(3)
                         , i = r(45)
                         , o = r(7)
                         , s = r(49)
                         , a = r(50)
                         , u = r(73)
                         , c = i("wks")
                         , f = n.Symbol
                         , h = u ? f : f && f.withoutSetter || s;
                     t.exports = function (t) {
                         return o(c, t) || (a && o(f, t) ? c[t] = f[t] : c[t] = h("Symbol." + t)),
                             c[t]
                     }
                 }
                 , function (t, e) {
                     t.exports = function (t) {
                         try {
                             return !!t()
                         } catch (t) {
                             return !0
                         }
                     }
                 }
                 , function (t, e, r) {
                     var n = r(13);
                     t.exports = function (t) {
                         if (!n(t))
                             throw TypeError(String(t) + " is not an object");
                         return t
                     }
                 }
                 , function (t, e) {
                     var r = {}.hasOwnProperty;
                     t.exports = function (t, e) {
                         return r.call(t, e)
                     }
                 }
                 , function (t, e, r) {
                     var n = r(3)
                         , i = r(36).f
                         , o = r(10)
                         , s = r(15)
                         , a = r(31)
                         , u = r(78)
                         , c = r(57);
                     t.exports = function (t, e) {
                         var r, f, h, l, p, d = t.target, v = t.global, y = t.stat;
                         if (r = v ? n : y ? n[d] || a(d, {}) : (n[d] || {}).prototype)
                             for (f in e) {
                                 if (l = e[f],
                                     h = t.noTargetGet ? (p = i(r, f)) && p.value : r[f],
                                 !c(v ? f : d + (y ? "." : "#") + f, t.forced) && void 0 !== h) {
                                     if (typeof l == typeof h)
                                         continue;
                                     u(l, h)
                                 }
                                 (t.sham || h && h.sham) && o(l, "sham", !0),
                                     s(r, f, l, t)
                             }
                     }
                 }
                 , function (t, e, r) {
                     "use strict";
                     (function (t) {
                             var r = null
                                 , n = null;
                             "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? (r = self.crypto || self.msCrypto) && (n = r.subtle) : (r = t.crypto || t.msCrypto) && (n = r.subtle),
                                 e.a = {
                                     WebCrypto: r,
                                     SubtleCrypto: n
                                 }
                         }
                     ).call(this, r(23))
                 }
                 , function (t, e, r) {
                     var n = r(11)
                         , i = r(12)
                         , o = r(24);
                     t.exports = n ? function (t, e, r) {
                             return i.f(t, e, o(1, r))
                         }
                         : function (t, e, r) {
                             return t[e] = r,
                                 t
                         }
                 }
                 , function (t, e, r) {
                     var n = r(5);
                     t.exports = !n((function () {
                             return 7 != Object.defineProperty({}, 1, {
                                 get: function () {
                                     return 7
                                 }
                             })[1]
                         }
                     ))
                 }
                 , function (t, e, r) {
                     var n = r(11)
                         , i = r(47)
                         , o = r(6)
                         , s = r(48)
                         , a = Object.defineProperty;
                     e.f = n ? a : function (t, e, r) {
                         if (o(t),
                             e = s(e, !0),
                             o(r),
                             i)
                             try {
                                 return a(t, e, r)
                             } catch (t) {
                             }
                         if ("get" in r || "set" in r)
                             throw TypeError("Accessors not supported");
                         return "value" in r && (t[e] = r.value),
                             t
                     }
                 }
                 , function (t, e) {
                     t.exports = function (t) {
                         return "object" == typeof t ? null !== t : "function" == typeof t
                     }
                 }
                 , function (t, e, r) {
                     var n = r(37)
                         , i = r(3)
                         , o = function (t) {
                         return "function" == typeof t ? t : void 0
                     };
                     t.exports = function (t, e) {
                         return arguments.length < 2 ? o(n[t]) || o(i[t]) : n[t] && n[t][e] || i[t] && i[t][e]
                     }
                 }
                 , function (t, e, r) {
                     var n = r(3)
                         , i = r(10)
                         , o = r(7)
                         , s = r(31)
                         , a = r(33)
                         , u = r(18)
                         , c = u.get
                         , f = u.enforce
                         , h = String(String).split("String");
                     (t.exports = function (t, e, r, a) {
                             var u = !!a && !!a.unsafe
                                 , c = !!a && !!a.enumerable
                                 , l = !!a && !!a.noTargetGet;
                             "function" == typeof r && ("string" != typeof e || o(r, "name") || i(r, "name", e),
                                 f(r).source = h.join("string" == typeof e ? e : "")),
                                 t !== n ? (u ? !l && t[e] && (c = !0) : delete t[e],
                                     c ? t[e] = r : i(t, e, r)) : c ? t[e] = r : s(e, r)
                         }
                     )(Function.prototype, "toString", (function () {
                             return "function" == typeof this && c(this).source || a(this)
                         }
                     ))
                 }
                 , function (t, e) {
                     t.exports = function (t) {
                         if ("function" != typeof t)
                             throw TypeError(String(t) + " is not a function");
                         return t
                     }
                 }
                 , function (t, e) {
                     t.exports = !1
                 }
                 , function (t, e, r) {
                     var n, i, o, s = r(74), a = r(3), u = r(13), c = r(10), f = r(7), h = r(34), l = r(35),
                         p = a.WeakMap;
                     if (s) {
                         var d = new p
                             , v = d.get
                             , y = d.has
                             , m = d.set;
                         n = function (t, e) {
                             return m.call(d, t, e),
                                 e
                         }
                             ,
                             i = function (t) {
                                 return v.call(d, t) || {}
                             }
                             ,
                             o = function (t) {
                                 return y.call(d, t)
                             }
                     } else {
                         var g = h("state");
                         l[g] = !0,
                             n = function (t, e) {
                                 return c(t, g, e),
                                     e
                             }
                             ,
                             i = function (t) {
                                 return f(t, g) ? t[g] : {}
                             }
                             ,
                             o = function (t) {
                                 return f(t, g)
                             }
                     }
                     t.exports = {
                         set: n,
                         get: i,
                         has: o,
                         enforce: function (t) {
                             return o(t) ? i(t) : n(t, {})
                         },
                         getterFor: function (t) {
                             return function (e) {
                                 var r;
                                 if (!u(e) || (r = i(e)).type !== t)
                                     throw TypeError("Incompatible receiver, " + t + " required");
                                 return r
                             }
                         }
                     }
                 }
                 , function (t, e) {
                     var r = {}.toString;
                     t.exports = function (t) {
                         return r.call(t).slice(8, -1)
                     }
                 }
                 , function (t, e) {
                     t.exports = function (t) {
                         if (null == t)
                             throw TypeError("Can't call method on " + t);
                         return t
                     }
                 }
                 , function (t, e) {
                     t.exports = {}
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(16)
                         , i = function (t) {
                         var e, r;
                         this.promise = new t((function (t, n) {
                                 if (void 0 !== e || void 0 !== r)
                                     throw TypeError("Bad Promise constructor");
                                 e = t,
                                     r = n
                             }
                         )),
                             this.resolve = n(e),
                             this.reject = n(r)
                     };
                     t.exports.f = function (t) {
                         return new i(t)
                     }
                 }
                 , function (t, e) {
                     var r;
                     r = function () {
                         return this
                     }();
                     try {
                         r = r || new Function("return this")()
                     } catch (t) {
                         "object" == typeof window && (r = window)
                     }
                     t.exports = r
                 }
                 , function (t, e) {
                     t.exports = function (t, e) {
                         return {
                             enumerable: !(1 & t),
                             configurable: !(2 & t),
                             writable: !(4 & t),
                             value: e
                         }
                     }
                 }
                 , function (t, e) {
                     var r = Math.ceil
                         , n = Math.floor;
                     t.exports = function (t) {
                         return isNaN(t = +t) ? 0 : (t > 0 ? n : r)(t)
                     }
                 }
                 , function (t, e, r) {
                     var n = r(54)
                         , i = r(20);
                     t.exports = function (t) {
                         return n(i(t))
                     }
                 }
                 , function (t, e, r) {
                     var n = r(6)
                         , i = r(95)
                         , o = r(38)
                         , s = r(43)
                         , a = r(96)
                         , u = r(97)
                         , c = function (t, e) {
                         this.stopped = t,
                             this.result = e
                     };
                     (t.exports = function (t, e, r, f, h) {
                             var l, p, d, v, y, m, g, b = s(e, r, f ? 2 : 1);
                             if (h)
                                 l = t;
                             else {
                                 if ("function" != typeof (p = a(t)))
                                     throw TypeError("Target is not iterable");
                                 if (i(p)) {
                                     for (d = 0,
                                              v = o(t.length); v > d; d++)
                                         if ((y = f ? b(n(g = t[d])[0], g[1]) : b(t[d])) && y instanceof c)
                                             return y;
                                     return new c(!1)
                                 }
                                 l = p.call(t)
                             }
                             for (m = l.next; !(g = m.call(l)).done;)
                                 if ("object" == typeof (y = u(l, b, g.value, f)) && y && y instanceof c)
                                     return y;
                             return new c(!1)
                         }
                     ).stop = function (t) {
                         return new c(!0, t)
                     }
                 }
                 , function (t, e) {
                     t.exports = function (t) {
                         try {
                             return {
                                 error: !1,
                                 value: t()
                             }
                         } catch (t) {
                             return {
                                 error: !0,
                                 value: t
                             }
                         }
                     }
                 }
                 , function (t, e) {
                     t.exports = function (t) {
                         for (var e = 0, r = t.length - 1; e < r; ++e,
                             --r) {
                             var n = t[r];
                             t[r] = t[e],
                                 t[e] = n
                         }
                         return t
                     }
                 }
                 , function (t, e, r) {
                     var n = {};
                     n[r(4)("toStringTag")] = "z",
                         t.exports = "[object z]" === String(n)
                 }
                 , function (t, e, r) {
                     var n = r(3)
                         , i = r(10);
                     t.exports = function (t, e) {
                         try {
                             i(n, t, e)
                         } catch (r) {
                             n[t] = e
                         }
                         return e
                     }
                 }
                 , function (t, e, r) {
                     var n = r(3)
                         , i = r(13)
                         , o = n.document
                         , s = i(o) && i(o.createElement);
                     t.exports = function (t) {
                         return s ? o.createElement(t) : {}
                     }
                 }
                 , function (t, e, r) {
                     var n = r(46)
                         , i = Function.toString;
                     "function" != typeof n.inspectSource && (n.inspectSource = function (t) {
                             return i.call(t)
                         }
                     ),
                         t.exports = n.inspectSource
                 }
                 , function (t, e, r) {
                     var n = r(45)
                         , i = r(49)
                         , o = n("keys");
                     t.exports = function (t) {
                         return o[t] || (o[t] = i(t))
                     }
                 }
                 , function (t, e) {
                     t.exports = {}
                 }
                 , function (t, e, r) {
                     var n = r(11)
                         , i = r(53)
                         , o = r(24)
                         , s = r(26)
                         , a = r(48)
                         , u = r(7)
                         , c = r(47)
                         , f = Object.getOwnPropertyDescriptor;
                     e.f = n ? f : function (t, e) {
                         if (t = s(t),
                             e = a(e, !0),
                             c)
                             try {
                                 return f(t, e)
                             } catch (t) {
                             }
                         if (u(t, e))
                             return o(!i.f.call(t, e), t[e])
                     }
                 }
                 , function (t, e, r) {
                     var n = r(3);
                     t.exports = n
                 }
                 , function (t, e, r) {
                     var n = r(25)
                         , i = Math.min;
                     t.exports = function (t) {
                         return t > 0 ? i(n(t), 9007199254740991) : 0
                     }
                 }
                 , function (t, e) {
                     t.exports = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"]
                 }
                 , function (t, e, r) {
                     var n = r(7)
                         , i = r(59)
                         , o = r(34)
                         , s = r(84)
                         , a = o("IE_PROTO")
                         , u = Object.prototype;
                     t.exports = s ? Object.getPrototypeOf : function (t) {
                         return t = i(t),
                             n(t, a) ? t[a] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? u : null
                     }
                 }
                 , function (t, e, r) {
                     var n, i = r(6), o = r(85), s = r(39), a = r(35), u = r(61), c = r(32), f = r(34)("IE_PROTO"),
                         h = function () {
                         }, l = function (t) {
                             return "<script>" + t + "<\/script>"
                         }, p = function () {
                             try {
                                 n = document.domain && new ActiveXObject("htmlfile")
                             } catch (t) {
                             }
                             var t, e;
                             p = n ? function (t) {
                                 t.write(l("")),
                                     t.close();
                                 var e = t.parentWindow.Object;
                                 return t = null,
                                     e
                             }(n) : ((e = c("iframe")).style.display = "none",
                                 u.appendChild(e),
                                 e.src = String("javascript:"),
                                 (t = e.contentWindow.document).open(),
                                 t.write(l("document.F=Object")),
                                 t.close(),
                                 t.F);
                             for (var r = s.length; r--;)
                                 delete p.prototype[s[r]];
                             return p()
                         };
                     a[f] = !0,
                         t.exports = Object.create || function (t, e) {
                             var r;
                             return null !== t ? (h.prototype = i(t),
                                 r = new h,
                                 h.prototype = null,
                                 r[f] = t) : r = p(),
                                 void 0 === e ? r : o(r, e)
                         }
                 }
                 , function (t, e, r) {
                     var n = r(12).f
                         , i = r(7)
                         , o = r(4)("toStringTag");
                     t.exports = function (t, e, r) {
                         t && !i(t = r ? t : t.prototype, o) && n(t, o, {
                             configurable: !0,
                             value: e
                         })
                     }
                 }
                 , function (t, e, r) {
                     var n = r(16);
                     t.exports = function (t, e, r) {
                         if (n(t),
                         void 0 === e)
                             return t;
                         switch (r) {
                             case 0:
                                 return function () {
                                     return t.call(e)
                                 }
                                     ;
                             case 1:
                                 return function (r) {
                                     return t.call(e, r)
                                 }
                                     ;
                             case 2:
                                 return function (r, n) {
                                     return t.call(e, r, n)
                                 }
                                     ;
                             case 3:
                                 return function (r, n, i) {
                                     return t.call(e, r, n, i)
                                 }
                         }
                         return function () {
                             return t.apply(e, arguments)
                         }
                     }
                 }
                 , function (t, e, r) {
                     var n = r(14);
                     t.exports = n("navigator", "userAgent") || ""
                 }
                 , function (t, e, r) {
                     var n = r(17)
                         , i = r(46);
                     (t.exports = function (t, e) {
                             return i[t] || (i[t] = void 0 !== e ? e : {})
                         }
                     )("versions", []).push({
                         version: "3.6.3",
                         mode: n ? "pure" : "global",
                         copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
                     })
                 }
                 , function (t, e, r) {
                     var n = r(3)
                         , i = r(31)
                         , o = n["__core-js_shared__"] || i("__core-js_shared__", {});
                     t.exports = o
                 }
                 , function (t, e, r) {
                     var n = r(11)
                         , i = r(5)
                         , o = r(32);
                     t.exports = !n && !i((function () {
                             return 7 != Object.defineProperty(o("div"), "a", {
                                 get: function () {
                                     return 7
                                 }
                             }).a
                         }
                     ))
                 }
                 , function (t, e, r) {
                     var n = r(13);
                     t.exports = function (t, e) {
                         if (!n(t))
                             return t;
                         var r, i;
                         if (e && "function" == typeof (r = t.toString) && !n(i = r.call(t)))
                             return i;
                         if ("function" == typeof (r = t.valueOf) && !n(i = r.call(t)))
                             return i;
                         if (!e && "function" == typeof (r = t.toString) && !n(i = r.call(t)))
                             return i;
                         throw TypeError("Can't convert object to primitive value")
                     }
                 }
                 , function (t, e) {
                     var r = 0
                         , n = Math.random();
                     t.exports = function (t) {
                         return "Symbol(" + String(void 0 === t ? "" : t) + ")_" + (++r + n).toString(36)
                     }
                 }
                 , function (t, e, r) {
                     var n = r(5);
                     t.exports = !!Object.getOwnPropertySymbols && !n((function () {
                             return !String(Symbol())
                         }
                     ))
                 }
                 , function (t, e, r) {
                     var n = r(30)
                         , i = r(19)
                         , o = r(4)("toStringTag")
                         , s = "Arguments" == i(function () {
                         return arguments
                     }());
                     t.exports = n ? i : function (t) {
                         var e, r, n;
                         return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof (r = function (t, e) {
                             try {
                                 return t[e]
                             } catch (t) {
                             }
                         }(e = Object(t), o)) ? r : s ? i(e) : "Object" == (n = i(e)) && "function" == typeof e.callee ? "Arguments" : n
                     }
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(8)
                         , i = r(83)
                         , o = r(40)
                         , s = r(62)
                         , a = r(42)
                         , u = r(10)
                         , c = r(15)
                         , f = r(4)
                         , h = r(17)
                         , l = r(21)
                         , p = r(58)
                         , d = p.IteratorPrototype
                         , v = p.BUGGY_SAFARI_ITERATORS
                         , y = f("iterator")
                         , m = function () {
                         return this
                     };
                     t.exports = function (t, e, r, f, p, g, b) {
                         i(r, e, f);
                         var w, x, S, T = function (t) {
                                 if (t === p && O)
                                     return O;
                                 if (!v && t in A)
                                     return A[t];
                                 switch (t) {
                                     case "keys":
                                     case "values":
                                     case "entries":
                                         return function () {
                                             return new r(this, t)
                                         }
                                 }
                                 return function () {
                                     return new r(this)
                                 }
                             }, E = e + " Iterator", B = !1, A = t.prototype, k = A[y] || A["@@iterator"] || p && A[p],
                             O = !v && k || T(p), M = "Array" == e && A.entries || k;
                         if (M && (w = o(M.call(new t)),
                         d !== Object.prototype && w.next && (h || o(w) === d || (s ? s(w, d) : "function" != typeof w[y] && u(w, y, m)),
                             a(w, E, !0, !0),
                         h && (l[E] = m))),
                         "values" == p && k && "values" !== k.name && (B = !0,
                                 O = function () {
                                     return k.call(this)
                                 }
                         ),
                         h && !b || A[y] === O || u(A, y, O),
                             l[e] = O,
                             p)
                             if (x = {
                                 values: T("values"),
                                 keys: g ? O : T("keys"),
                                 entries: T("entries")
                             },
                                 b)
                                 for (S in x)
                                     !v && !B && S in A || c(A, S, x[S]);
                             else
                                 n({
                                     target: e,
                                     proto: !0,
                                     forced: v || B
                                 }, x);
                         return x
                     }
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = {}.propertyIsEnumerable
                         , i = Object.getOwnPropertyDescriptor
                         , o = i && !n.call({
                         1: 2
                     }, 1);
                     e.f = o ? function (t) {
                             var e = i(this, t);
                             return !!e && e.enumerable
                         }
                         : n
                 }
                 , function (t, e, r) {
                     var n = r(5)
                         , i = r(19)
                         , o = "".split;
                     t.exports = n((function () {
                             return !Object("z").propertyIsEnumerable(0)
                         }
                     )) ? function (t) {
                             return "String" == i(t) ? o.call(t, "") : Object(t)
                         }
                         : Object
                 }
                 , function (t, e, r) {
                     var n = r(7)
                         , i = r(26)
                         , o = r(81).indexOf
                         , s = r(35);
                     t.exports = function (t, e) {
                         var r, a = i(t), u = 0, c = [];
                         for (r in a)
                             !n(s, r) && n(a, r) && c.push(r);
                         for (; e.length > u;)
                             n(a, r = e[u++]) && (~o(c, r) || c.push(r));
                         return c
                     }
                 }
                 , function (t, e) {
                     e.f = Object.getOwnPropertySymbols
                 }
                 , function (t, e, r) {
                     var n = r(5)
                         , i = /#|\.prototype\./
                         , o = function (t, e) {
                         var r = a[s(t)];
                         return r == c || r != u && ("function" == typeof e ? n(e) : !!e)
                     }
                         , s = o.normalize = function (t) {
                         return String(t).replace(i, ".").toLowerCase()
                     }
                         , a = o.data = {}
                         , u = o.NATIVE = "N"
                         , c = o.POLYFILL = "P";
                     t.exports = o
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n, i, o, s = r(40), a = r(10), u = r(7), c = r(4), f = r(17), h = c("iterator"), l = !1;
                     [].keys && ("next" in (o = [].keys()) ? (i = s(s(o))) !== Object.prototype && (n = i) : l = !0),
                     null == n && (n = {}),
                     f || u(n, h) || a(n, h, (function () {
                             return this
                         }
                     )),
                         t.exports = {
                             IteratorPrototype: n,
                             BUGGY_SAFARI_ITERATORS: l
                         }
                 }
                 , function (t, e, r) {
                     var n = r(20);
                     t.exports = function (t) {
                         return Object(n(t))
                     }
                 }
                 , function (t, e, r) {
                     var n = r(55)
                         , i = r(39);
                     t.exports = Object.keys || function (t) {
                         return n(t, i)
                     }
                 }
                 , function (t, e, r) {
                     var n = r(14);
                     t.exports = n("document", "documentElement")
                 }
                 , function (t, e, r) {
                     var n = r(6)
                         , i = r(86);
                     t.exports = Object.setPrototypeOf || ("__proto__" in {} ? function () {
                         var t, e = !1, r = {};
                         try {
                             (t = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set).call(r, []),
                                 e = r instanceof Array
                         } catch (t) {
                         }
                         return function (r, o) {
                             return n(r),
                                 i(o),
                                 e ? t.call(r, o) : r.__proto__ = o,
                                 r
                         }
                     }() : void 0)
                 }
                 , function (t, e, r) {
                     var n = r(3);
                     t.exports = n.Promise
                 }
                 , function (t, e, r) {
                     var n = r(6)
                         , i = r(16)
                         , o = r(4)("species");
                     t.exports = function (t, e) {
                         var r, s = n(t).constructor;
                         return void 0 === s || null == (r = n(s)[o]) ? e : i(r)
                     }
                 }
                 , function (t, e, r) {
                     var n, i, o, s = r(3), a = r(5), u = r(19), c = r(43), f = r(61), h = r(32), l = r(66),
                         p = s.location, d = s.setImmediate, v = s.clearImmediate, y = s.process, m = s.MessageChannel,
                         g = s.Dispatch, b = 0, w = {}, x = function (t) {
                             if (w.hasOwnProperty(t)) {
                                 var e = w[t];
                                 delete w[t],
                                     e()
                             }
                         }, S = function (t) {
                             return function () {
                                 x(t)
                             }
                         }, T = function (t) {
                             x(t.data)
                         }, E = function (t) {
                             s.postMessage(t + "", p.protocol + "//" + p.host)
                         };
                     d && v || (d = function (t) {
                         for (var e = [], r = 1; arguments.length > r;)
                             e.push(arguments[r++]);
                         return w[++b] = function () {
                             ("function" == typeof t ? t : Function(t)).apply(void 0, e)
                         }
                             ,
                             n(b),
                             b
                     }
                         ,
                         v = function (t) {
                             delete w[t]
                         }
                         ,
                         "process" == u(y) ? n = function (t) {
                                 y.nextTick(S(t))
                             }
                             : g && g.now ? n = function (t) {
                                 g.now(S(t))
                             }
                             : m && !l ? (o = (i = new m).port2,
                                 i.port1.onmessage = T,
                                 n = c(o.postMessage, o, 1)) : !s.addEventListener || "function" != typeof postMessage || s.importScripts || a(E) ? n = "onreadystatechange" in h("script") ? function (t) {
                                     f.appendChild(h("script")).onreadystatechange = function () {
                                         f.removeChild(this),
                                             x(t)
                                     }
                                 }
                                 : function (t) {
                                     setTimeout(S(t), 0)
                                 }
                                 : (n = E,
                                     s.addEventListener("message", T, !1))),
                         t.exports = {
                             set: d,
                             clear: v
                         }
                 }
                 , function (t, e, r) {
                     var n = r(44);
                     t.exports = /(iphone|ipod|ipad).*applewebkit/i.test(n)
                 }
                 , function (t, e, r) {
                     var n = r(6)
                         , i = r(13)
                         , o = r(22);
                     t.exports = function (t, e) {
                         if (n(t),
                         i(e) && e.constructor === t)
                             return e;
                         var r = o.f(t);
                         return (0,
                             r.resolve)(e),
                             r.promise
                     }
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(8)
                         , i = r(16)
                         , o = r(22)
                         , s = r(28)
                         , a = r(27);
                     n({
                         target: "Promise",
                         stat: !0
                     }, {
                         allSettled: function (t) {
                             var e = this
                                 , r = o.f(e)
                                 , n = r.resolve
                                 , u = r.reject
                                 , c = s((function () {
                                     var r = i(e.resolve)
                                         , o = []
                                         , s = 0
                                         , u = 1;
                                     a(t, (function (t) {
                                             var i = s++
                                                 , a = !1;
                                             o.push(void 0),
                                                 u++,
                                                 r.call(e, t).then((function (t) {
                                                         a || (a = !0,
                                                             o[i] = {
                                                                 status: "fulfilled",
                                                                 value: t
                                                             },
                                                         --u || n(o))
                                                     }
                                                 ), (function (t) {
                                                         a || (a = !0,
                                                             o[i] = {
                                                                 status: "rejected",
                                                                 reason: t
                                                             },
                                                         --u || n(o))
                                                     }
                                                 ))
                                         }
                                     )),
                                     --u || n(o)
                                 }
                             ));
                             return c.error && u(c.value),
                                 r.promise
                         }
                     })
                 }
                 , function (t, e, r) {
                     (function (r) {
                             var n, i;
                             void 0 === (i = "function" == typeof (n = function () {
                                     "use strict";
                                     var t = void 0 !== r ? r : self;
                                     if (void 0 !== t.TextEncoder && void 0 !== t.TextDecoder)
                                         return {
                                             TextEncoder: t.TextEncoder,
                                             TextDecoder: t.TextDecoder
                                         };
                                     var e = ["utf8", "utf-8", "unicode-1-1-utf-8"];
                                     return {
                                         TextEncoder: function (t) {
                                             if (e.indexOf(t) < 0 && null != t)
                                                 throw new RangeError("Invalid encoding type. Only utf-8 is supported");
                                             this.encoding = "utf-8",
                                                 this.encode = function (t) {
                                                     if ("string" != typeof t)
                                                         throw new TypeError("passed argument must be of type string");
                                                     var e = unescape(encodeURIComponent(t))
                                                         , r = new Uint8Array(e.length);
                                                     return e.split("").forEach((function (t, e) {
                                                             r[e] = t.charCodeAt(0)
                                                         }
                                                     )),
                                                         r
                                                 }
                                         },
                                         TextDecoder: function (t, r) {
                                             if (e.indexOf(t) < 0 && null != t)
                                                 throw new RangeError("Invalid encoding type. Only utf-8 is supported");
                                             if (this.encoding = "utf-8",
                                                 this.ignoreBOM = !1,
                                                 this.fatal = void 0 !== r && "fatal" in r && r.fatal,
                                             "boolean" != typeof this.fatal)
                                                 throw new TypeError("fatal flag must be boolean");
                                             this.decode = function (t, e) {
                                                 if (void 0 === t)
                                                     return "";
                                                 if ("boolean" != typeof (void 0 !== e && "stream" in e && e.stream))
                                                     throw new TypeError("stream option must be boolean");
                                                 if (ArrayBuffer.isView(t)) {
                                                     var r = new Uint8Array(t.buffer)
                                                         , n = new Array(r.length);
                                                     return r.forEach((function (t, e) {
                                                             n[e] = String.fromCharCode(t)
                                                         }
                                                     )),
                                                         decodeURIComponent(escape(n.join("")))
                                                 }
                                                 throw new TypeError("passed argument must be an array buffer view")
                                             }
                                         }
                                     }
                                 }
                             ) ? n.apply(e, []) : n) || (t.exports = i)
                         }
                     ).call(this, r(23))
                 }
                 , function (t, e, r) {
                     var n = r(71);
                     r(103),
                         r(104),
                         r(105),
                         r(106),
                         t.exports = n
                 }
                 , function (t, e, r) {
                     r(72),
                         r(76),
                         r(87),
                         r(91),
                         r(68),
                         r(102);
                     var n = r(37);
                     t.exports = n.Promise
                 }
                 , function (t, e, r) {
                     var n = r(30)
                         , i = r(15)
                         , o = r(75);
                     n || i(Object.prototype, "toString", o, {
                         unsafe: !0
                     })
                 }
                 , function (t, e, r) {
                     var n = r(50);
                     t.exports = n && !Symbol.sham && "symbol" == typeof Symbol.iterator
                 }
                 , function (t, e, r) {
                     var n = r(3)
                         , i = r(33)
                         , o = n.WeakMap;
                     t.exports = "function" == typeof o && /native code/.test(i(o))
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(30)
                         , i = r(51);
                     t.exports = n ? {}.toString : function () {
                         return "[object " + i(this) + "]"
                     }
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(77).charAt
                         , i = r(18)
                         , o = r(52)
                         , s = i.set
                         , a = i.getterFor("String Iterator");
                     o(String, "String", (function (t) {
                             s(this, {
                                 type: "String Iterator",
                                 string: String(t),
                                 index: 0
                             })
                         }
                     ), (function () {
                             var t, e = a(this), r = e.string, i = e.index;
                             return i >= r.length ? {
                                 value: void 0,
                                 done: !0
                             } : (t = n(r, i),
                                 e.index += t.length,
                                 {
                                     value: t,
                                     done: !1
                                 })
                         }
                     ))
                 }
                 , function (t, e, r) {
                     var n = r(25)
                         , i = r(20)
                         , o = function (t) {
                         return function (e, r) {
                             var o, s, a = String(i(e)), u = n(r), c = a.length;
                             return u < 0 || u >= c ? t ? "" : void 0 : (o = a.charCodeAt(u)) < 55296 || o > 56319 || u + 1 === c || (s = a.charCodeAt(u + 1)) < 56320 || s > 57343 ? t ? a.charAt(u) : o : t ? a.slice(u, u + 2) : s - 56320 + (o - 55296 << 10) + 65536
                         }
                     };
                     t.exports = {
                         codeAt: o(!1),
                         charAt: o(!0)
                     }
                 }
                 , function (t, e, r) {
                     var n = r(7)
                         , i = r(79)
                         , o = r(36)
                         , s = r(12);
                     t.exports = function (t, e) {
                         for (var r = i(e), a = s.f, u = o.f, c = 0; c < r.length; c++) {
                             var f = r[c];
                             n(t, f) || a(t, f, u(e, f))
                         }
                     }
                 }
                 , function (t, e, r) {
                     var n = r(14)
                         , i = r(80)
                         , o = r(56)
                         , s = r(6);
                     t.exports = n("Reflect", "ownKeys") || function (t) {
                         var e = i.f(s(t))
                             , r = o.f;
                         return r ? e.concat(r(t)) : e
                     }
                 }
                 , function (t, e, r) {
                     var n = r(55)
                         , i = r(39).concat("length", "prototype");
                     e.f = Object.getOwnPropertyNames || function (t) {
                         return n(t, i)
                     }
                 }
                 , function (t, e, r) {
                     var n = r(26)
                         , i = r(38)
                         , o = r(82)
                         , s = function (t) {
                         return function (e, r, s) {
                             var a, u = n(e), c = i(u.length), f = o(s, c);
                             if (t && r != r) {
                                 for (; c > f;)
                                     if ((a = u[f++]) != a)
                                         return !0
                             } else
                                 for (; c > f; f++)
                                     if ((t || f in u) && u[f] === r)
                                         return t || f || 0;
                             return !t && -1
                         }
                     };
                     t.exports = {
                         includes: s(!0),
                         indexOf: s(!1)
                     }
                 }
                 , function (t, e, r) {
                     var n = r(25)
                         , i = Math.max
                         , o = Math.min;
                     t.exports = function (t, e) {
                         var r = n(t);
                         return r < 0 ? i(r + e, 0) : o(r, e)
                     }
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(58).IteratorPrototype
                         , i = r(41)
                         , o = r(24)
                         , s = r(42)
                         , a = r(21)
                         , u = function () {
                         return this
                     };
                     t.exports = function (t, e, r) {
                         var c = e + " Iterator";
                         return t.prototype = i(n, {
                             next: o(1, r)
                         }),
                             s(t, c, !1, !0),
                             a[c] = u,
                             t
                     }
                 }
                 , function (t, e, r) {
                     var n = r(5);
                     t.exports = !n((function () {
                             function t() {
                             }

                             return t.prototype.constructor = null,
                             Object.getPrototypeOf(new t) !== t.prototype
                         }
                     ))
                 }
                 , function (t, e, r) {
                     var n = r(11)
                         , i = r(12)
                         , o = r(6)
                         , s = r(60);
                     t.exports = n ? Object.defineProperties : function (t, e) {
                         o(t);
                         for (var r, n = s(e), a = n.length, u = 0; a > u;)
                             i.f(t, r = n[u++], e[r]);
                         return t
                     }
                 }
                 , function (t, e, r) {
                     var n = r(13);
                     t.exports = function (t) {
                         if (!n(t) && null !== t)
                             throw TypeError("Can't set " + String(t) + " as a prototype");
                         return t
                     }
                 }
                 , function (t, e, r) {
                     var n = r(3)
                         , i = r(88)
                         , o = r(89)
                         , s = r(10)
                         , a = r(4)
                         , u = a("iterator")
                         , c = a("toStringTag")
                         , f = o.values;
                     for (var h in i) {
                         var l = n[h]
                             , p = l && l.prototype;
                         if (p) {
                             if (p[u] !== f)
                                 try {
                                     s(p, u, f)
                                 } catch (t) {
                                     p[u] = f
                                 }
                             if (p[c] || s(p, c, h),
                                 i[h])
                                 for (var d in o)
                                     if (p[d] !== o[d])
                                         try {
                                             s(p, d, o[d])
                                         } catch (t) {
                                             p[d] = o[d]
                                         }
                         }
                     }
                 }
                 , function (t, e) {
                     t.exports = {
                         CSSRuleList: 0,
                         CSSStyleDeclaration: 0,
                         CSSValueList: 0,
                         ClientRectList: 0,
                         DOMRectList: 0,
                         DOMStringList: 0,
                         DOMTokenList: 1,
                         DataTransferItemList: 0,
                         FileList: 0,
                         HTMLAllCollection: 0,
                         HTMLCollection: 0,
                         HTMLFormElement: 0,
                         HTMLSelectElement: 0,
                         MediaList: 0,
                         MimeTypeArray: 0,
                         NamedNodeMap: 0,
                         NodeList: 1,
                         PaintRequestList: 0,
                         Plugin: 0,
                         PluginArray: 0,
                         SVGLengthList: 0,
                         SVGNumberList: 0,
                         SVGPathSegList: 0,
                         SVGPointList: 0,
                         SVGStringList: 0,
                         SVGTransformList: 0,
                         SourceBufferList: 0,
                         StyleSheetList: 0,
                         TextTrackCueList: 0,
                         TextTrackList: 0,
                         TouchList: 0
                     }
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(26)
                         , i = r(90)
                         , o = r(21)
                         , s = r(18)
                         , a = r(52)
                         , u = s.set
                         , c = s.getterFor("Array Iterator");
                     t.exports = a(Array, "Array", (function (t, e) {
                             u(this, {
                                 type: "Array Iterator",
                                 target: n(t),
                                 index: 0,
                                 kind: e
                             })
                         }
                     ), (function () {
                             var t = c(this)
                                 , e = t.target
                                 , r = t.kind
                                 , n = t.index++;
                             return !e || n >= e.length ? (t.target = void 0,
                                 {
                                     value: void 0,
                                     done: !0
                                 }) : "keys" == r ? {
                                 value: n,
                                 done: !1
                             } : "values" == r ? {
                                 value: e[n],
                                 done: !1
                             } : {
                                 value: [n, e[n]],
                                 done: !1
                             }
                         }
                     ), "values"),
                         o.Arguments = o.Array,
                         i("keys"),
                         i("values"),
                         i("entries")
                 }
                 , function (t, e, r) {
                     var n = r(4)
                         , i = r(41)
                         , o = r(12)
                         , s = n("unscopables")
                         , a = Array.prototype;
                     null == a[s] && o.f(a, s, {
                         configurable: !0,
                         value: i(null)
                     }),
                         t.exports = function (t) {
                             a[s][t] = !0
                         }
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n, i, o, s, a = r(8), u = r(17), c = r(3), f = r(14), h = r(63), l = r(15), p = r(92),
                         d = r(42), v = r(93), y = r(13), m = r(16), g = r(94), b = r(19), w = r(33), x = r(27),
                         S = r(98), T = r(64), E = r(65).set, B = r(99), A = r(67), k = r(100), O = r(22), M = r(28),
                         P = r(18), D = r(57), L = r(4), R = r(101), j = L("species"), I = "Promise", C = P.get,
                         _ = P.set, V = P.getterFor(I), z = h, N = c.TypeError, F = c.document, U = c.process,
                         q = f("fetch"), W = O.f, Y = W, G = "process" == b(U),
                         K = !!(F && F.createEvent && c.dispatchEvent), H = D(I, (function () {
                                 if (w(z) === String(z)) {
                                     if (66 === R)
                                         return !0;
                                     if (!G && "function" != typeof PromiseRejectionEvent)
                                         return !0
                                 }
                                 if (u && !z.prototype.finally)
                                     return !0;
                                 if (R >= 51 && /native code/.test(z))
                                     return !1;
                                 var t = z.resolve(1)
                                     , e = function (t) {
                                     t((function () {
                                         }
                                     ), (function () {
                                         }
                                     ))
                                 };
                                 return (t.constructor = {})[j] = e,
                                     !(t.then((function () {
                                         }
                                     )) instanceof e)
                             }
                         )), X = H || !S((function (t) {
                                 z.all(t).catch((function () {
                                     }
                                 ))
                             }
                         )), Z = function (t) {
                             var e;
                             return !(!y(t) || "function" != typeof (e = t.then)) && e
                         }, J = function (t, e, r) {
                             if (!e.notified) {
                                 e.notified = !0;
                                 var n = e.reactions;
                                 B((function () {
                                         for (var i = e.value, o = 1 == e.state, s = 0; n.length > s;) {
                                             var a, u, c, f = n[s++], h = o ? f.ok : f.fail, l = f.resolve, p = f.reject,
                                                 d = f.domain;
                                             try {
                                                 h ? (o || (2 === e.rejection && et(t, e),
                                                     e.rejection = 1),
                                                     !0 === h ? a = i : (d && d.enter(),
                                                         a = h(i),
                                                     d && (d.exit(),
                                                         c = !0)),
                                                     a === f.promise ? p(N("Promise-chain cycle")) : (u = Z(a)) ? u.call(a, l, p) : l(a)) : p(i)
                                             } catch (t) {
                                                 d && !c && d.exit(),
                                                     p(t)
                                             }
                                         }
                                         e.reactions = [],
                                             e.notified = !1,
                                         r && !e.rejection && Q(t, e)
                                     }
                                 ))
                             }
                         }, $ = function (t, e, r) {
                             var n, i;
                             K ? ((n = F.createEvent("Event")).promise = e,
                                 n.reason = r,
                                 n.initEvent(t, !1, !0),
                                 c.dispatchEvent(n)) : n = {
                                 promise: e,
                                 reason: r
                             },
                                 (i = c["on" + t]) ? i(n) : "unhandledrejection" === t && k("Unhandled promise rejection", r)
                         }, Q = function (t, e) {
                             E.call(c, (function () {
                                     var r, n = e.value;
                                     if (tt(e) && (r = M((function () {
                                             G ? U.emit("unhandledRejection", n, t) : $("unhandledrejection", t, n)
                                         }
                                     )),
                                         e.rejection = G || tt(e) ? 2 : 1,
                                         r.error))
                                         throw r.value
                                 }
                             ))
                         }, tt = function (t) {
                             return 1 !== t.rejection && !t.parent
                         }, et = function (t, e) {
                             E.call(c, (function () {
                                     G ? U.emit("rejectionHandled", t) : $("rejectionhandled", t, e.value)
                                 }
                             ))
                         }, rt = function (t, e, r, n) {
                             return function (i) {
                                 t(e, r, i, n)
                             }
                         }, nt = function (t, e, r, n) {
                             e.done || (e.done = !0,
                             n && (e = n),
                                 e.value = r,
                                 e.state = 2,
                                 J(t, e, !0))
                         }, it = function (t, e, r, n) {
                             if (!e.done) {
                                 e.done = !0,
                                 n && (e = n);
                                 try {
                                     if (t === r)
                                         throw N("Promise can't be resolved itself");
                                     var i = Z(r);
                                     i ? B((function () {
                                             var n = {
                                                 done: !1
                                             };
                                             try {
                                                 i.call(r, rt(it, t, n, e), rt(nt, t, n, e))
                                             } catch (r) {
                                                 nt(t, n, r, e)
                                             }
                                         }
                                     )) : (e.value = r,
                                         e.state = 1,
                                         J(t, e, !1))
                                 } catch (r) {
                                     nt(t, {
                                         done: !1
                                     }, r, e)
                                 }
                             }
                         };
                     H && (z = function (t) {
                         g(this, z, I),
                             m(t),
                             n.call(this);
                         var e = C(this);
                         try {
                             t(rt(it, this, e), rt(nt, this, e))
                         } catch (t) {
                             nt(this, e, t)
                         }
                     }
                         ,
                         (n = function (t) {
                                 _(this, {
                                     type: I,
                                     done: !1,
                                     notified: !1,
                                     parent: !1,
                                     reactions: [],
                                     rejection: !1,
                                     state: 0,
                                     value: void 0
                                 })
                             }
                         ).prototype = p(z.prototype, {
                             then: function (t, e) {
                                 var r = V(this)
                                     , n = W(T(this, z));
                                 return n.ok = "function" != typeof t || t,
                                     n.fail = "function" == typeof e && e,
                                     n.domain = G ? U.domain : void 0,
                                     r.parent = !0,
                                     r.reactions.push(n),
                                 0 != r.state && J(this, r, !1),
                                     n.promise
                             },
                             catch: function (t) {
                                 return this.then(void 0, t)
                             }
                         }),
                         i = function () {
                             var t = new n
                                 , e = C(t);
                             this.promise = t,
                                 this.resolve = rt(it, t, e),
                                 this.reject = rt(nt, t, e)
                         }
                         ,
                         O.f = W = function (t) {
                             return t === z || t === o ? new i(t) : Y(t)
                         }
                         ,
                     u || "function" != typeof h || (s = h.prototype.then,
                         l(h.prototype, "then", (function (t, e) {
                                 var r = this;
                                 return new z((function (t, e) {
                                         s.call(r, t, e)
                                     }
                                 )).then(t, e)
                             }
                         ), {
                             unsafe: !0
                         }),
                     "function" == typeof q && a({
                         global: !0,
                         enumerable: !0,
                         forced: !0
                     }, {
                         fetch: function (t) {
                             return A(z, q.apply(c, arguments))
                         }
                     }))),
                         a({
                             global: !0,
                             wrap: !0,
                             forced: H
                         }, {
                             Promise: z
                         }),
                         d(z, I, !1, !0),
                         v(I),
                         o = f(I),
                         a({
                             target: I,
                             stat: !0,
                             forced: H
                         }, {
                             reject: function (t) {
                                 var e = W(this);
                                 return e.reject.call(void 0, t),
                                     e.promise
                             }
                         }),
                         a({
                             target: I,
                             stat: !0,
                             forced: u || H
                         }, {
                             resolve: function (t) {
                                 return A(u && this === o ? z : this, t)
                             }
                         }),
                         a({
                             target: I,
                             stat: !0,
                             forced: X
                         }, {
                             all: function (t) {
                                 var e = this
                                     , r = W(e)
                                     , n = r.resolve
                                     , i = r.reject
                                     , o = M((function () {
                                         var r = m(e.resolve)
                                             , o = []
                                             , s = 0
                                             , a = 1;
                                         x(t, (function (t) {
                                                 var u = s++
                                                     , c = !1;
                                                 o.push(void 0),
                                                     a++,
                                                     r.call(e, t).then((function (t) {
                                                             c || (c = !0,
                                                                 o[u] = t,
                                                             --a || n(o))
                                                         }
                                                     ), i)
                                             }
                                         )),
                                         --a || n(o)
                                     }
                                 ));
                                 return o.error && i(o.value),
                                     r.promise
                             },
                             race: function (t) {
                                 var e = this
                                     , r = W(e)
                                     , n = r.reject
                                     , i = M((function () {
                                         var i = m(e.resolve);
                                         x(t, (function (t) {
                                                 i.call(e, t).then(r.resolve, n)
                                             }
                                         ))
                                     }
                                 ));
                                 return i.error && n(i.value),
                                     r.promise
                             }
                         })
                 }
                 , function (t, e, r) {
                     var n = r(15);
                     t.exports = function (t, e, r) {
                         for (var i in e)
                             n(t, i, e[i], r);
                         return t
                     }
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(14)
                         , i = r(12)
                         , o = r(4)
                         , s = r(11)
                         , a = o("species");
                     t.exports = function (t) {
                         var e = n(t)
                             , r = i.f;
                         s && e && !e[a] && r(e, a, {
                             configurable: !0,
                             get: function () {
                                 return this
                             }
                         })
                     }
                 }
                 , function (t, e) {
                     t.exports = function (t, e, r) {
                         if (!(t instanceof e))
                             throw TypeError("Incorrect " + (r ? r + " " : "") + "invocation");
                         return t
                     }
                 }
                 , function (t, e, r) {
                     var n = r(4)
                         , i = r(21)
                         , o = n("iterator")
                         , s = Array.prototype;
                     t.exports = function (t) {
                         return void 0 !== t && (i.Array === t || s[o] === t)
                     }
                 }
                 , function (t, e, r) {
                     var n = r(51)
                         , i = r(21)
                         , o = r(4)("iterator");
                     t.exports = function (t) {
                         if (null != t)
                             return t[o] || t["@@iterator"] || i[n(t)]
                     }
                 }
                 , function (t, e, r) {
                     var n = r(6);
                     t.exports = function (t, e, r, i) {
                         try {
                             return i ? e(n(r)[0], r[1]) : e(r)
                         } catch (e) {
                             var o = t.return;
                             throw void 0 !== o && n(o.call(t)),
                                 e
                         }
                     }
                 }
                 , function (t, e, r) {
                     var n = r(4)("iterator")
                         , i = !1;
                     try {
                         var o = 0
                             , s = {
                             next: function () {
                                 return {
                                     done: !!o++
                                 }
                             },
                             return: function () {
                                 i = !0
                             }
                         };
                         s[n] = function () {
                             return this
                         }
                             ,
                             Array.from(s, (function () {
                                     throw 2
                                 }
                             ))
                     } catch (t) {
                     }
                     t.exports = function (t, e) {
                         if (!e && !i)
                             return !1;
                         var r = !1;
                         try {
                             var o = {};
                             o[n] = function () {
                                 return {
                                     next: function () {
                                         return {
                                             done: r = !0
                                         }
                                     }
                                 }
                             }
                                 ,
                                 t(o)
                         } catch (t) {
                         }
                         return r
                     }
                 }
                 , function (t, e, r) {
                     var n, i, o, s, a, u, c, f, h = r(3), l = r(36).f, p = r(19), d = r(65).set, v = r(66),
                         y = h.MutationObserver || h.WebKitMutationObserver, m = h.process, g = h.Promise,
                         b = "process" == p(m), w = l(h, "queueMicrotask"), x = w && w.value;
                     x || (n = function () {
                             var t, e;
                             for (b && (t = m.domain) && t.exit(); i;) {
                                 e = i.fn,
                                     i = i.next;
                                 try {
                                     e()
                                 } catch (t) {
                                     throw i ? s() : o = void 0,
                                         t
                                 }
                             }
                             o = void 0,
                             t && t.enter()
                         }
                             ,
                             b ? s = function () {
                                     m.nextTick(n)
                                 }
                                 : y && !v ? (a = !0,
                                         u = document.createTextNode(""),
                                         new y(n).observe(u, {
                                             characterData: !0
                                         }),
                                         s = function () {
                                             u.data = a = !a
                                         }
                                 ) : g && g.resolve ? (c = g.resolve(void 0),
                                         f = c.then,
                                         s = function () {
                                             f.call(c, n)
                                         }
                                 ) : s = function () {
                                     d.call(h, n)
                                 }
                     ),
                         t.exports = x || function (t) {
                             var e = {
                                 fn: t,
                                 next: void 0
                             };
                             o && (o.next = e),
                             i || (i = e,
                                 s()),
                                 o = e
                         }
                 }
                 , function (t, e, r) {
                     var n = r(3);
                     t.exports = function (t, e) {
                         var r = n.console;
                         r && r.error && (1 === arguments.length ? r.error(t) : r.error(t, e))
                     }
                 }
                 , function (t, e, r) {
                     var n, i, o = r(3), s = r(44), a = o.process, u = a && a.versions, c = u && u.v8;
                     c ? i = (n = c.split("."))[0] + n[1] : s && (!(n = s.match(/Edge\/(\d+)/)) || n[1] >= 74) && (n = s.match(/Chrome\/(\d+)/)) && (i = n[1]),
                         t.exports = i && +i
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(8)
                         , i = r(17)
                         , o = r(63)
                         , s = r(5)
                         , a = r(14)
                         , u = r(64)
                         , c = r(67)
                         , f = r(15);
                     n({
                         target: "Promise",
                         proto: !0,
                         real: !0,
                         forced: !!o && s((function () {
                                 o.prototype.finally.call({
                                     then: function () {
                                     }
                                 }, (function () {
                                     }
                                 ))
                             }
                         ))
                     }, {
                         finally: function (t) {
                             var e = u(this, a("Promise"))
                                 , r = "function" == typeof t;
                             return this.then(r ? function (r) {
                                     return c(e, t()).then((function () {
                                             return r
                                         }
                                     ))
                                 }
                                 : t, r ? function (r) {
                                     return c(e, t()).then((function () {
                                             throw r
                                         }
                                     ))
                                 }
                                 : t)
                         }
                     }),
                     i || "function" != typeof o || o.prototype.finally || f(o.prototype, "finally", a("Promise").prototype.finally)
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(8)
                         , i = r(11)
                         , o = r(40)
                         , s = r(62)
                         , a = r(41)
                         , u = r(12)
                         , c = r(24)
                         , f = r(27)
                         , h = r(10)
                         , l = r(18)
                         , p = l.set
                         , d = l.getterFor("AggregateError")
                         , v = function (t, e) {
                         var r = this;
                         if (!(r instanceof v))
                             return new v(t, e);
                         s && (r = s(new Error(e), o(r)));
                         var n = [];
                         return f(t, n.push, n),
                             i ? p(r, {
                                 errors: n,
                                 type: "AggregateError"
                             }) : r.errors = n,
                         void 0 !== e && h(r, "message", String(e)),
                             r
                     };
                     v.prototype = a(Error.prototype, {
                         constructor: c(5, v),
                         message: c(5, ""),
                         name: c(5, "AggregateError")
                     }),
                     i && u.f(v.prototype, "errors", {
                         get: function () {
                             return d(this).errors
                         },
                         configurable: !0
                     }),
                         n({
                             global: !0
                         }, {
                             AggregateError: v
                         })
                 }
                 , function (t, e, r) {
                     r(68)
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(8)
                         , i = r(22)
                         , o = r(28);
                     n({
                         target: "Promise",
                         stat: !0
                     }, {
                         try: function (t) {
                             var e = i.f(this)
                                 , r = o(t);
                             return (r.error ? e.reject : e.resolve)(r.value),
                                 e.promise
                         }
                     })
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(8)
                         , i = r(16)
                         , o = r(14)
                         , s = r(22)
                         , a = r(28)
                         , u = r(27);
                     n({
                         target: "Promise",
                         stat: !0
                     }, {
                         any: function (t) {
                             var e = this
                                 , r = s.f(e)
                                 , n = r.resolve
                                 , c = r.reject
                                 , f = a((function () {
                                     var r = i(e.resolve)
                                         , s = []
                                         , a = 0
                                         , f = 1
                                         , h = !1;
                                     u(t, (function (t) {
                                             var i = a++
                                                 , u = !1;
                                             s.push(void 0),
                                                 f++,
                                                 r.call(e, t).then((function (t) {
                                                         u || h || (h = !0,
                                                             n(t))
                                                     }
                                                 ), (function (t) {
                                                         u || h || (u = !0,
                                                             s[i] = t,
                                                         --f || c(new (o("AggregateError"))(s, "No one promise resolved")))
                                                     }
                                                 ))
                                         }
                                     )),
                                     --f || c(new (o("AggregateError"))(s, "No one promise resolved"))
                                 }
                             ));
                             return f.error && c(f.value),
                                 r.promise
                         }
                     })
                 }
                 , function (t, e, r) {
                     var n = r(108);
                     t.exports = n
                 }
                 , function (t, e, r) {
                     r(109);
                     var n = r(113);
                     t.exports = n("String", "padStart")
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(8)
                         , i = r(110).start;
                     n({
                         target: "String",
                         proto: !0,
                         forced: r(112)
                     }, {
                         padStart: function (t) {
                             return i(this, t, arguments.length > 1 ? arguments[1] : void 0)
                         }
                     })
                 }
                 , function (t, e, r) {
                     var n = r(38)
                         , i = r(111)
                         , o = r(20)
                         , s = Math.ceil
                         , a = function (t) {
                         return function (e, r, a) {
                             var u, c, f = String(o(e)), h = f.length, l = void 0 === a ? " " : String(a), p = n(r);
                             return p <= h || "" == l ? f : (u = p - h,
                             (c = i.call(l, s(u / l.length))).length > u && (c = c.slice(0, u)),
                                 t ? f + c : c + f)
                         }
                     };
                     t.exports = {
                         start: a(!1),
                         end: a(!0)
                     }
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(25)
                         , i = r(20);
                     t.exports = "".repeat || function (t) {
                         var e = String(i(this))
                             , r = ""
                             , o = n(t);
                         if (o < 0 || o == 1 / 0)
                             throw RangeError("Wrong number of repetitions");
                         for (; o > 0; (o >>>= 1) && (e += e))
                             1 & o && (r += e);
                         return r
                     }
                 }
                 , function (t, e, r) {
                     var n = r(44);
                     t.exports = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(n)
                 }
                 , function (t, e, r) {
                     var n = r(3)
                         , i = r(43)
                         , o = Function.call;
                     t.exports = function (t, e, r) {
                         return i(o, n[t].prototype[e], r)
                     }
                 }
                 , function (t, e, r) {
                     var n = r(115);
                     t.exports = n
                 }
                 , function (t, e, r) {
                     r(116);
                     var n = r(37);
                     t.exports = n.Object.assign
                 }
                 , function (t, e, r) {
                     var n = r(8)
                         , i = r(117);
                     n({
                         target: "Object",
                         stat: !0,
                         forced: Object.assign !== i
                     }, {
                         assign: i
                     })
                 }
                 , function (t, e, r) {
                     "use strict";
                     var n = r(11)
                         , i = r(5)
                         , o = r(60)
                         , s = r(56)
                         , a = r(53)
                         , u = r(59)
                         , c = r(54)
                         , f = Object.assign
                         , h = Object.defineProperty;
                     t.exports = !f || i((function () {
                             if (n && 1 !== f({
                                 b: 1
                             }, f(h({}, "a", {
                                 enumerable: !0,
                                 get: function () {
                                     h(this, "b", {
                                         value: 3,
                                         enumerable: !1
                                     })
                                 }
                             }), {
                                 b: 2
                             })).b)
                                 return !0;
                             var t = {}
                                 , e = {}
                                 , r = Symbol();
                             return t[r] = 7,
                                 "abcdefghijklmnopqrst".split("").forEach((function (t) {
                                         e[t] = t
                                     }
                                 )),
                             7 != f({}, t)[r] || "abcdefghijklmnopqrst" != o(f({}, e)).join("")
                         }
                     )) ? function (t, e) {
                             for (var r = u(t), i = arguments.length, f = 1, h = s.f, l = a.f; i > f;)
                                 for (var p, d = c(arguments[f++]), v = h ? o(d).concat(h(d)) : o(d), y = v.length, m = 0; y > m;)
                                     p = v[m++],
                                     n && !l.call(d, p) || (r[p] = d[p]);
                             return r
                         }
                         : f
                 }
                 , function (t, e, r) {
                     var n = function (t) {
                         "use strict";
                         var e = Object.prototype
                             , r = e.hasOwnProperty
                             , n = "function" == typeof Symbol ? Symbol : {}
                             , i = n.iterator || "@@iterator"
                             , o = n.asyncIterator || "@@asyncIterator"
                             , s = n.toStringTag || "@@toStringTag";

                         function a(t, e, r, n) {
                             var i = e && e.prototype instanceof f ? e : f
                                 , o = Object.create(i.prototype)
                                 , s = new S(n || []);
                             return o._invoke = function (t, e, r) {
                                 var n = "suspendedStart";
                                 return function (i, o) {
                                     if ("executing" === n)
                                         throw new Error("Generator is already running");
                                     if ("completed" === n) {
                                         if ("throw" === i)
                                             throw o;
                                         return {
                                             value: void 0,
                                             done: !0
                                         }
                                     }
                                     for (r.method = i,
                                              r.arg = o; ;) {
                                         var s = r.delegate;
                                         if (s) {
                                             var a = b(s, r);
                                             if (a) {
                                                 if (a === c)
                                                     continue;
                                                 return a
                                             }
                                         }
                                         if ("next" === r.method)
                                             r.sent = r._sent = r.arg;
                                         else if ("throw" === r.method) {
                                             if ("suspendedStart" === n)
                                                 throw n = "completed",
                                                     r.arg;
                                             r.dispatchException(r.arg)
                                         } else
                                             "return" === r.method && r.abrupt("return", r.arg);
                                         n = "executing";
                                         var f = u(t, e, r);
                                         if ("normal" === f.type) {
                                             if (n = r.done ? "completed" : "suspendedYield",
                                             f.arg === c)
                                                 continue;
                                             return {
                                                 value: f.arg,
                                                 done: r.done
                                             }
                                         }
                                         "throw" === f.type && (n = "completed",
                                             r.method = "throw",
                                             r.arg = f.arg)
                                     }
                                 }
                             }(t, r, s),
                                 o
                         }

                         function u(t, e, r) {
                             try {
                                 return {
                                     type: "normal",
                                     arg: t.call(e, r)
                                 }
                             } catch (t) {
                                 console.log(t)
                                 return {
                                     type: "throw",
                                     arg: t
                                 }
                             }
                         }

                         t.wrap = a;
                         var c = {};

                         function f() {
                         }

                         function h() {
                         }

                         function l() {
                         }

                         var p = {};
                         p[i] = function () {
                             return this
                         }
                         ;
                         var d = Object.getPrototypeOf
                             , v = d && d(d(T([])));
                         v && v !== e && r.call(v, i) && (p = v);
                         var y = l.prototype = f.prototype = Object.create(p);

                         function m(t) {
                             ["next", "throw", "return"].forEach((function (e) {
                                     t[e] = function (t) {
                                         return this._invoke(e, t)
                                     }
                                 }
                             ))
                         }

                         function g(t) {
                             var e;
                             this._invoke = function (n, i) {
                                 function o() {
                                     return new Promise((function (e, o) {
                                             !function e(n, i, o, s) {
                                                 var a = u(t[n], t, i);
                                                 if ("throw" !== a.type) {
                                                     var c = a.arg
                                                         , f = c.value;
                                                     return f && "object" == typeof f && r.call(f, "__await") ? Promise.resolve(f.__await).then((function (t) {
                                                             e("next", t, o, s)
                                                         }
                                                     ), (function (t) {
                                                             e("throw", t, o, s)
                                                         }
                                                     )) : Promise.resolve(f).then((function (t) {
                                                             c.value = t,
                                                                 o(c)
                                                         }
                                                     ), (function (t) {
                                                             return e("throw", t, o, s)
                                                         }
                                                     ))
                                                 }
                                                 s(a.arg)
                                             }(n, i, e, o)
                                         }
                                     ))
                                 }

                                 return e = e ? e.then(o, o) : o()
                             }
                         }

                         function b(t, e) {
                             var r = t.iterator[e.method];
                             if (void 0 === r) {
                                 if (e.delegate = null,
                                 "throw" === e.method) {
                                     if (t.iterator.return && (e.method = "return",
                                         e.arg = void 0,
                                         b(t, e),
                                     "throw" === e.method))
                                         return c;
                                     e.method = "throw",
                                         e.arg = new TypeError("The iterator does not provide a 'throw' method")
                                 }
                                 return c
                             }
                             var n = u(r, t.iterator, e.arg);
                             if ("throw" === n.type)
                                 return e.method = "throw",
                                     e.arg = n.arg,
                                     e.delegate = null,
                                     c;
                             var i = n.arg;
                             return i ? i.done ? (e[t.resultName] = i.value,
                                 e.next = t.nextLoc,
                             "return" !== e.method && (e.method = "next",
                                 e.arg = void 0),
                                 e.delegate = null,
                                 c) : i : (e.method = "throw",
                                 e.arg = new TypeError("iterator result is not an object"),
                                 e.delegate = null,
                                 c)
                         }

                         function w(t) {
                             var e = {
                                 tryLoc: t[0]
                             };
                             1 in t && (e.catchLoc = t[1]),
                             2 in t && (e.finallyLoc = t[2],
                                 e.afterLoc = t[3]),
                                 this.tryEntries.push(e)
                         }

                         function x(t) {
                             var e = t.completion || {};
                             e.type = "normal",
                                 delete e.arg,
                                 t.completion = e
                         }

                         function S(t) {
                             this.tryEntries = [{
                                 tryLoc: "root"
                             }],
                                 t.forEach(w, this),
                                 this.reset(!0)
                         }

                         function T(t) {
                             if (t) {
                                 var e = t[i];
                                 if (e)
                                     return e.call(t);
                                 if ("function" == typeof t.next)
                                     return t;
                                 if (!isNaN(t.length)) {
                                     var n = -1
                                         , o = function e() {
                                         for (; ++n < t.length;)
                                             if (r.call(t, n))
                                                 return e.value = t[n],
                                                     e.done = !1,
                                                     e;
                                         return e.value = void 0,
                                             e.done = !0,
                                             e
                                     };
                                     return o.next = o
                                 }
                             }
                             return {
                                 next: E
                             }
                         }

                         function E() {
                             return {
                                 value: void 0,
                                 done: !0
                             }
                         }

                         return h.prototype = y.constructor = l,
                             l.constructor = h,
                             l[s] = h.displayName = "GeneratorFunction",
                             t.isGeneratorFunction = function (t) {
                                 var e = "function" == typeof t && t.constructor;
                                 return !!e && (e === h || "GeneratorFunction" === (e.displayName || e.name))
                             }
                             ,
                             t.mark = function (t) {
                                 return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                                 s in t || (t[s] = "GeneratorFunction")),
                                     t.prototype = Object.create(y),
                                     t
                             }
                             ,
                             t.awrap = function (t) {
                                 return {
                                     __await: t
                                 }
                             }
                             ,
                             m(g.prototype),
                             g.prototype[o] = function () {
                                 return this
                             }
                             ,
                             t.AsyncIterator = g,
                             t.async = function (e, r, n, i) {
                                 var o = new g(a(e, r, n, i));
                                 return t.isGeneratorFunction(r) ? o : o.next().then((function (t) {
                                         return t.done ? t.value : o.next()
                                     }
                                 ))
                             }
                             ,
                             m(y),
                             y[s] = "Generator",
                             y[i] = function () {
                                 return this
                             }
                             ,
                             y.toString = function () {
                                 return "[object Generator]"
                             }
                             ,
                             t.keys = function (t) {
                                 var e = [];
                                 for (var r in t)
                                     e.push(r);
                                 return e.reverse(),
                                     function r() {
                                         for (; e.length;) {
                                             var n = e.pop();
                                             if (n in t)
                                                 return r.value = n,
                                                     r.done = !1,
                                                     r
                                         }
                                         return r.done = !0,
                                             r
                                     }
                             }
                             ,
                             t.values = T,
                             S.prototype = {
                                 constructor: S,
                                 reset: function (t) {
                                     if (this.prev = 0,
                                         this.next = 0,
                                         this.sent = this._sent = void 0,
                                         this.done = !1,
                                         this.delegate = null,
                                         this.method = "next",
                                         this.arg = void 0,
                                         this.tryEntries.forEach(x),
                                         !t)
                                         for (var e in this)
                                             "t" === e.charAt(0) && r.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = void 0)
                                 },
                                 stop: function () {
                                     this.done = !0;
                                     var t = this.tryEntries[0].completion;
                                     if ("throw" === t.type)
                                         throw t.arg;
                                     return this.rval
                                 },
                                 dispatchException: function (t) {
                                     if (this.done)
                                         throw t;
                                     var e = this;

                                     function n(r, n) {
                                         return s.type = "throw",
                                             s.arg = t,
                                             e.next = r,
                                         n && (e.method = "next",
                                             e.arg = void 0),
                                             !!n
                                     }

                                     for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                                         var o = this.tryEntries[i]
                                             , s = o.completion;
                                         if ("root" === o.tryLoc)
                                             return n("end");
                                         if (o.tryLoc <= this.prev) {
                                             var a = r.call(o, "catchLoc")
                                                 , u = r.call(o, "finallyLoc");
                                             if (a && u) {
                                                 if (this.prev < o.catchLoc)
                                                     return n(o.catchLoc, !0);
                                                 if (this.prev < o.finallyLoc)
                                                     return n(o.finallyLoc)
                                             } else if (a) {
                                                 if (this.prev < o.catchLoc)
                                                     return n(o.catchLoc, !0)
                                             } else {
                                                 if (!u)
                                                     throw new Error("try statement without catch or finally");
                                                 if (this.prev < o.finallyLoc)
                                                     return n(o.finallyLoc)
                                             }
                                         }
                                     }
                                 },
                                 abrupt: function (t, e) {
                                     for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                                         var i = this.tryEntries[n];
                                         if (i.tryLoc <= this.prev && r.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
                                             var o = i;
                                             break
                                         }
                                     }
                                     o && ("break" === t || "continue" === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
                                     var s = o ? o.completion : {};
                                     return s.type = t,
                                         s.arg = e,
                                         o ? (this.method = "next",
                                             this.next = o.finallyLoc,
                                             c) : this.complete(s)
                                 },
                                 complete: function (t, e) {
                                     if ("throw" === t.type)
                                         throw t.arg;
                                     return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg,
                                         this.method = "return",
                                         this.next = "end") : "normal" === t.type && e && (this.next = e),
                                         c
                                 },
                                 finish: function (t) {
                                     for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                                         var r = this.tryEntries[e];
                                         if (r.finallyLoc === t)
                                             return this.complete(r.completion, r.afterLoc),
                                                 x(r),
                                                 c
                                     }
                                 },
                                 catch: function (t) {
                                     for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                                         var r = this.tryEntries[e];
                                         if (r.tryLoc === t) {
                                             var n = r.completion;
                                             if ("throw" === n.type) {
                                                 var i = n.arg;
                                                 x(r)
                                             }
                                             return i
                                         }
                                     }
                                     throw new Error("illegal catch attempt")
                                 },
                                 delegateYield: function (t, e, r) {
                                     return this.delegate = {
                                         iterator: T(t),
                                         resultName: e,
                                         nextLoc: r
                                     },
                                     "next" === this.method && (this.arg = void 0),
                                         c
                                 }
                             },
                             t
                     }(t.exports);
                     try {
                         regeneratorRuntime = n
                     } catch (t) {
                         Function("r", "regeneratorRuntime = r")(n)
                     }
                 }
                 , function (t, e) {
                 }
                 , function (t, e, r) {
                     "use strict";
                     (function (t) {
                             /*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
                             var n = r(121)
                                 , i = r(122)
                                 , o = r(123);

                             function s() {
                                 return u.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
                             }

                             function a(t, e) {
                                 if (s() < e)
                                     throw new RangeError("Invalid typed array length");
                                 return u.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(e)).__proto__ = u.prototype : (null === t && (t = new u(e)),
                                     t.length = e),
                                     t
                             }

                             function u(t, e, r) {
                                 if (!(u.TYPED_ARRAY_SUPPORT || this instanceof u))
                                     return new u(t, e, r);
                                 if ("number" == typeof t) {
                                     if ("string" == typeof e)
                                         throw new Error("If encoding is specified then the first argument must be a string");
                                     return h(this, t)
                                 }
                                 return c(this, t, e, r)
                             }

                             function c(t, e, r, n) {
                                 if ("number" == typeof e)
                                     throw new TypeError('"value" argument must not be a number');
                                 return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer ? function (t, e, r, n) {
                                     if (e.byteLength,
                                     r < 0 || e.byteLength < r)
                                         throw new RangeError("'offset' is out of bounds");
                                     if (e.byteLength < r + (n || 0))
                                         throw new RangeError("'length' is out of bounds");
                                     return e = void 0 === r && void 0 === n ? new Uint8Array(e) : void 0 === n ? new Uint8Array(e, r) : new Uint8Array(e, r, n),
                                         u.TYPED_ARRAY_SUPPORT ? (t = e).__proto__ = u.prototype : t = l(t, e),
                                         t
                                 }(t, e, r, n) : "string" == typeof e ? function (t, e, r) {
                                     if ("string" == typeof r && "" !== r || (r = "utf8"),
                                         !u.isEncoding(r))
                                         throw new TypeError('"encoding" must be a valid string encoding');
                                     var n = 0 | d(e, r)
                                         , i = (t = a(t, n)).write(e, r);
                                     return i !== n && (t = t.slice(0, i)),
                                         t
                                 }(t, e, r) : function (t, e) {
                                     if (u.isBuffer(e)) {
                                         var r = 0 | p(e.length);
                                         return 0 === (t = a(t, r)).length || e.copy(t, 0, 0, r),
                                             t
                                     }
                                     if (e) {
                                         if ("undefined" != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer || "length" in e)
                                             return "number" != typeof e.length || (n = e.length) != n ? a(t, 0) : l(t, e);
                                         if ("Buffer" === e.type && o(e.data))
                                             return l(t, e.data)
                                     }
                                     var n;
                                     throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
                                 }(t, e)
                             }

                             function f(t) {
                                 if ("number" != typeof t)
                                     throw new TypeError('"size" argument must be a number');
                                 if (t < 0)
                                     throw new RangeError('"size" argument must not be negative')
                             }

                             function h(t, e) {
                                 if (f(e),
                                     t = a(t, e < 0 ? 0 : 0 | p(e)),
                                     !u.TYPED_ARRAY_SUPPORT)
                                     for (var r = 0; r < e; ++r)
                                         t[r] = 0;
                                 return t
                             }

                             function l(t, e) {
                                 var r = e.length < 0 ? 0 : 0 | p(e.length);
                                 t = a(t, r);
                                 for (var n = 0; n < r; n += 1)
                                     t[n] = 255 & e[n];
                                 return t
                             }

                             function p(t) {
                                 if (t >= s())
                                     throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + s().toString(16) + " bytes");
                                 return 0 | t
                             }

                             function d(t, e) {
                                 if (u.isBuffer(t))
                                     return t.length;
                                 if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer))
                                     return t.byteLength;
                                 "string" != typeof t && (t = "" + t);
                                 var r = t.length;
                                 if (0 === r)
                                     return 0;
                                 for (var n = !1; ;)
                                     switch (e) {
                                         case "ascii":
                                         case "latin1":
                                         case "binary":
                                             return r;
                                         case "utf8":
                                         case "utf-8":
                                         case void 0:
                                             return N(t).length;
                                         case "ucs2":
                                         case "ucs-2":
                                         case "utf16le":
                                         case "utf-16le":
                                             return 2 * r;
                                         case "hex":
                                             return r >>> 1;
                                         case "base64":
                                             return F(t).length;
                                         default:
                                             if (n)
                                                 return N(t).length;
                                             e = ("" + e).toLowerCase(),
                                                 n = !0
                                     }
                             }

                             function v(t, e, r) {
                                 var n = !1;
                                 if ((void 0 === e || e < 0) && (e = 0),
                                 e > this.length)
                                     return "";
                                 if ((void 0 === r || r > this.length) && (r = this.length),
                                 r <= 0)
                                     return "";
                                 if ((r >>>= 0) <= (e >>>= 0))
                                     return "";
                                 for (t || (t = "utf8"); ;)
                                     switch (t) {
                                         case "hex":
                                             return M(this, e, r);
                                         case "utf8":
                                         case "utf-8":
                                             return A(this, e, r);
                                         case "ascii":
                                             return k(this, e, r);
                                         case "latin1":
                                         case "binary":
                                             return O(this, e, r);
                                         case "base64":
                                             return B(this, e, r);
                                         case "ucs2":
                                         case "ucs-2":
                                         case "utf16le":
                                         case "utf-16le":
                                             return P(this, e, r);
                                         default:
                                             if (n)
                                                 throw new TypeError("Unknown encoding: " + t);
                                             t = (t + "").toLowerCase(),
                                                 n = !0
                                     }
                             }

                             function y(t, e, r) {
                                 var n = t[e];
                                 t[e] = t[r],
                                     t[r] = n
                             }

                             function m(t, e, r, n, i) {
                                 if (0 === t.length)
                                     return -1;
                                 if ("string" == typeof r ? (n = r,
                                     r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648),
                                     r = +r,
                                 isNaN(r) && (r = i ? 0 : t.length - 1),
                                 r < 0 && (r = t.length + r),
                                 r >= t.length) {
                                     if (i)
                                         return -1;
                                     r = t.length - 1
                                 } else if (r < 0) {
                                     if (!i)
                                         return -1;
                                     r = 0
                                 }
                                 if ("string" == typeof e && (e = u.from(e, n)),
                                     u.isBuffer(e))
                                     return 0 === e.length ? -1 : g(t, e, r, n, i);
                                 if ("number" == typeof e)
                                     return e &= 255,
                                         u.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(t, e, r) : Uint8Array.prototype.lastIndexOf.call(t, e, r) : g(t, [e], r, n, i);
                                 throw new TypeError("val must be string, number or Buffer")
                             }

                             function g(t, e, r, n, i) {
                                 var o, s = 1, a = t.length, u = e.length;
                                 if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                                     if (t.length < 2 || e.length < 2)
                                         return -1;
                                     s = 2,
                                         a /= 2,
                                         u /= 2,
                                         r /= 2
                                 }

                                 function c(t, e) {
                                     return 1 === s ? t[e] : t.readUInt16BE(e * s)
                                 }

                                 if (i) {
                                     var f = -1;
                                     for (o = r; o < a; o++)
                                         if (c(t, o) === c(e, -1 === f ? 0 : o - f)) {
                                             if (-1 === f && (f = o),
                                             o - f + 1 === u)
                                                 return f * s
                                         } else
                                             -1 !== f && (o -= o - f),
                                                 f = -1
                                 } else
                                     for (r + u > a && (r = a - u),
                                              o = r; o >= 0; o--) {
                                         for (var h = !0, l = 0; l < u; l++)
                                             if (c(t, o + l) !== c(e, l)) {
                                                 h = !1;
                                                 break
                                             }
                                         if (h)
                                             return o
                                     }
                                 return -1
                             }

                             function b(t, e, r, n) {
                                 r = Number(r) || 0;
                                 var i = t.length - r;
                                 n ? (n = Number(n)) > i && (n = i) : n = i;
                                 var o = e.length;
                                 if (o % 2 != 0)
                                     throw new TypeError("Invalid hex string");
                                 n > o / 2 && (n = o / 2);
                                 for (var s = 0; s < n; ++s) {
                                     var a = parseInt(e.substr(2 * s, 2), 16);
                                     if (isNaN(a))
                                         return s;
                                     t[r + s] = a
                                 }
                                 return s
                             }

                             function w(t, e, r, n) {
                                 return U(N(e, t.length - r), t, r, n)
                             }

                             function x(t, e, r, n) {
                                 return U(function (t) {
                                     for (var e = [], r = 0; r < t.length; ++r)
                                         e.push(255 & t.charCodeAt(r));
                                     return e
                                 }(e), t, r, n)
                             }

                             function S(t, e, r, n) {
                                 return x(t, e, r, n)
                             }

                             function T(t, e, r, n) {
                                 return U(F(e), t, r, n)
                             }

                             function E(t, e, r, n) {
                                 return U(function (t, e) {
                                     for (var r, n, i, o = [], s = 0; s < t.length && !((e -= 2) < 0); ++s)
                                         n = (r = t.charCodeAt(s)) >> 8,
                                             i = r % 256,
                                             o.push(i),
                                             o.push(n);
                                     return o
                                 }(e, t.length - r), t, r, n)
                             }

                             function B(t, e, r) {
                                 return 0 === e && r === t.length ? n.fromByteArray(t) : n.fromByteArray(t.slice(e, r))
                             }

                             function A(t, e, r) {
                                 r = Math.min(t.length, r);
                                 for (var n = [], i = e; i < r;) {
                                     var o, s, a, u, c = t[i], f = null,
                                         h = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
                                     if (i + h <= r)
                                         switch (h) {
                                             case 1:
                                                 c < 128 && (f = c);
                                                 break;
                                             case 2:
                                                 128 == (192 & (o = t[i + 1])) && (u = (31 & c) << 6 | 63 & o) > 127 && (f = u);
                                                 break;
                                             case 3:
                                                 o = t[i + 1],
                                                     s = t[i + 2],
                                                 128 == (192 & o) && 128 == (192 & s) && (u = (15 & c) << 12 | (63 & o) << 6 | 63 & s) > 2047 && (u < 55296 || u > 57343) && (f = u);
                                                 break;
                                             case 4:
                                                 o = t[i + 1],
                                                     s = t[i + 2],
                                                     a = t[i + 3],
                                                 128 == (192 & o) && 128 == (192 & s) && 128 == (192 & a) && (u = (15 & c) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & a) > 65535 && u < 1114112 && (f = u)
                                         }
                                     null === f ? (f = 65533,
                                         h = 1) : f > 65535 && (f -= 65536,
                                         n.push(f >>> 10 & 1023 | 55296),
                                         f = 56320 | 1023 & f),
                                         n.push(f),
                                         i += h
                                 }
                                 return function (t) {
                                     var e = t.length;
                                     if (e <= 4096)
                                         return String.fromCharCode.apply(String, t);
                                     for (var r = "", n = 0; n < e;)
                                         r += String.fromCharCode.apply(String, t.slice(n, n += 4096));
                                     return r
                                 }(n)
                             }

                             function k(t, e, r) {
                                 var n = "";
                                 r = Math.min(t.length, r);
                                 for (var i = e; i < r; ++i)
                                     n += String.fromCharCode(127 & t[i]);
                                 return n
                             }

                             function O(t, e, r) {
                                 var n = "";
                                 r = Math.min(t.length, r);
                                 for (var i = e; i < r; ++i)
                                     n += String.fromCharCode(t[i]);
                                 return n
                             }

                             function M(t, e, r) {
                                 var n = t.length;
                                 (!e || e < 0) && (e = 0),
                                 (!r || r < 0 || r > n) && (r = n);
                                 for (var i = "", o = e; o < r; ++o)
                                     i += z(t[o]);
                                 return i
                             }

                             function P(t, e, r) {
                                 for (var n = t.slice(e, r), i = "", o = 0; o < n.length; o += 2)
                                     i += String.fromCharCode(n[o] + 256 * n[o + 1]);
                                 return i
                             }

                             function D(t, e, r) {
                                 if (t % 1 != 0 || t < 0)
                                     throw new RangeError("offset is not uint");
                                 if (t + e > r)
                                     throw new RangeError("Trying to access beyond buffer length")
                             }

                             function L(t, e, r, n, i, o) {
                                 if (!u.isBuffer(t))
                                     throw new TypeError('"buffer" argument must be a Buffer instance');
                                 if (e > i || e < o)
                                     throw new RangeError('"value" argument is out of bounds');
                                 if (r + n > t.length)
                                     throw new RangeError("Index out of range")
                             }

                             function R(t, e, r, n) {
                                 e < 0 && (e = 65535 + e + 1);
                                 for (var i = 0, o = Math.min(t.length - r, 2); i < o; ++i)
                                     t[r + i] = (e & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i)
                             }

                             function j(t, e, r, n) {
                                 e < 0 && (e = 4294967295 + e + 1);
                                 for (var i = 0, o = Math.min(t.length - r, 4); i < o; ++i)
                                     t[r + i] = e >>> 8 * (n ? i : 3 - i) & 255
                             }

                             function I(t, e, r, n, i, o) {
                                 if (r + n > t.length)
                                     throw new RangeError("Index out of range");
                                 if (r < 0)
                                     throw new RangeError("Index out of range")
                             }

                             function C(t, e, r, n, o) {
                                 return o || I(t, 0, r, 4),
                                     i.write(t, e, r, n, 23, 4),
                                 r + 4
                             }

                             function _(t, e, r, n, o) {
                                 return o || I(t, 0, r, 8),
                                     i.write(t, e, r, n, 52, 8),
                                 r + 8
                             }

                             e.Buffer = u,
                                 e.SlowBuffer = function (t) {
                                     return +t != t && (t = 0),
                                         u.alloc(+t)
                                 }
                                 ,
                                 e.INSPECT_MAX_BYTES = 50,
                                 u.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : function () {
                                     try {
                                         var t = new Uint8Array(1);
                                         return t.__proto__ = {
                                             __proto__: Uint8Array.prototype,
                                             foo: function () {
                                                 return 42
                                             }
                                         },
                                         42 === t.foo() && "function" == typeof t.subarray && 0 === t.subarray(1, 1).byteLength
                                     } catch (t) {
                                         return !1
                                     }
                                 }(),
                                 e.kMaxLength = s(),
                                 u.poolSize = 8192,
                                 u._augment = function (t) {
                                     return t.__proto__ = u.prototype,
                                         t
                                 }
                                 ,
                                 u.from = function (t, e, r) {
                                     return c(null, t, e, r)
                                 }
                                 ,
                             u.TYPED_ARRAY_SUPPORT && (u.prototype.__proto__ = Uint8Array.prototype,
                                 u.__proto__ = Uint8Array,
                             "undefined" != typeof Symbol && Symbol.species && u[Symbol.species] === u && Object.defineProperty(u, Symbol.species, {
                                 value: null,
                                 configurable: !0
                             })),
                                 u.alloc = function (t, e, r) {
                                     return function (t, e, r, n) {
                                         return f(e),
                                             e <= 0 ? a(t, e) : void 0 !== r ? "string" == typeof n ? a(t, e).fill(r, n) : a(t, e).fill(r) : a(t, e)
                                     }(null, t, e, r)
                                 }
                                 ,
                                 u.allocUnsafe = function (t) {
                                     return h(null, t)
                                 }
                                 ,
                                 u.allocUnsafeSlow = function (t) {
                                     return h(null, t)
                                 }
                                 ,
                                 u.isBuffer = function (t) {
                                     return !(null == t || !t._isBuffer)
                                 }
                                 ,
                                 u.compare = function (t, e) {
                                     if (!u.isBuffer(t) || !u.isBuffer(e))
                                         throw new TypeError("Arguments must be Buffers");
                                     if (t === e)
                                         return 0;
                                     for (var r = t.length, n = e.length, i = 0, o = Math.min(r, n); i < o; ++i)
                                         if (t[i] !== e[i]) {
                                             r = t[i],
                                                 n = e[i];
                                             break
                                         }
                                     return r < n ? -1 : n < r ? 1 : 0
                                 }
                                 ,
                                 u.isEncoding = function (t) {
                                     switch (String(t).toLowerCase()) {
                                         case "hex":
                                         case "utf8":
                                         case "utf-8":
                                         case "ascii":
                                         case "latin1":
                                         case "binary":
                                         case "base64":
                                         case "ucs2":
                                         case "ucs-2":
                                         case "utf16le":
                                         case "utf-16le":
                                             return !0;
                                         default:
                                             return !1
                                     }
                                 }
                                 ,
                                 u.concat = function (t, e) {
                                     if (!o(t))
                                         throw new TypeError('"list" argument must be an Array of Buffers');
                                     if (0 === t.length)
                                         return u.alloc(0);
                                     var r;
                                     if (void 0 === e)
                                         for (e = 0,
                                                  r = 0; r < t.length; ++r)
                                             e += t[r].length;
                                     var n = u.allocUnsafe(e)
                                         , i = 0;
                                     for (r = 0; r < t.length; ++r) {
                                         var s = t[r];
                                         if (!u.isBuffer(s))
                                             throw new TypeError('"list" argument must be an Array of Buffers');
                                         s.copy(n, i),
                                             i += s.length
                                     }
                                     return n
                                 }
                                 ,
                                 u.byteLength = d,
                                 u.prototype._isBuffer = !0,
                                 u.prototype.swap16 = function () {
                                     var t = this.length;
                                     if (t % 2 != 0)
                                         throw new RangeError("Buffer size must be a multiple of 16-bits");
                                     for (var e = 0; e < t; e += 2)
                                         y(this, e, e + 1);
                                     return this
                                 }
                                 ,
                                 u.prototype.swap32 = function () {
                                     var t = this.length;
                                     if (t % 4 != 0)
                                         throw new RangeError("Buffer size must be a multiple of 32-bits");
                                     for (var e = 0; e < t; e += 4)
                                         y(this, e, e + 3),
                                             y(this, e + 1, e + 2);
                                     return this
                                 }
                                 ,
                                 u.prototype.swap64 = function () {
                                     var t = this.length;
                                     if (t % 8 != 0)
                                         throw new RangeError("Buffer size must be a multiple of 64-bits");
                                     for (var e = 0; e < t; e += 8)
                                         y(this, e, e + 7),
                                             y(this, e + 1, e + 6),
                                             y(this, e + 2, e + 5),
                                             y(this, e + 3, e + 4);
                                     return this
                                 }
                                 ,
                                 u.prototype.toString = function () {
                                     var t = 0 | this.length;
                                     return 0 === t ? "" : 0 === arguments.length ? A(this, 0, t) : v.apply(this, arguments)
                                 }
                                 ,
                                 u.prototype.equals = function (t) {
                                     if (!u.isBuffer(t))
                                         throw new TypeError("Argument must be a Buffer");
                                     return this === t || 0 === u.compare(this, t)
                                 }
                                 ,
                                 u.prototype.inspect = function () {
                                     var t = ""
                                         , r = e.INSPECT_MAX_BYTES;
                                     return this.length > 0 && (t = this.toString("hex", 0, r).match(/.{2}/g).join(" "),
                                     this.length > r && (t += " ... ")),
                                     "<Buffer " + t + ">"
                                 }
                                 ,
                                 u.prototype.compare = function (t, e, r, n, i) {
                                     if (!u.isBuffer(t))
                                         throw new TypeError("Argument must be a Buffer");
                                     if (void 0 === e && (e = 0),
                                     void 0 === r && (r = t ? t.length : 0),
                                     void 0 === n && (n = 0),
                                     void 0 === i && (i = this.length),
                                     e < 0 || r > t.length || n < 0 || i > this.length)
                                         throw new RangeError("out of range index");
                                     if (n >= i && e >= r)
                                         return 0;
                                     if (n >= i)
                                         return -1;
                                     if (e >= r)
                                         return 1;
                                     if (this === t)
                                         return 0;
                                     for (var o = (i >>>= 0) - (n >>>= 0), s = (r >>>= 0) - (e >>>= 0), a = Math.min(o, s), c = this.slice(n, i), f = t.slice(e, r), h = 0; h < a; ++h)
                                         if (c[h] !== f[h]) {
                                             o = c[h],
                                                 s = f[h];
                                             break
                                         }
                                     return o < s ? -1 : s < o ? 1 : 0
                                 }
                                 ,
                                 u.prototype.includes = function (t, e, r) {
                                     return -1 !== this.indexOf(t, e, r)
                                 }
                                 ,
                                 u.prototype.indexOf = function (t, e, r) {
                                     return m(this, t, e, r, !0)
                                 }
                                 ,
                                 u.prototype.lastIndexOf = function (t, e, r) {
                                     return m(this, t, e, r, !1)
                                 }
                                 ,
                                 u.prototype.write = function (t, e, r, n) {
                                     if (void 0 === e)
                                         n = "utf8",
                                             r = this.length,
                                             e = 0;
                                     else if (void 0 === r && "string" == typeof e)
                                         n = e,
                                             r = this.length,
                                             e = 0;
                                     else {
                                         if (!isFinite(e))
                                             throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                                         e |= 0,
                                             isFinite(r) ? (r |= 0,
                                             void 0 === n && (n = "utf8")) : (n = r,
                                                 r = void 0)
                                     }
                                     var i = this.length - e;
                                     if ((void 0 === r || r > i) && (r = i),
                                     t.length > 0 && (r < 0 || e < 0) || e > this.length)
                                         throw new RangeError("Attempt to write outside buffer bounds");
                                     n || (n = "utf8");
                                     for (var o = !1; ;)
                                         switch (n) {
                                             case "hex":
                                                 return b(this, t, e, r);
                                             case "utf8":
                                             case "utf-8":
                                                 return w(this, t, e, r);
                                             case "ascii":
                                                 return x(this, t, e, r);
                                             case "latin1":
                                             case "binary":
                                                 return S(this, t, e, r);
                                             case "base64":
                                                 return T(this, t, e, r);
                                             case "ucs2":
                                             case "ucs-2":
                                             case "utf16le":
                                             case "utf-16le":
                                                 return E(this, t, e, r);
                                             default:
                                                 if (o)
                                                     throw new TypeError("Unknown encoding: " + n);
                                                 n = ("" + n).toLowerCase(),
                                                     o = !0
                                         }
                                 }
                                 ,
                                 u.prototype.toJSON = function () {
                                     return {
                                         type: "Buffer",
                                         data: Array.prototype.slice.call(this._arr || this, 0)
                                     }
                                 }
                                 ,
                                 u.prototype.slice = function (t, e) {
                                     var r, n = this.length;
                                     if ((t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
                                         (e = void 0 === e ? n : ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
                                     e < t && (e = t),
                                         u.TYPED_ARRAY_SUPPORT)
                                         (r = this.subarray(t, e)).__proto__ = u.prototype;
                                     else {
                                         var i = e - t;
                                         r = new u(i, void 0);
                                         for (var o = 0; o < i; ++o)
                                             r[o] = this[o + t]
                                     }
                                     return r
                                 }
                                 ,
                                 u.prototype.readUIntLE = function (t, e, r) {
                                     t |= 0,
                                         e |= 0,
                                     r || D(t, e, this.length);
                                     for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256);)
                                         n += this[t + o] * i;
                                     return n
                                 }
                                 ,
                                 u.prototype.readUIntBE = function (t, e, r) {
                                     t |= 0,
                                         e |= 0,
                                     r || D(t, e, this.length);
                                     for (var n = this[t + --e], i = 1; e > 0 && (i *= 256);)
                                         n += this[t + --e] * i;
                                     return n
                                 }
                                 ,
                                 u.prototype.readUInt8 = function (t, e) {
                                     return e || D(t, 1, this.length),
                                         this[t]
                                 }
                                 ,
                                 u.prototype.readUInt16LE = function (t, e) {
                                     return e || D(t, 2, this.length),
                                     this[t] | this[t + 1] << 8
                                 }
                                 ,
                                 u.prototype.readUInt16BE = function (t, e) {
                                     return e || D(t, 2, this.length),
                                     this[t] << 8 | this[t + 1]
                                 }
                                 ,
                                 u.prototype.readUInt32LE = function (t, e) {
                                     return e || D(t, 4, this.length),
                                     (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
                                 }
                                 ,
                                 u.prototype.readUInt32BE = function (t, e) {
                                     return e || D(t, 4, this.length),
                                     16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
                                 }
                                 ,
                                 u.prototype.readIntLE = function (t, e, r) {
                                     t |= 0,
                                         e |= 0,
                                     r || D(t, e, this.length);
                                     for (var n = this[t], i = 1, o = 0; ++o < e && (i *= 256);)
                                         n += this[t + o] * i;
                                     return n >= (i *= 128) && (n -= Math.pow(2, 8 * e)),
                                         n
                                 }
                                 ,
                                 u.prototype.readIntBE = function (t, e, r) {
                                     t |= 0,
                                         e |= 0,
                                     r || D(t, e, this.length);
                                     for (var n = e, i = 1, o = this[t + --n]; n > 0 && (i *= 256);)
                                         o += this[t + --n] * i;
                                     return o >= (i *= 128) && (o -= Math.pow(2, 8 * e)),
                                         o
                                 }
                                 ,
                                 u.prototype.readInt8 = function (t, e) {
                                     return e || D(t, 1, this.length),
                                         128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
                                 }
                                 ,
                                 u.prototype.readInt16LE = function (t, e) {
                                     e || D(t, 2, this.length);
                                     var r = this[t] | this[t + 1] << 8;
                                     return 32768 & r ? 4294901760 | r : r
                                 }
                                 ,
                                 u.prototype.readInt16BE = function (t, e) {
                                     e || D(t, 2, this.length);
                                     var r = this[t + 1] | this[t] << 8;
                                     return 32768 & r ? 4294901760 | r : r
                                 }
                                 ,
                                 u.prototype.readInt32LE = function (t, e) {
                                     return e || D(t, 4, this.length),
                                     this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
                                 }
                                 ,
                                 u.prototype.readInt32BE = function (t, e) {
                                     return e || D(t, 4, this.length),
                                     this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
                                 }
                                 ,
                                 u.prototype.readFloatLE = function (t, e) {
                                     return e || D(t, 4, this.length),
                                         i.read(this, t, !0, 23, 4)
                                 }
                                 ,
                                 u.prototype.readFloatBE = function (t, e) {
                                     return e || D(t, 4, this.length),
                                         i.read(this, t, !1, 23, 4)
                                 }
                                 ,
                                 u.prototype.readDoubleLE = function (t, e) {
                                     return e || D(t, 8, this.length),
                                         i.read(this, t, !0, 52, 8)
                                 }
                                 ,
                                 u.prototype.readDoubleBE = function (t, e) {
                                     return e || D(t, 8, this.length),
                                         i.read(this, t, !1, 52, 8)
                                 }
                                 ,
                                 u.prototype.writeUIntLE = function (t, e, r, n) {
                                     t = +t,
                                         e |= 0,
                                         r |= 0,
                                     n || L(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                                     var i = 1
                                         , o = 0;
                                     for (this[e] = 255 & t; ++o < r && (i *= 256);)
                                         this[e + o] = t / i & 255;
                                     return e + r
                                 }
                                 ,
                                 u.prototype.writeUIntBE = function (t, e, r, n) {
                                     t = +t,
                                         e |= 0,
                                         r |= 0,
                                     n || L(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                                     var i = r - 1
                                         , o = 1;
                                     for (this[e + i] = 255 & t; --i >= 0 && (o *= 256);)
                                         this[e + i] = t / o & 255;
                                     return e + r
                                 }
                                 ,
                                 u.prototype.writeUInt8 = function (t, e, r) {
                                     return t = +t,
                                         e |= 0,
                                     r || L(this, t, e, 1, 255, 0),
                                     u.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                                         this[e] = 255 & t,
                                     e + 1
                                 }
                                 ,
                                 u.prototype.writeUInt16LE = function (t, e, r) {
                                     return t = +t,
                                         e |= 0,
                                     r || L(this, t, e, 2, 65535, 0),
                                         u.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t,
                                             this[e + 1] = t >>> 8) : R(this, t, e, !0),
                                     e + 2
                                 }
                                 ,
                                 u.prototype.writeUInt16BE = function (t, e, r) {
                                     return t = +t,
                                         e |= 0,
                                     r || L(this, t, e, 2, 65535, 0),
                                         u.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8,
                                             this[e + 1] = 255 & t) : R(this, t, e, !1),
                                     e + 2
                                 }
                                 ,
                                 u.prototype.writeUInt32LE = function (t, e, r) {
                                     return t = +t,
                                         e |= 0,
                                     r || L(this, t, e, 4, 4294967295, 0),
                                         u.TYPED_ARRAY_SUPPORT ? (this[e + 3] = t >>> 24,
                                             this[e + 2] = t >>> 16,
                                             this[e + 1] = t >>> 8,
                                             this[e] = 255 & t) : j(this, t, e, !0),
                                     e + 4
                                 }
                                 ,
                                 u.prototype.writeUInt32BE = function (t, e, r) {
                                     return t = +t,
                                         e |= 0,
                                     r || L(this, t, e, 4, 4294967295, 0),
                                         u.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24,
                                             this[e + 1] = t >>> 16,
                                             this[e + 2] = t >>> 8,
                                             this[e + 3] = 255 & t) : j(this, t, e, !1),
                                     e + 4
                                 }
                                 ,
                                 u.prototype.writeIntLE = function (t, e, r, n) {
                                     if (t = +t,
                                         e |= 0,
                                         !n) {
                                         var i = Math.pow(2, 8 * r - 1);
                                         L(this, t, e, r, i - 1, -i)
                                     }
                                     var o = 0
                                         , s = 1
                                         , a = 0;
                                     for (this[e] = 255 & t; ++o < r && (s *= 256);)
                                         t < 0 && 0 === a && 0 !== this[e + o - 1] && (a = 1),
                                             this[e + o] = (t / s >> 0) - a & 255;
                                     return e + r
                                 }
                                 ,
                                 u.prototype.writeIntBE = function (t, e, r, n) {
                                     if (t = +t,
                                         e |= 0,
                                         !n) {
                                         var i = Math.pow(2, 8 * r - 1);
                                         L(this, t, e, r, i - 1, -i)
                                     }
                                     var o = r - 1
                                         , s = 1
                                         , a = 0;
                                     for (this[e + o] = 255 & t; --o >= 0 && (s *= 256);)
                                         t < 0 && 0 === a && 0 !== this[e + o + 1] && (a = 1),
                                             this[e + o] = (t / s >> 0) - a & 255;
                                     return e + r
                                 }
                                 ,
                                 u.prototype.writeInt8 = function (t, e, r) {
                                     return t = +t,
                                         e |= 0,
                                     r || L(this, t, e, 1, 127, -128),
                                     u.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                                     t < 0 && (t = 255 + t + 1),
                                         this[e] = 255 & t,
                                     e + 1
                                 }
                                 ,
                                 u.prototype.writeInt16LE = function (t, e, r) {
                                     return t = +t,
                                         e |= 0,
                                     r || L(this, t, e, 2, 32767, -32768),
                                         u.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t,
                                             this[e + 1] = t >>> 8) : R(this, t, e, !0),
                                     e + 2
                                 }
                                 ,
                                 u.prototype.writeInt16BE = function (t, e, r) {
                                     return t = +t,
                                         e |= 0,
                                     r || L(this, t, e, 2, 32767, -32768),
                                         u.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8,
                                             this[e + 1] = 255 & t) : R(this, t, e, !1),
                                     e + 2
                                 }
                                 ,
                                 u.prototype.writeInt32LE = function (t, e, r) {
                                     return t = +t,
                                         e |= 0,
                                     r || L(this, t, e, 4, 2147483647, -2147483648),
                                         u.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t,
                                             this[e + 1] = t >>> 8,
                                             this[e + 2] = t >>> 16,
                                             this[e + 3] = t >>> 24) : j(this, t, e, !0),
                                     e + 4
                                 }
                                 ,
                                 u.prototype.writeInt32BE = function (t, e, r) {
                                     return t = +t,
                                         e |= 0,
                                     r || L(this, t, e, 4, 2147483647, -2147483648),
                                     t < 0 && (t = 4294967295 + t + 1),
                                         u.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24,
                                             this[e + 1] = t >>> 16,
                                             this[e + 2] = t >>> 8,
                                             this[e + 3] = 255 & t) : j(this, t, e, !1),
                                     e + 4
                                 }
                                 ,
                                 u.prototype.writeFloatLE = function (t, e, r) {
                                     return C(this, t, e, !0, r)
                                 }
                                 ,
                                 u.prototype.writeFloatBE = function (t, e, r) {
                                     return C(this, t, e, !1, r)
                                 }
                                 ,
                                 u.prototype.writeDoubleLE = function (t, e, r) {
                                     return _(this, t, e, !0, r)
                                 }
                                 ,
                                 u.prototype.writeDoubleBE = function (t, e, r) {
                                     return _(this, t, e, !1, r)
                                 }
                                 ,
                                 u.prototype.copy = function (t, e, r, n) {
                                     if (r || (r = 0),
                                     n || 0 === n || (n = this.length),
                                     e >= t.length && (e = t.length),
                                     e || (e = 0),
                                     n > 0 && n < r && (n = r),
                                     n === r)
                                         return 0;
                                     if (0 === t.length || 0 === this.length)
                                         return 0;
                                     if (e < 0)
                                         throw new RangeError("targetStart out of bounds");
                                     if (r < 0 || r >= this.length)
                                         throw new RangeError("sourceStart out of bounds");
                                     if (n < 0)
                                         throw new RangeError("sourceEnd out of bounds");
                                     n > this.length && (n = this.length),
                                     t.length - e < n - r && (n = t.length - e + r);
                                     var i, o = n - r;
                                     if (this === t && r < e && e < n)
                                         for (i = o - 1; i >= 0; --i)
                                             t[i + e] = this[i + r];
                                     else if (o < 1e3 || !u.TYPED_ARRAY_SUPPORT)
                                         for (i = 0; i < o; ++i)
                                             t[i + e] = this[i + r];
                                     else
                                         Uint8Array.prototype.set.call(t, this.subarray(r, r + o), e);
                                     return o
                                 }
                                 ,
                                 u.prototype.fill = function (t, e, r, n) {
                                     if ("string" == typeof t) {
                                         if ("string" == typeof e ? (n = e,
                                             e = 0,
                                             r = this.length) : "string" == typeof r && (n = r,
                                             r = this.length),
                                         1 === t.length) {
                                             var i = t.charCodeAt(0);
                                             i < 256 && (t = i)
                                         }
                                         if (void 0 !== n && "string" != typeof n)
                                             throw new TypeError("encoding must be a string");
                                         if ("string" == typeof n && !u.isEncoding(n))
                                             throw new TypeError("Unknown encoding: " + n)
                                     } else
                                         "number" == typeof t && (t &= 255);
                                     if (e < 0 || this.length < e || this.length < r)
                                         throw new RangeError("Out of range index");
                                     if (r <= e)
                                         return this;
                                     var o;
                                     if (e >>>= 0,
                                         r = void 0 === r ? this.length : r >>> 0,
                                     t || (t = 0),
                                     "number" == typeof t)
                                         for (o = e; o < r; ++o)
                                             this[o] = t;
                                     else {
                                         var s = u.isBuffer(t) ? t : N(new u(t, n).toString())
                                             , a = s.length;
                                         for (o = 0; o < r - e; ++o)
                                             this[o + e] = s[o % a]
                                     }
                                     return this
                                 }
                             ;
                             var V = /[^+\/0-9A-Za-z-_]/g;

                             function z(t) {
                                 return t < 16 ? "0" + t.toString(16) : t.toString(16)
                             }

                             function N(t, e) {
                                 var r;
                                 e = e || 1 / 0;
                                 for (var n = t.length, i = null, o = [], s = 0; s < n; ++s) {
                                     if ((r = t.charCodeAt(s)) > 55295 && r < 57344) {
                                         if (!i) {
                                             if (r > 56319) {
                                                 (e -= 3) > -1 && o.push(239, 191, 189);
                                                 continue
                                             }
                                             if (s + 1 === n) {
                                                 (e -= 3) > -1 && o.push(239, 191, 189);
                                                 continue
                                             }
                                             i = r;
                                             continue
                                         }
                                         if (r < 56320) {
                                             (e -= 3) > -1 && o.push(239, 191, 189),
                                                 i = r;
                                             continue
                                         }
                                         r = 65536 + (i - 55296 << 10 | r - 56320)
                                     } else
                                         i && (e -= 3) > -1 && o.push(239, 191, 189);
                                     if (i = null,
                                     r < 128) {
                                         if ((e -= 1) < 0)
                                             break;
                                         o.push(r)
                                     } else if (r < 2048) {
                                         if ((e -= 2) < 0)
                                             break;
                                         o.push(r >> 6 | 192, 63 & r | 128)
                                     } else if (r < 65536) {
                                         if ((e -= 3) < 0)
                                             break;
                                         o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                                     } else {
                                         if (!(r < 1114112))
                                             throw new Error("Invalid code point");
                                         if ((e -= 4) < 0)
                                             break;
                                         o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                                     }
                                 }
                                 return o
                             }

                             function F(t) {
                                 return n.toByteArray(function (t) {
                                     if ((t = function (t) {
                                         return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "")
                                     }(t).replace(V, "")).length < 2)
                                         return "";
                                     for (; t.length % 4 != 0;)
                                         t += "=";
                                     return t
                                 }(t))
                             }

                             function U(t, e, r, n) {
                                 for (var i = 0; i < n && !(i + r >= e.length || i >= t.length); ++i)
                                     e[i + r] = t[i];
                                 return i
                             }
                         }
                     ).call(this, r(23))
                 }
                 , function (t, e, r) {
                     "use strict";
                     e.byteLength = function (t) {
                         var e = c(t)
                             , r = e[0]
                             , n = e[1];
                         return 3 * (r + n) / 4 - n
                     }
                         ,
                         e.toByteArray = function (t) {
                             var e, r, n = c(t), s = n[0], a = n[1], u = new o(function (t, e, r) {
                                 return 3 * (e + r) / 4 - r
                             }(0, s, a)), f = 0, h = a > 0 ? s - 4 : s;
                             for (r = 0; r < h; r += 4)
                                 e = i[t.charCodeAt(r)] << 18 | i[t.charCodeAt(r + 1)] << 12 | i[t.charCodeAt(r + 2)] << 6 | i[t.charCodeAt(r + 3)],
                                     u[f++] = e >> 16 & 255,
                                     u[f++] = e >> 8 & 255,
                                     u[f++] = 255 & e;
                             return 2 === a && (e = i[t.charCodeAt(r)] << 2 | i[t.charCodeAt(r + 1)] >> 4,
                                 u[f++] = 255 & e),
                             1 === a && (e = i[t.charCodeAt(r)] << 10 | i[t.charCodeAt(r + 1)] << 4 | i[t.charCodeAt(r + 2)] >> 2,
                                 u[f++] = e >> 8 & 255,
                                 u[f++] = 255 & e),
                                 u
                         }
                         ,
                         e.fromByteArray = function (t) {
                             for (var e, r = t.length, i = r % 3, o = [], s = 0, a = r - i; s < a; s += 16383)
                                 o.push(f(t, s, s + 16383 > a ? a : s + 16383));
                             return 1 === i ? (e = t[r - 1],
                                 o.push(n[e >> 2] + n[e << 4 & 63] + "==")) : 2 === i && (e = (t[r - 2] << 8) + t[r - 1],
                                 o.push(n[e >> 10] + n[e >> 4 & 63] + n[e << 2 & 63] + "=")),
                                 o.join("")
                         }
                     ;
                     for (var n = [], i = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", a = 0, u = s.length; a < u; ++a)
                         n[a] = s[a],
                             i[s.charCodeAt(a)] = a;

                     function c(t) {
                         var e = t.length;
                         if (e % 4 > 0)
                             throw new Error("Invalid string. Length must be a multiple of 4");
                         var r = t.indexOf("=");
                         return -1 === r && (r = e),
                             [r, r === e ? 0 : 4 - r % 4]
                     }

                     function f(t, e, r) {
                         for (var i, o, s = [], a = e; a < r; a += 3)
                             i = (t[a] << 16 & 16711680) + (t[a + 1] << 8 & 65280) + (255 & t[a + 2]),
                                 s.push(n[(o = i) >> 18 & 63] + n[o >> 12 & 63] + n[o >> 6 & 63] + n[63 & o]);
                         return s.join("")
                     }

                     i["-".charCodeAt(0)] = 62,
                         i["_".charCodeAt(0)] = 63
                 }
                 , function (t, e) {
                     e.read = function (t, e, r, n, i) {
                         var o, s, a = 8 * i - n - 1, u = (1 << a) - 1, c = u >> 1, f = -7, h = r ? i - 1 : 0,
                             l = r ? -1 : 1, p = t[e + h];
                         for (h += l,
                                  o = p & (1 << -f) - 1,
                                  p >>= -f,
                                  f += a; f > 0; o = 256 * o + t[e + h],
                                  h += l,
                                  f -= 8)
                             ;
                         for (s = o & (1 << -f) - 1,
                                  o >>= -f,
                                  f += n; f > 0; s = 256 * s + t[e + h],
                                  h += l,
                                  f -= 8)
                             ;
                         if (0 === o)
                             o = 1 - c;
                         else {
                             if (o === u)
                                 return s ? NaN : 1 / 0 * (p ? -1 : 1);
                             s += Math.pow(2, n),
                                 o -= c
                         }
                         return (p ? -1 : 1) * s * Math.pow(2, o - n)
                     }
                         ,
                         e.write = function (t, e, r, n, i, o) {
                             var s, a, u, c = 8 * o - i - 1, f = (1 << c) - 1, h = f >> 1,
                                 l = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0, p = n ? 0 : o - 1,
                                 d = n ? 1 : -1, v = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
                             for (e = Math.abs(e),
                                      isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0,
                                          s = f) : (s = Math.floor(Math.log(e) / Math.LN2),
                                      e * (u = Math.pow(2, -s)) < 1 && (s--,
                                          u *= 2),
                                      (e += s + h >= 1 ? l / u : l * Math.pow(2, 1 - h)) * u >= 2 && (s++,
                                          u /= 2),
                                          s + h >= f ? (a = 0,
                                              s = f) : s + h >= 1 ? (a = (e * u - 1) * Math.pow(2, i),
                                              s += h) : (a = e * Math.pow(2, h - 1) * Math.pow(2, i),
                                              s = 0)); i >= 8; t[r + p] = 255 & a,
                                      p += d,
                                      a /= 256,
                                      i -= 8)
                                 ;
                             for (s = s << i | a,
                                      c += i; c > 0; t[r + p] = 255 & s,
                                      p += d,
                                      s /= 256,
                                      c -= 8)
                                 ;
                             t[r + p - d] |= 128 * v
                         }
                 }
                 , function (t, e) {
                     var r = {}.toString;
                     t.exports = Array.isArray || function (t) {
                         return "[object Array]" == r.call(t)
                     }
                 }
                 , function (t, e, r) {
                     "use strict";
                     r.r(e),
                         function (t) {
                             r.d(e, "BrowserInfo", (function () {
                                     return n
                                 }
                             )),
                                 r.d(e, "NodeInfo", (function () {
                                         return i
                                     }
                                 )),
                                 r.d(e, "SearchBotDeviceInfo", (function () {
                                         return o
                                     }
                                 )),
                                 r.d(e, "BotInfo", (function () {
                                         return s
                                     }
                                 )),
                                 r.d(e, "detect", (function () {
                                         return f
                                     }
                                 )),
                                 r.d(e, "browserName", (function () {
                                         return l
                                     }
                                 )),
                                 r.d(e, "parseUserAgent", (function () {
                                         return p
                                     }
                                 )),
                                 r.d(e, "detectOS", (function () {
                                         return d
                                     }
                                 )),
                                 r.d(e, "getNodeVersion", (function () {
                                         return v
                                     }
                                 ));
                             var n = function (t, e, r) {
                                     this.name = t,
                                         this.version = e,
                                         this.os = r,
                                         this.type = "browser"
                                 }
                                 , i = function (e) {
                                     this.version = e,
                                         this.type = "node",
                                         this.name = "node",
                                         this.os = t.platform
                                 }
                                 , o = function (t, e, r, n) {
                                     this.name = t,
                                         this.version = e,
                                         this.os = r,
                                         this.bot = n,
                                         this.type = "bot-device"
                                 }
                                 , s = function () {
                                     this.type = "bot",
                                         this.bot = !0,
                                         this.name = "bot",
                                         this.version = null,
                                         this.os = null
                                 }
                                 , a = /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask\ Jeeves\/Teoma|ia_archiver)/
                                 ,
                                 u = [["aol", /AOLShield\/([0-9\._]+)/], ["edge", /Edge\/([0-9\._]+)/], ["edge-ios", /EdgiOS\/([0-9\._]+)/], ["yandexbrowser", /YaBrowser\/([0-9\._]+)/], ["vivaldi", /Vivaldi\/([0-9\.]+)/], ["kakaotalk", /KAKAOTALK\s([0-9\.]+)/], ["samsung", /SamsungBrowser\/([0-9\.]+)/], ["silk", /\bSilk\/([0-9._-]+)\b/], ["miui", /MiuiBrowser\/([0-9\.]+)$/], ["beaker", /BeakerBrowser\/([0-9\.]+)/], ["edge-chromium", /Edg\/([0-9\.]+)/], ["chromium-webview", /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/], ["chrome", /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/], ["phantomjs", /PhantomJS\/([0-9\.]+)(:?\s|$)/], ["crios", /CriOS\/([0-9\.]+)(:?\s|$)/], ["firefox", /Firefox\/([0-9\.]+)(?:\s|$)/], ["fxios", /FxiOS\/([0-9\.]+)/], ["opera-mini", /Opera Mini.*Version\/([0-9\.]+)/], ["opera", /Opera\/([0-9\.]+)(?:\s|$)/], ["opera", /OPR\/([0-9\.]+)(:?\s|$)/], ["ie", /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/], ["ie", /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/], ["ie", /MSIE\s(7\.0)/], ["bb10", /BB10;\sTouch.*Version\/([0-9\.]+)/], ["android", /Android\s([0-9\.]+)/], ["ios", /Version\/([0-9\._]+).*Mobile.*Safari.*/], ["safari", /Version\/([0-9\._]+).*Safari/], ["facebook", /FBAV\/([0-9\.]+)/], ["instagram", /Instagram\s([0-9\.]+)/], ["ios-webview", /AppleWebKit\/([0-9\.]+).*Mobile/], ["ios-webview", /AppleWebKit\/([0-9\.]+).*Gecko\)$/], ["searchbot", /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/]]
                                 ,
                                 c = [["iOS", /iP(hone|od|ad)/], ["Android OS", /Android/], ["BlackBerry OS", /BlackBerry|BB10/], ["Windows Mobile", /IEMobile/], ["Amazon OS", /Kindle/], ["Windows 3.11", /Win16/], ["Windows 95", /(Windows 95)|(Win95)|(Windows_95)/], ["Windows 98", /(Windows 98)|(Win98)/], ["Windows 2000", /(Windows NT 5.0)|(Windows 2000)/], ["Windows XP", /(Windows NT 5.1)|(Windows XP)/], ["Windows Server 2003", /(Windows NT 5.2)/], ["Windows Vista", /(Windows NT 6.0)/], ["Windows 7", /(Windows NT 6.1)/], ["Windows 8", /(Windows NT 6.2)/], ["Windows 8.1", /(Windows NT 6.3)/], ["Windows 10", /(Windows NT 10.0)/], ["Windows ME", /Windows ME/], ["Open BSD", /OpenBSD/], ["Sun OS", /SunOS/], ["Chrome OS", /CrOS/], ["Linux", /(Linux)|(X11)/], ["Mac OS", /(Mac_PowerPC)|(Macintosh)/], ["QNX", /QNX/], ["BeOS", /BeOS/], ["OS/2", /OS\/2/]];

                             function f(t) {
                                 return t ? p(t) : "undefined" != typeof navigator ? p(navigator.userAgent) : v()
                             }

                             function h(t) {
                                 return "" !== t && u.reduce((function (e, r) {
                                         var n = r[0]
                                             , i = r[1];
                                         if (e)
                                             return e;
                                         var o = i.exec(t);
                                         return !!o && [n, o]
                                     }
                                 ), !1)
                             }

                             function l(t) {
                                 var e = h(t);
                                 return e ? e[0] : null
                             }

                             function p(t) {
                                 var e = h(t);
                                 if (!e)
                                     return null;
                                 var r = e[0]
                                     , i = e[1];
                                 if ("searchbot" === r)
                                     return new s;
                                 var u = i[1] && i[1].split(/[._]/).slice(0, 3);
                                 u ? u.length < 3 && (u = function () {
                                     for (var t = 0, e = 0, r = arguments.length; e < r; e++)
                                         t += arguments[e].length;
                                     var n = Array(t)
                                         , i = 0;
                                     for (e = 0; e < r; e++)
                                         for (var o = arguments[e], s = 0, a = o.length; s < a; s++,
                                             i++)
                                             n[i] = o[s];
                                     return n
                                 }(u, function (t) {
                                     for (var e = [], r = 0; r < t; r++)
                                         e.push("0");
                                     return e
                                 }(3 - u.length))) : u = [];
                                 var c = u.join(".")
                                     , f = d(t)
                                     , l = a.exec(t);
                                 return l && l[1] ? new o(r, c, f, l[1]) : new n(r, u.join("."), f)
                             }

                             function d(t) {
                                 for (var e = 0, r = c.length; e < r; e++) {
                                     var n = c[e]
                                         , i = n[0];
                                     if (n[1].exec(t))
                                         return i
                                 }
                                 return null
                             }

                             function v() {
                                 return void 0 !== t && t.version ? new i(t.version.slice(1)) : null
                             }
                         }
                             .call(this, r(125))
                 }
                 , function (t, e) {
                     var r, n, i = t.exports = {};

                     function o() {
                         throw new Error("setTimeout has not been defined")
                     }

                     function s() {
                         throw new Error("clearTimeout has not been defined")
                     }

                     function a(t) {
                         if (r === setTimeout)
                             return setTimeout(t, 0);
                         if ((r === o || !r) && setTimeout)
                             return r = setTimeout,
                                 setTimeout(t, 0);
                         try {
                             return r(t, 0)
                         } catch (e) {
                             try {
                                 return r.call(null, t, 0)
                             } catch (e) {
                                 return r.call(this, t, 0)
                             }
                         }
                     }

                     !function () {
                         try {
                             r = "function" == typeof setTimeout ? setTimeout : o
                         } catch (t) {
                             r = o
                         }
                         try {
                             n = "function" == typeof clearTimeout ? clearTimeout : s
                         } catch (t) {
                             n = s
                         }
                     }();
                     var u, c = [], f = !1, h = -1;

                     function l() {
                         f && u && (f = !1,
                             u.length ? c = u.concat(c) : h = -1,
                         c.length && p())
                     }

                     function p() {
                         if (!f) {
                             var t = a(l);
                             f = !0;
                             for (var e = c.length; e;) {
                                 for (u = c,
                                          c = []; ++h < e;)
                                     u && u[h].run();
                                 h = -1,
                                     e = c.length
                             }
                             u = null,
                                 f = !1,
                                 function (t) {
                                     if (n === clearTimeout)
                                         return clearTimeout(t);
                                     if ((n === s || !n) && clearTimeout)
                                         return n = clearTimeout,
                                             clearTimeout(t);
                                     try {
                                         n(t)
                                     } catch (e) {
                                         try {
                                             return n.call(null, t)
                                         } catch (e) {
                                             return n.call(this, t)
                                         }
                                     }
                                 }(t)
                         }
                     }

                     function d(t, e) {
                         this.fun = t,
                             this.array = e
                     }

                     function v() {
                     }

                     i.nextTick = function (t) {
                         var e = new Array(arguments.length - 1);
                         if (arguments.length > 1)
                             for (var r = 1; r < arguments.length; r++)
                                 e[r - 1] = arguments[r];
                         c.push(new d(t, e)),
                         1 !== c.length || f || a(p)
                     }
                         ,
                         d.prototype.run = function () {
                             this.fun.apply(null, this.array)
                         }
                         ,
                         i.title = "browser",
                         i.browser = !0,
                         i.env = {},
                         i.argv = [],
                         i.version = "",
                         i.versions = {},
                         i.on = v,
                         i.addListener = v,
                         i.once = v,
                         i.off = v,
                         i.removeListener = v,
                         i.removeAllListeners = v,
                         i.emit = v,
                         i.prependListener = v,
                         i.prependOnceListener = v,
                         i.listeners = function (t) {
                             return []
                         }
                         ,
                         i.binding = function (t) {
                             throw new Error("process.binding is not supported")
                         }
                         ,
                         i.cwd = function () {
                             return "/"
                         }
                         ,
                         i.chdir = function (t) {
                             throw new Error("process.chdir is not supported")
                         }
                         ,
                         i.umask = function () {
                             return 0
                         }
                 }
                 , function (t, e, r) {
                     "use strict";
                     r.r(e),
                         r(70),
                         r(107),
                         r(114),
                         r(118);
                     var n = r(2)
                         , i = r.n(n)
                         , o = r(1)
                         , s = r(9)
                         , a = r(0);

                     function u(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var c = function () {
                         function t(e, r, n, i) {
                             if (function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                                 !e)
                                 throw new Error("Verifier must be provided");
                             if (e.equals(new o.BigInteger("0")))
                                 throw new Error("Verifier integer must not equal 0");
                             if (!r)
                                 throw new Error("Salt must be provided");
                             if (n <= 0)
                                 throw new Error("Iterations must be greater than 0.");
                             this.verifier = e,
                                 this.salt = r,
                                 this.iterations = n,
                                 this.x = i
                         }

                         var e, r;
                         return e = t,
                         (r = [{
                             key: "isMatchingVerifier",
                             value: function (t) {
                                 if (!t)
                                     throw new Error("Please provide a verifier to match against.");
                                 var e = t.getSalt()
                                     , r = this.salt.filter((function (t) {
                                         return !e.includes(t)
                                     }
                                 ))
                                     , n = this.verifier.filter((function (e) {
                                         return !t.verifier.equals(e)
                                     }
                                 ));
                                 return 0 === r.length && 0 === n.length
                             }
                         }, {
                             key: "getX",
                             value: function () {
                                 return this.x
                             }
                         }]) && u(e.prototype, r),
                             t
                     }();

                     function f(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var h = s.a.SubtleCrypto
                         , l = s.a.WebCrypto
                         , p = function () {
                         function t(e, r) {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                             e && (this.salt = e),
                             r && (this.iterations = r),
                                 this.x = null
                         }

                         var e, r;
                         return e = t,
                         (r = [{
                             key: "generateVerifier",
                             value: function (t, e, r) {
                                 var n, i;
                                 return regeneratorRuntime.async((function (s) {
                                         for (; ;)
                                             switch (s.prev = s.next) {
                                                 case 0:
                                                     if (t) {
                                                         s.next = 2;
                                                         break
                                                     }
                                                     throw new Error("HMAC SHA-256 encoded username is required.");
                                                 case 2:
                                                     if (e) {
                                                         s.next = 4;
                                                         break
                                                     }
                                                     throw new Error("Password must be provided.");
                                                 case 4:
                                                     if (!(e.length < r.minPasswordLength)) {
                                                         s.next = 6;
                                                         break
                                                     }
                                                     throw new Error("The password length is below the minimum length requirement.");
                                                 case 6:
                                                     if (!(e.length > r.maxPasswordLength)) {
                                                         s.next = 8;
                                                         break
                                                     }
                                                     throw new Error("The password length is above the maximum length requirement.");
                                                 case 8:
                                                     if (r) {
                                                         s.next = 10;
                                                         break
                                                     }
                                                     throw new Error("Version must be provided.");
                                                 case 10:
                                                     return this.iterations || (this.iterations = r.iterations),
                                                     this.salt || (this.salt = this.generateSalt(r.saltSize)),
                                                         s.next = 14,
                                                         regeneratorRuntime.awrap(this.computeX(this.salt, t, e, r));
                                                 case 14:
                                                     if (this.x = s.sent,
                                                         n = this.computeVerifier(this.x, r.getParameters().g, r.getParameters().N),
                                                         i = n.toByteArray(),
                                                     1 !== this.x.signum() || 0 !== i[0]) {
                                                         s.next = 20;
                                                         break
                                                     }
                                                     return i.shift(),
                                                         s.abrupt("return", new c(new o.BigInteger(i), a.a.hexStringToArrayBufferBE(this.salt), this.iterations, this.x));
                                                 case 20:
                                                     return s.abrupt("return", new c(n, a.a.hexStringToArrayBufferBE(this.salt), this.iterations, this.x));
                                                 case 21:
                                                 case "end":
                                                     return s.stop()
                                             }
                                     }
                                 ), null, this)
                             }
                         }, {
                             key: "computeX",
                             value: function (t, e, r, n) {
                                 return regeneratorRuntime.async((function (i) {
                                         for (; ;)
                                             switch (i.prev = i.next) {
                                                 case 0:
                                                     return i.abrupt("return", n.xRoutineVersion.computeX(t, e, r));
                                                 case 1:
                                                 case "end":
                                                     return i.stop()
                                             }
                                     }
                                 ))
                             }
                         }, {
                             key: "computeVerifier",
                             value: function (t, e, r) {
                                 return t.signum() < 0 ? e.modPow(t.negate(), r).modInverse(r) : e.modPow(t, r)
                             }
                         }, {
                             key: "generateSalt",
                             value: function (t) {
                                 if (t <= 0)
                                     throw new Error("Salt size must be greater than 0");
                                 var e = new Uint8Array(t);
                                 return l.getRandomValues(e),
                                     a.a.arrayBufferToHexString(e)
                             }
                         }, {
                             key: "getSrpUsername",
                             value: function (t, e) {
                                 var r, n, i;
                                 return regeneratorRuntime.async((function (o) {
                                         for (; ;)
                                             switch (o.prev = o.next) {
                                                 case 0:
                                                     if (!(t <= 0)) {
                                                         o.next = 2;
                                                         break
                                                     }
                                                     throw new Error("Invalid accountId");
                                                 case 2:
                                                     return o.prev = 2,
                                                         r = a.a.bigNumbertoBufferLE(t, 8),
                                                         o.next = 6,
                                                         regeneratorRuntime.awrap(h.importKey("raw", e, {
                                                             name: "HMAC",
                                                             hash: "SHA-256"
                                                         }, !1, ["sign", "verify"]));
                                                 case 6:
                                                     return n = o.sent,
                                                         o.next = 9,
                                                         regeneratorRuntime.awrap(h.sign({
                                                             name: "HMAC",
                                                             hash: "SHA-256"
                                                         }, n, r));
                                                 case 9:
                                                     return i = o.sent,
                                                         o.abrupt("return", a.a.arrayBufferToHexString(new Uint8Array(i)).toUpperCase());
                                                 case 13:
                                                     throw o.prev = 13,
                                                         o.t0 = o.catch(2),
                                                         new Error("Unable to generate the SRP username", o.t0);
                                                 case 16:
                                                 case "end":
                                                     return o.stop()
                                             }
                                     }
                                 ), null, null, [[2, 13]])
                             }
                         }, {
                             key: "encodeVerifier",
                             value: function (t, e) {
                                 return e.encodeVerifier(t)
                             }
                         }, {
                             key: "encodeVerifierHex",
                             value: function (t, e) {
                                 var r = this.encodeVerifier(t, e);
                                 return a.a.arrayBufferToHexString(new Uint8Array(r)).toUpperCase()
                             }
                         }, {
                             key: "decodeVerifier",
                             value: function (t, e) {
                                 return e.decodeVerifier(t)
                             }
                         }]) && f(e.prototype, r),
                             t
                     }();

                     function d(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var v = s.a.SubtleCrypto
                         , y = function () {
                         function t(e) {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                                 this.saltSize = e,
                                 this.digest = "SHA-256"
                         }

                         var e, r;
                         return e = t,
                         (r = [{
                             key: "computeX",
                             value: function (t, e, r) {
                                 var n, i, o, s, u, c, f, h, l, p;
                                 return regeneratorRuntime.async((function (d) {
                                         for (; ;)
                                             switch (d.prev = d.next) {
                                                 case 0:
                                                     return (n = a.a.hexStringToArrayBufferBE(t)).length < this.saltSize && (i = new Uint8Array(this.saltSize),
                                                         n = i.set(n)),
                                                         o = r.substring(0, 16),
                                                         s = "".concat(e, ":").concat(o.toUpperCase()),
                                                         u = a.a.stringToArrayBuffer(s),
                                                         d.next = 7,
                                                         regeneratorRuntime.awrap(v.digest(this.digest, u));
                                                 case 7:
                                                     return c = d.sent,
                                                         f = new Uint8Array(c),
                                                         h = n.length + f.length,
                                                         (l = new Uint8Array(h)).set(n),
                                                         l.set(f, n.length),
                                                         d.next = 15,
                                                         regeneratorRuntime.awrap(v.digest(this.digest, l));
                                                 case 15:
                                                     return p = d.sent,
                                                         d.abrupt("return", a.a.bufferToBigNumberLE(new Uint8Array(p)));
                                                 case 17:
                                                 case "end":
                                                     return d.stop()
                                             }
                                     }
                                 ), null, this)
                             }
                         }]) && d(e.prototype, r),
                             t
                     }();

                     function m(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var g = function () {
                         function t(e) {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                                 this.iterations = e || 1,
                                 this.saltSize = 32,
                                 this.verifierSize = 128,
                                 this.minPasswordLength = 8,
                                 this.maxPasswordLength = 16,
                                 this.xRoutineVersion = new y(this.saltSize)
                         }

                         var e, r, n;
                         return e = t,
                             n = [{
                                 key: "build",
                                 value: function () {
                                     return new t
                                 }
                             }],
                         (r = [{
                             key: "getParameters",
                             value: function () {
                                 return {
                                     N: new o.BigInteger('94558736629309251206436488916623864910444695865064772352148093707798675228170106115630190094901096401883540229236016599430725894430734991444298272129143681820273859470730877741629279425748927230996376833577406570089078823475120723855492588316592686203439138514838131581023312004481906611790561347740748686507"'),
                                     g: new o.BigInteger("2"),
                                     H: "SHA-256"
                                 }
                             }
                         }, {
                             key: "getEncodedVerifierSize",
                             value: function () {
                                 return this.saltSize + this.verifierSize
                             }
                         }, {
                             key: "encodeVerifier",
                             value: function (t) {
                                 var e = new Uint8Array(this.getEncodedVerifierSize());
                                 e.set(t.salt, 0);
                                 var r = a.a.bigNumbertoBufferBE(t.verifier, this.verifierSize);
                                 return e.set(r, this.saltSize),
                                     e
                             }
                         }, {
                             key: "decodeVerifier",
                             value: function (t) {
                                 if (!t)
                                     throw new Error("Bytes must be provided.");
                                 if (t.length !== this.getEncodedVerifierSize())
                                     throw new Error("Invalid verifier length.");
                                 var e = t.slice(0, this.saltSize)
                                     ,
                                     r = a.a.bufferToBigNumberBE(t.slice(this.saltSize, this.saltSize + this.verifierSize));
                                 return new c(r, e, this.iterations)
                             }
                         }]) && m(e.prototype, r),
                         n && m(e, n),
                             t
                     }();

                     function b(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var w = s.a.SubtleCrypto
                         , x = function () {
                         function t(e, r) {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                                 this.iterations = e,
                                 this.saltSize = r,
                                 this.digest = "SHA-512",
                                 this.keyLength = 512
                         }

                         var e, r;
                         return e = t,
                         (r = [{
                             key: "computeX",
                             value: function (t, e, r) {
                                 var n, i, s, u, c, f, h;
                                 return regeneratorRuntime.async((function (l) {
                                         for (; ;)
                                             switch (l.prev = l.next) {
                                                 case 0:
                                                     return (n = a.a.hexStringToArrayBufferBE(t)).length < this.saltSize && (i = new Uint8Array(this.saltSize),
                                                         n = i.set(n)),
                                                         s = r.substring(0, 128),
                                                         u = "".concat(e, ":").concat(s),
                                                         l.next = 6,
                                                         regeneratorRuntime.awrap(w.importKey("raw", a.a.stringToArrayBuffer(u), {
                                                             name: "PBKDF2"
                                                         }, !1, ["deriveBits", "deriveKey"]));
                                                 case 6:
                                                     return c = l.sent,
                                                         l.next = 9,
                                                         regeneratorRuntime.awrap(w.deriveKey({
                                                             name: "PBKDF2",
                                                             salt: n,
                                                             iterations: this.iterations,
                                                             hash: this.digest
                                                         }, c, {
                                                             name: "HMAC",
                                                             hash: this.digest,
                                                             length: this.keyLength
                                                         }, !0, ["sign", "verify"]));
                                                 case 9:
                                                     return f = l.sent,
                                                         l.next = 12,
                                                         regeneratorRuntime.awrap(w.exportKey("raw", f));
                                                 case 12:
                                                     return h = l.sent,
                                                         l.abrupt("return", new o.BigInteger(new Uint8Array(h)));
                                                 case 14:
                                                 case "end":
                                                     return l.stop()
                                             }
                                     }
                                 ), null, this)
                             }
                         }]) && b(e.prototype, r),
                             t
                     }();

                     function S(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var T = function () {
                         function t(e) {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                                 this.iterations = e || 15e3,
                                 this.saltSize = 32,
                                 this.verifierSize = 256,
                                 this.iterationsSize = 4,
                                 this.minPasswordLength = 8,
                                 this.maxPasswordLength = 128,
                                 this.xRoutineVersion = new x(this.iterations, this.saltSize)
                         }

                         var e, r, n;
                         return e = t,
                             n = [{
                                 key: "build",
                                 value: function () {
                                     return new t
                                 }
                             }],
                         (r = [{
                             key: "getParameters",
                             value: function () {
                                 return {
                                     N: new o.BigInteger("21766174458617435773191008891802753781907668374255538511144643224689886235383840957210909013086056401571399717235807266581649606472148410291413364152197364477180887395655483738115072677402235101762521901569820740293149529620419333266262073471054548368736039519702486226506248861060256971802984953561121442680157668000761429988222457090413873973970171927093992114751765168063614761119615476233422096442783117971236371647333871414335895773474667308967050807005509320424799678417036867928316761272274230314067548291133582479583061439577559347101961771406173684378522703483495337037655006751328447510550299250924469288819"),
                                     g: new o.BigInteger("2"),
                                     H: "SHA-256"
                                 }
                             }
                         }, {
                             key: "getEncodedVerifierSize",
                             value: function () {
                                 return this.saltSize + this.verifierSize + this.iterationsSize
                             }
                         }, {
                             key: "encodeVerifier",
                             value: function (t) {
                                 var e = new Uint8Array(this.getEncodedVerifierSize());
                                 e.set(t.salt, 0);
                                 var r = a.a.bigNumbertoBufferBE(t.verifier, this.verifierSize);
                                 e.set(r, this.saltSize);
                                 var n = a.a.bigNumbertoBufferBE(new o.BigInteger(t.iterations.toString()), this.iterationsSize);
                                 return e.set(n, this.saltSize + this.verifierSize),
                                     e
                             }
                         }, {
                             key: "decodeVerifier",
                             value: function (t) {
                                 if (!t)
                                     throw new Error("Bytes must be provided.");
                                 if (t.length !== this.getEncodedVerifierSize())
                                     throw new Error("Invalid verifier length.");
                                 var e = t.slice(0, this.saltSize)
                                     ,
                                     r = a.a.bufferToBigNumberBE(t.slice(this.saltSize, this.saltSize + this.verifierSize))
                                     , n = this.saltSize + this.verifierSize
                                     , i = t.slice(n, n + this.iterationsSize)
                                     , o = a.a.byteArrayToInteger(i);
                                 return new c(r, e, o)
                             }
                         }]) && S(e.prototype, r),
                         n && S(e, n),
                             t
                     }();

                     function E(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var B = function () {
                         function t(e, r) {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                             e && (this.salt = e),
                             r && (this.iterations = r),
                                 this.x = null
                         }

                         var e, r;
                         return e = t,
                         (r = [{
                             key: "generateVerifier",
                             value: function (t, e, r) {
                                 var n = this;
                                 if (!t)
                                     throw new Error("HMAC SHA-256 encoded username is required.");
                                 if (!e)
                                     throw new Error("Password must be provided.");
                                 if (e.length < r.minPasswordLength)
                                     throw new Error("The password length is below the minimum length requirement.");
                                 if (e.length > r.maxPasswordLength)
                                     throw new Error("The password length is above the maximum length requirement.");
                                 if (!r)
                                     throw new Error("Version must be provided.");
                                 this.iterations || (this.iterations = r.iterations),
                                 this.salt || (this.salt = this.generateSalt(r.saltSize)),
                                     this.x = this.computeX(this.salt, t, e, r);
                                 var i = this.computeVerifier(this.x, r.getParameters().g, r.getParameters().N);
                                 return new Promise((function (t, e) {
                                         try {
                                             var r = i.toByteArray();
                                             return 1 === n.x.signum() && 0 === r[0] ? (r.shift(),
                                                 t(new c(new o.BigInteger(r), a.a.hexStringToArrayBufferBE(n.salt), n.iterations, n.x))) : t(new c(i, a.a.hexStringToArrayBufferBE(n.salt), n.iterations, n.x))
                                         } catch (t) {
                                             return e(t)
                                         }
                                     }
                                 ))
                             }
                         }, {
                             key: "computeX",
                             value: function (t, e, r, n) {
                                 return n.xRoutineVersion.computeX(t, e, r)
                             }
                         }, {
                             key: "computeVerifier",
                             value: function (t, e, r) {
                                 return t.signum() < 0 ? e.modPow(t.negate(), r).modInverse(r) : e.modPow(t, r)
                             }
                         }, {
                             key: "generateSalt",
                             value: function (t) {
                                 if (t <= 0)
                                     throw new Error("Salt size must be greater than 0");
                                 return i.a.codec.hex.fromBits(i.a.random.randomWords(t / 2, 0))
                             }
                         }, {
                             key: "getSrpUsername",
                             value: function (t, e) {
                                 return new Promise((function (r, n) {
                                         if (t <= 0)
                                             return n(new Error("Invalid accountId"));
                                         try {
                                             var o = a.a.bigNumbertoBufferLE(t, 8)
                                                 ,
                                                 s = i.a.codec.hex.toBits(a.a.arrayBufferToHexString(new Uint8Array(e)))
                                                 ,
                                                 u = new i.a.misc.hmac(s, i.a.hash.sha256).mac(i.a.codec.hex.toBits(a.a.arrayBufferToHexString(new Uint8Array(o))));
                                             return r(i.a.codec.hex.fromBits(u).toUpperCase())
                                         } catch (t) {
                                             return n(new Error("Unable to generate the SRP username", t))
                                         }
                                     }
                                 ))
                             }
                         }, {
                             key: "encodeVerifier",
                             value: function (t, e) {
                                 return e.encodeVerifier(t)
                             }
                         }, {
                             key: "encodeVerifierHex",
                             value: function (t, e) {
                                 var r = this.encodeVerifier(t, e);
                                 return a.a.arrayBufferToHexString(new Uint8Array(r)).toUpperCase()
                             }
                         }, {
                             key: "decodeVerifier",
                             value: function (t, e) {
                                 return e.decodeVerifier(t)
                             }
                         }]) && E(e.prototype, r),
                             t
                     }();

                     function A(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var k = function () {
                         function t(e) {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                                 this.saltSize = e
                         }

                         var e, r;
                         return e = t,
                         (r = [{
                             key: "computeX",
                             value: function (t, e, r) {
                                 for (var n = r.substring(0, 16), i = this.hash("".concat(e, ":").concat(n.toUpperCase())), s = this.hash(t + i, !0), a = "", u = 0; u < s.length; u += 2)
                                     a += s[s.length - u - 2] + s[s.length - u - 1];
                                 return new o.BigInteger(a, 16)
                             }
                         }, {
                             key: "hash",
                             value: function (t, e) {
                                 var r = t;
                                 e && (r = i.a.codec.hex.toBits(t));
                                 var n = i.a.codec.hex.fromBits(i.a.hash.sha256.hash(r));
                                 return this.pad(64, n)
                             }
                         }, {
                             key: "pad",
                             value: function (t, e) {
                                 var r = Array(t + 1).join("0");
                                 return (r + e).slice(-r.length)
                             }
                         }]) && A(e.prototype, r),
                             t
                     }();

                     function O(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var M = function () {
                         function t(e) {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                                 this.iterations = e || 1,
                                 this.saltSize = 32,
                                 this.verifierSize = 128,
                                 this.minPasswordLength = 8,
                                 this.maxPasswordLength = 16,
                                 this.xRoutineVersion = new k(this.saltSize)
                         }

                         var e, r, n;
                         return e = t,
                             n = [{
                                 key: "build",
                                 value: function () {
                                     return new t
                                 }
                             }],
                         (r = [{
                             key: "getParameters",
                             value: function () {
                                 return {
                                     N: new o.BigInteger('94558736629309251206436488916623864910444695865064772352148093707798675228170106115630190094901096401883540229236016599430725894430734991444298272129143681820273859470730877741629279425748927230996376833577406570089078823475120723855492588316592686203439138514838131581023312004481906611790561347740748686507"'),
                                     g: new o.BigInteger("2"),
                                     H: "SHA-256"
                                 }
                             }
                         }, {
                             key: "getEncodedVerifierSize",
                             value: function () {
                                 return this.saltSize + this.verifierSize
                             }
                         }, {
                             key: "encodeVerifier",
                             value: function (t) {
                                 var e = new Uint8Array(this.getEncodedVerifierSize());
                                 e.set(t.salt, 0);
                                 var r = a.a.bigNumbertoBufferBE(t.verifier, this.verifierSize);
                                 return e.set(r, this.saltSize),
                                     e
                             }
                         }, {
                             key: "decodeVerifier",
                             value: function (t) {
                                 if (!t)
                                     throw new Error("Bytes must be provided.");
                                 if (t.length !== this.getEncodedVerifierSize())
                                     throw new Error("Invalid verifier length.");
                                 var e = t.slice(0, this.saltSize)
                                     ,
                                     r = a.a.bufferToBigNumberBE(t.slice(this.saltSize, this.saltSize + this.verifierSize));
                                 return new c(r, e, this.iterations)
                             }
                         }]) && O(e.prototype, r),
                         n && O(e, n),
                             t
                     }();

                     function P(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var D = function () {
                         function t(e, r) {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                                 this.iterations = e,
                                 this.saltSize = r,
                                 this.digest = "SHA-512",
                                 this.keyLength = 512
                         }

                         var e, r;
                         return e = t,
                         (r = [{
                             key: "computeX",
                             value: function (t, e, r) {
                                 var n = r.substring(0, 128)
                                     , s = "".concat(e, ":").concat(n)
                                     , u = i.a.codec.hex.toBits(t)
                                     , c = i.a.misc.pbkdf2(s, u, this.iterations, this.keyLength, (function (t) {
                                         var e = new i.a.misc.hmac(t, i.a.hash.sha512);
                                         this.encrypt = function () {
                                             return e.encrypt.apply(e, arguments)
                                         }
                                     }
                                 ))
                                     , f = i.a.codec.hex.fromBits(c);
                                 return new o.BigInteger(new Uint8Array(a.a.hexStringToArrayBufferBE(f)))
                             }
                         }]) && P(e.prototype, r),
                             t
                     }();

                     function L(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var R = function () {
                         function t(e) {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t),
                                 this.iterations = e || 15e3,
                                 this.saltSize = 32,
                                 this.verifierSize = 256,
                                 this.iterationsSize = 4,
                                 this.minPasswordLength = 8,
                                 this.maxPasswordLength = 128,
                                 this.xRoutineVersion = new D(this.iterations, this.saltSize)
                         }

                         var e, r, n;
                         return e = t,
                             n = [{
                                 key: "build",
                                 value: function () {
                                     return new t
                                 }
                             }],
                         (r = [{
                             key: "getParameters",
                             value: function () {
                                 return {
                                     N: new o.BigInteger("21766174458617435773191008891802753781907668374255538511144643224689886235383840957210909013086056401571399717235807266581649606472148410291413364152197364477180887395655483738115072677402235101762521901569820740293149529620419333266262073471054548368736039519702486226506248861060256971802984953561121442680157668000761429988222457090413873973970171927093992114751765168063614761119615476233422096442783117971236371647333871414335895773474667308967050807005509320424799678417036867928316761272274230314067548291133582479583061439577559347101961771406173684378522703483495337037655006751328447510550299250924469288819"),
                                     g: new o.BigInteger("2"),
                                     H: "SHA-256"
                                 }
                             }
                         }, {
                             key: "getEncodedVerifierSize",
                             value: function () {
                                 return this.saltSize + this.verifierSize + this.iterationsSize
                             }
                         }, {
                             key: "encodeVerifier",
                             value: function (t) {
                                 var e = [];
                                 e = e.concat(t.salt);
                                 var r = a.a.bigNumbertoBufferBE(t.verifier);
                                 e = e.concat(Array.from(r));
                                 var n = a.a.bigNumbertoBufferBE(new o.BigInteger(t.iterations.toString()), this.iterationsSize);
                                 return e.concat(Array.from(n))
                             }
                         }, {
                             key: "decodeVerifier",
                             value: function (t) {
                                 if (!t)
                                     throw new Error("Bytes must be provided.");
                                 if (t.length !== this.getEncodedVerifierSize())
                                     throw new Error("Invalid verifier length.");
                                 var e = t.split(0, this.saltSize)
                                     , r = a.a.bufferToBigNumberBE(t.split(0, this.verifierSize))
                                     , n = t.split(0, this.iterationsSize)
                                     , i = a.a.byteArrayToInteger(n);
                                 return new c(r, e, i)
                             }
                         }]) && L(e.prototype, r),
                         n && L(e, n),
                             t
                     }();

                     function j(t, e) {
                         for (var r = 0; r < e.length; r++) {
                             var n = e[r];
                             n.enumerable = n.enumerable || !1,
                                 n.configurable = !0,
                             "value" in n && (n.writable = !0),
                                 Object.defineProperty(t, n.key, n)
                         }
                     }

                     var I = function () {
                         function t() {
                             !function (t, e) {
                                 if (!(t instanceof e))
                                     throw new TypeError("Cannot call a class as a function")
                             }(this, t)
                         }

                         var e, r;
                         return e = t,
                         (r = [{
                             key: "getBrowserExports",
                             value: function (t) {
                                 switch (t && t.name) {
                                     case "chrome":
                                     case "firefox":
                                     case "opera":
                                         return this[t.name + "Exports"](t.version);
                                     default:
                                         return this.legacyExports()
                                 }
                             }
                         }, {
                             key: "chromeExports",
                             value: function (t) {
                                 var e = this.getMajorVersion(t);
                                 return null != e && e <= 39 ? this.legacyExports() : this.modernExports()
                             }
                         }, {
                             key: "firefoxExports",
                             value: function () {
                                 return this.modernExports()
                             }
                         }, {
                             key: "operaExports",
                             value: function () {
                                 return this.modernExports()
                             }
                         }, {
                             key: "modernExports",
                             value: function () {
                                 return {
                                     PasswordManager: p,
                                     PasswordVersion1: g,
                                     PasswordVersion2: T,
                                     XRoutineVersion1: y,
                                     XRoutineVersion2: x
                                 }
                             }
                         }, {
                             key: "legacyExports",
                             value: function () {
                                 return {
                                     PasswordManager: B,
                                     PasswordVersion1: M,
                                     PasswordVersion2: R,
                                     XRoutineVersion1: k,
                                     XRoutineVersion2: D
                                 }
                             }
                         }, {
                             key: "getMajorVersion",
                             value: function (t) {
                                 try {
                                     if (!t)
                                         return null;
                                     var e = /^(([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/gi.exec(t);
                                     if (e) {
                                         var r = e[2];
                                         return parseInt(r)
                                     }
                                     return null
                                 } catch (t) {
                                     console.log(t)
                                     return null
                                 }
                             }
                         }]) && j(e, r),
                             t
                     }();
                     r.d(e, "PasswordManager", (function () {
                             return _
                         }
                     )),
                         r.d(e, "PasswordVersion1", (function () {
                                 return V
                             }
                         )),
                         r.d(e, "PasswordVersion2", (function () {
                                 return z
                             }
                         )),
                         r.d(e, "XRoutineVersion1", (function () {
                                 return N
                             }
                         )),
                         r.d(e, "XRoutineVersion2", (function () {
                                 return F
                             }
                         )),
                         r.d(e, "Crypto", (function () {
                                 return s.a
                             }
                         )),
                         r.d(e, "Utilities", (function () {
                                 return a.a
                             }
                         )),
                         r.d(e, "sjcl", (function () {
                                 return i.a
                             }
                         ));
                     var C = (0,
                         r(124).detect)()
                         , _ = null
                         , V = null
                         , z = null
                         , N = null
                         , F = null
                         , U = I.getBrowserExports(C);
                     _ = U.PasswordManager,
                         V = U.PasswordVersion1,
                         z = U.PasswordVersion2,
                         N = U.XRoutineVersion1,
                         F = U.XRoutineVersion2
                 }
             ])
         }
     })
     const i = pick(0), n = pick(2)

     function modifyObjectValues(original, newValues) {
         const newObject = Object.create(Object.getPrototypeOf(original));
         Object.assign(newObject, original);
         for (const key in newValues) {
             if (newValues.hasOwnProperty(key)) {
                 newObject[key] = newValues[key];
             }
         }
         return newObject;
     }

     function encrypt(srpParams, password) {
         function unsignedModPow(t, e, r) {
             var res = [], l, p, d;

             function enc(t, e, r) {
                 res = e.signum() < 0 ? ["success", t.modPow(e.negate(), r).modInverse(r).toString()] : ["success", t.modPow(e, r).toString()]
             }

             return l = new i.BigInteger(t.toString()),
                 p = new i.BigInteger(e.toString()),
                 (d = new i.BigInteger(r.toString())).toByteArray(), enc(l, p, d),
                 new i.BigInteger(res[1])
         }

         function createRandomBigIntegerInRange(t, e) {
             var r = t.compareTo(e);
             if (r >= 0) {
                 if (r > 0)
                     throw new Error('"min" may not be greater than "max"');
                 return t
             }
             if (t.bitLength() > e.bitLength() / 2)
                 return this.createRandomBigIntegerInRange(i.BigInteger.ZERO, e.subtract(t)).add(t);
             for (var o = 0; o < 1e3; ++o) {
                 var s = n.sjcl.codec.hex.fromBits(n.sjcl.random.randomWords(32, 0))
                     , a = new i.BigInteger(s, 16);
                 if (a.compareTo(t) >= 0 && a.compareTo(e) <= 0)
                     return a
             }
             var u = n.sjcl.codec.hex.fromBits(n.sjcl.random.randomWords(32, 0));
             return new i.BigInteger(u, 16)
         }

         var N = new i.BigInteger(srpParams.modulus, 16)
         var g = new i.BigInteger(srpParams.generator, 16)

         function generateRandomValue() {
             var t = Math.min(256, N.bitLength() / 2)
                 , e = i.BigInteger.ONE.shiftLeft(t - 1)
                 , r = N.subtract(i.BigInteger.ONE);
             return createRandomBigIntegerInRange(e, r)
         }

         function hash(t, e) {
             var r;

             return r = n.sjcl.codec.bytes.toBits(t),
             e && (r = n.sjcl.codec.hex.toBits(t)),
                 n.sjcl.codec.bytes.fromBits(n.sjcl.hash.sha256.hash(r))

         }

         function createPaddedPairHash(t, e) {
             var r, n, o;
             r = N.bitLength() / 4,
                 n = t.toString(16).padStart(r, "0")
             o = e.toString(16).padStart(r, "0")
             return hash(n + o, !0)
         }

         function computePublicA(t) {
             var e = unsignedModPow(g, t, N)
             if (e.equals(i.BigInteger.ZERO) || e.equals(i.BigInteger.ONE) || e.equals(new i.BigInteger("-1"))) {
                 return computePublicA(t);
             }
             return e;

         }


         s = new i.BigInteger(srpParams.public_B, 16)

         function checkValidPublicValue(t) {
             var e, r;
             e = "Invalid public value";
             if (!t) {
                 throw new Error(e);
             }
             r = unsignedModPow(t, i.BigInteger.ONE, N)
             if (t.equals(i.BigInteger.ZERO) || t.equals(i.BigInteger.ONE) || r.equals(i.BigInteger.ZERO)) {
                 throw new Error(e);
             }
         }

         checkValidPublicValue(s)
         a = generateRandomValue()
         u = computePublicA(a)


         function signedBigIntegerToUnsigned(t, e) {
             return t.andNot(new i.BigInteger("-1").shiftLeft(8 * e))
         }

         function computeK() {
             var t;
             t = createPaddedPairHash(N, g)
             return signedBigIntegerToUnsigned(new i.BigInteger(new Uint8Array(t)), 32);
         }

         function computeS(t, e, r, n, i) {
             var o, s;
             o = e.multiply(t).add(r);
             result = unsignedModPow(g, t, N)
             s = result.multiply(n);
             return unsignedModPow(i.subtract(s), o, N);
         }

         function bytesToBitArray(t) {
             var e = 0
                 , r = []
                 , i = 0;
             for (e = 0; e < t.length; e++)
                 i = i << 8 | 255 & t[e],
                 3 == (3 & e) && (r.push(0 ^ i),
                     i = 0);
             return 3 & e && r.push(n.sjcl.bitArray.partial(8 * (3 & e), i)),
                 r
         }

         function computeM1(t, e, res) {
             var r;
             r = new n.sjcl.hash.sha256;
             r.update(bytesToBitArray(t.toByteArray()));
             r.update(bytesToBitArray(e.toByteArray()));
             r.update(bytesToBitArray(res.toByteArray()));
             return new i.BigInteger(n.sjcl.codec.hex.fromBits(r.finalize()), 16);
         }

         var c = createPaddedPairHash(u, s)
         c = signedBigIntegerToUnsigned(new i.BigInteger(new Uint8Array(c)), 32)
         checkValidPublicValue(c)

         var f = computeK()

         var _u = new n.PasswordManager(srpParams.salt)
         var res = _u.computeX(srpParams.salt, srpParams.username, password, new n.PasswordVersion2(15000))
         console.log("res==>", res.toString())
         var x = new i.BigInteger(res.toString())

         var S = computeS(x, c, a, f, s)
         var M1 = computeM1(u, s, S)

         return {
             publicA: u.toString(16),
             clientEvidenceM1: M1.toString(16)
         }

     }

// 使用示例



// iwlhxbok@hotmail.com----Ab320032----   可以用这个账号登录
// cjuojflqwjl@hotmail.com----No590961----Xpnpxkj53
// ShawandayiAchenbachja@hotmail.com----Zj561197----KPBqzmb8588
// ehswarxzpgp@hotmail.com----Pn770800----df454150
// zoavlotwo@hotmail.com----Vt095014----fev709038
     return encrypt(srpParams, password);
 }
// 67a82f4c95697fe979ba4c8a43bf008214134ae02ad646b14536 ceb29ae63c1e98a830c013d9a00c1bf0c08208fdae1dc519759598b8332acce39e9ca238956f517993b6263fe3a7548cf589f02d373c5b85983e91df202422893f02770e138588fd04ed2ca120ff83e6152e1a2788dcb673a7a5107e4d107b996f968482aa9f771e4e269bed0b028474ee9a774959679e62538f1d7a2c677dcb292ccfaffeb5824273e7dc172b44a725a1273e35968d632c6983f73b514bfcddaf48069506dd137c9f81bfbb387c7a893a77467e8bf64e0ae6bb2cd1e9e49a4b8fdb4ed4361f90756921aa78088b125e1e94f5e077dddf68ac30b1dd9014873b92a5bb739fa2
// 8c1ea2884e57ce1cd0d3334edd6ecbca3acf9a1c5fc48ff9b1c143c6991e922c

 module.exports = {
     getdata
 };