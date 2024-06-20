<template>
	<div
		class="document-card-container"
		v-loading="loading"
		:class="[isPackageViewerOpen ? 'viewer-open' : 'viewer-collapse',errorClass]"
	>
		<div>
			<!-- Thumbnail-->
			<div
				class="thumbnail-card-container"	:class="[defaultId == data.id ? 'selected-accord-thumbnail' : '',	errorClass]"
			>
				<el-tooltip
					effect="light"
					popper-class="error-on-document-card"
					placement="top"
					:disabled="!(messages.length > 0)"
				>
				<div slot="content">
					<h3>Errors</h3>
					<ul
						style="list-style-type: none; padding-left: 0px; margin: 5px"
						
					>
						<li	v-for="(msg, index) in messages"	v-bind:key="index + 'message'">
							<i class="mdi mdi-alert-circle-outline"></i>
							{{ msg.message }}
						</li>
					</ul>
				</div>
					<!-- If thumbanil found -->
					<img v-if="data.id && data.document_subtype.startsWith('image_')" src="@/assets/acord/image-icon.png" @click="accordPageSelection(data.id)" alt="image">
					<img v-else-if="data.id && !data.document_subtype.startsWith('image_')" src="@/assets/acord/thumb.png" @click="accordPageSelection(data.id)" alt="form">
					
					<!-- if not found -->
					<div @click="accordPageSelection(data.id)" class="doc-thumbnail-container" v-else>
						<i class="mdi mdi-file-excel-outline"></i>
					</div>
				</el-tooltip>

				<div class="document-card-actions-container">
					<el-tooltip
						class="item"
						effect="dark"
						content="Add form"
						placement="right"
					>
						<el-button
							class="btn-addform"
							circle
							v-if="!data.id"
							type="text"
							color="green"
							@click="addForm(data)"
						>
							<i class="mdi mdi-plus"></i>
						</el-button>
					</el-tooltip>

					<el-button
						class="btn-deletefrom"
						circle
						size="small"
						v-if="data.id"
						type="text"
						@click="deleteForm(data.id)"
					>
						<i class="mdi mdi-minus el-icon-error"></i>
					</el-button>

					<!-- <el-button class="icon-error" circle size="small"  type="text" @click="deleteFrom">
						<span>!</span>
					</el-button> -->

					<el-button
						class="icon-success"
						circle
						size="small"
						v-if="data.id && messages.length == 0"
						type="text"
					>
						<i class="mdi mdi-check"></i>
					</el-button>

					<el-tooltip
            v-else-if="messages.length"
						class="item"
						effect="dark"
						content="Errors"
						placement="right"
					>
						<el-button
							class="icon-error"
							circle
							size="small"
							v-if="data.id"							
							type="text"
						>
							<span>!</span>
						</el-button>
					</el-tooltip>
				</div>
			</div>
		</div>
		<!-- Label -->
		<div>
			<span
				class="thumbanil-card-label"
				:class="[defaultId == data.id ? 'selected-accord-label' : '']"
			>
				{{ data.label }}
			</span>
		</div>
		<div class="selected-arrow" v-if="defaultId == data.id"></div>
	</div>
</template>


<script>
export default {
	name: "DocumentCard",
	props: ["data", "defaultId", "isPackageViewerOpen", "accordPageSelection"],
	watch :{
		/** this watcher call only on save Draft and onLoad */
		"data.messages" : {
            handler: async function (newVal, oldVal) {
				if(!newVal || newVal == oldVal){
                    return;
                }
				/** here we assign latest message to card*/
				this.messages = this.data.messages || [];
				if (this.messages.length) {
					this.errorClass = "card-contains-error";
				}
				else{
					this.errorClass = ""
				}
            },
            deep: true,
            immediate:true
        }
	},
	data() {
		return {
			showModal:false,
			image: "",
			loading: false,
			containerClass: "",
			errorClass: "",
			messages: [],
			isValidDocumentCard: false,
			uploadParams:{}
		};
	},
	methods: {

		addForm(data) {
			this.$emit('uploadForm', data)
		},

		deleteForm(id) {
			this.$emit('unlinkForm', id)
			this.errorClass = ""
		}	
	},
	beforeMount() {}
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.card-contains-error{
	.selected-accord-label {
		color: var(--red-05) !important;
	}
	
}


.thumbanil-card-label.selected-accord-label {
		color: var(--brand-05) !important;
	}


.document-card-container {
	// display: flex;
	text-align: center;
	position: relative;
	margin-right: 2.5rem;
	padding-top: 10px;
	.thumbanil-card-label {
		color: var(--dark-03);
		display: block;
		padding-top: 5px;
	}
	.thumbnail-card-container {
		border: 3px solid var(--dark-07);
		border-radius: 8px;
		background: var(--dark-08);
		flex: 10;
		padding: 4px;
		width: 102px;
		img {
			width: 90px;
			height: 60px;
		}
		.doc-thumbnail-container {
			// width: 50px;
			// height: 60px;
			text-align: center;
			i {
				font-size: 3.7rem;
				color: var(--dark-06);
			}
		}
	}
	.selected-accord-thumbnail {
		border: 3px solid var(--brand-05) !important;
	}

	.card-contains-error {
		border: 3px solid var(--red-05);
		background: var(--red-09);
	}
	.document-card-actions-container {
		position: absolute;
		right: -0.8rem;
		top: 1rem;
		display: flex;
		// align-self:flex-end;
		align-items: center;
		justify-content: flex-end;
		height: 54%;
		flex-direction: column;
		button {
			padding: 0px;
			margin-left: 0px !important;
			// font-size: 2rem;
			// background: red;

			margin-top: 0.3rem;
		}
		.icon-success {
			background: var(--green-05);
			color: var(--white);
			width: 16px;
			height: 16px;
			font-size: 1.1rem;
		}
		.icon-error {
			background: var(--red-04);
			color: var(--white);
			width: 16px;
			height: 16px;
			font-size: 1.1rem;
			position: unset;
			font-weight: 700;
		}
		.btn-deletefrom {
			background: var(--white);
			border: 1.5px solid var(--dark-06);
			color: var(--red-05);
			font-size: 1.5rem;
			cursor: pointer;
			width: 21px;
			height: 21px;
		}
		.btn-addform {
			background: var(--brand-04);
			color: var(--white);
			width: 24px;
			height: 24px;
			font-size: 1.6rem;
			outline: 1.5px solid #fff;
		}
	}

	//   .icon-container {
	//     font-size: 20px;
	.el-icon-error {
		color: var(--red-04);
	}
	// .el-icon-success {
	// 	color: var(--green-05);
	// }
	// .add-icon{
	// 	color: #696cc3;
	// }
	.el-icon-warning {
		color: red;
	}

	.selected-arrow {
		position: absolute;
		left: 3.5rem;
		top: 5px;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-bottom: 8px solid var(--brand-05);
	}
	//   }
}

.error-on-document-card
	.el-tooltip__popper.is-light[x-placement^="top"]
	.popper__arrow {
	border-top-color: transparent !important;
}
.error-on-document-card
	.el-tooltip__popper.is-light[x-placement^="top"]
	.popper__arrow::after {
	background: var(--red-08) !important;
}
.error-on-document-card {
	background: var(--red-08) !important;
	box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
	border: 0 !important;
	h3 {
		color: var(--red-04);
	}
	ul {
		background: var(--red-08);
	}
	li {
		color: var(--red-03);
		line-height: 1.5rem;
		i {
			display: inline-block;
			margin-right: 0.5rem;
		}
	}
}
</style>
