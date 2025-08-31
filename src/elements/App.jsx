import "/src/style.css";
import { Routes, Route, Link } from "react-router-dom";
import Registrpage from "./Registration/!Registrpage.jsx";
import Footer from "./footer.jsx";
import Homepage from "./Homepage/!Homepage.jsx";
import Header_bar from "./header_bar.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Myurlspage from "./Myurls/!Myurlspage.jsx";
import Aboutpage from "./Aboutpage.jsx";

function App() {
  return (
    <div className="flex flex-col w-screen min-h-screen bg-rose-50">
      <Header_bar />
      <main className="flex flex-col flex-grow">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<Aboutpage />}/>
          <Route path="/myurls" element={
           <PrivateRoute>
            <Myurlspage />
           </PrivateRoute>
          }/>
          <Route path="/registration" element={<Registrpage />}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default App;
