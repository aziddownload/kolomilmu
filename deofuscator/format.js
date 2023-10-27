/**
 * @name  Decode Azid Blogger
 * @description  JavaScript Deobfuscator and Unpacker
 * @author  azidblogger
 * @version  1.6.2
 * @copyright  azidblogger
 * @license  MIT
 */

self.addEventListener('message', function (e) {
    var source = e.data.source;

    self._window = self.window;
    self.window = {};

    self.importScripts('/deofuscator/beautify.js');

    source = self.window.js_beautify(source, {
        unescape_strings: true,
        jslint_happy: true
    });

    self.window = self._window;


    self.importScripts('/deofuscator/highlight.js');

    source = self.hljs.highlight('javascript', source).value;

    self.postMessage(source);
});
