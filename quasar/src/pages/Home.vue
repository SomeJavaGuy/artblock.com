<template>
  <div class="map">
    <router-link to="/commission"></router-link>
    <router-link to="/exhibition"></router-link>
    <router-link to="/editorial"></router-link>
    <router-link to="/intro" class="concept"></router-link>

    <a class="connect" v-if="!signer" @click="connect()"></a>
    <router-link to="/profile" v-else class="bal">
      <span class="nums">Ξ {{ balance }} &nbsp; &nbsp; &nbsp; NFT 0</span>
      <span class="text">Manage profile</span>
    </router-link>

    <router-link to="/commission" class="call"></router-link>
    <router-link to="/exhibition" class="ex"></router-link>
    <router-link to="/editorial" class="edit"></router-link>
    <a class="hack" href="https://nfthack.ethglobal.co/" target="_blank"></a>
    <img src="assets/00-HOME.png" />
  </div>
</template>

<style scoped lang="scss">
.map {
  position: relative;

  a,
  .connect {
    text-decoration: none;
    cursor: pointer;
    background: white;
    position: absolute;
    height: 66px;
    width: 230px;
    top: 50px;
    left: 524px;
    opacity: 0;

    &:hover {
      transition-duration: 500ms;
      opacity: 0.3;
    }
  }
  a:nth-child(2) {
    left: 760px;
    width: 230px;
  }
  a:nth-child(3) {
    left: 1000px;
    width: 160px;
  }
  a.concept {
    top: 114px;
    left: 540px;
    width: 334px;
    height: 72px;
  }

  .connect,
  .bal {
    opacity: 0.2;
    background: #f81c84;
    left: 1176px;

    &:hover {
      opacity: 0.6;
      background-color: blue;
    }
  }

  .bal {
    color: white;
    opacity: 1;
    font-size: 16pt;
    text-align: center;
    line-height: 50pt;

    .text {
      display: none;
      position: absolute;
    }

    &:hover {
      opacity: 1;

      .nums {
        display: none;
        position: absolute;
      }

      .text {
        display: inline;
        position: static;
        text-transform: uppercase;
      }
    }
  }

  a.call {
    left: 120px;
    right: -40px;
    top: 200px;
    width: auto;
    height: 760px;
    background-color: #ddf;
  }

  a.ex {
    background: blue;
    left: 0;
    right: 0;
    top: 980px;
    width: auto;
    height: 2160px;

    &:hover {
      opacity: 0.1;
      //   transition: 0ms;
    }
  }

  a.edit {
    top: auto;
    width: 620px;
    left: 0px;
    bottom: 100px;
    height: 1000px;
  }

  a.hack {
    top: auto;
    left: 640px;
    right: 0px;
    bottom: 100px;
    width: auto;
    height: 1000px;
  }
}
</style>

<script lang="ts">
import { ethers } from 'ethers';
import { enableEtherProvider, useEtherSigner, usePromise } from 'src/service';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DemoLayout',

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
      signer,

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
