<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <span class="page-title-text">Payment cards</span>
      </div>
      <el-row :gutter="30" class="cardpayment-page-body">
        <el-col v-show="!isEditCard" :span="12">
          <div class="add-card-wrapper">
            <div class="add-card-container">
              <div class="add-card-head">
                <span class="plus-icon">+</span> Add Card
              </div>
              <div class="add-card-body">
                <el-form
                  :model="cc_form"
                  class="add-card-form"
                  id="payment-form"
                  :rules="cardFormRules"
                  ref="cc_form"
                >
                  <el-row>
                    <el-form-item prop="name_on_card">
                      <label for="name">Cardholder name *</label>
                      <el-input
                      cid="payment-card-form-cardholder-name"
                        v-model="cc_form.name_on_card"
                        placeholder="Name on card"
                      ></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row class="card-row">
                    <label for="card-element" class="credit-label"
                      >Credit card *</label
                    >
                    <div id="card-element" cid="payment-card-form-credit-card" class="form-control card-element" :class="cardError ? 'card-errors' : ''">
                      <!-- A Stripe Element will be inserted here. -->
                    </div>
                  </el-row>
                  <el-row>
                    <div id="card-errors" role="alert"></div>
                  </el-row>
                  <el-row>
                    <div class="set-as-default">
                     <el-checkbox cid="payment-card-form-set-default" :disabled="cardsData.length === 0" v-model="defautChecked">Set as default card</el-checkbox>
                    </div>
                  </el-row>
                  <div class="modal-bottom-btns">
                    <el-button cid="payment-card-form-reset" @click="resetCardDetails" size="medium"
                      >Reset</el-button
                    >
                    <el-button
                      id="create-button"
                      cid="payment-card-form-add-card"
                      type="primary"
                      @click="save"
                      :disabled="disable_button"
                      size="medium"
                      >Add card</el-button
                    >
                  </div>
                </el-form>
                <!-- / form-->
              </div>
            </div>
          </div>
        </el-col>
        <!-- / add card -->

        <el-col v-show="isEditCard" :span="12" class="edit-card-animation">
          <div class="add-card-wrapper edit-card-wrapper">
            <div class="add-card-container">
              <div class="edit-card-head"><Span><i class="mdi mdi-pencil"></i> Edit Card</span></div>
              <div class="add-card-body">
                <el-form
                  :model="edit_cc_form"
                  class="add-card-form"
                  id="payment-form"
                  ref="edit_cc_form"
                >
                  <el-row>
                    <el-form-item disabled>
                      <label for="name">Cardholder name</label>
                      <div class="card-name"> <span> {{ edit_cc_form.name }} </span></div>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item disabled>
                      <label for="number">Card number</label>
                      <div class="card-num">
                        **** **** **** {{ edit_cc_form.last4 }}
                      </div>
                    </el-form-item>
                  </el-row>
                  <el-row class="card-row">
                    <el-row :gutter="20">
                      <el-col :span="12" class="expiry-month">
                        <span class="edit-dialog-label">Expiry month</span>
                        <el-select
                          class="config-value"
                          v-model="exp_month"
                          cid="payment-card-form-expiry-month-select"
                          placeholder="Select expiry month"
                        >
                          <el-option
                            v-for="(item,index) in month_list"
                            :cid="'payment-card-form-expiry-month_'+index"
                            v-bind:value="item"
                            :key="item"
                            :label="item"
                          ></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12">
                        <span class="edit-dialog-label">Expiry year</span>
                        <el-select
                          class="config-value"
                          v-model="exp_year"
                          placeholder="Select expiry month"
                        >
                          <el-option
                            v-for="item in year_list"
                            v-bind:value="item"
                            :key="item"
                            :label="item"
                          ></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-row>
                  <div class="modal-bottom-btns">
                    <el-button @click="cancelCardUpdate">Cancel</el-button>
                    <el-button
                      id="create-button"
                      type="primary"
                      cid="payment-card-form-cancel"
                      @click="update"
                      :disabled="disable_button"
                      >Update card</el-button
                    >
                  </div>
                </el-form>
                <!-- / edit form-->
              </div>
            </div>
          </div>
        </el-col>
        <!-- / edit card -->

        <el-col :span="10">
          <div class="used-card-wraper">
            <h3 v-if="cardsData.length">Payment methods used</h3>
            <div
              v-for="(cardData, i) in cardsData"
              :key="i"
              class="used-card-container"
            >
              <el-card
                class="box-card uded-card"
                :class="cardData.is_default ? 'active-card' : ''"
              >
                <div slot="header" class="clearfix">
                  <img class="card-type" :src="getBrandIconUrl(cardData.brand)" :alt="cardData.brand"/>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Set as default"
                    placement="top-start"
                  >
                    <el-checkbox
                      style="float: right; padding: 3px 0"
                      cid="payment-card-form-set-default"
                      v-model="cardData.is_default"
                      :disabled="cardData.is_default"
                      @change="confirmAndSetDefaultCard(cardData.id)"
                    ></el-checkbox>
                  </el-tooltip>
                </div>
                <div class="card-num">**** **** **** {{ cardData.last4 }}</div>
                <div class="card-footer">
                  <div class="card-name"><span>{{ cardData.name }}</span></div>
                  <div class="valid">
                    <span> VALID </span> {{ cardData.exp_month }}/{{
                      cardData.exp_year
                    }}
                  </div>
                </div>
              </el-card>
              <div class="action">
                <el-button
                  class="btn-edit"
                  type="text"
                  v-on:click="editCard(cardData)"
                >
                  <i class="mdi mdi-pencil"></i> Edit
                </el-button>
                <el-button
                  class="btn-delete"
                  type="text"
                  :disabled="disbale_remove_btn"
                  v-on:click="deleteCard(cardData.id)"
                >
                  <i class="mdi mdi-delete"></i>Remove
                </el-button>
              </div>            
            </div>
          </div>
        </el-col>
        <!-- / used card  -->
      </el-row>
    </section>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";
import { getCardBrandIconUrl } from "@/util/CommonUtil";
import PaymentService from "@/idp/services/PaymentService";
import Constants from "@/resources/Constants";
import _ from "lodash";
const stripe = Stripe(Constants.PAYMENT_PUBLISHABLE_KEY);

export default {
  name: "PaymentCard",
  components: {
    DataTable,
  },
  data() {
    return {
      card: "",
      defautChecked: false,
      cardsData: [],
      cardError: false,
      disable_button: false,
      disbale_remove_btn: false,
      cc_form: {
        name_on_card: "",
      },
      isEditCard: false,
      edit_cc_form: {},
      cardFormRules: {
        name_on_card: [
          {
            required: true,
            message: "Please enter name on card",
            trigger: "blur",
          },
        ],
      },
      card_id: "",
      exp_month: "",
      exp_year: "",
      month_list: "",
      year_list: [],
    };
  },
  watch: {
    cardsData: {
      handler(newVal, oldVal) {
        this.defautChecked = (newVal.length === 0);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getBrandIconUrl(cardBrand) {
        return getCardBrandIconUrl(cardBrand)
    },
    resetCardError(){
      let displayError = document.getElementById("card-errors");
      displayError.textContent = "";
      this.cardError=false
    },
    resetCardDetails() {
      this.cc_form.name_on_card = "";
      this.disable_button = false;
      this.defautChecked = false;
      this.resetCardError();
      this.mountCardElement();
      this.getSavedCards();
    },
    async getSavedCards() {
      const savedCards = await PaymentService.getCardsList();
      if (!savedCards.status) {
        this.notifyError(savedCards.data.message);
        return;
      }
      this.cardsData = savedCards.data;
    },
    mountCardElement() {
      let style = {
        base: {
          "::placeholder": {
            color: "#A0AEC0",
            fontWeight: "400",
            fontSize: "14px",
            fontFamily: "Segoe UI, Open Sans,  sans-serif",
          },
          backgroundColor: "#E2E8F0",
          lineHeight: "40px",
          fontWeight: "400",
          color: "#2D3748",
          fontSize: "14px",
          fontFamily: "Segoe UI, Open Sans,  sans-serif",
        },
      };
      var elements = stripe.elements();
      this.card = elements.create("card", {
        hidePostalCode: true,
        style: style,
      });
      this.card.mount("#card-element");
      this.card.addEventListener("change", (event) => {
        if(event.error){
          let displayError = document.getElementById("card-errors");
          displayError.textContent = event.error.message;
          this.cardError=true;
        }
        else this.resetCardError();
      });
    },

    async save() {
      this.$refs.cc_form.validate((valid) => {
        if (!valid) return;
        this.disable_button = true;
        stripe
          .createToken(this.card, {
            name: this.cc_form.name_on_card,
          })
          .then(async (result) => {
            let errorElement = document.getElementById("card-errors");
            if (!result.token) {
              errorElement.textContent = result.error.message;
              this.disable_button = false;
              return;
            }
            let addCardRes = await PaymentService.addCard(result.token);
            if (!addCardRes.data.status) {
              errorElement.textContent = addCardRes.data.message;
              this.disable_button = false;
              return;
            }
            this.notifySuccess("Card added successfully");
            if (this.defautChecked)
              await this.setDefaultCard(addCardRes.data.card_id);
            this.resetCardDetails();
          });
      });
    },

    update() {
      const payload = {};
      this.disable_button = true;
      payload.exp_month = this.exp_month;
      payload.exp_year = this.exp_year;
      payload.card_id = this.edit_cc_form.id;
      PaymentService.updateCardDetails(payload)
        .then((response) => {
          if (!response.data.status) {
            this.notifyError(response.data.message);
            return;
          }
          this.notifySuccess("Card updated successfully");
          this.isEditCard = false;
          this.edit_cc_form = {};
          this.resetCardDetails();
        })
        .catch((error) => {
          this.notifyError("Error occured while updating card");
        });
    },

    initCardDetails() {
      this.month_list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      let now = new Date().getUTCFullYear();
      for (let index = 0; index < 20; index++) {
        this.year_list.push(now++);
      }
    },

    async deleteCard(card_id) {
      const recordCount = this.cardsData.length;
      const message =
        recordCount > 1
          ? "Are you sure want to delete card?"
          : "You must have atleast one card. Are you sure want to delete this card?";
      const confirmRes = await this.$confirm(message, "Delete Card", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).catch((err) => {});
      if (!confirmRes) return;
      this.disbale_remove_btn = true;
      const deleteCardRes = await PaymentService.deleteCard({ id: card_id });
      if (!deleteCardRes.data.status) {
        this.notifyError(deleteCardRes.data.message);
        this.disbale_remove_btn = false;
        return;
      }
      await this.getSavedCards();
      this.notifySuccess("Card deleted successfully!");
      this.disbale_remove_btn = false;
    },

    async confirmAndSetDefaultCard(card_id) {
      const message = "You sure want to set selected card as default?";
      const confirmRes = await this.$confirm(message, "Set card as default", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      }).catch((err) => {});
      this.getSavedCards();
      if (!confirmRes) return;
      await this.setDefaultCard(card_id);
    },

    async setDefaultCard(card_id) {
      const payload = { card_id };
      const defaultCardRes = await PaymentService.addDefaultCard(
        JSON.stringify(payload)
      );
      if (!defaultCardRes.data.data.status) {
        this.notifyError(defaultCardRes.data.message);
        return;
      }
      await this.getSavedCards();
      this.notifySuccess("Card set as default successfully");
    },

    cancelCardUpdate(){
        this.isEditCard = false;
        this.edit_cc_form = {};
        this.resetCardDetails();
    },

    editCard(card_data) {
      this.edit_cc_form = _.cloneDeep(card_data);
      this.isEditCard = true;
      this.exp_month = this.edit_cc_form.exp_month;
      this.exp_year = this.edit_cc_form.exp_year;
    },

    registerEvents() {
      EventBus.$on("downloadInvoice", (propData) => {
        const data = propData.row;
        this.downloadInvoice(data);
      });
    },
  },

  mounted() {
    this.mountCardElement();
    this.getSavedCards();
  },

  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    this.registerEvents();
    this.initCardDetails();
  },
  beforeDestroy() {
    EventBus.$off(["downloadInvoice"]);
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
.cardpayment-page-body {
  margin-top: var(--space-lg);
}
.add-card-wrapper {
  background: var(--dark-09);
  padding: var(--space-xxl);
  border-radius: var(--radius-lg);

  .add-card-container {
    background: var(--white);
    padding: var(--space-xl);
    border-radius: var(--radius-lg);
    padding: 3rem 3.5rem;
    box-shadow: rgba(17, 12, 46, 0.05) 0px 48px 100px 0px;

    .add-card-head {
      font-weight: 500;
      color: var(--dark-03);
      font-size: var(--font-lg);
      border-bottom: 0.134rem dashed var(--dark-06);
      padding-bottom: 1rem;
      margin-bottom: 2rem;
      .plus-icon {
        font-size: 1.8rem;
      }
    } // add card head

    .add-card-body {
      .add-card-form {
        #card-errors{
            color: #F82533;
            line-height: 24px;
        }
        .card-errors{
          border: 1px solid #F82533 !important;
        }
        .card-element{
          padding: 0px 15px;
          background: var(--dark-07);
          border-radius: 0.3rem;
          border: 1px solid #dcdfe6;
        }
        .credit-label {
          display: block;
          margin-bottom: 0.7rem;
          color: var(--dark-04);
          font-size: var(--font-md);
        }
        .el-form-item__content {
          line-height: 36px;
          .el-input {
            margin: 0;
            .el-input__inner {
              height: 40px;
              background: var(--dark-07);
              color: var(--dark-01);
              &::placeholder {
                color: var(--dark-05);
              }
            }
          }
          label {
            color: var(--dark-04);
            font-size: var(--font-md);
          }
          .el-form-item__error {
            line-height: 2rem;
          }
        }
        .set-as-default {
          margin-top: 2rem;
          margin-left: 1rem;
          .el-checkbox__inner {
            border-radius: 100px;
            border: var(--dark-05) 1px solid;
          }
          .el-checkbox__input {
            vertical-align: text-top;
          }
          .el-checkbox__label {
            color: var(--dark-01);
            font-weight: 400;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: var(--brand-04);
            border-color: var(--brand-04);
          }
        }
      } // add card form
    } // add card body

    .modal-bottom-btns {
      text-align: left;
      padding-top: 4rem;
    }
  } // end add card container
} // end add card wrapper

// .add-card-container {
//    animation-name: bounce-7;
//         animation-timing-function: cubic-bezier(0.280, 0.840, 0.420, 1);
// }

//     @keyframes bounce-7 {
//         0%   { transform: scale(1,1)      translateY(0); }
//         10%  { transform: scale(1.1,.9)   translateY(0); }
//         30%  { transform: scale(.9,1.1)   translateY(-100px); }
//         50%  { transform: scale(1.05,.95) translateY(0); }
//         57%  { transform: scale(1,1)      translateY(-7px); }
//         64%  { transform: scale(1,1)      translateY(0); }
//         100% { transform: scale(1,1)      translateY(0); }
//     }



// @keyframes shake {
// 	0%, 100% {transform: translateX(0); }
// 	10%, 50% {transform: translateX(-14px);}
// 	30%, 70%, 80% {transform: translateX(10px);}
// }

@keyframes shake {
	 0%   { transform: scale(1,1)}
	50%  { transform: scale(1.05,1.05) }
	100% { transform: scale(1,1)    }

}


.edit-card-wrapper {
 animation: shake .3s ease;
 border: solid 0.14rem var(--dark-06) !important;

     
  .edit-card-head {
    font-weight: 500;
    color: var(--brand-04);
    font-size: var(--font-lg);
    border-bottom: 0.134rem dashed var(--dark-06);
    padding-bottom: 1rem;
    margin-bottom: 2rem;
    span {
      animation: colorHead .8s ease;
    }
    
    .plus-icon {
      font-size: 1.8rem;
    }
  } // add card head


// @keyframes colorHead {
// 	0%, 100% {transform: translateX(0); }
// 	10%, 50% {transform: translateX(-12px);}
// 	30%, 70%, 80% {transform: translateX(10px);}
// }

@keyframes colorHead {
	 0%   { transform: scale(1,1)}
	50%  { transform: scale(1.05,1.05) }
	100% { transform: scale(1,1)    }
}




  .card-name,
  .card-num {
    height: 40px;
    background: var(--dark-07);
    color: var(--dark-01);
    border-radius: 0.3rem;
    border: 1px solid #dcdfe6;
    line-height: 40px;
    padding-left: 1rem;
    color: var(--dark-05);
    font-size: var(--font-md);
    opacity: 0.7;
    cursor: no-drop;
  }
  .edit-dialog-label {
    margin-bottom: 0.7rem;
    color: var(--dark-04);
    font-size: var(--font-md);
    display: block;
  }
  .config-value {
    .el-input__inner {
      height: 40px;
      background: var(--dark-07);
      color: var(--dark-01);
      border-radius: 0.3rem;
      border: 1px solid #dcdfe6;
      line-height: 40px;
      padding-left: 1rem;
      color: var(--dark-01);
      font-size: var(--font-md);
    }
  }
} // end edit card wrapper

.used-card-wraper::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px var(--dark-06);
  background-color: var(--white);
}

.used-card-wraper::-webkit-scrollbar {
  width: 6px;
  background-color: var(--white);
}

.used-card-wraper::-webkit-scrollbar-thumb {
  background-color: var(--dark-05);
}
// .used-card-wraper:hover {
//   overflow: auto;
// }
.used-card-wraper {
  overflow-x: auto;
  max-height: 513px;
  padding-right: 2rem;
  padding-left: .5rem;
  h3 {
    font-weight: 500;
    color: var(--dark-03);
    font-size: var(--font-lg);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }

  // .used-card-container:hover {
  //           .action {
  //             display: block;
  //             margin-top: 0;
  //               -webkit-animation: slide-down 1.3s ease-in-out;
  //               -moz-animation: slide-down 1.3s ease-in-out;
  //                transition: all ease-in-out .2s;
  //           }
  //       }
  .action {
    transition: all ease-in-out 0.2s;
    margin-left: 2rem;
    .btn-delete {
      color: var(--red-04);
    }
    .btn-edit {
      color: var(--dark-03);
    }
  }
  // @-webkit-keyframes slide-down {
  //     0% {
  //         opacity: 0;
  //     }
  //     100% {
  //         opacity: 1;
  //     }
  // }

  // @-moz-keyframes slide-down {
  //     0% {
  //         opacity: 0;
  //     }
  //     100% {
  //         opacity: 1;
  //     }
  // }

  .used-card-container {
    margin-bottom: 2rem;
    .active-card {
      box-shadow: rgba(102, 126, 234, 0.2) 0px 8px 24px !important;
      border: dashed 0.14rem var(--brand-05) !important;
    }
    .uded-card {
      transition: all ease-in-out 0.2s;
      padding: 1.5rem;
      box-shadow: rgba(149, 157, 165, 0.1) 0px 8px 24px;
      border: 1px solid var(--dark-08);
      .el-card__header {
        padding: 0;
        border: 0;
        .card-type {
           transform: scale(2);
               margin: 1rem;
        }
        .el-checkbox {
          cursor: pointer;
          .el-checkbox__inner {
            border-radius: 100px;
            border: var(--dark-05) 1px solid;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: var(--brand-04);
            border-color: var(--brand-04);
          }
        } // check box
      }
      .el-card__body {
        padding: 0;
        .card-num {
          margin-top: .8rem;
          color: var(--dark-02);
          font-size: var(--font-pagetile);
        }
        .card-footer {
          margin-top: 4rem;
          display: flex;
          justify-content: flex-end;
          .card-name {
            margin-left: 0;
            margin-right: auto;
            color: var(--dark-02);
            font-size: var(--font-pagetile);
              span {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: block;
                width: 290px;
              }
              
          }
          .valid {
            color: var(--dark-02);
            font-size: var(--font-pagetile);
            span {
              color: var(--dark-05);
              font-size: var(--font-md);
              display: inline-block;
              margin-right: 1rem;
            }
          }
        }
      }
    } // used card
  } // used card container
}
</style>