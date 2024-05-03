import Scene2D from "../../canvas-2d/Scene2D"
import { line } from "../../canvas-2d/Shapes2D"
import { clamp, distance2d, randomRange } from "../../utils/MathUtils"
import Bubble from "./Bubbles"


export default class SceneBouncingBubbles extends Scene2D {
    constructor(nBubbles, id = "canvas-scene", topWall = true, bottomWall = true) {
        super(id)
        this.topWall = topWall
        this.bottomWall = bottomWall
        /** debug */
        this.params.threshold = 75
        this.params.lineWidth = 2
        this.params.speed = 1
        this.params.radius = 10
        this.params.nBubbles = nBubbles
        this.params.gStrength = 10
        if (this.debug.active) {
            this.debugFolder.add(this.params, 'threshold', 0, 350)
            this.debugFolder.add(this.params, 'lineWidth', 0, 15).name("line width")
            this.debugFolder.add(this.params, 'speed', -3, 3)
            this.debugFolder.add(this.params, 'radius', 0, 30).onChange(() => {
                this.bubbles.forEach(b => b.radius = this.params.radius)
                this.clear()
                this.draw()
            })
            this.debugFolder.add(this.params, 'nBubbles', 0, 200).onFinishChange(() => this.generateBubbles())
            this.debugFolder.add(this.params, 'gStrength', 0, 500)
        }

        /** device motion */
        this.debug.domDebug = "init"
        this.windowContext.useDeviceOrientation = true
        this.orientation = this.windowContext.orientation

        /** init */
        this.generateBubbles()
    }

    generateBubbles() {
        this.bubbles = []
        for (let i = 0; i < this.params.nBubbles; i++) {
            const radius_ = 10
            const x_ = randomRange(radius_, this.width - radius_)
            const y__ = randomRange(radius_, this.height - radius_)
            const bubble_ = new Bubble(this.context, x_, y__, radius_)
            this.bubbles.push(bubble_)
        }
        this.clear()
        this.draw()
    }

    addBubble(x, y) {
        const bubble_ = new Bubble(this.context, x, y, this.params.radius)
        this.bubbles.push(bubble_);
        this.clear()
        this.draw()

    }

    removeBubble(bubble) {
        const index = this.bubbles.indexOf(bubble);
        if (index !== -1) {
            this.bubbles.splice(index, 1);
            this.clear();
            this.draw();
        }
    }

    update() {
        if (!super.update()) return

        this.clear()
        this.bubbles.forEach(b => {
            /** test gravity */
            // const angle_ = this.currentTime / 1000
            // b.gx = Math.cos(angle_) * this.params.gStrength
            // b.gy = Math.sin(angle_) * this.params.gStrength

            /** update bubble */

            b.update(
                this.width,
                this.height,
                this.windowContext.time.delta,
                this.params.speed,
                this.topWall,
                this.bottomWall
            )
        })
        this.draw()
    }

    draw() {
        /** style */
        this.context.strokeStyle = "white"
        this.context.fillStyle = "black"
        this.context.lineCap = "round"
        this.context.lineWidth = this.params.lineWidth

        if (!!this.bubbles) {
            for (let i = 0; i < this.bubbles.length; i++) {
                const current_ = this.bubbles[i]
                for (let j = i; j < this.bubbles.length; j++) {
                    const next_ = this.bubbles[j]

                    if (distance2d(current_.x, current_.y, next_.x, next_.y) < this.params.threshold) {
                        line(this.context, current_.x, current_.y, next_.x, next_.y)
                    }
                }
            }

            this.bubbles.forEach(b => {
                b.draw()
            })
        }
    }

    onDeviceOrientation() {
        /** debug angle */
        // let coordinates_ = ""
        // coordinates_ = coordinates_.concat(
        //     // this.orientation.alpha.toFixed(2), ", ",
        //     this.orientation.gamma.toFixed(2), ", ", // -> autour de Y = gauche / droite
        //     this.orientation.beta.toFixed(2) // -> autour de X = avant / arrière
        // )
        // this.debug.domDebug = coordinates_

        /** gravity orientation */
        let gx_ = this.orientation.gamma / 90 // -1 : 1
        let gy_ = this.orientation.beta / 90 // -1 : 1
        gx_ = clamp(gx_, -1, 1)
        gy_ = clamp(gy_, -1, 1)

        /** debug gravity orientation */
        // let coordinates_ = ""
        // coordinates_ = coordinates_.concat(
        //     gx_.toFixed(2), ", ", // -> autour de Y = gauche / droite
        //     gy_.toFixed(2) // -> autour de X = avant / arrière
        // )
        // this.debug.domDebug = coordinates_

        /** update */
        gx_ *= this.params.gStrength // apply gravity strength
        gy_ *= this.params.gStrength // apply gravity strength
        if (!!this.bubbles) {
            this.bubbles.forEach(b => {
                b.gx = gx_
                b.gy = gy_
            })
        }
    }

    resize() {
        super.resize()

        if (!!this.bubbles) {
            this.bubbles.forEach(b => {
                b.x = b.x > this.width - b.radius ? this.width - b.radius : b.x
                b.y = b.y > this.heigh - b.radiust ? this.height - b.radius : b.y
            })
        }
    }
}