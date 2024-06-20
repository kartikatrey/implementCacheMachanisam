<template>
<div>
    <el-row>
        <el-col :span="20">
            <el-select
                v-model="object"
                placeholder="Select Object"
                @change="onChange"
                multiple
                >
                <el-option
                    v-for="obj in objectList"
                    :label="obj"
                    :value="obj"
                    :key="obj"
                ></el-option>
            </el-select>
        </el-col>
        <el-col :span="4">
            <el-button type="primary" size="small" @click="showDialog" class="btn">+</el-button>
        </el-col>
    </el-row>
    <el-dialog width="30%" class="tags-modal-container" title="Add Object" :visible.sync="displayDialog">
        <el-row :gutter="10">
            <el-col style="height:1px" :span="5"></el-col>
            <el-col :span="12">
                <el-input v-model="newObject" placeholder="E.g. opty">
                </el-input>
                <span v-if="invalidValue" class="tag-validation">*Please enter valid name</span>
            </el-col>
            <el-col class="tag-save" :span="6">
                <el-button type="primary" size="small" @click="addObject">SAVE</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</div>
</template>

<script>
import EventBus from "@/EventBus";
import EntityService from "@/services/EntityService";
import IntentInfoService from "@/services/IntentInfoService";
import _ from "lodash";
import { parse } from 'path';
import async from 'async';
export default {
  name:"ObjectList",
  props: ["propData"],
  data() {
    return {
        object : [],
        objectList: [],
        displayDialog: false,
        newObject: null,
        system_domain : null,
        invalidValue : false,
        objectListRec : {}
    };
  },

  methods: {
      showDialog() {
            if(!this.system_domain || this.system_domain.includes('undefined'))
            {
                this.notifyError("Please select Domain & System")
                return;
            }
            this.displayDialog = true
        },
    async fetchObjects(system_domain) {
        if (!system_domain) {
            return;
        }
        this.objectListRec = await IntentInfoService.fetchByDomain(
            system_domain
        ).catch(error => {
            //this.notifyError("Error while fetching objects!!");
        });
        this.objectList = Object.keys(this.objectListRec.OBJECT_LIST) || [""]
    },
    async addObject() {
        if (_.isEmpty(this.newObject) || this.newObject.trim() === '') {
            this.invalidValue = true
            return
        }
        if(this.objectListRec['OBJECT_LIST'][this.newObject]){
            this.notifyError("Object already exist.");
            return
        }
        this.newObject = this.newObject.toUpperCase()
        this.invalidValue = false;
        this.objectListRec['OBJECT_LIST'][this.newObject] = [this.newObject]
        IntentInfoService.save(this.objectListRec)
            .then((res)=>{
                this.notifySuccess("Object added successfully");
                this.fetchObjects(this.system_domain);
                this.object.push(this.newObject);
                this.onChange()
            })
            .catch((err)=>{
                this.notifyError("Error while addding object");
                console.log(err);
            })
            .finally(() => {
                this.displayDialog = false
            })       
    },    
    onChange() {
        this.$emit("change", this.object);
    }
  },
  mounted() {
    },
    beforeMount() {
        EventBus.$on('ASSIGN_OBJECT', async (payload) => {
            if(payload.system_name && !payload.system_name.includes('undefined')){
                this.system_domain = payload.system_name;
                await this.fetchObjects(this.system_domain);
            }
            if(payload.object)
            {
                this.object = payload.object;
            }
            
        })
    },
};
</script>
<style>
.btn {
    margin-left: 20px;
}
</style>