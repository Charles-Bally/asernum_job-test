"use client";

import { InputEmail } from "@/components/ui/forms";
import CustomButton from "@/components/ui/render/CustomButton";
import { REGEX } from "@/constants/regex.constant";
import { useResetPasswordController } from "@/hooks/useResetPasswordController";
import { useForm } from "react-hook-form";

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const { sendOtp, isSendingOtp, sendOtpError } = useResetPasswordController();

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendOtp(data.email);
  };

  return (
    <>
      <h1 className="text-[28px] md:text-[36px] font-black leading-[1.2] text-foreground">
        Mot de passe oublié
      </h1>
      <p className="mt-1 text-[16px] md:text-[20px] font-medium text-foreground">
        Veuillez entrer votre adresse email pour réinitialiser votre mot de
        passe
      </p>

      {sendOtpError && (
        <p className="mt-3 text-sm text-auchan-red">{sendOtpError}</p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-[47px] flex flex-1 flex-col"
      >
        <InputEmail
          registration={register("email", {
            required: "Email requis",
            pattern: {
              value: REGEX.EMAIL,
              message: "Email invalide",
            },
          })}
          topLabel={{ text: "Email" }}
          disabled={isSendingOtp}
          error={
            errors.email
              ? { active: true, message: errors.email.message ?? "" }
              : undefined
          }
        />

        <div className="mt-auto flex justify-center">
          <CustomButton
            type="submit"
            onClick={() => {}}
            loading={isSendingOtp}
            className="h-[60px] w-full md:w-[355px] rounded-[40px] bg-auchan-red text-[20px] font-black text-white hover:bg-auchan-red-hover"
          >
            Continuer
          </CustomButton>
        </div>
      </form>
    </>
  );
}
