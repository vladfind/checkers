import {
  Button,
  DialogActions,
  Grid,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { useState } from "react";
import { Password } from "./Password";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import { useMemo } from "react";
import { useRegisterMutation } from "../redux/API";
import { LANG } from "../lang/lang";
import { IsMyError, isNetworkFail } from "../utils/errorHelp";
import { NetworkFail } from "../common/NetworkFail";
import { AlertError } from "../common/AlertError";
import { AlertSuccess } from "../common/AlertSuccess";

const checkName = (name: string) => {
  if (name.length < 4) {
    return "Too short";
  }
  if (name.length > 15) {
    return "Too long";
  }
  return null;
};

const checkPass = (pass: string) => {
  if (pass.length < 4) {
    return "Too short";
  }
  if (pass.length > 15) {
    return "Too long";
  }
  return null;
};

const checkEmail = (email: string) => {
  if (email.length < 4) {
    return "Too short";
  }
  if (email.length > 15) {
    return "Too long";
  }
  return null;
};

/**
 *
 * @param original
 * @param checkErr Make sure the identity of this is stable
 * cuz of useMemo stuff
 * @returns
 */
function useField<T>(
  original: T,
  checkErr: (val: T) => null | string
): [
  T,
  React.Dispatch<React.SetStateAction<T>>,
  null | string,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const [value, setValue] = useState(original);
  const [check, setCheck] = useState(false);
  const err = useMemo(() => {
    if (check) {
      return checkErr(value);
    }
    return null;
  }, [value, check, checkErr]);

  return [value, setValue, err, setCheck];
}

export const Reg: React.FC = () => {
  const [register, { data, error }] = useRegisterMutation();

  const [name, setName, nameErr, setNameCheck] = useField<string>(
    "",
    checkName
  );

  const [pass, setPass, passErr, setPassCheck] = useField<string>(
    "",
    checkPass
  );

  const [email, setEmail, emailErr, setEmailCheck] = useField<string>(
    "",
    checkEmail
  );

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        register({ name, email, password: pass });
      }}
    >
      {data && <AlertSuccess marginTop={false} text={data.text} />}
      {IsMyError(error) && (
        <AlertError marginTop={false} text={error.data.text} />
      )}
      {isNetworkFail(error) && <NetworkFail marginTop={false} />}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            label={LANG.Reg.name}
            variant="outlined"
            fullWidth
            error={Boolean(nameErr)}
            helperText={nameErr}
            onBlur={() => setNameCheck(true)}
          />
        </Grid>
        <Grid item xs={12}>
          <Password
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            label={LANG.Reg.password}
            error={Boolean(passErr)}
            helperText={passErr}
            onBlur={() => setPassCheck(true)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            aria-label="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label={LANG.Reg.email}
            variant="outlined"
            fullWidth
            error={Boolean(emailErr)}
            helperText={emailErr}
            onBlur={() => setEmailCheck(true)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <br />
      <DialogActions>
        {/* {registerStatus === "pending" && <CircularProgress />} */}
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          type="submit"
          disabled={Boolean(nameErr || passErr || emailErr)}
        >
          {LANG.Reg.create}
        </Button>
      </DialogActions>
    </form>
  );
};
