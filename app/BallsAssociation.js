/**
 * Idée : avoir une classe qui stockerait une association entre une balle et une autre
 * Et d'avoir une liste d'associations qui ne pourrait pas avoir 2 associations avec les 2 mêmes balles
 * On aurait donc une liste d'associations qui s'initialiserait au début du programme et qui servirait dans
 * draw() car elle serait parcouru par chaque balle pour vérifier la collision entre celle-ci et une autre
 * Tout ceci dans le but d'éviter le recalculer la collision pour la balle x avec la balle y, alors que cette collision
 * aurait déjà pu être calculé pour la balle y avec la balle x
 */

function BallsAssociation(b1, b2) {
    this.ball1 = b1;
    this.ball2 = b2;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
}

