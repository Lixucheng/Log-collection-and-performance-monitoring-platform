import template from './index.html';
import './index.scss';
// import Service from '@service';
import Layout from 'src/components/Layout';


export default {
  template,
  components: {
    Layout,
  },
  data() {
    return {
      loading: false,
      // User: Service.user
    }
  },
  created() {
    // Service.on('User', (User) => {
    //     this.User = User;
    // });
  },
  methods: {

  }
}
