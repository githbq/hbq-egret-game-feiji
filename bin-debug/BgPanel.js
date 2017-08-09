/**
 * Created by hbq on 2015/12/28.
 */
var AirPlane;
(function (AirPlane) {
    /**
     * 成绩显示
     */
    var BgPanel = (function (_super) {
        __extends(BgPanel, _super);
        function BgPanel() {
            _super.call(this);
            this.rectangle = new egret.Shape();
            this.rectangle.graphics.beginFill(0x33FF00, 1);
            this.rectangle.graphics.drawRect(0, 0, 100, 60000);
            this.rectangle.graphics.endFill();
            this.addChild(this.rectangle);
        }
        var d = __define,c=BgPanel;p=c.prototype;
        return BgPanel;
    })(egret.Sprite);
    AirPlane.BgPanel = BgPanel;
    egret.registerClass(BgPanel,"AirPlane.BgPanel");
})(AirPlane || (AirPlane = {}));
