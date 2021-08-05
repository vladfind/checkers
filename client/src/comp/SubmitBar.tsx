import { IconButton, InputAdornment, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";

interface props {
  label: string;
  onSubmit: (s: string) => void;
}
export const SubmitBar: React.FC<props> = ({ label, onSubmit }) => {
  const [value, setValue] = useState("");
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };
  return (
    <form onSubmit={submit}>
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton edge="start" type="submit">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setValue("")}
                type="submit"
                style={
                  value.length > 0
                    ? { display: "inline-block" }
                    : { display: "none" }
                }
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};
