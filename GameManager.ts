import { _decorator, CCInteger, Component, instantiate, Label, Node, Prefab, Vec3, Collider2D,director, BoxCollider2D,Contact2DType,PhysicsSystem2D } from 'cc';
import { BLOCK_SIZE, PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE,
    BT_STONE,
};

enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END,
};

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: Prefab })
    public boxPrefab: Prefab | null = null;
    @property({ type: CCInteger })
    public roadLength: number = 1000;
    private _road: BlockType[] = [];
    private _boxPool: Node[] = []; // 新增箱子对象池

    @property({ type: Node })
    public startMenu: Node | null = null;
    @property({ type: PlayerController })
    public playerCtrl: PlayerController | null = null;
    @property({ type: Label })
    public stepsLabel: Label | null = null;

    start() {
        this.setCurState(GameState.GS_INIT);
        this.playerCtrl?.node.on('JumpEnd', this.onPlayerJumpEnd, this);
        const node = instantiate(this.boxPrefab);
        const collider = this.node.getComponent(BoxCollider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        // 注册全局碰撞回调函数
        if (PhysicsSystem2D.instance) {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }
    onBeginContact (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        // 只在两个碰撞体开始接触时被调用一次
        if(otherCollider.tag === 1)
        {
            // this.setCurState(GameState.GS_INIT);
            this.start();
            // alert('onBeginContact');
        }
    }
    onEndContact (selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        // 只在两个碰撞体结束接触时被调用一次
        if(otherCollider.tag === 1)
        {
            
            // this.Box.startMenu.active = true;
            alert('你死了，请重新来过！');
            director.loadScene("scene-002");
        }
    }
    init() {
        if (this.startMenu) {
            this.startMenu.active = true;
        }
        // const node = instantiate(this.boxPrefab);
        // const collider = node.getComponent(BoxCollider2D);
        // if (collider) {
        //     collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        //     collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        // }
        // // 注册全局碰撞回调函数
        // if (PhysicsSystem2D.instance) {
        //     PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        //     PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        // }
        this.generateRoad();

        if (this.playerCtrl) {
            this.playerCtrl.setInputActive(false);
            this.playerCtrl.node.setPosition(Vec3.ZERO);
            this.playerCtrl.reset();
        }
    }

    setCurState(value: GameState) {
        switch (value) {
            case GameState.GS_INIT:
                this.init();
                break;
            case GameState.GS_PLAYING:
                if (this.startMenu) {
                    this.startMenu.active = false;
                }

                if (this.stepsLabel) {
                    this.stepsLabel.string = '0';   // 将步数重置为0
                }

                setTimeout(() => {
                    if (this.playerCtrl) {
                        this.playerCtrl.setInputActive(true);
                    }
                }, 0.1);
                break;
            case GameState.GS_END:
                if (this.playerCtrl) {
                    this.startMenu.active = true;
                    alert("游戏结束");
                    // this.playerCtrl.setInputActive(false);
                    // this.playerCtrl.stopMoveRight();
                    // this.playerCtrl.BodyAnim.play('idlee');
                }
                break;
        }
    }

    generateRoad() {
        this.node.removeAllChildren();

        this._road = [];
        this._boxPool = []; // 清空箱子对象池

        this._road.push(BlockType.BT_STONE);

        for (let i = 1; i < this.roadLength; i++) {
            if (this._road[i - 1] === BlockType.BT_NONE) {
                this._road.push(BlockType.BT_STONE);
            } else {
                this._road.push(Math.floor(Math.random() * 20));
            }
        }

        for (let j = 0; j < this._road.length; j++) {
            if (this._road[j] === BlockType.BT_STONE) {
                let block: Node | null = this.spawnBlockByType(this._road[j]);
                if (block) {
                    this.node.addChild(block);
                    block.setPosition(j * BLOCK_SIZE, 0, 0);
                }
            }
        }
    }

    spawnBlockByType(type: BlockType) {
        if (!this.boxPrefab) {
            return null;
        }

        let block: Node | null = null;
        switch (type) {
            case BlockType.BT_STONE:
                block = this._boxPool.length > 0 ? this._boxPool.pop()! : instantiate(this.boxPrefab);
                const collider = block.getComponent(BoxCollider2D);
                if (collider) {
                    collider.on('onCollisionEnter', this.onCollisionEnter, this);
                }
                break;
        }

        return block;
    }

    onStartButtonClicked() {
        this.setCurState(GameState.GS_PLAYING);
    }

    // checkResult(moveIndex: number) {
    //     if (moveIndex < this.roadLength && this._road[moveIndex] == BlockType.BT_STONE) {
    //         this.setCurState(GameState.GS_END);
    //     }
    // }

    onPlayerJumpEnd(moveIndex: number) {
        if (this.stepsLabel) {
            this.stepsLabel.string = '' + (moveIndex >= this.roadLength ? this.roadLength : moveIndex);
        }
        // this.checkResult(moveIndex);

        // 回收离开地图的箱子到对象池
        if (this._road[moveIndex - 1] === BlockType.BT_STONE && this._road[moveIndex] !== BlockType.BT_STONE) {
            const boxNode = this.node.children[moveIndex - 1];
            if (boxNode) {
                this._boxPool.push(boxNode);
                boxNode.removeFromParent();
            }
        }
    }

    onCollisionEnter(event: any) {
        const otherCollider = event.otherCollider;
        if (otherCollider.tag === 1) {
            this.setCurState(GameState.GS_END);
        }
    }
}