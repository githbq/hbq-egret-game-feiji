/**
 * Created by hbq on 2015/12/7.
 */
var AirPlane;
(function (AirPlane) {
    /**
     * 敌人，利用对象池
     */
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(texture) {
            _super.call(this, texture);
            this.isDie = false;
        }
        var d = __define,c=Enemy;p=c.prototype;
        /**生产*/
        Enemy.produce = function (textureName) {
            if (AirPlane.Enemy.cacheDict[textureName] == null)
                AirPlane.Enemy.cacheDict[textureName] = [];
            var dict = AirPlane.Enemy.cacheDict[textureName];
            var Enemy;
            if (dict.length > 0) {
                Enemy = dict.pop();
            }
            else {
                Enemy = new AirPlane.Enemy(RES.getRes(textureName));
            }
            Enemy.textureName = textureName;
            return Enemy;
        };
        /**回收*/
        Enemy.reclaim = function (Enemy, textureName) {
            if (AirPlane.Enemy.cacheDict[textureName] == null)
                AirPlane.Enemy.cacheDict[textureName] = [];
            var dict = AirPlane.Enemy.cacheDict[textureName];
            if (dict.indexOf(Enemy) == -1)
                dict.push(Enemy);
        };
        Enemy.cacheDict = {};
        return Enemy;
    })(egret.Bitmap);
    AirPlane.Enemy = Enemy;
    egret.registerClass(Enemy,"AirPlane.Enemy");
})(AirPlane || (AirPlane = {}));
