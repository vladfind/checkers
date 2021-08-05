import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { BoardBot } from "./comp/Bot/BoardBot";
import { Chat } from "./comp/Chat/Chat";
import { Ratings } from "./comp/Rating/Ratings";
import { NavBar } from "./comp/NavBar";
import { BoardOffline } from "./comp/Offline/BoardOffline";
import { BoardOnline } from "./comp/Online/BoardOnline";
import { CreateRoom } from "./Pages/CreateRoom";
import { Servers } from "./comp/Online/Servers";
import { Story } from "./Pages/Story";
import { Reg } from "./User/Reg";
import { BoardRating } from "./comp/Rating/BoardRating";
import { CircularProgress } from "@material-ui/core";
import { AddRoom } from "./Admin/AddRoom";
import { useEffect } from "react";
import { userRole } from "./User/usertypes";
import { useLayoutEffect } from "react";
import { useLocalLoginMutation } from "./redux/API";
import { useUser } from "./redux/store";
import { useState } from "react";
import { loadState } from "./redux/localStore";

const GoToHome: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    history.push("/");
    console.log("history push");
  }, [history]);
  return <></>;
};
export const App: React.FC = () => {
  const { role } = useUser();
  const [LocalLogin, { data, isError }] = useLocalLoginMutation();

  const [letPass, setLetPass] = useState(false);
  useLayoutEffect(() => {
    const token = loadState()?.user.token || null;
    console.log(`tocket ${token}`);

    if (token) {
      LocalLogin({ token });
    } else {
      setLetPass(true);
    }
  }, [LocalLogin]);

  useEffect(() => {
    if (data) {
      setLetPass(true);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      setLetPass(true);
    }
  }, [isError]);

  if (!letPass) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress size="50vw" />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <>
        <NavBar />
        <Switch>
          <Route exact path="/" component={Servers} />
          <Route
            path="/ratings"
            component={role === userRole.guest ? GoToHome : Ratings}
          />
          <Route
            path="/rating"
            component={role === userRole.guest ? GoToHome : BoardRating}
          />
          <Route path="/online" component={BoardOnline} />
          <Route path="/offline" component={BoardOffline} />
          <Route path="/bot" component={BoardBot} />
          <Route path="/chat" component={Chat} />
          <Route
            path="/story"
            component={role === userRole.guest ? GoToHome : Story}
          />
          <Route
            path="/create"
            component={role !== userRole.admin ? GoToHome : CreateRoom}
          />
          <Route
            path="/edit"
            component={role !== userRole.admin ? GoToHome : CreateRoom}
          />
          <Route path="/servers" component={Servers} />
          <Route path="/reg" component={Reg} />
          <Route
            path="/addroom"
            component={role === userRole.guest ? GoToHome : AddRoom}
          />
        </Switch>{" "}
      </>
    </BrowserRouter>
  );
};
