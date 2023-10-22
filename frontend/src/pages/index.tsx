"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/env.mjs";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex h-[420px] w-[350px] flex-col items-center justify-center rounded-[63px] border font-['outfit'] sm:h-[385px] sm:w-[541px]">
        <div className="mb-[40px] flex h-[84px] w-[65px] justify-center">
          <Image src={"/logo.png"} alt="image" width={500} height={500} />
        </div>
        <div className="mb-[20px] text-[30px] font-bold">Welcome to PongYo</div>
        <div className="mb-[20px] ml-[50px] mr-[50px] text-center text-[15px]">
          Step into the world of competitive ping pong and experience the
          excitement of real-time multiplayer matches right from the comfort of
          your own device
        </div>
        <Button
          onClick={() =>
            void router.push(env.NEXT_PUBLIC_BACKEND_ORIGIN + "/auth/42")
          }
          className="flex items-center justify-center rounded-full border bg-white text-black hover:text-white"
        >
          Sign in with
          <Image
            className="ml-[5px] mt-[3px]"
            src={"/42.png"}
            alt="image"
            width={21}
            height={16}
          />
        </Button>
      </div>
    </div>
  );
}
