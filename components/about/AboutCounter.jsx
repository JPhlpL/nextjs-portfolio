import React, { useRef } from 'react';
import useDecimalCountUp from '../hooks/useDecimalCountUp'; // Adjust the import path as necessary
import CounterItem from './CounterItem';
import { useCountUp } from 'react-countup';

function AboutCounter() {
  // Function to calculate years of experience from September 2019 to now
  const calculateExperience = () => {
    const startDate = new Date('2019-09-01');
    const currentDate = new Date();
    const totalMonths = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
    return (totalMonths / 12).toFixed(1); // Return years as a decimal with one decimal place
  };

  // Calculate experience dynamically
  const experienceYears = parseFloat(calculateExperience());

  // Use the calculated experience in the counter
  const experienceCounterRef = useDecimalCountUp(experienceYears, 2, (value) => value.toFixed(1));

  // Create a ref for projectsDeveloped
  const projectsDevelopedRef = useRef(null);
  const { start: startProjectsDevelopedCount } = useCountUp({ ref: projectsDevelopedRef, end: 18, duration: 2 });

  // Create a ref for projects completed
  //   const projectsCounterRef = useDecimalCountUp(77, 2);

  // Start counting for projectsDeveloped when the component mounts
  React.useEffect(() => {
    startProjectsDevelopedCount();
  }, [startProjectsDevelopedCount]);

  return (
    <div className="mt-10 sm:mt-20 bg-primary-light dark:bg-ternary-dark shadow-sm">
      <div className="font-general-medium container mx-auto py-20 block sm:flex sm:justify-between items-center">
        <CounterItem
          title="Years of experience"
          counter={<span ref={experienceCounterRef} />}
          measurement=""
        />

        <CounterItem
          title="Projects Developed & Involved"
          counter={<span ref={projectsDevelopedRef} />}
          measurement=""
        />

      </div>
    </div>
  );
}

export default AboutCounter;