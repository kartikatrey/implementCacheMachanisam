<template>
  <div class="cell-button-container">
    <a
      :cid="'row-' + propData.column.field + '-'+ propData.index"
      v-bind:class="[disableLink]"
      @click.prevent="handleClick($event)"
    >{{propData.row[options.key]}}</a>
    <span class="button-value"></span>
  </div>

  <!-- Key : this is used to show the value from propData -->
  <!-- eventName : this is used to emit the event with row data -->
</template>

<script>
import EventBus from "@/EventBus";
import _ from "lodash";
import Constants from "@/resources/Constants";


export default {
  name: "LinkButton",
  props: ["propData", "options"],
  computed: {
    disableLink() {
      if (this.options.disableValues && _.includes([Constants.DOCEX.STAGE.UPLOADED,Constants.DOCEX.STAGE.EXTRACTED], this.options.stage)) {
        if (
          _.includes(
            this.options.disableValues,
            this.propData.row[this.options.disableCheckKey]
          )
        ) {
          return "disable-link";
        }
      }
      return "";
    },
    cid(){
      if(!_.get(this.propData,'column.field'))return;
      return 'row-' + this.propData.column.field + '-'+ this.propData.index;
    }
  },
  methods: {
    handleClick(event) {
      const linkValue = event.srcElement.classList.value;
      if (this.options.disableValues && linkValue.indexOf("disable-link") >= 0 ) return;
      if(this.options.type == 'package'){
        this.propData.row.type = 'package';
      }
      EventBus.$emit(this.options.eventName, this.propData.row);
    },
  },
};
</script>
<style lang="scss">
.cell-button-container {
  display: inline-flex;
  cursor: pointer;
  a:hover {
    color: #052ade;
    background-color: transparent;
    text-decoration: underline;
  }
}

.disable-link {
  color: currentColor;
  cursor: not-allowed;
  opacity: 0.5;
  text-decoration: none !important;
  // pointer-events: none;
}
</style>



