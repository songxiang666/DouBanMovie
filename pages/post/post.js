

//设置文件入口  调用require
var postData = require('../../data/post-data.js');//在这里只能用相对路径

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //小程序总是会读取data对象来做数据绑定，这个动作，我们称为动作A
    //而这个动作实在onload事件执行之后才执行
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var post_content = [
    //   {
    //     date: "Sep 18 2017",
    //     title: "正是虾肥蟹壮时",
    //     imgSrc: "../images/post/crab.png",
    //     avator: "../images/avator/1.png",
    //     content: '菊黄蟹正肥，品尝秋之味，徐志摩把看秋花的荻葫和到楼外吃蟹并列为秋天来杭州不能错过的风雅之事，用林妹妹的话讲是"蟹到嫩玉双双满".',
    //     reading: "112",
    //     collection: "96",
    //   },
    //   {
    //     date: "Nov 26 2017",
    //     title: "比利·林恩的中场故事",
    //     imgSrc: "../images/post/bl.png",
    //     avator: "../images/avator/2.png",
    //     content: '"李安是一位绝不会重复自己的导演，本片将及富原创性李安众所瞩目的新片《比利林恩漫长的中场休息》，正式更名半场无故事，双满".',
    //     reading: "100",
    //     collection: "123",
    //   },
    //   {
    //     date: "Dec 05 2017",
    //     title: "微信·小程序开发工具安装指南",
    //     imgSrc: "../images/post/xiaolong.jpg",
    //     avator: "../images/avator/3.png",
    //     content: '"产品定位及功能介绍 微信小程序是一种全新的连接用户与服务的方式，它可以在微信内被便捷地获取和传播，同时具有出色的使用体验。".',
    //     reading: "10",
    //     collection: "90",
    //   }
    // ]
    // this.setData({
    //   content_key: postData.postlist
    // });

    //设置查看次数相关代码
    var postView = wx.getStorageSync("postView");
    if (postView) {
      for(var i in postView){
        postData.postlist[i].reading=postView[i];
      }
      this.setData({
        content_key: postData.postlist
      })
    } else {
      postView = [];
      wx.setStorageSync("postView", postView)//更新缓存
      this.setData({
        content_key: postData.postlist
      })
    }
  },
  onPostTap:function(event){
    var postId = event.currentTarget.dataset.postid || event.target.dataset.postid;
    postId=postId||0;//防止当postId为0时 短路或运算中会取到undefined  所以直接设置postId为0
    // console.log(postId);

//设置查看次数相关代码
   var postView = wx.getStorageSync("postView");
    postView[postId] = postView[postId]||0;
    postView[postId]+=1;
    postData.postlist[postId].reading+=1;
    this.setData({
      content_key: postData.postlist
    })
    wx.setStorageSync("postView", postView);

    wx.navigateTo({
      url: '/pages/post/post-detail/post-detail?id='+postId
    })
  },
  // onswiperTap:function(event){
  //   var postId = event.target.dataset.postid;
  //   // console.log(postId);
  //   wx.navigateTo({
  //     url: '/pages/post/post-detail/post-detail?id=' + postId
  //   })
  // }
})