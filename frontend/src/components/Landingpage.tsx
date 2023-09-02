import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from './ui/button';
import { useRouter } from 'next/router';

const Landingpage = () => {
	const router = useRouter();
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="rounded-br-full w-[250px] h-1/4 bg-[#8D8DDA] blur-[150px]"></div>
      <div className="flex justify-center h-1/2">
        <Card className="border-black rounded-[63px] bg-[#d9d9d933] w-1/3 flex flex-col items-center justify-center font-['outfit'] text-white">
          <CardHeader className="flex items-center justify-center">
            <CardTitle><Image src={"/logo.png"} alt="image" width={65} height={83}/></CardTitle>
            <CardDescription className="text-[30px] font-bold text-white">Welcome to PongYo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-[15px] text-center">Step into the world of competitive ping pong and experience the excitement of real-time multiplayer matches right from the comfort of your own device</div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('http://localhost:5000/oauth/callback')} className="rounded-full flex items-center justify-center bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]">
							Sign in with<Image className="ml-[5px] mt-[3px]" src={"/42.png"} alt="image" width={21} height={16}/>
						</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="flex justify-end items-end h-1/4">
        <div className="border rounded-tl-full w-[250px] h-[250px] bg-[#ABD9D9] blur-[150px]"></div>
      </div>
    </div>
  );
}

export default Landingpage;