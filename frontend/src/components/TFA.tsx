import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { User } from "@/types/user";
import { fetcher } from "../utils/fetcher";
import { input } from "@nextui-org/react";

let currentOTPIndex: number = 0;

const TFA = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [code, setCode] = useState<string | null>(null);
  const [correct, setCorrect] = useState(true);
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [Loading, setLoading] = useState<boolean>(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const newOTP: string[] = [...otp];
    newOTP[currentOTPIndex] = value.substring(value.length - 1);
    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);
    setOtp(newOTP);
    if (newOTP.join("").length === otp.length) {
      inputRef?.current?.blur();
    }
  };

  const handleSubmit = () => {
    if (otp.some((value) => value === "")) {
      setCode(null);
      return;
    }
    setCode(otp.join(""));
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

  if (Loading) {
    return <></>;
  }

  return (
    <div className="flex h-[420px]	w-[350px] flex-col items-center justify-center rounded-[63px] border border-black bg-[#d9d9d933] font-['outfit'] text-white sm:h-[385px] sm:w-[541px]">
      <div className="mb-[20px] flex h-[84px] w-[65px] justify-center">
        <Image src={"/logo.png"} alt="image" width={500} height={500} />
      </div>
      <div className="mb-[10px] text-[30px] font-bold">2FA</div>
      <div className="mb-[20px] ml-[50px] mr-[50px] text-[15px]">
        get a verification code from google authenticator app
      </div>
      <div className="mb-[20px] flex h-[45px] items-center space-x-[26px] sm:w-[400px]">
        {otp.map((data, index) => {
          return (
            <input
              key={index}
              ref={index === activeOTPIndex ? inputRef : null}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none spin-button-none h-[20px] w-[20px] rounded-sm text-center text-[16px] font-semibold text-black outline-none transition sm:h-[45px] sm:w-[45px] sm:text-[35px] cursor-auto"
              type="number"
              value={otp[index]}
              onChange={(e) => handleOnChange(e)}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
            />
          );
        })}
        {/* <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/>
        <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/>
        <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/>
        <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/>
        <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/>
        <input className="w-[45px] h-[45px] text-black text-[35px] transition spin-button-none outline-none text-center font-semibold" type="number" placeholder=""/> */}
      </div>
      <div>
        {!correct && (
          <div className="text- mb-[20px] ml-[50px] mr-[50px] text-[15px]">
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
    </div>
  );
};

export default TFA;
