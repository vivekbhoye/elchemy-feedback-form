import { Routes, Route } from "react-router-dom";
import "./App.css";

import Feedback from "../src/components/feedback";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/customer-feedback/:clientid/:questionid"
          element={<Feedback />}
        />
      </Routes>
    </div>
  );
}

export default App;
