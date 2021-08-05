import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";

interface props {
  users: string[];
}
export const ChatUsers: React.FC<props> = ({ users }) => {
  return (
    <>
      {users.map((user, userIndex) => {
        return (
          <ListItem key={userIndex}>
            <ListItemAvatar>
              <Avatar>{user[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={user} />
          </ListItem>
        );
      })}
    </>
  );
};
