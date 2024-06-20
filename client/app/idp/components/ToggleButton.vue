<template>
	<div :class="[customClass, { 'disabled': disabled }]">
		<input
			type="checkbox"
			id="toggle"
			class="toggleCheckbox"
			v-model="toggleEnabled"
			@change="onChange"	
			:disabled="disabled"
		/>
		<label for="toggle" class="toggleContainer">
			<div>{{ labels.unchecked }}</div>
			<div>{{ labels.checked }}</div>
		</label>
	</div>
</template>

<script>
import $ from "jquery";

export default {
	name: "ToggleButton",

	props: {
		labels: Object,
		enabled: Boolean,
		disabled: Boolean,
        customClass: String,
	},

	data: function() {
		return {
			toggleEnabled: false,
		};
	},

	methods: {
		onChange() {
			this.$emit("change", this.toggleEnabled);
		}
	},

	async beforeMount() {
		this.toggleEnabled = this.$props.enabled;
	}
};
</script>

<style lang="scss">

@import "../_idpVariables";
@import "../_idpGlobal";

.toggleContainer {
	position: relative;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	width: fit-content;
	// border: 3px solid #343434;
	// border-radius: 20px;
	background: var(--dark-07-1);
	// background: var(--brand-05);
	// color: var(--white);
	// font-weight: bold;
	color: #343434;
	border-radius: var(--radius-base);
	// border: .125rem solid var(--brand-05);
	border: .125rem solid #dcdfe6;
	height: 24px;
	cursor: pointer;
}
.toggleContainer::before {
	content: "";
	position: absolute;
	width: 50%;
	height: 100%;
	left: 0%;
	// top: 1%;
	// border-radius: 20px;
	border-radius: var(--radius-base);

	// background: white;
	background: var(--brand-05);
	// height: 20px;
	transition: all 0.3s;
}
.toggleCheckbox:checked + .toggleContainer::before {
	left: 50%;
}
.toggleContainer div {
	padding: 6px;
	padding-top: 10%;
	text-align: center;
	z-index: 1;
}
.toggleCheckbox {
	display: none;
}
.toggleCheckbox:checked + .toggleContainer div:first-child {
	// color: white;
	color: var(--dark-04);
	transition: color 0.3s;
}
.toggleCheckbox:checked + .toggleContainer div:last-child {
	// color: #343434;
	color: var(--white);
	transition: color 0.3s;
}
.toggleCheckbox + .toggleContainer div:first-child {
	// color: #343434;
	color: var(--white);
	transition: color 0.3s;
}
.toggleCheckbox + .toggleContainer div:last-child {
	color: var(--dark-04);
	transition: color 0.3s;
}
.disabled {
	opacity: 0.5; /* or any other style to indicate disabled state */
	pointer-events: none; /* prevent interaction */
}
</style>
