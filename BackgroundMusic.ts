import { _decorator, AudioSource, resources } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BackgroundMusic")
export class BackgroundMusic extends AudioSource {


    onLoad() {
        this.playBackgroundMusic();
    }

    async playBackgroundMusic() {
        const audioClip = await resources.load("多人生存.ogg");
        this.clip = audioClip;
        this.loop = true;
        this.play();
    }
}
