import template from './index.html';
import './index.scss';
// import Service from '@service';
import PerfLayout from 'src/components/PerfLayout';
import {
  getProjectDetail,
  addProject,
  addUser,
  removeUser,
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
      project: null,
      addDialogShow: false,
      newUser: {
        name: '',
        id: '',
      },
    }
  },
  methods: {
    getProject(p) {
      this.project = p;
      this.loading = false;
    },
    showAddDialog() {
      this.newUser.name = '';
      this.newUser.id = '';
      this.addDialogShow = true;
      this.$refs && this.$refs.userForm && this.$refs.userForm.resetFields();
    },
    async querySearchAsync(queryString, cb) {
      const list = await UserService.queryUser(queryString);
      cb(list.map(e => ({
        value: e.name,
        id: e._id
      })));
    },
    validatePass(rule, value, callback) {
      this.querySearchAsync(value, (list) => {
        if (list.length === 0) {
          callback(new Error('人员不存在'));
        } else {
          callback();
        }
      })
    },
    async addUser() {
      console.log(this.newUser);
      this.$refs.userForm.validate(async(valid) => {
        if (valid) {
          const ret = await addUser({
              id: this.projectId,
              userId: this.newUser.id
            }
          );
          this.project = ret;
          this.addDialogShow = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleSelect(item) {
      this.newUser.id = item.id;
    },
    async removeUser(row) {
      this.project = await removeUser({
        userId: row._id,
        id: this.projectId
      })
    }
  }
}
