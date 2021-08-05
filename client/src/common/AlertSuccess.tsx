import { AlertBase, commonAlertProps } from "./AlertBase";

export const AlertSuccess: React.FC<commonAlertProps> = ({
  text,
  marginTop,
  marginBottom,
}) => {
  return (
    <AlertBase
      type="success"
      text={text}
      marginTop={marginTop === undefined ? true : marginTop}
      marginBottom={marginBottom === undefined ? true : marginBottom}
    />
  );
};
