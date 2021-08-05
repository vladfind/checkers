import { AlertBase, commonAlertProps } from "./AlertBase";

export const AlertError: React.FC<commonAlertProps> = ({
  text,
  marginTop,
  marginBottom,
}) => {
  return (
    <AlertBase
      type="error"
      text={text}
      marginTop={marginTop === undefined ? true : marginTop}
      marginBottom={marginBottom === undefined ? true : marginBottom}
    />
  );
};
