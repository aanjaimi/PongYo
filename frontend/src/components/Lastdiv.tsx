import React from 'react'
import Image from 'next/image';
import { useState } from 'react';
import { User } from '@/types/types';

const Lastdiv = (props: any) => {
  const [user, setUser] = useState<User>(props.user);
  return (
    <div className="rounded-2xl flex flex-col w-[413px] md:w-[613px] lg:w-[968px] h-[419px] bg-[#33437D] mt-[36px] mb-[3rem]">
      <div className="border-b-[2px] w-[400px] md:w-[600px] lg:w-[955px] h-[60px] flex items-center justify-center ml-[6px] mr-[6px]">
        <div className="border-r-[2px] w-[322px] h-[51px] flex items-center justify-center">
          <Image src={"/ach_off.png"} alt="image" width={34} height={34}/>
        </div>
        <div className="border-r-[2px] w-[322px] h-[51px] flex items-center justify-center">
          <Image src={"/his_off.png"} alt="image" width={30} height={30}/>
        </div>
        <div className="w-[322px] h-[51px] flex items-center justify-center">
          <Image src={"/rank_off.png"} alt="image" width={36} height={36}/>
        </div>
      </div>
      <div className="flex">
    
      </div>
    </div>
  )
}

export default Lastdiv;
