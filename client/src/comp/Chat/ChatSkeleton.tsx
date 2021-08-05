import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export const ChatSkeleton: React.FC = () => {
  return (
    <>
      {new Array(10).fill(0).map((_, index) => {
        return (
          <ListItem key={index}>
            <ListItemAvatar>
              <Skeleton variant="circle">
                <Avatar />
              </Skeleton>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Skeleton>
                  <Typography>helllo world 13</Typography>{" "}
                </Skeleton>
              }
              secondary={
                <Skeleton variant="text" width="100%" height="4em"></Skeleton>
              }
            />
          </ListItem>
        );
      })}
    </>
  );
};
