"use client";

import CustomButton from "@/components/ui/render/CustomButton";
import { InputOTP } from "@/components/ui/forms";
import { useEffect, useState } from "react";

const OTP_TIMER_SECONDS = 60;

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins} : ${secs}`;
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(OTP_TIMER_SECONDS);
    setCanResend(false);
    // TODO: connect resend OTP logic
  };

  const handleValidate = () => {
    // TODO: connect OTP validation logic
  };

  return (
    <>
      <h1 className="text-[36px] font-black leading-[1.2] text-foreground">
        Code OTP
      </h1>
      <p className="mt-1 text-[20px] font-medium text-foreground">
        Veuillez saisir le code OTP reçu par message sur votre adresse email
      </p>

      <div className="mt-[47px]">
        <InputOTP value={otp} onChange={setOtp} length={4} />

        <p className="mt-[20px] text-[16px] font-medium text-foreground">
          Pas encore reçu ?{" "}
          <span className="text-text-muted">{formatTimer(timer)}</span>
          {"     "}
          <span
            onClick={handleResend}
            className={canResend ? "cursor-pointer italic text-auchan-red" : "italic text-text-muted"}
          >
            Renvoyez
          </span>
        </p>
      </div>

      <div className="mt-auto flex justify-center">
        <CustomButton
          onClick={handleValidate}
          className="h-[60px] w-[355px] rounded-[40px] bg-auchan-red text-[20px] font-black text-white hover:bg-auchan-red-hover"
        >
          Valider
        </CustomButton>
      </div>
    </>
  );
}
