#!/bin/sh

rm -rf ext
mkdir -p ext/js

# jQuery
wget -O ext/js/jquery.js http://code.jquery.com/jquery.min.js

# JSrender (JavaScript Template Rendering for jQuery)
wget -O ext/js/jsrender.js https://raw.github.com/BorisMoore/jsrender/master/jsrender.js

# JSO (JavaScript OAuth 2 client)
wget -O ext/js/jso.js https://raw.github.com/andreassolberg/jso/master/jso.js
