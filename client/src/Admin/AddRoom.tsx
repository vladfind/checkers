import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { serverIP } from "../config";
import { MyPaper } from "../Pages/MyPaper";

export const AddRoom: React.FC = () => {
  const [mode, setMode] = useState<"public" | "rating">("public");
  const [roomName, setRoomName] = useState("Привет");
  const [ratingWins, setRatingWins] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <MyPaper>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          async function go() {
            setLoading(true);
            try {
              const req = await fetch(`${serverIP}/server_add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roomName, ratingWins, mode }),
              });
              if (req.status === 201) {
                alert("Успішно створено кімнату");
                setRoomName("");
              } else {
                const obj = await req.json();
                alert(obj.text);
              }
            } catch (error) {
            } finally {
              setLoading(false);
            }
          }
          go();
        }}
      >
        <Grid container spacing={2}>
          <Grid item>
            <Typography variant="h4">Створення кімнати</Typography>
          </Grid>
          {loading && (
            <Grid item>
              <CircularProgress />
            </Grid>
          )}
        </Grid>
        <br />
        <TextField
          disabled={loading}
          required
          label="Ім'я кімнати"
          variant="outlined"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          fullWidth
        />
        <br />
        <br />
        <Grid container justify="space-between" spacing={2}>
          <Grid item>
            <FormControl disabled={loading} component="fieldset">
              <FormLabel component="legend">Тип кімнати: </FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
              >
                <FormControlLabel
                  value="public"
                  control={<Radio />}
                  label="Публічна"
                />
                <FormControlLabel
                  value="rating"
                  control={<Radio />}
                  label="Рейтингова"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          {mode === "rating" && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Кількість перемог потрібних для гри"
                variant="outlined"
                type="number"
                value={ratingWins}
                onChange={(e) => {
                  const next = Number(e.target.value);

                  if (!isNaN(next) && next >= 0) {
                    setRatingWins(next);
                  }
                }}
              />
            </Grid>
          )}
        </Grid>
        <br />
        <Grid container justify="flex-end">
          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            color="secondary"
          >
            Створити
          </Button>
        </Grid>
      </form>
    </MyPaper>
  );
};
