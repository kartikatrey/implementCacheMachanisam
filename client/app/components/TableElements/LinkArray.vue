<!-- updated the component
purpose: when delimiter is passed then links should be seperated depending on delimiter passed from options
so, if delimiter is passed then code will add it between links else, code will work by default as it was working before for links-->
<template>
  <div>
    <div v-if="options.isListOfStrings && options.label_key && options.delimiter">
      <span v-for="(field, index) in links" v-bind:key="index">
          {{ index < links.length - 1 ?
            (field[options.label_key] + options.delimiter + " ") :
            field[options.label_key] }}
      </span>
    </div>
    <div style="display: grid;" v-else>
      <span>
        <a
          v-for="(link, index) in links"
          v-bind:key="index"
          @click.prevent="handleClick(link)"
        >
          {{ options.delimiter && index > 0 ? (options.delimiter + ' ') : '' }}{{ link[options.label_key] }}
        </a>
      </span>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import EventBus from "@/EventBus";

export default {
  name: "LinkArray",
  props: ["propData", "options"],
  //purpose: added computed property as after change in propData we need to update links and keep component in sync with updated data
  computed: {
    links() {
      const field = _.get(this.propData, "column.field");
      return  field && _.get(this.propData, `row.${field}`);
    },
  },
  methods: {
    handleClick(link) {
      // If options has event key, then emit the event with the data
      if(this.options && this.options.event){
        EventBus.$emit(this.options.event, link[this.options.data]);
        return;
      }       
      this.$router.push(this.options.path + "?id=" + link[this.options.value_key]);
    },
  },
};
</script>
<style lang="scss">
</style>
