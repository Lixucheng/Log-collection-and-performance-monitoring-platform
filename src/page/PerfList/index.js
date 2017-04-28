import template from './index.html';
import './index.scss';
import {
  getProjectList
} from 'service/perf';
import Layout from 'src/components/Layout';


export default {
  template,
  components: {
    Layout,
  },
  data() {
    return {
      loading: false,
      list: [],
      searchData: {
        name: '',
        type: '',
      },
      types: [
        {
          name: '全部',
          value: null,
        }, 
        {
          name: 'nwjs',
          value: 'nwjs',
        }, 
        {
          name: 'electron',
          value: 'electron',
        }
      ]
    }
  },
  async created() {
    this.refresh();
  },
  methods: {
    async refresh(option) {
      this.loading = true;
      this.list = await getProjectList(option);
      this.loading = false;
    },
    search() {
      this.refresh(this.searchData)
    },
    clearSearch() {
      this.searchData.name = '';
      this.searchData.type = '';
      this.refresh();
    }
  }
}
