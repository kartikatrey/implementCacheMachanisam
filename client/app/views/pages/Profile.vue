<template >
	<vue-scroll class="">   
   <!-- // main -->
    <el-main>
		<div class="page-header">
			<h1  class="page-heading border-bottom">Profile</h1>
			<!-- <modal name="hello-world">
			hello, world!
			</modal> -->
		</div>

		<div class="flex">
			<div class="box">
				<div class="profile-conatiner">
					<div class="form-block border">
						<label>Name</label>
						<input type="email" placeholder="Adish Upadhaya">
					</div>
					<div class="form-block border">
						<label>Email</label>
						<input type="email" placeholder="Adish Upadhaya@E-mail" readonly>
					</div>
					<div class="form-block border">
						<label>Contact Number</label>
						<input type="text" placeholder="+91 9623452655" readonly>
					</div>

					<!-- <el-button v-on:click="show" type="primary">CHANGE PASSWORD</el-button> -->

					<el-button v-on:click="seen = !seen" type="primary">CHANGE PASSWORD</el-button>
					
					<!-- change password -->
					<div class="change-pws-container"  v-show="!seen">
						<div class="form-block border">
							<label>New Password <span>*</span></label>
							<input class="b-rad-4" type="password" placeholder="*********">
						</div>
						<div class="form-block border">
							<label>Retype Password <span>*</span></label>
							<input class="b-rad-4" type="password" placeholder="*********">
						</div>
					</div> <!-- // change password -->


				</div>
			</div>
			<div class="box center"></div>
			<div class="box">
				<el-button type="primary">EDIT &nbsp;&nbsp;&nbsp;<i class="mdi mdi-pencil el-icon-right"></i></el-button>
			</div>
		</div>

	</el-main><!-- // main -->

  </el-container>
</el-container>


	</vue-scroll>
</template>

<script>
//var seen = false;
export default {
	name: 'Profile',
	el:'#app',
	data() {
		seen : true
		return {
			form: {
				email: '',
				password: '',
			},
		}
	},
	methods: {
		 show () {
			this.$modal.show('hello-world');
		},
		hide () {
			this.$modal.hide('hello-world');
		}
		// changePassword (){
		// 	this.seen=true;
		// }
	

	}
		

		
}
</script>

<style lang="scss">
@import '../../assets/scss/_variables';

.profile-conatiner {
		width: 400px;
		//max-width: 400px;
	.form-block {
		padding:  15px;
		margin-bottom:30px;
		border-radius: 4px;
			label {
				display: block;
				font-size: $font-size-14;
			}
			input {
				padding: 2px 0 0 0;
				font-size: $font-size-default;
				font-weight: bold;
				color: $text-color;
				border-bottom: .5px solid $text-color;
				border-top: 0;
				border-right: 0;
				border-left: 0;
				line-height: 28px;
				width: 98%;
					&:focus {
						outline: none !important;
					}
					&:read-only {
						border: 0;
						opacity: 1;
					}
			}
			.el-button {
				font-weight: bold;
				background: $text-color;
			}
			
			::placeholder {
				color: $text-color;
				opacity: 1; /* Firefox */
			}

			:-ms-input-placeholder { /* Internet Explorer 10-11 */
				color: $text-color;
			}

			::-ms-input-placeholder { /* Microsoft Edge */
				color: $text-color;
			}
	} // form block

	.change-pws-container {
		margin-top: 30px;
			.form-block {
				padding: 0 15px 0 0;
				border: 0;
				label {
					padding-bottom: 5px;
				}
					input {
						border: 1px solid rgba(74, 89, 106, 0.15);
						padding: 5px 5px 5px 20px;
					}
			} // Form Block
	}

}


</style>
