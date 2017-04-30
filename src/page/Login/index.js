import template from './index.html';
import './index.scss';
import UserService from 'service/user';
import {
  Notification
} from 'element-ui';


export default {
  template,
  data() {
    return {
      loading: false,
      User: {
        name: '',
        passWord: '',
      },
      rules: {
        name: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        passWord: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async login() {
      this.$refs['loginForm'].validate(async(valid) => {
        if (valid) {
          const s = await UserService.login(this.User);
          if (s === 1) {
            // Notification.success({
            //   title: 'ok',
            // })
            location.href = '/log/1'
          } else if (s === -2) {
            Notification.error({
              title: '密码错误',
            })
          } else if (s === -1) {
            Notification.error({
              title: '用户不存在',
            })
          } else if (s === -2) {
            Notification.error({
              title: '密码错误',
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
