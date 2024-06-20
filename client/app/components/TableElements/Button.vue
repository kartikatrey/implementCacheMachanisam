<template>
    <el-button :cid="'table-action-'+options.label +'_'+ propData.index" class="datatable-button" v-bind="options" v-on:click="click()" >
      {{options.label}}
    </el-button>
</template>

<script>
import EventBus from "@/EventBus";
export default {
  name: "Button",
  props: ["propData", "options"],
  methods: {
    click() {
      EventBus.$emit(this.options.eventName, this.propData.row);
    }
  }
};
</script>
<style lang="scss">
.datatable-button{
  margin: 7px;
  margin-right: 7px;
}
</style>
