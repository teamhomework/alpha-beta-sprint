import { _decorator, Component, Node, Prefab, instantiate, Sprite, Vec3, tween } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('InfiniteScroll')
export class InfiniteScroll extends Component {
    @property({ type: Prefab })
    groundPrefab: Prefab | null = null;

    @property({ type: Prefab })
    playerPrefab: Prefab | null = null;

    @property({ type: Node })
    groundContainer: Node | null = null;

    private groundWidth: number = 0;
    private groundPool: Node[] = [];
    private playerNode: Node | null = null;

    start() {
        if (this.groundPrefab && this.groundContainer && this.playerPrefab) {
            // 获取地面预制体的宽度
            const groundNode = instantiate(this.groundPrefab!);
            this.groundWidth = groundNode.getComponent(Sprite)!.node.width;

            // 初始化地图和角色
            this.initMap();
            this.initPlayer();
        }
    }

    update(dt: number) {
        // 获取地图容器的位置
        let containerPosition = this.groundContainer!.position;

        // 根据滚动速度更新地图容器的位置
        containerPosition.x -= 1000 * dt;  // 假设滚动速度为100

        // 如果地图容器的 x 坐标小于地图容器宽度的负值，表示地图容器完全滚出屏幕，将其重新放置在屏幕右侧
        if (containerPosition.x < -this.groundWidth) {
            // 从对象池中获取地面节点
            const groundNode = this.groundPool.shift() || instantiate(this.groundPrefab!);

            // 设置地面节点的位置
            groundNode.position = new Vec3(this.groundContainer!.childrenCount * this.groundWidth, 0, 0);

            // 将地面节点添加到地图容器中
            this.groundContainer!.addChild(groundNode);

            // 使用 tween 实现平滑过渡效果
            tween(groundNode)
                .to(0.2, { position: new Vec3((this.groundContainer!.childrenCount - 1) * this.groundWidth, 0, 0) })
                .start();
        }

        // 更新地图容器的位置
        this.groundContainer!.position = containerPosition;

        // 更新角色的位置，使其跟随地图移动
        if (this.playerNode) {
            this.playerNode.position = new Vec3(this.playerNode.position.x - 1000 * dt, 0, 0);
        }
    }

    private initMap() {
        // 获取屏幕的宽度
        const screenWidth = cc.winSize.width;

        // 计算每次生成地面的数量
        const groundCount = Math.ceil(screenWidth / this.groundWidth) + 1;

        // 循环创建地面并添加到对象池
        for (let i = 0; i < groundCount; i++) {
            const groundNode = instantiate(this.groundPrefab!);
            groundNode.position = new Vec3(i * this.groundWidth, 0, 0);
            this.groundPool.push(groundNode);
        }

        // 将初始的一部分地面节点从对象池中取出并添加到地图容器中
        for (let i = 0; i < groundCount; i++) {
            const groundNode = this.groundPool.shift()!;
            this.groundContainer!.addChild(groundNode);
        }
    }

    private initPlayer() {
        if (this.playerPrefab) {
            // 创建角色节点
            this.playerNode = instantiate(this.playerPrefab);
            this.node.addChild(this.playerNode);

            // 设置初始位置
            this.playerNode.position = new Vec3(-cc.winSize.width / 4, 0, 0);
        }
    }
}