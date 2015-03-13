/**
 * Created by Administrator on 2015/1/12 0012.
 */
 'use strict';

$(function(){
   //初始化高度
    var $header = $('header'),
        $banner = $('.banner'),
        $products = $('.products'),
        $wrap = $('#wrap'),
        $screen2 = $('#screen-2'),
        $list = $('.list'),
        $listUp = $('.listUp');

    var totolHeight = $(window).height(),
        headerHeight = $header.height(),
        bannerHeight = $banner.height(),
        productsHeight = totolHeight - headerHeight;

    $products.css('height', productsHeight +'px');
    $screen2.css('height',totolHeight - headerHeight +'px');
    $list.css('height', productsHeight - bannerHeight  + 'px');



    //选项卡功能
    (function($){
        var $menuLi = $('.menu li'),
            $listLi = $('.list li'),
            i,len=$menuLi.length;
        var flag = [];
            flag[0]=1, addOneHandle($listLi.eq(0).find('.oneWrap'));
        for(i=1; i<len; i++){
            flag[i] = 0;
        }
        for(i=0; i < len; i++){
            (function (i){
                $menuLi.eq(i).on('click',function(){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    if(flag[i] == 0){
                        var id = $(this).data('id');
                        $.ajax({
                            type: 'GET',
                            url: 'product/'+id,
                            success: function(products){
                                products.forEach(function(product){
                                    var output =  '<div class="oneWrap">'
                                                + '<div class="one" data-id='+product._id+'>'
                                                + '<span class="spot">0</span>'
                                                + '<img src=' + product.img + ' alt=""/>'
                                                + '<p class="title"> <span class="name">'+ product.name +'</span> <span class="remark">'+ product.description +'</span></p>'
                                                + '<span class="value"><b>'+ product.value +'</b>元/份</span>'
                                                + '</div></div>';
                                    $listLi.eq(i).prepend(output);
                                });

                                $listLi.eq(i).prepend('<div class="listUp"></div>');
                                addOneHandle($listLi.eq(i).find('.oneWrap'));
                                flag[i] = 1;
                            }
                        })
                    } 
                    $listLi.eq(i).addClass('selected').siblings().removeClass('selected');
                 });
            })(i);
        }
    })($);
   
    //点击商品统计购买数量 添加时间
    function addOneHandle($one){
        var $allCountSpot = $('.shop .spot'),
            i,len;
        for(i=0, len = $one.length; i < len; i++) {
            $one.eq(i).on('click', function(){
                var $spot = $(this).find('.spot'),
                    originCount = $spot.html() - 0,
                    $sumSpot = $('.products .menu .selected .spot'),
                    originSum = $sumSpot.html() - 0,
                    allCount = $allCountSpot.html() - 0,
                    productPrice = parseFloat($(this).find('.value b').html()),
                    $innerOne = $(this).find('.one'),
                    productId = $innerOne.data('id'),
                    productName = $innerOne.find('.name').html();


                $spot.html(originCount+1);
                changeProductCount(productId,originCount+1);
                $sumSpot.html(originSum +1);
                $allCountSpot.html(allCount + 1);
                if(originCount == 0){
                    $spot.css('display', 'block');
                    addProductDom(productId, productName, productPrice ,1);
                }
                if(originSum == 0) {
                    $sumSpot.css('display', 'block');
                }
                if(allCount ==0) {
                    $allCountSpot.css('display', 'block');
                }

                addPriceSum(productPrice);


            });
        }

        var $spot = $one.find('.spot');
        $spot.on('click', function(event){
           var originCount = $(this).html() - 0,
               $sumSpot = $('.products .menu .selected .spot'),
               originSum = $sumSpot.html() - 0,
               allCount = $allCountSpot.html() - 0,
               price = parseFloat($(this).siblings('.value').find('b').html()),
               $innerOne = $(this).parent();

            $(this).html(originCount- 1);
            changeProductCount($innerOne.data('id'), originCount- 1);
            $sumSpot.html(originSum - 1);
            $allCountSpot.html(allCount - 1);
            if(originCount- 1 <= 0){
                $(this).css('display', 'none');
                delProductDom($innerOne.data('id'));
            }
            if(originSum - 1<= 0 ){
                $sumSpot.css('display', 'none');
            }
            if(allCount - 1<= 0) {
                $allCountSpot.css('display', 'none');
            }
            addPriceSum(-price);
            event.stopPropagation();
        });
    }
    //给订单中总价加价格
    function addPriceSum( addPrice, flag ){
        var $PriceSum = $('.shop .value'),
            oldPrice = parseFloat($PriceSum.html());
            $PriceSum.html(oldPrice + addPrice);
            modifyValueSum(oldPrice + addPrice);
    }
    //修改总价
    function modifyValueSum(value){
        $('.field .price[name="valueSum"]').html(value);
    }
    //向购物车添加dom
    function addProductDom(id, name, value, count) {
        var $productsWrap = $('.products-wrap');
        var newDom = ' <div class="field" data-id="'
                    +id+'" name="products"><span class="name">'
                    +name+'</span><span class="order-c-wrap"><span class="unit">单价:</span><span class="price">'
                    +value+'</span><span class="add hide">+</span><span class="count">'
                    +count+'</span>数量：<span class="reduce hide">-</span></span></div>' ;
        $productsWrap.prepend(newDom);
        //通过按钮商品数量增减
        (function($){
                $('.field .add').off().on('click', function(){
                   var $count = $(this).siblings('.count');
                   var old = parseFloat($count.html());
                   var id = $(this).parent().parent().data('id');
                   changeProductCount(id, old+1);

                });
                $('.field .reduce').off().on('click', function(){
                    var $count = $(this).siblings('.count');
                    var old = parseFloat($count.html());
                    var id = $(this).parent().parent().data('id');
                    changeProductCount(id, old+1);
                });
        })($)

    }
    //对购物车中的物品进行数量改变
    function changeProductCount(id, count) {
        var $product = $('.products-wrap .field[data-id ="'+id+'"]');
        var valueOne = parseFloat($product.find('.price').html());
        var oldCount = parseInt($product.find('.count').html());
        $product.find('.count').html(count);
        var $valueSum = $('.field .price[name="valueSum"]');
        var oldValue = parseFloat($valueSum.html());
        var nowValue = oldValue + (count-oldCount) * valueOne;
        $valueSum.html(nowValue);
    }
    //删除购物车中 的dom
    function delProductDom(id) {
        $('.products-wrap .field[data-id ="'+id+'"]').remove();
    }
    //处理products数据 
    function getOrderJson(){
        var data = {}, products = [];
        var $form = $('#form-1');
        data.address = $form.find('input[name="address"]').val();
        data.phone = parseInt($form.find('input[name="phone"]').val());
        data.remarks = $form.find('input[name="remarks"]').val();
        data.valueSum = parseFloat( $form.find('span[name="valueSum"]').html() );
        data.freight = parseInt( $form.find('span[name="freight"]').html() );
        $('.products-wrap .field').each(function(index){
            var indexData = {},
                $this = $(this);
            indexData.id = $this.data('id');
            indexData.name = $this.find('.name').html();
            indexData.value = parseFloat( $this.find('.price').html() );
            indexData.count = parseInt( $this.find('.count').html() );
            products[products.length] = indexData;
        });
        data.products = products;
        return data;
    }


    //页面跳转代码
    (function($, window){
        var $buy_1 = $('#buy-1'),
            $buy_2 = $('#buy-2'),
            $buy_3 = $('#buy-3'),
            $back_2 = $('#back-2'),
            $back_3 = $('#back-3'),
            $screen_1 = $('#screen-1'),
            $screen_2 = $('#screen-2'),
            $screen_3 = $('#screen-3');

        function jump_1(){
            $screen_1.show();
            $screen_2.hide();
            $screen_3.hide();
            $back_2.hide();
            $back_3.hide();
        }
        function jump_2(){
            $screen_1.hide();
            $screen_2.show();
            $screen_3.hide();
            $back_2.show();
            $back_3.hide();
        }
        function jump_3(){
            $screen_1.hide();
            $screen_2.hide();
            $screen_3.show();
            $back_2.hide();
            $back_3.show();
        }
        $buy_1.on('click', function() {
            jump_2();
          
        });

        $buy_2.on('click', function() {
            jump_3();
        });
        $back_2.on('click', function() {
            jump_1();
        });
        $back_3.on('click', function() {
            jump_2();
        });

        $buy_3.on('click', function(){

            if(checkValidity($('#screen-3 .warningInfo'))){
                var data= JSON.stringify(getOrderJson());
                console.log(data);
                $.ajax({
                    type: 'POST',
                    url: 'order',
                    contentType: "application/json", //必须有
                    data: data,
                    dataType: 'json',
                    success: function(data) {
                        alert('谢谢惠顾，你已成功下单');
                    }
                });
            }
            
        });

    })($, window);

    //页面滚动事件
    (function($){

        function getTop($dom){
            var pattern = /matrix\(\d+\, \d+\, \d+\, \d+\, \d+\, ([0-9\.\-]+)\)/i;
            console.log($dom.css('transform'));
            var matches = pattern.exec($dom.css('transform'));
            return parseFloat(matches[1]);
        }
       var $listLi = $('.list li');
       var startX,startY, startliY;
       $listLi.on('touchstart', function(e){
           var touch = e.touches[0];
           startY = touch.pageY;
           startliY = getTop($(this));
           
           //console.log(startliY);
       }).on('touchmove', function(e){
          // console.log(e.touches);
           var touch = e.touches[0],
               y;
           y =touch.pageY;
           var changeY = y - startY;
          console.log(startliY + changeY);
           $(this).css('transform', 'matrix(1, 0, 0, 1, 0, '+(startliY + changeY)+')');

       }).on('touchend', function(e){
           var endY = getTop($(this));
           if(endY > 0) {
               endY = 0;
           }
           $(this).css('transform', 'matrix(1, 0, 0, 1, 0, '+endY+')');
       });

    })($);

    //过滤输入

    function checkValidity($info) {
       var $form = $('#form-1'),
           address = $form.find('input[name="address"]').val(),
           phone = $form.find('input[name="phone"]').val(),
           remarks = $form.find('input[name="remarks"]').val();

        if( !/\d{11}/.test(phone) ){
            $info.html('!手机格式错误 应为11为长号~');
            return false;
        }
        if( address === ''){
            $info.html('!地址不能为空~');
            return false;
        }

        return true;

    }


    

});