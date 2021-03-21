import { ethers } from 'ethers';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Fortmatic from 'fortmatic';
import { shallowRef, watchEffect } from 'vue';

// eslint-disable-next-line
const ethereum = (window as any).ethereum as
  | {
      on: (
        event: 'accountsChanged',
        fn: (account: string[]) => void
      ) => undefined;
    }
  | undefined;

const etherSigner = shallowRef<ethers.providers.JsonRpcSigner>();

// eslint-disable-next-line @typescript-eslint/ban-types
export function getEtherProvider(): {} {
  if (ethereum) {
    console.log('Using MetaMask');
    return ethereum;
  } else {
    console.log('Using Fortmatic');
    return new Fortmatic('pk_test_020AE141CA2B2D02', 'ropsten').getProvider();
  }
}

export async function enableEtherProvider() {
  const provider = getEtherProvider();
  // eslint-disable-next-line
  await (provider as any).enable();
  const result = new ethers.providers.Web3Provider(provider);
  await result.getSigner().getAddress();
  etherSigner.value = result.getSigner();
  return result;
}

export function useEtherSigner() {
  const provider = getEtherProvider();
  // eslint-disable-next-line
  if ((provider as any).selectedAddress) {
    void enableEtherProvider();
  }
  // eslint-disable-next-line
  ethereum &&
    ethereum.on('accountsChanged', (accounts) => {
      console.log('ethereum onAccountsChanged', accounts);
      if (!accounts.length) {
        etherSigner.value = undefined;
      }
    });
  return etherSigner;
}

// export function usePromise<T, E>(fn: () => Promise<T>) {
// const result = reactive<{ value?: T; error?: E }>({});
// void promise.then(
//   (value) => {
//     result.value = value as UnwrapRef<T>;
//   },
//   (error: E) => {
//     result.error = error as UnwrapRef<E>;
//   }
// );
// return result;
// }

export function usePromise<T>(fn: () => T | Promise<T>, refreshMs?: number) {
  const result = shallowRef();
  watchEffect((onInvalidate) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let handle: any;
    const tick = async () => {
      result.value = await fn();
      if (refreshMs) {
        handle = setTimeout(() => {
          void tick();
        }, refreshMs);
      }
    };
    void tick();
    onInvalidate(() => {
      clearTimeout(handle);
    });
  });
  return result;
}

export function useFirebaseUser() {
  const result = shallowRef();
  firebase.auth().onAuthStateChanged((user) => {
    result.value = user;
  });
  return result;
}

export function useFirestore<T>(fn: () => firebase.firestore.Query<T>) {
  const result = shallowRef();
  watchEffect((onInvalidate) => {
    const unsubscribe = fn().onSnapshot((snapshot) => {
      result.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          data: doc.data(),
          ref: () => doc.ref,
        };
      });
    });
    onInvalidate(() => {
      unsubscribe();
    });
  });
  firebase.auth().onAuthStateChanged((user) => {
    result.value = user;
  });
  return result;
}

export function useFirestoreDoc<T>(
  fn: () => firebase.firestore.DocumentReference<T>
) {
  const result = shallowRef();
  watchEffect((onInvalidate) => {
    const unsubscribe = fn().onSnapshot((snapshot) => {
      result.value = {
        id: snapshot.id,
        data: snapshot.data(),
        ref: () => snapshot.ref,
      };
    });
    onInvalidate(() => {
      unsubscribe();
    });
  });
  firebase.auth().onAuthStateChanged((user) => {
    result.value = user;
  });
  return result;
}
