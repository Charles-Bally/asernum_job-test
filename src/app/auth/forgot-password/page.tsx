"use client";

import { InputEmail } from "@/components/ui/forms";
import CustomButton from "@/components/ui/render/CustomButton";
import { REGEX } from "@/constants/regex.constant";
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

  const onSubmit = (data: ForgotPasswordFormData) => {
    // TODO: connect forgot password logic
    console.log(data);
  };

  return (
    <>
      <h1 className="text-[36px] font-black leading-[1.2] text-foreground">
        Mot de passe oublié
      </h1>
      <p className="mt-1 text-[20px] font-medium text-foreground">
        Veuillez entrer votre adresse email pour réinitialiser votre mot de
        passe
      </p>

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
            className="h-[60px] w-[355px] rounded-[40px] bg-auchan-red text-[20px] font-black text-white hover:bg-auchan-red-hover"
          >
            Continuer
          </CustomButton>
        </div>
      </form>
    </>
  );
}
