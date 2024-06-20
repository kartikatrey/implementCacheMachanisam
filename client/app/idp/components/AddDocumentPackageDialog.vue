<template>
	<el-dialog
		title="Add to package"
		custom-class="reason-config-wrap"
		:visible.sync="addDocumentPackageVisible"
		@close="closeRejectDialog"
		:show-close="true"
		:close-on-click-modal="false"
		:destroy-on-close="true"
		:before-close="closeDialog"
		center
		element-loading-spinner="el-icon-loading"
		width="25%"
	>
		<div class="inner-body">
			<el-form
				:model="addDocPackageForm"
				ref="addDocPackageForm"
				label-width="0px"
				:rules="formRules"
			>
				<!-- Select package type -->
				<el-row>
					<div class="kp-form-group">
						<el-form-item
							class="control-label col-sm-2"
							prop="package_name"
						>
							<el-select
								style="padding-left: 0px"
								class="select-box"
								size="large"
								v-model="addDocPackageForm.package_name"
								filterable
								reserve-keyword
								cid="add-document-package-dialog-type-select"
								placeholder="Select package"
							>
								<el-option
									v-for="(type, index) in [
										'Health Insurance',
										'Property Insurance',
										'Travel Insurance'
									]"
									:cid="
										'add-document-package-dialog_' + index
									"
									:key="type"
									:label="type"
									:value="type"
									label-width="170px"
								></el-option>
							</el-select>
						</el-form-item>
					</div>
				</el-row>

				<div class="separator">
					<div class="line"></div>
					<span class="label">OR</span>
					<div class="line"></div>
				</div>

				<div class="create-package-label">Create package name</div>

				<!-- Customer name -->
				<el-row>
					<div class="kp-form-group">
						<el-form-item
							class="control-label col-sm-2"
							prop="customer_name"
						>
							<el-input
								cid="customer_name_type"
								class="form-control"
								prop="customer_name"
								v-model="addDocPackageForm.customer_name"
								placeholder="Enter Customer Name"
							></el-input>
						</el-form-item>
					</div>
				</el-row>
				<!-- Project Name -->
				<el-row>
					<div class="kp-form-group">
						<el-form-item
							class="control-label col-sm-2"
							prop="project_name"
						>
							<el-input
								cid="project_name_type"
								class="form-control"
								prop="project_name"
								v-model="addDocPackageForm.project_name"
								placeholder="Enter Customer Name"
							></el-input>
						</el-form-item>
					</div>
				</el-row>
			</el-form>
		</div>
		<footer id="add-user-footer">
			<el-button
				size="small"
				cid="reason-config-form-add"
				@click="addDocumentPackage"
				type="primary"
				>Add</el-button
			>
			<el-button
				size="small"
				cid="reason-config-form-done"
				@click="closeDialog"
				>Cancel</el-button
			>
		</footer>
	</el-dialog>
</template>
<script>
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import DocumentService from "@/idp/services/DocumentService";
import RejectReasonService from "@/idp/services/RejectReasonService";

export default {
	name: "AddDocumentPackageDialog",
	components: {},
	props: ["addDocumentPackageVisible", "addDocPackageData"],
	data() {
		var EmptyValueValidator = (rule, value, callback) => {
			if (value && ("" + value).trim() === "") {
				callback(new Error("Please enter valid label name"));
			} else {
				callback();
			}
		};

		const emailValidator = (rule, value, callback) => {
			var emails = value;
			if (emails) {
				emails = emails.split(",");
			}

			var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			for (var i = 0; i < emails.length; i++) {
				// Trim whitespaces from email address
				emails[i] = emails[i].trim();

				// Check email against our regex to determine if email is valid
				if (emails[i] == "" || !regex.test(emails[i])) {
					callback(
						new Error("Please enter valid email separated by ,")
					);
				}
			}
			callback();
		};
		return {
			attachments: [],
			rejectReasons: [],
			handler: "reject_attachment",
			showModal: false,
			body: "",
			loading: false,
			addDocPackageForm: {},
			formRules: {
				label: [
					{
						required: true,
						message: "Please enter label",
						trigger: "blur"
					}
				],
				value: [
					{
						required: true,
						message: "Please enter label",
						trigger: "blur"
					}
				],
				document_type: [
					{
						required: true,
						message: "Please select document type",
						trigger: "change"
					}
				]
			},
			customToolbar: [
				["bold", "italic", "underline", "strike"],
				[
					{ align: "" },
					{ align: "center" },
					{ align: "right" },
					{ align: "justify" }
				],
				["blockquote", "code-block"],
				[{ list: "ordered" }, { list: "bullet" }, { list: "check" }]
			],

			loading: false
		};
	},
	methods: {
		addDocumentPackage() {
			alert("addDocumentPackage");
		},
		closeDialog() {
			this.$emit("handleDocumentPackageDialog", false);
		},
		closeRejectDialog() {
			this.$emit("handleDocumentPackageDialog", false);
			this.loading = false;
			// this.$refs["form"].resetFields();
			// this.clearDialogValues();
			// _.each(this.attachments, doc => {
			// 	if (doc.reject_attachment) {
			// 		this.removeAttachment(doc);
			// 	}
			// });
		},
		showUploadModal() {
			this.showModal = true;
			this.$forceUpdate();
		},
		closeUploadDialog() {
			this.showModal = false;
			this.$refs.upload.$refs.upload.fileList = [];
			this.$refs.upload.$refs.upload.outputData = [];
			this.getRejectAttachments();
		},
		async send() {
			let isValid = await this.$refs.form.validate().catch(error => {});
			if (!isValid) {
				this.loading = false;
				return;
			}
			this.loading = true;
			let payload = {
				receiver: this.form.receiver,
				subject: this.form.subject,
				body: this.body,
				document_id: this.documentData._id,
				rejected_reason: this.form.rejected_reason
			};
			let refreshPageFlage=false;
			 try{
				const docResponse = await DocumentService.rejectDocument(payload)
				if(docResponse.status){
					this.notifySuccess(docResponse.message);
					refreshPageFlage = true
					
				}else{
					this.notifyError(_.get(docResponse, "message", "Something went wrong!"))
				}
			}catch(e){
				console.log(e);
				this.notifyError("Something went wrong while rejecting document.");
			}
			finally{
				this.closeRejectDialog();
				this.clearDialogValues();
				if(refreshPageFlage)
				{
					this.$emit("refreshPage");
				}
			}
		},
		clearDialogValues() {
			this.body = null;
			this.form.subject = null;
			this.form.receiver = null;
		},
		async getRejectAttachments() {
			this.attachments = await DocumentService.getDocumentAttachments({
				document_id: this.documentData._id,
				reject_attachment: true,
				active: true
			});
			this.attachments.unshift(this.getOriginalDocument());
		},
		handleRejectUpload() {
			let uploaded_attachment_length =
				this.$refs.upload && this.$refs.upload.fileList.length;
			let configured_doc_count = this.customerConfiguration
				.max_number_of_attachments_per_doc;
			let current_document_attachment_count =
				this.attachments && this.attachments.length;
			if (
				current_document_attachment_count + uploaded_attachment_length >
				configured_doc_count
			) {
				this.notifyError(
					`Maximum ${configured_doc_count} attachments are allowed including original invoice`
				);
				return;
			}
			this.$refs.upload.$refs.upload.active = true;
		},
		async fetchDetails() {
			try {
				let response = await RejectReasonService.get({
					document_type: this.documentData["document_type"]
				});
				response = _.get(response, "data.data") || [];
				this.rejectReasons = _.filter(response, {
					document_type: this.documentData["document_type"]
				});
			} catch (exception) {
				console.log(exception);
			} finally {
			}
		}
	},
	beforeMount() {
		// EventBus.$on("upload_clicked_reject_attachment", () => {
		// });
	}
};
</script>
<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

// reject invoice container start
div.el-dialog.reject-invoive-container {
	margin: 0;
	position: absolute;
	bottom: 0;
	right: 5rem;
	border-radius: 0.7rem 0.7rem 0 0;
	margin-top: 0;
	// padding: var(--space-lg);
	header {
		display: flex;
		justify-content: flex-end;
		background: 0;
		padding: 0;
		span {
			margin-left: 0;
			margin-right: auto;
			font-weight: 500;
			color: var(--dark-01);
			padding: 0;
			font-size: var(--font-lg);
		}
		.actions {
			.el-button {
				padding: 0;
				color: var(--dark-01);
				margin: 0 var(--space-sm);
				font-size: 1.4rem;
				&:hover {
					color: var(--brand-03);
					font-weight: 500;
				}
			}
		}
	} // header
	.email-body {
		// padding: var(--space-lg) 0;
		white-space: normal;
		.email-details {
			.el-form-item.item-subject {
				margin-bottom: 0;
			}
			.el-form-item {
				border-bottom: 1px solid var(--dark-06);
				margin: 0;
				.el-form-item__error {
					// margin-left: -60px;
				}
				.el-textarea {
					.el-textarea__inner {
						margin: 0;
						border: 0;
						line-height: 1.4;
						padding: 0.3rem 4rem 0 0;
						height: 32px;
						resize: unset;
					}
				}
				.el-form-item__label {
					text-align: left;
					color: var(--dark-04);
					font-size: var(--font-base);
					&:before {
						display: none;
					}
				}
				.btn-acc {
					position: absolute;
					right: 2rem;
				}
				.el-form-item__content .el-input {
					line-height: 2.6;
					.el-input__inner {
						padding: 1.2rem 0;
						font-size: 1.2rem;
						&::placeholder {
							// color: var(--dark-01);
							// font-size: var(--font-lg);
						}
					}
					.el-input-group__prepend {
						background: transparent;
						border: 0;
						padding: 0 0.5rem 0 0;
					}
				}
			}
			// .reason-select-container {
			//         .el-form-item__content{
			//             .el-input__inner {
			//               font-size: var(--font-base) !important;
			//             &::placeholder {
			//               color: var(--dark-01);
			//               font-size: var(--font-base) !important;
			//             }
			//       }
			//   }
			// }
		} // emqail details

		.email-message {
			padding: 0;
			color: var(--dark-01);
			min-height: 200px;
			max-height: 300px;
			// overflow: auto;
			#message-editor {
				height: 160px;
				overflow: hidden;
			}
		}
		.attached-wrap {
			max-height: 100px;
			height: 73px;
			overflow: auto;
			margin-top: 1rem;
			// .attached-file {
			//   display: block;
			//   justify-content: flex-start;
			//  border-radius: unset;
			//   line-height: 3.2rem;
			//   width: 100%;
			//   overflow: hidden;
			span {
				margin-left: 0;
				margin-right: auto;
				color: var(--brand-03);
				margin-top: 0;
				background: transparent;
				border: 0;
				border-bottom: 1px solid var(--dark-06);
				font-size: var(--font-base);
				border-radius: unset;
				padding: 0.3rem 0;
				box-sizing: content-box;
				display: flex;
				justify-content: flex-start;
				font-size: var(--font-base);
				align-items: center;
				&:hover {
					background: var(--dark-08);
				}
				a {
					text-decoration: none;
					color: var(--brand-05);
					margin-left: 0;
					margin-right: auto;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					width: 90%;
					padding-left: var(--space-base);
				}
				i {
					margin-right: 1rem;
					font-size: 1.35rem;
				}
			}
			.el-button {
				padding: 5px;
				border: 0;
				color: var(--brand-03);
				font-size: 1.4rem;
			}
			// }
		}

		.reason-select-container {
			display: flex;
		}
	}
	.el-dialog__footer {
		padding: 0;
		.dialog-footer {
			text-align: left;
			padding-top: 1rem;
			.btn-attached {
				font-size: 1.3rem;
				span {
					display: inline-block;
					padding-left: 0.5rem;
					font-size: 1.25rem;
				}
			}
		}
	}
} // reject invoice container end

// .reject-invoive-container{
//   .reason-select-container{
//     input{
//       border-bottom: 0px;
//     }
//   }
// }

.reason-select-container {
	.el-form-item__content {
		margin-left: 0 !important;
		.el-input__inner {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			padding-right: 32px !important;

			font-size: var(--font-base) !important;
			background: var(--dark-08);
			border-radius: 0.3rem;
			color: var(--dark-03) !important;
			padding-left: var(--space-base) !important;

			&::placeholder {
				// font-size: var(--font-base) !important;
				color: var(--dark-03) !important;
			}
			.el-select__caret {
				color: var(--dark-01) !important;
			}
		}
	}
}

.reason-config-wrap {
	padding: 0;
	.el-dialog {
		padding: 0;
	}
	.el-dialog__header {
		display: block;
		padding: 1rem 2eem;
		.el-dialog__title {
			font-size: 1.286rem;
			margin: 0;
			color: rgba(45, 55, 72, 1);
			display: inline-block;
			font-weight: normal;
			margin-right: 1rem;
		}
		.el-dialog__headerbtn {
			top: 14px;
		}
	}
	.el-dialog__body {
		padding: 0 !important;
		.inner-body {
			padding: 1.5rem !important;
		}
	}
	#add-user-footer {
		padding: 1.2rem 1.8rem !important;
		border-top: 0.5px solid #e4e7ed;
		text-align: right;
		.dialog-footer {
			display: flex;
			justify-content: flex-end;

			div:first-child {
				margin-left: 0;
				margin-right: auto;
			}
			.file-uploads {
				background: rgba(90, 103, 216, 1);
				color: #ffffff;
				padding: 3px 13px;
				border: 1px solid #5f8fdf;
				margin-left: 0;
				margin-right: auto;
				display: inline-block;
				margin-right: 10px;
				border-radius: 3px;
				label {
					cursor: pointer;
				}
			}
			#upload-file {
				font-family: "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
					"Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
				white-space: unset;
				display: flex;
				padding: 5px 13px;
				font-size: 1rem;
				background: rgba(90, 103, 216, 1);
			}
		}
	}
	.separator {
		display: flex;
		align-items: center;
		.label {
			padding: 0 1rem; /* creates the space */
		}
        .line {
           flex: 1;
           height: 1.5px;
           background-color: #e2e2e2;
       }
	}

	.create-package-label{
        padding-bottom:1rem;
    }
}
</style>
