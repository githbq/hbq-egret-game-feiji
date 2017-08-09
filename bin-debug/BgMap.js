/**
 * Created by hbq on 2015/12/7.
 */
var AirPlane;
(function (AirPlane) {
    /**
     * 可滚动的底图
     */
    var BgMap = (function (_super) {
        __extends(BgMap, _super);
        function BgMap() {
            _super.call(this);
            /**图片数量*/
            this.rowCount = 1;
            /**原始滚动速度   值固定*/
            this.originSpeed = 10;
            /**滚动速度  初始值等于原始值 值变化*/
            this.speed = 10;
            //游戏速率
            this.speedRate = 1;
            //背景运动比例尺
            this.plottingScale = 1.1;
            //背景运动的总距离
            this.totalDistance = 0;
            this.bgCount = 0;
            this.bgArr = [];
            this.itemsArray = []; //所有道具数组
            this.nameValueDictionary = []; //名字（洲$国家$城市）对应道具
            //道具纹理数据
            this.itemsInfo = AirPlane.GameUtil.getSpriteSheetData('itemsV1', 'itemsV2', 'itemsV3', 'itemsV4', 'itemsV5', 'itemsV6', 'itemsV7', 'itemsV8');
            //主图片数据　　开始按钮之类
            this.mainInfo = AirPlane.GameUtil.getSpriteSheetData('main');
            this.isWin = false;
            this.currentIndex = 0; //掉了几个道具
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            AirPlane.debuggerCheck('测试444444', this, function () {
                //var xxx=new AirPlane.BgPanel()
                //xxx.addChild(this.mainInfo.getImage("startBtn"));
                //this.addChildAt(xxx, 10000);
            });
        }
        var d = __define,c=BgMap;p=c.prototype;
        //初始化值
        p.initValues = function () {
            this.speed = this.originSpeed;
            //游戏速率
            this.speedRate = 1;
            //背景运动比例尺
            this.plottingScale = 1.1;
            //背景运动的总距离
            this.totalDistance = 0;
            this.bgCount = 0;
        };
        p.setScaleX = function (bitmap) {
            bitmap.scaleX = AirPlane.computScaleRate(bitmap.texture.textureWidth, this.stageW);
        };
        /**初始化*/ //nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
        p.onAddToStage = function (event) {
            var _this = this;
            var that = this;
            this.itemsArray = this.itemsInfo.getBitmapModels();
            this.itemsArray.forEach(function (n) {
                var key = _this.getNameRule(n.textureName);
                if (key) {
                    if (!_this.nameValueDictionary[key]) {
                        _this.nameValueDictionary[key] = [];
                    }
                    _this.nameValueDictionary[key].push(n);
                }
            });
            var c_RES = RES;
            this.groupDic = c_RES.configInstance.groupDic['backgrounds'];
            this.bgArr = [];
            this.groupDic.forEach(function (n) {
                that.bgArr.push(new AirPlane.BitmapModel(null, n.name));
            });
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            this.stageW = this.stage.stageWidth;
            this.stageH = this.stage.stageHeight;
            this.reset();
        };
        //根据资源名 返回图片对象
        p.createBgBmp = function (resName) {
            var bgBmp = AirPlane.createBitmapByName(resName);
            return new AirPlane.BitmapModel(bgBmp, resName);
        };
        //统一解析图片命名　返回　　洲$国$城
        p.getNameRule = function (name) {
            var key;
            var values = name.split('_');
            if (values.length > 3) {
                key = values[1] + '$' + values[2] + '$' + values[3];
            }
            else {
                return '';
            }
            return key;
        };
        //胜利检查
        p.checkWin = function () {
            if (this.bgCount >= this.bgArr.length) {
                var bgData = this.bmpDataArr[this.bmpDataArr.length - 1];
                if (bgData.bitmap.y >= 0) {
                    return true;
                }
            }
            return false;
        };
        //获取道具纹理名
        p.getItemName = function () {
            this.currentIndex++;
            var currentBgName = this.getCurrentBgName().originName;
            var key = this.getNameRule(currentBgName);
            if (currentBgName) {
                var allowItems = this.nameValueDictionary[key];
                if (allowItems) {
                    return allowItems[Math.floor(Math.random() * (allowItems.length))].textureName;
                }
            }
            return this.itemsArray[Math.floor(Math.random() * (this.itemsArray.length))].textureName;
        };
        /**开始滚动*/
        p.start = function () {
            this.reset();
            //this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
            //this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        };
        /**背景重置*/
        p.reset = function () {
            this.isWin = false;
            this.currentIndex = 0;
            this.totalDistance = 0;
            this.bgCount = 0;
            this.bmpDataArr = [];
            this.removeChildren();
            for (var i = 0; i < this.rowCount; i++) {
                var bgData = this.createBgBmp(this.bgArr[i].textureName);
                var bgBmp = bgData.bitmap;
                this.bgCount++;
                var offsetY = this.bmpDataArr.length == 0 ? this.stageH : this.bmpDataArr[this.bmpDataArr.length - 1].bitmap.y;
                bgBmp.y = offsetY - bgBmp.texture.textureHeight;
                this.bmpDataArr.push(bgData);
                this.setScaleX(bgBmp);
                this.addChild(bgBmp);
            }
        };
        //获取游戏速率
        p.getSpeedRate = function () {
            return this.speedRate;
        };
        /**逐帧运动*/
        p.enterFrameHandler = function (event) {
            this.totalDistance += this.plottingScale * this.speed;
            for (var i = 0; i < this.bmpDataArr.length; i++) {
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
                            this.bmpDataArr.push(bgData); //从尾加
                            this.bgCount++;
                            this.speedRate = 1 + this.bgCount / this.bgArr.length; //游戏速率
                            this.speed = this.originSpeed * this.speedRate;
                            this.whenChangeBackground && this.whenChangeBackground({ totalCount: this.bgArr.length, currentCount: this.bgCount });
                        }
                    }
                    if (bgBmpData.bitmap && bgBmpData.bitmap.y > this.stageH) {
                        AirPlane.clearSprite(bgBmpData.bitmap);
                        this.bmpDataArr.shift(); //超出 移除
                        bgBmpData = null;
                    }
                }
                this.isWin = this.checkWin();
            }
        };
        p.getCurrentBgName = function () {
            var current = this.bmpDataArr[0];
            var arr = current.textureName.split('_');
            return { chauName: arr[1], countryName: arr[2], cityName: arr[3], originName: current.textureName };
        };
        /**暂停滚动*/
        p.pause = function () {
            //  this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        };
        return BgMap;
    })(egret.DisplayObjectContainer);
    AirPlane.BgMap = BgMap;
    egret.registerClass(BgMap,"AirPlane.BgMap");
})(AirPlane || (AirPlane = {}));
