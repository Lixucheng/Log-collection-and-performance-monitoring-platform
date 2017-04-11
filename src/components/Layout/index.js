import template from './index.html';
import './index.scss';
// import Service from '@service';

export default {
  template,
  props: ['title', 'loading'],
  data() {
    return {
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
