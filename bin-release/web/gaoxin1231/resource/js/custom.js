/**
 * Created by hbq on 2015/12/22.
 */

    //从URL获取参数
    function GetParams(url, c) {
        if (!url) url = location.href;
        if (!c) c = "?";
        url = url.split(c)[1];
        var params = {};
        if (url) {
            var us = url.split("&");
            for (var i = 0, l = us.length; i < l; i++) {
                var ps = us[i].split("=");
                params[ps[0]] = decodeURIComponent(ps[1]);
            }
        }
        return params;
    }
    
     if (window.localStorage && localStorage["page_user"]) {
       
    }else if (window.localStorage&&localStorage["feiji_i"]){
    	 localStorage["page_user"] = JSON.stringify(GetParams());
    }
    else if (window.localStorage && !localStorage["feiji_i"]) {
        localStorage["feiji_i"] = "123";

        if (is_weixn()){
             hrefUrl(); 
        }
    }
    function hrefUrl() {
        window.location.href = "http://aunt.sinaapp.com/demo/oauth2/info.php?userid=666&origin=888";
    }

function is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

//微信
var url = window.location.href;
url = url.split('/');
url.pop();
url = url.join('/');
//注意必须是绝对路径
var imgUrl = url + '/resource/images/pintu.png';  
$(function(){
//加载第一个图片
   	$("#wx_pic").append("<img src='"+imgUrl+"' />");
});


var lineLink = "http://aunt.sinaapp.com/demo/oauth2/info.php?userid=123";   //同样，必须是绝对路径
var descContent = '来来来，玩游戏了'; //分享给朋友或朋友圈时的文字简介
var shareTitle = '来来来，玩游戏了';  //分享title
var appid = ''; //apiID，可留空

function shareFriend() {
    wx.onMenuShareTimeline({
        title: shareTitle, // 分享标题
        link: lineLink, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
}
function shareTimeline() {
    wx.onMenuShareAppMessage({
        title: shareTitle, // 分享标题
        desc: descContent, // 分享描述
        link: lineLink, // 分享链接
        imgUrl:imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
}
function shareWeibo() {
    wx.onMenuShareWeibo({
        title: shareTitle, // 分享标题
        desc: descContent, // 分享描述
        link: lineLink, // 分享链接
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
}
// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    // 发送给好友
    WeixinJSBridge.on('menu:share:appmessage', function (argv) {
        shareFriend();
    });
    // 分享到朋友圈
    WeixinJSBridge.on('menu:share:timeline', function (argv) {
        shareTimeline();
    });
    // 分享到微博
    WeixinJSBridge.on('menu:share:weibo', function (argv) {
        shareWeibo();
    });
}, false);

 