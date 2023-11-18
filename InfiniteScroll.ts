import { _decorator, Component, Node, Prefab, instantiate, Sprite, Vec3, tween } from 'cc';
import {  PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

@ccclass('InfiniteScroll')
export class InfiniteScroll extends Component {
    @property({ type: Prefab })
    groundPrefab: Prefab | null = null;
    private groundNodes: Node[] = [];
    // @property({ type: Prefab })
    // playerPrefab: Prefab | null = null;

    // @property({ type: Prefab })
    // obstaclePrefab: Prefab | null = null;  // 新增障碍物预制体

    @property({ type: Node })
    groundContainer: Node | null = null;
    @property({ type: PlayerController })
    public playerCtrl: PlayerController | null = null;
    private groundWidth: number = 0;
    private groundPool: Node[] = [];
    private playerNode: Node | null = null;

    // private obstaclePool: Node[] = [];  // 新增障碍物对象池

    start() {
        if (this.groundPrefab && this.groundContainer) {
            // 获取地面预制体的宽度
            const groundNode = instantiate(this.groundPrefab!);
            this.groundWidth = 1920;

            // 初始化地图和角色
            this.initMap();
            // this.initPlayer();
        }
    }

    update(dt: number) {
        // 更新地图滚动
        this.scrollMap(dt);

        // 随机生成障碍物
        // this.generateObstacle(dt);
    }

    private scrollMap(dt: number) {
        // 获取地图容器的位置
        let containerPosition = this.groundContainer!.position;

        // 根据滚动速度更新地图容器的位置
        // containerPosition.set(containerPosition.x - 0 * dt, containerPosition.y, containerPosition.z);


        // 如果地图容器的 x 坐标小于地图容器宽度的负值，表示地图容器完全滚出屏幕，将其重新放置在屏幕右侧
        if (this.playerCtrl.node.position.x% this.groundWidth>1900) {
            // 从对象池中获取地面节点
            const groundNode = this.groundPool.shift() || instantiate(this.groundPrefab!);
            // var groundNode0 = this.groundPool.shift();
            // 将地面节点从场景中移除
            // groundNode0.removeFromParent();

            // 设置地面节点的位置
            groundNode.position = new Vec3(this.groundContainer!.children.length * this.groundWidth, 0, 0);

            // 更新地图容器内的地面节点位置
            this.updateGroundNodesPosition();
            // alert(groundNode.position);
            // 将地面节点添加到地图容器中
            // if (this.playerCtrl.node.position.x% this.groundWidth*2>2700)
            // {
            //     this.groundContainer!.children[0].destroy();
            // }
            // this.groundContainer!.children[this.groundContainer!.children.length-2].destroy();
            this.groundContainer!.addChild(groundNode);
            // 使用 tween 实现平滑过渡效果
            tween(groundNode)
            .to(0.01, { position: new Vec3((this.groundContainer!.children.length - 1) * this.groundWidth, 0, 0) })
            .start();

        }

        // 更新地图容器的位置
        this.groundContainer!.position = containerPosition;

        // 更新角色的位置，使其跟随地图移动
        // if (this.playerNode) {
        //     this.playerNode.position = new Vec3(this.playerNode.position.x - 1000 * dt, 0, 0);
        // }
    }
    // 新增函数用于更新地图容器内的地面节点位置
updateGroundNodesPosition() {
    const children = this.groundContainer!.children;
    for (let i = 0; i < children.length; i++) {
        const groundNode = children[i];
        groundNode.position = new Vec3(i * this.groundWidth, 0, 0);
    }
}
    // private generateObstacle(dt: number) {
    //     // 在一定条件下生成障碍物
    //     if (Math.random() < 0.01) {
    //         this.createObstacle();
    //     }
    // }

    // private createObstacle() {
    //     if (this.obstaclePrefab) {
    //         // 从对象池中获取障碍物节点，如果对象池为空，则实例化新的节点
    //         const obstacleNode = this.obstaclePool.length > 0 ? this.obstaclePool.pop()! : instantiate(this.obstaclePrefab);

    //         // 设置障碍物的初始位置
    //         // 替换之前的 cc.winSize.height
    //         const screenHeight = cc.view.getVisibleSize().height;

    //         // 重新计算 randomY
    //         const randomY = Math.random() * screenHeight - screenHeight / 2;
    //         obstacleNode.position = new Vec3(cc.winSize.width / 2, randomY, 0);

    //         // 将障碍物节点添加到场景中
    //         this.node.addChild(obstacleNode);

    //         // 使用 tween 实现障碍物移动效果
    //         tween(obstacleNode)
    //             .to(10, { position: new Vec3(-cc.winSize.width / 2, randomY, 0) })
    //             .call(() => {
    //                 // 移动完成后回收障碍物节点到对象池
    //                 this.obstaclePool.push(obstacleNode);
    //                 // 从场景中移除障碍物节点
    //                 obstacleNode.removeFromParent();
    //             })
    //             .start();
    //     }
    // }

    private initMap() {
        // 获取屏幕的宽度
        const screenWidth = 1920;

        // 计算每次生成地面的数量
        const groundCount = Math.ceil(screenWidth / this.groundWidth)+1;

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

}