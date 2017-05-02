import template from './index.html';
import './index.scss';
// import Service from '@service';
import PerfLayout from 'src/components/PerfLayout';
import MyOption from 'src/components/OPtion';
import {
  getAllNameList,
  getAllTargetTags,
} from 'service/perf-data';
import Echart from 'echarts';

export default {
  template,
  components: {
    PerfLayout,
    MyOption,
  },
  data() {
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
      showTarget: [],
      targetData: null,
      seleteModel: ''
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

    this.showTarget.push(this.getTargetItem(this.$route.query.target));
    this.myChart = Echart.init(this.$refs.table);
    this.myChart.setOption({
      title: {
        show: false,
        text: '折线图堆叠'
      },
      tooltip: {
        trigger: 'axis'
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
      }
    });
  },
  computed: {
    tags() {
      return target => {
        return this.targetData ? Object.keys(this.targetData[target]) : [];
      }
    },
    filters() {
      const ret = {};
      this.showTarget.forEach((e, i) => {
        ret[i] = function (value) {
          console.log(e.value, value);
        }
      });
      console.log(ret)
      return ret;
    },
  },
  methods: {
    getProject(p) {
      this.loading = true;
      this.project = p;
      this.loading = false;
    },
    getTargetItem(target) {
      const targetItem = this.targetData[target];
      const obj = {};
      Object.keys(targetItem).forEach(e => {
        obj[e] = {
          open: false,
          value: null
        }
      });
      return {
        value: target,
        filter: obj
      }
    },
    querySearch(queryString, cb) {
      const restaurants = this.list.map(e => ({
        value: e
      }));
      const results = queryString ? restaurants.filter(e => e.value.indexOf(queryString) > -1) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelect(e) {
      setTimeout(() => {
        this.searchData.name = '';
      }, 0)
      const has = this.showTarget.some(t => t.value === e.value);
      if (!has) {
        this.showTarget.push(e);
      }
    },
    deleteTag(e) {
      this.showTarget = this.showTarget.filter(t => t.value !== e);
    },
    getTags(target) {
      return this.targetData ? Object.keys(this.targetData[target]) : [];
    },
    test1(...e) {
      console.log(e);
    },
    test() {
      this.myChart.setOption({
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },

        series: [{
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        }]
      });
    }

  }
}
