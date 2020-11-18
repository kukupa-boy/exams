<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">
      {{ $t('roles.addRole') }}
    </el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" :label="$t('roles.id')" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('roles.rolename')" width="220">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" :label="$t('roles.descrip')">
        <template slot-scope="scope">
          {{ scope.row.descrip }}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('roles.actions')">
        <template slot-scope="scope">
          <el-button size="mini" style="width: 96px;" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">
            {{ $t('roles.edit') }}
          </el-button>
          <el-button size="mini" style="width: 96px;" type="danger" icon="el-icon-close" @click="handleDelete(scope.row)">
            {{ $t('roles.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?$t('roles.editDialogTitle'):$t('roles.addDialogTitle')">
      <el-form :model="role" :rules="rules" label-position="left" label-width="120px" style="width: 400px; margin-left:100px;">
        <el-form-item :label="$t('roles.rolename')" prop="name">
          <el-input v-model="role.name" :placeholder="$t('roles.editRolename')" maxlength="60" />
        </el-form-item>
        <el-form-item :label="$t('roles.descrip')">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            :placeholder="$t('roles.editDescrip')"
            maxlength="200"
          />
        </el-form-item>
        <el-form-item :label="$t('roles.menus')">
          <el-tree ref="tree" :check-strictly="checkStrictly" :data="routesData" :props="defaultProps" show-checkbox node-key="path" class="permission-tree" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          {{ $t('roles.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirmRole">
          {{ $t('roles.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { findRoles, addRole, deleteRole, updateRole, getRoleList } from '@/api/adminRoles'
import i18n from '@/lang'
import { getcustomRouters } from '@/router/modules/customnavs'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  name: 'RolePermission',
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: getcustomRouters(),
      rolesList: null,
      serviceRoutes: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      listQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    routesData() {
      var routes = this.i18n(this.routes)
      var newRoutes = []
      for (var i = 0; i < routes.length; i++) {
        if (routes[i].hidden) {
          continue
        }
        // if (routes[i].type === 'admin') {
        //   console.log(routes[i].type)
        //   routes[i].disabled = true
        // }
        var route = Object.assign({}, routes[i])
        if (route.children && route.children.length > 0) {
          var childrens = []
          for (var item of route.children) {
            if (item.hidden) {
              continue
            }
            // if (item.type === 'admin' || route.type === 'admin') {
            //   item.disabled = true
            // }
            childrens.push(item)
          }
          route.children = childrens
        }
        newRoutes.push(route)
      }
      return newRoutes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.serviceRoutes = this.i18n(this.routes)
    // console.log(this.routesData)
    this.serviceRoutes = this.routesData
    // this.getRoutes()
    this.findRoles()
  },
  methods: {
    temp11() {
      findRoles()
    },
    // async getRoutes() {
    //   const res = await getRoutes()
    //   this.serviceRoutes = res.data
    //   const routes = this.generateRoutes(res.data)
    //   this.routes = this.i18n(routes)
    // },
    async findRoles() {
      // const res = await findRoles()
      const res = await getRoleList(this.listQuery)
      this.rolesList = res.data.items
    },
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.meta.title}`)
        if (route.children) {
          route.children = this.i18n(route.children)
        }
        return route
      })
      return app
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []
      for (var route of routes) {
        // skip some route
        if (route.hidden) { continue }

        // 只要一个子节点不是隐藏的时候，默认显示那个节点 但是木的显示父节点。子节点全隐藏了，就显示父
        // const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        // if (route.children && onlyOneShowingChild && !route.alwaysShow) {
        //   route = onlyOneShowingChild
        // }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      // this.role = deepClone(scope.row)
      this.role.id = row.id
      this.role.name = row.roleName
      this.role.description = row.descrip
      this.role.roleMenus = row.roleMenus
      this.role.routes = []
      var tempRoleMenus = row.roleMenus
      var tempCheckedKeys = []
      for (var i = 0; i < tempRoleMenus.length; i++) {
        tempRoleMenus[i]
        tempCheckedKeys.push(tempRoleMenus[i].path)
      }
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', tempCheckedKeys)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.id)
          // this.rolesList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '成功!'
          })
          this.findRoles()
        })
        .catch(err => {
          console.error(err)
          this.findRoles()
        })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []
      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path) // 会组合父级的path
        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      var roleData = {
        id: this.role.id,
        roleName: this.role.name, // 角色名称
        descrip: this.role.description, // descrip
        roleMenus: []
      }
      // var roleData = Object.assign({}, this.role)
      for (var i = 0; i < this.role.routes.length; i++) {
        roleData.roleMenus.push({
          id: this.role.routes[i].id,
          menuId: this.role.routes[i].menuId, // 菜单ID，在vue配置的id
          roleId: 0, // 角色id
          path: this.role.routes[i].path, // 路径
          name: this.role.routes[i].name, // 路由名称
          parentMenuId: 0 // 父菜单ID
        })
        if (this.role.routes[i].children && this.role.routes[i].children.length > 0) {
          var tempChildren = this.role.routes[i].children
          for (var j = 0; j < tempChildren.length; j++) {
            roleData.roleMenus.push({
              id: tempChildren[j].id,
              menuId: tempChildren[j].menuId, // 菜单ID，在vue配置的id
              roleId: 0, // 角色id
              path: tempChildren[j].path, // 路径
              name: tempChildren[j].name, // 路由名称
              parentMenuId: this.role.routes[i].menuId // 父菜单ID
            })
          }
        }
      }
      if (isEdit) {
        // 对比改动
        var oldMenus = this.role.roleMenus
        var newRoutes = roleData.roleMenus
        var updateRolesData = []
        // 删除的菜单
        for (const oldm of oldMenus) {
          let flag = false
          for (const newr of newRoutes) {
            if (oldm.menuId === newr.menuId) {
              flag = true
              break
            }
          }
          if (!flag) {
            updateRolesData.push(oldm)
          }
        }
        // 添加的菜单
        for (const newr of newRoutes) {
          let flag = false
          for (const oldm of oldMenus) {
            if (newr.menuId === oldm.menuId) {
              flag = true
              break
            }
          }
          if (!flag) {
            updateRolesData.push(newr)
          }
        }
        roleData.roleMenus = updateRolesData
        await updateRole(roleData)
        this.findRoles()
        // await updateRole(this.role.key, this.role)
        // for (let index = 0; index < this.rolesList.length; index++) {
        //   if (this.rolesList[index].key === this.role.key) {
        //     this.rolesList.splice(index, 1, Object.assign({}, this.role))
        //     break
        //   }
        // }
      } else {
        // const { data } = await addRole(roleData)
        // this.role.key = data.key
        // this.rolesList.push(this.role)
        await addRole(roleData)
        this.findRoles()
      }
      // const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        message: '操作成功',
        // message: `
        //     <div>Role Key: ${key}</div>
        //     <div>Role Nmae: ${name}</div>
        //     <div>Description: ${description}</div>
        //   `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)
      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
