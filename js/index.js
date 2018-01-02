var bar = 0;
$(function() {
	var code;
	var flag;
	var flag2;
	var isTap;
	var scroll = true;
	var code;
	var before = $(window).scrollTop();
	$(window).scroll(function() {
		var scrollTop = $(this).scrollTop();
	　　	var scrollHeight = $(document).height();
	　　	var windowHeight = $(this).height();
	　　	var after = $(window).scrollTop();
	　　	console.log(scrollTop)
	  	console.log(scrollHeight)
	  	console.log(windowHeight)
        if (before<after) {
       	 	var height = $(document).scrollTop();                                
	            before = after;
	            if (height > scrollTop) {
	    			$('.scroll').hide();
	    			$('.bottom').show();
	    		} else if (scroll){
		   			$('.scroll').show();
		   			$('.bottom').hide();
		   		}
        };
        if (before>after) {
       	 	var height = $(document).scrollTop();          
            before = after;          
            if (height < scrollTop) {
	           	if (isTap) {
	           	} else{
	           		$('.scroll').show();
	         		$('.bottom').hide();
	           	}
     		} else if (scroll){
	   			$('.scroll').show();
	   			$('.bottom').hide();
	   		}
        };
        if(scrollTop + windowHeight == scrollHeight){
	　　　　	$('.scroll').hide();
 			$('.bottom').show();
	　　	}
	})
	var h = $('body').height();
    window.onresize = function(){
        if ($('body').height() < h) {
            $('.btn').hide();
            $('.scroll_btn').hide();
        }else{
        	isTap = true;
        	$('.btn').show();
			$('.scroll_btn').show();
        }
    };
	$('.confirm').click(function() {
		$('.shadow').hide();
		$('body').removeClass('add');
		$('html,body').scrollTop($('.inputs').offset().top)
	})
	$('.padding').click(function() {
		var mobile = $('.mobile input').val();
		var regMobile = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
		if(mobile==''){
			$('.textMsg').text('请输入手机号码')
			$('.shadow').show();
	        return ;
	    }
		if (regMobile.test(mobile)) {
			if ($(".msg").text() == "获取验证码") {
				disableButton(60);
				sercice(sUrl.sendSMS,function(data) {
					if(data.success){
						code = data.body.Code;
						console.log(code);						
		             } else {
		            	 alert("系统繁忙，请稍后重试！");
		             }
				},{
					"mobile": mobile
				})
			}
		} else {
			$('.textMsg').text("请输入正确的手机号")
			$('.shadow').show();			
		}
	})
	$('.bottom .btn').click(function(){
		var mobile = $('.mobile input').val();
		var msgCode = $('.message input').val();
		var user = $('.user input').val();		
		var username=/(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\.·。]{0,8}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,8}[a-zA-Z]{1}$)/;
		if (user == '') {
			$('.textMsg').text('请输入姓名');
			$('.shadow').show();
			$('.shadow').css("height",$('.container').height());
			$('.shadow .box').css({
				'height': '120px',
			    'position': 'absolute',
			    'bottom': '200px',
			    'left':'50%',
			    'margin-left':'-2.7rem'
			});
			var top = $(window).scrollTop();//获取页面的scrollTop；
            $('body').css("top",-top+"px");//给body一个负的top值；
            $('body').addClass('add');//给body增加一个类，position:fixed;
			return;
		}
		if(!username.test(user)){
       		$('.textMsg').text("姓名只能输入中文和英文");
       		$('.shadow').show();
			$('.shadow').css("height",$('.container').height());
			$('.shadow .box').css({
				'height': '120px',
			    'position': 'absolute',
			    'bottom': '200px',
			    'left':'50%',
			    'margin-left':'-2.7rem'
			});
			$('body').css('overflow','hidden');
       		return;
       	}
		if(mobile==''){
			$('.textMsg').text('请输入手机号码');
			$('.shadow').show();
			$('.shadow').css("height",$('.container').height());
			$('.shadow .box').css({
				'height': '120px',
			    'position': 'absolute',
			    'bottom': '200px',
			    'left':'50%',
			    'margin-left':'-2.7rem'
			});
			$('body').css('overflow','hidden');
	        //alert('请输入手机号码');
			return;
	    } 
		if(msgCode == ''){
			$('.textMsg').text('请输入验证码')
			$('.shadow').show();
			$('.shadow').css("height",$('.container').height());
			$('.shadow .box').css({
				'height': '120px',
			    'position': 'absolute',
			    'bottom': '200px',
			    'left':'50%',
			    'margin-left':'-2.7rem'
			});
			$('body').css('overflow','hidden');
	        //alert('请输入验证码');
	        return ;
	    }
		if (msgCode == code) {
			$.ajax({ 
				url:sUrl.joinActivity,
				type:'post', 
				data:{
					"openId": openId,
					"mobile": mobile,
					"recommendId":recommendId,
					"name":user,
					'type':type
				},
				beforeSend:function(XMLHttpRequest){ 
					$('.loading').show();
				}, 
				success:function(data){
						if (data.success) {
							$('.loading').hide();
							setTimeout(function(){
								conFirm();
							},1000)							
						} else if(data.msg == "您还未注册，请先注册！"){	
							location.href = path + '/masterActivity/register?openId='+openId+'&recommendId='+recommendId+'&name='+encodeURI(encodeURI(user))+'&type='+type;							
						} else {
							alert("系统繁忙，请稍后重试！")				
						}
				}
			});
			$('body').css('overflow','auto');
		} else {
			$('.textMsg').text("请输入正确的验证码！");
			$('.shadow').show();
			$('.shadow').css("height",$('.container').height());
			$('.shadow .box').css({
				'height': '120px',
			    'position': 'absolute',
			    'bottom': '200px',
			    'left':'50%',
			    'margin-left':'-2.7rem'
			});
			$('body').css('overflow','hidden');
		}	
	})
	$('.scroll .scroll_btn').click(function() {
		$('html,body').animate({
			scrollTop:$('.inputs').offset().top
			},800,function() {
				$('.scroll').hide();
				$('.bottom').show();
			});
	})
})
function changeNoticeType(span){
	$('.spanSechduRadio').find('input').removeProp('checked');
	$('.spanSechduRadio').find('input').attr('ischeck',false);
	$('.spanSechduRadio').find('img').attr('src',path +'/register/img/close.png');
	
	$(span).find('img').attr('src',path + '/register/img/open.png');
	$(span).find('input').prop('checked',true);
	$(span).find('input').attr('ischeck',true);
	
}
function disableButton(num) {
	if (num > 0) {
		$(".msg").text("请" + num + "秒后重试");
		num--;
		if (bar) {
			num = 0;
		}
		setTimeout("disableButton(" + num + ")", 1000);
	} else {
		$(".msg").text("获取验证码");
	}
}
function canCel(obj){
	$(".shadow").hide();
	$("body").css({height:"",overflow:"",paddingBottom:""});
	$("html").css({height:"",overflow:"",paddingBottom:""});
	$(".tabItem ul li").removeClass("active");
	$(".tabItem ul li:eq(0)").addClass("active");
}
function conFirm(){
	sercice(sUrl.getSign,function(data) {
		var appId = data.body.appId;
		var noncestr = data.body.noncestr;
		var signature = data.body.signature;
		var timestamp = data.body.timestamp;
		wx.config({
            debug: false,
            appId: appId,
            timestamp: timestamp, 
            nonceStr: noncestr, 
            signature: signature
		});
	   wx.ready(function () {
		   wx.closeWindow();
	   })
	},{
		"url": location.href.split('#')[0]
	})	
}