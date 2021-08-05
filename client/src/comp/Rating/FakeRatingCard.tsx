import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardHeader,
  Grid,
  IconButton,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

import { Skeleton } from "@material-ui/lab";

export const FakeRatingCard: React.FC = () => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Skeleton variant="circle">
            <Avatar />
          </Skeleton>
        }
        title={<Skeleton variant="text" />}
        subheader={<Skeleton variant="text" />}
        action={
          <IconButton>
            <Skeleton variant="circle" />
          </IconButton>
        }
      />
      {/* <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Гравець 1</TableCell>
                <TableCell>Гравець 2</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <br />
      </CardContent> */}
      <CardActions>
        <Grid container>
          <Grid item xs={12}>
            <Button
              size="large"
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<PlayArrowIcon />}
              disabled
            >
              <Skeleton variant="text" width="50%" />
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};
