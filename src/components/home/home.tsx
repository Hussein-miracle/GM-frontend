import MeetLogo from "../../assets/images/Google_Meet-Logo.svg";
import "./home.styles.scss";
const Home = () => {
  return (
    <div className="home">
      <header className="home__header">
        <div title="Low-Budget Google Meet" className="home__header--logo">
          <img
            src={MeetLogo}
            className="home__header--logo__img"
            alt="Low-Budget Google Meet logo"
          />
          <span className="home__header--logo__title">Low-Budget Google</span>
        </div>
        <span>Meet</span>
      </header>
    </div>
  );
};

export default Home;
