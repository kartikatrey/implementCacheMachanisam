<template>
  <div class="credit-card-container">
    <div class="credit-icon">
      <i class="el-icon-bank-card"></i>
    </div>
    <div>{{creditCardNumber}}</div>
    <div class="badge-container" v-if="propData.row.is_default">
      <el-badge value="Default" type="primary"></el-badge>
    </div>
  </div>
</template>

<script>
import EventBus from "@/EventBus";
export default {
  name: "CreditCard",
  props: ["propData", "options"],
  methods: {
    click() {
      EventBus.$emit(this.options.eventName, this.propData.row);
    }
  },
  computed: {
    creditCardNumber: function() {
      let creditCardNumber = "";
      for (let i = 0; i < this.options.length; i++) {
        creditCardNumber = creditCardNumber ? (creditCardNumber += " - ") : "";
        creditCardNumber += this.propData.row[this.options[i].key];
      }
      return creditCardNumber;
    }
  }
};
</script>
<style lang="scss">
.credit-card-container {
  display: inline-flex;
  .credit-icon {
    margin-right: 14px;
    font-size: 23px;
    margin-top: -6px;
  }
}
.badge-container {
  margin-left: 10px;
}
</style>
