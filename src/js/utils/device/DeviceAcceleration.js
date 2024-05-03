

import EventEmitter from "../events/EventEmitter"
import { Accelerometer } from "../../libs/sensor-polyfills/src/motion-sensors";

export default class DeviceAcceleration extends EventEmitter {
    constructor() {
        super()

        /** coordinates */
        this.x = 0
        this.y = 0
        this.z = 0

        /** permission */
        if (navigator.permissions) {
            Promise.all([navigator.permissions.query({ name: "accelerometer" })])
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
        this.sensor = new Accelerometer({ frequency: 60 })
        this.sensor.addEventListener('reading', () => {
            this.x = this.sensor.x
            this.y = this.sensor.y
            this.z = this.sensor.z
            this.trigger('reading')
        })
        this.sensor.start()
    }
}