function AssociationsManager() {
    this.ballsAssociations = [];
}

AssociationsManager.prototype.getAssociationByBalls = function (b1, b2) {
    for (let i = 0; i < this.ballsAssociations.length; i++) {
        if ((this.ballsAssociations[i].ball1.id === b1.id && this.ballsAssociations[i].ball2.id === b2.id) || (this.ballsAssociations[i].ball1.id === b2.id && this.ballsAssociations[i].ball2.id === b1.id)) {
            return this.ballsAssociations[i];
        }
    }
};

AssociationsManager.prototype.hasAssociationByBalls = function (b1, b2) {
    return this.getAssociationByBalls(b1, b2) !== undefined;
};

AssociationsManager.prototype.deleteAssociationsByBall = function(ball) {
    let i = 0;
    while (i < this.ballsAssociations.length) {
        if(this.ballsAssociations[i].ball1.id === ball.id || this.ballsAssociations[i].ball2.id === ball.id){
            this.ballsAssociations.splice(i, 1);
        } else {
            i++;
        }
    }
};

AssociationsManager.prototype.addAssociation = function (ball1, ball2) {
    if (!this.hasAssociationByBalls(ball1, ball2)) {
        this.ballsAssociations.push(new BallsAssociation(ball1, ball2))
    }
};


AssociationsManager.prototype.addBallAssociation = function (ball) {
    for (let i = 0; i < balls.length; i++) {
        if(ball !== balls[i]){
            this.ballsAssociations.push(new BallsAssociation(ball, balls[i]))
        }
    }
};
