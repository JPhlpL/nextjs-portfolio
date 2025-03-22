import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiTag, FiGithub, FiGlobe } from 'react-icons/fi';
import PagesMetaHead from '../../components/PagesMetaHead';
import githubRepos from '../../scripts/github_repos.json';

export default function ProjectSingle({ project }) {
	return (
		<div className="container mx-auto px-4 py-10">
			<PagesMetaHead title={project.title || project.project} />

			{/* Header */}
			<div>
				<h1 className="text-3xl sm:text-4xl font-bold text-primary-dark dark:text-primary-light mt-14 sm:mt-20 mb-7">
					{project.title || project.project}
				</h1>
				<div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-300 mb-6">
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
							<span>{project.topics.join(', ')}</span>
						</div>
					)}
				</div>
			</div>

			{/* Gallery */}
			{project.project_images?.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-10 mt-12">
					{project.project_images.map((img, idx) => (
						<div className="mb-10 sm:mb-0" key={idx}>
							<Image
								src={img}
								alt={project.title || project.project}
								className="rounded-xl shadow-lg"
								layout="responsive"
								width={100}
								height={90}
							/>
						</div>
					))}
				</div>
			)}

			{/* Project Info Section */}
			<div className="block sm:flex gap-10 mt-14">
				{/* Left Info Column */}
				<div className="w-full sm:w-1/3 text-left">
					{/* Client Info */}
					{project.client_info && (
						<div className="mb-7">
							<p className="text-2xl font-semibold text-secondary-dark dark:text-secondary-light mb-2">
								Client Info
							</p>
							<ul className="leading-loose">
								{project.client_info.map((info) => (
									<li key={info.id} className="text-ternary-dark dark:text-ternary-light">
										<span>{info.title}: </span>
										{['Website', 'Phone'].includes(info.title) ? (
											<a
												href={info.details}
												className="hover:underline hover:text-indigo-500 dark:hover:text-indigo-400 duration-300"
												target="_blank"
												rel="noopener noreferrer"
											>
												{info.details}
											</a>
										) : (
											<span>{info.details}</span>
										)}
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Objectives */}
					{project.objectives_heading && (
						<div className="mb-7">
							<p className="text-2xl font-semibold text-ternary-dark dark:text-ternary-light mb-2">
								{project.objectives_heading}
							</p>
							<p className="text-primary-dark dark:text-ternary-light">{project.objectives_details}</p>
						</div>
					)}

					{/* Technologies */}
					{project.technologies && project.technologies.length > 0 && (
						<div className="mb-7">
							<p className="text-2xl font-semibold text-ternary-dark dark:text-ternary-light mb-2">
								{project.technologies[0].title}
							</p>
							<p className="text-primary-dark dark:text-ternary-light">
								{project.technologies[0].techs.join(', ')}
							</p>
						</div>
					)}
				</div>

				{/* Right Content */}
				<div className="w-full sm:w-2/3 mt-10 sm:mt-0">
					{project.project_details_heading && (
						<>
							<p className="text-2xl font-bold text-primary-dark dark:text-primary-light mb-7">
								{project.project_details_heading}
							</p>
							{project.project_details?.map((detail) => (
								<p
									key={detail.id}
									className="text-lg text-ternary-dark dark:text-ternary-light mb-5"
								>
									{detail.details}
								</p>
							))}
						</>
					)}
				</div>
			</div>

			{/* Repo + Website Buttons */}
			<div className="flex gap-4 mt-12">
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
		</div>
	);
}

// Server-side props
export async function getServerSideProps({ query }) {
	const { project } = query;

	if (typeof project !== 'string') return { notFound: true };

	const foundProject = githubRepos.find((p) => p.project === project);
	if (!foundProject) return { notFound: true };

	return {
		props: {
			project: foundProject,
		},
	};
}
