import template from './index.html';
import './index.scss';
import {
  getProjectList,
  addProject
} from 'service/perf';
import Layout from 'src/components/Layout';


export default {
  template,
  components: {
    Layout,
  },
  data() {
    return {
      loading: false,
      addDialogShow: false,
      list: [],
      searchData: {
        name: '',
        type: '',
      },
      types: [{
        name: '全部',
        value: null,
      },
      {
        name: 'nwjs',
        value: 'nwjs',
      },
      {
        name: 'electron',
        value: 'electron',
      },
      {
        name: '其他',
        value: 'other',
      }
      ],
      projectData: {
        type: '',
        name: '',
      },
      rojectRules: {
        name: [{
          required: true,
          message: '请输入项目名称',
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
        }
        ],
        type: [{
          required: true,
          message: '请选择项目类别',
        }]
      },
    }
  },
  async created() {
    this.refresh();
  },
  methods: {
    async refresh(option) {
      this.loading = true;
      this.list = await getProjectList(option);
      this.loading = false;
    },
    search() {
      this.refresh(this.searchData)
    },
    clearSearch() {
      this.searchData.name = '';
      this.searchData.type = '';
      this.refresh();
    },
    showAddDialog() {
      this.addDialogShow = true;
      this.projectData.name = '';
      this.projectData.type = '';
      this.$refs && this.$refs.projectForm && this.$refs.projectForm.resetFields();
    },
    async postNewProject() {
      this.loading = true;
      const ret = await addProject(this.projectData);
      this.loading = false;
      return ret;
    },
    async addProject() {
      this.$refs.projectForm.validate(async (valid) => {
        if (valid) {
          this.addDialogShow = false;
          const ret = await this.postNewProject();
          console.log(ret)
          if (ret === -1) {
            this.$message.error('新建失败，标题重复');
            this.addDialogShow = true;
          } else {
            location.reload();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
