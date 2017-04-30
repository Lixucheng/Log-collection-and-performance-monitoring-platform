import template from './index.html';
import './index.scss';
import UserService from 'service/user';

export default {
  template,
  props: ['title', 'index', 'loading', 'footer'],
  data() {
    return {
      // User: Service.user
    }
  },
  computed: {
    User() {
      return UserService.User;
    }
  },
  created() {

  },
  methods: {
    logout() {
      UserService.logout(this.User.name);
      location.href = '/login';
    }
  }
}
