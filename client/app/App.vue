<template>
    <div class="app-container">
        <div class="layout-container flex justify-center" v-if="!isIdp" :class="{
            column: navPos === 'top' || navPos === 'bottom',
            boxed: boxed,
            'footer-above': footer === 'above',
            'content-only': !navPos,
          }">
            <transition name="fade">
                <div class="splash-screen" v-if="splashScreen">
                    <div class="wrap">
                     
                    </div>
                </div>
            </transition>
    
            <vertical-nav :position="navPos" :collapse-nav="collapseNav" :open-sidebar.sync="openSidebar" @collapse-nav-toggle="collapseNav = !collapseNav" @push-page="closeSidebar" v-if="navPos === 'left'" />
    
            <div class="container flex column box grow">
                <div class="header" v-if="toolbar === 'top'">
                    <Toolbar @toggle-sidebar="openSidebar = !openSidebar" :menu-burger="navPos" />
                </div>
                <horizontal-nav :position="navPos" @push-page="closeSidebar" v-if="navPos === 'top'" />
                <div class="header" v-if="toolbar === 'bottom'">
                    <Toolbar @toggle-sidebar="openSidebar = !openSidebar" :menu-burger="navPos" />
                </div>
    
                <div class="main box grow flex">
                    <span class="main-out-border--top-left" v-if="roundedCorners"></span>
                    <span class="main-out-border--top-right" v-if="roundedCorners"></span>
                    <span class="main-out-border--bottom-left" v-if="roundedCorners"></span>
                    <span class="main-out-border--bottom-right" v-if="roundedCorners"></span>
                    <transition :name="viewAnimation" mode="out-in">
                        <router-view :key="$route.fullPath" class="view box grow" />
                    </transition>
                </div>
    
                <horizontal-nav :position="navPos" @push-page="closeSidebar" v-if="navPos === 'bottom'" style="margin-bottom: 0" />
    
                <!-- <Footer v-if="footer === 'below'" :position="footer"/> -->
            </div>
    
            <vertical-nav :position="navPos" :collapse-nav="collapseNav" :open-sidebar.sync="openSidebar" @collapse-nav-toggle="collapseNav = !collapseNav" @push-page="closeSidebar" v-if="navPos === 'right'" />
    
            <Footer v-if="footer === 'above'" :position="footer" />
    
            <!-- <layout-picker :position="navPos" v-if="isLogged"/> -->
        </div>
        <idp v-if="isIdp" />
    </div>
    </template>
    
    <script src="https://js.stripe.com/v3/"></script><script>
    import {
        detect
    } from "detect-browser";
    const browser = detect();
    // @ is an alias to /src
    import HorizontalNav from "@/core/horizontal-nav.vue";
    import VerticalNav from "@/core/vertical-nav.vue";
    import Toolbar from "@/core/toolbar.vue";
    import Footer from "@/core/footer.vue";
    import Idp from "@/idp/idp.vue";
    import LayoutPicker from "@/components/layout-picker.vue";
    import {
        checkIfIdpUser
    } from "@/util/CommonUtil";
    import _ from "lodash";
    import Constants from "@/resources/Constants";
    import EventBus from "@/EventBus";
    import {
        stripHtml
    } from "string-strip-html";
    import UserService from "@/idp/services/UserService";
    import DAService from "@/services/DAService";
    import roleService from "@/idp/services/RoleService";
    import userAccessService from "@/idp/services/UserAccessService";
    import "./idp/_idpGlobalDark.scss";
    import {renderUserSelectedTheme} from '@/util/CommonUtil';
    
    export default {
        name: "App",
        data() {
            return {
                uiConfig:{},
                collapseNav: false,
                openSidebar: false,
                innerWidth: 0,
                /* Whenver we were login to the sso , old portal UI was loaded first for a moment.
                To overcome this, we made this so always idp portal ui will be loaded.*/
                isIdp: true
            };
        },
    
        sockets: {
            connect: function () {
                // alert("connected")
    
                //    if(_.isEmpty(this.$store.state.notification))
                //    {
                //       window.isNotification = true
                //       let socletId = this.$socket.id 
                //       this.$store.commit("setNotification", {[socletId] : true});
                //    }
    
            },
    
            disconnect: function () {
                // alert("disconnected")
    
                //    let notification =  this.$store.state.notification;
                //    let socketId = this.$socket.id 
                //    if(_.keys(notification).includes(socketId)){
                //       this.$store.commit("setNotification", {});
                //    }            
            },
    
            [Constants.SOCKET_EVENTS.ERROR]: function (message) {
                this.$notify &&
                    this.$notify.error({
                        title: "Error",
                        message,
                    });
            },
    
            [Constants.SOCKET_EVENTS.MESSAGE_SENT_BY_USER]: function (message) {
                this.handleRoomMessage(message);
            },
            [Constants.SOCKET_EVENTS.MESSAGE_READ_BY_USER]: function (documentId) {
                EventBus.$emit(
                    Constants.BUS_EVENTS.REMOVE_CHAT_NOTIFICATION,
                    documentId
                );
            },
            [Constants.SOCKET_EVENTS.UPDATE_MESSAGES]: function (messages) {
                EventBus.$emit(
                    "UPDATE_MESSAGES",
                    messages
                );
            }
        },
        computed: {
            navPos() {
                if (
                    this.innerWidth <= 768 &&
                    (this.$store.getters.navPos === "top" ||
                        this.$store.getters.navPos === "bottom")
                ) {
                    return "left";
                }
                return this.$store.getters.navPos;
            },
            toolbar() {
                return this.$store.getters.toolbar;
            },
            footer() {
                return this.$store.getters.footer;
            },
            boxed() {
                return this.$store.getters.boxed;
            },
            roundedCorners() {
                return this.$store.getters.roundedCorners;
            },
            viewAnimation() {
                return this.$store.getters.viewAnimation || "none";
            },
            isLogged() {
                return this.$store.getters.isLogged;
            },
            splashScreen() {
                return this.$store.getters.splashScreen;
            },
            selectedTheme(){
                return this.$store.getters.selectedTheme;
            }
        },
        methods: {
             async getUiSetup(){ 
               
             try {
                let uiSetupData = await DAService.find();
                this.uiConfig=_.get(uiSetupData[0],'ui_config')
                document.documentElement.style.setProperty('--main-color', this.uiConfig.main_color ||"#e2e8f0" );  
                document.documentElement.style.setProperty('--sub-color1', this.uiConfig.sub_color1 || "#edf2f7");
                document.documentElement.style.setProperty('--sub-color2', this.uiConfig.sub_color2 ||"#f7fafc"); 
                  this.$store.commit("setUiConfig", {
                mainColor: this.uiConfig.main_color || "",
                subColor1: this.uiConfig.sub_color1|| "",
                subColor2:  this.uiConfig.sub_color2 || "",
                logo: this.uiConfig.logo|| "",
                fabIcon: this.uiConfig.fabIcon|| "",
              });
                  const favicon = document.getElementById("favicon"); 
                 if( this.uiConfig.fab_icon)
                 {
                     favicon.href = this.uiConfig.fab_icon;   
                 } 
                
            } catch (error) {
                document.documentElement.style.setProperty('--main-color', "#e2e8f0" );  
                document.documentElement.style.setProperty('--sub-color1',  "#edf2f7");
                document.documentElement.style.setProperty('--sub-color2', "#f7fafc"); 
                //this.notifyError("Error");
            }
         },
            handleRoomMessage(message) {
                if (this.$store.state.isAppInBackground) {
                    this.showBrowserNotification(message);
                    return;
                }
                let eventName = this.isSameDocumentOpen(message.document_id) ?
                    Constants.BUS_EVENTS.PUSH_MSG_ON_CHATSCREEN :
                    Constants.BUS_EVENTS.PUSH_MESSAGE_IN_TRAY;
                EventBus.$emit(eventName, message, true);
            },
    
            hasMessagePopoverOpen(documentId){
               return !!(document.getElementById(`messages-window-${documentId}`));
            },    
    
            
            isSameDocumentOpen(documentId) {
                const isSameDocumentOpen =((_.get(this.$route, "query.id") === documentId &&
                    _.get(this.$route, "path", "").includes("/idp/document-view")) ||  this.hasMessagePopoverOpen(documentId))
                   
                return isSameDocumentOpen;
            },
    
            handleVisibilityChange() {
                if (document.visibilityState === "visible") {
                    this.$store.commit("setVisibility", false);
                    console.log("App in foreground");
                    return
                }
                this.$store.commit("setVisibility", true);
                console.log("App in backgroud");
            },
    
            showBrowserNotification(messageData) {
                EventBus.$emit(Constants.BUS_EVENTS.PUSH_MSG_ON_CHATSCREEN, messageData);
                if (messageData.senderId == this.$store.state.user.id) {
                    return;
                }
                EventBus.$emit(Constants.BUS_EVENTS.PUSH_MESSAGE_IN_TRAY, messageData);
                Notification.requestPermission().then(() => {
                    let {
                        message,
                        title
                    } = this.formatMessage(messageData)
                    let notification = new Notification(
                        title, {
                            body: message,
                            icon: "https://portal.kanverse.ai/favicon.ico",
                            tag: `${this.$store.state.user.id}_${messageData._id}`
                        }
                    );
                    notification.onclick = () => {
                        this.handleNotificationClick(notification, messageData)
                    };
                });
            },
    
            formatMessage(messageData) {
                let message = messageData.content ? messageData.content : _.get(messageData, 'file.name')
                messageData.users_tag && messageData.users_tag.forEach(user => {
                    const index = message.indexOf(user._id)
                   // const isTag = message.substring(index - 9, index) === '<usertag>'
                    if (index>=0) message = message.replace(user._id, `@${user.username}`)
                })
                const isCurrentUserTagged = _.find(messageData.users_tag, (user) => {
                    return user._id == this.$store.state.user.id
                })
                const title = !isCurrentUserTagged ? `Received new message from ${messageData.username}` : `${messageData.username} mentioned you in a chat`;
                return {
                    message: (stripHtml(message)).result,
                    title
                };
            },
    
            handleNotificationClick(notification, messageData) {
                let pageRoute = "/app/idp/document-view?id="
                if(messageData.file_type ==Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL){
                    pageRoute = "/app/idp/excel-view?id="
                }
                notification.close();
                const windowName = window.location.hostname
                window.focus('', windowName, '');
                let win = window.open(
                    `${origin}${pageRoute}${
                  messageData.document_id
                }&filter=${JSON.stringify({
                  propertiesActiveTab: "message",
                  messageId: messageData._id,
                })}`,
                    windowName
                );
            },
            resizeOpenNav() {
                this.innerWidth = window.innerWidth;
                if (window.innerWidth <= 768) {
                    this.collapseNav = false;
                }
            },
            closeSidebar() {
                this.openSidebar = false;
            },
        },
        components: {
            HorizontalNav,
            VerticalNav,
            Toolbar,
            Footer,
            LayoutPicker,
            Idp,
            DAService
        },
        created() {
            if (browser.name)
                document.getElementsByTagName("html")[0].classList.add(browser.name);
        },
        mounted() {
            this.resizeOpenNav();
            window.addEventListener("resize", this.resizeOpenNav);
            window.addEventListener("beforeunload", (event) => ({
    
            }));
    
        },
        beforeDestroy() {
            window.removeEventListener("resize", this.resizeOpenNav);
            window.removeEventListener("visibilitychange", this.handleVisibilityChange);
        },
        async beforeMount() {
            this.getUiSetup();
            Notification &&
                Notification.requestPermission().then(function () {
                    console.log("Browser notifications are enabled now...");
                });
            const self = this;
            document &&
                document.addEventListener("visibilitychange", this.handleVisibilityChange);
                renderUserSelectedTheme(this.$store.getters.selectedTheme);
            const user = this.$store.getters.user;
            const isIdpUser = this.isIdpUser(user);

            // Fetch all configurations record from DB based on user role IDs
            const roleBasedConfig = await userAccessService.getRoleAccessConfig(user.role_ids)
            this.$store.commit("setRoleAccessConfig", roleBasedConfig);

            // Check if the user is an IDP user and render the new UI
            this.isIdp = true;
            if (window.location.pathname == "/") {
                window.location.replace("/app/idp");
            }

            // Check if the user is not an IDP user and does not have any IDP Roles
            if (
                (
                    _.includes(_.get(user, "roles", []), "customer") ||
                    _.includes(_.get(user, "roles", []), "admin")
                ) &&
                !isIdpUser
            ) {
                this.isIdp = false;
                if (window.location.pathname == "/") {
                    window.location.replace("/app");
                }
            }
        },
    };
    </script>
    
    <style lang="scss">
    @import "./assets/scss/_variables";
    @import "./assets/scss/_mixins";
    @import "./idp/_idpGlobalDark.scss";
    
    .app-container {
        height: 100%;
    }
    
    .layout-container {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        background: $background-color;
    
        .container {
            overflow: hidden;
    
            .header {
                height: 50px;
                margin-bottom: 26px;
                padding-bottom: 12px;
                background: #ffffff;
                border-bottom: 1px solid #c9d4dd;
    
                .el-input__inner {
                    background: #e3f5fc;
                    border: 0.5px solid #00a7e0;
                    border-radius: 100px;
                    height: auto;
    
                    &::placeholder {
                        color: #008abf;
                    }
                }
    
                .box-right {
                    padding-top: 10px;
                }
            }
    
            .main {
                position: relative;
                overflow: hidden;
                padding: 0 0px;
            }
    
            .view {
                // padding: 40px;
                padding: 40px 40px 40px 30px;
                padding-top: 0px;
                box-sizing: border-box;
                transition: all 0.4s cubic-bezier(0.55, 0, 0.1, 1);
                backface-visibility: hidden;
                /*-webkit-perspective: 1000px;*/
            }
    
            .fade-top-in-out-enter {
                opacity: 0;
                transform: translate(0, 30px);
            }
    
            .fade-top-in-out-leave-active {
                opacity: 0;
                transform: translate(0, 30px);
            }
    
            .fade-top-enter {
                opacity: 0;
                transform: translate(0, 30px);
            }
    
            .fade-top-leave-active {
                opacity: 0;
                transform: translate(0, -30px);
            }
    
            .fade-bottom-in-out-enter {
                opacity: 0;
                transform: translate(0, -30px);
            }
    
            .fade-bottom-in-out-leave-active {
                opacity: 0;
                transform: translate(0, -30px);
            }
    
            .fade-bottom-enter {
                opacity: 0;
                transform: translate(0, -30px);
            }
    
            .fade-bottom-leave-active {
                opacity: 0;
                transform: translate(0, 30px);
            }
    
            .fade-left-enter {
                opacity: 0;
                transform: translate(30px, 0);
            }
    
            .fade-left-leave-active {
                opacity: 0;
                transform: translate(-30px, 0);
            }
    
            .fade-right-enter {
                opacity: 0;
                transform: translate(-30px, 0);
            }
    
            .fade-right-leave-active {
                opacity: 0;
                transform: translate(30px, 0);
            }
    
            .fade-enter {
                opacity: 0;
            }
    
            .fade-leave-active {
                opacity: 0;
            }
    
            .main-out-border {
    
                &--top-left,
                &--top-right {
                    background: linear-gradient($background-color, rgba(230, 235, 241, 0));
                    height: 16px;
                    position: absolute;
                    width: 8px;
                    z-index: 1;
                    top: 4px;
                }
    
                &--bottom-left,
                &--bottom-right {
                    background: linear-gradient(rgba(230, 235, 241, 0), $background-color);
                    height: 16px;
                    position: absolute;
                    width: 8px;
                    z-index: 1;
                    bottom: 4px;
                }
    
                &--top-left,
                &--bottom-left {
                    left: 42px;
    
                    &::after {
                        content: "";
                        height: 5px;
                        position: absolute;
                        right: -4px;
                        top: -4px;
                        width: 12px;
                        box-shadow: 8px 0px 0px 0px $background-color inset;
                        border-top-left-radius: 5px;
                    }
                }
    
                &--top-right,
                &--bottom-right {
                    right: 42px;
    
                    &::after {
                        content: "";
                        height: 5px;
                        left: -4px;
                        position: absolute;
                        top: -4px;
                        width: 12px;
                        box-shadow: -8px 0px 0px 0px $background-color inset;
                        border-top-right-radius: 5px;
                    }
                }
    
                &--bottom-left:after {
                    border-radius: 0;
                    border-bottom-left-radius: 5px;
                }
    
                &--bottom-right:after {
                    border-radius: 0;
                    border-bottom-right-radius: 5px;
                }
    
                &--bottom-left,
                &--bottom-right {
                    &::after {
                        top: initial;
                        bottom: -4px;
                    }
                }
            }
        }
    
        &.boxed {
            max-width: 1300px;
            margin: 0 auto;
            box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.15),
                0px 0px 5px 0px rgba(0, 0, 0, 0.1);
        }
    
        &.footer-above {
            padding-bottom: 40px;
            position: relative;
        }
    
        &.content-only {
            .container {
    
                .main-out-border--top-left,
                .main-out-border--top-right,
                .main-out-border--bottom-left,
                .main-out-border--bottom-right {
                    display: none;
                }
            }
        }
    }
    
    html:not(.ie) {
        .layout-container {
            .container {
                max-width: 1920px;
            }
        }
    }
    
    @media (min-width: 1920px) {
        .layout-container:not(.boxed) {
            &.column {
                .container {
                    margin: 0 auto;
                }
            }
        }
    }
    
    @media (max-width: 768px) {
        .layout-container {
            .container {
                /*width: 100%;
    
    max-width: 100%;
    
    height: 100%;
    
    max-height: 100%;*/
    
                .header {
                    height: 50px;
                    background: #fff;
                    box-shadow: 0px -20px 10px 20px rgba(0, 0, 0, 0.25);
                    margin: 0;
                    margin-bottom: 5px;
    
                    .toggle-sidebar {
                        box-shadow: none !important;
                    }
    
                    .search-box {
                        &>.el-autocomplete {
                            box-shadow: none !important;
                        }
                    }
                }
    
                .main {
                    padding: 0 5px;
                }
    
                .view {
                    //padding: 5px;
                    max-width: 100%;
                    padding: 15px;
                    padding-left: 15px;
                    padding-right: 15px;
                }
    
                .main-out-border--top-left,
                .main-out-border--top-right,
                .main-out-border--bottom-left,
                .main-out-border--bottom-right {
                    display: none;
                }
            }
        }
    }
    
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s ease-out;
    }
    
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
    </style>
    