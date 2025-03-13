import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import ProjectSingle from './ProjectSingle';

function ProjectsGrid() {
    const [projects, setProjects] = useState([]);
    const [searchProject, setSearchProject] = useState('');
    const [selectProject, setSelectProject] = useState('');

    // Fetch data from API on component mount
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/github');
            const data = await response.json();
            setProjects(data);
        }
        fetchData();
    }, []);

    // Filter by search input
    const filteredProjects = projects.filter(project =>
        project.project.toLowerCase().includes(searchProject.toLowerCase())
    );

    return (
        <section className="py-5 sm:py-10 mt-5 sm:mt-10">
            <div className="text-center">
                <p className="font-general-medium text-2xl sm:text-4xl mb-1 text-ternary-dark dark:text-ternary-light">
                    Projects portfolio
                </p>
            </div>

            <div className="mt-10 sm:mt-16">
                <h3 className="text-center text-secondary-dark dark:text-ternary-light text-md sm:text-xl mb-3">
                    Search projects by title or filter by category
                </h3>
                <div className="flex justify-between border-b border-primary-light dark:border-secondary-dark pb-3 gap-3">
                    <div className="flex justify-between gap-2">
                        <span className="hidden sm:block bg-primary-light dark:bg-ternary-dark p-2.5 shadow-sm rounded-xl cursor-pointer">
                            <FiSearch className="text-ternary-dark dark:text-ternary-light w-5 h-5" />
                        </span>
                        <input
                            onChange={(e) => setSearchProject(e.target.value)}
                            className="pl-3 pr-1 sm:px-4 py-2 border border-gray-200 dark:border-secondary-dark rounded-lg text-sm sm:text-md bg-secondary-light dark:bg-ternary-dark text-primary-dark dark:text-ternary-light"
                            type="search"
                            placeholder="Search Projects"
                            aria-label="Name"
                        />
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 sm:gap-5">
                {filteredProjects.map((project, index) => (
                    <ProjectSingle key={index} {...project} />
                ))}
            </div>
        </section>
    );
}

export default ProjectsGrid;
