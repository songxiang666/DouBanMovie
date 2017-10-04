var postId = require('../../../data/post-data.js');
var app = getApp();//获取到App.js中data的数据
Page({
  data: {
    // isplaying:false
  },
  onLoad: function (option) {
    var id = option.id;
    this.data.id = id;
    this.setData(postId.postlist[id]);
    // console.log(postId.postlist[id]);

    // var postCollected={
    //   1:"true",
    //   2:"false"
    // }
    var postCollected = wx.getStorageSync("postCollected");
    if (postCollected) {
      var collected = postCollected[id];
      this.setData({
        collected: collected
      })
    } else {
      postCollected = {};
      postCollected[id] = false;
      wx.setStorageSync("postCollected", postCollected)//更新缓存
      this.setData({
        collected: false
      });
    }
    this.onMusicMonitor();
    if (app.globalData.g_isplaying && app.globalData.g_currentId === id) {
      this.setData({
        isplaying: true
      });
    }
  },
  onCollectedTap: function (event) {
    var postCollected = wx.getStorageSync("postCollected");
    var collected = postCollected[this.data.id];//通过data获取对应的id中的值
    collected = !collected;
    postCollected[this.data.id] = collected;//将改变的值存入postCollected中
    // wx.setStorageSync("postCollected", postCollected);//更新缓存
    // this.setData({
    //   collected:collected
    // });
    //this.showModal(postCollected,collected);
    this.showToast(postCollected, collected);

  },
  //演示异步操作
  getPostsCollectedAsy: function () {
    var that = this;
    wx.getStorage({
      key: 'postCollected',
      success: function (res) {
        var postCollected = res.data;//获取到缓存数据
        var collected = postCollected[that.data.id];
        collected = !collected;
        postCollected[that.data.id] = collected;
        that.showToast(postCollected, collected);
      },
    })
  },
  showToast: function (postCollected, collected) {
    //无需确认直接更新缓存值
    wx.setStorageSync("postCollected", postCollected);//更新缓存
    this.setData({
      collected: collected
    });
    wx.showToast({
      title: collected ? '收藏成功' : "取消成功",
      duration: 1000,
      icon: "success"
    });
  },
  // showModal:function(postCollected,collected){
  //   var that=this;
  //   wx.showModal({
  //     title: '收藏',
  //     content:collected?'收藏该文章?':"取消收藏该文章?",
  //     showCancel: true,
  //     cancelText:"取消",
  //     cancelColor:"#333",
  //     confirmText:"确认",
  //     confirmColor:"#405f80",
  //     success:function(res){
  //       if(res.confirm){//只有在点击确认之后才更改数据
  //         wx.setStorageSync("postCollected", postCollected);//更新缓存
  //         that.setData({
  //           collected: collected
  //         });
  //       }
  //     }
  //   })
  // }
  onshareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到盆友圈",
      "分享到QQ空间",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#4050t80",
      success: function (res) {
        //res有两个属性
        //res.cancel 用户是不是点击了取消按钮
        //res.taoIndex  用户点击的数组元素的序号，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消？' + res.cancel + "目前微信并不支持分享",
        })
      }
    })

  },
  onMusicTap: function () {//播放音乐
    if (this.data.isplaying) {
      wx.pauseBackgroundAudio();
      this.setData(
        {
          isplaying: false
        }
      );
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: postId.postlist[this.data.id].music.url,
        title: postId.postlist[this.data.id].music.title,
        coverImgUrl: postId.postlist[this.data.id].music.coverImg
      });
      this.setData({
        isplaying: true
      })
    }
    this.onMusicMonitor();
  },
  onMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({ isplaying: true });
      app.globalData.g_isplaying = true;
      app.globalData.g_currentId = that.data.id;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({ isplaying: false });
      app.globalData.g_isplaying = false;
      app.globalData.g_currentId = null;
    });

  }


})