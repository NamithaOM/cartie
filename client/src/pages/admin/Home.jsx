import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "./Home.css"; // Import the CSS file

function Home() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <>
      <div className="home-container">
        <h1 className="moving-text">Welcome to the E-Commerce Website</h1>
        {userName && (
          <h3 className="user-greeting">Hello, {userName}!</h3>
        )}
      </div>
    </>
  );
}

export default Home;
