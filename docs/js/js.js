$(document).ready(function() {

    var settings = {
        xlength: 11,
        ylength: 11
    };

    var matrix = new Array(settings.xlength);
    for (var i = 0; i < matrix.length; i++) {
        matrix[i] = new Array(settings.ylength);
    }

    var patcanvas = $('#patcanvas')[0];
    var reflectCanvas = $('#reflectcanvas')[0];

    init = function() {
        randomMatrix();
        redrawPreview();
    };

    getRandomIntInclusive = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomMatrix = function() {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                var rValue = new Array(4);
                //var hue = getRandomIntInclusive(0, 255);
                for (k = 0; k < rValue.length - 1; k++) {
                    //rValue[k] = hue;
                    rValue[k] = getRandomIntInclusive(0, 255);
                }
                //fade:
                //rValue[3] = Math.random();
                //b&w
                rValue[3] = getRandomIntInclusive(0, 1);
                matrix[i][j] = rValue;
            }
        }
    };

    redrawPreview = function() {
        patcanvas.width = settings.xlength;
        patcanvas.height = settings.ylength;
        reflectcanvas.width = patcanvas.width * 2;
        reflectcanvas.height = patcanvas.height * 2;

        var patcontext = patcanvas.getContext('2d');
        var reflectcontext = reflectcanvas.getContext('2d');

        for (var i = 0; i < settings.xlength; i++) {
            for (var j = 0; j < settings.ylength; j++) {
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

        //also update the code
        var dataURL = reflectcanvas.toDataURL("image/png");
        $('.band').css('background-image', 'url(' + dataURL + ')');
    };

    init();
});