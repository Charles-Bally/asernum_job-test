import ICONS from "@/constants/icons";
import { UserBaseType, UserBaseTypeType } from "@/types/user/base.user";
import { UserTylimmo } from "@/types/user/userTylimmo";

type UserBaseDataProps = {
  user: UserTylimmo | null;
};
export const handleGetUserBaseData = ({ user }: UserBaseDataProps) => {
  if (!user) return {
    title: "",
    code: "",
    logo: "",
    userType: [],
    userListSwap: [],
  };
  let title = "";
  let code = "";
  let logo = "";
  let userType: UserBaseType[] = [];
  let userListSwap: UserBaseTypeType[] = [];
  userType.push(UserBaseType.PROPERTY_SEEKER);
  userListSwap.push({
    label: "Particulier",
    activeLogo: ICONS.account.property_seeker_active,
    inactiveLogo: ICONS.account.property_seeker,
    userType: UserBaseType.PROPERTY_SEEKER,
  });

  let newTableTitle = [];


  if (user.estate_agency && !user.company) {
    newTableTitle.push("AGENCE");
    logo = ICONS.inscription.step2.pro;
    userType = [...userType, UserBaseType.COMPANY];
    userListSwap.push({
      label: "Agence",
      activeLogo: ICONS.account.agency_active,
      inactiveLogo: ICONS.account.agency,
      userType: UserBaseType.COMPANY,
    });
  }
  if (user.company) {
    newTableTitle.push("Entreprise");
    logo = ICONS.inscription.step2.pro;
    userType = [...userType, UserBaseType.COMPANY];
    userListSwap.push({
      label: "Entreprise",
      activeLogo: ICONS.account.agency_active,
      inactiveLogo: ICONS.account.agency,
      userType: UserBaseType.COMPANY,
    });
  }
  if (user.owner) {
    newTableTitle.push("PROPRIÉTAIRE");
    logo = ICONS.inscription.step2.owner;
    userType = [...userType, UserBaseType.OWNER];
    userListSwap.push({
      label: "Propriétaire",
      activeLogo: ICONS.account.owner_active,
      inactiveLogo: ICONS.account.owner,
      userType: UserBaseType.OWNER,
    });
  }
  if (user.middleman) {
    newTableTitle.push("MANDATAIRE");
    logo = ICONS.inscription.step2.agent;
    userType = [...userType, UserBaseType.MIDDLEMAN];
    userListSwap.push({
      label: "Mandataire",
      activeLogo: ICONS.account.mandataire_active,
      inactiveLogo: ICONS.account.mandataire,
      userType: UserBaseType.MIDDLEMAN,
    });
  }
  if (user.broker) {
    newTableTitle.push("COURTIER");
    logo = ICONS.inscription.step2.briefcase;
    userType = [...userType, UserBaseType.BROKER];
    userListSwap.push({
      label: "Courtier",
      activeLogo: ICONS.account.mandataire_active,
      inactiveLogo: ICONS.account.mandataire,
      userType: UserBaseType.BROKER,
    });
  }
  if (user.property_seeker && newTableTitle.length === 0) {
    logo = ICONS.inscription.step2.agent;
    newTableTitle.push("PARTICULIER");
  }

  title = newTableTitle.join(" / ");
  code = user.sponsorship_codes?.[0]?.code || "N/A";
  return {
    title,
    code,
    logo,
    userType,
    userListSwap,
  };
};
