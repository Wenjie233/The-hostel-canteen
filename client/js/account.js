'use strict';

$(document).ready(function(){
	var $submit = $('#submit');
	$submit.on('click', function(){
		var $addressRadio = $('input[name="chooseAddress"]'),
			i, radioValue;
		$addressRadio.each(function(index) {
			if( this.checked ) {
				radioValue = this.value;
			}
		});
		console.log(radioValue);



		if(radioValue === 'defaultInfo'){
			var cookieOrder = $.fn.cookie('order');
			var order = JSON.parse( decodeURIComponent(cookieOrder) );
			order.area = $('.defaultInfo-area').data('area');
			order.address = $('.defaultInfo-address').data('address');
			order.linkman = $('.defaultInfo-linkman').data('linkman');
			order.phone = parseInt($('.defaultInfo-phone').data('phone'));
			order.remarks = $('.remarks').val();

			ajaxOrder(order);

		} else if( radioValue === 'newInfo' && checkValidity() ) {

			var cookieOrder = $.fn.cookie('order');
			var order = JSON.parse( decodeURIComponent(cookieOrder) );
			order.area = $('.area').val();
			order.address = $('.address').val();
			order.linkman = $('.linkman').val();
			order.phone = parseInt($('.phone').val());
			order.remarks = $('.remarks').val();

			ajaxOrder(order);
			
		} else {
			$('.warning-info').addClass('show');
		}

		function ajaxOrder ( order ) {
			$('.warning-info').removeClass('show');
			
			var regexp = /(http:\/\/[a-zA-Z0-9:.]+\/)account/i;
			var url = window.location.href;
			var r = regexp.exec(url);

			console.log(order);
			var data = JSON.stringify(order);
			$.ajax({
	                    type: 'POST',
	                    url: 'order',
	                    contentType: "application/json", //必须有
	                    data: data,
	                    dataType: 'json',
	                    success: function(data) {
	                    	$.fn.cookie('order', '', { expires: -1 });
	                        alert('谢谢惠顾，你已成功下单');

	                        window.location.href= r[1] + 'success';
	        }});
		}

	});

	var $back = $('.back');
	$back.on('click', function(){
		window.history.back();
	});

	 //过滤输入
    function checkValidity() {
       var $info = $('.warning-info span'),
	       	address = $('.address').val(),
	        phone = $('.phone').val(),
	        name = $('.linkman').val(),
	        remarks = $('.remarks').val(),
	        area = $('.area').val();

        if(area === '') {
        	$info.html('请选择你所居住的区域');
        	return false;
        }
        if( address === ''){
            $info.html('地址不能为空');
            return false;
        }
        if(name === '') {
        	$info.html('请输入联系人姓名');
        	return false;
        }

        if( !/\d{11}/.test(phone) ){
            $info.html('手机格式错误 应为11为长号');
            return false;
        }
      
        return true;

    }

	
	

});