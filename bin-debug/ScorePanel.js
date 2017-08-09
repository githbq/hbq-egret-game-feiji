/**
 * Created by hbq on 2015/12/7.
 */
var AirPlane;
(function (AirPlane) {
    /**
     * 成绩显示
     */
    var ScorePanel = (function (_super) {
        __extends(ScorePanel, _super);
        function ScorePanel() {
            _super.call(this);
            this.txt = new egret.TextField();
            this.score = new egret.TextField();
            //主图片数据　　开始按钮之类
            this.mainInfo = AirPlane.GameUtil.getSpriteSheetData('main');
            this.background = this.mainInfo.getImage("scoreTip");
            this.addChild(this.background);
            this.txt.width = 250;
            this.txt.height = 100;
            this.txt.textAlign = "center";
            this.txt.textColor = 0xFFFFFF;
            this.txt.size = 24;
            this.txt.bold = true;
            this.txt.y = 20;
            this.txt.x = 10;
            //if (DEBUG) {
            //    this.txt.border = true;
            //    this.txt.borderColor = 0xffffff;
            //}
            this.addChild(this.txt);
            this.score.width = 150;
            this.score.height = 100;
            this.score.textAlign = "left";
            this.score.textColor = 0xFFFFFF;
            this.score.size = 24;
            this.score.bold = true;
            this.score.y = 20;
            this.score.x = 260;
            //if (DEBUG) {
            //    this.score.border = true;
            //    this.score.borderColor = 0xffffff;
            //}
            this.addChild(this.score);
            this.touchChildren = false;
            this.touchEnabled = false;
        }
        var d = __define,c=ScorePanel;p=c.prototype;
        p.showScore = function (text, score) {
            this.score.text = score + 'km';
            this.txt.text = text;
        };
        p.reset = function () {
            this.score.text = 'km';
            this.txt.text = "";
        };
        return ScorePanel;
    })(egret.Sprite);
    AirPlane.ScorePanel = ScorePanel;
    egret.registerClass(ScorePanel,"AirPlane.ScorePanel");
})(AirPlane || (AirPlane = {}));
