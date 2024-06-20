<template>
    <section>
        <div>
            <el-button cid="input-channel-form-connection" size="small" v-on:click="onTestConnectionClick">Test connection</el-button>
        </div>
    </section>
</template>

<script>
import Constants from "@/resources/Constants";
import $ from "jquery";
import ConnectionService from "@/idp/services/ConnectionService";

export default {
    name: "TestConnectionButton",
    props: ['recordId', 'connectionType'],

    data() {
        return {}
    },

    methods: {
        async onTestConnectionClick() {
            // emit so form can make logs dialog visible
            this.$emit('testConnectionRequested');

            try {
                let connectionResult = await ConnectionService.testConnection({
                    recordId: this.recordId,
                    connectionType: this.connectionType
                })

                connectionResult = connectionResult.data;

                if (connectionResult.success) 
                    this.notifySuccess("Connection successful");
                else 
                    this.notifyError(connectionResult.message);

            } catch (error) {
                this.notifyError(error.message);
            } 
        }
    },
};
</script>

 