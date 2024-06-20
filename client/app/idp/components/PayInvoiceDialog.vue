<template>
  <div>
    <el-dialog
      custom-class="pay-dialog"
      class= "payment-list-wrapper"
      :class="getClassBasedonCards()"
      :append-to-body="true"
      title="Pay information"
      :visible.sync="payDialogVisible"
      :close-on-click-modal="false"
      center
      element-loading-spinner="el-icon-loading"
    >
    <el-dialog
        width="20%"
        title="Payment response"
        :visible.sync="paymentResVisible"
        append-to-body>
        <div class="response-container failed" v-if="!paymentStatus">
            <i class="mdi mdi-close-circle"></i>
            <h1>Payment failed</h1>
            <p v-html="paymentResponse"></p>
            <el-button  size="small" @click="tryAgain">Try again</el-button>
             <el-button
                @click="paymentResVisible = false"
                clear
                type="text"
                class="mdi mdi-close btn-close"
                ></el-button>
        </div>
        <div class="response-container success" v-if="paymentStatus">
            <i class="mdi mdi-checkbox-marked-circle"></i>
            <h1>Payment successful</h1>
            <p>{{paymentResponse}}</p>
            <el-button size="small" @click="paymentResVisible = false">Done</el-button>
        </div>
      
    </el-dialog>
      <div class="header">
        <span>Payment information</span>
        <el-button
          @click="closeDialog()"
          clear
          type="text"
          class="mdi mdi-close"
        ></el-button>
         
      </div>
      <div class="payment-inner-body">
        <div class="card-list">
          <el-card class="box-card uded-card" :class="cardData.is_default ? 'active-card' : ''" v-for="(cardData, i) in cardsData" :key="i">
            <div class="inner" @click="onCardselect(cardData.id)">
            <div slot="header" class="card-top">
              <img class="card-type" :src="getBrandIconUrl(cardData.brand)" :alt="cardData.brand"/>
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
            </div>
          </el-card>
         </div><!-- card list -->

        <div class="addcard">
          <el-button @click="addCard">
            <i class="mdi mdi-plus"></i>
            Add Card
          </el-button>
        </div>
       
      </div>
      <div class="pay-btn">
        <el-button type="primary" :disabled="disablePayBtn" @click="payInvoice"> Pay Now - ${{invoiceTotal}} </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import { getCardBrandIconUrl } from "@/util/CommonUtil";
import PaymentService from "@/idp/services/PaymentService";

export default {
  name: "PayDialog",
  props: ["payDialogVisible", "invoiceNo", "invoiceTotal", "invoiceStatus"],
  data() {
    return {
      cardsData: [],
      disablePayBtn: false,
      paymentResVisible: false,
      paymentStatus: null,
      paymentResponse: "",
      selectedCard: ""
    };
  },
  watch: {
    payDialogVisible: {
      handler: function (val, oldval) {
        if (!val) {
          this.resetDialog();
          return;
        }
        this.$nextTick(() => {
          this.$setLoader({
            target: ".pay-dialog > .el-dialog__body",
            spinner: "el-icon-loading",
          });
        });
        this.getSavedCards();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getClassBasedonCards(){
      if(this.cardsData.length === 0) return 'no-card-dialog';
      if(this.cardsData.length === 1) return 'single-card-dialog';
      return '';
    },
    onCardselect(cardId){
        this.selectedCard = cardId;
        let defaultCard = _.find(this.cardsData, {is_default: true})
        defaultCard.is_default = false;
        let selectedCard = _.find(this.cardsData, {id: cardId})
        selectedCard.is_default = true;
    },
    tryAgain(){
        this.payInvoice();
        this.paymentResVisible = false;
    },
    async payInvoice() {
        this.$nextTick(() => {
            this.$setLoader({
            target: ".pay-dialog > .el-dialog__body",
            spinner: "el-icon-loading",
            });
        });
      this.disablePayBtn = true;
      const payload = { invoice_no: this.invoiceNo, cardId: this.selectedCard};
      const paymentResponse = await PaymentService.createPaymentIntent(payload);
      this.paymentResVisible = true;
      if (!paymentResponse.data.status) {
        this.$resetLoader();
        this.paymentStatus = false;
        this.paymentResponse = paymentResponse.data.message;
        this.disablePayBtn = false;
        return;
      }
      this.$resetLoader();
      this.paymentStatus = true;
      this.paymentResponse = `Payment of $${this.invoiceTotal} completed successfully.`
      this.$emit("markPaid", {notify: false});
      this.closeDialog();
    },
    addCard(){
        this.$router.push({ path: "/idp/payment-cards" });
    },
    closeDialog(){
      this.$emit("hide");
    },
    resetDialog() {
      this.cardsData = [];
    },
    getBrandIconUrl(cardBrand) {
        return getCardBrandIconUrl(cardBrand)
    },
    async getSavedCards() {
      const savedCards = await PaymentService.getCardsList();
      if (!savedCards.status) {
        this.notifyError(savedCards.data.message);
        return;
      }
      this.cardsData = savedCards.data;
      this.$resetLoader();
    },
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables";

.pay-dialog {
    padding: var(--space-lg) !important;
}

.payment-inner-body {
  display: flex;
  padding: 1rem;
}


 .single-card-dialog {
     .el-dialog {
          max-width: 645px !important;
     }
       
  }

.no-card-dialog {
   .el-dialog {
          max-width: 400px !important;
            .card-list {
              // display: none !important;
              padding: 0 !important;
            }
            .addcard {
              width: 100%;
              margin: 10px 0 0 0 !important;
                .el-button {
                  height: 120px !important;
                  width: 228px;
                }
            }
     }
}

.payment-list-wrapper {

   
  .el-dialog {
    padding: 0 !important;
    overflow: hidden;
    min-width: 20%;
    // max-width: 63%;
    // max-width: 990px;
      max-width: 1014px;
    width: auto;
    border-radius: 0.5rem;
    .el-dialog__body {
      text-align: center;
      .header {
        display: flex;
        justify-content: flex-end;
        background: var(--dark-09);
        // border-bottom: 1px solid #e0d4d4;
        padding: 0.7rem 2rem;
        font-weight: 500;
        span {
          margin-left: 0;
          margin-right: auto;
          color: var(--dark-01);
        }
        .el-button {
          padding: 3px;
          color: var(--dark-03);
          font-size: 1.4rem;
        }
      } 
      .pay-btn {
        padding: 2rem 0 3rem 0;    
        .el-button {
          font-size: 1.3rem;
        }
      }
    }
  }
}
.addcard {
  display: inline-block;
  // margin-left: 2rem;
  margin-top: 1.5rem;
  margin-left: 2rem;
  .el-button {
    height: 86%;
    width: 158px;
    background: var(--dark-08);
    border: 1px solid #667eea;
    border-radius: 5px;
    text-align: center;
    font-size: 1.3rem;
    i {
      display: block;
      font-size: 1.8rem;
      font-size: 3rem;
      line-height: 4rem;
    }
  }
}
.card-list {
  white-space: nowrap;
  display: inline-block;
  overflow: auto;
  padding: 2rem 2rem 2.5rem 1.5rem;
  min-width: 0px;
  // max-width: 720px;
  max-width: 754px;
  // &:hover {
  //   overflow: auto;
  // }
  .uded-card {
    transition: all ease-in-out 0.2s;
    padding: 1.5rem;
    box-shadow: rgba(149, 157, 165, 0.1) 0px 8px 24px;
    border: 1px solid var(--dark-07);
    display: inline-block;
    width: 320px;
    margin-right: 1.5rem;
   
   
    .el-card__body {
      padding: 0;
       .inner {
          
                .card-top {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 2rem;
                    margin-top: .5rem;
                        .card-type {
                                transform: scale(1.8);
                                margin: .5rem;
                                margin: 0 auto 0 1rem;
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

                } // card top
                
            
    } // inner
      .card-num {
        margin-top: 0.8rem;
        color: var(--dark-02);
        font-size: var(--font-pagetile);
        text-align: left;
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
                width: 174px;
                text-align: left;
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
  .active-card {
    box-shadow: rgba(102, 126, 234, 0.3) 0px 8px 24px !important;
    border: dashed 0.14rem var(--brand-05) !important;
  }
}
.card-list::-webkit-scrollbar-track {
  background-color: var(--white);
}

.card-list::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  background-color: var(--white);
}

.card-list::-webkit-scrollbar-thumb {
  background-color: var(--dark-05);
  border-radius: 100px;
}

.response-container.failed {
    i,h1 {
        color: var(--red-05);
    }
    .el-button {
        background: var(--red-05);
    }
    .btn-close {
       font-size: 1.3rem;
    top: 0;
    padding: 3px;
    margin: 0;
    background: transparent;
    right: 0;
    position: absolute;
    color: var(--dark-05) !important;

    }
}
.response-container.success {
    i,h1 {
        color: var(--green-05);
    }
    .el-button {
        background: var(--green-05);
    }
}

.response-container {
    text-align:center;
      position: relative;
    i {
        color:var(--green-05);
        display: block;
        margin-bottom: var(--space-sm);
        font-size: 3.2rem;
        padding: 0;
        margin: 0;
    }
    h1 {
        font-weight:400;
        margin-bottom: var(--space-sm);
        font-size:1.5rem;
        margin: 0;
    }
    p {
        color:var(--dark-04);
        margin: 0;
    line-height: 1.8rem;
    }
    .el-button {
        color:var(--white) !important;
        font-size:var(--font-base);
        margin-bottom: var(--space-base);
        margin-top:  var(--space-lg);
    }
}
</style>