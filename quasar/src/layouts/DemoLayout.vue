<template>
  <div class="container">
    <router-view />
    <div class="footer map">
      <a href="tos.txt" ref="f"></a>
      <a href="privacy-policy.txt"></a>
      <a href="disclaimer.txt"></a>
      <router-link to="/intro"></router-link>
      <img src="assets/FOOTER.png" />
    </div>
  </div>
</template>

<style lang="scss">
body {
  background: #000;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 300;
}
</style>

<style scoped lang="scss">
.container {
  width: 1440px;
  margin: 0 auto;
  //   opacity: 0.1;
  //   transition: 60s;

  //   &:hover,
  //   &:focus-within {
  //     filter: none;
  //     opacity: 1;
  //     transition: 10s;
  //     transition-timing-function: cubic-bezier();
  //   }
}

.map {
  position: relative;

  a {
    cursor: pointer;
    background: white;
    position: absolute;
    height: 100px;
    width: 360px;
    bottom: 100px;
    left: 160px;
    opacity: 0;

    &:hover {
      transition-duration: 500ms;
      opacity: 0.3;
    }
  }
  a:nth-child(2) {
    left: 540px;
  }
  a:nth-child(3) {
    left: 920px;
  }

  a:nth-child(4) {
    left: 140px;
    right: 140px;
    top: 40px;
    bottom: 280px;
    width: auto;
    height: auto;
  }
}
</style>

<script lang="ts">
import { ethers } from 'ethers';
import { enableEtherProvider, useEtherSigner, usePromise } from 'src/service';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DemoLayout',

  components: {},

  activated() {
    // eslint-disable-next-line
    (this.$refs as any).f.focus();
  },

  setup() {
    const signer = useEtherSigner();
    const balance = usePromise(() =>
      signer.value
        ?.getBalance()
        .then((balance) => +ethers.utils.formatEther(balance))
    );

    return {
      balance,

      async connect() {
        const provider = await enableEtherProvider();
        const net = await provider.getNetwork();
        if (net && net.name !== 'ropsten') {
          alert('Please use the Ropsten test network!' + net.name);
        }
      },
    };
  },
});
</script>
