<template>
<div style="postion: fixed; top: 0">
    <header :class="(apptour)?'idp-toolbar idp-toolbar-apptour':'idp-toolbar'" class="idp-toolbar">
        <div class="logo">
            <img id="logo"  :src="logoPath" />
        </div
        ><!-- | logo -->
        
        <!-- Menu list -->
        <div class="top-menu-container">
            <el-menu cid="idp-header-menu" class="el-menu-demo idp-menu-item" :default-active.sync="activeLink" mode="horizontal" @select="goto" :unique-opened="true" :class="{ 'nav-collapsed': collapseNavToggle }">
                <template  v-for="item in menuItems">
                    <el-submenu popper-class="dashboard-submenu" :class="[ activatedLabel == 'Dashboard' ? 'is-toolbar-menu-active' : 'is-toolbar-menu-inactive' ]" v-bind:key="item.id" :index="item.url" v-if="item.sub_menu && item.children.length > 0">
                           <template  slot="title"><i v-if="item.class" :class="item.class"></i><span class="mdi mdi-menu-down"></span>{{ item.label }}</template >
                           <el-menu-item  v-bind:key="childMenu.id" v-for="childMenu in item.children" :index="childMenu.url ? childMenu.url : childMenu._id">
                               <span slot="title">
                                 <el-radio v-model="activeLink" :label="childMenu.url">{{ childMenu.label }}</el-radio>
                               </span>
                               <!--<i v-if="childMenu.class" :class="childMenu.class"></i>{{ childMenu.label }}</span>-->
                           </el-menu-item>
                    </el-submenu>
                    <el-menu-item v-bind:key="item.id" :class="[ item.label == activatedLabel ? 'is-toolbar-menu-active' : 'is-toolbar-menu-inactive' ]" :cid="'toolbar-' + item.label" :index="item.url ? item.url : item._id" v-show="staticMenu.includes(item.label)">
                        <span slot="title"><i v-if="item.class" :class="item.class"></i>{{ item.label }}</span>
                    </el-menu-item>
                    <el-menu-item v-bind:key="item.id" :class="[ item.label == activatedLabel ? 'is-toolbar-menu-active' : 'is-toolbar-menu-inactive' ]" :cid="'toolbar-Configurations'" @click="renderChildMenus(item)" v-if="!item.sub_menu && item.children && item.children.length > 0" :index="item.url ? item.url : item._id">
                        <span slot="title"><i v-if="item.class" :class="item.class"></i>{{ item.label }}</span>
                    </el-menu-item>
                </template >
                <template >
                    <el-menu-item v-if="showMenuEllipsis" class="toolbar-dropdown">
                            <el-dropdown size="small" @command="setActiveMenus">
                                <span class="el-dropdown-link">
                                    <i class="mdi mdi-dots-vertical stage-dropdown-icon" style="margin: auto;"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <span v-for="item in menuItems" :key="item">
                                        <el-dropdown-item v-if="ellipsisMenuItems.includes(item.label)" class="dropdown-item" v-bind:key="item.id" :cid="'toolbar-' + item.label" :index="item.url ? item.url : item._id " :command="{url: item.url, label: item.label}">
                                            {{item.label}}
                                        </el-dropdown-item>
                                    </span>
                                </el-dropdown-menu>
                            </el-dropdown>
                    </el-menu-item>
                </template >
            </el-menu>
        </div>
        <!-- Removed user domain dependancy -->
        <!-- | user domain Menu 
        <div class="domain-wrap" v-if="userDomains.length > 1">
             <el-select name="document_type" v-model="defaultDomain" placeholder="Select document type"  v-on:change="onDocumentTypeChange()">
                               <el-option v-for="domain in userDomains" :key="domain._id" :label="domain.name" :value="domain._id"></el-option>
             </el-select>
        </div> -->

        <!-- Login as system button -->
        <div class="upload-wrap" v-if="isIdpAdmin()">
            <el-button class="btn-upload" cid="idp-toolbar-upload" @click="loginAsSystem">
                <i class="mdi mdi-arrow-left-circle-outline"></i>
                Kanverse dashboard
            </el-button>
        </div>
        <!-- Show reuest demo button -->
        <div class="upload-wrap"  v-if="!isIdpAdmin() && isTryItUser()">
            <el-button class="btn-upload btn-request-demo" cid="idp-toolbar-request-demo" @click="requestDemo">
                <i class="mdi mdi-menu-right"></i>
                Request Demo
            </el-button>
        </div>
        <div class="upload-wrap"  v-if="!isIdpAdmin()">

            <el-button :disabled="hasButtonPermission(uploadBtnTitle)" :class="(apptour)?'btn-upload upload-apptour':'btn-upload'" cid="idp-toolbar-upload" @click="showUploadModal">
                <i class="mdi mdi-plus-circle"></i>
                {{uploadBtnTitle}}
            </el-button>
        </div>
        <div v-if="!isTryItUser() && !isVendorUser()" class="report-issue-wrap">
            <el-tooltip effect="light" content="Raise an issue" placement="bottom">
                <!-- <el-button @click="$router.push({ path: '/idp/report-issue'})"> -->
                <el-button :disabled="hasButtonPermission('Raise an issue')" cid="idp-toolbar-raise-issue" @click="handleRaiseIssue()">
                    <i class="mdi mdi-bug-outline"></i>
                </el-button>
            </el-tooltip>
        </div>

        <!-- System health  -->
        <div class="avtar-wrap">
            <el-popover placement="bottom" popper-class="profile-container" trigger="click">
                <i slot="reference" cid="idp-toolbar-health-monitor" :class="systemHealthStatus"></i>
                <div style="text-align: right; margin: 0" v-for="obj in systemHealthList" :key="obj.system_name">
                    <el-button :cid="obj.system_name" size="mini" type="text">
                        <i :class="obj.icon"></i>
                        {{ obj.system_name }}
                    </el-button>
                </div>
            </el-popover>
        </div>

        <!-- | Search Documnets test  -->
          <!-- Help Function        -->
        <div v-if="!isTryItUser() && !isVendorUser()" class="help-wrap" >
            <el-button :disabled="hasButtonPermission('Idp Toolbar help')" icon="mdi mdi-help" class="btn-help" cid="idp-toolbar-help" @click="displayHelpMenu" circle>
            </el-button>
        </div>
           <!-- Help Function        -->
        <!-- Notification icon -->
        <div v-if="!isVendorUser()" class="notification-wrap">
            <el-popover placement="bottom-start" width="450"  max-height="200" popper-class="notification-container" trigger="click" visible-arrow="true">

                <NotificationTray :notifications="notifications" />
                <div class="load-more-wrap" v-if="messageCount > 0">
                    <el-button type="text" @click="handleLoadMore" class="load-more-button" :disabled = "disabled" :loading = "loading" ><i class="mdi mdi-menu-down"></i> Load more...</el-button>
                </div>

                <el-button slot="reference" :disabled="hasButtonPermission('toolbar-notification')" cid="idp-toolbar-notification" icon="mdi mdi-bell" v-on:click="
              () => {
                showNotificationTray = !showNotificationTray;
              }
            ">
                    <span class="notifications" v-if="messageCount > 0">{{messageCount}}</span>
                </el-button>
            </el-popover>
        </div>
        <!-- | Notifications  -->

    <!-- Profile menu -->
    <div class="avtar-wrap">
            <span v-if="isLoggedInAsKanCustomer()" v-html="getKanAdminUserName()"></span>
            <span v-html="getUserFullName()" v-else></span>
            <el-dropdown size="mini" @command="handleCommand">
                <el-popover placement="bottom" popper-class="profile-container" disabled>
                    <avatar cid="idp-toobar-profile-menu" class="profile-avatar" slot="reference" :disablePopover="true" :username="getUserFullName()" :src="getUserAvatar()" :size="25"></avatar>
                </el-popover>
                <el-dropdown-menu slot="dropdown" class="profile-wrap">
                    <el-dropdown-item v-if="!isTryItUser()" cid="idp-toobar-profile-profile" command="profile">Profile</el-dropdown-item>
                    <el-dropdown-item v-if="!isTryItUser() && !isVendorUser()" cid="idp-toobar-profile-accounts" command="accounts">Accounts</el-dropdown-item>
                    <el-dropdown-item v-show ="isIdpApprover" cid="idp-toobar-myApprovals"  command="myApprovals">My Approvals</el-dropdown-item>
                    <el-dropdown-item cid="idp-toobar-profile-logout"  command="logout">Logout</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <!-- | Avtar  -->
    </header>
    <div>
        <idp-upload v-if="showModal" @closeDialog="closeDialog" :data="uploadParams" :multiple="true" ref="upload" :showHeaderTabs="true"></idp-upload>
        <idp-upload-try-it v-if="showTryItModal" @closeDialog="closeDialog" :data="uploadParams" :accept="getValidDocType" :multiple="true" ref="upload" :showHeaderTabs="true"></idp-upload-try-it>
    </div>
    <!--my approval -->
    <el-dialog v-if="showMyApprovals" :visible.sync="showMyApprovals" title="Approvals" width="60%" class="approvalList-modal">
        <MyApprovals :closeMyApprovalModal="closeMyApprovalModal"></MyApprovals>
    </el-dialog>
    <!--my approval -->
    <el-dialog :close-on-click-modal="false" width="65%" top="11vh" title="Raise issue" :visible.sync="dialogFormVisible" @close="resetIssueForm">
        <el-form :model="form" :rules="formRules" ref="form" v-if="showIssueForm">
            <el-form-item label="Subject" :label-width="formLabelWidth" prop="subject">
                <el-input cid="idp-raise-issue-subject" v-model="form.subject" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Description" :label-width="formLabelWidth" prop="description">
                <vue-editor cid="idp-raise-issue-description" v-model="form.description" :editorToolbar="customToolbar"></vue-editor>
            </el-form-item>
            <el-form-item label="Attachment" :label-width="formLabelWidth">
                <el-upload class="upload-issue" ref="upload" :action="endpoint" :data="form" :file-list="fileList" :on-success="onIssueReported" :on-change="handleFileChange" :multiple="false" :auto-upload="false">
                    <el-button cid="idp-raise-issue-select-file" slot="trigger" size="small" type="primary">Select file</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer" v-if="showIssueForm">
            <el-button cid="idp-raise-issue-cancel" @click="dialogFormVisible = false">Cancel</el-button>
            <el-button cid="idp-raise-issue-submit" type="primary" @click="createTicket()">Submit</el-button>
        </span>
        <div v-if="!showIssueForm" style="text-align: center; word-break: normal">
            <i class="mdi mdi-check-circle-outline" style="font-size: 100px; color: green"></i>
            <h4 style="padding-left: 20px; padding-right: 15px; font-weight: 400">
                {{ successMessage }}
            </h4>
            <span slot="footer" class="dialog-footer">
                <el-button cid="idp-raise-issue-close" @click="dialogFormVisible = false">Close</el-button>
            </span>
        </div>
    </el-dialog>

    <!-- tour -->
        <el-dialog class="app-tour"  title="Shipping address" :visible.sync="apptour">
            <div class="arrow-up"></div>
            <h1>Upload document</h1>
            <div class="tour-msg">Hey, hit this button to upload your documents. You can also select from the available sample documents and get started.</div>
            <div slot="footer" class="dialog-footer">
                <el-button class="btn-got-it" size="mini" type="primary" @click="apptour = false">Got it!</el-button>
            </div>
        </el-dialog>

        <!-- tour -->

</div>
</template>

<script>
import MenuService from "@/services/MenuService";
import TryItService from "@/services/TryItService";
import DashboardDrillDownService from "../services/DashboardDrillDownService";
import EventBus from "@/EventBus";
import IdpUpload from "@/idp/components/IdpUpload";
import IdpUploadTryIt from "@/idp/components/IdpUploadTryIt";
import Constants from "@/resources/Constants";
import ReportIssueService from "@/services/ReportIssueService";
import UserService from "@/idp/services/UserService";


import {
    VueEditor
} from "vue2-editor";
import {
    Loading
} from "element-ui";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import _ from "lodash";
import HealthMonitorService from "@/services/HealthMonitorService";
import MessagingService from "@/idp/services/MessagingService";
import NotificationTray from "@/idp/toolbar/NotificationTray.vue";
import Avatar from "@/idp/components/chat/components/Avatar.vue";
import MyApprovals from "@/idp/components/MyApprovals.vue";
import {
    stripHtml
} from "string-strip-html";
import CustomerService from "@/idp/services/CustomerService";
import ScriptService from "@/idp/services/ScriptService"
const defaultRoute = "/idp/document-setup-list";
const darkLogo= require('@/assets/images/logo-dark-theme.svg');
const lightLogo= require('@/assets/images/logo-ai.svg');
export default {
    name: "IdpToolbar",
    props: ["documentType"],
    data() {
        return {
            activatedLabel: "",
            showMenuEllipsis: false,
            uploadBtnTitle: "Upload",
            //logo: this.$store.getters.uiConfig.logo || require('@/assets/images/logo-ai.svg'),     
            staticMenu: [],
            ellipsisMenuItems: [],
            customers:[],
            showMyApprovals:false,
            showProfileDropdown:false,
            customer_id: "",
            showNotificationTray: false,
            configSelectedClass: "",
            showUploadButton: true,
            isIe: true,
            isEdge: true,
            menuItems: [],
            showModal: false,
            showTryItModal: false,
            uploadParams: null,
            activeLink: "",
            dialogFormVisible: false,
            apptour: false,
            issueLoader: false,
            showIssueForm: true,
            successMessage: "",
            fileList: [],
            defaultDomain:null,
            loadingInstance: "",
            formLabelWidth: "120px",
            notifications: [],
            selected_theme:"",
            endpoint: Constants.REPORT_ISSUE_ENDPOINT,
            customToolbar: [
                ["bold", "italic", "underline"],
                [{
                    list: "ordered"
                }, {
                    list: "bullet"
                }],
            ],
            form: {
                subject: "",
                description: "",
            },
            pageTitle: "issue",
            formRules: {
                subject: [{
                    required: true,
                    message: "Please enter subject",
                    trigger: "blur",
                }, ],
                description: [{
                    required: true,
                    message: "Please enter description",
                    trigger: "blur",
                }, ],
            },
            systemHealthList: [],
            systemHealthStatus: "",
            page : 1,
            itemsPerPage : 5,
            offset : 0,
            messageCount : 0,
            loading : false,
            disabled:false
        };
    },
    sockets: {
        connect: function () {},
        disconnect: function () {},
        //This socket event receives HEALTH_STATUS event
        [Constants.SOCKET_EVENTS.UPDATE_SYSTEM_HEALTH_STATUS]: function (healthStatusData) {
            console.log("check healthStatusData for socket event",healthStatusData)
            this.refreshHealthStatus(healthStatusData);
        }
    },
    computed: {
        // Removed user domain dependancy
        // userDomains(){
        //     return this.$store.state.user.user_domains || [];
        // },
        getValidDocType() {
            return Constants.DOCEX.VALID_FILE_TYPES.join(",");
        },
        logoPath(){
            const selectedTheme = this.$store.getters.selectedTheme;
            if(selectedTheme == Constants.DOCEX.THEMES.DARK){
                return darkLogo;
            } else{
                return lightLogo;
            }
        },
        isIdpApprover(){
            let idpUserLoggedRoles = _.get(this.$store, 'getters.user.roles', [])
            return idpUserLoggedRoles.includes(Constants.DOCEX.ROLES_MAP.IDP_APPROVER);
        },
        async notificationCount() {
            // const userId = this.$store.state.user.id
            // const query = {
            //     tray: true,
            //     current_user_id: userId,
            //     count : true
            // };
            // const count = await MessagingService.fetch(query,0,0).catch(console.error);
            // // const notificationCount = _.isArray(this.notifications)? _.size(this.notifications) : 0;
            // this.messageCount = _.isArray(count) && count[0] ?count[0].document_count : this.messageCount;
            // console.log(`notificationCount:: ${ typeof this.messageCount}`)
            // return;
        },

    },

    watch: {
        documentType: {
            handler: function (newVal, oldval) {
                if (!newVal || newVal == oldval) {
                    return;
                }
                this.prepareUploadParams();
            },
            immediate: true,
            deep: true,
        },
        $route(to, from) {
            this.setMenu(to.path);
        },
        messageCount : {
            handler : function (newVal, oldVal){
                this.disabled =  newVal <= this.itemsPerPage ? true : newVal == this.notifications.length ;
            }
        }
    },
    methods:  {
    handleCommand(command) {
        const func = this.getCommandMap(command);
        func && func();
    },
    getCommandMap(command) {
        const commandMap = {
            "profile": this.showProfile,
            "accounts": this.updateMenusForAccounts,
            "myApprovals": this.showMyApprovalModal,
            "logout": this.logout
        }
        return commandMap[command];
    },
    showMyApprovalModal(){
        this.showMyApprovals = true;
    },
    closeMyApprovalModal(){
        this.showMyApprovals = false;
    },
    displayHelpMenu() {
            this.$router.push({
                path: "/idp/help-page"
            });
        },
        handleRaiseIssue(){
            window.open(Constants.FRESHDESK_URL,"_blank")
        },
        async loginAsSystem(){
                let params = { customer_id: Constants.SYSTEM_CUSTOMER_ID };
                let response = await CustomerService.loginWithCustomer(params);
                this.$store.commit("setCustomerId", Constants.SYSTEM_CUSTOMER_ID );
                this.$store.commit("setImpersonate", response.data.is_impersonate);
                let user = this.$store.getters.user;
                user["permitted_widgets"] = response.data.permitted_widgets || [];
                user["permitted_dashboard_pages"] = response.data.permitted_dashboard_pages || [];
                this.$store.commit("setUser", user);
                window.location.replace("/app/idp");
        },
        toggleNotificationtray() {
            this.showNotificationTray = false;
        },

        markNotificationAsRead(documentId, closeNotification = false) {
            closeNotification ? this.showNotificationTray = false : null;
            const notificationIndex = _.findIndex(this.notifications, {'document_id': documentId})
            if (notificationIndex < 0) return;
            // Reset messages if load more button enabled ( Get fresh messages from start )
            if(this.messageCount > this.itemsPerPage && !this.disabled){
                this.notifications  = []
                this.page = 1;
                this.offset = 0;
                this.messageCount--;
                this.fetchNotficationMessageCount();
                this.fetchNotficationMessages();
                this.notifications.splice(notificationIndex, 1);
                return ;
            }
            let groupedMessages = this.notifications[notificationIndex];
            //here we have to update multiple mesges based on document id
            let docId = groupedMessages.messages[0]._id;
            let param = {
              status: "Read",
              document_id: docId,
            };
            const response = MessagingService.markMessagesAsRead(param);
            this.messageCount--; // When we close the message we have to decrease the tray count
            this.fetchNotficationMessageCount();
            this.notifications.splice(notificationIndex, 1);
            this.notifications.length == 0 ? this.showNotificationTray = false : null;
        },

        async fetchNotficationMessages() {
            // const storage = JSON.parse(localStorage.getItem("vuex"));
            const userId = this.$store.state.user.id
            // storage["user"] && storage["user"]["id"] ? storage["user"]["id"] : null;
            const query = {
                tray: true,
                current_user_id: userId,
                count: false,
                status:"Unread"
            };
            this.loading = true;
            let notificationMessages = await MessagingService.fetch(query, this.itemsPerPage, this.offset).catch(console.error);
            this.loading = false;
            // Check if notificationMessages having the key as 'messages' in any of its object, if not then return
            if(!notificationMessages.some(notification => notification.hasOwnProperty('messages')) || !notificationMessages.length) return;
            // If new notification received then reset the notification variable with updated messages
            if( this.page == 1) {
                this.notifications = notificationMessages;
                this.disabled = !(this.messageCount > this.notifications.length);
                return;
            }
            // When we click on loadmore we have to append the messages
            this.notifications = this.notifications.concat(notificationMessages) ;
            this.disabled = !(this.messageCount > this.notifications.length);

        },
        registerEvents() {
            EventBus.$on(
                Constants.BUS_EVENTS.PUSH_MESSAGE_IN_TRAY,
                (messageData, notify = false) => {
                    if (messageData.senderId == this.$store.state.user.id) {
                        return;
                    }
                    if (notify) {
                        let msgPayload = this.formatMessage(messageData);
                        if (messageData.file) {
                            msgPayload.message = messageData.file.name
                        }
                        this.$notify.success(msgPayload);
                    }
                    // Avoid duplicate messages in tray, reseting notifications
                    this.notifications  = []
                    this.page = 1;
                    this.offset = 0;
                    this.fetchNotficationMessageCount();
                    this.fetchNotficationMessages();

                }

            );

            EventBus.$on(
                Constants.BUS_EVENTS.REMOVE_CHAT_NOTIFICATION,
                (documentId, closeNotification) => {
                    this.markNotificationAsRead(documentId, closeNotification)
                }
            );

            EventBus.$on("show_upload_apptour", () => {
                this.isTryItUser() && (this.apptour = true);
            });
        },

        formatMessage(messageData) {
            let message = messageData.content
            messageData.users_tag && messageData.users_tag.forEach(user => {
                const index = message.indexOf(user._id)
                //const isTag = message.substring(index - 9, index) === '<usertag>'
                if (index>=0) message = message.replace(user._id, `@${user.username}`)
            })
            let isCurrentUserTagged = _.find(messageData.users_tag, (user) => {
                return user._id = this.$store.state.user.id
            })
            let title = !isCurrentUserTagged ? `${messageData.username} sent you a message` : `${messageData.username} mentioned you in a chat`;
            // const regEx = /(<usertag\b[^>]*>)[^<>]*(<\/usertag>)/i;
            message = stripHtml(message);
            return  {
                title: title,
                message: `${message.result}`,
                dangerouslyUseHTMLString: true
            }
        },

        resetIssueForm() {
            this.issueLoader = false;
            this.showIssueForm = true;
            this.form.subject = "";
            this.form.description = "";
            this.fileList = [];
            this.$refs["form"].resetFields();
        },
        handleFileChange(file, fileList) {
            this.fileList = [file];
        },
        async createTicket() {
            const valid = await this.$refs.form.validate();
            if (!valid) {
                return;
            }
            this.loadingInstance = Loading.service({
                target: ".el-dialog",
                lock: true,
                fullscreen: false,
            });
            this.issueLoader = true;
            if (this.$refs.upload && !_.isEmpty(this.$refs.upload.uploadFiles)) {
                this.$refs.upload.submit();
                return;
            }
            try {
                const result = await ReportIssueService.save(this.form);
                this.onIssueReported(result);
            } catch (error) {
                this.notifyError("Error while reporting issue");
            }
        },
        onIssueReported(result, file, fileList) {
            this.loadingInstance.close();
            this.issueLoader = false;
            if (result.data.status) {
                this.showIssueForm = false;
                this.successMessage = result.data.message;
                return;
            }
            this.notifyError(result.data.message);
        },
        logout() {
            this.$store.commit("setUidefault");
            window.location.replace("/logout");
        },
        hideProfilePopover(){
            this.showProfileDropdown = false;
        },
        async showProfile() {
            this.$router.push({
                path: "/idp/user-profile",
                query: {}
            });
        },
        async updateMenusForAccounts() {
            let menuItems = await MenuService.fetchMenus({menuURLs: ["/idp/profile-accounts", "/idp/billing/list", "/idp/payment-cards"]});
            menuItems = menuItems && menuItems[0] && menuItems[0].children;
            EventBus.$emit("DISPLAY_IDP_NAVBAR", menuItems, "/idp/billing/list");
        },
        setMenu(path) {
            if (["/idp/all-document-list", "/idp/error-analytics", "/idp/download-document"].includes(path)) {
                this.configSelectedClass = "";
                this.activeLink = "";
                return;
            }
            let isValidRoute = _.find(this.menuItems, (menu)=>{
                if(menu.sub_menu){
                   let isSubMenu =  _.find(menu.children, (childMenu)=>{
                      return childMenu.url == path
                   })
                 let isRoutePresent =  !!(isSubMenu);
                 return isRoutePresent
                }else{
                    return menu.url == path
                }
           } );

            // if (!isValidRoute) {
            //     this.activeLink = "";
            //     this.configSelectedClass =
            //         path == "/idp/document-view" ? "" : "is-active";
            //     return;
            // }
            // this.activeLink =isValidRoute.sub_menu ? path : isValidRoute.url;
            this.configSelectedClass = "";
        },
        getUserFullName() {
            let user = this.$store.getters.user;
            return (user && user["full_name"]) || "";
        },
        getKanAdminUserName(){
            let user = this.$store.getters.user;
            let userName = (user && user["full_name"]) || "";
            let kanCustomerName = localStorage.getItem('customerName')? '(' + localStorage.getItem('customerName') + ')' :''
            userName += ` <span class="kanverse-admin-customer-name">  ${' '+kanCustomerName}  </span>`
            return userName;
        },
        getUserAvatar() {
            let user = this.$store.getters.user;
            // const user = JSON.parse(localStorage.getItem("user") || "{}");
            return (user && user["avatar"]);
        },
        prepareUploadParams() {
            const filter = DashboardDrillDownService.findCurrentFilter();
            let uploadParams = {};
            uploadParams.service_name = "docExService";
            uploadParams.document_type =
                this.documentType || Constants.DOCEX.DOCUMENT_TYPES.INVOICE;
            uploadParams.directory_path = filter.folderPath;
            this.uploadParams = uploadParams;
        },
        showUploadModal() {
            this.prepareUploadParams();
            if(this.isTryItUser()) {
                this.apptour = false;
                this.showModal = false;
                this.showTryItModal = true;
                return
            }
            this.showModal = true;
            this.showTryItModal = false;
        },
        requestDemo(){
            TryItService.requestDemo();
            this.notifySuccess("Thanks for requesting a demo. A Kanverse expert is on the way to contact you shortly.");
        },
        closeDialog() {
            if(this.$refs.upload.$refs.upload){
                this.$refs.upload.$refs.upload.fileList = [];
                this.$refs.upload.$refs.upload.outputData = [];
            }
            this.showModal = false;
            this.showTryItModal = false;
        },

        getFilter() {
            let filter = {};
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const filterString = urlParams.get("filter");
                filter = JSON.parse(filterString || "{}");
            } catch (err) {
                filter = {};
            }
            return filter;
        },
        /* 
        *  Purpose: setting the class for highlight the selected element 
        */
        highLightSelectedMenu(url){
            if(url == null){
                return
            }else if(url.charAt(0) != '/'){
                this.menuItems.forEach(item=> item._id == url? this.activatedLabel = item.label :  "")
            }else if(url == '/idp/document-setup-list'){
                this.activatedLabel = 'Configurations'
            }else if(url == '/idp/operations-dashboard' || url == '/idp/fraud-dashboard' || url == '/idp/analytics-dashboard'){
                this.activatedLabel = 'Dashboard'
            }else{
                this.menuItems.forEach(item=> item.url ==  url ? this.activatedLabel = item.label :  "")
            }       
        },
        /* 
        *  Purpose: setting the visible toobar menus and dropdown menus. 
        */ 
        setActiveMenus(data){
            let route = data.url
            let toolbarValue = data.label
            var oldStaticValue = this.staticMenu.pop();
            // Step 1: Remove the selected menu from the dropdown list.
            this.ellipsisMenuItems = this.ellipsisMenuItems.filter(item => item !== toolbarValue);
            // Step 2: Add the selected menu to the static menu, which is visible in the toolbar.
            this.staticMenu.push(toolbarValue);
            // Step 3: Add the previously active menu to the dropdown list.
            this.ellipsisMenuItems.push(oldStaticValue);
            this.goto(route)
        },
        async goto(route, indexPath) {
            this.highLightSelectedMenu(route)
            if (route.includes("assistance/test/")) {
                window.open(indexPath[0]);
                return;
            }
            if (route.charAt(0) === "/") {
                // let filter = this.getFilter();
                // delete filter["folderPath"];
                this.$router.push({
                    path: "" + route,
                    query: {}
                });
                // this.$emit("push-page", { page: index });
            }
        },
        renderChildMenus(item) {
            const sortedMenus = _.orderBy(
                _.filter(item.children, { hidden: false }),
                ['label'],
                ['asc']
            );
            // To highlist the configuartion
            EventBus.$emit(
                "DISPLAY_IDP_NAVBAR",
                _.filter(item.children, {
                    hidden: false
                }),
                // Retrieve the first menu route from the sorted navbar menus list
                // if it exists; otherwise, use the default route.
                _.get(sortedMenus, '[0].url', defaultRoute)
            );
        },
        setLink(path) {
            this.activeLink = path;
        },
        collapseNavToggle() {
            this.$emit("collapse-nav-toggle");
        },
        pushPage(index, indexPath) {
            this.$emit("push-page", {
                page: index
            });
        },
        closeNav() {
            this.$emit("update:openSidebar", false);
        },
        /* 
        *  Purpose: Limits the visible toobar menus to a specified number and adds the remaining menus to a dropdown list. 
        */
        setActiveMenuLimit(menuItems){
            let allMenu = []
            for(let i=0;i<menuItems.length;i++){
                if(menuItems[i].url && !menuItems[i].sub_menu){
                   allMenu.push(menuItems[i].label)
                }
            }
            if(allMenu.length>4){
               this.showMenuEllipsis = true
            }
            // limiting the visible menus
            this.staticMenu = allMenu.slice(0, 4)
            // setting the rest menus in dropdown
            this.ellipsisMenuItems = allMenu.slice(4, allMenu.length)            
        },
        async fetchMenus() {
            try {
                let menuItems = await MenuService.fetchMenus();
                EventBus.$emit("GET_MENUS", menuItems);
                this.menuItems = _.filter(menuItems, {
                    hidden: false
                });
                // highlight the selected menu
                this.highLightSelectedMenu(window.location.pathname.substring(4))
                this.setActiveMenuLimit(this.menuItems)
                // to set active menu in the visible toolbar list
                const activeMenu = this.menuItems.filter(item => item.url == window.location.pathname.substring(4))
                if(this.ellipsisMenuItems.includes(_.get(activeMenu[0], "label"))){
                    this.setActiveMenus(activeMenu[0])
                }
                this.setMenu(this.$route.path);
            } catch (error) {
                console.log(error);
            }
        },
        async refreshHealthStatus(systemHealthData){
            if (systemHealthData.length) {
                const healthData = systemHealthData[0].data;
                this.systemHealthList = [];
                this.systemHealthStatus = _.find(healthData, (obj) => {
                    return obj.status == "failed";
                }) ?
                    "system_down" :
                    "system_up";
                console.log("check healthData",healthData)
                for (const obj of healthData) {
                    const system_name = obj.system;
                    const icon = obj.status == "failed" ? "system_down" : "system_up";
                    this.systemHealthList.push({
                        system_name,
                        icon,
                    });
                }
            }
        },

        //Get system healt status
        async getSystemHealthStatus(){
            const healthData = await HealthMonitorService.getLatestHealthLog();
            this.refreshHealthStatus(healthData)
        },

        //Removed user domain dependancy
        // setDefaultDomain()  {
        //                 this.defaultDomain =  _.get(this.userDomains[0], '_id');
        // },
        async initConfiguration(){
            this.getSystemHealthStatus();
            await this.fetchMenus();
            // this.setDefaultDomain(); // removed user domain dependancy
        },
        deRegisterEvents() {
            EventBus.$off([
                    Constants.BUS_EVENTS.PUSH_MESSAGE_IN_TRAY,
                    Constants.BUS_EVENTS.REMOVE_CHAT_NOTIFICATION,
                    "show_upload_apptour"
                ]);
            },
        handleLoadMore() {
                this.page++;
                this.offset = (this.page - 1) * this.itemsPerPage;
                this.fetchNotficationMessages();
            },
        async fetchNotficationMessageCount() {
            const userId = this.$store.state.user.id
            const query = {
                tray: true,
                current_user_id: userId,
                count: true,
                status:"Unread"
            };
            try{
                const docRes = await MessagingService.fetch(query, 0, 0);
                this.messageCount = docRes && docRes[0] && docRes[0].document_count
            }catch(err){
                console.error(err)
                this.messageCount = 0;
            }
        },
        /**
         * Purpose : To fetch all scripts into window object
         * * Step 1 : Create element in document object
         * * Step 2 : Set all scripts from /portal/api/scripts into "src" object
         */
       async loadAllScripts() {
                if (window['all_scripts_loaded']) {
                    return;
                }
                // Step 1 : Create element in document object
                let script = document.createElement('script');
                    script.setAttribute('script', "script");
                    script.setAttribute("type","text/javascript")
                    script.setAttribute('async', "");
                    // Step 2 : Set all scripts from /portal/api/scripts into "src" object
                    script.setAttribute('src','/portal/api/all-client-scripts');
                    document.head.appendChild(script);
                window['all_scripts_loaded'] =  true
            },

    },
    components: {
        Avatar,
        IdpUpload,
        IdpUploadTryIt,
        VueEditor,
        NotificationTray,
        MyApprovals
    },
    created() {},
    beforeDestroy() {
        this.deRegisterEvents();
    },
    beforeMount() {
        const user = UserService.getUserFromStore();
        this.uploadBtnTitle = user.is_vendor_user ? "Submit" : "Upload";
        console.log("isVendorUser => ", this.isVendorUser())
        this.registerEvents();
        this.fetchNotficationMessageCount();
        this.fetchNotficationMessages();
            },
    async mounted() {
        this.initConfiguration();
        await this.loadAllScripts();

    },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.approvalList-modal  {
    .el-dialog {
      padding: 1.7rem;
      .vue-good-table-box {
        height: 360px;
        overflow: auto;
      }
      .vue-good-table-box .vgt-table tbody tr td {
        text-align: left;
      }
      .export-btn  {
        display: none;
      }
       .table-toolbar {
            margin-right: 3rem;
       }
    }
    .table-toolbar .support-btn .refreshbtn {
      span {
          transform: scale(1.4);
          display: block;
      }
    }

  }

.app-tour {
    .el-dialog {
        width: 21.5rem;
        right: 7rem;
        background: var(--brand-04);
        margin-top: 4.5rem !important;
        min-width: auto;
        position: absolute;
        overflow: visible;
         padding: 2.6rem !important;
         box-shadow: none;
 box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;



            .el-dialog__body {
                color: var(--brand-09);

                h1 {
                    font-weight: 450;
                    margin: 0;
                    font-size: 1.4rem;
                    font-weight: 500;
                     color: var(--white);
                         margin-bottom: 1rem;
                }
                .tour-msg {
                    font-weight: 350;
                    margin-top: var(--space-sm);
                       color: var(--white);
                    word-break: break-word;
                }

            }

            .el-dialog__footer {
                padding: 0;
                text-align: left;
                margin-top: 2.5rem;
            }
            .dialog-footer {
                // display: flex;
                // justify-content: flex-end;
                padding: 0;
                 margin-top: 2rem;
                .btn-skip {
                    // background: var(--brand-06);
                        color: var(--brand-07) !important;
                        text-decoration: underline;
                        margin-left: 0;
                        margin-right: auto;
                        font-weight: 400;
                        padding: 0;
                           &:hover {
                            text-decoration: none !important;
                            color: var(--brand-09) !important;
                        }
                }
                .btn-got-it {
                    background: var(--brand-02) !important;
                    color: var(--brand-06) !important;
                    border-radius: var(--radius-round) !important;
                    border: 0 !important;
                        font-weight: 500 !important;
                        transition: all ease-in-out .35s !important;

                       &:hover {
                            background: var(--brand-02) !important;
                            text-decoration: none !important;
                            color: var(--brand-09) !important;
                        }

                }
            }

                .arrow-up {
                   width: 0;
                    position: absolute;
                    padding: 0;
                    top: -11px;
                    left: 46%;
                    height: 0;
                    border-left: 11px solid transparent;
                    border-right: 11px solid transparent;
                    border-bottom: 11px solid var(--brand-04);
                }

    }// el-dialog
}


.el-menu--popup-bottom-start {
        margin-top: 15px !important;
}
i.system_down {
    cursor: pointer;
    margin-top: 7px;
    height: 10px;
    width: 10px;
    background-color: red;
    border-radius: 50%;
    display: inline-block;
    background: linear-gradient(#f06060 30%, #a30505 66%, #4d0202 100%);
}

i.system_up {
    cursor: pointer;
    margin-top: 7px;
    height: 10px;
    width: 10px;
    background-color: green;
    border-radius: 50%;
    display: inline-block;
    background: linear-gradient(#a5f005 30%, #54a907 66%, #195206 100%);
}

// new style theme
.idp-toolbar.idp-toolbar-apptour {
    position: unset;

}
.idp-toolbar {
    height: 2.457rem;
    background: var(--white);
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
    width: 100%;
    position: fixed;
    top: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    z-index: 999;
    padding: 0 var(--space-sm);

    .logo {
        margin-left: 0;
        margin-right: 0;
        padding: var(--space-sm) var(--space-sm) var(--space-sm) var(--space-base);
        width: 14rem;
        clear: both;

        img {
            height: 100%;
            float: left;
        }
    }

    .el-submenu__title {
        line-height: 0px !important;
        height:0px !important;
    }

    .el-submenu__icon-arrow{
      display:none;
    }


    // | logo

    .top-menu-container {
        margin-left: 1.4rem;
        margin-right: auto;

        .el-menu--horizontal {
            min-height: auto;
            box-sizing: border-box;
        }

        ul {
            list-style: none;
            height: 100%;
            margin: 0;
            padding: 0;
            width: auto;
            background: transparent;

            // .el-menu-item.is-active {
            //     color: #4a5568;
            //     background-color: var(--dark-07);
            //     border-bottom: 0;
            // }
        }

        .idp-menu-item {
            display: inline-block;
            height: 100%;

            .el-submenu {
                .el-submenu__title {
                    height: 100% !important;
                    line-height: 2.3rem !important;
                     border-bottom: 0;
                        .mdi-menu-down {
                            font-size: 1.8rem;
                                color: #909399;
                        }
                }
            }
            .el-submenu.is-active {
                    .el-submenu__title {
                        // background-color: var(--brand-09) !important;
                        // background-color:var(--dark-07)!important;
                        color: var(--brand-03);
                            .mdi-chart-bar,
                            .mdi-menu-down {
                                color: var(--brand-03);
                            }
                    }
            }
              .el-submenu:hover,
              .is-opened {
                    .el-submenu__title {
                        background-color: var(--brand-09);
                        color: var(--brand-03);

                        // background-color:var(--dark-07)!important;
                        // color: var(--brand-03);
                            .mdi-chart-bar,
                            .mdi-menu-down {
                                color: var(--brand-04);
                            }
                    }
                }

            .el-menu-item {
                height: 100%;
                padding: 0 13px;
                line-height: unset;
                font-size: inherit;
                display: flex;
                align-items: center;

                span {
                    i {
                        margin-right: 8px;
                        font-size: 16px;
                    }

                    font-size: var(--font-base);
                    height: 100%;
                    display: inline-block;
                    display: flex;
                    align-items: center;
                }
            }

            .el-menu-item:hover {
                background-color: var(--brand-09);
                color: var(--brand-04);
                i {
                    color: var(--brand-04);
                }
            }

            .el-menu-item.active {
                background-color: var(--brand-09) !important;
                color: var(--brand-03);
            }
        }
    }

    // | top menu container

    .report-issue-wrap {
        position: relative;
        overflow: hidden;
        display: inline-block;
        margin-left: var(--space-base);
        padding: var(--space-xs) 0;

        i {
            vertical-align: sub;
            font-size: var(--font-lg);
            padding-left: 5px;
            font-weight: 200;
        }

        .el-button {
            padding: 0 var(--space-lg) 0 var(--space-base);
            color: var(--dark-02);
            font-weight: 400;
            font-size: var(--font-sm);
            cursor: pointer;
            border-radius: var(--radius-round);
            border: 0;
            font-size: var(--font-sm);
            height: 100%;
            outline: none;
            line-height: 170%;
        }
    }

    .domain-wrap {
		padding: var(--space-xs) 0;

				.el-input--suffix .el-input__inner {
					background-color: var(--dark-07);
					padding: 0 1.5rem 0 1rem;
					color: var(--dark-01);
					font-weight: 400;
					font-size: 0.857rem;
					cursor: pointer;
					border-radius: 6.25rem;
					border: 0;
					font-size: 0.857rem;
					height: 23px;
					outline: none;
					line-height: 40px;
				}

	}

    .upload-wrap {
        position: relative;
        overflow: hidden;
        display: inline-block;
        margin-left: var(--space-base);
        padding: var(--space-xs) 0;

        i {
            vertical-align: bottom;
            font-size: var(--font-lg);
            margin-right: .1rem;
            font-weight: 200;
        }
        .btn-upload.upload-apptour {
            //  background-color: var(--brand-04);
             color: var(--brand-03);
               font-size: var(--font-base);
               position: relative;
               z-index: 99999;
                font-weight: 500;
        }

        .btn-upload {
            background-color: var(--dark-07);
            padding: 0 var(--space-lg) 0 var(--space-base);
            color: var(--dark-03);
            font-weight: 400;
            font-size: var(--font-base);
            cursor: pointer;
            border-radius: var(--radius-round);
            border: 0;
            height: 100%;
            outline: none;
            line-height: 170%;
        }
        .btn-request-demo {
            background-color: var(--brand-04) !important;
            color: var(--brand-09-5) !important;
            font-size: 1rem !important;
            font-weight: 350 !important;
            padding: 0 1.5rem 0 0.5rem !important;
                i {
                    font-size: 1.3rem;
                    position: relative;
                    display: inline-block;
                    padding: 0;
                    margin: 0;
                    font-size: 2rem;
                    vertical-align: middle;
                    line-height: 0;
                    width: 21px;
                    top: -1px;
                }
        }

        input[type="file"] {
            font-size: 120px;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
        }
    }

    // | upload wrap

    .search-wrap {
        position: relative;
        margin-left: var(--space-base);
        padding: 2px;

        input {
            background-color: var(--dark-07);
            padding: var(--space-sm) var(--space-lg) var(--space-sm) var(--space-xxl);
            color: var(--dark-02);
            border-radius: var(--radius-round);
            border: 0;
            font-size: var(--font-sm);
            width: 8rem;
            outline: none;

            &::placeholder {
                color: var(--dark-05);
                font-weight: normal;
            }
        }

        .el-button {
            background: none;
            border: 0;
            position: absolute;
            padding: 0.375rem;
            left: 0.55rem;
            font-size: var(--font-lg);
            color: var(--dark-05);
        }
    }

    .avtar-wrap {

        .kanverse-admin-customer-name{
            font-weight:500
        }
        color: var(--dark-02);
        margin-left: var(--space-base);
        margin-right: var(--space-base);
        padding: var(--space-xs) 0;

        .profile-avatar {
            cursor: pointer;
        }

        .avatar {
            vertical-align: middle;
            width: 1.75rem;
            height: 1.75rem;
            border-radius: 50%;
            display: inline-block;
            margin-left: var(--space-sm);
        }

        span {
            display: inline-block;
            vertical-align: unset;
            color: var(--dark-03);
            font-size: var(--font-sm);
        }
    }

    // | avtar-wrap

    .notification-wrap {
        padding: var(--space-xs) 0;
        margin-left: var(--space-base);
        position: relative;
        .notification-container {
            padding: auto 0 !important;
        }

        button {
            background-color: var(--dark-07);
            border: 0;
            border-radius: var(--radius-round);
            height: 100%;
            outline: none;
            width: 2rem;
            cursor: pointer;
            padding: 0;
            font-size: 1.3rem;

            span {
                font-size: 1.4rem;
            }
        }

        .notifications {
            border-radius: var(--radius-round);
            background-color: var(--red-04);
            color: var(--white);
            font-size: 0.857rem !important;
            width: 1.554em;
            height: 1.554em;
            position: absolute;
            top: var(--space-xxs);
            right: -12px;
            font-weight: 100;
            line-height: 160%;
            display: block;
			text-align: center;
        }
    }

    // | notification-wrap
        .help-wrap {
        padding: var(--space-xs) 0;
        margin-left: var(--space-base);
        position: relative;
        button {
            background-color: var(--dark-07);
            border: 0;
            border-radius: var(--radius-round);
            height: 100%;
            outline: none;
            width: 2rem;
            cursor: pointer;
            padding: 0;
            font-size: 1.3rem;

            span {
                font-size: 1.4rem;
            }
        }
    }
}

.load-more-wrap{
    display: flex;
    justify-content: center;
    padding: 0.5rem 0;
    border-top: 1px solid  var(--dark-08);
}
.el-button.load-more-button{
    border: none;
    background: none;
    color: var(--dark-02);
    padding: 0px;
    // margin-top: 13px;
    text-decoration: none;
        i {
            vertical-align: sub;
            color: var(--dark-04);
        }
}

i.mdi-menu-down::before{
    font-size: x-large;
}
// .el-button.load-more:hover {
//     background: none !important;
// }
// | header

.profile-container {
    min-width: 4rem !important;
    padding: 1px 4px 2px 1px !important;
    background: white !important;
}
.is-toolbar-menu-active {
    color: #4a5568 !important;
    background-color: var(--dark-07);
    border-bottom: 0 !important;
}
.is-toolbar-menu-inactive {
    border-bottom: none !important;
}
.toolbar-dropdown{
    background: transparent !important;
    border-bottom: none !important;
}
.profile-wrap{
    li.el-dropdown-menu__item {
        color: var(--brand-03);
    }
    text-align: right; 
    margin: 0px;
}
</style>
