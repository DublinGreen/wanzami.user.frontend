<script setup>
import { useRouter } from 'vue-router';
import SignUpNav from '@/components/navs/SignUpNav.vue';
import ContinueBtn from '@/components/buttons/ContinueBtn.vue';

const router = useRouter();

function goToStepTwoHandler() {
  router.push({ name: 'SignupStep2' });
}
</script>

<template>
  <SignUpNav />
  <div class="container">
    <main :class="classes.setUpAccount">
      <div :class="classes.icons">
        <font-awesome-icon icon="laptop" :class="classes.icon" />
        <font-awesome-icon icon="tv" :class="classes.icon" />
        <font-awesome-icon icon="mobile-alt" :class="classes.icon" />
      </div>
      <div>
        <p :class="classes.infoParagraph">
          Step <span :class="classes.span">1</span> of
          <span :class="classes.span">2</span>
        </p>
        <h1 :class="classes.infoHeading">Finish setting up your account</h1>
        <h2 :class="classes.infoHeadingSecondary">
          Wazami is personalised for you. Create a password to watch Wazami on
          any device at any time.
        </h2>

        <ContinueBtn @click="goToStepTwoHandler">Continue</ContinueBtn>
      </div>
    </main>
  </div>
</template>

<style lang="scss" module="classes">
@use '@/sass/views/signup/step1';
</style>
