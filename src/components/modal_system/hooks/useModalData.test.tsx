/**
 * Test de la récursivité des types NestedPaths
 * Ce fichier démontre que l'autocomplétion fonctionne sur plusieurs niveaux
 */

import { useModalData } from "./useModalData";

export function TestNestedPaths() {
  // Test avec 3 niveaux d'imbrication
  const { updateField, getValue } = useModalData({
    level1: {
      level2: {
        level3: {
          deepValue: "",
          deepNumber: 0,
        },
        value2: "",
      },
      value1: "",
    },
    user: {
      profile: {
        personal: {
          firstName: "",
          lastName: "",
          age: 0,
        },
        contact: {
          email: "",
          phone: "",
        },
      },
      settings: {
        preferences: {
          theme: "light",
          language: "fr",
        },
        notifications: {
          email: true,
          push: false,
        },
      },
    },
    simpleField: "",
  });

  // ✅ Ces chemins devraient tous être autocompletés et typés

  // Niveau 1
  updateField("simpleField", "test");
  updateField("level1", {
    level2: { level3: { deepValue: "", deepNumber: 0 }, value2: "" },
    value1: "",
  });

  // Niveau 2
  updateField("level1.value1", "test");
  updateField("level1.level2", {
    level3: { deepValue: "", deepNumber: 0 },
    value2: "",
  });

  // Niveau 3
  updateField("level1.level2.value2", "test");
  updateField("level1.level2.level3", { deepValue: "", deepNumber: 0 });

  // Niveau 4 (le plus profond)
  updateField("level1.level2.level3.deepValue", "test");
  updateField("level1.level2.level3.deepNumber", 42);

  // Chemins complexes avec user
  updateField("user.profile.personal.firstName", "John");
  updateField("user.profile.personal.lastName", "Doe");
  updateField("user.profile.personal.age", 30);
  updateField("user.profile.contact.email", "john@example.com");
  updateField("user.profile.contact.phone", "+33123456789");
  updateField("user.settings.preferences.theme", "dark");
  updateField("user.settings.preferences.language", "en");
  updateField("user.settings.notifications.email", false);
  updateField("user.settings.notifications.push", true);

  // ✅ getValue devrait aussi fonctionner
  const _firstName = getValue("user.profile.personal.firstName");
  const _age = getValue("user.profile.personal.age");
  const _theme = getValue("user.settings.preferences.theme");
  const _emailNotif = getValue("user.settings.notifications.email");

  // ❌ Ces chemins devraient donner des erreurs TypeScript
  // @ts-expect-error - Ce chemin n'existe pas
  updateField("level1.level2.level3.wrongField", "test");

  // @ts-expect-error - Ce chemin n'existe pas
  updateField("user.profile.personal.middleName", "Test");

  // @ts-expect-error - Type incorrect
  updateField("user.profile.personal.age", "30"); // Devrait être number, pas string

  // @ts-expect-error - Type incorrect
  updateField("user.settings.notifications.email", "true"); // Devrait être boolean

  return (
    <div>
      <h2>Test de récursivité NestedPaths</h2>
      <p>Niveau 4 : {getValue("level1.level2.level3.deepValue")}</p>
      <p>
        User profile : {getValue("user.profile.personal.firstName")}{" "}
        {getValue("user.profile.personal.lastName")}
      </p>
      <p>Age : {getValue("user.profile.personal.age")}</p>
      <p>Theme : {getValue("user.settings.preferences.theme")}</p>
    </div>
  );
}

/**
 * Type de test pour vérifier la génération des chemins
 * Décommentez pour voir tous les chemins possibles
 */

// type TestPaths = NestedPaths<{
//   level1: {
//     level2: {
//       level3: {
//         deepValue: string;
//       };
//     };
//   };
// }>;

// Les chemins générés devraient être :
// "level1" | "level1.level2" | "level1.level2.level3" | "level1.level2.level3.deepValue"
