$(document).ready(function() {

    var sweater = $("#sweater")[0];

    drawPattern = function() {
        var ctx = sweater.getContext("2d");
        ctx.clearRect(0, 0, sweater.width, sweater.height);
        var img = document.getElementById("pattern1");
        var pat = ctx.createPattern(img, 'repeat');
        ctx.rect(0, 0, 200, 280);
        ctx.fillStyle = pat;
        ctx.fill();
    };
    setTimeout(drawPattern, 500);
});