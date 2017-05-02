import template from './index.html';
import './index.scss';
import Layout from 'src/components/Layout';
import {
  getProjectDetail,
} from 'service/perf';
export default {
  template,
  props: ['title', 'loading', 'projectId', 'active'],
  components: {
    Layout,
  },
  data() {
    return {
      project: ''
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    async refresh() {
      this.project = await getProjectDetail(this.projectId);
      this.$emit('getProject', this.project)
    },
  }
}
