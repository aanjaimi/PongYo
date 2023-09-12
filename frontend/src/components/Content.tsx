import React from 'react'
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import Firstdiv from './Firstdiv';
import Lastdiv from './Lastdiv';
import { useState } from 'react';
import { Buttons } from '@/types/types';
import { User } from '@/types/types';

const Content = (props: any) => {
  const str: string = Buttons.PROFILE;
  const [user, setUser] = useState<User>(props.user);
  return (
    <div className="flex grow">
      <Sidebar data={str} />
      <div className="flex flex-col grow items-center justify-start">
        <Firstdiv user={user}/>
        <Lastdiv user={user}/>
      </div>
    </div>
  )
}

export default Content;