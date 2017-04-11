import template from './index.html';
import Layout from 'src/components/Layout';
import './index.scss';
import config from 'config';
import getLogList from 'service/log';
export default {
  template,
  components: {
    Layout,

  },
  data() {
    return {
      loading: true,
      list: null,
      user: null,
      deviceId: null,
      sendData: {
        deviceId: null,
        time: null,
      },
      searchData: {
        deviceId: null,
        time: null,
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  async created() {
    this.list = await getLogList('electron');
    this.loading = false;
    console.log(this.list)
  },
  computed: {
    logList() {
      if (this.list && this.list.length) {
        const ret = [];
        this.list.forEach(e => {
          const list = e.split('-');
          ret.push({
            deviceId: list[1],
            time: list[2],
            name: e,
          })
        });
        return ret;
      }
      return [];
    }
  },
  methods: {
    send() {
      console.log(this.sendData);
    },
    search() {
      console.log(this.searchData);
    }
  }
}
