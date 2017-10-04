// pages/movie/more-movies/more-movies.js
var util=require("../../../util/util.js");
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle:"",
    movies:{},
    nowUrl:"",
    totalCount:null,
    isEmpty:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category=options.category;
    wx.setNavigationBarTitle({
      title:category,
    });
    var dataUrl="";
    switch(category){
      case "正在热映":
        dataUrl = app.globalData.doubanUrlBase + "/v2/movie/in_theaters";
      break;
      case "即将上映":
        dataUrl = app.globalData.doubanUrlBase + "/v2/movie/coming_soon";
      break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanUrlBase + "/v2/movie/top250";
      break;
    }
    this.data.nowUrl=dataUrl;
    util.http(dataUrl, this.processDoubanData);
    wx.showNavigationBarLoading();//显示loading指示
  },
  processDoubanData: function (data) {
    var movies = [];
    for (var idx in data.subjects) {
      var subject = data.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        coverImgUrl: subject.images.medium,
        average: subject.rating.average,
        id: subject.id,
        stars: util.getStars(subject.rating.stars)
      }
      movies.push(temp);
    }

    //如果需要新加载的数据  那么就需要和旧数据合并在一起
    var totalMovies={};
    if(!this.data.isEmpty){
      totalMovies=this.data.movies.concat(movies);//拼接数组
    }else{
      totalMovies=movies;
      this.data.isEmpty=false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount+=20;
    wx.hideNavigationBarLoading();//当数据加载完毕 绑定完毕 关闭loading标志
    wx.stopPullDownRefresh();//主动停止下拉刷新
  },
  // scrollToLower:function(){
  //   var newUrl = this.data.nowUrl + "?start=" + this.data.totalCount+"&count=20";
  //   util.http(newUrl, this.processDoubanData);
  //   wx.showNavigationBarLoading();//当上滑加载更多数据时   开启loading标志
  // },
  onReachBottom:function(event){
    var newUrl = this.data.nowUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(newUrl, this.processDoubanData);
    wx.showNavigationBarLoading();//当上滑加载更多数据时   开启loading标志
  },
  onPullDownRefresh:function(){
    var refreshUrl=this.data.nowUrl+"?start=0&count=20";
    this.data.allMovies = {};//先清空allMovies的数据 然后重新请求数据
    this.data.isEmpty = true;//将isEmpty设置为初始值  以免下拉得到的数据会拼接  出现重复
    util.http(refreshUrl, this.processDoubanData);//重新请求
    wx.showNavigationBarLoading();
  }
})