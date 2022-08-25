
class SnakeNode {

    constructor(x, y, canvasXOffset, canvasYOffset, direction, next, prev) {
        this.x = x;
        this.y = y;
        this.canvasXOffset = canvasXOffset;
        this.canvasYOffset = canvasYOffset; 

        this.startXOffset = canvasXOffset;
        this.startYOffset = canvasYOffset;

        this.direction = direction;
        this.startDirection = direction;

        this.next = next;
        this.prev = prev;
    }

    moveOffset() {
        this.canvasXOffset += this.getNextXOffset();
        this.canvasYOffset += this.getNextYOffset();
    }

    getNextXOffset() {
        if (this.direction === "right") {
            return 1;
        } else if (this.direction === "left") {
            return -1;
        }
        return 0;
    }

    getNextYOffset() {
        if (this.direction === "up") {
            return -1;
        } else if (this.direction === "down") {
            return 1;
        }
        return 0;
    }

}

const MAX_OFFSET = 20;

class Snake {

    constructor(startX, startY, direction) {
        this.head = new SnakeNode(startX, startY, 0, 10, "right", null, null);
        this.head.next = new SnakeNode(startX - 1, startY, 0, 10, "right", null, this.head);
        this.head.next.next = new SnakeNode(startX - 2, startY, 0, 10, "right", null, this.head.next);

        this.head.next.prev = this.head;

        this.tail = this.head.next.next;
        this.nextDirection = direction;
        this.growing = false;
        this.print();
    }

    moveOffsets() {
        console.log("Moving");
        let curr = this.head;
        while (curr !== null) {
            //this.print();
            curr.moveOffset();
            curr = curr.next;
        }
        if (this.head.canvasXOffset == MAX_OFFSET / 2 && this.head.canvasYOffset == MAX_OFFSET / 2) {
            //console.log("Switching directions");
            curr = this.tail;
            while (curr.prev !== null) {
                curr.direction = curr.prev.direction;
                curr = curr.prev;
            }
            this.head.direction = this.nextDirection;
        } else if (this.head.canvasXOffset == 0 || this.head.canvasYOffset == 0 
                || this.head.canvasXOffset == MAX_OFFSET || this.head.canvasYOffset == MAX_OFFSET) {
            this.moveNodes();
        }
    }

    moveNodes() {
        //calculate new head offsets 
        //offsets (x, y) -> new offsets (x, y)
        //20, 0 -> 20, 40
        //0, 20 -> 40, 20
        //20, 40 -> 20, 0
        //40, 20 -> 0, 20
        //40 - x, 40 - y
        this.head = new SnakeNode(this.getNextX(), this.getNextY(), MAX_OFFSET - this.head.canvasXOffset, MAX_OFFSET - this.head.canvasYOffset, this.head.direction, this.head, null);
        this.head.next.prev = this.head;
        
        //remove tail
        if (this.growing) {
            this.growing = false;
        } else {
            this.tail = this.tail.prev;
            this.tail.next = null;
        }

        //reset the reset the nodes, giving the illusion that they carry over
        let curr = this.tail;
        while (curr.prev !== null) {
            curr.canvasXOffset = curr.startXOffset;
            curr.canvasYOffset = curr.startYOffset;
            curr.direction = curr.startDirection;
            curr = curr.prev;
        }
    }

    grow() {
        this.growing = true;
    }

    /*move(removeTail = true) {
        //this.print();
        if (this.head.x % 1 == 0.5 && this.head.y % 1 == 0.5) {
            this.currDirection = this.nextDirection;
        }
        this.head = new SnakeNode(this.getNextX(), this.getNextY(), this.head, null);
        this.head.next.prev = this.head;
        if (removeTail) {
            this.tail = this.tail.prev;
            this.tail.next = null;
        }
    }

    grow() {
        this.move(false);
        this.move(false);
        this.move(false);
        this.move(false);
    }*/

    getNextX() {
        if (this.head.direction === "right") {
            return this.head.x + 1;
        } else if (this.head.direction === "left") {
            return this.head.x - 1;
        }
        return this.head.x;
    }

    getNextY() {
        if (this.head.direction === "up") {
            return this.head.y - 1;
        } else if (this.head.direction === "down") {
            return this.head.y + 1;
        }
        return this.head.y;
    }

    collidedWithSelf() {
        let current = this.head.next.next; //impossible to collide with next 2;
        while (current !== null) {
            if (current.x === this.head.x && current.y === this.head.y) {
                return true;
            }
            current = current.next;
        }
        return false;
    }

    collidedWithBoundary(width, height) {
        return this.head.x < 0 || this.head.x >= width || this.head.y < 0 || this.head.y >= height;
    }

    occupies(x, y) {
        let current = this.head;
        while (current !== null) {
            if (x == current.x && y === current.y) {
                return true;
            }
            current = current.next;
        }
        return false;
    }

    canMove(direction) {
        if (direction === "up" && this.head.next.y < this.head.y) {
            return false;
        } else if (direction === "down" && this.head.next.y > this.head.y) {
            return false;
        } else if (direction === "left" && this.head.next.x < this.head.x) {
            return false;
        } else if (direction === "right" && this.head.next.x > this.head.x) {
            return false;
        }
        return true;
    }

    keyToDirection(key) {
        if (key === "ArrowUp" || key === "w") {
            return "up";
        } else if (key === "ArrowRight" || key === "d") {
            return "right";
        } else if (key === "ArrowDown" || key === "s") {
            return "down";
        } else if (key === "ArrowLeft" || key === "a") {
            return "left";
        }
    }

    print() {
        console.log("Snake nodes:");
        let current = this.head;
        while (current !== null) {
            console.log(current);
            current = current.next;
        }
    }

}