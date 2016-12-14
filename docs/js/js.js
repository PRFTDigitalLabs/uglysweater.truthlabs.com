$(document).ready(function() {
    var settings = {
        width: 11,
        height: 11,
        bands: 4,
        bandPct: 50,
        mono: true,
        alpha: false
    };

    var matrix = new Array(settings.width);
    for (var i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(settings.height);
    }

    var patcanvas = $('#patcanvas')[0];
    var reflectCanvas = $('#reflectcanvas')[0];

    init = function() {
        randomMatrix();
    };

    setSettings = function() {
        $.each($('#control-panel').serializeArray(), function(i, field) {
            settings[field.name] = parseInt(field.value);
        });

        settings.mono = $('#control-panel #mono')[0].checked ? true : false;
        settings.alpha = $('#control-panel #alpha')[0].checked ? true : false;

        init();
    };

    getRandomIntInclusive = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomMatrix = function() {
        matrix = new Array(settings.width);
        for (var i = 0; i < matrix.length; i++) {
            matrix[i] = new Array(settings.height);
        }

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                var rValue = new Array(4);
                for (k = 0; k < rValue.length - 1; k++) {
                    rValue[k] = getRandomIntInclusive(0, 255);
                }
                //fade:
                //rValue[3] = Math.random();
                //b&w
                rValue[3] = getRandomIntInclusive(0, 1);
                matrix[i][j] = rValue;
            }
        }
        redrawPreview();
    };

    redrawPreview = function() {
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

        $("#pattern-area").empty();

        for (i = 0; i < settings.bands; i++) {
            $("#pattern-area").append('<div class="band-container"><div class="band-positioner"><div class="band"></div></div></div>');
        }

        var dataURL = reflectcanvas.toDataURL("image/png");
        $('.band').css('background-image', 'url(' + dataURL + ')');
        $('.band').css('height', settings.bandPct + '%');
    };

    $('#control-panel').on('change', setSettings);

    init();
});