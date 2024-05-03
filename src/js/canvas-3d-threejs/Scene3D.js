import * as THREE from "three"
import WindowContext from "../WindowContext"
import DomElement from "../utils/window/DomElement"

export default class Scene3D extends THREE.Scene {
    constructor(id = "canvas-scene") {
        super()

        /** window context */
        this.windowContext = new WindowContext()
        this.windowContext.addScene(this)

        /** debug */
        this.params = { isUpdate: true }
        this.debug = this.windowContext.debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(id)
            this.debugFolder.add(this.params, 'isUpdate').name("Play / Pause")
        }

        /** canvas */
        this.domElement = new DomElement(id)
        this.canvas = this.domElement.element

        /** init scene threejs */
        this.camera = new THREE.PerspectiveCamera(75) // default camera
        this.camera.near = 0.1
        this.camera.far = 200
        this.camera.position.z = 100
        this.add(this.camera)

        /** renderer */
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })

        /** init */
        this.resize()
    }

    get width() { return this.domElement.width }
    get height() { return this.domElement.height }
    get position() { return this.domElement.position }
    get isVisible() { return this.domElement.isVisible }

    scroll() { this.domElement.setSize() }
    update() {
        this.renderer.render(this, this.camera)
        return this.params.isUpdate
    }
    destroy() {
        this.renderer.dispose()
        this.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.geometry.dispose()
                for (const key in child.material) {
                    const value = child.material[key]
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })
    }

    resize() {
        console.log("resize scene 3d")
        this.domElement.setSize()

        /** camera */
        this.camera.aspect = this.domElement.aspectRatio
        this.camera.updateProjectionMatrix()

        /** renderer */
        this.renderer.setSize(this.width, this.height, false)
        this.renderer.setPixelRatio(this.windowContext.size.pixelRatio)
    }

    /**
     * DEVICE MOTION
     */
    onDeviceOrientation() { }
    onDeviceAcceleration() { }

}