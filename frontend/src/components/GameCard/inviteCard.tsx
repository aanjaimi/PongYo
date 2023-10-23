import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { useSocket } from '@/contexts/socket-context';
import { Button } from '@/components/ui/button';
import { useStateContext } from '@/contexts/state-context';
import type { User } from '@/types/user';
import { Card } from '@/components/ui/card';
type InvitationCardProps = {
  setInviteNotify: React.Dispatch<React.SetStateAction<boolean>>;
  opp: User;
};
const InvitationCard = ({ setInviteNotify, opp }:InvitationCardProps) => {
  const { gameSocket } = useSocket();
  const { state } = useStateContext();


  return (
    <Card className='flex items-center  justify-center h-screen  w-screen'>
      <div className="flex items-center  justify-between p-10 gap-20 rounded-3xl border-4">
        
        <div className="flex items-center flex-col">
          <Image
            src={state.user?.avatar ?? "/smazouz.jpeg"}
            alt={state.user?.login}
            width={100} // Specify the desired width
            height={100} // Specify the desired height
            className="rounded-full h-40 w-40"
          />
          <div className=" pt-2 flex flex-col items-center">
            <p className="font-semibold pt-1 text-2xl text-gray-300">{state.user?.login}</p>
            <p className="text-gray-500 text-xl">{state.user?.rank}</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className='flex items-center h-full flex-col justify-center'
        >
          <div className="">
            <div className="flex items-center justify-center ">

              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.5,
                  delay: 0.1,
                }}
                className="h-6 w-6 mx-2 bg-black rounded-full"
              />
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.5,
                  delay: 0.2,
                }}
                className="h-6 w-6 mx-2 bg-black rounded-full"
              />
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.5,
                  delay: 0.3,
                }}
                className="h-6 w-6 mx-2 bg-black rounded-full"
              />
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.5,
                  delay: 0.3,
                }}
                className="h-6 w-6 mx-2 bg-black rounded-full"
              />
            </div>
            <div className=' pt-5'>
              <p className="text-center text-2xl font-semibold text-gray-400">Waiting for {opp.login} to join </p>
            </div>
            <div className="flex justify-center pt-8">
              <Button
                className="  flex h-[40px] w-[140px] rounded-full   text-2xl"
                onClick={() => {
                  setInviteNotify(false);
                  gameSocket.emit("declineInvite");
                }
                }
              >
                cancel
              </Button>
            </div>
          </div>
        </motion.div>
        <div className="flex items-center flex-col">
          <Image
            src={ "/smazouz.jpeg"}
            alt={opp?.login}
            width={100}
            height={100}
            className="rounded-full h-40 w-40"
          />
          <div className=" pt-2 flex flex-col items-center">
            <p className="font-semibold text-2xl text-gray-400" >{opp?.login}</p>
            <p className="pt-1 text-gray-500 text-xl">{opp?.rank}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InvitationCard;