<template>
	<div ref="imageRef" class="vac-image-container">
		<loader
			:style="{ top: `${imageResponsive.loaderTop}px` }"
			:show="isImageLoading"
		/>
		<div
			class="vac-message-image"
			:class="{
				'vac-image-loading':
					isImageLoading && messageClone.senderId === currentUserId
			}"
			:style="{
				'background-image': `url('${imageBackground}')`,
				'max-height': `${imageResponsive.maxHeight}px`
			}"
		>
			<transition name="vac-fade-image">
				<div v-if="imageHover && !isImageLoading" class="vac-image-buttons">
				<!--	<div
						class="vac-svg-button vac-button-view"
						@click.stop="$emit('open-file', 'preview')"
					>
						<slot name="document-icon">
							<svg-icon name="document" />
						</slot>
					</div>-->
					<div
						class="vac-svg-button vac-button-view"
						@click.stop="$emit('open-file', 'download')"
					>
						<slot name="document-icon">
							<svg-icon name="document" />
						</slot>
					</div>
				</div>
			</transition>
		</div>
		<format-message
			:content="messageClone.content"
			:users="roomUsers"
			:text-formatting="textFormatting"
			:link-options="linkOptions"
			@open-user-tag="$emit('open-user-tag')"
		>
			<template v-for="(i, name) in $scopedSlots" #[name]="data">
				<slot :name="name" v-bind="data" />
			</template>
		</format-message>
	</div>
</template>

<script>
import Loader from '../../components/Loader'
import SvgIcon from '../../components/SvgIcon'
import FormatMessage from '../../components/FormatMessage'
import _ from 'lodash';
const { isImageFile } = require('../../utils/media-file')

export default {
	name: 'MessageImage',
	components: { SvgIcon, Loader, FormatMessage },

	props: {
		currentUserId: { type: [String, Number], required: true },
		message: { type: Object, required: true },
		roomUsers: { type: Array, required: true },
		textFormatting: { type: Boolean, required: true },
		linkOptions: { type: Object, required: true },
		imageHover: { type: Boolean, required: true }
	},

	data() {
		return {
			imageLoading: false,
			imageResponsive: '',
			messageClone:''
		}
	},

	computed: {
		isImageLoading() {
			return (
				(_.has(this.messageClone, 'file.url')  && this.messageClone.file.url.indexOf('blob:http') !== -1) || this.imageLoading
			)
		},
		imageBackground() {
			return this.isImageLoading
				? this.messageClone.file.preview || _.get(this.messageClone, 'file.url')
				: _.get(this.messageClone, 'file.url')
		}
	},

	watch: {
		message: {
			deep:true,
			immediate: true,
			handler(newVal, oldVal) {
				if(!newVal)return;

				if(!_.isEmpty(_.get(newVal, 'file.url')) || ( _.isEmpty(_.get(newVal, 'file.url')) && _.isEmpty(_.get(newVal, 'file.name'))))
				{
					this.messageClone = _.cloneDeep(newVal);	
				}			
			}
		},
		messageClone: {
			deep:true,
			immediate: true,
			handler(newVal, oldVal) {
				if(( _.isEmpty(_.get(newVal, 'file.url')) && _.isEmpty(_.get(newVal, 'file.name')))){
                    this.checkImgLoad();
					return;
				}
				
				if((_.get(newVal, 'file.url') == _.get(oldVal, 'file.url')) || _.isEmpty(_.get(newVal, 'file.url'))) return;
				this.checkImgLoad()
			}
		}
	},

	mounted() {
		this.imageResponsive = {
			maxHeight: this.$refs.imageRef.clientWidth - 18,
			loaderTop: this.$refs.imageRef.clientWidth / 2
		}
	},

	methods: {
		checkImgLoad() {
			if (!isImageFile(this.messageClone.file)) return
			this.imageLoading = true
			const image = new Image()
			image.src = this.messageClone.file.url
			console.log("******file",this.messageClone._id)
			console.log("******complete", image.complete)
			image.addEventListener('load', () => 
			{
				console.log("***********loaded")
				this.imageLoading = false
			})
	
			
		}
	}
}
</script>

<style lang="scss">
.vac-image-container {
	width: 250px;
	max-width: 100%;

	.vac-image-loading {
		filter: blur(3px);
	}

	.vac-image-buttons {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 4px;
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 55%,
			rgba(0, 0, 0, 0.02) 60%,
			rgba(0, 0, 0, 0.05) 65%,
			rgba(0, 0, 0, 0.1) 70%,
			rgba(0, 0, 0, 0.2) 75%,
			rgba(0, 0, 0, 0.3) 80%,
			rgba(0, 0, 0, 0.5) 85%,
			rgba(0, 0, 0, 0.6) 90%,
			rgba(0, 0, 0, 0.7) 95%,
			rgba(0, 0, 0, 0.8) 100%
		);

		svg {
			height: 26px;
			width: 26px;
		}

		.vac-button-view,
		.vac-button-download {
			position: absolute;
			bottom: 6px;
			left: 7px;
		}

		:first-child {
			left: 40px;
		}

		.vac-button-view {
			left: 5px !important;
			max-width: 18px;
			bottom: 8px;
		}
	}
}
</style>
