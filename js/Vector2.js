function Vector2(x, y) {
    this.x = x;
    this.y = y;
}

Vector2.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}

Vector2.prototype.normalize = function() {
    this.x /= this.length();
    this.y /= this.length();
}

Vector2.prototype.dot = function(v2) {
    return this.x * v2.x + this.y * v2.y;
}