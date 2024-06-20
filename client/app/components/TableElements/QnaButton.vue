<template>
<div class="kp-buttons-wrap">
    <div>
            <el-dropdown  v-tooltip v-for="(button, recommendationIndex) in recommendation" class="button" type="primary" split-button>
                 {{button.key}}
                <el-dropdown-menu class="qna-buttons-menu" slot="dropdown">
                        <el-button type="button" class="action-button kp-btn-form-outline" @click="openButtonDialog(recommendationIndex)">Edit</el-button>
                        <el-button type="button" class="action-button kp-btn-form-outline" @click="removeButton(recommendationIndex)">Delete</el-button>
                </el-dropdown-menu>
            </el-dropdown>
    </div>
    <el-button class="kp-btn-form-outline button add-recommendation-button" @click="openButtonDialog(-1)">+ Suggestion</el-button>
    <recommendation-form @save-form-data="saveFormData" :recommendationObject="recommendationObject" @hide="handleDialogClose" :show="showDialog" :index="recommendationIndex" :recommendation="recommendation"></recommendation-form>
</div>
</template>

<script>
import EventBus from "@/EventBus";
import lodash from "lodash";
import {
    VueEditor
} from "vue2-editor";
import Codemirror from "@/components/Codemirror.vue";
import RecommendationForm from "@/components/TableElements/RecommendationForm.vue";
import Json from "@/util/Json"
import Constants from "@/resources/Constants";
import $ from 'jquery'
import tooltip from "@/mixins/tooltip.js";

export default {
    name: "QnaButton",
    components: {
        Codemirror,
        RecommendationForm
    },
    mixins: [tooltip],
    props: ["propData", "options"],
    data() {
        return {
            showDialog: false,
            recommendationIndex: null,
            recommendation: null,
            recommendationObject: null
        }
    },
    watch: {
        propData: {
            handler: function (val, oldval) {
                var fieldName = val.column.field;
                this.recommendation = val.formattedRow[fieldName] ? val.formattedRow[fieldName] : []
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        removeButton(recommendationIndex) {
            this.recommendation.splice(recommendationIndex, 1);
            this.updateDatatable()
        },

        openButtonDialog(index) {
            this.showDialog = true;
            this.recommendationObject = this.recommendation[index]
            this.recommendationIndex = index;
        },

        handleDialogClose() {
            this.showDialog = false
        },
        saveFormData(form) {
            this.recommendationIndex >= 0 ? this.recommendation[this.recommendationIndex] = form : this.recommendation.push(form);
            this.updateDatatable()
        },

        updateDatatable(form) {
            let params = {
                propData: this.propData,
                value: this.recommendation
            }
            this.$emit("onDataUpdate", params);
            this.showDialog = false;
        }
    }
};
</script>

<style lang="scss">
//---------------------class given to td
.qna-buttons {
    // width: 230px;
    // min-width: 200px;
}

.qna-buttons-menu {
    padding-top: 0px;
    padding: 7px;
    padding-bottom: 0px;
        .el-dropdown-menu__item {
            padding:0;
        }
        .el-button {
             width: 100%;
             margin-bottom: 3px;
        }
        .el-button + .el-button {
            margin-left: 0;
        }
}

//----------------------------
.kp-buttons-wrap {
    padding-top: 20px;
    width: 185px;

    .button {
        margin-right: 5px;
        margin-left: 5px;
    }

    .add-recommendation-button {
        width: 144px
    }

    .action-button {
        border: none !important;

    }

    .el-dropdown {
        .el-button-group {
            button:nth-child(1) {
                width: 120px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display:inline-block;
            }
        }

        margin-bottom: 10px;
    }

}



</style>
