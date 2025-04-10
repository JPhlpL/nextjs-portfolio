// pages/accomplishments.jsx

import React, { useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import accomplishmentsData from "../data/accomplishmentsData";

const Accomplishments = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const openModal = (eventData) => {
    setSelectedEvent(eventData);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="p-4">
      <VerticalTimeline>
        {accomplishmentsData.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <VerticalTimelineElement
              key={idx}
              className="vertical-timeline-element--work cursor-pointer"
              contentStyle={item.contentStyle}
              contentArrowStyle={item.contentArrowStyle}
              date={item.date}
              dateClassName="text-gray-700 dark:text-gray-300 font-medium"
              iconStyle={item.iconStyle}
              icon={<IconComponent />}
            >
              <div
                onClick={() =>
                  openModal({
                    date: item.date,
                    title: item.cardTitle,
                    description: item.cardDetailedText,
                    image: item.image,
                  })
                }
                className="cursor-pointer flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.cardTitle}
                  className="mb-3 rounded shadow-md w-[120px] h-[120px] object-contain"
                />

                <div>
                  <h3 className="vertical-timeline-element-title font-semibold text-gray-800">
                    {item.cardTitle}
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">{item.date}</p>
                </div>
              </div>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>

      {/* Modal (conditionally rendered) */}
      {selectedEvent && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 p-4 rounded shadow-lg max-w-2xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-700 dark:text-gray-300"
              onClick={closeModal}
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              {selectedEvent.title}
              </h2>
              <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              ({selectedEvent.date && (
              selectedEvent.date
            )})
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {selectedEvent.description}
            </p>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-64 object-contain rounded mb-2"
            />
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Accomplishments;
