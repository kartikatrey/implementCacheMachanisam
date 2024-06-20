<template>
  <div class="el-badge mark">
    <sup
      v-if="propData.row[fieldName] == 'Success'"
      class="badge-Success"
    >{{propData.row[fieldName]}}</sup>
    <sup
      v-if="propData.row[fieldName] == 'Failed' || propData.row[fieldName] == 'Failure' "
      class="badge-Failed"
    >{{propData.row[fieldName]}}</sup>
    <sup
      v-if="propData.row[fieldName] == 'Cancelled' || propData.row[fieldName] == 'Cancelled' "
      class="badge-Cancelled"
    >{{propData.row[fieldName]}}</sup>
  </div>
</template>

<script>
export default {
  name: "statusBadge",
  props: ["propData", "fieldName"],
  data() {
    return {
      search: "",
      list: []
    };
  },

  methods: {}
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.page-info-container {
  border-radius: 5px;
  -webkit-box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  max-width: 420px;
  width: 100%;
  padding: 16px;
  background: $color-white;
  .el-col {
    border-right: 0.5px solid #bbbbbb;
    border-radius: 0;
    &:last-child {
      border-right: 0;
    }
  }
}

.badge-Success {
  background-color: white;
  border-radius: 10px;
  color: rgba(66, 240, 153, 0.7);
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid rgba(66, 240, 153, 0.7);
  width: 45px;
}

.badge-Failed {
  background-color: white;
  border-radius: 10px;
  color: rgba(254, 144, 151, 1);
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid rgba(254, 144, 151, 0.7);
  width: 45px;
}

.badge-Cancelled {
  background-color: white;
  border-radius: 10px;
  color: rgba(254, 144, 151, 1);
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid rgba(254, 144, 151, 0.7);
  width: 90%;
}
</style>

