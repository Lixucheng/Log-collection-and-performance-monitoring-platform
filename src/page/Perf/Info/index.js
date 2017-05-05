import template from './index.html';
import './index.scss';
// import Service from '@service';
import PerfLayout from 'src/components/PerfLayout';



export default {
  template,
  components: {
    PerfLayout,
  },
  data() {
    return {
      loading: false,
      projectId: this.$route.params.id,
    }
  },
  methods: {

  }
}
