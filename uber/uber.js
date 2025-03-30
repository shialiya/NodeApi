
navigator ={}
navigator.appName = 'Netscape'

window.addEventListener = function() {}
!function() {
    function Stream(enc, pos) {
        if (enc instanceof Stream) {
            this.enc = enc.enc;
            this.pos = enc.pos;
        } else {
            this.enc = enc;
            this.pos = pos;
        }
    }
    Stream.prototype.get = function(pos) {
        if (pos == undefined)
            pos = this.pos++;
        if (pos >= this.enc.length)
            throw 'Requesting byte offset ' + pos + ' on a stream of length ' + this.enc.length;
        return this.enc[pos];
    }
    Stream.prototype.hexDigits = "0123456789ABCDEF";
    Stream.prototype.hexByte = function(b) {
        return this.hexDigits.charAt((b >> 4) & 0xF) + this.hexDigits.charAt(b & 0xF);
    }
    Stream.prototype.hexDump = function(start, end) {
        var s = "";
        for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
            switch (i & 0xF) {
            case 0x7:
                s += "  ";
                break;
            case 0xF:
                s += "\n";
                break;
            default:
                s += " ";
            }
        }
        return s;
    }
    Stream.prototype.parseStringISO = function(start, end) {
        var s = "";
        for (var i = start; i < end; ++i)
            s += String.fromCharCode(this.get(i));
        return s;
    }
    Stream.prototype.parseStringUTF = function(start, end) {
        var s = ""
          , c = 0;
        for (var i = start; i < end; ) {
            var c = this.get(i++);
            if (c < 128)
                s += String.fromCharCode(c);
            else if ((c > 191) && (c < 224))
                s += String.fromCharCode(((c & 0x1F) << 6) | (this.get(i++) & 0x3F));
            else
                s += String.fromCharCode(((c & 0x0F) << 12) | ((this.get(i++) & 0x3F) << 6) | (this.get(i++) & 0x3F));
        }
        return s;
    }
    Stream.prototype.reTime = /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
    Stream.prototype.parseTime = function(start, end) {
        var s = this.parseStringISO(start, end);
        var m = this.reTime.exec(s);
        if (!m)
            return "Unrecognized time: " + s;
        s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
        if (m[5]) {
            s += ":" + m[5];
            if (m[6]) {
                s += ":" + m[6];
                if (m[7])
                    s += "." + m[7];
            }
        }
        if (m[8]) {
            s += " UTC";
            if (m[8] != 'Z') {
                s += m[8];
                if (m[9])
                    s += ":" + m[9];
            }
        }
        return s;
    }
    Stream.prototype.parseInteger = function(start, end) {
        var len = end - start;
        if (len > 4) {
            len <<= 3;
            var s = this.get(start);
            if (s == 0)
                len -= 8;
            else
                while (s < 128) {
                    s <<= 1;
                    --len;
                }
            return "(" + len + " bit)";
        }
        var n = 0;
        for (var i = start; i < end; ++i)
            n = (n << 8) | this.get(i);
        return n;
    }
    Stream.prototype.parseBitString = function(start, end) {
        var unusedBit = this.get(start);
        var lenBit = ((end - start - 1) << 3) - unusedBit;
        var s = "(" + lenBit + " bit)";
        if (lenBit <= 20) {
            var skip = unusedBit;
            s += " ";
            for (var i = end - 1; i > start; --i) {
                var b = this.get(i);
                for (var j = skip; j < 8; ++j)
                    s += (b >> j) & 1 ? "1" : "0";
                skip = 0;
            }
        }
        return s;
    }
    Stream.prototype.parseOctetString = function(start, end) {
        var len = end - start;
        var s = "(" + len + " byte) ";
        if (len > 20)
            end = start + 20;
        for (var i = start; i < end; ++i)
            s += this.hexByte(this.get(i));
        if (len > 20)
            s += String.fromCharCode(8230);
        return s;
    }
    Stream.prototype.parseOID = function(start, end) {
        var s, n = 0, bits = 0;
        for (var i = start; i < end; ++i) {
            var v = this.get(i);
            n = (n << 7) | (v & 0x7F);
            bits += 7;
            if (!(v & 0x80)) {
                if (s == undefined)
                    s = parseInt(n / 40) + "." + (n % 40);
                else
                    s += "." + ((bits >= 31) ? "bigint" : n);
                n = bits = 0;
            }
            s += String.fromCharCode();
        }
        return s;
    }
    function ASN1(stream, header, length, tag, sub) {
        this.stream = stream;
        this.header = header;
        this.length = length;
        this.tag = tag;
        this.sub = sub;
    }
    ASN1.prototype.typeName = function() {
        if (this.tag == undefined)
            return "unknown";
        var tagClass = this.tag >> 6;
        var tagConstructed = (this.tag >> 5) & 1;
        var tagNumber = this.tag & 0x1F;
        switch (tagClass) {
        case 0:
            switch (tagNumber) {
            case 0x00:
                return "EOC";
            case 0x01:
                return "BOOLEAN";
            case 0x02:
                return "INTEGER";
            case 0x03:
                return "BIT_STRING";
            case 0x04:
                return "OCTET_STRING";
            case 0x05:
                return "NULL";
            case 0x06:
                return "OBJECT_IDENTIFIER";
            case 0x07:
                return "ObjectDescriptor";
            case 0x08:
                return "EXTERNAL";
            case 0x09:
                return "REAL";
            case 0x0A:
                return "ENUMERATED";
            case 0x0B:
                return "EMBEDDED_PDV";
            case 0x0C:
                return "UTF8String";
            case 0x10:
                return "SEQUENCE";
            case 0x11:
                return "SET";
            case 0x12:
                return "NumericString";
            case 0x13:
                return "PrintableString";
            case 0x14:
                return "TeletexString";
            case 0x15:
                return "VideotexString";
            case 0x16:
                return "IA5String";
            case 0x17:
                return "UTCTime";
            case 0x18:
                return "GeneralizedTime";
            case 0x19:
                return "GraphicString";
            case 0x1A:
                return "VisibleString";
            case 0x1B:
                return "GeneralString";
            case 0x1C:
                return "UniversalString";
            case 0x1E:
                return "BMPString";
            default:
                return "Universal_" + tagNumber.toString(16);
            }
        case 1:
            return "Application_" + tagNumber.toString(16);
        case 2:
            return "[" + tagNumber + "]";
        case 3:
            return "Private_" + tagNumber.toString(16);
        }
    }
    ASN1.prototype.content = function() {
        if (this.tag == undefined)
            return null;
        var tagClass = this.tag >> 6;
        if (tagClass != 0)
            return (this.sub == null) ? null : "(" + this.sub.length + ")";
        var tagNumber = this.tag & 0x1F;
        var content = this.posContent();
        var len = Math.abs(this.length);
        switch (tagNumber) {
        case 0x01:
            return (this.stream.get(content) == 0) ? "false" : "true";
        case 0x02:
            return this.stream.parseInteger(content, content + len);
        case 0x03:
            return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(content, content + len)
        case 0x04:
            return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(content, content + len)
        case 0x06:
            return this.stream.parseOID(content, content + len);
        case 0x10:
        case 0x11:
            return "(" + this.sub.length + " elem)";
        case 0x0C:
            return this.stream.parseStringUTF(content, content + len);
        case 0x12:
        case 0x13:
        case 0x14:
        case 0x15:
        case 0x16:
        case 0x1A:
            return this.stream.parseStringISO(content, content + len);
        case 0x17:
        case 0x18:
            return this.stream.parseTime(content, content + len);
        }
        return null;
    }
    ASN1.prototype.toString = function() {
        return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + ((this.sub == null) ? 'null' : this.sub.length) + "]";
    }
    ASN1.prototype.print = function(indent) {
        if (indent == undefined)
            indent = '';
        document.writeln(indent + this);
        if (this.sub != null) {
            indent += '  ';
            for (var i = 0, max = this.sub.length; i < max; ++i)
                this.sub[i].print(indent);
        }
    }
    ASN1.prototype.toPrettyString = function(indent) {
        if (indent == undefined)
            indent = '';
        var s = indent + this.typeName() + " @" + this.stream.pos;
        if (this.length >= 0)
            s += "+";
        s += this.length;
        if (this.tag & 0x20)
            s += " (constructed)";
        else if (((this.tag == 0x03) || (this.tag == 0x04)) && (this.sub != null))
            s += " (encapsulates)";
        s += "\n";
        if (this.sub != null) {
            indent += '  ';
            for (var i = 0, max = this.sub.length; i < max; ++i)
                s += this.sub[i].toPrettyString(indent);
        }
        return s;
    }
    ASN1.prototype.posStart = function() {
        return this.stream.pos;
    }
    ASN1.prototype.posContent = function() {
        return this.stream.pos + this.header;
    }
    ASN1.prototype.posEnd = function() {
        return this.stream.pos + this.header + Math.abs(this.length);
    }
    ASN1.decodeLength = function(stream) {
        var buf = stream.get();
        var len = buf & 0x7F;
        if (len == buf)
            return len;
        if (len > 3)
            throw "Length over 24 bits not supported at position " + (stream.pos - 1);
        if (len == 0)
            return -1;
        buf = 0;
        for (var i = 0; i < len; ++i)
            buf = (buf << 8) | stream.get();
        return buf;
    }
    ASN1.hasContent = function(tag, len, stream) {
        if (tag & 0x20)
            return true;
        if ((tag < 0x03) || (tag > 0x04))
            return false;
        var p = new Stream(stream);
        if (tag == 0x03)
            p.get();
        var subTag = p.get();
        if ((subTag >> 6) & 0x01)
            return false;
        try {
            var subLength = ASN1.decodeLength(p);
            return ((p.pos - stream.pos) + subLength == len);
        } catch (exception) {
            return false;
        }
    }
    ASN1.decode = function(stream) {
        if (!(stream instanceof Stream))
            stream = new Stream(stream,0);
        var streamStart = new Stream(stream);
        var tag = stream.get();
        var len = ASN1.decodeLength(stream);
        var header = stream.pos - streamStart.pos;
        var sub = null;
        if (ASN1.hasContent(tag, len, stream)) {
            var start = stream.pos;
            if (tag == 0x03)
                stream.get();
            sub = [];
            if (len >= 0) {
                var end = start + len;
                while (stream.pos < end)
                    sub[sub.length] = ASN1.decode(stream);
                if (stream.pos != end)
                    throw "Content size is not correct for container starting at offset " + start;
            } else {
                try {
                    for (; ; ) {
                        var s = ASN1.decode(stream);
                        if (s.tag == 0)
                            break;
                        sub[sub.length] = s;
                    }
                    len = start - stream.pos;
                } catch (e) {
                    throw "Exception while decoding undefined length content: " + e;
                }
            }
        } else
            stream.pos += len;
        return new ASN1(streamStart,header,len,tag,sub);
    }
    var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var b64pad = "=";
    function hex2b64(h) {
        var i;
        var c;
        var ret = "";
        for (i = 0; i + 3 <= h.length; i += 3) {
            c = parseInt(h.substring(i, i + 3), 16);
            ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
        }
        if (i + 1 == h.length) {
            c = parseInt(h.substring(i, i + 1), 16);
            ret += b64map.charAt(c << 2);
        } else if (i + 2 == h.length) {
            c = parseInt(h.substring(i, i + 2), 16);
            ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
        }
        while ((ret.length & 3) > 0)
            ret += b64pad;
        return ret;
    }
    function b64tohex(s) {
        var ret = ""
        var i;
        var k = 0;
        var slop;
        for (i = 0; i < s.length; ++i) {
            if (s.charAt(i) == b64pad)
                break;
            v = b64map.indexOf(s.charAt(i));
            if (v < 0)
                continue;
            if (k == 0) {
                ret += int2char(v >> 2);
                slop = v & 3;
                k = 1;
            } else if (k == 1) {
                ret += int2char((slop << 2) | (v >> 4));
                slop = v & 0xf;
                k = 2;
            } else if (k == 2) {
                ret += int2char(slop);
                ret += int2char(v >> 2);
                slop = v & 3;
                k = 3;
            } else {
                ret += int2char((slop << 2) | (v >> 4));
                ret += int2char(v & 0xf);
                k = 0;
            }
        }
        if (k == 1)
            ret += int2char(slop << 2);
        return ret;
    }
    function b64toBA(s) {
        var h = b64tohex(s);
        var i;
        var a = new Array();
        for (i = 0; 2 * i < h.length; ++i) {
            a[i] = parseInt(h.substring(2 * i, 2 * i + 2), 16);
        }
        return a;
    }
    var dbits;
    var canary = 0xdeadbeefcafe;
    var j_lm = ((canary & 0xffffff) == 0xefcafe);
    function BigInteger(a, b, c) {
        if (a != null)
            if ("number" == typeof a)
                this.fromNumber(a, b, c);
            else if (b == null && "string" != typeof a)
                this.fromString(a, 256);
            else
                this.fromString(a, b);
    }
    function nbi() {
        return new BigInteger(null);
    }
    function am1(i, x, w, j, c, n) {
        while (--n >= 0) {
            var v = x * this[i++] + w[j] + c;
            c = Math.floor(v / 0x4000000);
            w[j++] = v & 0x3ffffff;
        }
        return c;
    }
    function am2(i, x, w, j, c, n) {
        var xl = x & 0x7fff
          , xh = x >> 15;
        while (--n >= 0) {
            var l = this[i] & 0x7fff;
            var h = this[i++] >> 15;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
            c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
            w[j++] = l & 0x3fffffff;
        }
        return c;
    }
    function am3(i, x, w, j, c, n) {
        var xl = x & 0x3fff
          , xh = x >> 14;
        while (--n >= 0) {
            var l = this[i] & 0x3fff;
            var h = this[i++] >> 14;
            var m = xh * l + h * xl;
            l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
            c = (l >> 28) + (m >> 14) + xh * h;
            w[j++] = l & 0xfffffff;
        }
        return c;
    }
    if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
        BigInteger.prototype.am = am2;
        dbits = 30;
    } else if (j_lm && (navigator.appName != "Netscape")) {
        BigInteger.prototype.am = am1;
        dbits = 26;
    } else {
        BigInteger.prototype.am = am3;
        dbits = 28;
    }
    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = ((1 << dbits) - 1);
    BigInteger.prototype.DV = (1 << dbits);
    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2, BI_FP);
    BigInteger.prototype.F1 = BI_FP - dbits;
    BigInteger.prototype.F2 = 2 * dbits - BI_FP;
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr, vv;
    rr = "0".charCodeAt(0);
    for (vv = 0; vv <= 9; ++vv)
        BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv)
        BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for (vv = 10; vv < 36; ++vv)
        BI_RC[rr++] = vv;
    function int2char(n) {
        return BI_RM.charAt(n);
    }
    function intAt(s, i) {
        var c = BI_RC[s.charCodeAt(i)];
        return (c == null) ? -1 : c;
    }
    function bnpCopyTo(r) {
        for (var i = this.t - 1; i >= 0; --i)
            r[i] = this[i];
        r.t = this.t;
        r.s = this.s;
    }
    function bnpFromInt(x) {
        this.t = 1;
        this.s = (x < 0) ? -1 : 0;
        if (x > 0)
            this[0] = x;
        else if (x < -1)
            this[0] = x + DV;
        else
            this.t = 0;
    }
    function nbv(i) {
        var r = nbi();
        r.fromInt(i);
        return r;
    }
    function bnpFromString(s, b) {
        var k;
        if (b == 16)
            k = 4;
        else if (b == 8)
            k = 3;
        else if (b == 256)
            k = 8;
        else if (b == 2)
            k = 1;
        else if (b == 32)
            k = 5;
        else if (b == 4)
            k = 2;
        else {
            this.fromRadix(s, b);
            return;
        }
        this.t = 0;
        this.s = 0;
        var i = s.length
          , mi = false
          , sh = 0;
        while (--i >= 0) {
            var x = (k == 8) ? s[i] & 0xff : intAt(s, i);
            if (x < 0) {
                if (s.charAt(i) == "-")
                    mi = true;
                continue;
            }
            mi = false;
            if (sh == 0)
                this[this.t++] = x;
            else if (sh + k > this.DB) {
                this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
                this[this.t++] = (x >> (this.DB - sh));
            } else
                this[this.t - 1] |= x << sh;
            sh += k;
            if (sh >= this.DB)
                sh -= this.DB;
        }
        if (k == 8 && (s[0] & 0x80) != 0) {
            this.s = -1;
            if (sh > 0)
                this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
        }
        this.clamp();
        if (mi)
            BigInteger.ZERO.subTo(this, this);
    }
    function bnpClamp() {
        var c = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == c)
            --this.t;
    }
    function bnToString(b) {
        if (this.s < 0)
            return "-" + this.negate().toString(b);
        var k;
        if (b == 16)
            k = 4;
        else if (b == 8)
            k = 3;
        else if (b == 2)
            k = 1;
        else if (b == 32)
            k = 5;
        else if (b == 4)
            k = 2;
        else
            return this.toRadix(b);
        var km = (1 << k) - 1, d, m = false, r = "", i = this.t;
        var p = this.DB - (i * this.DB) % k;
        if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) > 0) {
                m = true;
                r = int2char(d);
            }
            while (i >= 0) {
                if (p < k) {
                    d = (this[i] & ((1 << p) - 1)) << (k - p);
                    d |= this[--i] >> (p += this.DB - k);
                } else {
                    d = (this[i] >> (p -= k)) & km;
                    if (p <= 0) {
                        p += this.DB;
                        --i;
                    }
                }
                if (d > 0)
                    m = true;
                if (m)
                    r += int2char(d);
            }
        }
        return m ? r : "0";
    }
    function bnNegate() {
        var r = nbi();
        BigInteger.ZERO.subTo(this, r);
        return r;
    }
    function bnAbs() {
        return (this.s < 0) ? this.negate() : this;
    }
    function bnCompareTo(a) {
        var r = this.s - a.s;
        if (r != 0)
            return r;
        var i = this.t;
        r = i - a.t;
        if (r != 0)
            return (this.s < 0) ? -r : r;
        while (--i >= 0)
            if ((r = this[i] - a[i]) != 0)
                return r;
        return 0;
    }
    function nbits(x) {
        var r = 1, t;
        if ((t = x >>> 16) != 0) {
            x = t;
            r += 16;
        }
        if ((t = x >> 8) != 0) {
            x = t;
            r += 8;
        }
        if ((t = x >> 4) != 0) {
            x = t;
            r += 4;
        }
        if ((t = x >> 2) != 0) {
            x = t;
            r += 2;
        }
        if ((t = x >> 1) != 0) {
            x = t;
            r += 1;
        }
        return r;
    }
    function bnBitLength() {
        if (this.t <= 0)
            return 0;
        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM));
    }
    function bnpDLShiftTo(n, r) {
        var i;
        for (i = this.t - 1; i >= 0; --i)
            r[i + n] = this[i];
        for (i = n - 1; i >= 0; --i)
            r[i] = 0;
        r.t = this.t + n;
        r.s = this.s;
    }
    function bnpDRShiftTo(n, r) {
        for (var i = n; i < this.t; ++i)
            r[i - n] = this[i];
        r.t = Math.max(this.t - n, 0);
        r.s = this.s;
    }
    function bnpLShiftTo(n, r) {
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << cbs) - 1;
        var ds = Math.floor(n / this.DB), c = (this.s << bs) & this.DM, i;
        for (i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = (this[i] >> cbs) | c;
            c = (this[i] & bm) << bs;
        }
        for (i = ds - 1; i >= 0; --i)
            r[i] = 0;
        r[ds] = c;
        r.t = this.t + ds + 1;
        r.s = this.s;
        r.clamp();
    }
    function bnpRShiftTo(n, r) {
        r.s = this.s;
        var ds = Math.floor(n / this.DB);
        if (ds >= this.t) {
            r.t = 0;
            return;
        }
        var bs = n % this.DB;
        var cbs = this.DB - bs;
        var bm = (1 << bs) - 1;
        r[0] = this[ds] >> bs;
        for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
        }
        if (bs > 0)
            r[this.t - ds - 1] |= (this.s & bm) << cbs;
        r.t = this.t - ds;
        r.clamp();
    }
    function bnpSubTo(a, r) {
        var i = 0
          , c = 0
          , m = Math.min(a.t, this.t);
        while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
        }
        if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
                c += this[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c += this.s;
        } else {
            c += this.s;
            while (i < a.t) {
                c -= a[i];
                r[i++] = c & this.DM;
                c >>= this.DB;
            }
            c -= a.s;
        }
        r.s = (c < 0) ? -1 : 0;
        if (c < -1)
            r[i++] = this.DV + c;
        else if (c > 0)
            r[i++] = c;
        r.t = i;
        r.clamp();
    }
    function bnpMultiplyTo(a, r) {
        var x = this.abs()
          , y = a.abs();
        var i = x.t;
        r.t = i + y.t;
        while (--i >= 0)
            r[i] = 0;
        for (i = 0; i < y.t; ++i)
            r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
        r.s = 0;
        r.clamp();
        if (this.s != a.s)
            BigInteger.ZERO.subTo(r, r);
    }
    function bnpSquareTo(r) {
        var x = this.abs();
        var i = r.t = 2 * x.t;
        while (--i >= 0)
            r[i] = 0;
        for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
                r[i + x.t] -= x.DV;
                r[i + x.t + 1] = 1;
            }
        }
        if (r.t > 0)
            r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
        r.s = 0;
        r.clamp();
    }
    function bnpDivRemTo(m, q, r) {
        var pm = m.abs();
        if (pm.t <= 0)
            return;
        var pt = this.abs();
        if (pt.t < pm.t) {
            if (q != null)
                q.fromInt(0);
            if (r != null)
                this.copyTo(r);
            return;
        }
        if (r == null)
            r = nbi();
        var y = nbi()
          , ts = this.s
          , ms = m.s;
        var nsh = this.DB - nbits(pm[pm.t - 1]);
        if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
        } else {
            pm.copyTo(y);
            pt.copyTo(r);
        }
        var ys = y.t;
        var y0 = y[ys - 1];
        if (y0 == 0)
            return;
        var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
        var d1 = this.FV / yt
          , d2 = (1 << this.F1) / yt
          , e = 1 << this.F2;
        var i = r.t
          , j = i - ys
          , t = (q == null) ? nbi() : q;
        y.dlShiftTo(j, t);
        if (r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t, r);
        }
        BigInteger.ONE.dlShiftTo(ys, t);
        t.subTo(y, y);
        while (y.t < ys)
            y[y.t++] = 0;
        while (--j >= 0) {
            var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
                y.dlShiftTo(j, t);
                r.subTo(t, r);
                while (r[i] < --qd)
                    r.subTo(t, r);
            }
        }
        if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms)
                BigInteger.ZERO.subTo(q, q);
        }
        r.t = ys;
        r.clamp();
        if (nsh > 0)
            r.rShiftTo(nsh, r);
        if (ts < 0)
            BigInteger.ZERO.subTo(r, r);
    }
    function bnMod(a) {
        var r = nbi();
        this.abs().divRemTo(a, null, r);
        if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
            a.subTo(r, r);
        return r;
    }
    function Classic(m) {
        this.m = m;
    }
    function cConvert(x) {
        if (x.s < 0 || x.compareTo(this.m) >= 0)
            return x.mod(this.m);
        else
            return x;
    }
    function cRevert(x) {
        return x;
    }
    function cReduce(x) {
        x.divRemTo(this.m, null, x);
    }
    function cMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    }
    function cSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
    }
    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;
    function bnpInvDigit() {
        if (this.t < 1)
            return 0;
        var x = this[0];
        if ((x & 1) == 0)
            return 0;
        var y = x & 3;
        y = (y * (2 - (x & 0xf) * y)) & 0xf;
        y = (y * (2 - (x & 0xff) * y)) & 0xff;
        y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff;
        y = (y * (2 - x * y % this.DV)) % this.DV;
        return (y > 0) ? this.DV - y : -y;
    }
    function Montgomery(m) {
        this.m = m;
        this.mp = m.invDigit();
        this.mpl = this.mp & 0x7fff;
        this.mph = this.mp >> 15;
        this.um = (1 << (m.DB - 15)) - 1;
        this.mt2 = 2 * m.t;
    }
    function montConvert(x) {
        var r = nbi();
        x.abs().dlShiftTo(this.m.t, r);
        r.divRemTo(this.m, null, r);
        if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
            this.m.subTo(r, r);
        return r;
    }
    function montRevert(x) {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r;
    }
    function montReduce(x) {
        while (x.t <= this.mt2)
            x[x.t++] = 0;
        for (var i = 0; i < this.m.t; ++i) {
            var j = x[i] & 0x7fff;
            var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            while (x[j] >= x.DV) {
                x[j] -= x.DV;
                x[++j]++;
            }
        }
        x.clamp();
        x.drShiftTo(this.m.t, x);
        if (x.compareTo(this.m) >= 0)
            x.subTo(this.m, x);
    }
    function montSqrTo(x, r) {
        x.squareTo(r);
        this.reduce(r);
    }
    function montMulTo(x, y, r) {
        x.multiplyTo(y, r);
        this.reduce(r);
    }
    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;
    function bnpIsEven() {
        return ((this.t > 0) ? (this[0] & 1) : this.s) == 0;
    }
    function bnpExp(e, z) {
        if (e > 0xffffffff || e < 1)
            return BigInteger.ONE;
        var r = nbi()
          , r2 = nbi()
          , g = z.convert(this)
          , i = nbits(e) - 1;
        g.copyTo(r);
        while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & (1 << i)) > 0)
                z.mulTo(r2, g, r);
            else {
                var t = r;
                r = r2;
                r2 = t;
            }
        }
        return z.revert(r);
    }
    function bnModPowInt(e, m) {
        var z;
        if (e < 256 || m.isEven())
            z = new Classic(m);
        else
            z = new Montgomery(m);
        return this.exp(e, z);
    }
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.exp = bnpExp;
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);
    function parseBigInt(str, r) {
        return new BigInteger(str,r);
    }
    function linebrk(s, n) {
        var ret = "";
        var i = 0;
        while (i + n < s.length) {
            ret += s.substring(i, i + n) + "\n";
            i += n;
        }
        return ret + s.substring(i, s.length);
    }
    function byte2Hex(b) {
        if (b < 0x10)
            return "0" + b.toString(16);
        else
            return b.toString(16);
    }
    function pkcs1pad2(s, n) {
        if (n < s.length + 11) {
            alert("Message too long for RSA");
            return null;
        }
        var ba = new Array();
        var i = s.length - 1;
        while (i >= 0 && n > 0) {
            var c = s.charCodeAt(i--);
            if (c < 128) {
                ba[--n] = c;
            } else if ((c > 127) && (c < 2048)) {
                ba[--n] = (c & 63) | 128;
                ba[--n] = (c >> 6) | 192;
            } else {
                ba[--n] = (c & 63) | 128;
                ba[--n] = ((c >> 6) & 63) | 128;
                ba[--n] = (c >> 12) | 224;
            }
        }
        ba[--n] = 0;
        var randomByte = 0;
        var random = 0;
        var shift = 0;
        while (n > 2) {
            if (shift == 0) {
                random = sjcl.random.randomWords(1, 0)[0];
            }
            randomByte = (random >> shift) & 0xff;
            shift = (shift + 8) % 32;
            if (randomByte != 0) {
                ba[--n] = randomByte;
            }
        }
        ba[--n] = 2;
        ba[--n] = 0;
        return new BigInteger(ba);
    }
    function RSAKey() {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null;
    }
    function RSASetPublic(N, E) {
        if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
        } else
            alert("Invalid RSA public key");
    }
    function RSADoPublic(x) {
        return x.modPowInt(this.e, this.n);
    }
    function RSAEncrypt(text) {
        var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
        if (m == null)
            return null;
        var c = this.doPublic(m);
        if (c == null)
            return null;
        var h = c.toString(16);
        if ((h.length & 1) == 0)
            return h;
        else
            return "0" + h;
    }
    function RSAEncryptB64(text) {
        var h = this.encrypt(text);
        if (h)
            return hex2b64(h);
        else
            return null;
    }
    RSAKey.prototype.doPublic = RSADoPublic;
    RSAKey.prototype.setPublic = RSASetPublic;
    RSAKey.prototype.encrypt = RSAEncrypt;
    RSAKey.prototype.encrypt_b64 = RSAEncryptB64;
    "use strict";
    var sjcl = {
        cipher: {},
        hash: {},
        keyexchange: {},
        mode: {},
        misc: {},
        codec: {},
        exception: {
            corrupt: function(message) {
                this.toString = function() {
                    return "CORRUPT: " + this.message;
                }
                ;
                this.message = message;
            },
            invalid: function(message) {
                this.toString = function() {
                    return "INVALID: " + this.message;
                }
                ;
                this.message = message;
            },
            bug: function(message) {
                this.toString = function() {
                    return "BUG: " + this.message;
                }
                ;
                this.message = message;
            },
            notReady: function(message) {
                this.toString = function() {
                    return "NOT READY: " + this.message;
                }
                ;
                this.message = message;
            }
        }
    };
    if (typeof module != 'undefined' && module.exports) {
        module.exports = sjcl;
    }
    sjcl.cipher.aes = function(key) {
        if (!this._tables[0][0][0]) {
            this._precompute();
        }
        var i, j, tmp, encKey, decKey, sbox = this._tables[0][4], decTable = this._tables[1], keyLen = key.length, rcon = 1;
        if (keyLen !== 4 && keyLen !== 6 && keyLen !== 8) {
            throw new sjcl.exception.invalid("invalid aes key size");
        }
        this._key = [encKey = key.slice(0), decKey = []];
        for (i = keyLen; i < 4 * keyLen + 28; i++) {
            tmp = encKey[i - 1];
            if (i % keyLen === 0 || (keyLen === 8 && i % keyLen === 4)) {
                tmp = sbox[tmp >>> 24] << 24 ^ sbox[tmp >> 16 & 255] << 16 ^ sbox[tmp >> 8 & 255] << 8 ^ sbox[tmp & 255];
                if (i % keyLen === 0) {
                    tmp = tmp << 8 ^ tmp >>> 24 ^ rcon << 24;
                    rcon = rcon << 1 ^ (rcon >> 7) * 283;
                }
            }
            encKey[i] = encKey[i - keyLen] ^ tmp;
        }
        for (j = 0; i; j++,
        i--) {
            tmp = encKey[j & 3 ? i : i - 4];
            if (i <= 4 || j < 4) {
                decKey[j] = tmp;
            } else {
                decKey[j] = decTable[0][sbox[tmp >>> 24]] ^ decTable[1][sbox[tmp >> 16 & 255]] ^ decTable[2][sbox[tmp >> 8 & 255]] ^ decTable[3][sbox[tmp & 255]];
            }
        }
    }
    ;
    sjcl.cipher.aes.prototype = {
        encrypt: function(data) {
            return this._crypt(data, 0);
        },
        decrypt: function(data) {
            return this._crypt(data, 1);
        },
        _tables: [[[], [], [], [], []], [[], [], [], [], []]],
        _precompute: function() {
            var encTable = this._tables[0], decTable = this._tables[1], sbox = encTable[4], sboxInv = decTable[4], i, x, xInv, d = [], th = [], x2, x4, x8, s, tEnc, tDec;
            for (i = 0; i < 256; i++) {
                th[(d[i] = i << 1 ^ (i >> 7) * 283) ^ i] = i;
            }
            for (x = xInv = 0; !sbox[x]; x ^= x2 || 1,
            xInv = th[xInv] || 1) {
                s = xInv ^ xInv << 1 ^ xInv << 2 ^ xInv << 3 ^ xInv << 4;
                s = s >> 8 ^ s & 255 ^ 99;
                sbox[x] = s;
                sboxInv[s] = x;
                x8 = d[x4 = d[x2 = d[x]]];
                tDec = x8 * 0x1010101 ^ x4 * 0x10001 ^ x2 * 0x101 ^ x * 0x1010100;
                tEnc = d[s] * 0x101 ^ s * 0x1010100;
                for (i = 0; i < 4; i++) {
                    encTable[i][x] = tEnc = tEnc << 24 ^ tEnc >>> 8;
                    decTable[i][s] = tDec = tDec << 24 ^ tDec >>> 8;
                }
            }
            for (i = 0; i < 5; i++) {
                encTable[i] = encTable[i].slice(0);
                decTable[i] = decTable[i].slice(0);
            }
        },
        _crypt: function(input, dir) {
            if (input.length !== 4) {
                throw new sjcl.exception.invalid("invalid aes block size");
            }
            var key = this._key[dir], a = input[0] ^ key[0], b = input[dir ? 3 : 1] ^ key[1], c = input[2] ^ key[2], d = input[dir ? 1 : 3] ^ key[3], a2, b2, c2, nInnerRounds = key.length / 4 - 2, i, kIndex = 4, out = [0, 0, 0, 0], table = this._tables[dir], t0 = table[0], t1 = table[1], t2 = table[2], t3 = table[3], sbox = table[4];
            for (i = 0; i < nInnerRounds; i++) {
                a2 = t0[a >>> 24] ^ t1[b >> 16 & 255] ^ t2[c >> 8 & 255] ^ t3[d & 255] ^ key[kIndex];
                b2 = t0[b >>> 24] ^ t1[c >> 16 & 255] ^ t2[d >> 8 & 255] ^ t3[a & 255] ^ key[kIndex + 1];
                c2 = t0[c >>> 24] ^ t1[d >> 16 & 255] ^ t2[a >> 8 & 255] ^ t3[b & 255] ^ key[kIndex + 2];
                d = t0[d >>> 24] ^ t1[a >> 16 & 255] ^ t2[b >> 8 & 255] ^ t3[c & 255] ^ key[kIndex + 3];
                kIndex += 4;
                a = a2;
                b = b2;
                c = c2;
            }
            for (i = 0; i < 4; i++) {
                out[dir ? 3 & -i : i] = sbox[a >>> 24] << 24 ^ sbox[b >> 16 & 255] << 16 ^ sbox[c >> 8 & 255] << 8 ^ sbox[d & 255] ^ key[kIndex++];
                a2 = a;
                a = b;
                b = c;
                c = d;
                d = a2;
            }
            return out;
        }
    };
    sjcl.bitArray = {
        bitSlice: function(a, bstart, bend) {
            a = sjcl.bitArray._shiftRight(a.slice(bstart / 32), 32 - (bstart & 31)).slice(1);
            return (bend === undefined) ? a : sjcl.bitArray.clamp(a, bend - bstart);
        },
        extract: function(a, bstart, blength) {
            var x, sh = Math.floor((-bstart - blength) & 31);
            if ((bstart + blength - 1 ^ bstart) & -32) {
                x = (a[bstart / 32 | 0] << (32 - sh)) ^ (a[bstart / 32 + 1 | 0] >>> sh);
            } else {
                x = a[bstart / 32 | 0] >>> sh;
            }
            return x & ((1 << blength) - 1);
        },
        concat: function(a1, a2) {
            if (a1.length === 0 || a2.length === 0) {
                return a1.concat(a2);
            }
            var out, i, last = a1[a1.length - 1], shift = sjcl.bitArray.getPartial(last);
            if (shift === 32) {
                return a1.concat(a2);
            } else {
                return sjcl.bitArray._shiftRight(a2, shift, last | 0, a1.slice(0, a1.length - 1));
            }
        },
        bitLength: function(a) {
            var l = a.length, x;
            if (l === 0) {
                return 0;
            }
            x = a[l - 1];
            return (l - 1) * 32 + sjcl.bitArray.getPartial(x);
        },
        clamp: function(a, len) {
            if (a.length * 32 < len) {
                return a;
            }
            a = a.slice(0, Math.ceil(len / 32));
            var l = a.length;
            len = len & 31;
            if (l > 0 && len) {
                a[l - 1] = sjcl.bitArray.partial(len, a[l - 1] & 0x80000000 >> (len - 1), 1);
            }
            return a;
        },
        partial: function(len, x, _end) {
            if (len === 32) {
                return x;
            }
            return (_end ? x | 0 : x << (32 - len)) + len * 0x10000000000;
        },
        getPartial: function(x) {
            return Math.round(x / 0x10000000000) || 32;
        },
        equal: function(a, b) {
            if (sjcl.bitArray.bitLength(a) !== sjcl.bitArray.bitLength(b)) {
                return false;
            }
            var x = 0, i;
            for (i = 0; i < a.length; i++) {
                x |= a[i] ^ b[i];
            }
            return (x === 0);
        },
        _shiftRight: function(a, shift, carry, out) {
            var i, last2 = 0, shift2;
            if (out === undefined) {
                out = [];
            }
            for (; shift >= 32; shift -= 32) {
                out.push(carry);
                carry = 0;
            }
            if (shift === 0) {
                return out.concat(a);
            }
            for (i = 0; i < a.length; i++) {
                out.push(carry | a[i] >>> shift);
                carry = a[i] << (32 - shift);
            }
            last2 = a.length ? a[a.length - 1] : 0;
            shift2 = sjcl.bitArray.getPartial(last2);
            out.push(sjcl.bitArray.partial(shift + shift2 & 31, (shift + shift2 > 32) ? carry : out.pop(), 1));
            return out;
        },
        _xor4: function(x, y) {
            return [x[0] ^ y[0], x[1] ^ y[1], x[2] ^ y[2], x[3] ^ y[3]];
        }
    };
    sjcl.codec.hex = {
        fromBits: function(arr) {
            var out = "", i, x;
            for (i = 0; i < arr.length; i++) {
                out += ((arr[i] | 0) + 0xF00000000000).toString(16).substr(4);
            }
            return out.substr(0, sjcl.bitArray.bitLength(arr) / 4);
        },
        toBits: function(str) {
            var i, out = [], len;
            str = str.replace(/\s|0x/g, "");
            len = str.length;
            str = str + "00000000";
            for (i = 0; i < str.length; i += 8) {
                out.push(parseInt(str.substr(i, 8), 16) ^ 0);
            }
            return sjcl.bitArray.clamp(out, len * 4);
        }
    };
    sjcl.codec.utf8String = {
        fromBits: function(arr) {
            var out = "", bl = sjcl.bitArray.bitLength(arr), i, tmp;
            for (i = 0; i < bl / 8; i++) {
                if ((i & 3) === 0) {
                    tmp = arr[i / 4];
                }
                out += String.fromCharCode(tmp >>> 24);
                tmp <<= 8;
            }
            return decodeURIComponent(escape(out));
        },
        toBits: function(str) {
            str = unescape(encodeURIComponent(str));
            var out = [], i, tmp = 0;
            for (i = 0; i < str.length; i++) {
                tmp = tmp << 8 | str.charCodeAt(i);
                if ((i & 3) === 3) {
                    out.push(tmp);
                    tmp = 0;
                }
            }
            if (i & 3) {
                out.push(sjcl.bitArray.partial(8 * (i & 3), tmp));
            }
            return out;
        }
    };
    sjcl.codec.base64 = {
        _chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        fromBits: function(arr, _noEquals, _url) {
            var out = "", i, bits = 0, c = sjcl.codec.base64._chars, ta = 0, bl = sjcl.bitArray.bitLength(arr);
            if (_url)
                c = c.substr(0, 62) + '-_';
            for (i = 0; out.length * 6 < bl; ) {
                out += c.charAt((ta ^ arr[i] >>> bits) >>> 26);
                if (bits < 6) {
                    ta = arr[i] << (6 - bits);
                    bits += 26;
                    i++;
                } else {
                    ta <<= 6;
                    bits -= 6;
                }
            }
            while ((out.length & 3) && !_noEquals) {
                out += "=";
            }
            return out;
        },
        toBits: function(str, _url) {
            str = str.replace(/\s|=/g, '');
            var out = [], i, bits = 0, c = sjcl.codec.base64._chars, ta = 0, x;
            if (_url)
                c = c.substr(0, 62) + '-_';
            for (i = 0; i < str.length; i++) {
                x = c.indexOf(str.charAt(i));
                if (x < 0) {
                    throw new sjcl.exception.invalid("this isn't base64!");
                }
                if (bits > 26) {
                    bits -= 26;
                    out.push(ta ^ x >>> bits);
                    ta = x << (32 - bits);
                } else {
                    bits += 6;
                    ta ^= x << (32 - bits);
                }
            }
            if (bits & 56) {
                out.push(sjcl.bitArray.partial(bits & 56, ta, 1));
            }
            return out;
        }
    };
    sjcl.codec.base64url = {
        fromBits: function(arr) {
            return sjcl.codec.base64.fromBits(arr, 1, 1);
        },
        toBits: function(str) {
            return sjcl.codec.base64.toBits(str, 1);
        }
    };
    if (sjcl.beware === undefined) {
        sjcl.beware = {};
    }
    sjcl.beware["CBC mode is dangerous because it doesn't protect message integrity."] = function() {
        sjcl.mode.cbc = {
            name: "cbc",
            encrypt: function(prp, plaintext, iv, adata) {
                if (adata && adata.length) {
                    throw new sjcl.exception.invalid("cbc can't authenticate data");
                }
                if (sjcl.bitArray.bitLength(iv) !== 128) {
                    throw new sjcl.exception.invalid("cbc iv must be 128 bits");
                }
                var i, w = sjcl.bitArray, xor = w._xor4, bl = w.bitLength(plaintext), bp = 0, output = [];
                if (bl & 7) {
                    throw new sjcl.exception.invalid("pkcs#5 padding only works for multiples of a byte");
                }
                for (i = 0; bp + 128 <= bl; i += 4,
                bp += 128) {
                    iv = prp.encrypt(xor(iv, plaintext.slice(i, i + 4)));
                    output.splice(i, 0, iv[0], iv[1], iv[2], iv[3]);
                }
                bl = (16 - ((bl >> 3) & 15)) * 0x1010101;
                iv = prp.encrypt(xor(iv, w.concat(plaintext, [bl, bl, bl, bl]).slice(i, i + 4)));
                output.splice(i, 0, iv[0], iv[1], iv[2], iv[3]);
                return output;
            },
            decrypt: function(prp, ciphertext, iv, adata) {
                if (adata && adata.length) {
                    throw new sjcl.exception.invalid("cbc can't authenticate data");
                }
                if (sjcl.bitArray.bitLength(iv) !== 128) {
                    throw new sjcl.exception.invalid("cbc iv must be 128 bits");
                }
                if ((sjcl.bitArray.bitLength(ciphertext) & 127) || !ciphertext.length) {
                    throw new sjcl.exception.corrupt("cbc ciphertext must be a positive multiple of the block size");
                }
                var i, w = sjcl.bitArray, xor = w._xor4, bi, bo, output = [];
                adata = adata || [];
                for (i = 0; i < ciphertext.length; i += 4) {
                    bi = ciphertext.slice(i, i + 4);
                    bo = xor(iv, prp.decrypt(bi));
                    output.splice(i, 0, bo[0], bo[1], bo[2], bo[3]);
                    iv = bi;
                }
                bi = output[i - 1] & 255;
                if (bi == 0 || bi > 16) {
                    throw new sjcl.exception.corrupt("pkcs#5 padding corrupt");
                }
                bo = bi * 0x1010101;
                if (!w.equal(w.bitSlice([bo, bo, bo, bo], 0, bi * 8), w.bitSlice(output, output.length * 32 - bi * 8, output.length * 32))) {
                    throw new sjcl.exception.corrupt("pkcs#5 padding corrupt");
                }
                return w.bitSlice(output, 0, output.length * 32 - bi * 8);
            }
        };
    }
    ;
    sjcl.misc.hmac = function(key, Hash) {
        this._hash = Hash = Hash || sjcl.hash.sha256;
        var exKey = [[], []], i, bs = Hash.prototype.blockSize / 32;
        this._baseHash = [new Hash(), new Hash()];
        if (key.length > bs) {
            key = Hash.hash(key);
        }
        for (i = 0; i < bs; i++) {
            exKey[0][i] = key[i] ^ 0x36363636;
            exKey[1][i] = key[i] ^ 0x5C5C5C5C;
        }
        this._baseHash[0].update(exKey[0]);
        this._baseHash[1].update(exKey[1]);
    }
    ;
    sjcl.misc.hmac.prototype.encrypt = sjcl.misc.hmac.prototype.mac = function(data, encoding) {
        var w = new (this._hash)(this._baseHash[0]).update(data, encoding).finalize();
        return new (this._hash)(this._baseHash[1]).update(w).finalize();
    }
    ;
    sjcl.hash.sha256 = function(hash) {
        if (!this._key[0]) {
            this._precompute();
        }
        if (hash) {
            this._h = hash._h.slice(0);
            this._buffer = hash._buffer.slice(0);
            this._length = hash._length;
        } else {
            this.reset();
        }
    }
    ;
    sjcl.hash.sha256.hash = function(data) {
        return (new sjcl.hash.sha256()).update(data).finalize();
    }
    ;
    sjcl.hash.sha256.prototype = {
        blockSize: 512,
        reset: function() {
            this._h = this._init.slice(0);
            this._buffer = [];
            this._length = 0;
            return this;
        },
        update: function(data) {
            if (typeof data === "string") {
                data = sjcl.codec.utf8String.toBits(data);
            }
            var i, b = this._buffer = sjcl.bitArray.concat(this._buffer, data), ol = this._length, nl = this._length = ol + sjcl.bitArray.bitLength(data);
            for (i = 512 + ol & -512; i <= nl; i += 512) {
                this._block(b.splice(0, 16));
            }
            return this;
        },
        finalize: function() {
            var i, b = this._buffer, h = this._h;
            b = sjcl.bitArray.concat(b, [sjcl.bitArray.partial(1, 1)]);
            for (i = b.length + 2; i & 15; i++) {
                b.push(0);
            }
            b.push(Math.floor(this._length / 0x100000000));
            b.push(this._length | 0);
            while (b.length) {
                this._block(b.splice(0, 16));
            }
            this.reset();
            return h;
        },
        _init: [],
        _key: [],
        _precompute: function() {
            var i = 0, prime = 2, factor;
            function frac(x) {
                return (x - Math.floor(x)) * 0x100000000 | 0;
            }
            outer: for (; i < 64; prime++) {
                for (factor = 2; factor * factor <= prime; factor++) {
                    if (prime % factor === 0) {
                        continue outer;
                    }
                }
                if (i < 8) {
                    this._init[i] = frac(Math.pow(prime, 1 / 2));
                }
                this._key[i] = frac(Math.pow(prime, 1 / 3));
                i++;
            }
        },
        _block: function(words) {
            var i, tmp, a, b, w = words.slice(0), h = this._h, k = this._key, h0 = h[0], h1 = h[1], h2 = h[2], h3 = h[3], h4 = h[4], h5 = h[5], h6 = h[6], h7 = h[7];
            for (i = 0; i < 64; i++) {
                if (i < 16) {
                    tmp = w[i];
                } else {
                    a = w[(i + 1) & 15];
                    b = w[(i + 14) & 15];
                    tmp = w[i & 15] = ((a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i & 15] + w[(i + 9) & 15]) | 0;
                }
                tmp = (tmp + h7 + (h4 >>> 6 ^ h4 >>> 11 ^ h4 >>> 25 ^ h4 << 26 ^ h4 << 21 ^ h4 << 7) + (h6 ^ h4 & (h5 ^ h6)) + k[i]);
                h7 = h6;
                h6 = h5;
                h5 = h4;
                h4 = h3 + tmp | 0;
                h3 = h2;
                h2 = h1;
                h1 = h0;
                h0 = (tmp + ((h1 & h2) ^ (h3 & (h1 ^ h2))) + (h1 >>> 2 ^ h1 >>> 13 ^ h1 >>> 22 ^ h1 << 30 ^ h1 << 19 ^ h1 << 10)) | 0;
            }
            h[0] = h[0] + h0 | 0;
            h[1] = h[1] + h1 | 0;
            h[2] = h[2] + h2 | 0;
            h[3] = h[3] + h3 | 0;
            h[4] = h[4] + h4 | 0;
            h[5] = h[5] + h5 | 0;
            h[6] = h[6] + h6 | 0;
            h[7] = h[7] + h7 | 0;
        }
    };
    sjcl.random = {
        randomWords: function(nwords, paranoia) {
            var out = [], i, readiness = this.isReady(paranoia), g;
            if (readiness === this._NOT_READY) {
                throw new sjcl.exception.notReady("generator isn't seeded");
            } else if (readiness & this._REQUIRES_RESEED) {
                this._reseedFromPools(!(readiness & this._READY));
            }
            for (i = 0; i < nwords; i += 4) {
                if ((i + 1) % this._MAX_WORDS_PER_BURST === 0) {
                    this._gate();
                }
                g = this._gen4words();
                out.push(g[0], g[1], g[2], g[3]);
            }
            this._gate();
            return out.slice(0, nwords);
        },
        setDefaultParanoia: function(paranoia) {
            this._defaultParanoia = paranoia;
        },
        addEntropy: function(data, estimatedEntropy, source) {
            source = source || "user";
            var id, i, tmp, t = (new Date()).valueOf(), robin = this._robins[source], oldReady = this.isReady(), err = 0;
            id = this._collectorIds[source];
            if (id === undefined) {
                id = this._collectorIds[source] = this._collectorIdNext++;
            }
            if (robin === undefined) {
                robin = this._robins[source] = 0;
            }
            this._robins[source] = (this._robins[source] + 1) % this._pools.length;
            switch (typeof (data)) {
            case "number":
                if (estimatedEntropy === undefined) {
                    estimatedEntropy = 1;
                }
                this._pools[robin].update([id, this._eventId++, 1, estimatedEntropy, t, 1, data | 0]);
                break;
            case "object":
                var objName = Object.prototype.toString.call(data);
                if (objName === "[object Uint32Array]") {
                    tmp = [];
                    for (i = 0; i < data.length; i++) {
                        tmp.push(data[i]);
                    }
                    data = tmp;
                } else {
                    if (objName !== "[object Array]") {
                        err = 1;
                    }
                    for (i = 0; i < data.length && !err; i++) {
                        if (typeof (data[i]) != "number") {
                            err = 1;
                        }
                    }
                }
                if (!err) {
                    if (estimatedEntropy === undefined) {
                        estimatedEntropy = 0;
                        for (i = 0; i < data.length; i++) {
                            tmp = data[i];
                            while (tmp > 0) {
                                estimatedEntropy++;
                                tmp = tmp >>> 1;
                            }
                        }
                    }
                    this._pools[robin].update([id, this._eventId++, 2, estimatedEntropy, t, data.length].concat(data));
                }
                break;
            case "string":
                if (estimatedEntropy === undefined) {
                    estimatedEntropy = data.length;
                }
                this._pools[robin].update([id, this._eventId++, 3, estimatedEntropy, t, data.length]);
                this._pools[robin].update(data);
                break;
            default:
                err = 1;
            }
            if (err) {
                throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");
            }
            this._poolEntropy[robin] += estimatedEntropy;
            this._poolStrength += estimatedEntropy;
            if (oldReady === this._NOT_READY) {
                if (this.isReady() !== this._NOT_READY) {
                    this._fireEvent("seeded", Math.max(this._strength, this._poolStrength));
                }
                this._fireEvent("progress", this.getProgress());
            }
        },
        isReady: function(paranoia) {
            var entropyRequired = this._PARANOIA_LEVELS[(paranoia !== undefined) ? paranoia : this._defaultParanoia];
            if (this._strength && this._strength >= entropyRequired) {
                return (this._poolEntropy[0] > this._BITS_PER_RESEED && (new Date()).valueOf() > this._nextReseed) ? this._REQUIRES_RESEED | this._READY : this._READY;
            } else {
                return (this._poolStrength >= entropyRequired) ? this._REQUIRES_RESEED | this._NOT_READY : this._NOT_READY;
            }
        },
        getProgress: function(paranoia) {
            var entropyRequired = this._PARANOIA_LEVELS[paranoia ? paranoia : this._defaultParanoia];
            if (this._strength >= entropyRequired) {
                return 1.0;
            } else {
                return (this._poolStrength > entropyRequired) ? 1.0 : this._poolStrength / entropyRequired;
            }
        },
        startCollectors: function() {
            if (this._collectorsStarted) {
                return;
            }
            if (window.addEventListener) {
                window.addEventListener("load", this._loadTimeCollector, false);
                window.addEventListener("mousemove", this._mouseCollector, false);
            } else if (document.attachEvent) {
                document.attachEvent("onload", this._loadTimeCollector);
                document.attachEvent("onmousemove", this._mouseCollector);
            } else {
                throw new sjcl.exception.bug("can't attach event");
            }
            this._collectorsStarted = true;
        },
        stopCollectors: function() {
            if (!this._collectorsStarted) {
                return;
            }
            if (window.removeEventListener) {
                window.removeEventListener("load", this._loadTimeCollector, false);
                window.removeEventListener("mousemove", this._mouseCollector, false);
            } else if (window.detachEvent) {
                window.detachEvent("onload", this._loadTimeCollector);
                window.detachEvent("onmousemove", this._mouseCollector);
            }
            this._collectorsStarted = false;
        },
        addEventListener: function(name, callback) {
            this._callbacks[name][this._callbackI++] = callback;
        },
        removeEventListener: function(name, cb) {
            var i, j, cbs = this._callbacks[name], jsTemp = [];
            for (j in cbs) {
                if (cbs.hasOwnProperty(j) && cbs[j] === cb) {
                    jsTemp.push(j);
                }
            }
            for (i = 0; i < jsTemp.length; i++) {
                j = jsTemp[i];
                delete cbs[j];
            }
        },
        _pools: [new sjcl.hash.sha256()],
        _poolEntropy: [0],
        _reseedCount: 0,
        _robins: {},
        _eventId: 0,
        _collectorIds: {},
        _collectorIdNext: 0,
        _strength: 0,
        _poolStrength: 0,
        _nextReseed: 0,
        _key: [0, 0, 0, 0, 0, 0, 0, 0],
        _counter: [0, 0, 0, 0],
        _cipher: undefined,
        _defaultParanoia: 6,
        _collectorsStarted: false,
        _callbacks: {
            progress: {},
            seeded: {}
        },
        _callbackI: 0,
        _NOT_READY: 0,
        _READY: 1,
        _REQUIRES_RESEED: 2,
        _MAX_WORDS_PER_BURST: 65536,
        _PARANOIA_LEVELS: [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024],
        _MILLISECONDS_PER_RESEED: 30000,
        _BITS_PER_RESEED: 80,
        _gen4words: function() {
            for (var i = 0; i < 4; i++) {
                this._counter[i] = this._counter[i] + 1 | 0;
                if (this._counter[i]) {
                    break;
                }
            }
            return this._cipher.encrypt(this._counter);
        },
        _gate: function() {
            this._key = this._gen4words().concat(this._gen4words());
            this._cipher = new sjcl.cipher.aes(this._key);
        },
        _reseed: function(seedWords) {
            this._key = sjcl.hash.sha256.hash(this._key.concat(seedWords));
            this._cipher = new sjcl.cipher.aes(this._key);
            for (var i = 0; i < 4; i++) {
                this._counter[i] = this._counter[i] + 1 | 0;
                if (this._counter[i]) {
                    break;
                }
            }
        },
        _reseedFromPools: function(full) {
            var reseedData = [], strength = 0, i;
            this._nextReseed = reseedData[0] = (new Date()).valueOf() + this._MILLISECONDS_PER_RESEED;
            for (i = 0; i < 16; i++) {
                reseedData.push(Math.random() * 0x100000000 | 0);
            }
            for (i = 0; i < this._pools.length; i++) {
                reseedData = reseedData.concat(this._pools[i].finalize());
                strength += this._poolEntropy[i];
                this._poolEntropy[i] = 0;
                if (!full && (this._reseedCount & (1 << i))) {
                    break;
                }
            }
            if (this._reseedCount >= 1 << this._pools.length) {
                this._pools.push(new sjcl.hash.sha256());
                this._poolEntropy.push(0);
            }
            this._poolStrength -= strength;
            if (strength > this._strength) {
                this._strength = strength;
            }
            this._reseedCount++;
            this._reseed(reseedData);
        },
        _mouseCollector: function(ev) {
            var x = ev.x || ev.clientX || ev.offsetX || 0
              , y = ev.y || ev.clientY || ev.offsetY || 0;
            sjcl.random.addEntropy([x, y], 2, "mouse");
        },
        _loadTimeCollector: function(ev) {
            sjcl.random.addEntropy((new Date()).valueOf(), 2, "loadtime");
        },
        _fireEvent: function(name, arg) {
            var j, cbs = sjcl.random._callbacks[name], cbsTemp = [];
            for (j in cbs) {
                if (cbs.hasOwnProperty(j)) {
                    cbsTemp.push(cbs[j]);
                }
            }
            for (j = 0; j < cbsTemp.length; j++) {
                cbsTemp[j](arg);
            }
        }
    };
    (function() {
        try {
            var ab = new Uint32Array(32);
            crypto.getRandomValues(ab);
            sjcl.random.addEntropy(ab, 1024, "crypto.getRandomValues");
        } catch (e) {}
    }
    )();
    (function() {
        for (var key in sjcl.beware) {
            if (sjcl.beware.hasOwnProperty(key)) {
                sjcl.beware[key]();
            }
        }
    }
    )();
    var Braintree = {
        sjcl: sjcl,
        version: "1.3.9"
    };
    Braintree.generateAesKey = function() {
        return {
            key: sjcl.random.randomWords(8, 0),
            encrypt: function(plainText) {
                return this.encryptWithIv(plainText, sjcl.random.randomWords(4, 0));
            },
            encryptWithIv: function(plaintext, iv) {
                var aes = new sjcl.cipher.aes(this.key)
                  , plaintextBits = sjcl.codec.utf8String.toBits(plaintext)
                  , ciphertextBits = sjcl.mode.cbc.encrypt(aes, plaintextBits, iv)
                  , ciphertextAndIvBits = sjcl.bitArray.concat(iv, ciphertextBits);
                return sjcl.codec.base64.fromBits(ciphertextAndIvBits);
            }
        };
    }
    ;
    Braintree.create = function(publicKey) {
        return new Braintree.EncryptionClient(publicKey);
    }
    ;
    Braintree.EncryptionClient = function(publicKey) {
        var self = this
          , hiddenFields = [];
        self.publicKey = publicKey;
        self.version = Braintree.version;
        var createElement = function(tagName, attrs) {
            var element, attr, value;
            element = document.createElement(tagName);
            for (attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    value = attrs[attr];
                    element.setAttribute(attr, value);
                }
            }
            return element;
        };
        var extractForm = function(object) {
            if (window.jQuery && object instanceof jQuery) {
                return object[0];
            } else if (object.nodeType && object.nodeType === 1) {
                return object;
            } else {
                return document.getElementById(object);
            }
        };
        var extractIntegers = function(asn1) {
            var parts = [], start, end, data, i;
            if (asn1.typeName() === "INTEGER") {
                start = asn1.posContent();
                end = asn1.posEnd();
                data = asn1.stream.hexDump(start, end).replace(/[ \n]/g, "");
                parts.push(data);
            }
            if (asn1.sub !== null) {
                for (i = 0; i < asn1.sub.length; i++) {
                    parts = parts.concat(extractIntegers(asn1.sub[i]));
                }
            }
            return parts;
        };
        var findInputs = function(element) {
            var found = [], children = element.children, child, i;
            for (i = 0; i < children.length; i++) {
                child = children[i];
                if (child.nodeType === 1 && child.attributes["data-encrypted-name"]) {
                    found.push(child);
                } else if (child.children && child.children.length > 0) {
                    found = found.concat(findInputs(child));
                }
            }
            return found;
        };
        var generateRsaKey = function() {
            var asn1, exponent, parts, modulus, rawKey, rsa;
            try {
                rawKey = b64toBA(publicKey);
                asn1 = ASN1.decode(rawKey);
            } catch (e) {
                throw "Invalid encryption key. Please use the key labeled 'Client-Side Encryption Key'";
            }
            parts = extractIntegers(asn1);
            if (parts.length !== 2) {
                throw "Invalid encryption key. Please use the key labeled 'Client-Side Encryption Key'";
            }
            modulus = parts[0];
            exponent = parts[1];
            rsa = new RSAKey();
            rsa.setPublic(modulus, exponent);
            return rsa;
        };
        var generateHmacKey = function() {
            return {
                key: sjcl.random.randomWords(8, 0),
                sign: function(message) {
                    var hmac = new sjcl.misc.hmac(this.key,sjcl.hash.sha256)
                      , signature = hmac.encrypt(message);
                    return sjcl.codec.base64.fromBits(signature);
                }
            };
        };
        self.encrypt = function(plaintext) {
            var rsa = generateRsaKey()
              , aes = Braintree.generateAesKey()
              , hmac = generateHmacKey()
              , ciphertext = aes.encrypt(plaintext)
              , signature = hmac.sign(sjcl.codec.base64.toBits(ciphertext))
              , combinedKey = sjcl.bitArray.concat(aes.key, hmac.key)
              , encodedKey = sjcl.codec.base64.fromBits(combinedKey)
              , encryptedKey = rsa.encrypt_b64(encodedKey)
              , prefix = "$bt4|javascript_" + self.version.replace(/\./g, "_") + "$";
            return prefix + encryptedKey + "$" + ciphertext + "$" + signature;
        }
        ;
        self.encryptForm = function(form) {
            var element, encryptedValue, fieldName, hiddenField, i, inputs;
            form = extractForm(form);
            inputs = findInputs(form);
            while (hiddenFields.length > 0) {
                try {
                    form.removeChild(hiddenFields[0]);
                } catch (err) {}
                hiddenFields.splice(0, 1);
            }
            for (i = 0; i < inputs.length; i++) {
                element = inputs[i];
                fieldName = element.getAttribute("data-encrypted-name");
                encryptedValue = self.encrypt(element.value);
                element.removeAttribute("name");
                hiddenField = createElement("input", {
                    value: encryptedValue,
                    type: "hidden",
                    name: fieldName
                });
                hiddenFields.push(hiddenField);
                form.appendChild(hiddenField);
            }
        }
        ;
        self.onSubmitEncryptForm = function(form, callback) {
            var wrappedCallback;
            form = extractForm(form);
            wrappedCallback = function(e) {
                self.encryptForm(form);
                return (!!callback) ? callback(e) : e;
            }
            ;
            if (window.jQuery) {
                window.jQuery(form).submit(wrappedCallback);
            } else if (form.addEventListener) {
                form.addEventListener("submit", wrappedCallback, false);
            } else if (form.attachEvent) {
                form.attachEvent("onsubmit", wrappedCallback);
            }
        }
        ;
        self.formEncrypter = {
            encryptForm: self.encryptForm,
            extractForm: extractForm,
            onSubmitEncryptForm: self.onSubmitEncryptForm
        };
        sjcl.random.startCollectors();
    }
    ;
    window.Braintree = Braintree;
}();

var Un = function(r) {
    var s, d, u;
    for (s = 1; s < arguments.length; s++) {
        d = arguments[s];
        for (u in d)
            d.hasOwnProperty(u) && (r[u] = d[u])
    }
    return r
}
  , He = typeof Object.assign == "function" ? Object.assign : Un
  , ue = window
function me(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t
}
var Zt = {}, ke = {}, Tr;
function Vn() {
    if (Tr)
        return ke;
    Tr = 1,
    Object.defineProperty(ke, "__esModule", {
        value: !0
    }),
    ke.detach = ke.attach = void 0;
    var t = Se()
      , r = !1;
    function s() {
        r || typeof window == "undefined" || (r = !0,
        window.addEventListener("message", t.onMessage, !1))
    }
    ke.attach = s;
    function d() {
        r = !1,
        window.removeEventListener("message", t.onMessage, !1)
    }
    return ke.detach = d,
    ke
}
var Ye = {}, wr;
function Fn() {
    if (wr)
        return Ye;
    wr = 1,
    Object.defineProperty(Ye, "__esModule", {
        value: !0
    }),
    Ye.broadcastToChildWindows = void 0;
    var t = Se();
    function r(s, d, u) {
        for (var A = t.childWindows.length - 1; A >= 0; A--) {
            var _ = t.childWindows[A];
            _.closed ? t.childWindows.splice(A, 1) : u !== _ && (0,
            t.broadcast)(s, {
                origin: d,
                frame: _.top
            })
        }
    }
    return Ye.broadcastToChildWindows = r,
    Ye
}
var We = {}, Br;
function jn() {
    if (Br)
        return We;
    Br = 1,
    Object.defineProperty(We, "__esModule", {
        value: !0
    }),
    We.broadcast = void 0;
    var t = Se();
    function r(s, d) {
        var u = 0, A, _ = d.origin, D = d.frame;
        try {
            for (D.postMessage(s, _),
            (0,
            t.hasOpener)(D) && D.opener.top !== window.top && r(s, {
                origin: _,
                frame: D.opener.top
            }); A = D.frames[u]; )
                r(s, {
                    origin: _,
                    frame: A
                }),
                u++
        } catch (k) {}
    }
    return We.broadcast = r,
    We
}
var Be = {};
Object.defineProperty(Be, "__esModule", {
    value: !0
}),
Be.subscribers = Be.childWindows = Be.prefix = void 0,
Be.prefix = "/*framebus*/",
Be.childWindows = [],
Be.subscribers = {};
var Xe = {}, Nr;
function Kn() {
    if (Nr)
        return Xe;
    Nr = 1,
    Object.defineProperty(Xe, "__esModule", {
        value: !0
    }),
    Xe.dispatch = void 0;
    var t = Se();
    function r(s, d, u, A, _) {
        if (t.subscribers[s] && t.subscribers[s][d]) {
            var D = [];
            u && D.push(u),
            A && D.push(A);
            for (var k = 0; k < t.subscribers[s][d].length; k++)
                t.subscribers[s][d][k].apply(_, D)
        }
    }
    return Xe.dispatch = r,
    Xe
}
var Ct = {};
Object.defineProperty(Ct, "__esModule", {
    value: !0
}),
Ct.hasOpener = void 0;
function Gn(t) {
    return !(t.top !== t || t.opener == null || t.opener === t || t.opener.closed === !0)
}
Ct.hasOpener = Gn;
var At = {};
Object.defineProperty(At, "__esModule", {
    value: !0
}),
At.isntString = void 0;
function zn(t) {
    return typeof t != "string"
}
At.isntString = zn;
var Ze = {}, _r;
function qn() {
    if (_r)
        return Ze;
    _r = 1,
    Object.defineProperty(Ze, "__esModule", {
        value: !0
    }),
    Ze.onMessage = void 0;
    var t = Se();
    function r(s) {
        if (!(0,
        t.isntString)(s.data)) {
            var d = (0,
            t.unpackPayload)(s);
            if (d) {
                var u = d.eventData
                  , A = d.reply;
                (0,
                t.dispatch)("*", d.event, u, A, s),
                (0,
                t.dispatch)(s.origin, d.event, u, A, s),
                (0,
                t.broadcastToChildWindows)(s.data, d.origin, s.source)
            }
        }
    }
    return Ze.onMessage = r,
    Ze
}
var Je = {}, Rr;
function Qn() {
    if (Rr)
        return Je;
    Rr = 1,
    Object.defineProperty(Je, "__esModule", {
        value: !0
    }),
    Je.packagePayload = void 0;
    var t = Se();
    function r(s, d, u, A) {
        var _, D = {
            event: s,
            origin: d
        };
        typeof A == "function" && (D.reply = (0,
        t.subscribeReplier)(A, d)),
        D.eventData = u;
        try {
            _ = t.prefix + JSON.stringify(D)
        } catch (k) {
            throw new Error("Could not stringify event: ".concat(k.message))
        }
        return _
    }
    return Je.packagePayload = r,
    Je
}
var St = {};
Object.defineProperty(St, "__esModule", {
    value: !0
}),
St.sendMessage = void 0;
function Hn(t, r, s) {
    try {
        t.postMessage(r, s)
    } catch (d) {}
}
St.sendMessage = Hn;
var $e = {}, et = {}, Lr;
function Or() {
    if (Lr)
        return et;
    Lr = 1,
    Object.defineProperty(et, "__esModule", {
        value: !0
    }),
    et.Framebus = void 0;
    var t = Se()
      , r = typeof window != "undefined" && window.Promise
      , s = function() {
        function d(u) {
            u === void 0 && (u = {}),
            this.origin = u.origin || "*",
            this.channel = u.channel || "",
            this.verifyDomain = u.verifyDomain,
            this.targetFrames = u.targetFrames || [],
            this.limitBroadcastToFramesArray = !!u.targetFrames,
            this.isDestroyed = !1,
            this.listeners = [],
            this.hasAdditionalChecksForOnListeners = !!(this.verifyDomain || this.limitBroadcastToFramesArray)
        }
        return d.setPromise = function(u) {
            d.Promise = u
        }
        ,
        d.target = function(u) {
            return new d(u)
        }
        ,
        d.prototype.addTargetFrame = function(u) {
            this.limitBroadcastToFramesArray && this.targetFrames.push(u)
        }
        ,
        d.prototype.include = function(u) {
            return u == null || u.Window == null || u.constructor !== u.Window ? !1 : (t.childWindows.push(u),
            !0)
        }
        ,
        d.prototype.target = function(u) {
            return d.target(u)
        }
        ,
        d.prototype.emit = function(u, A, _) {
            if (this.isDestroyed)
                return !1;
            var D = this.origin;
            if (u = this.namespaceEvent(u),
            (0,
            t.isntString)(u) || (0,
            t.isntString)(D))
                return !1;
            typeof A == "function" && (_ = A,
            A = void 0);
            var k = (0,
            t.packagePayload)(u, D, A, _);
            return k ? (this.limitBroadcastToFramesArray ? this.targetFramesAsWindows().forEach(function(g) {
                (0,
                t.sendMessage)(g, k, D)
            }) : (0,
            t.broadcast)(k, {
                origin: D,
                frame: window.top || window.self
            }),
            !0) : !1
        }
        ,
        d.prototype.emitAsPromise = function(u, A) {
            var _ = this;
            return new d.Promise(function(D, k) {
                var g = _.emit(u, A, function(i) {
                    D(i)
                });
                g || k(new Error('Listener not added for "'.concat(u, '"')))
            }
            )
        }
        ,
        d.prototype.on = function(u, A) {
            if (this.isDestroyed)
                return !1;
            var _ = this
              , D = this.origin
              , k = A;
            return u = this.namespaceEvent(u),
            (0,
            t.subscriptionArgsInvalid)(u, k, D) ? !1 : (this.hasAdditionalChecksForOnListeners && (k = function() {
                for (var i = [], a = 0; a < arguments.length; a++)
                    i[a] = arguments[a];
                _.passesVerifyDomainCheck(this && this.origin) && _.hasMatchingTargetFrame(this && this.source) && A.apply(void 0, i)
            }
            ),
            this.listeners.push({
                eventName: u,
                handler: k,
                originalHandler: A
            }),
            t.subscribers[D] = t.subscribers[D] || {},
            t.subscribers[D][u] = t.subscribers[D][u] || [],
            t.subscribers[D][u].push(k),
            !0)
        }
        ,
        d.prototype.off = function(u, A) {
            var _ = A;
            if (this.isDestroyed)
                return !1;
            if (this.verifyDomain)
                for (var D = 0; D < this.listeners.length; D++) {
                    var k = this.listeners[D];
                    k.originalHandler === A && (_ = k.handler)
                }
            u = this.namespaceEvent(u);
            var g = this.origin;
            if ((0,
            t.subscriptionArgsInvalid)(u, _, g))
                return !1;
            var i = t.subscribers[g] && t.subscribers[g][u];
            if (!i)
                return !1;
            for (var D = 0; D < i.length; D++)
                if (i[D] === _)
                    return i.splice(D, 1),
                    !0;
            return !1
        }
        ,
        d.prototype.teardown = function() {
            if (!this.isDestroyed) {
                this.isDestroyed = !0;
                for (var u = 0; u < this.listeners.length; u++) {
                    var A = this.listeners[u];
                    this.off(A.eventName, A.handler)
                }
                this.listeners.length = 0
            }
        }
        ,
        d.prototype.passesVerifyDomainCheck = function(u) {
            return this.verifyDomain ? this.checkOrigin(u) : !0
        }
        ,
        d.prototype.targetFramesAsWindows = function() {
            return this.limitBroadcastToFramesArray ? this.targetFrames.map(function(u) {
                return u instanceof HTMLIFrameElement ? u.contentWindow : u
            }).filter(function(u) {
                return u
            }) : []
        }
        ,
        d.prototype.hasMatchingTargetFrame = function(u) {
            if (!this.limitBroadcastToFramesArray)
                return !0;
            var A = this.targetFramesAsWindows().find(function(_) {
                return _ === u
            });
            return !!A
        }
        ,
        d.prototype.checkOrigin = function(u) {
            var A, _ = document.createElement("a");
            _.href = location.href,
            _.protocol === "https:" ? A = _.host.replace(/:443$/, "") : _.protocol === "http:" ? A = _.host.replace(/:80$/, "") : A = _.host;
            var D = _.protocol + "//" + A;
            return D === u ? !0 : this.verifyDomain ? this.verifyDomain(u) : !0
        }
        ,
        d.prototype.namespaceEvent = function(u) {
            return this.channel ? "".concat(this.channel, ":").concat(u) : u
        }
        ,
        d.Promise = r,
        d
    }();
    return et.Framebus = s,
    et
}
function Yn() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
        var r = Math.random() * 16 | 0
          , s = t === "x" ? r : r & 3 | 8;
        return s.toString(16)
    })
}
var xr = Yn, Wn = me(xr), Pr;
function Xn() {
    if (Pr)
        return $e;
    Pr = 1;
    var t = ue && ue.__importDefault || function(u) {
        return u && u.__esModule ? u : {
            default: u
        }
    }
    ;
    Object.defineProperty($e, "__esModule", {
        value: !0
    }),
    $e.subscribeReplier = void 0;
    var r = Or()
      , s = t(xr);
    function d(u, A) {
        var _ = (0,
        s.default)();
        function D(k, g) {
            u(k, g),
            r.Framebus.target({
                origin: A
            }).off(_, D)
        }
        return r.Framebus.target({
            origin: A
        }).on(_, D),
        _
    }
    return $e.subscribeReplier = d,
    $e
}
var tt = {}, kr;
function Zn() {
    if (kr)
        return tt;
    kr = 1,
    Object.defineProperty(tt, "__esModule", {
        value: !0
    }),
    tt.subscriptionArgsInvalid = void 0;
    var t = Se();
    function r(s, d, u) {
        return (0,
        t.isntString)(s) || typeof d != "function" ? !0 : (0,
        t.isntString)(u)
    }
    return tt.subscriptionArgsInvalid = r,
    tt
}
var Mr = {};
Object.defineProperty(Mr, "__esModule", {
    value: !0
});
var rt = {}, Dr;
function Jn() {
    if (Dr)
        return rt;
    Dr = 1,
    Object.defineProperty(rt, "__esModule", {
        value: !0
    }),
    rt.unpackPayload = void 0;
    var t = Se();
    function r(s) {
        var d;
        if (s.data.slice(0, t.prefix.length) !== t.prefix)
            return !1;
        try {
            d = JSON.parse(s.data.slice(t.prefix.length))
        } catch (D) {
            return !1
        }
        if (d.reply) {
            var u = s.origin
              , A = s.source
              , _ = d.reply;
            d.reply = function(k) {
                if (A) {
                    var g = (0,
                    t.packagePayload)(_, u, k);
                    g && A.postMessage(g, u)
                }
            }
        }
        return d
    }
    return rt.unpackPayload = r,
    rt
}
var Ur;
function Se() {
    return Ur || (Ur = 1,
    function(t) {
        var r = ue && ue.__createBinding || (Object.create ? function(d, u, A, _) {
            _ === void 0 && (_ = A);
            var D = Object.getOwnPropertyDescriptor(u, A);
            (!D || ("get"in D ? !u.__esModule : D.writable || D.configurable)) && (D = {
                enumerable: !0,
                get: function() {
                    return u[A]
                }
            }),
            Object.defineProperty(d, _, D)
        }
        : function(d, u, A, _) {
            _ === void 0 && (_ = A),
            d[_] = u[A]
        }
        )
          , s = ue && ue.__exportStar || function(d, u) {
            for (var A in d)
                A !== "default" && !Object.prototype.hasOwnProperty.call(u, A) && r(u, d, A)
        }
        ;
        Object.defineProperty(t, "__esModule", {
            value: !0
        }),
        s(Vn(), t),
        s(Fn(), t),
        s(jn(), t),
        s(Be, t),
        s(Kn(), t),
        s(Ct, t),
        s(At, t),
        s(qn(), t),
        s(Qn(), t),
        s(St, t),
        s(Xn(), t),
        s(Zn(), t),
        s(Mr, t),
        s(Jn(), t)
    }(Zt)),
    Zt
}
var $n = Se()
  , ei = Or();
(0,
$n.attach)();
var ti = ei.Framebus
  , ri = me(ti)
  , ni = ri
  , ii = ni;
function Jt() {
    return window.name.replace("braintree-hosted-field-", "")
}
function ai(t) {
    for (var r = [], s = 0; s < t.frames.length; s++) {
        var d = t.frames[s];
        try {
            d.location.href === window.location.href && r.push(d)
        } catch (u) {}
    }
    return r
}
function le(t) {
    "@babel/helpers - typeof";
    return le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
        return typeof r
    }
    : function(r) {
        return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r
    }
    ,
    le(t)
}
function ce(t, r) {
    if (!(t instanceof r))
        throw new TypeError("Cannot call a class as a function")
}
function Vr(t, r) {
    for (var s = 0; s < r.length; s++) {
        var d = r[s];
        d.enumerable = d.enumerable || !1,
        d.configurable = !0,
        "value"in d && (d.writable = !0),
        Object.defineProperty(t, Kr(d.key), d)
    }
}
function fe(t, r, s) {
    return r && Vr(t.prototype, r),
    s && Vr(t, s),
    Object.defineProperty(t, "prototype", {
        writable: !1
    }),
    t
}
function Fr(t, r, s) {
    return r = Kr(r),
    r in t ? Object.defineProperty(t, r, {
        value: s,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[r] = s,
    t
}
function ge(t, r) {
    if (typeof r != "function" && r !== null)
        throw new TypeError("Super expression must either be null or a function");
    t.prototype = Object.create(r && r.prototype, {
        constructor: {
            value: t,
            writable: !0,
            configurable: !0
        }
    }),
    Object.defineProperty(t, "prototype", {
        writable: !1
    }),
    r && nt(t, r)
}
function Ee(t) {
    return Ee = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(s) {
        return s.__proto__ || Object.getPrototypeOf(s)
    }
    ,
    Ee(t)
}
function nt(t, r) {
    return nt = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(d, u) {
        return d.__proto__ = u,
        d
    }
    ,
    nt(t, r)
}
function jr() {
    if (typeof Reflect == "undefined" || !Reflect.construct || Reflect.construct.sham)
        return !1;
    if (typeof Proxy == "function")
        return !0;
    try {
        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})),
        !0
    } catch (t) {
        return !1
    }
}
function It(t, r, s) {
    return jr() ? It = Reflect.construct.bind() : It = function(u, A, _) {
        var D = [null];
        D.push.apply(D, A);
        var k = Function.bind.apply(u, D)
          , g = new k;
        return _ && nt(g, _.prototype),
        g
    }
    ,
    It.apply(null, arguments)
}
function si(t) {
    try {
        return Function.toString.call(t).indexOf("[native code]") !== -1
    } catch (r) {
        return typeof t == "function"
    }
}
function $t(t) {
    var r = typeof Map == "function" ? new Map : void 0;
    return $t = function(d) {
        if (d === null || !si(d))
            return d;
        if (typeof d != "function")
            throw new TypeError("Super expression must either be null or a function");
        if (typeof r != "undefined") {
            if (r.has(d))
                return r.get(d);
            r.set(d, u)
        }
        function u() {
            return It(d, arguments, Ee(this).constructor)
        }
        return u.prototype = Object.create(d.prototype, {
            constructor: {
                value: u,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }),
        nt(u, d)
    }
    ,
    $t(t)
}
function Ke(t) {
    if (t === void 0)
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return t
}
function oi(t, r) {
    if (r && (typeof r == "object" || typeof r == "function"))
        return r;
    if (r !== void 0)
        throw new TypeError("Derived constructors may only return object or undefined");
    return Ke(t)
}
function ye(t) {
    var r = jr();
    return function() {
        var d = Ee(t), u;
        if (r) {
            var A = Ee(this).constructor;
            u = Reflect.construct(d, arguments, A)
        } else
            u = d.apply(this, arguments);
        return oi(this, u)
    }
}
function ui(t, r) {
    for (; !Object.prototype.hasOwnProperty.call(t, r) && (t = Ee(t),
    t !== null); )
        ;
    return t
}
function Ie() {
    return typeof Reflect != "undefined" && Reflect.get ? Ie = Reflect.get.bind() : Ie = function(r, s, d) {
        var u = ui(r, s);
        if (u) {
            var A = Object.getOwnPropertyDescriptor(u, s);
            return A.get ? A.get.call(arguments.length < 3 ? r : d) : A.value
        }
    }
    ,
    Ie.apply(this, arguments)
}
function li(t, r) {
    if (typeof t != "object" || t === null)
        return t;
    var s = t[Symbol.toPrimitive];
    if (s !== void 0) {
        var d = s.call(t, r || "default");
        if (typeof d != "object")
            return d;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return (r === "string" ? String : Number)(t)
}
function Kr(t) {
    var r = li(t, "string");
    return typeof r == "symbol" ? r : String(r)
}
var Gr = "0.0.10", ci = '{"assetsUrl":"https://d2rncz2hcm43rl.cloudfront.net/0.0.10","legalHosts":false,"allowHttp":false}', er = JSON.parse(ci), fi = er.assetsUrl, hi = "https://payments.uber.com/hosted-fields/events", zr = er.legalHosts || {
    "uber.com": 1,
    "u1f4b2.com": 1,
    "d2rncz2hcm43rl.cloudfront.net": 1,
    "d3d0p8w476pwm6.cloudfront.net": 1,
    "d6u821tnpk7f2.cloudfront.net": 1
}, pi = er.allowHttp || !1, it;
function qr(t, r) {
    return t.split(".").slice(-r).join(".")
}
function di(t) {
    if (t = t.toLowerCase(),
    !/^https:/.test(t) && !pi)
        return !1;
    it = it || document.createElement("a"),
    it.href = t;
    var r = qr(it.hostname, 2)
      , s = qr(it.hostname, 3);
    return zr.hasOwnProperty(r) || zr.hasOwnProperty(s)
}
var gi = {
    CUSTOMER: "CUSTOMER",
    MERCHANT: "MERCHANT",
    NETWORK: "NETWORK",
    INTERNAL: "INTERNAL",
    UNKNOWN: "UNKNOWN"
}
  , Qr = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u;
        if (ce(this, s),
        !s.types.hasOwnProperty(d.type))
            throw new Error(d.type + " is not a valid type.");
        if (!d.code)
            throw new Error("Error code required.");
        if (!d.message)
            throw new Error("Error message required.");
        return u = r.call(this, d.message),
        u.name = "UberPaymentsError",
        u.code = d.code,
        u.message = d.message,
        Object.defineProperty(Ke(u), "message", {
            enumerable: !0
        }),
        u.type = d.type,
        u.details = d.details,
        u
    }
    return fe(s, null, [{
        key: "findRootError",
        value: function(u) {
            return u instanceof s && u.details && u.details.originalError ? s.findRootError(u.details.originalError) : u
        }
    }]),
    s
}($t(Error));
Fr(Qr, "types", gi);
var pe = Qr;
function yi() {
    return fi
}
function vi(t) {
    var r = {
        analyticsMetadata: {
            appId: window.location.host,
            sdkVersion: Gr,
            sessionId: Wn(),
            startTime: Date.now()
        },
        assetsUrl: (t == null ? void 0 : t.assetsUrl) || yi(),
        analyticsUrl: hi,
        creditCards: {
            supportedCardTypes: ["american-express", "diners-club", "discover", "elo", "hiper", "hipercard", "jcb", "maestro", "mastercard", "mir", "unionpay", "visa", "uatp"]
        }
    };
    return Promise.resolve(r)
}
var Hr = {
    type: pe.types.MERCHANT,
    code: "CLIENT_CONFIGURATION_INVALID_DOMAIN"
};
function mi(t) {
    return Object.keys(t).filter(function(r) {
        return typeof t[r] == "function"
    })
}
var Yr = {
    type: pe.types.MERCHANT,
    code: "METHOD_CALLED_AFTER_TEARDOWN"
};
function Ei(t, r) {
    r.forEach(function(s) {
        t[s] = function() {
            throw new pe({
                type: Yr.type,
                code: Yr.code,
                message: s + " cannot be called after teardown."
            })
        }
    })
}
var bi = function() {
    function t(r) {
        ce(this, t),
        this._configurationJSON = JSON.stringify(r),
        ["assetsUrl"].forEach(function(s) {
            if (s in r && r[s] && !di(r[s]))
                throw new pe({
                    type: Hr.type,
                    code: Hr.code,
                    message: s + " property is on an invalid domain."
                })
        })
    }
    return fe(t, [{
        key: "getConfiguration",
        value: function() {
            return JSON.parse(this._configurationJSON)
        }
    }, {
        key: "getVersion",
        value: function() {
            return Gr
        }
    }, {
        key: "teardown",
        value: function() {
            return Ei(this, mi(t.prototype)),
            Promise.resolve()
        }
    }], [{
        key: "initialize",
        value: function(s) {
            var d = vi({
                assetsUrl: s.assetsUrl
            }).then(function(u) {
                return s.isDebug && (u.isDebug = !0),
                new t(u)
            });
            return d
        }
    }]),
    t
}()
  , Ci = bi
  , at = {}
  , Tt = {}
  , wt = {};
Object.defineProperty(wt, "__esModule", {
    value: !0
}),
wt.validateSelector = void 0;
function Ai(t) {
    return t.trim().length === 0 || /supports/i.test(t) || /import/i.test(t) || /[{}]/.test(t) ? !1 : !/</.test(t)
}
wt.validateSelector = Ai;
var Bt = {};
Object.defineProperty(Bt, "__esModule", {
    value: !0
}),
Bt.filterStyleKeys = void 0;
function Si(t, r, s) {
    r === void 0 && (r = []);
    var d = {};
    function u(_) {
        r.indexOf(_) !== -1 && (d[_] = t[_])
    }
    function A(_) {
        r.indexOf(_) === -1 && (d[_] = t[_])
    }
    return s ? Object.keys(t).forEach(u) : Object.keys(t).forEach(A),
    d
}
Bt.filterStyleKeys = Si;
var Nt = {};
Object.defineProperty(Nt, "__esModule", {
    value: !0
}),
Nt.filterStyleValues = void 0;
var Ii = [/;/, /[<>]/, /\\/, /@import/i, /expression/i, /url/i, /javascript/i];
function Ti(t) {
    t === void 0 && (t = {});
    var r = {};
    return Object.keys(t).forEach(function(s) {
        var d = String(t[s])
          , u = Ii.some(function(A) {
            return A.test(String(d))
        });
        u || (r[s] = d)
    }),
    r
}
Nt.filterStyleValues = Ti,
Object.defineProperty(Tt, "__esModule", {
    value: !0
}),
Tt.injectStylesheet = void 0;
var Wr = wt
  , wi = Bt
  , Bi = Nt;
function Ni(t) {
    return /^@media\s+/i.test(t)
}
function Xr(t, r, s) {
    r === void 0 && (r = {});
    var d, u = t + "{";
    if (Ni(t))
        Object.keys(r).forEach(function(_) {
            (0,
            Wr.validateSelector)(_) && (u += Xr(_, r[_], s))
        });
    else {
        d = s(r);
        var A = (0,
        Bi.filterStyleValues)(d);
        Object.keys(A).forEach(function(_) {
            u += _ + ":" + A[_] + ";"
        })
    }
    return u += "}",
    u
}
function _i(t, r, s) {
    t === void 0 && (t = {}),
    r === void 0 && (r = []);
    var d = 0
      , u = document.createElement("style");
    document.querySelector("head").appendChild(u);
    var A = u.sheet;
    function _(D) {
        return (0,
        wi.filterStyleKeys)(D, r, s)
    }
    return Object.keys(t).forEach(function(D) {
        if ((0,
        Wr.validateSelector)(D)) {
            var k = Xr(D, t[D], _);
            try {
                A.insertRule ? A.insertRule(k, d) : A.addRule(D, k.replace(/^[^{]+/, "").replace(/[{}]/g, ""), d),
                d++
            } catch (g) {
                if (!(g instanceof SyntaxError || g instanceof DOMException))
                    throw g
            }
        }
    }),
    u
}
Tt.injectStylesheet = _i,
Object.defineProperty(at, "__esModule", {
    value: !0
}),
at.injectWithBlocklist = Jr = at.injectWithAllowlist = void 0;
var Zr = Tt;
function Ri(t, r) {
    return (0,
    Zr.injectStylesheet)(t, r, !0)
}
var Jr = at.injectWithAllowlist = Ri;
function Li(t, r) {
    return (0,
    Zr.injectStylesheet)(t, r, !1)
}
at.injectWithBlocklist = Li;
var Oi = function() {
    function t() {
        this._events = {}
    }
    return t.prototype.on = function(r, s) {
        this._events[r] ? this._events[r].push(s) : this._events[r] = [s]
    }
    ,
    t.prototype.off = function(r, s) {
        var d = this._events[r];
        if (d) {
            var u = d.indexOf(s);
            d.splice(u, 1)
        }
    }
    ,
    t.prototype._emit = function(r) {
        for (var s = [], d = 1; d < arguments.length; d++)
            s[d - 1] = arguments[d];
        var u = this._events[r];
        u && u.forEach(function(A) {
            A.apply(void 0, s)
        })
    }
    ,
    t.prototype.hasListener = function(r) {
        var s = this._events[r];
        return s ? s.length > 0 : !1
    }
    ,
    t.createChild = function(r) {
        r.prototype = Object.create(t.prototype, {
            constructor: r
        })
    }
    ,
    t
}()
  , xi = Oi
  , Pi = me(xi)
  , ki = function(t) {
    ge(s, t);
    var r = ye(s);
    function s() {
        var d;
        return ce(this, s),
        d = r.call(this),
        d._attributes = {},
        d
    }
    return fe(s, [{
        key: "get",
        value: function(u) {
            var A = this._attributes;
            if (u == null)
                return A;
            for (var _ = u.split("."), D = 0; D < _.length; D++) {
                var k = _[D];
                if (!A.hasOwnProperty(k))
                    return;
                A = A[k]
            }
            return A
        }
    }, {
        key: "set",
        value: function(u, A) {
            var _ = this._attributes, D = u.split("."), k, g;
            for (g = 0; g < D.length - 1; g++)
                k = D[g],
                _.hasOwnProperty(k) || (_[k] = {}),
                _ = _[k];
            if (k = D[g],
            _[k] !== A) {
                var i = _[k];
                _[k] = A,
                this._emit("change");
                for (var a = 1; a <= D.length; a++)
                    k = D.slice(0, a).join("."),
                    this._emit("change:".concat(k), this.get(k), {
                        old: i
                    })
            }
        }
    }]),
    s
}(Pi)
  , Mi = ki
  , Di = {
    visa: {
        niceType: "Visa",
        type: "visa",
        patterns: [4],
        gaps: [4, 8, 12],
        lengths: [16, 18, 19],
        code: {
            name: "CVV",
            size: 3
        }
    },
    mastercard: {
        niceType: "Mastercard",
        type: "mastercard",
        patterns: [[51, 55], [2221, 2229], [223, 229], [23, 26], [270, 271], 2720],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
            name: "CVC",
            size: 3
        }
    },
    "american-express": {
        niceType: "American Express",
        type: "american-express",
        patterns: [34, 37],
        gaps: [4, 10],
        lengths: [15],
        code: {
            name: "CID",
            size: 4
        }
    },
    "diners-club": {
        niceType: "Diners Club",
        type: "diners-club",
        patterns: [[300, 305], 36, 38, 39],
        gaps: [4, 10],
        lengths: [14, 16, 19],
        code: {
            name: "CVV",
            size: 3
        }
    },
    discover: {
        niceType: "Discover",
        type: "discover",
        patterns: [6011, [644, 649], 65],
        gaps: [4, 8, 12],
        lengths: [16, 19],
        code: {
            name: "CID",
            size: 3
        }
    },
    jcb: {
        niceType: "JCB",
        type: "jcb",
        patterns: [2131, 1800, [3528, 3589]],
        gaps: [4, 8, 12],
        lengths: [16, 17, 18, 19],
        code: {
            name: "CVV",
            size: 3
        }
    },
    unionpay: {
        niceType: "UnionPay",
        type: "unionpay",
        patterns: [620, [62100, 62182], [62184, 62187], [62185, 62197], [62200, 62205], [622010, 622999], 622018, [62207, 62209], [623, 626], 6270, 6272, 6276, [627700, 627779], [627781, 627799], [6282, 6289], 6291, 6292, 810, [8110, 8131], [8132, 8151], [8152, 8163], [8164, 8171]],
        gaps: [4, 8, 12],
        lengths: [14, 15, 16, 17, 18, 19],
        code: {
            name: "CVN",
            size: 3
        }
    },
    maestro: {
        niceType: "Maestro",
        type: "maestro",
        patterns: [493698, [5e5, 504174], [504176, 506698], [506779, 508999], [56, 59], 63, 67, 6],
        gaps: [4, 8, 12],
        lengths: [12, 13, 14, 15, 16, 17, 18, 19],
        code: {
            name: "CVC",
            size: 3
        }
    },
    elo: {
        niceType: "Elo",
        type: "elo",
        patterns: [401178, 401179, 438935, 457631, 457632, 431274, 451416, 457393, 504175, [506699, 506778], [509e3, 509999], 627780, 636297, 636368, [650031, 650033], [650035, 650051], [650405, 650439], [650485, 650538], [650541, 650598], [650700, 650718], [650720, 650727], [650901, 650978], [651652, 651679], [655e3, 655019], [655021, 655058]],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
            name: "CVE",
            size: 3
        }
    },
    mir: {
        niceType: "Mir",
        type: "mir",
        patterns: [[2200, 2204]],
        gaps: [4, 8, 12],
        lengths: [16, 17, 18, 19],
        code: {
            name: "CVP2",
            size: 3
        }
    },
    hiper: {
        niceType: "Hiper",
        type: "hiper",
        patterns: [637095, 63737423, 63743358, 637568, 637599, 637609, 637612],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
            name: "CVC",
            size: 3
        }
    },
    hipercard: {
        niceType: "Hipercard",
        type: "hipercard",
        patterns: [606282],
        gaps: [4, 8, 12],
        lengths: [16],
        code: {
            name: "CVC",
            size: 3
        }
    }
}
  , Ui = Di
  , _t = {}
  , st = {};
Object.defineProperty(st, "__esModule", {
    value: !0
}),
st.clone = void 0;
function Vi(t) {
    return t ? JSON.parse(JSON.stringify(t)) : null
}
st.clone = Vi;
var Rt = {};
Object.defineProperty(Rt, "__esModule", {
    value: !0
}),
Rt.matches = void 0;
function Fi(t, r, s) {
    var d = String(r).length
      , u = t.substr(0, d)
      , A = parseInt(u, 10);
    return r = parseInt(String(r).substr(0, u.length), 10),
    s = parseInt(String(s).substr(0, u.length), 10),
    A >= r && A <= s
}
function ji(t, r) {
    return r = String(r),
    r.substring(0, t.length) === t.substring(0, r.length)
}
function Ki(t, r) {
    return Array.isArray(r) ? Fi(t, r[0], r[1]) : ji(t, r)
}
Rt.matches = Ki,
Object.defineProperty(_t, "__esModule", {
    value: !0
}),
_t.addMatchingCardsToResults = void 0;
var Gi = st
  , zi = Rt;
function qi(t, r, s) {
    var d, u;
    for (d = 0; d < r.patterns.length; d++) {
        var A = r.patterns[d];
        if ((0,
        zi.matches)(t, A)) {
            var _ = (0,
            Gi.clone)(r);
            Array.isArray(A) ? u = String(A[0]).length : u = String(A).length,
            t.length >= u && (_.matchStrength = u),
            s.push(_);
            break
        }
    }
}
_t.addMatchingCardsToResults = qi;
var Lt = {};
Object.defineProperty(Lt, "__esModule", {
    value: !0
}),
Lt.isValidInputType = void 0;
function Qi(t) {
    return typeof t == "string" || t instanceof String
}
Lt.isValidInputType = Qi;
var Ot = {};
Object.defineProperty(Ot, "__esModule", {
    value: !0
}),
Ot.findBestMatch = void 0;
function Hi(t) {
    var r = t.filter(function(s) {
        return s.matchStrength
    }).length;
    return r > 0 && r === t.length
}
function Yi(t) {
    return Hi(t) ? t.reduce(function(r, s) {
        return !r || Number(r.matchStrength) < Number(s.matchStrength) ? s : r
    }) : null
}
Ot.findBestMatch = Yi;
var xt = ue && ue.__assign || function() {
    return xt = Object.assign || function(t) {
        for (var r, s = 1, d = arguments.length; s < d; s++) {
            r = arguments[s];
            for (var u in r)
                Object.prototype.hasOwnProperty.call(r, u) && (t[u] = r[u])
        }
        return t
    }
    ,
    xt.apply(this, arguments)
}
  , $r = Ui
  , Wi = _t
  , Xi = Lt
  , Zi = Ot
  , ot = st
  , ut = {}
  , be = {
    VISA: "visa",
    MASTERCARD: "mastercard",
    AMERICAN_EXPRESS: "american-express",
    DINERS_CLUB: "diners-club",
    DISCOVER: "discover",
    JCB: "jcb",
    UNIONPAY: "unionpay",
    MAESTRO: "maestro",
    ELO: "elo",
    MIR: "mir",
    HIPER: "hiper",
    HIPERCARD: "hipercard"
}
  , en = [be.VISA, be.MASTERCARD, be.AMERICAN_EXPRESS, be.DINERS_CLUB, be.DISCOVER, be.JCB, be.UNIONPAY, be.MAESTRO, be.ELO, be.MIR, be.HIPER, be.HIPERCARD]
  , Ne = (0,
ot.clone)(en);
function tr(t) {
    return ut[t] || $r[t]
}
function Ji() {
    return Ne.map(function(t) {
        return (0,
        ot.clone)(tr(t))
    })
}
function rr(t, r) {
    r === void 0 && (r = !1);
    var s = Ne.indexOf(t);
    if (!r && s === -1)
        throw new Error('"' + t + '" is not a supported card type.');
    return s
}
function _e(t) {
    var r = [];
    if (!(0,
    Xi.isValidInputType)(t))
        return r;
    if (t.length === 0)
        return Ji();
    Ne.forEach(function(d) {
        var u = tr(d);
        (0,
        Wi.addMatchingCardsToResults)(t, u, r)
    });
    var s = (0,
    Zi.findBestMatch)(r);
    return s ? [s] : r
}
_e.getTypeInfo = function(t) {
    return (0,
    ot.clone)(tr(t))
}
,
_e.removeCard = function(t) {
    var r = rr(t);
    Ne.splice(r, 1)
}
,
_e.addCard = function(t) {
    var r = rr(t.type, !0);
    ut[t.type] = t,
    r === -1 && Ne.push(t.type)
}
,
_e.updateCard = function(t, r) {
    var s = ut[t] || $r[t];
    if (!s)
        throw new Error('"'.concat(t, "\" is not a recognized type. Use `addCard` instead.'"));
    if (r.type && s.type !== r.type)
        throw new Error("Cannot overwrite type parameter.");
    var d = (0,
    ot.clone)(s);
    d = xt(xt({}, d), r),
    ut[d.type] = d
}
,
_e.changeOrder = function(t, r) {
    var s = rr(t);
    Ne.splice(s, 1),
    Ne.splice(r, 0, t)
}
,
_e.resetModifications = function() {
    Ne = (0,
    ot.clone)(en),
    ut = {}
}
,
_e.types = be;
var $i = _e
  , nr = me($i);
function Pt(t) {
    return nr(t)
}
["american-express", "diners-club", "discover", "elo", "hiper", "hipercard", "jcb", "maestro", "mastercard", "mir", "unionpay", "visa"].forEach(function(t) {
    nr.removeCard(t)
});
var ea = [{
    niceType: "American Express",
    type: "american-express",
    patterns: [34, 37],
    gaps: [4, 10],
    lengths: [15],
    code: {
        name: "CID",
        size: 4
    }
}, {
    niceType: "Diners Club",
    type: "diners-club",
    lengths: [14, 16],
    patterns: [30, 36, 38, 39],
    gaps: [4, 10],
    code: {
        name: "CVV",
        size: 3
    }
}, {
    niceType: "Discover",
    type: "discover",
    patterns: [6011, 64, 65],
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
        name: "CID",
        size: 3
    }
}, {
    niceType: "Elo",
    type: "elo",
    lengths: [16, 17, 18, 19],
    patterns: [[401178, 401179], 431274, 438935, 451416, 457393, [457631, 457632], [506707, 506708], 506715, [506717, 506736], [506739, 506748], 506753, [506774, 506778], [509e3, 509014], [509020, 509807], [509831, 509879], [509897, 509900], [509918, 509964], [509971, 509986], [509995, 509999], 627780, 636297, 636368, [650031, 650033], [650035, 650051], [650057, 650081], [650405, 650439], [650485, 650538], [650552, 650598], [650720, 650727], [650901, 650922], 650928, [650938, 650939], [650946, 650978], [651652, 651704], [655e3, 655019], [655021, 655058]],
    gaps: [4, 8, 12],
    code: {
        name: "CVE",
        size: 3
    }
}, {
    niceType: "JCB",
    type: "jcb",
    patterns: [35],
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
        name: "CVV",
        size: 3
    }
}, {
    niceType: "Visa",
    type: "visa",
    patterns: [4],
    gaps: [4, 8, 12],
    lengths: [13, 16, 19],
    code: {
        name: "CVV",
        size: 3
    }
}, {
    lengths: [12, 13, 14, 15, 16, 17, 18, 19],
    patterns: [51, 52, 53, 54, 55, [222100, 272099]],
    niceType: "Mastercard",
    type: "mastercard",
    gaps: [4, 8, 12],
    code: {
        name: "CVC",
        size: 3
    }
}, {
    niceType: "UnionPay",
    type: "unionpay",
    patterns: [601382, 601428, 602969, 603265, 603367, 603601, 603694, 603708, 613507, 62, 632062, 685800, [690750, 690759], 940046, 990027, [998800, 998802]],
    gaps: [4, 8, 12],
    lengths: [16, 17, 18, 19],
    code: {
        name: "CVN",
        size: 3
    }
}, {
    code: {
        name: "",
        size: 0
    },
    gaps: [4, 8, 12],
    lengths: [15],
    patterns: [[1001, 1999]],
    niceType: "UATP",
    type: "uatp"
}];
ea.forEach(function(t) {
    nr.addCard(t)
});
var ir = {};
Object.defineProperty(ir, "__esModule", {
    value: !0
});
var tn = ir.cardholderName = void 0
  , ta = /^[\d\s-]*$/
  , ra = 255;
function lt(t, r) {
    return {
        isValid: t,
        isPotentiallyValid: r
    }
}
function na(t) {
    return typeof t != "string" ? lt(!1, !1) : t.length === 0 ? lt(!1, !0) : t.length > ra ? lt(!1, !1) : ta.test(t) ? lt(!1, !0) : lt(!0, !0)
}
tn = ir.cardholderName = na;
var ar = {}
  , kt = {}
  , ct = {};
Object.defineProperty(ct, "__esModule", {
    value: !0
});
var sr = ct.expirationYear = void 0
  , ia = 19;
function Re(t, r, s) {
    return {
        isValid: t,
        isPotentiallyValid: r,
        isCurrentYear: s || !1
    }
}
function aa(t, r) {
    r === void 0 && (r = ia);
    var s;
    if (typeof t != "string")
        return Re(!1, !1);
    if (t.replace(/\s/g, "") === "")
        return Re(!1, !0);
    if (!/^\d*$/.test(t))
        return Re(!1, !1);
    var d = t.length;
    if (d < 2)
        return Re(!1, !0);
    var u = new Date().getFullYear();
    if (d === 3) {
        var A = t.slice(0, 2)
          , _ = String(u).slice(0, 2);
        return Re(!1, A === _)
    }
    if (d > 4)
        return Re(!1, !1);
    var D = parseInt(t, 10)
      , k = Number(String(u).substr(2, 2))
      , g = !1;
    if (d === 2) {
        if (String(u).substr(0, 2) === t)
            return Re(!1, !0);
        s = k === D,
        g = D >= k && D <= k + r
    } else
        d === 4 && (s = u === D,
        g = D >= u && D <= u + r);
    return Re(g, g, s)
}
sr = ct.expirationYear = aa;
var Mt = {};
Object.defineProperty(Mt, "__esModule", {
    value: !0
}),
Mt.isArray = void 0,
Mt.isArray = Array.isArray || function(t) {
    return Object.prototype.toString.call(t) === "[object Array]"
}
,
Object.defineProperty(kt, "__esModule", {
    value: !0
}),
kt.parseDate = void 0;
var sa = ct
  , oa = Mt;
function ua(t) {
    var r = Number(t[0]), s;
    return r === 0 ? 2 : r > 1 || r === 1 && Number(t[1]) > 2 ? 1 : r === 1 ? (s = t.substr(1),
    (0,
    sa.expirationYear)(s).isPotentiallyValid ? 1 : 2) : t.length === 5 ? 1 : t.length > 5 ? 2 : 1
}
function la(t) {
    var r;
    if (/^\d{4}-\d{1,2}$/.test(t) ? r = t.split("-").reverse() : /\//.test(t) ? r = t.split(/\s*\/\s*/g) : /\s/.test(t) && (r = t.split(/ +/g)),
    (0,
    oa.isArray)(r))
        return {
            month: r[0] || "",
            year: r.slice(1).join()
        };
    var s = ua(t)
      , d = t.substr(0, s);
    return {
        month: d,
        year: t.substr(d.length)
    }
}
kt.parseDate = la;
var Dt = {};
Object.defineProperty(Dt, "__esModule", {
    value: !0
});
var or = Dt.expirationMonth = void 0;
function ft(t, r, s) {
    return {
        isValid: t,
        isPotentiallyValid: r,
        isValidForThisYear: s || !1
    }
}
function ca(t) {
    var r = new Date().getMonth() + 1;
    if (typeof t != "string")
        return ft(!1, !1);
    if (t.replace(/\s/g, "") === "" || t === "0")
        return ft(!1, !0);
    if (!/^\d*$/.test(t))
        return ft(!1, !1);
    var s = parseInt(t, 10);
    if (isNaN(Number(t)))
        return ft(!1, !1);
    var d = s > 0 && s < 13;
    return ft(d, d, d && s >= r)
}
or = Dt.expirationMonth = ca;
var ur = ue && ue.__assign || function() {
    return ur = Object.assign || function(t) {
        for (var r, s = 1, d = arguments.length; s < d; s++) {
            r = arguments[s];
            for (var u in r)
                Object.prototype.hasOwnProperty.call(r, u) && (t[u] = r[u])
        }
        return t
    }
    ,
    ur.apply(this, arguments)
}
;
Object.defineProperty(ar, "__esModule", {
    value: !0
});
var Ut = ar.expirationDate = void 0
  , fa = kt
  , ha = Dt
  , pa = ct;
function ht(t, r, s, d) {
    return {
        isValid: t,
        isPotentiallyValid: r,
        month: s,
        year: d
    }
}
function da(t, r) {
    var s;
    if (typeof t == "string")
        t = t.replace(/^(\d\d) (\d\d(\d\d)?)$/, "$1/$2"),
        s = (0,
        fa.parseDate)(String(t));
    else if (t !== null && le(t) === "object") {
        var d = ur({}, t);
        s = {
            month: String(d.month),
            year: String(d.year)
        }
    } else
        return ht(!1, !1, null, null);
    var u = (0,
    ha.expirationMonth)(s.month)
      , A = (0,
    pa.expirationYear)(s.year, r);
    if (u.isValid) {
        if (A.isCurrentYear) {
            var _ = u.isValidForThisYear;
            return ht(_, _, s.month, s.year)
        }
        if (A.isValid)
            return ht(!0, !0, s.month, s.year)
    }
    return u.isPotentiallyValid && A.isPotentiallyValid ? ht(!1, !0, null, null) : ht(!1, !1, null, null)
}
Ut = ar.expirationDate = da;
var lr = {};
Object.defineProperty(lr, "__esModule", {
    value: !0
});
var Vt = lr.cvv = void 0
  , rn = 3;
function ga(t, r) {
    for (var s = 0; s < t.length; s++)
        if (r === t[s])
            return !0;
    return !1
}
function ya(t) {
    for (var r = rn, s = 0; s < t.length; s++)
        r = t[s] > r ? t[s] : r;
    return r
}
function Ge(t, r) {
    return {
        isValid: t,
        isPotentiallyValid: r
    }
}
function va(t, r) {
    return r === void 0 && (r = rn),
    r = r instanceof Array ? r : [r],
    typeof t != "string" || !/^\d*$/.test(t) ? Ge(!1, !1) : ga(r, t.length) ? Ge(!0, !0) : t.length < Math.min.apply(null, r) ? Ge(!1, !0) : t.length > ya(r) ? Ge(!1, !1) : Ge(!0, !0)
}
Vt = lr.cvv = va;
var cr = {};
Object.defineProperty(cr, "__esModule", {
    value: !0
});
var fr = cr.postalCode = void 0
  , ma = 3
  , Ea = new RegExp(/^[a-z0-9]+$/i);
function Ft(t, r) {
    return {
        isValid: t,
        isPotentiallyValid: r
    }
}
function ba(t, r) {
    r === void 0 && (r = {});
    var s = r.minLength || ma;
    return typeof t != "string" ? Ft(!1, !1) : t.length < s ? Ft(!1, !0) : Ea.test(t.trim().slice(0, s)) ? Ft(!0, !0) : Ft(!1, !0)
}
fr = cr.postalCode = ba;
var Ca = Object.freeze({
    __proto__: null,
    get cardholderName() {
        return tn
    },
    get expirationDate() {
        return Ut
    },
    get expirationMonth() {
        return or
    },
    get expirationYear() {
        return sr
    },
    get cvv() {
        return Vt
    },
    get postalCode() {
        return fr
    }
});
function Aa(t, r) {
    if (t.length !== r.length)
        return !1;
    var s = {};
    return t.forEach(function(d) {
        s[d.type] = !0
    }),
    r.every(function(d) {
        return s.hasOwnProperty(d.type)
    })
}
function Sa(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ""
      , s = {};
    return t.forEach(function(d) {
        s[d] = r + d
    }),
    s
}
var Ia = 19
  , Me = {
    FOCUS: "focus",
    BLUR: "blur",
    EMPTY: "empty",
    NOT_EMPTY: "notEmpty",
    VALIDITY_CHANGE: "validityChange",
    CARD_TYPE_CHANGE: "cardTypeChange",
    INPUT_SUBMIT_REQUEST: "inputSubmitRequest"
}
  , ze = {
    BACK: "before",
    FORWARD: "after"
}
  , Ta = ["-moz-appearance", "-moz-box-shadow", "-moz-osx-font-smoothing", "-moz-tap-highlight-color", "-moz-transition", "-webkit-appearance", "-webkit-box-shadow", "-webkit-font-smoothing", "-webkit-tap-highlight-color", "-webkit-transition", "appearance", "box-shadow", "color", "cursor", "direction", "font", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-weight", "letter-spacing", "line-height", "margin", "margin-top", "margin-right", "margin-bottom", "margin-left", "opacity", "outline", "padding", "padding-top", "padding-right", "padding-bottom", "padding-left", "text-align", "text-shadow", "transition"]
  , qe = {
    cardholderName: {
        name: "cardholder-name",
        label: "Cardholder Name"
    },
    number: {
        name: "credit-card-number",
        label: "Credit Card Number"
    },
    cvv: {
        name: "cvv",
        label: "CVV"
    },
    expirationDate: {
        name: "expiration",
        label: "Expiration Date"
    },
    expirationMonth: {
        name: "expiration-month",
        label: "Expiration Month"
    },
    expirationYear: {
        name: "expiration-year",
        label: "Expiration Year"
    },
    postalCode: {
        name: "postal-code",
        label: "Postal Code"
    },
    partialNumber: {
        name: "partial-number",
        label: "Partial Credit Card Number"
    },
    kcpPin: {
        name: "kcpPin",
        label: "KCP Pin"
    }
}
  , hr = {
    "aria-invalid": "boolean",
    "aria-required": "boolean",
    disabled: "boolean",
    placeholder: "string"
}
  , wa = ["company", "countryCodeNumeric", "countryCodeAlpha2", "countryCodeAlpha3", "countryName", "extendedAddress", "locality", "region", "firstName", "lastName", "postalCode", "streetAddress"]
  , Ba = ["company", "countryCodeNumeric", "countryCodeAlpha2", "countryCodeAlpha3", "countryName", "extendedAddress", "locality", "region", "firstName", "lastName", "postalCode", "streetAddress"]
  , nn = {
    "cardholder-name": "cc-name",
    "credit-card-number": "cc-number",
    expiration: "cc-exp",
    "expiration-month": "cc-exp-month",
    "expiration-year": "cc-exp-year",
    cvv: "cc-csc",
    "postal-code": "billing postal-code",
    "partial-number": "",
    kcpPin: ""
}
  , he = Sa(["ADD_CLASS", "BIN_AVAILABLE", "CARD_FORM_ENTRY_HAS_BEGUN", "CLEAR_FIELD", "FRAME_READY", "INPUT_EVENT", "READY_FOR_CLIENT", "REMOVE_ATTRIBUTE", "REMOVE_CLASS", "REMOVE_FOCUS_INTERCEPTS", "SET_ATTRIBUTE", "SET_MESSAGE", "SET_MONTH_OPTIONS", "TOKENIZATION_REQUEST", "TRIGGER_FOCUS_CHANGE", "TRIGGER_INPUT_FOCUS"], "hosted-fields:");
function Na(t) {
    return t ? t.replace(/[-\s]/g, "") : ""
}
function _a(t) {
    for (var r = 0, s = !1, d = t.length - 1, u; d >= 0; )
        u = parseInt(t.charAt(d), 10),
        s && (u *= 2,
        u > 9 && (u = u % 10 + 1)),
        s = !s,
        r += u,
        d--;
    return r % 10 === 0
}
var Ra = _a
  , an = me(Ra);
function De(t, r, s) {
    return {
        card: t,
        isPotentiallyValid: r,
        isValid: s
    }
}
function La(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, s, d, u;
    if (typeof t != "string" && typeof t != "number")
        return De(null, !1, !1);
    var A = String(t).replace(/-|\s/g, "");
    if (!/^\d*$/.test(A))
        return De(null, !1, !1);
    var _ = Pt(A);
    if (_.length === 0)
        return De(null, !0, A.length >= 12 && an(A));
    if (_.length !== 1)
        return De(null, !0, !1);
    var D = _[0];
    if (r.maxLength && A.length > r.maxLength)
        return De(D, !1, !1);
    r.skipLuhnValidation === !0 || D.type === "unionpay" && r.luhnValidateUnionPay !== !0 ? d = !0 : d = an(A),
    u = Math.max.apply(null, D.lengths),
    r.maxLength && (u = Math.min(r.maxLength, u));
    for (var k = 0; k < D.lengths.length; k++)
        if (D.lengths[k] === A.length)
            return s = A.length < u || d,
            De(D, s, d);
    return De(D, A.length < u, !1)
}
var pr = !1
  , Oa = ["cardholderName", "number", "cvv", "postalCode", "expirationMonth", "expirationYear", "partialNumber", "kcpPin"]
  , xa = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u;
        return ce(this, s),
        u = r.call(this),
        u._fieldKeys = Object.keys(d.fields).filter(function(A) {
            return qe.hasOwnProperty(A)
        }),
        u.configuration = d,
        u.setSupportedCardTypes(d.supportedCardTypes),
        u._attributes = u.resetAttributes(),
        u._fieldKeys.forEach(function(A) {
            var _ = function() {
                u.emitEvent(A, Me.VALIDITY_CHANGE)
            };
            u.on("change:".concat(A, ".value"), function() {
                u.set("".concat(A, ".isEmpty"), u.get("".concat(A, ".value")) === ""),
                u.validateField(A)
            }),
            u.on("change:".concat(A, ".isFocused"), function(D) {
                pr || (pr = !0,
                window.bus.emit(he.CARD_FORM_ENTRY_HAS_BEGUN)),
                u._fieldKeys.forEach(function(k) {
                    k !== A && u.set("".concat(k, ".isFocused"), !1)
                }),
                u.emitEvent(A, D ? Me.FOCUS : Me.BLUR)
            }),
            u.on("change:".concat(A, ".isEmpty"), function() {
                var D = u.get("".concat(A, ".isEmpty")) ? Me.EMPTY : Me.NOT_EMPTY;
                u.emitEvent(A, D)
            }),
            u.on("change:".concat(A, ".isValid"), _),
            u.on("change:".concat(A, ".isPotentiallyValid"), _)
        }),
        u.on("change:number.value", u._onNumberChange.bind(Ke(u))),
        u.on("change:possibleCardTypes", function() {
            u.validateField("cvv")
        }),
        u.on("change:possibleCardTypes", function() {
            u.emitEvent("number", Me.CARD_TYPE_CHANGE)
        }),
        u
    }
    return fe(s, [{
        key: "setSupportedCardTypes",
        value: function(u) {
            var A = this, _;
            u ? (_ = [],
            Object.keys(u).forEach(function(D) {
                u[D] && _.push(D)
            })) : _ = Pt("").map(function(D) {
                return D.type
            }),
            this.supportedCardTypes = {},
            _.forEach(function(D) {
                A.supportedCardTypes[D] = !0
            })
        }
    }, {
        key: "isSupportedCardType",
        value: function(u) {
            return !!this.supportedCardTypes[u.type]
        }
    }, {
        key: "resetAttributes",
        value: function() {
            var u = this
              , A = (new Date().getMonth() + 1).toString()
              , _ = new Date().getFullYear().toString()
              , D = {
                possibleCardTypes: this.getCardTypes("")
            };
            return this._fieldKeys.forEach(function(k) {
                var g = u.configuration.fields[k]
                  , i = g.select != null
                  , a = g.placeholder != null
                  , y = {
                    value: "",
                    isFocused: !1,
                    isValid: !1,
                    isPotentiallyValid: !0,
                    isEmpty: !0
                };
                i && !a && (k === "expirationMonth" ? y.value = A : k === "expirationYear" && (y.value = _),
                (k === "expirationMonth" || k === "expirationYear") && (y.isValid = !0)),
                y.isEmpty = y.value === "",
                D[k] = y
            }),
            D
        }
    }, {
        key: "emitEvent",
        value: function(u, A) {
            var _ = this
              , D = this.get("possibleCardTypes")
              , k = {};
            this._fieldKeys.forEach(function(i) {
                var a = _.get(i);
                k[i] = {
                    isEmpty: a.isEmpty,
                    isValid: a.isValid,
                    isPotentiallyValid: a.isPotentiallyValid,
                    isFocused: a.isFocused
                }
            });
            var g = D.map(function(i) {
                return {
                    niceType: i.niceType,
                    type: i.type,
                    code: i.code,
                    supported: _.isSupportedCardType(i)
                }
            });
            window.bus.emit(he.INPUT_EVENT, {
                merchantPayload: {
                    cards: g,
                    emittedBy: u,
                    fields: k
                },
                type: A
            })
        }
    }, {
        key: "_onSplitDateChange",
        value: function() {
            var u = this.get("expirationMonth.value")
              , A = this.get("expirationYear.value")
              , _ = or(u)
              , D = sr(A);
            if (_.isValid && D.isValid) {
                var k = Ut(u + A);
                this.set("expirationMonth.isValid", k.isValid),
                this.set("expirationMonth.isPotentiallyValid", k.isPotentiallyValid),
                this.set("expirationYear.isValid", k.isValid),
                this.set("expirationYear.isPotentiallyValid", k.isPotentiallyValid)
            } else
                this.set("expirationMonth.isValid", _.isValid),
                this.set("expirationMonth.isPotentiallyValid", _.isPotentiallyValid),
                this.set("expirationYear.isValid", D.isValid),
                this.set("expirationYear.isPotentiallyValid", D.isPotentiallyValid)
        }
    }, {
        key: "_onNumberChange",
        value: function(u, A) {
            var _ = this.getCardTypes(u)
              , D = this.get("possibleCardTypes")
              , k = on(u)
              , g = k.length === 6
              , i = on(A.old)
              , a = i.length < 6
              , y = k !== i;
            Aa(_, D) || this.set("possibleCardTypes", _),
            (a || y) && g && window.bus.emit(he.BIN_AVAILABLE, k)
        }
    }, {
        key: "validateField",
        value: function(u) {
            var A, _ = this.get("".concat(u, ".value"));
            if (u === "cvv") {
                var D, k;
                A = this._validateCvv(_, {
                    minLength: (D = this.configuration.fields.cvv) === null || D === void 0 ? void 0 : D.minlength,
                    maxLength: (k = this.configuration.fields.cvv) === null || k === void 0 ? void 0 : k.maxlength
                })
            } else if (u === "postalCode") {
                var g;
                A = fr(_, {
                    minLength: (g = this.configuration.fields.postalCode) === null || g === void 0 ? void 0 : g.minlength
                })
            } else if (u === "expirationDate")
                A = Ut(sn(_));
            else if (u === "number")
                A = this._validateNumber(_);
            else if (u === "partialNumber") {
                var i, a, y = _.length, U = (i = (a = this.configuration.fields.partialNumber) === null || a === void 0 ? void 0 : a.partialNumberLength) !== null && i !== void 0 ? i : 4;
                A = {
                    isValid: y === U,
                    isPotentiallyValid: y <= U
                }
            } else if (u === "kcpPin") {
                var e = _.length
                  , v = 2;
                A = {
                    isValid: e === v,
                    isPotentiallyValid: e <= v
                }
            } else
                A = Ca[u](_);
            u === "expirationMonth" || u === "expirationYear" ? this._onSplitDateChange() : (this.set("".concat(u, ".isValid"), A.isValid),
            this.set("".concat(u, ".isPotentiallyValid"), A.isPotentiallyValid))
        }
    }, {
        key: "_validateNumber",
        value: function(u) {
            var A = La(u, {
                luhnValidateUnionPay: !0,
                maxLength: this.configuration.fields.number.maxCardLength
            })
              , _ = A.card
              , D = this.getCardTypes(u).filter(function(g) {
                return _ && g.type === _.type
            })
              , k = D[0];
            return k && this.isSupportedCardType(k) === !1 && (delete A.card,
            A.isValid = !1,
            A.isPotentiallyValid = !1),
            A
        }
    }, {
        key: "_validateCvv",
        value: function(u) {
            var A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}
              , _ = A.minLength || 3
              , D = A.maxLength || 4;
            if (this._fieldKeys.indexOf("number") === -1) {
                for (var k = [], g = _; g <= D; g += 1)
                    k.push(g);
                return Vt(u, k)
            }
            var i = this.get("possibleCardTypes").map(function(a) {
                return a.code.size
            });
            return i = Pa(i),
            i.length === 0 && i.push(3, 4),
            Vt(u, i)
        }
    }, {
        key: "getCardData",
        value: function(u) {
            var A = this
              , _ = {};
            u = this._filterCustomFieldKeys(u);
            var D = Oa.filter(function(g) {
                return u.indexOf(g) !== -1
            });
            if (u.indexOf("expirationDate") !== -1) {
                var k = sn(this.get("expirationDate.value"));
                _.expirationMonth = k.month,
                _.expirationYear = k.year
            }
            return D.forEach(function(g) {
                _[g] = A.get("".concat(g, ".value"))
            }),
            _
        }
    }, {
        key: "isEmpty",
        value: function(u) {
            var A = this
              , _ = this._filterCustomFieldKeys(u);
            return _.every(function(D) {
                return A.get(D).value.length === 0
            })
        }
    }, {
        key: "invalidFieldKeys",
        value: function(u) {
            var A = this
              , _ = this._filterCustomFieldKeys(u);
            return _.filter(function(D) {
                return !A.get(D).isValid
            })
        }
    }, {
        key: "getCardTypes",
        value: function(u) {
            return Pt(Na(u))
        }
    }, {
        key: "applyAutofillValues",
        value: function(u) {
            var A = this;
            this._fieldKeys.forEach(function(_) {
                var D;
                _ === "number" || _ === "cvv" || _ === "expirationMonth" || _ === "expirationYear" || _ === "cardholderName" ? D = u[_] : _ === "expirationDate" && u.expirationMonth && u.expirationYear && (D = u.expirationMonth + " / " + u.expirationYear),
                D && A._emit("autofill:".concat(_), D)
            })
        }
    }, {
        key: "_resetCardFormHasStartedBeingFilled",
        value: function() {
            pr = !1
        }
    }, {
        key: "_filterCustomFieldKeys",
        value: function(u) {
            var A = this;
            return u ? u.filter(function(_) {
                return A._fieldKeys.indexOf(_) > -1
            }) : this._fieldKeys
        }
    }]),
    s
}(Mi);
function Pa(t) {
    return t.filter(function(r, s, d) {
        return d.indexOf(r) === s
    })
}
function sn(t) {
    var r, s, d;
    return t = t.replace(/[\/\-\s]/g, ""),
    d = t.charAt(0),
    t.length === 0 ? r = s = "" : d === "0" || d === "1" ? (r = t.slice(0, 2),
    s = t.slice(2)) : (r = "0" + d,
    s = t.slice(1)),
    {
        month: r,
        year: s
    }
}
function on(t) {
    return (t || "").substr(0, 6)
}
var ka = {
    type: pe.types.CUSTOMER,
    code: "HOSTED_FIELDS_FAILED_TOKENIZATION",
    message: "The supplied card data failed tokenization."
}
  , Ma = {
    type: pe.types.CUSTOMER,
    code: "HOSTED_FIELDS_FIELDS_EMPTY",
    message: "All fields are empty. Cannot tokenize empty card fields."
}
  , dr = {
    type: pe.types.CUSTOMER,
    code: "HOSTED_FIELDS_FIELDS_INVALID",
    message: "Some payment input fields are invalid. Cannot tokenize invalid card fields."
}
  , un = {
    type: pe.types.MERCHANT,
    code: "HOSTED_FIELDS_ATTRIBUTE_NOT_SUPPORTED"
}
  , ln = {
    type: pe.types.MERCHANT,
    code: "HOSTED_FIELDS_ATTRIBUTE_VALUE_NOT_ALLOWED"
}
  , gr = {
    type: pe.types.MERCHANT,
    code: "HOSTED_FIELDS_NAMESPACE_MISSING",
    message: "Cannot tokenize partialNumber field without payment card namespace."
};
function cn(t, r) {
    var s;
    return hr.hasOwnProperty(t) ? r != null && !Da(t, r) && (s = new pe({
        type: ln.type,
        code: ln.code,
        message: 'Value "'.concat(r, '" is not allowed for "').concat(t, '" attribute.')
    })) : s = new pe({
        type: un.type,
        code: un.code,
        message: 'The "'.concat(t, '" attribute is not supported in Hosted Fields.')
    }),
    s
}
function Da(t, r) {
    return hr[t] === "string" ? typeof r == "string" || typeof r == "number" : hr[t] === "boolean" ? String(r) === "true" || String(r) === "false" : !1
}
var fn = !1;
try {
    var hn = Object.defineProperty({}, "passive", {
        get: function() {
            fn = !0
        }
    });
    window.addEventListener("testPassive", null, hn),
    window.removeEventListener("testPassive", null, hn)
} catch (t) {}
var Ua = fn
  , Va = function(r) {
    return r = r || window.navigator.userAgent,
    /Android/i.test(r)
}
  , pn = me(Va)
  , Fa = function(r) {
    return r = r || window.navigator.userAgent,
    /CrOS/i.test(r)
}
  , dn = me(Fa)
  , ja = function(r, s) {
    return r = r || window.navigator.userAgent,
    s = s || window.document,
    /Mac|iPad/i.test(r) && "ontouchend"in s
}
  , Ka = ja
  , yr = function(r, s, d) {
    s === void 0 && (s = !0),
    r = r || window.navigator.userAgent;
    var u = /iPhone|iPod|iPad/i.test(r);
    return s ? u || Ka(r, d) : u
}
  , vr = me(yr)
  , Ga = function(r) {
    return r = r || window.navigator.userAgent,
    r.indexOf("Edge/") !== -1 || r.indexOf("Edg/") !== -1
}
  , za = function(r) {
    return r = r || window.navigator.userAgent,
    /SamsungBrowser/i.test(r)
}
  , qa = function(r) {
    return r = r || window.navigator.userAgent,
    r.indexOf("DuckDuckGo/") !== -1
}
  , Qa = function(r) {
    return r = r || window.navigator.userAgent,
    r.indexOf("OPR/") !== -1 || r.indexOf("Opera/") !== -1 || r.indexOf("OPT/") !== -1
}
  , Ha = function(r) {
    return r = r || window.navigator.userAgent,
    r.indexOf("Silk/") !== -1
}
  , Ya = Ga
  , Wa = za
  , Xa = qa
  , Za = Qa
  , Ja = Ha
  , $a = function(r) {
    return r = r || window.navigator.userAgent,
    (r.indexOf("Chrome") !== -1 || r.indexOf("CriOS") !== -1) && !Ya(r) && !Wa(r) && !Xa(r) && !Za(r) && !Ja(r)
}
  , es = me($a)
  , ts = function(r) {
    return r = r || window.navigator.userAgent,
    /Firefox/i.test(r)
}
  , rs = me(ts)
  , ns = yr;
function is(t) {
    return /\bGSA\b/.test(t)
}
var as = function(r) {
    return r = r || window.navigator.userAgent,
    ns(r) && is(r)
}
  , ss = yr
  , os = as
  , us = function(r) {
    return r = r || window.navigator.userAgent,
    ss(r) ? os(r) ? !0 : /.+AppleWebKit(?!.*Safari)/i.test(r) : !1
}
  , ls = me(us);
function cs() {
    return pn() || dn() || vr()
}
function fs() {
    return es() && vr()
}
var Qe = {
    isAndroid: pn,
    isChromeOS: dn,
    isChromeIos: fs,
    isFirefox: rs,
    isIos: vr,
    isIosWebview: ls,
    hasSoftwareKeyboard: cs
}
  , Ce = {}
  , hs = function(r) {
    return r = r || window.navigator.userAgent,
    /Android/i.test(r)
}
  , ps = hs
  , ds = function(r) {
    return r = r || window.navigator.userAgent,
    /CrOS/i.test(r)
}
  , gs = ds
  , ys = function(r) {
    return r = r || window.navigator.userAgent,
    r.indexOf("Edge/") !== -1
}
  , vs = function(r) {
    return r = r || window.navigator.userAgent,
    /SamsungBrowser/i.test(r)
}
  , ms = function(r) {
    return r = r || window.navigator.userAgent,
    r.indexOf("DuckDuckGo/") !== -1
}
  , Es = function(r) {
    return r = r || window.navigator.userAgent,
    r.indexOf("OPR/") !== -1 || r.indexOf("Opera/") !== -1 || r.indexOf("OPT/") !== -1
}
  , bs = function(r) {
    return r = r || window.navigator.userAgent,
    r.indexOf("Silk/") !== -1
}
  , Cs = ys
  , As = vs
  , Ss = ms
  , Is = Es
  , Ts = bs
  , ws = function(r) {
    return r = r || window.navigator.userAgent,
    (r.indexOf("Chrome") !== -1 || r.indexOf("CriOS") !== -1) && !Cs(r) && !As(r) && !Ss(r) && !Is(r) && !Ts(r)
}
  , Bs = ws
  , Ns = function(r, s) {
    return r = r || window.navigator.userAgent,
    s = s || window.document,
    /Mac|iPad/i.test(r) && "ontouchend"in s
}
  , _s = Ns
  , Rs = function(r, s, d) {
    s === void 0 && (s = !0),
    r = r || window.navigator.userAgent;
    var u = /iPhone|iPod|iPad/i.test(r);
    return s ? u || _s(r, d) : u
}
  , Ls = Rs
  , Os = function(r) {
    return r = r || window.navigator.userAgent,
    r.indexOf("MSIE 9") !== -1
}
  , xs = Os;
Object.defineProperty(Ce, "__esModule", {
    value: !0
}),
Ce.isIos = Ce.isIE9 = Ce.isSamsungBrowser = Ce.isAndroidChrome = Ce.isKitKatWebview = void 0;
var mr = typeof window != "undefined" && window.navigator && window.navigator.userAgent
  , gn = ps
  , Ps = gs
  , yn = Bs
  , ks = Ls;
Ce.isIos = ks;
var Ms = xs;
Ce.isIE9 = Ms;
var Ds = /Version\/\d\.\d* Chrome\/\d*\.0\.0\.0/;
function Us(t) {
    return !yn(t) && t.indexOf("Samsung") > -1
}
function Vs(t) {
    return t === void 0 && (t = mr),
    gn(t) && Ds.test(t)
}
Ce.isKitKatWebview = Vs;
function Fs(t) {
    return t === void 0 && (t = mr),
    (gn(t) || Ps(t)) && yn(t)
}
Ce.isAndroidChrome = Fs;
function js(t) {
    return t === void 0 && (t = mr),
    /SamsungBrowser/.test(t) || Us(t)
}
Ce.isSamsungBrowser = js;
var Ks = Ce
  , Gs = function() {
    return !(0,
    Ks.isSamsungBrowser)()
}
  , jt = {}
  , Ue = {}
  , pt = {};
Object.defineProperty(pt, "__esModule", {
    value: !0
}),
pt.StrategyInterface = void 0;
var zs = function() {
    function t(r) {
        this.inputElement = r.element,
        this.isFormatted = !1
    }
    return t
}();
pt.StrategyInterface = zs;
var Ve = {}
  , Te = {};
Object.defineProperty(Te, "__esModule", {
    value: !0
}),
Te.set = Te.get = void 0;
function qs(t) {
    var r = t.selectionStart || 0
      , s = t.selectionEnd || 0;
    return {
        start: r,
        end: s,
        delta: Math.abs(s - r)
    }
}
Te.get = qs;
function Qs(t, r, s) {
    document.activeElement === t && t.setSelectionRange && t.setSelectionRange(r, s)
}
Te.set = Qs,
Object.defineProperty(Ve, "__esModule", {
    value: !0
}),
Ve.keyCannotMutateValue = void 0;
var Hs = Te;
function Ys(t) {
    var r = t.currentTarget || t.srcElement
      , s = (0,
    Hs.get)(r)
      , d = s.start === 0
      , u = s.start === r.value.length
      , A = t.shiftKey === !0;
    switch (t.key) {
    case void 0:
    case "Unidentified":
    case "":
        break;
    case "Backspace":
        return d;
    case "Del":
    case "Delete":
        return u;
    default:
        return t.key.length !== 1
    }
    switch (t.keyCode) {
    case 9:
    case 19:
    case 20:
    case 27:
    case 39:
    case 45:
        return !0;
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 40:
        return !A;
    case 8:
        return d;
    case 46:
        return u;
    default:
        return !1
    }
}
Ve.keyCannotMutateValue = Ys;
var dt = {};
Object.defineProperty(dt, "__esModule", {
    value: !0
}),
dt.isBackspace = void 0;
function Ws(t) {
    return t.key === "Backspace" || t.keyCode === 8
}
dt.isBackspace = Ws;
var Kt = {};
Object.defineProperty(Kt, "__esModule", {
    value: !0
}),
Kt.isDelete = void 0;
var Xs = /^Del(ete)?$/;
function Zs(t) {
    return Xs.test(t.key) || t.keyCode === 46
}
Kt.isDelete = Zs;
var Gt = {}
  , zt = {};
Object.defineProperty(zt, "__esModule", {
    value: !0
}),
zt.parsePattern = void 0;
var vn = /[A-Za-z]/
  , mn = /\d/
  , Js = /./
  , $s = /^[A-Za-z0-9\*]$/
  , En = "({{[^}]+}})"
  , eo = "(\\s|\\S)"
  , to = new RegExp(En + "|" + eo,"g")
  , ro = new RegExp("^" + En + "$")
  , no = new RegExp("{|}","g");
function io(t) {
    return mn.test(t)
}
function ao(t) {
    return vn.test(t)
}
function so(t) {
    return io(t) ? mn : ao(t) ? vn : Js
}
function oo(t) {
    return $s.test(t)
}
function uo(t) {
    return ro.test(t)
}
function lo(t) {
    var r = []
      , s = t.match(to);
    if (!s)
        return r;
    for (var d = 0, u = 0; u < s.length; u++) {
        var A = s[u];
        if (uo(A))
            for (var _ = A.replace(no, "").split(""), D = 0; D < _.length; D++) {
                var k = _[D];
                if (!oo(k))
                    throw new Error("Only alphanumeric or wildcard pattern matchers are allowed");
                r.push({
                    value: so(k),
                    isPermaChar: !1,
                    index: d++
                })
            }
        else
            r.push({
                value: A,
                isPermaChar: !0,
                index: d++
            })
    }
    return r
}
zt.parsePattern = lo,
Object.defineProperty(Gt, "__esModule", {
    value: !0
}),
Gt.PatternFormatter = void 0;
var co = zt
  , fo = dt
  , ho = function() {
    function t(r) {
        this.pattern = (0,
        co.parsePattern)(r)
    }
    return t.prototype.format = function(r) {
        for (var s = r.value, d = 0, u = "", A = {
            start: r.selection.start,
            end: r.selection.end
        }, _ = 0; _ < this.pattern.length; _++) {
            var D = this.pattern[_]
              , k = s[d];
            if (d > s.length)
                break;
            if (typeof D.value == "string")
                (k != null || u.length === D.index) && (u += D.value,
                D.index <= A.start && A.start++,
                D.index <= A.end && A.end++);
            else
                for (; d < s.length; d++)
                    if (k = s[d],
                    D.value.test(k)) {
                        u += k,
                        d++;
                        break
                    } else
                        D.index <= A.start && A.start--,
                        D.index <= A.end && A.end--
        }
        return {
            value: u,
            selection: A
        }
    }
    ,
    t.prototype.unformat = function(r) {
        for (var s = r.selection.start, d = r.selection.end, u = "", A = 0; A < this.pattern.length; A++) {
            var _ = this.pattern[A];
            if (typeof _.value != "string" && r.value[A] != null && _.value.test(r.value[A])) {
                u += r.value[A];
                continue
            }
            _.value === r.value[_.index] && (_.index < r.selection.start && s--,
            _.index < r.selection.end && d--)
        }
        return {
            selection: {
                start: s,
                end: d
            },
            value: u
        }
    }
    ,
    t.prototype.simulateDeletion = function(r) {
        var s, d, u = this.unformat(r), A = u.value, _ = u.selection, D = Math.abs(u.selection.end - u.selection.start);
        return D ? (s = _.start,
        d = _.end) : (0,
        fo.isBackspace)(r.event) ? (s = Math.max(0, _.start - 1),
        d = _.start) : (s = _.start,
        d = Math.min(A.length, _.start + 1)),
        {
            selection: {
                start: s,
                end: s
            },
            value: A.substr(0, s) + A.substr(d)
        }
    }
    ,
    t
}();
Gt.PatternFormatter = ho;
var po = ue && ue.__extends || function() {
    var t = function(s, d) {
        return t = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(u, A) {
            u.__proto__ = A
        }
        || function(u, A) {
            for (var _ in A)
                Object.prototype.hasOwnProperty.call(A, _) && (u[_] = A[_])
        }
        ,
        t(s, d)
    };
    return function(r, s) {
        if (typeof s != "function" && s !== null)
            throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
        t(r, s);
        function d() {
            this.constructor = r
        }
        r.prototype = s === null ? Object.create(s) : (d.prototype = s.prototype,
        new d)
    }
}();
Object.defineProperty(Ue, "__esModule", {
    value: !0
}),
Ue.BaseStrategy = void 0;
var go = pt
  , bn = Ve
  , Fe = Te
  , yo = dt
  , vo = Kt
  , Cn = Gt;
function An(t) {
    return !t.key && !t.keyCode
}
var mo = function(t) {
    po(r, t);
    function r(s) {
        var d = t.call(this, s) || this;
        return d.hasKeypressEvent = !1,
        d.formatter = new Cn.PatternFormatter(s.pattern),
        d.onPasteEvent = s.onPasteEvent,
        d.attachListeners(),
        d.formatIfNotEmpty(),
        d
    }
    return r.prototype.getUnformattedValue = function(s) {
        var d = this.inputElement.value;
        return (s || this.isFormatted) && (d = this.formatter.unformat({
            value: this.inputElement.value,
            selection: {
                start: 0,
                end: 0
            }
        }).value),
        d
    }
    ,
    r.prototype.formatIfNotEmpty = function() {
        this.inputElement.value && this.reformatInput()
    }
    ,
    r.prototype.setPattern = function(s) {
        this.unformatInput(),
        this.formatter = new Cn.PatternFormatter(s),
        this.formatIfNotEmpty()
    }
    ,
    r.prototype.attachListeners = function() {
        var s = this;
        this.inputElement.addEventListener("keydown", function(d) {
            var u = d;
            An(u) && (s.isFormatted = !1),
            !(0,
            bn.keyCannotMutateValue)(u) && s.isDeletion(u) && s.unformatInput()
        }),
        this.inputElement.addEventListener("keypress", function(d) {
            s.hasKeypressEvent = !0,
            s.onKeypress(d)
        }),
        this.inputElement.addEventListener("keyup", function() {
            s.reformatInput(),
            s.hasKeypressEvent = !1
        }),
        this.inputElement.addEventListener("input", function(d) {
            var u = d;
            s.hasKeypressEvent || s.onKeypress(d),
            (u instanceof CustomEvent || !u.isTrusted) && (s.isFormatted = !1),
            s.reformatInput()
        }),
        this.inputElement.addEventListener("paste", function(d) {
            s.pasteEventHandler(d)
        })
    }
    ,
    r.prototype.isDeletion = function(s) {
        return (0,
        vo.isDelete)(s) || (0,
        yo.isBackspace)(s)
    }
    ,
    r.prototype.reformatInput = function() {
        if (!this.isFormatted) {
            this.isFormatted = !0;
            var s = this.inputElement
              , d = this.formatter.format({
                selection: (0,
                Fe.get)(s),
                value: s.value
            });
            s.value = d.value,
            (0,
            Fe.set)(s, d.selection.start, d.selection.end),
            this.afterReformatInput(d)
        }
    }
    ,
    r.prototype.afterReformatInput = function(s) {}
    ,
    r.prototype.unformatInput = function() {
        if (this.isFormatted) {
            this.isFormatted = !1;
            var s = this.inputElement
              , d = (0,
            Fe.get)(s)
              , u = this.formatter.unformat({
                selection: d,
                value: s.value
            });
            s.value = u.value,
            (0,
            Fe.set)(s, u.selection.start, u.selection.end)
        }
    }
    ,
    r.prototype.prePasteEventHandler = function(s) {
        s.preventDefault()
    }
    ,
    r.prototype.postPasteEventHandler = function() {
        this.reformatAfterPaste()
    }
    ,
    r.prototype.pasteEventHandler = function(s) {
        var d, u = "";
        this.prePasteEventHandler(s),
        this.unformatInput(),
        s.clipboardData ? u = s.clipboardData.getData("Text") : window.clipboardData && (u = window.clipboardData.getData("Text"));
        var A = (0,
        Fe.get)(this.inputElement);
        d = this.inputElement.value.split(""),
        d.splice(A.start, A.end - A.start, u),
        d = d.join(""),
        this.onPasteEvent && this.onPasteEvent({
            unformattedInputValue: d
        }),
        this.inputElement.value = d,
        (0,
        Fe.set)(this.inputElement, A.start + u.length, A.start + u.length),
        this.postPasteEventHandler()
    }
    ,
    r.prototype.reformatAfterPaste = function() {
        var s = document.createEvent("Event");
        this.reformatInput(),
        s.initEvent("input", !0, !0),
        this.inputElement.dispatchEvent(s)
    }
    ,
    r.prototype.getStateToFormat = function() {
        var s = this.inputElement
          , d = (0,
        Fe.get)(s)
          , u = {
            selection: d,
            value: s.value
        };
        return this.stateToFormat ? (u = this.stateToFormat,
        delete this.stateToFormat) : d.start === s.value.length && this.isFormatted && (u = this.formatter.unformat(u)),
        u
    }
    ,
    r.prototype.onKeypress = function(s) {
        An(s) && (this.isFormatted = !1),
        !(0,
        bn.keyCannotMutateValue)(s) && this.unformatInput()
    }
    ,
    r
}(go.StrategyInterface);
Ue.BaseStrategy = mo;
var Eo = ue && ue.__extends || function() {
    var t = function(s, d) {
        return t = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(u, A) {
            u.__proto__ = A
        }
        || function(u, A) {
            for (var _ in A)
                Object.prototype.hasOwnProperty.call(A, _) && (u[_] = A[_])
        }
        ,
        t(s, d)
    };
    return function(r, s) {
        if (typeof s != "function" && s !== null)
            throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
        t(r, s);
        function d() {
            this.constructor = r
        }
        r.prototype = s === null ? Object.create(s) : (d.prototype = s.prototype,
        new d)
    }
}();
Object.defineProperty(jt, "__esModule", {
    value: !0
}),
jt.IosStrategy = void 0;
var bo = Ue
  , Co = Ve
  , Sn = Te
  , Ao = function(t) {
    Eo(r, t);
    function r() {
        return t !== null && t.apply(this, arguments) || this
    }
    return r.prototype.getUnformattedValue = function() {
        return t.prototype.getUnformattedValue.call(this, !0)
    }
    ,
    r.prototype.attachListeners = function() {
        var s = this;
        this.inputElement.addEventListener("keydown", function(d) {
            s.keydownListener(d)
        }),
        this.inputElement.addEventListener("input", function(d) {
            var u = d instanceof CustomEvent;
            u && (s.stateToFormat = {
                selection: {
                    start: 0,
                    end: 0
                },
                value: s.inputElement.value
            }),
            s.formatListener(),
            u || s.fixLeadingBlankSpaceOnIos()
        }),
        this.inputElement.addEventListener("focus", function() {
            s.formatListener()
        }),
        this.inputElement.addEventListener("paste", function(d) {
            s.pasteEventHandler(d)
        })
    }
    ,
    r.prototype.fixLeadingBlankSpaceOnIos = function() {
        var s = this.inputElement;
        s.value === "" && setTimeout(function() {
            s.value = ""
        }, 0)
    }
    ,
    r.prototype.formatListener = function() {
        var s = this.inputElement
          , d = this.getStateToFormat()
          , u = this.formatter.format(d);
        s.value = u.value,
        (0,
        Sn.set)(s, u.selection.start, u.selection.end)
    }
    ,
    r.prototype.keydownListener = function(s) {
        (0,
        Co.keyCannotMutateValue)(s) || this.isDeletion(s) && (this.stateToFormat = this.formatter.simulateDeletion({
            event: s,
            selection: (0,
            Sn.get)(this.inputElement),
            value: this.inputElement.value
        }))
    }
    ,
    r
}(bo.BaseStrategy);
jt.IosStrategy = Ao;
var gt = {}
  , So = ue && ue.__extends || function() {
    var t = function(s, d) {
        return t = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(u, A) {
            u.__proto__ = A
        }
        || function(u, A) {
            for (var _ in A)
                Object.prototype.hasOwnProperty.call(A, _) && (u[_] = A[_])
        }
        ,
        t(s, d)
    };
    return function(r, s) {
        if (typeof s != "function" && s !== null)
            throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
        t(r, s);
        function d() {
            this.constructor = r
        }
        r.prototype = s === null ? Object.create(s) : (d.prototype = s.prototype,
        new d)
    }
}();
Object.defineProperty(gt, "__esModule", {
    value: !0
}),
gt.AndroidChromeStrategy = void 0;
var Io = Ve
  , To = Ue
  , wo = Te
  , Bo = function(t) {
    So(r, t);
    function r() {
        return t !== null && t.apply(this, arguments) || this
    }
    return r.prototype.attachListeners = function() {
        var s = this;
        this.inputElement.addEventListener("keydown", function(d) {
            (0,
            Io.keyCannotMutateValue)(d) || s.unformatInput()
        }),
        this.inputElement.addEventListener("keyup", function() {
            s.reformatInput()
        }),
        this.inputElement.addEventListener("input", function() {
            s.reformatInput()
        }),
        this.inputElement.addEventListener("paste", function(d) {
            d.preventDefault(),
            s.pasteEventHandler(d)
        })
    }
    ,
    r.prototype.prePasteEventHandler = function() {}
    ,
    r.prototype.postPasteEventHandler = function() {
        var s = this;
        setTimeout(function() {
            s.reformatAfterPaste()
        }, 0)
    }
    ,
    r.prototype.afterReformatInput = function(s) {
        var d = this.inputElement;
        setTimeout(function() {
            var u = s.selection;
            (0,
            wo.set)(d, u.end, u.end)
        }, 0)
    }
    ,
    r
}(To.BaseStrategy);
gt.AndroidChromeStrategy = Bo;
var qt = {}
  , No = ue && ue.__extends || function() {
    var t = function(s, d) {
        return t = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(u, A) {
            u.__proto__ = A
        }
        || function(u, A) {
            for (var _ in A)
                Object.prototype.hasOwnProperty.call(A, _) && (u[_] = A[_])
        }
        ,
        t(s, d)
    };
    return function(r, s) {
        if (typeof s != "function" && s !== null)
            throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
        t(r, s);
        function d() {
            this.constructor = r
        }
        r.prototype = s === null ? Object.create(s) : (d.prototype = s.prototype,
        new d)
    }
}();
Object.defineProperty(qt, "__esModule", {
    value: !0
}),
qt.KitKatChromiumBasedWebViewStrategy = void 0;
var _o = gt
  , Ro = function(t) {
    No(r, t);
    function r() {
        return t !== null && t.apply(this, arguments) || this
    }
    return r.prototype.reformatInput = function() {
        var s = this;
        setTimeout(function() {
            t.prototype.reformatInput.call(s)
        }, 0)
    }
    ,
    r.prototype.unformatInput = function() {
        var s = this;
        setTimeout(function() {
            t.prototype.unformatInput.call(s)
        }, 0)
    }
    ,
    r
}(_o.AndroidChromeStrategy);
qt.KitKatChromiumBasedWebViewStrategy = Ro;
var Qt = {}
  , Lo = ue && ue.__extends || function() {
    var t = function(s, d) {
        return t = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(u, A) {
            u.__proto__ = A
        }
        || function(u, A) {
            for (var _ in A)
                Object.prototype.hasOwnProperty.call(A, _) && (u[_] = A[_])
        }
        ,
        t(s, d)
    };
    return function(r, s) {
        if (typeof s != "function" && s !== null)
            throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
        t(r, s);
        function d() {
            this.constructor = r
        }
        r.prototype = s === null ? Object.create(s) : (d.prototype = s.prototype,
        new d)
    }
}();
Object.defineProperty(Qt, "__esModule", {
    value: !0
}),
Qt.IE9Strategy = void 0;
var In = Ue
  , Oo = Ve
  , yt = Te;
function Tn(t, r) {
    return {
        start: t.start + r,
        end: t.end + r
    }
}
var xo = function(t) {
    Lo(r, t);
    function r() {
        return t !== null && t.apply(this, arguments) || this
    }
    return r.prototype.getUnformattedValue = function() {
        return In.BaseStrategy.prototype.getUnformattedValue.call(this, !0)
    }
    ,
    r.prototype.attachListeners = function() {
        var s = this;
        this.inputElement.addEventListener("keydown", function(d) {
            s.keydownListener(d)
        }),
        this.inputElement.addEventListener("focus", function() {
            s.format()
        }),
        this.inputElement.addEventListener("paste", function(d) {
            s.pasteEventHandler(d)
        })
    }
    ,
    r.prototype.format = function() {
        var s = this.inputElement
          , d = this.getStateToFormat()
          , u = this.formatter.format(d);
        s.value = u.value,
        (0,
        yt.set)(s, u.selection.start, u.selection.end)
    }
    ,
    r.prototype.keydownListener = function(s) {
        if (!(0,
        Oo.keyCannotMutateValue)(s)) {
            if (s.preventDefault(),
            this.isDeletion(s))
                this.stateToFormat = this.formatter.simulateDeletion({
                    event: s,
                    selection: (0,
                    yt.get)(this.inputElement),
                    value: this.inputElement.value
                });
            else {
                var d = this.inputElement.value
                  , u = (0,
                yt.get)(this.inputElement)
                  , A = d.slice(0, u.start) + s.key + d.slice(u.start);
                u = Tn(u, 1),
                this.stateToFormat = {
                    selection: u,
                    value: A
                },
                u.start === A.length && (this.stateToFormat = this.formatter.unformat(this.stateToFormat))
            }
            this.format()
        }
    }
    ,
    r.prototype.reformatAfterPaste = function() {
        var s = this.inputElement
          , d = (0,
        yt.get)(this.inputElement)
          , u = this.formatter.format({
            selection: d,
            value: s.value
        }).value;
        d = Tn(d, 1),
        s.value = u,
        setTimeout(function() {
            (0,
            yt.set)(s, d.start, d.end)
        }, 0)
    }
    ,
    r
}(In.BaseStrategy);
Qt.IE9Strategy = xo;
var Ht = {}
  , Po = ue && ue.__extends || function() {
    var t = function(s, d) {
        return t = Object.setPrototypeOf || {
            __proto__: []
        }instanceof Array && function(u, A) {
            u.__proto__ = A
        }
        || function(u, A) {
            for (var _ in A)
                Object.prototype.hasOwnProperty.call(A, _) && (u[_] = A[_])
        }
        ,
        t(s, d)
    };
    return function(r, s) {
        if (typeof s != "function" && s !== null)
            throw new TypeError("Class extends value " + String(s) + " is not a constructor or null");
        t(r, s);
        function d() {
            this.constructor = r
        }
        r.prototype = s === null ? Object.create(s) : (d.prototype = s.prototype,
        new d)
    }
}();
Object.defineProperty(Ht, "__esModule", {
    value: !0
}),
Ht.NoopKeyboardStrategy = void 0;
var ko = pt
  , Mo = function(t) {
    Po(r, t);
    function r() {
        return t !== null && t.apply(this, arguments) || this
    }
    return r.prototype.getUnformattedValue = function() {
        return this.inputElement.value
    }
    ,
    r.prototype.setPattern = function() {}
    ,
    r
}(ko.StrategyInterface);
Ht.NoopKeyboardStrategy = Mo;
var Yt = Ce
  , Do = Gs
  , Uo = jt
  , Vo = gt
  , Fo = qt
  , jo = Qt
  , Ko = Ue
  , Go = Ht
  , zo = function() {
    function t(r) {
        t.supportsFormatting() ? (0,
        Yt.isIos)() ? this.strategy = new Uo.IosStrategy(r) : (0,
        Yt.isKitKatWebview)() ? this.strategy = new Fo.KitKatChromiumBasedWebViewStrategy(r) : (0,
        Yt.isAndroidChrome)() ? this.strategy = new Vo.AndroidChromeStrategy(r) : (0,
        Yt.isIE9)() ? this.strategy = new jo.IE9Strategy(r) : this.strategy = new Ko.BaseStrategy(r) : this.strategy = new Go.NoopKeyboardStrategy(r)
    }
    return t.prototype.getUnformattedValue = function() {
        return this.strategy.getUnformattedValue()
    }
    ,
    t.prototype.setPattern = function(r) {
        this.strategy.setPattern(r)
    }
    ,
    t.supportsFormatting = function() {
        return Do()
    }
    ,
    t
}()
  , qo = zo
  , Qo = qo
  , Ho = Qo
  , wn = me(Ho)
  , Yo = function() {
    function t(r) {
        ce(this, t),
        this.inputElement = r.element
    }
    return fe(t, [{
        key: "getUnformattedValue",
        value: function() {
            return this.inputElement.value
        }
    }, {
        key: "setPattern",
        value: function() {}
    }]),
    t
}()
  , Wo = Yo
  , Xo = ["text", "tel", "url", "search", "password"];
function Zo(t) {
    var r = t.shouldFormat;
    return Xo.indexOf(t.element.type) === -1 && (r = !1),
    r ? new wn(t) : new Wo(t)
}
var Jo = 13
  , $o = "\u2022";
function eu(t) {
    var r = t.field
      , s = t.name
      , d = {
        autocomplete: s ? nn[s] : void 0,
        type: t.type,
        autocorrect: "off",
        autocapitalize: "none",
        spellcheck: "false",
        class: r,
        "data-braintree-name": r,
        name: s,
        id: s
    };
    return d.type || (d.type = "text",
    d.pattern = "\\d*",
    d.inputmode = "numeric"),
    t.shouldAutofill || (d.autocomplete = "off",
    d.name = "field"),
    d
}
var Le = function() {
    function t(r) {
        ce(this, t),
        this.model = r.model,
        this.type = r.type,
        this.maxLength = void 0;
        var s = this.getConfiguration();
        this._prefill = s.prefill && String(s.prefill),
        this.hiddenMaskedValue = "",
        this.shouldMask = !!s.maskInput,
        this.maskCharacter = s.maskInput && s.maskInput !== !0 && s.maskInput.character || $o,
        this.element = this.constructElement();
        var d = s.formatInput !== !1 && this.element instanceof HTMLInputElement;
        this.formatter = Zo(this._createRestrictedInputOptions({
            shouldFormat: d
        })),
        this.addDOMEventListeners(),
        this.addModelEventListeners(),
        this.addBusEventListeners(),
        this._applyPrefill(),
        this.render()
    }
    return fe(t, [{
        key: "getConfiguration",
        value: function() {
            return this.model.configuration.fields[this.type]
        }
    }, {
        key: "updateModel",
        value: function(s, d) {
            this.model.set("".concat(this.type, ".").concat(s), d)
        }
    }, {
        key: "constructElement",
        value: function() {
            var s = this.type
              , d = document.createElement("input")
              , u = this.getConfiguration().placeholder
              , A = qe[s] ? qe[s].name : void 0
              , _ = eu({
                field: s,
                type: this.getConfiguration().type,
                name: A,
                shouldAutofill: this.model.configuration.preventAutofill !== !0
            });
            return this.maxLength && (_.maxlength = this.maxLength),
            u && (_.placeholder = u),
            Object.keys(_).forEach(function(D) {
                d.setAttribute(D, _[D])
            }),
            d
        }
    }, {
        key: "getUnformattedValue",
        value: function() {
            return this.formatter.getUnformattedValue()
        }
    }, {
        key: "addDOMEventListeners",
        value: function() {
            this._addDOMFocusListeners(),
            this._addDOMInputListeners(),
            this._addDOMKeypressListeners(),
            this._addPasteEventListeners()
        }
    }, {
        key: "_applyPrefill",
        value: function() {
            this._prefill && (this.element.value = this._prefill,
            this.model.set("".concat(this.type, ".value"), this._prefill))
        }
    }, {
        key: "maskValue",
        value: function(s) {
            s = s || this.element.value,
            this.hiddenMaskedValue = s,
            this.element.value = s.replace(/[^\s\/\-]/g, this.maskCharacter)
        }
    }, {
        key: "unmaskValue",
        value: function() {
            this.element.value = this.hiddenMaskedValue
        }
    }, {
        key: "_addDOMKeypressListeners",
        value: function() {
            var s = this;
            this.element.addEventListener("keypress", function(d) {
                d.keyCode === Jo && s.model.emitEvent(s.type, Me.INPUT_SUBMIT_REQUEST)
            }, !1)
        }
    }, {
        key: "_addPasteEventListeners",
        value: function() {
            var s = this;
            this.element.addEventListener("paste", function() {
                s.render()
            }, !1)
        }
    }, {
        key: "_addDOMInputListeners",
        value: function() {
            var s = this;
            this.element.addEventListener(this._getDOMChangeEvent(), function() {
                s.hiddenMaskedValue = s.element.value,
                s.updateModel("value", s.getUnformattedValue())
            }, !1)
        }
    }, {
        key: "_getDOMChangeEvent",
        value: function() {
            return "input"
        }
    }, {
        key: "_addDOMFocusListeners",
        value: function() {
            var s = this
              , d = this.element;
            "onfocusin"in document ? document.documentElement.addEventListener("focusin", function(u) {
                u.fromElement !== d && (u.relatedTarget || s.focus())
            }, !1) : document.addEventListener("focus", function() {
                s.focus()
            }, !1),
            d.addEventListener("focus", function() {
                s.updateModel("isFocused", !0)
            }, !1),
            d.addEventListener("blur", function() {
                s.updateModel("isFocused", !1)
            }, !1),
            window.addEventListener("focus", function() {
                s.shouldMask && s.unmaskValue(),
                s.updateModel("isFocused", !0)
            }, !1),
            window.addEventListener("blur", function() {
                s.shouldMask && s.maskValue(),
                s.updateModel("isFocused", !1)
            }, !1),
            Qe.isIos() && (typeof d.select == "function" && !Qe.isIosWebview() && d.addEventListener("touchstart", function() {
                d.select()
            }, Ua ? {
                passive: !0
            } : !1),
            window.addEventListener("touchend", function() {
                window.focus()
            }))
        }
    }, {
        key: "focus",
        value: function() {
            this.element.focus(),
            this.updateModel("isFocused", !0)
        }
    }, {
        key: "applySafariFocusFix",
        value: function() {
            var s = this.element.value === "";
            if (this.element.setSelectionRange) {
                s && (this.element.value = " ");
                var d = this.element.selectionStart
                  , u = this.element.selectionEnd;
                this.element.setSelectionRange(0, 0),
                this.element.setSelectionRange(d, u),
                s && (this.element.value = "")
            }
        }
    }, {
        key: "addModelEventListeners",
        value: function() {
            var s = this;
            this.model.on("change:".concat(this.type, ".isValid"), function() {
                s.render()
            }),
            this.model.on("change:".concat(this.type, ".isPotentiallyValid"), function() {
                s.render()
            }),
            this.model.on("autofill:".concat(this.type), function(d) {
                s.element.value = "",
                s.updateModel("value", ""),
                s.element.value = d,
                s.updateModel("value", d),
                s.shouldMask && s.maskValue(d),
                s._resetPlaceholder(),
                s.render()
            })
        }
    }, {
        key: "setPlaceholder",
        value: function(s, d) {
            this.type.setAttribute(s, "placeholder", d)
        }
    }, {
        key: "setAttribute",
        value: function(s, d, u) {
            s === this.type && !cn(d, u) && this.element.setAttribute(d, u)
        }
    }, {
        key: "removeAttribute",
        value: function(s, d) {
            s === this.type && !cn(d) && this.element.removeAttribute(d)
        }
    }, {
        key: "addBusEventListeners",
        value: function() {
            var s = this;
            window.bus.on(he.TRIGGER_INPUT_FOCUS, function(d) {
                d.field === s.type && s.focus()
            }),
            window.bus.on(he.SET_ATTRIBUTE, function(d) {
                s.setAttribute(d.field, d.attribute, d.value)
            }),
            window.bus.on(he.REMOVE_ATTRIBUTE, function(d) {
                s.removeAttribute(d.field, d.attribute)
            }),
            window.bus.on(he.ADD_CLASS, function(d) {
                d.field === s.type && s.element.classList.add(d.classname)
            }),
            window.bus.on(he.REMOVE_CLASS, function(d) {
                d.field === s.type && s.element.classList.remove(d.classname)
            }),
            window.bus.on(he.CLEAR_FIELD, function(d) {
                d.field === s.type && (s.element.value = "",
                s.hiddenMaskedValue = "",
                s.updateModel("value", ""))
            })
        }
    }, {
        key: "render",
        value: function() {
            var s = this.model.get(this.type)
              , d = s.isValid
              , u = s.isPotentiallyValid;
            this.element.classList.toggle("valid", d),
            this.element.classList.toggle("invalid", !u),
            this.maxLength && this.element.setAttribute("maxlength", "".concat(this.maxLength))
        }
    }, {
        key: "_createRestrictedInputOptions",
        value: function(s) {
            return {
                shouldFormat: s.shouldFormat,
                element: this.element,
                pattern: " "
            }
        }
    }, {
        key: "_resetPlaceholder",
        value: function() {
            var s = this.element.getAttribute("placeholder");
            s && (this.element.setAttribute("placeholder", ""),
            this.element.setAttribute("placeholder", s))
        }
    }]),
    t
}()
  , tu = 255
  , ru = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u;
        ce(this, s),
        u = r.call(this, d),
        u.maxLength = tu,
        u.element.setAttribute("maxlength", u.maxLength.toString());
        var A = "{{" + Array(u.maxLength + 1).join("*") + "}}";
        return u.formatter.setPattern(A),
        u.element.setAttribute("type", u.getConfiguration().type || "text"),
        u.element.removeAttribute("pattern"),
        u.element.removeAttribute("inputmode"),
        u
    }
    return fe(s)
}(Le)
  , nu = 16
  , Bn = 22
  , vt = {};
function iu(t) {
    var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, s, d, u = [4, 8, 12], A = nu, _ = "unknown";
    if (t && (A = Math.max.apply(null, t.lengths),
    u = t.gaps,
    _ = t.type,
    r.maxCardLength && (A = Math.min(r.maxCardLength, A))),
    _ in vt)
        return vt[_];
    for (d = "{{",
    s = 0; s < A; s++)
        u.indexOf(s) !== -1 && (d += "}} {{"),
        d += "9";
    return vt[_] = d + "}}",
    vt[_]
}
var au = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u;
        ce(this, s),
        u = r.call(this, d),
        u.maxLength = Bn,
        u.element.setAttribute("maxlength", u.maxLength.toString()),
        u.setPattern();
        var A = u.getConfiguration();
        return u.unmaskLastFour = !!(A.maskInput && A.maskInput !== !0 && A.maskInput.showLastFour),
        u.model.on("change:possibleCardTypes", function(_) {
            var D = u._parseCardTypes(_);
            u.setPattern(D.card),
            u.updateModel("value", u.formatter.getUnformattedValue()),
            u.maxLength = D.maxLength,
            u.render()
        }),
        u
    }
    return fe(s, [{
        key: "setPattern",
        value: function(u) {
            typeof u == "string" && (u = this._getCardObjectFromString(u)),
            this.formatter.setPattern(iu(u, {
                maxCardLength: this.getConfiguration().maxCardLength
            }))
        }
    }, {
        key: "maskValue",
        value: function(u) {
            Ie(Ee(s.prototype), "maskValue", this).call(this, u);
            var A = this.element.value
              , _ = this.hiddenMaskedValue;
            this.unmaskLastFour && this.model.get(this.type).isValid && (this.element.value = A.substring(0, A.length - 4) + _.substring(_.length - 4, _.length))
        }
    }, {
        key: "_getCardObjectFromString",
        value: function(u) {
            var A = Pt(u)
              , _ = this._parseCardTypes(A);
            return _.card
        }
    }, {
        key: "_parseCardTypes",
        value: function(u) {
            var A = Bn, _ = this.getConfiguration(), D;
            return u.length === 1 && (D = u[0],
            A = Math.max.apply(null, D.lengths),
            _.maxCardLength && (A = Math.min(_.maxCardLength, A)),
            A += D.gaps.length),
            {
                card: D,
                maxLength: A
            }
        }
    }, {
        key: "_createRestrictedInputOptions",
        value: function(u) {
            var A = this
              , _ = Ie(Ee(s.prototype), "_createRestrictedInputOptions", this).call(this, u);
            return _.onPasteEvent = function(D) {
                A.setPattern(D.unformattedInputValue)
            }
            ,
            _
        }
    }], [{
        key: "resetPatternCache",
        value: function() {
            vt = {}
        }
    }]),
    s
}(Le)
  , Nn = "{{99}} / {{9999}}"
  , su = "0{{9}} / {{9999}}"
  , ou = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u;
        return ce(this, s),
        u = r.call(this, d),
        u.maxLength = 9,
        u.element.setAttribute("maxlength", u.maxLength.toString()),
        wn.supportsFormatting() || u.element.setAttribute("type", "text"),
        u.formatter.setPattern(Nn),
        u.element.addEventListener("keyup", function(A) {
            u.element.value === "1" && A.key === "/" && (u.element.value = "01 / ",
            u.model.set("expirationDate.value", "01"))
        }, !1),
        u.model.on("change:expirationDate.value", function(A) {
            A.length === 0 || A[0] === "0" || A[0] === "1" ? u.formatter.setPattern(Nn) : u.formatter.setPattern(su)
        }),
        u
    }
    return fe(s, [{
        key: "getUnformattedValue",
        value: function() {
            var u = this.formatter.getUnformattedValue();
            if (this.element.type === "month") {
                var A = u.split("-")
                  , _ = A[1] || ""
                  , D = A[0] || "";
                u = _ + D
            }
            return u
        }
    }]),
    s
}(Le);
function Wt(t) {
    return typeof t == "string" ? t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : ""
}
var _n = function(t) {
    ge(s, t);
    var r = ye(s);
    function s() {
        var d;
        ce(this, s);
        for (var u = arguments.length, A = new Array(u), _ = 0; _ < u; _++)
            A[_] = arguments[_];
        return d = r.call.apply(r, [this].concat(A)),
        Fr(Ke(d), "_hasPlacecholder", !1),
        d
    }
    return fe(s, [{
        key: "constructElement",
        value: function() {
            var u = this.type
              , A = this.getConfiguration();
            if (!A.select)
                return Ie(Ee(s.prototype), "constructElement", this).call(this);
            var _ = document.createElement("select")
              , D = qe[u]
              , k = {
                class: u,
                "data-braintree-name": u,
                name: D.name,
                id: D.name
            };
            if (Object.keys(k).forEach(function(i) {
                _.setAttribute(i, k[i])
            }),
            A.placeholder != null) {
                var g = this.createPlaceholderOption(A.placeholder);
                _.appendChild(g)
            }
            return this.constructSelectOptions(_),
            _
        }
    }, {
        key: "createPlaceholderOption",
        value: function(u) {
            var A = document.createElement("option");
            return this._hasPlacecholder = !0,
            A.value = "",
            A.innerHTML = Wt(u),
            A.setAttribute("selected", "selected"),
            A.setAttribute("disabled", "disabled"),
            A
        }
    }, {
        key: "setPlaceholder",
        value: function(u, A) {
            if (u === this.type) {
                var _ = this.getConfiguration();
                if (!_.select) {
                    Ie(Ee(s.prototype), "setPlaceholder", this).call(this, u, A);
                    return
                }
                if (this.element.firstChild.value === "")
                    this.element.firstChild.innerHTML = Wt(A);
                else {
                    var D = this.createPlaceholderOption(A);
                    this.element.insertBefore(D, this.element.firstChild)
                }
            }
        }
    }, {
        key: "_getDOMChangeEvent",
        value: function() {
            return this.getConfiguration().select ? "change" : Ie(Ee(s.prototype), "_getDOMChangeEvent", this).call(this)
        }
    }]),
    s
}(Le)
  , uu = "{{99}}"
  , Rn = 12
  , lu = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u;
        return ce(this, s),
        u = r.call(this, d),
        u.maxLength = 2,
        u.element.setAttribute("maxlength", u.maxLength.toString()),
        u.formatter.setPattern(uu),
        u
    }
    return fe(s, [{
        key: "constructSelectOptions",
        value: function(u) {
            for (var A = parseInt(this.model.get("expirationMonth.value"), 10), _ = this.getConfiguration().select.options || [], D = 1; D <= Rn; D++) {
                var k = document.createElement("option");
                D < 10 ? k.value = "0" + D : k.value = D.toString(),
                k.innerHTML = Wt(_[D - 1]) || D.toString(),
                D === A && k.setAttribute("selected", "selected"),
                u.appendChild(k)
            }
            A && (u.selectedIndex = A - 1)
        }
    }, {
        key: "addBusEventListeners",
        value: function() {
            var u = this;
            Ie(Ee(s.prototype), "addBusEventListeners", this).call(this),
            this.getConfiguration().select && window.bus.on(he.SET_MONTH_OPTIONS, function(A, _) {
                for (var D = u.element.querySelectorAll("option"), k = 0; k < Rn; k++) {
                    var g = u._hasPlacecholder ? k + 1 : k;
                    D[g].innerText = Wt(A[k]) || D[g].innerText
                }
                _()
            })
        }
    }, {
        key: "_applyPrefill",
        value: function() {
            this._prefill && this._prefill.length === 1 && (this._prefill = "0" + this._prefill),
            Ie(Ee(s.prototype), "_applyPrefill", this).call(this)
        }
    }]),
    s
}(_n)
  , cu = "{{9999}}"
  , fu = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u;
        return ce(this, s),
        u = r.call(this, d),
        u.maxLength = 4,
        u.element.setAttribute("maxlength", u.maxLength.toString()),
        u.formatter.setPattern(cu),
        u
    }
    return fe(s, [{
        key: "constructSelectOptions",
        value: function(u) {
            for (var A = new Date().getFullYear(), _ = A; _ <= A + Ia; _++) {
                var D = document.createElement("option");
                D.value = _.toString(),
                D.innerHTML = _.toString(),
                _.toString() === this.model.get("expirationYear.value") && D.setAttribute("selected", "selected"),
                u.appendChild(D)
            }
            u.selectedIndex = 0
        }
    }]),
    s
}(_n)
  , Ln = 4
  , Er = {};
function hu(t) {
    for (var r = "{{", s = 0; s < t; s++)
        r += "9";
    return r + "}}"
}
function On(t) {
    return t in Er || (Er[t] = hu(t)),
    Er[t]
}
var pu = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u;
        ce(this, s),
        u = r.call(this, d),
        u.maxLength = Ln;
        var A = u.getConfiguration().maxlength;
        return A && A < u.maxLength ? u.maxLength = A : u.model.on("change:possibleCardTypes", function(_) {
            u.maxLength = _.reduce(function(D, k) {
                return Math.max(D, k.code.size)
            }, 0) || Ln,
            u.formatter.setPattern(On(u.maxLength)),
            u.shouldMask ? (u.maskValue(u.hiddenMaskedValue.substring(0, u.maxLength)),
            u.updateModel("value", u.hiddenMaskedValue)) : u.updateModel("value", u.formatter.getUnformattedValue()),
            u.render()
        }),
        u.element.setAttribute("maxlength", "".concat(u.maxLength)),
        u.formatter.setPattern(On(u.maxLength)),
        u
    }
    return fe(s)
}(Le)
  , du = 10
  , gu = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u;
        ce(this, s),
        u = r.call(this, d),
        u.maxLength = u.getConfiguration().maxlength || du,
        u.element.setAttribute("maxlength", "".concat(u.maxLength));
        var A = "{{" + Array(u.maxLength + 1).join("*") + "}}";
        return u.formatter.setPattern(A),
        u.element.setAttribute("type", u.getConfiguration().type || "text"),
        u.element.removeAttribute("pattern"),
        u.element.removeAttribute("inputmode"),
        u
    }
    return fe(s)
}(Le)
  , yu = 4
  , vu = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u, A;
        ce(this, s),
        A = r.call(this, d),
        A.maxLength = (u = A.getConfiguration().partialNumberLength) !== null && u !== void 0 ? u : yu,
        A.element.setAttribute("maxlength", "".concat(A.maxLength));
        var _ = "{{" + Array(A.maxLength + 1).join("9") + "}}";
        return A.formatter.setPattern(_),
        A
    }
    return fe(s)
}(Le)
  , mu = 2
  , Eu = "{{99}}"
  , bu = function(t) {
    ge(s, t);
    var r = ye(s);
    function s(d) {
        var u;
        return ce(this, s),
        u = r.call(this, d),
        u.maxLength = mu,
        u.model.on("change:possibleCardTypes", function() {
            u.shouldMask ? (u.maskValue(u.hiddenMaskedValue.substring(0, u.maxLength)),
            u.updateModel("value", u.hiddenMaskedValue)) : u.updateModel("value", u.formatter.getUnformattedValue()),
            u.render()
        }),
        u.element.setAttribute("maxlength", "".concat(u.maxLength)),
        u.formatter.setPattern(Eu),
        u
    }
    return fe(s)
}(Le)
  , Cu = {
    cardholderName: ru,
    number: au,
    expirationDate: ou,
    expirationMonth: lu,
    expirationYear: fu,
    cvv: pu,
    postalCode: gu,
    partialNumber: vu,
    kcpPin: bu
}
  , Au = fe(function t(r) {
    ce(this, t),
    this.element = document.createElement("label"),
    this.element.setAttribute("for", r.name),
    this.element.innerText = r.label
})
  , Su = Object.keys(qe);
function Iu(t, r, s, d) {
    var u = document.createElement("input")
      , A = {
        border: "none !important",
        display: "block !important",
        height: "1px !important",
        left: "-1px !important",
        opacity: "0 !important",
        position: "absolute !important",
        top: "-1px !important",
        width: "1px !important"
    }
      , _ = Qe.hasSoftwareKeyboard() || Qe.isFirefox();
    return _ ? (u.setAttribute("aria-hidden", "true"),
    u.setAttribute("autocomplete", "off"),
    u.setAttribute("data-braintree-direction", s),
    u.setAttribute("data-braintree-type", r),
    u.setAttribute("id", "bt-" + r + "-" + s + "-" + t),
    u.setAttribute("style", JSON.stringify(A).replace(/[{}"]/g, "").replace(/,/g, ";")),
    u.classList.add("focus-intercept"),
    u.addEventListener("focus", function(D) {
        d(D),
        Qe.hasSoftwareKeyboard() || u.blur()
    }),
    u) : document.createDocumentFragment()
}
function Tu(t) {
    var r;
    if (!t)
        r = [].slice.call(document.querySelectorAll("[data-braintree-direction]"));
    else {
        var s = document.getElementById(t);
        r = s ? [s] : []
    }
    r.forEach(function(d) {
        d && d.nodeType === 1 && d.parentNode && xn.matchFocusElement(d.getAttribute("id")) && d.parentNode.removeChild(d)
    })
}
function wu(t) {
    if (!t)
        return !1;
    var r = t.split("-");
    if (r.length < 4)
        return !1;
    var s = r[0] === "bt"
      , d = Su.indexOf(r[1]) > -1
      , u = r[2] === ze.BACK || r[2] === ze.FORWARD;
    return s && d && u
}
var xn = {
    generate: Iu,
    destroy: Tu,
    matchFocusElement: wu
}
  , br = xn
  , Bu = fe(function t(r) {
    var s = this;
    ce(this, t);
    var d = r.type
      , u = He({}, qe[d])
      , A = r.cardForm.configuration.fields[d].internalLabel
      , _ = r.componentId;
    A && (u.label = A),
    this.element = document.createDocumentFragment(),
    this.element.appendChild(br.generate(_, d, ze.BACK, function() {
        window.bus.emit(he.TRIGGER_FOCUS_CHANGE, {
            field: d,
            direction: ze.BACK
        })
    })),
    this.label = new Au(u),
    this.element.appendChild(this.label.element),
    this.input = new Cu[d]({
        model: r.cardForm,
        type: d
    }),
    this.input.element.setAttribute("aria-describedby", "field-description-" + d),
    this.element.appendChild(this.input.element),
    this.element.appendChild(br.generate(_, d, ze.FORWARD, function() {
        window.bus.emit(he.TRIGGER_FOCUS_CHANGE, {
            field: d,
            direction: ze.FORWARD
        })
    })),
    this.description = document.createElement("div"),
    this.description.id = "field-description-" + d,
    this.description.classList.add("field-description"),
    this.description.style.height = "1px",
    this.description.style.width = "1px",
    this.description.style.overflow = "hidden",
    this.element.appendChild(this.description),
    window.bus.on(he.SET_MESSAGE, function(D) {
        D.field === d && (s.description.textContent = D.message)
    })
});
function Nu(t) {
    var r = t.url
      , s = t.data
      , d = navigator.sendBeacon && navigator.sendBeacon.bind(navigator)
      , u = !1;
    if (d)
        try {
            u = d(r, JSON.stringify(s))
        } catch (D) {}
    if (!u) {
        var A = JSON.stringify(s)
          , _ = new XMLHttpRequest;
        _.open("POST", r, !0),
        _.setRequestHeader("Content-Type", "application/json; charset=utf-8"),
        _.send(A)
    }
}
function Cr(t, r) {
    var s = Date.now();
    return Promise.resolve(t).then(function(d) {
        var u = Date.now()
          , A = d.getConfiguration()
          , _ = A.analyticsUrl
          , D = {
            event: {
                kind: r,
                isAsync: Math.floor(u / 1e3) !== Math.floor(s / 1e3),
                timestamp: s,
                sessionTime: Date.now() - A.analyticsMetadata.startTime
            },
            meta: A.analyticsMetadata
        };
        Nu({
            url: _,
            data: D
        })
    }).catch(function() {})
}
function Pn(t) {
    var r = {
        company: t.company,
        country_code_numeric: t.countryCodeNumeric,
        country_code_alpha2: t.countryCodeAlpha2,
        country_code_alpha3: t.countryCodeAlpha3,
        country_name: t.countryName,
        extended_address: t.extendedAddress,
        locality: t.locality,
        region: t.region,
        first_name: t.firstName,
        last_name: t.lastName,
        postal_code: t.postalCode,
        street_address: t.streetAddress
    };
    return Object.keys(r).forEach(function(s) {
        r[s] == null && delete r[s]
    }),
    r
}
function _u(t) {
    var r = {};
    return t.billingAddress && (r.billing_address = Pn(t.billingAddress)),
    t.shippingAddress && (r.shippingAddress = Pn(t.shippingAddress)),
    t.phone && (r.phone = {
        phoneNumber: t.phone.number ? t.phone.number.replace(/(?:[\(]|[\)]|[-]|[\s])/g, "") : "",
        countryPhoneCode: t.phone.countryCode ? t.phone.countryCode : "",
        extensionNumber: t.phone.extension ? t.phone.extension : ""
    }),
    t.email && (r.email = t.email),
    t.number && (r.number = t.number.replace(/[-\s]/g, "")),
    t.cvv && (r.cvv = t.cvv),
    t.expirationMonth && (r.expiration_month = t.expirationMonth),
    t.expirationYear && (t.expirationYear.length === 2 ? r.expiration_year = "20" + t.expirationYear : r.expiration_year = t.expirationYear),
    t.cardholderName && (r.cardholderName = t.cardholderName),
    t.partialNumber && (r.partial_number = t.partialNumber.replace(/[-\s]/g, "")),
    t.kcpPin && (r.kcpPin = t.kcpPin),
    r
}

var kn = {
    exports: {}
};
(function(t, r) {
    (function(s, d) {
        t.exports = d()
    }
    )(self, function() {
        return function() {
            var s = {
                544: function(_, D) {
                    D.byteLength = function(B) {
                        var p = e(B)
                          , b = p[0]
                          , w = p[1];
                        return 3 * (b + w) / 4 - w
                    }
                    ,
                    D.toByteArray = function(B) {
                        var p, b, w = e(B), M = w[0], N = w[1], O = new i(function(S, L, V) {
                            return 3 * (L + V) / 4 - V
                        }(0, M, N)), x = 0, o = N > 0 ? M - 4 : M;
                        for (b = 0; b < o; b += 4)
                            p = g[B.charCodeAt(b)] << 18 | g[B.charCodeAt(b + 1)] << 12 | g[B.charCodeAt(b + 2)] << 6 | g[B.charCodeAt(b + 3)],
                            O[x++] = p >> 16 & 255,
                            O[x++] = p >> 8 & 255,
                            O[x++] = 255 & p;
                        return N === 2 && (p = g[B.charCodeAt(b)] << 2 | g[B.charCodeAt(b + 1)] >> 4,
                        O[x++] = 255 & p),
                        N === 1 && (p = g[B.charCodeAt(b)] << 10 | g[B.charCodeAt(b + 1)] << 4 | g[B.charCodeAt(b + 2)] >> 2,
                        O[x++] = p >> 8 & 255,
                        O[x++] = 255 & p),
                        O
                    }
                    ,
                    D.fromByteArray = function(B) {
                        for (var p, b = B.length, w = b % 3, M = [], N = 16383, O = 0, x = b - w; O < x; O += N)
                            M.push(v(B, O, O + N > x ? x : O + N));
                        return w === 1 ? (p = B[b - 1],
                        M.push(k[p >> 2] + k[p << 4 & 63] + "==")) : w === 2 && (p = (B[b - 2] << 8) + B[b - 1],
                        M.push(k[p >> 10] + k[p >> 4 & 63] + k[p << 2 & 63] + "=")),
                        M.join("")
                    }
                    ;
                    for (var k = [], g = [], i = typeof Uint8Array != "undefined" ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", y = 0, U = a.length; y < U; ++y)
                        k[y] = a[y],
                        g[a.charCodeAt(y)] = y;
                    function e(B) {
                        var p = B.length;
                        if (p % 4 > 0)
                            throw new Error("Invalid string. Length must be a multiple of 4");
                        var b = B.indexOf("=");
                        return b === -1 && (b = p),
                        [b, b === p ? 0 : 4 - b % 4]
                    }
                    function v(B, p, b) {
                        for (var w, M, N = [], O = p; O < b; O += 3)
                            w = (B[O] << 16 & 16711680) + (B[O + 1] << 8 & 65280) + (255 & B[O + 2]),
                            N.push(k[(M = w) >> 18 & 63] + k[M >> 12 & 63] + k[M >> 6 & 63] + k[63 & M]);
                        return N.join("")
                    }
                    g["-".charCodeAt(0)] = 62,
                    g["_".charCodeAt(0)] = 63
                },
                957: function(_, D, k) {
                    var g = k(544)
                      , i = k(84)
                      , a = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
                    D.lW = e,
                    D.h2 = 50;
                    var y = 2147483647;
                    function U(f) {
                        if (f > y)
                            throw new RangeError('The value "' + f + '" is invalid for option "size"');
                        var m = new Uint8Array(f);
                        return Object.setPrototypeOf(m, e.prototype),
                        m
                    }
                    function e(f, m, T) {
                        if (typeof f == "number") {
                            if (typeof m == "string")
                                throw new TypeError('The "string" argument must be of type string. Received type number');
                            return p(f)
                        }
                        return v(f, m, T)
                    }
                    function v(f, m, T) {
                        if (typeof f == "string")
                            return function(q, Y) {
                                if (typeof Y == "string" && Y !== "" || (Y = "utf8"),
                                !e.isEncoding(Y))
                                    throw new TypeError("Unknown encoding: " + Y);
                                var re = 0 | N(q, Y)
                                  , ie = U(re)
                                  , oe = ie.write(q, Y);
                                return oe !== re && (ie = ie.slice(0, oe)),
                                ie
                            }(f, m);
                        if (ArrayBuffer.isView(f))
                            return function(q) {
                                if (we(q, Uint8Array)) {
                                    var Y = new Uint8Array(q);
                                    return w(Y.buffer, Y.byteOffset, Y.byteLength)
                                }
                                return b(q)
                            }(f);
                        if (f == null)
                            throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + le(f));
                        if (we(f, ArrayBuffer) || f && we(f.buffer, ArrayBuffer) || typeof SharedArrayBuffer != "undefined" && (we(f, SharedArrayBuffer) || f && we(f.buffer, SharedArrayBuffer)))
                            return w(f, m, T);
                        if (typeof f == "number")
                            throw new TypeError('The "value" argument must not be of type number. Received type number');
                        var K = f.valueOf && f.valueOf();
                        if (K != null && K !== f)
                            return e.from(K, m, T);
                        var Q = function(q) {
                            if (e.isBuffer(q)) {
                                var Y = 0 | M(q.length)
                                  , re = U(Y);
                                return re.length === 0 || q.copy(re, 0, 0, Y),
                                re
                            }
                            return q.length !== void 0 ? typeof q.length != "number" || Sr(q.length) ? U(0) : b(q) : q.type === "Buffer" && Array.isArray(q.data) ? b(q.data) : void 0
                        }(f);
                        if (Q)
                            return Q;
                        if (typeof Symbol != "undefined" && Symbol.toPrimitive != null && typeof f[Symbol.toPrimitive] == "function")
                            return e.from(f[Symbol.toPrimitive]("string"), m, T);
                        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + le(f))
                    }
                    function B(f) {
                        if (typeof f != "number")
                            throw new TypeError('"size" argument must be of type number');
                        if (f < 0)
                            throw new RangeError('The value "' + f + '" is invalid for option "size"')
                    }
                    function p(f) {
                        return B(f),
                        U(f < 0 ? 0 : 0 | M(f))
                    }
                    function b(f) {
                        for (var m = f.length < 0 ? 0 : 0 | M(f.length), T = U(m), K = 0; K < m; K += 1)
                            T[K] = 255 & f[K];
                        return T
                    }
                    function w(f, m, T) {
                        if (m < 0 || f.byteLength < m)
                            throw new RangeError('"offset" is outside of buffer bounds');
                        if (f.byteLength < m + (T || 0))
                            throw new RangeError('"length" is outside of buffer bounds');
                        var K;
                        return K = m === void 0 && T === void 0 ? new Uint8Array(f) : T === void 0 ? new Uint8Array(f,m) : new Uint8Array(f,m,T),
                        Object.setPrototypeOf(K, e.prototype),
                        K
                    }
                    function M(f) {
                        if (f >= y)
                            throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + y.toString(16) + " bytes");
                        return 0 | f
                    }
                    function N(f, m) {
                        if (e.isBuffer(f))
                            return f.length;
                        if (ArrayBuffer.isView(f) || we(f, ArrayBuffer))
                            return f.byteLength;
                        if (typeof f != "string")
                            throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + le(f));
                        var T = f.length
                          , K = arguments.length > 2 && arguments[2] === !0;
                        if (!K && T === 0)
                            return 0;
                        for (var Q = !1; ; )
                            switch (m) {
                            case "ascii":
                            case "latin1":
                            case "binary":
                                return T;
                            case "utf8":
                            case "utf-8":
                                return Ae(f).length;
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return 2 * T;
                            case "hex":
                                return T >>> 1;
                            case "base64":
                                return mt(f).length;
                            default:
                                if (Q)
                                    return K ? -1 : Ae(f).length;
                                m = ("" + m).toLowerCase(),
                                Q = !0
                            }
                    }
                    function O(f, m, T) {
                        var K = !1;
                        if ((m === void 0 || m < 0) && (m = 0),
                        m > this.length || ((T === void 0 || T > this.length) && (T = this.length),
                        T <= 0) || (T >>>= 0) <= (m >>>= 0))
                            return "";
                        for (f || (f = "utf8"); ; )
                            switch (f) {
                            case "hex":
                                return h(this, m, T);
                            case "utf8":
                            case "utf-8":
                                return l(this, m, T);
                            case "ascii":
                                return n(this, m, T);
                            case "latin1":
                            case "binary":
                                return c(this, m, T);
                            case "base64":
                                return E(this, m, T);
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return C(this, m, T);
                            default:
                                if (K)
                                    throw new TypeError("Unknown encoding: " + f);
                                f = (f + "").toLowerCase(),
                                K = !0
                            }
                    }
                    function x(f, m, T) {
                        var K = f[m];
                        f[m] = f[T],
                        f[T] = K
                    }
                    function o(f, m, T, K, Q) {
                        if (f.length === 0)
                            return -1;
                        if (typeof T == "string" ? (K = T,
                        T = 0) : T > 2147483647 ? T = 2147483647 : T < -2147483648 && (T = -2147483648),
                        Sr(T = +T) && (T = Q ? 0 : f.length - 1),
                        T < 0 && (T = f.length + T),
                        T >= f.length) {
                            if (Q)
                                return -1;
                            T = f.length - 1
                        } else if (T < 0) {
                            if (!Q)
                                return -1;
                            T = 0
                        }
                        if (typeof m == "string" && (m = e.from(m, K)),
                        e.isBuffer(m))
                            return m.length === 0 ? -1 : S(f, m, T, K, Q);
                        if (typeof m == "number")
                            return m &= 255,
                            typeof Uint8Array.prototype.indexOf == "function" ? Q ? Uint8Array.prototype.indexOf.call(f, m, T) : Uint8Array.prototype.lastIndexOf.call(f, m, T) : S(f, [m], T, K, Q);
                        throw new TypeError("val must be string, number or Buffer")
                    }
                    function S(f, m, T, K, Q) {
                        var q, Y = 1, re = f.length, ie = m.length;
                        if (K !== void 0 && ((K = String(K).toLowerCase()) === "ucs2" || K === "ucs-2" || K === "utf16le" || K === "utf-16le")) {
                            if (f.length < 2 || m.length < 2)
                                return -1;
                            Y = 2,
                            re /= 2,
                            ie /= 2,
                            T /= 2
                        }
                        function oe(Et, bt) {
                            return Y === 1 ? Et[bt] : Et.readUInt16BE(bt * Y)
                        }
                        if (Q) {
                            var ae = -1;
                            for (q = T; q < re; q++)
                                if (oe(f, q) === oe(m, ae === -1 ? 0 : q - ae)) {
                                    if (ae === -1 && (ae = q),
                                    q - ae + 1 === ie)
                                        return ae * Y
                                } else
                                    ae !== -1 && (q -= q - ae),
                                    ae = -1
                        } else
                            for (T + ie > re && (T = re - ie),
                            q = T; q >= 0; q--) {
                                for (var de = !0, xe = 0; xe < ie; xe++)
                                    if (oe(f, q + xe) !== oe(m, xe)) {
                                        de = !1;
                                        break
                                    }
                                if (de)
                                    return q
                            }
                        return -1
                    }
                    function L(f, m, T, K) {
                        T = Number(T) || 0;
                        var Q = f.length - T;
                        K ? (K = Number(K)) > Q && (K = Q) : K = Q;
                        var q = m.length, Y;
                        for (K > q / 2 && (K = q / 2),
                        Y = 0; Y < K; ++Y) {
                            var re = parseInt(m.substr(2 * Y, 2), 16);
                            if (Sr(re))
                                return Y;
                            f[T + Y] = re
                        }
                        return Y
                    }
                    function V(f, m, T, K) {
                        return Xt(Ae(m, f.length - T), f, T, K)
                    }
                    function F(f, m, T, K) {
                        return Xt(function(Q) {
                            for (var q = [], Y = 0; Y < Q.length; ++Y)
                                q.push(255 & Q.charCodeAt(Y));
                            return q
                        }(m), f, T, K)
                    }
                    function j(f, m, T, K) {
                        return Xt(mt(m), f, T, K)
                    }
                    function z(f, m, T, K) {
                        return Xt(function(Q, q) {
                            for (var Y, re, ie, oe = [], ae = 0; ae < Q.length && !((q -= 2) < 0); ++ae)
                                Y = Q.charCodeAt(ae),
                                re = Y >> 8,
                                ie = Y % 256,
                                oe.push(ie),
                                oe.push(re);
                            return oe
                        }(m, f.length - T), f, T, K)
                    }
                    function E(f, m, T) {
                        return m === 0 && T === f.length ? g.fromByteArray(f) : g.fromByteArray(f.slice(m, T))
                    }
                    function l(f, m, T) {
                        T = Math.min(f.length, T);
                        for (var K = [], Q = m; Q < T; ) {
                            var q = f[Q]
                              , Y = null
                              , re = q > 239 ? 4 : q > 223 ? 3 : q > 191 ? 2 : 1;
                            if (Q + re <= T) {
                                var ie = void 0
                                  , oe = void 0
                                  , ae = void 0
                                  , de = void 0;
                                switch (re) {
                                case 1:
                                    q < 128 && (Y = q);
                                    break;
                                case 2:
                                    ie = f[Q + 1],
                                    (192 & ie) == 128 && (de = (31 & q) << 6 | 63 & ie,
                                    de > 127 && (Y = de));
                                    break;
                                case 3:
                                    ie = f[Q + 1],
                                    oe = f[Q + 2],
                                    (192 & ie) == 128 && (192 & oe) == 128 && (de = (15 & q) << 12 | (63 & ie) << 6 | 63 & oe,
                                    de > 2047 && (de < 55296 || de > 57343) && (Y = de));
                                    break;
                                case 4:
                                    ie = f[Q + 1],
                                    oe = f[Q + 2],
                                    ae = f[Q + 3],
                                    (192 & ie) == 128 && (192 & oe) == 128 && (192 & ae) == 128 && (de = (15 & q) << 18 | (63 & ie) << 12 | (63 & oe) << 6 | 63 & ae,
                                    de > 65535 && de < 1114112 && (Y = de))
                                }
                            }
                            Y === null ? (Y = 65533,
                            re = 1) : Y > 65535 && (Y -= 65536,
                            K.push(Y >>> 10 & 1023 | 55296),
                            Y = 56320 | 1023 & Y),
                            K.push(Y),
                            Q += re
                        }
                        return function(xe) {
                            var Et = xe.length;
                            if (Et <= I)
                                return String.fromCharCode.apply(String, xe);
                            for (var bt = "", Ir = 0; Ir < Et; )
                                bt += String.fromCharCode.apply(String, xe.slice(Ir, Ir += I));
                            return bt
                        }(K)
                    }
                    e.TYPED_ARRAY_SUPPORT = function() {
                        try {
                            var f = new Uint8Array(1)
                              , m = {
                                foo: function() {
                                    return 42
                                }
                            };
                            return Object.setPrototypeOf(m, Uint8Array.prototype),
                            Object.setPrototypeOf(f, m),
                            f.foo() === 42
                        } catch (T) {
                            return !1
                        }
                    }(),
                    e.TYPED_ARRAY_SUPPORT || typeof console == "undefined" || typeof console.error != "function" || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),
                    Object.defineProperty(e.prototype, "parent", {
                        enumerable: !0,
                        get: function() {
                            if (e.isBuffer(this))
                                return this.buffer
                        }
                    }),
                    Object.defineProperty(e.prototype, "offset", {
                        enumerable: !0,
                        get: function() {
                            if (e.isBuffer(this))
                                return this.byteOffset
                        }
                    }),
                    e.poolSize = 8192,
                    e.from = function(f, m, T) {
                        return v(f, m, T)
                    }
                    ,
                    Object.setPrototypeOf(e.prototype, Uint8Array.prototype),
                    Object.setPrototypeOf(e, Uint8Array),
                    e.alloc = function(f, m, T) {
                        return function(K, Q, q) {
                            return B(K),
                            K <= 0 ? U(K) : Q !== void 0 ? typeof q == "string" ? U(K).fill(Q, q) : U(K).fill(Q) : U(K)
                        }(f, m, T)
                    }
                    ,
                    e.allocUnsafe = function(f) {
                        return p(f)
                    }
                    ,
                    e.allocUnsafeSlow = function(f) {
                        return p(f)
                    }
                    ,
                    e.isBuffer = function(f) {
                        return f != null && f._isBuffer === !0 && f !== e.prototype
                    }
                    ,
                    e.compare = function(f, m) {
                        if (we(f, Uint8Array) && (f = e.from(f, f.offset, f.byteLength)),
                        we(m, Uint8Array) && (m = e.from(m, m.offset, m.byteLength)),
                        !e.isBuffer(f) || !e.isBuffer(m))
                            throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                        if (f === m)
                            return 0;
                        for (var T = f.length, K = m.length, Q = 0, q = Math.min(T, K); Q < q; ++Q)
                            if (f[Q] !== m[Q]) {
                                T = f[Q],
                                K = m[Q];
                                break
                            }
                        return T < K ? -1 : K < T ? 1 : 0
                    }
                    ,
                    e.isEncoding = function(f) {
                        switch (String(f).toLowerCase()) {
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
                    e.concat = function(f, m) {
                        if (!Array.isArray(f))
                            throw new TypeError('"list" argument must be an Array of Buffers');
                        if (f.length === 0)
                            return e.alloc(0);
                        var T;
                        if (m === void 0)
                            for (m = 0,
                            T = 0; T < f.length; ++T)
                                m += f[T].length;
                        var K = e.allocUnsafe(m)
                          , Q = 0;
                        for (T = 0; T < f.length; ++T) {
                            var q = f[T];
                            if (we(q, Uint8Array))
                                Q + q.length > K.length ? (e.isBuffer(q) || (q = e.from(q)),
                                q.copy(K, Q)) : Uint8Array.prototype.set.call(K, q, Q);
                            else {
                                if (!e.isBuffer(q))
                                    throw new TypeError('"list" argument must be an Array of Buffers');
                                q.copy(K, Q)
                            }
                            Q += q.length
                        }
                        return K
                    }
                    ,
                    e.byteLength = N,
                    e.prototype._isBuffer = !0,
                    e.prototype.swap16 = function() {
                        var f = this.length;
                        if (f % 2 != 0)
                            throw new RangeError("Buffer size must be a multiple of 16-bits");
                        for (var m = 0; m < f; m += 2)
                            x(this, m, m + 1);
                        return this
                    }
                    ,
                    e.prototype.swap32 = function() {
                        var f = this.length;
                        if (f % 4 != 0)
                            throw new RangeError("Buffer size must be a multiple of 32-bits");
                        for (var m = 0; m < f; m += 4)
                            x(this, m, m + 3),
                            x(this, m + 1, m + 2);
                        return this
                    }
                    ,
                    e.prototype.swap64 = function() {
                        var f = this.length;
                        if (f % 8 != 0)
                            throw new RangeError("Buffer size must be a multiple of 64-bits");
                        for (var m = 0; m < f; m += 8)
                            x(this, m, m + 7),
                            x(this, m + 1, m + 6),
                            x(this, m + 2, m + 5),
                            x(this, m + 3, m + 4);
                        return this
                    }
                    ,
                    e.prototype.toString = function() {
                        var f = this.length;
                        return f === 0 ? "" : arguments.length === 0 ? l(this, 0, f) : O.apply(this, arguments)
                    }
                    ,
                    e.prototype.toLocaleString = e.prototype.toString,
                    e.prototype.equals = function(f) {
                        if (!e.isBuffer(f))
                            throw new TypeError("Argument must be a Buffer");
                        return this === f || e.compare(this, f) === 0
                    }
                    ,
                    e.prototype.inspect = function() {
                        var f = ""
                          , m = D.h2;
                        return f = this.toString("hex", 0, m).replace(/(.{2})/g, "$1 ").trim(),
                        this.length > m && (f += " ... "),
                        "<Buffer " + f + ">"
                    }
                    ,
                    a && (e.prototype[a] = e.prototype.inspect),
                    e.prototype.compare = function(f, m, T, K, Q) {
                        if (we(f, Uint8Array) && (f = e.from(f, f.offset, f.byteLength)),
                        !e.isBuffer(f))
                            throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + le(f));
                        if (m === void 0 && (m = 0),
                        T === void 0 && (T = f ? f.length : 0),
                        K === void 0 && (K = 0),
                        Q === void 0 && (Q = this.length),
                        m < 0 || T > f.length || K < 0 || Q > this.length)
                            throw new RangeError("out of range index");
                        if (K >= Q && m >= T)
                            return 0;
                        if (K >= Q)
                            return -1;
                        if (m >= T)
                            return 1;
                        if (this === f)
                            return 0;
                        for (var q = (Q >>>= 0) - (K >>>= 0), Y = (T >>>= 0) - (m >>>= 0), re = Math.min(q, Y), ie = this.slice(K, Q), oe = f.slice(m, T), ae = 0; ae < re; ++ae)
                            if (ie[ae] !== oe[ae]) {
                                q = ie[ae],
                                Y = oe[ae];
                                break
                            }
                        return q < Y ? -1 : Y < q ? 1 : 0
                    }
                    ,
                    e.prototype.includes = function(f, m, T) {
                        return this.indexOf(f, m, T) !== -1
                    }
                    ,
                    e.prototype.indexOf = function(f, m, T) {
                        return o(this, f, m, T, !0)
                    }
                    ,
                    e.prototype.lastIndexOf = function(f, m, T) {
                        return o(this, f, m, T, !1)
                    }
                    ,
                    e.prototype.write = function(f, m, T, K) {
                        if (m === void 0)
                            K = "utf8",
                            T = this.length,
                            m = 0;
                        else if (T === void 0 && typeof m == "string")
                            K = m,
                            T = this.length,
                            m = 0;
                        else {
                            if (!isFinite(m))
                                throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                            m >>>= 0,
                            isFinite(T) ? (T >>>= 0,
                            K === void 0 && (K = "utf8")) : (K = T,
                            T = void 0)
                        }
                        var Q = this.length - m;
                        if ((T === void 0 || T > Q) && (T = Q),
                        f.length > 0 && (T < 0 || m < 0) || m > this.length)
                            throw new RangeError("Attempt to write outside buffer bounds");
                        K || (K = "utf8");
                        for (var q = !1; ; )
                            switch (K) {
                            case "hex":
                                return L(this, f, m, T);
                            case "utf8":
                            case "utf-8":
                                return V(this, f, m, T);
                            case "ascii":
                            case "latin1":
                            case "binary":
                                return F(this, f, m, T);
                            case "base64":
                                return j(this, f, m, T);
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return z(this, f, m, T);
                            default:
                                if (q)
                                    throw new TypeError("Unknown encoding: " + K);
                                K = ("" + K).toLowerCase(),
                                q = !0
                            }
                    }
                    ,
                    e.prototype.toJSON = function() {
                        return {
                            type: "Buffer",
                            data: Array.prototype.slice.call(this._arr || this, 0)
                        }
                    }
                    ;
                    var I = 4096;
                    function n(f, m, T) {
                        var K = "";
                        T = Math.min(f.length, T);
                        for (var Q = m; Q < T; ++Q)
                            K += String.fromCharCode(127 & f[Q]);
                        return K
                    }
                    function c(f, m, T) {
                        var K = "";
                        T = Math.min(f.length, T);
                        for (var Q = m; Q < T; ++Q)
                            K += String.fromCharCode(f[Q]);
                        return K
                    }
                    function h(f, m, T) {
                        var K = f.length;
                        (!m || m < 0) && (m = 0),
                        (!T || T < 0 || T > K) && (T = K);
                        for (var Q = "", q = m; q < T; ++q)
                            Q += Qu[f[q]];
                        return Q
                    }
                    function C(f, m, T) {
                        for (var K = f.slice(m, T), Q = "", q = 0; q < K.length - 1; q += 2)
                            Q += String.fromCharCode(K[q] + 256 * K[q + 1]);
                        return Q
                    }
                    function R(f, m, T) {
                        if (f % 1 != 0 || f < 0)
                            throw new RangeError("offset is not uint");
                        if (f + m > T)
                            throw new RangeError("Trying to access beyond buffer length")
                    }
                    function P(f, m, T, K, Q, q) {
                        if (!e.isBuffer(f))
                            throw new TypeError('"buffer" argument must be a Buffer instance');
                        if (m > Q || m < q)
                            throw new RangeError('"value" argument is out of bounds');
                        if (T + K > f.length)
                            throw new RangeError("Index out of range")
                    }
                    function G(f, m, T, K, Q) {
                        J(m, K, Q, f, T, 7);
                        var q = Number(m & BigInt(4294967295));
                        f[T++] = q,
                        q >>= 8,
                        f[T++] = q,
                        q >>= 8,
                        f[T++] = q,
                        q >>= 8,
                        f[T++] = q;
                        var Y = Number(m >> BigInt(32) & BigInt(4294967295));
                        return f[T++] = Y,
                        Y >>= 8,
                        f[T++] = Y,
                        Y >>= 8,
                        f[T++] = Y,
                        Y >>= 8,
                        f[T++] = Y,
                        T
                    }
                    function H(f, m, T, K, Q) {
                        J(m, K, Q, f, T, 7);
                        var q = Number(m & BigInt(4294967295));
                        f[T + 7] = q,
                        q >>= 8,
                        f[T + 6] = q,
                        q >>= 8,
                        f[T + 5] = q,
                        q >>= 8,
                        f[T + 4] = q;
                        var Y = Number(m >> BigInt(32) & BigInt(4294967295));
                        return f[T + 3] = Y,
                        Y >>= 8,
                        f[T + 2] = Y,
                        Y >>= 8,
                        f[T + 1] = Y,
                        Y >>= 8,
                        f[T] = Y,
                        T + 8
                    }
                    function X(f, m, T, K, Q, q) {
                        if (T + K > f.length)
                            throw new RangeError("Index out of range");
                        if (T < 0)
                            throw new RangeError("Index out of range")
                    }
                    function Z(f, m, T, K, Q) {
                        return m = +m,
                        T >>>= 0,
                        Q || X(f, 0, T, 4),
                        i.write(f, m, T, K, 23, 4),
                        T + 4
                    }
                    function W(f, m, T, K, Q) {
                        return m = +m,
                        T >>>= 0,
                        Q || X(f, 0, T, 8),
                        i.write(f, m, T, K, 52, 8),
                        T + 8
                    }
                    e.prototype.slice = function(f, m) {
                        var T = this.length;
                        (f = ~~f) < 0 ? (f += T) < 0 && (f = 0) : f > T && (f = T),
                        (m = m === void 0 ? T : ~~m) < 0 ? (m += T) < 0 && (m = 0) : m > T && (m = T),
                        m < f && (m = f);
                        var K = this.subarray(f, m);
                        return Object.setPrototypeOf(K, e.prototype),
                        K
                    }
                    ,
                    e.prototype.readUintLE = e.prototype.readUIntLE = function(f, m, T) {
                        f >>>= 0,
                        m >>>= 0,
                        T || R(f, m, this.length);
                        for (var K = this[f], Q = 1, q = 0; ++q < m && (Q *= 256); )
                            K += this[f + q] * Q;
                        return K
                    }
                    ,
                    e.prototype.readUintBE = e.prototype.readUIntBE = function(f, m, T) {
                        f >>>= 0,
                        m >>>= 0,
                        T || R(f, m, this.length);
                        for (var K = this[f + --m], Q = 1; m > 0 && (Q *= 256); )
                            K += this[f + --m] * Q;
                        return K
                    }
                    ,
                    e.prototype.readUint8 = e.prototype.readUInt8 = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 1, this.length),
                        this[f]
                    }
                    ,
                    e.prototype.readUint16LE = e.prototype.readUInt16LE = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 2, this.length),
                        this[f] | this[f + 1] << 8
                    }
                    ,
                    e.prototype.readUint16BE = e.prototype.readUInt16BE = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 2, this.length),
                        this[f] << 8 | this[f + 1]
                    }
                    ,
                    e.prototype.readUint32LE = e.prototype.readUInt32LE = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 4, this.length),
                        (this[f] | this[f + 1] << 8 | this[f + 2] << 16) + 16777216 * this[f + 3]
                    }
                    ,
                    e.prototype.readUint32BE = e.prototype.readUInt32BE = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 4, this.length),
                        16777216 * this[f] + (this[f + 1] << 16 | this[f + 2] << 8 | this[f + 3])
                    }
                    ,
                    e.prototype.readBigUInt64LE = Oe(function(f) {
                        ne(f >>>= 0, "offset");
                        var m = this[f]
                          , T = this[f + 7];
                        m !== void 0 && T !== void 0 || se(f, this.length - 8);
                        var K = m + 256 * this[++f] + 65536 * this[++f] + this[++f] * Math.pow(2, 24)
                          , Q = this[++f] + 256 * this[++f] + 65536 * this[++f] + T * Math.pow(2, 24);
                        return BigInt(K) + (BigInt(Q) << BigInt(32))
                    }),
                    e.prototype.readBigUInt64BE = Oe(function(f) {
                        ne(f >>>= 0, "offset");
                        var m = this[f]
                          , T = this[f + 7];
                        m !== void 0 && T !== void 0 || se(f, this.length - 8);
                        var K = m * Math.pow(2, 24) + 65536 * this[++f] + 256 * this[++f] + this[++f]
                          , Q = this[++f] * Math.pow(2, 24) + 65536 * this[++f] + 256 * this[++f] + T;
                        return (BigInt(K) << BigInt(32)) + BigInt(Q)
                    }),
                    e.prototype.readIntLE = function(f, m, T) {
                        f >>>= 0,
                        m >>>= 0,
                        T || R(f, m, this.length);
                        for (var K = this[f], Q = 1, q = 0; ++q < m && (Q *= 256); )
                            K += this[f + q] * Q;
                        return Q *= 128,
                        K >= Q && (K -= Math.pow(2, 8 * m)),
                        K
                    }
                    ,
                    e.prototype.readIntBE = function(f, m, T) {
                        f >>>= 0,
                        m >>>= 0,
                        T || R(f, m, this.length);
                        for (var K = m, Q = 1, q = this[f + --K]; K > 0 && (Q *= 256); )
                            q += this[f + --K] * Q;
                        return Q *= 128,
                        q >= Q && (q -= Math.pow(2, 8 * m)),
                        q
                    }
                    ,
                    e.prototype.readInt8 = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 1, this.length),
                        128 & this[f] ? -1 * (255 - this[f] + 1) : this[f]
                    }
                    ,
                    e.prototype.readInt16LE = function(f, m) {
                        f >>>= 0,
                        m || R(f, 2, this.length);
                        var T = this[f] | this[f + 1] << 8;
                        return 32768 & T ? 4294901760 | T : T
                    }
                    ,
                    e.prototype.readInt16BE = function(f, m) {
                        f >>>= 0,
                        m || R(f, 2, this.length);
                        var T = this[f + 1] | this[f] << 8;
                        return 32768 & T ? 4294901760 | T : T
                    }
                    ,
                    e.prototype.readInt32LE = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 4, this.length),
                        this[f] | this[f + 1] << 8 | this[f + 2] << 16 | this[f + 3] << 24
                    }
                    ,
                    e.prototype.readInt32BE = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 4, this.length),
                        this[f] << 24 | this[f + 1] << 16 | this[f + 2] << 8 | this[f + 3]
                    }
                    ,
                    e.prototype.readBigInt64LE = Oe(function(f) {
                        ne(f >>>= 0, "offset");
                        var m = this[f]
                          , T = this[f + 7];
                        m !== void 0 && T !== void 0 || se(f, this.length - 8);
                        var K = this[f + 4] + 256 * this[f + 5] + 65536 * this[f + 6] + (T << 24);
                        return (BigInt(K) << BigInt(32)) + BigInt(m + 256 * this[++f] + 65536 * this[++f] + this[++f] * Math.pow(2, 24))
                    }),
                    e.prototype.readBigInt64BE = Oe(function(f) {
                        ne(f >>>= 0, "offset");
                        var m = this[f]
                          , T = this[f + 7];
                        m !== void 0 && T !== void 0 || se(f, this.length - 8);
                        var K = (m << 24) + 65536 * this[++f] + 256 * this[++f] + this[++f];
                        return (BigInt(K) << BigInt(32)) + BigInt(this[++f] * Math.pow(2, 24) + 65536 * this[++f] + 256 * this[++f] + T)
                    }),
                    e.prototype.readFloatLE = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 4, this.length),
                        i.read(this, f, !0, 23, 4)
                    }
                    ,
                    e.prototype.readFloatBE = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 4, this.length),
                        i.read(this, f, !1, 23, 4)
                    }
                    ,
                    e.prototype.readDoubleLE = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 8, this.length),
                        i.read(this, f, !0, 52, 8)
                    }
                    ,
                    e.prototype.readDoubleBE = function(f, m) {
                        return f >>>= 0,
                        m || R(f, 8, this.length),
                        i.read(this, f, !1, 52, 8)
                    }
                    ,
                    e.prototype.writeUintLE = e.prototype.writeUIntLE = function(f, m, T, K) {
                        f = +f,
                        m >>>= 0,
                        T >>>= 0,
                        K || P(this, f, m, T, Math.pow(2, 8 * T) - 1, 0);
                        var Q = 1
                          , q = 0;
                        for (this[m] = 255 & f; ++q < T && (Q *= 256); )
                            this[m + q] = f / Q & 255;
                        return m + T
                    }
                    ,
                    e.prototype.writeUintBE = e.prototype.writeUIntBE = function(f, m, T, K) {
                        f = +f,
                        m >>>= 0,
                        T >>>= 0,
                        K || P(this, f, m, T, Math.pow(2, 8 * T) - 1, 0);
                        var Q = T - 1
                          , q = 1;
                        for (this[m + Q] = 255 & f; --Q >= 0 && (q *= 256); )
                            this[m + Q] = f / q & 255;
                        return m + T
                    }
                    ,
                    e.prototype.writeUint8 = e.prototype.writeUInt8 = function(f, m, T) {
                        return f = +f,
                        m >>>= 0,
                        T || P(this, f, m, 1, 255, 0),
                        this[m] = 255 & f,
                        m + 1
                    }
                    ,
                    e.prototype.writeUint16LE = e.prototype.writeUInt16LE = function(f, m, T) {
                        return f = +f,
                        m >>>= 0,
                        T || P(this, f, m, 2, 65535, 0),
                        this[m] = 255 & f,
                        this[m + 1] = f >>> 8,
                        m + 2
                    }
                    ,
                    e.prototype.writeUint16BE = e.prototype.writeUInt16BE = function(f, m, T) {
                        return f = +f,
                        m >>>= 0,
                        T || P(this, f, m, 2, 65535, 0),
                        this[m] = f >>> 8,
                        this[m + 1] = 255 & f,
                        m + 2
                    }
                    ,
                    e.prototype.writeUint32LE = e.prototype.writeUInt32LE = function(f, m, T) {
                        return f = +f,
                        m >>>= 0,
                        T || P(this, f, m, 4, 4294967295, 0),
                        this[m + 3] = f >>> 24,
                        this[m + 2] = f >>> 16,
                        this[m + 1] = f >>> 8,
                        this[m] = 255 & f,
                        m + 4
                    }
                    ,
                    e.prototype.writeUint32BE = e.prototype.writeUInt32BE = function(f, m, T) {
                        return f = +f,
                        m >>>= 0,
                        T || P(this, f, m, 4, 4294967295, 0),
                        this[m] = f >>> 24,
                        this[m + 1] = f >>> 16,
                        this[m + 2] = f >>> 8,
                        this[m + 3] = 255 & f,
                        m + 4
                    }
                    ,
                    e.prototype.writeBigUInt64LE = Oe(function(f) {
                        var m = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                        return G(this, f, m, BigInt(0), BigInt("0xffffffffffffffff"))
                    }),
                    e.prototype.writeBigUInt64BE = Oe(function(f) {
                        var m = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                        return H(this, f, m, BigInt(0), BigInt("0xffffffffffffffff"))
                    }),
                    e.prototype.writeIntLE = function(f, m, T, K) {
                        if (f = +f,
                        m >>>= 0,
                        !K) {
                            var Q = Math.pow(2, 8 * T - 1);
                            P(this, f, m, T, Q - 1, -Q)
                        }
                        var q = 0
                          , Y = 1
                          , re = 0;
                        for (this[m] = 255 & f; ++q < T && (Y *= 256); )
                            f < 0 && re === 0 && this[m + q - 1] !== 0 && (re = 1),
                            this[m + q] = (f / Y >> 0) - re & 255;
                        return m + T
                    }
                    ,
                    e.prototype.writeIntBE = function(f, m, T, K) {
                        if (f = +f,
                        m >>>= 0,
                        !K) {
                            var Q = Math.pow(2, 8 * T - 1);
                            P(this, f, m, T, Q - 1, -Q)
                        }
                        var q = T - 1
                          , Y = 1
                          , re = 0;
                        for (this[m + q] = 255 & f; --q >= 0 && (Y *= 256); )
                            f < 0 && re === 0 && this[m + q + 1] !== 0 && (re = 1),
                            this[m + q] = (f / Y >> 0) - re & 255;
                        return m + T
                    }
                    ,
                    e.prototype.writeInt8 = function(f, m, T) {
                        return f = +f,
                        m >>>= 0,
                        T || P(this, f, m, 1, 127, -128),
                        f < 0 && (f = 255 + f + 1),
                        this[m] = 255 & f,
                        m + 1
                    }
                    ,
                    e.prototype.writeInt16LE = function(f, m, T) {
                        return f = +f,
                        m >>>= 0,
                        T || P(this, f, m, 2, 32767, -32768),
                        this[m] = 255 & f,
                        this[m + 1] = f >>> 8,
                        m + 2
                    }
                    ,
                    e.prototype.writeInt16BE = function(f, m, T) {
                        return f = +f,
                        m >>>= 0,
                        T || P(this, f, m, 2, 32767, -32768),
                        this[m] = f >>> 8,
                        this[m + 1] = 255 & f,
                        m + 2
                    }
                    ,
                    e.prototype.writeInt32LE = function(f, m, T) {
                        return f = +f,
                        m >>>= 0,
                        T || P(this, f, m, 4, 2147483647, -2147483648),
                        this[m] = 255 & f,
                        this[m + 1] = f >>> 8,
                        this[m + 2] = f >>> 16,
                        this[m + 3] = f >>> 24,
                        m + 4
                    }
                    ,
                    e.prototype.writeInt32BE = function(f, m, T) {
                        return f = +f,
                        m >>>= 0,
                        T || P(this, f, m, 4, 2147483647, -2147483648),
                        f < 0 && (f = 4294967295 + f + 1),
                        this[m] = f >>> 24,
                        this[m + 1] = f >>> 16,
                        this[m + 2] = f >>> 8,
                        this[m + 3] = 255 & f,
                        m + 4
                    }
                    ,
                    e.prototype.writeBigInt64LE = Oe(function(f) {
                        var m = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                        return G(this, f, m, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
                    }),
                    e.prototype.writeBigInt64BE = Oe(function(f) {
                        var m = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                        return H(this, f, m, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
                    }),
                    e.prototype.writeFloatLE = function(f, m, T) {
                        return Z(this, f, m, !0, T)
                    }
                    ,
                    e.prototype.writeFloatBE = function(f, m, T) {
                        return Z(this, f, m, !1, T)
                    }
                    ,
                    e.prototype.writeDoubleLE = function(f, m, T) {
                        return W(this, f, m, !0, T)
                    }
                    ,
                    e.prototype.writeDoubleBE = function(f, m, T) {
                        return W(this, f, m, !1, T)
                    }
                    ,
                    e.prototype.copy = function(f, m, T, K) {
                        if (!e.isBuffer(f))
                            throw new TypeError("argument should be a Buffer");
                        if (T || (T = 0),
                        K || K === 0 || (K = this.length),
                        m >= f.length && (m = f.length),
                        m || (m = 0),
                        K > 0 && K < T && (K = T),
                        K === T || f.length === 0 || this.length === 0)
                            return 0;
                        if (m < 0)
                            throw new RangeError("targetStart out of bounds");
                        if (T < 0 || T >= this.length)
                            throw new RangeError("Index out of range");
                        if (K < 0)
                            throw new RangeError("sourceEnd out of bounds");
                        K > this.length && (K = this.length),
                        f.length - m < K - T && (K = f.length - m + T);
                        var Q = K - T;
                        return this === f && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(m, T, K) : Uint8Array.prototype.set.call(f, this.subarray(T, K), m),
                        Q
                    }
                    ,
                    e.prototype.fill = function(f, m, T, K) {
                        if (typeof f == "string") {
                            if (typeof m == "string" ? (K = m,
                            m = 0,
                            T = this.length) : typeof T == "string" && (K = T,
                            T = this.length),
                            K !== void 0 && typeof K != "string")
                                throw new TypeError("encoding must be a string");
                            if (typeof K == "string" && !e.isEncoding(K))
                                throw new TypeError("Unknown encoding: " + K);
                            if (f.length === 1) {
                                var Q = f.charCodeAt(0);
                                (K === "utf8" && Q < 128 || K === "latin1") && (f = Q)
                            }
                        } else
                            typeof f == "number" ? f &= 255 : typeof f == "boolean" && (f = Number(f));
                        if (m < 0 || this.length < m || this.length < T)
                            throw new RangeError("Out of range index");
                        if (T <= m)
                            return this;
                        var q;
                        if (m >>>= 0,
                        T = T === void 0 ? this.length : T >>> 0,
                        f || (f = 0),
                        typeof f == "number")
                            for (q = m; q < T; ++q)
                                this[q] = f;
                        else {
                            var Y = e.isBuffer(f) ? f : e.from(f, K)
                              , re = Y.length;
                            if (re === 0)
                                throw new TypeError('The value "' + f + '" is invalid for argument "value"');
                            for (q = 0; q < T - m; ++q)
                                this[q + m] = Y[q % re]
                        }
                        return this
                    }
                    ;
                    var $ = {};
                    function te(f, m, T) {
                        $[f] = function(K) {
                            ge(q, K);
                            var Q = ye(q);
                            function q() {
                                var Y;
                                return ce(this, q),
                                Y = Q.call(this),
                                Object.defineProperty(Ke(Y), "message", {
                                    value: m.apply(Ke(Y), arguments),
                                    writable: !0,
                                    configurable: !0
                                }),
                                Y.name = "".concat(Y.name, " [").concat(f, "]"),
                                delete Y.name,
                                Y
                            }
                            return fe(q, [{
                                key: "code",
                                get: function() {
                                    return f
                                },
                                set: function(re) {
                                    Object.defineProperty(this, "code", {
                                        configurable: !0,
                                        enumerable: !0,
                                        value: re,
                                        writable: !0
                                    })
                                }
                            }, {
                                key: "toString",
                                value: function() {
                                    return "".concat(this.name, " [").concat(f, "]: ").concat(this.message)
                                }
                            }]),
                            q
                        }(T)
                    }
                    function ee(f) {
                        for (var m = "", T = f.length, K = f[0] === "-" ? 1 : 0; T >= K + 4; T -= 3)
                            m = "_".concat(f.slice(T - 3, T)).concat(m);
                        return "".concat(f.slice(0, T)).concat(m)
                    }
                    function J(f, m, T, K, Q, q) {
                        if (f > T || f < m) {
                            var Y = typeof m == "bigint" ? "n" : "", re;
                            throw re = q > 3 ? m === 0 || m === BigInt(0) ? ">= 0".concat(Y, " and < 2").concat(Y, " ** ").concat(8 * (q + 1)).concat(Y) : ">= -(2".concat(Y, " ** ").concat(8 * (q + 1) - 1).concat(Y, ") and < 2 ** ").concat(8 * (q + 1) - 1).concat(Y) : ">= ".concat(m).concat(Y, " and <= ").concat(T).concat(Y),
                            new $.ERR_OUT_OF_RANGE("value",re,f)
                        }
                        (function(ie, oe, ae) {
                            ne(oe, "offset"),
                            ie[oe] !== void 0 && ie[oe + ae] !== void 0 || se(oe, ie.length - (ae + 1))
                        }
                        )(K, Q, q)
                    }
                    function ne(f, m) {
                        if (typeof f != "number")
                            throw new $.ERR_INVALID_ARG_TYPE(m,"number",f)
                    }
                    function se(f, m, T) {
                        throw Math.floor(f) !== f ? (ne(f, T),
                        new $.ERR_OUT_OF_RANGE(T || "offset","an integer",f)) : m < 0 ? new $.ERR_BUFFER_OUT_OF_BOUNDS : new $.ERR_OUT_OF_RANGE(T || "offset",">= ".concat(T ? 1 : 0, " and <= ").concat(m),f)
                    }
                    te("ERR_BUFFER_OUT_OF_BOUNDS", function(f) {
                        return f ? "".concat(f, " is outside of buffer bounds") : "Attempt to access memory outside buffer bounds"
                    }, RangeError),
                    te("ERR_INVALID_ARG_TYPE", function(f, m) {
                        return 'The "'.concat(f, '" argument must be of type number. Received type ').concat(le(m))
                    }, TypeError),
                    te("ERR_OUT_OF_RANGE", function(f, m, T) {
                        var K = 'The value of "'.concat(f, '" is out of range.')
                          , Q = T;
                        return Number.isInteger(T) && Math.abs(T) > Math.pow(2, 32) ? Q = ee(String(T)) : typeof T == "bigint" && (Q = String(T),
                        (T > Math.pow(BigInt(2), BigInt(32)) || T < -Math.pow(BigInt(2), BigInt(32))) && (Q = ee(Q)),
                        Q += "n"),
                        K += " It must be ".concat(m, ". Received ").concat(Q),
                        K
                    }, RangeError);
                    var ve = /[^+/0-9A-Za-z-_]/g;
                    function Ae(f, m) {
                        var T;
                        m = m || 1 / 0;
                        for (var K = f.length, Q = null, q = [], Y = 0; Y < K; ++Y) {
                            if (T = f.charCodeAt(Y),
                            T > 55295 && T < 57344) {
                                if (!Q) {
                                    if (T > 56319) {
                                        (m -= 3) > -1 && q.push(239, 191, 189);
                                        continue
                                    }
                                    if (Y + 1 === K) {
                                        (m -= 3) > -1 && q.push(239, 191, 189);
                                        continue
                                    }
                                    Q = T;
                                    continue
                                }
                                if (T < 56320) {
                                    (m -= 3) > -1 && q.push(239, 191, 189),
                                    Q = T;
                                    continue
                                }
                                T = 65536 + (Q - 55296 << 10 | T - 56320)
                            } else
                                Q && (m -= 3) > -1 && q.push(239, 191, 189);
                            if (Q = null,
                            T < 128) {
                                if ((m -= 1) < 0)
                                    break;
                                q.push(T)
                            } else if (T < 2048) {
                                if ((m -= 2) < 0)
                                    break;
                                q.push(T >> 6 | 192, 63 & T | 128)
                            } else if (T < 65536) {
                                if ((m -= 3) < 0)
                                    break;
                                q.push(T >> 12 | 224, T >> 6 & 63 | 128, 63 & T | 128)
                            } else {
                                if (!(T < 1114112))
                                    throw new Error("Invalid code point");
                                if ((m -= 4) < 0)
                                    break;
                                q.push(T >> 18 | 240, T >> 12 & 63 | 128, T >> 6 & 63 | 128, 63 & T | 128)
                            }
                        }
                        return q
                    }
                    function mt(f) {
                        return g.toByteArray(function(m) {
                            if ((m = (m = m.split("=")[0]).trim().replace(ve, "")).length < 2)
                                return "";
                            for (; m.length % 4 != 0; )
                                m += "=";
                            return m
                        }(f))
                    }
                    function Xt(f, m, T, K) {
                        var Q;
                        for (Q = 0; Q < K && !(Q + T >= m.length || Q >= f.length); ++Q)
                            m[Q + T] = f[Q];
                        return Q
                    }
                    function we(f, m) {
                        return f instanceof m || f != null && f.constructor != null && f.constructor.name != null && f.constructor.name === m.name
                    }
                    function Sr(f) {
                        return f != f
                    }
                    var Qu = function() {
                        for (var f = "0123456789abcdef", m = new Array(256), T = 0; T < 16; ++T)
                            for (var K = 16 * T, Q = 0; Q < 16; ++Q)
                                m[K + Q] = f[T] + f[Q];
                        return m
                    }();
                    function Oe(f) {
                        return typeof BigInt == "undefined" ? Hu : f
                    }
                    function Hu() {
                        throw new Error("BigInt not supported")
                    }
                },
                451: function(_, D, k) {
                    var g;
                    g = typeof window != "undefined" ? window : k.g !== void 0 ? k.g : typeof self != "undefined" ? self : {},
                    _.exports = g
                },
                84: function(_, D) {
                    D.read = function(k, g, i, a, y) {
                        var U, e, v = 8 * y - a - 1, B = (1 << v) - 1, p = B >> 1, b = -7, w = i ? y - 1 : 0, M = i ? -1 : 1, N = k[g + w];
                        for (w += M,
                        U = N & (1 << -b) - 1,
                        N >>= -b,
                        b += v; b > 0; U = 256 * U + k[g + w],
                        w += M,
                        b -= 8)
                            ;
                        for (e = U & (1 << -b) - 1,
                        U >>= -b,
                        b += a; b > 0; e = 256 * e + k[g + w],
                        w += M,
                        b -= 8)
                            ;
                        if (U === 0)
                            U = 1 - p;
                        else {
                            if (U === B)
                                return e ? NaN : 1 / 0 * (N ? -1 : 1);
                            e += Math.pow(2, a),
                            U -= p
                        }
                        return (N ? -1 : 1) * e * Math.pow(2, U - a)
                    }
                    ,
                    D.write = function(k, g, i, a, y, U) {
                        var e, v, B, p = 8 * U - y - 1, b = (1 << p) - 1, w = b >> 1, M = y === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, N = a ? 0 : U - 1, O = a ? 1 : -1, x = g < 0 || g === 0 && 1 / g < 0 ? 1 : 0;
                        for (g = Math.abs(g),
                        isNaN(g) || g === 1 / 0 ? (v = isNaN(g) ? 1 : 0,
                        e = b) : (e = Math.floor(Math.log(g) / Math.LN2),
                        g * (B = Math.pow(2, -e)) < 1 && (e--,
                        B *= 2),
                        (g += e + w >= 1 ? M / B : M * Math.pow(2, 1 - w)) * B >= 2 && (e++,
                        B /= 2),
                        e + w >= b ? (v = 0,
                        e = b) : e + w >= 1 ? (v = (g * B - 1) * Math.pow(2, y),
                        e += w) : (v = g * Math.pow(2, w - 1) * Math.pow(2, y),
                        e = 0)); y >= 8; k[i + N] = 255 & v,
                        N += O,
                        v /= 256,
                        y -= 8)
                            ;
                        for (e = e << y | v,
                        p += y; p > 0; k[i + N] = 255 & e,
                        N += O,
                        e /= 256,
                        p -= 8)
                            ;
                        k[i + N - O] |= 128 * x
                    }
                },
                114: function(_, D, k) {
                    var g = k(654);
                    function i(N, O) {
                        g.cipher.registerAlgorithm(N, function() {
                            return new g.aes.Algorithm(N,O)
                        })
                    }
                    k(366),
                    k(534),
                    k(527),
                    _.exports = g.aes = g.aes || {},
                    g.aes.startEncrypting = function(N, O, x, o) {
                        var S = M({
                            key: N,
                            output: x,
                            decrypt: !1,
                            mode: o
                        });
                        return S.start(O),
                        S
                    }
                    ,
                    g.aes.createEncryptionCipher = function(N, O) {
                        return M({
                            key: N,
                            output: null,
                            decrypt: !1,
                            mode: O
                        })
                    }
                    ,
                    g.aes.startDecrypting = function(N, O, x, o) {
                        var S = M({
                            key: N,
                            output: x,
                            decrypt: !0,
                            mode: o
                        });
                        return S.start(O),
                        S
                    }
                    ,
                    g.aes.createDecryptionCipher = function(N, O) {
                        return M({
                            key: N,
                            output: null,
                            decrypt: !0,
                            mode: O
                        })
                    }
                    ,
                    g.aes.Algorithm = function(N, O) {
                        B || p();
                        var x = this;
                        x.name = N,
                        x.mode = new O({
                            blockSize: 16,
                            cipher: {
                                encrypt: function(S, L) {
                                    return w(x._w, S, L, !1)
                                },
                                decrypt: function(S, L) {
                                    return w(x._w, S, L, !0)
                                }
                            }
                        }),
                        x._init = !1
                    }
                    ,
                    g.aes.Algorithm.prototype.initialize = function(N) {
                        if (!this._init) {
                            var O, x = N.key;
                            if (typeof x != "string" || x.length !== 16 && x.length !== 24 && x.length !== 32) {
                                if (g.util.isArray(x) && (x.length === 16 || x.length === 24 || x.length === 32)) {
                                    O = x,
                                    x = g.util.createBuffer();
                                    for (var o = 0; o < O.length; ++o)
                                        x.putByte(O[o])
                                }
                            } else
                                x = g.util.createBuffer(x);
                            if (!g.util.isArray(x)) {
                                O = x,
                                x = [];
                                var S = O.length();
                                if (S === 16 || S === 24 || S === 32)
                                    for (S >>>= 2,
                                    o = 0; o < S; ++o)
                                        x.push(O.getInt32())
                            }
                            if (!g.util.isArray(x) || x.length !== 4 && x.length !== 6 && x.length !== 8)
                                throw new Error("Invalid key parameter.");
                            var L = this.mode.name
                              , V = ["CFB", "OFB", "CTR", "GCM"].indexOf(L) !== -1;
                            this._w = b(x, N.decrypt && !V),
                            this._init = !0
                        }
                    }
                    ,
                    g.aes._expandKey = function(N, O) {
                        return B || p(),
                        b(N, O)
                    }
                    ,
                    g.aes._updateBlock = w,
                    i("AES-ECB", g.cipher.modes.ecb),
                    i("AES-CBC", g.cipher.modes.cbc),
                    i("AES-CFB", g.cipher.modes.cfb),
                    i("AES-OFB", g.cipher.modes.ofb),
                    i("AES-CTR", g.cipher.modes.ctr),
                    i("AES-GCM", g.cipher.modes.gcm);
                    var a, y, U, e, v, B = !1;
                    function p() {
                        B = !0,
                        U = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
                        for (var N = new Array(256), O = 0; O < 128; ++O)
                            N[O] = O << 1,
                            N[O + 128] = O + 128 << 1 ^ 283;
                        for (a = new Array(256),
                        y = new Array(256),
                        e = new Array(4),
                        v = new Array(4),
                        O = 0; O < 4; ++O)
                            e[O] = new Array(256),
                            v[O] = new Array(256);
                        var x, o, S, L, V, F, j, z = 0, E = 0;
                        for (O = 0; O < 256; ++O) {
                            L = (L = E ^ E << 1 ^ E << 2 ^ E << 3 ^ E << 4) >> 8 ^ 255 & L ^ 99,
                            a[z] = L,
                            y[L] = z,
                            F = (V = N[L]) << 24 ^ L << 16 ^ L << 8 ^ L ^ V,
                            j = ((x = N[z]) ^ (o = N[x]) ^ (S = N[o])) << 24 ^ (z ^ S) << 16 ^ (z ^ o ^ S) << 8 ^ z ^ x ^ S;
                            for (var l = 0; l < 4; ++l)
                                e[l][z] = F,
                                v[l][L] = j,
                                F = F << 24 | F >>> 8,
                                j = j << 24 | j >>> 8;
                            z === 0 ? z = E = 1 : (z = x ^ N[N[N[x ^ S]]],
                            E ^= N[N[E]])
                        }
                    }
                    function b(N, O) {
                        for (var x, o = N.slice(0), S = 1, L = o.length, V = 4 * (L + 6 + 1), F = L; F < V; ++F)
                            x = o[F - 1],
                            F % L == 0 ? (x = a[x >>> 16 & 255] << 24 ^ a[x >>> 8 & 255] << 16 ^ a[255 & x] << 8 ^ a[x >>> 24] ^ U[S] << 24,
                            S++) : L > 6 && F % L == 4 && (x = a[x >>> 24] << 24 ^ a[x >>> 16 & 255] << 16 ^ a[x >>> 8 & 255] << 8 ^ a[255 & x]),
                            o[F] = o[F - L] ^ x;
                        if (O) {
                            for (var j, z = v[0], E = v[1], l = v[2], I = v[3], n = o.slice(0), c = (F = 0,
                            (V = o.length) - 4); F < V; F += 4,
                            c -= 4)
                                if (F === 0 || F === V - 4)
                                    n[F] = o[c],
                                    n[F + 1] = o[c + 3],
                                    n[F + 2] = o[c + 2],
                                    n[F + 3] = o[c + 1];
                                else
                                    for (var h = 0; h < 4; ++h)
                                        j = o[c + h],
                                        n[F + (3 & -h)] = z[a[j >>> 24]] ^ E[a[j >>> 16 & 255]] ^ l[a[j >>> 8 & 255]] ^ I[a[255 & j]];
                            o = n
                        }
                        return o
                    }
                    function w(N, O, x, o) {
                        var S, L, V, F, j, z, E, l, I, n, c, h, C = N.length / 4 - 1;
                        o ? (S = v[0],
                        L = v[1],
                        V = v[2],
                        F = v[3],
                        j = y) : (S = e[0],
                        L = e[1],
                        V = e[2],
                        F = e[3],
                        j = a),
                        z = O[0] ^ N[0],
                        E = O[o ? 3 : 1] ^ N[1],
                        l = O[2] ^ N[2],
                        I = O[o ? 1 : 3] ^ N[3];
                        for (var R = 3, P = 1; P < C; ++P)
                            n = S[z >>> 24] ^ L[E >>> 16 & 255] ^ V[l >>> 8 & 255] ^ F[255 & I] ^ N[++R],
                            c = S[E >>> 24] ^ L[l >>> 16 & 255] ^ V[I >>> 8 & 255] ^ F[255 & z] ^ N[++R],
                            h = S[l >>> 24] ^ L[I >>> 16 & 255] ^ V[z >>> 8 & 255] ^ F[255 & E] ^ N[++R],
                            I = S[I >>> 24] ^ L[z >>> 16 & 255] ^ V[E >>> 8 & 255] ^ F[255 & l] ^ N[++R],
                            z = n,
                            E = c,
                            l = h;
                        x[0] = j[z >>> 24] << 24 ^ j[E >>> 16 & 255] << 16 ^ j[l >>> 8 & 255] << 8 ^ j[255 & I] ^ N[++R],
                        x[o ? 3 : 1] = j[E >>> 24] << 24 ^ j[l >>> 16 & 255] << 16 ^ j[I >>> 8 & 255] << 8 ^ j[255 & z] ^ N[++R],
                        x[2] = j[l >>> 24] << 24 ^ j[I >>> 16 & 255] << 16 ^ j[z >>> 8 & 255] << 8 ^ j[255 & E] ^ N[++R],
                        x[o ? 1 : 3] = j[I >>> 24] << 24 ^ j[z >>> 16 & 255] << 16 ^ j[E >>> 8 & 255] << 8 ^ j[255 & l] ^ N[++R]
                    }
                    function M(N) {
                        var O, x = "AES-" + ((N = N || {}).mode || "CBC").toUpperCase(), o = (O = N.decrypt ? g.cipher.createDecipher(x, N.key) : g.cipher.createCipher(x, N.key)).start;
                        return O.start = function(S, L) {
                            var V = null;
                            L instanceof g.util.ByteBuffer && (V = L,
                            L = {}),
                            (L = L || {}).output = V,
                            L.iv = S,
                            o.call(O, L)
                        }
                        ,
                        O
                    }
                },
                374: function(_, D, k) {
                    var g = k(654);
                    k(527),
                    k(106);
                    var i = _.exports = g.asn1 = g.asn1 || {};
                    function a(e, v, B) {
                        if (B > v) {
                            var p = new Error("Too few bytes to parse DER.");
                            throw p.available = e.length(),
                            p.remaining = v,
                            p.requested = B,
                            p
                        }
                    }
                    function y(e, v, B, p) {
                        var b;
                        a(e, v, 2);
                        var w = e.getByte();
                        v--;
                        var M = 192 & w
                          , N = 31 & w;
                        b = e.length();
                        var O, x, o = function(n, c) {
                            var h = n.getByte();
                            if (c--,
                            h !== 128) {
                                var C;
                                if (128 & h) {
                                    var R = 127 & h;
                                    a(n, c, R),
                                    C = n.getInt(R << 3)
                                } else
                                    C = h;
                                if (C < 0)
                                    throw new Error("Negative length: " + C);
                                return C
                            }
                        }(e, v);
                        if (v -= b - e.length(),
                        o !== void 0 && o > v) {
                            if (p.strict) {
                                var S = new Error("Too few bytes to read ASN.1 value.");
                                throw S.available = e.length(),
                                S.remaining = v,
                                S.requested = o,
                                S
                            }
                            o = v
                        }
                        var L = (32 & w) == 32;
                        if (L)
                            if (O = [],
                            o === void 0)
                                for (; ; ) {
                                    if (a(e, v, 2),
                                    e.bytes(2) === String.fromCharCode(0, 0)) {
                                        e.getBytes(2),
                                        v -= 2;
                                        break
                                    }
                                    b = e.length(),
                                    O.push(y(e, v, B + 1, p)),
                                    v -= b - e.length()
                                }
                            else
                                for (; o > 0; )
                                    b = e.length(),
                                    O.push(y(e, o, B + 1, p)),
                                    v -= b - e.length(),
                                    o -= b - e.length();
                        if (O === void 0 && M === i.Class.UNIVERSAL && N === i.Type.BITSTRING && (x = e.bytes(o)),
                        O === void 0 && p.decodeBitStrings && M === i.Class.UNIVERSAL && N === i.Type.BITSTRING && o > 1) {
                            var V = e.read
                              , F = v
                              , j = 0;
                            if (N === i.Type.BITSTRING && (a(e, v, 1),
                            j = e.getByte(),
                            v--),
                            j === 0)
                                try {
                                    b = e.length();
                                    var z = y(e, v, B + 1, {
                                        strict: !0,
                                        decodeBitStrings: !0
                                    })
                                      , E = b - e.length();
                                    v -= E,
                                    N == i.Type.BITSTRING && E++;
                                    var l = z.tagClass;
                                    E !== o || l !== i.Class.UNIVERSAL && l !== i.Class.CONTEXT_SPECIFIC || (O = [z])
                                } catch (n) {}
                            O === void 0 && (e.read = V,
                            v = F)
                        }
                        if (O === void 0) {
                            if (o === void 0) {
                                if (p.strict)
                                    throw new Error("Non-constructed ASN.1 object of indefinite length.");
                                o = v
                            }
                            if (N === i.Type.BMPSTRING)
                                for (O = ""; o > 0; o -= 2)
                                    a(e, v, 2),
                                    O += String.fromCharCode(e.getInt16()),
                                    v -= 2;
                            else
                                O = e.getBytes(o),
                                v -= o
                        }
                        var I = x === void 0 ? null : {
                            bitStringContents: x
                        };
                        return i.create(M, N, L, O, I)
                    }
                    i.Class = {
                        UNIVERSAL: 0,
                        APPLICATION: 64,
                        CONTEXT_SPECIFIC: 128,
                        PRIVATE: 192
                    },
                    i.Type = {
                        NONE: 0,
                        BOOLEAN: 1,
                        INTEGER: 2,
                        BITSTRING: 3,
                        OCTETSTRING: 4,
                        NULL: 5,
                        OID: 6,
                        ODESC: 7,
                        EXTERNAL: 8,
                        REAL: 9,
                        ENUMERATED: 10,
                        EMBEDDED: 11,
                        UTF8: 12,
                        ROID: 13,
                        SEQUENCE: 16,
                        SET: 17,
                        PRINTABLESTRING: 19,
                        IA5STRING: 22,
                        UTCTIME: 23,
                        GENERALIZEDTIME: 24,
                        BMPSTRING: 30
                    },
                    i.create = function(e, v, B, p, b) {
                        if (g.util.isArray(p)) {
                            for (var w = [], M = 0; M < p.length; ++M)
                                p[M] !== void 0 && w.push(p[M]);
                            p = w
                        }
                        var N = {
                            tagClass: e,
                            type: v,
                            constructed: B,
                            composed: B || g.util.isArray(p),
                            value: p
                        };
                        return b && "bitStringContents"in b && (N.bitStringContents = b.bitStringContents,
                        N.original = i.copy(N)),
                        N
                    }
                    ,
                    i.copy = function(e, v) {
                        var B;
                        if (g.util.isArray(e)) {
                            B = [];
                            for (var p = 0; p < e.length; ++p)
                                B.push(i.copy(e[p], v));
                            return B
                        }
                        return typeof e == "string" ? e : (B = {
                            tagClass: e.tagClass,
                            type: e.type,
                            constructed: e.constructed,
                            composed: e.composed,
                            value: i.copy(e.value, v)
                        },
                        v && !v.excludeBitStringContents && (B.bitStringContents = e.bitStringContents),
                        B)
                    }
                    ,
                    i.equals = function(e, v, B) {
                        if (g.util.isArray(e)) {
                            if (!g.util.isArray(v) || e.length !== v.length)
                                return !1;
                            for (var p = 0; p < e.length; ++p)
                                if (!i.equals(e[p], v[p]))
                                    return !1;
                            return !0
                        }
                        if (le(e) != le(v))
                            return !1;
                        if (typeof e == "string")
                            return e === v;
                        var b = e.tagClass === v.tagClass && e.type === v.type && e.constructed === v.constructed && e.composed === v.composed && i.equals(e.value, v.value);
                        return B && B.includeBitStringContents && (b = b && e.bitStringContents === v.bitStringContents),
                        b
                    }
                    ,
                    i.getBerValueLength = function(e) {
                        var v = e.getByte();
                        if (v !== 128)
                            return 128 & v ? e.getInt((127 & v) << 3) : v
                    }
                    ,
                    i.fromDer = function(e, v) {
                        v === void 0 && (v = {
                            strict: !0,
                            parseAllBytes: !0,
                            decodeBitStrings: !0
                        }),
                        typeof v == "boolean" && (v = {
                            strict: v,
                            parseAllBytes: !0,
                            decodeBitStrings: !0
                        }),
                        "strict"in v || (v.strict = !0),
                        "parseAllBytes"in v || (v.parseAllBytes = !0),
                        "decodeBitStrings"in v || (v.decodeBitStrings = !0),
                        typeof e == "string" && (e = g.util.createBuffer(e));
                        var B = e.length()
                          , p = y(e, e.length(), 0, v);
                        if (v.parseAllBytes && e.length() !== 0) {
                            var b = new Error("Unparsed DER bytes remain after ASN.1 parsing.");
                            throw b.byteCount = B,
                            b.remaining = e.length(),
                            b
                        }
                        return p
                    }
                    ,
                    i.toDer = function(e) {
                        var v = g.util.createBuffer()
                          , B = e.tagClass | e.type
                          , p = g.util.createBuffer()
                          , b = !1;
                        if ("bitStringContents"in e && (b = !0,
                        e.original && (b = i.equals(e, e.original))),
                        b)
                            p.putBytes(e.bitStringContents);
                        else if (e.composed) {
                            e.constructed ? B |= 32 : p.putByte(0);
                            for (var w = 0; w < e.value.length; ++w)
                                e.value[w] !== void 0 && p.putBuffer(i.toDer(e.value[w]))
                        } else if (e.type === i.Type.BMPSTRING)
                            for (w = 0; w < e.value.length; ++w)
                                p.putInt16(e.value.charCodeAt(w));
                        else
                            e.type === i.Type.INTEGER && e.value.length > 1 && (e.value.charCodeAt(0) === 0 && !(128 & e.value.charCodeAt(1)) || e.value.charCodeAt(0) === 255 && (128 & e.value.charCodeAt(1)) == 128) ? p.putBytes(e.value.substr(1)) : p.putBytes(e.value);
                        if (v.putByte(B),
                        p.length() <= 127)
                            v.putByte(127 & p.length());
                        else {
                            var M = p.length()
                              , N = "";
                            do
                                N += String.fromCharCode(255 & M),
                                M >>>= 8;
                            while (M > 0);
                            for (v.putByte(128 | N.length),
                            w = N.length - 1; w >= 0; --w)
                                v.putByte(N.charCodeAt(w))
                        }
                        return v.putBuffer(p),
                        v
                    }
                    ,
                    i.oidToDer = function(e) {
                        var v, B, p, b, w = e.split("."), M = g.util.createBuffer();
                        M.putByte(40 * parseInt(w[0], 10) + parseInt(w[1], 10));
                        for (var N = 2; N < w.length; ++N) {
                            v = !0,
                            B = [],
                            p = parseInt(w[N], 10);
                            do
                                b = 127 & p,
                                p >>>= 7,
                                v || (b |= 128),
                                B.push(b),
                                v = !1;
                            while (p > 0);
                            for (var O = B.length - 1; O >= 0; --O)
                                M.putByte(B[O])
                        }
                        return M
                    }
                    ,
                    i.derToOid = function(e) {
                        var v;
                        typeof e == "string" && (e = g.util.createBuffer(e));
                        var B = e.getByte();
                        v = Math.floor(B / 40) + "." + B % 40;
                        for (var p = 0; e.length() > 0; )
                            p <<= 7,
                            128 & (B = e.getByte()) ? p += 127 & B : (v += "." + (p + B),
                            p = 0);
                        return v
                    }
                    ,
                    i.utcTimeToDate = function(e) {
                        var v = new Date
                          , B = parseInt(e.substr(0, 2), 10);
                        B = B >= 50 ? 1900 + B : 2e3 + B;
                        var p = parseInt(e.substr(2, 2), 10) - 1
                          , b = parseInt(e.substr(4, 2), 10)
                          , w = parseInt(e.substr(6, 2), 10)
                          , M = parseInt(e.substr(8, 2), 10)
                          , N = 0;
                        if (e.length > 11) {
                            var O = e.charAt(10)
                              , x = 10;
                            O !== "+" && O !== "-" && (N = parseInt(e.substr(10, 2), 10),
                            x += 2)
                        }
                        if (v.setUTCFullYear(B, p, b),
                        v.setUTCHours(w, M, N, 0),
                        x && ((O = e.charAt(x)) === "+" || O === "-")) {
                            var o = 60 * parseInt(e.substr(x + 1, 2), 10) + parseInt(e.substr(x + 4, 2), 10);
                            o *= 6e4,
                            O === "+" ? v.setTime(+v - o) : v.setTime(+v + o)
                        }
                        return v
                    }
                    ,
                    i.generalizedTimeToDate = function(e) {
                        var v = new Date
                          , B = parseInt(e.substr(0, 4), 10)
                          , p = parseInt(e.substr(4, 2), 10) - 1
                          , b = parseInt(e.substr(6, 2), 10)
                          , w = parseInt(e.substr(8, 2), 10)
                          , M = parseInt(e.substr(10, 2), 10)
                          , N = parseInt(e.substr(12, 2), 10)
                          , O = 0
                          , x = 0
                          , o = !1;
                        e.charAt(e.length - 1) === "Z" && (o = !0);
                        var S = e.length - 5
                          , L = e.charAt(S);
                        return L !== "+" && L !== "-" || (x = 60 * parseInt(e.substr(S + 1, 2), 10) + parseInt(e.substr(S + 4, 2), 10),
                        x *= 6e4,
                        L === "+" && (x *= -1),
                        o = !0),
                        e.charAt(14) === "." && (O = 1e3 * parseFloat(e.substr(14), 10)),
                        o ? (v.setUTCFullYear(B, p, b),
                        v.setUTCHours(w, M, N, O),
                        v.setTime(+v + x)) : (v.setFullYear(B, p, b),
                        v.setHours(w, M, N, O)),
                        v
                    }
                    ,
                    i.dateToUtcTime = function(e) {
                        if (typeof e == "string")
                            return e;
                        var v = ""
                          , B = [];
                        B.push(("" + e.getUTCFullYear()).substr(2)),
                        B.push("" + (e.getUTCMonth() + 1)),
                        B.push("" + e.getUTCDate()),
                        B.push("" + e.getUTCHours()),
                        B.push("" + e.getUTCMinutes()),
                        B.push("" + e.getUTCSeconds());
                        for (var p = 0; p < B.length; ++p)
                            B[p].length < 2 && (v += "0"),
                            v += B[p];
                        return v + "Z"
                    }
                    ,
                    i.dateToGeneralizedTime = function(e) {
                        if (typeof e == "string")
                            return e;
                        var v = ""
                          , B = [];
                        B.push("" + e.getUTCFullYear()),
                        B.push("" + (e.getUTCMonth() + 1)),
                        B.push("" + e.getUTCDate()),
                        B.push("" + e.getUTCHours()),
                        B.push("" + e.getUTCMinutes()),
                        B.push("" + e.getUTCSeconds());
                        for (var p = 0; p < B.length; ++p)
                            B[p].length < 2 && (v += "0"),
                            v += B[p];
                        return v + "Z"
                    }
                    ,
                    i.integerToDer = function(e) {
                        var v = g.util.createBuffer();
                        if (e >= -128 && e < 128)
                            return v.putSignedInt(e, 8);
                        if (e >= -32768 && e < 32768)
                            return v.putSignedInt(e, 16);
                        if (e >= -8388608 && e < 8388608)
                            return v.putSignedInt(e, 24);
                        if (e >= -2147483648 && e < 2147483648)
                            return v.putSignedInt(e, 32);
                        var B = new Error("Integer too large; max is 32-bits.");
                        throw B.integer = e,
                        B
                    }
                    ,
                    i.derToInteger = function(e) {
                        typeof e == "string" && (e = g.util.createBuffer(e));
                        var v = 8 * e.length();
                        if (v > 32)
                            throw new Error("Integer too large; max is 32-bits.");
                        return e.getSignedInt(v)
                    }
                    ,
                    i.validate = function(e, v, B, p) {
                        var b = !1;
                        if (e.tagClass !== v.tagClass && v.tagClass !== void 0 || e.type !== v.type && v.type !== void 0)
                            p && (e.tagClass !== v.tagClass && p.push("[" + v.name + '] Expected tag class "' + v.tagClass + '", got "' + e.tagClass + '"'),
                            e.type !== v.type && p.push("[" + v.name + '] Expected type "' + v.type + '", got "' + e.type + '"'));
                        else if (e.constructed === v.constructed || v.constructed === void 0) {
                            if (b = !0,
                            v.value && g.util.isArray(v.value))
                                for (var w = 0, M = 0; b && M < v.value.length; ++M)
                                    b = v.value[M].optional || !1,
                                    e.value[w] && ((b = i.validate(e.value[w], v.value[M], B, p)) ? ++w : v.value[M].optional && (b = !0)),
                                    !b && p && p.push("[" + v.name + '] Tag class "' + v.tagClass + '", type "' + v.type + '" expected value length "' + v.value.length + '", got "' + e.value.length + '"');
                            if (b && B && (v.capture && (B[v.capture] = e.value),
                            v.captureAsn1 && (B[v.captureAsn1] = e),
                            v.captureBitStringContents && "bitStringContents"in e && (B[v.captureBitStringContents] = e.bitStringContents),
                            v.captureBitStringValue && "bitStringContents"in e))
                                if (e.bitStringContents.length < 2)
                                    B[v.captureBitStringValue] = "";
                                else {
                                    if (e.bitStringContents.charCodeAt(0) !== 0)
                                        throw new Error("captureBitStringValue only supported for zero unused bits");
                                    B[v.captureBitStringValue] = e.bitStringContents.slice(1)
                                }
                        } else
                            p && p.push("[" + v.name + '] Expected constructed "' + v.constructed + '", got "' + e.constructed + '"');
                        return b
                    }
                    ;
                    var U = /[^\\u0000-\\u00ff]/;
                    i.prettyPrint = function(e, v, B) {
                        var p = "";
                        B = B || 2,
                        (v = v || 0) > 0 && (p += "\n");
                        for (var b = "", w = 0; w < v * B; ++w)
                            b += " ";
                        switch (p += b + "Tag: ",
                        e.tagClass) {
                        case i.Class.UNIVERSAL:
                            p += "Universal:";
                            break;
                        case i.Class.APPLICATION:
                            p += "Application:";
                            break;
                        case i.Class.CONTEXT_SPECIFIC:
                            p += "Context-Specific:";
                            break;
                        case i.Class.PRIVATE:
                            p += "Private:"
                        }
                        if (e.tagClass === i.Class.UNIVERSAL)
                            switch (p += e.type,
                            e.type) {
                            case i.Type.NONE:
                                p += " (None)";
                                break;
                            case i.Type.BOOLEAN:
                                p += " (Boolean)";
                                break;
                            case i.Type.INTEGER:
                                p += " (Integer)";
                                break;
                            case i.Type.BITSTRING:
                                p += " (Bit string)";
                                break;
                            case i.Type.OCTETSTRING:
                                p += " (Octet string)";
                                break;
                            case i.Type.NULL:
                                p += " (Null)";
                                break;
                            case i.Type.OID:
                                p += " (Object Identifier)";
                                break;
                            case i.Type.ODESC:
                                p += " (Object Descriptor)";
                                break;
                            case i.Type.EXTERNAL:
                                p += " (External or Instance of)";
                                break;
                            case i.Type.REAL:
                                p += " (Real)";
                                break;
                            case i.Type.ENUMERATED:
                                p += " (Enumerated)";
                                break;
                            case i.Type.EMBEDDED:
                                p += " (Embedded PDV)";
                                break;
                            case i.Type.UTF8:
                                p += " (UTF8)";
                                break;
                            case i.Type.ROID:
                                p += " (Relative Object Identifier)";
                                break;
                            case i.Type.SEQUENCE:
                                p += " (Sequence)";
                                break;
                            case i.Type.SET:
                                p += " (Set)";
                                break;
                            case i.Type.PRINTABLESTRING:
                                p += " (Printable String)";
                                break;
                            case i.Type.IA5String:
                                p += " (IA5String (ASCII))";
                                break;
                            case i.Type.UTCTIME:
                                p += " (UTC time)";
                                break;
                            case i.Type.GENERALIZEDTIME:
                                p += " (Generalized time)";
                                break;
                            case i.Type.BMPSTRING:
                                p += " (BMP String)"
                            }
                        else
                            p += e.type;
                        if (p += "\n",
                        p += b + "Constructed: " + e.constructed + "\n",
                        e.composed) {
                            var M = 0
                              , N = "";
                            for (w = 0; w < e.value.length; ++w)
                                e.value[w] !== void 0 && (M += 1,
                                N += i.prettyPrint(e.value[w], v + 1, B),
                                w + 1 < e.value.length && (N += ","));
                            p += b + "Sub values: " + M + N
                        } else {
                            if (p += b + "Value: ",
                            e.type === i.Type.OID) {
                                var O = i.derToOid(e.value);
                                p += O,
                                g.pki && g.pki.oids && O in g.pki.oids && (p += " (" + g.pki.oids[O] + ") ")
                            }
                            if (e.type === i.Type.INTEGER)
                                try {
                                    p += i.derToInteger(e.value)
                                } catch (o) {
                                    p += "0x" + g.util.bytesToHex(e.value)
                                }
                            else if (e.type === i.Type.BITSTRING) {
                                if (e.value.length > 1 ? p += "0x" + g.util.bytesToHex(e.value.slice(1)) : p += "(none)",
                                e.value.length > 0) {
                                    var x = e.value.charCodeAt(0);
                                    x == 1 ? p += " (1 unused bit shown)" : x > 1 && (p += " (" + x + " unused bits shown)")
                                }
                            } else if (e.type === i.Type.OCTETSTRING)
                                U.test(e.value) || (p += "(" + e.value + ") "),
                                p += "0x" + g.util.bytesToHex(e.value);
                            else if (e.type === i.Type.UTF8)
                                try {
                                    p += g.util.decodeUtf8(e.value)
                                } catch (o) {
                                    if (o.message !== "URI malformed")
                                        throw o;
                                    p += "0x" + g.util.bytesToHex(e.value) + " (malformed UTF8)"
                                }
                            else
                                e.type === i.Type.PRINTABLESTRING || e.type === i.Type.IA5String ? p += e.value : U.test(e.value) ? p += "0x" + g.util.bytesToHex(e.value) : e.value.length === 0 ? p += "[null]" : p += e.value
                        }
                        return p
                    }
                },
                973: function(_) {
                    var D = {};
                    _.exports = D;
                    var k = {};
                    D.encode = function(g, i, a) {
                        if (typeof i != "string")
                            throw new TypeError('"alphabet" must be a string.');
                        if (a !== void 0 && typeof a != "number")
                            throw new TypeError('"maxline" must be a number.');
                        var y = "";
                        if (g instanceof Uint8Array) {
                            var U = 0
                              , e = i.length
                              , v = i.charAt(0)
                              , B = [0];
                            for (U = 0; U < g.length; ++U) {
                                for (var p = 0, b = g[U]; p < B.length; ++p)
                                    b += B[p] << 8,
                                    B[p] = b % e,
                                    b = b / e | 0;
                                for (; b > 0; )
                                    B.push(b % e),
                                    b = b / e | 0
                            }
                            for (U = 0; g[U] === 0 && U < g.length - 1; ++U)
                                y += v;
                            for (U = B.length - 1; U >= 0; --U)
                                y += i[B[U]]
                        } else
                            y = function(M, N) {
                                var O = 0
                                  , x = N.length
                                  , o = N.charAt(0)
                                  , S = [0];
                                for (O = 0; O < M.length(); ++O) {
                                    for (var L = 0, V = M.at(O); L < S.length; ++L)
                                        V += S[L] << 8,
                                        S[L] = V % x,
                                        V = V / x | 0;
                                    for (; V > 0; )
                                        S.push(V % x),
                                        V = V / x | 0
                                }
                                var F = "";
                                for (O = 0; M.at(O) === 0 && O < M.length() - 1; ++O)
                                    F += o;
                                for (O = S.length - 1; O >= 0; --O)
                                    F += N[S[O]];
                                return F
                            }(g, i);
                        if (a) {
                            var w = new RegExp(".{1," + a + "}","g");
                            y = y.match(w).join("\r\n")
                        }
                        return y
                    }
                    ,
                    D.decode = function(g, i) {
                        if (typeof g != "string")
                            throw new TypeError('"input" must be a string.');
                        if (typeof i != "string")
                            throw new TypeError('"alphabet" must be a string.');
                        var a = k[i];
                        if (!a) {
                            a = k[i] = [];
                            for (var y = 0; y < i.length; ++y)
                                a[i.charCodeAt(y)] = y
                        }
                        g = g.replace(/\s/g, "");
                        var U = i.length
                          , e = i.charAt(0)
                          , v = [0];
                        for (y = 0; y < g.length; y++) {
                            var B = a[g.charCodeAt(y)];
                            if (B === void 0)
                                return;
                            for (var p = 0, b = B; p < v.length; ++p)
                                b += v[p] * U,
                                v[p] = 255 & b,
                                b >>= 8;
                            for (; b > 0; )
                                v.push(255 & b),
                                b >>= 8
                        }
                        for (var w = 0; g[w] === e && w < g.length - 1; ++w)
                            v.push(0);
                        return typeof Buffer != "undefined" ? Buffer.from(v.reverse()) : new Uint8Array(v.reverse())
                    }
                },
                366: function(_, D, k) {
                    var g = k(654);
                    k(527),
                    _.exports = g.cipher = g.cipher || {},
                    g.cipher.algorithms = g.cipher.algorithms || {},
                    g.cipher.createCipher = function(a, y) {
                        var U = a;
                        if (typeof U == "string" && (U = g.cipher.getAlgorithm(U)) && (U = U()),
                        !U)
                            throw new Error("Unsupported algorithm: " + a);
                        return new g.cipher.BlockCipher({
                            algorithm: U,
                            key: y,
                            decrypt: !1
                        })
                    }
                    ,
                    g.cipher.createDecipher = function(a, y) {
                        var U = a;
                        if (typeof U == "string" && (U = g.cipher.getAlgorithm(U)) && (U = U()),
                        !U)
                            throw new Error("Unsupported algorithm: " + a);
                        return new g.cipher.BlockCipher({
                            algorithm: U,
                            key: y,
                            decrypt: !0
                        })
                    }
                    ,
                    g.cipher.registerAlgorithm = function(a, y) {
                        a = a.toUpperCase(),
                        g.cipher.algorithms[a] = y
                    }
                    ,
                    g.cipher.getAlgorithm = function(a) {
                        return (a = a.toUpperCase())in g.cipher.algorithms ? g.cipher.algorithms[a] : null
                    }
                    ;
                    var i = g.cipher.BlockCipher = function(a) {
                        this.algorithm = a.algorithm,
                        this.mode = this.algorithm.mode,
                        this.blockSize = this.mode.blockSize,
                        this._finish = !1,
                        this._input = null,
                        this.output = null,
                        this._op = a.decrypt ? this.mode.decrypt : this.mode.encrypt,
                        this._decrypt = a.decrypt,
                        this.algorithm.initialize(a)
                    }
                    ;
                    i.prototype.start = function(a) {
                        a = a || {};
                        var y = {};
                        for (var U in a)
                            y[U] = a[U];
                        y.decrypt = this._decrypt,
                        this._finish = !1,
                        this._input = g.util.createBuffer(),
                        this.output = a.output || g.util.createBuffer(),
                        this.mode.start(y)
                    }
                    ,
                    i.prototype.update = function(a) {
                        for (a && this._input.putBuffer(a); !this._op.call(this.mode, this._input, this.output, this._finish) && !this._finish; )
                            ;
                        this._input.compact()
                    }
                    ,
                    i.prototype.finish = function(a) {
                        !a || this.mode.name !== "ECB" && this.mode.name !== "CBC" || (this.mode.pad = function(U) {
                            return a(this.blockSize, U, !1)
                        }
                        ,
                        this.mode.unpad = function(U) {
                            return a(this.blockSize, U, !0)
                        }
                        );
                        var y = {};
                        return y.decrypt = this._decrypt,
                        y.overflow = this._input.length() % this.blockSize,
                        !(!this._decrypt && this.mode.pad && !this.mode.pad(this._input, y) || (this._finish = !0,
                        this.update(),
                        this._decrypt && this.mode.unpad && !this.mode.unpad(this.output, y) || this.mode.afterFinish && !this.mode.afterFinish(this.output, y)))
                    }
                },
                534: function(_, D, k) {
                    var g = k(654);
                    k(527),
                    g.cipher = g.cipher || {};
                    var i = _.exports = g.cipher.modes = g.cipher.modes || {};
                    function a(e, v) {
                        if (typeof e == "string" && (e = g.util.createBuffer(e)),
                        g.util.isArray(e) && e.length > 4) {
                            var B = e;
                            e = g.util.createBuffer();
                            for (var p = 0; p < B.length; ++p)
                                e.putByte(B[p])
                        }
                        if (e.length() < v)
                            throw new Error("Invalid IV length; got " + e.length() + " bytes and expected " + v + " bytes.");
                        if (!g.util.isArray(e)) {
                            var b = []
                              , w = v / 4;
                            for (p = 0; p < w; ++p)
                                b.push(e.getInt32());
                            e = b
                        }
                        return e
                    }
                    function y(e) {
                        e[e.length - 1] = e[e.length - 1] + 1 & 4294967295
                    }
                    function U(e) {
                        return [e / 4294967296 | 0, 4294967295 & e]
                    }
                    i.ecb = function(e) {
                        e = e || {},
                        this.name = "ECB",
                        this.cipher = e.cipher,
                        this.blockSize = e.blockSize || 16,
                        this._ints = this.blockSize / 4,
                        this._inBlock = new Array(this._ints),
                        this._outBlock = new Array(this._ints)
                    }
                    ,
                    i.ecb.prototype.start = function(e) {}
                    ,
                    i.ecb.prototype.encrypt = function(e, v, B) {
                        if (e.length() < this.blockSize && !(B && e.length() > 0))
                            return !0;
                        for (var p = 0; p < this._ints; ++p)
                            this._inBlock[p] = e.getInt32();
                        for (this.cipher.encrypt(this._inBlock, this._outBlock),
                        p = 0; p < this._ints; ++p)
                            v.putInt32(this._outBlock[p])
                    }
                    ,
                    i.ecb.prototype.decrypt = function(e, v, B) {
                        if (e.length() < this.blockSize && !(B && e.length() > 0))
                            return !0;
                        for (var p = 0; p < this._ints; ++p)
                            this._inBlock[p] = e.getInt32();
                        for (this.cipher.decrypt(this._inBlock, this._outBlock),
                        p = 0; p < this._ints; ++p)
                            v.putInt32(this._outBlock[p])
                    }
                    ,
                    i.ecb.prototype.pad = function(e, v) {
                        var B = e.length() === this.blockSize ? this.blockSize : this.blockSize - e.length();
                        return e.fillWithByte(B, B),
                        !0
                    }
                    ,
                    i.ecb.prototype.unpad = function(e, v) {
                        if (v.overflow > 0)
                            return !1;
                        var B = e.length()
                          , p = e.at(B - 1);
                        return !(p > this.blockSize << 2 || (e.truncate(p),
                        0))
                    }
                    ,
                    i.cbc = function(e) {
                        e = e || {},
                        this.name = "CBC",
                        this.cipher = e.cipher,
                        this.blockSize = e.blockSize || 16,
                        this._ints = this.blockSize / 4,
                        this._inBlock = new Array(this._ints),
                        this._outBlock = new Array(this._ints)
                    }
                    ,
                    i.cbc.prototype.start = function(e) {
                        if (e.iv === null) {
                            if (!this._prev)
                                throw new Error("Invalid IV parameter.");
                            this._iv = this._prev.slice(0)
                        } else {
                            if (!("iv"in e))
                                throw new Error("Invalid IV parameter.");
                            this._iv = a(e.iv, this.blockSize),
                            this._prev = this._iv.slice(0)
                        }
                    }
                    ,
                    i.cbc.prototype.encrypt = function(e, v, B) {
                        if (e.length() < this.blockSize && !(B && e.length() > 0))
                            return !0;
                        for (var p = 0; p < this._ints; ++p)
                            this._inBlock[p] = this._prev[p] ^ e.getInt32();
                        for (this.cipher.encrypt(this._inBlock, this._outBlock),
                        p = 0; p < this._ints; ++p)
                            v.putInt32(this._outBlock[p]);
                        this._prev = this._outBlock
                    }
                    ,
                    i.cbc.prototype.decrypt = function(e, v, B) {
                        if (e.length() < this.blockSize && !(B && e.length() > 0))
                            return !0;
                        for (var p = 0; p < this._ints; ++p)
                            this._inBlock[p] = e.getInt32();
                        for (this.cipher.decrypt(this._inBlock, this._outBlock),
                        p = 0; p < this._ints; ++p)
                            v.putInt32(this._prev[p] ^ this._outBlock[p]);
                        this._prev = this._inBlock.slice(0)
                    }
                    ,
                    i.cbc.prototype.pad = function(e, v) {
                        var B = e.length() === this.blockSize ? this.blockSize : this.blockSize - e.length();
                        return e.fillWithByte(B, B),
                        !0
                    }
                    ,
                    i.cbc.prototype.unpad = function(e, v) {
                        if (v.overflow > 0)
                            return !1;
                        var B = e.length()
                          , p = e.at(B - 1);
                        return !(p > this.blockSize << 2 || (e.truncate(p),
                        0))
                    }
                    ,
                    i.cfb = function(e) {
                        e = e || {},
                        this.name = "CFB",
                        this.cipher = e.cipher,
                        this.blockSize = e.blockSize || 16,
                        this._ints = this.blockSize / 4,
                        this._inBlock = null,
                        this._outBlock = new Array(this._ints),
                        this._partialBlock = new Array(this._ints),
                        this._partialOutput = g.util.createBuffer(),
                        this._partialBytes = 0
                    }
                    ,
                    i.cfb.prototype.start = function(e) {
                        if (!("iv"in e))
                            throw new Error("Invalid IV parameter.");
                        this._iv = a(e.iv, this.blockSize),
                        this._inBlock = this._iv.slice(0),
                        this._partialBytes = 0
                    }
                    ,
                    i.cfb.prototype.encrypt = function(e, v, B) {
                        var p = e.length();
                        if (p === 0)
                            return !0;
                        if (this.cipher.encrypt(this._inBlock, this._outBlock),
                        this._partialBytes === 0 && p >= this.blockSize)
                            for (var b = 0; b < this._ints; ++b)
                                this._inBlock[b] = e.getInt32() ^ this._outBlock[b],
                                v.putInt32(this._inBlock[b]);
                        else {
                            var w = (this.blockSize - p) % this.blockSize;
                            for (w > 0 && (w = this.blockSize - w),
                            this._partialOutput.clear(),
                            b = 0; b < this._ints; ++b)
                                this._partialBlock[b] = e.getInt32() ^ this._outBlock[b],
                                this._partialOutput.putInt32(this._partialBlock[b]);
                            if (w > 0)
                                e.read -= this.blockSize;
                            else
                                for (b = 0; b < this._ints; ++b)
                                    this._inBlock[b] = this._partialBlock[b];
                            if (this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes),
                            w > 0 && !B)
                                return v.putBytes(this._partialOutput.getBytes(w - this._partialBytes)),
                                this._partialBytes = w,
                                !0;
                            v.putBytes(this._partialOutput.getBytes(p - this._partialBytes)),
                            this._partialBytes = 0
                        }
                    }
                    ,
                    i.cfb.prototype.decrypt = function(e, v, B) {
                        var p = e.length();
                        if (p === 0)
                            return !0;
                        if (this.cipher.encrypt(this._inBlock, this._outBlock),
                        this._partialBytes === 0 && p >= this.blockSize)
                            for (var b = 0; b < this._ints; ++b)
                                this._inBlock[b] = e.getInt32(),
                                v.putInt32(this._inBlock[b] ^ this._outBlock[b]);
                        else {
                            var w = (this.blockSize - p) % this.blockSize;
                            for (w > 0 && (w = this.blockSize - w),
                            this._partialOutput.clear(),
                            b = 0; b < this._ints; ++b)
                                this._partialBlock[b] = e.getInt32(),
                                this._partialOutput.putInt32(this._partialBlock[b] ^ this._outBlock[b]);
                            if (w > 0)
                                e.read -= this.blockSize;
                            else
                                for (b = 0; b < this._ints; ++b)
                                    this._inBlock[b] = this._partialBlock[b];
                            if (this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes),
                            w > 0 && !B)
                                return v.putBytes(this._partialOutput.getBytes(w - this._partialBytes)),
                                this._partialBytes = w,
                                !0;
                            v.putBytes(this._partialOutput.getBytes(p - this._partialBytes)),
                            this._partialBytes = 0
                        }
                    }
                    ,
                    i.ofb = function(e) {
                        e = e || {},
                        this.name = "OFB",
                        this.cipher = e.cipher,
                        this.blockSize = e.blockSize || 16,
                        this._ints = this.blockSize / 4,
                        this._inBlock = null,
                        this._outBlock = new Array(this._ints),
                        this._partialOutput = g.util.createBuffer(),
                        this._partialBytes = 0
                    }
                    ,
                    i.ofb.prototype.start = function(e) {
                        if (!("iv"in e))
                            throw new Error("Invalid IV parameter.");
                        this._iv = a(e.iv, this.blockSize),
                        this._inBlock = this._iv.slice(0),
                        this._partialBytes = 0
                    }
                    ,
                    i.ofb.prototype.encrypt = function(e, v, B) {
                        var p = e.length();
                        if (e.length() === 0)
                            return !0;
                        if (this.cipher.encrypt(this._inBlock, this._outBlock),
                        this._partialBytes === 0 && p >= this.blockSize)
                            for (var b = 0; b < this._ints; ++b)
                                v.putInt32(e.getInt32() ^ this._outBlock[b]),
                                this._inBlock[b] = this._outBlock[b];
                        else {
                            var w = (this.blockSize - p) % this.blockSize;
                            for (w > 0 && (w = this.blockSize - w),
                            this._partialOutput.clear(),
                            b = 0; b < this._ints; ++b)
                                this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[b]);
                            if (w > 0)
                                e.read -= this.blockSize;
                            else
                                for (b = 0; b < this._ints; ++b)
                                    this._inBlock[b] = this._outBlock[b];
                            if (this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes),
                            w > 0 && !B)
                                return v.putBytes(this._partialOutput.getBytes(w - this._partialBytes)),
                                this._partialBytes = w,
                                !0;
                            v.putBytes(this._partialOutput.getBytes(p - this._partialBytes)),
                            this._partialBytes = 0
                        }
                    }
                    ,
                    i.ofb.prototype.decrypt = i.ofb.prototype.encrypt,
                    i.ctr = function(e) {
                        e = e || {},
                        this.name = "CTR",
                        this.cipher = e.cipher,
                        this.blockSize = e.blockSize || 16,
                        this._ints = this.blockSize / 4,
                        this._inBlock = null,
                        this._outBlock = new Array(this._ints),
                        this._partialOutput = g.util.createBuffer(),
                        this._partialBytes = 0
                    }
                    ,
                    i.ctr.prototype.start = function(e) {
                        if (!("iv"in e))
                            throw new Error("Invalid IV parameter.");
                        this._iv = a(e.iv, this.blockSize),
                        this._inBlock = this._iv.slice(0),
                        this._partialBytes = 0
                    }
                    ,
                    i.ctr.prototype.encrypt = function(e, v, B) {
                        var p = e.length();
                        if (p === 0)
                            return !0;
                        if (this.cipher.encrypt(this._inBlock, this._outBlock),
                        this._partialBytes === 0 && p >= this.blockSize)
                            for (var b = 0; b < this._ints; ++b)
                                v.putInt32(e.getInt32() ^ this._outBlock[b]);
                        else {
                            var w = (this.blockSize - p) % this.blockSize;
                            for (w > 0 && (w = this.blockSize - w),
                            this._partialOutput.clear(),
                            b = 0; b < this._ints; ++b)
                                this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[b]);
                            if (w > 0 && (e.read -= this.blockSize),
                            this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes),
                            w > 0 && !B)
                                return v.putBytes(this._partialOutput.getBytes(w - this._partialBytes)),
                                this._partialBytes = w,
                                !0;
                            v.putBytes(this._partialOutput.getBytes(p - this._partialBytes)),
                            this._partialBytes = 0
                        }
                        y(this._inBlock)
                    }
                    ,
                    i.ctr.prototype.decrypt = i.ctr.prototype.encrypt,
                    i.gcm = function(e) {
                        e = e || {},
                        this.name = "GCM",
                        this.cipher = e.cipher,
                        this.blockSize = e.blockSize || 16,
                        this._ints = this.blockSize / 4,
                        this._inBlock = new Array(this._ints),
                        this._outBlock = new Array(this._ints),
                        this._partialOutput = g.util.createBuffer(),
                        this._partialBytes = 0,
                        this._R = 3774873600
                    }
                    ,
                    i.gcm.prototype.start = function(e) {
                        if (!("iv"in e))
                            throw new Error("Invalid IV parameter.");
                        var v, B = g.util.createBuffer(e.iv);
                        if (this._cipherLength = 0,
                        v = "additionalData"in e ? g.util.createBuffer(e.additionalData) : g.util.createBuffer(),
                        this._tagLength = "tagLength"in e ? e.tagLength : 128,
                        this._tag = null,
                        e.decrypt && (this._tag = g.util.createBuffer(e.tag).getBytes(),
                        this._tag.length !== this._tagLength / 8))
                            throw new Error("Authentication tag does not match tag length.");
                        this._hashBlock = new Array(this._ints),
                        this.tag = null,
                        this._hashSubkey = new Array(this._ints),
                        this.cipher.encrypt([0, 0, 0, 0], this._hashSubkey),
                        this.componentBits = 4,
                        this._m = this.generateHashTable(this._hashSubkey, this.componentBits);
                        var p = B.length();
                        if (p === 12)
                            this._j0 = [B.getInt32(), B.getInt32(), B.getInt32(), 1];
                        else {
                            for (this._j0 = [0, 0, 0, 0]; B.length() > 0; )
                                this._j0 = this.ghash(this._hashSubkey, this._j0, [B.getInt32(), B.getInt32(), B.getInt32(), B.getInt32()]);
                            this._j0 = this.ghash(this._hashSubkey, this._j0, [0, 0].concat(U(8 * p)))
                        }
                        this._inBlock = this._j0.slice(0),
                        y(this._inBlock),
                        this._partialBytes = 0,
                        v = g.util.createBuffer(v),
                        this._aDataLength = U(8 * v.length());
                        var b = v.length() % this.blockSize;
                        for (b && v.fillWithByte(0, this.blockSize - b),
                        this._s = [0, 0, 0, 0]; v.length() > 0; )
                            this._s = this.ghash(this._hashSubkey, this._s, [v.getInt32(), v.getInt32(), v.getInt32(), v.getInt32()])
                    }
                    ,
                    i.gcm.prototype.encrypt = function(e, v, B) {
                        var p = e.length();
                        if (p === 0)
                            return !0;
                        if (this.cipher.encrypt(this._inBlock, this._outBlock),
                        this._partialBytes === 0 && p >= this.blockSize) {
                            for (var b = 0; b < this._ints; ++b)
                                v.putInt32(this._outBlock[b] ^= e.getInt32());
                            this._cipherLength += this.blockSize
                        } else {
                            var w = (this.blockSize - p) % this.blockSize;
                            for (w > 0 && (w = this.blockSize - w),
                            this._partialOutput.clear(),
                            b = 0; b < this._ints; ++b)
                                this._partialOutput.putInt32(e.getInt32() ^ this._outBlock[b]);
                            if (w <= 0 || B) {
                                if (B) {
                                    var M = p % this.blockSize;
                                    this._cipherLength += M,
                                    this._partialOutput.truncate(this.blockSize - M)
                                } else
                                    this._cipherLength += this.blockSize;
                                for (b = 0; b < this._ints; ++b)
                                    this._outBlock[b] = this._partialOutput.getInt32();
                                this._partialOutput.read -= this.blockSize
                            }
                            if (this._partialBytes > 0 && this._partialOutput.getBytes(this._partialBytes),
                            w > 0 && !B)
                                return e.read -= this.blockSize,
                                v.putBytes(this._partialOutput.getBytes(w - this._partialBytes)),
                                this._partialBytes = w,
                                !0;
                            v.putBytes(this._partialOutput.getBytes(p - this._partialBytes)),
                            this._partialBytes = 0
                        }
                        this._s = this.ghash(this._hashSubkey, this._s, this._outBlock),
                        y(this._inBlock)
                    }
                    ,
                    i.gcm.prototype.decrypt = function(e, v, B) {
                        var p = e.length();
                        if (p < this.blockSize && !(B && p > 0))
                            return !0;
                        this.cipher.encrypt(this._inBlock, this._outBlock),
                        y(this._inBlock),
                        this._hashBlock[0] = e.getInt32(),
                        this._hashBlock[1] = e.getInt32(),
                        this._hashBlock[2] = e.getInt32(),
                        this._hashBlock[3] = e.getInt32(),
                        this._s = this.ghash(this._hashSubkey, this._s, this._hashBlock);
                        for (var b = 0; b < this._ints; ++b)
                            v.putInt32(this._outBlock[b] ^ this._hashBlock[b]);
                        p < this.blockSize ? this._cipherLength += p % this.blockSize : this._cipherLength += this.blockSize
                    }
                    ,
                    i.gcm.prototype.afterFinish = function(e, v) {
                        var B = !0;
                        v.decrypt && v.overflow && e.truncate(this.blockSize - v.overflow),
                        this.tag = g.util.createBuffer();
                        var p = this._aDataLength.concat(U(8 * this._cipherLength));
                        this._s = this.ghash(this._hashSubkey, this._s, p);
                        var b = [];
                        this.cipher.encrypt(this._j0, b);
                        for (var w = 0; w < this._ints; ++w)
                            this.tag.putInt32(this._s[w] ^ b[w]);
                        return this.tag.truncate(this.tag.length() % (this._tagLength / 8)),
                        v.decrypt && this.tag.bytes() !== this._tag && (B = !1),
                        B
                    }
                    ,
                    i.gcm.prototype.multiply = function(e, v) {
                        for (var B = [0, 0, 0, 0], p = v.slice(0), b = 0; b < 128; ++b)
                            e[b / 32 | 0] & 1 << 31 - b % 32 && (B[0] ^= p[0],
                            B[1] ^= p[1],
                            B[2] ^= p[2],
                            B[3] ^= p[3]),
                            this.pow(p, p);
                        return B
                    }
                    ,
                    i.gcm.prototype.pow = function(e, v) {
                        for (var B = 1 & e[3], p = 3; p > 0; --p)
                            v[p] = e[p] >>> 1 | (1 & e[p - 1]) << 31;
                        v[0] = e[0] >>> 1,
                        B && (v[0] ^= this._R)
                    }
                    ,
                    i.gcm.prototype.tableMultiply = function(e) {
                        for (var v = [0, 0, 0, 0], B = 0; B < 32; ++B) {
                            var p = e[B / 8 | 0] >>> 4 * (7 - B % 8) & 15
                              , b = this._m[B][p];
                            v[0] ^= b[0],
                            v[1] ^= b[1],
                            v[2] ^= b[2],
                            v[3] ^= b[3]
                        }
                        return v
                    }
                    ,
                    i.gcm.prototype.ghash = function(e, v, B) {
                        return v[0] ^= B[0],
                        v[1] ^= B[1],
                        v[2] ^= B[2],
                        v[3] ^= B[3],
                        this.tableMultiply(v)
                    }
                    ,
                    i.gcm.prototype.generateHashTable = function(e, v) {
                        for (var B = 8 / v, p = 4 * B, b = 16 * B, w = new Array(b), M = 0; M < b; ++M) {
                            var N = [0, 0, 0, 0]
                              , O = (p - 1 - M % p) * v;
                            N[M / p | 0] = 1 << v - 1 << O,
                            w[M] = this.generateSubHashTable(this.multiply(N, e), v)
                        }
                        return w
                    }
                    ,
                    i.gcm.prototype.generateSubHashTable = function(e, v) {
                        var B = 1 << v
                          , p = B >>> 1
                          , b = new Array(B);
                        b[p] = e.slice(0);
                        for (var w = p >>> 1; w > 0; )
                            this.pow(b[2 * w], b[w] = []),
                            w >>= 1;
                        for (w = 2; w < p; ) {
                            for (var M = 1; M < w; ++M) {
                                var N = b[w]
                                  , O = b[M];
                                b[w + M] = [N[0] ^ O[0], N[1] ^ O[1], N[2] ^ O[2], N[3] ^ O[3]]
                            }
                            w *= 2
                        }
                        for (b[0] = [0, 0, 0, 0],
                        w = p + 1; w < B; ++w) {
                            var x = b[w ^ p];
                            b[w] = [e[0] ^ x[0], e[1] ^ x[1], e[2] ^ x[2], e[3] ^ x[3]]
                        }
                        return b
                    }
                },
                707: function(_, D, k) {
                    var g = k(654);
                    function i(N, O) {
                        g.cipher.registerAlgorithm(N, function() {
                            return new g.des.Algorithm(N,O)
                        })
                    }
                    k(366),
                    k(534),
                    k(527),
                    _.exports = g.des = g.des || {},
                    g.des.startEncrypting = function(N, O, x, o) {
                        var S = M({
                            key: N,
                            output: x,
                            decrypt: !1,
                            mode: o || (O === null ? "ECB" : "CBC")
                        });
                        return S.start(O),
                        S
                    }
                    ,
                    g.des.createEncryptionCipher = function(N, O) {
                        return M({
                            key: N,
                            output: null,
                            decrypt: !1,
                            mode: O
                        })
                    }
                    ,
                    g.des.startDecrypting = function(N, O, x, o) {
                        var S = M({
                            key: N,
                            output: x,
                            decrypt: !0,
                            mode: o || (O === null ? "ECB" : "CBC")
                        });
                        return S.start(O),
                        S
                    }
                    ,
                    g.des.createDecryptionCipher = function(N, O) {
                        return M({
                            key: N,
                            output: null,
                            decrypt: !0,
                            mode: O
                        })
                    }
                    ,
                    g.des.Algorithm = function(N, O) {
                        var x = this;
                        x.name = N,
                        x.mode = new O({
                            blockSize: 8,
                            cipher: {
                                encrypt: function(S, L) {
                                    return w(x._keys, S, L, !1)
                                },
                                decrypt: function(S, L) {
                                    return w(x._keys, S, L, !0)
                                }
                            }
                        }),
                        x._init = !1
                    }
                    ,
                    g.des.Algorithm.prototype.initialize = function(N) {
                        if (!this._init) {
                            var O = g.util.createBuffer(N.key);
                            if (this.name.indexOf("3DES") === 0 && O.length() !== 24)
                                throw new Error("Invalid Triple-DES key size: " + 8 * O.length());
                            this._keys = function(x) {
                                for (var o, S = [0, 4, 536870912, 536870916, 65536, 65540, 536936448, 536936452, 512, 516, 536871424, 536871428, 66048, 66052, 536936960, 536936964], L = [0, 1, 1048576, 1048577, 67108864, 67108865, 68157440, 68157441, 256, 257, 1048832, 1048833, 67109120, 67109121, 68157696, 68157697], V = [0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272, 0, 8, 2048, 2056, 16777216, 16777224, 16779264, 16779272], F = [0, 2097152, 134217728, 136314880, 8192, 2105344, 134225920, 136323072, 131072, 2228224, 134348800, 136445952, 139264, 2236416, 134356992, 136454144], j = [0, 262144, 16, 262160, 0, 262144, 16, 262160, 4096, 266240, 4112, 266256, 4096, 266240, 4112, 266256], z = [0, 1024, 32, 1056, 0, 1024, 32, 1056, 33554432, 33555456, 33554464, 33555488, 33554432, 33555456, 33554464, 33555488], E = [0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746, 0, 268435456, 524288, 268959744, 2, 268435458, 524290, 268959746], l = [0, 65536, 2048, 67584, 536870912, 536936448, 536872960, 536938496, 131072, 196608, 133120, 198656, 537001984, 537067520, 537004032, 537069568], I = [0, 262144, 0, 262144, 2, 262146, 2, 262146, 33554432, 33816576, 33554432, 33816576, 33554434, 33816578, 33554434, 33816578], n = [0, 268435456, 8, 268435464, 0, 268435456, 8, 268435464, 1024, 268436480, 1032, 268436488, 1024, 268436480, 1032, 268436488], c = [0, 32, 0, 32, 1048576, 1048608, 1048576, 1048608, 8192, 8224, 8192, 8224, 1056768, 1056800, 1056768, 1056800], h = [0, 16777216, 512, 16777728, 2097152, 18874368, 2097664, 18874880, 67108864, 83886080, 67109376, 83886592, 69206016, 85983232, 69206528, 85983744], C = [0, 4096, 134217728, 134221824, 524288, 528384, 134742016, 134746112, 16, 4112, 134217744, 134221840, 524304, 528400, 134742032, 134746128], R = [0, 4, 256, 260, 0, 4, 256, 260, 1, 5, 257, 261, 1, 5, 257, 261], P = x.length() > 8 ? 3 : 1, G = [], H = [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0], X = 0, Z = 0; Z < P; Z++) {
                                    var W = x.getInt32()
                                      , $ = x.getInt32();
                                    W ^= (o = 252645135 & (W >>> 4 ^ $)) << 4,
                                    W ^= o = 65535 & (($ ^= o) >>> -16 ^ W),
                                    W ^= (o = 858993459 & (W >>> 2 ^ ($ ^= o << -16))) << 2,
                                    W ^= o = 65535 & (($ ^= o) >>> -16 ^ W),
                                    W ^= (o = 1431655765 & (W >>> 1 ^ ($ ^= o << -16))) << 1,
                                    W ^= o = 16711935 & (($ ^= o) >>> 8 ^ W),
                                    o = (W ^= (o = 1431655765 & (W >>> 1 ^ ($ ^= o << 8))) << 1) << 8 | ($ ^= o) >>> 20 & 240,
                                    W = $ << 24 | $ << 8 & 16711680 | $ >>> 8 & 65280 | $ >>> 24 & 240,
                                    $ = o;
                                    for (var te = 0; te < H.length; ++te) {
                                        H[te] ? (W = W << 2 | W >>> 26,
                                        $ = $ << 2 | $ >>> 26) : (W = W << 1 | W >>> 27,
                                        $ = $ << 1 | $ >>> 27);
                                        var ee = S[(W &= -15) >>> 28] | L[W >>> 24 & 15] | V[W >>> 20 & 15] | F[W >>> 16 & 15] | j[W >>> 12 & 15] | z[W >>> 8 & 15] | E[W >>> 4 & 15]
                                          , J = l[($ &= -15) >>> 28] | I[$ >>> 24 & 15] | n[$ >>> 20 & 15] | c[$ >>> 16 & 15] | h[$ >>> 12 & 15] | C[$ >>> 8 & 15] | R[$ >>> 4 & 15];
                                        o = 65535 & (J >>> 16 ^ ee),
                                        G[X++] = ee ^ o,
                                        G[X++] = J ^ o << 16
                                    }
                                }
                                return G
                            }(O),
                            this._init = !0
                        }
                    }
                    ,
                    i("DES-ECB", g.cipher.modes.ecb),
                    i("DES-CBC", g.cipher.modes.cbc),
                    i("DES-CFB", g.cipher.modes.cfb),
                    i("DES-OFB", g.cipher.modes.ofb),
                    i("DES-CTR", g.cipher.modes.ctr),
                    i("3DES-ECB", g.cipher.modes.ecb),
                    i("3DES-CBC", g.cipher.modes.cbc),
                    i("3DES-CFB", g.cipher.modes.cfb),
                    i("3DES-OFB", g.cipher.modes.ofb),
                    i("3DES-CTR", g.cipher.modes.ctr);
                    var a = [16843776, 0, 65536, 16843780, 16842756, 66564, 4, 65536, 1024, 16843776, 16843780, 1024, 16778244, 16842756, 16777216, 4, 1028, 16778240, 16778240, 66560, 66560, 16842752, 16842752, 16778244, 65540, 16777220, 16777220, 65540, 0, 1028, 66564, 16777216, 65536, 16843780, 4, 16842752, 16843776, 16777216, 16777216, 1024, 16842756, 65536, 66560, 16777220, 1024, 4, 16778244, 66564, 16843780, 65540, 16842752, 16778244, 16777220, 1028, 66564, 16843776, 1028, 16778240, 16778240, 0, 65540, 66560, 0, 16842756]
                      , y = [-2146402272, -2147450880, 32768, 1081376, 1048576, 32, -2146435040, -2147450848, -2147483616, -2146402272, -2146402304, -2147483648, -2147450880, 1048576, 32, -2146435040, 1081344, 1048608, -2147450848, 0, -2147483648, 32768, 1081376, -2146435072, 1048608, -2147483616, 0, 1081344, 32800, -2146402304, -2146435072, 32800, 0, 1081376, -2146435040, 1048576, -2147450848, -2146435072, -2146402304, 32768, -2146435072, -2147450880, 32, -2146402272, 1081376, 32, 32768, -2147483648, 32800, -2146402304, 1048576, -2147483616, 1048608, -2147450848, -2147483616, 1048608, 1081344, 0, -2147450880, 32800, -2147483648, -2146435040, -2146402272, 1081344]
                      , U = [520, 134349312, 0, 134348808, 134218240, 0, 131592, 134218240, 131080, 134217736, 134217736, 131072, 134349320, 131080, 134348800, 520, 134217728, 8, 134349312, 512, 131584, 134348800, 134348808, 131592, 134218248, 131584, 131072, 134218248, 8, 134349320, 512, 134217728, 134349312, 134217728, 131080, 520, 131072, 134349312, 134218240, 0, 512, 131080, 134349320, 134218240, 134217736, 512, 0, 134348808, 134218248, 131072, 134217728, 134349320, 8, 131592, 131584, 134217736, 134348800, 134218248, 520, 134348800, 131592, 8, 134348808, 131584]
                      , e = [8396801, 8321, 8321, 128, 8396928, 8388737, 8388609, 8193, 0, 8396800, 8396800, 8396929, 129, 0, 8388736, 8388609, 1, 8192, 8388608, 8396801, 128, 8388608, 8193, 8320, 8388737, 1, 8320, 8388736, 8192, 8396928, 8396929, 129, 8388736, 8388609, 8396800, 8396929, 129, 0, 0, 8396800, 8320, 8388736, 8388737, 1, 8396801, 8321, 8321, 128, 8396929, 129, 1, 8192, 8388609, 8193, 8396928, 8388737, 8193, 8320, 8388608, 8396801, 128, 8388608, 8192, 8396928]
                      , v = [256, 34078976, 34078720, 1107296512, 524288, 256, 1073741824, 34078720, 1074266368, 524288, 33554688, 1074266368, 1107296512, 1107820544, 524544, 1073741824, 33554432, 1074266112, 1074266112, 0, 1073742080, 1107820800, 1107820800, 33554688, 1107820544, 1073742080, 0, 1107296256, 34078976, 33554432, 1107296256, 524544, 524288, 1107296512, 256, 33554432, 1073741824, 34078720, 1107296512, 1074266368, 33554688, 1073741824, 1107820544, 34078976, 1074266368, 256, 33554432, 1107820544, 1107820800, 524544, 1107296256, 1107820800, 34078720, 0, 1074266112, 1107296256, 524544, 33554688, 1073742080, 524288, 0, 1074266112, 34078976, 1073742080]
                      , B = [536870928, 541065216, 16384, 541081616, 541065216, 16, 541081616, 4194304, 536887296, 4210704, 4194304, 536870928, 4194320, 536887296, 536870912, 16400, 0, 4194320, 536887312, 16384, 4210688, 536887312, 16, 541065232, 541065232, 0, 4210704, 541081600, 16400, 4210688, 541081600, 536870912, 536887296, 16, 541065232, 4210688, 541081616, 4194304, 16400, 536870928, 4194304, 536887296, 536870912, 16400, 536870928, 541081616, 4210688, 541065216, 4210704, 541081600, 0, 541065232, 16, 16384, 541065216, 4210704, 16384, 4194320, 536887312, 0, 541081600, 536870912, 4194320, 536887312]
                      , p = [2097152, 69206018, 67110914, 0, 2048, 67110914, 2099202, 69208064, 69208066, 2097152, 0, 67108866, 2, 67108864, 69206018, 2050, 67110912, 2099202, 2097154, 67110912, 67108866, 69206016, 69208064, 2097154, 69206016, 2048, 2050, 69208066, 2099200, 2, 67108864, 2099200, 67108864, 2099200, 2097152, 67110914, 67110914, 69206018, 69206018, 2, 2097154, 67108864, 67110912, 2097152, 69208064, 2050, 2099202, 69208064, 2050, 67108866, 69208066, 69206016, 2099200, 0, 2, 69208066, 0, 2099202, 69206016, 2048, 67108866, 67110912, 2048, 2097154]
                      , b = [268439616, 4096, 262144, 268701760, 268435456, 268439616, 64, 268435456, 262208, 268697600, 268701760, 266240, 268701696, 266304, 4096, 64, 268697600, 268435520, 268439552, 4160, 266240, 262208, 268697664, 268701696, 4160, 0, 0, 268697664, 268435520, 268439552, 266304, 262144, 266304, 262144, 268701696, 4096, 64, 268697664, 4096, 266304, 268439552, 64, 268435520, 268697600, 268697664, 268435456, 262144, 268439616, 0, 268701760, 262208, 268435520, 268697600, 268439552, 268439616, 0, 268701760, 266240, 266240, 4160, 4160, 262208, 268435456, 268701696];
                    function w(N, O, x, o) {
                        var S, L, V = N.length === 32 ? 3 : 9;
                        S = V === 3 ? o ? [30, -2, -2] : [0, 32, 2] : o ? [94, 62, -2, 32, 64, 2, 30, -2, -2] : [0, 32, 2, 62, 30, -2, 64, 96, 2];
                        var F = O[0]
                          , j = O[1];
                        F ^= (L = 252645135 & (F >>> 4 ^ j)) << 4,
                        F ^= (L = 65535 & (F >>> 16 ^ (j ^= L))) << 16,
                        F ^= L = 858993459 & ((j ^= L) >>> 2 ^ F),
                        F ^= L = 16711935 & ((j ^= L << 2) >>> 8 ^ F),
                        F = (F ^= (L = 1431655765 & (F >>> 1 ^ (j ^= L << 8))) << 1) << 1 | F >>> 31,
                        j = (j ^= L) << 1 | j >>> 31;
                        for (var z = 0; z < V; z += 3) {
                            for (var E = S[z + 1], l = S[z + 2], I = S[z]; I != E; I += l) {
                                var n = j ^ N[I]
                                  , c = (j >>> 4 | j << 28) ^ N[I + 1];
                                L = F,
                                F = j,
                                j = L ^ (y[n >>> 24 & 63] | e[n >>> 16 & 63] | B[n >>> 8 & 63] | b[63 & n] | a[c >>> 24 & 63] | U[c >>> 16 & 63] | v[c >>> 8 & 63] | p[63 & c])
                            }
                            L = F,
                            F = j,
                            j = L
                        }
                        j = j >>> 1 | j << 31,
                        j ^= L = 1431655765 & ((F = F >>> 1 | F << 31) >>> 1 ^ j),
                        j ^= (L = 16711935 & (j >>> 8 ^ (F ^= L << 1))) << 8,
                        j ^= (L = 858993459 & (j >>> 2 ^ (F ^= L))) << 2,
                        j ^= L = 65535 & ((F ^= L) >>> 16 ^ j),
                        j ^= L = 252645135 & ((F ^= L << 16) >>> 4 ^ j),
                        F ^= L << 4,
                        x[0] = F,
                        x[1] = j
                    }
                    function M(N) {
                        var O, x = "DES-" + ((N = N || {}).mode || "CBC").toUpperCase(), o = (O = N.decrypt ? g.cipher.createDecipher(x, N.key) : g.cipher.createCipher(x, N.key)).start;
                        return O.start = function(S, L) {
                            var V = null;
                            L instanceof g.util.ByteBuffer && (V = L,
                            L = {}),
                            (L = L || {}).output = V,
                            L.iv = S,
                            o.call(O, L)
                        }
                        ,
                        O
                    }
                },
                654: function(_) {
                    _.exports = {
                        options: {
                            usePureJavaScript: !1
                        }
                    }
                },
                491: function(_, D, k) {
                    var g = k(654);
                    k(419),
                    k(527),
                    (_.exports = g.hmac = g.hmac || {}).create = function() {
                        var i = null
                          , a = null
                          , y = null
                          , U = null
                          , e = {
                            start: function(B, p) {
                                if (B !== null)
                                    if (typeof B == "string") {
                                        if (!((B = B.toLowerCase())in g.md.algorithms))
                                            throw new Error('Unknown hash algorithm "' + B + '"');
                                        a = g.md.algorithms[B].create()
                                    } else
                                        a = B;
                                if (p === null)
                                    p = i;
                                else {
                                    if (typeof p == "string")
                                        p = g.util.createBuffer(p);
                                    else if (g.util.isArray(p)) {
                                        var b = p;
                                        p = g.util.createBuffer();
                                        for (var w = 0; w < b.length; ++w)
                                            p.putByte(b[w])
                                    }
                                    var M = p.length();
                                    for (M > a.blockLength && (a.start(),
                                    a.update(p.bytes()),
                                    p = a.digest()),
                                    y = g.util.createBuffer(),
                                    U = g.util.createBuffer(),
                                    M = p.length(),
                                    w = 0; w < M; ++w)
                                        b = p.at(w),
                                        y.putByte(54 ^ b),
                                        U.putByte(92 ^ b);
                                    if (M < a.blockLength)
                                        for (b = a.blockLength - M,
                                        w = 0; w < b; ++w)
                                            y.putByte(54),
                                            U.putByte(92);
                                    i = p,
                                    y = y.bytes(),
                                    U = U.bytes()
                                }
                                a.start(),
                                a.update(y)
                            },
                            update: function(B) {
                                a.update(B)
                            },
                            getMac: function() {
                                var B = a.digest().bytes();
                                return a.start(),
                                a.update(U),
                                a.update(B),
                                a.digest()
                            }
                        };
                        return e.digest = e.getMac,
                        e
                    }
                },
                562: function(_, D, k) {
                    var g, i = k(654);
                    function a(n, c, h) {
                        this.data = [],
                        n != null && (typeof n == "number" ? this.fromNumber(n, c, h) : c == null && typeof n != "string" ? this.fromString(n, 256) : this.fromString(n, c))
                    }
                    function y() {
                        return new a(null)
                    }
                    function U(n, c, h, C, R, P) {
                        for (var G = 16383 & c, H = c >> 14; --P >= 0; ) {
                            var X = 16383 & this.data[n]
                              , Z = this.data[n++] >> 14
                              , W = H * X + Z * G;
                            R = ((X = G * X + ((16383 & W) << 14) + h.data[C] + R) >> 28) + (W >> 14) + H * Z,
                            h.data[C++] = 268435455 & X
                        }
                        return R
                    }
                    _.exports = i.jsbn = i.jsbn || {},
                    i.jsbn.BigInteger = a,
                    typeof navigator == "undefined" ? (a.prototype.am = U,
                    g = 28) : navigator.appName == "Microsoft Internet Explorer" ? (a.prototype.am = function(n, c, h, C, R, P) {
                        for (var G = 32767 & c, H = c >> 15; --P >= 0; ) {
                            var X = 32767 & this.data[n]
                              , Z = this.data[n++] >> 15
                              , W = H * X + Z * G;
                            R = ((X = G * X + ((32767 & W) << 15) + h.data[C] + (1073741823 & R)) >>> 30) + (W >>> 15) + H * Z + (R >>> 30),
                            h.data[C++] = 1073741823 & X
                        }
                        return R
                    }
                    ,
                    g = 30) : navigator.appName != "Netscape" ? (a.prototype.am = function(n, c, h, C, R, P) {
                        for (; --P >= 0; ) {
                            var G = c * this.data[n++] + h.data[C] + R;
                            R = Math.floor(G / 67108864),
                            h.data[C++] = 67108863 & G
                        }
                        return R
                    }
                    ,
                    g = 26) : (a.prototype.am = U,
                    g = 28),
                    a.prototype.DB = g,
                    a.prototype.DM = (1 << g) - 1,
                    a.prototype.DV = 1 << g,
                    a.prototype.FV = Math.pow(2, 52),
                    a.prototype.F1 = 52 - g,
                    a.prototype.F2 = 2 * g - 52;
                    var e, v, B = new Array;
                    for (e = "0".charCodeAt(0),
                    v = 0; v <= 9; ++v)
                        B[e++] = v;
                    for (e = "a".charCodeAt(0),
                    v = 10; v < 36; ++v)
                        B[e++] = v;
                    for (e = "A".charCodeAt(0),
                    v = 10; v < 36; ++v)
                        B[e++] = v;
                    function p(n) {
                        return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(n)
                    }
                    function b(n, c) {
                        var h = B[n.charCodeAt(c)];
                        return h == null ? -1 : h
                    }
                    function w(n) {
                        var c = y();
                        return c.fromInt(n),
                        c
                    }
                    function M(n) {
                        var c, h = 1;
                        return (c = n >>> 16) != 0 && (n = c,
                        h += 16),
                        (c = n >> 8) != 0 && (n = c,
                        h += 8),
                        (c = n >> 4) != 0 && (n = c,
                        h += 4),
                        (c = n >> 2) != 0 && (n = c,
                        h += 2),
                        (c = n >> 1) != 0 && (n = c,
                        h += 1),
                        h
                    }
                    function N(n) {
                        this.m = n
                    }
                    function O(n) {
                        this.m = n,
                        this.mp = n.invDigit(),
                        this.mpl = 32767 & this.mp,
                        this.mph = this.mp >> 15,
                        this.um = (1 << n.DB - 15) - 1,
                        this.mt2 = 2 * n.t
                    }
                    function x(n, c) {
                        return n & c
                    }
                    function o(n, c) {
                        return n | c
                    }
                    function S(n, c) {
                        return n ^ c
                    }
                    function L(n, c) {
                        return n & ~c
                    }
                    function V(n) {
                        if (n == 0)
                            return -1;
                        var c = 0;
                        return !(65535 & n) && (n >>= 16,
                        c += 16),
                        !(255 & n) && (n >>= 8,
                        c += 8),
                        !(15 & n) && (n >>= 4,
                        c += 4),
                        !(3 & n) && (n >>= 2,
                        c += 2),
                        !(1 & n) && ++c,
                        c
                    }
                    function F(n) {
                        for (var c = 0; n != 0; )
                            n &= n - 1,
                            ++c;
                        return c
                    }
                    function j() {}
                    function z(n) {
                        return n
                    }
                    function E(n) {
                        this.r2 = y(),
                        this.q3 = y(),
                        a.ONE.dlShiftTo(2 * n.t, this.r2),
                        this.mu = this.r2.divide(n),
                        this.m = n
                    }
                    N.prototype.convert = function(n) {
                        return n.s < 0 || n.compareTo(this.m) >= 0 ? n.mod(this.m) : n
                    }
                    ,
                    N.prototype.revert = function(n) {
                        return n
                    }
                    ,
                    N.prototype.reduce = function(n) {
                        n.divRemTo(this.m, null, n)
                    }
                    ,
                    N.prototype.mulTo = function(n, c, h) {
                        n.multiplyTo(c, h),
                        this.reduce(h)
                    }
                    ,
                    N.prototype.sqrTo = function(n, c) {
                        n.squareTo(c),
                        this.reduce(c)
                    }
                    ,
                    O.prototype.convert = function(n) {
                        var c = y();
                        return n.abs().dlShiftTo(this.m.t, c),
                        c.divRemTo(this.m, null, c),
                        n.s < 0 && c.compareTo(a.ZERO) > 0 && this.m.subTo(c, c),
                        c
                    }
                    ,
                    O.prototype.revert = function(n) {
                        var c = y();
                        return n.copyTo(c),
                        this.reduce(c),
                        c
                    }
                    ,
                    O.prototype.reduce = function(n) {
                        for (; n.t <= this.mt2; )
                            n.data[n.t++] = 0;
                        for (var c = 0; c < this.m.t; ++c) {
                            var h = 32767 & n.data[c]
                              , C = h * this.mpl + ((h * this.mph + (n.data[c] >> 15) * this.mpl & this.um) << 15) & n.DM;
                            for (h = c + this.m.t,
                            n.data[h] += this.m.am(0, C, n, c, 0, this.m.t); n.data[h] >= n.DV; )
                                n.data[h] -= n.DV,
                                n.data[++h]++
                        }
                        n.clamp(),
                        n.drShiftTo(this.m.t, n),
                        n.compareTo(this.m) >= 0 && n.subTo(this.m, n)
                    }
                    ,
                    O.prototype.mulTo = function(n, c, h) {
                        n.multiplyTo(c, h),
                        this.reduce(h)
                    }
                    ,
                    O.prototype.sqrTo = function(n, c) {
                        n.squareTo(c),
                        this.reduce(c)
                    }
                    ,
                    a.prototype.copyTo = function(n) {
                        for (var c = this.t - 1; c >= 0; --c)
                            n.data[c] = this.data[c];
                        n.t = this.t,
                        n.s = this.s
                    }
                    ,
                    a.prototype.fromInt = function(n) {
                        this.t = 1,
                        this.s = n < 0 ? -1 : 0,
                        n > 0 ? this.data[0] = n : n < -1 ? this.data[0] = n + this.DV : this.t = 0
                    }
                    ,
                    a.prototype.fromString = function(n, c) {
                        var h;
                        if (c == 16)
                            h = 4;
                        else if (c == 8)
                            h = 3;
                        else if (c == 256)
                            h = 8;
                        else if (c == 2)
                            h = 1;
                        else if (c == 32)
                            h = 5;
                        else {
                            if (c != 4)
                                return void this.fromRadix(n, c);
                            h = 2
                        }
                        this.t = 0,
                        this.s = 0;
                        for (var C = n.length, R = !1, P = 0; --C >= 0; ) {
                            var G = h == 8 ? 255 & n[C] : b(n, C);
                            G < 0 ? n.charAt(C) == "-" && (R = !0) : (R = !1,
                            P == 0 ? this.data[this.t++] = G : P + h > this.DB ? (this.data[this.t - 1] |= (G & (1 << this.DB - P) - 1) << P,
                            this.data[this.t++] = G >> this.DB - P) : this.data[this.t - 1] |= G << P,
                            (P += h) >= this.DB && (P -= this.DB))
                        }
                        h == 8 && 128 & n[0] && (this.s = -1,
                        P > 0 && (this.data[this.t - 1] |= (1 << this.DB - P) - 1 << P)),
                        this.clamp(),
                        R && a.ZERO.subTo(this, this)
                    }
                    ,
                    a.prototype.clamp = function() {
                        for (var n = this.s & this.DM; this.t > 0 && this.data[this.t - 1] == n; )
                            --this.t
                    }
                    ,
                    a.prototype.dlShiftTo = function(n, c) {
                        var h;
                        for (h = this.t - 1; h >= 0; --h)
                            c.data[h + n] = this.data[h];
                        for (h = n - 1; h >= 0; --h)
                            c.data[h] = 0;
                        c.t = this.t + n,
                        c.s = this.s
                    }
                    ,
                    a.prototype.drShiftTo = function(n, c) {
                        for (var h = n; h < this.t; ++h)
                            c.data[h - n] = this.data[h];
                        c.t = Math.max(this.t - n, 0),
                        c.s = this.s
                    }
                    ,
                    a.prototype.lShiftTo = function(n, c) {
                        var h, C = n % this.DB, R = this.DB - C, P = (1 << R) - 1, G = Math.floor(n / this.DB), H = this.s << C & this.DM;
                        for (h = this.t - 1; h >= 0; --h)
                            c.data[h + G + 1] = this.data[h] >> R | H,
                            H = (this.data[h] & P) << C;
                        for (h = G - 1; h >= 0; --h)
                            c.data[h] = 0;
                        c.data[G] = H,
                        c.t = this.t + G + 1,
                        c.s = this.s,
                        c.clamp()
                    }
                    ,
                    a.prototype.rShiftTo = function(n, c) {
                        c.s = this.s;
                        var h = Math.floor(n / this.DB);
                        if (h >= this.t)
                            c.t = 0;
                        else {
                            var C = n % this.DB
                              , R = this.DB - C
                              , P = (1 << C) - 1;
                            c.data[0] = this.data[h] >> C;
                            for (var G = h + 1; G < this.t; ++G)
                                c.data[G - h - 1] |= (this.data[G] & P) << R,
                                c.data[G - h] = this.data[G] >> C;
                            C > 0 && (c.data[this.t - h - 1] |= (this.s & P) << R),
                            c.t = this.t - h,
                            c.clamp()
                        }
                    }
                    ,
                    a.prototype.subTo = function(n, c) {
                        for (var h = 0, C = 0, R = Math.min(n.t, this.t); h < R; )
                            C += this.data[h] - n.data[h],
                            c.data[h++] = C & this.DM,
                            C >>= this.DB;
                        if (n.t < this.t) {
                            for (C -= n.s; h < this.t; )
                                C += this.data[h],
                                c.data[h++] = C & this.DM,
                                C >>= this.DB;
                            C += this.s
                        } else {
                            for (C += this.s; h < n.t; )
                                C -= n.data[h],
                                c.data[h++] = C & this.DM,
                                C >>= this.DB;
                            C -= n.s
                        }
                        c.s = C < 0 ? -1 : 0,
                        C < -1 ? c.data[h++] = this.DV + C : C > 0 && (c.data[h++] = C),
                        c.t = h,
                        c.clamp()
                    }
                    ,
                    a.prototype.multiplyTo = function(n, c) {
                        var h = this.abs()
                          , C = n.abs()
                          , R = h.t;
                        for (c.t = R + C.t; --R >= 0; )
                            c.data[R] = 0;
                        for (R = 0; R < C.t; ++R)
                            c.data[R + h.t] = h.am(0, C.data[R], c, R, 0, h.t);
                        c.s = 0,
                        c.clamp(),
                        this.s != n.s && a.ZERO.subTo(c, c)
                    }
                    ,
                    a.prototype.squareTo = function(n) {
                        for (var c = this.abs(), h = n.t = 2 * c.t; --h >= 0; )
                            n.data[h] = 0;
                        for (h = 0; h < c.t - 1; ++h) {
                            var C = c.am(h, c.data[h], n, 2 * h, 0, 1);
                            (n.data[h + c.t] += c.am(h + 1, 2 * c.data[h], n, 2 * h + 1, C, c.t - h - 1)) >= c.DV && (n.data[h + c.t] -= c.DV,
                            n.data[h + c.t + 1] = 1)
                        }
                        n.t > 0 && (n.data[n.t - 1] += c.am(h, c.data[h], n, 2 * h, 0, 1)),
                        n.s = 0,
                        n.clamp()
                    }
                    ,
                    a.prototype.divRemTo = function(n, c, h) {
                        var C = n.abs();
                        if (!(C.t <= 0)) {
                            var R = this.abs();
                            if (R.t < C.t)
                                return c != null && c.fromInt(0),
                                void (h != null && this.copyTo(h));
                            h == null && (h = y());
                            var P = y()
                              , G = this.s
                              , H = n.s
                              , X = this.DB - M(C.data[C.t - 1]);
                            X > 0 ? (C.lShiftTo(X, P),
                            R.lShiftTo(X, h)) : (C.copyTo(P),
                            R.copyTo(h));
                            var Z = P.t
                              , W = P.data[Z - 1];
                            if (W != 0) {
                                var $ = W * (1 << this.F1) + (Z > 1 ? P.data[Z - 2] >> this.F2 : 0)
                                  , te = this.FV / $
                                  , ee = (1 << this.F1) / $
                                  , J = 1 << this.F2
                                  , ne = h.t
                                  , se = ne - Z
                                  , ve = c == null ? y() : c;
                                for (P.dlShiftTo(se, ve),
                                h.compareTo(ve) >= 0 && (h.data[h.t++] = 1,
                                h.subTo(ve, h)),
                                a.ONE.dlShiftTo(Z, ve),
                                ve.subTo(P, P); P.t < Z; )
                                    P.data[P.t++] = 0;
                                for (; --se >= 0; ) {
                                    var Ae = h.data[--ne] == W ? this.DM : Math.floor(h.data[ne] * te + (h.data[ne - 1] + J) * ee);
                                    if ((h.data[ne] += P.am(0, Ae, h, se, 0, Z)) < Ae)
                                        for (P.dlShiftTo(se, ve),
                                        h.subTo(ve, h); h.data[ne] < --Ae; )
                                            h.subTo(ve, h)
                                }
                                c != null && (h.drShiftTo(Z, c),
                                G != H && a.ZERO.subTo(c, c)),
                                h.t = Z,
                                h.clamp(),
                                X > 0 && h.rShiftTo(X, h),
                                G < 0 && a.ZERO.subTo(h, h)
                            }
                        }
                    }
                    ,
                    a.prototype.invDigit = function() {
                        if (this.t < 1)
                            return 0;
                        var n = this.data[0];
                        if (!(1 & n))
                            return 0;
                        var c = 3 & n;
                        return (c = (c = (c = (c = c * (2 - (15 & n) * c) & 15) * (2 - (255 & n) * c) & 255) * (2 - ((65535 & n) * c & 65535)) & 65535) * (2 - n * c % this.DV) % this.DV) > 0 ? this.DV - c : -c
                    }
                    ,
                    a.prototype.isEven = function() {
                        return (this.t > 0 ? 1 & this.data[0] : this.s) == 0
                    }
                    ,
                    a.prototype.exp = function(n, c) {
                        if (n > 4294967295 || n < 1)
                            return a.ONE;
                        var h = y()
                          , C = y()
                          , R = c.convert(this)
                          , P = M(n) - 1;
                        for (R.copyTo(h); --P >= 0; )
                            if (c.sqrTo(h, C),
                            (n & 1 << P) > 0)
                                c.mulTo(C, R, h);
                            else {
                                var G = h;
                                h = C,
                                C = G
                            }
                        return c.revert(h)
                    }
                    ,
                    a.prototype.toString = function(n) {
                        if (this.s < 0)
                            return "-" + this.negate().toString(n);
                        var c;
                        if (n == 16)
                            c = 4;
                        else if (n == 8)
                            c = 3;
                        else if (n == 2)
                            c = 1;
                        else if (n == 32)
                            c = 5;
                        else {
                            if (n != 4)
                                return this.toRadix(n);
                            c = 2
                        }
                        var h, C = (1 << c) - 1, R = !1, P = "", G = this.t, H = this.DB - G * this.DB % c;
                        if (G-- > 0)
                            for (H < this.DB && (h = this.data[G] >> H) > 0 && (R = !0,
                            P = p(h)); G >= 0; )
                                H < c ? (h = (this.data[G] & (1 << H) - 1) << c - H,
                                h |= this.data[--G] >> (H += this.DB - c)) : (h = this.data[G] >> (H -= c) & C,
                                H <= 0 && (H += this.DB,
                                --G)),
                                h > 0 && (R = !0),
                                R && (P += p(h));
                        return R ? P : "0"
                    }
                    ,
                    a.prototype.negate = function() {
                        var n = y();
                        return a.ZERO.subTo(this, n),
                        n
                    }
                    ,
                    a.prototype.abs = function() {
                        return this.s < 0 ? this.negate() : this
                    }
                    ,
                    a.prototype.compareTo = function(n) {
                        var c = this.s - n.s;
                        if (c != 0)
                            return c;
                        var h = this.t;
                        if ((c = h - n.t) != 0)
                            return this.s < 0 ? -c : c;
                        for (; --h >= 0; )
                            if ((c = this.data[h] - n.data[h]) != 0)
                                return c;
                        return 0
                    }
                    ,
                    a.prototype.bitLength = function() {
                        return this.t <= 0 ? 0 : this.DB * (this.t - 1) + M(this.data[this.t - 1] ^ this.s & this.DM)
                    }
                    ,
                    a.prototype.mod = function(n) {
                        var c = y();
                        return this.abs().divRemTo(n, null, c),
                        this.s < 0 && c.compareTo(a.ZERO) > 0 && n.subTo(c, c),
                        c
                    }
                    ,
                    a.prototype.modPowInt = function(n, c) {
                        var h;
                        return h = n < 256 || c.isEven() ? new N(c) : new O(c),
                        this.exp(n, h)
                    }
                    ,
                    a.ZERO = w(0),
                    a.ONE = w(1),
                    j.prototype.convert = z,
                    j.prototype.revert = z,
                    j.prototype.mulTo = function(n, c, h) {
                        n.multiplyTo(c, h)
                    }
                    ,
                    j.prototype.sqrTo = function(n, c) {
                        n.squareTo(c)
                    }
                    ,
                    E.prototype.convert = function(n) {
                        if (n.s < 0 || n.t > 2 * this.m.t)
                            return n.mod(this.m);
                        if (n.compareTo(this.m) < 0)
                            return n;
                        var c = y();
                        return n.copyTo(c),
                        this.reduce(c),
                        c
                    }
                    ,
                    E.prototype.revert = function(n) {
                        return n
                    }
                    ,
                    E.prototype.reduce = function(n) {
                        for (n.drShiftTo(this.m.t - 1, this.r2),
                        n.t > this.m.t + 1 && (n.t = this.m.t + 1,
                        n.clamp()),
                        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3),
                        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); n.compareTo(this.r2) < 0; )
                            n.dAddOffset(1, this.m.t + 1);
                        for (n.subTo(this.r2, n); n.compareTo(this.m) >= 0; )
                            n.subTo(this.m, n)
                    }
                    ,
                    E.prototype.mulTo = function(n, c, h) {
                        n.multiplyTo(c, h),
                        this.reduce(h)
                    }
                    ,
                    E.prototype.sqrTo = function(n, c) {
                        n.squareTo(c),
                        this.reduce(c)
                    }
                    ;
                    var l = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509]
                      , I = (1 << 26) / l[l.length - 1];
                    a.prototype.chunkSize = function(n) {
                        return Math.floor(Math.LN2 * this.DB / Math.log(n))
                    }
                    ,
                    a.prototype.toRadix = function(n) {
                        if (n == null && (n = 10),
                        this.signum() == 0 || n < 2 || n > 36)
                            return "0";
                        var c = this.chunkSize(n)
                          , h = Math.pow(n, c)
                          , C = w(h)
                          , R = y()
                          , P = y()
                          , G = "";
                        for (this.divRemTo(C, R, P); R.signum() > 0; )
                            G = (h + P.intValue()).toString(n).substr(1) + G,
                            R.divRemTo(C, R, P);
                        return P.intValue().toString(n) + G
                    }
                    ,
                    a.prototype.fromRadix = function(n, c) {
                        this.fromInt(0),
                        c == null && (c = 10);
                        for (var h = this.chunkSize(c), C = Math.pow(c, h), R = !1, P = 0, G = 0, H = 0; H < n.length; ++H) {
                            var X = b(n, H);
                            X < 0 ? n.charAt(H) == "-" && this.signum() == 0 && (R = !0) : (G = c * G + X,
                            ++P >= h && (this.dMultiply(C),
                            this.dAddOffset(G, 0),
                            P = 0,
                            G = 0))
                        }
                        P > 0 && (this.dMultiply(Math.pow(c, P)),
                        this.dAddOffset(G, 0)),
                        R && a.ZERO.subTo(this, this)
                    }
                    ,
                    a.prototype.fromNumber = function(n, c, h) {
                        if (typeof c == "number")
                            if (n < 2)
                                this.fromInt(1);
                            else
                                for (this.fromNumber(n, h),
                                this.testBit(n - 1) || this.bitwiseTo(a.ONE.shiftLeft(n - 1), o, this),
                                this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(c); )
                                    this.dAddOffset(2, 0),
                                    this.bitLength() > n && this.subTo(a.ONE.shiftLeft(n - 1), this);
                        else {
                            var C = new Array
                              , R = 7 & n;
                            C.length = 1 + (n >> 3),
                            c.nextBytes(C),
                            R > 0 ? C[0] &= (1 << R) - 1 : C[0] = 0,
                            this.fromString(C, 256)
                        }
                    }
                    ,
                    a.prototype.bitwiseTo = function(n, c, h) {
                        var C, R, P = Math.min(n.t, this.t);
                        for (C = 0; C < P; ++C)
                            h.data[C] = c(this.data[C], n.data[C]);
                        if (n.t < this.t) {
                            for (R = n.s & this.DM,
                            C = P; C < this.t; ++C)
                                h.data[C] = c(this.data[C], R);
                            h.t = this.t
                        } else {
                            for (R = this.s & this.DM,
                            C = P; C < n.t; ++C)
                                h.data[C] = c(R, n.data[C]);
                            h.t = n.t
                        }
                        h.s = c(this.s, n.s),
                        h.clamp()
                    }
                    ,
                    a.prototype.changeBit = function(n, c) {
                        var h = a.ONE.shiftLeft(n);
                        return this.bitwiseTo(h, c, h),
                        h
                    }
                    ,
                    a.prototype.addTo = function(n, c) {
                        for (var h = 0, C = 0, R = Math.min(n.t, this.t); h < R; )
                            C += this.data[h] + n.data[h],
                            c.data[h++] = C & this.DM,
                            C >>= this.DB;
                        if (n.t < this.t) {
                            for (C += n.s; h < this.t; )
                                C += this.data[h],
                                c.data[h++] = C & this.DM,
                                C >>= this.DB;
                            C += this.s
                        } else {
                            for (C += this.s; h < n.t; )
                                C += n.data[h],
                                c.data[h++] = C & this.DM,
                                C >>= this.DB;
                            C += n.s
                        }
                        c.s = C < 0 ? -1 : 0,
                        C > 0 ? c.data[h++] = C : C < -1 && (c.data[h++] = this.DV + C),
                        c.t = h,
                        c.clamp()
                    }
                    ,
                    a.prototype.dMultiply = function(n) {
                        this.data[this.t] = this.am(0, n - 1, this, 0, 0, this.t),
                        ++this.t,
                        this.clamp()
                    }
                    ,
                    a.prototype.dAddOffset = function(n, c) {
                        if (n != 0) {
                            for (; this.t <= c; )
                                this.data[this.t++] = 0;
                            for (this.data[c] += n; this.data[c] >= this.DV; )
                                this.data[c] -= this.DV,
                                ++c >= this.t && (this.data[this.t++] = 0),
                                ++this.data[c]
                        }
                    }
                    ,
                    a.prototype.multiplyLowerTo = function(n, c, h) {
                        var C, R = Math.min(this.t + n.t, c);
                        for (h.s = 0,
                        h.t = R; R > 0; )
                            h.data[--R] = 0;
                        for (C = h.t - this.t; R < C; ++R)
                            h.data[R + this.t] = this.am(0, n.data[R], h, R, 0, this.t);
                        for (C = Math.min(n.t, c); R < C; ++R)
                            this.am(0, n.data[R], h, R, 0, c - R);
                        h.clamp()
                    }
                    ,
                    a.prototype.multiplyUpperTo = function(n, c, h) {
                        --c;
                        var C = h.t = this.t + n.t - c;
                        for (h.s = 0; --C >= 0; )
                            h.data[C] = 0;
                        for (C = Math.max(c - this.t, 0); C < n.t; ++C)
                            h.data[this.t + C - c] = this.am(c - C, n.data[C], h, 0, 0, this.t + C - c);
                        h.clamp(),
                        h.drShiftTo(1, h)
                    }
                    ,
                    a.prototype.modInt = function(n) {
                        if (n <= 0)
                            return 0;
                        var c = this.DV % n
                          , h = this.s < 0 ? n - 1 : 0;
                        if (this.t > 0)
                            if (c == 0)
                                h = this.data[0] % n;
                            else
                                for (var C = this.t - 1; C >= 0; --C)
                                    h = (c * h + this.data[C]) % n;
                        return h
                    }
                    ,
                    a.prototype.millerRabin = function(n) {
                        var c = this.subtract(a.ONE)
                          , h = c.getLowestSetBit();
                        if (h <= 0)
                            return !1;
                        for (var C, R = c.shiftRight(h), P = {
                            nextBytes: function(W) {
                                for (var $ = 0; $ < W.length; ++$)
                                    W[$] = Math.floor(256 * Math.random())
                            }
                        }, G = 0; G < n; ++G) {
                            do
                                C = new a(this.bitLength(),P);
                            while (C.compareTo(a.ONE) <= 0 || C.compareTo(c) >= 0);
                            var H = C.modPow(R, this);
                            if (H.compareTo(a.ONE) != 0 && H.compareTo(c) != 0) {
                                for (var X = 1; X++ < h && H.compareTo(c) != 0; )
                                    if ((H = H.modPowInt(2, this)).compareTo(a.ONE) == 0)
                                        return !1;
                                if (H.compareTo(c) != 0)
                                    return !1
                            }
                        }
                        return !0
                    }
                    ,
                    a.prototype.clone = function() {
                        var n = y();
                        return this.copyTo(n),
                        n
                    }
                    ,
                    a.prototype.intValue = function() {
                        if (this.s < 0) {
                            if (this.t == 1)
                                return this.data[0] - this.DV;
                            if (this.t == 0)
                                return -1
                        } else {
                            if (this.t == 1)
                                return this.data[0];
                            if (this.t == 0)
                                return 0
                        }
                        return (this.data[1] & (1 << 32 - this.DB) - 1) << this.DB | this.data[0]
                    }
                    ,
                    a.prototype.byteValue = function() {
                        return this.t == 0 ? this.s : this.data[0] << 24 >> 24
                    }
                    ,
                    a.prototype.shortValue = function() {
                        return this.t == 0 ? this.s : this.data[0] << 16 >> 16
                    }
                    ,
                    a.prototype.signum = function() {
                        return this.s < 0 ? -1 : this.t <= 0 || this.t == 1 && this.data[0] <= 0 ? 0 : 1
                    }
                    ,
                    a.prototype.toByteArray = function() {
                        var n = this.t
                          , c = new Array;
                        c[0] = this.s;
                        var h, C = this.DB - n * this.DB % 8, R = 0;
                        if (n-- > 0)
                            for (C < this.DB && (h = this.data[n] >> C) != (this.s & this.DM) >> C && (c[R++] = h | this.s << this.DB - C); n >= 0; )
                                C < 8 ? (h = (this.data[n] & (1 << C) - 1) << 8 - C,
                                h |= this.data[--n] >> (C += this.DB - 8)) : (h = this.data[n] >> (C -= 8) & 255,
                                C <= 0 && (C += this.DB,
                                --n)),
                                128 & h && (h |= -256),
                                R == 0 && (128 & this.s) != (128 & h) && ++R,
                                (R > 0 || h != this.s) && (c[R++] = h);
                        return c
                    }
                    ,
                    a.prototype.equals = function(n) {
                        return this.compareTo(n) == 0
                    }
                    ,
                    a.prototype.min = function(n) {
                        return this.compareTo(n) < 0 ? this : n
                    }
                    ,
                    a.prototype.max = function(n) {
                        return this.compareTo(n) > 0 ? this : n
                    }
                    ,
                    a.prototype.and = function(n) {
                        var c = y();
                        return this.bitwiseTo(n, x, c),
                        c
                    }
                    ,
                    a.prototype.or = function(n) {
                        var c = y();
                        return this.bitwiseTo(n, o, c),
                        c
                    }
                    ,
                    a.prototype.xor = function(n) {
                        var c = y();
                        return this.bitwiseTo(n, S, c),
                        c
                    }
                    ,
                    a.prototype.andNot = function(n) {
                        var c = y();
                        return this.bitwiseTo(n, L, c),
                        c
                    }
                    ,
                    a.prototype.not = function() {
                        for (var n = y(), c = 0; c < this.t; ++c)
                            n.data[c] = this.DM & ~this.data[c];
                        return n.t = this.t,
                        n.s = ~this.s,
                        n
                    }
                    ,
                    a.prototype.shiftLeft = function(n) {
                        var c = y();
                        return n < 0 ? this.rShiftTo(-n, c) : this.lShiftTo(n, c),
                        c
                    }
                    ,
                    a.prototype.shiftRight = function(n) {
                        var c = y();
                        return n < 0 ? this.lShiftTo(-n, c) : this.rShiftTo(n, c),
                        c
                    }
                    ,
                    a.prototype.getLowestSetBit = function() {
                        for (var n = 0; n < this.t; ++n)
                            if (this.data[n] != 0)
                                return n * this.DB + V(this.data[n]);
                        return this.s < 0 ? this.t * this.DB : -1
                    }
                    ,
                    a.prototype.bitCount = function() {
                        for (var n = 0, c = this.s & this.DM, h = 0; h < this.t; ++h)
                            n += F(this.data[h] ^ c);
                        return n
                    }
                    ,
                    a.prototype.testBit = function(n) {
                        var c = Math.floor(n / this.DB);
                        return c >= this.t ? this.s != 0 : (this.data[c] & 1 << n % this.DB) != 0
                    }
                    ,
                    a.prototype.setBit = function(n) {
                        return this.changeBit(n, o)
                    }
                    ,
                    a.prototype.clearBit = function(n) {
                        return this.changeBit(n, L)
                    }
                    ,
                    a.prototype.flipBit = function(n) {
                        return this.changeBit(n, S)
                    }
                    ,
                    a.prototype.add = function(n) {
                        var c = y();
                        return this.addTo(n, c),
                        c
                    }
                    ,
                    a.prototype.subtract = function(n) {
                        var c = y();
                        return this.subTo(n, c),
                        c
                    }
                    ,
                    a.prototype.multiply = function(n) {
                        var c = y();
                        return this.multiplyTo(n, c),
                        c
                    }
                    ,
                    a.prototype.divide = function(n) {
                        var c = y();
                        return this.divRemTo(n, c, null),
                        c
                    }
                    ,
                    a.prototype.remainder = function(n) {
                        var c = y();
                        return this.divRemTo(n, null, c),
                        c
                    }
                    ,
                    a.prototype.divideAndRemainder = function(n) {
                        var c = y()
                          , h = y();
                        return this.divRemTo(n, c, h),
                        new Array(c,h)
                    }
                    ,
                    a.prototype.modPow = function(n, c) {
                        var h, C, R = n.bitLength(), P = w(1);
                        if (R <= 0)
                            return P;
                        h = R < 18 ? 1 : R < 48 ? 3 : R < 144 ? 4 : R < 768 ? 5 : 6,
                        C = R < 8 ? new N(c) : c.isEven() ? new E(c) : new O(c);
                        var G = new Array
                          , H = 3
                          , X = h - 1
                          , Z = (1 << h) - 1;
                        if (G[1] = C.convert(this),
                        h > 1) {
                            var W = y();
                            for (C.sqrTo(G[1], W); H <= Z; )
                                G[H] = y(),
                                C.mulTo(W, G[H - 2], G[H]),
                                H += 2
                        }
                        var $, te, ee = n.t - 1, J = !0, ne = y();
                        for (R = M(n.data[ee]) - 1; ee >= 0; ) {
                            for (R >= X ? $ = n.data[ee] >> R - X & Z : ($ = (n.data[ee] & (1 << R + 1) - 1) << X - R,
                            ee > 0 && ($ |= n.data[ee - 1] >> this.DB + R - X)),
                            H = h; !(1 & $); )
                                $ >>= 1,
                                --H;
                            if ((R -= H) < 0 && (R += this.DB,
                            --ee),
                            J)
                                G[$].copyTo(P),
                                J = !1;
                            else {
                                for (; H > 1; )
                                    C.sqrTo(P, ne),
                                    C.sqrTo(ne, P),
                                    H -= 2;
                                H > 0 ? C.sqrTo(P, ne) : (te = P,
                                P = ne,
                                ne = te),
                                C.mulTo(ne, G[$], P)
                            }
                            for (; ee >= 0 && !(n.data[ee] & 1 << R); )
                                C.sqrTo(P, ne),
                                te = P,
                                P = ne,
                                ne = te,
                                --R < 0 && (R = this.DB - 1,
                                --ee)
                        }
                        return C.revert(P)
                    }
                    ,
                    a.prototype.modInverse = function(n) {
                        var c = n.isEven();
                        if (this.isEven() && c || n.signum() == 0)
                            return a.ZERO;
                        for (var h = n.clone(), C = this.clone(), R = w(1), P = w(0), G = w(0), H = w(1); h.signum() != 0; ) {
                            for (; h.isEven(); )
                                h.rShiftTo(1, h),
                                c ? (R.isEven() && P.isEven() || (R.addTo(this, R),
                                P.subTo(n, P)),
                                R.rShiftTo(1, R)) : P.isEven() || P.subTo(n, P),
                                P.rShiftTo(1, P);
                            for (; C.isEven(); )
                                C.rShiftTo(1, C),
                                c ? (G.isEven() && H.isEven() || (G.addTo(this, G),
                                H.subTo(n, H)),
                                G.rShiftTo(1, G)) : H.isEven() || H.subTo(n, H),
                                H.rShiftTo(1, H);
                            h.compareTo(C) >= 0 ? (h.subTo(C, h),
                            c && R.subTo(G, R),
                            P.subTo(H, P)) : (C.subTo(h, C),
                            c && G.subTo(R, G),
                            H.subTo(P, H))
                        }
                        return C.compareTo(a.ONE) != 0 ? a.ZERO : H.compareTo(n) >= 0 ? H.subtract(n) : H.signum() < 0 ? (H.addTo(n, H),
                        H.signum() < 0 ? H.add(n) : H) : H
                    }
                    ,
                    a.prototype.pow = function(n) {
                        return this.exp(n, new j)
                    }
                    ,
                    a.prototype.gcd = function(n) {
                        var c = this.s < 0 ? this.negate() : this.clone()
                          , h = n.s < 0 ? n.negate() : n.clone();
                        if (c.compareTo(h) < 0) {
                            var C = c;
                            c = h,
                            h = C
                        }
                        var R = c.getLowestSetBit()
                          , P = h.getLowestSetBit();
                        if (P < 0)
                            return c;
                        for (R < P && (P = R),
                        P > 0 && (c.rShiftTo(P, c),
                        h.rShiftTo(P, h)); c.signum() > 0; )
                            (R = c.getLowestSetBit()) > 0 && c.rShiftTo(R, c),
                            (R = h.getLowestSetBit()) > 0 && h.rShiftTo(R, h),
                            c.compareTo(h) >= 0 ? (c.subTo(h, c),
                            c.rShiftTo(1, c)) : (h.subTo(c, h),
                            h.rShiftTo(1, h));
                        return P > 0 && h.lShiftTo(P, h),
                        h
                    }
                    ,
                    a.prototype.isProbablePrime = function(n) {
                        var c, h = this.abs();
                        if (h.t == 1 && h.data[0] <= l[l.length - 1]) {
                            for (c = 0; c < l.length; ++c)
                                if (h.data[0] == l[c])
                                    return !0;
                            return !1
                        }
                        if (h.isEven())
                            return !1;
                        for (c = 1; c < l.length; ) {
                            for (var C = l[c], R = c + 1; R < l.length && C < I; )
                                C *= l[R++];
                            for (C = h.modInt(C); c < R; )
                                if (C % l[c++] == 0)
                                    return !1
                        }
                        return h.millerRabin(n)
                    }
                },
                419: function(_, D, k) {
                    var g = k(654);
                    _.exports = g.md = g.md || {},
                    g.md.algorithms = g.md.algorithms || {}
                },
                507: function(_, D, k) {
                    var g = k(654);
                    k(513),
                    _.exports = g.mgf = g.mgf || {},
                    g.mgf.mgf1 = g.mgf1
                },
                513: function(_, D, k) {
                    var g = k(654);
                    k(527),
                    g.mgf = g.mgf || {},
                    (_.exports = g.mgf.mgf1 = g.mgf1 = g.mgf1 || {}).create = function(i) {
                        return {
                            generate: function(y, U) {
                                for (var e = new g.util.ByteBuffer, v = Math.ceil(U / i.digestLength), B = 0; B < v; B++) {
                                    var p = new g.util.ByteBuffer;
                                    p.putInt32(B),
                                    i.start(),
                                    i.update(y + p.getBytes()),
                                    e.putBuffer(i.digest())
                                }
                                return e.truncate(e.length() - U),
                                e.getBytes()
                            }
                        }
                    }
                },
                106: function(_, D, k) {
                    var g = k(654);
                    g.pki = g.pki || {};
                    var i = _.exports = g.pki.oids = g.oids = g.oids || {};
                    function a(U, e) {
                        i[U] = e,
                        i[e] = U
                    }
                    function y(U, e) {
                        i[U] = e
                    }
                    a("1.2.840.113549.1.1.1", "rsaEncryption"),
                    a("1.2.840.113549.1.1.4", "md5WithRSAEncryption"),
                    a("1.2.840.113549.1.1.5", "sha1WithRSAEncryption"),
                    a("1.2.840.113549.1.1.7", "RSAES-OAEP"),
                    a("1.2.840.113549.1.1.8", "mgf1"),
                    a("1.2.840.113549.1.1.9", "pSpecified"),
                    a("1.2.840.113549.1.1.10", "RSASSA-PSS"),
                    a("1.2.840.113549.1.1.11", "sha256WithRSAEncryption"),
                    a("1.2.840.113549.1.1.12", "sha384WithRSAEncryption"),
                    a("1.2.840.113549.1.1.13", "sha512WithRSAEncryption"),
                    a("1.3.101.112", "EdDSA25519"),
                    a("1.2.840.10040.4.3", "dsa-with-sha1"),
                    a("1.3.14.3.2.7", "desCBC"),
                    a("1.3.14.3.2.26", "sha1"),
                    a("1.3.14.3.2.29", "sha1WithRSASignature"),
                    a("2.16.840.1.101.3.4.2.1", "sha256"),
                    a("2.16.840.1.101.3.4.2.2", "sha384"),
                    a("2.16.840.1.101.3.4.2.3", "sha512"),
                    a("2.16.840.1.101.3.4.2.4", "sha224"),
                    a("2.16.840.1.101.3.4.2.5", "sha512-224"),
                    a("2.16.840.1.101.3.4.2.6", "sha512-256"),
                    a("1.2.840.113549.2.2", "md2"),
                    a("1.2.840.113549.2.5", "md5"),
                    a("1.2.840.113549.1.7.1", "data"),
                    a("1.2.840.113549.1.7.2", "signedData"),
                    a("1.2.840.113549.1.7.3", "envelopedData"),
                    a("1.2.840.113549.1.7.4", "signedAndEnvelopedData"),
                    a("1.2.840.113549.1.7.5", "digestedData"),
                    a("1.2.840.113549.1.7.6", "encryptedData"),
                    a("1.2.840.113549.1.9.1", "emailAddress"),
                    a("1.2.840.113549.1.9.2", "unstructuredName"),
                    a("1.2.840.113549.1.9.3", "contentType"),
                    a("1.2.840.113549.1.9.4", "messageDigest"),
                    a("1.2.840.113549.1.9.5", "signingTime"),
                    a("1.2.840.113549.1.9.6", "counterSignature"),
                    a("1.2.840.113549.1.9.7", "challengePassword"),
                    a("1.2.840.113549.1.9.8", "unstructuredAddress"),
                    a("1.2.840.113549.1.9.14", "extensionRequest"),
                    a("1.2.840.113549.1.9.20", "friendlyName"),
                    a("1.2.840.113549.1.9.21", "localKeyId"),
                    a("1.2.840.113549.1.9.22.1", "x509Certificate"),
                    a("1.2.840.113549.1.12.10.1.1", "keyBag"),
                    a("1.2.840.113549.1.12.10.1.2", "pkcs8ShroudedKeyBag"),
                    a("1.2.840.113549.1.12.10.1.3", "certBag"),
                    a("1.2.840.113549.1.12.10.1.4", "crlBag"),
                    a("1.2.840.113549.1.12.10.1.5", "secretBag"),
                    a("1.2.840.113549.1.12.10.1.6", "safeContentsBag"),
                    a("1.2.840.113549.1.5.13", "pkcs5PBES2"),
                    a("1.2.840.113549.1.5.12", "pkcs5PBKDF2"),
                    a("1.2.840.113549.1.12.1.1", "pbeWithSHAAnd128BitRC4"),
                    a("1.2.840.113549.1.12.1.2", "pbeWithSHAAnd40BitRC4"),
                    a("1.2.840.113549.1.12.1.3", "pbeWithSHAAnd3-KeyTripleDES-CBC"),
                    a("1.2.840.113549.1.12.1.4", "pbeWithSHAAnd2-KeyTripleDES-CBC"),
                    a("1.2.840.113549.1.12.1.5", "pbeWithSHAAnd128BitRC2-CBC"),
                    a("1.2.840.113549.1.12.1.6", "pbewithSHAAnd40BitRC2-CBC"),
                    a("1.2.840.113549.2.7", "hmacWithSHA1"),
                    a("1.2.840.113549.2.8", "hmacWithSHA224"),
                    a("1.2.840.113549.2.9", "hmacWithSHA256"),
                    a("1.2.840.113549.2.10", "hmacWithSHA384"),
                    a("1.2.840.113549.2.11", "hmacWithSHA512"),
                    a("1.2.840.113549.3.7", "des-EDE3-CBC"),
                    a("2.16.840.1.101.3.4.1.2", "aes128-CBC"),
                    a("2.16.840.1.101.3.4.1.22", "aes192-CBC"),
                    a("2.16.840.1.101.3.4.1.42", "aes256-CBC"),
                    a("2.5.4.3", "commonName"),
                    a("2.5.4.4", "surname"),
                    a("2.5.4.5", "serialNumber"),
                    a("2.5.4.6", "countryName"),
                    a("2.5.4.7", "localityName"),
                    a("2.5.4.8", "stateOrProvinceName"),
                    a("2.5.4.9", "streetAddress"),
                    a("2.5.4.10", "organizationName"),
                    a("2.5.4.11", "organizationalUnitName"),
                    a("2.5.4.12", "title"),
                    a("2.5.4.13", "description"),
                    a("2.5.4.15", "businessCategory"),
                    a("2.5.4.17", "postalCode"),
                    a("2.5.4.42", "givenName"),
                    a("1.3.6.1.4.1.311.60.2.1.2", "jurisdictionOfIncorporationStateOrProvinceName"),
                    a("1.3.6.1.4.1.311.60.2.1.3", "jurisdictionOfIncorporationCountryName"),
                    a("2.16.840.1.113730.1.1", "nsCertType"),
                    a("2.16.840.1.113730.1.13", "nsComment"),
                    y("2.5.29.1", "authorityKeyIdentifier"),
                    y("2.5.29.2", "keyAttributes"),
                    y("2.5.29.3", "certificatePolicies"),
                    y("2.5.29.4", "keyUsageRestriction"),
                    y("2.5.29.5", "policyMapping"),
                    y("2.5.29.6", "subtreesConstraint"),
                    y("2.5.29.7", "subjectAltName"),
                    y("2.5.29.8", "issuerAltName"),
                    y("2.5.29.9", "subjectDirectoryAttributes"),
                    y("2.5.29.10", "basicConstraints"),
                    y("2.5.29.11", "nameConstraints"),
                    y("2.5.29.12", "policyConstraints"),
                    y("2.5.29.13", "basicConstraints"),
                    a("2.5.29.14", "subjectKeyIdentifier"),
                    a("2.5.29.15", "keyUsage"),
                    y("2.5.29.16", "privateKeyUsagePeriod"),
                    a("2.5.29.17", "subjectAltName"),
                    a("2.5.29.18", "issuerAltName"),
                    a("2.5.29.19", "basicConstraints"),
                    y("2.5.29.20", "cRLNumber"),
                    y("2.5.29.21", "cRLReason"),
                    y("2.5.29.22", "expirationDate"),
                    y("2.5.29.23", "instructionCode"),
                    y("2.5.29.24", "invalidityDate"),
                    y("2.5.29.25", "cRLDistributionPoints"),
                    y("2.5.29.26", "issuingDistributionPoint"),
                    y("2.5.29.27", "deltaCRLIndicator"),
                    y("2.5.29.28", "issuingDistributionPoint"),
                    y("2.5.29.29", "certificateIssuer"),
                    y("2.5.29.30", "nameConstraints"),
                    a("2.5.29.31", "cRLDistributionPoints"),
                    a("2.5.29.32", "certificatePolicies"),
                    y("2.5.29.33", "policyMappings"),
                    y("2.5.29.34", "policyConstraints"),
                    a("2.5.29.35", "authorityKeyIdentifier"),
                    y("2.5.29.36", "policyConstraints"),
                    a("2.5.29.37", "extKeyUsage"),
                    y("2.5.29.46", "freshestCRL"),
                    y("2.5.29.54", "inhibitAnyPolicy"),
                    a("1.3.6.1.4.1.11129.2.4.2", "timestampList"),
                    a("1.3.6.1.5.5.7.1.1", "authorityInfoAccess"),
                    a("1.3.6.1.5.5.7.3.1", "serverAuth"),
                    a("1.3.6.1.5.5.7.3.2", "clientAuth"),
                    a("1.3.6.1.5.5.7.3.3", "codeSigning"),
                    a("1.3.6.1.5.5.7.3.4", "emailProtection"),
                    a("1.3.6.1.5.5.7.3.8", "timeStamping")
                },
                911: function(_, D, k) {
                    var g = k(654);
                    k(527);
                    var i = _.exports = g.pem = g.pem || {};
                    function a(U) {
                        for (var e = U.name + ": ", v = [], B = function(O, x) {
                            return " " + x
                        }, p = 0; p < U.values.length; ++p)
                            v.push(U.values[p].replace(/^(\S+\r\n)/, B));
                        e += v.join(",") + "\r\n";
                        var b = 0
                          , w = -1;
                        for (p = 0; p < e.length; ++p,
                        ++b)
                            if (b > 65 && w !== -1) {
                                var M = e[w];
                                M === "," ? (++w,
                                e = e.substr(0, w) + "\r\n " + e.substr(w)) : e = e.substr(0, w) + "\r\n" + M + e.substr(w + 1),
                                b = p - w - 1,
                                w = -1,
                                ++p
                            } else
                                e[p] !== " " && e[p] !== "	" && e[p] !== "," || (w = p);
                        return e
                    }
                    function y(U) {
                        return U.replace(/^\s+/, "")
                    }
                    i.encode = function(U, e) {
                        e = e || {};
                        var v, B = "-----BEGIN " + U.type + "-----\r\n";
                        if (U.procType && (B += a(v = {
                            name: "Proc-Type",
                            values: [String(U.procType.version), U.procType.type]
                        })),
                        U.contentDomain && (B += a(v = {
                            name: "Content-Domain",
                            values: [U.contentDomain]
                        })),
                        U.dekInfo && (v = {
                            name: "DEK-Info",
                            values: [U.dekInfo.algorithm]
                        },
                        U.dekInfo.parameters && v.values.push(U.dekInfo.parameters),
                        B += a(v)),
                        U.headers)
                            for (var p = 0; p < U.headers.length; ++p)
                                B += a(U.headers[p]);
                        return U.procType && (B += "\r\n"),
                        (B += g.util.encode64(U.body, e.maxline || 64) + "\r\n") + "-----END " + U.type + "-----\r\n"
                    }
                    ,
                    i.decode = function(U) {
                        for (var e, v = [], B = /\s*-----BEGIN ([A-Z0-9- ]+)-----\r?\n?([\x21-\x7e\s]+?(?:\r?\n\r?\n))?([:A-Za-z0-9+\/=\s]+?)-----END \1-----/g, p = /([\x21-\x7e]+):\s*([\x21-\x7e\s^:]+)/, b = /\r?\n/; e = B.exec(U); ) {
                            var w = e[1];
                            w === "NEW CERTIFICATE REQUEST" && (w = "CERTIFICATE REQUEST");
                            var M = {
                                type: w,
                                procType: null,
                                contentDomain: null,
                                dekInfo: null,
                                headers: [],
                                body: g.util.decode64(e[3])
                            };
                            if (v.push(M),
                            e[2]) {
                                for (var N = e[2].split(b), O = 0; e && O < N.length; ) {
                                    for (var x = N[O].replace(/\s+$/, ""), o = O + 1; o < N.length; ++o) {
                                        var S = N[o];
                                        if (!/\s/.test(S[0]))
                                            break;
                                        x += S,
                                        O = o
                                    }
                                    if (e = x.match(p)) {
                                        for (var L = {
                                            name: e[1],
                                            values: []
                                        }, V = e[2].split(","), F = 0; F < V.length; ++F)
                                            L.values.push(y(V[F]));
                                        if (M.procType)
                                            if (M.contentDomain || L.name !== "Content-Domain")
                                                if (M.dekInfo || L.name !== "DEK-Info")
                                                    M.headers.push(L);
                                                else {
                                                    if (L.values.length === 0)
                                                        throw new Error('Invalid PEM formatted message. The "DEK-Info" header must have at least one subfield.');
                                                    M.dekInfo = {
                                                        algorithm: V[0],
                                                        parameters: V[1] || null
                                                    }
                                                }
                                            else
                                                M.contentDomain = V[0] || "";
                                        else {
                                            if (L.name !== "Proc-Type")
                                                throw new Error('Invalid PEM formatted message. The first encapsulated header must be "Proc-Type".');
                                            if (L.values.length !== 2)
                                                throw new Error('Invalid PEM formatted message. The "Proc-Type" header must have two subfields.');
                                            M.procType = {
                                                version: V[0],
                                                type: V[1]
                                            }
                                        }
                                    }
                                    ++O
                                }
                                if (M.procType === "ENCRYPTED" && !M.dekInfo)
                                    throw new Error('Invalid PEM formatted message. The "DEK-Info" header must be present if "Proc-Type" is "ENCRYPTED".')
                            }
                        }
                        if (v.length === 0)
                            throw new Error("Invalid PEM formatted message.");
                        return v
                    }
                },
                438: function(_, D, k) {
                    var g = k(654);
                    k(527),
                    k(154),
                    k(320);
                    var i = _.exports = g.pkcs1 = g.pkcs1 || {};
                    function a(y, U, e) {
                        e || (e = g.md.sha1.create());
                        for (var v = "", B = Math.ceil(U / e.digestLength), p = 0; p < B; ++p) {
                            var b = String.fromCharCode(p >> 24 & 255, p >> 16 & 255, p >> 8 & 255, 255 & p);
                            e.start(),
                            e.update(y + b),
                            v += e.digest().getBytes()
                        }
                        return v.substring(0, U)
                    }
                    i.encode_rsa_oaep = function(y, U, e) {
                        var v, B, p, b;
                        typeof e == "string" ? (v = e,
                        B = arguments[3] || void 0,
                        p = arguments[4] || void 0) : e && (v = e.label || void 0,
                        B = e.seed || void 0,
                        p = e.md || void 0,
                        e.mgf1 && e.mgf1.md && (b = e.mgf1.md)),
                        p ? p.start() : p = g.md.sha1.create(),
                        b || (b = p);
                        var w = Math.ceil(y.n.bitLength() / 8)
                          , M = w - 2 * p.digestLength - 2;
                        if (U.length > M)
                            throw (L = new Error("RSAES-OAEP input message length is too long.")).length = U.length,
                            L.maxLength = M,
                            L;
                        v || (v = ""),
                        p.update(v, "raw");
                        for (var N = p.digest(), O = "", x = M - U.length, o = 0; o < x; o++)
                            O += "\0";
                        var S = N.getBytes() + O + "" + U;
                        if (B) {
                            if (B.length !== p.digestLength) {
                                var L;
                                throw (L = new Error("Invalid RSAES-OAEP seed. The seed length must match the digest length.")).seedLength = B.length,
                                L.digestLength = p.digestLength,
                                L
                            }
                        } else
                            B = g.random.getBytes(p.digestLength);
                        var V = a(B, w - p.digestLength - 1, b)
                          , F = g.util.xorBytes(S, V, S.length)
                          , j = a(F, p.digestLength, b)
                          , z = g.util.xorBytes(B, j, B.length);
                        return "\0" + z + F
                    }
                    ,
                    i.decode_rsa_oaep = function(y, U, e) {
                        var v, B, p;
                        typeof e == "string" ? (v = e,
                        B = arguments[3] || void 0) : e && (v = e.label || void 0,
                        B = e.md || void 0,
                        e.mgf1 && e.mgf1.md && (p = e.mgf1.md));
                        var b = Math.ceil(y.n.bitLength() / 8);
                        if (U.length !== b)
                            throw (F = new Error("RSAES-OAEP encoded message length is invalid.")).length = U.length,
                            F.expectedLength = b,
                            F;
                        if (B === void 0 ? B = g.md.sha1.create() : B.start(),
                        p || (p = B),
                        b < 2 * B.digestLength + 2)
                            throw new Error("RSAES-OAEP key is too short for the hash function.");
                        v || (v = ""),
                        B.update(v, "raw");
                        for (var w = B.digest().getBytes(), M = U.charAt(0), N = U.substring(1, B.digestLength + 1), O = U.substring(1 + B.digestLength), x = a(O, B.digestLength, p), o = g.util.xorBytes(N, x, N.length), S = a(o, b - B.digestLength - 1, p), L = g.util.xorBytes(O, S, O.length), V = L.substring(0, B.digestLength), F = M !== "\0", j = 0; j < B.digestLength; ++j)
                            F |= w.charAt(j) !== V.charAt(j);
                        for (var z = 1, E = B.digestLength, l = B.digestLength; l < L.length; l++) {
                            var I = L.charCodeAt(l)
                              , n = 1 & I ^ 1
                              , c = z ? 65534 : 0;
                            F |= I & c,
                            E += z &= n
                        }
                        if (F || L.charCodeAt(E) !== 1)
                            throw new Error("Invalid RSAES-OAEP padding.");
                        return L.substring(E + 1)
                    }
                },
                903: function(_, D, k) {
                    var g = k(654);
                    k(527),
                    k(562),
                    k(154),
                    function() {
                        if (g.prime)
                            _.exports = g.prime;
                        else {
                            var i = _.exports = g.prime = g.prime || {}
                              , a = g.jsbn.BigInteger
                              , y = [6, 4, 2, 4, 2, 4, 6, 2]
                              , U = new a(null);
                            U.fromInt(30);
                            var e = function(w, M) {
                                return w | M
                            };
                            i.generateProbablePrime = function(b, w, M) {
                                typeof w == "function" && (M = w,
                                w = {});
                                var N = (w = w || {}).algorithm || "PRIMEINC";
                                typeof N == "string" && (N = {
                                    name: N
                                }),
                                N.options = N.options || {};
                                var O = w.prng || g.random
                                  , x = {
                                    nextBytes: function(S) {
                                        for (var L = O.getBytesSync(S.length), V = 0; V < S.length; ++V)
                                            S[V] = L.charCodeAt(V)
                                    }
                                };
                                if (N.name === "PRIMEINC")
                                    return function(o, S, L, V) {
                                        return "workers"in L ? function(F, j, z, E) {
                                            if (typeof Worker == "undefined")
                                                return v(F, j, z, E);
                                            var l = p(F, j)
                                              , I = z.workers
                                              , n = z.workLoad || 100
                                              , c = 30 * n / 8
                                              , h = z.workerScript || "forge/prime.worker.js";
                                            if (I === -1)
                                                return g.util.estimateCores(function(R, P) {
                                                    R && (P = 2),
                                                    I = P - 1,
                                                    C()
                                                });
                                            function C() {
                                                I = Math.max(1, I);
                                                for (var R = [], P = 0; P < I; ++P)
                                                    R[P] = new Worker(h);
                                                for (P = 0; P < I; ++P)
                                                    R[P].addEventListener("message", H);
                                                var G = !1;
                                                function H(X) {
                                                    if (!G) {
                                                        var Z = X.data;
                                                        if (Z.found) {
                                                            for (var W = 0; W < R.length; ++W)
                                                                R[W].terminate();
                                                            return G = !0,
                                                            E(null, new a(Z.prime,16))
                                                        }
                                                        l.bitLength() > F && (l = p(F, j));
                                                        var $ = l.toString(16);
                                                        X.target.postMessage({
                                                            hex: $,
                                                            workLoad: n
                                                        }),
                                                        l.dAddOffset(c, 0)
                                                    }
                                                }
                                            }
                                            C()
                                        }(o, S, L, V) : v(o, S, L, V)
                                    }(b, x, N.options, M);
                                throw new Error("Invalid prime generation algorithm: " + N.name)
                            }
                        }
                        function v(b, w, M, N) {
                            var O = p(b, w)
                              , x = function(S) {
                                return S <= 100 ? 27 : S <= 150 ? 18 : S <= 200 ? 15 : S <= 250 ? 12 : S <= 300 ? 9 : S <= 350 ? 8 : S <= 400 ? 7 : S <= 500 ? 6 : S <= 600 ? 5 : S <= 800 ? 4 : S <= 1250 ? 3 : 2
                            }(O.bitLength());
                            "millerRabinTests"in M && (x = M.millerRabinTests);
                            var o = 10;
                            "maxBlockTime"in M && (o = M.maxBlockTime),
                            B(O, b, w, 0, x, o, N)
                        }
                        function B(b, w, M, N, O, x, o) {
                            var S = +new Date;
                            do {
                                if (b.bitLength() > w && (b = p(w, M)),
                                b.isProbablePrime(O))
                                    return o(null, b);
                                b.dAddOffset(y[N++ % 8], 0)
                            } while (x < 0 || +new Date - S < x);
                            g.util.setImmediate(function() {
                                B(b, w, M, N, O, x, o)
                            })
                        }
                        function p(b, w) {
                            var M = new a(b,w)
                              , N = b - 1;
                            return M.testBit(N) || M.bitwiseTo(a.ONE.shiftLeft(N), e, M),
                            M.dAddOffset(31 - M.mod(U).byteValue(), 0),
                            M
                        }
                    }()
                },
                216: function(_, D, k) {
                    var g = k(654);
                    k(527);
                    var i = null;
                    !g.util.isNodejs || g.options.usePureJavaScript || process.versions["node-webkit"] || (i = k(435)),
                    (_.exports = g.prng = g.prng || {}).create = function(a) {
                        for (var y = {
                            plugin: a,
                            key: null,
                            seed: null,
                            time: null,
                            reseeds: 0,
                            generated: 0,
                            keyBytes: ""
                        }, U = a.md, e = new Array(32), v = 0; v < 32; ++v)
                            e[v] = U.create();
                        function B() {
                            if (y.pools[0].messageLength >= 32)
                                return p();
                            var w = 32 - y.pools[0].messageLength << 5;
                            y.collect(y.seedFileSync(w)),
                            p()
                        }
                        function p() {
                            y.reseeds = y.reseeds === 4294967295 ? 0 : y.reseeds + 1;
                            var w = y.plugin.md.create();
                            w.update(y.keyBytes);
                            for (var M = 1, N = 0; N < 32; ++N)
                                y.reseeds % M == 0 && (w.update(y.pools[N].digest().getBytes()),
                                y.pools[N].start()),
                                M <<= 1;
                            y.keyBytes = w.digest().getBytes(),
                            w.start(),
                            w.update(y.keyBytes);
                            var O = w.digest().getBytes();
                            y.key = y.plugin.formatKey(y.keyBytes),
                            y.seed = y.plugin.formatSeed(O),
                            y.generated = 0
                        }
                        function b(w) {
                            var M = null
                              , N = g.util.globalScope
                              , O = N.crypto || N.msCrypto;
                            O && O.getRandomValues && (M = function(l) {
                                return O.getRandomValues(l)
                            }
                            );
                            var x = g.util.createBuffer();
                            if (M)
                                for (; x.length() < w; ) {
                                    var o = Math.max(1, Math.min(w - x.length(), 65536) / 4)
                                      , S = new Uint32Array(Math.floor(o));
                                    try {
                                        M(S);
                                        for (var L = 0; L < S.length; ++L)
                                            x.putInt32(S[L])
                                    } catch (E) {
                                        if (!(typeof QuotaExceededError != "undefined" && E instanceof QuotaExceededError))
                                            throw E
                                    }
                                }
                            if (x.length() < w)
                                for (var V, F, j, z = Math.floor(65536 * Math.random()); x.length() < w; )
                                    for (F = 16807 * (65535 & z),
                                    F += (32767 & (V = 16807 * (z >> 16))) << 16,
                                    z = 4294967295 & (F = (2147483647 & (F += V >> 15)) + (F >> 31)),
                                    L = 0; L < 3; ++L)
                                        j = z >>> (L << 3),
                                        j ^= Math.floor(256 * Math.random()),
                                        x.putByte(255 & j);
                            return x.getBytes(w)
                        }
                        return y.pools = e,
                        y.pool = 0,
                        y.generate = function(w, M) {
                            if (!M)
                                return y.generateSync(w);
                            var N = y.plugin.cipher
                              , O = y.plugin.increment
                              , x = y.plugin.formatKey
                              , o = y.plugin.formatSeed
                              , S = g.util.createBuffer();
                            y.key = null,
                            function L(V) {
                                if (V)
                                    return M(V);
                                if (S.length() >= w)
                                    return M(null, S.getBytes(w));
                                if (y.generated > 1048575 && (y.key = null),
                                y.key === null)
                                    return g.util.nextTick(function() {
                                        (function(j) {
                                            if (y.pools[0].messageLength >= 32)
                                                return p(),
                                                j();
                                            var z = 32 - y.pools[0].messageLength << 5;
                                            y.seedFile(z, function(E, l) {
                                                if (E)
                                                    return j(E);
                                                y.collect(l),
                                                p(),
                                                j()
                                            })
                                        }
                                        )(L)
                                    });
                                var F = N(y.key, y.seed);
                                y.generated += F.length,
                                S.putBytes(F),
                                y.key = x(N(y.key, O(y.seed))),
                                y.seed = o(N(y.key, y.seed)),
                                g.util.setImmediate(L)
                            }()
                        }
                        ,
                        y.generateSync = function(w) {
                            var M = y.plugin.cipher
                              , N = y.plugin.increment
                              , O = y.plugin.formatKey
                              , x = y.plugin.formatSeed;
                            y.key = null;
                            for (var o = g.util.createBuffer(); o.length() < w; ) {
                                y.generated > 1048575 && (y.key = null),
                                y.key === null && B();
                                var S = M(y.key, y.seed);
                                y.generated += S.length,
                                o.putBytes(S),
                                y.key = O(M(y.key, N(y.seed))),
                                y.seed = x(M(y.key, y.seed))
                            }
                            return o.getBytes(w)
                        }
                        ,
                        y.seedFileSync = b,
                        y.collect = function(w) {
                            for (var M = w.length, N = 0; N < M; ++N)
                                y.pools[y.pool].update(w.substr(N, 1)),
                                y.pool = y.pool === 31 ? 0 : y.pool + 1
                        }
                        ,
                        y.collectInt = function(w, M) {
                            for (var N = "", O = 0; O < M; O += 8)
                                N += String.fromCharCode(w >> O & 255);
                            y.collect(N)
                        }
                        ,
                        y.registerWorker = function(w) {
                            w === self ? y.seedFile = function(M, N) {
                                self.addEventListener("message", function O(x) {
                                    var o = x.data;
                                    o.forge && o.forge.prng && (self.removeEventListener("message", O),
                                    N(o.forge.prng.err, o.forge.prng.bytes))
                                }),
                                self.postMessage({
                                    forge: {
                                        prng: {
                                            needed: M
                                        }
                                    }
                                })
                            }
                            : w.addEventListener("message", function(M) {
                                var N = M.data;
                                N.forge && N.forge.prng && y.seedFile(N.forge.prng.needed, function(O, x) {
                                    w.postMessage({
                                        forge: {
                                            prng: {
                                                err: O,
                                                bytes: x
                                            }
                                        }
                                    })
                                })
                            })
                        }
                        ,
                        y
                    }
                },
                723: function(_, D, k) {
                    var g = k(654);
                    k(154),
                    k(527),
                    (_.exports = g.pss = g.pss || {}).create = function(i) {
                        arguments.length === 3 && (i = {
                            md: arguments[0],
                            mgf: arguments[1],
                            saltLength: arguments[2]
                        });
                        var a, y = i.md, U = i.mgf, e = y.digestLength, v = i.salt || null;
                        if (typeof v == "string" && (v = g.util.createBuffer(v)),
                        "saltLength"in i)
                            a = i.saltLength;
                        else {
                            if (v === null)
                                throw new Error("Salt length not specified or specific salt not given.");
                            a = v.length()
                        }
                        if (v !== null && v.length() !== a)
                            throw new Error("Given salt length does not match length of given salt.");
                        var B = i.prng || g.random
                          , p = {
                            encode: function(w, M) {
                                var N, O, x = M - 1, o = Math.ceil(x / 8), S = w.digest().getBytes();
                                if (o < e + a + 2)
                                    throw new Error("Message is too long to encrypt.");
                                O = v === null ? B.getBytesSync(a) : v.bytes();
                                var L = new g.util.ByteBuffer;
                                L.fillWithByte(0, 8),
                                L.putBytes(S),
                                L.putBytes(O),
                                y.start(),
                                y.update(L.getBytes());
                                var V = y.digest().getBytes()
                                  , F = new g.util.ByteBuffer;
                                F.fillWithByte(0, o - a - e - 2),
                                F.putByte(1),
                                F.putBytes(O);
                                var j = F.getBytes()
                                  , z = o - e - 1
                                  , E = U.generate(V, z)
                                  , l = "";
                                for (N = 0; N < z; N++)
                                    l += String.fromCharCode(j.charCodeAt(N) ^ E.charCodeAt(N));
                                var I = 65280 >> 8 * o - x & 255;
                                return (l = String.fromCharCode(l.charCodeAt(0) & ~I) + l.substr(1)) + V + String.fromCharCode(188)
                            },
                            verify: function(w, M, N) {
                                var O, x = N - 1, o = Math.ceil(x / 8);
                                if (M = M.substr(-o),
                                o < e + a + 2)
                                    throw new Error("Inconsistent parameters to PSS signature verification.");
                                if (M.charCodeAt(o - 1) !== 188)
                                    throw new Error("Encoded message does not end in 0xBC.");
                                var S = o - e - 1
                                  , L = M.substr(0, S)
                                  , V = M.substr(S, e)
                                  , F = 65280 >> 8 * o - x & 255;
                                if (L.charCodeAt(0) & F)
                                    throw new Error("Bits beyond keysize not zero as expected.");
                                var j = U.generate(V, S)
                                  , z = "";
                                for (O = 0; O < S; O++)
                                    z += String.fromCharCode(L.charCodeAt(O) ^ j.charCodeAt(O));
                                z = String.fromCharCode(z.charCodeAt(0) & ~F) + z.substr(1);
                                var E = o - e - a - 2;
                                for (O = 0; O < E; O++)
                                    if (z.charCodeAt(O) !== 0)
                                        throw new Error("Leftmost octets not zero as expected");
                                if (z.charCodeAt(E) !== 1)
                                    throw new Error("Inconsistent PSS signature, 0x01 marker not found");
                                var l = z.substr(-a)
                                  , I = new g.util.ByteBuffer;
                                return I.fillWithByte(0, 8),
                                I.putBytes(w),
                                I.putBytes(l),
                                y.start(),
                                y.update(I.getBytes()),
                                V === y.digest().getBytes()
                            }
                        };
                        return p
                    }
                },
                154: function(_, D, k) {
                    var g = k(654);
                    k(114),
                    k(802),
                    k(216),
                    k(527),
                    g.random && g.random.getBytes ? _.exports = g.random : function(i) {
                        var a = {}
                          , y = new Array(4)
                          , U = g.util.createBuffer();
                        function e() {
                            var N = g.prng.create(a);
                            return N.getBytes = function(O, x) {
                                return N.generate(O, x)
                            }
                            ,
                            N.getBytesSync = function(O) {
                                return N.generate(O)
                            }
                            ,
                            N
                        }
                        a.formatKey = function(N) {
                            var O = g.util.createBuffer(N);
                            return (N = new Array(4))[0] = O.getInt32(),
                            N[1] = O.getInt32(),
                            N[2] = O.getInt32(),
                            N[3] = O.getInt32(),
                            g.aes._expandKey(N, !1)
                        }
                        ,
                        a.formatSeed = function(N) {
                            var O = g.util.createBuffer(N);
                            return (N = new Array(4))[0] = O.getInt32(),
                            N[1] = O.getInt32(),
                            N[2] = O.getInt32(),
                            N[3] = O.getInt32(),
                            N
                        }
                        ,
                        a.cipher = function(N, O) {
                            return g.aes._updateBlock(N, O, y, !1),
                            U.putInt32(y[0]),
                            U.putInt32(y[1]),
                            U.putInt32(y[2]),
                            U.putInt32(y[3]),
                            U.getBytes()
                        }
                        ,
                        a.increment = function(N) {
                            return ++N[3],
                            N
                        }
                        ,
                        a.md = g.md.sha256;
                        var v = e()
                          , B = null
                          , p = g.util.globalScope
                          , b = p.crypto || p.msCrypto;
                        if (b && b.getRandomValues && (B = function(O) {
                            return b.getRandomValues(O)
                        }
                        ),
                        g.options.usePureJavaScript || !g.util.isNodejs && !B) {
                            if (v.collectInt(+new Date, 32),
                            typeof navigator != "undefined") {
                                var w = "";
                                for (var M in navigator)
                                    try {
                                        typeof navigator[M] == "string" && (w += navigator[M])
                                    } catch (N) {}
                                v.collect(w),
                                w = null
                            }
                            i && (i().mousemove(function(N) {
                                v.collectInt(N.clientX, 16),
                                v.collectInt(N.clientY, 16)
                            }),
                            i().keypress(function(N) {
                                v.collectInt(N.charCode, 8)
                            }))
                        }
                        if (g.random)
                            for (var M in v)
                                g.random[M] = v[M];
                        else
                            g.random = v;
                        g.random.createInstance = e,
                        _.exports = g.random
                    }(typeof jQuery != "undefined" ? jQuery : null)
                },
                755: function(_, D, k) {
                    var g = k(654);
                    if (k(374),
                    k(562),
                    k(106),
                    k(438),
                    k(903),
                    k(154),
                    k(527),
                    i === void 0)
                        var i = g.jsbn.BigInteger;
                    var a = g.util.isNodejs ? k(435) : null
                      , y = g.asn1
                      , U = g.util;
                    g.pki = g.pki || {},
                    _.exports = g.pki.rsa = g.rsa = g.rsa || {};
                    var e = g.pki
                      , v = [6, 4, 2, 4, 2, 4, 6, 2]
                      , B = {
                        name: "PrivateKeyInfo",
                        tagClass: y.Class.UNIVERSAL,
                        type: y.Type.SEQUENCE,
                        constructed: !0,
                        value: [{
                            name: "PrivateKeyInfo.version",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "privateKeyVersion"
                        }, {
                            name: "PrivateKeyInfo.privateKeyAlgorithm",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.SEQUENCE,
                            constructed: !0,
                            value: [{
                                name: "AlgorithmIdentifier.algorithm",
                                tagClass: y.Class.UNIVERSAL,
                                type: y.Type.OID,
                                constructed: !1,
                                capture: "privateKeyOid"
                            }]
                        }, {
                            name: "PrivateKeyInfo",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.OCTETSTRING,
                            constructed: !1,
                            capture: "privateKey"
                        }]
                    }
                      , p = {
                        name: "RSAPrivateKey",
                        tagClass: y.Class.UNIVERSAL,
                        type: y.Type.SEQUENCE,
                        constructed: !0,
                        value: [{
                            name: "RSAPrivateKey.version",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "privateKeyVersion"
                        }, {
                            name: "RSAPrivateKey.modulus",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "privateKeyModulus"
                        }, {
                            name: "RSAPrivateKey.publicExponent",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "privateKeyPublicExponent"
                        }, {
                            name: "RSAPrivateKey.privateExponent",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "privateKeyPrivateExponent"
                        }, {
                            name: "RSAPrivateKey.prime1",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "privateKeyPrime1"
                        }, {
                            name: "RSAPrivateKey.prime2",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "privateKeyPrime2"
                        }, {
                            name: "RSAPrivateKey.exponent1",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "privateKeyExponent1"
                        }, {
                            name: "RSAPrivateKey.exponent2",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "privateKeyExponent2"
                        }, {
                            name: "RSAPrivateKey.coefficient",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "privateKeyCoefficient"
                        }]
                    }
                      , b = {
                        name: "RSAPublicKey",
                        tagClass: y.Class.UNIVERSAL,
                        type: y.Type.SEQUENCE,
                        constructed: !0,
                        value: [{
                            name: "RSAPublicKey.modulus",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "publicKeyModulus"
                        }, {
                            name: "RSAPublicKey.exponent",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.INTEGER,
                            constructed: !1,
                            capture: "publicKeyExponent"
                        }]
                    }
                      , w = g.pki.rsa.publicKeyValidator = {
                        name: "SubjectPublicKeyInfo",
                        tagClass: y.Class.UNIVERSAL,
                        type: y.Type.SEQUENCE,
                        constructed: !0,
                        captureAsn1: "subjectPublicKeyInfo",
                        value: [{
                            name: "SubjectPublicKeyInfo.AlgorithmIdentifier",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.SEQUENCE,
                            constructed: !0,
                            value: [{
                                name: "AlgorithmIdentifier.algorithm",
                                tagClass: y.Class.UNIVERSAL,
                                type: y.Type.OID,
                                constructed: !1,
                                capture: "publicKeyOid"
                            }]
                        }, {
                            name: "SubjectPublicKeyInfo.subjectPublicKey",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.BITSTRING,
                            constructed: !1,
                            value: [{
                                name: "SubjectPublicKeyInfo.subjectPublicKey.RSAPublicKey",
                                tagClass: y.Class.UNIVERSAL,
                                type: y.Type.SEQUENCE,
                                constructed: !0,
                                optional: !0,
                                captureAsn1: "rsaPublicKey"
                            }]
                        }]
                    }
                      , M = {
                        name: "DigestInfo",
                        tagClass: y.Class.UNIVERSAL,
                        type: y.Type.SEQUENCE,
                        constructed: !0,
                        value: [{
                            name: "DigestInfo.DigestAlgorithm",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.SEQUENCE,
                            constructed: !0,
                            value: [{
                                name: "DigestInfo.DigestAlgorithm.algorithmIdentifier",
                                tagClass: y.Class.UNIVERSAL,
                                type: y.Type.OID,
                                constructed: !1,
                                capture: "algorithmIdentifier"
                            }, {
                                name: "DigestInfo.DigestAlgorithm.parameters",
                                tagClass: y.Class.UNIVERSAL,
                                type: y.Type.NULL,
                                capture: "parameters",
                                optional: !0,
                                constructed: !1
                            }]
                        }, {
                            name: "DigestInfo.digest",
                            tagClass: y.Class.UNIVERSAL,
                            type: y.Type.OCTETSTRING,
                            constructed: !1,
                            capture: "digest"
                        }]
                    }
                      , N = function(I) {
                        var n;
                        if (!(I.algorithm in e.oids)) {
                            var c = new Error("Unknown message digest algorithm.");
                            throw c.algorithm = I.algorithm,
                            c
                        }
                        n = e.oids[I.algorithm];
                        var h = y.oidToDer(n).getBytes()
                          , C = y.create(y.Class.UNIVERSAL, y.Type.SEQUENCE, !0, [])
                          , R = y.create(y.Class.UNIVERSAL, y.Type.SEQUENCE, !0, []);
                        R.value.push(y.create(y.Class.UNIVERSAL, y.Type.OID, !1, h)),
                        R.value.push(y.create(y.Class.UNIVERSAL, y.Type.NULL, !1, ""));
                        var P = y.create(y.Class.UNIVERSAL, y.Type.OCTETSTRING, !1, I.digest().getBytes());
                        return C.value.push(R),
                        C.value.push(P),
                        y.toDer(C).getBytes()
                    }
                      , O = function(I, n, c) {
                        if (c)
                            return I.modPow(n.e, n.n);
                        if (!n.p || !n.q)
                            return I.modPow(n.d, n.n);
                        var h;
                        n.dP || (n.dP = n.d.mod(n.p.subtract(i.ONE))),
                        n.dQ || (n.dQ = n.d.mod(n.q.subtract(i.ONE))),
                        n.qInv || (n.qInv = n.q.modInverse(n.p));
                        do
                            h = new i(g.util.bytesToHex(g.random.getBytes(n.n.bitLength() / 8)),16);
                        while (h.compareTo(n.n) >= 0 || !h.gcd(n.n).equals(i.ONE));
                        for (var C = (I = I.multiply(h.modPow(n.e, n.n)).mod(n.n)).mod(n.p).modPow(n.dP, n.p), R = I.mod(n.q).modPow(n.dQ, n.q); C.compareTo(R) < 0; )
                            C = C.add(n.p);
                        var P = C.subtract(R).multiply(n.qInv).mod(n.p).multiply(n.q).add(R);
                        return P.multiply(h.modInverse(n.n)).mod(n.n)
                    };
                    function x(l, I, n) {
                        var c = g.util.createBuffer()
                          , h = Math.ceil(I.n.bitLength() / 8);
                        if (l.length > h - 11) {
                            var C = new Error("Message is too long for PKCS#1 v1.5 padding.");
                            throw C.length = l.length,
                            C.max = h - 11,
                            C
                        }
                        c.putByte(0),
                        c.putByte(n);
                        var R, P = h - 3 - l.length;
                        if (n === 0 || n === 1) {
                            R = n === 0 ? 0 : 255;
                            for (var G = 0; G < P; ++G)
                                c.putByte(R)
                        } else
                            for (; P > 0; ) {
                                var H = 0
                                  , X = g.random.getBytes(P);
                                for (G = 0; G < P; ++G)
                                    (R = X.charCodeAt(G)) === 0 ? ++H : c.putByte(R);
                                P = H
                            }
                        return c.putByte(0),
                        c.putBytes(l),
                        c
                    }
                    function o(l, I, n, c) {
                        var h = Math.ceil(I.n.bitLength() / 8)
                          , C = g.util.createBuffer(l)
                          , R = C.getByte()
                          , P = C.getByte();
                        if (R !== 0 || n && P !== 0 && P !== 1 || !n && P != 2 || n && P === 0 && c === void 0)
                            throw new Error("Encryption block is invalid.");
                        var G = 0;
                        if (P === 0) {
                            G = h - 3 - c;
                            for (var H = 0; H < G; ++H)
                                if (C.getByte() !== 0)
                                    throw new Error("Encryption block is invalid.")
                        } else if (P === 1)
                            for (G = 0; C.length() > 1; ) {
                                if (C.getByte() !== 255) {
                                    --C.read;
                                    break
                                }
                                ++G
                            }
                        else if (P === 2)
                            for (G = 0; C.length() > 1; ) {
                                if (C.getByte() === 0) {
                                    --C.read;
                                    break
                                }
                                ++G
                            }
                        if (C.getByte() !== 0 || G !== h - 3 - C.length())
                            throw new Error("Encryption block is invalid.");
                        return C.getBytes()
                    }
                    function S(l, I, n) {
                        typeof I == "function" && (n = I,
                        I = {});
                        var c = {
                            algorithm: {
                                name: (I = I || {}).algorithm || "PRIMEINC",
                                options: {
                                    workers: I.workers || 2,
                                    workLoad: I.workLoad || 100,
                                    workerScript: I.workerScript
                                }
                            }
                        };
                        function h() {
                            C(l.pBits, function(P, G) {
                                return P ? n(P) : (l.p = G,
                                l.q !== null ? R(P, l.q) : void C(l.qBits, R))
                            })
                        }
                        function C(P, G) {
                            g.prime.generateProbablePrime(P, c, G)
                        }
                        function R(P, G) {
                            if (P)
                                return n(P);
                            if (l.q = G,
                            l.p.compareTo(l.q) < 0) {
                                var H = l.p;
                                l.p = l.q,
                                l.q = H
                            }
                            if (l.p.subtract(i.ONE).gcd(l.e).compareTo(i.ONE) !== 0)
                                return l.p = null,
                                void h();
                            if (l.q.subtract(i.ONE).gcd(l.e).compareTo(i.ONE) !== 0)
                                return l.q = null,
                                void C(l.qBits, R);
                            if (l.p1 = l.p.subtract(i.ONE),
                            l.q1 = l.q.subtract(i.ONE),
                            l.phi = l.p1.multiply(l.q1),
                            l.phi.gcd(l.e).compareTo(i.ONE) !== 0)
                                return l.p = l.q = null,
                                void h();
                            if (l.n = l.p.multiply(l.q),
                            l.n.bitLength() !== l.bits)
                                return l.q = null,
                                void C(l.qBits, R);
                            var X = l.e.modInverse(l.phi);
                            l.keys = {
                                privateKey: e.rsa.setPrivateKey(l.n, l.e, X, l.p, l.q, X.mod(l.p1), X.mod(l.q1), l.q.modInverse(l.p)),
                                publicKey: e.rsa.setPublicKey(l.n, l.e)
                            },
                            n(null, l.keys)
                        }
                        "prng"in I && (c.prng = I.prng),
                        h()
                    }
                    function L(l) {
                        var I = l.toString(16);
                        I[0] >= "8" && (I = "00" + I);
                        var n = g.util.hexToBytes(I);
                        return n.length > 1 && (n.charCodeAt(0) === 0 && !(128 & n.charCodeAt(1)) || n.charCodeAt(0) === 255 && (128 & n.charCodeAt(1)) == 128) ? n.substr(1) : n
                    }
                    function V(l) {
                        return l <= 100 ? 27 : l <= 150 ? 18 : l <= 200 ? 15 : l <= 250 ? 12 : l <= 300 ? 9 : l <= 350 ? 8 : l <= 400 ? 7 : l <= 500 ? 6 : l <= 600 ? 5 : l <= 800 ? 4 : l <= 1250 ? 3 : 2
                    }
                    function F(l) {
                        return g.util.isNodejs && typeof a[l] == "function"
                    }
                    function j(l) {
                        return U.globalScope !== void 0 && le(U.globalScope.crypto) == "object" && le(U.globalScope.crypto.subtle) == "object" && typeof U.globalScope.crypto.subtle[l] == "function"
                    }
                    function z(l) {
                        return U.globalScope !== void 0 && le(U.globalScope.msCrypto) == "object" && le(U.globalScope.msCrypto.subtle) == "object" && typeof U.globalScope.msCrypto.subtle[l] == "function"
                    }
                    function E(l) {
                        for (var I = g.util.hexToBytes(l.toString(16)), n = new Uint8Array(I.length), c = 0; c < I.length; ++c)
                            n[c] = I.charCodeAt(c);
                        return n
                    }
                    e.rsa.encrypt = function(l, I, n) {
                        var c, h = n, C = Math.ceil(I.n.bitLength() / 8);
                        n !== !1 && n !== !0 ? (h = n === 2,
                        c = x(l, I, n)) : (c = g.util.createBuffer()).putBytes(l);
                        for (var R = new i(c.toHex(),16), P = O(R, I, h).toString(16), G = g.util.createBuffer(), H = C - Math.ceil(P.length / 2); H > 0; )
                            G.putByte(0),
                            --H;
                        return G.putBytes(g.util.hexToBytes(P)),
                        G.getBytes()
                    }
                    ,
                    e.rsa.decrypt = function(l, I, n, c) {
                        var h = Math.ceil(I.n.bitLength() / 8);
                        if (l.length !== h) {
                            var C = new Error("Encrypted message length is invalid.");
                            throw C.length = l.length,
                            C.expected = h,
                            C
                        }
                        var R = new i(g.util.createBuffer(l).toHex(),16);
                        if (R.compareTo(I.n) >= 0)
                            throw new Error("Encrypted message is invalid.");
                        for (var P = O(R, I, n).toString(16), G = g.util.createBuffer(), H = h - Math.ceil(P.length / 2); H > 0; )
                            G.putByte(0),
                            --H;
                        return G.putBytes(g.util.hexToBytes(P)),
                        c !== !1 ? o(G.getBytes(), I, n) : G.getBytes()
                    }
                    ,
                    e.rsa.createKeyPairGenerationState = function(l, I, n) {
                        typeof l == "string" && (l = parseInt(l, 10)),
                        l = l || 2048;
                        var c, h = (n = n || {}).prng || g.random, C = {
                            nextBytes: function(G) {
                                for (var H = h.getBytesSync(G.length), X = 0; X < G.length; ++X)
                                    G[X] = H.charCodeAt(X)
                            }
                        }, R = n.algorithm || "PRIMEINC";
                        if (R !== "PRIMEINC")
                            throw new Error("Invalid key generation algorithm: " + R);
                        return (c = {
                            algorithm: R,
                            state: 0,
                            bits: l,
                            rng: C,
                            eInt: I || 65537,
                            e: new i(null),
                            p: null,
                            q: null,
                            qBits: l >> 1,
                            pBits: l - (l >> 1),
                            pqState: 0,
                            num: null,
                            keys: null
                        }).e.fromInt(c.eInt),
                        c
                    }
                    ,
                    e.rsa.stepKeyPairGenerationState = function(l, I) {
                        "algorithm"in l || (l.algorithm = "PRIMEINC");
                        var n = new i(null);
                        n.fromInt(30);
                        for (var c, h = 0, C = function(W, $) {
                            return W | $
                        }, R = +new Date, P = 0; l.keys === null && (I <= 0 || P < I); ) {
                            if (l.state === 0) {
                                var G = l.p === null ? l.pBits : l.qBits
                                  , H = G - 1;
                                l.pqState === 0 ? (l.num = new i(G,l.rng),
                                l.num.testBit(H) || l.num.bitwiseTo(i.ONE.shiftLeft(H), C, l.num),
                                l.num.dAddOffset(31 - l.num.mod(n).byteValue(), 0),
                                h = 0,
                                ++l.pqState) : l.pqState === 1 ? l.num.bitLength() > G ? l.pqState = 0 : l.num.isProbablePrime(V(l.num.bitLength())) ? ++l.pqState : l.num.dAddOffset(v[h++ % 8], 0) : l.pqState === 2 ? l.pqState = l.num.subtract(i.ONE).gcd(l.e).compareTo(i.ONE) === 0 ? 3 : 0 : l.pqState === 3 && (l.pqState = 0,
                                l.p === null ? l.p = l.num : l.q = l.num,
                                l.p !== null && l.q !== null && ++l.state,
                                l.num = null)
                            } else if (l.state === 1)
                                l.p.compareTo(l.q) < 0 && (l.num = l.p,
                                l.p = l.q,
                                l.q = l.num),
                                ++l.state;
                            else if (l.state === 2)
                                l.p1 = l.p.subtract(i.ONE),
                                l.q1 = l.q.subtract(i.ONE),
                                l.phi = l.p1.multiply(l.q1),
                                ++l.state;
                            else if (l.state === 3)
                                l.phi.gcd(l.e).compareTo(i.ONE) === 0 ? ++l.state : (l.p = null,
                                l.q = null,
                                l.state = 0);
                            else if (l.state === 4)
                                l.n = l.p.multiply(l.q),
                                l.n.bitLength() === l.bits ? ++l.state : (l.q = null,
                                l.state = 0);
                            else if (l.state === 5) {
                                var X = l.e.modInverse(l.phi);
                                l.keys = {
                                    privateKey: e.rsa.setPrivateKey(l.n, l.e, X, l.p, l.q, X.mod(l.p1), X.mod(l.q1), l.q.modInverse(l.p)),
                                    publicKey: e.rsa.setPublicKey(l.n, l.e)
                                }
                            }
                            P += (c = +new Date) - R,
                            R = c
                        }
                        return l.keys !== null
                    }
                    ,
                    e.rsa.generateKeyPair = function(l, I, n, c) {
                        if (arguments.length === 1 ? le(l) == "object" ? (n = l,
                        l = void 0) : typeof l == "function" && (c = l,
                        l = void 0) : arguments.length === 2 ? typeof l == "number" ? typeof I == "function" ? (c = I,
                        I = void 0) : typeof I != "number" && (n = I,
                        I = void 0) : (n = l,
                        c = I,
                        l = void 0,
                        I = void 0) : arguments.length === 3 && (typeof I == "number" ? typeof n == "function" && (c = n,
                        n = void 0) : (c = n,
                        n = I,
                        I = void 0)),
                        n = n || {},
                        l === void 0 && (l = n.bits || 2048),
                        I === void 0 && (I = n.e || 65537),
                        !g.options.usePureJavaScript && !n.prng && l >= 256 && l <= 16384 && (I === 65537 || I === 3)) {
                            if (c) {
                                if (F("generateKeyPair"))
                                    return a.generateKeyPair("rsa", {
                                        modulusLength: l,
                                        publicExponent: I,
                                        publicKeyEncoding: {
                                            type: "spki",
                                            format: "pem"
                                        },
                                        privateKeyEncoding: {
                                            type: "pkcs8",
                                            format: "pem"
                                        }
                                    }, function(P, G, H) {
                                        if (P)
                                            return c(P);
                                        c(null, {
                                            privateKey: e.privateKeyFromPem(H),
                                            publicKey: e.publicKeyFromPem(G)
                                        })
                                    });
                                if (j("generateKey") && j("exportKey"))
                                    return U.globalScope.crypto.subtle.generateKey({
                                        name: "RSASSA-PKCS1-v1_5",
                                        modulusLength: l,
                                        publicExponent: E(I),
                                        hash: {
                                            name: "SHA-256"
                                        }
                                    }, !0, ["sign", "verify"]).then(function(P) {
                                        return U.globalScope.crypto.subtle.exportKey("pkcs8", P.privateKey)
                                    }).then(void 0, function(P) {
                                        c(P)
                                    }).then(function(P) {
                                        if (P) {
                                            var G = e.privateKeyFromAsn1(y.fromDer(g.util.createBuffer(P)));
                                            c(null, {
                                                privateKey: G,
                                                publicKey: e.setRsaPublicKey(G.n, G.e)
                                            })
                                        }
                                    });
                                if (z("generateKey") && z("exportKey")) {
                                    var h = U.globalScope.msCrypto.subtle.generateKey({
                                        name: "RSASSA-PKCS1-v1_5",
                                        modulusLength: l,
                                        publicExponent: E(I),
                                        hash: {
                                            name: "SHA-256"
                                        }
                                    }, !0, ["sign", "verify"]);
                                    return h.oncomplete = function(P) {
                                        var G = P.target.result
                                          , H = U.globalScope.msCrypto.subtle.exportKey("pkcs8", G.privateKey);
                                        H.oncomplete = function(X) {
                                            var Z = X.target.result
                                              , W = e.privateKeyFromAsn1(y.fromDer(g.util.createBuffer(Z)));
                                            c(null, {
                                                privateKey: W,
                                                publicKey: e.setRsaPublicKey(W.n, W.e)
                                            })
                                        }
                                        ,
                                        H.onerror = function(X) {
                                            c(X)
                                        }
                                    }
                                    ,
                                    void (h.onerror = function(P) {
                                        c(P)
                                    }
                                    )
                                }
                            } else if (F("generateKeyPairSync")) {
                                var C = a.generateKeyPairSync("rsa", {
                                    modulusLength: l,
                                    publicExponent: I,
                                    publicKeyEncoding: {
                                        type: "spki",
                                        format: "pem"
                                    },
                                    privateKeyEncoding: {
                                        type: "pkcs8",
                                        format: "pem"
                                    }
                                });
                                return {
                                    privateKey: e.privateKeyFromPem(C.privateKey),
                                    publicKey: e.publicKeyFromPem(C.publicKey)
                                }
                            }
                        }
                        var R = e.rsa.createKeyPairGenerationState(l, I, n);
                        if (!c)
                            return e.rsa.stepKeyPairGenerationState(R, 0),
                            R.keys;
                        S(R, n, c)
                    }
                    ,
                    e.setRsaPublicKey = e.rsa.setPublicKey = function(l, I) {
                        var n = {
                            n: l,
                            e: I,
                            encrypt: function(h, C, R) {
                                if (typeof C == "string" ? C = C.toUpperCase() : C === void 0 && (C = "RSAES-PKCS1-V1_5"),
                                C === "RSAES-PKCS1-V1_5")
                                    C = {
                                        encode: function(H, X, Z) {
                                            return x(H, X, 2).getBytes()
                                        }
                                    };
                                else if (C === "RSA-OAEP" || C === "RSAES-OAEP")
                                    C = {
                                        encode: function(H, X) {
                                            return g.pkcs1.encode_rsa_oaep(X, H, R)
                                        }
                                    };
                                else if (["RAW", "NONE", "NULL", null].indexOf(C) !== -1)
                                    C = {
                                        encode: function(H) {
                                            return H
                                        }
                                    };
                                else if (typeof C == "string")
                                    throw new Error('Unsupported encryption scheme: "' + C + '".');
                                var P = C.encode(h, n, !0);
                                return e.rsa.encrypt(P, n, !0)
                            },
                            verify: function(h, C, R, P) {
                                typeof R == "string" ? R = R.toUpperCase() : R === void 0 && (R = "RSASSA-PKCS1-V1_5"),
                                P === void 0 && (P = {
                                    _parseAllDigestBytes: !0
                                }),
                                "_parseAllDigestBytes"in P || (P._parseAllDigestBytes = !0),
                                R === "RSASSA-PKCS1-V1_5" ? R = {
                                    verify: function(X, Z) {
                                        Z = o(Z, n, !0);
                                        var W = y.fromDer(Z, {
                                            parseAllBytes: P._parseAllDigestBytes
                                        })
                                          , $ = {}
                                          , te = [];
                                        if (!y.validate(W, M, $, te))
                                            throw (ee = new Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value.")).errors = te,
                                            ee;
                                        var ee, J = y.derToOid($.algorithmIdentifier);
                                        if (J !== g.oids.md2 && J !== g.oids.md5 && J !== g.oids.sha1 && J !== g.oids.sha224 && J !== g.oids.sha256 && J !== g.oids.sha384 && J !== g.oids.sha512 && J !== g.oids["sha512-224"] && J !== g.oids["sha512-256"])
                                            throw (ee = new Error("Unknown RSASSA-PKCS1-v1_5 DigestAlgorithm identifier.")).oid = J,
                                            ee;
                                        if ((J === g.oids.md2 || J === g.oids.md5) && !("parameters"in $))
                                            throw new Error("ASN.1 object does not contain a valid RSASSA-PKCS1-v1_5 DigestInfo value. Missing algorithm identifer NULL parameters.");
                                        return X === $.digest
                                    }
                                } : R !== "NONE" && R !== "NULL" && R !== null || (R = {
                                    verify: function(X, Z) {
                                        return X === o(Z, n, !0)
                                    }
                                });
                                var G = e.rsa.decrypt(C, n, !0, !1);
                                return R.verify(h, G, n.n.bitLength())
                            }
                        };
                        return n
                    }
                    ,
                    e.setRsaPrivateKey = e.rsa.setPrivateKey = function(l, I, n, c, h, C, R, P) {
                        var G = {
                            n: l,
                            e: I,
                            d: n,
                            p: c,
                            q: h,
                            dP: C,
                            dQ: R,
                            qInv: P,
                            decrypt: function(X, Z, W) {
                                typeof Z == "string" ? Z = Z.toUpperCase() : Z === void 0 && (Z = "RSAES-PKCS1-V1_5");
                                var $ = e.rsa.decrypt(X, G, !1, !1);
                                if (Z === "RSAES-PKCS1-V1_5")
                                    Z = {
                                        decode: o
                                    };
                                else if (Z === "RSA-OAEP" || Z === "RSAES-OAEP")
                                    Z = {
                                        decode: function(ee, J) {
                                            return g.pkcs1.decode_rsa_oaep(J, ee, W)
                                        }
                                    };
                                else {
                                    if (["RAW", "NONE", "NULL", null].indexOf(Z) === -1)
                                        throw new Error('Unsupported encryption scheme: "' + Z + '".');
                                    Z = {
                                        decode: function(ee) {
                                            return ee
                                        }
                                    }
                                }
                                return Z.decode($, G, !1)
                            },
                            sign: function(X, Z) {
                                var W = !1;
                                typeof Z == "string" && (Z = Z.toUpperCase()),
                                Z === void 0 || Z === "RSASSA-PKCS1-V1_5" ? (Z = {
                                    encode: N
                                },
                                W = 1) : Z !== "NONE" && Z !== "NULL" && Z !== null || (Z = {
                                    encode: function() {
                                        return X
                                    }
                                },
                                W = 1);
                                var $ = Z.encode(X, G.n.bitLength());
                                return e.rsa.encrypt($, G, W)
                            }
                        };
                        return G
                    }
                    ,
                    e.wrapRsaPrivateKey = function(l) {
                        return y.create(y.Class.UNIVERSAL, y.Type.SEQUENCE, !0, [y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, y.integerToDer(0).getBytes()), y.create(y.Class.UNIVERSAL, y.Type.SEQUENCE, !0, [y.create(y.Class.UNIVERSAL, y.Type.OID, !1, y.oidToDer(e.oids.rsaEncryption).getBytes()), y.create(y.Class.UNIVERSAL, y.Type.NULL, !1, "")]), y.create(y.Class.UNIVERSAL, y.Type.OCTETSTRING, !1, y.toDer(l).getBytes())])
                    }
                    ,
                    e.privateKeyFromAsn1 = function(l) {
                        var I, n, c, h, C, R, P, G, H = {}, X = [];
                        if (y.validate(l, B, H, X) && (l = y.fromDer(g.util.createBuffer(H.privateKey))),
                        H = {},
                        X = [],
                        !y.validate(l, p, H, X)) {
                            var Z = new Error("Cannot read private key. ASN.1 object does not contain an RSAPrivateKey.");
                            throw Z.errors = X,
                            Z
                        }
                        return I = g.util.createBuffer(H.privateKeyModulus).toHex(),
                        n = g.util.createBuffer(H.privateKeyPublicExponent).toHex(),
                        c = g.util.createBuffer(H.privateKeyPrivateExponent).toHex(),
                        h = g.util.createBuffer(H.privateKeyPrime1).toHex(),
                        C = g.util.createBuffer(H.privateKeyPrime2).toHex(),
                        R = g.util.createBuffer(H.privateKeyExponent1).toHex(),
                        P = g.util.createBuffer(H.privateKeyExponent2).toHex(),
                        G = g.util.createBuffer(H.privateKeyCoefficient).toHex(),
                        e.setRsaPrivateKey(new i(I,16), new i(n,16), new i(c,16), new i(h,16), new i(C,16), new i(R,16), new i(P,16), new i(G,16))
                    }
                    ,
                    e.privateKeyToAsn1 = e.privateKeyToRSAPrivateKey = function(l) {
                        return y.create(y.Class.UNIVERSAL, y.Type.SEQUENCE, !0, [y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, y.integerToDer(0).getBytes()), y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, L(l.n)), y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, L(l.e)), y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, L(l.d)), y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, L(l.p)), y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, L(l.q)), y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, L(l.dP)), y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, L(l.dQ)), y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, L(l.qInv))])
                    }
                    ,
                    e.publicKeyFromAsn1 = function(l) {
                        var I = {}
                          , n = [];
                        if (y.validate(l, w, I, n)) {
                            var c, h = y.derToOid(I.publicKeyOid);
                            if (h !== e.oids.rsaEncryption)
                                throw (c = new Error("Cannot read public key. Unknown OID.")).oid = h,
                                c;
                            l = I.rsaPublicKey
                        }
                        if (n = [],
                        !y.validate(l, b, I, n))
                            throw (c = new Error("Cannot read public key. ASN.1 object does not contain an RSAPublicKey.")).errors = n,
                            c;
                        var C = g.util.createBuffer(I.publicKeyModulus).toHex()
                          , R = g.util.createBuffer(I.publicKeyExponent).toHex();
                        return e.setRsaPublicKey(new i(C,16), new i(R,16))
                    }
                    ,
                    e.publicKeyToAsn1 = e.publicKeyToSubjectPublicKeyInfo = function(l) {
                        return y.create(y.Class.UNIVERSAL, y.Type.SEQUENCE, !0, [y.create(y.Class.UNIVERSAL, y.Type.SEQUENCE, !0, [y.create(y.Class.UNIVERSAL, y.Type.OID, !1, y.oidToDer(e.oids.rsaEncryption).getBytes()), y.create(y.Class.UNIVERSAL, y.Type.NULL, !1, "")]), y.create(y.Class.UNIVERSAL, y.Type.BITSTRING, !1, [e.publicKeyToRSAPublicKey(l)])])
                    }
                    ,
                    e.publicKeyToRSAPublicKey = function(l) {
                        return y.create(y.Class.UNIVERSAL, y.Type.SEQUENCE, !0, [y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, L(l.n)), y.create(y.Class.UNIVERSAL, y.Type.INTEGER, !1, L(l.e))])
                    }
                },
                320: function(_, D, k) {
                    var g = k(654);
                    k(419),
                    k(527);
                    var i = _.exports = g.sha1 = g.sha1 || {};
                    g.md.sha1 = g.md.algorithms.sha1 = i,
                    i.create = function() {
                        y || (a = String.fromCharCode(128),
                        a += g.util.fillString(String.fromCharCode(0), 64),
                        y = !0);
                        var e = null
                          , v = g.util.createBuffer()
                          , B = new Array(80)
                          , p = {
                            algorithm: "sha1",
                            blockLength: 64,
                            digestLength: 20,
                            messageLength: 0,
                            fullMessageLength: null,
                            messageLengthSize: 8,
                            start: function() {
                                p.messageLength = 0,
                                p.fullMessageLength = p.messageLength64 = [];
                                for (var w = p.messageLengthSize / 4, M = 0; M < w; ++M)
                                    p.fullMessageLength.push(0);
                                return v = g.util.createBuffer(),
                                e = {
                                    h0: 1732584193,
                                    h1: 4023233417,
                                    h2: 2562383102,
                                    h3: 271733878,
                                    h4: 3285377520
                                },
                                p
                            }
                        };
                        return p.start(),
                        p.update = function(b, w) {
                            w === "utf8" && (b = g.util.encodeUtf8(b));
                            var M = b.length;
                            p.messageLength += M,
                            M = [M / 4294967296 >>> 0, M >>> 0];
                            for (var N = p.fullMessageLength.length - 1; N >= 0; --N)
                                p.fullMessageLength[N] += M[1],
                                M[1] = M[0] + (p.fullMessageLength[N] / 4294967296 >>> 0),
                                p.fullMessageLength[N] = p.fullMessageLength[N] >>> 0,
                                M[0] = M[1] / 4294967296 >>> 0;
                            return v.putBytes(b),
                            U(e, B, v),
                            (v.read > 2048 || v.length() === 0) && v.compact(),
                            p
                        }
                        ,
                        p.digest = function() {
                            var b = g.util.createBuffer();
                            b.putBytes(v.bytes());
                            var w, M = p.fullMessageLength[p.fullMessageLength.length - 1] + p.messageLengthSize & p.blockLength - 1;
                            b.putBytes(a.substr(0, p.blockLength - M));
                            for (var N = 8 * p.fullMessageLength[0], O = 0; O < p.fullMessageLength.length - 1; ++O)
                                N += (w = 8 * p.fullMessageLength[O + 1]) / 4294967296 >>> 0,
                                b.putInt32(N >>> 0),
                                N = w >>> 0;
                            b.putInt32(N);
                            var x = {
                                h0: e.h0,
                                h1: e.h1,
                                h2: e.h2,
                                h3: e.h3,
                                h4: e.h4
                            };
                            U(x, B, b);
                            var o = g.util.createBuffer();
                            return o.putInt32(x.h0),
                            o.putInt32(x.h1),
                            o.putInt32(x.h2),
                            o.putInt32(x.h3),
                            o.putInt32(x.h4),
                            o
                        }
                        ,
                        p
                    }
                    ;
                    var a = null
                      , y = !1;
                    function U(e, v, B) {
                        for (var p, b, w, M, N, O, x, o = B.length(); o >= 64; ) {
                            for (b = e.h0,
                            w = e.h1,
                            M = e.h2,
                            N = e.h3,
                            O = e.h4,
                            x = 0; x < 16; ++x)
                                p = B.getInt32(),
                                v[x] = p,
                                p = (b << 5 | b >>> 27) + (N ^ w & (M ^ N)) + O + 1518500249 + p,
                                O = N,
                                N = M,
                                M = (w << 30 | w >>> 2) >>> 0,
                                w = b,
                                b = p;
                            for (; x < 20; ++x)
                                p = (p = v[x - 3] ^ v[x - 8] ^ v[x - 14] ^ v[x - 16]) << 1 | p >>> 31,
                                v[x] = p,
                                p = (b << 5 | b >>> 27) + (N ^ w & (M ^ N)) + O + 1518500249 + p,
                                O = N,
                                N = M,
                                M = (w << 30 | w >>> 2) >>> 0,
                                w = b,
                                b = p;
                            for (; x < 32; ++x)
                                p = (p = v[x - 3] ^ v[x - 8] ^ v[x - 14] ^ v[x - 16]) << 1 | p >>> 31,
                                v[x] = p,
                                p = (b << 5 | b >>> 27) + (w ^ M ^ N) + O + 1859775393 + p,
                                O = N,
                                N = M,
                                M = (w << 30 | w >>> 2) >>> 0,
                                w = b,
                                b = p;
                            for (; x < 40; ++x)
                                p = (p = v[x - 6] ^ v[x - 16] ^ v[x - 28] ^ v[x - 32]) << 2 | p >>> 30,
                                v[x] = p,
                                p = (b << 5 | b >>> 27) + (w ^ M ^ N) + O + 1859775393 + p,
                                O = N,
                                N = M,
                                M = (w << 30 | w >>> 2) >>> 0,
                                w = b,
                                b = p;
                            for (; x < 60; ++x)
                                p = (p = v[x - 6] ^ v[x - 16] ^ v[x - 28] ^ v[x - 32]) << 2 | p >>> 30,
                                v[x] = p,
                                p = (b << 5 | b >>> 27) + (w & M | N & (w ^ M)) + O + 2400959708 + p,
                                O = N,
                                N = M,
                                M = (w << 30 | w >>> 2) >>> 0,
                                w = b,
                                b = p;
                            for (; x < 80; ++x)
                                p = (p = v[x - 6] ^ v[x - 16] ^ v[x - 28] ^ v[x - 32]) << 2 | p >>> 30,
                                v[x] = p,
                                p = (b << 5 | b >>> 27) + (w ^ M ^ N) + O + 3395469782 + p,
                                O = N,
                                N = M,
                                M = (w << 30 | w >>> 2) >>> 0,
                                w = b,
                                b = p;
                            e.h0 = e.h0 + b | 0,
                            e.h1 = e.h1 + w | 0,
                            e.h2 = e.h2 + M | 0,
                            e.h3 = e.h3 + N | 0,
                            e.h4 = e.h4 + O | 0,
                            o -= 64
                        }
                    }
                },
                802: function(_, D, k) {
                    var g = k(654);
                    k(419),
                    k(527);
                    var i = _.exports = g.sha256 = g.sha256 || {};
                    g.md.sha256 = g.md.algorithms.sha256 = i,
                    i.create = function() {
                        y || (a = String.fromCharCode(128),
                        a += g.util.fillString(String.fromCharCode(0), 64),
                        U = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
                        y = !0);
                        var v = null
                          , B = g.util.createBuffer()
                          , p = new Array(64)
                          , b = {
                            algorithm: "sha256",
                            blockLength: 64,
                            digestLength: 32,
                            messageLength: 0,
                            fullMessageLength: null,
                            messageLengthSize: 8,
                            start: function() {
                                b.messageLength = 0,
                                b.fullMessageLength = b.messageLength64 = [];
                                for (var M = b.messageLengthSize / 4, N = 0; N < M; ++N)
                                    b.fullMessageLength.push(0);
                                return B = g.util.createBuffer(),
                                v = {
                                    h0: 1779033703,
                                    h1: 3144134277,
                                    h2: 1013904242,
                                    h3: 2773480762,
                                    h4: 1359893119,
                                    h5: 2600822924,
                                    h6: 528734635,
                                    h7: 1541459225
                                },
                                b
                            }
                        };
                        return b.start(),
                        b.update = function(w, M) {
                            M === "utf8" && (w = g.util.encodeUtf8(w));
                            var N = w.length;
                            b.messageLength += N,
                            N = [N / 4294967296 >>> 0, N >>> 0];
                            for (var O = b.fullMessageLength.length - 1; O >= 0; --O)
                                b.fullMessageLength[O] += N[1],
                                N[1] = N[0] + (b.fullMessageLength[O] / 4294967296 >>> 0),
                                b.fullMessageLength[O] = b.fullMessageLength[O] >>> 0,
                                N[0] = N[1] / 4294967296 >>> 0;
                            return B.putBytes(w),
                            e(v, p, B),
                            (B.read > 2048 || B.length() === 0) && B.compact(),
                            b
                        }
                        ,
                        b.digest = function() {
                            var w = g.util.createBuffer();
                            w.putBytes(B.bytes());
                            var M, N = b.fullMessageLength[b.fullMessageLength.length - 1] + b.messageLengthSize & b.blockLength - 1;
                            w.putBytes(a.substr(0, b.blockLength - N));
                            for (var O = 8 * b.fullMessageLength[0], x = 0; x < b.fullMessageLength.length - 1; ++x)
                                O += (M = 8 * b.fullMessageLength[x + 1]) / 4294967296 >>> 0,
                                w.putInt32(O >>> 0),
                                O = M >>> 0;
                            w.putInt32(O);
                            var o = {
                                h0: v.h0,
                                h1: v.h1,
                                h2: v.h2,
                                h3: v.h3,
                                h4: v.h4,
                                h5: v.h5,
                                h6: v.h6,
                                h7: v.h7
                            };
                            e(o, p, w);
                            var S = g.util.createBuffer();
                            return S.putInt32(o.h0),
                            S.putInt32(o.h1),
                            S.putInt32(o.h2),
                            S.putInt32(o.h3),
                            S.putInt32(o.h4),
                            S.putInt32(o.h5),
                            S.putInt32(o.h6),
                            S.putInt32(o.h7),
                            S
                        }
                        ,
                        b
                    }
                    ;
                    var a = null
                      , y = !1
                      , U = null;
                    function e(v, B, p) {
                        for (var b, w, M, N, O, x, o, S, L, V, F, j, z, E = p.length(); E >= 64; ) {
                            for (O = 0; O < 16; ++O)
                                B[O] = p.getInt32();
                            for (; O < 64; ++O)
                                b = ((b = B[O - 2]) >>> 17 | b << 15) ^ (b >>> 19 | b << 13) ^ b >>> 10,
                                w = ((w = B[O - 15]) >>> 7 | w << 25) ^ (w >>> 18 | w << 14) ^ w >>> 3,
                                B[O] = b + B[O - 7] + w + B[O - 16] | 0;
                            for (x = v.h0,
                            o = v.h1,
                            S = v.h2,
                            L = v.h3,
                            V = v.h4,
                            F = v.h5,
                            j = v.h6,
                            z = v.h7,
                            O = 0; O < 64; ++O)
                                M = (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10),
                                N = x & o | S & (x ^ o),
                                b = z + ((V >>> 6 | V << 26) ^ (V >>> 11 | V << 21) ^ (V >>> 25 | V << 7)) + (j ^ V & (F ^ j)) + U[O] + B[O],
                                z = j,
                                j = F,
                                F = V,
                                V = L + b >>> 0,
                                L = S,
                                S = o,
                                o = x,
                                x = b + (w = M + N) >>> 0;
                            v.h0 = v.h0 + x | 0,
                            v.h1 = v.h1 + o | 0,
                            v.h2 = v.h2 + S | 0,
                            v.h3 = v.h3 + L | 0,
                            v.h4 = v.h4 + V | 0,
                            v.h5 = v.h5 + F | 0,
                            v.h6 = v.h6 + j | 0,
                            v.h7 = v.h7 + z | 0,
                            E -= 64
                        }
                    }
                },
                690: function(_, D, k) {
                    var g = k(654);
                    k(419),
                    k(527);
                    var i = _.exports = g.sha512 = g.sha512 || {};
                    g.md.sha512 = g.md.algorithms.sha512 = i;
                    var a = g.sha384 = g.sha512.sha384 = g.sha512.sha384 || {};
                    a.create = function() {
                        return i.create("SHA-384")
                    }
                    ,
                    g.md.sha384 = g.md.algorithms.sha384 = a,
                    g.sha512.sha256 = g.sha512.sha256 || {
                        create: function() {
                            return i.create("SHA-512/256")
                        }
                    },
                    g.md["sha512/256"] = g.md.algorithms["sha512/256"] = g.sha512.sha256,
                    g.sha512.sha224 = g.sha512.sha224 || {
                        create: function() {
                            return i.create("SHA-512/224")
                        }
                    },
                    g.md["sha512/224"] = g.md.algorithms["sha512/224"] = g.sha512.sha224,
                    i.create = function(p) {
                        if (U || (y = String.fromCharCode(128),
                        y += g.util.fillString(String.fromCharCode(0), 128),
                        e = [[1116352408, 3609767458], [1899447441, 602891725], [3049323471, 3964484399], [3921009573, 2173295548], [961987163, 4081628472], [1508970993, 3053834265], [2453635748, 2937671579], [2870763221, 3664609560], [3624381080, 2734883394], [310598401, 1164996542], [607225278, 1323610764], [1426881987, 3590304994], [1925078388, 4068182383], [2162078206, 991336113], [2614888103, 633803317], [3248222580, 3479774868], [3835390401, 2666613458], [4022224774, 944711139], [264347078, 2341262773], [604807628, 2007800933], [770255983, 1495990901], [1249150122, 1856431235], [1555081692, 3175218132], [1996064986, 2198950837], [2554220882, 3999719339], [2821834349, 766784016], [2952996808, 2566594879], [3210313671, 3203337956], [3336571891, 1034457026], [3584528711, 2466948901], [113926993, 3758326383], [338241895, 168717936], [666307205, 1188179964], [773529912, 1546045734], [1294757372, 1522805485], [1396182291, 2643833823], [1695183700, 2343527390], [1986661051, 1014477480], [2177026350, 1206759142], [2456956037, 344077627], [2730485921, 1290863460], [2820302411, 3158454273], [3259730800, 3505952657], [3345764771, 106217008], [3516065817, 3606008344], [3600352804, 1432725776], [4094571909, 1467031594], [275423344, 851169720], [430227734, 3100823752], [506948616, 1363258195], [659060556, 3750685593], [883997877, 3785050280], [958139571, 3318307427], [1322822218, 3812723403], [1537002063, 2003034995], [1747873779, 3602036899], [1955562222, 1575990012], [2024104815, 1125592928], [2227730452, 2716904306], [2361852424, 442776044], [2428436474, 593698344], [2756734187, 3733110249], [3204031479, 2999351573], [3329325298, 3815920427], [3391569614, 3928383900], [3515267271, 566280711], [3940187606, 3454069534], [4118630271, 4000239992], [116418474, 1914138554], [174292421, 2731055270], [289380356, 3203993006], [460393269, 320620315], [685471733, 587496836], [852142971, 1086792851], [1017036298, 365543100], [1126000580, 2618297676], [1288033470, 3409855158], [1501505948, 4234509866], [1607167915, 987167468], [1816402316, 1246189591]],
                        (v = {})["SHA-512"] = [[1779033703, 4089235720], [3144134277, 2227873595], [1013904242, 4271175723], [2773480762, 1595750129], [1359893119, 2917565137], [2600822924, 725511199], [528734635, 4215389547], [1541459225, 327033209]],
                        v["SHA-384"] = [[3418070365, 3238371032], [1654270250, 914150663], [2438529370, 812702999], [355462360, 4144912697], [1731405415, 4290775857], [2394180231, 1750603025], [3675008525, 1694076839], [1203062813, 3204075428]],
                        v["SHA-512/256"] = [[573645204, 4230739756], [2673172387, 3360449730], [596883563, 1867755857], [2520282905, 1497426621], [2519219938, 2827943907], [3193839141, 1401305490], [721525244, 746961066], [246885852, 2177182882]],
                        v["SHA-512/224"] = [[2352822216, 424955298], [1944164710, 2312950998], [502970286, 855612546], [1738396948, 1479516111], [258812777, 2077511080], [2011393907, 79989058], [1067287976, 1780299464], [286451373, 2446758561]],
                        U = !0),
                        p === void 0 && (p = "SHA-512"),
                        !(p in v))
                            throw new Error("Invalid SHA-512 algorithm: " + p);
                        for (var b = v[p], w = null, M = g.util.createBuffer(), N = new Array(80), O = 0; O < 80; ++O)
                            N[O] = new Array(2);
                        var x = 64;
                        switch (p) {
                        case "SHA-384":
                            x = 48;
                            break;
                        case "SHA-512/256":
                            x = 32;
                            break;
                        case "SHA-512/224":
                            x = 28
                        }
                        var o = {
                            algorithm: p.replace("-", "").toLowerCase(),
                            blockLength: 128,
                            digestLength: x,
                            messageLength: 0,
                            fullMessageLength: null,
                            messageLengthSize: 16,
                            start: function() {
                                o.messageLength = 0,
                                o.fullMessageLength = o.messageLength128 = [];
                                for (var L = o.messageLengthSize / 4, V = 0; V < L; ++V)
                                    o.fullMessageLength.push(0);
                                for (M = g.util.createBuffer(),
                                w = new Array(b.length),
                                V = 0; V < b.length; ++V)
                                    w[V] = b[V].slice(0);
                                return o
                            }
                        };
                        return o.start(),
                        o.update = function(S, L) {
                            L === "utf8" && (S = g.util.encodeUtf8(S));
                            var V = S.length;
                            o.messageLength += V,
                            V = [V / 4294967296 >>> 0, V >>> 0];
                            for (var F = o.fullMessageLength.length - 1; F >= 0; --F)
                                o.fullMessageLength[F] += V[1],
                                V[1] = V[0] + (o.fullMessageLength[F] / 4294967296 >>> 0),
                                o.fullMessageLength[F] = o.fullMessageLength[F] >>> 0,
                                V[0] = V[1] / 4294967296 >>> 0;
                            return M.putBytes(S),
                            B(w, N, M),
                            (M.read > 2048 || M.length() === 0) && M.compact(),
                            o
                        }
                        ,
                        o.digest = function() {
                            var S = g.util.createBuffer();
                            S.putBytes(M.bytes());
                            var L, V = o.fullMessageLength[o.fullMessageLength.length - 1] + o.messageLengthSize & o.blockLength - 1;
                            S.putBytes(y.substr(0, o.blockLength - V));
                            for (var F = 8 * o.fullMessageLength[0], j = 0; j < o.fullMessageLength.length - 1; ++j)
                                F += (L = 8 * o.fullMessageLength[j + 1]) / 4294967296 >>> 0,
                                S.putInt32(F >>> 0),
                                F = L >>> 0;
                            S.putInt32(F);
                            var z = new Array(w.length);
                            for (j = 0; j < w.length; ++j)
                                z[j] = w[j].slice(0);
                            B(z, N, S);
                            var E, l = g.util.createBuffer();
                            for (E = p === "SHA-512" ? z.length : p === "SHA-384" ? z.length - 2 : z.length - 4,
                            j = 0; j < E; ++j)
                                l.putInt32(z[j][0]),
                                j === E - 1 && p === "SHA-512/224" || l.putInt32(z[j][1]);
                            return l
                        }
                        ,
                        o
                    }
                    ;
                    var y = null
                      , U = !1
                      , e = null
                      , v = null;
                    function B(p, b, w) {
                        for (var M, N, O, x, o, S, L, V, F, j, z, E, l, I, n, c, h, C, R, P, G, H, X, Z, W, $, te, ee, J, ne, se, ve, Ae, mt = w.length(); mt >= 128; ) {
                            for (te = 0; te < 16; ++te)
                                b[te][0] = w.getInt32() >>> 0,
                                b[te][1] = w.getInt32() >>> 0;
                            for (; te < 80; ++te)
                                M = (((ee = (ne = b[te - 2])[0]) >>> 19 | (J = ne[1]) << 13) ^ (J >>> 29 | ee << 3) ^ ee >>> 6) >>> 0,
                                N = ((ee << 13 | J >>> 19) ^ (J << 3 | ee >>> 29) ^ (ee << 26 | J >>> 6)) >>> 0,
                                O = (((ee = (ve = b[te - 15])[0]) >>> 1 | (J = ve[1]) << 31) ^ (ee >>> 8 | J << 24) ^ ee >>> 7) >>> 0,
                                x = ((ee << 31 | J >>> 1) ^ (ee << 24 | J >>> 8) ^ (ee << 25 | J >>> 7)) >>> 0,
                                se = b[te - 7],
                                Ae = b[te - 16],
                                J = N + se[1] + x + Ae[1],
                                b[te][0] = M + se[0] + O + Ae[0] + (J / 4294967296 >>> 0) >>> 0,
                                b[te][1] = J >>> 0;
                            for (z = p[0][0],
                            E = p[0][1],
                            l = p[1][0],
                            I = p[1][1],
                            n = p[2][0],
                            c = p[2][1],
                            h = p[3][0],
                            C = p[3][1],
                            R = p[4][0],
                            P = p[4][1],
                            G = p[5][0],
                            H = p[5][1],
                            X = p[6][0],
                            Z = p[6][1],
                            W = p[7][0],
                            $ = p[7][1],
                            te = 0; te < 80; ++te)
                                L = ((R >>> 14 | P << 18) ^ (R >>> 18 | P << 14) ^ (P >>> 9 | R << 23)) >>> 0,
                                V = (X ^ R & (G ^ X)) >>> 0,
                                o = ((z >>> 28 | E << 4) ^ (E >>> 2 | z << 30) ^ (E >>> 7 | z << 25)) >>> 0,
                                S = ((z << 4 | E >>> 28) ^ (E << 30 | z >>> 2) ^ (E << 25 | z >>> 7)) >>> 0,
                                F = (z & l | n & (z ^ l)) >>> 0,
                                j = (E & I | c & (E ^ I)) >>> 0,
                                J = $ + (((R << 18 | P >>> 14) ^ (R << 14 | P >>> 18) ^ (P << 23 | R >>> 9)) >>> 0) + ((Z ^ P & (H ^ Z)) >>> 0) + e[te][1] + b[te][1],
                                M = W + L + V + e[te][0] + b[te][0] + (J / 4294967296 >>> 0) >>> 0,
                                N = J >>> 0,
                                O = o + F + ((J = S + j) / 4294967296 >>> 0) >>> 0,
                                x = J >>> 0,
                                W = X,
                                $ = Z,
                                X = G,
                                Z = H,
                                G = R,
                                H = P,
                                R = h + M + ((J = C + N) / 4294967296 >>> 0) >>> 0,
                                P = J >>> 0,
                                h = n,
                                C = c,
                                n = l,
                                c = I,
                                l = z,
                                I = E,
                                z = M + O + ((J = N + x) / 4294967296 >>> 0) >>> 0,
                                E = J >>> 0;
                            J = p[0][1] + E,
                            p[0][0] = p[0][0] + z + (J / 4294967296 >>> 0) >>> 0,
                            p[0][1] = J >>> 0,
                            J = p[1][1] + I,
                            p[1][0] = p[1][0] + l + (J / 4294967296 >>> 0) >>> 0,
                            p[1][1] = J >>> 0,
                            J = p[2][1] + c,
                            p[2][0] = p[2][0] + n + (J / 4294967296 >>> 0) >>> 0,
                            p[2][1] = J >>> 0,
                            J = p[3][1] + C,
                            p[3][0] = p[3][0] + h + (J / 4294967296 >>> 0) >>> 0,
                            p[3][1] = J >>> 0,
                            J = p[4][1] + P,
                            p[4][0] = p[4][0] + R + (J / 4294967296 >>> 0) >>> 0,
                            p[4][1] = J >>> 0,
                            J = p[5][1] + H,
                            p[5][0] = p[5][0] + G + (J / 4294967296 >>> 0) >>> 0,
                            p[5][1] = J >>> 0,
                            J = p[6][1] + Z,
                            p[6][0] = p[6][0] + X + (J / 4294967296 >>> 0) >>> 0,
                            p[6][1] = J >>> 0,
                            J = p[7][1] + $,
                            p[7][0] = p[7][0] + W + (J / 4294967296 >>> 0) >>> 0,
                            p[7][1] = J >>> 0,
                            mt -= 128
                        }
                    }
                },
                527: function(_, D, k) {
                    var g = k(654)
                      , i = k(973)
                      , a = _.exports = g.util = g.util || {};
                    function y(o) {
                        if (o !== 8 && o !== 16 && o !== 24 && o !== 32)
                            throw new Error("Only 8, 16, 24, or 32 bits supported: " + o)
                    }
                    function U(o) {
                        if (this.data = "",
                        this.read = 0,
                        typeof o == "string")
                            this.data = o;
                        else if (a.isArrayBuffer(o) || a.isArrayBufferView(o))
                            if (typeof Buffer != "undefined" && o instanceof Buffer)
                                this.data = o.toString("binary");
                            else {
                                var S = new Uint8Array(o);
                                try {
                                    this.data = String.fromCharCode.apply(null, S)
                                } catch (V) {
                                    for (var L = 0; L < S.length; ++L)
                                        this.putByte(S[L])
                                }
                            }
                        else
                            (o instanceof U || le(o) == "object" && typeof o.data == "string" && typeof o.read == "number") && (this.data = o.data,
                            this.read = o.read);
                        this._constructedStringLength = 0
                    }
                    (function() {
                        if (typeof process != "undefined" && process.nextTick && !process.browser)
                            return a.nextTick = process.nextTick,
                            void (typeof setImmediate == "function" ? a.setImmediate = setImmediate : a.setImmediate = a.nextTick);
                        if (typeof setImmediate == "function")
                            return a.setImmediate = function() {
                                return setImmediate.apply(void 0, arguments)
                            }
                            ,
                            void (a.nextTick = function(z) {
                                return setImmediate(z)
                            }
                            );
                        if (a.setImmediate = function(z) {
                            setTimeout(z, 0)
                        }
                        ,
                        typeof window != "undefined" && typeof window.postMessage == "function") {
                            var o = "forge.setImmediate"
                              , S = [];
                            a.setImmediate = function(z) {
                                S.push(z),
                                S.length === 1 && window.postMessage(o, "*")
                            }
                            ,
                            window.addEventListener("message", function(z) {
                                if (z.source === window && z.data === o) {
                                    z.stopPropagation();
                                    var E = S.slice();
                                    S.length = 0,
                                    E.forEach(function(l) {
                                        l()
                                    })
                                }
                            }, !0)
                        }
                        if (typeof MutationObserver != "undefined") {
                            var L = Date.now()
                              , V = !0
                              , F = document.createElement("div");
                            S = [],
                            new MutationObserver(function() {
                                var z = S.slice();
                                S.length = 0,
                                z.forEach(function(E) {
                                    E()
                                })
                            }
                            ).observe(F, {
                                attributes: !0
                            });
                            var j = a.setImmediate;
                            a.setImmediate = function(z) {
                                Date.now() - L > 15 ? (L = Date.now(),
                                j(z)) : (S.push(z),
                                S.length === 1 && F.setAttribute("a", V = !V))
                            }
                        }
                        a.nextTick = a.setImmediate
                    }
                    )(),
                    a.isNodejs = typeof process != "undefined" && process.versions && process.versions.node,
                    a.globalScope = a.isNodejs ? k.g : typeof self == "undefined" ? window : self,
                    a.isArray = Array.isArray || function(o) {
                        return Object.prototype.toString.call(o) === "[object Array]"
                    }
                    ,
                    a.isArrayBuffer = function(o) {
                        return typeof ArrayBuffer != "undefined" && o instanceof ArrayBuffer
                    }
                    ,
                    a.isArrayBufferView = function(o) {
                        return o && a.isArrayBuffer(o.buffer) && o.byteLength !== void 0
                    }
                    ,
                    a.ByteBuffer = U,
                    a.ByteStringBuffer = U,
                    a.ByteStringBuffer.prototype._optimizeConstructedString = function(o) {
                        this._constructedStringLength += o,
                        this._constructedStringLength > 4096 && (this.data.substr(0, 1),
                        this._constructedStringLength = 0)
                    }
                    ,
                    a.ByteStringBuffer.prototype.length = function() {
                        return this.data.length - this.read
                    }
                    ,
                    a.ByteStringBuffer.prototype.isEmpty = function() {
                        return this.length() <= 0
                    }
                    ,
                    a.ByteStringBuffer.prototype.putByte = function(o) {
                        return this.putBytes(String.fromCharCode(o))
                    }
                    ,
                    a.ByteStringBuffer.prototype.fillWithByte = function(o, S) {
                        o = String.fromCharCode(o);
                        for (var L = this.data; S > 0; )
                            1 & S && (L += o),
                            (S >>>= 1) > 0 && (o += o);
                        return this.data = L,
                        this._optimizeConstructedString(S),
                        this
                    }
                    ,
                    a.ByteStringBuffer.prototype.putBytes = function(o) {
                        return this.data += o,
                        this._optimizeConstructedString(o.length),
                        this
                    }
                    ,
                    a.ByteStringBuffer.prototype.putString = function(o) {
                        return this.putBytes(a.encodeUtf8(o))
                    }
                    ,
                    a.ByteStringBuffer.prototype.putInt16 = function(o) {
                        return this.putBytes(String.fromCharCode(o >> 8 & 255) + String.fromCharCode(255 & o))
                    }
                    ,
                    a.ByteStringBuffer.prototype.putInt24 = function(o) {
                        return this.putBytes(String.fromCharCode(o >> 16 & 255) + String.fromCharCode(o >> 8 & 255) + String.fromCharCode(255 & o))
                    }
                    ,
                    a.ByteStringBuffer.prototype.putInt32 = function(o) {
                        return this.putBytes(String.fromCharCode(o >> 24 & 255) + String.fromCharCode(o >> 16 & 255) + String.fromCharCode(o >> 8 & 255) + String.fromCharCode(255 & o))
                    }
                    ,
                    a.ByteStringBuffer.prototype.putInt16Le = function(o) {
                        return this.putBytes(String.fromCharCode(255 & o) + String.fromCharCode(o >> 8 & 255))
                    }
                    ,
                    a.ByteStringBuffer.prototype.putInt24Le = function(o) {
                        return this.putBytes(String.fromCharCode(255 & o) + String.fromCharCode(o >> 8 & 255) + String.fromCharCode(o >> 16 & 255))
                    }
                    ,
                    a.ByteStringBuffer.prototype.putInt32Le = function(o) {
                        return this.putBytes(String.fromCharCode(255 & o) + String.fromCharCode(o >> 8 & 255) + String.fromCharCode(o >> 16 & 255) + String.fromCharCode(o >> 24 & 255))
                    }
                    ,
                    a.ByteStringBuffer.prototype.putInt = function(o, S) {
                        y(S);
                        var L = "";
                        do
                            S -= 8,
                            L += String.fromCharCode(o >> S & 255);
                        while (S > 0);
                        return this.putBytes(L)
                    }
                    ,
                    a.ByteStringBuffer.prototype.putSignedInt = function(o, S) {
                        return o < 0 && (o += 2 << S - 1),
                        this.putInt(o, S)
                    }
                    ,
                    a.ByteStringBuffer.prototype.putBuffer = function(o) {
                        return this.putBytes(o.getBytes())
                    }
                    ,
                    a.ByteStringBuffer.prototype.getByte = function() {
                        return this.data.charCodeAt(this.read++)
                    }
                    ,
                    a.ByteStringBuffer.prototype.getInt16 = function() {
                        var o = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
                        return this.read += 2,
                        o
                    }
                    ,
                    a.ByteStringBuffer.prototype.getInt24 = function() {
                        var o = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
                        return this.read += 3,
                        o
                    }
                    ,
                    a.ByteStringBuffer.prototype.getInt32 = function() {
                        var o = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
                        return this.read += 4,
                        o
                    }
                    ,
                    a.ByteStringBuffer.prototype.getInt16Le = function() {
                        var o = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
                        return this.read += 2,
                        o
                    }
                    ,
                    a.ByteStringBuffer.prototype.getInt24Le = function() {
                        var o = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
                        return this.read += 3,
                        o
                    }
                    ,
                    a.ByteStringBuffer.prototype.getInt32Le = function() {
                        var o = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
                        return this.read += 4,
                        o
                    }
                    ,
                    a.ByteStringBuffer.prototype.getInt = function(o) {
                        y(o);
                        var S = 0;
                        do
                            S = (S << 8) + this.data.charCodeAt(this.read++),
                            o -= 8;
                        while (o > 0);
                        return S
                    }
                    ,
                    a.ByteStringBuffer.prototype.getSignedInt = function(o) {
                        var S = this.getInt(o)
                          , L = 2 << o - 2;
                        return S >= L && (S -= L << 1),
                        S
                    }
                    ,
                    a.ByteStringBuffer.prototype.getBytes = function(o) {
                        var S;
                        return o ? (o = Math.min(this.length(), o),
                        S = this.data.slice(this.read, this.read + o),
                        this.read += o) : o === 0 ? S = "" : (S = this.read === 0 ? this.data : this.data.slice(this.read),
                        this.clear()),
                        S
                    }
                    ,
                    a.ByteStringBuffer.prototype.bytes = function(o) {
                        return o === void 0 ? this.data.slice(this.read) : this.data.slice(this.read, this.read + o)
                    }
                    ,
                    a.ByteStringBuffer.prototype.at = function(o) {
                        return this.data.charCodeAt(this.read + o)
                    }
                    ,
                    a.ByteStringBuffer.prototype.setAt = function(o, S) {
                        return this.data = this.data.substr(0, this.read + o) + String.fromCharCode(S) + this.data.substr(this.read + o + 1),
                        this
                    }
                    ,
                    a.ByteStringBuffer.prototype.last = function() {
                        return this.data.charCodeAt(this.data.length - 1)
                    }
                    ,
                    a.ByteStringBuffer.prototype.copy = function() {
                        var o = a.createBuffer(this.data);
                        return o.read = this.read,
                        o
                    }
                    ,
                    a.ByteStringBuffer.prototype.compact = function() {
                        return this.read > 0 && (this.data = this.data.slice(this.read),
                        this.read = 0),
                        this
                    }
                    ,
                    a.ByteStringBuffer.prototype.clear = function() {
                        return this.data = "",
                        this.read = 0,
                        this
                    }
                    ,
                    a.ByteStringBuffer.prototype.truncate = function(o) {
                        var S = Math.max(0, this.length() - o);
                        return this.data = this.data.substr(this.read, S),
                        this.read = 0,
                        this
                    }
                    ,
                    a.ByteStringBuffer.prototype.toHex = function() {
                        for (var o = "", S = this.read; S < this.data.length; ++S) {
                            var L = this.data.charCodeAt(S);
                            L < 16 && (o += "0"),
                            o += L.toString(16)
                        }
                        return o
                    }
                    ,
                    a.ByteStringBuffer.prototype.toString = function() {
                        return a.decodeUtf8(this.bytes())
                    }
                    ,
                    a.DataBuffer = function(o, S) {
                        S = S || {},
                        this.read = S.readOffset || 0,
                        this.growSize = S.growSize || 1024;
                        var L = a.isArrayBuffer(o)
                          , V = a.isArrayBufferView(o);
                        if (L || V)
                            return this.data = L ? new DataView(o) : new DataView(o.buffer,o.byteOffset,o.byteLength),
                            void (this.write = "writeOffset"in S ? S.writeOffset : this.data.byteLength);
                        this.data = new DataView(new ArrayBuffer(0)),
                        this.write = 0,
                        o != null && this.putBytes(o),
                        "writeOffset"in S && (this.write = S.writeOffset)
                    }
                    ,
                    a.DataBuffer.prototype.length = function() {
                        return this.write - this.read
                    }
                    ,
                    a.DataBuffer.prototype.isEmpty = function() {
                        return this.length() <= 0
                    }
                    ,
                    a.DataBuffer.prototype.accommodate = function(o, S) {
                        if (this.length() >= o)
                            return this;
                        S = Math.max(S || this.growSize, o);
                        var L = new Uint8Array(this.data.buffer,this.data.byteOffset,this.data.byteLength)
                          , V = new Uint8Array(this.length() + S);
                        return V.set(L),
                        this.data = new DataView(V.buffer),
                        this
                    }
                    ,
                    a.DataBuffer.prototype.putByte = function(o) {
                        return this.accommodate(1),
                        this.data.setUint8(this.write++, o),
                        this
                    }
                    ,
                    a.DataBuffer.prototype.fillWithByte = function(o, S) {
                        this.accommodate(S);
                        for (var L = 0; L < S; ++L)
                            this.data.setUint8(o);
                        return this
                    }
                    ,
                    a.DataBuffer.prototype.putBytes = function(o, S) {
                        if (a.isArrayBufferView(o)) {
                            var L = (V = new Uint8Array(o.buffer,o.byteOffset,o.byteLength)).byteLength - V.byteOffset;
                            return this.accommodate(L),
                            new Uint8Array(this.data.buffer,this.write).set(V),
                            this.write += L,
                            this
                        }
                        if (a.isArrayBuffer(o)) {
                            var V = new Uint8Array(o);
                            return this.accommodate(V.byteLength),
                            new Uint8Array(this.data.buffer).set(V, this.write),
                            this.write += V.byteLength,
                            this
                        }
                        if (o instanceof a.DataBuffer || le(o) == "object" && typeof o.read == "number" && typeof o.write == "number" && a.isArrayBufferView(o.data))
                            return V = new Uint8Array(o.data.byteLength,o.read,o.length()),
                            this.accommodate(V.byteLength),
                            new Uint8Array(o.data.byteLength,this.write).set(V),
                            this.write += V.byteLength,
                            this;
                        if (o instanceof a.ByteStringBuffer && (o = o.data,
                        S = "binary"),
                        S = S || "binary",
                        typeof o == "string") {
                            var F;
                            if (S === "hex")
                                return this.accommodate(Math.ceil(o.length / 2)),
                                F = new Uint8Array(this.data.buffer,this.write),
                                this.write += a.binary.hex.decode(o, F, this.write),
                                this;
                            if (S === "base64")
                                return this.accommodate(3 * Math.ceil(o.length / 4)),
                                F = new Uint8Array(this.data.buffer,this.write),
                                this.write += a.binary.base64.decode(o, F, this.write),
                                this;
                            if (S === "utf8" && (o = a.encodeUtf8(o),
                            S = "binary"),
                            S === "binary" || S === "raw")
                                return this.accommodate(o.length),
                                F = new Uint8Array(this.data.buffer,this.write),
                                this.write += a.binary.raw.decode(F),
                                this;
                            if (S === "utf16")
                                return this.accommodate(2 * o.length),
                                F = new Uint16Array(this.data.buffer,this.write),
                                this.write += a.text.utf16.encode(F),
                                this;
                            throw new Error("Invalid encoding: " + S)
                        }
                        throw Error("Invalid parameter: " + o)
                    }
                    ,
                    a.DataBuffer.prototype.putBuffer = function(o) {
                        return this.putBytes(o),
                        o.clear(),
                        this
                    }
                    ,
                    a.DataBuffer.prototype.putString = function(o) {
                        return this.putBytes(o, "utf16")
                    }
                    ,
                    a.DataBuffer.prototype.putInt16 = function(o) {
                        return this.accommodate(2),
                        this.data.setInt16(this.write, o),
                        this.write += 2,
                        this
                    }
                    ,
                    a.DataBuffer.prototype.putInt24 = function(o) {
                        return this.accommodate(3),
                        this.data.setInt16(this.write, o >> 8 & 65535),
                        this.data.setInt8(this.write, o >> 16 & 255),
                        this.write += 3,
                        this
                    }
                    ,
                    a.DataBuffer.prototype.putInt32 = function(o) {
                        return this.accommodate(4),
                        this.data.setInt32(this.write, o),
                        this.write += 4,
                        this
                    }
                    ,
                    a.DataBuffer.prototype.putInt16Le = function(o) {
                        return this.accommodate(2),
                        this.data.setInt16(this.write, o, !0),
                        this.write += 2,
                        this
                    }
                    ,
                    a.DataBuffer.prototype.putInt24Le = function(o) {
                        return this.accommodate(3),
                        this.data.setInt8(this.write, o >> 16 & 255),
                        this.data.setInt16(this.write, o >> 8 & 65535, !0),
                        this.write += 3,
                        this
                    }
                    ,
                    a.DataBuffer.prototype.putInt32Le = function(o) {
                        return this.accommodate(4),
                        this.data.setInt32(this.write, o, !0),
                        this.write += 4,
                        this
                    }
                    ,
                    a.DataBuffer.prototype.putInt = function(o, S) {
                        y(S),
                        this.accommodate(S / 8);
                        do
                            S -= 8,
                            this.data.setInt8(this.write++, o >> S & 255);
                        while (S > 0);
                        return this
                    }
                    ,
                    a.DataBuffer.prototype.putSignedInt = function(o, S) {
                        return y(S),
                        this.accommodate(S / 8),
                        o < 0 && (o += 2 << S - 1),
                        this.putInt(o, S)
                    }
                    ,
                    a.DataBuffer.prototype.getByte = function() {
                        return this.data.getInt8(this.read++)
                    }
                    ,
                    a.DataBuffer.prototype.getInt16 = function() {
                        var o = this.data.getInt16(this.read);
                        return this.read += 2,
                        o
                    }
                    ,
                    a.DataBuffer.prototype.getInt24 = function() {
                        var o = this.data.getInt16(this.read) << 8 ^ this.data.getInt8(this.read + 2);
                        return this.read += 3,
                        o
                    }
                    ,
                    a.DataBuffer.prototype.getInt32 = function() {
                        var o = this.data.getInt32(this.read);
                        return this.read += 4,
                        o
                    }
                    ,
                    a.DataBuffer.prototype.getInt16Le = function() {
                        var o = this.data.getInt16(this.read, !0);
                        return this.read += 2,
                        o
                    }
                    ,
                    a.DataBuffer.prototype.getInt24Le = function() {
                        var o = this.data.getInt8(this.read) ^ this.data.getInt16(this.read + 1, !0) << 8;
                        return this.read += 3,
                        o
                    }
                    ,
                    a.DataBuffer.prototype.getInt32Le = function() {
                        var o = this.data.getInt32(this.read, !0);
                        return this.read += 4,
                        o
                    }
                    ,
                    a.DataBuffer.prototype.getInt = function(o) {
                        y(o);
                        var S = 0;
                        do
                            S = (S << 8) + this.data.getInt8(this.read++),
                            o -= 8;
                        while (o > 0);
                        return S
                    }
                    ,
                    a.DataBuffer.prototype.getSignedInt = function(o) {
                        var S = this.getInt(o)
                          , L = 2 << o - 2;
                        return S >= L && (S -= L << 1),
                        S
                    }
                    ,
                    a.DataBuffer.prototype.getBytes = function(o) {
                        var S;
                        return o ? (o = Math.min(this.length(), o),
                        S = this.data.slice(this.read, this.read + o),
                        this.read += o) : o === 0 ? S = "" : (S = this.read === 0 ? this.data : this.data.slice(this.read),
                        this.clear()),
                        S
                    }
                    ,
                    a.DataBuffer.prototype.bytes = function(o) {
                        return o === void 0 ? this.data.slice(this.read) : this.data.slice(this.read, this.read + o)
                    }
                    ,
                    a.DataBuffer.prototype.at = function(o) {
                        return this.data.getUint8(this.read + o)
                    }
                    ,
                    a.DataBuffer.prototype.setAt = function(o, S) {
                        return this.data.setUint8(o, S),
                        this
                    }
                    ,
                    a.DataBuffer.prototype.last = function() {
                        return this.data.getUint8(this.write - 1)
                    }
                    ,
                    a.DataBuffer.prototype.copy = function() {
                        return new a.DataBuffer(this)
                    }
                    ,
                    a.DataBuffer.prototype.compact = function() {
                        if (this.read > 0) {
                            var o = new Uint8Array(this.data.buffer,this.read)
                              , S = new Uint8Array(o.byteLength);
                            S.set(o),
                            this.data = new DataView(S),
                            this.write -= this.read,
                            this.read = 0
                        }
                        return this
                    }
                    ,
                    a.DataBuffer.prototype.clear = function() {
                        return this.data = new DataView(new ArrayBuffer(0)),
                        this.read = this.write = 0,
                        this
                    }
                    ,
                    a.DataBuffer.prototype.truncate = function(o) {
                        return this.write = Math.max(0, this.length() - o),
                        this.read = Math.min(this.read, this.write),
                        this
                    }
                    ,
                    a.DataBuffer.prototype.toHex = function() {
                        for (var o = "", S = this.read; S < this.data.byteLength; ++S) {
                            var L = this.data.getUint8(S);
                            L < 16 && (o += "0"),
                            o += L.toString(16)
                        }
                        return o
                    }
                    ,
                    a.DataBuffer.prototype.toString = function(o) {
                        var S = new Uint8Array(this.data,this.read,this.length());
                        if ((o = o || "utf8") === "binary" || o === "raw")
                            return a.binary.raw.encode(S);
                        if (o === "hex")
                            return a.binary.hex.encode(S);
                        if (o === "base64")
                            return a.binary.base64.encode(S);
                        if (o === "utf8")
                            return a.text.utf8.decode(S);
                        if (o === "utf16")
                            return a.text.utf16.decode(S);
                        throw new Error("Invalid encoding: " + o)
                    }
                    ,
                    a.createBuffer = function(o, S) {
                        return S = S || "raw",
                        o !== void 0 && S === "utf8" && (o = a.encodeUtf8(o)),
                        new a.ByteBuffer(o)
                    }
                    ,
                    a.fillString = function(o, S) {
                        for (var L = ""; S > 0; )
                            1 & S && (L += o),
                            (S >>>= 1) > 0 && (o += o);
                        return L
                    }
                    ,
                    a.xorBytes = function(o, S, L) {
                        for (var V = "", F = "", j = "", z = 0, E = 0; L > 0; --L,
                        ++z)
                            F = o.charCodeAt(z) ^ S.charCodeAt(z),
                            E >= 10 && (V += j,
                            j = "",
                            E = 0),
                            j += String.fromCharCode(F),
                            ++E;
                        return V + j
                    }
                    ,
                    a.hexToBytes = function(o) {
                        var S = ""
                          , L = 0;
                        for (!0 & o.length && (L = 1,
                        S += String.fromCharCode(parseInt(o[0], 16))); L < o.length; L += 2)
                            S += String.fromCharCode(parseInt(o.substr(L, 2), 16));
                        return S
                    }
                    ,
                    a.bytesToHex = function(o) {
                        return a.createBuffer(o).toHex()
                    }
                    ,
                    a.int32ToBytes = function(o) {
                        return String.fromCharCode(o >> 24 & 255) + String.fromCharCode(o >> 16 & 255) + String.fromCharCode(o >> 8 & 255) + String.fromCharCode(255 & o)
                    }
                    ;
                    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
                      , v = [62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]
                      , B = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
                    a.encode64 = function(o, S) {
                        for (var L, V, F, j = "", z = "", E = 0; E < o.length; )
                            L = o.charCodeAt(E++),
                            V = o.charCodeAt(E++),
                            F = o.charCodeAt(E++),
                            j += e.charAt(L >> 2),
                            j += e.charAt((3 & L) << 4 | V >> 4),
                            isNaN(V) ? j += "==" : (j += e.charAt((15 & V) << 2 | F >> 6),
                            j += isNaN(F) ? "=" : e.charAt(63 & F)),
                            S && j.length > S && (z += j.substr(0, S) + "\r\n",
                            j = j.substr(S));
                        return z + j
                    }
                    ,
                    a.decode64 = function(o) {
                        o = o.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                        for (var S, L, V, F, j = "", z = 0; z < o.length; )
                            S = v[o.charCodeAt(z++) - 43],
                            L = v[o.charCodeAt(z++) - 43],
                            V = v[o.charCodeAt(z++) - 43],
                            F = v[o.charCodeAt(z++) - 43],
                            j += String.fromCharCode(S << 2 | L >> 4),
                            V !== 64 && (j += String.fromCharCode((15 & L) << 4 | V >> 2),
                            F !== 64 && (j += String.fromCharCode((3 & V) << 6 | F)));
                        return j
                    }
                    ,
                    a.encodeUtf8 = function(o) {
                        return unescape(encodeURIComponent(o))
                    }
                    ,
                    a.decodeUtf8 = function(o) {
                        return decodeURIComponent(escape(o))
                    }
                    ,
                    a.binary = {
                        raw: {},
                        hex: {},
                        base64: {},
                        base58: {},
                        baseN: {
                            encode: i.encode,
                            decode: i.decode
                        }
                    },
                    a.binary.raw.encode = function(o) {
                        return String.fromCharCode.apply(null, o)
                    }
                    ,
                    a.binary.raw.decode = function(o, S, L) {
                        var V = S;
                        V || (V = new Uint8Array(o.length));
                        for (var F = L = L || 0, j = 0; j < o.length; ++j)
                            V[F++] = o.charCodeAt(j);
                        return S ? F - L : V
                    }
                    ,
                    a.binary.hex.encode = a.bytesToHex,
                    a.binary.hex.decode = function(o, S, L) {
                        var V = S;
                        V || (V = new Uint8Array(Math.ceil(o.length / 2)));
                        var F = 0
                          , j = L = L || 0;
                        for (1 & o.length && (F = 1,
                        V[j++] = parseInt(o[0], 16)); F < o.length; F += 2)
                            V[j++] = parseInt(o.substr(F, 2), 16);
                        return S ? j - L : V
                    }
                    ,
                    a.binary.base64.encode = function(o, S) {
                        for (var L, V, F, j = "", z = "", E = 0; E < o.byteLength; )
                            L = o[E++],
                            V = o[E++],
                            F = o[E++],
                            j += e.charAt(L >> 2),
                            j += e.charAt((3 & L) << 4 | V >> 4),
                            isNaN(V) ? j += "==" : (j += e.charAt((15 & V) << 2 | F >> 6),
                            j += isNaN(F) ? "=" : e.charAt(63 & F)),
                            S && j.length > S && (z += j.substr(0, S) + "\r\n",
                            j = j.substr(S));
                        return z + j
                    }
                    ,
                    a.binary.base64.decode = function(o, S, L) {
                        var V, F, j, z, E = S;
                        E || (E = new Uint8Array(3 * Math.ceil(o.length / 4))),
                        o = o.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                        for (var l = 0, I = L = L || 0; l < o.length; )
                            V = v[o.charCodeAt(l++) - 43],
                            F = v[o.charCodeAt(l++) - 43],
                            j = v[o.charCodeAt(l++) - 43],
                            z = v[o.charCodeAt(l++) - 43],
                            E[I++] = V << 2 | F >> 4,
                            j !== 64 && (E[I++] = (15 & F) << 4 | j >> 2,
                            z !== 64 && (E[I++] = (3 & j) << 6 | z));
                        return S ? I - L : E.subarray(0, I)
                    }
                    ,
                    a.binary.base58.encode = function(o, S) {
                        return a.binary.baseN.encode(o, B, S)
                    }
                    ,
                    a.binary.base58.decode = function(o, S) {
                        return a.binary.baseN.decode(o, B, S)
                    }
                    ,
                    a.text = {
                        utf8: {},
                        utf16: {}
                    },
                    a.text.utf8.encode = function(o, S, L) {
                        o = a.encodeUtf8(o);
                        var V = S;
                        V || (V = new Uint8Array(o.length));
                        for (var F = L = L || 0, j = 0; j < o.length; ++j)
                            V[F++] = o.charCodeAt(j);
                        return S ? F - L : V
                    }
                    ,
                    a.text.utf8.decode = function(o) {
                        return a.decodeUtf8(String.fromCharCode.apply(null, o))
                    }
                    ,
                    a.text.utf16.encode = function(o, S, L) {
                        var V = S;
                        V || (V = new Uint8Array(2 * o.length));
                        for (var F = new Uint16Array(V.buffer), j = L = L || 0, z = L, E = 0; E < o.length; ++E)
                            F[z++] = o.charCodeAt(E),
                            j += 2;
                        return S ? j - L : V
                    }
                    ,
                    a.text.utf16.decode = function(o) {
                        return String.fromCharCode.apply(null, new Uint16Array(o.buffer))
                    }
                    ,
                    a.deflate = function(o, S, L) {
                        if (S = a.decode64(o.deflate(a.encode64(S)).rval),
                        L) {
                            var V = 2;
                            32 & S.charCodeAt(1) && (V = 6),
                            S = S.substring(V, S.length - 4)
                        }
                        return S
                    }
                    ,
                    a.inflate = function(o, S, L) {
                        var V = o.inflate(a.encode64(S)).rval;
                        return V === null ? null : a.decode64(V)
                    }
                    ;
                    var p = function(S, L, V) {
                        if (!S)
                            throw new Error("WebStorage not available.");
                        var F;
                        if (V === null ? F = S.removeItem(L) : (V = a.encode64(JSON.stringify(V)),
                        F = S.setItem(L, V)),
                        F !== void 0 && F.rval !== !0) {
                            var j = new Error(F.error.message);
                            throw j.id = F.error.id,
                            j.name = F.error.name,
                            j
                        }
                    }
                      , b = function(S, L) {
                        if (!S)
                            throw new Error("WebStorage not available.");
                        var V = S.getItem(L);
                        if (S.init)
                            if (V.rval === null) {
                                if (V.error) {
                                    var F = new Error(V.error.message);
                                    throw F.id = V.error.id,
                                    F.name = V.error.name,
                                    F
                                }
                                V = null
                            } else
                                V = V.rval;
                        return V !== null && (V = JSON.parse(a.decode64(V))),
                        V
                    }
                      , w = function(S, L, V, F) {
                        var j = b(S, L);
                        j === null && (j = {}),
                        j[V] = F,
                        p(S, L, j)
                    }
                      , M = function(S, L, V) {
                        var F = b(S, L);
                        return F !== null && (F = V in F ? F[V] : null),
                        F
                    }
                      , N = function(S, L, V) {
                        var F = b(S, L);
                        if (F !== null && V in F) {
                            delete F[V];
                            var j = !0;
                            for (var z in F) {
                                j = !1;
                                break
                            }
                            j && (F = null),
                            p(S, L, F)
                        }
                    }
                      , O = function(S, L) {
                        p(S, L, null)
                    }
                      , x = function(S, L, V) {
                        var F, j = null;
                        V === void 0 && (V = ["web", "flash"]);
                        var z = !1
                          , E = null;
                        for (var l in V) {
                            F = V[l];
                            try {
                                if (F === "flash" || F === "both") {
                                    if (L[0] === null)
                                        throw new Error("Flash local storage not available.");
                                    j = S.apply(this, L),
                                    z = F === "flash"
                                }
                                F !== "web" && F !== "both" || (L[0] = localStorage,
                                j = S.apply(this, L),
                                z = !0)
                            } catch (I) {
                                E = I
                            }
                            if (z)
                                break
                        }
                        if (!z)
                            throw E;
                        return j
                    };
                    a.setItem = function(o, S, L, V, F) {
                        x(w, arguments, F)
                    }
                    ,
                    a.getItem = function(o, S, L, V) {
                        return x(M, arguments, V)
                    }
                    ,
                    a.removeItem = function(o, S, L, V) {
                        x(N, arguments, V)
                    }
                    ,
                    a.clearItems = function(o, S, L) {
                        x(O, arguments, L)
                    }
                    ,
                    a.isEmpty = function(o) {
                        for (var S in o)
                            if (o.hasOwnProperty(S))
                                return !1;
                        return !0
                    }
                    ,
                    a.format = function(o) {
                        for (var S, L, V = /%./g, F = 0, j = [], z = 0; S = V.exec(o); ) {
                            (L = o.substring(z, V.lastIndex - 2)).length > 0 && j.push(L),
                            z = V.lastIndex;
                            var E = S[0][1];
                            switch (E) {
                            case "s":
                            case "o":
                                F < arguments.length ? j.push(arguments[1 + F++]) : j.push("<?>");
                                break;
                            case "%":
                                j.push("%");
                                break;
                            default:
                                j.push("<%" + E + "?>")
                            }
                        }
                        return j.push(o.substring(z)),
                        j.join("")
                    }
                    ,
                    a.formatNumber = function(o, S, L, V) {
                        var F = o
                          , j = isNaN(S = Math.abs(S)) ? 2 : S
                          , z = L === void 0 ? "," : L
                          , E = V === void 0 ? "." : V
                          , l = F < 0 ? "-" : ""
                          , I = parseInt(F = Math.abs(+F || 0).toFixed(j), 10) + ""
                          , n = I.length > 3 ? I.length % 3 : 0;
                        return l + (n ? I.substr(0, n) + E : "") + I.substr(n).replace(/(\d{3})(?=\d)/g, "$1" + E) + (j ? z + Math.abs(F - I).toFixed(j).slice(2) : "")
                    }
                    ,
                    a.formatSize = function(o) {
                        return o >= 1073741824 ? a.formatNumber(o / 1073741824, 2, ".", "") + " GiB" : o >= 1048576 ? a.formatNumber(o / 1048576, 2, ".", "") + " MiB" : o >= 1024 ? a.formatNumber(o / 1024, 0) + " KiB" : a.formatNumber(o, 0) + " bytes"
                    }
                    ,
                    a.bytesFromIP = function(o) {
                        return o.indexOf(".") !== -1 ? a.bytesFromIPv4(o) : o.indexOf(":") !== -1 ? a.bytesFromIPv6(o) : null
                    }
                    ,
                    a.bytesFromIPv4 = function(o) {
                        if ((o = o.split(".")).length !== 4)
                            return null;
                        for (var S = a.createBuffer(), L = 0; L < o.length; ++L) {
                            var V = parseInt(o[L], 10);
                            if (isNaN(V))
                                return null;
                            S.putByte(V)
                        }
                        return S.getBytes()
                    }
                    ,
                    a.bytesFromIPv6 = function(o) {
                        for (var S = 0, L = 2 * (8 - (o = o.split(":").filter(function(z) {
                            return z.length === 0 && ++S,
                            !0
                        })).length + S), V = a.createBuffer(), F = 0; F < 8; ++F)
                            if (o[F] && o[F].length !== 0) {
                                var j = a.hexToBytes(o[F]);
                                j.length < 2 && V.putByte(0),
                                V.putBytes(j)
                            } else
                                V.fillWithByte(0, L),
                                L = 0;
                        return V.getBytes()
                    }
                    ,
                    a.bytesToIP = function(o) {
                        return o.length === 4 ? a.bytesToIPv4(o) : o.length === 16 ? a.bytesToIPv6(o) : null
                    }
                    ,
                    a.bytesToIPv4 = function(o) {
                        if (o.length !== 4)
                            return null;
                        for (var S = [], L = 0; L < o.length; ++L)
                            S.push(o.charCodeAt(L));
                        return S.join(".")
                    }
                    ,
                    a.bytesToIPv6 = function(o) {
                        if (o.length !== 16)
                            return null;
                        for (var S = [], L = [], V = 0, F = 0; F < o.length; F += 2) {
                            for (var j = a.bytesToHex(o[F] + o[F + 1]); j[0] === "0" && j !== "0"; )
                                j = j.substr(1);
                            if (j === "0") {
                                var z = L[L.length - 1]
                                  , E = S.length;
                                z && E === z.end + 1 ? (z.end = E,
                                z.end - z.start > L[V].end - L[V].start && (V = L.length - 1)) : L.push({
                                    start: E,
                                    end: E
                                })
                            }
                            S.push(j)
                        }
                        if (L.length > 0) {
                            var l = L[V];
                            l.end - l.start > 0 && (S.splice(l.start, l.end - l.start + 1, ""),
                            l.start === 0 && S.unshift(""),
                            l.end === 7 && S.push(""))
                        }
                        return S.join(":")
                    }
                    ,
                    a.estimateCores = function(o, S) {
                        if (typeof o == "function" && (S = o,
                        o = {}),
                        o = o || {},
                        "cores"in a && !o.update)
                            return S(null, a.cores);
                        if (typeof navigator != "undefined" && "hardwareConcurrency"in navigator && navigator.hardwareConcurrency > 0)
                            return a.cores = navigator.hardwareConcurrency,
                            S(null, a.cores);
                        if (typeof Worker == "undefined")
                            return a.cores = 1,
                            S(null, a.cores);
                        if (typeof Blob == "undefined")
                            return a.cores = 2,
                            S(null, a.cores);
                        var L = URL.createObjectURL(new Blob(["(", function() {
                            self.addEventListener("message", function(V) {
                                for (var F = Date.now(), j = F + 4; Date.now() < j; )
                                    ;
                                self.postMessage({
                                    st: F,
                                    et: j
                                })
                            })
                        }
                        .toString(), ")()"],{
                            type: "application/javascript"
                        }));
                        (function V(F, j, z) {
                            if (j === 0) {
                                var E = Math.floor(F.reduce(function(l, I) {
                                    return l + I
                                }, 0) / F.length);
                                return a.cores = Math.max(1, E),
                                URL.revokeObjectURL(L),
                                S(null, a.cores)
                            }
                            (function(l, I) {
                                for (var n = [], c = [], h = 0; h < l; ++h) {
                                    var C = new Worker(L);
                                    C.addEventListener("message", function(R) {
                                        if (c.push(R.data),
                                        c.length === l) {
                                            for (var P = 0; P < l; ++P)
                                                n[P].terminate();
                                            I(0, c)
                                        }
                                    }),
                                    n.push(C)
                                }
                                for (h = 0; h < l; ++h)
                                    n[h].postMessage(h)
                            }
                            )(z, function(l, I) {
                                F.push(function(n, c) {
                                    for (var h = [], C = 0; C < n; ++C)
                                        for (var R = c[C], P = h[C] = [], G = 0; G < n; ++G)
                                            if (C !== G) {
                                                var H = c[G];
                                                (R.st > H.st && R.st < H.et || H.st > R.st && H.st < R.et) && P.push(G)
                                            }
                                    return h.reduce(function(X, Z) {
                                        return Math.max(X, Z.length)
                                    }, 0)
                                }(z, I)),
                                V(F, j - 1, z)
                            })
                        }
                        )([], 5, 16)
                    }
                },
                299: function(_, D, k) {
                    var g = k(654);
                    k(114),
                    k(374),
                    k(707),
                    k(419),
                    k(507),
                    k(106),
                    k(911),
                    k(723),
                    k(755),
                    k(527);
                    var i = g.asn1
                      , a = _.exports = g.pki = g.pki || {}
                      , y = a.oids
                      , U = {};
                    U.CN = y.commonName,
                    U.commonName = "CN",
                    U.C = y.countryName,
                    U.countryName = "C",
                    U.L = y.localityName,
                    U.localityName = "L",
                    U.ST = y.stateOrProvinceName,
                    U.stateOrProvinceName = "ST",
                    U.O = y.organizationName,
                    U.organizationName = "O",
                    U.OU = y.organizationalUnitName,
                    U.organizationalUnitName = "OU",
                    U.E = y.emailAddress,
                    U.emailAddress = "E";
                    var e = g.pki.rsa.publicKeyValidator
                      , v = {
                        name: "Certificate",
                        tagClass: i.Class.UNIVERSAL,
                        type: i.Type.SEQUENCE,
                        constructed: !0,
                        value: [{
                            name: "Certificate.TBSCertificate",
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.SEQUENCE,
                            constructed: !0,
                            captureAsn1: "tbsCertificate",
                            value: [{
                                name: "Certificate.TBSCertificate.version",
                                tagClass: i.Class.CONTEXT_SPECIFIC,
                                type: 0,
                                constructed: !0,
                                optional: !0,
                                value: [{
                                    name: "Certificate.TBSCertificate.version.integer",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.INTEGER,
                                    constructed: !1,
                                    capture: "certVersion"
                                }]
                            }, {
                                name: "Certificate.TBSCertificate.serialNumber",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Type.INTEGER,
                                constructed: !1,
                                capture: "certSerialNumber"
                            }, {
                                name: "Certificate.TBSCertificate.signature",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Type.SEQUENCE,
                                constructed: !0,
                                value: [{
                                    name: "Certificate.TBSCertificate.signature.algorithm",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.OID,
                                    constructed: !1,
                                    capture: "certinfoSignatureOid"
                                }, {
                                    name: "Certificate.TBSCertificate.signature.parameters",
                                    tagClass: i.Class.UNIVERSAL,
                                    optional: !0,
                                    captureAsn1: "certinfoSignatureParams"
                                }]
                            }, {
                                name: "Certificate.TBSCertificate.issuer",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Type.SEQUENCE,
                                constructed: !0,
                                captureAsn1: "certIssuer"
                            }, {
                                name: "Certificate.TBSCertificate.validity",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Type.SEQUENCE,
                                constructed: !0,
                                value: [{
                                    name: "Certificate.TBSCertificate.validity.notBefore (utc)",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.UTCTIME,
                                    constructed: !1,
                                    optional: !0,
                                    capture: "certValidity1UTCTime"
                                }, {
                                    name: "Certificate.TBSCertificate.validity.notBefore (generalized)",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.GENERALIZEDTIME,
                                    constructed: !1,
                                    optional: !0,
                                    capture: "certValidity2GeneralizedTime"
                                }, {
                                    name: "Certificate.TBSCertificate.validity.notAfter (utc)",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.UTCTIME,
                                    constructed: !1,
                                    optional: !0,
                                    capture: "certValidity3UTCTime"
                                }, {
                                    name: "Certificate.TBSCertificate.validity.notAfter (generalized)",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.GENERALIZEDTIME,
                                    constructed: !1,
                                    optional: !0,
                                    capture: "certValidity4GeneralizedTime"
                                }]
                            }, {
                                name: "Certificate.TBSCertificate.subject",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Type.SEQUENCE,
                                constructed: !0,
                                captureAsn1: "certSubject"
                            }, e, {
                                name: "Certificate.TBSCertificate.issuerUniqueID",
                                tagClass: i.Class.CONTEXT_SPECIFIC,
                                type: 1,
                                constructed: !0,
                                optional: !0,
                                value: [{
                                    name: "Certificate.TBSCertificate.issuerUniqueID.id",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.BITSTRING,
                                    constructed: !1,
                                    captureBitStringValue: "certIssuerUniqueId"
                                }]
                            }, {
                                name: "Certificate.TBSCertificate.subjectUniqueID",
                                tagClass: i.Class.CONTEXT_SPECIFIC,
                                type: 2,
                                constructed: !0,
                                optional: !0,
                                value: [{
                                    name: "Certificate.TBSCertificate.subjectUniqueID.id",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.BITSTRING,
                                    constructed: !1,
                                    captureBitStringValue: "certSubjectUniqueId"
                                }]
                            }, {
                                name: "Certificate.TBSCertificate.extensions",
                                tagClass: i.Class.CONTEXT_SPECIFIC,
                                type: 3,
                                constructed: !0,
                                captureAsn1: "certExtensions",
                                optional: !0
                            }]
                        }, {
                            name: "Certificate.signatureAlgorithm",
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.SEQUENCE,
                            constructed: !0,
                            value: [{
                                name: "Certificate.signatureAlgorithm.algorithm",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Type.OID,
                                constructed: !1,
                                capture: "certSignatureOid"
                            }, {
                                name: "Certificate.TBSCertificate.signature.parameters",
                                tagClass: i.Class.UNIVERSAL,
                                optional: !0,
                                captureAsn1: "certSignatureParams"
                            }]
                        }, {
                            name: "Certificate.signatureValue",
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.BITSTRING,
                            constructed: !1,
                            captureBitStringValue: "certSignature"
                        }]
                    }
                      , B = {
                        name: "rsapss",
                        tagClass: i.Class.UNIVERSAL,
                        type: i.Type.SEQUENCE,
                        constructed: !0,
                        value: [{
                            name: "rsapss.hashAlgorithm",
                            tagClass: i.Class.CONTEXT_SPECIFIC,
                            type: 0,
                            constructed: !0,
                            value: [{
                                name: "rsapss.hashAlgorithm.AlgorithmIdentifier",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Class.SEQUENCE,
                                constructed: !0,
                                optional: !0,
                                value: [{
                                    name: "rsapss.hashAlgorithm.AlgorithmIdentifier.algorithm",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.OID,
                                    constructed: !1,
                                    capture: "hashOid"
                                }]
                            }]
                        }, {
                            name: "rsapss.maskGenAlgorithm",
                            tagClass: i.Class.CONTEXT_SPECIFIC,
                            type: 1,
                            constructed: !0,
                            value: [{
                                name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Class.SEQUENCE,
                                constructed: !0,
                                optional: !0,
                                value: [{
                                    name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.algorithm",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.OID,
                                    constructed: !1,
                                    capture: "maskGenOid"
                                }, {
                                    name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.SEQUENCE,
                                    constructed: !0,
                                    value: [{
                                        name: "rsapss.maskGenAlgorithm.AlgorithmIdentifier.params.algorithm",
                                        tagClass: i.Class.UNIVERSAL,
                                        type: i.Type.OID,
                                        constructed: !1,
                                        capture: "maskGenHashOid"
                                    }]
                                }]
                            }]
                        }, {
                            name: "rsapss.saltLength",
                            tagClass: i.Class.CONTEXT_SPECIFIC,
                            type: 2,
                            optional: !0,
                            value: [{
                                name: "rsapss.saltLength.saltLength",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Class.INTEGER,
                                constructed: !1,
                                capture: "saltLength"
                            }]
                        }, {
                            name: "rsapss.trailerField",
                            tagClass: i.Class.CONTEXT_SPECIFIC,
                            type: 3,
                            optional: !0,
                            value: [{
                                name: "rsapss.trailer.trailer",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Class.INTEGER,
                                constructed: !1,
                                capture: "trailer"
                            }]
                        }]
                    }
                      , p = {
                        name: "CertificationRequestInfo",
                        tagClass: i.Class.UNIVERSAL,
                        type: i.Type.SEQUENCE,
                        constructed: !0,
                        captureAsn1: "certificationRequestInfo",
                        value: [{
                            name: "CertificationRequestInfo.integer",
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.INTEGER,
                            constructed: !1,
                            capture: "certificationRequestInfoVersion"
                        }, {
                            name: "CertificationRequestInfo.subject",
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.SEQUENCE,
                            constructed: !0,
                            captureAsn1: "certificationRequestInfoSubject"
                        }, e, {
                            name: "CertificationRequestInfo.attributes",
                            tagClass: i.Class.CONTEXT_SPECIFIC,
                            type: 0,
                            constructed: !0,
                            optional: !0,
                            capture: "certificationRequestInfoAttributes",
                            value: [{
                                name: "CertificationRequestInfo.attributes",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Type.SEQUENCE,
                                constructed: !0,
                                value: [{
                                    name: "CertificationRequestInfo.attributes.type",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.OID,
                                    constructed: !1
                                }, {
                                    name: "CertificationRequestInfo.attributes.value",
                                    tagClass: i.Class.UNIVERSAL,
                                    type: i.Type.SET,
                                    constructed: !0
                                }]
                            }]
                        }]
                    }
                      , b = {
                        name: "CertificationRequest",
                        tagClass: i.Class.UNIVERSAL,
                        type: i.Type.SEQUENCE,
                        constructed: !0,
                        captureAsn1: "csr",
                        value: [p, {
                            name: "CertificationRequest.signatureAlgorithm",
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.SEQUENCE,
                            constructed: !0,
                            value: [{
                                name: "CertificationRequest.signatureAlgorithm.algorithm",
                                tagClass: i.Class.UNIVERSAL,
                                type: i.Type.OID,
                                constructed: !1,
                                capture: "csrSignatureOid"
                            }, {
                                name: "CertificationRequest.signatureAlgorithm.parameters",
                                tagClass: i.Class.UNIVERSAL,
                                optional: !0,
                                captureAsn1: "csrSignatureParams"
                            }]
                        }, {
                            name: "CertificationRequest.signature",
                            tagClass: i.Class.UNIVERSAL,
                            type: i.Type.BITSTRING,
                            constructed: !1,
                            captureBitStringValue: "csrSignature"
                        }]
                    };
                    function w(E, l) {
                        typeof l == "string" && (l = {
                            shortName: l
                        });
                        for (var I, n = null, c = 0; n === null && c < E.attributes.length; ++c)
                            I = E.attributes[c],
                            (l.type && l.type === I.type || l.name && l.name === I.name || l.shortName && l.shortName === I.shortName) && (n = I);
                        return n
                    }
                    a.RDNAttributesAsArray = function(E, l) {
                        for (var I, n, c, h = [], C = 0; C < E.value.length; ++C) {
                            I = E.value[C];
                            for (var R = 0; R < I.value.length; ++R)
                                c = {},
                                n = I.value[R],
                                c.type = i.derToOid(n.value[0].value),
                                c.value = n.value[1].value,
                                c.valueTagClass = n.value[1].type,
                                c.type in y && (c.name = y[c.type],
                                c.name in U && (c.shortName = U[c.name])),
                                l && (l.update(c.type),
                                l.update(c.value)),
                                h.push(c)
                        }
                        return h
                    }
                    ,
                    a.CRIAttributesAsArray = function(E) {
                        for (var l = [], I = 0; I < E.length; ++I)
                            for (var n = E[I], c = i.derToOid(n.value[0].value), h = n.value[1].value, C = 0; C < h.length; ++C) {
                                var R = {};
                                if (R.type = c,
                                R.value = h[C].value,
                                R.valueTagClass = h[C].type,
                                R.type in y && (R.name = y[R.type],
                                R.name in U && (R.shortName = U[R.name])),
                                R.type === y.extensionRequest) {
                                    R.extensions = [];
                                    for (var P = 0; P < R.value.length; ++P)
                                        R.extensions.push(a.certificateExtensionFromAsn1(R.value[P]))
                                }
                                l.push(R)
                            }
                        return l
                    }
                    ;
                    var M = function(l, I, n) {
                        var c = {};
                        if (l !== y["RSASSA-PSS"])
                            return c;
                        n && (c = {
                            hash: {
                                algorithmOid: y.sha1
                            },
                            mgf: {
                                algorithmOid: y.mgf1,
                                hash: {
                                    algorithmOid: y.sha1
                                }
                            },
                            saltLength: 20
                        });
                        var h = {}
                          , C = [];
                        if (!i.validate(I, B, h, C)) {
                            var R = new Error("Cannot read RSASSA-PSS parameter block.");
                            throw R.errors = C,
                            R
                        }
                        return h.hashOid !== void 0 && (c.hash = c.hash || {},
                        c.hash.algorithmOid = i.derToOid(h.hashOid)),
                        h.maskGenOid !== void 0 && (c.mgf = c.mgf || {},
                        c.mgf.algorithmOid = i.derToOid(h.maskGenOid),
                        c.mgf.hash = c.mgf.hash || {},
                        c.mgf.hash.algorithmOid = i.derToOid(h.maskGenHashOid)),
                        h.saltLength !== void 0 && (c.saltLength = h.saltLength.charCodeAt(0)),
                        c
                    }
                      , N = function(l) {
                        switch (y[l.signatureOid]) {
                        case "sha1WithRSAEncryption":
                        case "sha1WithRSASignature":
                            return g.md.sha1.create();
                        case "md5WithRSAEncryption":
                            return g.md.md5.create();
                        case "sha256WithRSAEncryption":
                            return g.md.sha256.create();
                        case "sha384WithRSAEncryption":
                            return g.md.sha384.create();
                        case "sha512WithRSAEncryption":
                            return g.md.sha512.create();
                        case "RSASSA-PSS":
                            return g.md.sha256.create();
                        default:
                            var I = new Error("Could not compute " + l.type + " digest. Unknown signature OID.");
                            throw I.signatureOid = l.signatureOid,
                            I
                        }
                    }
                      , O = function(l) {
                        var I, n = l.certificate;
                        switch (n.signatureOid) {
                        case y.sha1WithRSAEncryption:
                        case y.sha1WithRSASignature:
                            break;
                        case y["RSASSA-PSS"]:
                            var c, h, C;
                            if ((c = y[n.signatureParameters.mgf.hash.algorithmOid]) === void 0 || g.md[c] === void 0)
                                throw (C = new Error("Unsupported MGF hash function.")).oid = n.signatureParameters.mgf.hash.algorithmOid,
                                C.name = c,
                                C;
                            if ((h = y[n.signatureParameters.mgf.algorithmOid]) === void 0 || g.mgf[h] === void 0)
                                throw (C = new Error("Unsupported MGF function.")).oid = n.signatureParameters.mgf.algorithmOid,
                                C.name = h,
                                C;
                            if (h = g.mgf[h].create(g.md[c].create()),
                            (c = y[n.signatureParameters.hash.algorithmOid]) === void 0 || g.md[c] === void 0)
                                throw (C = new Error("Unsupported RSASSA-PSS hash function.")).oid = n.signatureParameters.hash.algorithmOid,
                                C.name = c,
                                C;
                            I = g.pss.create(g.md[c].create(), h, n.signatureParameters.saltLength)
                        }
                        return n.publicKey.verify(l.md.digest().getBytes(), l.signature, I)
                    };
                    function x(E) {
                        for (var l, I, n = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []), c = E.attributes, h = 0; h < c.length; ++h) {
                            var C = (l = c[h]).value
                              , R = i.Type.PRINTABLESTRING;
                            "valueTagClass"in l && (R = l.valueTagClass) === i.Type.UTF8 && (C = g.util.encodeUtf8(C)),
                            I = i.create(i.Class.UNIVERSAL, i.Type.SET, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(l.type).getBytes()), i.create(i.Class.UNIVERSAL, R, !1, C)])]),
                            n.value.push(I)
                        }
                        return n
                    }
                    function o(E) {
                        for (var l, I = 0; I < E.length; ++I) {
                            if ((l = E[I]).name === void 0 && (l.type && l.type in a.oids ? l.name = a.oids[l.type] : l.shortName && l.shortName in U && (l.name = a.oids[U[l.shortName]])),
                            l.type === void 0) {
                                if (!l.name || !(l.name in a.oids))
                                    throw (c = new Error("Attribute type not specified.")).attribute = l,
                                    c;
                                l.type = a.oids[l.name]
                            }
                            if (l.shortName === void 0 && l.name && l.name in U && (l.shortName = U[l.name]),
                            l.type === y.extensionRequest && (l.valueConstructed = !0,
                            l.valueTagClass = i.Type.SEQUENCE,
                            !l.value && l.extensions)) {
                                l.value = [];
                                for (var n = 0; n < l.extensions.length; ++n)
                                    l.value.push(a.certificateExtensionToAsn1(S(l.extensions[n])))
                            }
                            var c;
                            if (l.value === void 0)
                                throw (c = new Error("Attribute value not specified.")).attribute = l,
                                c
                        }
                    }
                    function S(E, l) {
                        if (l = l || {},
                        E.name === void 0 && E.id && E.id in a.oids && (E.name = a.oids[E.id]),
                        E.id === void 0) {
                            if (!E.name || !(E.name in a.oids))
                                throw (ee = new Error("Extension ID not specified.")).extension = E,
                                ee;
                            E.id = a.oids[E.name]
                        }
                        if (E.value !== void 0)
                            return E;
                        if (E.name === "keyUsage") {
                            var I = 0
                              , n = 0
                              , c = 0;
                            E.digitalSignature && (n |= 128,
                            I = 7),
                            E.nonRepudiation && (n |= 64,
                            I = 6),
                            E.keyEncipherment && (n |= 32,
                            I = 5),
                            E.dataEncipherment && (n |= 16,
                            I = 4),
                            E.keyAgreement && (n |= 8,
                            I = 3),
                            E.keyCertSign && (n |= 4,
                            I = 2),
                            E.cRLSign && (n |= 2,
                            I = 1),
                            E.encipherOnly && (n |= 1,
                            I = 0),
                            E.decipherOnly && (c |= 128,
                            I = 7);
                            var h = String.fromCharCode(I);
                            c !== 0 ? h += String.fromCharCode(n) + String.fromCharCode(c) : n !== 0 && (h += String.fromCharCode(n)),
                            E.value = i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, h)
                        } else if (E.name === "basicConstraints")
                            E.value = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []),
                            E.cA && E.value.value.push(i.create(i.Class.UNIVERSAL, i.Type.BOOLEAN, !1, String.fromCharCode(255))),
                            "pathLenConstraint"in E && E.value.value.push(i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(E.pathLenConstraint).getBytes()));
                        else if (E.name === "extKeyUsage") {
                            E.value = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
                            var C = E.value.value;
                            for (var R in E)
                                E[R] === !0 && (R in y ? C.push(i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(y[R]).getBytes())) : R.indexOf(".") !== -1 && C.push(i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(R).getBytes())))
                        } else if (E.name === "nsCertType")
                            I = 0,
                            n = 0,
                            E.client && (n |= 128,
                            I = 7),
                            E.server && (n |= 64,
                            I = 6),
                            E.email && (n |= 32,
                            I = 5),
                            E.objsign && (n |= 16,
                            I = 4),
                            E.reserved && (n |= 8,
                            I = 3),
                            E.sslCA && (n |= 4,
                            I = 2),
                            E.emailCA && (n |= 2,
                            I = 1),
                            E.objCA && (n |= 1,
                            I = 0),
                            h = String.fromCharCode(I),
                            n !== 0 && (h += String.fromCharCode(n)),
                            E.value = i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, h);
                        else if (E.name === "subjectAltName" || E.name === "issuerAltName") {
                            E.value = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
                            for (var P = 0; P < E.altNames.length; ++P) {
                                if (h = (W = E.altNames[P]).value,
                                W.type === 7 && W.ip) {
                                    if ((h = g.util.bytesFromIP(W.ip)) === null)
                                        throw (ee = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.')).extension = E,
                                        ee
                                } else
                                    W.type === 8 && (h = W.oid ? i.oidToDer(i.oidToDer(W.oid)) : i.oidToDer(h));
                                E.value.value.push(i.create(i.Class.CONTEXT_SPECIFIC, W.type, !1, h))
                            }
                        } else if (E.name === "nsComment" && l.cert) {
                            if (!/^[\x00-\x7F]*$/.test(E.comment) || E.comment.length < 1 || E.comment.length > 128)
                                throw new Error('Invalid "nsComment" content.');
                            E.value = i.create(i.Class.UNIVERSAL, i.Type.IA5STRING, !1, E.comment)
                        } else if (E.name === "subjectKeyIdentifier" && l.cert) {
                            var G = l.cert.generateSubjectKeyIdentifier();
                            E.subjectKeyIdentifier = G.toHex(),
                            E.value = i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, G.getBytes())
                        } else if (E.name === "authorityKeyIdentifier" && l.cert) {
                            if (E.value = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []),
                            C = E.value.value,
                            E.keyIdentifier) {
                                var H = E.keyIdentifier === !0 ? l.cert.generateSubjectKeyIdentifier().getBytes() : E.keyIdentifier;
                                C.push(i.create(i.Class.CONTEXT_SPECIFIC, 0, !1, H))
                            }
                            if (E.authorityCertIssuer) {
                                var X = [i.create(i.Class.CONTEXT_SPECIFIC, 4, !0, [x(E.authorityCertIssuer === !0 ? l.cert.issuer : E.authorityCertIssuer)])];
                                C.push(i.create(i.Class.CONTEXT_SPECIFIC, 1, !0, X))
                            }
                            if (E.serialNumber) {
                                var Z = g.util.hexToBytes(E.serialNumber === !0 ? l.cert.serialNumber : E.serialNumber);
                                C.push(i.create(i.Class.CONTEXT_SPECIFIC, 2, !1, Z))
                            }
                        } else if (E.name === "cRLDistributionPoints") {
                            E.value = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []),
                            C = E.value.value;
                            var W, $ = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []), te = i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, []);
                            for (P = 0; P < E.altNames.length; ++P) {
                                if (h = (W = E.altNames[P]).value,
                                W.type === 7 && W.ip) {
                                    if ((h = g.util.bytesFromIP(W.ip)) === null)
                                        throw (ee = new Error('Extension "ip" value is not a valid IPv4 or IPv6 address.')).extension = E,
                                        ee
                                } else
                                    W.type === 8 && (h = W.oid ? i.oidToDer(i.oidToDer(W.oid)) : i.oidToDer(h));
                                te.value.push(i.create(i.Class.CONTEXT_SPECIFIC, W.type, !1, h))
                            }
                            $.value.push(i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [te])),
                            C.push($)
                        }
                        var ee;
                        if (E.value === void 0)
                            throw (ee = new Error("Extension value not specified.")).extension = E,
                            ee;
                        return E
                    }
                    function L(E, l) {
                        switch (E) {
                        case y["RSASSA-PSS"]:
                            var I = [];
                            return l.hash.algorithmOid !== void 0 && I.push(i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(l.hash.algorithmOid).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "")])])),
                            l.mgf.algorithmOid !== void 0 && I.push(i.create(i.Class.CONTEXT_SPECIFIC, 1, !0, [i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(l.mgf.algorithmOid).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(l.mgf.hash.algorithmOid).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "")])])])),
                            l.saltLength !== void 0 && I.push(i.create(i.Class.CONTEXT_SPECIFIC, 2, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(l.saltLength).getBytes())])),
                            i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, I);
                        default:
                            return i.create(i.Class.UNIVERSAL, i.Type.NULL, !1, "")
                        }
                    }
                    function V(E) {
                        var l = i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, []);
                        if (E.attributes.length === 0)
                            return l;
                        for (var I = E.attributes, n = 0; n < I.length; ++n) {
                            var c = I[n]
                              , h = c.value
                              , C = i.Type.UTF8;
                            "valueTagClass"in c && (C = c.valueTagClass),
                            C === i.Type.UTF8 && (h = g.util.encodeUtf8(h));
                            var R = !1;
                            "valueConstructed"in c && (R = c.valueConstructed);
                            var P = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(c.type).getBytes()), i.create(i.Class.UNIVERSAL, i.Type.SET, !0, [i.create(i.Class.UNIVERSAL, C, R, h)])]);
                            l.value.push(P)
                        }
                        return l
                    }
                    a.certificateFromPem = function(E, l, I) {
                        var n = g.pem.decode(E)[0];
                        if (n.type !== "CERTIFICATE" && n.type !== "X509 CERTIFICATE" && n.type !== "TRUSTED CERTIFICATE") {
                            var c = new Error('Could not convert certificate from PEM; PEM header type is not "CERTIFICATE", "X509 CERTIFICATE", or "TRUSTED CERTIFICATE".');
                            throw c.headerType = n.type,
                            c
                        }
                        if (n.procType && n.procType.type === "ENCRYPTED")
                            throw new Error("Could not convert certificate from PEM; PEM is encrypted.");
                        var h = i.fromDer(n.body, I);
                        return a.certificateFromAsn1(h, l)
                    }
                    ,
                    a.certificateToPem = function(E, l) {
                        var I = {
                            type: "CERTIFICATE",
                            body: i.toDer(a.certificateToAsn1(E)).getBytes()
                        };
                        return g.pem.encode(I, {
                            maxline: l
                        })
                    }
                    ,
                    a.publicKeyFromPem = function(E) {
                        var l = g.pem.decode(E)[0];
                        if (l.type !== "PUBLIC KEY" && l.type !== "RSA PUBLIC KEY") {
                            var I = new Error('Could not convert public key from PEM; PEM header type is not "PUBLIC KEY" or "RSA PUBLIC KEY".');
                            throw I.headerType = l.type,
                            I
                        }
                        if (l.procType && l.procType.type === "ENCRYPTED")
                            throw new Error("Could not convert public key from PEM; PEM is encrypted.");
                        var n = i.fromDer(l.body);
                        return a.publicKeyFromAsn1(n)
                    }
                    ,
                    a.publicKeyToPem = function(E, l) {
                        var I = {
                            type: "PUBLIC KEY",
                            body: i.toDer(a.publicKeyToAsn1(E)).getBytes()
                        };
                        return g.pem.encode(I, {
                            maxline: l
                        })
                    }
                    ,
                    a.publicKeyToRSAPublicKeyPem = function(E, l) {
                        var I = {
                            type: "RSA PUBLIC KEY",
                            body: i.toDer(a.publicKeyToRSAPublicKey(E)).getBytes()
                        };
                        return g.pem.encode(I, {
                            maxline: l
                        })
                    }
                    ,
                    a.getPublicKeyFingerprint = function(E, l) {
                        var I, n = (l = l || {}).md || g.md.sha1.create();
                        switch (l.type || "RSAPublicKey") {
                        case "RSAPublicKey":
                            I = i.toDer(a.publicKeyToRSAPublicKey(E)).getBytes();
                            break;
                        case "SubjectPublicKeyInfo":
                            I = i.toDer(a.publicKeyToAsn1(E)).getBytes();
                            break;
                        default:
                            throw new Error('Unknown fingerprint type "' + l.type + '".')
                        }
                        n.start(),
                        n.update(I);
                        var c = n.digest();
                        if (l.encoding === "hex") {
                            var h = c.toHex();
                            return l.delimiter ? h.match(/.{2}/g).join(l.delimiter) : h
                        }
                        if (l.encoding === "binary")
                            return c.getBytes();
                        if (l.encoding)
                            throw new Error('Unknown encoding "' + l.encoding + '".');
                        return c
                    }
                    ,
                    a.certificationRequestFromPem = function(E, l, I) {
                        var n = g.pem.decode(E)[0];
                        if (n.type !== "CERTIFICATE REQUEST") {
                            var c = new Error('Could not convert certification request from PEM; PEM header type is not "CERTIFICATE REQUEST".');
                            throw c.headerType = n.type,
                            c
                        }
                        if (n.procType && n.procType.type === "ENCRYPTED")
                            throw new Error("Could not convert certification request from PEM; PEM is encrypted.");
                        var h = i.fromDer(n.body, I);
                        return a.certificationRequestFromAsn1(h, l)
                    }
                    ,
                    a.certificationRequestToPem = function(E, l) {
                        var I = {
                            type: "CERTIFICATE REQUEST",
                            body: i.toDer(a.certificationRequestToAsn1(E)).getBytes()
                        };
                        return g.pem.encode(I, {
                            maxline: l
                        })
                    }
                    ,
                    a.createCertificate = function() {
                        var E = {
                            version: 2,
                            serialNumber: "00",
                            signatureOid: null,
                            signature: null,
                            siginfo: {}
                        };
                        return E.siginfo.algorithmOid = null,
                        E.validity = {},
                        E.validity.notBefore = new Date,
                        E.validity.notAfter = new Date,
                        E.issuer = {},
                        E.issuer.getField = function(l) {
                            return w(E.issuer, l)
                        }
                        ,
                        E.issuer.addField = function(l) {
                            o([l]),
                            E.issuer.attributes.push(l)
                        }
                        ,
                        E.issuer.attributes = [],
                        E.issuer.hash = null,
                        E.subject = {},
                        E.subject.getField = function(l) {
                            return w(E.subject, l)
                        }
                        ,
                        E.subject.addField = function(l) {
                            o([l]),
                            E.subject.attributes.push(l)
                        }
                        ,
                        E.subject.attributes = [],
                        E.subject.hash = null,
                        E.extensions = [],
                        E.publicKey = null,
                        E.md = null,
                        E.setSubject = function(l, I) {
                            o(l),
                            E.subject.attributes = l,
                            delete E.subject.uniqueId,
                            I && (E.subject.uniqueId = I),
                            E.subject.hash = null
                        }
                        ,
                        E.setIssuer = function(l, I) {
                            o(l),
                            E.issuer.attributes = l,
                            delete E.issuer.uniqueId,
                            I && (E.issuer.uniqueId = I),
                            E.issuer.hash = null
                        }
                        ,
                        E.setExtensions = function(l) {
                            for (var I = 0; I < l.length; ++I)
                                S(l[I], {
                                    cert: E
                                });
                            E.extensions = l
                        }
                        ,
                        E.getExtension = function(l) {
                            typeof l == "string" && (l = {
                                name: l
                            });
                            for (var I, n = null, c = 0; n === null && c < E.extensions.length; ++c)
                                I = E.extensions[c],
                                (l.id && I.id === l.id || l.name && I.name === l.name) && (n = I);
                            return n
                        }
                        ,
                        E.sign = function(l, I) {
                            E.md = I || g.md.sha1.create();
                            var n = y[E.md.algorithm + "WithRSAEncryption"];
                            if (!n) {
                                var c = new Error("Could not compute certificate digest. Unknown message digest algorithm OID.");
                                throw c.algorithm = E.md.algorithm,
                                c
                            }
                            E.signatureOid = E.siginfo.algorithmOid = n,
                            E.tbsCertificate = a.getTBSCertificate(E);
                            var h = i.toDer(E.tbsCertificate);
                            E.md.update(h.getBytes()),
                            E.signature = l.sign(E.md)
                        }
                        ,
                        E.verify = function(l) {
                            var I = !1;
                            if (!E.issued(l)) {
                                var n = l.issuer
                                  , c = E.subject
                                  , h = new Error("The parent certificate did not issue the given child certificate; the child certificate's issuer does not match the parent's subject.");
                                throw h.expectedIssuer = c.attributes,
                                h.actualIssuer = n.attributes,
                                h
                            }
                            var C = l.md;
                            if (C === null) {
                                C = N({
                                    signatureOid: l.signatureOid,
                                    type: "certificate"
                                });
                                var R = l.tbsCertificate || a.getTBSCertificate(l)
                                  , P = i.toDer(R);
                                C.update(P.getBytes())
                            }
                            return C !== null && (I = O({
                                certificate: E,
                                md: C,
                                signature: l.signature
                            })),
                            I
                        }
                        ,
                        E.isIssuer = function(l) {
                            var I = !1
                              , n = E.issuer
                              , c = l.subject;
                            if (n.hash && c.hash)
                                I = n.hash === c.hash;
                            else if (n.attributes.length === c.attributes.length) {
                                var h, C;
                                I = !0;
                                for (var R = 0; I && R < n.attributes.length; ++R)
                                    h = n.attributes[R],
                                    C = c.attributes[R],
                                    h.type === C.type && h.value === C.value || (I = !1)
                            }
                            return I
                        }
                        ,
                        E.issued = function(l) {
                            return l.isIssuer(E)
                        }
                        ,
                        E.generateSubjectKeyIdentifier = function() {
                            return a.getPublicKeyFingerprint(E.publicKey, {
                                type: "RSAPublicKey"
                            })
                        }
                        ,
                        E.verifySubjectKeyIdentifier = function() {
                            for (var l = y.subjectKeyIdentifier, I = 0; I < E.extensions.length; ++I) {
                                var n = E.extensions[I];
                                if (n.id === l) {
                                    var c = E.generateSubjectKeyIdentifier().getBytes();
                                    return g.util.hexToBytes(n.subjectKeyIdentifier) === c
                                }
                            }
                            return !1
                        }
                        ,
                        E
                    }
                    ,
                    a.certificateFromAsn1 = function(E, l) {
                        var I = {}
                          , n = [];
                        if (!i.validate(E, v, I, n)) {
                            var c = new Error("Cannot read X.509 certificate. ASN.1 object is not an X509v3 Certificate.");
                            throw c.errors = n,
                            c
                        }
                        if (i.derToOid(I.publicKeyOid) !== a.oids.rsaEncryption)
                            throw new Error("Cannot read public key. OID is not RSA.");
                        var h = a.createCertificate();
                        h.version = I.certVersion ? I.certVersion.charCodeAt(0) : 0;
                        var C = g.util.createBuffer(I.certSerialNumber);
                        h.serialNumber = C.toHex(),
                        h.signatureOid = g.asn1.derToOid(I.certSignatureOid),
                        h.signatureParameters = M(h.signatureOid, I.certSignatureParams, !0),
                        h.siginfo.algorithmOid = g.asn1.derToOid(I.certinfoSignatureOid),
                        h.siginfo.parameters = M(h.siginfo.algorithmOid, I.certinfoSignatureParams, !1),
                        h.signature = I.certSignature;
                        var R = [];
                        if (I.certValidity1UTCTime !== void 0 && R.push(i.utcTimeToDate(I.certValidity1UTCTime)),
                        I.certValidity2GeneralizedTime !== void 0 && R.push(i.generalizedTimeToDate(I.certValidity2GeneralizedTime)),
                        I.certValidity3UTCTime !== void 0 && R.push(i.utcTimeToDate(I.certValidity3UTCTime)),
                        I.certValidity4GeneralizedTime !== void 0 && R.push(i.generalizedTimeToDate(I.certValidity4GeneralizedTime)),
                        R.length > 2)
                            throw new Error("Cannot read notBefore/notAfter validity times; more than two times were provided in the certificate.");
                        if (R.length < 2)
                            throw new Error("Cannot read notBefore/notAfter validity times; they were not provided as either UTCTime or GeneralizedTime.");
                        if (h.validity.notBefore = R[0],
                        h.validity.notAfter = R[1],
                        h.tbsCertificate = I.tbsCertificate,
                        l) {
                            h.md = N({
                                signatureOid: h.signatureOid,
                                type: "certificate"
                            });
                            var P = i.toDer(h.tbsCertificate);
                            h.md.update(P.getBytes())
                        }
                        var G = g.md.sha1.create()
                          , H = i.toDer(I.certIssuer);
                        G.update(H.getBytes()),
                        h.issuer.getField = function(W) {
                            return w(h.issuer, W)
                        }
                        ,
                        h.issuer.addField = function(W) {
                            o([W]),
                            h.issuer.attributes.push(W)
                        }
                        ,
                        h.issuer.attributes = a.RDNAttributesAsArray(I.certIssuer),
                        I.certIssuerUniqueId && (h.issuer.uniqueId = I.certIssuerUniqueId),
                        h.issuer.hash = G.digest().toHex();
                        var X = g.md.sha1.create()
                          , Z = i.toDer(I.certSubject);
                        return X.update(Z.getBytes()),
                        h.subject.getField = function(W) {
                            return w(h.subject, W)
                        }
                        ,
                        h.subject.addField = function(W) {
                            o([W]),
                            h.subject.attributes.push(W)
                        }
                        ,
                        h.subject.attributes = a.RDNAttributesAsArray(I.certSubject),
                        I.certSubjectUniqueId && (h.subject.uniqueId = I.certSubjectUniqueId),
                        h.subject.hash = X.digest().toHex(),
                        I.certExtensions ? h.extensions = a.certificateExtensionsFromAsn1(I.certExtensions) : h.extensions = [],
                        h.publicKey = a.publicKeyFromAsn1(I.subjectPublicKeyInfo),
                        h
                    }
                    ,
                    a.certificateExtensionsFromAsn1 = function(E) {
                        for (var l = [], I = 0; I < E.value.length; ++I)
                            for (var n = E.value[I], c = 0; c < n.value.length; ++c)
                                l.push(a.certificateExtensionFromAsn1(n.value[c]));
                        return l
                    }
                    ,
                    a.certificateExtensionFromAsn1 = function(E) {
                        var l = {};
                        if (l.id = i.derToOid(E.value[0].value),
                        l.critical = !1,
                        E.value[1].type === i.Type.BOOLEAN ? (l.critical = E.value[1].value.charCodeAt(0) !== 0,
                        l.value = E.value[2].value) : l.value = E.value[1].value,
                        l.id in y)
                            if (l.name = y[l.id],
                            l.name === "keyUsage") {
                                var I = 0
                                  , n = 0;
                                (h = i.fromDer(l.value)).value.length > 1 && (I = h.value.charCodeAt(1),
                                n = h.value.length > 2 ? h.value.charCodeAt(2) : 0),
                                l.digitalSignature = (128 & I) == 128,
                                l.nonRepudiation = (64 & I) == 64,
                                l.keyEncipherment = (32 & I) == 32,
                                l.dataEncipherment = (16 & I) == 16,
                                l.keyAgreement = (8 & I) == 8,
                                l.keyCertSign = (4 & I) == 4,
                                l.cRLSign = (2 & I) == 2,
                                l.encipherOnly = (1 & I) == 1,
                                l.decipherOnly = (128 & n) == 128
                            } else if (l.name === "basicConstraints") {
                                (h = i.fromDer(l.value)).value.length > 0 && h.value[0].type === i.Type.BOOLEAN ? l.cA = h.value[0].value.charCodeAt(0) !== 0 : l.cA = !1;
                                var c = null;
                                h.value.length > 0 && h.value[0].type === i.Type.INTEGER ? c = h.value[0].value : h.value.length > 1 && (c = h.value[1].value),
                                c !== null && (l.pathLenConstraint = i.derToInteger(c))
                            } else if (l.name === "extKeyUsage")
                                for (var h = i.fromDer(l.value), C = 0; C < h.value.length; ++C) {
                                    var R = i.derToOid(h.value[C].value);
                                    R in y ? l[y[R]] = !0 : l[R] = !0
                                }
                            else if (l.name === "nsCertType")
                                I = 0,
                                (h = i.fromDer(l.value)).value.length > 1 && (I = h.value.charCodeAt(1)),
                                l.client = (128 & I) == 128,
                                l.server = (64 & I) == 64,
                                l.email = (32 & I) == 32,
                                l.objsign = (16 & I) == 16,
                                l.reserved = (8 & I) == 8,
                                l.sslCA = (4 & I) == 4,
                                l.emailCA = (2 & I) == 2,
                                l.objCA = (1 & I) == 1;
                            else if (l.name === "subjectAltName" || l.name === "issuerAltName") {
                                var P;
                                l.altNames = [],
                                h = i.fromDer(l.value);
                                for (var G = 0; G < h.value.length; ++G) {
                                    var H = {
                                        type: (P = h.value[G]).type,
                                        value: P.value
                                    };
                                    switch (l.altNames.push(H),
                                    P.type) {
                                    case 1:
                                    case 2:
                                    case 6:
                                        break;
                                    case 7:
                                        H.ip = g.util.bytesToIP(P.value);
                                        break;
                                    case 8:
                                        H.oid = i.derToOid(P.value)
                                    }
                                }
                            } else
                                l.name === "subjectKeyIdentifier" && (h = i.fromDer(l.value),
                                l.subjectKeyIdentifier = g.util.bytesToHex(h.value));
                        return l
                    }
                    ,
                    a.certificationRequestFromAsn1 = function(E, l) {
                        var I = {}
                          , n = [];
                        if (!i.validate(E, b, I, n)) {
                            var c = new Error("Cannot read PKCS#10 certificate request. ASN.1 object is not a PKCS#10 CertificationRequest.");
                            throw c.errors = n,
                            c
                        }
                        if (i.derToOid(I.publicKeyOid) !== a.oids.rsaEncryption)
                            throw new Error("Cannot read public key. OID is not RSA.");
                        var h = a.createCertificationRequest();
                        if (h.version = I.csrVersion ? I.csrVersion.charCodeAt(0) : 0,
                        h.signatureOid = g.asn1.derToOid(I.csrSignatureOid),
                        h.signatureParameters = M(h.signatureOid, I.csrSignatureParams, !0),
                        h.siginfo.algorithmOid = g.asn1.derToOid(I.csrSignatureOid),
                        h.siginfo.parameters = M(h.siginfo.algorithmOid, I.csrSignatureParams, !1),
                        h.signature = I.csrSignature,
                        h.certificationRequestInfo = I.certificationRequestInfo,
                        l) {
                            h.md = N({
                                signatureOid: h.signatureOid,
                                type: "certification request"
                            });
                            var C = i.toDer(h.certificationRequestInfo);
                            h.md.update(C.getBytes())
                        }
                        var R = g.md.sha1.create();
                        return h.subject.getField = function(P) {
                            return w(h.subject, P)
                        }
                        ,
                        h.subject.addField = function(P) {
                            o([P]),
                            h.subject.attributes.push(P)
                        }
                        ,
                        h.subject.attributes = a.RDNAttributesAsArray(I.certificationRequestInfoSubject, R),
                        h.subject.hash = R.digest().toHex(),
                        h.publicKey = a.publicKeyFromAsn1(I.subjectPublicKeyInfo),
                        h.getAttribute = function(P) {
                            return w(h, P)
                        }
                        ,
                        h.addAttribute = function(P) {
                            o([P]),
                            h.attributes.push(P)
                        }
                        ,
                        h.attributes = a.CRIAttributesAsArray(I.certificationRequestInfoAttributes || []),
                        h
                    }
                    ,
                    a.createCertificationRequest = function() {
                        var E = {
                            version: 0,
                            signatureOid: null,
                            signature: null,
                            siginfo: {}
                        };
                        return E.siginfo.algorithmOid = null,
                        E.subject = {},
                        E.subject.getField = function(l) {
                            return w(E.subject, l)
                        }
                        ,
                        E.subject.addField = function(l) {
                            o([l]),
                            E.subject.attributes.push(l)
                        }
                        ,
                        E.subject.attributes = [],
                        E.subject.hash = null,
                        E.publicKey = null,
                        E.attributes = [],
                        E.getAttribute = function(l) {
                            return w(E, l)
                        }
                        ,
                        E.addAttribute = function(l) {
                            o([l]),
                            E.attributes.push(l)
                        }
                        ,
                        E.md = null,
                        E.setSubject = function(l) {
                            o(l),
                            E.subject.attributes = l,
                            E.subject.hash = null
                        }
                        ,
                        E.setAttributes = function(l) {
                            o(l),
                            E.attributes = l
                        }
                        ,
                        E.sign = function(l, I) {
                            E.md = I || g.md.sha1.create();
                            var n = y[E.md.algorithm + "WithRSAEncryption"];
                            if (!n) {
                                var c = new Error("Could not compute certification request digest. Unknown message digest algorithm OID.");
                                throw c.algorithm = E.md.algorithm,
                                c
                            }
                            E.signatureOid = E.siginfo.algorithmOid = n,
                            E.certificationRequestInfo = a.getCertificationRequestInfo(E);
                            var h = i.toDer(E.certificationRequestInfo);
                            E.md.update(h.getBytes()),
                            E.signature = l.sign(E.md)
                        }
                        ,
                        E.verify = function() {
                            var l = !1
                              , I = E.md;
                            if (I === null) {
                                I = N({
                                    signatureOid: E.signatureOid,
                                    type: "certification request"
                                });
                                var n = E.certificationRequestInfo || a.getCertificationRequestInfo(E)
                                  , c = i.toDer(n);
                                I.update(c.getBytes())
                            }
                            return I !== null && (l = O({
                                certificate: E,
                                md: I,
                                signature: E.signature
                            })),
                            l
                        }
                        ,
                        E
                    }
                    ;
                    var F = new Date("1950-01-01T00:00:00Z")
                      , j = new Date("2050-01-01T00:00:00Z");
                    function z(E) {
                        return E >= F && E < j ? i.create(i.Class.UNIVERSAL, i.Type.UTCTIME, !1, i.dateToUtcTime(E)) : i.create(i.Class.UNIVERSAL, i.Type.GENERALIZEDTIME, !1, i.dateToGeneralizedTime(E))
                    }
                    a.getTBSCertificate = function(E) {
                        var l = z(E.validity.notBefore)
                          , I = z(E.validity.notAfter)
                          , n = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.CONTEXT_SPECIFIC, 0, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(E.version).getBytes())]), i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, g.util.hexToBytes(E.serialNumber)), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(E.siginfo.algorithmOid).getBytes()), L(E.siginfo.algorithmOid, E.siginfo.parameters)]), x(E.issuer), i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [l, I]), x(E.subject), a.publicKeyToAsn1(E.publicKey)]);
                        return E.issuer.uniqueId && n.value.push(i.create(i.Class.CONTEXT_SPECIFIC, 1, !0, [i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, String.fromCharCode(0) + E.issuer.uniqueId)])),
                        E.subject.uniqueId && n.value.push(i.create(i.Class.CONTEXT_SPECIFIC, 2, !0, [i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, String.fromCharCode(0) + E.subject.uniqueId)])),
                        E.extensions.length > 0 && n.value.push(a.certificateExtensionsToAsn1(E.extensions)),
                        n
                    }
                    ,
                    a.getCertificationRequestInfo = function(E) {
                        return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.INTEGER, !1, i.integerToDer(E.version).getBytes()), x(E.subject), a.publicKeyToAsn1(E.publicKey), V(E)])
                    }
                    ,
                    a.distinguishedNameToAsn1 = function(E) {
                        return x(E)
                    }
                    ,
                    a.certificateToAsn1 = function(E) {
                        var l = E.tbsCertificate || a.getTBSCertificate(E);
                        return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [l, i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(E.signatureOid).getBytes()), L(E.signatureOid, E.signatureParameters)]), i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, String.fromCharCode(0) + E.signature)])
                    }
                    ,
                    a.certificateExtensionsToAsn1 = function(E) {
                        var l = i.create(i.Class.CONTEXT_SPECIFIC, 3, !0, [])
                          , I = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
                        l.value.push(I);
                        for (var n = 0; n < E.length; ++n)
                            I.value.push(a.certificateExtensionToAsn1(E[n]));
                        return l
                    }
                    ,
                    a.certificateExtensionToAsn1 = function(E) {
                        var l = i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, []);
                        l.value.push(i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(E.id).getBytes())),
                        E.critical && l.value.push(i.create(i.Class.UNIVERSAL, i.Type.BOOLEAN, !1, String.fromCharCode(255)));
                        var I = E.value;
                        return typeof E.value != "string" && (I = i.toDer(I).getBytes()),
                        l.value.push(i.create(i.Class.UNIVERSAL, i.Type.OCTETSTRING, !1, I)),
                        l
                    }
                    ,
                    a.certificationRequestToAsn1 = function(E) {
                        var l = E.certificationRequestInfo || a.getCertificationRequestInfo(E);
                        return i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [l, i.create(i.Class.UNIVERSAL, i.Type.SEQUENCE, !0, [i.create(i.Class.UNIVERSAL, i.Type.OID, !1, i.oidToDer(E.signatureOid).getBytes()), L(E.signatureOid, E.signatureParameters)]), i.create(i.Class.UNIVERSAL, i.Type.BITSTRING, !1, String.fromCharCode(0) + E.signature)])
                    }
                    ,
                    a.createCaStore = function(E) {
                        var l = {
                            certs: {}
                        };
                        function I(C) {
                            return n(C),
                            l.certs[C.hash] || null
                        }
                        function n(C) {
                            if (!C.hash) {
                                var R = g.md.sha1.create();
                                C.attributes = a.RDNAttributesAsArray(x(C), R),
                                C.hash = R.digest().toHex()
                            }
                        }
                        if (l.getIssuer = function(C) {
                            return I(C.issuer)
                        }
                        ,
                        l.addCertificate = function(C) {
                            if (typeof C == "string" && (C = g.pki.certificateFromPem(C)),
                            n(C.subject),
                            !l.hasCertificate(C))
                                if (C.subject.hash in l.certs) {
                                    var R = l.certs[C.subject.hash];
                                    g.util.isArray(R) || (R = [R]),
                                    R.push(C),
                                    l.certs[C.subject.hash] = R
                                } else
                                    l.certs[C.subject.hash] = C
                        }
                        ,
                        l.hasCertificate = function(C) {
                            typeof C == "string" && (C = g.pki.certificateFromPem(C));
                            var R = I(C.subject);
                            if (!R)
                                return !1;
                            g.util.isArray(R) || (R = [R]);
                            for (var P = i.toDer(a.certificateToAsn1(C)).getBytes(), G = 0; G < R.length; ++G)
                                if (P === i.toDer(a.certificateToAsn1(R[G])).getBytes())
                                    return !0;
                            return !1
                        }
                        ,
                        l.listAllCertificates = function() {
                            var C = [];
                            for (var R in l.certs)
                                if (l.certs.hasOwnProperty(R)) {
                                    var P = l.certs[R];
                                    if (g.util.isArray(P))
                                        for (var G = 0; G < P.length; ++G)
                                            C.push(P[G]);
                                    else
                                        C.push(P)
                                }
                            return C
                        }
                        ,
                        l.removeCertificate = function(C) {
                            var R;
                            if (typeof C == "string" && (C = g.pki.certificateFromPem(C)),
                            n(C.subject),
                            !l.hasCertificate(C))
                                return null;
                            var P = I(C.subject);
                            if (!g.util.isArray(P))
                                return R = l.certs[C.subject.hash],
                                delete l.certs[C.subject.hash],
                                R;
                            for (var G = i.toDer(a.certificateToAsn1(C)).getBytes(), H = 0; H < P.length; ++H)
                                G === i.toDer(a.certificateToAsn1(P[H])).getBytes() && (R = P[H],
                                P.splice(H, 1));
                            return P.length === 0 && delete l.certs[C.subject.hash],
                            R
                        }
                        ,
                        E)
                            for (var c = 0; c < E.length; ++c) {
                                var h = E[c];
                                l.addCertificate(h)
                            }
                        return l
                    }
                    ,
                    a.certificateError = {
                        bad_certificate: "forge.pki.BadCertificate",
                        unsupported_certificate: "forge.pki.UnsupportedCertificate",
                        certificate_revoked: "forge.pki.CertificateRevoked",
                        certificate_expired: "forge.pki.CertificateExpired",
                        certificate_unknown: "forge.pki.CertificateUnknown",
                        unknown_ca: "forge.pki.UnknownCertificateAuthority"
                    },
                    a.verifyCertificateChain = function(E, l, I) {
                        typeof I == "function" && (I = {
                            verify: I
                        }),
                        I = I || {};
                        var n = (l = l.slice(0)).slice(0)
                          , c = I.validityCheckDate;
                        c === void 0 && (c = new Date);
                        var h = !0
                          , C = null
                          , R = 0;
                        do {
                            var P = l.shift()
                              , G = null
                              , H = !1;
                            if (c && (c < P.validity.notBefore || c > P.validity.notAfter) && (C = {
                                message: "Certificate is not valid yet or has expired.",
                                error: a.certificateError.certificate_expired,
                                notBefore: P.validity.notBefore,
                                notAfter: P.validity.notAfter,
                                now: c
                            }),
                            C === null) {
                                if ((G = l[0] || E.getIssuer(P)) === null && P.isIssuer(P) && (H = !0,
                                G = P),
                                G) {
                                    var X = G;
                                    g.util.isArray(X) || (X = [X]);
                                    for (var Z = !1; !Z && X.length > 0; ) {
                                        G = X.shift();
                                        try {
                                            Z = G.verify(P)
                                        } catch (ve) {}
                                    }
                                    Z || (C = {
                                        message: "Certificate signature is invalid.",
                                        error: a.certificateError.bad_certificate
                                    })
                                }
                                C !== null || G && !H || E.hasCertificate(P) || (C = {
                                    message: "Certificate is not trusted.",
                                    error: a.certificateError.unknown_ca
                                })
                            }
                            if (C === null && G && !P.isIssuer(G) && (C = {
                                message: "Certificate issuer is invalid.",
                                error: a.certificateError.bad_certificate
                            }),
                            C === null)
                                for (var W = {
                                    keyUsage: !0,
                                    basicConstraints: !0
                                }, $ = 0; C === null && $ < P.extensions.length; ++$) {
                                    var te = P.extensions[$];
                                    te.critical && !(te.name in W) && (C = {
                                        message: "Certificate has an unsupported critical extension.",
                                        error: a.certificateError.unsupported_certificate
                                    })
                                }
                            if (C === null && (!h || l.length === 0 && (!G || H))) {
                                var ee = P.getExtension("basicConstraints")
                                  , J = P.getExtension("keyUsage");
                                J !== null && (J.keyCertSign && ee !== null || (C = {
                                    message: "Certificate keyUsage or basicConstraints conflict or indicate that the certificate is not a CA. If the certificate is the only one in the chain or isn't the first then the certificate must be a valid CA.",
                                    error: a.certificateError.bad_certificate
                                })),
                                C !== null || ee === null || ee.cA || (C = {
                                    message: "Certificate basicConstraints indicates the certificate is not a CA.",
                                    error: a.certificateError.bad_certificate
                                }),
                                C === null && J !== null && "pathLenConstraint"in ee && R - 1 > ee.pathLenConstraint && (C = {
                                    message: "Certificate basicConstraints pathLenConstraint violated.",
                                    error: a.certificateError.bad_certificate
                                })
                            }
                            var ne = C === null || C.error
                              , se = I.verify ? I.verify(ne, R, n) : ne;
                            if (se !== !0)
                                throw ne === !0 && (C = {
                                    message: "The application rejected the certificate.",
                                    error: a.certificateError.bad_certificate
                                }),
                                (se || se === 0) && (le(se) != "object" || g.util.isArray(se) ? typeof se == "string" && (C.error = se) : (se.message && (C.message = se.message),
                                se.error && (C.error = se.error))),
                                C;
                            C = null,
                            h = !1,
                            ++R
                        } while (l.length > 0);
                        return !0
                    }
                },
                94: function(_, D, k) {
                    var g = k(654);
                    k(320),
                    k(690),
                    k(366),
                    k(491),
                    k(154),
                    k(374),
                    k(299);
                    var i = k(451)
                      , a = k(957).lW;
                    function y(U) {
                        U = U || {},
                        this.config = {
                            counterSizeBits: U.counterSizeBits || 64,
                            keylengthBits: U.keylengthBits || 256,
                            version: U.version || "ue-1_1_0",
                            aesAlgo: U.aesAlgo || "AES-CTR",
                            rsaAlgo: U.rsaAlgo || "RSA-OAEP",
                            hmacAlgo: U.hmacAlgo || "sha512",
                            rsaOptions: {
                                mgf1: {
                                    md: g.md.sha1.create()
                                }
                            }
                        }
                    }
                    y.initBrowserEntropyCollectors = function() {
                        var U = i.crypto || i.msCrypto;
                        return !(U && U.getRandomValues || i.addEventListener === void 0 || (i.addEventListener("mousemove", function(e) {
                            g.random.collectInt(e.pageX, 32),
                            g.random.collectInt(e.pageY, 32)
                        }),
                        0))
                    }
                    ,
                    y.prototype.bytesToBase64 = function(U) {
                        return a.from(U, "binary").toString("base64")
                    }
                    ,
                    y.prototype.rsaEncrypt = function(U, e) {
                        var v = U.encrypt(e.toString("binary"), this.config.rsaAlgo, this.config.rsaOptions);
                        return this.bytesToBase64(v)
                    }
                    ,
                    y.prototype.parseCertificate = function(U) {
                        var e = U.replace(/-+BEGIN CERTIFICATE-+\s*/, "").replace(/-+END CERTIFICATE-+\s*/, "")
                          , v = g.util.decode64(e)
                          , B = g.asn1.fromDer(v)
                          , p = g.pki.certificateFromAsn1(B)
                          , b = p.subject.getField("CN").value.split(":");
                        return {
                            namespace: b[0],
                            version: b[1],
                            publicKey: p.publicKey
                        }
                    }
                    ,
                    y.prototype.genSignature = function(U, e) {
                        var v, B = g.hmac.create();
                        return B.start(this.config.hmacAlgo, U),
                        B.update(e),
                        v = B.getMac().getBytes(32),
                        this.bytesToBase64(v)
                    }
                    ,
                    y.prototype.wrap = function(U) {
                        return [U.version, U.keyId, U.hmac, U.aes, U.nonce, U.ciphertext, U.signature].join("$")
                    }
                    ,
                    y.prototype.createMessage = function(U, e) {
                        return this.bytesToBase64(U) + "$" + e
                    }
                    ,
                    y.prototype.aesEncrypt = function(U, e, v) {
                        var B = g.cipher.createCipher(this.config.aesAlgo, U)
                          , p = a.from(e, "binary")
                          , b = a.alloc(8);
                        b.writeInt32BE(0, 0),
                        b.writeInt32BE(1, 4),
                        p = a.concat([p, b]),
                        B.start({
                            iv: p.toString("binary")
                        }),
                        B.update(g.util.createBuffer(v)),
                        B.finish();
                        var w = B.output.bytes();
                        return this.bytesToBase64(w)
                    }
                    ,
                    y.prototype.generateRandomKey = function(U) {

                            return g.random.getBytes(U)

                    }
                    ,
                    y.prototype.encrypt = function(U, e) {
                        var v = this.generateRandomKey(this.config.counterSizeBits / 8)
                          , B = this.generateRandomKey(this.config.keylengthBits / 8)
                          , p = this.generateRandomKey(this.config.keylengthBits / 8)
                          , b = this.parseCertificate(e)
                          , w = this.rsaEncrypt(b.publicKey, p)
                          , M = this.rsaEncrypt(b.publicKey, B)
                          , N = this.aesEncrypt(B, v, U)
                          , O = this.createMessage(v, N)
                          , x = this.genSignature(p, O)
                          , o = this.wrap({
                            version: this.config.version,
                            keyId: b.version,
                            hmac: w,
                            aes: M,
                            nonce: this.bytesToBase64(v),
                            ciphertext: N,
                            signature: x
                        });
                        return {
                            namespace: b.namespace,
                            payload: o
                        }
                    }
                    ,
                    y.initBrowserEntropyCollectors(),
                    _.exports = y
                },
                435: function() {}
            }
              , d = {};
            function u(A) {
                var _ = d[A];
                if (_ !== void 0)
                    return _.exports;
                var D = d[A] = {
                    exports: {}
                };
                return s[A](D, D.exports, u),
                D.exports
            }
            return u.g = function() {

                return window

            }(),
            u(94)
        }()
    })
}
)(kn);
var Ru = kn.exports
  , Lu = me(Ru)
  , Ou = {
    production: {
        encryptionPublicKey: "MIIBCgKCAQEA2YRfM1bcfLB786t2sV7W4jeeWJDmGtK3MGfmIwzjdgKM8hZa9bR28iZKwgxy9aErnkuhdXLLnmUz+kJ1dIF6uebyKrFWwpJmkeE3QP74ImUVaR3w0qC4MJyNdKJjrL42uYkURjfx6ymDs8DD61EiytETYunq3HfUCpw+JtLQBAEvPc2Zhz52E9hBPWbeh0k7lylLkOC1KcTxJgYQ5LAp3zvy+xPCwwAv1GWCkjHgbV5YF10zasERU4mBTozsI99lbxizkrzR7AnwQzHx3/7iTQ16i0EQf+LxrMTVsVSdqzpnnrZRSHnH29KKbB080k2I/v2tbS1CjHC9DkyufKxLfwIDAQAB"
    },
    testing: {
        encryptionPublicKey: "MIIBCgKCAQEAn0/r9DtMXNnIgrUtkJqEayv4a3xIbXXZTbEKBFUFQfBapS1LHmLTHO0rWcmSNXt5ZPAdh1bpJCxkPLk92SXFnAMowU94mwTBN8s3TxQUn/sxwFii1yF1QdAbxUQZZxSBUBrowEemNwPt+birUh7t/XgGsgg+xE1fdwwCX8r7jEArR/O8xsohck8Ygf0lmsFgu87v384dXyewnkrH4eNihgp0nLRM6T1rGErOkUMpIHYVK5WlcT6gliDVbtpGzEf9Hf4WJzF6CN+r162G2PWqN5ZcVUVLAM3u7OPzEHULiOBeuTvj5FrXZJIhwHF2xLKaA13gHum4F9plp6VDjPijOQIDAQAB"
    }
}
  , Ar = {
    production: {
        "credit-card-with-postal-code": "MIIECTCCAfGgAwIBAgIIUxOjlvd6oa4wDQYJKoZIhvcNAQELBQAwFjEUMBIGA1UEAxMLdG9rZW5pemVyOjEwHhcNMjMwNTExMTUwMjU4WhcNMjcwNTExMTUwMjU4WjApMScwJQYDVQQDEx5jcmVkaXQtY2FyZC13aXRoLXBvc3RhbC1jb2RlOjQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCg9KzQp4Fzz9PjnU1ckTFzM1/VtuwXW5WtWOkb0Zp06XOz0IssOmpfxrZg4zKm3yWrNAq4iorJNcutgycaA7h0iJGnYCFXcvM46KzHGJlZnBvHG0PN/QY4DEtI6ePBbVCA8FZZHI/Pz/zK3Fc3XImw2VPrMq1sBckFk/PJ+v4F6caa+PN1x6Hzlyt126OaXTaxO9Rr/pDbmWRRodl0975y/CilXdYiirndxT8tdE8N3QDQ7K06sAHOl6RakuOIIJLDtU5Cm/ZKkTmjWEhhICWwQsnr3awdBxcrPpJTRXzMK/krgWh6GsjMy6I3zvp6zhLrBn6Qj10rXCQSBhPxTxHxAgMBAAGjSDBGMAwGA1UdEwEB/wQCMAAwNgYDVR0RBC8wLaQrMCkxJzAlBgNVBAMTHmNyZWRpdC1jYXJkLXdpdGgtcG9zdGFsLWNvZGU6NDANBgkqhkiG9w0BAQsFAAOCAgEAVnkGGQ3yrfm+qX1fKWMiuv63AzJ0PpQnMysXff9bgV+LsH7LflapGKbxwNc3U1gPYxba5VthD5KpycGtJ3f1WqdsIe+CkpSvVNncqtFIWRJoie3SqvO30EhLBPAzJIKZeh5HEmbw6uhk1P/bXQCPUGHQKRrQar7pPbnUwAp/4z24gVaYaBPYEGwAgJKpuWi58mmi+5wQWWrmkKmGQXoBUe5lQyMNhSA+JcqcNeaDa9RD7FWF5yINo4Xagd9w09y0hthYRAcK7/XFNwYe2OTkvuxvFVPw40AnNcu7I1PD6RxmYWKtpaVD92Z9LBBF3A6UG+U9ePwJpIt11s7g6H5vpxGx2P/C0ASWjys5nVJvqM6qnFFJrGdZFeBc8PDWUtdjMGuxSn21xStXWDsCjf6ScHXDyHsa8+rkRyONxFF7ws1phUYlaKBoC8wHS61snBbAtnuo70dkIjz/NDxi+fUQt1YgKivIHJh6SWPBnUXb+PjnN/P7He1pPe6kBMs03VyqWagf1oWMHDiBLPVYI39/MmndtIxf6xO6rG0dBqGmoTF07Iz+jDd2G8DXTS7rrZ8PNu7YVgYZVz7uWjg4uKXd4Sa9A2rLtKAxHhBVc27cZoIQLI7sBUaGXk4j4KXW8uocqI0rWyfXT9jPO1jMT/lDp2O4fbF9UJ2d/KnxhHK29as=",
        "credit-card-without-postal-code": "MIIEDzCCAfegAwIBAgIIXBvpg5lr2EswDQYJKoZIhvcNAQELBQAwFjEUMBIGA1UEAxMLdG9rZW5pemVyOjEwHhcNMjMwNTExMTUwMzI3WhcNMjcwNTExMTUwMzI3WjAsMSowKAYDVQQDEyFjcmVkaXQtY2FyZC13aXRob3V0LXBvc3RhbC1jb2RlOjQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCJi1zAQz3LYJLk1klhozuCfZ4eiCuyWMNHl/9ErjRDdI5EocgHbSwpx/BaOoYoE4VzdL5NKjpfYDQBSDXQjlhRjWGCFZlSH1Jmna+EioF4Y5N6ubVjIvx7ZQAa1WOvHf1r3PZwxCoK0oT1HJjrETdLX0FMECtg3L3wTO8YGoa4OQVTeiAE1FKVRIjexLdlb9qsjZp1P4oksn60xgWPLE87Ta65sgDQrIw2X2+euDsqfhHgZXWY/zdnAALbJEQXE6O1rD24RnljeIOEe69ohIEpgc5B7EzyBdqoXhsWqg6oq4jodqSGB+S20mQAxuc49AnsSJLdjzpsqLY6CV/VDKDZAgMBAAGjSzBJMAwGA1UdEwEB/wQCMAAwOQYDVR0RBDIwMKQuMCwxKjAoBgNVBAMTIWNyZWRpdC1jYXJkLXdpdGhvdXQtcG9zdGFsLWNvZGU6NDANBgkqhkiG9w0BAQsFAAOCAgEALjPE4cKAeKgywBoVbMfN+AOO3CRWY8aFWNM1yokGx9kPlNQ1Z7wXEs38AZR3kCyhqVhw3U/hnzPm7LWOGkrxA86GhRuLOwVCY/nqgLm5gbtLbuR7BVPAhEzbEeSz5+Ou+RVVRRNQBqED08J2Qe+eDTplqJt9zYk0ZwcmR2eb17g6jpecKHUV6xvRDJr5NVCQYU/kiRVbmw3GqE2dGorFGU6yhuEorDNh0y0nQj+3eiASrbKIxGsh7g/TVjDep+xGxI1pDY4PlvAT1Lj3FFGlwWMebgKUnPyflDNMyv44fXYKx4GGYACUAHFNF57+D+wfEugSGLXmBr9c9lTZJMCxCnoiF6molSrCdHo3Vrgzvek14F++k1CgNtQs1h+zc0IDRjrpu5oHiNPewJ/XmhGcZLzbTHc2BxUT+3eHhiIPSKlvD+ZRp0IqJheT8j0+9wNmSNDtxyWMmZoCaMSft8vZlOu7bSn56YKB65BnkeJm0ISOH7ZyFp7VIOPs1KFRW98x7NlfA2SQMgJEW5lcljrYHGXbh7HDKflS5p/hUBEI1Ibx9XqmXhQB/l1A10SV9iWIrgyyWE7qx7/GmWv6Iz+Y9fFKluPGkECpXP2zCR9aNnjnvzFJ/GC8xl55iGmaavvHzP3NcdtnLKr0Si5zJTYCznl0Kv/qwsYdLtq7K3xIfDM=",
        cvv: "MIID8DCCAdigAwIBAgIJAMlEHPMvSgVpMA0GCSqGSIb3DQEBCwUAMBYxFDASBgNVBAMTC3Rva2VuaXplcjoxMB4XDTIzMDUxMTE1MDMxMloXDTI3MDUxMTE1MDMxMlowHDEaMBgGA1UEAxMRY3JlZGl0LWNhcmQtY3Z2OjQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCUhmClAKC+wNJPlpV7VQdtDlrJLtJ5GQRDtYjOiq4diFF2WBUloqzziU++cjkGBSOwxq8q52xKFu/raL3rOJLMJDoXqb9fUx/hoBNZkz+zY1iDTq6T4/yb/tBYqGdvgLg/dWpHkW5vrWENhEXKooZ8hmpAI6Mv4kJYfyQVKrK9C7RVFwXuWVMGtPzpCUEgVE8C4CUxW9XfEzS+wrmTZw3N+aXVB7X39T6HXlWjTOnvp3h5F7ebQ1ZczGctKpvmvvRzz4xD0fM8aJqb2/2NRQyJ9l0xhRz7TigqoK9e2pqT9Edouoeg2eDSqe2NnvyrvL1Dxw/sm+dgEQwVqBS4lLnrAgMBAAGjOzA5MAwGA1UdEwEB/wQCMAAwKQYDVR0RBCIwIKQeMBwxGjAYBgNVBAMTEWNyZWRpdC1jYXJkLWN2djo0MA0GCSqGSIb3DQEBCwUAA4ICAQCKZgVlsvyoOFGNNHbq3vC41gYZFFYWJ3YkzlBeg7LwyKsSD2ue9/8qDzFpKe8FO+joCy3fQEL/1YZJj7pNiOzIUVPSHpm9uhMJeenguMACFh1+qy+U7YDrlnTU1ZCiBDJ3zQk/Sh4laPhkREqncx7HAj0wQdxVydgCYeFn8NtULhbTmRx8JH1U15gr0tDNZY4Pj6VUkDUIiR33VHAJ05FcpuhE8ZnOvXEvHywls3280KtqBVT1oSydv4BS4HlyuJeE82i3EqcMSbx49OI1HGa4+VaVzQY15VtarxbGThkZXozm+fAQoMsmorNFBKGyfVW5JJF03u4RmTJBXlf9S79SRP0gFZaw/+8JA9vBY3FzVvJcOt4hudB7+PFM+gHOuTXxls6tA9kMs8iho/9haMnCzNYUok/O/fvyY0Z2td0av2m8cp+1edz758GDpSj+BbpgzeVjryzqqh/Se60ykRPi24OLuasOEM8GDBAlwv/H/bZYJusrce77/9jDwyRSGInIfrirwkJ7mbZWrlaKlB4K0tmIbXfL98pntgH99uPVsu9bSDmMAYHoqoGTvGjg1h0rRXwxP9HCNCGx6CsxLy7Fai8+DVwKl4FTFPIH6XGY66/miUg8gUNIr53mMLIXrHYWDtEwiLMJbP8/BY+QCbzbfpQaAvOqwf0cjwoCF0Z8IA==",
        kcpPin: "MIID+TCCAeGgAwIBAgIIY9A1O0JEIBYwDQYJKoZIhvcNAQELBQAwFjEUMBIGA1UEAxMLdG9rZW5pemVyOjEwHhcNMjMwNTExMTUwMzM4WhcNMjcwNTExMTUwMzM4WjAhMR8wHQYDVQQDExZjcmVkaXQtY2FyZC1wYXNzd29yZDozMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhZ7ZoLyMYvgihodP4NT6Ssiy6zOd91yBefZwmHTXPvzXcyxY7zRNYWdj6fCRYt7CbbC+E2M8oKQeLDqC0dxr62/H5PLbZU9Ql5IvD1EWdDbEIlgVeR5cwoqJ50POJc7hpLqyr1azeOhmJinXfX15qCYuEJyU1q9af0JCk2kj2J1VkSZcl0v3lREx46NhPcG2vepCiNhy7N/12LvMT9w7ME0DLL2oRtutM5ZAmkB0sCg9C85lbuIrXqSUmHCSQA2kpMvVbQDXl9zRgjGdLzDRai+rJvG7u4Ibd1Q1lyc7kqnJXi96kWkk2DUBU67x1c0uSpRoJdvZRW3ZzPpt4qivYwIDAQABo0AwPjAMBgNVHRMBAf8EAjAAMC4GA1UdEQQnMCWkIzAhMR8wHQYDVQQDExZjcmVkaXQtY2FyZC1wYXNzd29yZDozMA0GCSqGSIb3DQEBCwUAA4ICAQBlj4L2qtRlNzACNmCOF7HJdy6PSLtkmgAJl9OUGZkp7YmZHgkvoCu5XSHMds0WVRCZ3oglRcTla7sFX+mX3tUGem2VzUAq1NBzedE8Zd9plbc3gw7zwpoYTL5yJtgGsfjyauQPSVXOObul1MPJwkurO+GTv/eh4LZgXCavk6Wa2mxS4wZIJ/wfteKXrc+HN8tccqGajBeU56WAESlM26DmJYb6zPjHdM5veeFtWybiHER0b7fkO9eH49gQLMF40faF3i7ZYH2OPEePIe+331Im+fu1Saz/4fkZEhaGQD7ZHTDZYeCuVHGUid+2Hw08KRdHAbRCyeLMuNmQlEWHxgoEDOk6jPCyTS7mcj49ArWX5FljL9PSLoLyi07cn05r/C3hzI3dDhiPIHgZ09hfL/JI1ZzbJNTiYgxCE//OfbqCCGtSbk1RwMUEqq7ieOcn9fsoLD7T4+enPLcy8Ckjhddu7GWfUsBI1NHj+oCCYVjful8NuYtB9INaRtOWxR2Ms4VmX6Oak55Fm3zhDbvI0866ZseeYfRCwY3kMns63YVpeWyOpI+t9WxowxhhUw7B6cL+cYzdDyIesMAj48fiCQsKs64bvXV3L1nMGgC08963DYaCn0eGcueP/c8vwV2aGcr5+9CK+Sb1+jDPQvmdr1o5kfw7KuK/EFmYLiSia/Zi/w=="
    },
    testing: {
        "credit-card-with-postal-code": "MIIECjCCAfKgAwIBAgIJAMkmlQ0vYkENMA0GCSqGSIb3DQEBCwUAMBYxFDASBgNVBAMTC3Rva2VuaXplcjoxMB4XDTIzMDUxMTEzMjEzNFoXDTI3MDUxMTEzMjEzNFowKTEnMCUGA1UEAxMeY3JlZGl0LWNhcmQtd2l0aC1wb3N0YWwtY29kZTo0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiotXQQc/jdiiE1pJJg6QAt0ocQIUrPoSos0IMgmSDTXNbP4+kPAk3dE8NuGne/QWU5hGmbfaBMS6fRYDEPYv2eo/Inaac9mluB6v06WRjDdu6HmXk3rqP6Du+v6P9jisLNkcNr4kH2FvlE5hIDh/qa0tHrhfUI7kRCj6tf1/ciuqj2U3OKNsTWxZAZfSFWUBihmX+vShZKipEnmi7SKPBBlHcs1rlpYh8KZYqFZiVKAU7hp0xo7x3L85YmXOec2baQZxp9UQcSzMiQbISX93LFsUgePVF4/+x7FLk/k83koCvwnwVTqsAeT8vYFh4rDrvF/GKUQOveGwT+xznQ8FjwIDAQABo0gwRjAMBgNVHRMBAf8EAjAAMDYGA1UdEQQvMC2kKzApMScwJQYDVQQDEx5jcmVkaXQtY2FyZC13aXRoLXBvc3RhbC1jb2RlOjQwDQYJKoZIhvcNAQELBQADggIBAGGr/RTU6gMqU+VHHtPadrYUSmtF3Tw50lqdjMM6gTb2wKNsihxa46Jf6REGagStlZLvC/DcJErUHvE+ChR//VlokCDX+/q1SRFyA+6ALRMpCEcpFP9F8OfI2mfDEpCDCFbKQhCCXplfzrfkCSYQxXLd7U7H11TSP4RuzoTdSWTn0JCF3MGa5D+s3CA9vVGh5b6+D+QRhCZXa5yvGrDrRL+Z+Wzp/p1AB4/d+PoUpaQ+SjhZx3sK104sBgAIuNaYgtoEN/idspmcUygd3BnlfF85EstifraOqMnLc2JvqZY1nVKddKsLfJstsFWJByUEkZz68QiKqJWhtqvI6sbLHM3u1J6qLJVp2Um3edcK0r5QBsuSVMnFxKgAen7eFO3idWNd7Y/SMikSsh9q2fUEbjIeP3SsOlF6exBRY36dORy+I9MAbEzx7WALn+N+3Jgt3CBBp/ktK/PHTXKLFQihwANk5y0/W/Sv9mCRkFg8HeWBkWmzeyGUONgiykdjLUNzD7WvrneOBcoxGaiYhPlHpAWq+yCsyRdTpULO0JyPpmGOPkilj23vwiQSwO2Nt+GQLZ8JbiDVLTNrYoFi5FRGTt4Cvnnpa3SlAwWQ9mRAZDOtGllw9vj889BkxlkSCuHYkwkyMNvKcz4cJ+W9e+eE8jyYEgKQxfAWvjKZr53KerrH",
        "credit-card-without-postal-code": "MIIEEDCCAfigAwIBAgIJAKXshvM/DO9wMA0GCSqGSIb3DQEBCwUAMBYxFDASBgNVBAMTC3Rva2VuaXplcjoxMB4XDTIzMDUxMTEzMjIxMFoXDTI3MDUxMTEzMjIxMFowLDEqMCgGA1UEAxMhY3JlZGl0LWNhcmQtd2l0aG91dC1wb3N0YWwtY29kZTo0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgl8fAFMk3lbDj7N7JQFpw5tpflGKGaMhQ9gm0QEWCTLo5JCsz79la3LpXxgABQaQesHVg4za7tC5GxbHWmOq+hPXk3ioVhM4Lqfuvx6HcVdUqNK6DjinncMTrnP8Frm4zLVl8ff/PZg0OdcskFtfQXFpZvWu8KqATgp96MRx4xrLKnTP/YdySHcuc7D1jM09GX44BxLXbQL114AVWpIMUXDgrESsY7PdnTzhUwNQ8iyE49sswSQMvGr4GJQ3ts/Ik4cO4BppYlutwdHAXhzfJJXZI5xWyVZjZeNfi4FR6CAaAEIiqLDVlV4FqWf1AsfOVp1JqMWfzUylSWza8+QOgwIDAQABo0swSTAMBgNVHRMBAf8EAjAAMDkGA1UdEQQyMDCkLjAsMSowKAYDVQQDEyFjcmVkaXQtY2FyZC13aXRob3V0LXBvc3RhbC1jb2RlOjQwDQYJKoZIhvcNAQELBQADggIBABhFVM6TTMDiyz2JmdXFkaeFhrRpnHL94vaEYtTJxZTquO+643bwcopUYuvTpE/Y+jdKp1BZFQ8XVjxr0BVEVMtXmJQPoDr35J9B6PqBPaxeALn4+ZQwyNMIWjMTOZjSxfDnAZDeXZENOzTmDQM+UJ+41eMzBlt0eiEZ2GF2BNFxno7LUALDn7bb745tL2uBg7vofQTxsy7uHFlPe7g/pUHTgrvO10YCkqe6a4EX868Ah4Ylzjbr8oS81wpXh/ERZWODRLNpqxkDHPu3H4wEoy3aTFgADOgoPfjF5WxkE+F9NoORwApnY5KUwYz6nV9Z1P7vwJU6uAXjTTxemA5rj47A12WpiHK4JCuNFOk/o1rAPpRALJ5HK4ZNVOOp2WDGWxwWPM6q4HDNEomAff6fXVRRJptNmVlGUFhwYTUu/6F06ftJPCnbmGspCIHi5hnuXhjN/1hiGaBe/8KiUJETnr1GQqutLn+K6EgE/oN4vfOlj+2xCRiRsjW7A3amnmHj57DamwlnstLHoKODMPdHaN9xDcSEDw1s1xHT0ttPg7M5+RAc2kLMAMwv2ag3EWiPLp3dk/mj3Woq2XY91v6RjCYD/41Cdp63L43zdE2niSBk7zg/iBSdCgP4Maz4b3tUJafovdqPAkx+NeV6wAH2cwOQfxeuO7UCFyp+XT73ICgT",
        cvv: "MIID8DCCAdigAwIBAgIJANxGdwjzuetmMA0GCSqGSIb3DQEBCwUAMBYxFDASBgNVBAMTC3Rva2VuaXplcjoxMB4XDTIzMDUxMTEzMjExMFoXDTI3MDUxMTEzMjExMFowHDEaMBgGA1UEAxMRY3JlZGl0LWNhcmQtY3Z2OjQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCHZGykp5NYRV5vydFQT22VMS50dkm+mPTsKT0iUd84g9YnaX8tA8CE+Lp7tkKGI56qUIjKTZX0XhH34gY9Nx10CdpruCxytsqY8wMewVPbzN75qa5+DMTaY11LP1mgrmD70h8jwdR3Dpk8z0TX/pDiZzILbKrkTSFEcwtSdCURUAmzNjue2S+4Etm8MbsH0Kde+HmHWTkr1eXn+FuOKc9kuM3Tu50OIhTB3DSPmDZ9xUkE22kn/mAnxBdodw0SYpbQ6fcBUxjowzmbXKWYnSE+rVDY3zm3t5fk0uGSmFloVNVUsPrN6/0ONyUWOOTiy/L5LedCAs1NeD4e8/qBJT+lAgMBAAGjOzA5MAwGA1UdEwEB/wQCMAAwKQYDVR0RBCIwIKQeMBwxGjAYBgNVBAMTEWNyZWRpdC1jYXJkLWN2djo0MA0GCSqGSIb3DQEBCwUAA4ICAQB8KanPwCRlhGzTYZIkX4Mn01dB4plPgUQ7NYWbPEAdPj2DrzuwfTVn7H0j5raR9oXWpyazKm4Im2elcMVMKKaleC4xxrHsjKbfrrgLG3DtJU2mrz6r2pAs62N8i2jK0Md+6CmBNQCFqy1YFqgrFcQI4tKdLUViLz5K1sNmbIf8Te++AXZ6E69/5aHXz7xYZVcYUqTHvKMgVzDBvFoxfcgtEjb/QIOcZ/mUW6nIBfxNonay1D7Ag3ua90PHrT+6r082xS9okgqX3UBsB9eYGpjJzxqpGaYd8JuUcSUwfTSDOPYVOSWB8MsTdCILgbUwgVlfroHQ4Pn9yWDNgq6Nx0h5eoSqpjNDDIsnX2OovkeCHllOADMX+J+FDZ6uNAqvLml8EUjeQvkfP1MdwGWHf6ZgzW3PvkcbrdQaSfQJd7i/HvxPp5TjfMza8RS8TSIOSDusL/ObEWGh4pGlvLcZQsMUQpq8I5GFu+z7IdgXh7xOj3xom0Cx6Mhe/t9m7x+UYi4aHZE81uYM35SMM7uVSyRquoJHcYyrW8bLdNrs02RjYjp09c5ltdwKZ1uIqRogwACbxd0sQpWwwZ9DziewUX0xnUvjdw96CteGzlQbC0o5xkJONUlCV2nmdnjqlsQg0ubolY7NV6H0C/bLJ3AB2a3b/0kuDBhzNZTSlIpAVotfQg==",
        kcpPin: "MIID+jCCAeKgAwIBAgIJAMJECk26ZRanMA0GCSqGSIb3DQEBCwUAMBYxFDASBgNVBAMTC3Rva2VuaXplcjoxMB4XDTIzMDUxMTEzMjIzMFoXDTI3MDUxMTEzMjIzMFowITEfMB0GA1UEAxMWY3JlZGl0LWNhcmQtcGFzc3dvcmQ6MzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALFUFcEo+HtR1nSqvrQAaHHGaKL18ivZEbA4fo9Zd8sGqz7BZuOyZLgz+IZ6pac045RW6jqrxGY75Nc3QZSIIN5qi5FzcXTFMQwmJA8F0JAzzthVEvbxT4a4o3uv5zFrxaeDwH5ifR3rMQmBgmnWfoHwbQnvNaeAAz1jo5y8c9ge+ThdBWaG3Dpuc8HJilO906sTuzU8vMzAmp7uvpysZ5+n8esfIdeXBklhq00k45ES4oGESUCKoFAENV2q/xXESEpbL5ooLo0P8EMxgfFYb5Hx1PgRBERnwezAtSxzn9oTF/8siNwqinwyv0rnujaKiuzo1kJt+kIY+rrPpSTobZ8CAwEAAaNAMD4wDAYDVR0TAQH/BAIwADAuBgNVHREEJzAlpCMwITEfMB0GA1UEAxMWY3JlZGl0LWNhcmQtcGFzc3dvcmQ6MzANBgkqhkiG9w0BAQsFAAOCAgEAIxFq8YWk07eLCkidma3HHTHV0oV0RjBJJGD27oZOruLWfO2EbiymBdKmm/ZcTxVfQ55V0+aBeCdae/g2zs2sc2aycFX5iFRiYlGlDWk5pVUKh16UMpBmkAaoLpejigWTOEEeb6aCcK/BADb5K764WlfSFcawreD4ET5mdQH+i607bICTjaOZl9GOH8Iohl95+Da0XZVAbqa3wTEVJHK/h5skDnO3jeYSsNONbdMC3fSCQ+wjWf5eAbDxdXnM+R5aMijpEHaQXjE0M58AGYeFjBVF7piO411lGBAa3f34UxBGYqIXMa2aYveURHEAQtP6QCJwB3F7mKZkv2Uj0rA2FoXYbKZn52RmvSj5tG6KPmW2VyfWuPRf+IPAQAOJx92KZYPRA9i6dZw6bQibvKUmIdKkp2SsS6J3K1DptIp28pkza4Tx5BPj+7cjm5P+V8zeT/ryjkXl77TSfK/Be+BYQRpXrgjFrNUAQXOUy5/e+61xgCvj9WRDLjR/8pTbcs4K0OH3JbGXVLcJZXy7sax7IHlqC7lZXq//UGfTK6rVgmEuibn17NlxmsaKRwBG5kmR3LR7PVP7xhXVfMQ9qf6t7v0rGQ596xBs+aSg0bZq1rQ0owUWtMikD3DqWnTF0t/SRzTbopqf7U1Wcu6/V5C7rbrAR0LCTSgy2fX2pE4KlwI="
    }
}
  , xu = [{
    field: "number",
    target: "cardNumber"
}, {
    field: "expiration_month",
    target: "cardExpirationMonth"
}, {
    field: "expiration_year",
    target: "cardExpirationYear"
}, {
    field: "cvv",
    target: "cardCode"
}]
  , Pu = [{
    field: "number",
    target: "card_number"
}, {
    field: "expiration_month",
    target: "expiration_month"
}, {
    field: "expiration_year",
    target: "expiration_year"
}, {
    field: "partial_number",
    target: "card_number"
}, {
    field: "kcpPin",
    target: "kcp_pin"
}];
function getUberSaveCard(t) {
    var r, s, d, u, A, _ = ((r = t.options) === null || r === void 0 ? void 0 : r.tenancy) || "production", D = window.Braintree.create(Ou[_].encryptionPublicKey), k = new Lu, g = {};
    if (xu.forEach(function(x) {
    var o = x.field
      , S = x.target;
    t[o] && (g[S] = D.encrypt(t[o]))
    }),
    (s = t.options) !== null && s !== void 0 && s.isBAV) {
    var i, a, y;
    if ((i = t.billing_address) !== null && i !== void 0 && i.street_address) {
        var U;
        g.billingAddressLine1 = D.encrypt((U = t.billing_address) === null || U === void 0 ? void 0 : U.street_address)
    }
    if ((a = t.billing_address) !== null && a !== void 0 && a.locality) {
        var e;
        g.billingCity = D.encrypt((e = t.billing_address) === null || e === void 0 ? void 0 : e.locality)
    }
    if ((y = t.billing_address) !== null && y !== void 0 && y.region) {
        var v;
        g.billingRegion = D.encrypt((v = t.billing_address) === null || v === void 0 ? void 0 : v.region)
    }
    }
    var B = {};
    Pu.forEach(function(x) {
    var o = x.field
      , S = x.target;
    t[o] && (B[S] = t[o])
    });
    var p = "credit-card-without-postal-code";
    if ((d = t.billing_address) !== null && d !== void 0 && d.postal_code) {
    var b;
    p = "credit-card-with-postal-code",
    B.postal_code = (b = t.billing_address) === null || b === void 0 ? void 0 : b.postal_code
    }
    if (t != null && t.partial_number) {
    var w, M;
    (w = t.options) !== null && w !== void 0 && w.numberSuffix && (B.card_number += t.options.numberSuffix),
    (M = t.options) !== null && M !== void 0 && M.namespace && (p = t.options.namespace)
    }
    var N = {
    card: k.encrypt(JSON.stringify(B), Ar[_][p]).payload,
    cardNamespace: p,
    verification: k.encrypt(JSON.stringify({
        cvv: t.cvv || ""
    }), Ar[_].cvv).payload,
    verificationNamespace: "credit-card-cvv"
    }, O;
    return t.kcpPin && (O = {
        cardPin: k.encrypt(JSON.stringify({
            password: t.kcpPin
        }), Ar[_].kcpPin).payload,
        cardPinNamespace: "credit-card-password"
    }), {
        braintree: g,
        uber: N,
        postalCode: (u = t.billing_address) === null || u === void 0 ? void 0 : u.postal_code,
        lastFour: (A = t.number) === null || A === void 0 ? void 0 : A.slice(-4),
        kcp: O
    }

}


module.exports = {
    getUberSaveCard
};

//
// console.log(ku({
//     "number": "4719278565887565",
//     "cvv": "413",
//     "expiration_month": "02",
//     "expiration_year": "2026",
//     "options": {
//         "tenancy": "production"
//     }
// }))