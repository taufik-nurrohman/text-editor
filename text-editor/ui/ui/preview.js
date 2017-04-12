/*!
 * ==========================================================
 *  HELP PANEL PLUGIN FOR USER INTERFACE MODULE 0.1.0
 * ==========================================================
 * Author: Taufik Nurrohman <https://github.com/tovic>
 * License: MIT
 * ----------------------------------------------------------
 */

(function(win, doc) {

    var once = 1;

    TE.each(function($) {

        var ui = $.ui,
            _ = $._,
            config = $.config,
            tools = config.languages.tools,
            prefix = config.classes[""],
            prefix_i = config.classes.i.split(' ')[0],
            preview = 'preview',
            i, j, k;

        if (once) {
            _.dom.append(doc.head, _.el('style', '@font-face{font-family:' + prefix_i + '-' + help + ';src:url(data:application/octet-stream;base64,d09GRgABAAAAAATkAAsAAAAAB7AAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIwleU9TLzIAAAFEAAAAQgAAAFZAiUpnY21hcAAAAYgAAABKAAABcOEoo6pnbHlmAAAB1AAAAM0AAADU1KHLN2hlYWQAAAKkAAAALwAAADYPHo+haGhlYQAAAtQAAAAdAAAAJA0DBgJobXR4AAAC9AAAAAgAAAAIDP8AAGxvY2EAAAL8AAAABgAAAAYAagAAbWF4cAAAAwQAAAAgAAAAIAEPAFJuYW1lAAADJAAAAZ0AAANFQMW/AHBvc3QAAATEAAAAHQAAAC5pfW12eJxjYGRgYOBiMGCwY2DKSSzJY+BzcfMJYZBiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCAClZBUgAeJxjYGRrYJzAwMrAwFLI8oyBgeEXhGaOYQhnPMfAwMTAysyAFQSkuaYwODxgeMDAxvCfgWEhGwMjSBhMAAAgpgtyAAB4nO2QsQ2AMBADz8pDgRiBKjWzULG/2CT5GNgils6ST189sAAlOZMA3YiRK63sC5t9UH0Twz+09nfucKOVmd19fMu/ekEdGiYJUQAAeJxjYGZg+F/PxsDayMDPYMHgysCgamqips2oxCbLKCJmzWhkxmiix6isxM4mzyhmbGRux2hsJMYuwsbOxyguClFgamLHyirCxKLDyCQgpMPIIsTcIMR3gE8ITDAy5K0I+9zAL97CziPAaepsYuDDqGFgn8UIltVxULJSkGBsOPdvwb+YfwvOnWNMYFzCmHBuAUy7ENO6iGlBVyWEUth4XAxMFNX0xGTKnFRAssI2amIGBh6TL/5bcIHpDGMK4zzGlDNMF/4tYAAAifswVAAAAHicY2BkYGAA4rZTL0Xi+W2+MnCzM4DAlfrFQQj6fz07A2sjkMvBwAQSBQA54gqmAHicY2BkYGBj+M/AwMAOxP//A0mgCApgAgBLEwMWAAAABwAAAAX/AAAAAAAAAGoAAAABAAAAAgBGAAMAAAAAAAIAAAAKAAoAAAD/AAAAAAAAeJyNkM1Kw0AUhU9qW7EFFwquZyGiSNIfUMFVpWB3Llx048bYTpMpaSZMpsUufATxWdz6Aq58BV/Al/AkHUQsQhMy95tzf3LvBbCHT3hYPWf8VuxRP3NcwTYGjreo3ziuku8d19CEcVyn/uS4gVO8OG5iH2+s4FV3eJviw7GHQ+/CcQW73p3jLerKcZX87LiGA+/VcZ36u+MGht6X4yaOKld9nS2NimIrjvsnotvunIuHpdCUVBomIpzbWJtc9MREp1YmiQ5Gemblo/XlWFltfOXHMsluZTRPQrPuWFeG0uRKp6ITtNedA5lKE1o5LrrIF1HX2omYGD0T1+7/IjN6Kkc2iK3NLlut332hD40MS65ZIUIMC4Fjqie0XbTRwTnpgRGCkasohRQhEioh5syIS0/Oe4/fhLeUqmREQg4w4jkrlUeePu2YNWyZ5ZN8ViiiM9zSRqyZsLLZKGOTmCFt0Z8qOxOcKeBkm2QOaNMyOyzjxz+7yLFgp12qlhMXU5tySoHrP/ML1il8Uyoj6kG5ZUv1Ei2+/+zrGzA+o1wAAAB4nGNgYoAAQQbsgImRiZGZgSUjNaeAgQEACuMBygAAAA==)format(\'woff\')}.' + prefix_i + '-' + help + ':before{content:\'\\e000\';font-family:' + prefix_i + '-' + help + '}', {
                'id': prefix + ':style-' + help
            }));
            once = 0;
        }

        tools[preview] = ['Preview', 'F8'];

        if (config.tools) {
            ui.tool(preview, {
                click: function(e, $) {
                    if (_.dom.parent(ui.el.panel)) {
                        ui.panel.exit(1);
                    } else {
                        ui.panel(preview, '<h2>foo</h2>', 0, preview);
                    }
                    return $.select(), false;
                }
            });
        }

        // press `f8` for "preview"
        ui.key('f1', preview);

    });

})(window, document);