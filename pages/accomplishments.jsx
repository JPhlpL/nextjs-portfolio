// pages/accomplishments.jsx

import { useEffect, useState } from "react";
import { Chrono } from "react-chrono";
import accomplishmentsData from "../data/accomplishmentsData";

// TODO: TRY THIS ONE https://stephane-monnot.github.io/react-vertical-timeline/#/

function Accomplishments() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="App">
      <div style={{ width: "100%" }}>
        <Chrono
          items={accomplishmentsData}
          mode="HORIZONTAL"
          showCardsHorizontal
          cardWidth={450}
          cardHeight={300}
          contentDetailsHeight={100}
          fontSizes={{ title: "1rem" }}
          slideShow
          disableToolbar
        />
      </div>
    </div>
  );
}

export default Accomplishments;
