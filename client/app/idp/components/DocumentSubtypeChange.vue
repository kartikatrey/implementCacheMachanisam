<template>
<div class="kp-body-scroll-timeline" v-bar="{ useScrollbarPseudo: true }">
    <el-dialog title="Assignment" :close-on-click-modal="false" width="30%" class="confirmation-box assignment-container" :visible.sync="showModal">
         <div style="text-align: center;margin-bottom: 10px;" class="header">
            Assign subtype
        </div>
        <div class="assignment-body">
            <el-form :model="form" ref="form" label-width="178px" class="demo-form" label-position="left">
                <el-row :gutter="20">
                    <el-col>
                        <div class="kp-form-group kp-form-vertical" style="margin-right: 0px;">
                            <el-form-item :rules="[
										{
											required: true,
											message: `document subtype is required`,
											trigger: 'blur'
										}
									]" label="Assign subtype" prop="document_subtype">
                                <el-select cid="document-subtype-select" class="config-value" filterable v-model="form.document_subtype" placeholder="Select document subtype" v-on:change="onSubtypeChange">
                                    <el-option v-for="(item, index) in documentSubtype" :cid="'ocument-subtype-selectp_'+index" v-bind:value="item" :key="item" :label="item"></el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row style="text-align:right; margin-top:5px" :span="24">                    
                        <el-button cid="document-assign-close" size="small" @click="handleCloseDialog">Close</el-button>
                        <el-button cid="document-assign-submit" :disabled="disableSave" element-loading-spinner="el-icon-loading" size="small" type="primary" @click="submitForm()">Submit</el-button>                           
                </el-row>
            </el-form>
        </div>
    </el-dialog>
</div>
</template>

<script>
import DocumentService from "@/idp/services/DocumentService";
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import _ from "lodash";
export default {
    name: "DocumentSubtype",
    props: ["params"],
    data: () => ({
        documentSubtype: Constants.DOCUMENT_SUB_TYPE ,
        showModal:true,
        disableSave:false,
        form:{
            document_subtype:''
        }
    }),
      watch: {
        params: {
            handler(newVal, oldVal) {
                if(!_.get(newVal,"docSubtype")){return;}
                this.$set(this.form, "document_subtype", newVal.docSubtype)                
            },
            deep: true,
            immediate:true
        }
    },

    methods: {
        onSubtypeChange(){},
        handleCloseDialog(){
            this.$emit('closeDialog');
        },

       async submitForm(){
            this.disableSave = true;
            let isValid = await this.$refs.form.validate().catch(error => {});
			if (!isValid) {
				this.disableSave = false;
				return;
			}
            const payload = {
                 document_subtype:this.form.document_subtype,
                 _id:this.params.selectedId 
            }
            const res = await DocumentService.update(payload);
            EventBus.$emit("IDP_UPDATE_TABLE_ROW", res.data);
            this.notifySuccess('Document subtype updated successfully.')
            this.$emit('closeDialog');
            
        }
    }

};
</script>