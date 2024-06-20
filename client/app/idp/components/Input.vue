<template>
    <div class="kp-docx-input" v-tooltip.bottom="{ content: inputVal, autoHide: false, classes: ['kan-tooltip']}">
        <el-input
            :cid="cid"
            :type="inputType"
            :rows="inputType=='textarea' ? '2':'1' "
            :name="props.field_config.name"
            :readonly="isDocumentReadOnly || isReadOnly"
            :disabled = "checkIfFieldDisabled"
            :class="inputClass"
            v-model="inputVal"
            @input="handleInput();handleEvent('input', $event)"
            @focus="handleFocus();handleEvent('focus', $event)"
            @change="handleEvent('change', $event)"
            @select="handleSelect($event)"
            @blur = "handleEvent('blur', $event);handleBlur();"
            v-if ="!enableAutocomplete"
        >
            <el-tooltip class="details-icon" slot="suffix" v-if ="enableReference && inputVal" placement="left">
                <span  slot="content">Details</span>
                 <span class="mdi mdi-file-document-outline" @click="handleEnableReference()"></span>
            </el-tooltip>
            <validation-tooltip slot="suffix" v-if="isTable && props && props.validationMsgs && props.validationMsgs.length>0"  :validationMsgs="props && props.validationMsgs"></validation-tooltip>
        </el-input>

            <el-autocomplete v-if="enableAutocomplete"
            :class="inputClass"
            v-model="inputVal"
            :cid="cid "
            :fetch-suggestions="querySearchAsync"
            :trigger-on-focus="false"
            :name="props.field_config.name"
            :disabled = "checkIfFieldDisabled"
            :readonly="isDocumentReadOnly"
            @input="handleInput();handleEvent('input', $event)"
            @focus="handleFocus();handleEvent('focus', $event)"
            @change="handleEvent('change', $event)"
            @blur = "handleEvent('blur', $event);handleBlur();"
            @select="handleSelect($event);handleEvent('select', $event)"
            popper-class="autocomplete-dropdown"
            >
             <template slot-scope="{ item }">
              <div v-if="item.value.length > 10">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="item.value"
                  placement="top"
                >
                  <div class="auto-complete-item-list">{{ item.value }}</div>
                </el-tooltip>
              </div>
              <div v-else>
                <div class="auto-complete-item-list">{{ item.value }}</div>
              </div>
            </template>


            <validation-tooltip slot="suffix" v-if="isTable && props && props.validationMsgs && props.validationMsgs.length>0"  :validationMsgs="props && props.validationMsgs"></validation-tooltip>

            </el-autocomplete>
    </div>

</template>

    <script>
    import lodash from 'lodash'
    import Constants from "@/resources/Constants";
    import EventBus from "@/EventBus";
    import ValidationTooltip from "@/idp/components/ValidationTooltip.vue";
    import DocumentScriptService from "@/idp/services/DocumentScriptService";
    import DocumentService from "@/idp/services/DocumentService";
    import formMixin from "@/mixins/formMixin.js";
    import {setTableInputClass} from "@/util/CommonUtil";
    export default {
        name: 'DocExInput',
        components:{ValidationTooltip},
        mixins: [formMixin],
        props: [
            "props",
            'isTable',
            "tableName",
            'propData',
            'isDocumentReadOnly',
            'selectedField',
            'isReadOnly',
            'documentType',
            'isDialog' // "Set to `true` when the request is intended for the Canvas Field Dialog, eliminating the need to create a separate `cid` (identifier) for the table field and dialog field, which is used to focus on the table field."
        ],
        computed: {
            checkIfFieldDisabled(){
                return this.isMasked || this.isFieldDisabled(this.props.field_config)
            },
            showValueTooltip(){
                try{
                    let showToolTip=false
                    const valueLength = this.inputVal ? this.inputVal.length:0;
                    if(valueLength>0){
                        showToolTip= true;
                    }
                    return showToolTip;
                }catch(e){
                    console.log(e)
                    return showToolTip;
                }
            },
            cid(){
                return DocumentService.createFieldCid(this.props, this.tableName, this.isDialog)
            },
            isMasked(){
                return !this.canSeePIIData() && lodash.get(this.props, 'field_config.is_masked')
            },
            inputType(){
                    return lodash.get(this.props,'field_config.type') == 'textarea' ? 'textarea':'text';
            },
            enableReference(){
                return lodash.get(this.props,'field_config.enable_reference',false) ;
            },
            enableAutocomplete(){
                return lodash.get(this.props,'field_config.enable_autocomplete',false) ;
            },
        },

        watch:{
            "props.value":{
                handler: function (newVal, oldVal){
                    if(newVal !== oldVal){
                        // console.log("Input watcher :: ", this.props.field_config.name);
                        this.inputVal = newVal;
                    }
                }
            }
        },

        data() {

            return {
                validationMsgs: [],
                inputVal: this.props.value,
                constant:Constants.DOCEX,
                inputClass:"",
                inputValueChangedEventName:""
                };
        },
        beforeDestroy() {
          
        },
        beforeMount(){
            this.inputVal = this.props.value
            /**
             * Implement the InputValueChanged__<field_name> event registration, which facilitates a two-way value synchronization mechanism.
             * For instance, when modifying a header field's value within the field card, 
             * this event ensures that the corresponding focused field value on the canvas also updates seamlessly. 
             **/
            const params = { table_name : this.tableName, is_table : this.isTable, name : this.props.field_config.name };
            this.inputValueChangedEventName = DocumentService.createValueChangeEventName(params);
            EventBus.$on(this.inputValueChangedEventName, (value)=>{
                this.inputVal = value;
            })
            
        },
        updated(){
            // console.log("Input:: updated", this.props.field_config.name);
        },
        methods: {
            handleEnableReference(){
                const params = {...this.props.field_config,
                        "name":this.props.name,
                        "value":this.inputVal,
                        "is_table": this.isTable,
                        "table_name": this.tableName
                    };

                EventBus.$emit('document-details-info', params);
            },
            handleInput() {
                /**
                 * Using the same event name for all fields would lead to unintended event listening by other instances of Dropdown.vue/Input.vue
                 * Hence, we've devised distinct events for each field to prevent such interference.
                 **/
                const params = { table_name : this.tableName, is_table : this.isTable, name : this.props.field_config.name };
                EventBus.$emit(this.inputValueChangedEventName, this.inputVal)
            },
            /**
             * Trigger when user select the value from autocomplete dropdown
             * Updating prediction data based on user-selected values when the "blur" event doesn't have updated value of selection. Also some times blur event not triggered 
             **/
            handleSelect(value){
                this.updatePredictionData(); 
            },
            updatePredictionData() {
                let params = {
                    'value': this.inputVal,
                    'name': lodash.get(this.props, 'field_config.name'),
                    'index': lodash.get(this.props, 'field_config.index', ""),
                    'table_index':lodash.get(this.props, 'field_config.tableIndex', ""),
                    'field_type': lodash.get(this.props, 'field_config.field_type', ""),
                    'field_config' : this.props.field_config,
                    'is_table': this.isTable,
                    'table_name': this.tableName
                }
                EventBus.$emit('update-field-value', params);
                
                /**
                 * When paginating line items, updating values on the first page and navigating to another destroys previous components.
                 * To address this, we update table params, triggering update hooks in all components. 
                 * To mitigate, we emit 'updateTableFieldValue' event with the updated params.
                 * 
                 */
                this.$emit('updateTableFieldValue', params);
            },

            handleFocus() {
                if (this.propData) {
                    const previousSelectedField = this.$store.getters["documentViewStore/selectedField"];
                    const selectedField = {...this.props, 'is_table': this.isTable, 'table_name': this.tableName};
                    this.$store.commit("documentViewStore/setSelectedField", selectedField)
                    if(this.props.page_number){
                        const params =   { previous_selected_field: previousSelectedField, current_selected_field: selectedField };
                        EventBus.$emit("SelectedFieldChangedOnPage__"+ this.props.page_number, params)
                    } else{
                        EventBus.$emit("ResetSelectedDialog") // Hide the selected dialog on the canvas if it was active before.
                    }
                }
                /* Removed inputClass computed property as it is getting called multiple times when selectedField is changed,
                   due to this table performance was slow.
                   Whenever user changes selectedField handleFocus is called,
                   so we are changing inputClass property in handleFocus instead of computed property to set focus on new field(element).

                    Added to mark perticular field as selected
                */
              setTableInputClass(this.props, this.tableName)
            },
            handleBlur(){
                this.updatePredictionData();
                // this.inputClass=""
            },

            /*
            Purpose : This function is called to handle any event related to UI Event Script.

            It executes the handleScript from formmixin which further conducts flow of UI Event Script

            @event Type : A string indicating the name of event
            @event : An object refers to the event object that is passed to an event handler function when an event is triggered
            */
            async handleEvent(eventType, event){
                const fieldId = this.props.field_config._id
                this.handleScript(this,fieldId, eventType, event)
            },

            setFieldOptions(params){
                EventBus.$emit('update-field-options', params)
            },
            async querySearchAsync(queryString, cb) {
                try{
                 const documentType = this.$store.getters["documentViewStore/documentType"]
                 const documentId = this.$store.getters["documentViewStore/documentId"]
                    let payload={
                        'document_type':this.propData.documentType || documentType,
                        'field_name':this.props.field_config.field_type == "table" ? this.props.field_config.name.split(/_([^_]*)$/)[0] : this.props.field_config.name,
                        'field_value':queryString,
                        'script_type': this.constant.SCRIPT_TYPE.AUTO_COMPLETE,
                        'document_id':this.propData.id || documentId,
                        'form' :this.$store.getters["documentViewStore/getDocumentForm"]
                    }
                    let response = await DocumentScriptService.run(payload);
                    let data =  response.data.body;
                    cb(data || []);
                }catch(exception){
                    console.log(exception);
                    cb([])
                }
            },
        },

    };
    </script>

    <style lang="scss">
    .field-error {
        border: 1.5px solid red;
    }
    //safari input bug fix
    .kp-docx-input {
        input {
            background: transparent;
            border: none;
            color: #212121;
            font-weight: 10px;
            text-align: left;
            line-height:23px !important;

        }
        .details-icon{
            margin-top:4px;
            vertical-align:-webkit-baseline-middle;
            color:#808080;
        }

        .input-border {
            border: 2px solid #00a7e0;
        }

        .input-error-border {
            border: 2px solid #C53030 !important;
        }
        .el-input{
            font-size:12px !important
        }
        .el-input__inner:not(#add-user-select){
            height:23px;
        }
       .el-autocomplete{
        width: 100%;

       }
       .el-autocomplete-suggestion li {
           font-size: var(--font-sm) !important;
           padding:0px 5px !important;
        }

        .auto-complete-item-list{
            font-size: 11px;
        }

    }

    .autocomplete-dropdown{
         li {
           font-size: var(--font-sm) !important;
           padding:0px 5px !important;
        }

        .auto-complete-item-list{
            font-size: 11px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

    }
    </style>
