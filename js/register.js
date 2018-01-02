var bar = 0;
$(function() {
	var code;
	var flag;
	var flag2;
	var openId = getParametersOnUrl('openId');
	var recommendId = getParametersOnUrl('recommendId');
	var name = getParametersOnUrl('name');
	var type = getParametersOnUrl('type');
	/*var openId = "oPwpFuONjTxIvdhj4t5XS0u0vtYo";
	var recommendId = 'oPwpFuONjTxIvdhj4t5XS0u0vtYo';*/
	
	var scroll = true;
	var code;
	var h = $('body').height();
    window.onresize = function(){
        if ($('body').height() < h) {
            $('.btn').hide();
        }else{
        	$('.btn').show();
        }
    };
	$('.confirm').click(function() {
		if ($(this).hasClass('translate')) {
			show();
		} else {
			$(this).removeClass('translate');
		}
		$('.shadow').hide();
		$('body').css('overflow','auto');
	})
	//获取验证码
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
		            	 alert(data.msg);
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
	//立即注册
	$('.btn2').click(function() {
		var mobile = $('.mobile input').val();
		var password = $('.password input').val();
		var noticeType = $("input[name='type']:checked").siblings('label').text();
		if(password == ''){
			$('.textMsg').text('请输入密码');
			$('.shadow').show();	        
	        return;
	    } else {
	    	password = hex_md5($('.password input').val());
	    }
		if (noticeType == "老师") {
			flag = true;
		} else {
			flag = false;
		}
		$.ajax({ 
			url:sUrl.register,
			type:'post', 
			data:{
				"openId": openId,
				"mobile": mobile,
				"password": password,
				"isTeacher": flag,
				"recommendId": recommendId,
				"name":name,
				"type":type
			},
			beforeSend:function(XMLHttpRequest){ 
				$('.loading').show();
			}, 
			success:function(data){
				$('.loading').hide();
				conFirm();
			},
			error:function(data) {
				$('.loading').hide();
				alert(data.msg);
			}
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