<template>
  <el-main class="kp-main">
    <section class="page-body billing-invoice-body" v-if="form">
      <div class="page-title" v-if="form && form._id">
        <el-button
          v-on:click="$router.push('/idp/billing/list')"
          icon="mdi mdi-arrow-left-circle-outline"
        ></el-button>
        <span class="page-title-text"
          >{{ authorizedAccess ? "Edit" : "View" }} {{ pageTitle }}</span
        >
      </div>

      <div class="page-title" v-if="!form || !form._id">
        <el-button
          v-on:click="$router.push('/idp/billing/list')"
          icon="mdi mdi-arrow-left-circle-outline"
        ></el-button>
        <span class="page-title-text"
          >{{ authorizedAccess ? "Add" : "View" }} {{ pageTitle }}</span
        >
      </div>

      <section class="form-page-container" v-loading="loading">
        <div class="panel">
          <el-steps v-if="authorizedAccess" :active="getActiveStage()" style="padding: 2rem 12rem">
            <el-step
              :key="key"
              v-for="(stage, key) in stages"
              :title="stage.title"
              :icon="stage.icon || 'el-icon-edit'"
            ></el-step>
          </el-steps>

          <div class="panel-body" v-if="authorizedAccess">
            <el-form
              label-position="left"
              :model="form"
              :rules="formRules"
              ref="form"
              label-width="150px"
            >
              <div class="tab-body">
                <el-row :gutter="20">
                  <el-col :span="10">
                    <div class="kp-form-group">
                      <el-form-item prop="customer_id" label="Customer name">
                        <span>{{ customerName }}</span>
                      </el-form-item>
                    </div>
                  </el-col>

                  <el-col :span="10">
                    <div class="kp-form-group billing-month-selection">
                      <el-form-item prop="month" label="Billing month">
                        <el-col :span="3" class="billing-month-select">
                          <el-select
                            filterable
                            name="month"
                            :disabled="disableEditMode || !authorizedAccess"
                            v-model="form.month"
                            @change="computeLines"
                            placeholder="Select month"
                          >
                            <el-option
                              v-for="(month, k) in months"
                              :key="k"
                              :label="month.label"
                              :value="month.value"
                            ></el-option>
                          </el-select>
                        </el-col>

                        <el-col :span="3" class="billing-year-select">
                          <el-select
                            filterable
                            name="year"
                            :disabled="disableEditMode || !authorizedAccess"
                            v-model="form.year"
                            @change="computeLines"
                            placeholder="Select year"
                          >
                            <el-option
                              v-for="(year, k) in years"
                              :key="k"
                              :label="year.label"
                              :value="year.value"
                            ></el-option>
                          </el-select>
                        </el-col>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="10">
                    <div class="kp-form-group">
                      <el-form-item prop="invoice_no" label="Invoice#">
                        <el-input
                          name="invoice_no"
                          v-model="form.invoice_no"
                          type="input"
                          :disabled="disableEditMode || !authorizedAccess"
                          :rows="2"
                          placeholder="Invoice number"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>

                  <el-col :span="10">
                    <div class="kp-form-group">
                      <el-form-item prop="order_no" label="Order number">
                        <el-input
                          name="order_no"
                          :disabled="disableEditMode || !authorizedAccess"
                          v-model="form.order_no"
                          type="input"
                          :rows="2"
                          placeholder="Order number"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="10">
                    <div class="kp-form-group">
                      <el-form-item prop="invoice_date" label="Invoice date">
                        <el-input
                          name="invoice_date"
                          :disabled="disableEditMode || !authorizedAccess"
                          v-model="form.invoice_date"
                          type="date"
                          :rows="2"
                          @input="handleInvoiceDateInput"
                          placeholder="Invoice date"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>

                  <el-col :span="10">
                    <div class="kp-form-group">
                      <el-form-item prop="due_date" label="Due date">
                        <el-input
                          name="due_date"
                          :disabled="disableEditMode || !authorizedAccess"
                          v-model="form.due_date"
                          type="date"
                          :rows="2"
                          placeholder="Due date"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="10">
                    <div class="kp-form-group">
                      <el-form-item prop="pageCount" label="Page count till date :">
                        <el-input
                          name="pageCount"
                          disabled
                          v-model="totalPages"
                          :rows="2"
                          placeholder="Page count"
                        ></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="24">
                    <section class="form-page-container line-item-section">
                      <BillingLineItems
                        v-bind="lineConfig"
                        :disableEditMode="disableEditMode || !authorizedAccess"
                        @onValueChange="onLineValueChanged"
                        @onDeleteLine="onDeleteLine"
                        :authorizedAccess="authorizedAccess"
                      />
                    </section>
                  </el-col>
                </el-row>

                <div class="invoice-form-footer_fields-container">
                  <div class="invoice-form-footer_fields">
                    <el-row :gutter="20">
                      <el-col :span="16">{{ " " }}</el-col>
                      <el-col :span="6">
                        <div class="kp-form-group">
                          <el-form-item prop="subtotal" label="Sub total">
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :span="2" class="footer-label">
                        <span>${{ form.subtotal || 0 }}</span>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="16">{{ " " }}</el-col>
                      <el-col :span="6">
                        <div class="kp-form-group discount">
                          <el-form-item prop="discount" label="Discount($)">
                            <el-input
                              name="discount"
                              :disabled="disableEditMode || !authorizedAccess"
                              v-model="form.discount"
                              type="number"
                              :rows="2"
                              :min="0"
                              @keyup.native="onDiscountChange"
                              @change.native="onDiscountChange"
                              placeholder="Discount"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :span="2" class="footer-label">
                        <span>${{ form.discount || 0 }}</span>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20">
                      <el-col :span="16">{{ " " }}</el-col>
                      <el-col :span="6">
                        <div class="kp-form-group tax">
                          <el-form-item prop="tax_percent" label="Tax(%)">
                            <el-input
                              name="tax_percent"
                              v-model="form.tax_percent"
                              type="number"
                              :disabled="disableEditMode || !authorizedAccess"
                              :rows="2"
                              :min="0"
                              @keyup.native="onTaxChange"
                              @change.native="onTaxChange"
                              placeholder="Tax percentage"
                            ></el-input>
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :span="2" class="footer-label">
                        <span>${{ form.tax || 0 }}</span>
                      </el-col>
                    </el-row>

                    <el-row :gutter="20" class="total-field">
                      <el-col :span="16">{{ " " }}</el-col>
                      <el-col :span="6">
                        <div class="kp-form-group">
                          <el-form-item prop="total" label="Total">
                          </el-form-item>
                        </div>
                      </el-col>
                      <el-col :span="2" class="footer-label">
                        <span>${{ form.total || 0 }}</span>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </el-form>
          </div>

          <footer>
            <el-button
              size="small"
              v-on:click="$router.push('/idp/billing/list')"
              name="cancel"
            >
              Cancel</el-button
            >
            <el-button
              v-if="isSaveDraftVisible() && authorizedAccess"
              size="small"
              type="primary"
              v-on:click="onSave"
              name="save"
            >
              Save draft</el-button
            >

            <el-button
              v-if="isSaveGeneratedVisible() && authorizedAccess"
              size="small"
              type="primary"
              v-on:click="onGenerate"
              name="confirm"
            >
              {{ disableEditMode ? "Generated" : "Generate" }}</el-button
            >

            <pay-dialog
              @hide="handlePayDialogClose"
              @markPaid="markPaid"
              :payDialogVisible="payDialogVisible"
              :invoiceStatus="form.status"
              :invoiceNo="form.invoice_no"
              :invoiceTotal="form.total"
            ></pay-dialog>

             <el-button
              v-if="showSendInvoice"
              size="small"
              type="secondary"
              v-on:click="sendInvoice"
              name="send invoice"
            >
              Send invoice</el-button
            >


            <el-button
              v-if="!isSaveDraftVisible()"
              size="small"
              type="secondary"
              v-on:click="downloadInvoice"
              name="download"
            >
              Download invoice</el-button
            >

            <el-button
              v-if="isIssueInvoiceVisible() && authorizedAccess"
              size="small"
              type="primary"
              v-on:click="issueInvoice"
              name="issue"
            >
              Issue invoice</el-button
            >

            <el-button
              v-if="isPaidVisible() && authorizedAccess"
              size="small"
              type="primary"
              :disabled="isPaidDisabled()"
              v-on:click="markPaid"
              name="paid"
            >
              {{ isPaidDisabled() ? "Paid" : "Mark as Paid" }}</el-button
            >
          </footer>

          <pdf
            v-if="!authorizedAccess"
            ref="myPdfComponent"
            :src="fileURL"
          ></pdf>
        </div>
        <!-- | panel -->
      </section>
    </section>
  </el-main>
</template>


<script>
import Constants from "@/resources/Constants";
import BillingService from "@/idp/services/IdpBillingService";
import PaymentService from "@/idp/services/PaymentService";
import PayDialog from "../components/PayInvoiceDialog.vue";
import DataTable from "@/components/DataTable.vue";
import BillingLineItems from "../components/BillingLineItems.vue";
import EventBus from "@/EventBus";
import moment from "moment";
import pdf from "vue-pdf";
import _ from "lodash";
const uuidv4 = require("uuid/v4");
import CustomerService from "@/services/CustomerService";
import IdpChartService from "@/services/IdpChartService";
const currentYear = moment().year();

export default {
  name: "BillingForm",
  components: {
    DataTable,
    BillingLineItems,
    PayDialog,
    pdf,
  },
  computed: {
    showSendInvoice() {
      if (this.form.status && this.form.status == Constants.BILLING.INVOICE_STATUS.ISSUED && this.isAuthorisedAccess()) {
        return true;
      }
      return false;
    },
    tableParams() {
      return {
        apiName: `/portal/api/table/de_business_rule_field_map`,
        defaultData: {
          de_field_id: null,
          document_type: this.form.document_type,
          active: true,
        },
        tableName: "field_business_rule_map",
        tableHeaderConfigParams: {
          document_type: this.form.document_type,
        },
        isRestify: true,
        queryParam: {
          active: true,
          de_field_id: null,
          document_type: this.form.document_type,
        },
        limit: 10,
        allowInline: true,
        inlineAddButtonConfig: {
          disable: false,
        },
        activeTab: "settings",
        pageTitle: "Line Items",
        showSortOptions: false,
        globalSearch: false,
        customfilter: false,
        showPaginationOptions: false,
      };
    },
  },
  data() {
    const user = this.$store.getters.user;
    const authorizedAccess = this.isAuthorisedAccess()
    const selectedCustomerName = localStorage.getItem("customerName")
      ? localStorage.getItem("customerName")
      : _.get(user, "customer_name");
    const checkPositiveNumber = (rule, value, callback) => {
      if (value && value < 0) {
        callback(new Error("Value must be positive"));
        return;
      }
      callback();
    };
    return {
      shouldNotify: true,
      totalPages: 0,
      totalDocuments: 0,
      fileURL: "",
      payDialogVisible: false,
      stages: [
        {
          title: "Draft",
          value: Constants.BILLING.INVOICE_STATUS.DRAFT,
          icon: "el-icon-notebook-2",
        },
        {
          title: "Generated",
          value: Constants.BILLING.INVOICE_STATUS.CONFIRMED,
          icon: "el-icon-aim",
        },
        {
          title: "Issued",
          value: Constants.BILLING.INVOICE_STATUS.ISSUED,
          icon: "el-icon-circle-check",
        },
        {
          title: "Paid",
          value: Constants.BILLING.INVOICE_STATUS.PAID,
          icon: "el-icon-money",
        },
      ],
      loading: false,
      months: moment.months().map((label) => {
        return { label, value: ("" + label).substring(0, 3) };
      }),
      authorizedAccess: authorizedAccess,
      disableEditMode: authorizedAccess ? false : true,
      years: [
        currentYear,
        currentYear - 1,
        currentYear - 2,
        currentYear - 3,
        currentYear - 4,
      ].map((label) => {
        return { label, value: label };
      }),
      customerName: selectedCustomerName,
      showDatatable: true,
      pageTitle: "Billing Invoice",
      labelPosition: "top",
      form: this.prepareEditPageForm({}),
      lineConfig: {
        loading: false,
        columns: [
          {
            name: "lineno",
            width: "80px",
            label: "Line no",
            disabled: this.disableEditMode || !authorizedAccess,
          },
          {
            name: "description",
            label: "Description",
            width: "200px",
            disabled: this.disableEditMode || !authorizedAccess,
          },
          {
            name: "quantity",
            label: "Quantity",
            type: "number",
            disabled: this.disableEditMode || !authorizedAccess,
          },
          {
            name: "rate",
            label: "Rate($)",
            type: "number",
            disabled: this.disableEditMode || !authorizedAccess,
          },
          { name: "total", label: "Total($)", disabled: true, type: "number" },
        ],
        data: [],
      },

      formRules: {
        invoice_no: [
          {
            required: true,
            message: "Please enter invoice#",
            trigger: "blur",
          },
        ],
        invoice_date: [
          {
            required: true,
            message: "Please select invoice date",
            trigger: "blur",
          },
        ],
        due_date: [
          {
            required: true,
            message: "Please select due date",
            trigger: "blur",
          },
        ],
        discount: [
          {
            required: true,
            message: "Please enter discount",
            trigger: "blur",
          },
          { validator: checkPositiveNumber, trigger: "blur" },
        ],
        tax_percent: [
          {
            required: true,
            message: "Please enter tax(%)",
            trigger: "blur",
          },
          { validator: checkPositiveNumber, trigger: "blur" },
        ],
      },
      modified_document_types: [],
    };
  },
  methods: {
    isAuthorisedAccess(){
      const user = this.$store.getters.user;
      const authorizedUser =  _.filter(['admin','idp_admin'],(role)=>(user["roles"] || []).includes(role));
      return authorizedUser.length  ? true  : false;
    },
    async getEmailFromPopup(defaultEmails){
      return new Promise((success,reject)=>{
        this.$prompt('Please enter billing emails', '', {
         confirmButtonText: 'OK',
         cancelButtonText: 'Cancel',
         inputValue:defaultEmails,
         inputValidator: function (value) {
           if(!value) return 'Please enter billing emails' 
           let isValid=true;
           const emailList = value.split(",");
           const regexEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
         
           for(const email of emailList){
             isValid =regexEmail.test(String(email.trim()).toLowerCase());
               if(!isValid){
                   break;
               }
           }
           return isValid ? isValid:'Please enter valid email'
         },  
         inputErrorMessage: 'Please enter valid email'
       }).then(({ value }) => {
           success(value.split(','))
       }).catch(() => {
       });
      })
    },
    async sendInvoice(){
          const fileName = "" + this.form.invoice_no.replace(/\//g, "_") + ".pdf";
          let date = moment(this.form.due_date).format("MMM DD, YYYY")
          const invoiceData = {
            invoice_no: this.form.invoice_no,
            invoice_amount: this.form.total,
            invoice_id: this.form._id,
            invoice_due_date: date
          };
          let payload = {
              action:'send_invoice',
              fileName,
              invoiceData
          };
          
          let email = await this.getEmailFromPopup(this.customerConfig.billing_email);
          if(email){
              payload.emails = email;
              BillingService.sendInvoice(payload);
              this.notifySuccess('Invoice sent successfully.');
          }
    },
    handlePayDialogClose() {
      this.payDialogVisible = false;
    },
    handleInvoiceDateInput() {
      this.form.due_date = moment(this.form.invoice_date)
        .add(30, "days")
        .format("YYYY-MM-DD");
    },
    validateLines() {
      let validated = true;
      this.lineConfig.data = (this.lineConfig.data || []).map((row) => {
        row["_errors"] = row["_errors"] || {};

        if (!row.description || !("" + row.description).trim()) {
          validated = false;
          row["_errors"]["description"] = "Please enter line details";
        } else {
          delete row["_errors"]["description"];
        }

        if (row.quantity !== 0 && (!row.quantity || row.quantity < 0)) {
          validated = false;
          row["_errors"]["quantity"] = "Please enter valid positive number";
        } else {
          delete row["_errors"]["quantity"];
        }

        if (row.rate !== 0 && (!row.rate || row.rate < 0)) {
          validated = false;
          row["_errors"]["rate"] = "Please enter valid positive number";
        } else {
          delete row["_errors"]["rate"];
        }

        return row;
      });
      return validated;
    },

    isSaveDraftVisible() {
      if (
        this.form &&
        (!this.form.status ||
          this.form.status === Constants.BILLING.INVOICE_STATUS.DRAFT)
      ) {
        return true;
      }
      return false;
    },

    isSaveGeneratedVisible() {
      if (
        this.form &&
        this.form.status === Constants.BILLING.INVOICE_STATUS.DRAFT
      ) {
        return true;
      }
      return false;
    },

    isIssueInvoiceVisible() {
      if (
        this.form &&
        this.form.status === Constants.BILLING.INVOICE_STATUS.CONFIRMED
      ) {
        return true;
      }
      return false;
    },

    isPaidVisible() {
      if (
        this.form &&
        (this.form.status === Constants.BILLING.INVOICE_STATUS.ISSUED ||
          this.form.status === Constants.BILLING.INVOICE_STATUS.PAID)
      ) {
        return true;
      }
      return false;
    },

    isPaidDisabled() {
      if (
        this.form &&
        this.form.status === Constants.BILLING.INVOICE_STATUS.PAID
      ) {
        return true;
      }
      return false;
    },

    prepareEditPageForm(invoice) {
      const form = {
        _id: invoice._id || null,
        invoice_no: invoice["invoice_no"],
        order_no: invoice["order_no"] || "",
        invoice_date: invoice["invoice_date"]
          ? moment(invoice["invoice_date"]).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        due_date: invoice["due_date"]
          ? moment(invoice["due_date"]).format("YYYY-MM-DD")
          : moment().add(30, "days").format("YYYY-MM-DD"),
        subtotal: invoice["subtotal"] || 0,
        discount: invoice["discount"] || 0,
        tax: invoice["tax"] || 0,
        tax_percent: invoice["tax_percent"] || 0,
        total: invoice["total"] || 0,
        month: invoice["invoice_for"]
          ? ("" + invoice["invoice_for"]).trim().split(" ")[0]
          : moment().format("MMM"),
        year: invoice["invoice_for"]
          ? ("" + invoice["invoice_for"]).trim().split(" ")[1]
          : currentYear,
        status: invoice["status"],
      };
      return form;
    },

    async populateEditData() {
      this.loading = true;
      const invoiceId = this.getInvoiceId();
      
      const result = await Promise.all([
        BillingService.getInvoice({ invoice_id: invoiceId }),
        BillingService.getLineItems({ invoice_id: invoiceId }),
      ]);
      
      console.log("Promise.all result ", result);
      if (!result || result.length !== 2) {
        this.$router.push("/idp/billing/list");
        return;
      }

      const invoice = result[0]["invoice"];
      const lines = result[1];
      this.fileURL = result[0]["fileURL"];

      if (!invoice.status ||invoice.status !== Constants.BILLING.INVOICE_STATUS.DRAFT) {
        this.disableEditMode = true;
      }

      this.form = this.prepareEditPageForm(invoice);
      this.lineConfig.data = lines;
      this.calculateArithmaticFields();
      this.loading = false;
    },

    async getTotalPageCount(){
      let chartResult = await IdpChartService.getChartData({
        chart_name: "TotalDocumentCountWrapper",
        query: {"is_multi_documents_present":{"$ne":true}}
      });
      this.totalPages = chartResult["titleInfo"]["pages"]||0;
      this.totalDocuments = chartResult["titleInfo"]["documents"]||0;
    },

    async init() {
      this.getTotalPageCount();
      const customerConfig = await CustomerService.fetchById(this.$store.getters.customerId,{selectColumns:['billing_email']});
      if (customerConfig) {
        this.customerConfig  = customerConfig;
      }
      if (this.isEditMode()) {
        this.populateEditData();
      } else {
        this.computeLines();
      }
    },

    getActiveStage() {
      const stages = Object.values(Constants.BILLING.INVOICE_STATUS);
      if (!this.form.status || !stages.includes(this.form.status)) {
        return 1;
      }
      return 1 + stages.indexOf(this.form.status);
    },

    isEditMode() {
      return !!this.getInvoiceId();
    },

    getInvoiceId() {
      let invoiceId = null;
      try {
        const urlParams = new URLSearchParams(window.location.search);
        invoiceId = urlParams.get("id");
      } catch (e) {}
      return invoiceId;
    },

    prepareDataToStore(status) {
      const invoice_lines = (this.lineConfig.data || []).map((row) => {
        let line = {
          lineno: row.lineno,
          description: row.description || "",
          quantity: row.quantity ? parseFloat(row.quantity) : 0.0,
          rate: row.rate ? parseFloat(row.rate) : 0.0,
          total: row.total ? parseFloat(row.total) : 0.0,
        };
        if (row._id) {
          line["_id"] = ("" + row._id).trim();
        }
        return line;
      });

      const invoice_header = {
        invoice_no: this.form.invoice_no,
        order_no: this.form.order_no || null,
        invoice_date: this.form.invoice_date,
        invoice_for: this.form.month + " " + this.form.year,
        paid_on: null,
        total: parseFloat(this.form.total || 0),
        sub_total: parseFloat(this.form.subtotal || 0),
        tax: parseFloat(this.form.tax || 0),
        tax_percent: parseFloat(this.form.tax_percent || 0),
        discount: parseFloat(this.form.discount || 0),
        status: status || Constants.BILLING.INVOICE_STATUS.DRAFT,
        due_date: this.form.due_date,
        active: true,
      };
      if (this.form._id) {
        invoice_header["_id"] = ("" + this.form._id).trim();
      }
      return { invoice_lines, invoice_header };
    },

    onGenerate() {
      const message = "Invoice has been Generated successfully.";
      this.save(Constants.BILLING.INVOICE_STATUS.CONFIRMED, message);
    },

    downloadInvoice() {
      BillingService.downloadInvoice(this.form);
    },

    issueInvoice() {
      const message = "Invoice has been issued successfully.";
      this.save(Constants.BILLING.INVOICE_STATUS.ISSUED, message);
    },

    markPaid(params) {
      this.shouldNotify = params.notify === false ? false : true;
      const message = "Invoice has been marked as paid.";
      this.save(Constants.BILLING.INVOICE_STATUS.PAID, message);
    },

    async onSave() {
      const message = "Invoice data has been saved.";
      this.save(Constants.BILLING.INVOICE_STATUS.DRAFT, message);
    },

    navigateByResponse(invoiceResponse, message) {
      console.log("Update Response ", invoiceResponse);
      let defaultMessage = "Invoice data has been saved successfully";

      if ( _.get(invoiceResponse,'data.invoice_id')) {
        this.shouldNotify && this.notifySuccess(message || defaultMessage);
        this.$router.push({
          path: "/idp/billing/add",
          query: {
            id: "" + invoiceResponse.data.invoice_id,
          },
        });
        this.shouldNotify = true;
      } else {
        let errorMessage = "Something went wrong while saving";
        this.shouldNotify = true;
        if (_.get(invoiceResponse,'data.message')) {
          errorMessage = invoiceResponse.data.message;
        }
        this.notifyError(errorMessage);
      }
    },

    async updateInvoice({ invoice_lines, invoice_header,email_recipents }, message) {
      try {
        const invoiceResponse = await BillingService.updateInvoice({
          invoice_lines,
          invoice_header,
          invoice_total_pages: this.totalPages,
          email_recipents
        });
        this.navigateByResponse(invoiceResponse, message);
      } catch (e) {
        console.log(e);
        this.notifyError("Something went wrong while Saving");
      }
    },

    async save(status = Constants.BILLING.INVOICE_STATUS.DRAFT, message) {
     
      let isValid = this.$refs.form ? await this.$refs.form.validate().catch((error) => {}) : true;
      let isValidLines = this.lineConfig.data ? this.validateLines() : true;
      if (!isValid || !isValidLines) {
        this.notifyError &&
          this.notifyError(
            "There are some form validation errors, please resolve them and try again"
          );
        this.loading = false;
        return;
      }
      let emailRecipents = [];
      if(status == Constants.BILLING.INVOICE_STATUS.ISSUED){
        emailRecipents = await this.getEmailFromPopup(this.customerConfig.billing_email);
        console.log(emailRecipents);
      }
      const { invoice_lines, invoice_header } = this.prepareDataToStore(status);
      this.loading = true;
      if (this.isEditMode()) {
        await this.updateInvoice({ invoice_lines, invoice_header , email_recipents:emailRecipents}, message);
        await this.populateEditData();
        this.loading = false;
        if(status == Constants.BILLING.INVOICE_STATUS.ISSUED ){
          return this.$router.push('/idp/billing/list');
        }
        return;
      }

      try {
        const invoiceResponse = await BillingService.createInvoice({
          invoice_lines,
          invoice_header,
        });
        this.loading = false;
        this.navigateByResponse(invoiceResponse, message);
      } catch (e) {
        console.log(e);
        this.notifyError("Something went wrong while Saving");
        this.loading = false;
      }
    },

    calculateArithmaticFields() {
      let subtotal = 0.0;
      this.lineConfig.data = (this.lineConfig.data || []).map((row) => {
        if (row.quantity && row.rate) {
          row.total = parseFloat(
            (parseFloat(row.quantity) * parseFloat(row.rate)).toFixed(2)
          );
        } else {
          row.total = 0;
        }
        row.total = parseFloat(row.total);
        subtotal += row.total;
        return row;
      });

      subtotal = parseFloat(subtotal);
      let subtotalAfterDiscount =
        subtotal - (this.form.discount ? parseFloat(this.form.discount) : 0);

      let tax = 0.0;
      if (this.form.tax_percent) {
        tax = parseFloat(
          (subtotalAfterDiscount * parseFloat(this.form.tax_percent)) / 100
        );
      }

      const total = parseFloat(subtotalAfterDiscount) + parseFloat(tax);
      this.form.subtotal = subtotal.toFixed(2);
      this.form.tax = tax.toFixed(2);
      this.form.total = total.toFixed(2);
    },

    onTaxChange() {
      this.calculateArithmaticFields();
    },

    onDiscountChange() {
      this.calculateArithmaticFields();
    },

    async onDeleteLine(line) {
      if (!line._id) {
        return;
      }
      this.lineConfig.loading = true;
      try {
        await BillingService.deleteLine({ id: line._id });
      } catch (error) {
        console.error(error);
      }
      this.calculateArithmaticFields();
      this.lineConfig.loading = false;
    },

    onLineValueChanged(scope, columnName, value) {
      this.validateLines();
      if (["description", "total"].includes(columnName)) {
        return;
      }
      this.validateLines();
      //   const rowIndex = scope["$index"];
      this.calculateArithmaticFields();
    },
    setDefaultLines(linesResponse) {
      this.lineConfig["data"] = linesResponse;
      this.calculateArithmaticFields();
    },
    async computeLines() {
      this.lineConfig.loading = true;
      try {
        if (!this.form._id) {
          let customerConfig = await CustomerService.getConfiguration();
          if (customerConfig && customerConfig.length) {
            this.form.invoice_no =
              "INV" +
              _.get(customerConfig[0], "idp_billing.invoice_no_sequence");
          }else{
            this.notifyError(`Something went wrong while creating invoice.`);
            this.$router.push('/idp/billing/list');
            return ;
          }
        }
        const linesResponse = await BillingService.getLineItemsInitialData({
          month: this.form.month,
          year: this.form.year,
        });
        this.setDefaultLines(linesResponse);
      } catch (error) {
        this.lineConfig["data"] = [];
        this.notifyError(`Error while creating invoice lines`);
      }

      this.lineConfig.loading = false;
    },
  },
  beforeMount() {
    this.$store.commit("setDocumentType", Constants.DOCEX.DOCUMENT_TYPES.INVOICE);
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    this.init();
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";

.billing-invoice-body {
  .accordian-bar footer div,
  .form-page-container footer div {
    margin-left: 1rem !important;
  }
  .form-page-container{
    .kp-form-group{
      input{
        padding:6px;
      }
    }
  }
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0;
}

div.el-step__title {
  font-size: 11px;
  line-height: 24px;
}
div.el-step__icon.is-icon {
  width: 40px;
}

i.el-step__icon-inner[class*="el-icon"]:not(.is-status) {
  font-size: 16px;
  font-weight: normal;
}
.line-item-section {
  padding: 1rem;
  margin-bottom: 32px;
  //   border: none;
}
.total-field {
  div.el-col {
    font-weight: 600;
    font-size: 14px;
  }
}
.billing-month-selection {
  .billing-year-select {
    width: 10rem !important;
    padding: 0px !important;
    div.el-select {
      width: 6rem;
      div.el-input {
        width: 6rem;
        input {
          width: 6rem;
        }
      }
    }
  }
  .billing-month-select {
    width: 10rem !important;
    padding: 0px !important;
    div.el-select {
      width: 9rem;
      div.el-input {
        width: 9rem;
        input {
          width: 9rem;
        }
      }
    }
  }
}
.invoice-form-footer_fields-container {
  display: flex;
  justify-content: flex-end;
  .invoice-form-footer_fields {
    .el-form-item__error {
      width: 10rem !important;
    }
    .footer-label {
      margin-left: 16rem;
    }
    div.el-input {
      width: 10rem;
    }

    label.el-form-item__label {
      width: 110px !important;
    }
    div.el-form-item__content {
      margin-left: 110px !important;
    }
  }
}
</style>
