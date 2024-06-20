
export default {
    async beforeRouteLeave(to, from, next) {
        if (this.isTableInEditMode) {
            let res = await this.$confirm(
                `Changes you made may not be saved.`,
                "Leave page?", {
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    type: "warning"
                }
            ).
            then(() => {
                    this.$store.commit("setTableEditMode", false);
                    next();
                })
                .catch((err) => {
                    next(false)
                })
            return;
        }
        next()
    }
 }



