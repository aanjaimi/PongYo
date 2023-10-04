import React from 'react'
import Sidebar from '@/components/Sidebar';
import Firstdiv from './Firstdiv';
import Lastdiv from './Lastdiv';
import { Buttons } from '@/types/common';

const Content = () => {
  const str: string = Buttons.PROFILE;
  return (
    <div className="flex grow">
      <Sidebar data={str} />
      <div className="flex flex-col grow items-center justify-start">
        <Firstdiv/>
        <Lastdiv/>
      </div>
    </div>
  )
}

export default Content;