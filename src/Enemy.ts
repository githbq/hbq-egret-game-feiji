/**
 * Created by hbq on 2015/12/7.
 */
module AirPlane {
    /**
     * 敌人，利用对象池
     */
    export class Enemy extends egret.Bitmap {
        public textureName:string;
        public isDie:boolean = false;

        public constructor(texture:egret.Texture) {
            super(texture);
        }

        private static cacheDict:Object = {};

        /**生产*/
        public static produce(textureName:string):AirPlane.Enemy {
            if (AirPlane.Enemy.cacheDict[textureName] == null)
                AirPlane.Enemy.cacheDict[textureName] = [];
            var dict:AirPlane.Enemy[] = AirPlane.Enemy.cacheDict[textureName];
            var Enemy:AirPlane.Enemy;
            if (dict.length > 0) {
                Enemy = dict.pop();
            } else {
                Enemy = new AirPlane.Enemy(RES.getRes(textureName));
            }
            Enemy.textureName = textureName;
            return Enemy;
        }

        /**回收*/
        public static reclaim(Enemy:AirPlane.Enemy, textureName:string):void {
            if (AirPlane.Enemy.cacheDict[textureName] == null)
                AirPlane.Enemy.cacheDict[textureName] = [];
            var dict:AirPlane.Enemy[] = AirPlane.Enemy.cacheDict[textureName];
            if (dict.indexOf(Enemy) == -1)
                dict.push(Enemy);
        }

    }
}