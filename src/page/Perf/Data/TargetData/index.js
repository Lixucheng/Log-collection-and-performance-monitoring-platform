import template from './index.html';
import './index.scss';
// import Service from '@service';
import PerfLayout from 'src/components/PerfLayout';
import {
  getTargetData,
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
      selectTarget: this.$route.query.target,
      data: {}
    }
  },
  async created() {
    this.loading = true;
    this.data = await getTargetData({
      id: this.projectId,
      target: this.selectTarget
    });
    this.loading = false;
  },
  computed: {
    list() {
      return Object.keys(this.data).map(e => ({
        name: e,
        value: this.data[e]
      }));
    }
  },
  methods: {

  }
}
