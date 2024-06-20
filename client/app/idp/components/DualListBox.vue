<template>
	<div class="slushbucket_container list-box-wrapper">
		<div class="list-box-item">
			<div class="search-box">
				<input
					v-model="searchSource"
					type="text"
					placeholder="Search"
				/>
				<div
					v-if="searchSource"
					class="clear-search"
					title="Clear Search"
					@click="searchSource = ''"
				>
					&times;
				</div>
			</div>
			<ul class="list-box">
				<li
					v-for="(item, key) in source
						.map((item, inx) => ({ inx, ...item }))
						.filter(item =>
							item[label in item ? label : 'label']
								.toLowerCase()
								.includes(searchSource.toLowerCase())
						)"
					v-bind:key="key"
					:class="'list-item' + (item.selected ? ' active' : '')"
					@click="selectSource(searchSource ? item.inx : key)"
				>
					{{ item[label in item ? label : "label"] }}
				</li>
				<li
					v-if="
						source.filter(item =>
							item[label in item ? label : 'label']
								.toLowerCase()
								.includes(searchSource.toLowerCase())
						).length == 0 && source.length
					"
					class="list-item"
				>
					No results found
				</li>
			</ul>
			<div class="bulk-action">
				<div class="select-all" @click="selectAllSource">
					Select All
				</div>
				<div class="deselect-all" @click="deSelectAllSource">None</div>
			</div>
		</div>
		<div class="actions">
			<div
				class="btn-action"
				@click="moveUp"
				style="transform: rotate(270deg)"
			>
				<svg height="18" viewBox="0 0 256 512">
					<path
						fill="#ffffff"
						d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
					/>
				</svg>
			</div>
			<div
				class="btn-action"
				@click="moveDown"
				style="transform: rotate(90deg)"
			>
				<svg height="18" viewBox="0 0 256 512">
					<path
						fill="#ffffff"
						d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
					/>
				</svg>
			</div>
			<div class="btn-action" @click="moveDestination">
				<svg height="18" viewBox="0 0 256 512">
					<path
						fill="#ffffff"
						d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"
					/>
				</svg>
			</div>
			<div class="btn-action" @click="moveAllDestination">
				<svg height="18" viewBox="0 0 448 512">
					<path
						fill="#ffffff"
						d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"
					/>
				</svg>
			</div>
			<div class="btn-action" @click="moveSource">
				<svg height="18" viewBox="0 0 256 512">
					<path
						fill="#ffffff"
						d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"
					/>
				</svg>
			</div>
			<div class="btn-action" @click="moveAllSource">
				<svg height="18" viewBox="0 0 448 512">
					<path
						fill="#ffffff"
						d="M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z"
					/>
				</svg>
			</div>
		</div>
		<div class="list-box-item">
			<div class="search-box">
				<input
					v-model="searchDestination"
					type="text"
					placeholder="Search"
				/>
				<div
					v-if="searchDestination"
					class="clear-search"
					title="Clear Search"
					@click="searchDestination = ''"
				>
					&times;
				</div>
			</div>
			<ul class="list-group list-group-flush border rounded list-box">
				<li
					v-for="(item, key) in destination
						.map((item, inx) => ({ inx, ...item }))
						.filter(item =>
							item[label in item ? label : 'label']
								.toLowerCase()
								.includes(searchDestination.toLowerCase())
						)"
					v-bind:key="key"
					:class="'list-item' + (item.selected ? ' active' : '')"
					@click="
						selectDestination(searchDestination ? item.inx : key)
					"
				>
					{{ item[label in item ? label : "label"] }}
				</li>
				<li
					v-if="
						destination.filter(item =>
							item[label in item ? label : 'label']
								.toLowerCase()
								.includes(searchDestination.toLowerCase())
						).length == 0 && destination.length
					"
					class="list-item"
				>
					No results found
				</li>
			</ul>
			<div class="bulk-action">
				<div class="select-all" @click="selectAllDestination">
					Select All
				</div>
				<div class="deselect-all" @click="deSelectAllDestination">
					None
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import "../../assets/dualListBox/style.css";
import _ from "lodash";
export default {
	props: {
		source: Array,
		destination: Array,
		label: String
	},
	data: function() {
		return {
			searchSource: "",
			searchDestination: ""
		};
	},
	methods: {
		moveUp() {
			let selected = this.destination.filter(f => f.selected);
			if (selected.length != 1)
				return alert("Please select only one element to move up");
			const { code, name } = selected[0];
			const old_index = _.findIndex(this.destination, { code, name });
			const new_index = old_index - 1;
			if (old_index > 0) {
				this.array_move(this.destination, old_index, new_index);
			}
		},
		moveDown() {
			let selected = this.destination.filter(f => f.selected);
			if (selected.length != 1)
				return alert("Please select only one element to move down");
			const { code, name } = selected[0];
			const old_index = _.findIndex(this.destination, { code, name });
			const new_index = old_index + 1;
			if (old_index < this.destination.length - 1) {
				this.array_move(this.destination, old_index, new_index);
			}
		},
		array_move(arr, old_index, new_index) {
			if (new_index >= arr.length) {
				var k = new_index - arr.length + 1;
				while (k--) {
					arr.push(undefined);
				}
			}
			arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
		},
		moveDestination: function() {
			let selected = this.source.filter(f => f.selected);
			if (!selected.length) return;
			selected = selected.map(item => ({
				...item,
				selected: false
			}));
			let destination = [...selected, ...this.destination];
			let source = this.source.filter(f => !f.selected);
			this.searchSource = "";
			this.searchDestination = "";
			this.$emit("onChangeList", {
				source,
				destination
			});
		},
		moveSource: function() {
			let selected = this.destination.filter(f => f.selected);
			if (!selected.length) return;
			selected = selected.map(item => ({
				...item,
				selected: false
			}));
			let source = [...selected, ...this.source];
			let destination = this.destination.filter(f => !f.selected);
			this.searchSource = "";
			this.searchDestination = "";
			this.$emit("onChangeList", {
				source,
				destination
			});
		},
		moveAllDestination: function() {
			let destination = [
				...this.source.map(item => ({ ...item, selected: false })),
				...this.destination
			];
			let source = [];
			this.searchSource = "";
			this.searchDestination = "";
			this.$emit("onChangeList", {
				source,
				destination
			});
		},
		moveAllSource: function() {
			let source = [
				...this.destination.map(item => ({ ...item, selected: false })),
				...this.source
			];
			let destination = [];
			this.searchSource = "";
			this.searchDestination = "";
			this.$emit("onChangeList", {
				source,
				destination
			});
		},
		selectDestination: function(key) {
			let source = this.source;
			let destination = this.destination.map((i, k) => {
				if (k === key) {
					i.selected = !i.selected;
				}
				return i;
			});
			this.$emit("onChangeList", {
				source,
				destination
			});
		},
		selectSource: function(key) {
			let destination = this.destination;
			let source = this.source.map((i, k) => {
				if (k === key) {
					i.selected = !i.selected;
				}
				return i;
			});
			this.$emit("onChangeList", {
				source,
				destination
			});
		},
		selectAllSource: function() {
			let source = this.source.map(item => ({ ...item, selected: true }));
			let destination = this.destination;
			this.$emit("onChangeList", {
				source,
				destination
			});
		},
		deSelectAllSource: function() {
			let source = this.source.map(item => ({
				...item,
				selected: false
			}));
			let destination = this.destination;
			this.$emit("onChangeList", {
				source,
				destination
			});
		},
		selectAllDestination: function() {
			let destination = this.destination.map(item => ({
				...item,
				selected: true
			}));
			let source = this.source;
			this.$emit("onChangeList", {
				source,
				destination
			});
		},
		deSelectAllDestination: function() {
			let destination = this.destination.map(item => ({
				...item,
				selected: false
			}));
			let source = this.source;
			this.$emit("onChangeList", {
				source,
				destination
			});
		}
	}
};
</script>

<style lang="scss">

@import "../_idpVariables";
@import "../_idpGlobal";
.list-box-wrapper{
	font-family: var(--font-family);
	font-size: var(--font-sm);
	font-weight: normal;
}
div.bulk-action:hover {
	cursor: pointer;
}
div.bulk-action {
	.select-all {
		padding: 4px;
		background-color: #5a67d8;
	}
	.deselect-all {
		padding: 4px;
		color: #96989a;
		background: white;
		border-radius: 0px;
	}
}

ul.list-box {
	li.list-item.active {
		background-color: #5a67d8;
		color: var(--white);
	}
	li.list-item.active:hover {
		background-color: #5a67d8;
		color: var(--white);
	}
}

div.clear-search {
	padding: 0px 4px 0px 4px;
	margin: 4px;
	border: 1px solid;
	border-radius: 10px;
	color: #6c757d;
}

.list-box-wrapper {
	.list-box-item {
		border-radius: 0px;
		input {
			background-color:var(--dark-07);
			height: 2rem;
		}
		input:hover {
			border-radius: 0px;
			border: none;
		}
		&::placeholder {
			font-family: var(--font-family);
			font-size: var(--font-sm);
			font-weight: normal;
		}
	}
	.actions {
		div.btn-action {
			background-color: #5a67d8;
			padding: 0px 4px 0px 4px;
			svg {
				height: 1rem;
				width: 1rem;
			}
		}
	}
}

.list-box::-webkit-scrollbar-track {
	-webkit-box-shadow: inset 0 0 6px var(--dark-06);
	background-color: var(--white);
}

.list-box::-webkit-scrollbar {
	width: 6px;
	background-color: var(--white);
}

.list-box::-webkit-scrollbar-thumb {
	background-color: var(--dark-05);
}
</style>
