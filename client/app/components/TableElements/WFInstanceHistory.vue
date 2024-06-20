<template>
	<el-popover placement="top-end" title="History" trigger="hover" width="480">
		<el-table :data="this.propData.row.history" height="200" width="380">
			<el-table-column
				prop="node_id"
				label="Node id"
				width="90"
			></el-table-column>
			<el-table-column
				prop="node_name"
				label="Node name"
				width="120"
			></el-table-column>
			<el-table-column
				prop="description"
				label="Description"
				width="350"
			></el-table-column>
			<el-table-column
				prop="start_time"
				label="Start time"
				width="200"
			></el-table-column>
			<el-table-column
				prop="end_time"
				label="End time"
				width="200"
			></el-table-column>
		</el-table>
		<el-button slot="reference">
			<span class="mdi mdi-history"></span
		></el-button>
	</el-popover>
</template>
<script>
export default {
	name: "HistoryButton",
	props: ["propData"]
};
</script>
