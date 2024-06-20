<template>
  <span>
    <a :cid="cid" @click.prevent="handleClick($event)" v-bind:class="[is_disable ? 'anchor-disabled' : '']">{{ value }}</a>
  </span>
</template>

<script>
import EventBus from "@/EventBus";

export default {
  name: "Link",
  props: ["data", "options"],
  watch: {
    "data.row.state": {
      handler: function (newVal, oldval) {
        if (newVal != oldval) this.disableLink();
      },
      deep: true,
    },
  },
  data() {
    return { columnName: null, row: null, value: "",is_disable:false };
  },
  computed: {
    cid(){
      let columnName =
        this.data && this.data["column"] && this.data["column"]["property"];
      let row = this.data && this.data["row"];
      return `idp-row-${columnName}_${this.data.$index}`
    },
  },
  methods: {
    handleClick() {
      EventBus.$emit(this.options.eventName, this.data.row);
    },
    disableLink(){
      let result=false;
        for(const key of this.options.disableCheckKey){
        result=this.options.disableValues[key] &&
        this.options.disableValues[key].includes(
          this.data.row[key]
        )
        if(result){
          break;
        }
      }
      this.is_disable=result
    },
    
  },
  beforeMount() {
    this.columnName =
      this.data && this.data["column"] && this.data["column"]["property"];
    this.row = this.data && this.data["row"];
    this.value = this.row[this.columnName];
    this.disableLink()
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.anchor-disabled{
  pointer-events:none; 
    opacity:0.6;
}
</style>
