import { GUI } from "dat.gui"

export class Debug {
    #active

    constructor() {
        this.ui = null
        this.active = window.location.hash === '#debug'
    }

    set active(isUI) {
        this.#active = isUI
        if(this.#active && !!!this.ui) this.ui = new GUI()
    }

    set domDebug(content) {
        document.getElementById("debug").innerHTML = content
        document.getElementById("debug").style.display = 'inline'
    }

    get active() { return this.#active }
}