import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';
import { Button } from './ui/button';
require('dotenv').config();

const Card = () => {
  // const callback_url = process.env.INTRA_CALLBACK_URL as string;
  // console.log('callback : ', callback_url);
  const router =  useRouter();
  return (
    <div className="border border-black rounded-[63px] bg-[#d9d9d933] w-[350px] h-[420px] sm:w-[541px] sm:h-[385px] flex flex-col items-center justify-center font-['outfit'] text-white">
      <div className="w-[65px] h-[84px] flex justify-center mb-[40px]">
        <Image src={"/logo.png"} alt="image" width={500} height={500}/>
      </div>
      <div className="text-[30px] mb-[20px] font-bold">Welcome to PongYo</div>
      <div className="text-[15px] ml-[50px] mr-[50px] mb-[20px] text-center">Step into the world of competitive ping pong and experience the excitement of real-time multiplayer matches right from the comfort of your own device</div>
      <Button onClick={() => router.push(`http://localhost:5000/oauth/callback`)} className="rounded-full flex items-center justify-center bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]">
        Sign in with<Image className="ml-[5px] mt-[3px]" src={"/42.png"} alt="image" width={21} height={16}/>
      </Button>
    </div>
  );
};

export default Card;
