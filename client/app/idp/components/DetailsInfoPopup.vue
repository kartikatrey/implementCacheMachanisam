<template>
 <section class="details-info-container accordian-container">
     
      <div class="panel no-p" v-loading="loading">
        <div class="panel-body no-p">
          <!-- Header fields -->
          <div class="details-container"> 
              <el-form
              ref="form"
              class="details-form-container"
              :model="form"
              label-width="130px"
            >
              <el-row>
                <el-col class="mb-10 header-fields"
                  :span="4"
                  v-for="(field, index) in header"
                  v-bind:key="index"
                >
                  <div class="form-group form-horizontal">
                    <div class="filed-label">{{ field.label }}</div>
                    <div class="filed-value">{{ field.value }}</div>
                  </div>

             
                  
                </el-col>
              </el-row>
                
              <el-row v-if="!isDataValid">
                <el-col class="mb-10 data-not-found">
                  <span>No data found.. </span>
                </el-col>
              </el-row>
              

              </el-form>
          </div>
          <!-- Line item table -->
          <section v-if="tableParams" class="po-details-table-container">
            <div data-v-step="2" class="table-wrap">
              <data-table
                class="po-details-popup"
                :parameters="tableParams"
                ref="detailsInfoPopup"
              ></data-table>
            </div>
          </section>
        </div>

      </div>
  </section>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import { Loading } from "element-ui";
import DocumentScriptService from "@/idp/services/DocumentScriptService";
import _ from "lodash";
export default {
  name: "DetailsInfo",
  props: ["displayDetailsInfo", "data"],
  components: { DataTable, Loading },
  data() {
    return {
      title: "",
      loading: false,
      header: [
      ],
      tableParams: "",
      form: {},
    };
  },
  computed: {
    isDataValid() {
        return !this.loading && (this.header && this.header.length) && this.tableParams;
    }
  },
  methods: {
    renderData(data = { lines: {}, header: [] }) {

      _.get(data,'lines.values') && data.lines.values.length && (this.tableParams = {
        isStaticTable: true,
        showPaginationOptions: false,
        showTableToolbar: false,
        showSortOptions: false,
        fixedHeader: false,
        tableMaxHeight:'180px',
        rows: data.lines.values,
        columns:  data.lines.header,
      });

      this.header = data.header || [];
      data.title && (this.title = data.title)
    },
    async fetchDetails() {
      this.loading = true;
      try {
        const payload = {
          document_type: this.data.document_type,
          field_name: this.data.field_config.name,
          script_type: this.data.script_type,
          field_value:this.data.field_value,
          form:this.data.form,
          document_id:this.data.document_id
        };
        const response = await DocumentScriptService.run(payload);
        const data = _.get(response,'data.body') || {};
        this.renderData(data);
      } catch (exception) {
        console.log(exception);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchDetails();
  },
};
</script>


<style lang="scss" >
@import "../_idpVariables";
@import "../_idpGlobal";

.details-info-container {
    height:100%;
    .panel{
        height:100%;
    }

    .panel-body{
        height:100%;
    }

    .po-details-table-container{
        margin: 0rem 0 3rem 0;
        padding: 0rem 2rem;
        height: calc(100% - 120px);

        .table-wrap{
            height:100%;
        }
    }

.data-not-found{
    text-align: center;
}

.title {
  position: relative;
  font-weight: 500;
  color: var(--dark-01);
  padding: 1rem 2rem;
  border-bottom: 0.0625rem solid var(--dark-07);
        .close-btn {
             position: absolute;
            right: 1rem;
            top: 1rem;
             color: var(--dark-04);
            padding: 0;
            font-size: 1.6rem;
        }
        .back-btn {
          padding:0 5px 0 0;
          font-size: 1.6rem;
          color: var(--dark-02);
        }
}
}

.field-container{
  footer {
    display: flex;
    padding: 1rem 2rem;
    border-top: 0.0625rem solid var(--dark-07);
    
    div:first-child {
        margin-left: 0;
        margin-right: auto;
    }
  }
}


.el-dialog {
  padding: 0;
  border-radius: .3rem;
}

.details-container {
    // background: var(--dark-10);
    // background: #EDF2F7;
    // .details-form-container{
    //   .header-fields{
    //     margin-right: 20px;
    //   }
    // }
    padding: 1rem 2rem 0rem 2rem;
   
      .filed-label {
        font-size: 11.124px;
        color: var(--dark-04);
      }
      .filed-value {
        color: var(--dark-01);
        font-size: 12px;
        font-weight: 500;
      }
  }

  .line-item-container{
      margin:0rem 0 3rem 0;
       padding: 0rem 2rem;
  }

</style>