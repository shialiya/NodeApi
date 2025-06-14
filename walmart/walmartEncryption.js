const CryptoJS = require("crypto-js");
const crypto = require('crypto');


var i = {
    cipher: {},
    hash: {},
    mode: {},
    misc: {},
    codec: {},
    exception: {
        corrupt: function(t) {
            this.toString = function() {
                return "CORRUPT: " + this.message
            }
                ,
                this.message = t
        },
        invalid: function(t) {
            this.toString = function() {
                return "INVALID: " + this.message
            }
                ,
                this.message = t
        },
        bug: function(t) {
            this.toString = function() {
                return "BUG: " + this.message
            }
                ,
                this.message = t
        }
    }
};
i.cipher.aes = function(t) {
    this._tables[0][0][0] || this._precompute();
    var r, n, e, o, a, s = this._tables[0][4], l = this._tables[1], h = t.length, u = 1;
    if (4 !== h && 6 !== h && 8 !== h)
        throw new i.exception.invalid("invalid aes key size");
    for (this._key = [o = t.slice(0), a = []],
             r = h; r < 4 * h + 28; r++)
        e = o[r - 1],
        (r % h === 0 || 8 === h && r % h === 4) && (e = s[e >>> 24] << 24 ^ s[e >> 16 & 255] << 16 ^ s[e >> 8 & 255] << 8 ^ s[255 & e],
        r % h === 0 && (e = e << 8 ^ e >>> 24 ^ u << 24,
            u = u << 1 ^ 283 * (u >> 7))),
            o[r] = o[r - h] ^ e;
    for (n = 0; r; n++,
        r--)
        e = o[3 & n ? r : r - 4],
            a[n] = r <= 4 || n < 4 ? e : l[0][s[e >>> 24]] ^ l[1][s[e >> 16 & 255]] ^ l[2][s[e >> 8 & 255]] ^ l[3][s[255 & e]]
}
    ,
    i.cipher.aes.prototype = {
        encrypt: function(t) {
            return this._crypt(t, 0)
        },
        decrypt: function(t) {
            return this._crypt(t, 1)
        },
        _tables: [[[], [], [], [], []], [[], [], [], [], []]],
        _precompute: function() {
            var t, r, n, e, o, i, a, s, l = this._tables[0], h = this._tables[1], u = l[4], c = h[4], f = [], g = [];
            for (t = 0; t < 256; t++)
                g[(f[t] = t << 1 ^ 283 * (t >> 7)) ^ t] = t;
            for (r = n = 0; !u[r]; r ^= 0 == e ? 1 : e,
                n = 0 == g[n] ? 1 : g[n])
                for (i = (i = n ^ n << 1 ^ n << 2 ^ n << 3 ^ n << 4) >> 8 ^ 255 & i ^ 99,
                         u[r] = i,
                         c[i] = r,
                         s = 16843009 * f[o = f[e = f[r]]] ^ 65537 * o ^ 257 * e ^ 16843008 * r,
                         a = 257 * f[i] ^ 16843008 * i,
                         t = 0; t < 4; t++)
                    l[t][r] = a = a << 24 ^ a >>> 8,
                        h[t][i] = s = s << 24 ^ s >>> 8;
            for (t = 0; t < 5; t++)
                l[t] = l[t].slice(0),
                    h[t] = h[t].slice(0)
        },
        _crypt: function(t, r) {
            if (4 !== t.length)
                throw new i.exception.invalid("invalid aes block size");
            var n, e, o, a, s = this._key[r], l = t[0] ^ s[0], h = t[r ? 3 : 1] ^ s[1], u = t[2] ^ s[2], c = t[r ? 1 : 3] ^ s[3], f = s.length / 4 - 2, g = 4, p = [0, 0, 0, 0], v = this._tables[r], b = v[0], d = v[1], y = v[2], m = v[3], E = v[4];
            for (a = 0; a < f; a++)
                n = b[l >>> 24] ^ d[h >> 16 & 255] ^ y[u >> 8 & 255] ^ m[255 & c] ^ s[g],
                    e = b[h >>> 24] ^ d[u >> 16 & 255] ^ y[c >> 8 & 255] ^ m[255 & l] ^ s[g + 1],
                    o = b[u >>> 24] ^ d[c >> 16 & 255] ^ y[l >> 8 & 255] ^ m[255 & h] ^ s[g + 2],
                    c = b[c >>> 24] ^ d[l >> 16 & 255] ^ y[h >> 8 & 255] ^ m[255 & u] ^ s[g + 3],
                    g += 4,
                    l = n,
                    h = e,
                    u = o;
            for (a = 0; a < 4; a++)
                p[r ? 3 & -a : a] = E[l >>> 24] << 24 ^ E[h >> 16 & 255] << 16 ^ E[u >> 8 & 255] << 8 ^ E[255 & c] ^ s[g++],
                    n = l,
                    l = h,
                    h = u,
                    u = c,
                    c = n;
            return p
        }
    };


var o = {};
o.base10 = "0123456789",
    o.base62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    o.luhn = function(t) {
        for (var r = t.length - 1, n = 0; r >= 0; )
            n += parseInt(t.substr(r, 1), 10),
                r -= 2;
        for (r = t.length - 2; r >= 0; ) {
            var e = 2 * parseInt(t.substr(r, 1), 10);
            n += e < 10 ? e : e - 9,
                r -= 2
        }
        return n % 10
    }
    ,
    o.fixluhn = function(t, r, n) {
        var e = o.luhn(t);
        return e < n ? e += 10 - n : e -= n,
            0 != e ? (e = (t.length - r) % 2 != 0 ? 10 - e : e % 2 == 0 ? 5 - e / 2 : (9 - e) / 2 + 5,
            t.substr(0, r) + e + t.substr(r + 1)) : t
    }
    ,
    o.distill = function(t) {
        for (var r = "", n = 0; n < t.length; ++n)
            o.base10.indexOf(t.charAt(n)) >= 0 && (r += t.substr(n, 1));
        return r
    }
    ,
    o.reformat = function(t, r) {
        for (var n = "", e = 0, i = 0; i < r.length; ++i)
            e < t.length && o.base10.indexOf(r.charAt(i)) >= 0 ? (n += t.substr(e, 1),
                ++e) : n += r.substr(i, 1);
        return n
    }
    ,
    o.integrity = function(t, r, n) {
        var e = String.fromCharCode(0) + String.fromCharCode(r.length) + r + String.fromCharCode(0) + String.fromCharCode(n.length) + n
            , o = a.HexToWords(t);
        o[3] ^= 1;
        var l = new i.cipher.aes(o)
            , h = s.compute(l, e);
        return a.WordToHex(h[0]) + a.WordToHex(h[1])
    }
;


s = {};
s.MSBnotZero = function(t) {
    return 2147483647 != (2147483647 | t)
}
    ,
    s.leftShift = function(t) {
        t[0] = (2147483647 & t[0]) << 1 | t[1] >>> 31,
            t[1] = (2147483647 & t[1]) << 1 | t[2] >>> 31,
            t[2] = (2147483647 & t[2]) << 1 | t[3] >>> 31,
            t[3] = (2147483647 & t[3]) << 1
    }
    ,
    s.const_Rb = 135,
    s.compute = function(t, r) {
        var n = [0, 0, 0, 0]
            , e = t.encrypt(n)
            , o = e[0];
        s.leftShift(e),
        s.MSBnotZero(o) && (e[3] ^= s.const_Rb);
        for (var i = 0; i < r.length; )
            n[i >> 2 & 3] ^= (255 & r.charCodeAt(i)) << 8 * (3 - (3 & i)),
            0 == (15 & ++i) && i < r.length && (n = t.encrypt(n));
        return 0 != i && 0 == (15 & i) || (o = e[0],
            s.leftShift(e),
        s.MSBnotZero(o) && (e[3] ^= s.const_Rb),
            n[i >> 2 & 3] ^= 128 << 8 * (3 - (3 & i))),
            n[0] ^= e[0],
            n[1] ^= e[1],
            n[2] ^= e[2],
            n[3] ^= e[3],
            t.encrypt(n)
    }
;

var l = {
    alphabet: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    precompF: function(t, r, n, e) {
        var o = new Array(4)
            , i = n.length;
        return o[0] = 16908544 | e >> 16 & 255,
            o[1] = (e >> 8 & 255) << 24 | (255 & e) << 16 | 2560 | 255 & Math.floor(r / 2),
            o[2] = r,
            o[3] = i,
            t.encrypt(o)
    },
    precompb: function(t, r) {
        for (var n = Math.ceil(r / 2), e = 0, o = 1; n > 0; )
            --n,
            (o *= t) >= 256 && (o /= 256,
                ++e);
        return o > 1 && ++e,
            e
    },
    bnMultiply: function(t, r, n) {
        var e, o = 0;
        for (e = t.length - 1; e >= 0; --e) {
            var i = t[e] * n + o;
            t[e] = i % r,
                o = (i - t[e]) / r
        }
    },
    bnAdd: function(t, r, n) {
        for (var e = t.length - 1, o = n; e >= 0 && o > 0; ) {
            var i = t[e] + o;
            t[e] = i % r,
                o = (i - t[e]) / r,
                --e
        }
    },
    convertRadix: function(t, r, n, e, o) {
        var i, a = new Array(e);
        for (i = 0; i < e; ++i)
            a[i] = 0;
        for (var s = 0; s < r; ++s)
            l.bnMultiply(a, o, n),
                l.bnAdd(a, o, t[s]);
        return a
    },
    cbcmacq: function(t, r, n, e) {
        for (var o = new Array(4), i = 0; i < 4; ++i)
            o[i] = t[i];
        for (var a = 0; 4 * a < n; ) {
            for (i = 0; i < 4; ++i)
                o[i] = o[i] ^ (r[4 * (a + i)] << 24 | r[4 * (a + i) + 1] << 16 | r[4 * (a + i) + 2] << 8 | r[4 * (a + i) + 3]);
            o = e.encrypt(o),
                a += 4
        }
        return o
    },
    F: function(t, r, n, e, o, i, a, s, h) {
        var u = Math.ceil(h / 4) + 1
            , c = n.length + h + 1 & 15;
        c > 0 && (c = 16 - c);
        var f, g = new Array(n.length + c + h + 1);
        for (f = 0; f < n.length; f++)
            g[f] = n.charCodeAt(f);
        for (; f < c + n.length; f++)
            g[f] = 0;
        g[g.length - h - 1] = r;
        for (var p = l.convertRadix(e, o, s, h, 256), v = 0; v < h; v++)
            g[g.length - h + v] = p[v];
        var b, d = l.cbcmacq(a, g, g.length, t), y = d, m = new Array(2 * u);
        for (f = 0; f < u; ++f)
            f > 0 && 0 == (3 & f) && (b = f >> 2 & 255,
                b |= b << 8 | b << 16 | b << 24,
                y = t.encrypt([d[0] ^ b, d[1] ^ b, d[2] ^ b, d[3] ^ b])),
                m[2 * f] = y[3 & f] >>> 16,
                m[2 * f + 1] = 65535 & y[3 & f];
        return l.convertRadix(m, 2 * u, 65536, i, s)
    },
    DigitToVal: function(t, r, n) {
        var e = new Array(r);
        if (256 == n) {
            for (var o = 0; o < r; o++)
                e[o] = t.charCodeAt(o);
            return e
        }
        for (var i = 0; i < r; i++) {
            var a = parseInt(t.charAt(i), n);
            if (NaN == a || !(a < n))
                return "";
            e[i] = a
        }
        return e
    },
    ValToDigit: function(t, r) {
        var n, e = "";
        if (256 == r)
            for (n = 0; n < t.length; n++)
                e += String.fromCharCode(t[n]);
        else
            for (n = 0; n < t.length; n++)
                e += l.alphabet[t[n]];
        return e
    },
    encryptWithCipher: function(t, r, n, e) {
        var o = t.length
            , i = Math.floor(o / 2)
            , a = l.precompF(n, o, r, e)
            , s = l.precompb(e, o)
            , h = l.DigitToVal(t, i, e)
            , u = l.DigitToVal(t.substr(i), o - i, e);
        if ("" == h || "" == u)
            return "";
        for (var c = 0; c < 5; c++) {
            var f, g = l.F(n, 2 * c, r, u, u.length, h.length, a, e, s);
            f = 0;
            for (var p = h.length - 1; p >= 0; --p) {
                (v = h[p] + g[p] + f) < e ? (h[p] = v,
                    f = 0) : (h[p] = v - e,
                    f = 1)
            }
            g = l.F(n, 2 * c + 1, r, h, h.length, u.length, a, e, s);
            f = 0;
            for (p = u.length - 1; p >= 0; --p) {
                var v;
                (v = u[p] + g[p] + f) < e ? (u[p] = v,
                    f = 0) : (u[p] = v - e,
                    f = 1)
            }
        }
        return l.ValToDigit(h, e) + l.ValToDigit(u, e)
    },
    encrypt: function(t, r, n, e) {
        var o = a.HexToKey(n);
        return null == o ? "" : l.encryptWithCipher(t, r, o, e)
    }
};


var a = {
    HexToKey: function(t) {
        return new i.cipher.aes(a.HexToWords(t))
    },
    HexToWords: function(t) {
        var r = new Array(4);
        if (32 != t.length)
            return null;
        for (var n = 0; n < 4; n++)
            r[n] = parseInt(t.substr(8 * n, 8), 16);
        return r
    },
    Hex: "0123456789abcdef",
    WordToHex: function(t) {
        for (var r = 32, n = ""; r > 0; )
            r -= 4,
                n += a.Hex.substr(t >>> r & 15, 1);
        return n
    }
}


// 主流程
const walmart = function(t, r,pieL,pieE,pieK) {
    var PIE = {};
    PIE.L = pieL;
    PIE.E = pieE;
    PIE.K = pieK;
    PIE.key_id = "e40b7381";
    PIE.phase = 0;
    var e = o.distill(t)
        , i = o.distill(r);
    var a = e.substr(0, PIE.L) + e.substring(e.length - PIE.E);
    var s = o.luhn(e)
        , h = e.substring(PIE.L + 1, e.length - PIE.E)
        , u = l.encrypt(h + i, a, PIE.K, 10)
        , c = e.substr(0, PIE.L) + "0" + u.substr(0, u.length - i.length) + e.substring(e.length - PIE.E);
    E = o.reformat(o.fixluhn(c, PIE.L, s), t)
    I = o.reformat(u.substring(u.length - i.length), r)
    AAA = o.integrity(PIE.K, E, I)
    // console.log(E);
    // console.log(I);
    // console.log(AAA);
    return {
        encryptedPan: E,
        encryptedCVV: I,
        integrityCheck: AAA
    };

    // console.log("加密成功");
}

module.exports = {
    walmart
};

// walmart("4134440003419123", "986", 6, 4, "11671AB47C7F1831FE7CB1451CF95893");
