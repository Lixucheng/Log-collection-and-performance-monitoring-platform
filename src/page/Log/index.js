import template from './index.html';
import Layout from 'src/components/Layout';
import './index.scss';
import config from 'config';
import {
  getLogList,
  sendLogRequest
} from 'service/log';
export default {
  template,
  components: {
    Layout,

  },
  data() {
    return {
      loading: true,
      tableLoading: false,
      list: null,
      user: null,
      totalPage: 0,
      currentPage: +this.$route.params.page || 1,
      sendData: {
        deviceId: null,
        time: [],
      },
      searchData: {
        deviceId: null,
        time: [],
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
      timmer: null,
    }
  },
  async created() {
    await this.getData();
    this.loading = false;
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
    async getData(time) {
      if (this.searchData.deviceId) {
        this.tableLoading = true;
        const ret = await getLogList(this.searchData.deviceId, this.currentPage, time);
        this.list = ret.list;
        this.totalPage = ret.total;
        console.log(ret)
        this.tableLoading = false;
        this.$router.replace({
          name: 'log',
          params: {
            page: this.currentPage
          }
        });
      }
    },
    clear() {
      this.totalPage = 0;
      this.currentPage = +this.$route.params.page || 1;
    },
    async send() {
      if (!this.sendData.deviceId) {
          return;
      }
      if (this.sendData.time.length > 0 && this.sendData.time[0] && this.sendData.time[1]) {
        await sendLogRequest(this.sendData.deviceId, this.sendData.time.map(t => t.getTime()));
      } else {
        await sendLogRequest(this.sendData.deviceId);
      }
    },
    async search() {
      console.log(this.searchData);
      this.currentPage = 1;
      if (this.searchData.time.length > 0 && this.searchData.time[0] && this.searchData.time[1]) {
        await this.getData(this.searchData.time.map(t => t.getTime()));
      } else {
        await this.getData();
      }
    },
    async pageChange(index) {
      this.currentPage = index;
      await this.getData();
      this.pageScroll();
    },
    pageScroll() {
      window.scrollBy(0, -30);
      let scrolldelay = setTimeout(() => this.pageScroll(), 10);
      if (document.documentElement.scrollTop + document.body.scrollTop == 0) {
        clearTimeout(scrolldelay);
      }
    }
  }
}
