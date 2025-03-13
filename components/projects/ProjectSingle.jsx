import { motion } from 'framer-motion';
import Link from 'next/link';

const ProjectSingle = ({ project, description, language, date_created, website, topics, repository_link }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, delay: 1 }}
            transition={{
                ease: 'easeInOut',
                duration: 0.7,
                delay: 0.15,
            }}
        >
            <Link href={repository_link} target="_blank" rel="noopener noreferrer">
                <div className="rounded-xl shadow-lg hover:shadow-xl cursor-pointer mb-10 sm:mb-0 bg-secondary-light dark:bg-ternary-dark">
                    <div className="text-center px-4 py-6">
                        {/* Title */}
                        <p className="font-general-medium text-xl md:text-2xl text-ternary-dark dark:text-ternary-light mb-2">
                            {project}
                        </p>

                        {/* Website (if available) */}
                        {website && (
                            <p className="text-sm text-blue-500 dark:text-blue-400 mb-2">
                                <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>
                            </p>
                        )}

                        {/* Topics */}
                        {topics.length > 0 && (
                            <p className="text-sm text-ternary-dark dark:text-ternary-light mb-2">
                                Topics: {topics.join(', ')}
                            </p>
                        )}

                        {/* Language & Date Created */}
                        <span className="text-lg text-ternary-dark dark:text-ternary-light">
                            {language || 'Unknown'} • {new Date(date_created).toDateString()}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProjectSingle;
