<!--
  描述：拖放地图组件，默认尺寸是 500 * 300

  接收属性参数：
    lat: 纬度
    lng: 经度

  自定义事件：
    drag: 拖放完成事件

  示例：
    <mapDrag @drag="dragMap" lat="22.574405" lng="114.095388"></mapDrag>
-->
<template>
  <div class="m-map">
    <!--<div class="search" v-if="placeSearch">
      <input type="text" placeholder="请输入关键字" v-model="searchKey">
      <button type="button" @click="handleSearch">搜索</button>
      <div id="js-result" v-show="searchKey" class="result"></div>
    </div>-->
    <div class="input-card" style='width:18rem;'>
      <label style='color:grey'>公交线路查询</label>
      <div class="input-item">
        <div class="input-item-prepend"><span class="input-item-text" >线路名称</span></div>
        <el-input
          placeholder="请输入"
          v-model="BusLineName"
          clearable>
        </el-input>
      </div>
      <el-button type="primary" v-on:click="BusLineSearch">查询</el-button>
    </div>
    <div id="js-container" class="map">正在加载数据 ...</div>
  </div>




<!--  <div class="input-card" style='width:18rem;'>
    <label style='color:grey'>公交线路查询</label>
    <div class="input-item">
      <div class="input-item-prepend"><span class="input-item-text" >线路名称</span></div>
      <input id='BusLineName' type="text" value='919' >
    </div>
    <input id="search" type="button" class="btn" value="查询" />
  </div>-->
</template>

<script>
  import remoteLoad from '@/utils/remoteLoad.js'
  import { MapKey, MapCityName } from '@/config/config'
  export default {
    props: ['lat', 'lng'],
    data () {
      return {
        searchKey: '',
        placeSearch: null,
        dragStatus: false,
        AMapUI: null,
        AMap: null,
        BusLineName:null
      }
    },
    watch: {
      searchKey () {
        if (this.searchKey === '') {
          this.placeSearch.clear()
        }
      }
    },
    methods: {
      // 搜索
        /*BusLineName: function () {
        },*/
      BusLineSearch: function (event) {
        this.initMap(this.BusLineName)
      },
      // 实例化地图
      initMap (data) {

        // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
        let AMapUI = this.AMapUI = window.AMapUI
        let AMap = this.AMap = window.AMap

        //alert('空' + data)

        if(!data) {

          let map = new AMap.Map('js-container', {
            resizeEnable: true,
            //center: [centerl,centerr],
            center: [116.706887,39.522123],
            zoom: 12,
            cityName: '廊坊',
          });

          return


        }


        let map = new AMap.Map('js-container', {
          resizeEnable: true,
          //center: [centerl,centerr],
          center: [116.706887,39.522123],
          zoom: 12,
          //cityName: '廊坊',
        });



        let linesearch;

        AMap.plugin(["AMap.LineSearch"], function() {


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
          //搜索“536”相关公交线路
          linesearch.search(busLineName, function(status, result) {
            map.clearMap()
            if (status === 'complete' && result.info === 'OK') {
              lineSearch_Callback(result);
            } else {
              alert(JSON.stringify(result));
            }
          });

        })


        /*公交线路查询*/
        /*function lineSearch() {

        }*/


        /*公交路线查询服务返回数据解析概况*/
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
        //lineSearch();
        //document.getElementById('search').onclick = lineSearch;


        /*AMap.plugin('AMap.CitySearch', function () {
          let citySearch = new AMap.CitySearch()
          citySearch.getLocalCity(function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                let centerinfo = result.rectangle.split(';')[0];
                let centerl = Number(centerinfo.split(',')[0]);
                let centerr = Number(centerinfo.split(',')[1]);


              let map = new AMap.Map('js-container', {
                resizeEnable: true,
                //center: [centerl,centerr],
                center: [116.706887,39.522123],
                zoom: 16,
                cityName: '廊坊'
              });
              //实时路况图层
              let trafficLayer = new AMap.TileLayer.Traffic({
                zIndex: 10
              });
              map.add(trafficLayer);//添加图层到地图
              //debugger;
            }
          })
        })*/





        /*AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
          let mapConfig = {
            zoom: 16,
            cityName: MapCityName
          }
          if (this.lat && this.lng) {
            mapConfig.center = [this.lng, this.lat]
          }
          let map = new AMap.Map('js-container', mapConfig)
          //ip定位
          /!*AMap.plugin('AMap.CitySearch', function () {
            var citySearch = new AMap.CitySearch()
            citySearch.getLocalCity(function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                // 查询成功，result即为当前所在城市信息
                debugger
              }
            })
          })*!/
          // 加载地图搜索插件
          AMap.service('AMap.PlaceSearch', () => {
            this.placeSearch = new AMap.PlaceSearch({
              pageSize: 5,
              pageIndex: 1,
              citylimit: true,
              city: MapCityName,
              map: map,
              panel: 'js-result'
            })
          })
          // 启用工具条
          AMap.plugin(['AMap.ToolBar','AMap.CitySearch'], function () {
            map.addControl(new AMap.ToolBar({
              position: 'RB'
            }))

          })
          // 创建地图拖拽
          let positionPicker = new PositionPicker({
            mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
            map: map // 依赖地图对象
          })
          // 拖拽完成发送自定义 drag 事件
          positionPicker.on('success', positionResult => {
            // 过滤掉初始化地图后的第一次默认拖放
            if (!this.dragStatus) {
              this.dragStatus = true
            } else {
              this.$emit('drag', positionResult)
            }
          })
          // 启动拖放
          positionPicker.start()
        })*/
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


      /*if (window.AMap) {
        this.initMap()
        // 未载入高德地图API，则先载入API再初始化
      } else {
        await remoteLoad(`http://webapi.amap.com/maps?v=1.4.10&key=${MapKey}`)
        await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
        this.initMap()
      }*/

    }
  }
</script>

<style lang="css">
  .m-map{ min-width: 100%; min-height: 100%; width: 100%; height: 100%; position: relative; margin: 0px }
  .m-map .map{min-width: 100%; min-height: 100%; width: 100%; height: 100%; }
  .m-map .search{ position: absolute; top: 10px; left: 10px; width: 285px; z-index: 1; }
  .m-map .search input{ width: 180px; border: 1px solid #ccc; line-height: 20px; padding: 5px; outline: none; }
  .m-map .search button{ line-height: 26px; background: #fff; border: 1px solid #ccc; width: 50px; text-align: center; }
  .m-map .result{ max-height: 100%; overflow: auto; margin-top: 10px; }
</style>
