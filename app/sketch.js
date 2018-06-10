
let optionsBox = $('#options-box');
let appURL = "/home/guillaumeh/Documents/Workspaces/Javascript/Work/Particles-P5/index.html";

let options = {
    modeLine: true,
    drawLines: true,
    enableMovement: true,
    border: true,
    randomStart: true,
    randomAcceleration: false,
    nbBalls: 50,
    radius: 1,
    threshold: 150,
    backgroundColor: '#0F1C70',
    lineColor: '#FFFFFF'
};

/**
 * Récupère les valeurs des éléments HTML et met à jour l'objet options
 */
function getCurrentOptions(){

    options['modeLine'] = $('#mode-line').prop('checked');
    options['drawLines'] = $('#draw-lines').prop('checked');
    options['enableMovement'] = $('#enable_movement').prop('checked');
    options['border'] = $('#border').prop('checked');
    options['randomStart'] = $('#random-start').prop('checked');
    options['randomAcceleration'] = $('#random-accel').prop('checked');
    options['nbBalls'] = parseInt($('#nbBalls').val());
    options['radius'] = parseInt($('#radius').val());
    options['threshold'] = parseInt($('#threshold').val());
    options['backgroundColor'] = $('#colorSelector.bgColor div').css('backgroundColor');
    options['lineColor'] = $('#colorSelector.lineColor div').css('backgroundColor');

}

/**
 * retourne l'URL en fonction des valeurs de l'objet options
 * @returns {string}
 */
function reloadedURL(){
    let reloadedUrl = appURL + "?";
    $.each(options, function (index, value) {
        reloadedUrl = reloadedUrl + index + "=" + value + "&";
    });
    return reloadedUrl.slice(0, -1);
}


/**
 * Lors d'un click sur un switch, récupère les valeurs de la box options,
 * si l'élément possède la classe reload, la page est reload
 */
$('.option-element').click(function () {

    getCurrentOptions();

    if($(this).hasClass('reload')){
        window.location.replace(reloadedURL());
    }

});


/**
 * Lorsqu'un slider bouge, récupère les valeurs de la box options,
 * et selon le slider, on met à jour les options
 */
$(".range").on("input change", function() {

    getCurrentOptions();

    let rangeValue = parseInt($(this).val());

    if($(this).is("#nbBalls")){

        if(rangeValue > balls.length){
            increaseNbBalls(rangeValue);
        } else if (rangeValue < balls.length){
            decreaseNbBalls(rangeValue);
        }

    } else if($(this).is("#radius")){

        options.radius = rangeValue;

    } else if ($(this).is("#threshold")) {

        options.threshold = rangeValue;
    }

});


$('#colorSelector.bgColor').ColorPicker({
    color: options.backgroundColor,
    onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
    },
    onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        return false;
    },
    onChange: function (hsb, hex, rgb) {
        $('#colorSelector.bgColor div').css('backgroundColor', '#' + hex);
        options.backgroundColor = '#' + hex;
    }
});


$('#colorSelector.lineColor').ColorPicker({
    color: options.lineColor,
    onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
    },
    onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        return false;
    },
    onChange: function (hsb, hex, rgb) {
        $('#colorSelector.lineColor div').css('backgroundColor', '#' + hex);
        options.lineColor = '#' + hex;
    }
});




function increaseNbBalls(rangeValue) {

    while (balls.length < rangeValue){
        let randomWidth = myRandom(options.radius * 2, screenWidth - (options.radius * 2));
        let randomHeight = myRandom((options.radius * 2), screenHeight - (options.radius * 2));
        createball(randomWidth, randomHeight);
    }
}

function decreaseNbBalls(rangeValue) {
    while (balls.length > rangeValue){
        deleteBall();
    }
}

/****************************************************************/
/****************************************************************/
/****************************************************************/


let balls = [];
let canvas;
let associationsManager;
let ballsAssociations;

let screenWidth;
let screenHeight;

let LIMIT_VELOCITY = 5;
let NB_MAX_BALLS  = 120;

let initAssociation = true;


let MIN_LINE_WEIGHT = 0.1;
let MAX_LINE_WEIGHT = 0.9;

let LINE_COLOR = '#FFF';

let ID = 1;


function setup() {

    setOptionsFromParameters();

    screenWidth = windowWidth;
    screenHeight = windowHeight;

    canvas = createCanvas(windowWidth, windowHeight);
    background(options.backgroundColor);


    for (let i = 0; i < options.nbBalls; i++) {
        if (options.randomStart) {
            let randomWidth = random(options.radius * 2, windowWidth - (options.radius * 2));
            let randomHeight = random((options.radius * 2), windowHeight - (options.radius * 2));
            balls[i] = new Ball(randomWidth, randomHeight);
        } else {
            balls[i] = new Ball(windowWidth / 2, windowHeight / 2);
        }

        balls[i].display();
    }


    if (initAssociation) {
        initAssociationsManager();
        ballsAssociations = associationsManager.ballsAssociations;
    }

}

/**
 * Récupère les paramètres de l'URL, et initialise l'objet options,
 * et set les éléments HTML
 */
function setOptionsFromParameters() {

    let url = new URL(window.location.href);

    // reload page with parameters if there is no paramaters
    if(url.searchParams.get("modeLine") === null){
        window.location.replace(reloadedURL());
    }

    // MODE LINE
    let modeLineParameter = url.searchParams.get("modeLine") === 'true';
    $('#mode-line').prop('checked', modeLineParameter);
    options.modeLine = modeLineParameter;

    // DRAW LINES
    let drawLinesParameter = url.searchParams.get("drawLines") === 'true';
    $('#draw-lines').prop('checked', drawLinesParameter);
    options.drawLines = drawLinesParameter;

    // ENABLE MOVEMENT
    let enableMovementParameter = url.searchParams.get("enableMovement") === 'true';
    $('#enable_movement').prop('checked', enableMovementParameter);
    options.enableMovement = enableMovementParameter;

    // BORDER
    let borderParameter = url.searchParams.get("border") === 'true';
    $('#border').prop('checked', borderParameter);
    options.border = borderParameter;

    // RANDOM START
    let randomStartParameter = url.searchParams.get("randomStart") === 'true';
    $('#random-start').prop('checked', randomStartParameter);
    options.randomStart = randomStartParameter;

    // RANDOM ACCELERATION
    let randomAccelerationParameter = url.searchParams.get("randomAcceleration") === 'true';
    $('#random-accel').prop('checked', randomAccelerationParameter);
    options.randomAcceleration = randomAccelerationParameter;

    // NB Balls
    let nbBallsParameter = parseInt(url.searchParams.get("nbBalls"));
    document.getElementById("nbBalls").value = nbBallsParameter.toString();
    document.getElementById("nbBallsOuput").value = nbBallsParameter.toString();
    $('span.thumb').hide();
    options.nbBalls = nbBallsParameter;

    // Radius
    let radiusParameter = parseInt(url.searchParams.get("radius"));
    document.getElementById("radius").value = radiusParameter.toString();
    document.getElementById("radiusOuput").value = radiusParameter.toString();
    options.radius = radiusParameter;

    // Threshold
    let thresholdParameter = parseInt(url.searchParams.get("threshold"));
    document.getElementById("threshold").value = thresholdParameter.toString();
    document.getElementById("thresholdOuput").value = thresholdParameter.toString();
    options.threshold= thresholdParameter;


}





function mouseDragged() {

    let boxWidth = optionsBox.width();
    let boxHeight = optionsBox.height();

    if (mouseX > boxWidth || mouseY > boxHeight) {
        createball();
        options.nbBalls = balls.length;
        document.getElementById("nbBalls").value = options.nbBalls.toString();
        document.getElementById("nbBallsOuput").value = options.nbBalls.toString();
    }

}




// on efface / recalcule la position de la balle / réaffiche la balle
function draw() {

    background(options.backgroundColor);

    limitNbBalls();

    drawBalls();

    if (options.drawLines) {
        drawShapesBetweenBalls();
    }

    //enableCollision();
}


function limitNbBalls() {
    while (balls.length > NB_MAX_BALLS){
        deleteBall();
    }
}

function createball(posX, posY) {

    if(posX === undefined && posY === undefined){
        posX = mouseX;
        posY = mouseY;
    }

    let newBall = new Ball(posX, posY);
    balls.push(newBall);
    associationsManager.addBallAssociation(newBall)
}


function deleteBall() {
    let removedBall = balls.shift();
    associationsManager.deleteAssociationsByBall(removedBall);
}


function drawBalls() {
    for (let i = 0; i < balls.length; i++) {
        balls[i].update();
        balls[i].borders();
        balls[i].display();
    }
}


function drawShapesBetweenBalls() {
    for (let i = 0; i < ballsAssociations.length; i++) {
        let b1x = ballsAssociations[i].ball1.position.x;
        let b1y = ballsAssociations[i].ball1.position.y;
        let b2x = ballsAssociations[i].ball2.position.x;
        let b2y = ballsAssociations[i].ball2.position.y;

        let d = dist(b1x, b1y, b2x, b2y);

        noFill();
        //fill(127, 150);
        stroke(options.lineColor);

        if (d < options.threshold) {

            strokeWeight(calculateLineWeight(d));

            if(options.modeLine){
                line(b1x, b1y, b2x, b2y);
            } else {
                let mid_x = (b1x + b2x) / 2;
                let mid_y = (b1y + b2y) / 2;
                ellipse(mid_x, mid_y, d, d);
            }
        }
    }
}



function calculateLineWeight(distance) {

    // calculer les différents paliers :
    // prendre valeur max distance possible, càd THRESHOLD_DRAW_LINES
    // divisé par nbRangeLineWeight donc par exemple 150 / 7  = 21.xx
    let levelLineWeight = options.threshold / calculateNbLevelLineWeight();

    // on prend la valeur d, donc entre 0 et 150, et on compte le nb de paliers qu'on a dans cette valeur
    // ex : 85 % 21
    let nbLevelDistance = ~~(distance / levelLineWeight);

    // puis MINLINEWIEHGT + 0.1 * resultat
    return MAX_LINE_WEIGHT - 0.1 * nbLevelDistance;

}


function calculateNbLevelLineWeight() {
    let nb = 0;
    let range_line_weight = MAX_LINE_WEIGHT - MIN_LINE_WEIGHT;

    while (range_line_weight >= 0) {
        range_line_weight = range_line_weight - 0.1;
        nb++;
    }
    return nb;
}


function enableCollision() {
    for (let i = 0; i < ballsAssociations.length; i++) {
        if (ballsAssociations[i].ball1.intersects(ballsAssociations[i].ball2)) {

        }
    }
}


window.onresize = function () {
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.resize(w, h);
    width = w;
    height = h;
};


function myRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function initAssociationsManager() {
    associationsManager = new AssociationsManager();

    for (let i = 0; i < balls.length; i++) {
        for (let j = 0; j < balls.length; j++) {
            if (balls[i] !== balls[j]) {
                associationsManager.addAssociation(balls[i], balls[j]);
            }
        }
    }
}

