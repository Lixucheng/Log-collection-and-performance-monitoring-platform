import template from './index.html';
import './index.scss';
// import Service from '@service';
import PerfLayout from 'src/components/PerfLayout';
import {
  getAllNameList,
} from 'service/perf-data';

export default {
  template,
  components: {
    PerfLayout,
  },
  data() {
    return {
      loading: false,
      projectId: this.$route.params.id,
      project: '',
      searchData: {
        name: '',
      },
      list: [],
      pagination: {
        totalPage: 0,
        currentPage: 1,
        perPage: 10,
      }
    }
  },
  async created() {
    this.loading = true;
    const ret = await getAllNameList({
      id: this.projectId
    });
    this.list = ret.list;
    this.pagination.totalPage = Math.ceil(this.list.length / this.pagination.perPage);
    this.loading = false;
    window.p = this.pagination;
  },
  computed: {
    showList() {
      const list = this.list.filter(e => e.indexOf(this.searchData.name) > -1);
      return list.splice(this.pagination.perPage * (this.pagination.currentPage - 1), this.pagination.perPage);
    }
  },
  watch: {
    'searchData.name': function() {
      const list = this.list.filter(e => e.indexOf(this.searchData.name) > -1);
      this.pagination.totalPage = Math.ceil(list.length / this.pagination.perPage);
      this.pagination.currentPage = 1;
    }
  },
  methods: {
    getProject(p) {
      this.loading = true;
      this.project = p;
      this.loading = false;
    },
    pageChange(index) {
      this.pagination.currentPage = index;
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
