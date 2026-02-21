import { z } from "zod";
import { notify } from "./notification";
type optionsValidation = {
  schema: z.ZodObject<any, any>;
  data: object;
};
export const validateSchema = (
  options: optionsValidation,
  showNotification = true,
) => {
  try {
    options.schema.parse(options.data);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const keys = error.errors.map((err: { path: Array<unknown> }) =>
        err.path ? err.path[0] : null,
      );
      const firstKey = keys[0];
      if (showNotification) {
        notify({
          title: "Erreur dans le formulaire",
          message: "Le champ " + firstKey + " est invalide",
          type: "error",
        });
      }
      return false;
    }
    return true;
  }
};
