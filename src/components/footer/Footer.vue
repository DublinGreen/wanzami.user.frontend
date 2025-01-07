<template>
  <footer :class="classes.footer">
    <div class="container">
      <div :class="classes.footerWrapper">
        <h4>This site is powered by:</h4>
        <img
          src="@/assets/images/netclone.png"
          alt="the movie db"
          :class="classes.footerImg"
        />
        <h4> &copy; 2025</h4>
        <!-- <h5 :class="classes.pngCredit">
          Png:s on this site are from
          <a
            href="https://www.freepnglogos.com/pics/tv"
            class="footer__attribution"
            target="_blank"
            rel="noopener"
            >Freepnglogos</a
          >
        </h5> -->
      </div>
    </div>
  </footer>
</template>

<style lang="scss" module="classes">
@use '@/sass/components/footer/footer';
</style>
