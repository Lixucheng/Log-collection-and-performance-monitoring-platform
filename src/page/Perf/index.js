import template from './index.html';
import './index.scss';
// import Service from '@service';
import PerfLayout from 'src/components/PerfLayout';
import {
  getIndexData,
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
      data: null,
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
    const data = await getIndexData(this.projectId, this.timeZone);
    this.data = data;
    console.log(data);
    this.initTable(data);
  },
  methods: {
    async getData() {
      const data = await getIndexData(this.projectId, this.timeZone);
      this.data = data;
      console.log(data);
      this.initTable(data);
    },
    format(data) {
      var list = ['操作系统', '界面', '软件版本'];
      return data.table.map(d => ({
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [{
          name: list.shift(),
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '10',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: d.count.map(i => ({
            name: i._id.tagValue,
            value: i.value
          }))
        }]
      }));
    },
    initTable(data) {
      const osTable = Echart.init(this.$refs.osTable);
      const pageTable = Echart.init(this.$refs.pageTable);
      const deviceTable = Echart.init(this.$refs.deviceTable);

      const formatData = this.format(data);

      osTable.setOption(formatData[0]);
      pageTable.setOption(formatData[1]);
      deviceTable.setOption(formatData[2]);
    }
  }
}
