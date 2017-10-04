var util = require("../../util/util.js");
var app = getApp();
Page({
  data: {
    inTheater: {},
    comingSoon: {},
    top250Url: {},
    searchResult: {},
    container: true,
    searchContainer: false,
    totalCount: 0,
    searchUrl:""
  },
  onLoad: function (event) {
    var inTheaterUrl = app.globalData.doubanUrlBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanUrlBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanUrlBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheaterUrl, "inTheater", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250Url", "豆瓣Top250");

  },
  getMovieListData: function (url, setted, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: "GET",
      header: { "Content-type": "json" },
      success: function (res) {
        //  console.log(res);
        that.processDoubanData(res.data, setted, categoryTitle);
      },
      fail: function (res) {

      }
    })
  },
  processDoubanData: function (data, setted, categoryTitle) {
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
    var zop = {};
    zop[setted] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(zop);
    if (setted =="searchResult"){
      this.data.totalCount = movies.length;
    }
  },


   //数据刷新代码
  onScrollBottom: function (event) {
    var newUrl = this.data.searchUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(newUrl, this.newProcessDoubanData);
    wx.showNavigationBarLoading();//当上滑加载更多数据时   开启loading标志
  },

  newProcessDoubanData:function(data){
    console.log(data);
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
    var totalMovies = {};
    totalMovies.movies = this.data.searchResult.movies.concat(movies);//拼接数组
    
    this.setData({
      searchResult: totalMovies
    });
    this.data.totalCount +=movies.length;
    wx.hideNavigationBarLoading();//当数据加载完毕 绑定完毕 关闭loading标志*/
  },
  //数据刷新代码



  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movies/more-movies?category=' + category,
    })
  },

  //搜索功能  聚焦
  onBindFocus: function (event) {
    this.setData({
      container: false,
      searchContainer: true
    });
  },
  oncancel: function (event) {
    this.setData({
      container: true,
      searchContainer: false
    });
  },
  onBindChange: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanUrlBase + "/v2/movie/search?q=" + text;
    this.data.searchUrl=searchUrl;
    this.getMovieListData(searchUrl, "searchResult", "");
  }

})