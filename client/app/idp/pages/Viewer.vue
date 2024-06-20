<template>
	<div v-loading="loading" class="viewer-container" :class="	renderPackageViewer ? 'show-package-viewer' : 'hide-package-viewer'	">
		<DocumentViewer
			:id="id"
			:class="isPackageViewerOpen ? 'page-viewer-open' : 'page-viewer-closed'	"
		/>
		<PackageViewer
			ref="packageViewer"
			:viewerLoading.sync="loading"
			:isPackageViewerOpen.sync="isPackageViewerOpen"
			v-if="renderPackageViewer"
			@renderDocument="renderDocument"
		/>
		<ConfirmModel ref="model"></ConfirmModel>
	</div>
</template>
<script>
import DocumentViewer from "./DocumentViewer.vue";
import EventBus from "@/EventBus";
import PackageViewer from "../components/PackageViewer.vue";
import ConfirmModel from "@/components/ConfirmModel";
export default {
	name: "Viewer",
	components: { DocumentViewer, PackageViewer, ConfirmModel },
	provide(){
		return {
			renderDocument:this.renderDocument
		}
	},
	data() {
		return {
			id: "", // This is the always package id if view is package
			renderPackageViewer: false,
			isPackageViewerOpen: true,
			loading:false
		};
	},
	methods: {

		renderDocument(id) {
			this.id = "";
			this.$nextTick(() => {
				this.id = id;
			});
		}
	},
	props: [],
	provide() {
		return {};
	},
	beforeMount() {
		this.$store.commit("setDisplayIdpTree",false);
		this.$store.commit("setDisplayIdpNavbar",false);
		const { view , id } = this.$route.query;
		(view == "package") ?  (this.renderPackageViewer = true):(this.id = id);
	},
	beforeRouteLeave: function (to, from, next) {
		if(this.$store.getters["documentViewStore/hasDataChanged"]){
			return this.$refs.model.open(next);
		}
		return next();
    }
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
.show-package-viewer {
	.el-tabs--border-card > .el-tabs__header {
		border-bottom: 4px solid var(--dark-07);
	}
	.page-viewer-open {
		height: calc(100% - 144px);
	}
	.page-viewer-closed {
		height: calc(100% - 71px);
	}
}
.hide-package-viewer {
	.page-viewer-open {
		height: calc(100% - 31px);
	}
	.page-viewer-closed {
		height: calc(100% - 71px);
	}
}
.viewer-container {
	height: calc(100%);
}
.isPageViewerDisabled {
	height: calc(100% - 31px);
}
</style>
