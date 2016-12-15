$(document).ready(function() {
    var settings = {
        width: 10,
        height: 10,
        bands: 3,
        bandPct: 50,
        colors: 8,
        empty: 50,
        gray: true,
        alpha: false
    };

    var matrix = new Array(settings.width);
    for (var i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(settings.height);
    }

    var dataURL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAPElEQVQoU2NkIBIwEqmOgfGZre1/ZMVShw/DxUBsmBzxCmE6YCbjNJEqCmGGgGyBOxab1VgVEgomosMRAKwjMAtoqEGrAAAAAElFTkSuQmCC";

    var patcanvas = $('#patcanvas')[0];
    var reflectCanvas = $('#reflectcanvas')[0];

    var colors;

    var paletteOptions = ['tol-dv', 'tol-sq', 'tol-rainbow', 'rainbow'];

    getRandomIntInclusive = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    hexToRgb = function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    setSettings = function(e) {
        e.preventDefault();

        $.each($('#control-panel').serializeArray(), function(i, field) {
            settings[field.name] = parseInt(field.value);
        });

        settings.gray = $('#control-panel #gray')[0].checked ? true : false;
        //settings.alpha = $('#control-panel #alpha')[0].checked ? true : false;

        if (settings.gray) {
            colorPalette = palette.generate(function(x) { return palette.linearRgbColor(x, x, x); }, settings.colors, 1, 0)
        } else {
            colorPalette = palette(paletteOptions[Math.floor(Math.random() * paletteOptions.length)], settings.colors);
        }

        buildMatrix();
        randomizePattern();
    };

    buildMatrix = function() {
        matrix = new Array(settings.width);
        for (var i = 0; i < matrix.length; i++) {
            matrix[i] = new Array(settings.height);
        }
    };

    randomizePattern = function() {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                //randomly select color from palette:
                var RGB = hexToRgb(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
                //choose alpha channel
                var alphaPct = getRandomIntInclusive(settings.empty, 100) / 100;

                if (settings.alpha) {
                    alpha = alphaPct;
                } else {
                    alpha = Math.random() >= (settings.empty / 100) ? 0 : 1;
                }

                console.log(alpha);

                matrix[i][j] = new Array(RGB.r, RGB.g, RGB.b, alpha);
            }
        }
        drawPattern();
    };

    drawPattern = function() {
        patcanvas.width = settings.width;
        patcanvas.height = settings.height;
        reflectcanvas.width = patcanvas.width * 2;
        reflectcanvas.height = patcanvas.height * 2;

        var patcontext = patcanvas.getContext('2d');
        var reflectcontext = reflectcanvas.getContext('2d');

        for (var i = 0; i < settings.width; i++) {
            for (var j = 0; j < settings.height; j++) {
                if (matrix[i][j] != 0) {
                    var tileColor = matrix[i][j];
                    patcontext.fillStyle = "rgba(" + tileColor[0] + ", " + tileColor[1] + ", " + tileColor[2] + ", " + tileColor[3] + ")";
                    patcontext.fillRect(i, j, 1, 1);
                }
            }
        }

        reflectcontext.drawImage(patcanvas, 0, 0);
        reflectcontext.translate(reflectcanvas.width, 0);
        reflectcontext.scale(-1, 1);
        reflectcontext.drawImage(patcanvas, 0, 0);
        reflectcontext.scale(1, 1);
        reflectcontext.translate(0, 0);
        reflectcontext.translate(0, reflectcanvas.height);
        reflectcontext.scale(1, -1);
        reflectcontext.drawImage(reflectcanvas, 0, 0);

        dataURL = reflectcanvas.toDataURL("image/png");

        setDOM();
    };

    setDOM = function() {

        $("#pattern-area").empty();

        for (i = 0; i < settings.bands; i++) {
            $("#pattern-area").append('<div class="band-container"><div class="band-positioner"><div class="band"></div></div></div>');
        }

        $('.band').css('background-image', 'url(' + dataURL + ')');
        $('.band').css('height', settings.bandPct + '%');
    };

    $('#control-panel').on('change', setSettings);
    $('#refresh').on('click', setSettings);

    setDOM();
});