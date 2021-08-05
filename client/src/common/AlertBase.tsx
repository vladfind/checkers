import { Alert, AlertProps } from "@material-ui/lab";

interface BaseAlertProps {
  text: string;
  type: AlertProps["severity"];
  marginTop: boolean;
  marginBottom: boolean;
}

export interface commonAlertProps {
  text: string;
  marginTop?: boolean;
  marginBottom?: boolean;
}

export const AlertBase: React.FC<BaseAlertProps> = ({
  text,
  type,
  marginTop,
  marginBottom,
}) => {
  return (
    <>
      {marginTop && <br></br>}
      <Alert severity={type}>{text}</Alert>
      {marginBottom && <br></br>}
    </>
  );
};
