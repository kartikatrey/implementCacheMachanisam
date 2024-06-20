




 <template>
 <div  class="object-container b-rad-10">
<div class="obj-name obj-name-container">
  <!-- header -->
    <el-input :ref="`${objectIndex}_object`" v-bind:class="{editable:objectModified}" :disabled="!objectModified" v-model.trim="objectMapping.objectName">{{objectMapping.objectName}}</el-input>
    <!-- Edit Icon -->
    <i v-on:click="objectModified=true" v-show="!objectModified" class="mdi mdi-border-color"></i> 
    <!-- Save Icon -->
    <i v-on:click="modifyObjectName(objectMapping.objectName)" v-show="objectModified" class="mdi mdi-check"></i>  
    <p class="error-msg-object" :ref="`${objectIndex}_error`"></p>
         
  <!-- End header -->

    <div class="right-icon-set">
      <span v-show="expandCard" v-on:click="expandCard=false"> - </span>
      <span v-show="!expandCard" v-on:click="expandCard=true"> + </span>
     <i v-on:click="$emit('deleteObjectMapping', objectMapping, objectIndex);" class="mdi mdi-delete"></i>
    </div>
    </div>
      <div v-show="expandCard" class="object-body">
        <div v-for="(tagToFieldMapping, fieldTagMappingIndex) in objectMapping.tagFieldMapping" :key="fieldTagMappingIndex" class="tagname-container">
          <div class="tagname-left">
              <el-input class="tagname" @blur="handleTagOnBlur($event,tagToFieldMapping.tag,fieldTagMappingIndex)"  v-model.trim="tagToFieldMapping.tag" placeholder="Tag Name/ID" :ref="`${objectIndex}_${fieldTagMappingIndex}_tag`"></el-input>              
               <p class="error-msg" :ref="`${objectIndex}_${fieldTagMappingIndex}_tag_error`"></p>
          </div>
         

          <div class="tagname-code-area-container">
            <codemirror @onBlur="handleFieldOnBlur(tagToFieldMapping.field, fieldTagMappingIndex)" v-model.trim="tagToFieldMapping.field" :ref="`${objectIndex}_${fieldTagMappingIndex}_field`" ></codemirror>  
            <p class="error-msg" :ref="`${objectIndex}_${fieldTagMappingIndex}_field_error`"></p>
          </div>
          
          <el-button class="btn-addtag" type="text" v-on:click="removeTag(fieldTagMappingIndex)">- REMOVE TAG</el-button>
        </div>
        <el-button class="" type="primary" size="small" v-on:click="addTag()">+ ADD TAG</el-button>     
      </div> 
    </div> 
</template>

<script>
import Codemirror from "../../components/Codemirror.vue";
import Json from "@/util/Json";

export default {
    name: "FieldTagMappingCard",
    components: {
        Codemirror
    },
    props: ["fieldTagObjectMapping", "objectMapping", "objectIndex"],
    data() {
        return {
            objectModified: false,
            expandCard: true
        };
    },
    methods: {

        modifyObjectName(updatedObjectName) {
            let objectIndex = `${this.objectIndex}_object`
            let objectErrorIndex = `${this.objectIndex}_error`
            let errorMessage = this.validateObjectName(updatedObjectName)
            if (errorMessage) {
                this.addObjectError(objectIndex, objectErrorIndex, errorMessage);
                return false;;
            }
            this.removeObjectError(objectIndex, objectErrorIndex);
            this.objectModified = !this.objectModified;
        },

        addObjectError(objectIndex, objectErrorIndex, errorMessage) {
            this.$refs[objectErrorIndex].innerText = errorMessage;
            this.$refs[objectIndex]["$el"].classList.add('error-border');
        },

        removeObjectError(objectIndex, objectErrorIndex, errorMessage) {
            this.$refs[objectErrorIndex].innerText = '';
            this.$refs[objectIndex]["$el"].classList.remove('error-border');
        },

        removeTag(fieldTagMappingIndex) {
            let rowIndex = this.getRowIndex(fieldTagMappingIndex);
            this.objectMapping.tagFieldMapping.splice(fieldTagMappingIndex, 1)
            this.$emit('removeErrorFields', rowIndex)
        },

        handleFieldOnBlur(field, fieldTagMappingIndex) {
            let rowIndex = this.getRowIndex(fieldTagMappingIndex);
            let fieldIndex = `${rowIndex}_field`
            let fieldErrorIndex = `${rowIndex}_field_error`
            if (!Json.isJson(field)) {
                this.addError(fieldIndex, fieldErrorIndex, 'Please input correct JSON format for field value');
                return;
            }
            this.removeError(fieldIndex, fieldErrorIndex);
        },

        handleTagOnBlur(event, tagName, fieldTagMappingIndex) {
            let rowIndex = this.getRowIndex(fieldTagMappingIndex);
            let tagIndex = `${rowIndex}_tag`
            let tagErrorIndex = `${rowIndex}_tag_error`
            let error = this.validateTagName(tagName, fieldTagMappingIndex);
            if (error) {
                this.addError(tagIndex, tagErrorIndex, error);
                return;
            }
            this.removeError(tagIndex, tagErrorIndex);
        },

        getRowIndex(fieldTagMappingIndex) {
            return `${this.objectIndex}_${fieldTagMappingIndex}`
        },


        addError(fieldIndex, errorIndex, errorMessage) {
            this.$refs[errorIndex][0].innerText = errorMessage;
            this.$refs[fieldIndex][0]["$el"].classList.add('error-border');
            this.$emit('addErrorFields', fieldIndex);
        },

        removeError(fieldIndex, errorIndex) {
            this.$refs[errorIndex][0].innerText = '';
            this.$refs[fieldIndex][0]["$el"].classList.remove('error-border');
            this.$emit('removeErrorFields', fieldIndex);
        },

        addTag() {
            this.objectMapping.tagFieldMapping.push({});
            let objectMappingindex = `${this.objectIndex}_${this.objectMapping.tagFieldMapping.length-1}`;
            let tagIndex = `${objectMappingindex}_tag`;
            let fieldIndex = `${objectMappingindex}_field`;
            this.$emit('addErrorFields', [tagIndex, fieldIndex]);
        },

        validateObjectName(objectName) {
            let error;
            if (!_.isEmpty(objectName)) {
                if (_.countBy(_.map(this.fieldTagObjectMapping, (fieldTagObject) => {
                        return fieldTagObject.objectName.toUpperCase()
                    }))[objectName.toUpperCase()] > 1)
                    error = 'Object name already exist'
            } else {
                error = 'Object name can not be empty'
            }
            return error;
        },


        validateTagName(tagName, fieldTagMappingIndex) {
            let error;
            if (!_.isEmpty(tagName)) {
                if (_.countBy(_.map(this.objectMapping.tagFieldMapping, (tagFieldMapping) => {
                        return tagFieldMapping.tag.toUpperCase()
                    }))[tagName.toUpperCase()] > 1)
                    error = 'Tag name already exist'
            } else {
                error = 'Tag name can not be empty'
            }
            return error;
        },
    },

}
</script>
<style lang="scss">
.error-msg {
    color: #F82533;
    font-size: 12px;
    line-height: 1;
    width: 100%;
    display:block;
}

.error-msg-object {
    color: #F82533;
    font-size: 12px;
    line-height: 1;
    width: 100%;
    display:inline;
}
.error-border{
border: 1px solid #F82533;
}
.tagname-left {
      display: inline-block;
      .tagname{
        .el-input__inner{
            text-transform: uppercase;
        }
      }

}
</style>

