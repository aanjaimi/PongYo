import { SetMetadata } from '@nestjs/common';

export const IGNORE_OTP = 'IGNORE_OTP';

export const IgnoreOtp = () => SetMetadata(IGNORE_OTP, true);
