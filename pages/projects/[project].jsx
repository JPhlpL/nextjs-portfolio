import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiClock, FiTag, FiGithub, FiGlobe } from "react-icons/fi";
import PagesMetaHead from "../../components/PagesMetaHead";
import githubRepos from "../../scripts/github.json";

export default function ProjectSingle({ project }) {
  // State to handle the selected image for the modal popup
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="container mx-auto px-4 py-10">
      <PagesMetaHead title={project.title || project.project} />

      {/* Header Section */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-dark dark:text-primary-light mt-14 sm:mt-20 mb-4">
          {project.title || project.project}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
          <div className="flex items-center gap-2">
            <FiClock />
            <span>{new Date(project.date_created).toDateString()}</span>
          </div>
          {project.language && (
            <div className="flex items-center gap-2">
              <FiGlobe />
              <span>{project.language}</span>
            </div>
          )}
          {project.topics?.length > 0 && (
            <div className="flex items-center gap-2">
              <FiTag />
              <span>{project.topics.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Description Block */}
        {project.description && (
          <p className="text-base text-gray-700 dark:text-gray-300 mb-6">
            {project.description}
          </p>
        )}
      </div>

      {/* Repo + Website Buttons */}
      <div className="flex gap-4 mt-8">
        {project.repository_link && (
          <Link
            href={project.repository_link}
            target="_blank"
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow hover:opacity-80"
          >
            <FiGithub /> View Repository
          </Link>
        )}
        {project.website && (
          <Link
            href={project.website}
            target="_blank"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:opacity-80"
          >
            <FiGlobe /> Visit Website
          </Link>
        )}
      </div>

      {/* Gallery Section */}
      {project.images && project.images.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-primary-dark dark:text-primary-light mb-4">
            Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {project.images.map((imgSrc, index) => (
              <div
                key={index}
                className="cursor-pointer relative w-full aspect-square"
                onClick={() => setSelectedImage(imgSrc)}
              >
                <Image
                  src={imgSrc}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  objectFit="contain"
                  className="rounded-lg shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Popup for Gallery Images */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              alt="Popup image"
              width={800}
              height={600}
              className="rounded-lg"
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Server-side props
export async function getServerSideProps({ query }) {
  const { project } = query;

  if (typeof project !== "string") return { notFound: true };

  const foundProject = githubRepos.find((p) => p.project === project);
  if (!foundProject) return { notFound: true };

  return {
    props: {
      project: foundProject,
    },
  };
}
