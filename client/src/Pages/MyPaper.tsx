import { Container, createStyles, makeStyles, Paper } from "@material-ui/core";
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    paper: {
      padding: theme.spacing(3),
      [theme.breakpoints.down("sm")]: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
      },
    },
  })
);
export const MyPaper: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Paper className={classes.paper}>{children}</Paper>
    </Container>
  );
};
