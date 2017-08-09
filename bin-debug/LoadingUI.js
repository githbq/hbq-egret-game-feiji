var LoadingUI = (function (_super) {
    __extends(LoadingUI, _super);
    function LoadingUI() {
        _super.call(this);
        this.createView();
    }
    var d = __define,c=LoadingUI;p=c.prototype;
    p.createView = function () {
        this.textField = new egret.TextField();
        this.textField.textColor = 0x32CD32;
        this.textField.bold = true;
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
    };
    p.setProgress = function (current, total) {
        // this.textField.text = "Loading..." + current + "/" + total;
        this.textField.text = "Loading..." + Math.floor(current * 100 / +total) + "%";
    };
    return LoadingUI;
})(egret.Sprite);
egret.registerClass(LoadingUI,"LoadingUI");
