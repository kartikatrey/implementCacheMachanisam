<template>
	<div
	    v-loading="loading"
		class="package-viewer-container"
		:class="isPackageViewerOpen ? 'viewer-open' : 'viewer-collapse'"
	>
		<!-- Accord action button  -->
		<div class="action-container">
			<el-button
				type="text"
				icon="mdi mdi-menu-down"
				class="toggle-action-button"
				@click="handlePackageViewer"
			>
			</el-button>
		</div>
		<div class="accord-pages-container">
			<div class="accord-pages">
				<div
					class="accord-pages-loop"
					v-for="(item, index) in packageFormData"
					v-bind:key="index"
				>
					<DocumentCard
						@click.self="accordPageSelection(item.id)"
						:isPackageViewerOpen="isPackageViewerOpen"
						:data="item"
						:accordPageSelection="accordPageSelection"
						:defaultId.sync="defaultId"
						@onCardChange="onCardChange"
						@uploadForm="showDocumentSelectDialog"
						@unlinkForm="unlinkForm"
					/>
				</div>
			</div>
			<div class="accord-pages-action">
				<!-- <ActionButtons :documentType="parentRecord.document_type" :documentId="parentRecord._id"/> -->
				<ActionButtons :documentId="parentRecord._id" source="PackageBar" :isDocumentReadOnly="isDocumentReadOnly" />
            
			</div>
		</div>
		
	    <idp-upload @closeDialog="handleCloseUploadModal" v-if="showUploadModal" :data="uploadParams" :multiple="false" ref="upload" :showHeaderTabs="false"></idp-upload>
		<DocumentSelectList v-if="displayListView" :displayListView.sync="displayListView" :extraQueryParam="docSelectListProps"  @handleDocumentSelectModalClose="handleDocumentSelectModalClose" @openUploadDialog="openUploadDialog" @addDocument="handleAddForm">
				    		<div slot-scope="{openSelectList}">      
								<h3 class="saperator">OR</h3>   
								<div class="upload-doc">
									<span>Upload document</span><el-button size="small" type="primary" @click="openSelectList">Upload</el-button>
								</div>
							</div>
		</DocumentSelectList>
		
	</div>
</template>

<script>
import {getQueryFilter} from "@/util/CommonUtil";


import DocumentCard from "./DocumentCard.vue";
import DocumentPackageService from "@/idp/services/DocumentPackageService";
import IdpUpload from "@/idp/components/IdpUpload";
import DocumentSelectList from "@/idp/components/DocumentSelectList";
import DocumentService from "@/idp/services/DocumentService";
import ActionButtons from "@/idp/components/ActionButtons";
import Constants from "@/resources/Constants";
import ActionButtonConfig from "@/idp/services/ActionButtonConfig";
import {mapState} from 'vuex';
export default {
	name: "PackageBar",
	props: ["isPackageViewerOpen","viewerLoading"],
	components: { DocumentCard, IdpUpload, DocumentSelectList, ActionButtons},
	data() {
		return {
			defaultId: "", // This is the always form id or null if view is package
			packageForms: [],
			documentType:'',
			displayListView:false,
			loading:false,
			parentRecord:null,
			showUploadModal:false,
			actionButtonList:[] 
		};
	},
	computed:{
		...mapState("documentViewStore",{
            packageFormData: state => state.packageFormData,
		}),
			docSelectListProps(){
				return{					
					document_type:this.documentType,
					active:true,
					type:{ $ne: 'package' }
				}
			}
	},
	mounted() {
		this.defaultId = this.$route.query.defaultId;
		this.init();
	},
	
	methods: {


		handleCloseUploadModal(){
			this.showUploadModal = false;
			this.displayListView = true;
		},

		async handleDocumentSelectModalClose(){
			this.selectedFormParams = null;
		},

		async init() {
			this.loading = true;
			this.$emit('update:viewerLoading', true)
            const {package_forms, parent_record} = await this.getPackageInfo();
			this.$store.commit("documentViewStore/setPackageFormData",package_forms);
			this.packageForms = package_forms;
			this.parentRecord = parent_record;
            const defaultId = this.$route.query.defaultId;
            let id;
            // Check if defauult is valid

            const validDefaultIdPackage = this.packageForms.find(item=>(defaultId && item.id == defaultId));
            if(validDefaultIdPackage){
                id = this.$route.query.defaultId;
                this.documentType = validDefaultIdPackage.document_type
            }else if(this.packageForms.length){
                let validForm = this.packageForms.find(item=>item.id != undefined);
                if(!validForm){
                    this.notifyError('No valid package found');
                    this.goToPackageList();
                    return;

                }
                this.documentType = validForm.document_type;
                id = validForm.id; // set first document from packages and render

            }
			console.log("getActionButtons:::")
            const actionButtons = await this.getActionButtons()
			console.log("getActionButtons:::",actionButtons)

            this.$store.commit("actionButtonStore/setPackageBarActionButtons", actionButtons);
	        this.defaultId = id;
			this.loading = false;
			this.$emit('update:viewerLoading', false)
            this.$emit("renderDocument", id);
        },

		onCardChange(){
            this.init();
        },

        async getActionButtons(){
				const response = await ActionButtonConfig.getActions(
					{
						active: true,
						view_name: "PackageBar",
						document_type: this.documentType,
						// roles: { $in: roles },
						document_id: this.parentRecord._id,
					},
					[
						"view_name",
						"document_type",
						"advanced_script",
						"roles",
						"name",
						"is_platform",
					]
					);
					// response.status && this.$store.commit("actionButtonStore/setPackageBarActionButtons",response.action_list)
					return response.status ? response.action_list : [];
		},
    
		async handleAddForm(document){
			try{
					if(!(document.state == Constants.DOCEX.STATE_UPLOADED.SUCCESS && document.stage == Constants.DOCEX.STAGE.EXTRACTED && !document.is_multi_documents_present)){
						this.notifyError('Please select valid document')
						return;
					}

				  let messagePrefix = (document.document_subtype !== this.selectedFormParams.name) ? `form type will change from ${document.document_subtype} to ${this.selectedFormParams.name}.`:'';
				  let flag = await this.$confirm(
						messagePrefix+`Are you sure you want to link the form?`,
						"Confirmation",
						{
							confirmButtonText: "Confirm",
							cancelButtonText: "Cancel",
							type: "warning"
						}
				).catch(error => false);
				if(!flag)return;
				//do we need to change applicant_name as well?
				const payload = {
					type:'package',
					document_subtype: this.selectedFormParams.name,
					parent_document_id: this.$route.query.id,
					_id:document._id
				}
				await DocumentService.update(payload);
				this.displayListView = false;
				this.notifySuccess("Document added succesfully");
			}
			catch(err){
				console.log(err)
			}			
			this.init();
		},

		openUploadDialog(){
			this.displayListView = false;
			let uploadParams = {};
			uploadParams.service_name = "docExService";
            uploadParams.document_type =  this.documentType
			uploadParams.document_subtype =  this.selectedFormParams.name; 
            uploadParams.directory_path = this.parentRecord.folder_path;
            this.uploadParams = uploadParams;
			this.showUploadModal = true;
		},

		showDocumentSelectDialog(data) {
			  this.selectedFormParams = data;
              this.displayListView = true;
        },


		toggleAccordContainer() {
			this.$emit("update:isPackageViewerOpen", !this.isPackageViewerOpen);
		},
		openPackageViewer() {
			this.$emit("update:isPackageViewerOpen", true);
		},
		handlePackageViewer() {
			this.isPackageViewerOpen
				? this.closePackageViewer()
				: this.openPackageViewer();
		},
		closePackageViewer() {
			this.$emit("update:isPackageViewerOpen", false);
		},
		
		async accordPageSelection(id) {
			if(this.$store.getters["documentViewStore/hasDataChanged"]){
				let confirm = await this.$confirm(Constants.DOCEX.UNSAVED_CHANGES, 'Confirm', {
					confirmButtonText: 'Cancel',
					cancelButtonText: 'Discard Changes'
				}).catch(()=>{})
				if(confirm){
					return
				}
			}
			if (!id) {
				console.log("clicked on non detected form");
				return;
			}
			if(this.defaultId == id)return;
			this.defaultId = id;
			this.$emit("renderDocument", id);
		},
		async getPackageInfo() {
			const id = this.$route.query.id;
			const response = await DocumentPackageService.get({ id });
			return response;
		},

		async unlinkForm(id){
			let flag = await this.$confirm(
				`Are you sure you want to unlink form?`,
				"Confirmation",
				{
					confirmButtonText: "Confirm",
					cancelButtonText: "Cancel",
					type: "warning"
				}
			).catch(error => false);
			if (!flag) return;
			let shouldDeletePackage = false;
			if((this.packageForms.filter(form=>form.id)).length == 1){
							shouldDeletePackage = await this.$confirm(
						`Do you also want to remove package?`,
						"Confirmation",
						{
							confirmButtonText: "Confirm",
							cancelButtonText: "Cancel",
							type: "warning"
						}
					).catch(error => false);
			}

			let updatePayload = {
				_id: id,
				parent_document_id: null,
				type:null
			};
			try {
				this.loading = true;
				await DocumentService.findByIdAndUpdate(
					updatePayload
				);

				//delete package if all forms are unlinked.
				shouldDeletePackage && await DocumentService.deleteDocumentRecord(this.parentRecord._id);
				this.loading = false;
				this.notifySuccess("Document unlinked successfully");
				shouldDeletePackage && this.goToPackageList();
			} catch (error) {
				this.loading = false;
				return this.notifyError(
					`Something went wrong while changing Assignment`
				);
			} finally {
				!shouldDeletePackage && this.init()
			}
		},


		goToPackageList() {
            const filter = getQueryFilter();
            const path = this.getPath(this.documentType) || `/idp/package/${this.documentType}`;
            this.$router.push({
                path,
                query: {
                    filter: JSON.stringify(filter || {})
                }
            });
        },
		// route map for static list pages
		getPath(documentType) {
            const routeMap = {
                "insurance": "/idp/insurance-document-list"
            }
            return routeMap[documentType];
        },
	}
};
</script>
<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";



.package-viewer-container {
	position: relative;
	// z-index: 9999;
	bottom: 0;
	width: 100%;
	background: transparent;
	height: 122px;
	border-top: 1px solid var(--dark-06);
	// padding-top: 10px;
	box-shadow: rgba(0, 0, 0, 0.14%) 0px -3px 12px;

	.action-container {
		z-index: 100;
		position: absolute;
		left: 37%;
		text-align: center;
		margin-bottom: -2px;
		background: transparent;
		    top: -23px;
			// box-shadow: rgba(0, 0, 0, 0.11%) 0px -13px 10px;
		button {
			border-radius: 7px 7px 0 0;
			line-height: .8rem;
    		padding: 0 1.2rem;
			display: block;
			background:transparent;
			// border-top: 1px solid var(--dark-06);
			// border-left: 1px solid var(--dark-06);
			// border-right: 1px solid var(--dark-06);
			background-image: url("../../assets/acord/arrow-bg.png");
			    background-size: 71.2px 23px;
   			 width: 71px;
			
			i {
				font-size: 2.7rem;
				display: inline-block;
				padding-top: 0.3rem;
				transform-origin: center;
				transition: all 0.3s ease-in-out;
				transform-origin: 16px 11px;
			
			}
		}
		.el-button--text:hover {
			color: var(--brand-04);
		}
		 .el-button--text:focus {
			color: var(--brand-04);
		}
	}
	.package-viewer-tab-container {
		display: flex;
		background: white;
		.package-tabs {
			overflow: auto;
			flex: 5;
			border-right: 1px solid grey;
			.el-button-group {
				display: flex;
				flex-wrap: no-wrap;
				overflow-x: auto;
				justify-content: center;
				button {
					border: none;
				}
			}
			.selected-accord {
				border-top: 2px solid #696cc3 !important;
				color: #696cc3;
				border-radius: 0px;
				font-weight: 700;
			}
			.error-on-form {
				color: var(--red-02);
			}
		}
	}
	.accord-pages-container {
		display: flex;
		background: white;
		overflow: auto;
		height: 100%;
		.accord-pages {
			flex: 1;
			display: flex;
			flex-wrap: no-wrap;
			overflow-x: auto;
			// justify-content: center;
			
		}
		.accord-pages-action {
			flex: .43;
			border-left: 2px solid var(--dark-07);
				.action-buttons {
					padding-top: 3rem;
    				display: flex;
					padding-left: 2rem;
						span {
							.el-button {
								margin-right: var(--space-md);
							}
						}
						.el-button {
								margin-right: var(--space-md);
							}
						.el-dropdown .el-button-group  {
							display: flex;
								.el-button {
									margin-right: 0;
								}
						}
				}
		}
	}
}
.viewer-open {
	.action-container {
		// top: -51%;
	}
	.accord-pages-container {
		.accord-pages {
			.accord-pages-loop {
				height: 90px;
				padding-left: 1.125rem;
			}
		}
	}


}
.package-viewer-container.viewer-collapse {
	padding-top: 0 !important;
		.document-card-container {
			padding-top: 0 !important;
		}
}
.viewer-collapse {
	.action-container {
		// top: -140%;
	}
	.accord-pages-action { 
			.action-buttons {
					padding-top: 0rem !important;
    				display: block;
					padding-left: 2rem;
				}
	}
	.accord-pages-container {
		.accord-pages {
			.accord-pages-loop {
				height: 20px;
			}
		}
	}
	.thumbanil-card-label {
 		line-height: 3.5rem;
		     padding: 0 1rem;
   		 display: inline-block;
			font-size: var(--font-md);
	}
	.selected-accord-label {
		color: var(--brand-04);
		border-top: 2px solid var(--brand-04) !important;
		border-radius: 0px;
		// font-weight: 700;
		   
	}
	.toggle-action-button {
		i {
		
			transform: rotate(180deg);
			transform-origin: center;
		}
	}
	
	.thumbnail-card-container {
		display: none;
	}
	.selected-arrow {
		display: none;
	}
	.document-card-actions-container {
		display: none;
		
	}
}


.alternate-option {

	.saperator {
		display: flex;
		flex-direction: row;
		width: 150px;
		margin: 0 auto;
		font-weight: 100;
		padding: 1.5rem 0;
	}

	.saperator:before, .saperator:after{
		content: "";
		flex: 1 1;
		border-bottom: 1px solid var(--dark-08);
		margin: auto;
	}
	.saperator:before {
		margin-right: 10px
	}
	.saperator:after {
		margin-left: 10px
	}

	.upload-doc {
		display: flex;
		justify-content: center;
		padding-bottom: 1rem;
			& > span {
				padding-right: 2rem;
				font-size: var(--font-pagetile);
				color: var(--dark-02);
			}
	}

}
</style>
