<template>
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="2" class="line">按路线查询公交</el-col>
          <el-col :span="2">
            <el-input v-model="busLineName" placeholder="请输入内容" @keyup.enter.native="busLineSearch"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="busLineSearch">主要按钮</el-button>
            <img src="../../assets/logo.png"  alt="上海鲜花港 - 郁金香" />
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <div id="js-container" class="map">正在加载数据 ...</div>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
</template>

<script>
  import remoteLoad from '@/utils/remoteLoad.js'
  import { MapKey, MapCityName } from '@/config/config'

  export default {
    data () {
      return {
        AMapUI: null,
        AMap: null,
      }
    },
    methods: {
      // 搜索
      busLineSearch: function (event) {
        this.initMap(this.busLineName)
      },


      // 实例化地图
      initMap (data) {
        // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
        let AMapUI = this.AMapUI = window.AMapUI
        let AMap = this.AMap = window.AMap
        //let PathSimplifier = this.PathSimplifier = window.PathSimplifier


        let map = new AMap.Map('js-container', {
            resizeEnable: true,
            //center: [centerl,centerr],
            center: [116.706887,39.522123],
            zoom: 12,
            cityName: '廊坊',
          });

        data = 1;//测试

        if(!data) { return false }

        let linesearch;





        AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {

          if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
            return;
          }

          //线条颜色
          let colors = [
            "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
            "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
            "#651067", "#329262", "#5574a6", "#3b3eac"
          ];

          let pathSimplifierIns = new PathSimplifier({
            zIndex: 100,
            //autoSetFitView:false,
            map: map, //所属的地图实例

            getPath: function(pathData, pathIndex) {

              return pathData.path;
            },
            getHoverTitle: function(pathData, pathIndex, pointIndex) {
              //返回鼠标悬停时显示的信息
              if (pointIndex >= 0) {
                //鼠标悬停在某个轨迹节点上
                return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
              }
              //鼠标悬停在节点之间的连线上
              return pathData.name + '，点数量' + pathData.path.length;
            },
            //样式
            renderOptions: {
              //轨迹线的样式
              pathLineStyle: {
                dirArrowStyle: true
              },
              getPathStyle: function(pathItem, zoom) {

                var color = colors[pathItem.pathIndex % colors.length],
                  lineWidth = Math.round(4 * Math.pow(1.1, zoom - 3));

                return {
                  pathLineStyle: {
                    strokeStyle: color,
                    lineWidth: lineWidth
                  },
                  pathLineSelectedStyle: {
                    lineWidth: lineWidth + 2
                  },
                  pathNavigatorStyle: {
                    fillStyle: color
                  }
                };
              }
            }
          });

          window.pathSimplifierIns = pathSimplifierIns;

          $('<div id="loadingTip">加载数据，请稍候...</div>').appendTo(document.body);

          /*setTimeout(function(){

          },5000);*/



          $.getJSON('https://a.amap.com/amap-ui/static/data/big-routes.json', function(d) {

            $('#loadingTip').remove();

            //let thisdata = [];

            AMap.plugin(["AMap.LineSearch"],  LineSearch => {
              //alert('路'+data)
              //let busLineName = data.toString();
              let busLineName = '17';
              if(!busLineName) return;
              //实例化公交线路查询类，只取回一条路线
              if(!linesearch){
                linesearch = new AMap.LineSearch({
                  pageIndex: 1,
                  city: '廊坊',
                  pageSize: 1,
                  extensions: 'all'
                });
              }
              //搜索相关公交线路
              linesearch.search(busLineName, function(status, result) {
                map.clearMap()
                if (status === 'complete' && result.info === 'OK') {
                  //thisdata = result.lineInfo
                  //console.log(thisdata);
                  //lineSearch_Callback(result);
                  //debugger//自己自己我
                  console.log(thisdata)
                  //return result.lineInfo;

                } else {
                  alert(JSON.stringify(result));
                }
              });

            })
            console.log(thisdata())

            var flyRoutes = [];

            for (var i = 0, len = d.length; i < len; i++) {

              if (d[i].name.indexOf('乌鲁木齐') >= 0) {

                d.splice(i, 0, {
                  name: '飞行 - ' + d[i].name,
                  path: PathSimplifier.getGeodesicPath(
                    d[i].path[0], d[i].path[d[i].path.length - 1], 100)
                });

                i++;
                len++;
              }
            }

            d.push.apply(d, flyRoutes);



            pathSimplifierIns.setData(d);

            //initRoutesContainer(d);

            function onload() {
              pathSimplifierIns.renderLater();
            }

            function onerror(e) {
              alert('图片加载失败！');
            }

            //创建一个巡航器
            var navg0 = pathSimplifierIns.createPathNavigator(0, {
              loop: true, //循环播放
              speed: 500000
            });

            navg0.start();


            var navg1 = pathSimplifierIns.createPathNavigator(3, {
              loop: true,
              speed: 1000000,
              pathNavigatorStyle: {
                width: 24,
                height: 24,
                //使用图片
                content: PathSimplifier.Render.Canvas.getImageContent('static/img/car.png', onload, onerror),
                strokeStyle: null,
                fillStyle: null,
                //经过路径的样式
                pathLinePassedStyle: {
                  lineWidth: 6,
                  strokeStyle: 'black',
                  dirArrowStyle: {
                    stepSpace: 15,
                    strokeStyle: 'red'
                  }
                }
              }
            });

            navg1.start();

            var navg2 = pathSimplifierIns.createPathNavigator(7, {
              loop: true,
              speed: 500000,
              pathNavigatorStyle: {
                width: 16,
                height: 32,
                content: PathSimplifier.Render.Canvas.getImageContent('static/img/car.png', onload, onerror),
                strokeStyle: null,
                fillStyle: null
              }
            });

            navg2.start();

            var navg3 = pathSimplifierIns.createPathNavigator(5, {
              loop: true,
              speed: 500000,
              pathNavigatorStyle: {
                autoRotate: false, //禁止调整方向
                pathLinePassedStyle: null,
                width: 24,
                height: 24,
                content: PathSimplifier.Render.Canvas.getImageContent('static/img/car.png', onload, onerror),
                strokeStyle: null,
                fillStyle: null
              }
            });

            navg3.start();
          });
        });



        function pushData(PathSimplifier,d) {






        }



        /*AMap.plugin(["AMap.LineSearch"], function() {
          //alert('路'+data)
          let busLineName = data.toString();
          //let busLineName = '17';
          if(!busLineName) return;
          //实例化公交线路查询类，只取回一条路线
          if(!linesearch){
            linesearch = new AMap.LineSearch({
              pageIndex: 1,
              city: '廊坊',
              pageSize: 1,
              extensions: 'all'
            });
          }
          //搜索相关公交线路
          linesearch.search(busLineName, function(status, result) {
            map.clearMap()
            if (status === 'complete' && result.info === 'OK') {
              //console.log(result);
              //lineSearch_Callback(result);




            } else {
              alert(JSON.stringify(result));
            }
          });

        })*/

        公交路线查询服务返回数据解析概况
        function lineSearch_Callback(data) {
          let lineArr = data.lineInfo;
          let lineNum = data.lineInfo.length;
          if (lineNum == 0) {
          } else {
            for (var i = 0; i < lineNum; i++) {
              let pathArr = lineArr[i].path;
              let stops = lineArr[i].via_stops;
              let startPot = stops[0].location;
              let endPot = stops[stops.length - 1].location;
              if (i == 0) //作为示例，只绘制一条线路
                drawbusLine(startPot, endPot, pathArr);
            }
          }
        }
        /*绘制路线*/
        function drawbusLine(startPot, endPot, BusArr) {
          //绘制起点，终点
          new AMap.Marker({
            map: map,
            position: startPot, //基点位置
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
            zIndex: 10
          });
          new AMap.Marker({
            map: map,
            position: endPot, //基点位置
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
            zIndex: 10
          });
          //绘制乘车的路线
          busPolyline = new AMap.Polyline({
            map: map,
            path: BusArr,

            strokeColor: "#09f",//线颜色
            strokeOpacity: 0.8,//线透明度
            isOutline:true,
            outlineColor:'white',
            strokeWeight: 6//线宽
          });
          map.setFitView();
        }



      }
    },
    async created () {
      // 已载入高德地图API，则直接初始化地图
      if (window.AMap && window.AMapUI) {
        this.initMap()
        // 未载入高德地图API，则先载入API再初始化
      } else {
        await remoteLoad(`http://webapi.amap.com/maps?v=1.4.10&key=${MapKey}`)
        await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
        this.initMap()
      }
    }
  }
</script>

<style lang="css">
  #js-container {
    height: 100%;
  }
  .line {
    font-weight: bold;
  }
  .clearBoth {
    clear: both;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height: 600px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .searchBanner {
    color: #000;
    font-weight: bold;
  }
  .grid-content span {
    float: left;
    margin: auto 5px;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
</style>
