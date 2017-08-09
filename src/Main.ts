class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    private totalCount:number = 0;//总加载数量
    private itemsLoaded:number = 0;//已加载数量
    private loadedConifigs = [];

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);


        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceError, this);
        RES.loadGroup("preload");
        RES.loadGroup("backgrounds");
        var c_RES:any = RES;
        this.totalCount += c_RES.configInstance.groupDic['backgrounds'].length;
        this.totalCount += c_RES.configInstance.groupDic['preload'].length;
    }

    public gameContainer:AirPlane.GameContainer;
    public whenLoadComplete:any;

    private onResourceError(event:RES.ResourceEvent):void {
        if (DEBUG) {
            debugger
        }
    }

    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        this.loadedConifigs.push(event.groupName);
        if (this.loadedConifigs.indexOf("preload",0) >= 0 && this.loadedConifigs.indexOf("backgrounds",0) >= 0) {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            //游戏的主类开始实例化
            this.gameContainer = new AirPlane.GameContainer();
            this.addChild(this.gameContainer);
            if (this.whenLoadComplete) {
                this.whenLoadComplete(this);
            }
        }
    }

    /**
     * preload资源组加载进度
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload" || event.groupName == "backgrounds") {
            this.itemsLoaded++;
            //console.log("this.itemsLoaded:%s, this.totalCount:%s", this.itemsLoaded, this.totalCount)
            this.loadingView.setProgress(this.itemsLoaded, this.totalCount);
        }
    }


}