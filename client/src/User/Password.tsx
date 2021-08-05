import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
} from "@material-ui/core";
import { useState } from "react";
type props = TextFieldProps;

export const Password: React.FC<props> = (props) => {
  const [showText, setShowText] = useState(false);
  return (
    <TextField
      required
      aria-label="password"
      fullWidth
      variant="outlined"
      type={showText ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowText(!showText)}>
              {showText ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};
