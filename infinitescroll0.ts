import { _decorator, Component, Node, Prefab, instantiate, Vec3, tween, macro, EventKeyboard, KeyCode } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('InfiniteRunner')
export class InfiniteRunner extends Component {
    @property({ type: Prefab })
    groundPrefab: Prefab | null = null;

    @property({ type: Node })
    groundContainer: Node | null = null;

    @property({ type: Node })
    player: Node | null = null;

    private groundWidth: number = 0;
    private groundPool: Node[] = [];
    private isMoving: boolean = false;
    private moveSpeed: number = 300;

    onLoad() {
        // 监听键盘按下事件
        this.node.on(Node.EventType.KEY_DOWN, this.onKeyDown, this);
        // 监听键盘松开事件
        this.node.on(Node.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        if (this.groundPrefab && this.groundContainer) {
            // 获取地面预制体的宽度
            const groundNode = instantiate(this.groundPrefab!);
            this.groundWidth = groundNode.worldSpaceBounds().size.x;

            // 初始化地图
            this.initMap();
        }
    }

    update(dt: number) {
        if (this.isMoving) {
            // 根据移动速度更新地图容器的位置
            this.groundContainer!.position = this.groundContainer!.position.add3f(-this.moveSpeed * dt, 0, 0);

            // 更新角色的位置
            if (this.player) {
                this.player.position = this.player.position.add3f(this.moveSpeed * dt, 0, 0);
            }

            // 判断是否需要重新放置地图容器
            if (this.groundContainer!.position.x < -this.groundWidth) {
                this.resetGroundContainer();
            }
        }
    }

    private onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.ARROW_RIGHT) {
            // 按下右箭头键，开始移动
            this.isMoving = true;
        }
    }

    private onKeyUp(event: EventKeyboard) {
        if (event.keyCode === KeyCode.ARROW_RIGHT) {
            // 松开右箭头键，停止移动
            this.isMoving = false;
        }
    }

    private initMap() {
        // 获取屏幕的宽度
        const screenWidth = cc.winSize.width;

        // 计算每次生成地面的数量
        const groundCount = Math.ceil(screenWidth / this.groundWidth) + 1;

        // 循环创建地面
        for (let i = 0; i < groundCount; i++) {
            let groundNode: Node;
            if (this.groundPool.length > 0) {
                // 从对象池中获取地图节点
                groundNode = this.groundPool.pop()!;
            } else {
                // 如果对象池为空，实例化新的地图节点
                groundNode = instantiate(this.groundPrefab!);
            }

            // 设置地面节点的位置
            groundNode.position = new Vec3(i * this.groundWidth, 0, 0);

            // 将地面节点添加到地图容器中
            this.groundContainer!.addChild(groundNode);
        }
    }

    private resetGroundContainer() {
        // 将地图容器放置在屏幕右侧，并使用 tween 进行平滑过渡
        tween(this.groundContainer)
            .to(0.5, { position: new Vec3(0, 0, 0) })  // 0.5秒内平滑过渡
            .call(() => {
                // 将移出屏幕的地图节点放回对象池
                for (let i = 0; i < this.groundContainer!.children.length; i++) {
                    const groundNode = this.groundContainer!.children[i];
                    if (groundNode.position.x < -this.groundWidth) {
                        this.groundPool.push(groundNode);
                        this.groundContainer!.removeChild(groundNode);
                        i--;
                    }
                }

                // 重新初始化地图
                this.initMap();
            })
            .start();
    }
}
