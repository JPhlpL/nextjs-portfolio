// pages/accomplishments.jsx

import React, { useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import accomplishmentsData from "../data/accomplishmentsData";
// Import creative arrow icons for the carousel navigation
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";

const Accomplishments = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Track current index for carousel images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (eventData) => {
    setSelectedEvent(eventData);
    setCurrentImageIndex(0); // Reset carousel index whenever modal opens
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  // Navigate to the previous image in the carousel
  const showPreviousImage = () => {
    if (
      selectedEvent &&
      selectedEvent.images &&
      selectedEvent.images.length > 0
    ) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex - 1 + selectedEvent.images.length) % selectedEvent.images.length
      );
    }
  };

  // Navigate to the next image in the carousel
  const showNextImage = () => {
    if (
      selectedEvent &&
      selectedEvent.images &&
      selectedEvent.images.length > 0
    ) {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % selectedEvent.images.length
      );
    }
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
                    // support both single and multiple image scenarios:
                    image: item.image,
                    images: item.images, // (optional) array of images for carousel
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

      {/* Modal with Carousel */}
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
              {selectedEvent.title}{" "}
              <span className="text-base font-medium">
                ({selectedEvent.date})
              </span>
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {selectedEvent.description}
            </p>
            <div className="relative flex justify-center items-center">
              {/* Render Previous button if multiple images exist */}
              {selectedEvent.images &&
                selectedEvent.images.length > 1 && (
                  <button
                    onClick={showPreviousImage}
                    className="absolute left-0 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                  >
                    <MdArrowBackIosNew size={20} />
                  </button>
                )}

              <img
                src={
                  // If an array of images exists use carousel; otherwise fallback to single image
                  selectedEvent.images &&
                  selectedEvent.images.length > 0
                    ? selectedEvent.images[currentImageIndex]
                    : selectedEvent.image
                }
                alt={selectedEvent.title}
                className="w-full h-64 object-contain rounded mb-2 transition-transform duration-300"
              />

              {/* Render Next button if multiple images exist */}
              {selectedEvent.images &&
                selectedEvent.images.length > 1 && (
                  <button
                    onClick={showNextImage}
                    className="absolute right-0 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                  >
                    <MdArrowForwardIos size={20} />
                  </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accomplishments;
