import useAskActionStore from "@/store/askActionStore";
import { ActionInfoData } from "@/types/props/actionDataType";

const dialog = (data: ActionInfoData): Promise<boolean> => {
  const { askAction } = useAskActionStore.getState();
  return askAction(data);
};

export default dialog;
