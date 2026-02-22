"use client";

import CustomButton from "@/components/ui/render/CustomButton";
import { InputOTP } from "@/components/ui/forms";
import { toast, TOAST } from "@/components/toast_system";
import { PATHNAME } from "@/constants/pathname.constant";
import { useResetPasswordController } from "@/hooks/useResetPasswordController";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const OTP_TIMER_SECONDS = 60;

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const {
    verifyOtp,
    resendOtp,
    isVerifyingOtp,
    isSendingOtp,
    verifyOtpError,
    resetVerifyOtpError,
  } = useResetPasswordController();

  const isLoading = isVerifyingOtp || isSendingOtp;

  useEffect(() => {
    const email = sessionStorage.getItem("reset-password:email");
    if (!email) {
      toast({ type: TOAST.ERROR, message: "Veuillez d'abord saisir votre email." });
      router.replace(PATHNAME.FORGOT_PASSWORD);
    }
  }, [router]);

  const timerActive = timer > 0;

  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setCanResend(true);
          resetVerifyOtpError();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive, resetVerifyOtpError]);

  const formatTimer = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins} : ${secs}`;
  };

  const handleResend = () => {
    if (!canResend || isSendingOtp) return;
    setTimer(OTP_TIMER_SECONDS);
    setCanResend(false);
    resendOtp();
  };

  const handleOtpChange = useCallback(
    (val: string) => {
      setOtp(val);
      if (verifyOtpError) resetVerifyOtpError();
    },
    [verifyOtpError, resetVerifyOtpError],
  );

  const handleValidate = () => {
    verifyOtp(otp);
  };

  return (
    <>
      <h1 className="text-[28px] md:text-[36px] font-black leading-[1.2] text-foreground">
        Code OTP
      </h1>
      <p className="mt-1 text-[16px] md:text-[20px] font-medium text-foreground">
        Veuillez saisir le code OTP reçu par message sur votre adresse email
      </p>

      <div className="mt-[47px]">
        <InputOTP
          value={otp}
          onChange={handleOtpChange}
          length={4}
          disabled={isLoading}
        />

        {verifyOtpError && (
          <p className="mt-3 text-sm text-auchan-red">{verifyOtpError}</p>
        )}

        <p className="mt-[20px] text-[16px] font-medium text-foreground">
          Pas encore reçu ?{" "}
          {!canResend && (
            <span className="text-text-muted">{formatTimer(timer)}</span>
          )}
          {"     "}
          <span
            onClick={handleResend}
            className={cn(
              "italic",
              canResend && !isSendingOtp
                ? "cursor-pointer text-auchan-red"
                : "text-text-muted",
            )}
          >
            Renvoyez
          </span>
        </p>
      </div>

      <div className="mt-auto flex justify-center">
        <CustomButton
          onClick={handleValidate}
          loading={isVerifyingOtp}
          disabled={isLoading}
          className="h-[60px] w-full md:w-[355px] rounded-[40px] bg-auchan-red text-[20px] font-black text-white hover:bg-auchan-red-hover"
        >
          Valider
        </CustomButton>
      </div>
    </>
  );
}
