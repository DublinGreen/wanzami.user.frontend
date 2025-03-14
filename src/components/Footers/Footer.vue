<template>
  <v-footer class="footerBox" app>
    <span class="white--text">{{ getCopyright }}</span>
  </v-footer>
</template>

<script>
import store from "../../store";
import { mapState } from "vuex";

export default {
  name: "Footer",
  created: function() {},
  data: () => ({
    isLogin: localStorage.getItem(store.state.setIsLoginLocalStorageKey)
  }),
  watch: {},
  computed: mapState({
    getCopyright() {
      return ` Copyright © ${store.state.currentYear.getFullYear()} ${
        store.state.appName
      }, All rights reserved`;
    }
  })
};
</script>

<style scoped>

.footerBox{
  background-color: #e05307;
}

</style>
