import WindowContext from "./js/WindowContext"
import SceneBouncingBubbles from "./js/scenarios/BouncingBubbles/SceneBouncingBubbles"
import { askMotionAccess } from "./js/utils/device/DeviceAccess"
import SceneScenario3D from "./js/scenarios/Scenario3D/SceneScenario3D"


/** device access */
const btn = document.getElementById("btn-access")
btn.addEventListener("click", askMotionAccess, false)

/** scenarios */
const scene2d = new SceneBouncingBubbles(20, "canvas-scene", true, false)
const scene2d2 = new SceneBouncingBubbles(10, "canvas-scene-2", false, true)
const scene3d = new SceneScenario3D("canvas-scene-3d")

const windowContext = new WindowContext()

const time = windowContext.time

const manageObject = (originScene, targetScene, shouldMoveBubble, addBubbleToTargetScene) => {
    const bubblesToMove = originScene.bubbles.filter(shouldMoveBubble);
    bubblesToMove.forEach(bubble => {
        originScene.removeBubble(bubble);
        addBubbleToTargetScene(bubble);
    });
}

const update = () => {
    manageObject(scene2d, scene3d,
        b => b.y >= scene2d.height + b.radius + 1,
        b => scene3d.addBubble(b.x - scene2d.width/2, scene3d.height/2 + 4*b.radius - 2)
    );

    manageObject(scene2d2, scene3d,
        b => b.y <= 0 - 9,
        b => scene3d.addBubble(b.x - scene2d2.width/2, -scene3d.height/2 + 2)
    );

    manageObject(scene3d, scene2d2,
        b => b.position.y <= -scene3d.height/2 - 25,
        b => scene2d2.addBubble(b.position.x + scene3d.width/2, 0-10)
    );

    manageObject(scene3d, scene2d,
        b => b.position.y >= scene3d.height/2 + 25,
        b => scene2d.addBubble(b.position.x + scene3d.width/2, scene2d.height + 9)
    );
}

time.on("update", update)


