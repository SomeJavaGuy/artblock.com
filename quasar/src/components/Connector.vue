<template>
  <a v-if="!signer" @click="connect()" class="in"></a>
  <a v-else class="bal">Ξ {{ balance }}</a>
</template>

<script lang="ts">
import { ethers } from 'ethers';
import { enableEtherProvider, useEtherSigner, usePromise } from 'src/service';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Connector',

  components: {},

  setup() {
    const signer = useEtherSigner();
    const balance = usePromise(() =>
      signer.value
        ?.getBalance()
        .then((balance) => +ethers.utils.formatEther(balance))
    );

    return {
      signer,
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
