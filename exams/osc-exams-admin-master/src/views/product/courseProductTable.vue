<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQueryFilter.name" :placeholder="$t('courseProduct.searchByName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQueryFilter.productcategoryid" clearable filterable class="filter-item" :placeholder="$t('courseProduct.searchByProductcategoryid')">
        <el-option v-for="item in productcategoryList" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQueryFilter.langtype" clearable filterable class="filter-item" :placeholder="$t('courseProduct.searchByLangtype')">
        <el-option v-for="item in langtypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('courseProduct.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">{{ $t('courseProduct.add') }}</el-button>
    </div>
    <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <div class="pagination-container" />
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <!-- <el-table-column :label="$t('courseProduct.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left">
            <el-form-item :label="$t('wechatGroup.name')">
              <span>{{ scope.row.wechatgroup ? scope.row.wechatgroup.name : '' }}</span>
            </el-form-item>
            <el-form-item :label="$t('wechatGroup.subtitle')">
              <span>{{ scope.row.wechatgroup ? scope.row.wechatgroup.subtitle : '' }}</span>
            </el-form-item>
            <el-form-item :label="$t('wechatGroup.qrcodeurl')">
              <img :src="(scope.row.wechatgroup ? scope.row.wechatgroup.httpqrcodeurl : '') | imgFilter" width="250" height="250">
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.id')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.name')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.userId')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.userName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userNickName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.coverUrl')" width="150" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.httpCoverUrl | imgFilter" width="100" height="60">
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.productcategoryid')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productcategoryname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.summary')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.summary }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.producttype')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.producttype | producttypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.langtype')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.langtype | langtypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.totalPlay')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalPlay }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.price')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.promoteMoney')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.promoteMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.subPromoteMoney')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.subPromoteMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.sales')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sales === null ? 0 : scope.row.sales }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('courseProduct.totalPlayNum')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalPlay }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('courseProduct.createdOn')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('courseProduct.actions')" align="center" class-name="small-padding fixed-width" width="450px">
        <template slot-scope="scope">
          <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-goods" @click="handleGoToChapterTable(scope.row)">{{ $t('courseProduct.chapterTable') }}
          </el-button>
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEdit(scope.row)">{{ $t('courseProduct.edit') }}
          </el-button>
          <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-tickets" @click="handleEditRecommended(scope.row)">{{ $t('courseProduct.editRecommended') }}
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">{{ $t('courseProduct.delete') }}
          </el-button>
          <div class="buttonTop">
            <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-news" @click="handleEditUserId(scope.row)">{{ $t('courseProduct.editProductUserId') }}
            </el-button>
            <el-button size="mini" style="width: 86px;" type="primary" icon="el-icon-message" @click="handleEditWechatGroup(scope.row)">{{ $t('courseProduct.editWechatGroup') }}
            </el-button>
            <el-button size="mini" :disabled="moveButtonTypeTop(scope.$index)" icon="el-icon-caret-top" @click="moveButtonToTop(scope.$index,scope.row)">上移
            </el-button>
            <el-button size="mini" :disabled="moveButtonTypeBottom(scope.$index)" icon="el-icon-caret-bottom" @click="moveButtonToBottom(scope.$index,scope.row)">下移
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="80px" width="1000px">
      <el-form ref="dataForm" :rules="rules" :model="tempProduct" label-position="left" label-width="120px" style="width: 80%; margin-left:100px;">
        <el-form-item v-if="dialogStatus=='update'" :label="$t('courseProduct.id')">
          <span>{{ tempProduct.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.producttype')">
          <span>{{ tempProduct.producttype | producttypeFilter }}</span>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.productcategoryid')" prop="productcategoryid">
          <el-select v-model="tempProduct.productcategoryid" clearable filterable class="filter-item" :placeholder="$t('courseProduct.editProductcategoryid')">
            <el-option v-for="item in productcategoryList" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.langtype')" prop="langtype">
          <el-select v-model="tempProduct.langtype" clearable filterable class="filter-item" :placeholder="$t('courseProduct.editLangtype')">
            <el-option v-for="item in langtypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.coverUrl')" prop="coverUrl">
          <el-upload
            v-model="tempProduct.coverUrl"
            :action="uploadUrl()"
            :show-file-list="false"
            :on-success="handleSuccessCoverUrl"
            :before-upload="beforeUploadCoverUrl"
            :headers="myHeaders"
            class="avatar-uploader"
          >
            <img v-if="tempProduct.httpCoverUrl" :src="tempProduct.httpCoverUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">{{ $t('courseProduct.uploadText') }}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.expireday')">
          <el-input v-model="tempProduct.expireday" maxlength="12" class="filter-item" filterable :placeholder="$t('product.editExpireday')">
            <template slot="append">{{ $t('courseProduct.day') }}</template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.name')" prop="name">
          <el-input v-model="tempProduct.name" maxlength="60" :placeholder="$t('courseProduct.editName')" />
        </el-form-item>
        <el-form-item :label="$t('courseProduct.summary')" prop="summary">
          <el-input v-model="tempProduct.summary" maxlength="60" :placeholder="$t('courseProduct.editSummary')" />
        </el-form-item>
        <el-form-item :label="$t('courseProduct.price')" prop="price">
          <el-input v-model="tempProduct.price" :placeholder="$t('courseProduct.editPrice')" />
        </el-form-item>
        <el-form-item :label="$t('courseProduct.detail')" prop="detail">
          <tinymce ref="detailTinymce" v-model="tempProduct.detail" :height="300" :width="600" :placeholder="$t('courseProduct.editDetail')" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">{{ $t('courseProduct.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='update'" icon="el-icon-check" type="primary" @click="updateData">{{ $t('courseProduct.confirm') }}</el-button>
        <el-button v-else type="primary" icon="el-icon-check" @click="createData">{{ $t('courseProduct.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('courseProduct.editProductUser')" :visible.sync="productUserDialogFormVisible" top="80px" width="60%">
      <el-form ref="productUserDataForm" :rules="rules" :model="productUser" label-position="left" label-width="120px" style="width: 80%; margin-left:100px;">
        <el-form-item :label="$t('courseProduct.id')">
          <span>{{ productUser.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.name')">
          <span>{{ productUser.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.coverUrl')">
          <img :src="productUser.httpCoverUrl | imgFilter" width="100" height="60">
        </el-form-item>
      </el-form>
      <div class="filter-container">
        <el-input v-model="userQuery.NickName" :placeholder="$t('user.searchBywechatNickName')" style="width: 200px;" class="filter-item" />
        <el-input v-model="userQuery.tel" :placeholder="$t('user.searchByTel')" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleUserFilter">{{ $t('user.search') }}</el-button>
      </div>
      <el-pagination :current-page="userListQuery.page" :page-sizes="[10,20,30, 50]" :page-size="userListQuery.limit" :total="userTotal" background layout="total, sizes, prev, pager, next, jumper" @size-change="userHandleSizeChange" @current-change="userHandleCurrentChange" />
      <div class="pagination-container" />
      <el-table
        ref="userTable"
        :key="userTableKey"
        v-loading="userListLoading"
        :data="userList"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @select="selectUser"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column :label="$t('user.id')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.account')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.nickName')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.tel')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('user.avatar')" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.avatar | imgFilter" width="50" height="50">
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page="userListQuery.page" :page-sizes="[10,20,30, 50]" :page-size="userListQuery.limit" :total="userTotal" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="userHandleCurrentChange" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="productUserDialogFormVisible = false">{{ $t('courseProduct.cancel') }}</el-button>
        <el-button icon="el-icon-check" type="primary" @click="updateProductUserData">{{ $t('courseProduct.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('courseProduct.editWechatGroup')" :visible.sync="dialogFormVisibleWechatGroup" top="80px" width="60%">
      <el-form ref="dataFormWechatGroup" :rules="rules" :model="productWechatGroup" label-position="left" label-width="120px" style="width: 80%; margin-left:100px;">
        <el-form-item :label="$t('courseProduct.id')">
          <span>{{ productWechatGroup.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.name')">
          <span>{{ productWechatGroup.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.coverUrl')">
          <img :src="productWechatGroup.httpCoverUrl | imgFilter" width="100" height="60">
        </el-form-item>
      </el-form>
      <div class="filter-container">
        <el-input v-model="listQueryFilterWechatGroup.name" :placeholder="$t('wechatGroup.searchByName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilterWechatGroup" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterWechatGroup">{{ $t('wechatGroup.search') }}</el-button>
      </div>
      <el-pagination :current-page="listQueryWechatGroup.page" :page-sizes="[10,20,30, 50]" :page-size="listQueryWechatGroup.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChangeWechatGroup" @current-change="handleCurrentChangeWechatGroup" />
      <div class="pagination-container" />
      <el-table
        ref="wechatGroupTable"
        :key="tableKeyWechatGroup"
        v-loading="listLoadingWechatGroup"
        :data="listWechatGroup"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @select="selectWechatGroup"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column :label="$t('wechatGroup.id')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('wechatGroup.name')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('wechatGroup.subtitle')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.subtitle }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('wechatGroup.qrcodeurl')" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.httpqrcodeurl | imgFilter" width="50" height="50">
          </template>
        </el-table-column>
        <el-table-column :label="$t('wechatGroup.scantip')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.scantip }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('wechatGroup.createdOn')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page="listQueryWechatGroup.page" :page-sizes="[10,20,30, 50]" :page-size="listQueryWechatGroup.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChangeWechatGroup" @current-change="handleCurrentChangeWechatGroup" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisibleWechatGroup = false">{{ $t('courseProduct.cancel') }}</el-button>
        <el-button icon="el-icon-check" type="primary" @click="updateDataProductWechatGroup">{{ $t('courseProduct.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('courseProduct.editRecommended')" :visible.sync="dialogFormVisibleRecommended" top="80px" width="60%">
      <el-form ref="dataFormRecommended" :rules="rules" :model="productRecommended" label-position="left" label-width="120px" style="width: 80%; margin-left:100px;">
        <el-form-item :label="$t('courseProduct.id')">
          <span>{{ productRecommended.id }}</span>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.name')">
          <span>{{ productRecommended.name }}</span>
        </el-form-item>
        <el-form-item :label="$t('courseProduct.coverUrl')">
          <img :src="productRecommended.httpCoverUrl | imgFilter" width="100" height="60">
        </el-form-item>
      </el-form>
      <div class="filter-container">
        <el-input v-model="listQueryFilterRecommended.name" :placeholder="$t('courseProduct.searchByName')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilterRecommended" />
        <el-select v-model="listQueryFilterRecommended.productcategoryid" clearable filterable class="filter-item" :placeholder="$t('courseProduct.searchByProductcategoryid')">
          <el-option v-for="item in productcategoryList" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilterRecommended">{{ $t('courseProduct.search') }}</el-button>
      </div>
      <el-pagination :current-page="listQueryRecommended.page" :page-sizes="[10,20,30, 50]" :page-size="listQueryRecommended.limit" :total="totalRecommended" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChangeRecommended" @current-change="handleCurrentChangeRecommended" />
      <div class="pagination-container" />
      <el-table
        ref="recommendedTable"
        :key="tableKeyRecommended"
        v-loading="listLoadingRecommended"
        :data="listRecommended"
        border
        fit
        highlight-current-row
        style="width: 100%"
        @select="selectRecommended"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column :label="$t('courseProduct.id')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('courseProduct.coverUrl')" width="150" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.httpCoverUrl | imgFilter" width="100" height="60">
          </template>
        </el-table-column>
        <el-table-column :label="$t('courseProduct.productcategoryid')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productcategoryname }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('courseProduct.name')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('courseProduct.summary')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.summary }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('courseProduct.producttype')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.producttype | producttypeFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('courseProduct.price')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('courseProduct.promoteMoney')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.promoteMoney }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('courseProduct.createdOn')" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdOn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pagination-container">
        <el-pagination :current-page="listQueryRecommended.page" :page-sizes="[10,20,30, 50]" :page-size="listQueryRecommended.limit" :total="totalRecommended" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChangeRecommended" @current-change="handleCurrentChangeRecommended" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisibleRecommended = false">{{ $t('courseProduct.cancel') }}</el-button>
        <el-button icon="el-icon-check" type="primary" @click="updateDataRecommended">{{ $t('courseProduct.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { productPageBycourse, deleteProductById, uploadProductSort, productCourseproductUpdateUser, productInsertbycourse, productUpdateWechatgroup, productUpdateRecommended, productUpdateSort } from '@/api/product'
import { wechatgroupCourseproductPage } from '@/api/wechatGroup'
import { productcategoryCourseproductPage } from '@/api/productCategory'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { getToken } from '@/utils/auth'
import { mapState } from 'vuex'
import { userCourseproductPage } from '@/api/user'
import Tinymce from '@/components/Tinymce'

const producttypeOptions = [
  { key: 0, display_name: '考场视频' },
  { key: 1, display_name: '理论课程' }
]
const langtypeOptions = [
  { key: 0, display_name: '中文' },
  { key: 1, display_name: '维语' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const producttypeKeyValue = producttypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const langtypeKeyValue = langtypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

var validMoney = (rule, value, callback) => {
  const valid_money = /^0\.([1-9]|\d[1-9])$|^[0]$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/
  if (!valid_money.test(value)) {
    return callback(new Error('请输入正确的金额'))
  }
  return callback()
}

export default {
  name: 'CourseProductTable',
  directives: {
    waves
  },
  components: { Tinymce },
  filters: {
    producttypeFilter(type) {
      return producttypeKeyValue[type]
    },
    langtypeFilter(type) {
      return langtypeKeyValue[type]
    },
    imgFilter(v) {
      if (v) {
        return v
      }
      return v
    }
  },
  data() {
    return {
      tableKeyRecommended: 0,
      listRecommended: null,
      totalRecommended: null,
      listLoadingRecommended: true,
      listQueryRecommended: {
        page: 1,
        pageSize: 10,
        title: '',
        filter: {
          filters: [
            {
              field: 'producttype',
              operater: '=',
              value: 1
            }
          ]
        }
      },
      listQueryFilterRecommended: {
        name: null,
        productcategoryid: null
      },
      dialogFormVisibleRecommended: false,
      productRecommended: {
        productId: null,
        recommendedIds: []
      },
      productWechatGroup: {
        productId: null,
        wechatGroupId: null
      },
      tableKeyWechatGroup: 0,
      listWechatGroup: null,
      totalWechatGroup: null,
      listLoadingWechatGroup: true,
      listQueryWechatGroup: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      listQueryFilterWechatGroup: {
        name: null
      },
      dialogFormVisibleWechatGroup: false,
      productcategoryList: [],
      producttypeOptions,
      langtypeOptions,
      userTableKey: 1,
      userListLoading: false,
      productUserDialogFormVisible: false,
      userList: null,
      productUser: {
        productId: null,
        userId: null
      },
      userListQuery: {
        page: 1,
        pageSize: 10,
        title: ''
      },
      userQuery: {},
      userTotal: null,
      coverUrlUploadType: '0',
      myHeaders: { token: getToken() },
      imgUrl: `${process.env.VUE_APP_BASE_API}file/course/upload`,
      tempNewListMerge: {},
      vModelNull: null,
      editTableIndexs: {},
      tableKey: 0,
      tableKeyProductItems: 1,
      tableKeyProductItemsEdit: 2,
      list: null,
      total: null,
      newList: null,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        title: '',
        filter: {
          filters: [
            {
              field: 'producttype',
              operater: '=',
              value: 1
            }
          ]
        }
      },
      uploadInfo: {
        file: null,
        productId: 0,
        title: ''
      },
      textMap: {
        update: '编辑商品',
        create: '新增商品'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      tempProduct: {},
      tempMinSort: 0,
      tempMaxSort: 0,
      tempProductSort: {
        id: null,
        sort: null
      },
      listQueryFilter: {
        name: null,
        productcategoryid: null,
        langtype: null
      },
      downloadLoading: false,
      rules: {
        productcategoryid: [{ required: true, message: '请选择课程分类', trigger: 'blur' }],
        coverUrl: [{ required: true, message: '请上传课程封面', trigger: 'blur' }],
        name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
        summary: [{ required: true, message: '请输入课程摘要', trigger: 'blur' }],
        langtype: [{ required: true, message: '请选择语言类型', trigger: 'change' }],
        price: [{ validator: validMoney, trigger: 'blur' }],
        detail: [{ required: true, message: '请输入课程图文详情', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      cityIds: state => state.user.cityIds
    }),
    moveButtonTypeTop() {
      return (value) => {
        if (value === 0 && this.listQuery.page === 1) {
          return true
        }
        return false
      }
    },
    moveButtonTypeBottom() {
      return (value) => {
        if (value === this.total % this.listQuery.pageSize - 1 && this.listQuery.page === Math.ceil(this.total / this.listQuery.pageSize)) {
          return true
        }
        return false
      }
    }
  },
  created() {
    this.getListData()
  },
  methods: {
    selectRecommended(selection, row) {
      const ids = []
      for (let i = 0; i < selection.length; i++) {
        ids.push(selection[i].id)
      }
      this.productRecommended.recommendedIds = ids
    },
    handleFilterRecommended() {
      this.listQueryRecommended.page = 1
      this.listQueryRecommended.filter = {
        filters: [
          {
            field: 'producttype',
            operater: '=',
            value: 1
          },
          {
            field: 'id',
            operater: '<>',
            value: this.productRecommended.id
          }
        ]
      }
      if (this.listQueryFilterRecommended.name) {
        this.listQueryRecommended.filter.filters.push({
          field: 'name',
          operater: 'like',
          value: '%' + this.listQueryFilterRecommended.name + '%'
        })
      }
      if (this.listQueryFilterRecommended.productcategoryid || this.listQueryFilterRecommended.productcategoryid === 0) {
        this.listQueryRecommended.filter.filters.push({
          field: 'productcategoryid',
          operater: '=',
          value: this.listQueryFilterRecommended.productcategoryid
        })
      }
      this.getListRecommended()
    },
    getListRecommended() {
      this.listLoadingRecommended = true
      productPageBycourse(this.listQueryRecommended).then(response => {
        this.listRecommended = response.data.items
        this.totalRecommended = response.data.total
        console.log(this.productRecommended)
        console.log(this.listRecommended)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoadingRecommended = false
          for (let i = 0; i < this.listRecommended.length; i++) {
            for (let j = 0; j < this.productRecommended.productSuggestRecomproductids.length; j++) {
              if (this.listRecommended[i].id === this.productRecommended.productSuggestRecomproductids[j]) {
                // 设置选中
                this.$refs['recommendedTable'].toggleRowSelection(this.listRecommended[i])
              }
            }
          }
        }, 1.5 * 1000)
      })
    },
    handleSizeChangeRecommended(val) {
      this.listQueryRecommended.pageSize = val
      this.getListRecommended()
    },
    handleCurrentChangeRecommended(val) {
      this.listQueryRecommended.page = val
      this.getListRecommended()
    },
    handleEditRecommended(row) {
      this.productRecommended = Object.assign({}, row)
      if (!this.productRecommended.recommendedIds || this.productRecommended.recommendedIds.lenth <= 0) {
        this.productRecommended.recommendedIds = []
      }
      if (row.productSuggestRecomproductids && row.productSuggestRecomproductids.length > 0) {
        this.productRecommended.recommendedIds = Object.assign([], row.productSuggestRecomproductids)
      }
      this.listRecommended = null
      this.totalRecommended = null
      this.listQueryRecommended.filter = {
        filters: [
          {
            field: 'producttype',
            operater: '=',
            value: 1
          },
          {
            field: 'id',
            operater: '<>',
            value: this.productRecommended.id
          }
        ]
      }
      this.dialogFormVisibleRecommended = true
      this.getListRecommended()
      this.$nextTick(() => {
        this.$refs['dataFormRecommended'].clearValidate()
      })
    },
    updateDataRecommended() {
      this.$refs['dataFormRecommended'].validate((valid) => {
        if (valid) {
          if (!this.productRecommended.recommendedIds || this.productRecommended.recommendedIds <= 0) {
            this.$notify({
              title: '失败',
              message: '请先选择一个商品!',
              type: 'error',
              duration: 2000
            })
            return
          }
          const addRecommendedIds = []
          const deleteRecommendedIds = []
          for (let j = 0; j < this.productRecommended.productSuggestRecomproductids.length; j++) {
            let flag = false
            for (let i = 0; i < this.productRecommended.recommendedIds.length; i++) {
              if (this.productRecommended.recommendedIds[i] === this.productRecommended.productSuggestRecomproductids[j]) {
                flag = true
              }
            }
            if (!flag) {
              // 删除
              deleteRecommendedIds.push(this.productRecommended.productSuggestRecomproductids[j])
            }
          }
          for (let i = 0; i < this.productRecommended.recommendedIds.length; i++) {
            let flag = false
            for (let j = 0; j < this.productRecommended.productSuggestRecomproductids.length; j++) {
              if (this.productRecommended.recommendedIds[i] === this.productRecommended.productSuggestRecomproductids[j]) {
                flag = true
              }
            }
            if (!flag) {
              // 添加
              addRecommendedIds.push(this.productRecommended.recommendedIds[i])
            }
          }
          const updateDate = {
            productId: this.productRecommended.id,
            recommendedIds: this.productRecommended.recommendedIds,
            addRecommendedIds: addRecommendedIds,
            deleteRecommendedIds: deleteRecommendedIds
          }
          productUpdateRecommended(updateDate).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisibleRecommended = false
            this.getList()
          })
        }
      })
    },
    selectWechatGroup(selection, row) {
      this.$refs.wechatGroupTable.clearSelection()
      this.$refs.wechatGroupTable.toggleRowSelection(row)
      this.productWechatGroup.wechatGroupId = row.id
    },
    handleFilterWechatGroup() {
      this.listQueryWechatGroup.page = 1
      this.listQueryWechatGroup.filter = {
        filters: []
      }
      if (this.listQueryFilterWechatGroup.name) {
        this.listQueryWechatGroup.filter.filters.push({
          field: 'name',
          operater: 'like',
          value: '%' + this.listQueryFilterWechatGroup.name + '%'
        })
      }
      this.getListWechatGroup()
    },
    getListWechatGroup() {
      this.listLoadingWechatGroup = true
      wechatgroupCourseproductPage(this.listQueryWechatGroup).then(response => {
        this.listWechatGroup = response.data.items
        this.totalWechatGroup = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoadingWechatGroup = false
        }, 1.5 * 1000)
      })
    },
    handleSizeChangeWechatGroup(val) {
      this.listQueryWechatGroup.pageSize = val
      this.getListWechatGroup()
    },
    handleCurrentChangeWechatGroup(val) {
      this.listQueryWechatGroup.page = val
      this.getListWechatGroup()
    },
    handleGoToChapterTable(row) {
      this.$router.push({
        name: 'ChapterList',
        query: {
          productid: row.id
        }
      })
    },
    handleEditWechatGroup(row) {
      this.productWechatGroup = Object.assign({}, row)
      if (!this.productWechatGroup.wechatGroupId || this.productWechatGroup.wechatGroupId === 0) {
        this.productWechatGroup.WechatGroupId = null
      }
      this.listWechatGroup = null
      this.totalWechatGroup = null
      this.dialogFormVisibleWechatGroup = true
      this.getListWechatGroup()
      this.$nextTick(() => {
        this.$refs['dataFormWechatGroup'].clearValidate()
      })
    },
    updateDataProductWechatGroup() {
      this.$refs['dataFormWechatGroup'].validate((valid) => {
        if (valid) {
          if (!this.productWechatGroup.wechatGroupId) {
            this.$notify({
              title: '失败',
              message: '请先选择一个微信群!',
              type: 'error',
              duration: 2000
            })
            return
          }
          const updateDate = {
            productId: this.productWechatGroup.id,
            wechatGroupId: this.productWechatGroup.wechatGroupId
          }
          productUpdateWechatgroup(updateDate).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisibleWechatGroup = false
            this.getList()
          })
        }
      })
    },
    selectUser(selection, row) {
      this.$refs.userTable.clearSelection()
      this.$refs.userTable.toggleRowSelection(row)
      this.productUser.userId = row.id
    },
    updateProductUserData() {
      this.$refs['productUserDataForm'].validate((valid) => {
        if (valid) {
          if (!this.productUser.userId) {
            this.$notify({
              title: '失败',
              message: '请先选择一位用户!',
              type: 'error',
              duration: 2000
            })
            return
          }
          const updateDate = {
            productId: this.productUser.id,
            userId: this.productUser.userId
          }
          productCourseproductUpdateUser(updateDate).then(response => {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.productUserDialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleEditUserId(row) {
      this.productUser = Object.assign({}, row)
      if (!this.productUser.userId || this.productUser.userId === 0) {
        this.productUser.userId = null
      }
      this.userList = null
      this.userTotal = null
      this.productUserDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['productUserDataForm'].clearValidate()
      })
    },
    userHandleSizeChange(val) {
      this.userListQuery.pageSize = val
      this.getUsers()
    },
    userHandleCurrentChange(val) {
      this.userListQuery.page = val
      this.getUsers()
    },
    handleUserFilter() {
      this.userListQuery.page = 1
      this.userListQuery.filter = {
        filters: []
      }
      if (this.userQuery.NickName) {
        this.userListQuery.filter.filters.push({
          field: 'nickname',
          operater: 'like',
          value: '%' + this.userQuery.NickName + '%'
        })
      }
      if (this.userQuery.tel) {
        this.userListQuery.filter.filters.push({
          field: 'tel',
          operater: '=',
          value: this.userQuery.tel
        })
      }
      if (this.userListQuery.filter.filters.length <= 0) {
        return
      }
      this.getUsers()
    },
    getUsers() {
      this.userListLoading = true
      userCourseproductPage(this.userListQuery).then(response => {
        this.userList = response.data.items
        this.userTotal = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.userListLoading = false
        }, 1.5 * 1000)
      })
    },
    handleSuccessCoverUrl(res, file) {
      if (res.code === 0) {
        setTimeout(() => {
          this.tempProduct.coverUrl = res.data.url
          this.tempProduct.httpCoverUrl = res.data.httpUrl
          this.$refs['dataForm'].validateField('coverUrl')
        }, 1000)
      }
    },
    beforeUploadCoverUrl(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传图标只能是 JPG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传图标大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    uploadUrl() {
      return this.imgUrl
    },
    fileChange(e) {
      this.uploadInfo.file = null
      const file = e.target.files[0]
      const isVideo = file.type === 'video/mp4'
      if (isVideo) {
        this.uploadInfo.file = file
      } else {
        this.uploadInfo.file = null
      }
      // this.$root.$eventHub.$emit('ALIYUN_UPLOAD_VIDEO', e)
    },
    getListData() {
      const query = {
        page: 1,
        pageSize: 1000000
      }
      productcategoryCourseproductPage(query).then(response => {
        this.productcategoryList = []
        if (response.data && response.data.items && response.data.items.length > 0) {
          for (let i = 0; i < response.data.items.length; i++) {
            this.productcategoryList.push({
              key: response.data.items[i].id,
              display_name: response.data.items[i].name
            })
          }
        }
        this.getList()
      })
    },
    handleUp(row) {
      this.tempProductSort = {}
      this.tempProductSort.id = row.id
      this.tempProductSort.sort = row.sort - 1
      uploadProductSort(this.tempProductSort).then(response => {
        if (response.code === 0) {
          this.getList()
        } else {
          this.$notify({
            title: '失败',
            message: '操作失败! 错误码：' + response.code,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handleDown(row) {
      this.tempProductSort = {}
      this.tempProductSort.id = row.id
      this.tempProductSort.sort = row.sort + 1
      uploadProductSort(this.tempProductSort).then(response => {
        if (response.code === 0) {
          this.getList()
        } else {
          this.$notify({
            title: '失败',
            message: '操作失败! 错误码：' + response.code,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    changePricingType(row) {
      validMoney(null, row.price, function(error) {
        if (error) {
          row.price = null
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.filter = {
        filters: [
          {
            field: 'producttype',
            operater: '=',
            value: 1
          }
        ]
      }
      if (this.listQueryFilter.name) {
        this.listQuery.filter.filters.push({
          field: 'name',
          operater: 'like',
          value: '%' + this.listQueryFilter.name + '%'
        })
      }
      if (this.listQueryFilter.langtype || this.listQueryFilter.langtype === 0) {
        this.listQuery.filter.filters.push({
          field: 'langtype',
          operater: '=',
          value: this.listQueryFilter.langtype
        })
      }
      if (this.listQueryFilter.productcategoryid || this.listQueryFilter.productcategoryid === 0) {
        this.listQuery.filter.filters.push({
          field: 'productcategoryid',
          operater: '=',
          value: this.listQueryFilter.productcategoryid
        })
      }
      this.getList()
    },
    getList() {
      this.listLoading = true
      productPageBycourse(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleEdit(row) {
      this.coverUrlUploadType = '0'
      this.tempProduct = {}
      this.tempProduct = Object.assign({}, row)
      if (this.tempProduct.detail === null) {
        this.setDetailTinymce('请输入课程图文详情')
      } else {
        this.setDetailTinymce(this.tempProduct.detail)
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      // 暂时添加videoId
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          productInsertbycourse(this.tempProduct).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: '操作失败! 错误码：' + response.code,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    setDetailTinymce(content) {
      if (this.$refs['detailTinymce'] && this.$refs['detailTinymce'].setContent) {
        this.$refs['detailTinymce'].setContent(content)
        return
      } else {
        setTimeout(() => {
          this.setDetailTinymce(content)
        }, 500)
      }
    },
    handleAdd() {
      this.coverUrlUploadType = '0'
      this.tempProduct = {}
      this.$set(this.tempProduct, 'coverUrl', null)
      this.$set(this.tempProduct, 'httpCoverUrl', null)
      this.tempProduct.producttype = 1
      this.setDetailTinymce('请输入课程图文详情')
      // if (this.tempProduct.detail === null) {
      //   this.setDetailTinymce('请输入课程图文详情')
      // } else {
      //   this.setDetailTinymce(this.tempProduct.detail)
      // }
      // this.examList = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (this.tempProduct.expireday) {
          var reg = /^(0|[1-9][0-9]*)$/
          if (!reg.test(this.tempProduct.expireday)) {
            this.$message({
              type: 'info',
              message: '请输入正确的购买期限'
            })
          }
        }
        if (valid) {
          productInsertbycourse(this.tempProduct).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$notify({
                title: '失败',
                message: '操作失败! 错误码：' + response.code,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProductById(row.id).then(response => {
          if (response.code === 0) {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            this.$notify({
              title: '失败',
              message: '操作失败! 错误码：' + response.code,
              type: 'error',
              duration: 2000
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    moveButtonToTop(index, value) { // id是产品id ，sort根据原有的dortzhi进行加减，减一上移，加一下移
      const model = {
        id: value.id,
        sort: value.sort - 1
      }
      productUpdateSort(model)
        .then((res) => {
          this.$notify({
            title: '成功',
            message: '上移成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    moveButtonToBottom(index, value) {
      const model = {
        id: value.id,
        sort: value.sort + 1
      }
      productUpdateSort(model)
        .then((res) => {
          this.$notify({
            title: '成功',
            message: '上移成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 90px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height: 160px;
    display: block;
  }

  .avatar-uploader-icon2 {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height:150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar2 {
    width: 150px;
    height:150px;
    display: block;
  }
  .buttonTop{
    margin-top: 10px;
  }
</style>
