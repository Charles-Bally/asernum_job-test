import useRequestActionStore from "@/store/requestActionStore";
import { LoaderDisplayType } from "@/types/props/loader.display.type";

const loaderRequest = (data: LoaderDisplayType): Promise<any> => {
  const { askRequest } = useRequestActionStore.getState();
  return askRequest(data);
};

export default loaderRequest;
