import {
  Button,
  CircularProgress,
  DialogActions,
  Grid,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { useState } from "react";
import { Password } from "./Password";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import { useLoginMutation } from "../redux/API";
import { IsMyError, isNetworkFail } from "../utils/errorHelp";
import { NetworkFail } from "../common/NetworkFail";
import { AlertError } from "../common/AlertError";
import { AlertSuccess } from "../common/AlertSuccess";
import { LoginAPI } from "../redux/APItypes";
import { LANG } from "../lang/lang";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [login, { isLoading, data, error }] = useLoginMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const req: LoginAPI.request = {
          email,
          password: pass,
        };
        login(req);
      }}
    >
      {data && <AlertSuccess marginTop={false} text={data.text} />}
      {IsMyError(error) && (
        <AlertError marginTop={false} text={error.data.text} />
      )}
      {isNetworkFail(error) && <NetworkFail marginTop={false} />}
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label={LANG.Login.email}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Password
            disabled={isLoading}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            label={LANG.Login.password}
          />
        </Grid>
      </Grid>
      <br />
      <DialogActions>
        {isLoading && <CircularProgress />}
        <Button fullWidth variant="outlined" color="secondary" type="submit">
          {LANG.Login.login}
        </Button>
      </DialogActions>
    </form>
  );
};
