// pages/accomplishments.jsx

import React, { useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { MdWork, MdSchool, MdStar } from 'react-icons/md';

const Accomplishments = () => {
  // State to keep track of the currently selected timeline event.
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Opens the modal by setting the selected event data.
  const openModal = (eventData) => {
    setSelectedEvent(eventData);
  };

  // Closes the modal.
  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="p-4">
      <VerticalTimeline>
        {/* Timeline Element #1 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work cursor-pointer"
          contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
          date="2011 - present"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          icon={<MdWork />}
        >
          <div 
            onClick={() =>
              openModal({
                date: "2011 - present",
                title: "Creative Director",
                subtitle: "Miami, FL",
                description:
                  "Creative Direction, User Experience, Visual Design, Project Management, Team Leading",
                image: "https://jphlpl-portfolio-bucket.s3.ap-southeast-1.amazonaws.com/accomplishments/Thesis2.jpg"
              })
            }
            className="cursor-pointer"
          >
            <img
              src="https://jphlpl-portfolio-bucket.s3.ap-southeast-1.amazonaws.com/accomplishments/Thesis2.jpg"
              alt="Creative Director"
              className="w-full mb-2 rounded"
            />
            <h3 className="vertical-timeline-element-title text-gray-100 dark:text-gray-100">
              Creative Director
            </h3>
            <h4 className="vertical-timeline-element-subtitle text-gray-200 dark:text-gray-300">
              Miami, FL
            </h4>
          </div>
        </VerticalTimelineElement>

        {/* Timeline Element #2 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work cursor-pointer"
          date="2010 - 2011"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          icon={<MdWork />}
        >
          <div 
            onClick={() =>
              openModal({
                date: "2010 - 2011",
                title: "Art Director",
                subtitle: "San Francisco, CA",
                description:
                  "Creative Direction, User Experience, Visual Design, SEO, Online Marketing",
                image: "https://jphlpl-portfolio-bucket.s3.ap-southeast-1.amazonaws.com/accomplishments/Thesis2.jpg"
              })
            }
            className="cursor-pointer"
          >
            <img
              src="/images/work_art_director.jpg"
              alt="Art Director"
              className="w-full mb-2 rounded"
            />
            <h3 className="vertical-timeline-element-title text-gray-800 dark:text-gray-100">
              Art Director
            </h3>
            <h4 className="vertical-timeline-element-subtitle text-gray-600 dark:text-gray-300">
              San Francisco, CA
            </h4>
          </div>
        </VerticalTimelineElement>

        {/* Timeline Element #3 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work cursor-pointer"
          date="2008 - 2010"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          icon={<MdWork />}
        >
          <div 
            onClick={() =>
              openModal({
                date: "2008 - 2010",
                title: "Web Designer",
                subtitle: "Los Angeles, CA",
                description: "User Experience, Visual Design",
                image: "/images/work_web_designer.jpg"
              })
            }
            className="cursor-pointer"
          >
            <img
              src="/images/work_web_designer.jpg"
              alt="Web Designer"
              className="w-full mb-2 rounded"
            />
            <h3 className="vertical-timeline-element-title text-gray-800 dark:text-gray-100">
              Web Designer
            </h3>
            <h4 className="vertical-timeline-element-subtitle text-gray-600 dark:text-gray-300">
              Los Angeles, CA
            </h4>
          </div>
        </VerticalTimelineElement>

        {/* Timeline Element #4 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--work cursor-pointer"
          date="2006 - 2008"
          iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          icon={<MdWork />}
        >
          <div 
            onClick={() =>
              openModal({
                date: "2006 - 2008",
                title: "Web Designer",
                subtitle: "San Francisco, CA",
                description: "User Experience, Visual Design",
                image: "/images/work_web_designer_sf.jpg"
              })
            }
            className="cursor-pointer"
          >
            <img
              src="/images/work_web_designer_sf.jpg"
              alt="Web Designer"
              className="w-full mb-2 rounded"
            />
            <h3 className="vertical-timeline-element-title text-gray-800 dark:text-gray-100">
              Web Designer
            </h3>
            <h4 className="vertical-timeline-element-subtitle text-gray-600 dark:text-gray-300">
              San Francisco, CA
            </h4>
          </div>
        </VerticalTimelineElement>

        {/* Timeline Element #5 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--education cursor-pointer"
          date="April 2013"
          iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
          icon={<MdSchool />}
        >
          <div 
            onClick={() =>
              openModal({
                date: "April 2013",
                title: "Content Marketing for Web, Mobile and Social Media",
                subtitle: "Online Course",
                description: "Strategy, Social Media",
                image: "/images/education_content_marketing.jpg"
              })
            }
            className="cursor-pointer"
          >
            <img
              src="/images/education_content_marketing.jpg"
              alt="Content Marketing"
              className="w-full mb-2 rounded"
            />
            <h3 className="vertical-timeline-element-title text-gray-800 dark:text-gray-100">
              Content Marketing for Web, Mobile and Social Media
            </h3>
            <h4 className="vertical-timeline-element-subtitle text-gray-600 dark:text-gray-300">
              Online Course
            </h4>
          </div>
        </VerticalTimelineElement>

        {/* Timeline Element #6 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--education cursor-pointer"
          date="November 2012"
          iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
          icon={<MdSchool />}
        >
          <div 
            onClick={() =>
              openModal({
                date: "November 2012",
                title: "Agile Development Scrum Master",
                subtitle: "Certification",
                description: "Creative Direction, User Experience, Visual Design",
                image: "/images/education_scrum_master.jpg"
              })
            }
            className="cursor-pointer"
          >
            <img
              src="/images/education_scrum_master.jpg"
              alt="Scrum Master"
              className="w-full mb-2 rounded"
            />
            <h3 className="vertical-timeline-element-title text-gray-800 dark:text-gray-100">
              Agile Development Scrum Master
            </h3>
            <h4 className="vertical-timeline-element-subtitle text-gray-600 dark:text-gray-300">
              Certification
            </h4>
          </div>
        </VerticalTimelineElement>

        {/* Timeline Element #7 */}
        <VerticalTimelineElement
          className="vertical-timeline-element--education cursor-pointer"
          date="2002 - 2006"
          iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
          icon={<MdSchool />}
        >
          <div 
            onClick={() =>
              openModal({
                date: "2002 - 2006",
                title: "Bachelor of Science in Interactive Digital Media Visual Imaging",
                subtitle: "Bachelor Degree",
                description: "Creative Direction, Visual Design",
                image: "/images/education_bachelor.jpg"
              })
            }
            className="cursor-pointer"
          >
            <img
              src="/images/education_bachelor.jpg"
              alt="Bachelor Degree"
              className="w-full mb-2 rounded"
            />
            <h3 className="vertical-timeline-element-title text-gray-800 dark:text-gray-100">
              Bachelor of Science in Interactive Digital Media Visual Imaging
            </h3>
            <h4 className="vertical-timeline-element-subtitle text-gray-600 dark:text-gray-300">
              Bachelor Degree
            </h4>
          </div>
        </VerticalTimelineElement>

        {/* Timeline Element for Special Recognition */}
        <VerticalTimelineElement
          className="cursor-pointer"
          iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
          icon={<MdStar />}
        >
          <div 
            onClick={() =>
              openModal({
                date: "",
                title: "Special Recognition",
                subtitle: "",
                description: "Special recognition for outstanding contribution",
                image: "/images/special_recognition.jpg"
              })
            }
            className="cursor-pointer"
          >
            <h3 className="vertical-timeline-element-title text-gray-800 dark:text-gray-100">
              Special Recognition
            </h3>
          </div>
        </VerticalTimelineElement>
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
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {selectedEvent.description}
            </p>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-auto rounded mb-2"
            />
            {selectedEvent.date && (
              <p className="mt-2 text-sm text-gray-500">{selectedEvent.date}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Accomplishments;
