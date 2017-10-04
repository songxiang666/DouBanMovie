function  getStars(starts){
  var num = starts.toString().substring(0,1);
    var arr=[];
    for(var i=1;i<=5;i++){
      if(i<=num){
          arr.push(1);
      }else{
        arr.push(0);
      }
    }
    return arr;
}
function http(url,callBack) {
  wx.request({
    url: url,
    method: "GET",
    header: { "Content-type": "json" },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error);
    }
  })
}
module.exports = {
  getStars:getStars,
  http:http
}