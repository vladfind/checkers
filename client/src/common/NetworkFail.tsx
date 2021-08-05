import { LANG } from "../lang/lang";
import { commonAlertProps } from "./AlertBase";
import { AlertError } from "./AlertError";

type props = Omit<commonAlertProps, "text">;
export const NetworkFail: React.FC<props> = ({ marginTop, marginBottom }) => {
  return (
    <AlertError
      text={LANG.networkFail}
      marginTop={marginTop}
      marginBottom={marginBottom}
    />
  );
};
