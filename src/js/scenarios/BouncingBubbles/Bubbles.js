import { circle } from "../../canvas-2d/Shapes2D"
import { randomRange, clamp } from "../../utils/MathUtils"

export default class Bubble {
    constructor(context, x, y, radius) {
        this.context = context
        this.x = x
        this.y = y
        this.radius = radius

        /** animate */
        this.vx = randomRange(-100, 100)
        this.vy = randomRange(-100, 100)

        /** gravity */
        this.gx = 0
        this.gy = 1
    }

    update(width, height, deltaTime, speed, topWall = true, bottomWall = true) {
        const deltaTimeSeconds = (deltaTime / 1000) * speed
        this.x += this.vx * deltaTimeSeconds + this.gx
        this.y += this.vy * deltaTimeSeconds + this.gy
        if (this.x < this.radius) {
            this.invertVx()
            this.x = this.radius
        }
        if (this.x > width - this.radius) {
            this.invertVx()
            this.x = width - this.radius
        }
        if (this.y < this.radius && topWall) {
            this.invertVy()
            this.y = this.radius
        }
        if (this.y > height - this.radius && bottomWall) {
            this.invertVy()
            this.y = height - this.radius
        }

    }

    invertVx() {
        this.vx = -this.vx
    }

    invertVy() {
        this.vy = -this.vy
    }


    draw() {
        circle(this.context, this.x, this.y, this.radius, { isFill: true })
    }
}