import { useEffect, useState } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProjectSingle from "./ProjectSingle";

const ITEMS_PER_PAGE = 9;

function ProjectsGrid() {
  const [projects, setProjects] = useState([]);
  const [searchProject, setSearchProject] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/github");
      const data = await response.json();
      setProjects(data);
    }
    fetchData();
  }, []);

  // Extract unique languages including "Unknown"
  const languages = [...new Set(projects.map((p) => p.language || "Unknown"))];

  // Filter projects based on search query & selected language
  const filteredProjects = projects.filter((project) => {
    const searchLower = searchProject.toLowerCase();
    const matchesSearch =
      project.project.toLowerCase().includes(searchLower) ||
      (project.language &&
        project.language.toLowerCase().includes(searchLower)) ||
      (project.topics &&
        project.topics.join(", ").toLowerCase().includes(searchLower)) ||
      (project.website &&
        project.website.toLowerCase().includes(searchLower)) ||
      (project.repository_link &&
        project.repository_link.toLowerCase().includes(searchLower));

    const matchesLanguage =
      selectedLanguage === "Unknown"
        ? !project.language
        : selectedLanguage === "" || project.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Handle pagination navigation
  const goToNextPage = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className="py-5 sm:py-10 mt-5 sm:mt-10">
      <div className="text-center">
        <p className="font-general-medium text-2xl sm:text-4xl mb-1 text-ternary-dark dark:text-ternary-light">
          Projects Portfolio
        </p>
        <p className="text-md text-gray-500 dark:text-gray-300 max-w-2xl mx-auto mb-3">
          Explore a diverse collection of my projects. Some live on GitHub
          repositories, others are hosted online for quick interaction, and a
          few are deployed privately with clients or within company
          environments—each crafted with dedication and creativity.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total Projects: {filteredProjects.length}
        </p>
      </div>

      {/* Search & Filter Row */}
      <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row justify-between items-center border-b border-primary-light dark:border-secondary-dark pb-3 gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-2/3">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ternary-dark dark:text-ternary-light w-5 h-5" />
          <input
            onChange={(e) => setSearchProject(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-secondary-dark rounded-lg text-sm sm:text-md bg-secondary-light dark:bg-ternary-dark text-primary-dark dark:text-ternary-light focus:ring-2 focus:ring-primary-light dark:focus:ring-secondary-dark"
            type="search"
            placeholder="Search Projects, Topics, Language, or Web Links"
          />
        </div>

        {/* Language Filter */}
        <select
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="p-2 w-full sm:w-1/3 border border-gray-200 dark:border-secondary-dark rounded-lg text-sm sm:text-md bg-secondary-light dark:bg-ternary-dark text-primary-dark dark:text-ternary-light focus:ring-2 focus:ring-primary-light dark:focus:ring-secondary-dark"
        >
          <option value="">All Languages</option>
          {languages.map((lang, index) => (
            <option key={index} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-y-4 sm:gap-5">
        {paginatedProjects.map((project, index) => (
          <ProjectSingle key={index} {...project} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6">
        {/* Previous Button */}
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 rounded-md flex items-center ${
            currentPage === 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index + 1)}
            className={`px-3 py-2 mx-1 rounded-md ${
              currentPage === index + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 rounded-md flex items-center ${
            currentPage === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}

export default ProjectsGrid;
