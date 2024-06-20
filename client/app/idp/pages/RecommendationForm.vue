<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button class="back-button" cid="form-header-back" icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/recommendations')">
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
      </div>

      <section class="form-page-container" v-loading="loader">
        <div class="panel">
          <div class="panel-body">
            <el-form :model="form" :rules="formRules" ref="form" label-position="left" label-width="150px">

              <el-row :gutter="180">
                <el-col :span="10">
                  <div class="kp-form-group">
                    <el-form-item prop="name" label="Name">
                      <el-input name="name" cid="roles-form-name" v-model="form.name"
                        placeholder="Service Name"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="180">
                <el-col :span="10">
                  <div class="kp-form-group">
                    <el-form-item prop="vdb_name" label="VDB">

                      <el-select v-model="form.vdb_name" class="select-box" cid="roles-form-domains-select" collapse-tags
                        placeholder="Select VDB">
                        <el-option v-for="(_domain, index) in vdbTypes" :cid="'roles-form-domain_' + index"
                          :key="_domain.value" :label="_domain.label" :value="_domain.value"
                          label-width="170px"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>


              <el-row :gutter="180">
                <el-col :span="10">
                  <div class="kp-form-group">
                    <el-form-item prop="embedding_type" label="Embedding Type">
                      <el-select v-model="form.embedding_type" class="select-box" cid="roles-form-domains-select"
                        collapse-tags placeholder="Select Embedding Type">
                        <el-option v-for="(_domain, index) in embeddingType" :cid="'roles-form-domain_' + index"
                          :key="_domain.value" :label="_domain.label" :value="_domain.value"
                          label-width="170px"></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="180">
                <el-col :span="10">
                  <div class="kp-form-group">
                    <el-form-item prop="top_k" label="TopK">
                      <el-input name="top_k" cid="roles-form-name" v-model="form.top_k"
                        placeholder="Top results"></el-input>
                    </el-form-item>
                  </div>
                </el-col>
              </el-row>

              <el-row :gutter="40">
                <el-col>
                  <div class="kp-form-group">
                    Columns
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="40">
                <el-col :span="5">
                  <div class="kp-form-group">
                    <span style="padding: 65px;">Name</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="kp-form-group">
                    <span style="
                      padding: 103px;
                  ">Type</span>
                  </div>
                </el-col>
              </el-row>

              <div class="tab-body" v-for="(option, index) in form.columns" :key="index">
                <el-row :gutter="40">
                  <el-col :span="6">
                    <div class="kp-form-group">
                      <el-form-item label-width="60px">
                        <el-input v-model="option.name" :rows="2" placeholder="Name">
                        </el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="kp-form-group">
                      <el-form-item label-width="60px">
                        <el-select v-model="option.type" name="Type" placeholder="Select column type" filterable
                          @change="handleTemplateChange($event, option)">
                          <el-option v-for="(item, index) in columnsTypes" :cid="'recom-form-column_' + index"
                            :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>

                  <el-col :span="4">
                    <div class="add-chekbox-container">
                      <el-button class="add-remove" type="text" @click="removeColumn(index)"
                        :disabled="form.columns.length == 1">
                        <span class="mdi mdi-delete"></span>
                      </el-button>
                      <el-button class="add-btn" type="primary" @click="addColumn(option)">
                        <span class="mdi mdi-plus"></span>
                      </el-button>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form>
          </div>
          <footer>
            <div></div>
            <div>
              <el-button cid="roles-form-cancel" v-on:click="$router.push('/idp/recommendations')" size="small">
                Cancel
              </el-button>
            </div>
            <div>
              <el-button cid="roles-form-save" id="save-btn" :disabled="disableSave" v-on:click="save" size="small"
                type="primary">
                Save
              </el-button>
            </div>
          </footer>
        </div>
      </section>
    </section>
  </el-main>
</template>
<script>
import RecommendationService from "@/idp/services/RecommendationService";
import Validator from "@/services/Validator";

export default {
  name: "RecommendationForm",
  data() {
    return {
      form: {
        name: "",
        embedding_type: "",
        vdb_name: "",
        top_k: "",
        columns: [{}]
      },
      loader: false,
      pageTitle: "Recommendations Service",
      disableSave: false,
      rules: {},
      vdbTypes: [{ label: "Pinecone", value: "pinecone" }, { label: "Milvus", value: "milvus" }],
      embeddingType: [{
        label: "Universal Encoder",
        value: "universal-encoder"
      }
      ],
      columnsTypes: [{
        label: "Vector",
        value: "vector"
      }, {
        value: "metadata",
        label: "Metadata"
      }
      ],
      formRules: {
        name: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please select name",
          },
          {
            required: true,
            message: "Please provide service name",
            trigger: "blur",
          },
        ],
        embedding_type: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please select name",
          },
          {
            required: true,
            message: "Please provide embedding type",
            trigger: "blur",
          },
        ],
        vdb_name: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please select name",
          },
          {
            required: true,
            message: "Please provide vdb name",
            trigger: "blur",
          },
        ],
        columns: [
          {
            validator: Validator.EmptyValueValidator,
            trigger: "blur",
            message: "Please select name",
          },
          {
            required: true,
            message: "Please provide atleast one column",
            trigger: "blur",
          },
        ]
      },
    };
  },
  methods: {
    async init(recordId) {
      try {
        let brData = await RecommendationService.fetchById(recordId);
        this.form = Object.assign({}, this.form, brData);
      } catch (error) {
        this.notifyError("Error");
      }
    },

    async save() {
      this.disableSave = true;
      this.$setLoader({
        target: "#save-btn",
        spinner: "el-icon-loading",
      });
      let valid = await this.$refs.form.validate().catch((error) => {});
      if (!valid) {
        this.$resetLoader();
        this.disableSave = false;
        return;
      }
      return this.insertRecord();
    },
    addColumn() {
      this.form.columns.push({
        name: "",
        type: ""
      });
    },
    removeColumn(_index) {
      this.form.columns.splice(_index, 1);
    },
    insertRecord() {
      this.loader = true;
      RecommendationService.save(this.form)
        .then((response) => {
          this.$router.push({ path: "/idp/recommendations" });
          this.notifySuccess("Record saved successfully");
        })
        .catch((error) => {
          this.notifyError("Error while processing");
        })
        .finally(() => {
          this.$resetLoader();
          this.loader = false;
          this.disableSave = false;
        });
    },
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree", false);
    this.$store.commit("setDisplayIdpNavbar", true);

    let recordId = this.$route.query.id;
    if (recordId) this.init(recordId);
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";

.accordian-bar-div {
  margin-bottom: 24px;
}

.add-chekbox-container {
  .kp-form-group {
    display: inline-block;
    // width: 109px;
    width: 16%;
    margin-left: .4rem;
  }

  .el-button {
    line-height: 0;
  }

  .add-btn {
    border: 1px solid var(--brand-05);
    padding: 12px 5px;
    line-height: 0;
    margin: 0;
    display: inline-block;
    font-size: 1.1rem;

    vertical-align: middle;
  }

  .add-remove {
    border: 1px solid var(--red-06);
    padding: 12px 5px;
    line-height: 0;
    margin: 0;
    display: inline-block;
    color: var(--red-05);
    font-size: 1.1rem;

    vertical-align: middle;
  }

  .label {
    width: 8rem;
    font-size: var(--font-sm);
    color: var(--dark-04);
    line-height: 220%;
  }
}

.form-page-container {
  .br-list-page-title {
    margin-bottom: 0px;
    margin-left: 17px;
  }

  .fraud-detection-wrap {
    .el-form-item__content {
      margin-left: 2.8rem !important;
    }

    .el-form-item {
      display: flex;
    }

    .el-form-item__label {
      width: 160px !important;
    }
  }

  .fraud_detection_label {
    display: inline-block;
    width: 192px;
    font-size: var(--font-base);
    align-items: center;

    span {
      margin-left: 5px;
      // font-size: 14px;
      color: var(--dark-05);
    }
  }

  .fraud_detection_msg {
    margin-left: 15px;
    font-size: 10px;
    color: rgb(255, 0, 0)
  }
}

.slushbucket_container {

  //   width: 48rem;
  //   height: 36rem;
  //   padding: 2rem;
  .footer_row {
    margin: 16px 0px 016px 16px;
    float: right;
  }

  div.bulk-action:hover {
    cursor: pointer;
  }

  div.bulk-action {
    .select-all {
      padding: 4px;
      background-color: #5a67d8;
    }

    .deselect-all {
      padding: 4px;
      color: #96989a;
      background: white;
      border-radius: 0px;
    }
  }

  ul.list-box {
    li.list-item.active {
      background-color: #5a67d8 !important;
      color: var(--white);
    }

    li.list-item.active:hover {
      background-color: #5a67d8;
      color: var(--white);
    }
  }

  .el-tab-pane {
    font-family: var(--font-family);
    font-size: var(--font-sm);
    font-weight: normal;

    div.clear-search {
      padding: 0px 4px 0px 4px;
      margin: 4px;
      border: 1px solid;
      border-radius: 10px;
      color: #6c757d;
    }

    .list-box-wrapper {
      .list-box-item {
        border-radius: 0px;

        input {
          background-color: var(--dark-07);
          //   height: 2rem;
        }

        input:hover {
          border-radius: 0px;
          border: none;
        }

        &::placeholder {
          font-family: var(--font-family);
          font-size: var(--font-sm);
          font-weight: normal;
        }
      }

      .actions {
        div.btn-action {
          background-color: #5a67d8;
          padding: 0px 4px 0px 4px;

          svg {
            height: 1rem;
            width: 1rem;
          }
        }
      }
    }
  }

  .list-box::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px var(--dark-06);
    background-color: var(--white);
  }

  .list-box::-webkit-scrollbar {
    width: 6px;
    background-color: var(--white);
  }

  .list-box::-webkit-scrollbar-thumb {
    background-color: var(--dark-05);
  }

  .el-tab-pane {
    .el-form-item__content {
      .approver-list-box-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2px 2em;
        align-content: stretch;
        justify-content: space-between;
        justify-items: stretch;
      }
    }
  }
}
</style>
