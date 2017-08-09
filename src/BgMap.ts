/**
 * Created by hbq on 2015/12/7.
 */
module AirPlane {
    /**
     * 可滚动的底图
     */
    export class BgMap extends egret.DisplayObjectContainer {
        /**图片引用*/
        private bmpDataArr:AirPlane.BitmapModel[];
        /**图片数量*/
        private rowCount:number = 1;
        /**stage宽*/
        private stageW:number;
        /**stage高*/
        private stageH:number;
        /**原始滚动速度   值固定*/
        private originSpeed:number = 10;
        /**滚动速度  初始值等于原始值 值变化*/
        private speed:number = 10;
        //游戏速率
        public speedRate:number = 1;
        //背景运动比例尺
        public plottingScale:number =1.1;
        //背景运动的总距离
        public totalDistance:number = 0;


        public bgCount:number = 0;
        public bgArr:any[] = [];
        public groupDic:any;
        public itemsArray:AirPlane.BitmapModel[] = [];//所有道具数组
        public nameValueDictionary:any[] = [];//名字（洲$国家$城市）对应道具
        //道具纹理数据
        public itemsInfo:any = AirPlane.GameUtil.getSpriteSheetData('itemsV1', 'itemsV2', 'itemsV3', 'itemsV4', 'itemsV5', 'itemsV6', 'itemsV7', 'itemsV8');
        //主图片数据　　开始按钮之类
        public mainInfo:any = AirPlane.GameUtil.getSpriteSheetData('main');
        public isWin:boolean = false;
        //初始化值
        public initValues() {
            this.speed = this.originSpeed;
            //游戏速率
            this.speedRate = 1;
            //背景运动比例尺
            this.plottingScale = 1.1;
            //背景运动的总距离
            this.totalDistance = 0;
            this.bgCount = 0;
        }

        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            AirPlane.debuggerCheck('测试444444', this, function () {
                //var xxx=new AirPlane.BgPanel()
                //xxx.addChild(this.mainInfo.getImage("startBtn"));
                //this.addChildAt(xxx, 10000);
            });
        }

        private setScaleX(bitmap:egret.Bitmap) {
            bitmap.scaleX = AirPlane.computScaleRate(bitmap.texture.textureWidth, this.stageW);
        }

        /**初始化*///nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
        private onAddToStage(event:egret.Event) {
            var that = this;
            this.itemsArray = this.itemsInfo.getBitmapModels();
            this.itemsArray.forEach((n)=> {
                var key:string = this.getNameRule(n.textureName);
                if (key) {
                    if (!this.nameValueDictionary[key]) {
                        this.nameValueDictionary[key] = [];
                    }
                    this.nameValueDictionary[key].push(n);
                }
            })
            var c_RES:any = RES;
            this.groupDic = c_RES.configInstance.groupDic['backgrounds'];
            this.bgArr = [];
            this.groupDic.forEach((n)=> {
                that.bgArr.push(new AirPlane.BitmapModel(null, n.name));
            });
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            this.reset();
        }

//根据资源名 返回图片对象
        private createBgBmp(resName:string):AirPlane.BitmapModel {
            var bgBmp:egret.Bitmap = AirPlane.createBitmapByName(resName);
            return new AirPlane.BitmapModel(bgBmp, resName);

        }

        //统一解析图片命名　返回　　洲$国$城
        public getNameRule(name:string):string {
            var key:string;
            var values:string[] = name.split('_');
            if (values.length > 3) {
                key = values[1] + '$' + values[2] + '$' + values[3];
            } else {
                return '';
            }
            return key;
        }

        //胜利检查
        private checkWin():boolean {
            if (this.bgCount >= this.bgArr.length) {
                var bgData:any = this.bmpDataArr[this.bmpDataArr.length - 1];
                if (bgData.bitmap.y >= 0) {
                    return true;
                }
            }
            return false;
        }

        public currentIndex:number = 0;//掉了几个道具
        //获取道具纹理名
        public getItemName():any {
            this.currentIndex++;
            var currentBgName:string = this.getCurrentBgName().originName;
            var key:string = this.getNameRule(currentBgName);
            if (currentBgName) {
                var allowItems:AirPlane.BitmapModel[] = this.nameValueDictionary[key];
                if (allowItems) {
                    return allowItems[Math.floor(Math.random() * ( allowItems.length))].textureName;
                }
            }
            return this.itemsArray[Math.floor(Math.random() * ( this.itemsArray.length))].textureName;
        }

        /**开始滚动*/
        public start():void {
            this.reset();
            //this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
            //this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        }

        /**背景重置*/
        public reset():void {
            this.isWin = false;
            this.currentIndex = 0;
            this.totalDistance = 0;
            this.bgCount = 0;
            this.bmpDataArr = [];
            this.removeChildren();
            for (var i:number = 0; i < this.rowCount; i++) {
                var bgData = this.createBgBmp(this.bgArr[i].textureName);
                var bgBmp:egret.Bitmap = bgData.bitmap;
                this.bgCount++;
                var offsetY:number = this.bmpDataArr.length == 0 ? this.stageH : this.bmpDataArr[this.bmpDataArr.length - 1].bitmap.y;
                bgBmp.y = offsetY - bgBmp.texture.textureHeight;
                this.bmpDataArr.push(bgData);
                this.setScaleX(bgBmp);
                this.addChild(bgBmp);
            }
        }

        public whenChangeBackground:any;
        //获取游戏速率
        public getSpeedRate():number {
            return this.speedRate;
        }

        /**逐帧运动*/
        public enterFrameHandler(event:egret.Event):void {
            this.totalDistance += this.plottingScale * this.speed;
            for (var i:number = 0; i < this.bmpDataArr.length; i++) {
                if (this.bmpDataArr.length > i) {
                    var bgBmpData = this.bmpDataArr[i];
                    bgBmpData.bitmap.y += this.speed;

                    if (bgBmpData.bitmap.y >= 0 && 'end' != bgBmpData.status) {
                        bgBmpData.status = 'end';
                        if (this.bgArr.length > this.bgCount) {
                            var bgData = this.createBgBmp(this.bgArr[this.bgCount].textureName);
                            bgData.bitmap.y = 0 - bgData.bitmap.texture.textureHeight;
                            this.setScaleX(bgData.bitmap);
                            this.addChild(bgData.bitmap);
                            this.bmpDataArr.push(bgData);//从尾加
                            this.bgCount++;
                            this.speedRate = 1 + this.bgCount / this.bgArr.length;//游戏速率
                            this.speed = this.originSpeed * this.speedRate;
                            this.whenChangeBackground && this.whenChangeBackground({totalCount: this.bgArr.length, currentCount: this.bgCount});
                        }
                    }
                    if (bgBmpData.bitmap && bgBmpData.bitmap.y > this.stageH) {//超屏移除
                        AirPlane.clearSprite(bgBmpData.bitmap);
                        this.bmpDataArr.shift();//超出 移除
                        bgBmpData = null;
                    }
                }
                this.isWin = this.checkWin();
            }

        }


        public  getCurrentBgName():any {
            var current:AirPlane.BitmapModel = this.bmpDataArr[0];
            var arr:string[] = current.textureName.split('_');
            return {chauName: arr[1], countryName: arr[2], cityName: arr[3], originName: current.textureName};
        }

        /**暂停滚动*/

        public pause():void {
            //  this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        }
    }

}