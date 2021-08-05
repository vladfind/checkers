import {
  CircularProgress,
  Container,
  createStyles,
  Grid,
  LinearProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { NetworkFail } from "../../common/NetworkFail";
import { useGetRatingRoomsQuery } from "../../redux/API";
import { useUser } from "../../redux/store";
import { isNetworkFail } from "../../utils/errorHelp";
import { FakeRatingCard } from "./FakeRatingCard";
import { RatingCard } from "./RatingCard";

const useStyles = makeStyles((theme) =>
  createStyles({
    con: {
      padding: theme.spacing(2),
    },
  })
);
export const Ratings: React.FC = () => {
  const classes = useStyles();

  const {
    isLoading: isLoadingRooms,
    data: rooms,
    error,
  } = useGetRatingRoomsQuery();
  const { wins } = useUser();
  return (
    <>
      <Container className={classes.con}>
        {isLoadingRooms && (
          <>
            <LinearProgress />
          </>
        )}
        {isNetworkFail(error, isLoadingRooms) && <NetworkFail />}
        {rooms === undefined &&
          new Array(10).fill(0).map((_, i) => (
            <>
              <FakeRatingCard key={i} />
              <br />
            </>
          ))}
        {rooms &&
          rooms.map((fight, fightIndex) => {
            return (
              <div key={fightIndex}>
                <RatingCard fight={fight} playerWins={wins} /> <br />
              </div>
            );
          })}
      </Container>
    </>
  );
};
