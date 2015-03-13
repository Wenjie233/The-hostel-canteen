$(document).ready(function(){

	

	function InderPage(home, cart){
		this.$home = $(home);
		this.$cart = $(cart);
		this.$turnCart = $('#cart');
		this.$backHome = $('#backHome');
		this.$classify = this.$home.find('.classify');
		this.$classify_div = this.$classify.find('div');
		this.$mask = this.$home.find('.mask');
		this.$out_classify_li = this.$classify.children('.out-classify').find('li');
		this.$all_pro = this.$home.find('.all-pro-wrap');
		this.$pros = this.$all_pro.find('.pro');
		this.$info = this.$home.find('.shop .info');
		this.order = {};
		this.$shopInfo = $('#shop-info');
		this.$allCount = this.$shopInfo.children('.allCount');
		this.$valueSum = this.$shopInfo.children('.valueSum');

		this.$list = this.$cart.find('.detail ul');
		this.$freight = this.$cart.find('.freight span b');
		this.$listTotal = this.$cart.find('.total span b');

		this.$submit = $('#submit');
		this.$cartButton = $('#cart');
	}

	InderPage.prototype.render = function() {
		this._updateOrderbyCookie();
		this._init();
		this._headimgRadius();
	}
	//头像的远边初始化
	InderPage.prototype._headimgRadius = function() {
		var that = this;
		var $headimg = $('.userheadimg');
		var width = parseFloat($headimg.css('width'));
		$headimg.css('border-radius', width/2 + 'px');
	}
	//根据cookie初始化order数据 并改变dom显示
	InderPage.prototype._updateOrderbyCookie = function() {
		var that = this;
		var cookieOrder = $.fn.cookie('order');
		if(JSON.parse(decodeURIComponent(cookieOrder))){
			that.order = JSON.parse(decodeURIComponent(cookieOrder));
			that.$info.hide();
			that.$shopInfo.show();
			that._updateProsDombyOrder();
			that._checkCountPrice();
		}
	}

	InderPage.prototype._updateCookie = function() {
		var that = this;
		$.fn.cookie('order', encodeURIComponent(JSON.stringify(that.order)), { expires: 2 });
	}
	//将数据映射到首页dom中
	InderPage.prototype._updateProsDombyOrder = function() {
		var that = this;
		that.$pros.each(function(index) {
				var i,len,
					$this = $(this),
					id = $this.data('id'),
					$count = $this.find('.count');

				$this.removeClass('show');
				$count.html('0');

				for(i = 0, len = that.order.products.length; i < len; i ++ ){
					if(id == that.order.products[i].id) {
						$this.addClass('show');
						$count.html(that.order.products[i].count);
						break;
					}
				}

			});
		that.$allCount.html(that.order.countSum);
		that.$valueSum.html(that.order.valueSum); 
	}

	//初始化弹出分类事件
	InderPage.prototype._popClassify = function() {
		var that = this;
		that.$classify.on('click', function(){
			console.log('add');
			$(this).addClass('pop');
			that.$mask.show();
			that.$classify_div.one('click', hideMask);
		});

		that.$out_classify_li.each(function(index){
			var $thisSelect = $(this);
			$thisSelect.on('click', function(e){
				//$thisSelect.addClass('selected').siblings().removeClass('selected');
				//that.$all_pro.eq(index).addClass('selected').siblings().removeClass('selected');
				hideMask(e);
			})
		});
		that.$mask.on('click', hideMask);
		
		function hideMask(e){
			console.log('remove');
			that.$classify.removeClass('pop');
			that.$mask.hide();
			that.$classify_div.off();
			if(e) {
				e.stopPropagation();
			}
		}
	}

	

	InderPage.prototype._countNum = function($dom, flag){
		if(flag === '+') {
			$dom.html(parseInt($dom.html()) + 1);
		} else if( flag === '-') {
			$dom.html(parseInt($dom.html()) - 1);
		} else {
			return parseInt($dom.html());
		}
	}
	InderPage.prototype._countPrice = function ($dom, flag, num) {
			if(flag === '+'){
				$dom.html(parseFloat($dom.html()) + num);
			} else if( flag === '-') {
				$dom.html(parseFloat($dom.html()) - num);

			} else {
				return parseFloat($dom.html());
			}
			this._checkCountPrice();
	}

	InderPage.prototype._checkCountPrice = function() {
		var that = this;
		if(that._countNum(that.$allCount) >= 1 ) {
			that.$cartButton.removeClass('ban');
			that.$turnCart.off();
			that.$turnCart.on('click', homeToCart);
		} else {
			that.$cartButton.addClass('ban');
			that.$turnCart.off();
		}

		//购物车页面与商品页面切换
		function homeToCart(){
			that.$submit.removeClass('hide');
			that._updateOrder();
			that._updateListDom();
			that._updateCookie();
			that.$cart.show();
			that.$home.hide();
		}
	}

	InderPage.prototype._updateOrder= function() {
		var that = this;
		that.order.valueSum = that._countPrice(that.$valueSum);
		that.order.freight = 1;
		if(that.order.valueSum >= 10){
			that.order.freight = 0;
		}
		that.order.countSum = that._countNum(that.$allCount);
		that.order.products = [];
		that.$pros.each(function(index) {
			var $this = $(this);
				$thisCount = $this.find('.count'),
				product = {};
			if( that._countNum($thisCount) > 0 ) {
				product = {
					id: $this.data('id'),
					name: $this.find('.name').html(),
					count: that._countNum($thisCount),
					value: parseFloat($this.find('.price b').html())
				}
				that.order.products.push(product);
			}
		});
	}

	InderPage.prototype._updateListDom = function(){
		var that = this;
		that.$freight.html(that.order.freight);
		that.$listTotal.html(that.order.valueSum + that.order.freight);
		that.$list.html('');
		var i, len;
		for(i=0, len=that.order.products.length; i < len; i++) {
			var nowDom = '<li data-id="'+ that.order.products[i].id +'"><div class="img"><img src="images/miao.jpg" alt=""></div>'
					    +'<div class="name"><span class="price">'+ that.order.products[i].value +'</span>元/件 '
					    +'<span class="innername">'+that.order.products[i].name +'</span></div>'
						+'<div class="amount"><button class="reduce"><i class="iconfont">&#xe60c;</i></button>'
						+'<div class="num">'+ that.order.products[i].count +'</div>'
						+'<button class="add"><i class="iconfont">&#xe603;</i></button>'
				  		+'</div>'
				  		+'<div class="priceSum">¥ <b>'+that.order.products[i].value*that.order.products[i].count + '</b></div>'
						+'</li>';
			that.$list.append(nowDom);
		}
		addHandle(); //给更新了的dom中的加减添加事件

		function addHandle() {
			var $add = that.$list.find('.add'),
				$reduce =  that.$list.find('.reduce');

			$add.on('click', function(){
				var $this = $(this),
					price = parseFloat($this.parent().siblings('.name').children('.price').html()),
					$num = $this.siblings('.num'),
					$priceSum = $this.parent().siblings('.priceSum').children('b');
				
				$num.html(parseInt($num.html()) + 1);
				$priceSum.html( parseFloat($priceSum.html()) + price);
				that.$listTotal.html( parseFloat(that.$listTotal.html()) + price );
				handleFreight(that.$listTotal.html());
			});

			$reduce.on('click', function(){
				var $this = $(this),
					price = parseFloat($this.parent().siblings('.name').children('.price').html()),
					$num = $this.siblings('.num'),
					$priceSum = $this.parent().siblings('.priceSum').children('b'),
					$thisLi = $this.parent().parent();
				
				$num.html(parseInt($num.html()) - 1);
				$priceSum.html( parseFloat($priceSum.html()) - price);
				that.$listTotal.html( parseFloat(that.$listTotal.html()) - price );
				handleFreight(that.$listTotal.html());

				if(parseInt($num.html())  ===  0 ){
					$thisLi.remove();
					if(that.$list.html() === '') {
						var divDom = '<div class="cart-waring">么么哒,你的购物车为空<br>无法进行结算<br>请重新选购</div>';
						that.$list.append(divDom);
						that.$submit.addClass('hide');
						that.$cartButton.addClass('ban');
						that.$turnCart.off();
					}
				}
			});
		}

		//监听价格变化改变订单运费
		function handleFreight( nowTotal ){
			if(that.order.freight == 1 && nowTotal >= 11) {
				that.order.freight = 0;
				that.$freight.html('0');
				that.$listTotal.html( parseFloat(that.$listTotal.html()) - 1 );
			} else if (that.order.freight == 0 && nowTotal < 10){
				that.order.freight = 1;
				that.$freight.html('1');
				that.$listTotal.html( parseFloat(that.$listTotal.html()) + 1 );
			}
		}
	}


	InderPage.prototype._init = function(){
		var that = this;
		this._popClassify();
		//商品事件
		that.$pros.on('click', function(){
			var $pro  =  $(this);
			$pro.addClass('show');
			proAdd($pro);
		}).one('click', function () {
			that.$info.hide();
			that.$shopInfo.show();
		});

		var $del = that.$pros.find('.del');
		$del.on('click', function(e){
			var $thisPro = $(this).parent().parent();
			proReduce($thisPro);
			e.stopPropagation();
		});

		function proAdd( $pro ){
			var $count = $pro.find('.count'),
				$price = $pro.find('.price b');

			that._countNum($count, '+');
			that._countNum(that.$allCount, '+');

			that._countPrice(that.$valueSum, '+', that._countPrice($price));


		}

		function proReduce( $pro ) {
			var $count = $pro.find('.count'),
				nowCount = parseInt($count.html()) - 1,
				$price = $pro.find('.price b');

			if(nowCount === 0) {
				$pro.removeClass('show');
			}
			that._countNum($count, '-');
			that._countNum(that.$allCount, '-');

			that._countPrice(that.$valueSum, '-', that._countPrice($price));
		}



		
		that.$backHome.on('click', function(){
			that.$cart.hide();
			that.$home.show();
			updateOrderFromList(); //从购物车中更新order数据
			that._updateProsDombyOrder();
			that._updateCookie();
		});

		function updateOrderFromList() {
			that.order = {};
			that.order.countSum = 0;
			that.order.valueSum = 0;
			that.order.freight = 1;
			that.order.products = [];
			var $listLi = that.$list.find('li');

			$listLi.each(function(index) {
				var product = {},
					$this = $(this);

				product = {
					id: $this.data('id'),
					name: $this.find('.innername').html(),
					count: that._countNum($this.find('.num')),
					value: parseFloat($this.find('.price').html())
				}
				that.order.products.push(product);
				that.order.countSum += product.count;
				that.order.valueSum += product.count * product.value;
			});

		}

		//提交

		that.$submit.on('click', function() {
			that.order.allValueSum = that.order.valueSum + that.order.freight;
			that.order.wechatInfo = {};
			that.order.wechatInfo.nickname = $('input[name="wechatInfo.nickname"]').val();
			that.order.wechatInfo.openid = $('input[name="wechatInfo.openid"]').val();
			var data = JSON.stringify(that.order);
			var thisUrl = window.location.href;
			var regexp = /http:\/\/[a-zA-Z0-9:.]+\//i;
			var r = regexp.exec(thisUrl);
			var url = r[0]+'account';
			that._updateCookie();
			console.log(data);
			window.location.href = url;
		});

	}

	

	var i = new InderPage('#home', '#shop-cart');
	i.render();

})
