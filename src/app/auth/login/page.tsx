"use client";

import { InputPassword, InputText } from "@/components/ui/forms";
import CustomButton from "@/components/ui/render/CustomButton";
import CustomLink from "@/components/ui/render/CustomLink";
import { PATHNAME } from "@/constants/pathname.constant";
import { useLoginController } from "@/hooks/useLoginController";
import { useBirdStore } from "@/store/bird.store";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type LoginFormData = {
  identifier: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const setEyeDirection = useBirdStore((s) => s.setEyeDirection);
  const { login, isLoggingIn, loginError, resetLoginError } = useLoginController();

  useEffect(() => {
    return () => setEyeDirection("top-right");
  }, [setEyeDirection]);

  const onSubmit = (data: LoginFormData) => {
    login(data.identifier, data.password);
  };

  return (
    <>
      <h1 className="text-[36px] font-black leading-[1.2] text-foreground">
        Connexion
      </h1>
      <p className="mt-1 text-[20px] font-medium text-foreground">
        Saisissez vos identifiants pour vous connecter
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-[47px] flex flex-1 flex-col"
      >
        <div className="flex flex-col gap-[21px]">
          <InputText
            registration={register("identifier", {
              required: "Identifiant requis",
              onChange: () => loginError && resetLoginError(),
            })}
            topLabel={{ text: "Identifiant" }}
            disabled={isLoggingIn}
            error={
              errors.identifier
                ? { active: true, message: errors.identifier.message ?? "" }
                : undefined
            }
          />
          <InputPassword
            registration={register("password", {
              required: "Mot de passe requis",
              onChange: () => loginError && resetLoginError(),
            })}
            topLabel={{ text: "Mot de passe" }}
            disabled={isLoggingIn}
            error={
              errors.password
                ? { active: true, message: errors.password.message ?? "" }
                : undefined
            }
            onVisibilityChange={(visible) =>
              setEyeDirection(visible ? "bottom-left" : "top-right")
            }
          />
          <CustomLink
            href={PATHNAME.FORGOT_PASSWORD}
            animation={false}
            containerClassName="ml-auto"
            className="group px-0 text-[16px] font-medium text-auchan-red"
          >
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-left after:scale-x-0 after:bg-auchan-red after:transition-transform after:duration-300 group-hover:after:scale-x-100">
              Mot de passe oublié
            </span>
          </CustomLink>
        </div>

        <div className="mt-auto flex flex-col items-center gap-3">
          {loginError && (
            <p className="text-sm text-auchan-red">{loginError}</p>
          )}
          <CustomButton
            type="submit"
            onClick={() => {}}
            loading={isLoggingIn}
            className="h-[60px] w-[355px] rounded-[40px] bg-auchan-red text-[20px] font-black text-white hover:bg-auchan-red-hover"
          >
            Se connecter
          </CustomButton>
        </div>
      </form>
    </>
  );
}
