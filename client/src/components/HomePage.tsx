import { useState, useEffect } from "react";
import { Link } from "react-router";

// helpers
import {
  checkAuth,
  getAllMeetingData,
  getTopThreeMeetings,
} from "../helpers/fetchHelpers";

//components
import Header from "./Header";
import MeetingItem from "./MeetingItem";
import TopThreeItem from "./TopThreeItem";
import Footer from "./Footer";

// types
import { Meeting, CurrentUser } from "../../globalTypes";

// styles
import "./HomePage.css";

type HomePageProps = {
  meetingData: Meeting[] | null;
  setMeetingData: React.Dispatch<React.SetStateAction<Meeting[] | null>>;
};

export default function HomePage({
  meetingData,
  setMeetingData,
}: HomePageProps) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [topThree, setTopThree] = useState<Meeting[] | null>(null);

  useEffect(() => {
    (async () => setCurrentUser(await checkAuth()))();
    (async () => setMeetingData(await getAllMeetingData()))();
    (async () => setTopThree(await getTopThreeMeetings()))();
  }, []);

  useEffect(() => {
    console.log(topThree);
  }, [topThree]);

  return (
    <>
      <Header currentUser={currentUser} />
      {currentUser?.status === "authed" ? (
        <>
          <h1 className="upcoming">
            Upcoming <span className="pop-text">Board Game</span> Meets
          </h1>
          <main className="all-meetings">
            {meetingData?.map((meeting) => (
              <Link
                key={meeting.id}
                to={`/meeting/${meeting.id}`}
                state={meeting}
                className="btn-link"
              >
                <MeetingItem meeting={meeting} />
              </Link>
            ))}
          </main>
          <Footer />
        </>
      ) : (
        <main className="hero">
          <div className="overlay">
            <h1 className="hero-title">
              Find Folks To <span className="pop-text">Board Game</span> With
              <span className="pop-text">.</span>
            </h1>
            <div className="top-three">
              {topThree?.map((meeting, index) => (
                <Link
                  key={meeting.id}
                  to={`/meeting/${meeting.id}`}
                  state={meeting}
                  className="btn-link"
                >
                  <TopThreeItem meeting={meeting} imgIndex={index} />
                </Link>
              ))}
            </div>
            <Link to="/register" className="btn-link">
              <button className="big-btn pop-btn hero-btn">
                Find A Meetup
              </button>
            </Link>
          </div>
        </main>
      )}
    </>
  );
}
