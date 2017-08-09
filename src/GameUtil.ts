/**
 * Created by hbq on 2015/12/7.
 */
module AirPlane {
    export class GameUtil {
        /**基于矩形的碰撞检测*/
        public static hitTest(obj1:egret.DisplayObject, obj2:egret.DisplayObject, offset?:any):boolean {
            var rect1:egret.Rectangle = obj1.getBounds();
            var rect2:egret.Rectangle = obj2.getBounds();
            rect1.x = obj1.x;
            rect1.y = obj1.y;
            rect2.x = obj2.x;
            rect2.y = obj2.y;
            if (offset) {
                var rectTemp:any = rect1;
                if (offset.type = 2) {
                    rectTemp = rect2;
                }
                rectTemp.offset(offset.x, offset.y);
            }
            return rect1.intersects(rect2);
        }

        /**基于圆心的碰撞检测*/
        public static hitTestP(obj1:egret.DisplayObject, obj2:egret.DisplayObject):boolean {
            var rect2x:number;
            var rect2y:number;
            rect2x = obj2.x + obj2.width / 2;
            rect2y = obj2.y + obj2.height / 2;
            return obj1.hitTestPoint(rect2x, rect2y);
        }

        public static sheetDictionary:any = {};

        /**调用纹理*/
        public static getSpriteSheetData(...configKeys:string[]):any {
            var that = this;
            //纹理集
            var spriteSheets:egret.SpriteSheet[] = [];
            configKeys.forEach((n:string)=> {
                if (!that.sheetDictionary[n]) {
                    that.sheetDictionary[n] = {};
                    that.sheetDictionary[n].textureSheet = RES.getRes(n);
                }
                spriteSheets.push(this.sheetDictionary[n].textureSheet);
            });

            return {
                getImage: function (textureName:string):egret.Bitmap {
                    var img:egret.Bitmap = null;
                    spriteSheets.forEach((n:egret.SpriteSheet)=> {
                        if (n.getTexture(textureName)) {
                            img = new egret.Bitmap();
                            img.texture = n.getTexture(textureName);
                        }
                    });
                    return img;
                },
                getSheets: function ():egret.SpriteSheet[] {
                    return spriteSheets;
                },
                getBitmapModels: function ():BitmapModel[] {
                    var models:AirPlane.BitmapModel[] = [];
                    configKeys.forEach((configKey, index)=> {
                        if (that.sheetDictionary[configKey] && !that.sheetDictionary[configKey].bitmapModels) {//因为纹理不会变化 所以缓存起来　
                            that.sheetDictionary[configKey].bitmapModels = [];
                            var map = spriteSheets[index]._textureMap;
                            for (var i in map) {
                                if (map.hasOwnProperty(i)) {
                                    that.sheetDictionary[configKey].bitmapModels.push(new AirPlane.BitmapModel(this.getImage(i), i));
                                }
                            }
                        }
                        models = models.concat(that.sheetDictionary[configKey].bitmapModels);
                    });
                    return models;
                },
                sheetNames: configKeys
            }
        }

    }

    /**根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。*/
    export function createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**移除层*/
    export function removeSprite(sprite:any) {
        if (sprite && sprite.parent) {
            sprite.parent.removeChild(sprite);
        }
    }

    /**计算缩放比率  selfSize自身尺寸   wantSize想要缩放到的尺寸*/
    export function computScaleRate(selfSize:number, wantSize:number):number {
        return wantSize / selfSize;
    }

    var t1:egret.TextField = new egret.TextField();

    /**调试用方法*/
    export function debuggerCheck(customText:string, who:any, func?:any) {
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

    /**声音管理器*/
    export function createSoundManager() {
        var soundDic:any = {};
        return function (key) {
            {
                if (!soundDic[key]) {
                    soundDic[key] = {};
                    var sound:egret.Sound = RES.getRes(key);
                    soundDic[key].sound = sound;
                }
                var soundObj:any = soundDic[key];
                return {
                    play: function (position?:number, circle?:number):any {
                        var soundChannel:egret.SoundChannel = soundObj.sound.play(position || 0, circle || 1);
                        soundObj.channel = soundChannel;
                        return this;
                    }
                    ,
                    stop: function ():any {
                        if (soundObj && soundObj.channel) {
                            soundObj.channel.stop();
                        }
                        return this;
                    }
                    ,
                    setVolume: function (volume:number):any {
                        if (soundObj && soundObj.channel) {
                            soundObj.channel.volume = volume;
                        }
                        return this;
                    }
                }
            }
        }
    }

    //清除层
    export function clearSprite(sprite:any) {
        if (sprite && sprite.parent) {
            sprite.parent.removeChild(sprite);
        }
    }

    /**
     * 位图对象
     * 包含一个bitmap对象　　与一个 textureName字符串
     */
    export class BitmapModel {
        public bitmap:egret.Bitmap;
        public textureName:string;
        public status:string;

        public constructor(_bitmap:egret.Bitmap, _textureName:string, _status?:string) {
            this.bitmap = _bitmap;
            this.textureName = _textureName;
            this.status = _status;
        }
    }
}