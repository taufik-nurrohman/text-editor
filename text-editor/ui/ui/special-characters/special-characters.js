/*!
 * ===========================================================
 *  SPECIAL CHARACTERS PLUGIN FOR USER INTERFACE MODULE 1.1.0
 * ===========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * -----------------------------------------------------------
 */

(function(win, doc) {

    var once = 1,
        maps = [
            [
                ["Recently Used", ""],
                []
            ],
            [
                ["All Symbols", "\u2756"],
                [
                    ["&quot;", "QUOTATION MARK", "&quot;"],
                    ["&amp;", "AMPERSAND", "&amp;"],
                    ["&apos;", "APOSTROPHE", "&apos;"],
                    ["&lt;", "LESS-THAN SIGN", "&lt;"],
                    ["&gt;", "GREATER-THAN SIGN", "&gt;"],
                    ["&iexcl;", "INVERTED EXCLAMATION MARK"],
                    ["&cent;", "CENT SIGN"],
                    ["&pound;", "POUND SIGN"],
                    ["&curren;", "CURRENCY SIGN"],
                    ["&yen;", "YEN SIGN"],
                    ["&brvbar;", "BROKEN BAR"],
                    ["&sect;", "SECTION SIGN"],
                    ["&uml;", "DIAERESIS"],
                    ["&copy;", "COPYRIGHT SYMBOL"],
                    ["&ordf;", "FEMININE ORDINAL INDICATOR"],
                    ["&laquo;", "LEFT-POINTING DOUBLE ANGLE QUOTATION MARK"],
                    ["&not;", "NOT SIGN"],
                    ["&shy;", "SOFT HYPHEN"],
                    ["&reg;", "REGISTERED SIGN"],
                    ["&macr;", "MACRON"],
                    ["&deg;", "DEGREE SYMBOL"],
                    ["&plusmn;", "PLUS-MINUS SIGN"],
                    ["&sup2;", "SUPERSCRIPT TWO"],
                    ["&sup3;", "SUPERSCRIPT THREE"],
                    ["&acute;", "ACUTE ACCENT"],
                    ["&micro;", "MICRO SIGN"],
                    ["&para;", "PILCROW SIGN"],
                    ["&middot;", "MIDDLE DOT"],
                    ["&cedil;", "CEDILLA"],
                    ["&sup1;", "SUPERSCRIPT ONE"],
                    ["&ordm;", "MASCULINE ORDINAL INDICATOR"],
                    ["&raquo;", "RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK"],
                    ["&frac14;", "VULGAR FRACTION ONE QUARTER"],
                    ["&frac12;", "VULGAR FRACTION ONE HALF"],
                    ["&frac34;", "VULGAR FRACTION THREE QUARTERS"],
                    ["&iquest;", "INVERTED QUESTION MARK"],
                    ["&Agrave;", "LATIN CAPITAL LETTER A WITH GRAVE ACCENT"],
                    ["&Aacute;", "LATIN CAPITAL LETTER A WITH ACUTE ACCENT"],
                    ["&Acirc;", "LATIN CAPITAL LETTER A WITH CIRCUMFLEX"],
                    ["&Atilde;", "LATIN CAPITAL LETTER A WITH TILDE"],
                    ["&Auml;", "LATIN CAPITAL LETTER A WITH DIAERESIS"],
                    ["&Aring;", "LATIN CAPITAL LETTER A WITH RING ABOVE"],
                    ["&AElig;", "LATIN CAPITAL LETTER AE"],
                    ["&Ccedil;", "LATIN CAPITAL LETTER C WITH CEDILLA"],
                    ["&Egrave;", "LATIN CAPITAL LETTER E WITH GRAVE ACCENT"],
                    ["&Eacute;", "LATIN CAPITAL LETTER E WITH ACUTE ACCENT"],
                    ["&Ecirc;", "LATIN CAPITAL LETTER E WITH CIRCUMFLEX"],
                    ["&Euml;", "LATIN CAPITAL LETTER E WITH DIAERESIS"],
                    ["&Igrave;", "LATIN CAPITAL LETTER I WITH GRAVE ACCENT"],
                    ["&Iacute;", "LATIN CAPITAL LETTER I WITH ACUTE ACCENT"],
                    ["&Icirc;", "LATIN CAPITAL LETTER I WITH CIRCUMFLEX"],
                    ["&Iuml;", "LATIN CAPITAL LETTER I WITH DIAERESIS"],
                    ["&ETH;", "LATIN CAPITAL LETTER ETH"],
                    ["&Ntilde;", "LATIN CAPITAL LETTER N WITH TILDE"],
                    ["&Ograve;", "LATIN CAPITAL LETTER O WITH GRAVE ACCENT"],
                    ["&Oacute;", "LATIN CAPITAL LETTER O WITH ACUTE ACCENT"],
                    ["&Ocirc;", "LATIN CAPITAL LETTER O WITH CIRCUMFLEX"],
                    ["&Otilde;", "LATIN CAPITAL LETTER O WITH TILDE"],
                    ["&Ouml;", "LATIN CAPITAL LETTER O WITH DIAERESIS"],
                    ["&times;", "MULTIPLICATION SIGN"],
                    ["&Oslash;", "LATIN CAPITAL LETTER O WITH STROKE"],
                    ["&Ugrave;", "LATIN CAPITAL LETTER U WITH GRAVE ACCENT"],
                    ["&Uacute;", "LATIN CAPITAL LETTER U WITH ACUTE ACCENT"],
                    ["&Ucirc;", "LATIN CAPITAL LETTER U WITH CIRCUMFLEX"],
                    ["&Uuml;", "LATIN CAPITAL LETTER U WITH DIAERESIS"],
                    ["&Yacute;", "LATIN CAPITAL LETTER Y WITH ACUTE ACCENT"],
                    ["&THORN;", "LATIN CAPITAL LETTER THORN"],
                    ["&szlig;", "LATIN SMALL LETTER SHARP S"],
                    ["&agrave;", "LATIN SMALL LETTER A WITH GRAVE ACCENT"],
                    ["&aacute;", "LATIN SMALL LETTER A WITH ACUTE ACCENT"],
                    ["&acirc;", "LATIN SMALL LETTER A WITH CIRCUMFLEX"],
                    ["&atilde;", "LATIN SMALL LETTER A WITH TILDE"],
                    ["&auml;", "LATIN SMALL LETTER A WITH DIAERESIS"],
                    ["&aring;", "LATIN SMALL LETTER A WITH RING ABOVE"],
                    ["&aelig;", "LATIN SMALL LETTER AE"],
                    ["&ccedil;", "LATIN SMALL LETTER C WITH CEDILLA"],
                    ["&egrave;", "LATIN SMALL LETTER E WITH GRAVE ACCENT"],
                    ["&eacute;", "LATIN SMALL LETTER E WITH ACUTE ACCENT"],
                    ["&ecirc;", "LATIN SMALL LETTER E WITH CIRCUMFLEX"],
                    ["&euml;", "LATIN SMALL LETTER E WITH DIAERESIS"],
                    ["&igrave;", "LATIN SMALL LETTER I WITH GRAVE ACCENT"],
                    ["&iacute;", "LATIN SMALL LETTER I WITH ACUTE ACCENT"],
                    ["&icirc;", "LATIN SMALL LETTER I WITH CIRCUMFLEX"],
                    ["&iuml;", "LATIN SMALL LETTER I WITH DIAERESIS"],
                    ["&eth;", "LATIN SMALL LETTER ETH"],
                    ["&ntilde;", "LATIN SMALL LETTER N WITH TILDE"],
                    ["&ograve;", "LATIN SMALL LETTER O WITH GRAVE ACCENT"],
                    ["&oacute;", "LATIN SMALL LETTER O WITH ACUTE ACCENT"],
                    ["&ocirc;", "LATIN SMALL LETTER O WITH CIRCUMFLEX"],
                    ["&otilde;", "LATIN SMALL LETTER O WITH TILDE"],
                    ["&ouml;", "LATIN SMALL LETTER O WITH DIAERESIS"],
                    ["&divide;", "DIVISION SIGN"],
                    ["&oslash;", "LATIN SMALL LETTER O WITH STROKE"],
                    ["&ugrave;", "LATIN SMALL LETTER U WITH GRAVE ACCENT"],
                    ["&uacute;", "LATIN SMALL LETTER U WITH ACUTE ACCENT"],
                    ["&ucirc;", "LATIN SMALL LETTER U WITH CIRCUMFLEX"],
                    ["&uuml;", "LATIN SMALL LETTER U WITH DIAERESIS"],
                    ["&yacute;", "LATIN SMALL LETTER Y WITH ACUTE ACCENT"],
                    ["&thorn;", "LATIN SMALL LETTER THORN"],
                    ["&yuml;", "LATIN SMALL LETTER Y WITH DIAERESIS"],
                    ["&OElig;", "LATIN CAPITAL LIGATURE OE"],
                    ["&oelig;", "LATIN SMALL LIGATURE OE"],
                    ["&Scaron;", "LATIN CAPITAL LETTER S WITH CARON"],
                    ["&scaron;", "LATIN SMALL LETTER S WITH CARON"],
                    ["&Yuml;", "LATIN CAPITAL LETTER Y WITH DIAERESIS"],
                    ["&fnof;", "LATIN SMALL LETTER F WITH HOOK"],
                    ["&circ;", "MODIFIER LETTER CIRCUMFLEX ACCENT"],
                    ["&tilde;", "SMALL TILDE"],
                    ["&Alpha;", "GREEK CAPITAL LETTER ALPHA"],
                    ["&Beta;", "GREEK CAPITAL LETTER BETA"],
                    ["&Gamma;", "GREEK CAPITAL LETTER GAMMA"],
                    ["&Delta;", "GREEK CAPITAL LETTER DELTA"],
                    ["&Epsilon;", "GREEK CAPITAL LETTER EPSILON"],
                    ["&Zeta;", "GREEK CAPITAL LETTER ZETA"],
                    ["&Eta;", "GREEK CAPITAL LETTER ETA"],
                    ["&Theta;", "GREEK CAPITAL LETTER THETA"],
                    ["&Iota;", "GREEK CAPITAL LETTER IOTA"],
                    ["&Kappa;", "GREEK CAPITAL LETTER KAPPA"],
                    ["&Lambda;", "GREEK CAPITAL LETTER LAMBDA"],
                    ["&Mu;", "GREEK CAPITAL LETTER MU"],
                    ["&Nu;", "GREEK CAPITAL LETTER NU"],
                    ["&Xi;", "GREEK CAPITAL LETTER XI"],
                    ["&Omicron;", "GREEK CAPITAL LETTER OMICRON"],
                    ["&Pi;", "GREEK CAPITAL LETTER PI"],
                    ["&Rho;", "GREEK CAPITAL LETTER RHO"],
                    ["&Sigma;", "GREEK CAPITAL LETTER SIGMA"],
                    ["&Tau;", "GREEK CAPITAL LETTER TAU"],
                    ["&Upsilon;", "GREEK CAPITAL LETTER UPSILON"],
                    ["&Phi;", "GREEK CAPITAL LETTER PHI"],
                    ["&Chi;", "GREEK CAPITAL LETTER CHI"],
                    ["&Psi;", "GREEK CAPITAL LETTER PSI"],
                    ["&Omega;", "GREEK CAPITAL LETTER OMEGA"],
                    ["&alpha;", "GREEK SMALL LETTER ALPHA"],
                    ["&beta;", "GREEK SMALL LETTER BETA"],
                    ["&gamma;", "GREEK SMALL LETTER GAMMA"],
                    ["&delta;", "GREEK SMALL LETTER DELTA"],
                    ["&epsilon;", "GREEK SMALL LETTER EPSILON"],
                    ["&zeta;", "GREEK SMALL LETTER ZETA"],
                    ["&eta;", "GREEK SMALL LETTER ETA"],
                    ["&theta;", "GREEK SMALL LETTER THETA"],
                    ["&iota;", "GREEK SMALL LETTER IOTA"],
                    ["&kappa;", "GREEK SMALL LETTER KAPPA"],
                    ["&lambda;", "GREEK SMALL LETTER LAMBDA"],
                    ["&mu;", "GREEK SMALL LETTER MU"],
                    ["&nu;", "GREEK SMALL LETTER NU"],
                    ["&xi;", "GREEK SMALL LETTER XI"],
                    ["&omicron;", "GREEK SMALL LETTER OMICRON"],
                    ["&pi;", "GREEK SMALL LETTER PI"],
                    ["&rho;", "GREEK SMALL LETTER RHO"],
                    ["&sigmaf;", "GREEK SMALL LETTER FINAL SIGMA"],
                    ["&sigma;", "GREEK SMALL LETTER SIGMA"],
                    ["&tau;", "GREEK SMALL LETTER TAU"],
                    ["&upsilon;", "GREEK SMALL LETTER UPSILON"],
                    ["&phi;", "GREEK SMALL LETTER PHI"],
                    ["&chi;", "GREEK SMALL LETTER CHI"],
                    ["&psi;", "GREEK SMALL LETTER PSI"],
                    ["&omega;", "GREEK SMALL LETTER OMEGA"],
                    ["&thetasym;", "GREEK THETA SYMBOL"],
                    ["&upsih;", "GREEK UPSILON WITH HOOK SYMBOL"],
                    ["&piv;", "GREEK PI SYMBOL"],
                    ["&ndash;", "EN DASH"],
                    ["&mdash;", "EM DASH"],
                    ["&lsquo;", "LEFT SINGLE QUOTATION MARK"],
                    ["&rsquo;", "RIGHT SINGLE QUOTATION MARK"],
                    ["&sbquo;", "SINGLE LOW-9 QUOTATION MARK"],
                    ["&ldquo;", "LEFT DOUBLE QUOTATION MARK"],
                    ["&rdquo;", "RIGHT DOUBLE QUOTATION MARK"],
                    ["&bdquo;", "DOUBLE LOW-9 QUOTATION MARK"],
                    ["&dagger;", "DAGGER, OBELISK"],
                    ["&Dagger;", "DOUBLE DAGGER, DOUBLE OBELISK"],
                    ["&bull;", "BULLET"],
                    ["&hellip;", "HORIZONTAL ELLIPSIS"],
                    ["&permil;", "PER MILLE SIGN"],
                    ["&prime;", "PRIME"],
                    ["&Prime;", "DOUBLE PRIME"],
                    ["&lsaquo;", "SINGLE LEFT-POINTING ANGLE QUOTATION MARK"],
                    ["&rsaquo;", "SINGLE RIGHT-POINTING ANGLE QUOTATION MARK"],
                    ["&oline;", "OVERLINE"],
                    ["&frasl;", "FRACTION SLASH"],
                    ["&euro;", "EURO SIGN"],
                    ["&image;", "BLACK-LETTER CAPITAL I"],
                    ["&weierp;", "SCRIPT CAPITAL P"],
                    ["&real;", "BLACK-LETTER CAPITAL R"],
                    ["&trade;", "TRADEMARK SYMBOL"],
                    ["&alefsym;", "ALEF SYMBOL"],
                    ["&larr;", "LEFTWARDS ARROW"],
                    ["&uarr;", "UPWARDS ARROW"],
                    ["&rarr;", "RIGHTWARDS ARROW"],
                    ["&darr;", "DOWNWARDS ARROW"],
                    ["&harr;", "LEFT RIGHT ARROW"],
                    ["&crarr;", "DOWNWARDS ARROW WITH CORNER LEFTWARDS"],
                    ["&lArr;", "LEFTWARDS DOUBLE ARROW"],
                    ["&uArr;", "UPWARDS DOUBLE ARROW"],
                    ["&rArr;", "RIGHTWARDS DOUBLE ARROW"],
                    ["&dArr;", "DOWNWARDS DOUBLE ARROW"],
                    ["&hArr;", "LEFT RIGHT DOUBLE ARROW"],
                    ["&forall;", "FOR ALL"],
                    ["&part;", "PARTIAL DIFFERENTIAL"],
                    ["&exist;", "THERE EXISTS"],
                    ["&empty;", "EMPTY SET"],
                    ["&nabla;", "NABLA"],
                    ["&isin;", "ELEMENT OF"],
                    ["&notin;", "NOT AN ELEMENT OF"],
                    ["&ni;", "CONTAINS AS MEMBER"],
                    ["&prod;", "N-ARY PRODUCT"],
                    ["&sum;", "N-ARY SUMMATION"],
                    ["&minus;", "MINUS SIGN"],
                    ["&lowast;", "ASTERISK OPERATOR"],
                    ["&radic;", "SQUARE ROOT"],
                    ["&prop;", "PROPORTIONAL TO"],
                    ["&infin;", "INFINITY"],
                    ["&ang;", "ANGLE"],
                    ["&and;", "LOGICAL AND"],
                    ["&or;", "LOGICAL OR"],
                    ["&cap;", "INTERSECTION"],
                    ["&cup;", "UNION"],
                    ["&int;", "INTEGRAL"],
                    ["&there4;", "THEREFORE SIGN"],
                    ["&sim;", "TILDE OPERATOR"],
                    ["&cong;", "CONGRUENT TO"],
                    ["&asymp;", "ALMOST EQUAL TO"],
                    ["&ne;", "NOT EQUAL TO"],
                    ["&equiv;", "IDENTICAL TO / EQUIVALENT TO"],
                    ["&le;", "LESS-THAN OR EQUAL TO"],
                    ["&ge;", "GREATER-THAN OR EQUAL TO"],
                    ["&sub;", "SUBSET OF"],
                    ["&sup;", "SUPERSET OF"],
                    ["&nsub;", "NOT A SUBSET OF"],
                    ["&sube;", "SUBSET OF OR EQUAL TO"],
                    ["&supe;", "SUPERSET OF OR EQUAL TO"],
                    ["&oplus;", "CIRCLED PLUS"],
                    ["&otimes;", "CIRCLED TIMES"],
                    ["&perp;", "UP TACK"],
                    ["&sdot;", "DOT OPERATOR"],
                    ["&lceil;", "LEFT CEILING"],
                    ["&rceil;", "RIGHT CEILING"],
                    ["&lfloor;", "LEFT FLOOR"],
                    ["&rfloor;", "RIGHT FLOOR"],
                    ["&lang;", "LEFT-POINTING ANGLE BRACKET"],
                    ["&rang;", "RIGHT-POINTING ANGLE BRACKET"],
                    ["&loz;", "LOZENGE"],
                    ["&spades;", "BLACK SPADE SUIT"],
                    ["&clubs;", "BLACK CLUB SUIT"],
                    ["&hearts;", "BLACK HEART SUIT"],
                    ["&diams;", "BLACK DIAMOND SUIT"]
                ]
            ],
            [
                ["White\u2013Spaces", "\u2423"],
                [
                    ["&nbsp;", "NO-BREAK SPACE", "&nbsp;"],
                    ["&ensp;", "EN SPACE", "&ensp;"],
                    ["&emsp;", "EM SPACE", "&emsp;"],
                    ["&thinsp;", "THIN SPACE", "&thinsp;"],
                    ["&zwnj;", "ZERO-WIDTH NON-JOINER", "&zwnj;"],
                    ["&zwj;", "ZERO-WIDTH JOINER", "&zwj;"],
                    ["&lrm;", "LEFT-TO-RIGHT MARK", "&lrm;"],
                    ["&rlm;", "RIGHT-TO-LEFT MARK", "&rlm;"]
                ]
            ]
        ];

    TE.each(function($) {

        var head = doc.head,
            uniq = '-' + Date.now(),
            config = $.config,
            prefix = config.classes[""],
            prefix_i = config.classes.i.split(' ')[0],
            ui = $.ui,

            symbol = 'symbol',

            is_string = TE.is.s,

            _ = $._,
            _css = _.css,
            _dom = _.dom,
            _dom_append = _dom.append,
            _dom_content_get = _dom.content.get,
            _dom_data_get = _dom.data.get,
            _el = _.el,
            _events = _.events,
            _extend = _.extend,
            _timer_set = _.timer.set,
            _trim = _.trim,

            h = '.' + prefix + '-drop.' + symbol + uniq,
            style_once = _el('style', '@font-face{font-family:' + prefix_i + '-' + symbol + ';src:url(data:application/octet-stream;base64,d09GRgABAAAAAAS8AAsAAAAAB5wAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIwleU9TLzIAAAFEAAAAQgAAAFZAiUrnY21hcAAAAYgAAABKAAABcOEoo6pnbHlmAAAB1AAAALQAAAC0hYhWqmhlYWQAAAKIAAAALQAAADYPHaTXaGhlYQAAArgAAAAbAAAAJA0CBgNobXR4AAAC1AAAAAgAAAAIDgAAAGxvY2EAAALcAAAABgAAAAYAWgAAbWF4cAAAAuQAAAAeAAAAIAENAERuYW1lAAADBAAAAZgAAANRadLY2nBvc3QAAAScAAAAHwAAADDj/W5qeJxjYGRgYOBiMGCwY2DKSSzJY+BzcfMJYZBiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCAClZBUgAeJxjYGRnYJzAwMrAwFLI8oyBgeEXhGaOYQhnPMfAwMTAysyAFQSkuaYwODxgeMDAxvCfgWEhGwMjSBhMAAD3awrzAAB4nO2QsQ2AMBADz8pDgRiBKjWzULG/2CT5GNgils6ST189sAAlOZMA3YiRK63sC5t9UH0Twz+09nfucKOVmd19fMu/ekEdGiYJUQAAAAEAAP8ABwAGAAA3AAAFITcRIRE+ATc2NTQnLgEnJiIHDgEHBhUUFx4BFxEhERchNS4BJyYQNz4BNzYgFx4BFxYQBw4BBwTQAcBw/WBysjEzMC+rbnP6c26rLzAzMbJy/WBwAcCk/kZIRkT4oacBbKeh+ERGSEb+pCDg/kABdzG+fIGNin14uDI0NDK4eH2KjYF8vjH+iQHA4Dk62o6TAUKRjdk7Pj472Y2R/r6Tjto6AAAAeJxjYGRgYADiO5xFavH8Nl8ZuNkZQOBKve5bBP2fgZ2BDcTlYGACUQAOxQkhAAAAeJxjYGRgYGP4z8DAwM7AACEZGVABEwAgPgEYAAcAAAAHAAAAAAAAAABaAAB4nGNgZGBgYGKwYADRIBYDAxcQMjD8B/MZAA4PAVIAAHicjZHPSsNAEId/aWtFCx4UPO9JWqTpH9CDXoSCehGhh963cZumJNmyu7X05juITyP4Dr6Ar+HVX9JVRCq0Je0338wssxMAh/hAgPXnjM+aAxwxWnMFu7j1XKW/91wjjz3voIGF5zr9k+d9nOLZc4P+jScEtT1GM7x7DnASXHqu4CCQnqv02nON/OJ5B8fBq+c6/fc5+xgFn54bOKncDfR8ZZJ46kRz0BL9bu9cjFdCUyW5TIVcuKk2VlyJic6dSlMdRjoruC2XyupMtaOFdTobqniRSrMhs0GNlLGJzkUv7G7I3qhcGenUQzGJfYz7zk3ExOhMXPsZxNzomYpcOHVuftHp/J4NA2jMsYJBghhTOAg0aVv876OLHs5JY1YIVq6rEuSQSGkkX5FjV5GxjK/4TBjltIoVKTlExN/sx7fZtWTWllYxjniKZaaIhzQx45RVZsue7apGNMWUSVkteLOQ99uu94YmL/tlebOHn51YPHLePq3jWcXtTdkhcP1nD4J7LnIzmog+LLftaC/Q4fefvX0BKiOpgnicY2BigABBBuyAiZGJkZmBrbgyNyk/h4EBABItArkA)format(\'woff\')}.' + prefix_i + '-' + symbol + ':before{content:\'\\e000\';font-family:' + prefix_i + '-' + symbol + '}', {
                'id': prefix + ':style-' + symbol
            }),
            style = _el('style', false, {
                'id': prefix + ':style-' + symbol + uniq
            }),

            i, j, k, l, m, n, o, p, q, r;

        if (!config[symbol]) return;

        _dom_append(head, style);
        if (once) {
            _dom_append(head, style_once);
            once = 0;
        }

        config.languages.tools[symbol] = ['Special Characters', '\u2318+*'];
        config[symbol] = _extend(maps, config[symbol] === true ? {} : config[symbol]);

        function do_click(e) {
            i = this;
            j = _dom_content_get(i);
            k = _dom_data_get(i, 'text');
            l = config[symbol][0]; // recent symbol ...
            n = 0;
            q = o.before;
            r = o.after;
            o = !_trim(q) || q.slice(-1) === '\n';
            p = !_trim(r) || r[0] === '\n';
            for (m in l[1]) {
                if (l[1][m][0] === j) {
                    n = 1; // check for duplicate recent item ...
                    break;
                }
            }
            if (!n) {
                l[1].unshift([j, i.title, k]);
                l[1] = l[1].slice(0, 20); // maximum of recent symbol are 20
            }
            return $.trim(o ? false : ' ', p ? false : "").insert((k || j) + (p ? "" : ' '), 0, 1), _events.x(e);
        }

        function do_key(e) {
            var next = _dom.next,
                previous = _dom.previous,
                parent = _dom.parent,
                index = _dom.index,
                get = _dom.get;
            j = this;
            k = e.TE.key;
            l = get('div > a:first-child', ui.el.drop);
            if (k('escape')) return ui.exit(1), _events.x(e);
            if (k('f10')) return ui.exit(), ui.drop.target.focus(), _events.x(e);
            if (
                k('right') && (m = (next(j) || get('a:first-child', next(parent(j)))[0] || l[0])) ||
                k('left') && (m = (previous(j) || get('a:last-child', previous(parent(j)))[0] || l[0])) ||
                k('down') && (m = (get('a', parent(j))[index(j) + 10] || get('a:first-child', next(parent(j)))[0] || l[0])) ||
                k('up') && (m = (get('a', parent(j))[index(j) - 10] || get('a:last-child', previous(parent(j)))[0] || l[0])) ||
                k('page-down') && (m = (get('a', next(parent(j)))[0] || l[0])) ||
                k('up') && (m = (get('a', previous(parent(j)))[0] || l.pop()))
            ) {
                return m.focus(), _events.x(e);
            }
        }

        if (config.tools) {

            ui.tool(symbol, {
                i: 'at',
                click: function(e, $) {
                    ui.drop.target = ui.tools[symbol].target;
                    return ui.drop(symbol + ' ' + symbol + uniq, function(drop) {
                        o = $.$();
                        p = config[symbol];
                        q = _css(drop, ['background-color', 'color', 'padding-top']);
                        r = _dom.children;
                        _el(style, h + '{max-height:20em;overflow:auto}' + h + ' div{max-width:20em;margin:0 0 ' + q[2] + 'px;border-color:inherit;font-size:100%;overflow:hidden}' + h + ' div[title]:before{content:attr(title);display:block;padding:.5em;background:' + q[0] + ';border-bottom:1px solid;margin-bottom:' + q[2] + 'px;border-color:inherit}' + h + ' a{float:left;width:10%;height:1.8785714285714286em;line-height:1.8785714285714286em;text-align:center;background:rgba(0,0,0,.025);color:inherit;text-decoration:none;overflow:hidden;white-space:nowrap;font-family:serif}' + h + ' a img{display:block;width:60%;height:60%;max-width:none;max-height:none;min-width:0;min-height:0;margin:20%;background:0 0;border:0;outline:0;box-shadow:none;border-radius:0}' + h + ':hover a:focus{background:rgba(0,0,0,.025);color:inherit}' + h + ' a:focus,' + h + ' a:hover,' + h + ':hover a:hover{outline:0;background:' + q[1] + ';color:' + q[0] + '}');
                        for (i in p) {
                            if (!p[i] || !p[i][1] || !(k = p[i])[1].length) continue;
                            l = _el('div', false, {
                                'title': (k[0] || [])[0] || null
                            });
                            for (j in k[1]) {
                                if (!(n = k[1][j])) continue;
                                n = is_string(n) ? [n] : n;
                                m = _el('a', n[0], {
                                    'href': 'javascript:;',
                                    'title': n[1] || null,
                                    'data': {
                                        'text': n[2] || null
                                    }
                                });
                                _events.set("click", m, do_click);
                                _events.set("keydown", m, do_key);
                                _dom_append(l, m);
                            }
                            _dom_append(drop, l);
                        }
                        _timer_set(function() {
                            r(r(drop)[0])[0].focus();
                        }, 1);
                    }), false;
                }
            });

            _events.set("keydown", ui.tools[symbol].target, function(e) {
                if (e.TE.key('arrowdown')) {
                    return _timer_set(function() {
                        _dom.get('a', ui.el.drop)[0].focus();
                    }), _events.fire("click", this, [e]), _events.x(e);
                }
            });

        }

        // press `control+$` for "symbol"
        ui.key('control+*', symbol);
        ui.key('control+8', symbol);
        ui.key('control+shift+*', symbol);

    });

})(window, document);