function Ball(x, y) {

    this.id = ID++;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.radius = options.radius;

    //this.size = random(ballminSize, ballmaxSize)
    this.position = createVector(x, y);

    // vélocité : direction et vitesse
    // changement de la position au cours du temps
    //this.velocity = createVector(0, 0);
    this.velocity = p5.Vector.random2D();

    // accélération : à quel point on va accélérer dans le temps
    // changement
    this.acceleration = createVector(0, 0);

}

// Newton's 2nd Law ! (the beginning)
Ball.prototype.applyForce = function (forceVector) {

    this.acceleration = forceVector;

};

Ball.prototype.intersects = function (otherBall) {
    let d = dist(this.position.x, this.position.y, otherBall.position.x, otherBall.position.y);
    return (d < this.radius + otherBall.radius);
};

// Affiche la balle
Ball.prototype.display = function () {

    noStroke();
    fill(this.r, this.g, this.b);
    ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
};

// Update la position de la balle
Ball.prototype.update = function () {

    if (options.randomAcceleration) {
        this.acceleration = p5.Vector.random2D();
        this.velocity.add(this.acceleration)
    }

    if (options.enableMovement) {
        this.position.add(this.velocity);
        this.velocity.limit(LIMIT_VELOCITY);
    }

    this.radius = options.radius;

};


Ball.prototype.borders = function () {
    if (options.border) {
        this.enableBorders();
    } else {
        this.disableBorders();
    }
};


Ball.prototype.disableBorders = function () {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;

};


Ball.prototype.enableBorders = function () {
    if (this.position.x > width - options.radius) {
        this.position.x = width - options.radius;
        this.velocity.x *= -1;
    }
    if (this.position.x < options.radius) {
        this.position.x = options.radius;
        this.velocity.x *= -1;
    }
    if (this.position.y > height - options.radius) {
        this.position.y = height - options.radius;
        this.velocity.y *= -1;
    }
    if (this.position.y < options.radius) {
        this.position.y = options.radius;
        this.velocity.y *= -1;
    }
};

