<template>
  <div class="view-array-container">
    <span class="badge-span" v-for="(item, index) in this.data" v-bind:key="index">
      <sup class="badge">{{item}}</sup>
    </span>
  </div>
</template>

<script>
export default {
  name: "ViewArray",
  components: {},
  props: ["props", "propData"],
  data() {
    return {data:[]};
  },
  methods: {},
  beforeMount() {
    const field = this.propData.column.field;
    this.data = this.propData.row[field];
  },
};
</script>

<style lang="scss">
@import "../../idp/_idpVariables";
.view-array-container {
  .badge-span{
    margin-right: 3px;
  }
  .badge {
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
    width: auto;
  }
}
</style>
