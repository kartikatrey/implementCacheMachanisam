<template>
<div v-loading="loading" :id="'messages-window-'+documentId" class="comment-container">
    <chat-window ref="chatWindow" :allIdpUsers="allIdpUsers" :org="org" @open-file="downloadFile($event)" :current-user-id="currentUserId" :rooms="rooms" :messages="messages" @send-message="sendMessage($event)" :singleRoom="true" :documentId="documentId" />
</div>
</template>

<script>
import MessagingService from "@/idp/services/MessagingService";
import moment from "moment";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import uuid from 'uuid'
// import "@/assets/scss/vue-advanced-chat.css";
import ChatWindow from "@/idp/components/chat/ChatWindow/ChatWindow.vue";
const {ShareFileClient} = require("@azure/storage-file-share");
import _ from "lodash";
import UserService from "@/idp/services/UserService";

export default {
    name: "Message",
    props: ["documentId", "isTabActive", "org","fileType"],
    computed: {
        date() {
            return moment().format("HH:MM").toString();
        },
    },
    watch: {
        org: {
            handler: function (newVal) {
                this.populateAllUsers();
            },
            immediate: true,
            deep: true,
        },

        '$store.state.isAppInBackground': {
            handler: function (newVal) {
                if (newVal) {
                    return;
                }
                this.isTabActive && this.markMessageAsRead() && this.$emit('updateCount', 0);
            },
            immediate: true,
            deep: true,
        },
        isTabActive: {
            handler: function (newVal, oldVal) {
                if (!newVal) {
                    return;
                }
                this.$emit('updateCount', 0)
                if (_.has(this.$refs, 'chatWindow.$refs.room')) {
                    this.$refs["chatWindow"].$refs["room"].scrollToBottom();
                }
                this.markMessageAsRead();
            },
            immediate: true,
            deep: true,
        },
        documentId: {
            handler: function (newVal, oldVal) {
                if (!newVal || newVal == oldVal) {
                    return;
                }
                this.fetchRoomMessages();
                this.$socket.emit(Constants.SOCKET_EVENTS.USER_JOINED_ROOM, {
                    document_id: newVal,
                });
            },
            immediate: true,
            deep: true,
        },
        messages: {
            handler: function (newVal, oldVal) {
                if (!newVal || !_.isArray(newVal) || _.isEqual(newVal, oldVal)) {
                    return;
                }
                if (this.isTabActive && !this.$store.state.isAppInBackground) {
                    this.markMessageAsRead();
                }
                const unreadCount = (_.filter(newVal, (msg) => {
                    return !(msg.read_by_user_ids || []).includes(this.currentUserId) && msg.senderId !== this.currentUserId
                }) || []).length;
                this.$emit('updateCount', unreadCount)
            },
            immediate: true,
            deep: true,
        },
    },

    components: {
        ChatWindow,
    },
    data() {
        const userId = this.$store.state.user.id;
        return {
            loading:false,
            allIdpUsers: [],
            rooms: [{
                roomId: 1,
                roomName: "Room 1",
                avatar: "assets/imgs/people.png",
                unreadCount: 0,
                index: 0,
                users: [],
                typingUsers: [],
            }, ],
            messages: [],
            currentUserId: userId,
            channelMsgs: [],
            message: "",
            subscribedUsers: [],
            isConnected: false,
        };
    },
    sockets: {
        [Constants.SOCKET_EVENTS.USER_JOINED_ROOM]: function (params) {
            this.handleUserJoinRoom(params);
        },
        [Constants.SOCKET_EVENTS.USER_ADDED_IN_ROOM]: function (params) {
            this.handleUserJoinRoom(params);
        },
        [Constants.SOCKET_EVENTS.USER_LEFT_ROOM]: function (params) {
            if (params.document_id !== this.documentId) {
                return;
            }
            this.messages.push(params.message)
            let roomInfo = _.clone(this.rooms[0])
            roomInfo.users = []
            this.$set(this.rooms, 0, roomInfo)
        },

        connect() {
            // Fired when the socket connects.
            this.isConnected = true;
        },

        disconnect() {
            this.isConnected = false;
        },

        // Fired when the server sends something on the "messageChannel" channel.
        messageChannel(data) {
            this.socketMessage = data;
        },
    },
    filters: {
        formateDate(value) {
            if (!value) return "";
            value = moment(value, "HH:mm");
            return value.format("HH:mm, DD MMM YY");
        },
    },
    computed: {},
    methods: {
        handleUserJoinRoom(params) {
            const {
                users,
                document_id
            } = params;
            if (document_id != this.documentId) return;
            this.rooms[0].users = users || [];
        },
        init() {
            this.registerEvents();
        },

        async populateAllUsers() {
            let searchQuery = {
                active: true           
            };
            let org = this.org;
            let orgQuery = {
                "org": {
                    $regex: ".*" + org + "$"
                }
            }
            if (("" + this.org).includes("/")) {
                let splittedOrg = ("" + this.org).split("/");
                orgQuery = {
                    "$or": splittedOrg.map((org) => {
                        return {
                            "org": {
                                $regex: ".*" + org + "$"
                            }
                        }
                    })
                };
            }
            if (org) {
                searchQuery = {
                    "$and": [searchQuery, orgQuery]
                }
            }         
            const keyMap = {
                full_name: "username"
            };
            let allIdpUsers = await UserService.fetch(searchQuery, ["_id","full_name","email"]);
            this.allIdpUsers = _.map(allIdpUsers, (user) => {
                return _.mapKeys(user, function (value, key) {
                    return keyMap[key] || key;
                });
            })
        },
        
        async fetchRoomMessages() {
            this.loading = true;
            const query = {
                chat_screen: true,
                document_id: this.documentId,
                current_user_id: this.currentUserId,
            };
            this.messages = await MessagingService.fetch(query);
            this.loading = false;
        },

        pushMsgOnChatScreen(messageData){
             if (!this.isTabActive && (messageData.senderId != this.currentUserId)) {
                        EventBus.$emit(Constants.BUS_EVENTS.PUSH_MESSAGE_IN_TRAY, messageData, true);
                    }
                    if (messageData.document_id != this.documentId) return
                    if (messageData.senderId != this.currentUserId) {
                        this.messages.push(messageData)
                        return
                    }
                    let index = _.findIndex(this.messages, {
                        _id: messageData._id
                    })
                    index >= 0 ? this.$set(this.messages, index, messageData) : this.messages.push(messageData);
        },
        updateMessages(messageData){
            if (messageData.document_id != this.documentId) return;
                    _.each(this.messages, (msg) => {
                        let updatedMsg = _.find(messageData.response, {
                            "message_id": msg._id
                        })
                        if (!updatedMsg) return;
                        msg.read_by_user_ids = updatedMsg.read_by_user_ids;
                        msg.seen = updatedMsg.seen;
                    })
        },

        async uploadFileToStorage(fileUploadUrl, file) {
            const shareFileClient = new ShareFileClient(fileUploadUrl);
            const res = shareFileClient.uploadData(file.blob, {
                onProgress: (p) => console.log('Upload progress ', p)
            })
            return res;
        },

        async sendMessage(details) {
            const {
                content,
                file,
                replyMessage,
                fileUploadUrl,
                fileUploadAddress,
                usersTag
            } = details || {};

            let msgPayload = this.prepareMessagePayload(content, file, fileUploadUrl, usersTag)
            this.messages.push(_.cloneDeep(msgPayload))
            if (file && fileUploadUrl) {
                await this.uploadFileToStorage(fileUploadUrl, file);
                msgPayload.file = {
                    name: file.filename,
                    size: file.size,
                    type: file.type,
                    url: ""
                }
            }
            this.$socket.emit(Constants.SOCKET_EVENTS.MESSAGE_SENT_BY_USER, msgPayload);
        },

        prepareMessagePayload(content, file, fileUploadUrl, usersTag) {
            const time = moment().toDate()
            const msgId = uuid();
            return {
                _id: msgId,
                document_id: this.documentId,
                file_type:this.fileType,
                content: content,
                senderId: this.currentUserId,
                date: time,
                timestamp: time,
                disableActions: true,
                disableReactions: true,
                distributed: false,
                saved: false,
                message_type: 'TEXT',
                status:"Unread",
                users_tag: usersTag,
                ...(file && {
                    file: {
                        name: "",
                        size: file.size,
                        type: file.type,
                        url: ""
                    }
                }),
                create_room: _.isEmpty(this.messages) && _.isEmpty(this.rooms[0].users)
            }

        },
        markMessageAsRead() {
            if ((_.last(this.messages) || {}).senderId === this.currentUserId) {
                return;
            }
            const payload = {
                document_id: this.documentId,
            };
            this.$socket.emit(Constants.SOCKET_EVENTS.MESSAGE_READ_BY_USER, payload);
            EventBus.$emit(
                Constants.BUS_EVENTS.REMOVE_CHAT_NOTIFICATION,
                this.documentId
            );
        },

        registerEvents() {
            EventBus.$on(
                Constants.BUS_EVENTS.PUSH_MSG_ON_CHATSCREEN,
                (messageData) => {
                   this.pushMsgOnChatScreen(messageData)

                }
            );

            EventBus.$on(
                "UPDATE_MESSAGES",
                (messageData) => {
                    this.updateMessages(messageData)
                }
            );
        },

        download(filename, fileUrl) {
            let link = document.createElement("a");
            link.setAttribute('download', filename);
            link.href = fileUrl;
            document.body.appendChild(link);
            link.click();

        },

        async downloadFile(details) {
            const filename = _.get(details, 'message.file.name');
            const params = {
                filename,
                document_id: this.documentId
            }
            const {
                file_url: fileUrl
            } = await MessagingService.getFileUploadConfig(params);
            if (details.action == 'preview') {
                window.open(fileUrl, "_blank").focus();
                return;
            }
            this.download(filename, fileUrl);

        }

    },
    beforeMount() {
        this.init();
    },
    beforeDestroy() {
        EventBus.$off([Constants.BUS_EVENTS.PUSH_MSG_ON_CHATSCREEN]);
    }
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal.scss";

.field-container .el-tabs__content {
    overflow: hidden !important;
}

.vac-card-window .vac-chat-container {
    height: 100%;
    display: flex;
    overflow: hidden;
    padding: 0;
}

.comment-container {
    // padding: 0 var(--space-lg);
    height: 100%;
    display: flex;
    flex-direction: column;

    .vac-card-window,
    .vac-container-scroll {
        background: transparent !important;
        height: 100% !important;
        padding: 0;
        &::-webkit-scrollbar {
            width: 3px;
        }

    
        &::-webkit-scrollbar-track {
            background: transparent;
        }

    
        &::-webkit-scrollbar-thumb {
            background: #CBD5E0;
        } 
    }

    .vac-container-scroll {
        padding: 0 var(--space-base) !important;
    }

    .comment {
        margin-bottom: var(--space-lg);

        .avtar {
            margin-right: var(--space-base);
            padding: var(--space-xs) 0;

            img {
                vertical-align: middle;
                width: 1.75rem;
                height: 1.75rem;
                border-radius: var(--radius-round);
                display: inline-block;
            }

            .date_time {
                font-size: var(--font-xs);
                color: var(--dark-05);
            }

            .user_name {
                font-size: var(--font-sm);
                color: var(--dark-02);
                padding: 0 var(--space-sm);
                display: inline-block;
            }
        }

        // avtar wrap

        .comment-msg {
            color: var(--dark-02);
            font-size: var(--font-base);
            margin: 0;
        }
    }

    // | comment
    .comment-inner {
        flex: 1;
        overflow: auto;
        padding: var(--space-lg);
    }

    // scroll
    .comment-inner::-webkit-scrollbar {
        width: 6px;
        background-color: var(--white);
    }

    .comment-inner::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px var(--dark-06);
        background-color: var(--white);
    }

    .comment-inner::-webkit-scrollbar-thumb {
        background-color: var(--dark-05);
    }

    // | scroll

    .bottom {
        background: var(--dark-08);
        height: 10rem;
        padding: var(--space-sm) var(--space-lg);
        clear: both;

        .el-textarea__inner {
            height: 3.75rem !important;
            border: var(--border-lg) solid var(--brand-05);
            border-radius: var(--radius-sm);
            margin: 0;
        }

        .btn-post {
            margin-top: var(--space-sm);
            float: right;
            padding: var(--space-md);
        }

        .attached-file {
            display: flex;
            justify-content: flex-end;
            margin-bottom: var(--space-md);

            div:first-child {
                margin-left: 0;
                margin-right: auto;
            }
        }

        .el-tag {
            background: var(--white);
            font-size: var(--font-xs);
            border: 0;
            color: var(--dark-02);
            margin-right: var(--space-sm);
            width: 70px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            position: relative;

            .el-icon-close {
                color: var(--white);
                background-color: var(--dark-04);
                position: absolute;
                top: 3px;
                right: 1px;

                &:hover {
                    background-color: var(--dark-01);
                    // color: var(--white);
                }
            }
        }

        .btn-attach {
            padding: var(--space-md);
        }
    }

    // | bottom
}

// comment container
</style>
