import { _decorator, Component, Vec3, input, Input, Animation, EventKeyboard, KeyCode} from "cc";
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 100;

@ccclass("PlayerController2")
export class PlayerController extends Component {

    @property(Animation)
    BodyAnim: Animation = null;

    // @property({ type: PolygonCollider2D })
    // public player: PolygonCollider2D | null = null;
    // @property({ type: GameManager })
    // public Box: GameManager | null = null;
    private _startJump: boolean = false;
    private _startJump0: boolean = false;
    private _jumpStep: number = 0;
    private _jumpStep0: number = 0;
    private _curJumpTime: number = 0;
    private _curJumpTime0: number = 0;
    private _jumpTime: number = 0.1;
    private _jumpTime0: number = 0.1;
    private _curJumpSpeed: number = 0;
    private _curJumpSpeed0: number = 0;
    private _curPos: Vec3 = new Vec3();
    private _curPos0: Vec3 = new Vec3();
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _deltaPos0: Vec3 = new Vec3(0, 0, 0);
    private _targetPos: Vec3 = new Vec3();
    private _targetPos0: Vec3 = new Vec3();
    private _curMoveIndex: number = 0;
    private _curMoveIndex0: number = 0;
    private _isMovingRight: boolean = false;
    private _isMovingRight0: boolean = false;
    private _isJumping: boolean = false;
    private _isJumping0: boolean = false;
    private _runSpeed: number = 10;  // 设置奔跑速度
    private _runSpeed0: number = 13;  // 设置奔跑速度
    // 在 PlayerController 的 start 方法中设置标签
    start() {
        this.setInputActive(true);
        
    }
    

    setInputActive(active: boolean) {
        if (active) {
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        } else {
            input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        }
    }

    reset() {
        this._curMoveIndex = 0;
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.KEY_W) {
            this.jumpByStep(1);
        } else if (event.keyCode === KeyCode.KEY_D) {
            this.startMoveRight();
        }


    }

    onKeyUp(event: EventKeyboard) {
        if (event.keyCode ===  KeyCode.KEY_D) {
            this.stopMoveRight();
            if (!this._isJumping) {
                this.BodyAnim.play('idle');
            }
        } 

    }

    startMoveRight() {
        if (!this._isMovingRight) {
            this._isMovingRight = true;
            if (!this._isJumping) {
                this.BodyAnim.play('running');
            }
        }
    }
    startMoveRight0() {
        if (!this._isMovingRight0) {
            this._isMovingRight0= true;

        }
    }
    stopMoveRight() {
        if (this._isMovingRight) {
            this._isMovingRight = false;
            if (!this._isJumping) {
                this.BodyAnim.play('idle');
            }
        }
    }
    stopMoveRight0() {
        if (this._isMovingRight0) {
            this._isMovingRight0 = false;

        }
    }

    moveRight() {
        this.node.getPosition(this._curPos);
        this._deltaPos.x = this._runSpeed;  // 使用奔跑速度
        Vec3.add(this._curPos, this._curPos, this._deltaPos);
        this.node.setPosition(this._curPos);
    }
    moveRight0() {
        this.node.getPosition(this._curPos0);
        this._deltaPos0.x = this._runSpeed0;  // 使用奔跑速度
        Vec3.add(this._curPos0, this._curPos0, this._deltaPos0);
        this.node.setPosition(this._curPos0);
    }
    update(deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) {
                // 在跳跃结束后，前移一段距离
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._jumpStep;
                Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);

                // 其他跳跃结束逻辑
                this._startJump = false;
                this.onOnceJumpEnd();
            } else {
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed * deltaTime;
                Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);

                // 持续更新地图位置，以保持跟随奔跑的速度进行移动
                this.moveRight();
            }
        } else if (this._isMovingRight) {
            this.moveRight();
        }
        if (this._startJump0) {
            this._curJumpTime0 += deltaTime;
            if (this._curJumpTime0 > this._jumpTime0) {
                // 在跳跃结束后，前移一段距离
                this.node.getPosition(this._curPos0);
                this._deltaPos0.x = this._jumpStep0;
                Vec3.add(this._curPos0, this._curPos0, this._deltaPos0);
                this.node.setPosition(this._curPos0);

                // 其他跳跃结束逻辑
                this._startJump0 = false;
                this.onOnceJumpEnd0();
            } else {
                this.node.getPosition(this._curPos0);
                this._deltaPos0.x = this._curJumpSpeed0 * deltaTime;
                Vec3.add(this._curPos0, this._curPos0, this._deltaPos0);
                this.node.setPosition(this._curPos0);

                // 持续更新地图位置，以保持跟随奔跑的速度进行移动
                this.moveRight0();
            }
        } else if (this._isMovingRight0) {
            this.moveRight0();
        }
    }

    jumpByStep(step: number) {

        this._isJumping = true;
        this._startJump = true;
        this._jumpStep = 5;
        this._curJumpTime = 0;

        const clipName = step == 1 ? 'twoStep' : 'running';
        const state = this.BodyAnim.getState(clipName);
        this._jumpTime = state.duration;

        this._curJumpSpeed = this._jumpStep;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));

        if (this.BodyAnim) {
            if (step === 1) {
                this.BodyAnim.play('twoStep');
                this.scheduleOnce(() => {
                    this.BodyAnim.play('running');
                }, state.duration);

            } else if (step === 2) {
                this.BodyAnim.play('running');
            }
        }

        this._curMoveIndex += step;
    }
    jumpByStep0(step: number) {

    }

    onOnceJumpEnd() {
        this._isJumping = false;
        if (!this._isMovingRight) {
            this.BodyAnim.play('idle');
        }
        this.node.emit('JumpEnd', this._curMoveIndex);
    }
    onOnceJumpEnd0() {
        this._isJumping0 = false;

        this.node.emit('JumpEnd', this._curMoveIndex0);
    }

}
