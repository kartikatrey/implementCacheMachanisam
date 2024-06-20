<template>
<!-- product plans -->
<el-row v-loading="loading" id="section2" class="section2 kp-payment-main-content">
    <el-col :span="14">
        <el-radio-group v-model="price_id" size="medium" class="plans">
            <el-row v-for="(plan_Type,key) in product_plans" :key="plan_Type.id" style="margin-bottom: 32px">
                <div class="plan-title">{{key}}</div>
                <el-col class="plan" v-for="plan in plan_Type" :span="7" :key="'one'+plan.id">
                    <el-badge value="Current Plan" class="item" v-bind:class="[current_plan_id == plan.id ? activeClass : '']" type="primary">
                        <div class="plan-card" v-on:click="showPlanDetails(plan)">
                            <span class="plan-card-label1">{{plan.metadata.display_name}}</span>
                            <br />
                            <span class="plan-card-label2">$ {{ plan.unit_amount /100}}/{{plan.recurring.interval}}</span>
                            <el-radio :label="plan.id" class="plan-radio"></el-radio>
                        </div>
                    </el-badge>
                </el-col>
            </el-row>
        </el-radio-group>
    </el-col>
    <el-col :span="10">
        <!-- Products Description-->
        <el-card class="plan-details">
            <div v-if="plan_details" class="text item plan-detils-list-item">
                <div class="plan-details-title">{{plan_details.display_name}} {{plan_details.plan_type}}</div>
                <span v-for="feature in plan_details.features" :key="feature">
                    {{feature}}
                    <br />
                </span>
            </div>
        </el-card>
        <!-- Products Description Ends-->
    </el-col>
</el-row>
</template>

<script>
import _ from "lodash";
import AjaxService from "../services/AjaxService";
import EventBus from "@/EventBus";
import PaymentService from "@/services/PaymentService";

import {
    Loading
} from "element-ui";
export default {
    name: "ProductCatalogue",
    props: ["data", 'showDefault'],

    data() {
        return {
            product_plans: [],
            price_id: "",
            plan_details: {},
            current_plan_id: "",
            activeClass: 'hideBadge',
            loading:false
        };
    },
    methods: {

        showPlanDetails(plan) {
            this.price_id = plan.id;
            this.plan_details = plan.metadata;
            EventBus.$emit("planId", this.price_id);

        },

        getProductPlans() {
            this.loading = true
            PaymentService.getPrices({
                product_code: this.data.product_code || "QNA"
            }).then((response) => {
                this.product_plans = response.prices;

                this.price_id = this.data.current_plan_id ? this.data.current_plan_id : response.default_selected.id;
                this.showDefault ? this.current_plan_id = this.price_id : '';
                this.plan_details = response.default_selected.metadata;
                EventBus.$emit("planId", this.price_id);
            }).catch((error) => {
                console.log("error occured while getting product plans")
                return;
            }).finally(() => {
                this.loading = false
            })

        }

    },
    beforeMount() {
        this.getProductPlans()
    }
};
</script>

<style lang="scss">
.plan-details {
    background: transparent;
    border: 1px solid #bce0fd;
    padding: 16px;
    color: #308cec;
    width: 92%;
    box-shadow: none;
    line-height: 32px;

    .plan-details-title {
        font-weight: bold;
    }
}

.el-loading-spinner {
    margin-top: -7px !important;
}

.kp-register-main-content,
.kp-payment-main-content {

    // margin-top: 62px;
    // margin-bottom: 260px;
    .el-radio__label {
        display: none;
    }

    img {
        width: 75%;
        height: auto;
    }

    .register-form-page-header {
        font-weight: bold;
        font-size: 20px;
        color: #2699fb;
        margin-bottom: 30px;
    }

    .el-form {
        label {
            font-weight: bold;
            color: #2699fb;
        }

        .el-button {
            width: 100%;
            margin-top: 32px;
            font-weight: bold;
        }
    }
}

.kp-payment-main-content {
    .plans {
        .plan-radio {
            float: right;
        }

        .plan-title {
            color: #1975d3;
            font-size: 17.5px;
            font-weight: bold;
            text-transform: capitalize;
            margin-bottom: 6px;
        }

        .plan {
            cursor: pointer;
            background: #1b4877;
            border-radius: 8px;
            margin-right: 12px;
            margin-bottom: 12px;

            &:hover {
                background: #2664a5;
            }

            .plan-card {
                background: transparent;
                margin: 10%;
                color: white;

                &:hover {
                    // background: #2664a5;
                }

                .plan-card-label1 {
                    text-transform: capitalize;
                    font-weight: bold;
                    font-size: 16px;
                }

                .plan-card-label2 {
                    text-transform: capitalize;
                    font-size: 14px;
                }
            }
        }
    }

    .plan-details {
        background: transparent;
        border: 1px solid #bce0fd;
        padding: 16px;
        color: #1b4877;
        width: 90%;
        box-shadow: none;
        line-height: 32px;

        .plan-details-title {
            font-weight: bold;
            font-size: 32px;
            margin-bottom: 20px;
        }
    }

    .el-radio-group {
        display: block;
        line-height: inherit;
        vertical-align: unset;
        font-size: inherit;
    }

    .el-radio__input.is-checked .el-radio__inner {
        border-color: #f7ba2a;
        border-width: 0px;
        background: #f7ba2a;
    }
}

// upload file

// Badge CSS
.el-badge {
    display: inherit;
}

.el-badge__content.is-fixed {
    top: -16px;
    right: 76px;
}

.el-badge__content {
    background-color: #4d8cf4;
}

.hideBadge {
    .el-badge__content.is-fixed {
        display: inherit;
    }
}

.el-badge__content.is-fixed {
    display: none;
}
</style>
