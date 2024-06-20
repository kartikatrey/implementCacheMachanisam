<template>
  <div class="idp-table-container">
    <div class="billing-line-header">
      <span class="header-title">{{ title }}</span>

      <span class="header-action">
        <el-button
          size="small"
          :disabled="loading || disableEditMode"
          v-on:click="addLine"
          type="primary"
          v-if="authorizedAccess"
          >Add</el-button
        >
      </span>
    </div>

    <el-table v-loading="loading" :data="data || []" style="width: 100%">
      <component
        v-for="(column, key) in columns || []"
        v-bind:key="key"
        v-bind:is="'el-table-column'"
        v-bind="column"
        v-bind:prop="column.name"
      >
        <template slot-scope="scope">
          <div :class="getCellClass(scope['row'], column.name)">
            <el-tooltip
              effect="light"
              :content="
                getCellError(scope['row'], column.name) || scope['row'][column.name]
              "
              placement="bottom"
              :popper-class="
                !getCellError(scope['row'], column.name) ? 'hidden-tooltip' : ''
              "
            >
              <el-input
                :name="column.name"
                :disabled="column.disabled || disableEditMode"
                v-model="scope['row'][column.name]"
                :type="column.type || 'input'"
                :rows="2"
                :min="0"
                @keyup.native="
                  (event) => {
                    onChange(scope, column.name, event.target.value);
                  }
                "
                @change.native="
                  (event) => {
                    onChange(scope, column.name, event.target.value);
                  }
                "
                :placeholder="column.label"
              >
              </el-input>
            </el-tooltip>
          </div>

          <!-- <component
            v-bind:index="scope.$index"
            v-bind="$props"
            v-bind:data="scope"
            v-bind:options="column.options || {}"
            v-bind:is="column.cell_component || 'Cell'"
          /> -->
        </template>

        <template slot="header" slot-scope="header">
          <component
            v-bind="$props"
            v-bind:data="header"
            v-bind:options="column.options || {}"
            v-bind:is="column.header_component || 'Header'"
          />
        </template>
      </component>

      <el-table-column fixed="right" label="" width="70" v-if="authorizedAccess">
        <template slot-scope="scope">
          <el-button
            :disabled="disableEditMode"
            v-on:click="() => deleteLine(scope)"
            size="mini"
            icon="mdi mdi-delete"
          >
          </el-button>

          <!-- <Actions v-bind="$props" :data="scope" :actions="actions" /> -->
        </template>
      </el-table-column>

      <!-- <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="Type to search" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="(scope.$index, scope.row)=>{}"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="(scope.$index, scope.row)=>{}"
            >Delete</el-button
          >
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import validator from "validator";
import AjaxService from "../../services/AjaxService";

import Cell from "../table/components/Cell.vue";
import Header from "../table/components/Header.vue";

export default {
  name: "BillingLineItems",
  components: { Cell, Header },
  props: ["data", "columns", "loading", "onValueChange", "disableEditMode","authorizedAccess"],
  watch: {
    disableEditMode: {
      handler: function (newVal, oldval) {},
      immediate: true,
      deep: true,
    },
    authorizedAccess: {
      handler: function (newVal, oldval) {},
      immediate: true,
      deep: true,
    },
    data: {
      handler: function (newVal, oldval) {},
      immediate: true,
      deep: true,
    },
    loading: {
      handler: function (newVal, oldval) {},
      immediate: true,
      deep: true,
    },
  },
  computed: {},

  data() {
    return {
      title: "Line Items",
    };
  },
  methods: {
    getCellError(row, columnName) {
      if (row && row._errors && row._errors[columnName]) {
        return row._errors[columnName];
      }
      return null;
    },

    getCellClass(row, columnName) {
      if (row && row._errors && row._errors[columnName]) {
        return "validation-error";
      }
      return "validation-success";
    },

    onChange(scope, columnName, value) {
      this.$emit("onValueChange", scope, columnName, value);
    },

    deleteLine(scope) {
      console.log("scope ", scope);
      console.log("data ", this.data);
      //   const index = _.findIndex(this.data,(r)=>r.$index == );
      this.$emit("onDeleteLine", this.data[scope.$index]);
      this.data.splice(scope.$index, 1);
      this.$emit("onValueChange");
    },
    addLine() {
      this.data = this.data || [];
      let line = {};
      (this.columns || []).map((c) => {
        line[c.name] = "";
      });
      line.lineno = this.data.length + 1;
      this.data.push(line);
    },
    log() {
      console.log(arguments);
    },
  },
};
</script>

<style lang="scss">
@import "../_idpVariables";
div.hidden-tooltip {
  display: none !important;
}

.idp-table-container {
  .validation-error {
    display: inline-flex;
    input {
      background: #fed7d7;
      border-color: red;
    }
  }
  .billing-line-header {
    margin-bottom: 16px;
    .header-title {
      font-weight: 600;
    }
    .header-action {
      float: right;
    }
  }
  .el-table {
    .el-table__fixed-right-patch {
      width: auto !important;
    }

    .el-input__inner {
      height: 2rem !important;
      border-radius: 0 !important;
      width: 16rem !important;
      font-size: 0.857rem !important;
    }
  }
  .el-table {
    font-size: var(--font-base);
    border-radius: var(--radius-base) var(--radius-base) 0px 0px;
  }

  .el-table th {
    background-color: var(--dark-07) !important;
  }

  .el-table thead {
    color: #4a5568;
  }

  .el-button--mini {
    padding: 0px;
    // font-size: 12px;
    border-radius: var(--radius-sm);
    background: inherit;
    border: 0px;
  }

  thead {
    th {
      padding: 0px;
      // font-style: normal;
      font-weight: normal;
      // letter-spacing: 0.02rem;
      font-size: var(--font-base);

      .caret-wrapper {
        margin-left: 0.1rem;
      }
    }
  }

  .el-checkbox__inner {
    border: 1px solid #718096;
    border-radius: var(--radius-sm);
    background-color: inherit;
  }

  tbody {
    td {
      padding: 5px 0;
    }
  }

  .el-table__expand-column {
    .cell {
      padding-left: 0;
      padding-right: 0;
    }
  }

  .el-checkbox__inner {
    border: 1px solid #718096;
    border-radius: var(--radius-sm);
    background-color: inherit;
  }

  tbody {
    td {
      padding: 2px 0;
    }
  }

  tbody {
    tr:nth-child(even) {
      background-color:var(--dark-09) !important;
    }

    tr:nth-child(odd) {
      // background-color: #edf2f7 !important;
      background-color: var(--sub-color1) !important;
    }
  }

  .idp-table-footer-container {
    background: var(--dark-07);
    border-bottom-left-radius: var(--radius-lg);
    border-bottom-right-radius: var(--radius-lg);
    .el-input__inner {
      height: 2rem !important;
      border-radius: 0 !important;
      width: 16rem !important;
      font-size: 0.857rem !important;
    }

    .el-textarea__inner {
      width: 100px;
    }
    .el-input__suffix {
      padding-left: 5px;
    }
    .el-textarea__suffix {
      padding-left: 5px;
    }
    .per-page-title {
      margin-top: var(--space-sm);
      margin-right: var(--space-xs);

      span {
        padding-left: 1.5rem;
        color: #718096;
        font-size: var(--font-sm);
      }
    }

    .per-page-count {
      .el-input {
        line-height: 2.5rem;
        color: #718096;
      }
      .el-textarea {
        line-height: 2.5rem;
        color: #718096;
      }

      input {
        background: inherit;
        border: 0px;
        padding-left: 0px;
        font-size: var(--font-sm);
      }

      textarea {
        background: inherit;
        border: 0px;
        padding-left: 0px;
        font-size: var(--font-sm);
      }

      .el-input__suffix {
        left: 0.5rem;
        line-height: 1rem;
        font-weight: bold;
        color: #718096;
      }

      .el-textarea__suffix {
        left: 0.5rem;
        line-height: 1rem;
        font-weight: bold;
        color: #718096;
      }

      span {
        i {
          font-weight: bold;
          color: #718096;
        }
      }
    }

    .idp-table-pagination {
      text-align: center;

      .el-pagination {
        button {
          background: inherit;
        }

        ul {
          li {
            background: inherit;
            color: #718096;
          }

          .active {
            color: #1dc0fc !important;
          }
        }
      }
    }
  }
}
</style>
