<template>
<el-main >
		<h1 class="kp-page-title">{{pageTitle}}</h1>
      

		<div class="table-wrap">
			<data-table
				:parameters="tableParams"
				@refreshCount="refreshCount"
			>
			</data-table>
		</div>

  </el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import KnowledgeBaseService from '../../services/KnowledgeBaseService'


export default {
	name: "KnowledgeBase",
	components: { DataTable },
	data() {
		return {
			kbcount: 0,
			tableParams: {
				apiName: `/portal/api/table/knowledge_base`,
				tableName: "knowledge_base",
				isRestify: true,
				queryParam: {active:true},
				enableExport:true,
				limit: 10,
				select : ["title","domain"],
				
       			addButtonConfig:{path:"/knowledge-base-form",name:'Add knowledge base'},
			},
			searchValue:'',
			pageTitle:"Knowledge base"
		};
	},
	methods: {
		getCount() {
			KnowledgeBaseService.fetchCount()
				.then((count) => {
					this.kbcount = count;
				})
				.catch((error) => {
					this.notifyError(error);
				})
		},

		refreshCount() {
			this.getCount();
		}
	},
	beforeMount() {
		this.getCount()
	}
}
</script>
<style lang="scss">

</style


