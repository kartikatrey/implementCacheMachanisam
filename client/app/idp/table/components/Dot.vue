<template>
  <span>
    <span
      v-if="data.row.dot_line_class"
      :class="data.row.dot_class"
      class="multi-doc-dot"
    >
    </span>
    <span
      v-if="data.row.dot_line_class"
      class="multi-doc-line"
      :class="data.row.dot_line_class"
    >
    </span>
    <span v-if="showErrorDot" :class="className"></span>
  </span>
</template>

<script>
export default {
  name: "Dot",
  props: ["data","options"],
  data() {
    return {
      className: null
    };
  },
  computed: {
    showErrorDot() {
      let showError = false;
      if (_.get(this.options,'errorPointCheck')) {
        const errorPointOptions = this.options.errorPointCheck;
        for (let i = 0; i < errorPointOptions.length; i++) {
          if (this.data.row[errorPointOptions[i].key] == errorPointOptions[i].value) {
              this.className = errorPointOptions[i].class;
              showError = true;
          }
        }
      }
      return showError;
    }
  }
};
</script>

<style lang="scss" >
@import "../../_idpVariables";
@import "../../_idpGlobal";

.multi-doc-dot {
  position: absolute;
  right: 2px;
  display: inline-block;
  background: var(--dark-05);
  border-radius: 100px;
  height: 6px;
  width: 6px;
  padding: 2px;
  color: white;
  top: 35%;
  font-size: 10px;
  text-align: center;
  line-height: 11px;
  z-index:9;
  box-sizing:unset;
}

.multi-doc-line {
  position: absolute;
  height: 100%;
  width: 2px;
  border-left: 1px dashed #85aee4;
  // left: -1.5px;
  top: 0;
  right:4px;
}
.child-dot{
  background: var(--green-06);
}

// First Line
.start-line {
  height: 50%;
  top: 50%;
}
// Last Line
.end-line {
  height: 50%;
}
.error-dot{
    position: absolute;
    background:  var(--red-05);
    width: 4px;
    height: 4px;
    border-radius: 7px;
    right: -6px;
    top: 13px;
    // left: 8px;
    z-index: 1000;
}
.fraud-dot{
    position: absolute;
    background: var(--yellow-05);
    width: 4px;
    height: 4px;
    border-radius: 7px;
    right: -6px;
    top: 13px;
    // left: 8px;
    z-index: 1000;
}
</style>
