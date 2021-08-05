import {
  IconButton,
  InputAdornment,
  ListItem,
  TextField,
} from "@material-ui/core";
import { useState } from "react";
import SendIcon from "@material-ui/icons/Send";
import { LANG } from "../../lang/lang";

interface props {
  submitMessage: (text: string) => void;
}
export const ChatSend: React.FC<props> = ({ submitMessage }) => {
  const [text, setText] = useState("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | undefined = undefined
  ) => {
    e?.preventDefault();
    if (text.trim().length) {
      submitMessage(text);
      setText("");
    }
  };
  return (
    <>
      <ListItem>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <TextField
            //     disabled={!socketOn || name === null}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleSubmit();
              }
            }}
            label={LANG.Chat.message}
            fullWidth
            rows={2}
            rowsMax={20}
            multiline
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    //     disabled={!socketOn || name === null}
                    title={LANG.Chat.sendMessage}
                    color="primary"
                    type="submit"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </ListItem>
    </>
  );
};
