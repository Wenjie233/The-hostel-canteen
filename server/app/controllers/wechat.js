
'use strict';

var wechat = require('wechat'),
    config = require('../../config/environment'),
    request = require('request'),
    appid = global.config.appid,
    secret = global.config.secret,
    reflashTime = 7000000,
    OAuth = require('wechat-oauth'),
    client = new OAuth(appid, secret),
    Order = require('./../models/orders');

function getOAuthUrl() {
    var url = client.getAuthorizeURL(global.config.host, ' ', 'snsapi_userinfo');
    console.log(url);
    return url;
}

function getAccessToken(){
    request.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+secret, function(error, response,body){
        if(error){
            console.log('getAccessToken error!');
        }
        //console.log(body);
        var obj = JSON.parse(body);
        global.ACCESS_TOKEN = obj.access_token;
        console.log('!!!ACCESS_TOKEN: ', ACCESS_TOKEN);
    });
}
getAccessToken();
setInterval(getAccessToken, reflashTime);


//获取用户信息
function getInformation(message, callback){
    var url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+ACCESS_TOKEN+'&openid='+message.FromUserName+'&lang=zh_CN';
    request.get(url, function(err, response, body){
        if(!err) {
            callback(null, response, body);
        } else {
            callback(err, null, null);
        }
        
    });
}


function setWechatMenu(){
    var REDIRECT_URI = escape("http://dingdangmarket.duapp.com/api/wechat/oauth");
    var data = {
        button:[
            {
                type: 'view',
                name: '吃哩馆',
                url: getOAuthUrl()
            },
            {
                type: 'click',
                name: '推荐零食',
                key: 'recommendedSnacks'
            },
            {
                name: '订单服务',
                sub_button: [{
                    type: 'click',
                    name: '查询配送订单',
                    key: 'getCurrentOrder'
                },{
                    type: 'click',
                    name: '查询历史订单',
                    key: 'getPastOrder'
                }
                ]
                
            }

        ]
    };
    request.post({
        url: 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + ACCESS_TOKEN,
        form: JSON.stringify(data)
    }, function(err, httpResponse,body){
        if(err) return console.log('err');
        console.log(body);
    });
}

//setTimeout(setWechatMenu, 5000);






exports.chat = wechat(config.Token, wechat.text(function (message, req, res, next) {
        // message为文本内容
        // { ToUserName: 'gh_d3e07d51b513',
        // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
        // CreateTime: '1359125035',
        // MsgType: 'text',
        // Content: 'http',
        // MsgId: '5837397576500011341' }
    switch (message.Content){
        case 'me' : getInformation(message, function(err, response, body){
                        if (!err && response.statusCode == 200) {
                             return res.reply({type: "text", content: body });
                        }
                    });
                    break;
        
        default : res.reply([{
                title: '叮当小卖部',
                description: '点进去，一定会有你的想要的零食~',
                picurl: config.host +'images/miao.jpg',
                url: getOAuthUrl()
            }]);

    }


    }).image(function (message, req, res, next) {
        // message为图片内容
        // { ToUserName: 'gh_d3e07d51b513',
        // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
        // CreateTime: '1359124971',
        // MsgType: 'image',
        // PicUrl: 'http://mmsns.qpic.cn/mmsns/bfc815ygvIWcaaZlEXJV7NzhmA3Y2fc4eBOxLjpPI60Q1Q6ibYicwg/0',
        // MediaId: 'media_id',
        // MsgId: '5837397301622104395' }

    }).voice(function (message, req, res, next) {
        // message为音频内容
        // { ToUserName: 'gh_d3e07d51b513',
        // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
        // CreateTime: '1359125022',
        // MsgType: 'voice',
        // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
        // Format: 'amr',
        // MsgId: '5837397520665436492' }
        res.reply({type: "text", content: '呵呵'});
    }).video(function (message, req, res, next) {
        // message为视频内容
        // { ToUserName: 'gh_d3e07d51b513',
        // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
        // CreateTime: '1359125022',
        // MsgType: 'video',
        // MediaId: 'OMYnpghh8fRfzHL8obuboDN9rmLig4s0xdpoNT6a5BoFZWufbE6srbCKc_bxduzS',
        // ThumbMediaId: 'media_id',
        // MsgId: '5837397520665436492' }
        res.reply({
            type: "video",
            content: {
                title: '来段视频吧',
                description: '女神与高富帅',
                mediaId: 'mediaId'
            }
        });
    }).location(function (message, req, res, next) {
        // message为位置内容
        // { ToUserName: 'gh_d3e07d51b513',
        // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
        // CreateTime: '1359125311',
        // MsgType: 'location',
        // Location_X: '30.283950',
        // Location_Y: '120.063139',
        // Scale: '15',
        // Label: {},
        // MsgId: '5837398761910985062' }
        res.reply({type: "text", content: '呵呵'});
    }).link(function (message, req, res, next) {
        // message为链接内容
        // { ToUserName: 'gh_d3e07d51b513',
        // FromUserName: 'oPKu7jgOibOA-De4u8J2RuNKpZRw',
        // CreateTime: '1359125022',
        // MsgType: 'link',
        // Title: '公众平台官网链接',
        // Description: '公众平台官网链接',
        // Url: 'http://1024.com/',
        // MsgId: '5837397520665436492' }
        res.reply({type: "text", content: '呵呵'});
    }).event(function (message, req, res, next) {
        //当关注微信号时的消息
        if(message.Event === 'subscribe' ){
            res.reply([
                {
                    title: '欢迎关注你的叮当零食铺',
                    description: '',
                    picurl: config.host +'images/miao.jpg',
                    url: getOAuthUrl()
                }

            ]);
        }
        //点击菜单拉取消息时的事件推送
        if(message.Event === 'CLICK') {
            if(message.EventKey === 'getCurrentOrder') {
                 getInformation(message, function(err, response, body){
                    if (!err && response.statusCode == 200) {
                        var info = JSON.parse(body);
                        console.log(info);
                        Order.find({
                            state : 1,
                            'wechatInfo.openid': info.openid 
                        }).limit(5).exec(function(err, order){
                            
                            if(err) { return res.status(500).send(err); }
                            if(order.length === 0) {
                                return res.reply('\n 么么哒 你还没有下单哟 \n\n请点击菜单\'吃哩馆\'进行选购哟 \n');
                            } else {
                                var text = '么么哒 这是你的配送订单 \n吃哩胸正火速赶来 ╮(￣▽￣)╭\n';
                                var br = '=======================\n';
                                text += br;
                                var i,j;
                                for(i=0; i < order.length; i++) {
                                    text += '订单NO.'+(i+1) +'\n'
                                            +'联系人：' + order[i].linkman + '\n'
                                            +'联系号码：' + order[i].phone + '\n' 
                                            +'联系地址：' + order[i].area + ' ' + order[i].address + '\n'
                                            +'订单总价：' + order[i].allValueSum + ' 元 \n'
                                            +'送货小费：' + order[i].freight + ' 元\n';
                                    text += '商品清单：\n';
                                    for(j=0 ; j< order[i].products.length; j++) {
                                        text+= order[i].products[j].name + '  \n' 
                                                + order[i].products[j].value +' 元/份 * ' + order[i].products[j].count 
                                                + ' 份 = ' + (order[i].products[j].value*order[i].products[j].count)+' 元\n';

                                    } 
                                    text += br;
                                }

                                res.reply(text);
                            }

                        });
                    }
                });     
            } else if(message.EventKey === 'getPastOrder') {
                getInformation(message, function(err, response, body){
                    if (!err && response.statusCode == 200) {
                        var info = JSON.parse(body);
                        Order.find({
                            state : 3,
                            'wechatInfo.openid': info.openid 
                        }).limit(5).exec(function(err, order){
                            if(err) { return res.status(500).send(err); }
                            if(order.length === 0) {
                                return res.reply('\n     ＼(☆o☆)／\n 么么哒 你还没吃过我耶 \n\n快点击菜单\'吃哩馆\'吃掉我吧\n');
                            } else {
                                var text = '么么哒 这是你的历史订单 \n最多只能显示5条哟 ╮(￣▽￣)╭\n';
                                var br = '=======================\n';
                                text += br;
                                var i,j;
                                for(i=0; i < order.length; i++) {
                                    text += '订单NO.'+(i+1) +'\n'
                                            +'联系人：' + order[i].linkman + '\n'
                                            +'联系号码：' + order[i].phone + '\n' 
                                            +'联系地址：' + order[i].area + ' ' + order[i].address + '\n'
                                            +'订单总价：' + order[i].allValueSum + ' 元 \n'
                                            +'送货小费：' + order[i].freight + ' 元\n';
                                    text += '商品清单：\n';
                                    for(j=0 ; j< order[i].products.length; j++) {
                                        text+= order[i].products[j].name + '  \n' 
                                                + order[i].products[j].value +' 元/份 * ' + order[i].products[j].count 
                                                + ' 份 = ' + (order[i].products[j].value*order[i].products[j].count)+' 元\n';

                                    } 
                                    text += br;
                                }

                                res.reply(text);
                            }
                        });
            }});
            } else if (message.EventKey === 'recommendedSnacks') {
                res.reply('么么哒，今日推荐你吃香蕉哟\n 黄黄的香蕉，香嫩的口感\n 它能减肥又能增肥\n 它能排便又能增便\n吃吃吃，么么哒＼(☆o☆)／');
            }
        }
    }));
