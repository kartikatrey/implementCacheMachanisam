<template>
<div>
    <el-row>
        <el-col :span="20">
            <el-select
                v-model="entities"
                @change="onChange"
                cid="entity-tag-list-form-entity-select"
                :multiple="propData.multiple"
                placeholder="Select entities"
              >
                <el-option
                  v-for="(entity,index) in entityTagList"
                  :cid="'entity-tag-list-form-entity_'+index"
                  :key="entity"
                  :label="entity"
                  :value="entity"
                >
                </el-option>
              </el-select>
        </el-col>
        <el-col :span="4">
            <el-button cid="entity-tag-list-form-entity-add" type="primary" size="small" @click="showDialog" class="btn">+</el-button>
        </el-col>
    </el-row>
    <el-dialog width="30%" class="tags-modal-container" title="Add Tag" :visible.sync="displayDialog">
        <el-row :gutter="10">
            <el-col style="height:1px" :span="5"></el-col>
            <el-col :span="12">
                <el-input cid="entity-tag-list-form-entity-name" v-model="newEntity" placeholder="E.g. I-TOP">
                </el-input>
                <span v-if="invalidValue" class="tag-validation">*Please enter valid name</span>
            </el-col>
            <el-col class="tag-save" :span="6">
                <el-button cid="entity-tag-list-form-entity-save" type="primary" size="small" @click="addEntityTag">SAVE</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</div>
</template>

<script>
import EventBus from "@/EventBus";
import EntityTagListService from "@/services/EntityTagListService";


import _ from "lodash";
import { parse } from 'path';
import async from 'async';
export default {
  name:"EntityTagList",
  props: ["propData"],
  data() {
    return {
        entities : [],
        entityTagList: [""],
        displayDialog: false,
        newEntity: null,
        system_domain : null,
        invalidValue : false,
        entityTagListRec : {}
    };
  },

  methods: {
      showDialog() {
            if(!this.system_domain || this.system_domain.includes('undefined'))
            {
                this.notifyError("Please select Domain System")
                return;
            }
            this.displayDialog = true
        },
    async fetchEntityTagList(system_domain) {
        if (!system_domain) {
            return;
        }
        this.entityTagListRec = await EntityTagListService.fetchTagListByDomain(
            system_domain
        ).catch(error => {
            // this.notifyError("Error while fetching objects!!");
        });
        this.entityTagList = this.entityTagListRec.ENTITY_LIST;
    },
    async addEntityTag() {
        if (_.isEmpty(this.newEntity)) {
            this.invalidValue = true
            return
        }
        this.newEntity = this.newEntity.toUpperCase()
        this.invalidValue = false;
        this.entityTagListRec['ENTITY_LIST'] = _.uniq(_.concat(this.entityTagListRec['ENTITY_LIST'], this.newEntity))
        EntityTagListService.save(this.entityTagListRec)
            .then((res)=>{
                this.notifySuccess("Entity added successfully");
                this.fetchEntityTagList(this.system_domain);
                _.isArray(this.entities) && this.entities.push(this.newEntity);
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
        this.$emit("change", this.entities);
    }
  
  },
  mounted() {
    },
    beforeMount() {
        EventBus.$on('ASSIGN_ENTITIES', async (payload) => {
            if(payload.system_name && !payload.system_name.includes('undefined')){
                this.system_domain = payload.system_name;
                await this.fetchEntityTagList(this.system_domain);
            }
            if(payload.entities)
            {
                this.entities = payload.entities;
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