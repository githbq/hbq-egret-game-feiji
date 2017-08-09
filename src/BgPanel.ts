/**
 * Created by hbq on 2015/12/28.
 */
module AirPlane {
    /**
     * 成绩显示
     */
    export class BgPanel extends egret.Sprite {

        public rectangle:egret.Shape;
        public constructor() {
            super();
            this.rectangle = new egret.Shape();
            this.rectangle.graphics.beginFill(0x33FF00, 1);
            this.rectangle.graphics.drawRect(0, 0, 100, 60000);
            this.rectangle.graphics.endFill();
            this.addChild(this.rectangle);
        }


    }
}