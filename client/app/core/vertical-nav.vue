<template>
	<div class="vertical-nav "  :class="{'nav-collapsed':collapseNav, 'open':openSidebar}">
		<div class="sidebar-mask" :class="{'open':openSidebar}" @click="closeNav"></div>

		<div class="sidebar flex column" :class="{'open':openSidebar, ['pos-'+position]:true}">
			<logo :collapse-nav="collapseNav" @collapse-nav-toggle="collapseNavToggle"/>

			<div class="box-nav box grow ">
				<div class="scroll-nav" v-bar="{ useScrollbarPseudo: true }">
					<div>
						<Nav :is-collapse="collapseNav" @push-page="pushPage"/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
// @ is an alias to /src
import Nav from '@/core/nav.vue'
import Logo from '@/core/logo.vue'

export default {
	name: 'VerticalNav',
	props: ['collapseNav', 'openSidebar', 'position'],
	
	methods: {
		collapseNavToggle() {
			this.$emit('collapse-nav-toggle')
		},
		pushPage(index, indexPath) {
			this.$emit('push-page', {page:index})
		},
		closeNav() {
			this.$emit('update:openSidebar', false)
		}
	},
	components: {
		Nav,
		Logo
	}
}
</script>

<style lang="scss">
@import '../assets/scss/_variables';
@import '../assets/scss/_mixins';

.vertical-nav {
	//width: 230px;
	height: 100%;
	background: #fff;
	padding: 0;
	box-sizing: border-box;
	transition: width .5s;

	.el-submenu__title {
		height: 50px;
    	line-height: 50px;
	}	
	.el-menu-item {
		height: 48px;
		line-height: 48px;
	}
	.el-menu-item,.el-submenu {

		border-bottom: 0;
	}
	
	.sidebar-mask {
		visibility: hidden;
		opacity: 0;
		transition: all .5s;
	}

	.sidebar {
		width: 215px;
		height: 100%;
		transition: width .5s;

		.box-nav {
			overflow: hidden;
			padding-top: 0px;
			//padding-left: 5px;
			background: #ffffff;
			border-right: 1px solid #c9d4dd;
			margin-top: 12px;
			.scroll-nav {
				height: 100%;
			}
			.el-menu-item:hover { 
				background: #EBEBEB !important;
				// box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.1);
				color:#4a596a;
				margin: 0 14px 0 0 !important;
				border-radius: 6px;
				position: relative;
				i {
					color:#4a596a !important;
				}
			}
			.el-menu-item.is-active {
				background: #005DA6 !important;
				box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.1);
				color:#ffffff;
				margin: 0 14px 0 0 !important;
    			border-radius: 6px;
				position: relative;
					i {
						color:rgba(255, 255, 255, 0.8) !important;
					}
					
					&::after {
						content: '';
						position: absolute;
						height: 100%;
						width: 5px;
						border-radius: 100px;
						background:#00a7e0;
						right: -12px;
					}
			}
			
		}

		&:not(.pos-right) {
			.box-nav {
				.scroll-nav {
					&.vb { 
						& > .vb-content {
							margin-left: 4px;
						}
						& > .vb-dragger { 
							//left: 3px; 
							right: inherit; 
						} 
					}
					.ps__scrollbar-y-rail {
						left: 0px;
						right: inherit;
					}
				}
			}
		}
	}

	&.nav-collapsed {
		.sidebar {
			width: 74px;
		}
	}
}

@media (max-width: 768px) {
	.vertical-nav {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999;
		visibility: hidden;

		&.open {
			visibility: visible;
		}

		.sidebar {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 9999;
			background: $background-color;
			box-shadow: -10px 0px 10px 10px rgba(0, 0, 0, 0.2), -10px 0px 20px 20px rgba(0, 0, 0, 0.2);
			transform: translateX(-100%);
			opacity: 0;
			transition: all .5s;

			&.pos-right {
				left: initial;
				right: 0;
				box-shadow: 10px 0px 10px 10px rgba(0, 0, 0, 0.2), 10px 0px 20px 20px rgba(0, 0, 0, 0.2);
				transform: translateX(100%);
			}

			&.open {
				opacity: 1;
				transform: translateX(0%);
			}
		}

		.sidebar-mask.open {
			position: fixed;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.4);
			z-index: 999;
			right: 0;
			bottom: 0;
			opacity: 1;
			visibility: visible;
		}
	}
}
.el-menu--collapse {
	width: auto !important;
}

.el-submenu.is-opened  {
		background-color: #d9e6ef;
		box-shadow: none;
	.el-submenu__title {
		color: #005DA6 !important; 
	}
}
.el-submenu .el-menu-item {
	    min-width: auto !important;
    width: 98%;
}
.el-submenu.is-active {
	// Removed 'important' because it was causing issues in the Toolbar Menu
		background: transparent;
		box-shadow:none !important;
}

.el-menu--collapse {
	.el-submenu {
		span {
			display: none !important;
		}
	}
}

.nav-collapsed {
	.el-submenu {
		span {
			display: inline;
		}
	}
}
.el-submenu__icon-arrow {
	top: 53%;
}
.el-menu--inline {
		background: #eaf2f8 !important; 
}
.el-submenu .el-menu-item {
		width: 93.5%;
		padding:0;
	
}
.el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
	color: #005DA6;
	font-weight: 700;
}
</style>
