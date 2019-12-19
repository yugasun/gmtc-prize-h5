<template>
  <div
    id="app"
    class="container"
  >
    <img
      src="./assets/0.png"
      alt
      class="header"
    />
    <Prize
      v-for="(item, index) in prizes"
      :item="item"
      :key="index"
      @get-prize="getPrize"
    />
    <img
      src="./assets/1.png"
      alt
      class="header"
    />

    <Toast :show="loading"/>

    <Dialog :show="msgShow" :content="msg" @hide="hideMsg"/>
  </div>
</template>

<script>
import axios from "axios";
import uuid from "uuid/v4";
import Cookie from "js-cookie";
import {
  defaultPrizes,
  defaultPrizeCounts,
  prizeLimitMap,
  UID_KEY
} from "./config";
import Prize from "./components/Prize";
import Toast from './components/Toast'
import Dialog from './components/Dialog'

export default {
  name: "app",
  components: {
    Prize,
    Toast,
    Dialog,
  },
  data: function() {
    return {
      loading: false,
      message: "Click me!",
      isVisible: true,
      prizes: defaultPrizes,
      prizeCounts: {},
      uid: "",
      msgShow: false,
      msg: "手机无法生成用ID，请允许Cookie后再次进入。"
    };
  },
  methods: {
    hideMsg() {
      this.msgShow = false;
      this.msg = "";
    },
    showMsg(msg) {
      this.msg = msg;
      this.msgShow = true;
    },
    getDate(d) {
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const day = d.getDate();
      return `${year}-${month}-${day}`;
    },
    async queryServer() {
      const response = await fetch(window.env.apiUrl);
      const result = await response.json();
      this.message = result.message;
    },

    initPrizes() {
      const now = new Date();
      const today = this.getDate(now);
      this.prizes = defaultPrizes.map(item => {
        const newD = new Date(`${today} ${item.start}`);
        item.started = now >= newD;
        item.empty =
          this.prizeCounts[item.prizeId].length >= prizeLimitMap[item.prizeId];
        return item;
      });
    },

    // get user list
    async getPrizeCounts() {
      this.loading = true;
      const { data } = await axios.get(`${window.env.apiUrl}list`);

      if (data.code !== 0) {
        this.userList = [];
      } else {
        this.prizeCounts = data.data || defaultPrizeCounts;
        this.initPrizes();
      }
      this.loading = false;
    },

    // add a user
    async getPrize(prizeId) {
      if (this.loading) {
        return;
      }
      if (!this.uid) {
        this.showMsg("手机无法生成用ID，请允许Cookie后再次进入。");
      }
      this.loading = true;
      try {
        const { data } = await axios.post(`${window.env.apiUrl}prize`, {
          uid: this.uid,
          prizeId
        });
        if (data.code !== 0) {
          if (data.code === 1005) {
            this.showMsg("您已经获得过此奖品，请勿重复尝试~");
          } else {
            this.showMsg(data.message);
          }
        } else {
          if (data.data === true) {
            const [prize] = defaultPrizes.filter(
              item => item.prizeId === prizeId
            );
            this.showMsg(`恭喜你，获得1${prize.unit}${prize.title}`);
          } else {
            this.showMsg("非常遗憾，奖品已经被抢光了...");
          }
          this.getPrizeCounts();
        }
      } catch (e) {
        this.showMsg("活动过于火爆，请稍后再再试~");
      }
      this.loading = false;
    },

    initUid() {
      let uid = Cookie.get(UID_KEY);
      if (!uid) {
        uid = uuid();
        Cookie.set(UID_KEY, uid);
      }

      this.uid = uid;
    }
  },
  mounted() {
    this.initUid();
    this.getPrizeCounts();
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
