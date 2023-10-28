import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { use } from 'react';
import { useSocket } from '@/contexts/socket-context';
import { Button } from '@/components/ui/button';
import { useStateContext } from '@/contexts/state-context';
import type { User } from '@/types/user';
import { Card } from '@/components/ui/card';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetcher';
import { useRouter } from 'next/router';
import Loading from '@/pages/Loading';



type InvitationCardProps = {
  setInviteNotify: React.Dispatch<React.SetStateAction<boolean>>;
  opp: string;
  setIsRanked: React.Dispatch<React.SetStateAction<boolean>>;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setOppData: React.Dispatch<React.SetStateAction<User>>;
};
const getUser = async (id: string) => {
  return (await fetcher.get<User | null>(`/users/${id}`)).data;
};

const InvitationCard = ({ setInviteNotify, opp, setIsRanked, setGameStarted, setOppData }: InvitationCardProps) => {
  const { gameSocket } = useSocket();
  const { state } = useStateContext();
  const router = useRouter();
  const userQuery = useQuery({
    queryKey: ["users", opp],
    queryFn: async () => await getUser(opp),
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    console.log();
    gameSocket.on("game-start", (data: { opp: User, isRanked: boolean }) => {
      setOppData(data.opp);
      setInviteNotify(false);
      setIsRanked(data.isRanked);
      setGameStarted(true);
    }
    );
  }
    , []);

  if (userQuery.isLoading) return <Loading />;

  if (userQuery.isError) void router.push("/404");
  return (
    <Card className='flex items-center  justify-center h-screen  w-screen '>
      <div className="flex items-center  justify-between p-10 sm:gap-20 gap-6 rounded-3xl border-4 flex-col sm:flex-row">
        <div className="flex items-center flex-col">
          <Image
            src={state.user?.avatar.path ?? "/smazouz.jpeg"}
            alt={"user login"}
            width={100} // Specify the desired width
            height={100} // Specify the desired height
            className="rounded-full sm:h-40 sm:w-40 h-16 w-16"
          />
          <div className=" pt-2 flex flex-col items-center">
            <p className="font-semibold pt-1 sm:text-2xl text-xl text-gray-300">{state.user?.login}</p>
            {/* <p className="text-gray-500 sm:text-xl text-lg">{"zobi"}</p> */}
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
                className="sm:h-6 sm:w-6 w-4 h-4 mx-2 bg-black rounded-full"
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
                className="sm:h-6 sm:w-6 w-4 h-4  mx-2 bg-black rounded-full"
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
                className="sm:h-6 sm:w-6 w-4 h-4 mx-2 bg-black rounded-full"
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
                className="sm:h-6 sm:w-6 w-4 h-4  bg-black rounded-full"
              />
            </div>
            <div className=' pt-5'>
              <p className="text-center sm:text-2xl text-xl font-semibold text-gray-400">Waiting for {userQuery.data?.login} to join </p>
            </div>
            <div className=" pt-8 hidden  sm:flex justify-center">
              <Button
                className="  flex h-[40px] w-[140px] rounded-full   text-2xl"
                onClick={() => {
                  console.log("cancel");
                  setInviteNotify(false)
                    ;
                  gameSocket.emit("declineInvite");
                  gameSocket.emit("busy");
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
            src={userQuery.data?.avatar.path ?? "/smazouz.jpeg"}
            alt={opp}
            width={100}
            height={100}
            className="rounded-full sm:h-40 sm:w-40 h-16 w-16"
          />
          <div className=" pt-2 flex flex-col items-center">
            <p className="font-semibold sm:text-2xl text-xl text-gray-400" >{userQuery.data?.login}</p>
          </div>
          <div className=" pt-2 flex  sm:hidden justify-center">
            <Button
              className="  flex h-[30px] w-[100px] rounded-full   text-2xl"
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
      </div>
    </Card>
  );
};

export default InvitationCard;