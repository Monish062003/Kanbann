import Navbar from "./components/Navbar";
import Sidepanel from "./components/Sidepanel";
import Cardpanel from "./components/Cardpanel";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <div className="home">
        <Sidepanel />
        <Cardpanel />
      </div>
    </>
  );
}

export default App;
