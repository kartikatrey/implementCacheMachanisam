<template>
    <el-main class="kp-main">
        <section class="page-body">
    
            <div class="page-title">
                <span class="page-title-text">Customer Configuration</span>
                <span>Edit customer configuration</span>
            </div>
    
            <section class="form-page-container">
    
                <div class="panel">
                    <div class="panel-body">
                        <el-form label-position="left" ref="form" label-width="120px">
                            <!-- basic content -->
    
                            <div class="grouping-tile" >General configuration</div>
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item label="Enable MFA">
                                            <el-checkbox cid="input-enable-mfa" v-model="form.mfa_enabled"></el-checkbox>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>    
                        </el-form>
                    </div> <!-- | panel body -->
                    <footer>
                        <div>
                            <!-- <el-button cid="input-channel-form-cancel" size="small" v-on:click="$router.push('/idp/input-channels')">Cancel</el-button> -->
                        </div>
                        <div>
                            <el-button size="small" type="primary" cid="input-save-button" v-on:click="save">Save</el-button>
                        </div>
                    </footer>
                </div> <!-- | panel -->
    
            </section> <!-- | form-page-container -->
    
        </section>
    </el-main>
    </template>
     
    <script>
    import customerConfiguration from "@/idp/services/CustomerConfig";
    export default {
        data(){      
         return{
                form: {
                    mfa_enabled: false,
                    ocr_type: "vision",
                    documentai_pdf_parsing: false,
                }   
            }
        },
        methods: {
            async save() {
                customerConfiguration.save(this.form)
                .then(()=>{
                    this.notifySuccess("Record saved successfully.");
                })
                .catch(()=>{
                    this.notifyError("Something went wrong");
                })
            },
            async init(){
                try{
                    const customerConfig = await customerConfiguration.getCustomerConfig(this.form)
                    this.form = _.merge({}, this.form, customerConfig[0]);
                }catch(error){
                    console.log(error)
                    this.notifyError("Something went wrong");
                }  
            }
        },
        beforeDestroy() {
        },
        beforeMount() {
            this.init();
        },
    };
    </script>
    
    <style lang="scss">
    @import "../_idpGlobal";
    </style>
    