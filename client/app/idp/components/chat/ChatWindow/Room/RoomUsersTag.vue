<template>
	<transition name="vac-slide-up">
		<div
			v-if="filteredUsersTag.length"
			class="vac-tags-container vac-app-box-shadow"
			:style="{ bottom: `${$parent.$refs.roomFooter.clientHeight}px` }"
		>
			<div
				v-for="user in filteredUsersTag"
				:key="user._id"
				class="vac-tags-box"
				@click="$emit('select-user-tag', user)"
			>
				<div class="vac-tags-info">
					<avatar	v-bind="prepareAvatarObject(user)" ></avatar>
					<div class="vac-tags-username">
						{{ user.username }}
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import Avatar from "@/idp/components/chat/components/Avatar.vue";
export default {
	name: 'RoomUsersTag',
	components: { Avatar },
	props: {
		filteredUsersTag: { type: Array, required: true }
	},
	methods:{
		prepareAvatarObject(user){
			return {"username":user.username, "src":user.avatar, "size":30}
		}		
	}
}
</script>

<style lang="scss">
.vac-tags-container {
	position: absolute;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	bottom: 67px;
    max-height: 250px;
    height: auto;
    overflow-y: auto;

	.vac-tags-box {
		display: flex;
		width: 100%;
		height: 54px;
		padding: 4px;
		cursor: pointer;
		background: var(--chat-footer-bg-color);

		&:hover {
			background: var(--chat-footer-bg-color-tag-active);
			transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
		}

		&:not(:hover) {
			transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
		}
	}

	.vac-tags-info {
		display: flex;
		overflow: hidden;
		padding: 0 20px;
		align-items: center;
	}

	.vac-tags-avatar {
		height: 34px;
		width: 34px;
		min-height: 34px;
		min-width: 34px;
	}

	.vac-tags-username {
		font-size: 14px;
	}

	@media only screen and (max-width: 768px) {
		.vac-tags-box {
			height: 50px;
		}

		.vac-tags-info {
			padding: 0 12px;
		}
	}
}
</style>
