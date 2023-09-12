import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { User } from '../types/types';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Content from '@/components/Content';
import axios from 'axios'

export async function getServerSideProps(context : GetServerSidePropsContext) {
  const { req } = context;
  const cookieValue = req.headers.cookie ? req.headers.cookie.split('; ').find((row) => row.startsWith('authToken=')): null;
  const myCookieValue = cookieValue ? cookieValue.split('=')[1] : null;
  return {
    props: {
      jwt: myCookieValue ? myCookieValue : null,
    },
	};
}

const Profile = (myCookie: any) => { 
  const [Loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [cookie, setCookie] = useState<string | null>(myCookie.jwt);
  const router = useRouter();

  useEffect(() => {

    if (cookie == null) {
      router.push('/');
      return;
    }

    const fetchUser = async () => {
     try {
        const response = await axios.get(`http://localhost:5000/profile`,
	{ withCredentials: true,});
          setLoading(false);
          const userData: User = response.data;
          setUser(userData);
        } catch (error) {
	  setLoading(true);
          router.push('/');
        }
    };
    if (cookie)
      fetchUser();
  }, [cookie]);

  if (Loading) {
    return (
      <></>
    )
  }

  return (
    <div className="flex flex-col w-screen h-screen overflow-auto">
      <Navbar />
      {user && <Content user={user}/>}
    </div>
  )
}

export default Profile;
