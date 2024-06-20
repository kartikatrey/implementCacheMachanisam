<template>
    <el-dialog width="90%" :visible.sync="showTestDialog" :close-on-click-modal="false" class="test-img-prompt-dialog">
        <div class="test-image-prompt">

            <div class="test-image-prompt-section">

                <!-- Section: PROMPT TEST HEADER  -->
                <el-divider>
                    <div class="prompt-test-section-title section-title">Test Prompt</div>
                </el-divider>

                <!-- Section: IMAGE BASED TEST PROMPT -->
                <section class="prompt-test-section prompt-upload-section">
                    <div class="upload-container">

                        <!-- Uploaded Img & Delete icon of image -->
                        <div class="uploaded-image-container" :class="{ 'hide-div': !showUploadedImg }">
                            
                            <div class="img-customize-buttons">
                                <el-button round text title="Zoom In" class="zoom-in-button prompt-action-btn" icon="mdi mdi-plus-circle-outline" size="small" @click="zoomIn">
                                </el-button>

                                <el-button round text title="Zoom Out" class="zoom-out-button prompt-action-btn" icon="mdi mdi-minus-circle-outline" size="small" @click="zoomOut">
                                </el-button>

                                <el-button round text title="Delete image" :disabled="testResLoading" class="delete-image-button prompt-action-btn" icon="mdi mdi-close" size="small" @click="cancelUploadedImg"> 
                                </el-button>
                            </div>

                            <div class="uploaded-img-section" ref="uploadedImgContainer">
                                <img ref="uploadedImg" :src="uploadedImageSrc"/>
                            </div>

                        </div>

                        <div class="drag-drop-image-container" :class="{ 'hide-div': showUploadedImg }">

                            <!-- Upload img SVG & Accepted file types list  -->
                            <img src="../../assets/images/dragdrop.svg"/>

                            <!-- FILE UPLOAD  -->
                            <div class="accepted-file-types-list">
                                <span v-for="exe in extensionList" :key="exe"> {{ exe.toUpperCase() }}</span>
                                <p>
                                    <file-upload 
                                        :thread="thread"
                                        :post-action="endPoint"
                                        :multiple="multiple"
                                        :size="fileSize"
                                        :accept="acceptedFileTypes"
                                        :data="imgParams"
                                        :drop="true"
                                        v-model="uploadedFile"
                                        @input-file="handleFileChange"
                                        ref="upload"
                                    >
                                    Drag and Drop files of these types here or
                                    <a href="#">Browse and upload</a>
                                    </file-upload>
                                </p>
                            </div>

                        </div>

                    </div>
                </section>

            </div>

            <div class="test-image-prompt-section">

                <!-- Section: PROMPT TEST RESULTS -->
                <el-divider>
                    <div class="prompt-test-section-title section-title">Test result</div>
                </el-divider>

                <section class="prompt-test-section prompt-test-result" v-loading="testResLoading" :class="{ 'scrollable-section': testResult.length > 90 }">
                    <span id="prompt-test-result-text">{{testResult}}</span>
                    <div class="text-result-buttons">

                        <i
                            class="icon-top-right mdi"
                            title="Copy text"
                            :class="{'mdi-content-copy': !copied, 'mdi-check': copied}"
                            @click="copyToClipboard"
                        ></i>
                        <i
                            title="Format text"
                            class="icon-top-right mdi mdi-creation"
                            @click="formatText"
                        ></i>
                    </div>
                </section>
                
            </div>

        </div>

        <!-- Section: PROMPT TEST FOOTER -->
        <section class="prompt-test-footer">
            <div>
                <el-button size="small" @click="onCancelClick" class="kp-btn-form-outline">Cancel</el-button>
            </div>
            <div>
                <el-tooltip :disabled="testBtnTooltip.length === 0" effect="light" :content="testBtnTooltip" placement="top">
                    <el-button size="small" type="primary" @click.prevent="testImageTypePrompt" :disabled="testBtnClicked">Test</el-button>
                </el-tooltip>
            </div>
        </section>

    </el-dialog>
</template>

<script>
import _ from "lodash";
import VueUploadComponent from "vue-upload-component";
import openAiService from "@/idp/services/openAiService";


export default {
    name: "TestImagePromptDialog",

    props: [ "promptName", "showTestDialog", "llmType"],

    components: {
        FileUpload : VueUploadComponent
    },

    data() {
        return {
            testResult : "",
            testBtnClicked : false,
            testResLoading: false,
            copied : false,
            imageTypePrompt: "image",
            extensionList: ["png","jpeg"],
            showUploadedImg: false,
            zoomFactor: 1,
            containerWidth: 0,
            containerHeight: 0,
            testBtnTooltip: "",

            // ***** File upload data ******
            endPoint: "/portal/api/extract/email", // After test btn click send file to
            acceptedFileTypes:"png,jpeg",
            uploadedFile: [],
            uploadedImageSrc: "",
            thread: 1, // Means user can select only 1 file
            fileSize: 0, // Means no limit of size
            multiple: false,
            imgParams: {
                action: "test",
                prompt_name : this.promptName,
                prompt_type: "image",
                llm_type: this.llmType,
            },
            validFileFormats: [],
        };
    },

    created(){
        this.validFileFormats = ['image/png','image/jpeg']
    },

    watch: {
        showTestDialog : {
            handler: function (newVal, oldVal){
                if(newVal !== oldVal){
                    this.$emit("closeTestDialog");
                }
            }
        }
    },

    methods: {
        testImageTypePrompt(){
            if(this.uploadedFile && !this.uploadedFile.length){
                this.$notify({
                    title: "Warning",
                    message: "Please upload an image to test the prompt.",
                    type: "warning",
                });
                return;
            }

            this.testBtnClicked = true;
            this.testResLoading = true;

            // After we made active to true then file will uploaded to the given endpoint
            // And we get response back from server in @handleFileChange function
            this.$refs.upload.active = true;
        },
        /**
         * Handles file change events triggered by vue-upload-component.
         * Checks for error conditions, successful test case run, or renders uploaded image.
         *
         * @param {Object} newImg - New image object representing the uploaded file.
         * @param {Object} oldImg - Old image object before the change.
        */
        handleFileChange(newImg, oldImg) {
            if (newImg) {
                if (!_.includes(this.validFileFormats, newImg.type)) {
                    this.testBtnClicked = false;
                    this.testResLoading = false;
                    this.$refs.upload.clear();
                    this.notifyError("Invalid file type");
                    return;
                }
                if (_.get(newImg, "response.status") == 402 && newImg.active == false) {
                    this.testResLoading = false;
                    this.testBtnTooltip = "Please upload new image to test the prompt.";
                    this.notifyError("Error while testing image prompt ", newImg.response.error.message);
                    return;
                }
                if (_.get(newImg, "response.statusCode") == 200 && newImg.active) {
                    this.testResLoading = false;
                    this.testBtnTooltip = "Please upload new image to test the prompt.";
                    this.testResult = newImg.response.data;
                    this.notifySuccess("Test case run successfully.");
                    return;
                }
                this.renderUploadedImage(newImg);
            }
        },
        /**
        @Purpose : Function to render the uploaded image for a test prompt.
            This function sets up the image element and ensures that the image is fully loaded before any subsequent actions.
            It also converts the base64 representation of the image to a readable format for display.
        */
        renderUploadedImage(img){
            if(this.uploadedImageSrc === ''){
                this.showUploadedImg = true;
                // Making base64 to img
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.thumb = e.target.result;
                    this.imgParams.file = img;
                    this.uploadedImageSrc = e.target.result;
                };
                reader.readAsDataURL(img.file);
                this.$nextTick(() => {
                    this.adjustImgPosition();
                });
            }
        },
        adjustImgPosition(){
            const container = this.$refs.uploadedImgContainer;
            const img = this.$refs.uploadedImg;

            if (!container || !img) {
                console.error("Container or image reference is undefined");
                return;
            }

            let zoom = 1;
            container.addEventListener("wheel", (e) => {
                img.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`;

                zoom += e.deltaY * -0.01;
                zoom = Math.min(Math.max(1, zoom), 5);

                if (zoom == 1) {
                    img.style.left = "0px";
                    img.style.top = "0px";
                }

                img.style.transform = `scale(${zoom})`;
            });

            let clicked = false;
            let xAxis;
            let x;
            let yAxis;
            let y;

            container.addEventListener("mouseup", () => (container.style.cursor = "auto"));

            container.addEventListener("mousedown", (e) => {
                clicked = true;
                xAxis = e.offsetX - img.offsetLeft;
                yAxis = e.offsetY - img.offsetTop;

                container.style.cursor = "grabbing";
            });

            window.addEventListener("mouseup", () => (clicked = false));

            container.addEventListener("mousemove", (e) => {
                if (!clicked) return;

                e.preventDefault();

                x = e.offsetX;
                y = e.offsetY;

                img.style.left = `${x - xAxis}px`;
                img.style.top = `${y - yAxis}px`;

                this.checkSize();
            });
        },
        checkSize() {
            const container = this.$refs.uploadedImgContainer;
            const img = this.$refs.uploadedImg;

            const containerOut = container.getBoundingClientRect();
            const imgIn = img.getBoundingClientRect();

            if (parseInt(img.style.left) > 0) {
                img.style.left = "0px";
            } else if (imgIn.right < containerOut.right) {
                img.style.left = `-${imgIn.width - containerOut.width}px`;
            }
            if (parseInt(img.style.top) > 0) {
                img.style.top = "0px";
            } else if (imgIn.bottom < containerOut.bottom) {
                img.style.top = `-${imgIn.height - containerOut.height}px`;
            }
        },
        cancelUploadedImg(){
            this.$refs.upload.clear();
            this.showUploadedImg = false;
            this.testBtnClicked = false;
            this.testBtnTooltip = "";
            this.uploadedImageSrc = "";
            this.testResLoading = false;
            this.testResult = "";
        },
        onCancelClick() {
            this.showTestDialog = false;
            this.$emit("closeTestDialog");
        },
        zoomIn() {
            this.zoomFactor += 0.1;
            this.updateZoom();
        },
        zoomOut() {
            this.zoomFactor -= 0.1;
            this.zoomFactor = Math.max(1, this.zoomFactor); // Ensure zoomFactor doesn't go below 1
            this.updateZoom();
        },
        updateZoom() {
            const image = this.$refs.uploadedImg;
            image.style.transform = `scale(${this.zoomFactor})`;
            // Update container dimensions to fit the scaled image
            this.containerWidth = image.offsetWidth * this.zoomFactor;
            this.containerHeight = image.offsetHeight * this.zoomFactor;
        },
        copyToClipboard() {
            this.copied = true;
            var textToCopy = document.getElementById('prompt-test-result-text');
            var range = document.createRange();
            range.selectNode(textToCopy);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();   
            setTimeout(() => { this.copied = false; }, 1000);
        },
        formatText(){
            if (typeof this.testResult === 'object') {
                this.testResult = JSON.stringify(this.testResult, null, 4);
            }
        },
    },
    mounted() {
        this.adjustImgPosition();
    },
}

</script>

<style lang="scss">

@import "../_idpVariables";
@import "../_idpGlobal";
@import "../_idpVariablesDark";
@import "../_idpGlobalDark";

.test-img-prompt-dialog{
    .el-dialog__body{
        height: 100%;
    }
    .el-dialog{
        height: 87%;
    }

    .prompt-test-dialog-title{
        span {
            font-size: 16px;
            font-weight : 700;
        }
    }
    .test-image-prompt {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
        height: 92%;
    }

    .test-image-prompt-section{
        flex: 1;
    }

    .prompt-test-section{
        padding: 15px;
        border: 1px solid var(--brand-01);
        overflow-x: auto;
        border-radius: 4px;
    }

    .prompt-upload-section {
        align-items: center;
        justify-content: center;
        height: 82%;
        display: flex;

        .upload-container {
            display: flex;
            flex-direction: column;
            width: -webkit-fill-available;
            max-width: -webkit-fill-available;
            max-height: -webkit-fill-available;

            .uploaded-image-container{
                width: 100%;
                height: 100vh;
                position: relative;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    object-fit: contain;
                    transition: transform 0.3s ease;
                }

                .img-customize-buttons{
                    display: inline-grid;
                    background: var(--dark-05);
                    border-radius: var(--space-xs);
                    padding: var(--space-xxs);
                    width: 20px;
                    z-index: 1;
                    position: absolute;

                    i.active {
                        color: rgba(90, 103, 216, 1);
                    }

                    .el-button {
                        background: transparent;
                        border: 0;
                        padding: var(--space-xs);
                        color: var(--white);
                        font-size: 18px;
                        margin-left: var(----space-xxs);
                    }

                    .prompt-action-btn{
                        width: 20px;
                    }
                    

                    .el-button{
                        padding: 0 !important;
                        border: none;
                    }
                    span {
                        border: none;
                    }
                }
            }
                

            .hide-div {
                display: none !important;
            }

            // Child under this div each get margin from all sides of 4px
            .drag-drop-image-container > * {
                margin: 4px;
            }

            .drag-drop-image-container{
                transition: transform 0.3s ease;
                position: relative;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                background: var(--dark-09);




                // Upload SVG
                img {
                    width : 16rem;
                    height: 14rem;
                    display: inline-block;
                }


            border: var(--border-lg) dashed var(--brand-05);
            border-radius: var(--radius-base);
            // padding: var(--space-base);
            text-align: center;

            .accepted-file-types-list {
                // padding-top: var(--space-lg);

                span {
                    font-size: var(--font-md-5);
                    background: var(--dark-08);
                    padding: var(--space-xs);
                    color: var(--dark-03);
                    display: inline-block;
                    margin: 0 var(--space-sm);
                    border-radius: var(--radius-sm);
                }

                p {
                    font-size: var(--font-sm);
                    color: var(--dark-03);

                    span {
                        float: none;
                        border: 0;
                        background: transparent;
                    }

                    a {
                        color: var(--brand-05);
                    }
                }
            }
            }
            
            //change later on
            #uploaded-image{
                height: 100%;
                width: 100%;
                transition: transform 0.3s ease;


            }
            span{
                background: #ffffff;

                a {
                    font-family: "Segoe UI";
                    text-decoration: none;
                }
            }
        }
    }

    .prompt-test-result{
        height: 82%;
        border: 1px solid var(--brand-01);
        display: flex;
        justify-content: space-between;
        border-radius: 4px;

        .text-result-buttons{
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        i {
            cursor: pointer;
            margin-left: 2rem;
        }
    
        span {
            transition: transform 0.3s ease;
            white-space: pre-wrap;
            font-size: 16px;
            font-weight: 400;
        }
    }
    
    .prompt-test-section-title{
        padding: 5px 0 5px 0;
        font-size: 16px;
    }
    
    .prompt-test-footer {
        height: 25px;
        text-align: right;

        display: flex;
        justify-content: flex-end;
        // margin-top: var(--space-lg);
        border-top: var(--border-base) solid var(--dark-06);
        padding: var(--space-base) var(--space-xl);
        // background: var(--white);

        div {
            margin-left: var(--space-lg);
        }
    }
    
    .scrollable-section {
        overflow-x: hidden;
        overflow-y: auto;
    }
    .mdi-creation{
        color: var(--brand-03);           //blue-color
    }

    .mdi-content-copy {
      color: var(--brand-03);           //blue-color
    }
    
    .mdi-check {
      color: var(--green-03);                 //green
    }
    .el-dialog{
        padding: 1rem 3rem 0.5rem 3rem;
        margin-top: 3rem !important;
    }
}

</style>