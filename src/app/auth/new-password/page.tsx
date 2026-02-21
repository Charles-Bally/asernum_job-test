"use client";

import { toast, TOAST } from "@/components/toast_system";
import { InputPassword } from "@/components/ui/forms";
import CustomButton from "@/components/ui/render/CustomButton";
import { PATHNAME } from "@/constants/pathname.constant";
import { useResetPasswordController } from "@/hooks/useResetPasswordController";
import { useBirdStore } from "@/store/bird.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type NewPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export default function NewPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPasswordFormData>();

  const router = useRouter();
  const { resetPassword, isResettingPassword, resetPasswordError } =
    useResetPasswordController();
  const setEyeDirection = useBirdStore((s) => s.setEyeDirection);

  useEffect(() => {
    const token = sessionStorage.getItem("reset-password:token");
    if (!token) {
      toast({ type: TOAST.ERROR, message: "Veuillez d'abord saisir votre email." });
      router.replace(PATHNAME.FORGOT_PASSWORD);
    }
  }, [router]);

  useEffect(() => {
    return () => setEyeDirection("top-right");
  }, [setEyeDirection]);

  const onSubmit = (data: NewPasswordFormData) => {
    resetPassword(data.password);
  };

  return (
    <>
      <h1 className="text-[36px] font-black leading-[1.2] text-foreground">
        Nouveau mot de passe
      </h1>
      <p className="mt-1 text-[20px] font-medium text-foreground">
        Définis ton nouveau mot de passe pour terminer
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-[47px] flex flex-1 flex-col"
      >
        <div className="flex flex-col gap-[21px]">
          <InputPassword
            registration={register("password", {
              required: "Mot de passe requis",
              minLength: {
                value: 8,
                message: "8 caractères minimum",
              },
            })}
            topLabel={{ text: "Nouveau mot de passe" }}
            config={{ currentValue: watch("password") }}
            disabled={isResettingPassword}
            error={
              errors.password
                ? { active: true, message: errors.password.message ?? "" }
                : undefined
            }
            onVisibilityChange={(visible) =>
              setEyeDirection(visible ? "bottom-left" : "top-right")
            }
          />
          <InputPassword
            registration={register("confirmPassword", {
              required: "Confirmation requise",
              validate: (value) =>
                value === watch("password") ||
                "Les mots de passe ne correspondent pas",
            })}
            topLabel={{ text: "Confirmer le mot de passe" }}
            disabled={isResettingPassword}
            error={
              errors.confirmPassword
                ? {
                    active: true,
                    message: errors.confirmPassword.message ?? "",
                  }
                : undefined
            }
            onVisibilityChange={(visible) =>
              setEyeDirection(visible ? "bottom-left" : "top-right")
            }
          />
        </div>

        {resetPasswordError && (
          <p className="mt-3 text-sm text-auchan-red">{resetPasswordError}</p>
        )}

        <div className="mt-auto flex justify-center">
          <CustomButton
            type="submit"
            onClick={() => {}}
            loading={isResettingPassword}
            className="h-[60px] w-[355px] rounded-[40px] bg-auchan-red text-[20px] font-black text-white hover:bg-auchan-red-hover"
          >
            Valider
          </CustomButton>
        </div>
      </form>
    </>
  );
}
