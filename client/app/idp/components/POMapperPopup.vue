<template>
 <section class="details-info-container accordian-container">
      <div class="panel" v-loading="loading">
        <div class="panel-body">
        <el-main>
          <el-tabs v-model="activeName" @tab-click="selectTab">
            <el-tab-pane name="po_line_mapper" >
              <span slot="label">PO Lines Mapper</span>
                <div class="content-body">
                    <el-form>
                        <div class="content-body">
                            <div id="map_wrapper">
                              <div id="fieldLinkerZone" style="max-width:800px;width:800px;" ></div> 
                              <div class="bonds" id="original" style="display:block;"></div>
                              <div class="footer po-details-footer">
                                <el-button size="small" plain class="eraseLink">Reset</el-button>
                                <el-button size="small"  type="primary" class="fieldLinkerSave">Done</el-button>
                              </div>  
                              <!-- <i class="mdi mdi-resize-bottom-right resize-icon"></i> -->
                              <span id="output"></span>
                              <div id="input"></div>
                          </div>
                        </div> 
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane name="po_details">
              <span slot="label">PO Details</span>
                <div class="content-body">
                    <el-form>
                      <div class="content-body">
                          <!-- PO details -->
                            <div class="details-container"> 
                              <el-form
                              ref="form"
                              class="details-form-container"
                              :model="form"
                              label-width="130px"
                            >
                                <el-row>
                                  <el-col class="mb-10 header-fields"
                                    :span="4"
                                    v-for="(field, index) in header"
                                    v-bind:key="index"
                                  >
                                    <div class="form-group form-horizontal po-mapper-details">
                                      <div class="filed-label">{{ field.label }}</div>
                                      <div class="filed-value">{{ field.value }}</div>
                                    </div>
                                  </el-col>
                                </el-row>
                                          
                                <el-row v-if="!isDataValid">
                                  <el-col class="mb-10 data-not-found">
                                    <span>No data found.. </span>
                                  </el-col>
                                </el-row>
                                        

                              </el-form>
                            </div>
                            <!-- Line item table -->
                            <section v-if="tableParams" class="po-details-table-container">
                              <div data-v-step="2" class="table-wrap">
                                <data-table
                                  class="po-details-popup"
                                  :parameters="tableParams"
                                  ref="detailsInfoPopup"
                                ></data-table>
                              </div>
                            </section>
                      </div> 
                    </el-form>
                </div>
            </el-tab-pane>
          </el-tabs>
        </el-main>
        </div>
      </div>
  </section>
</template>


<script>
import DataTable from "@/components/DataTable.vue";
import { Loading } from "element-ui";
import DocumentScriptService from "@/idp/services/DocumentScriptService";
import CustomerService from "@/idp/services/CustomerService";
import _ from "lodash";
import $ from "jquery";
import "../assets/js/fieldsLinker";
import EventBus from "@/EventBus";
export default {
  name: "POMapperInfo",
  props: ["displayPOMapperInfo", "data"],
  components: { DataTable, Loading },
  data() {
    return {
      activeName:'po_line_mapper',
      title: "",
      loading: false,
      header: [
      ],
      tableParams: "",
      form: {},
      inputOri : {},
      fieldLinks : "",
      inv_details : [],
      po_details : [],
      inv_data : []
    };
  },
  computed: {
    isDataValid() {
        return !this.loading && (this.header && this.header.length) && this.tableParams;
    }
  },

methods: {
  selectTab(event={}){
    const eventName = event.name || this.activeName;
    if(eventName == "po_line_mapper"){
      this.$nextTick(async ()=>{
        this.initializeFieldsLinker();
      });
    }
  },
  prepareData(data = { lines: {}, header: [] }) {
      _.get(data,'lines.values') && data.lines.values.length && (this.tableParams = {
        isStaticTable: true,
        showPaginationOptions: false,
        showTableToolbar: false,
        showSortOptions: false,
        fixedHeader: false,
        tableMaxHeight:'180px',
        rows: data.lines.values,
        columns:  data.lines.header,
      });
      this.header = data.header || [];
      data.title && (this.title = data.title)
    },
    preparePOLines(data){
       let po_lines = data["lines"]["values"]
          po_lines.forEach((obj)=>{
          let tmp = {}
          tmp["item"] = obj["item"]
          tmp["supplier_item"] = obj["supplier_item"]
          tmp["description"] = obj["description"]
          tmp["balance_quantity"] = obj["balance_quantity"]
          tmp["unit_price"] = obj["unit_price"]
          tmp["shipment_no"] = obj["shipment_no"]
          tmp["po_line_no"] = obj["po_line_no"]
          this.po_details.push(tmp)
        })         
    },
    prepareInvLines(){
      let inv_lines = this.data.form["lines"]
        inv_lines.forEach((obj)=>{
          let tmp = {}
          tmp["item_code"] = obj["item_code"]
          tmp["description"] = obj["description"]
          tmp["quantity"] = obj["quantity"]
          tmp["unit_price"] = obj["unit_price"]
          tmp["line_po_number"] = obj["line_po_number"]
          tmp["po_ref_line_number"] = obj["po_ref_line_number"]
          tmp["inv_line_number"] = " "
          tmp["po_shipment_no"] = obj["po_shipment_no"]
          this.inv_details.push(tmp)
        })
    },

    initializeFieldsLinker(){
      var fieldLinks;
      var inputOri = {
        "localization": {},
        "options": {
          "associationMode": "oneToOne", // oneToOne,manyToMany
          "lineStyle": "square-ends",
          "buttonErase": "Reset",
          "displayMode": "original",
          "whiteSpace": "normal", //normal,nowrap,pre,pre-wrap,pre-line,break-spaces default => nowrap
          "mobileClickIt": false
        },
        "Lists": [
          {
            "name": "Invoice line items",
            "list": []
          },
          {
            "name": "PO line items",
            "list": [],
            "mandatories": []
          }
        ],
        "existingLinks": []
      };
      let index = 0
      for(let i=0;i<this.inv_details.length;i++){
        if(this.inv_details[i][this.data.field_name] == this.data.field_value){
          if(this.inv_details[i]["po_ref_line_number"]){
            inputOri["existingLinks"].push({"from":(i+1)+"","to":this.inv_details[i]["po_ref_line_number"]+"_"+this.inv_details[i]["po_shipment_no"]})
          }
          inputOri["Lists"][0]["list"].push((i+1)+"")
          this.inv_data[index] = this.inv_details[i]
          this.inv_data[index]["inv_line_number"] = (i+1)+""
          this.inv_data[index]["is_table"] = this.data.is_table
          this.inv_data[index]["table_name"] = this.data.table_name;
          index++
        }   
      }
      for(let i=0;i<this.po_details.length;i++){
        inputOri["Lists"][1]["list"].push(this.po_details[i]["po_line_no"]+"_"+this.po_details[i]["shipment_no"])
      }
      
      let that = this;
      $(".eraseLink").on("click",()=>{
        fieldLinks.fieldsLinker("eraseLinks");
      })
	 		$(".fieldLinkerSave").on("click",()=>{
				var results = fieldLinks.fieldsLinker("getLinks");
          that.inv_data.forEach((inv_obj)=>{
            let poLineNumberField = {
                'value': null,
                'name': "po_ref_line_number_"+(inv_obj["inv_line_number"]-1)+"",
                'index': inv_obj["inv_line_number"]-1,
                'field_type': "table",
                'is_table': inv_obj.is_table,
                'table_name': inv_obj.table_name
            }
            let poShipNumberField = {
                  'value': null,
                  'name': "po_shipment_no_"+(inv_obj["inv_line_number"]-1)+"",
                  'index': inv_obj["inv_line_number"]-1,
                  'field_type': "table",
                  'is_table': inv_obj.is_table,
                  'table_name': inv_obj.table_name
              }
              let obj = _.find(results["links"], function(obj) {
                  if (obj["from"] == inv_obj["inv_line_number"]) {
                      return obj;
                  }
              })
              if(obj){
                poLineNumberField['value'] = obj["to"].split("_")[0]+""
                poShipNumberField['value'] = obj["to"].split("_")[1]+""
              }
            this.$store.commit("documentViewStore/setSelectedField", poLineNumberField);
            EventBus.$emit('update-field-value', poLineNumberField);
            this.$store.commit("documentViewStore/setSelectedField", poShipNumberField);
            EventBus.$emit('update-field-value', poShipNumberField);        
            this.$emit('updateTableFieldValue', poShipNumberField);  
        })
        this.$emit('update:displayPOMapperInfo', false)
      });
		  fieldLinks=$("#original").fieldsLinker("init",inputOri,this.inv_data,this.po_details);
    },

    async fetchDetails() {
      this.loading = true;
      try {
        const payload = {
          document_type: this.data.document_type,
          field_name: this.data.field_config.name,
          script_type: this.data.script_type,
          field_value:this.data.field_value,
          form:this.data.form,
          document_id:this.data.document_id
        };
        const response = await DocumentScriptService.run(payload);
        const data = _.get(response,'data.body') || {};

        this.prepareData(data);
        this.prepareInvLines()
        this.preparePOLines(data);
       
      } catch (exception) {
        console.log(exception);
      } finally {
        this.loading = false;
      }
    },
    async fetchConfiguration(){
        // Get PO configuration data from customer_configuration table . 
        let configurationResponse = await CustomerService.getCustomerConfiguration({selectColumns:['default_po_popup_tab']});
        this.activeName = _.get(configurationResponse,'[0].default_po_popup_tab','po_line_mapper');
    }
  },
  async mounted() {
    await this.fetchConfiguration();
    await this.fetchDetails();
    this.selectTab()
  },
};

</script>

<style lang="scss" >
@import "../_idpVariables";
@import "../_idpGlobal.scss";
.details-info-container .el-tabs--top{
  margin-top: -30px;
}

.details-info-container {
  .el-tabs__header {
    margin-top: 2rem;
  }
}
.po-details-footer {
  text-align: center;
  width: 94%;
  // position: sticky;
  bottom: 0px;
  background: var(--white);
  padding: 1rem 0;
}
.resize-icon {
    font-size: 2.5rem !important;
    margin: 0 auto;
    color: var(--dark-04) !important;
        bottom: -20px;
    right: .2rem;

    position: absolute;
}

.po-details-gragable-component .content {
  font-size: initial;
  overflow: hidden !important;
}
.details-info-container {
  overflow: auto;
    width: 98.5%;
        &::-webkit-scrollbar {
            width: 10px !important;
            height: 5px;
        } 
}

.FL-left, .FL-right {
    select {
        color: var(--brand-04);
        font-weight: 500;
        font-size: var(--font-lg);
         padding: .5rem 0 0 0;
    }
}

	#map_wrapper{
	
		 width:100%;
     padding: 0 1rem .5rem 2rem;

        	.bonds{
              // min-width:400px;
              width : 100%;
              min-height: 410px;
              // max-height: 600px;
              overflow: hidden;
              padding-right: 2rem;
                  padding-bottom: 3rem;
          }


	 
	@media screen and (max-width: 600px) {
		 #map_wrapper{
			 padding-top: -10px;
			 padding-left:10px;
			 width:98%;
		 }
	}
	 


	
	label input[type='radio']{
		vertical-align: top;
	}
	
	label.active{
		font-weight:600;
		color: #2e44b9;
	}
	
	

	 
	.radio-zone{
		padding: 0px 8px 0px 8px;
		border-radius:2px;
		min-width:300px;
	}
	.presentation{
		line-height : 14px;
	}
	

	
	.fieldLinkerSave {
		display:inline-block;
	}
	
	
input[type=radio] {
	cursor: pointer;
}

input[type=checkbox]::before{
  content: "";
  display: inline-block;
  font-size: inherit;
  float:left;
  font-weight:bold;
  margin-left:0;
  margin-right:2px;
  border: 2px solid #337ab7;
  border-radius : 3px;
  padding : 5px;
  margin-top:0px;
  color:black;
  background: white;
}

input[type=checkbox].active::after {
    content: "";
    display: inline-block;
    font-size: inherit;
    float: left;
	transform: rotate(45deg);
    margin-left: 6px;
    margin-top:-13px;
	height: 10px;
	width:  5px;
    color: #337ab7;
	border-bottom: 2px solid #337ab7;
	border-right:  2px solid #337ab7;
}

div.action-check.off {
    color: silver;
}

div.action-check {
    color: black;
    // cursor: pointer;
}

input[type=radio]:before {
	background: white;
	border: 2px solid #337ab7;
	border-radius: 50%;
	margin-top: -2px;
	margin-right: 6px;
	display: inline-block;
	vertical-align: middle;
	content: '';
	width: 14px;
	height: 14px;
}

	input[type=radio]:checked:before {
		background: #337ab7;
		border-color: #337ab7;
		box-shadow: inset 0px 0px 0px 2px #fff;
	}
	.choices{
		display:inline-block;
		margin-right:40px;
	}
	
	.choices label{
		margin-left:4px;
		margin-right:4px;
		vertical-align:8%;
	}
	
	.choices label.group{
		font-weight:bold;
	}
	
	.nice-group{
		width:680px;
		line-height: 16px;
		padding:10px;
		border:1px solid #ccc;
		background-color:#fff;
		border-radius: 5px;
	}
	.nice-group legend {
		color: #337ab7;
		width:120px;
		border-bottom:none;
		
  }


.fieldsLinker ul {
    list-style: none;
    margin: 0px;
    padding-left: 0px;
    font-weight: normal;
}

.fieldsLinker li.map_container {
    padding: 0;
    margin-top: 7px;
    margin-bottom: 6px;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    cursor: pointer;
    background-color:var(--dark-08);
    color: black;
    border-radius: 0px;
    text-overflow: ellipsis;
    overflow: hidden;
      &:hover {
          box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
             .mdi.unlink  { 
                display: block;
             }
      }
        .mdi.unlink  {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          font-size: 1rem;
          line-height: 1.4rem;
          box-sizing: border-box;
            padding: 0 .1rem;
          background: var(--dark-07);
          color: var(--red-03);
        }
       
        .map_wrapper {
          width: 100% !important;
            .description {
                font-size: var(--font-base);
                font-weight:500;
                color: var(--dark-01);
                  line-height: 1;
                // font-weight: 500;
                  span {
                           white-space: nowrap; 
                        overflow: hidden;
                        text-overflow: ellipsis; 
                          width: 100%;
                          display: block;
                  }
            }
            .item_code {
                font-size: var(--font-base);
                font-weight:500;
                color: var(--dark-01);
                display: inline-block;
                padding-right: 2rem;
                    // font-weight: 500;
            }
            .supplier_item {
                font-size: var(--font-base);
                font-weight:500;
                color: var(--dark-01);
                padding-right: 2rem;
                    // font-weight: 500;
            }
            .quantity {
                font-size: var(--font-base);
                color: var(--dark-04);
                display: inline-block;
                 padding-right: 2rem;
                //  font-weight: 500;
            }
             .unit_price {
                font-size: var(--font-base);
                color: var(--dark-04);
                display: inline-block;
                padding-right: 2rem;
                  // font-weight: 500;
            }
            .ship_no {
              font-size: var(--font-base);
                color: var(--dark-04);
                display: inline-block;
            }
        }
        
}
.po_map_container {
     border-left: 7px solid var(--dark-04);
         .map_wrapper {
          display: flex;
          justify-content: flex-end;
            .right_side {
                  margin: 0 auto 0 0;
                  padding: .2rem 1rem;
                  width: 90%;
            }
            .line_item {
                  font-weight: 500;
                  color: var(--dark-03);
                  background: var(--dark-06);
                  font-size: 2rem;
                  width: 50px;
                  text-align: center;
            }
     }
}

.inv_map_container {
    border-right: 7px solid var(--dark-04);
     .map_wrapper {
          display: flex;
          justify-content: flex-end;
            .left_side {
              margin: 0 auto 0 0;
              padding: .2rem 1rem;
              width: 90%;
            }
            .line_item {
              font-weight: 500;
              color: var(--dark-03);
              background: var(--dark-06);
              font-size: 2rem;
              width: 50px;
              text-align: center;
            }
     }
}

.fieldsLinker li.selected {
    -webkit-filter: invert(100%);
    filter: invert(100%);    
}

.fieldsLinker li[data-mandatory='true'] {
    background-color: #D7504C;
    background: linear-gradient(#D7504C, #C12F2B);
    color: white;
}

.fieldsLinker li.inactive {
    opacity: 0.5;
}

.fieldsLinker li.linkOver {
    border: solid 2px transparent; /*plus 1px*/
    padding: 4px 1px 4px 7px; /* minus 1px*/
}
.content button:hover, .content button:active {
    background: red !important;
    color: #fff !important;
}

}

</style>