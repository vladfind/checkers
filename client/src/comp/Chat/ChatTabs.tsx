import { Grid, Tab, Tabs, useMediaQuery } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import PeopleIcon from "@material-ui/icons/People";
import { LANG } from "../../lang/lang";

interface props {
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
}
export const ChatTabs: React.FC<props> = ({ tab, setTab }) => {
  const smallSize = useMediaQuery("(max-width: 400px)");
  return (
    <Tabs
      orientation={smallSize ? "vertical" : "horizontal"}
      value={tab}
      onChange={(e, newVal) => setTab(newVal)}
      centered
      indicatorColor="primary"
      textColor="primary"
    >
      <Tab
        label={
          <Grid
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
            spacing={2}
          >
            <Grid item>
              <ChatIcon />
            </Grid>
            <Grid item>{LANG.Chat.messages}</Grid>
          </Grid>
        }
      />
      <Tab
        label={
          <Grid
            container
            direction="row"
            alignItems="center"
            wrap="nowrap"
            spacing={2}
          >
            <Grid item>
              <PeopleIcon />
            </Grid>
            <Grid item>{LANG.Chat.players}</Grid>
          </Grid>
        }
      />
    </Tabs>
  );
};
