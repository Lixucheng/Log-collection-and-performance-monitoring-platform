import template from './index.html';
import './index.scss';
// import Service from '@service';
import PerfLayout from 'src/components/PerfLayout';
import {
  getTagValues,
} from 'service/perf-data';
import Echart from 'echarts';

export default {
  template,
  components: {
    PerfLayout,
  },
  data() {
    const n = new Date();
    const end = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1);
    const start = new Date(n.getFullYear(), n.getMonth(), n.getDate());
    return {
      loading: false,
      projectId: this.$route.params.id,
      active: 'quickTable?tag=' + this.$route.query.tag,
      tag: this.$route.query.tag,
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
      data: [],
      full: 0,
      myChart: null,
    }
  },
  async created() {
    // await this.refresh();
    window.v = this;
  },
  methods: {
    async refresh() {
      this.loading = true;
      const data = await getTagValues({
        id: this.projectId,
        tag: this.tag,
        timeZone: this.timeZone
      });
      const count = data.count.reverse();
      this.data = data;
      this.full = count && count[0] && count[0].value * 0.012;
      console.log(data);

      const flash = this.formatData(data);
      console.log('flash', flash)
      this.initChart();
      setTimeout(() => {
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
        this.loading = false;
      });
    },
    initChart() {
      setTimeout(() => {
        if (this.myChart || !this.$refs.table) return;
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
      })
    },
    getData() {
      this.refresh();
    },
    formatData(data) {
      const list = data.dataList;
      return {
        name: data.count.map(e => e._id.tagValue.toString()),
        x: (list && list.length) ? Object.keys(list[0]) : [],
        y: list.map((e, i) => ({
          name: data.count[i]._id.tagValue.toString(),
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          data: Object.values(e) || []
        }))
      }
    },
  }
}
