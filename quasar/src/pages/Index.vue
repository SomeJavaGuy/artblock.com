<template>
  <q-dialog
    v-model="showPopup"
    persistent
    transition-show="flip-down"
    transition-hide="flip-up"
  >
    <q-card>
      <form @submit="submit()">
        <a @click="dismiss"></a>
        <input class="fn" v-model="form.first" placeholder="First name" />
        <input class="ln" v-model="form.last" placeholder="Last name" />
        <input
          class="em"
          v-model="form.email"
          placeholder="Email"
          type="email"
        />
        <input type="submit" value="Get early access" />
      </form>
      <img src="assets/00-HOME-A-POP.png" />
    </q-card>
  </q-dialog>

  <img src="assets/00-HOME-BLACK.png" />
</template>

<style scoped lang="scss">
input {
  font-weight: 600;
  font-size: 11pt;
  position: absolute;
  width: 214px;
  line-height: 24pt;
  border-color: rgba(0, 0, 0, 0.1);
  padding: 0 10px;

  &::placeholder {
    text-transform: uppercase;
    opacity: 0.6;
  }

  &.fn {
    left: 58px;
    top: 380px;
  }

  &.ln {
    top: 380px;
    left: 288px;
  }

  &.em {
    left: 58px;
    top: 429px;
    width: 274px;
  }
}

input[type='submit'] {
  text-transform: uppercase;
  opacity: 0;
  padding: 10px;
  width: 170px;
  top: 425px;
  left: 340px;
}

a {
  position: absolute;
  cursor: pointer;
  top: 0;
  right: 0;
  width: 50px;
  height: 50px;
}
</style>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import firebase from 'firebase/app';
import 'firebase/firestore';

export default defineComponent({
  name: 'Index',
  setup() {
    const form = reactive({ first: '', last: '', email: '' });
    const showPopup = ref(true);
    const router = useRouter();

    const dismiss = () => {
      showPopup.value = false;
      setTimeout(() => {
        void router.push('/');
      }, 1000);
    };

    return {
      form,
      showPopup,
      dismiss,

      async submit() {
        if (!firebase.apps.length) {
          firebase.initializeApp({
            apiKey: 'AIzaSyAijtCu8Ol-JJIpQ2FklvxWIQJ6dTGo8V0',
            authDomain: 'artblock-com.firebaseapp.com',
            projectId: 'artblock-com',
            storageBucket: 'artblock-com.appspot.com',
            messagingSenderId: '5071651329',
            appId: '1:5071651329:web:1b4a9e67ef2d7b77fdf600',
            measurementId: 'G-EQM64GFDKC',
          });
        }
        await firebase.firestore().collection('feedback').add(form);
        dismiss();
      },
    };
  },
});
</script>
