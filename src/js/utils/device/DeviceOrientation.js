import EventEmitter from "../events/EventEmitter"

export default class DeviceOrientation extends EventEmitter {
    constructor() {
        super()

        /** coordinates */
        this.alpha = 0 // angle autour de Z -> 0 à 360°
        this.gamma = 0 // angle autour de Y -> -90° à 90°
        this.beta = 0 // angle autour de X -> -180° à 180°

        /** permission */
        if (navigator.permissions) {
            Promise.all(
                [navigator.permissions.query({ name: "accelerometer" }),
                    navigator.permissions.query({ name: "magnetometer" }),
                    navigator.permissions.query({ name: "gyroscope" })])
                .then(results => {
                    if (results.every(
                        result => result.state === "granted")) {
                        this.init()
                    } else {
                        console.log("Permission to use sensor was denied.")
                    }
                }).catch(err => {
                console.log("Integration with Permissions API is not enabled, still try to start app.")
                this.init()
            })
        } else {
            console.log("No Permissions API, still try to start app.")
            this.init()
        }
    }

    init() {
        window.addEventListener('deviceorientation', (e) => {
            this.alpha = e.alpha // autour de Z
            this.gamma = e.gamma // Y
            this.beta = e.beta // X
            this.trigger('reading')
        })
    }
}