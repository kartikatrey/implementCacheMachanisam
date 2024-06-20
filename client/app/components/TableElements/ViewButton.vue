<template>
<el-dropdown-item v-if="propData.row.file_name" :cid="'table-action-view-' + propData.index" :command="viewRecord"><i class="mdi mdi-image-area el-icon-left"></i>View</el-dropdown-item>
</template>

<script>
import TableAPIService from "@/services/TableAPIService";
import AjaxService from "../../services/AjaxService";

import {
    _
} from "vue-underscore";
let tableApiService = new TableAPIService();

export default {
    name: "ViewButton",
    props: ["propData"],
    data() {
        return {};
    },

    methods: {
        viewRecord() {
            let record = this.propData.row;
            AjaxService.getJson("/portal/api/file-url", {
                'id': record._id
            }, (error, res) => {
                if (res) {
                    let image = new Image();
                    image.src = res.data;
                    let winObj = window.open("");
                    winObj.document.write(image.outerHTML);

                } else {
                    console.log("error occured");
                }
            })

        }
    }
};
</script>>
