<template>
  
</template>

<script>
import Constants from "@/resources/Constants";
  export default {
    methods: {
      open(nextUrl) {
        this.$confirm(Constants.DOCEX.UNSAVED_CHANGES, 'Confirm', {
          // distinguishCancelAndClose: true,
          confirmButtonText: 'Cancel',
          cancelButtonText: 'Discard Changes'
        })
          .then(() => {

          })
          .catch(action => {
             nextUrl();
          });
      }
    }
  }
</script>
