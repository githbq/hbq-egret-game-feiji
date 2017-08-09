/**
 * Created by hbq on 2015/12/7.
 */
module AirPlane {
    /**
     * 成绩显示
     */
    export class ScorePanel extends egret.Sprite {
        public txt:egret.TextField = new egret.TextField();
        public score:egret.TextField = new egret.TextField();
        private background:egret.Bitmap;
        //主图片数据　　开始按钮之类
        public mainInfo:any = AirPlane.GameUtil.getSpriteSheetData('main');

        public constructor() {
            super();
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

        public showScore(text:string, score:number):void {
            this.score.text = score + 'km';
            this.txt.text = text;
        }

        public reset():void {
            this.score.text = 'km';
            this.txt.text = "";
        }
    }
}