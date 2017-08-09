/**
 * Created by hbq on 2015/12/7.
 */
module AirPlane {
    /*
     * Main Game Container
     * */
    export class GameContainer extends egret.DisplayObjectContainer {
        /**@private*/
        private stageW:number;
        /**@private*/
        private stageH:number;
        public bg:AirPlane.BgMap;
        private logo:egret.Bitmap;
        private icon:egret.Bitmap;
        private replay:egret.Bitmap;
        private timeline:egret.Bitmap;
        private timelinebg:egret.Bitmap;
        private timelinemask:egret.Rectangle;
        private gameTimer:egret.Timer;
        //private bigPlane:egret.MovieClip;
        private bigPlane:egret.Bitmap[];

        /**敌人数组*/
        private enemys:AirPlane.Enemy[] = [];
        /**@private*/
        private _lastTime:number;
        /**我的成绩*/
        public myScore:number = 0;
        /**成绩显示*/
        private scorePanel:AirPlane.ScorePanel;

        /**道具纹理数据*/
        public itemsInfo:any = AirPlane.GameUtil.getSpriteSheetData('items');
        /**主图片数据　　开始按钮之类*/
        public mainInfo:any = AirPlane.GameUtil.getSpriteSheetData('main');
        /**背景图纹理数据*/
        public backgroundsInfo:any = AirPlane.GameUtil.getSpriteSheetData('backgrounds-1', 'backgrounds-2', 'backgrounds-3');
        /**触发创建敌人的间隔 道具生产速度*/
        private enemyTimer:egret.Timer = new egret.Timer(500);
        /**剩余时间*/
        public timeLeft:number = 100;
        /**时间线多少毫秒降一格*/
        private timeDelay:number = 1000;
        /**总共秒数*/
        private timeCount:number = 30;
        /**道具每帧移动增量*/
        private downTimes:number = 6;
        /**主角重力感应速度*/
        private playerSpeed:number = 10;
        /**吃满多少道具加一秒*/
        private addTimeCount = 3;
        /**当前吃了多少道具*/
        public currentTimeCount = 0;
        /**背景音乐*/
        public bgSound:egret.Sound;
        /**背景音乐控制器*/
        public bgSoundChannel:egret.SoundChannel;
        /**攻击音乐*/
        public paopoSound:egret.Sound;
        /**声音管理器*/
        public managerInstance:any = AirPlane.createSoundManager();
        //初始化值
        public initValues() {
            this.bg.initValues();
            this.enemyTimer.delay = 500;
            /**剩余时间*/
            this.timeLeft = 100;
            /**时间线多少毫秒降一格*/
            this.timeDelay = 1000;
            /**总共秒数*/
            this.timeCount = 30;
            /**道具每帧移动增量*/
            this.downTimes = 6;
            /**主角重力感应速度*/
            this.playerSpeed = 10;
            /**吃满多少道具加一秒*/
            this.addTimeCount = 3;
            /**当前吃了多少道具*/
            this.currentTimeCount = 0;
            this.playerSpeed = 10;

        }

        public constructor() {
            super();
            this._lastTime = egret.getTimer();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        }

        /**init*/
        private onAddToStage(event:egret.Event) {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.createGameScene();
        }


        private createGameScene():void {
            this.managerInstance('bgSound').play(0, -1).setVolume(0.3);
            this.bg = new AirPlane.BgMap();
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            this.bg.width = this.stageW;
            this.bg.height = this.stageH;
            this.addChild(this.bg);
            if (DEBUG) {
                this.icon = this.mainInfo.getImage("startBtn");
                this.icon.anchorOffsetX = this.icon.anchorOffsetY = 50;
                this.icon.x = this.stageW / 2;
                this.icon.y = this.stageH / 2 + 150;
                this.icon.touchEnabled = true;
                this.icon.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this);
                this.addChild(this.icon);
            }
            this.scorePanel = new AirPlane.ScorePanel();
            this.scorePanel.x = (this.stageW - this.scorePanel.width) / 2;
            this.scorePanel.y = 50;
            //预创建
            this.preCreatedInstance();
        }

        private currentPlane:any = null;
        //获取飞机
        private getBigPlane():any {
            var that = this;
            if (!that.bigPlane) {
                that.bigPlane = [];
                that.bigPlane.push(this.mainInfo.getImage("airplaneLeft"));
                that.bigPlane.push(this.mainInfo.getImage("airplane"));
                that.bigPlane.push(this.mainInfo.getImage("airplaneRight"));
                that.currentPlane = this.bigPlane[1];
                //that.bigPlane.forEach((img)=>{
                //    img.scaleX=img.scaleY= AirPlane.computScaleRate(img.texture.textureWidth,120);
                //});
            }
            return {
                switch: function (index:number) {
                    var findPlane:any = that.bigPlane[index];
                    if (findPlane !== that.currentPlane) {
                        findPlane.x = that.currentPlane.x;
                        findPlane.y = that.currentPlane.y;
                        that.clearSprite(that.currentPlane);
                        that.addChild(findPlane);
                    }
                    return (that.currentPlane = findPlane);
                },
                left: function ():any {
                    return this.switch(0);
                },
                normal: function ():any {
                    return this.switch(1);
                },
                right: function ():any {
                    return this.switch(2);
                },
                current: function ():any {
                    return that.currentPlane;
                }
            }
        }

        /**预创建一些对象，减少游戏时的创建消耗*/
        private preCreatedInstance():void {
            for (var i:number = 0; i < this.bg.itemsArray.length; i++) {
                for (var j = 0; j < 1; j++) {
                    var enemy:AirPlane.Enemy = AirPlane.Enemy.produce(this.bg.itemsArray[i].textureName);
                    AirPlane.Enemy.reclaim(enemy, this.bg.itemsArray[i].textureName);
                }
            }
            for (var i:number = 0; i < 10; i++) {
                this.createBaoPo(0, 0, true);
            }
        }

        private baopos:egret.Bitmap[] = []; //爆破组 缓存爆破泡泡避免过多创建
        //创建爆破泡泡 isVirtual为true只加载到内存中
        private createBaoPo(x:number, y:number, isVirtual ?:boolean) {
            var baopo:egret.Bitmap = null;
            if (this.baopos.length > 0) {
                baopo = this.baopos.pop();
            } else {
                baopo = this.mainInfo.getImage("baopo");
            }
            var that = this;
            baopo.scaleX = baopo.scaleY = 0.5;
            baopo.x = x;
            baopo.y = y;
            baopo.alpha = 0.3;

            if (!isVirtual) {
                this.addChildAt(baopo, 100);
                egret.Tween.get(baopo).to({
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1
                }, 600).call(function (baopo) {

                    this.clearSprite(baopo);
                    this.baopos.push(baopo);
                }, this, [baopo]);
            } else {
                this.baopos.push(baopo);
            }
        }

        private rate:number = -1;

        /**游戏速度控制*/
        private speedChange() {
            var rate = this.bg.getSpeedRate();
            if (this.rate === rate) {
                return;
            }
            this.rate = rate;

            /**道具每帧移动增量*/
            this.downTimes = 6 * rate;

            /**触发创建敌人的间隔 道具生产速度*/
            this.enemyTimer.delay = 500 + (500 * (1 - rate)) * 0.3;
            //重力感应速度
            this.playerSpeed = 10 * rate;

            /**吃满多少道具加一秒*/
            this.addTimeCount = 3 + (3 * (rate - 1)) * 0.4;
            ///**当前吃了多少道具*/
            //this.currentTimeCount;
            AirPlane.debuggerCheck("道具下降速度(px)" + this.downTimes
                + ";\n 道具生产速度(ms)" + this.enemyTimer.delay
                + ";\n 道具转换率" + this.addTimeCount
                , this);
        }

        /**游戏画面更新*/
        private gameViewUpdate(evt:egret.Event):void {
            this.bg.enterFrameHandler(evt);//背景运动
            //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
            var nowTime:number = egret.getTimer();
            var fps:number = 1000 / (nowTime - this._lastTime);
            this._lastTime = nowTime;
            var speedOffset:number = 60 / fps;
            var i:number = 0;
            var delArr:any[] = [];
            this.speedChange();
            //Enemy运动
            var theEnemy:AirPlane.Enemy;
            var enemyFighterCount:number = this.enemys.length;
            for (i = 0; i < enemyFighterCount; i++) {
                theEnemy = this.enemys[i];
                theEnemy.y += this.downTimes * speedOffset;
                if (theEnemy.y > this.stageH)
                    delArr.push(theEnemy);
            }

            //飞机运动
            var tx:number = 0;
            var current:any = null;
            if (this.trunLeft) {
                current = this.getBigPlane().left();
                current.x -= this.playerSpeed;
            } else if (this.trunRight) {
                current = this.getBigPlane().right();
                current.x += this.playerSpeed;
            } else {
                current = this.getBigPlane().normal();
            }
            tx = this.getBigPlane().current().x + tx;
            tx = Math.max(0, tx);
            tx = Math.min(this.stageW - current.width, tx);
            current.x = tx;
            //end飞机运动
            this.scorePanel.showScore(this.bg.getCurrentBgName().countryName + "  " + this.bg.getCurrentBgName().cityName, Math.floor(this.bg.totalDistance));
            this.reclaimEnemy(delArr);

            this.gameHitTest();
            if (this.bg.isWin) {
                this.gameSucc();
            }
        }

        //回收敌人
        private reclaimEnemy(delArr:AirPlane.Enemy[]) {
            for (var i = 0; i < delArr.length; i++) {
                var theEnemy:AirPlane.Enemy = delArr[i];
                this.clearSprite(theEnemy);
                theEnemy.isDie = false; //恢复状态
                AirPlane.Enemy.reclaim(theEnemy, theEnemy.textureName);
                this.enemys.splice(this.enemys.indexOf(theEnemy), 1);
            }

        }

        private gameHitTest():void {
            var theEnemy:AirPlane.Enemy;
            var enemyCount:number = this.enemys.length;
            for (var j:number = 0; j < enemyCount; j++) {
                theEnemy = this.enemys[j];
                if (theEnemy && !theEnemy.isDie && AirPlane.GameUtil.hitTest(this.getBigPlane().current(), theEnemy)) {
                    theEnemy.isDie = true;
                    this.createBaoPo(theEnemy.x - 40, theEnemy.y - 40); //撞中了 显示爆破泡泡
                    // this.managerInstance('paopoSound').play().setVolume(0.3);
                    this.showLog('碰撞命中');
                    this.currentTimeCount++; //吃多个道具才恢复一秒
                    if (this.currentTimeCount >= this.addTimeCount) {
                        this.currentTimeCount = this.currentTimeCount - this.addTimeCount;//小数部分继承下来
                        var newCount:number = this.gameTimer.repeatCount - this.gameTimer.currentCount + 1;
                        newCount = newCount > this.timeCount ? this.timeCount : newCount;
                        this.gameTimerReset(newCount);
                    }
                    this.reclaimEnemy([theEnemy]);

                }
            }
        }

        //封装打日志
        private showLog(message:string) {
            if (DEBUG) {
                console.log('egret ' + message);
            }
        }

        /**响应Touch*/
        private touchHandler(evt:egret.TouchEvent):void {
            if (DEBUG) {
                if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
                    var tx:number = evt.localX;
                    tx = Math.max(0, tx);
                    var current:any = this.getBigPlane().current();
                    tx = Math.min(this.stageW - current.width, tx);
                    current.x = tx;
                }
            }
        }

        public whenGameStart:any;
        //游戏开始
        private gameStart() {
            this.whenGameStart && this.whenGameStart(this);
            this.managerInstance('bgSound').stop().play(0, -1).setVolume(0.3);
            this.clearSprite(this.icon);
            this.animateShow();
            this.bg.start();
            this.touchEnabled = true;
            this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.gameTimerStart();
            this.scorePanel.reset();
            this.clearSprite(this.scorePanel);
            this.addChildAt(this.scorePanel, 100);


            this.startGravitySensor(); //重力感应
        }

        //游戏计时开始
        private gameTimerStart() {
            this.timelinebg = this.mainInfo.getImage("timelinebg");
            this.timelinebg.x = this.stageW - this.timelinebg.width - 10;
            this.timelinebg.y = 50;
            this.addChild(this.timelinebg);

            this.timeline = this.mainInfo.getImage("timeline");
            this.timeline.x = this.stageW - this.timeline.width - 13;
            this.timeline.y = 54;
            this.addChild(this.timeline);

            this.timelinemask = new egret.Rectangle(0, 0, this.timeline.width, this.timeline.height);
            this.timeline.mask = this.timelinemask;

            this.gameTimerReset(this.timeCount, true);
            this.enemyTimer.addEventListener(egret.TimerEvent.TIMER, this.createEnemy, this);
            this.enemyTimer.start();
        }

        //游戏倒计时重设
        private gameTimerReset(timeCount:number, isFirst ?:boolean) {
            if (!isFirst) {
                this.gameTimer.stop();
                this.gameTimer.removeEventListener(egret.TimerEvent.TIMER, this.timelineDown, this);
                this.gameTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.gameSucc, this);
            }
            this.gameTimer = new egret.Timer(this.timeDelay, timeCount);
            this.gameTimer.addEventListener(egret.TimerEvent.TIMER, this.timelineDown, this);
            this.gameTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.gameSucc, this);
            this.timelineDown();
            this.gameTimer.start();
        }

        public whenGameStop:any;

        private gameSucc():void {
            this.gameStop(); //游戏停
            this.whenGameStop && this.whenGameStop(this, true);
            //清理Enemy
            var theEnemy:AirPlane.Enemy;
            while (this.enemys.length > 0) {
                theEnemy = this.enemys.pop();
                this.clearSprite(theEnemy);
                AirPlane.Enemy.reclaim(theEnemy, "enemyImage");
            }
            if (DEBUG) {
                this.replay = this.mainInfo.getImage("replayBtn");
                this.replay.anchorOffsetX = this.replay.anchorOffsetY = 50;
                this.replay.x = this.stageW / 2 + 100;
                this.replay.y = this.stageH - 100;
                this.replay.touchEnabled = true;
                this.replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameReplay, this);
                this.addChild(this.replay);
            }

        }

        //游戏停
        private gameStop() {
            this.showLog('游戏停止了 gameStop');
            this.bg.pause();
            this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this);
            this.enemyTimer && this.enemyTimer.removeEventListener(egret.TimerEvent.TIMER, this.createEnemy, this);
            this.enemyTimer && this.enemyTimer.stop();
            this.gameTimer && this.gameTimer.removeEventListener(egret.TimerEvent.TIMER, this.timelineDown, this);
            this.gameTimer && this.gameTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.gameSucc, this);
            this.gameTimer && this.gameTimer.stop();
            this.stopGravitySensor(); //重力感应停止
            this.clearSprite(this.timeline);
            this.clearSprite(this.timelinebg);
            this.clearSprite(this.getBigPlane().current());
            //window.c_gameover && window.c_gameover(this);
        }

        /**游戏结束*/
        private gameOver():void {
            this.gameStop(); //游戏停   失败失败
            this.whenGameStop && this.whenGameStop(this, false);
            //清理Enemy
            var theEnemy:AirPlane.Enemy;
            while (this.enemys.length > 0) {
                theEnemy = this.enemys.pop();
                this.clearSprite(theEnemy);
                AirPlane.Enemy.reclaim(theEnemy, theEnemy.textureName);
            }
            //显示成绩
            this.replay = this.mainInfo.getImage("replayBtn");
            this.replay.anchorOffsetX = this.replay.anchorOffsetY = 50;
            this.replay.x = this.stageW / 2 + 100;
            this.replay.y = this.stageH - 100;
            this.replay.touchEnabled = true;
            this.replay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameReplay, this);
            this.addChild(this.replay);
        }

        private timelineDown(evt ?:egret.TimerEvent):void {
            this.timelinemask.y = ((this.timeCount - (this.gameTimer.repeatCount - this.gameTimer.currentCount)) / this.timeCount) * this.timeline.height;
            this.timeline.mask = this.timelinemask;
        }

        /**创建敌人*/
        private createEnemy(evt ?:egret.TimerEvent):void {
            //var enemy:AirPlane.Enemy = AirPlane.Enemy.produce("shitImage");
            var enemy:AirPlane.Enemy = AirPlane.Enemy.produce(this.bg.getItemName());
            enemy.x = Math.random() * (this.stageW - enemy.width);
            enemy.y = -enemy.height - Math.random() * 300;
            this.addChildAt(enemy, this.numChildren - 1);
            this.enemys.push(enemy);
        }

        private mcf:egret.MovieClipDataFactory;
        //游戏重新开始
        public gameReplay() {
            this.initValues();//值恢复
            this.gameStop();
            this.clearSprite(this.replay);
            this.clearSprite(this.scorePanel);
            this.gameStart();
        }

        public getGameFinalData() {
            var lastBgName:any = this.bg.getCurrentBgName();
            var that = this;
            return {
                station: that.bg.bgCount,
                point: that.bg.totalDistance,
                country: lastBgName.countryName,
                city: lastBgName.cityName
            }
        }

        //清除层
        private clearSprite(sprite:any) {
            if (sprite && sprite.parent) {
                sprite.parent.removeChild(sprite);
            }
        }

        //播放动画--创建主角
        public animateShow() {
            var bigPlane = this.getBigPlane().current();
            bigPlane.x = (this.stageW - bigPlane.width) / 2;
            bigPlane.y = this.stageH - bigPlane.height - 50;
            this.addChild(bigPlane);
        }

        //重力感应
        private label:egret.TextField;
        private orientation:egret.DeviceOrientation;
        //开始重力感应监听
        public startGravitySensor() {
            this.trunLeft = false;
            this.trunRight = false;
            //创建 DeviceOrientation 类

            egret.setTimeout(function () {//延迟开启重力感应
                this.c_init = false; //取消重力感应状态
                this.orientation = new egret.DeviceOrientation();
                //添加事件监听器
                this.orientation.addEventListener(egret.Event.CHANGE, this.onOrientation, this);
                //开始监听设备方向变化
                this.orientation.start();
            }, this, 600);


        }

        //停止重力感应监听
        public stopGravitySensor() {
            if (this.orientation) {
                //添加事件监听器
                this.orientation.removeEventListener(egret.Event.CHANGE, this.onOrientation, this);
                //开始监听设备方向变化
                this.orientation.stop();
            }
        }

        private c_alpha:number; //X面的旋转角度
        private c_beta:number; //Y面的旋转角度
        private c_gamma:number; //Z面的旋转角度
        private c_init:boolean = false;
        private trunLeft:boolean = false;
        private trunRight:boolean = false;

        private degRange:number = 8; //倾斜角度范围 大于这个范围才生效

        private onOrientation(e:egret.OrientationEvent) {
            if (!this.c_init) {
                this.c_alpha = e.alpha;
                this.c_beta = e.beta;
                this.c_gamma = 0;// e.gamma;
                this.c_init = true;
            }
            //设备左右倾斜
            var disGamma:number = e.gamma - this.c_gamma;
            if (Math.abs(e.gamma - this.c_gamma) > this.degRange) {
                if (disGamma > 0) {
                    this.trunLeft = false;
                    this.trunRight = true;
                } else {
                    this.trunLeft = true;
                    this.trunRight = false;
                }
            } else {
                this.trunLeft = false;
                this.trunRight = false;
            }
        }

        //end重力感应


    }
}