import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  createStyles,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@material-ui/core";
import { Alert, Skeleton } from "@material-ui/lab";
import { useMemo } from "react";
import { LANG } from "../lang/lang";
import { useGetHistoryQuery } from "../redux/API";
import { useUser } from "../redux/store";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down("xs")]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
      minHeight: "90%",
    },
    paper: {
      padding: theme.spacing(2),
    },
    card: {
      minHeight: "100%",
    },
  })
);
export const Story: React.FC = () => {
  const classes = useStyles();
  const name = useUser().name as string;

  const { data: entries, isLoading, isError } = useGetHistoryQuery();

  const [wins, loses] = useMemo(() => {
    if (entries === undefined) {
      return [0, 0];
    }
    const wins = entries.stories.filter((e) => e.won === true).length;
    const loses = entries.stories.filter((e) => e.won === false).length;
    return [wins, loses];
  }, [entries]);

  const small = useMediaQuery("(max-width: 500px)");
  return (
    <Container className={classes.root}>
      {isError && (
        <>
          <br />
          <Alert severity="error">{LANG.networkFail}</Alert>
          <br />
        </>
      )}
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar>{name[0]}</Avatar>}
          title={name}
          subheader={LANG.Story.subheader}
          action={
            isLoading ? (
              <CircularProgress />
            ) : (
              <ButtonGroup orientation={small ? "vertical" : "horizontal"}>
                <Button style={{ color: "green" }}>
                  {LANG.Story.wins} {wins}
                </Button>
                <Button style={{ color: "red" }}>
                  {LANG.Story.loses} {loses}
                </Button>
              </ButtonGroup>
            )
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                {/* {entries && entries.length === 0 && !isLoading && (
                  <TableRow>
                    <TableCell align="center" colSpan={3}>
                      У нас немає ігор в історії. Зіграйте в рейтингову гру!
                    </TableCell>
                  </TableRow>
                )} */}
                {entries && (
                  <TableRow>
                    <TableCell>{LANG.Story.tableName}</TableCell>
                    <TableCell>{LANG.Story.tableResult}</TableCell>
                    <TableCell>{LANG.Story.tableDate}</TableCell>
                  </TableRow>
                )}
              </TableHead>
              <TableBody>
                {isLoading &&
                  new Array(10).fill(0).map((_, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton variant="text" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {entries &&
                  entries.stories.map((entry, entryIndex) => {
                    const { name, won, date } = entry;
                    return (
                      <TableRow key={entryIndex}>
                        <TableCell>{name}</TableCell>
                        {won ? (
                          <TableCell style={{ color: "green" }}>
                            {LANG.Story.resultWin}
                          </TableCell>
                        ) : (
                          <TableCell style={{ color: "red" }}>
                            {LANG.Story.resultLost}
                          </TableCell>
                        )}
                        <TableCell>{date}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};
