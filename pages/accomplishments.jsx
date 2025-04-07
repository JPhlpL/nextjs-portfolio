import { useEffect, useState } from "react";
import { Chrono } from "react-chrono";

function Accomplishments() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const items = [
    {
      title: "May 1940",
      cardTitle: "Dunkirk",
      url: "http://www.history.com",
      cardSubtitle:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      cardDetailedText:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      media: {
        type: "IMAGE",
        source: {
          url: "http://someurl/image.jpg",
        },
      },
    },
    {
      title: "May 1945",
      cardTitle: "Dunkirk",
      url: "http://www.history.com",
      cardSubtitle:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      cardDetailedText:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      media: {
        type: "IMAGE",
        source: {
          url: "http://someurl/image.jpg",
        },
      },
    },
	{
		title: "May 1946",
		cardTitle: "Dunkirk",
		url: "http://www.history.com",
		cardSubtitle:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		cardDetailedText:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		media: {
		  type: "IMAGE",
		  source: {
			url: "http://someurl/image.jpg",
		  },
		},
	  },
	  {
		title: "May 1947",
		cardTitle: "Dunkirk",
		url: "http://www.history.com",
		cardSubtitle:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		cardDetailedText:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		media: {
		  type: "IMAGE",
		  source: {
			url: "http://someurl/image.jpg",
		  },
		},
	  },
	  {
		title: "May 1948",
		cardTitle: "Dunkirk",
		url: "http://www.history.com",
		cardSubtitle:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		cardDetailedText:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		media: {
		  type: "IMAGE",
		  source: {
			url: "http://someurl/image.jpg",
		  },
		},
	  },
	  {
		title: "May 1949",
		cardTitle: "Dunkirk",
		url: "http://www.history.com",
		cardSubtitle:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		cardDetailedText:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		media: {
		  type: "IMAGE",
		  source: {
			url: "http://someurl/image.jpg",
		  },
		},
	  },
	  {
		title: "May 1950",
		cardTitle: "Dunkirk",
		url: "http://www.history.com",
		cardSubtitle:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		cardDetailedText:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		media: {
		  type: "IMAGE",
		  source: {
			url: "http://someurl/image.jpg",
		  },
		},
	  },
	  {
		title: "May 1951",
		cardTitle: "Dunkirk",
		url: "http://www.history.com",
		cardSubtitle:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		cardDetailedText:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		media: {
		  type: "IMAGE",
		  source: {
			url: "http://someurl/image.jpg",
		  },
		},
	  },
	  {
		title: "May 1952",
		cardTitle: "Dunkirk",
		url: "http://www.history.com",
		cardSubtitle:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		cardDetailedText:
		  "Men of the British Expeditionary Force (BEF) wade out to..",
		media: {
		  type: "IMAGE",
		  source: {
			url: "http://someurl/image.jpg",
		  },
		},
	  },
  ];

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="App">
      <div style={{ width: "100%" }}>
        <Chrono
          items={items}
          mode="HORIZONTAL"
          showCardsHorizontal
          cardWidth={450}
          cardHeight={300}
          contentDetailsHeight={100}
          fontSizes={{
            title: "1rem"
          }}
          slideShow
		  disableToolbar
        />
      </div>
    </div>
  );
}

export default Accomplishments;
