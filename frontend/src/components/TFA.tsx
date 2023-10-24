import React, { useRef } from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";

async function verifyOtp(token: string) {
  return (await fetcher.post<unknown>("/auth/otp", { token })).data;
}

const TFA = () => {
  let currentOTPIndex = 0;
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [correct, setCorrect] = useState(true);
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const otpMutation = useMutation({
    mutationKey: ["otp"],
    mutationFn: verifyOtp,
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const newOTP: string[] = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);
    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);
    setOtp(newOTP);
    if (newOTP.join("").length === otp.length) {
      inputRef?.current?.blur();
      currentOTPIndex = 6;
    }
  };

  const handleSubmit = async () => {
    if (otp.some((value) => value === "")) return;

    try {
      await otpMutation.mutateAsync(otp.join(""));
    } catch (err) {
      setCorrect(false);
    }
  };

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    currentOTPIndex = index;
    if (e.key === "Backspace") {
      setActiveOTPIndex(currentOTPIndex - 1);
    }
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [activeOTPIndex]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex h-[420px] w-[350px] flex-col items-center justify-center rounded-[63px] border border-black font-['outfit'] text-black sm:h-[385px] sm:w-[541px]">
        <div className="mb-[20px] flex h-[84px] w-[65px] justify-center">
          <Image src={"/logo.png"} alt="image" width={500} height={500} />
        </div>
        <div className="mb-[10px] text-[30px] font-bold">2FA</div>
        <div className="mb-[20px] ml-[50px] mr-[50px] text-[15px]">
          get a verification code from google authenticator app
        </div>
        <div className="mb-[20px] flex h-[45px] items-center space-x-[26px] sm:w-[400px]">
          <form action="http://localhost:5000/auth/otp" method="POST">
            <input type="text" name="token" id="" />
            <input type="submit" value="Submit" />
          </form>
          {/* {otp.map((data, index) => {
            return (
              <input
                key={index}
                ref={index === activeOTPIndex ? inputRef : null}
                className="spin-button-none h-[20px] w-[20px] cursor-auto rounded-sm border text-center text-[16px] font-semibold text-black outline-none transition [appearance:textfield] sm:h-[45px] sm:w-[45px] sm:text-[35px] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                value={otp[index]}
                onChange={(e) => handleOnChange(e)}
                onKeyDown={(e) => handleOnKeyDown(e, index)}
              />
            );
          })} */}
          {/* <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/>
        <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/>
        <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/>
        <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/>
        <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/>
        <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/> */}
        </div>
        <div>
          {!correct && (
            <div className="text-red mb-[20px] ml-[50px] mr-[50px] text-[15px]">
              Incorrect Code
            </div>
          )}
        </div>
        <div className="flex h-[45px] w-[125px] items-center justify-center rounded-full bg-gradient-to-r from-[#8d8dda80] to-[#ABD9D980]">
          <button
            className="text-[20px] font-bold"
            onClick={(e) => handleSubmit(e)}
          >
            verify
          </button>
        </div>
      </Card>
    </div>
  );
};

export default TFA;
