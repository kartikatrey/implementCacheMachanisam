<template>
  <div class="key-value-input-container">
    <div v-for="(list, index) in keyValueData" v-bind:key="index">
      <div class="input-delete-container">
        <el-input
          class="key-value-input-key"
          @input="handleInput(list, index)"
          v-model="list.key"
        />
        <el-input
          class="key-value-input-value"
          @input="handleInput(list, index)"
          v-model="list.value"
        />
        <el-button
          size="small"
          class="key-value-input-delete-btn"
          v-on:click="removeKeyValue(index)"
        >
          <span class="mdi mdi-delete"></span>
        </el-button>
      </div>
    </div>

    <el-button size="small" v-on:click="addKeyValue" type="primary">
      <i class="mdi mdi-plus"></i> {{ configs.addButtonTitle }}
    </el-button>
  </div>


</template>

<script>
export default {
  name: "KeyValueInput",
  components: {},
  props: ["value", "options"],
  watch: {
    keyValueData: {
      handler: function (newVal, oldval) {
        this.$emit("input", this.keyValueData);
      },
      immediate: true,
      deep: true,
    },
    value: {
      handler: function (newVal, oldval) {
        this.keyValueData = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      keyValueData: [],
      configs: { addButtonTitle: "Add" },
    };
  },
  methods: {
    handleInput(list, index) {
      this.keyValueData.splice(index, 1, list);
    },
    addKeyValue() {
      this.keyValueData.push({});
    },
    removeKeyValue(index) {
      this.keyValueData.splice(index, 1);
      // if(this.keyValueData.length == 0 ){
      //   this.addKeyValue();
      // }
    },
  },
  beforeMount() {
    this.configs = { ...this.configs, ...this.options };
    this.keyValueData = this.value || [{}];
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
.key-value-input-container {
  .input-delete-container {
    display: flex;
    margin-bottom: 0.5rem;
    .key-value-input-key {
      margin-right: 1rem;
    }
    .key-value-input-value {
      margin-right: 3px;
    }
    .key-value-input-delete-btn {
      margin-right: 3px;
      height: 2.42rem;
      border: 1px solid var(--red-07);
      font-size: 1.3rem;
      color: var(--red-05);
      padding: 0 0.6rem;
    }
  }
}
</style>
