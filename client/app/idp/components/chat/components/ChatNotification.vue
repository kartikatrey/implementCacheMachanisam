<template>
  <div class="chat-notification-wrapper">
    <div class="notification-wrap">
      <div
        class="message-notification"
        v-bind:class="{
          'message-notification-expand read': isActive,
          'message-notification-collapse unread': !isActive,
        }"
      >
        <div class="header">
          <el-row>
            <el-col :span="3">
              <span class="message-icon">
                <i class="mdi mdi-chat"></i>
              </span>
            </el-col>
            <el-col :span="19">
              <span class="title">
                <span class="type">Chat notification</span>
                <span class="invoice-name">
                  {{ notification.document_name }}</span
                >
              </span>
              <el-button
                type="text"
                round
                class="mdi mdi-chevron-up toggle-btn"
                @click="toggleCollapse"
              ></el-button>
              <el-button
                type="text"
                round
                class="mdi mdi-close close-btn"
                @click="closeNotification"
              ></el-button>
            </el-col>
          </el-row>
        </div>

        <div
          @click="onMessageClick"
          v-for="message in getMessages"
          class="messages-wrapper"
        >
          <el-row>
            <el-col :span="3">
              <div class="notification-row notification-time">
                {{ message.date | getTimeDifference }}
              </div>
            </el-col>
            <el-col :span="19">
              <div class="messages">
                <avatar
                  class="notification-avatar"
                  v-bind="prepareAvatarObject(message)"
                ></avatar>
                <span
                  v-if="!message.file && message.content"
                  v-html="formatMsg(message)"
                  class="notification-message-text"
                ></span>
                <span
                  v-else-if="message.file"
                  class="notification-message-text attachment"
                  ><span class="mdi mdi-paperclip">{{ message.file.name }}</span
                  ><br /><span
                    v-if="message.content && isActive"
                    v-html="formatMsg(message)"
                  ></span
                ></span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- message-notification -->
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Avatar from "@/idp/components/chat/components/Avatar.vue";
import _ from "lodash";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
moment.locale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "seconds",
    ss: "%ss",
    m: "a minute",
    mm: "%dm",
    h: "an hour",
    hh: "%dh",
    d: "a day",
    dd: "%dd",
    M: "a month",
    MM: "%dM",
    y: "a year",
    yy: "%dY",
  },
});

export default {
  components: {
    Avatar,
  },
  filters: {
    getTimeDifference: function (date) {
      return moment(date).fromNow();
    },
  },
  computed: {
    getMessages: function () {
      const msgs = this.isActive
        ? _.clone(this.notification.messages)
        : (_.clone(this.notification.messages) || []).slice(0, 3);
      return msgs;
    },
  },
  props: {
    notification: {
      type: Array,
      required: true,
      default: [],
    },
  },
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    formatMsg(details) {
      let message = details.content;
      details.users_tag &&
        details.users_tag.forEach((user) => {
          const index = message.indexOf(user._id);
          const isTag = message.substring(index - 9, index) === "<usertag>";
          if (isTag) message = message.replace(user._id, `@${user.username}`);
        });
      return message;
    },

    closeNotification() {
      this.markMessageAsRead();
    },
    toggleCollapse() {
      this.isActive = !this.isActive;
    },
    markMessageAsRead() {
      const payload = {
        last_message_posted_time: (_.first(this.notification.messages) || {})
          .date,
        document_id: this.notification.document_id,
      };
      EventBus.$emit(
        Constants.BUS_EVENTS.REMOVE_CHAT_NOTIFICATION,
        this.notification.document_id
      );
      this.$socket.emit(Constants.SOCKET_EVENTS.MESSAGE_READ_BY_USER, payload);
    },
    navigate(pageRoute){
        this.$router
        .push({
          path: pageRoute,
          query: {
            id: this.notification.document_id,
            filter: JSON.stringify({
              propertiesActiveTab: "message",
            }),
          },
        })
        .catch((err) => {
          console.log(err)
          this.$router.go();
        });
    },
    onMessageClick() {
      let pageRoute = "/idp/document-view";
      if (this.notification.file_type == Constants.DOCEX.DOCUMENT_FILETYPES.EXCEL) {
        pageRoute = "/idp/excel-view";
      }
      this.navigate(pageRoute)
      EventBus.$emit(
        Constants.BUS_EVENTS.REMOVE_CHAT_NOTIFICATION,
        this.notification.document_id,
        true
      );
      this.markMessageAsRead();
    },

    prepareAvatarObject(user) {
      return {
        username: user.full_name || user.username,
        src: user.avatar,
        size: 30,
      };
    },
  },
};
</script>

<style lang="scss">
@import "../../../_idpGlobal.scss";
@import "../../../_idpVariables.scss";

.chat-notification-wrapper {
  usertag {
    color: #0d579c;
  }
  .message-notification {
    padding: 0.4rem 0 0.9rem 0;
    // margin-bottom: .3rem;
    border-bottom: 1px solid var(--dark-07);

    .header {
      position: relative;

      .message-icon {
        text-align: right;
        padding-top: 0.5rem;
        display: block;
        transform: scaleX(-1);
        padding-right: 1.5rem;

        i {
          font-size: 2.8rem;
          color: var(--dark-06);
        }
      }

      .title {
        color: #000;
        padding: 1rem 1rem 0rem 1rem;
        border: 0;
        display: block;

        .type {
          display: block;
          font-size: var(--font-sm);
          color: var(--dark-04);
          font-weight: 400;
        }

        .invoice-name {
          font-size: var(--font-md);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          display: block;
          line-height: 2rem;
        }
      }

      .toggle-btn,
      .close-btn {
        position: absolute;
        top: 0%;
        padding: 7px;
        font-size: 1.6rem;
        color: var(--dark-03);
      }

      .close-btn {
        right: 0.7rem;
        font-size: 1.4rem;
      }

      .toggle-btn {
        right: 3rem;
      }
    }

    //header
    .messages-wrapper {
      cursor: pointer;

      .notification-time {
        font-size: var(--font-xs);
        color: var(--dark-05);
        padding-top: 0.6rem;
        display: block;
        text-align: right;
      }

      .messages {
        display: flex;
        align-items: center;
        // line-height: 1;
        padding-left: 0.5rem;
        height: 24px;

        .notification-avatar {
          margin-right: var(--space-xs);
          transform: scale(0.6, 0.6);
          line-height: 0;
        }

        .notification-message-text {
          color: var(--dark-03);
          font-size: var(--font-md);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          display: block;
          font-weight: 400;
          padding-right: var(--space-base);
        }
      }
    }

    // message wrapper
  }

  // message notification wrapper

  .message-notification.unread {
    background: var(--brand-09);

    .notification-message-text {
      font-weight: 500 !important;
      color: var(--dark-02) !important;
    }
  }

  .message-notification-expand {
    .toggle-btn {
      transform: rotate(-180deg);
    }

    .messages {
      height: auto !important;
      align-items: start !important;
    }

    .notification-message-text {
      line-height: 1.7rem;
      white-space: normal !important;
      overflow: visible !important;
      padding-top: 2px;
    }

    .messages-wrapper {
      margin-bottom: 0.2rem;
    }

    .attachment {
      padding-top: 4px;
    }
  }
}
</style>
