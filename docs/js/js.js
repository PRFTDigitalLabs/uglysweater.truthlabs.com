$(document).ready(function() {
    var settings = {
            width: 6,
            height: 6,
            bands: 4,
            colors: 3,
            empty: 25
        },
        dataURL = [],
        patcanvas = [],
        reflectcanvas = [],
        colorPalette = [];
        paletteOptions = ['tol-dv', 'tol-sq', 'tol-rainbow'],
        firstRun = true;

    patcanvas[1] = $('#patcanvas1')[0];
    patcanvas[2] = $('#patcanvas2')[0];
    reflectcanvas[1] = $('#reflectcanvas1')[0];
    reflectcanvas[2] = $('#reflectcanvas2')[0];

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

    knit = function() {
        $('#knit-button').addClass('active');
        setup();
        randomizePattern(1);
        randomizePattern(2);
        setDOM();
        setTimeout(function() {
            $('#knit-button').removeClass('active');
        }, 200);
    };

    setup = function() {
        if (firstRun) {
            colorPalette[1] = ["ffffff", "E63D3D"];
        } else {
            colorPalette[1] = palette(paletteOptions[Math.floor(Math.random() * paletteOptions.length)], settings.colors);
            colorPalette[2] = palette(paletteOptions[Math.floor(Math.random() * paletteOptions.length)], settings.colors);
        }
    };

    randomizePattern = function(num) {
        matrix = [];

        for (var i = 0; i < settings.width; i++) {
            matrix[i] = [];

            for (var j = 0; j < settings.height; j++) {
                var RGB = hexToRgb(colorPalette[num][Math.floor(Math.random() * colorPalette[num].length)]);
                var alpha = Math.random() >= (settings.empty / 100) ? 0 : 1;

                matrix[i][j] = [RGB.r, RGB.g, RGB.b, alpha];
            }
        }

        drawPattern(num);
    };

    drawPattern = function(num) {
        patcanvas[num].width = settings.width;
        patcanvas[num].height = settings.height;
        reflectcanvas[num].width = (patcanvas[num].width - 1) * 2;
        reflectcanvas[num].height = (patcanvas[num].height - 1) * 2;

        var patcontext = patcanvas[num].getContext('2d');
        var reflectcontext = reflectcanvas[num].getContext('2d');

        for (var i = 0; i < settings.width; i++) {
            for (var j = 0; j < settings.height; j++) {
                if (matrix[i][j] != 0) {
                    var tileColor = matrix[i][j];
                    patcontext.fillStyle = "rgba(" + tileColor[0] + ", " + tileColor[1] + ", " + tileColor[2] + ", " + tileColor[3] + ")";
                    patcontext.fillRect(i, j, 1, 1);
                }
            }
        }

        reflectcontext.drawImage(patcanvas[num], 0, 0);
        reflectcontext.translate(reflectcanvas[num].width - 1, 0);
        reflectcontext.scale(-1, 1);
        reflectcontext.drawImage(patcanvas[num], 0, 0);
        reflectcontext.scale(1, 1);
        reflectcontext.translate(0, reflectcanvas[num].height - 1);
        reflectcontext.scale(1, -1);
        reflectcontext.drawImage(reflectcanvas[num], 0, 0);

        dataURL[num] = reflectcanvas[num].toDataURL("image/png");
    };

    setDOM = function() {
        $("#pattern-area").empty();

        var numBands = firstRun ? settings.bands + 1 : settings.bands;

        for (i = 0; i < numBands; i++) {
            $("#pattern-area").append('<div class="band-container"><div class="band-positioner"><img class="band"><img class="band"><img class="band"><img class="band"><img class="band"><img class="band"><img class="band"></div></div>');
        }

        $('.band').attr('src', dataURL[1]);
        $('.band-container:nth-of-type(even) .band').attr('src', dataURL[2]);
    };

    setup();
    randomizePattern(1);
    dataURL[2] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAPElEQVQoU2NkIBIwEqmOgfGZre1/ZMVShw/DxUBsmBzxCmE6YCbjNJEqCmGGgGyBOxab1VgVEgomosMRAKwjMAtoqEGrAAAAAElFTkSuQmCC";
    setDOM();
    firstRun = false;

    $('#knit-button').on('click', knit);
});
