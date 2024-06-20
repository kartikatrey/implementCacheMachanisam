<template>
<el-main >


 <div class="page-header">
      <h1>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '' }">Script</el-breadcrumb-item>
          <el-breadcrumb-item>Add Entities</el-breadcrumb-item>
        </el-breadcrumb>
      </h1>
    </div>


<el-row :gutter="20">
        <el-col :span="6">
           <el-form :model="form">
                 <el-form-item label="Customer" :label-width="formLabelWidth">
                <el-select  placeholder="Please select a zone">
                    <el-option label="Zone No.1" value="shanghai"></el-option>
                    <el-option label="Zone No.2" value="beijing"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Domain" :label-width="formLabelWidth">
            <el-select  placeholder="Please select a zone">
                <el-option label="Zone No.1" value="shanghai"></el-option>
                <el-option label="Zone No.2" value="beijing"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="Object Name" :label-width="formLabelWidth">
            <el-select  placeholder="Please select a zone">
                <el-option label="Zone No.1" value="shanghai"></el-option>
                <el-option label="Zone No.2" value="beijing"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="Action" :label-width="formLabelWidth">
            <el-select  placeholder="Please select a zone">
                <el-option label="Zone No.1" value="shanghai"></el-option>
                <el-option label="Zone No.2" value="beijing"></el-option>
            </el-select>
            </el-form-item>

            <el-form-item label="Sort" :label-width="formLabelWidth">
            <el-select  placeholder="Please select a zone">
                <el-option label="Zone No.1" value="shanghai"></el-option>
                <el-option label="Zone No.2" value="beijing"></el-option>
            </el-select>
            </el-form-item>               
            </el-form>
        </el-col>

        <el-col :span="18">
              <span class="label">Required Script</span>
              <div class="mb-10">
                   Keep Codemirror here
              </div>

              <span class="label ">Optional Script</span>
              <div>
                   Keep Codemirror here
              </div>
        </el-col>
    </el-row>

 <!-- sticky button -->
      <div class="sticky-btn-wrap">
       <el-button><i class="mdi mdi-keyboard-backspace"></i> Cancel</el-button>
	                    <el-button type="primary"><i class="mdi mdi-check"></i> Save</el-button>
                        <el-button @click="dialogFormVisible = true">+ Add another data</el-button>
      </div>
      <!-- end sticky button -->

              <!-- dialog -->
                        <el-dialog class="add-data-wrap" title="Add Data" :visible.sync="dialogFormVisible">
                            <el-row>
                                <el-col>
                                    <h1>Action Required</h1>
                                    <p>Please save current date before adding another</p>
                                </el-col>
                            </el-row>
                        <span slot="footer" class="dialog-footer align-vertical-middle">
                            <el-button type="primary" @click="dialogFormVisible = false">Save</el-button>
                            <el-button @click="dialogFormVisible = false">Discard</el-button>
                            
                        </span>
                        </el-dialog>
                    <!-- dialog -->
  </el-main>
</template>

<style lang="scss">
@import "../../assets/scss/_variables";
.table-data-belt {
	.el-button {
        padding: 12px 20px !important;
    }
}
.label {
        font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.checked-label .el-form-item__label {
    display: block;
    width: 100%;
    text-align: left;
}
.add-data-wrap {
    h1 {
        text-align: center;
        font-size: 2.5em;
        margin: 0;
    }
    p {
        font-size: 24px;
        text-align:center;
    }
    .el-dialog__footer {
        text-align: center;
    }
}
</style>

<script>
import DataTable from "../../components/DataTable.vue";
import TableAPIService from "../../services/TableAPIService";
import AjaxService from "../../services/AjaxService";

let tableApiService = new TableAPIService();

import { _ } from "vue-underscore";
export default {
  name: "Entities",
  components: { DataTable },
  data() {
    return {
    dialogFormVisible: false,
      allLeads:0,
      tableParams: {
        apiName: '/portal/api/table/User',
        queryParam: {"customer_id":{"$exists" : false}},
        tableName: "leadUser",
        initialSort :"-createdAt",
        isRestify: true,
        limit: 10
      }
    };
  },
  methods: {
    getCount(){
		AjaxService.getJson("/portal/api/user-detail", {}, (error, res) => {
			this.allLeads = res.data.response[0].all_leads;
      });
  }
  },
	beforeMount(){
  this.getCount()
 }
};
</script>

