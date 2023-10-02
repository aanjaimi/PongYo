import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="w-screen h-[50px] bg-[#33437D] flex justify-between z-20">
        <div className="border-r border-black flex justify-start items-center">
          <Link href="/profile">
            <Image src={"/profile_logo.png"} alt="image" width={74} height={50}/>
          </Link>
        </div>
        <div className="border border-black rounded-md sm:w-[400px] w-[300px] h-[30px] flex justify-start items-center mt-[12px] mb-[12px]">
          <div className="ml-[5px]">
            <Image src={"/search.png"} alt="image" width={25} height={25}/>
          </div>
          <input className="sm:w-[400px] w-[300px] h-[25px] bg-[#33437D] rounded-2xl text-white focus:border-none focus:outline-none ml-[10px]" placeholder="search...">
            
          </input>
        </div>
        <div className="flex justify-start items-center mr-[12px]">
          <Image src={"/notifications_off.png"} alt="image" width={22} height={22}/>
        </div>
      </div>
  )
}

export default Navbar;
