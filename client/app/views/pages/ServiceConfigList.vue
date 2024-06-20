<template>
<el-main>
		<h1 class="kp-page-title">{{pageTitle}}</h1>
      <div class="table-wrap">
        <data-table :parameters="tableParams" ref="datatable"></data-table>
      </div>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import ServiceConfigService from "@/services/ServiceConfigService";
export default {
  name: "ServiceConfigList",
  components: { DataTable },
  data() {
    return {
      activeServiceCount: 0,
      tableParams: {
        apiName: `/portal/api/table/service`,
        queryParam: { active: true },
        tableName: "service",
        enableExport:true,
        isRestify: true,
        limit: 10, 
        addButtonConfig:{path:"/service-config-form",name:'Add service'},
      },
      pageTitle:"Service configuration"
    };
  },
  methods: {
  },
  beforeMount() {
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
        margin-bottom: 10px;

        .el-input {
          width: auto;
          margin-right: 20px;
        }
        .tagname-code-area-container {
          // background: #e4e7ed;
          padding: 15px;
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


