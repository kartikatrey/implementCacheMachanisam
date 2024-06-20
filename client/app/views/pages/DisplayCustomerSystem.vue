<template>
  <el-main >

  <div class="page-header">
    <h1  class="page-heading">Customer Systems</h1>
  </div>

   <div class="page-info-strip">
		<div class="page-info-container" style="width:85px">
			<el-row :gutter="20">
				<el-col :span="24">
					<span>All Systems</span>
					<h2>{{allCustomerSystems}}</h2>
				</el-col>
			</el-row>
		</div>
	</div>

  <div class="table-data-belt ph-10 pv-10 card-shadow--medium">
			<div class="flex">
					<div class="box">
						<el-button type="text" v-on:click="$router.push('insert-customer-system')"> + Add Customer System</el-button>
					</div>
					<div class="box center">&nbsp;</div>
					<div class="box right-sec">
						<div class="search-container">
							<el-input placeholder="Search" v-model="input5" class="input-with-select">
								<el-button slot="append" icon="el-icon-search"></el-button>
							</el-input>
						</div>
						<el-button type="text"><i class="mdi mdi-filter-variant el-icon-left"></i></el-button>
						<el-button type="text"><i class="mdi mdi-arrow-collapse-down el-icon-left"></i> Export</el-button>
					</div>
			</div>
		</div>

  <div class="grid-content bg-purple">
			<div class="table-wrap">
      <data-table
        :parameters="tableParams"
        @refreshCount="refreshCount" 
      ></data-table>
			</div>
  </div>
  </el-main>
</template>

<script>
import TableAPIService from "@/services/TableAPIService";
import DataTable from "../../components/DataTable.vue";
import AjaxService from "@/services/AjaxService";
let tableAPI = new TableAPIService();
export default {
  name: "DisplayServiceConfig",
  components: { DataTable },
  data() {
    return {
      allCustomerSystems:0,
      tableParams: {
        apiName: `/portal/api/table/customer_system`,
       queryParam: {},
        tableName: "customer_system",
//        initialSort :"-createdAt",
        enableExport:true,
        isRestify: true,
        limit: 10
      }
    };
  },
  methods: {
    getAllCustomerSystemsCount(){
		AjaxService.getJson("/portal/api/customer-system-count", {}, (error, res) => {
			this.allCustomerSystems = res.data.customer_system_count;
      });
  },
    refreshCount() {
      this.getAllCustomerSystemsCount();
    }
  },
  beforeMount(){
  this.getAllCustomerSystemsCount()
 }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
.service-config-container {
  .el-select {
    display: block;
  }
  .btn-save {
    text-transform: uppercase;
    font-weight: 700;
    display: block;
    margin-left: 0;
  }
  .el-input__suffix {
    top: 20px;
  }
  .el-form-item__label {
    font-weight: 700;
    text-transform: uppercase;
    font-size: $font-size-14;
  }
  .sub-head {
    font-weight: bold;
    text-transform: uppercase;
    font-size: $font-size-14;
  }
  .code-area-container {
    background: #e4e7ed;
    padding: 25px;
    min-height: 300px;
    margin-bottom: 20px;
  }
  .enter-code-indicator {
    font-weight: bold;
    text-transform: uppercase;
    font-size: $font-size-28;
    opacity: 0.5;
  }

  // Tag Filed mapping
  .el-tabs__content,
  .el-tabs__header {
    padding: 15px;
  }

  .object-container {
    background: $color-white;
    border-radius: 5px;
    margin-bottom : 10px;
    overflow: hidden;
    .btn-addtag {
      margin-bottom: 20px;
    }
    .obj-name {
      background: #e4e7ed;
      padding: 10px 16px;
      margin: 0;
      font-weight: bold;
      text-transform: uppercase;
      font-size: $font-size-14;
    }
    .el-button--text {
      font-weight: bold;
    }
    .object-body {
      padding: 16px;
      .tagname-container {
        border-bottom: 1px solid #dcdfe6;
        padding: 10px  0;
        margin-bottom: 5px;

        .el-input {
          width: auto;
          margin-right: 20px;
        }
        .tagname-code-area-container {
          // background: #e4e7ed;
          padding: 0px;
          min-height: 100px;
          vertical-align: top;
          width: 55%;
          display: inline-block;
          margin-left: 20px;
          .enter-code-indicator {
            opacity: 0.5;
          }
        }
      }
    }
  } // Tag Filed mapping

  .webchat-chekbox {
    font-weight: 700;
    text-transform: uppercase;
    font-size: $font-size-14;
    margin-bottom: 25px;
    line-height: 18px;
  }
}
</style>


