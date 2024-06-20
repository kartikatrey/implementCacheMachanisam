<template>
	<div>
		<h2>{{ propData.label }}</h2>
		<p>
			{{ propData.value }}
			<i class="label-icon el-icon-user-solid kp-label-info1"></i>
		</p>
	</div>
</template>

<script>
export default {
	name: "HeaderWidget",
	props: ["propData"],
	data() {
		return {};
	}
};
</script>

<style lang="scss">
.kp-top-section-container {
	margin-top: 20px;

	.section-labels {
		display: inline-block;
		width: 19%;
		margin: 0 10px 0 0;
		background: #fff;
		box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
		padding: 16px;
		border-radius: 5px;

		&:last-child {
			margin: 0 0px 0 0;
		}

		h2,
		p {
			margin: 0;
		}

		h2 {
			font-weight: normal;
			font-size: 16px;
			color: rgba(33, 33, 33, 0.6);
		}

		p {
			font-weight: bold;
			color: #212121;
			font-size: 28px;
		}

		.label-icon {
			display: inline-block;
			float: right;
			border-radius: 100px;
			padding: 10px;
			font-size: 18px;
		}

		.kp-label-info1 {
			color: #00a7e0;
			background: #e3f5fc;
		}

		.kp-label-info2 {
			color: #006c0a;
			background: #d5ffd8;
		}

		.kp-label-info3 {
			color: #945707;
			background: #ffedd5;
		}

		.kp-label-info4 {
			color: #ee3b3b;
			background: #ffd5d5;
		}
	}
}
</style>
