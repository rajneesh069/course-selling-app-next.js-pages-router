import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {
  RecoilRoot, useSetRecoilState
} from 'recoil';
import { useEffect } from 'react';
import { BASE_URL } from '@/config';
import axios from 'axios';
import { userState } from '@/store/atoms/userState';
import Appbar from './appbar';

export default function App({ Component, pageProps }: AppProps) {
  return (<RecoilRoot>
    <InitUser />
    <Appbar />
    <Component {...pageProps} />
  </RecoilRoot>)
}

function InitUser() {
  const setUser = useSetRecoilState(userState);
  useEffect(() => {
    const init = async () => {
      try {
        const response = await axios.get(`${BASE_URL}admin/me`, {
          headers: {
            "Content-Type": "application/json"
          }, withCredentials: true,
        });
        if (response.data.username) {
          setUser({
            isUserLoading: false,
            username: response.data.username,
          })
        }
        else {
          setUser({
            isUserLoading: false,
            username: null,
          })
        }
      } catch (error) {
        setUser({
          isUserLoading: false,
          username: null
        })
        console.error("Error:", error);
      }
    }
    init();
  }), [setUser]


  return <></>
}