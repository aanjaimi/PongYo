import React from 'react'
import Image from 'next/image';
import { useState } from 'react';
import { User } from '@/types/types';

const Firstdiv = (props: any) => {
  const [user, setUser] = useState<User>(props.user);
  return (
    <div className="relative flex items-center justify-center flex-col mt-[36px] mb-[19px]">
      {/* Cover  */}
      <div className="h-[100px] md:h-[150px] w-[400px] md:w-[600px] lg:h-[242px] lg:w-[968px] rounded-t-2xl">
        <Image className="rounded-t-2xl" src={"/cover.png"} alt="API Image" width={968} height={242}/>
      </div>
      <div className="w-[400px] md:w-[600px] h-[78px] lg:w-[968px] rounded-b-2xl bg-[#33437D]">
        <div className="ml-[180px] text-red-500 font-semibold m">
        </div>
      </div>
      {/* Avatar */}
      <div className="absolute md:bottom-10 md:left-20 bottom-50 left-50">
        
      </div>
    </div>
  )
}

export default Firstdiv;
