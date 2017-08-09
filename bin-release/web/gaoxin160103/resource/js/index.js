/**
 * Created by gaoxin on 2015/12/8.
 */
(function(manager, win) {
    manager.showWin = function(){
    	$("main_end").show();
    	 
    }
	manager.init = function() {
		//平台、设备和操作系统
		var system = {
			win: false,
			mac: false,
			xll: false,
			ipad:false
		};
		//检测平台
		var p = navigator.platform;
		system.win = p.indexOf("Win") == 0;
		system.mac = p.indexOf("Mac") == 0;
		system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
		system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;
		//跳转语句，如果是手机访问就自动跳转到wap.baidu.com页面
		if (system.win || system.mac || system.xll||system.ipad) {
			 
			//btnstart
			$("#btnstart").on("click", function() {
				manager.showSection("game_main",function(){
					$(".main_footer").show();
					$(".main_plan").show();
				});

			});

			$("#btnscore").on("click", function() {
				manager.showSection("game_paihang",function(){
					//排行榜绑定数据
					manager.ajaxPH();
				});

			});

			$("#score_close").on("click", function() {
				manager.showSection("game_start");
			});

			$("#main_go,#end_play").on("click", function() {
				 
				window.c_startGame&&window.c_startGame();
				$("section").hide();
				 
			});

			$("#end_ph").on("click", function() {
				manager.showSection("game_start", function() {

					manager.showSection("game_paihang",function(){
						//排行榜绑定数据
						manager.ajaxPH();
					});

				});

			});
			
			$("#btnGift").on("click",function(){
				window.location.href="http://mp.weixin.qq.com/s?__biz=MjM5NzgxODM4MQ==&mid=400981612&idx=1&sn=bae81c4e355c06ef9f0da186d1cd1bfc#rd";
			});
			 

		} else {
			//btnstart
			$("#btnstart").on("tap", function() {
				manager.showSection("game_main",function(){
					 $(".main_footer").show();
			         $(".main_plan").show();
					
				});
			});

			$("#btnscore").on("tap", function() {
				manager.showSection("game_paihang",function(){
					//排行榜绑定数据
					manager.ajaxPH();
				});

			});

			$("#score_close").on("tap", function() {
				manager.showSection("game_start");
			});

			$("#main_go,#end_play").on("tap", function() {
			 
				window.c_startGame&&window.c_startGame();
				$("section").hide();
				$(".main_footer").hide();
				$(".main_plan").hide();
				
			});

			$("#end_ph").on("tap", function() {
				manager.showSection("game_start", function() {

					manager.showSection("game_paihang",function(){
						//排行榜绑定数据
						manager.ajaxPH();
					});

				});

			});
			
			$("#btnGift").on("tap",function(){
				window.location.href="http://mp.weixin.qq.com/s?__biz=MjM5NzgxODM4MQ==&mid=400981612&idx=1&sn=bae81c4e355c06ef9f0da186d1cd1bfc#rd";
			});
			 
			 
		}
	}
	
	manager.gameEnd = function(config){ 
		//调用ajax 测试接口数据
			manager.showSection("game_end", function() {
                //可以有一个load页面
                 
				var localData = JSON.parse(localStorage["page_user"]);
				//alert($.param(localData));
				var init= {
					station:'20', // 恭喜你到达第20站   小胡传
					country: '澳大利亚', //到达的国家 小胡传
					city: '悉尼', //到达的城市 小胡传
					point: 2000, //本次航行距离 小胡传
					openid: 'qqqqqqqqq', //openid
					sex: 0, //sex
					nickname: 'gaoxin',//昵称
					headimgurl: 'qqqqqqqq' //头像

				}
				$.extend(init,localData||{},config);
				  
				manager.ajaxGame(init, function(data) {
					 
                    if (data){
                    	//给DOM赋值
                    	//data.SNO
					    //data.total
					    //data.point
					   // alert("SNO:"+data.SNO+"total:"+data.total+"point:"+data.point);
					    var content= $("#result_content").find("s");
					    content.eq(0).html(config.station); 
					    content.eq(1).html( config.country); 
					    content.eq(2).html(config.city); 
					    content.eq(3).html(Math.round((data.total-data.SNO) / data.total *100)); 
					    content.eq(4).html(config.point); 
					    content.eq(5).html(data.point); 
					    content.eq(6).html(data.SNO); 
					    
                    }
                    
					//恭喜你达到第20站    config.station
					//国家  config.country  config.city
					//战胜10%的机长   (data.total-data.SNO) / data.total *100
					//最佳航行距离  data.point
					//最佳排名1  data.SNO
					
					
				});

			});

		
	}
		
	manager.ajaxGame = function(config, callback) { 
       //alert($.param(config)  );
        
		$.ajax({
			type: "get",
			url: "http://115.47.45.75:8017/server/tools/user_ajax.ashx?action=save&json="+JSON.stringify(config),
			async: true,
			dataType: 'jsonp',  
			jsonp:"jsoncallback",  
		
			success: function(result) {
				//alert(JSON.stringify(result.data)); 
				if (result && result.msg == 1 && result.data) {
					callback(result.data[0]);
				} else {
					callback(null);
				}

			}
		});


	}
    
    manager.ajaxPH = function(){
    	    
    		//加载排行榜数据
			$.ajax({
			type: "get",
			url: "http://115.47.45.75:8017/server/tools/user_ajax.ashx?action=get_list",
			async: true,
			dataType: 'jsonp',  
			jsonp:"jsoncallback",  
			success: function(result) {
				//alert(JSON.stringify(result.data));
				if (result && result.msg == 1 && result.data) {
					 var ulContent= $("#ph_content").empty();
					 var str="";
					 $(result.data).forEach(function (n, i) {
                        //n.headimgurl    n.nickname  n.point   n.country    n.city
                        //给排行榜页面赋值
                        str+='<li><img src="resource/images/ph_number'+(i>2?"":i+1)+'.png" class="img_number" />';
                        str+=' <img src="'+n.headimgurl+'" class="img_photo"/>';
                        str+='<span>'+n.nickname+'</span>';
                        str+=' <span>'+n.point+'km</span>';
                        str+=' <span>'+ (i>2? i :"") +'</span>';
                    });
                    ulContent.append(str);
				}

			}
		});
    	
    	
    }

    manager.showSection = function(id, callback) {
		$("section").hide();
		$("#" + id).show();
		if (callback) {
			callback();
		}

	}

	//游戏结束时，显示动态飞机
	manager.showEnd = function() {
		$(".main_end").show();

	}

	//截取超长的用户昵称
	function splitStr(str) {
		var maxSize = 6;
		if (str && str.length > maxSize) {
			str = str.substr(0, maxSize) + "..";
		}
		return str;
	}
    
})(window.airplane || (window.airplane = {}), window);