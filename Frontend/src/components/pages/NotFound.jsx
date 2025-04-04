import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "./NotFound.css";

import babyYodaImage from "../../img/baby_Yoda.png";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 5000);
  });

  return (
    <>
      <div className="NotFound">
        <h1>Looks like you found baby Yoda's hiding place!</h1>
        <p>You aren't supposed to be here.</p>
        <p>
          You will be redirected back to the previous site in a few seconds...
        </p>
        <img src={babyYodaImage} alt="Baby Yoda" />
      </div>
    </>
  );
}
