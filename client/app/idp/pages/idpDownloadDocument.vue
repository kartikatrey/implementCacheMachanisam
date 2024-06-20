<template>
  <el-main class="kp-main">
    <section class="page-body">
    </section>
  </el-main>
</template>

<script>
import _ from "lodash";
import DocumentService from "@/idp/services/DocumentService";
export default {
  name: "idpDownloadDocument",
  data() {
    return {
    };
  },
  methods: {
    async openDocument(id) {
      const urls = await DocumentService.getFileUrl({id,file_for_preview: true});
      !_.isEmpty(urls) && window.open(urls[0]);
    }
  },
  async beforeMount() {
    const docId = this.$route.query.id;
    docId && await this.openDocument(docId)
  }
};
</script>
<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";
.confirmation-box .el-form-item {
    margin-bottom: 0;
      .el-form-item__label {
        font-size: var(--font-base);
        line-height: 28px;
      }
      .el-input {
        height: 28px;
      }
}
</style>
