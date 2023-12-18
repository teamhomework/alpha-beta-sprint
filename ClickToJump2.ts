import { _decorator, Component, Node, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ClickToJump2")
export class ClickToJump extends Component {

    start() {
        this.node.on('click', this.onButtonClick, this);
    }

    onButtonClick() {
        // 跳转到目标场景
        director.loadScene('scene-004');
    }
}