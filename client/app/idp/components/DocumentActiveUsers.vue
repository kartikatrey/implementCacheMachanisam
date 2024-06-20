<template>
    <section v-show="activeUsers.length" class="document-active-concurrent-users" ref="activeUsersContainer">
        <div class="document-active-concurrent-users-icon">
            <el-tooltip content="Users currently viewing this document" effect="light">
                <span class="mdi mdi-account-group"></span>
            </el-tooltip>
        </div>
        <div class="document-active-concurrent-users-wrapper">
            <div v-for="(user, index) in activeUsers" class="document-active-concurrent-user" :key="index">
                <Avatar
                    :username="user.user_name"
                    :size="22"
                    :disablePopover="false" 
                    :showClose="false" 
                    :userEmail="user.user_email"
                    :showStatus="true"
                    :status="status"
                />
            </div>
        </div>
    </section>
</template>

<script>
import Avatar from "@/idp/components/chat/components/Avatar";
import Constants from "@/resources/Constants";
import _ from "lodash";

export default {
    name: "DocumentActiveUsers",

    components: {
        Avatar,
    },

    data() {
        return {
            activeUsers : [],
            documentId : this.$route.query.id,
            currentUserEmail : this.$store.getters.userEmail,
            status : {
                state : true
            }
        };
    },

    sockets: {
        // Handles the socket event for updating document user information.
        [Constants.SOCKET_EVENTS.DOCUMENT.SYNC_DOCUMENT_ROOM_USERS]: function (usersInfo) {
            // Remove current user information
            _.remove(usersInfo, { user_email: this.currentUserEmail });

            // Update UI to display other users
            this.activeUsers = usersInfo;
        },
    },

    methods: {
        /* Emits a socket event to notify the server that this user is joining the document. */
        emitDocumentJoinNotification() {
            this.$socket.emit(Constants.SOCKET_EVENTS.DOCUMENT.DOCUMENT_JOIN_EVENT, { document_id: this.documentId });
        },

        /* Emits a socket event to notify the server that this user is leaving the document. */
        emitDocumentLeaveNotification() {
            this.$socket.emit(Constants.SOCKET_EVENTS.DOCUMENT.DOCUMENT_LEAVE_EVENT, { document_id: this.documentId });
        },
        
        /* Enables horizontal scrolling while disabling left-to-right scrolling. */
        enableHorizontalScroll() {
            const activeUsersContainer = this.$refs.activeUsersContainer;
            activeUsersContainer.addEventListener('wheel', function (e) {
                if (e.deltaX > 0) {
                    // Prevent left-to-right scrolling on mouse trackpad
                    e.preventDefault();
                    return;
                }
                if (e.deltaY > 0) {
                    activeUsersContainer.scrollLeft += 100;
                } else {
                    activeUsersContainer.scrollLeft -= 100;
                }
            });
        }
    },

    mounted() {
        // Emits a document leave notification to the server if the client closes the tab.
        window.addEventListener("beforeunload", (e) => {
            this.emitDocumentLeaveNotification();
        });

        // Enables horizontal scrolling.
        this.enableHorizontalScroll();

        // Emits a socket event when the page loads up.
        this.$nextTick(() => {
            this.emitDocumentJoinNotification();
        });
    },

    beforeDestroy() {
        // Emits a document leave notification to the server if the client changes a route.
        this.emitDocumentLeaveNotification();
    }
};
</script>


<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.document-active-concurrent-users {
    display: flex;
    overflow-y: auto;
    gap: 5px;
    align-items: center;
    background: var(--dark-07-1);
    padding: .7rem;
    overflow-x: auto;
    white-space: nowrap;
    margin-top: 2px;
    .document-active-concurrent-users-wrapper {
        display: inline-block;
    }
    
    .document-active-concurrent-user {
        display: inline-block;
        margin: 0 .5rem;
    }

    .document-active-concurrent-users-icon{
        .mdi-account-group {
            margin: 0 .5rem;
            font-size: 1.5rem;
            color: var(--brand-04);
        }
    }
    
}
</style>
