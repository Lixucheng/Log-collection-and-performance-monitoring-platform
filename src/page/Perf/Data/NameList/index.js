import template from './index.html';
import './index.scss';
// import Service from '@service';
import PerfLayout from 'src/components/PerfLayout';
import {
  getProjectDetail,

} from 'service/perf';
import UserService from 'service/user';

export default {
  template,
  components: {
    PerfLayout,
  },
  data() {
    return {
      loading: true,
      projectId: this.$route.params.id,
      project: ''
    }
  },
  methods: {
     getProject(p) {
      this.project = p;
      this.loading = false;
    },

  }
}
