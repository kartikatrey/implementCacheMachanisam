
    <script>
    import lodash from 'lodash'
    import Constants from "@/resources/Constants";
    import EventBus from "@/EventBus";
    import ValidationTooltip from "@/idp/components/ValidationTooltip.vue";
    import DocumentScriptService from "@/idp/services/DocumentScriptService";
    import formMixin from "@/mixins/formMixin.js";
    import {setTableInputClass} from "@/util/CommonUtil";

    export default {
        name: 'DocExInput',
        components:{ValidationTooltip},
        mixins: [formMixin],
        props: ["props", 'isTable', 'propData', 'isDocumentReadOnly','selectedField','isReadOnly','documentType'],
        data(){
            return {
                inputVal: this.props.value,
                inputClass:""
            }
        },
        render: function (createElement) {
            
            const elInputElement = createElement('el-input', {
                attrs:{
                    cid: this.cid,
                    class: this.inputClass,
                    value: this.inputVal,
                    type: this.inputType,
                    rows: this.inputType=='textarea' ? '2':'1',
                    name: this.props.field_config.name,
                    readonly: this.isDocumentReadOnly,
                    disabled: this.isMasked,
                },
                on:{
                    input:(newValue, $event)=>{
                        console.log("@input::input");
                        this.inputVal = newValue;
                        this.handleInput()
                        this.handleEvent("input", $event)
                    },
                    focus:($event)=>{
                        console.log("@input::focus");
                        this.handleFocus()
                        this.handleEvent("focus", $event)
                    },
                    change:($event)=>{
                        console.log("@input::change");
                        console.log($event)
                        this.handleEvent("change", $event)
                    },
                    blur:($event)=>{
                        console.log("@input::blur");
                        console.log($event)
                        this.handleBlur();
                        this.handleEvent("blur", $event);
                    }
                }
            });
            return elInputElement;
            // const autoCompleteElement = createElement('el-autocomplete', {
            //     attrs:{
            //         "class": this.inputClass,
            //         "cid":this.cid,
            //         "fetch-suggestions":this.querySearchAsync,
            //         "trigger-on-focus":"false",
            //         "name":this.props.field_config.name,
            //         "disabled":this.isMasked,
            //         "readonly":this.isDocumentReadOnly,
            //         "value": this.inputVal
            //     },
            //     on:{
            //         input:(newValue, $event)=>{
            //             console.log("@input::input");
            //             this.inputVal = newValue;
            //             this.handleInput()
            //             this.handleEvent("input", $event)
            //         },
            //         focus:($event)=>{
            //             console.log("@input::focus");
            //             this.handleFocus()
            //             this.handleEvent("focus", $event)
            //         },
            //         change:($event)=>{
            //             console.log("@input::change");
            //             console.log($event)
            //             this.handleEvent("change", $event)
            //         },
            //         blur:($event)=>{
            //             this.handleBlur();
            //             this.handleEvent("blur", $event);
            //         }
            //     }
            // });
            // const tooltipElement =  createElement('el-tooltip', {
            //     attrs:{
            //         placement:"top",
            //         disabled:!this.showValueTooltip,
            //         content: this.inputVal,
            //         effect:"light"
            //     }
            // },[elInputElement]);

            // return tooltipElement;
        },
        computed: {
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
                return lodash.get(this.props, 'field_config.name')
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
        updated(){
            console.log("Input updated :: " + this.props.field_config.name)
        },
        beforeMount(){
            console.log("Input beforeMount :: " + this.props.field_config.name)
            EventBus.$on("InputValueChanged__"+this.props.field_config.name,(value)=>{
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",this.props.field_config.name)
                console.log(value)
                this.inputVal = value;
            })
        },
        methods:{
            handleEnableReference(){
                EventBus.$emit('document-details-info', {...this.props.field_config,...{name:this.props.name},...{value:this.inputVal}});
            },
            // handlePOMapper(){
            //    EventBus.$emit('po-mapper', {...this.props.field_config,...{name:this.props.name},...{value:this.inputVal}});
            // },
            handleInput() {
                EventBus.$emit("InputValueChanged__" + this.props.field_config.name, this.inputVal);
                this.updatePredictionData()
            },

            updatePredictionData() {
                let params = {
                    'value': this.inputVal,
                    'name': lodash.get(this.props, 'field_config.name'),
                    'index': this.props.field_config.index,
                    'table_index':this.props.field_config.tableIndex,
                    'field_type': this.props.field_config.field_type,
                    'field_config' : this.props.field_config
                }
                EventBus.$emit('update-field-value', params)
            },

            handleFocus() {
                if (this.propData) {
                    console.log("emiting field selection")
                    this.$store.commit("documentViewStore/setSelectedField",this.props)
                    EventBus.$emit("SelectedFieldChangedOnPage__"+ this.props.page_number, this.props)
                }
                /* Removed inputClass computed property as it is getting called multiple times when selectedField is changed,
                   due to this table performance was slow.
                   Whenever user changes selectedField handleFocus is called,
                   so we are changing inputClass property in handleFocus instead of computed property to set focus on new field(element).

                    Added to mark perticular field as selected
                */
              setTableInputClass(this.props)
            },
            handleBlur(){
                // this.inputClass=""
            },

            /*
            Purpose : This function is called to handle any event related to UI Event Script.

            It executes the handleFieldUIEvent from formmixin which further conducts flow of UI Event Script

            @event Type : A string indicating the name of event
            @event : An object refers to the event object that is passed to an event handler function when an event is triggered
            */
            async handleEvent(eventType, event){
                const fieldId = this.props.field_config._id
                this.handleFieldUIEvent(this,fieldId, eventType, event)
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
                        'script_type': Constants.SCRIPT_TYPE.AUTO_COMPLETE,
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
            }
        }
    };
    </script>

    <style lang="scss" scoped>
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
