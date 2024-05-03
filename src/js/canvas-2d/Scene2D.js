import WindowContext from "../WindowContext"
import DomElement from "../utils/window/DomElement"

export default class Scene2D {
    constructor(id = "canvas-scene") {
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

        /** canvas + context 2d */
        this.domElement = new DomElement(id)
        this.canvas = this.domElement.element
        this.context = this.canvas.getContext('2d')

        /** init */
        this.resize()
    }

    get width() { return this.domElement.width }
    get height() { return this.domElement.height }
    get position() { return this.domElement.position }
    get isVisible() { return this.domElement.isVisible }
    get currentTime() { return this.windowContext.time.elapsed }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height)
    }

    scroll() { this.domElement.setSize() }
    update() { return this.params.isUpdate }
    destroy() {}

    resize() {
        this.domElement.setSize()
        const pixelRatio_ = this.windowContext.size.pixelRatio
        this.canvas.width = this.domElement.width * pixelRatio_
        this.canvas.height = this.domElement.height * pixelRatio_
        this.context.scale(pixelRatio_, pixelRatio_)
    }

    /**
     * DEVICE MOTION
     */
    onDeviceOrientation() {}
    onDeviceAcceleration() { }

}