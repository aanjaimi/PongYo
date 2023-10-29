import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetcher';
import OTPInput from 'react-otp-input';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useStateContext } from '@/contexts/state-context';
import { useRouter } from 'next/router';

async function verifyOtp(token: string) {
  return (await fetcher.post<{ valid: boolean }>('/auth/otp', { token })).data;
}

const Otp = () => {
  const { state } = useStateContext();
  const router = useRouter();
  const [otp, setOtp] = useState<string>('');
  const [correct, setCorrect] = useState<boolean>(true);
  const otpMutation = useMutation({
    mutationKey: ['otp'],
    mutationFn: verifyOtp,
    onSuccess: async ({ valid }) => {
      setCorrect(valid);
      if (valid) {
        state.auth_status = 'authenticated';
        await router.push('/profile/@me');
      }
    },
    onError: () => {
      state.auth_status = false;
      console.log('error');
    },
  });

  const handleSubmit = async () => {
    if (otp.length !== 6) return;
    await otpMutation.mutateAsync(otp);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="flex h-[420px] w-[350px] flex-col items-center justify-center rounded-[63px] border border-black font-['outfit'] text-black sm:h-[385px] sm:w-[541px]">
        <div className="mb-[20px] flex h-[84px] w-[65px] justify-center">
          <Image src={'/logo.png'} alt="image" width={500} height={500} />
        </div>
        <div className="mb-[10px] text-[30px] font-bold">2FA</div>
        <div className="mb-[20px] ml-[50px] mr-[50px] text-[15px]">
          get a verification code from google authenticator app
        </div>
        <>
          {/* <form action="http://localhost:5000/auth/otp" method="POST">
            <input type="text" name="token" id="" />
            <input type="submit" value="Submit" />
          </form> */}
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            inputType="number"
            shouldAutoFocus
            inputStyle={cn(
              'border w-10 h-10 font-bold text-[20px] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            )}
            containerStyle={cn('grow flex items-center justify-around grow')}
            skipDefaultStyles={true}
          />
        </>
        <div>
          {!correct && (
            <div className="text-red mb-[20px] ml-[50px] mr-[50px] text-[15px]">
              Incorrect Code
            </div>
          )}
        </div>
        <div className="flex h-[45px] w-[125px] items-center justify-center rounded-full">
          <Button
            disabled={otpMutation.isLoading || otp.length !== 6}
            className="text-[20px] font-bold"
            onClick={() => void handleSubmit()}
          >
            verify
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Otp;
