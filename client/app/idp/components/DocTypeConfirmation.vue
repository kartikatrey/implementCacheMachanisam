<template>
   <el-main class="document-type-confirmation" v-loading="loading">
      <div class="inner-body">
         <div class="pages-container">
            <img :src="document_urls[activeIndex]" crossorigin="anonymous"></img>
         </div>
		 <div class="document-types-selection">
			 
		  <section class="page-body">
         <section class="form-page-container">
            <div class="panel" >
               <div class="panel-body">
				    <el-form label-position="left"  >
						  <el-row >
								<el-col :span="12">
								<div class="kp-form-group">
									<el-form-item v-for="(item,index) in payload" v-if="activeIndex == index" prop="type" label="Document Type">
										<el-select
											class="select-box"
											size="large"
											v-model="item.type"
											cid="error-code-form-error-type-select"
											placeholder="Please select error type"
										>
											<el-option
											v-for="(item, index) in document_type_list"
											:key="item"
											:label="item.label"
											:value="item.value"
											label-width="170px"
											></el-option>
										</el-select>
									</el-form-item>
								</div>
								</el-col>
							</el-row>


						 </el-form>
               </div>
            </div>
         </section>
         </section>
		  </div>
      </div>
      <footer id="add-user-footer" class="document-type-confirmation-footer">
         <div class="page-actions">
            <el-button
               class="action-button"
               icon="mdi mdi-chevron-left"
			   :disabled="activeIndex==0"
               @click="leftPage"
               circle
               ></el-button>
            <el-button
               class="action-button"
               icon="mdi mdi-chevron-right"
			   :disabled="!(activeIndex<totalPages)"
               @click="rightPage"
               circle
               ></el-button>
			   <span>{{activeIndex + 1}}/{{totalPages}}</span>
         </div>
         <el-button size="small" @click="saveClassification" type="primary"
            >Save</el-button
            >
         <el-button size="small" @click="toggleClassificationDialog"
            >Close</el-button
            >
      </footer>
   </el-main>
</template>

<script>
import DocumentService from "@/idp/services/DocumentService";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
export default {
	name: "DocTypeConfirmation",
	props: ["documentId"],
	data() {
		return {
			document_urls: [],
			activeIndex: 0,
			totalPages: 0,
			payload: [],
			loading:true,
		};
	},
	// watch: {
	// 	emailList: {
	// 		handler: function(newVal, oldval) {
	// 			this.emails = this.selectedEmails = lodash.clone(newVal);
	// 		}
	// 	}
	// },
	methods: {
		rightPage() {
			if (this.activeIndex < this.totalPages - 1) {
				this.activeIndex++;
			}
		},
		leftPage() {
			if (this.activeIndex > 0) {
				this.activeIndex--;
			}
		},
		async getDocumentType(){
			let docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({document_type:{$exists:true}});
			this.document_type_list = CustomerConfig.getDocumentTypeList(docTypeConfig);
		},
		async saveClassification() {
			this.loading = true;
			// 1) update Classification result
			const payLoad = {
					action:'update_classification_result',
					doc_id:this.documentId,
					classification_result:{auto_learning_classification_result: this.payload, doc_id: this.documentId}
				};
			const updateDebugDataResponse = await DocumentService.processAction(payLoad);
			this.loading = false;
			// 3) Move document
			this.$emit("successCB",this.payload);
			this.toggleClassificationDialog();
		},
		toggleClassificationDialog() {
			this.$emit("toggleClassificationDialog");
		},
		async getFileUrls() {
			try {
				let file_urls = await DocumentService.getFileUrl({
					id:  this.documentId
				});

				this.document_urls = file_urls;
				this.totalPages = file_urls && file_urls.length;
				this.document_urls.map((url, index) => {
					this.payload.push({ type: "other", page_no: index+1 });
				});
			} catch (err) {
				console.log("error in load images of doc viewer", err);
			}finally{
				this.loading = false;
			}
		}
	},
	beforeMount() {},
	async mounted() {
		this.getFileUrls();
		this.getDocumentType();
	}
};
</script>

<style lang="scss">
.document-type-confirmation {
	height:100%;
	.inner-body {
		display: flex;
		.pages-container {
			flex: 3;
			img {
				width: 100%;
				// height: 100%;
				object-fit: fill;
			}
		}
		.document-types-selection {
			flex: 2;
		}
	}
	.document-type-confirmation-footer {
		.page-actions {
			width: 25%;
			text-align: center;
			position: absolute;
			padding: var(--space-xs) var(--space-sm);

			.action-button {
				width: 16px;
				height: 22px;
				background: transparent;
				border: 0;
				color: var(--white);
				padding: 0;
				font-size: 1.4rem;
				margin: 0;
			}
		}
	}
}
</style>
