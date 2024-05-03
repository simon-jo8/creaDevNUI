import * as THREE from "three";
import Scene3D from "../../canvas-3d-threejs/Scene3D";
import { randomRange } from "../../utils/MathUtils";
import { Bodies, Body, Composite, Engine, Runner } from "matter-js";
import { clamp } from "three/src/math/MathUtils.js";

class Bubble extends THREE.Mesh {
    constructor(radius, color) {
        super();
        // this.geometry = new THREE.SphereGeometry(radius)
        this.geometry = new THREE.BoxGeometry(2 * radius, 2 * radius, 2 * radius);
        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color),
        });

        /** body */
        // this.body = Bodies.circle(0, 0, radius)
        this.body = Bodies.rectangle(0, 0, 2 * radius, 2 * radius);
    }

    setPosition(x, y) {
        /** threejs */
        this.position.set(x, y, 0);

        /** matter js */
        Body.setPosition(this.body, { x: x, y: -y }); // !! sign
    }

    update() {
        this.position.x = this.body.position.x;
        this.position.y = -this.body.position.y;
        this.rotation.z = -this.body.angle;

        let y = this.position.y;
        let minY = -100;
        let maxY = 100;
        let normalizedY = (y - minY) / (maxY - minY);
        let hue = normalizedY;

        let color = new THREE.Color().setHSL(hue, 0.8, 0.5);

        this.material.color = color;
        
    }

}

class Wall extends THREE.Mesh {
    constructor(color) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(color),
        });
        super(geometry, material);

        this.depth = 1;

        /** body */
        this.body = Bodies.rectangle(0, 0, 1, 1, { isStatic: true });
    }

    setSize(width, height) {
        const oldScaleX_ = this.scale.x;
        const oldScaleY_ = this.scale.y;
        Body.scale(this.body, width / oldScaleX_, height / oldScaleY_);
        this.scale.set(width, height, this.depth);
    }

    setPosition(x, y) {
        /** threejs */
        this.position.set(x, y, 0);

        /** matter js */
        Body.setPosition(this.body, { x: x, y: -y }); // !! sign
    }
}

export default class SceneScenario3D extends Scene3D {
    constructor(id = "canvas-scene", nBubbles = 10) {
        super(id);

        /** change default camera -> orthographic camera */
        this.camera = new THREE.OrthographicCamera(
            -this.width / 2,
            this.width / 2,
            this.height / 2,
            -this.height / 2
        );
        this.camera.position.z = 100;

        /** wall */
        this.wallLeft = new Wall("black");
        this.wallRight = new Wall("black");

        this.wallFirst = new Wall("yellow");
        this.wallSecond = new Wall("yellow");
        this.wallThird = new Wall("yellow");
        this.add(this.wallLeft);
        this.add(this.wallSecond);
        this.add(this.wallRight);
        this.add(this.wallFirst);
        this.add(this.wallThird);

        this.wallLeft.depth = 100;
        this.wallSecond.depth = 100;
        this.wallRight.depth = 100;
        this.wallFirst.depth = 100;
        this.wallThird.depth = 100;

        /** bubbles */
        this.bubbles = [];
        const radius_ = 20;
        this.colors = ["red", "blue", "yellow"];
        for (let i = 0; i < nBubbles; i++) {
            const bubble_ = new Bubble(radius_, this.colors[i % this.colors.length]);
            const x_ = randomRange(-this.width / 2, this.width / 2);
            const y_ = randomRange(-this.height / 2, this.height / 2);
            bubble_.setPosition(x_, y_);
            this.add(bubble_);
            this.bubbles.push(bubble_);
        }

        /** physics engine */
        this.bodies = [
            this.wallLeft.body,
            this.wallSecond.body,
            this.wallRight.body,
            this.wallFirst.body,
            this.wallThird.body,
        ];
        this.bubbles.forEach((b) => this.bodies.push(b.body));
        this.engine = Engine.create({ render: { visible: false } });
        Composite.add(this.engine.world, this.bodies);
        this.runner = Runner.create();
        Runner.run(this.runner, this.engine);
        console.log(this.engine.gravity);
        this.engine.gravity.scale *= 2;

        /** device motion */
        this.windowContext.useDeviceAcceleration = true;
        this.acceleration = this.windowContext.acceleration;
        this.debug.domDebug = "start scene 3d";

        /** init */
        this.resize();
    }

    addBubble(x, y, vx = null, vy = null) {
        const bubble_ = new Bubble(20, this.colors[Math.floor(Math.random() * this.colors.length)])
        bubble_.setPosition(x, y-20);
        this.bubbles.push(bubble_);
        this.add(bubble_)

        Composite.add(this.engine.world, bubble_.body);

    }

    removeBubble(bubble) {
        this.bubbles.splice(this.bubbles.indexOf(bubble), 1);
        Composite.remove(this.engine.world, bubble.body);
        this.remove(bubble);
    }

    update() {
        super.update();

        if (!!this.bubbles) {
            this.bubbles.forEach((b) => b.update());
        }
    }

    //   onDeviceOrientation() {
    //     /** gravity orientation */
    //     let gx_ = this.orientation.gamma / 90; // -1 : 1
    //     let gy_ = this.orientation.beta / 90; // -1 : 1
    //     gx_ = clamp(gx_, -1, 1);
    //     gy_ = clamp(gy_, -1, 1);

    //     /** debug */
    //     let coordinates_ = "";
    //     coordinates_ = coordinates_.concat(gx_.toFixed(2), ", ", gy_.toFixed(2));
    //     this.debug.domDebug = coordinates_;

    //     /** update */
    //     this.engine.gravity.x = gx_;
    //     this.engine.gravity.y = gy_;
    //   }

    onDeviceAcceleration() {
        /** debug */
        let coordinates_ = "";
        coordinates_ = coordinates_.concat(
            this.acceleration.x.toFixed(2),
            ", ",
            this.acceleration.y.toFixed(2),
            ", ",
            this.acceleration.z.toFixed(2)
        );
        this.debug.domDebug = coordinates_;
        /** update */
        this.engine.gravity.x = this.acceleration.x / 9.81;
        this.engine.gravity.y = -this.acceleration.y / 9.81;
    }

    resize() {
        super.resize();

        this.camera.left = -this.width / 2;
        this.camera.right = this.width / 2;
        this.camera.top = this.height / 2;
        this.camera.bottom = -this.height / 2;

        if (!!this.wallLeft) {
            const thickness_ = 10;

            /** walls sizes */
            this.wallLeft.setSize(thickness_, this.height);
            this.wallRight.setSize(thickness_, this.height);
            this.wallSecond.setSize(this.width/4 - 2 * thickness_, thickness_);
            this.wallFirst.setSize(this.width/4 - 2 * thickness_, thickness_);
            this.wallThird.setSize(this.width/4 - 2 * thickness_, thickness_);

            /** walls position */
            this.wallLeft.setPosition(-this.width / 2 - thickness_ , 0);
            this.wallRight.setPosition(this.width / 2 + thickness_ / 2, 0);
            this.wallSecond.setPosition(-this.width/ 4 - thickness_, this.height / 8 );
            this.wallFirst.setPosition(this.width/ 4 + thickness_, this.height / 8 + thickness_ / 2);
            this.wallThird.setPosition(0, -this.height / 8 - thickness_ / 2);
        }
    }
}
