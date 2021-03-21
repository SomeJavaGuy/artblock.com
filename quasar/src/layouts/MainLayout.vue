<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>
          <q-btn v-if="balance === void 0" @click="connect()"
            >Connect wallet</q-btn
          >
          <div v-else>Ξ {{ balance }}</div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-grey-1">
      <q-list>
        <!-- <q-item-label header class="text-grey-8">
          Essential Links
        </q-item-label> -->

        <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { ethers } from 'ethers';
import { enableEtherProvider, useEtherSigner, usePromise } from 'src/service';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);
    const signer = useEtherSigner();
    const balance = usePromise(() =>
      signer.value
        ?.getBalance()
        .then((balance) => +ethers.utils.formatEther(balance))
    );

    return {
      balance,
      leftDrawerOpen,

      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },

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
