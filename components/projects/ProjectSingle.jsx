import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

const ProjectSingle = ({ id, project, description, language, date_created, website, topics, repository_link }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, delay: 1 }}
            transition={{ ease: 'easeInOut', duration: 0.7, delay: 0.15 }}
            className="flex flex-col h-full"
        >
            {/* Main Box - Clickable to Project Details */}
            <Link href={`/projects/${project}`} passHref> 

            {/* TODO: NEED TO CHANGE THIS INTO A INTERCHANGEBLE VALUE LIKE /projects/${id} AND NEED TO INTERCHANGEABLE THE PAGES/PROJECTS/[id].jsx */}
                
                <div className="rounded-xl shadow-lg hover:shadow-xl cursor-pointer bg-secondary-light dark:bg-ternary-dark flex flex-col h-full min-h-[250px] p-5">
                    <div className="flex justify-between items-center">
                        {/* Project Title */}
                        <p className="font-general-medium text-lg md:text-xl text-ternary-dark dark:text-ternary-light">
                            {project}
                        </p>
                    </div>

                    {/* Language & Date Created */}
                    <span className="text-sm text-ternary-dark dark:text-ternary-light mt-auto">
                        {language || 'Unknown'} 
                    </span>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProjectSingle;
