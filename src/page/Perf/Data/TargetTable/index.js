import template from './index.html';
import './index.scss';
// import Service from '@service';
import PerfLayout from 'src/components/PerfLayout';
import MyOption from 'src/components/OPtion';
import {
  getAllNameList,
  getAllTargetTags,
  getFilterData,
} from 'service/perf-data';
import Echart from 'echarts';

export default {
  template,
  components: {
    PerfLayout,
    MyOption,
  },
  data() {
    const n = new Date();
    const end = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
    const start = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    return {
      loading: false,
      projectId: this.$route.params.id,
      selectTarget: this.$route.query.target,
      project: '',
      list: [],
      myChart: null,
      searchData: {
        name: '',
      },
      showTarget: {},
      targetData: null,
      seleteModel: '',
      timeZone: [start, end],
      timeOPtions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const n = new Date();
            const end = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
            const start = new Date(n.getFullYear(), n.getMonth(), n.getDate());
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const n = new Date();
            const end = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
            const start = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 6);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const n = new Date();
            const end = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
            const start = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 29);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  async created() {
    this.loading = true;
    const ret = await getAllNameList({
      id: this.projectId
    });
    this.list = ret.list;
    this.targetData = await getAllTargetTags({
      id: this.projectId
    })
    this.loading = false;
    console.log(this.targetData)

    if (this.$route.query.target) {
      this.addTargetItem(this.$route.query.target);
    }
    this.myChart = Echart.init(this.$refs.table);
    this.myChart.setOption({
      title: {
        show: false,
        text: '折线图堆叠'
      },
      tooltip: {
        trigger: 'axis',
        position: function (pt) {
          return [pt[0], '10%'];
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        data: []
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: {
            readOnly: false
          },
          magicType: {
            type: ['line', 'bar']
          },
          restore: {},
          saveAsImage: {}
        }
      },
      yAxis: {
        type: 'value'
      },
      dataZoom: [{
        type: 'inside',
        start: 0,
        end: 100
      }, {
        start: 0,
        end: 100,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }],
    });
  },
  computed: {
    showTargetList() {
      const obj = this.showTarget;
      return obj ? Object.keys(obj).map(e => ({
        value: e,
        filter: obj[e]
      })) : [];
    }
  },
  methods: {
    getProject(p) {
      this.loading = true;
      this.project = p;
      this.loading = false;
    },
    addTargetItem(target) {
      const targetItem = this.targetData[target];
      const obj = {};
      Object.keys(targetItem).forEach(e => {
        obj[e] = {
          open: false,
          value: targetItem[e] && targetItem[e][0]
        }
      });
      this.$set(this.showTarget, target, obj);
      return obj;
    },
    querySearch(queryString, cb) {
      const restaurants = this.list.map(e => ({
        value: e
      }));
      const results = queryString ? restaurants.filter(e => e.value.indexOf(queryString) > -1) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    addTargrt(e) {
      setTimeout(() => {
        this.searchData.name = '';
      }, 0)
      const has = this.showTarget[e.value];
      if (!has) {
        this.addTargetItem(e.value);
      }
      console.log('showTarget:', this.showTarget);
    },
    deleteTarget(e) {
      this.$delete(this.showTarget, e);
    },
    getTags(target) {
      const list = this.targetData ? Object.keys(this.showTarget[target]).filter(tag => !this.showTarget[target][tag].open) : [];
      return list;
    },
    setFilter(target, tag, value) {
      this.showTarget[target][tag].open = value;
      setTimeout(e => {
        this.seleteModel = '';
      }, 0)
    },
    formatData(data) {
      return {
        name: data.map(e => e.name),
        x: (data && data.length) ? Object.keys(data[0].data) : [],
        y: data.map(e => ({
          name: e.name,
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          data: Object.values(e.data) || []
        }))
      }
    },
    async getData() {
      console.log('this.showTarget ', this.showTarget)
      const data = await getFilterData(this.projectId, this.showTarget, this.timeZone);
      console.log('data:', data);
      const flash = this.formatData(data);
      console.log('flash', flash)
      this.myChart.setOption({
        legend: {
          data: flash.name
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: flash.x,
        },
        // series: data.map(e => ({
        //   name: 
        // })),
        series: flash.y
      });
    }

  }
}
