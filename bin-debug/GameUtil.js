/**
 * Created by hbq on 2015/12/7.
 */
var AirPlane;
(function (AirPlane) {
    var GameUtil = (function () {
        function GameUtil() {
        }
        var d = __define,c=GameUtil;p=c.prototype;
        /**基于矩形的碰撞检测*/
        GameUtil.hitTest = function (obj1, obj2, offset) {
            var rect1 = obj1.getBounds();
            var rect2 = obj2.getBounds();
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            if (offset) {
                var rectTemp = rect1;
                if (offset.type = 2) {
                    rectTemp = rect2;
                }
                rectTemp.offset(offset.x, offset.y);
            }
            return rect1.intersects(rect2);
        };
        /**基于圆心的碰撞检测*/
        GameUtil.hitTestP = function (obj1, obj2) {
            var rect2x;
            var rect2y;
            rect2x = obj2.x + obj2.width / 2;
            rect2y = obj2.y + obj2.height / 2;
            return obj1.hitTestPoint(rect2x, rect2y);
        };
        /**调用纹理*/
        GameUtil.getSpriteSheetData = function () {
            var _this = this;
            var configKeys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                configKeys[_i - 0] = arguments[_i];
            }
            var that = this;
            //纹理集
            var spriteSheets = [];
            configKeys.forEach(function (n) {
                if (!that.sheetDictionary[n]) {
                    that.sheetDictionary[n] = {};
                    that.sheetDictionary[n].textureSheet = RES.getRes(n);
                }
                spriteSheets.push(_this.sheetDictionary[n].textureSheet);
            });
            return {
                getImage: function (textureName) {
                    var img = null;
                    spriteSheets.forEach(function (n) {
                        if (n.getTexture(textureName)) {
                            img = new egret.Bitmap();
                            img.texture = n.getTexture(textureName);
                        }
                    });
                    return img;
                },
                getSheets: function () {
                    return spriteSheets;
                },
                getBitmapModels: function () {
                    var _this = this;
                    var models = [];
                    configKeys.forEach(function (configKey, index) {
                        if (that.sheetDictionary[configKey] && !that.sheetDictionary[configKey].bitmapModels) {
                            that.sheetDictionary[configKey].bitmapModels = [];
                            var map = spriteSheets[index]._textureMap;
                            for (var i in map) {
                                if (map.hasOwnProperty(i)) {
                                    that.sheetDictionary[configKey].bitmapModels.push(new AirPlane.BitmapModel(_this.getImage(i), i));
                                }
                            }
                        }
                        models = models.concat(that.sheetDictionary[configKey].bitmapModels);
                    });
                    return models;
                },
                sheetNames: configKeys
            };
        };
        GameUtil.sheetDictionary = {};
        return GameUtil;
    })();
    AirPlane.GameUtil = GameUtil;
    egret.registerClass(GameUtil,"AirPlane.GameUtil");
    /**根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。*/
    function createBitmapByName(name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    AirPlane.createBitmapByName = createBitmapByName;
    /**移除层*/
    function removeSprite(sprite) {
        if (sprite && sprite.parent) {
            sprite.parent.removeChild(sprite);
        }
    }
    AirPlane.removeSprite = removeSprite;
    /**计算缩放比率  selfSize自身尺寸   wantSize想要缩放到的尺寸*/
    function computScaleRate(selfSize, wantSize) {
        return wantSize / selfSize;
    }
    AirPlane.computScaleRate = computScaleRate;
    var t1 = new egret.TextField();
    /**调试用方法*/
    function debuggerCheck(customText, who, func) {
        if (DEBUG) {
            var v1 = this.t1;
            //  var t1:egret.TextField = new egret.TextField();
            t1.text = customText;
            t1.bold = true;
            t1.textColor = 0x000000;
            t1.backgroundColor = 0x696969;
            t1.border = true;
            t1.borderColor = 0xffffff;
            if (t1.touchEnabled == false) {
                t1.addEventListener(egret.TouchEvent.TOUCH_TAP, debuggerCheckTap, this);
                t1.touchEnabled = true;
            }
            egret.setTimeout(function () {
                this.addChildAt(t1, 1000);
                if (func) {
                    func.call(who);
                }
            }, who, 1000);
            function debuggerCheckTap() {
                AirPlane.removeSprite(t1);
            }
        }
    }
    AirPlane.debuggerCheck = debuggerCheck;
    /**声音管理器*/
    function createSoundManager() {
        var soundDic = {};
        return function (key) {
            {
                if (!soundDic[key]) {
                    soundDic[key] = {};
                    var sound = RES.getRes(key);
                    soundDic[key].sound = sound;
                }
                var soundObj = soundDic[key];
                return {
                    play: function (position, circle) {
                        var soundChannel = soundObj.sound.play(position || 0, circle || 1);
                        soundObj.channel = soundChannel;
                        return this;
                    },
                    stop: function () {
                        if (soundObj && soundObj.channel) {
                            soundObj.channel.stop();
                        }
                        return this;
                    },
                    setVolume: function (volume) {
                        if (soundObj && soundObj.channel) {
                            soundObj.channel.volume = volume;
                        }
                        return this;
                    }
                };
            }
        };
    }
    AirPlane.createSoundManager = createSoundManager;
    //清除层
    function clearSprite(sprite) {
        if (sprite && sprite.parent) {
            sprite.parent.removeChild(sprite);
        }
    }
    AirPlane.clearSprite = clearSprite;
    /**
     * 位图对象
     * 包含一个bitmap对象　　与一个 textureName字符串
     */
    var BitmapModel = (function () {
        function BitmapModel(_bitmap, _textureName, _status) {
            this.bitmap = _bitmap;
            this.textureName = _textureName;
            this.status = _status;
        }
        var d = __define,c=BitmapModel;p=c.prototype;
        return BitmapModel;
    })();
    AirPlane.BitmapModel = BitmapModel;
    egret.registerClass(BitmapModel,"AirPlane.BitmapModel");
})(AirPlane || (AirPlane = {}));
