"use client"

import { motion } from "framer-motion"
import { FiArrowDownCircle } from "react-icons/fi"
import useThemeSwitcher from "../../hooks/useThemeSwitcher"

function AppBanner() {
  const [activeTheme] = useThemeSwitcher()

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.9, delay: 0.2 }}
      className="flex flex-col items-center justify-center w-full px-4"
    >
      <div className="w-full md:w-3/4 lg:w-2/2 text-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.9,
            delay: 0.1,
          }}
          className="font-general-semibold text-4xl lg:text-5xl xl:text-6xl text-left text-ternary-dark dark:text-primary-light uppercase"
        >
          Hi, I am Philip!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.9,
            delay: 0.2,
          }}
          className="font-general-medium mt-6 text-xl md:text-2xl lg:text-3xl text-left leading-normal text-gray-500 dark:text-gray-200"
        >
          IT Consultant | Fullstack Developer | Software Engineer
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.9,
            delay: 0.3,
          }}
          className="flex justify-left"
        >
          <a
            download="resume.pdf"
            href="/files/resume.pdf"
            className="font-general-medium flex justify-center items-center w-48 mt-12 mb-6 text-lg border border-indigo-200 dark:border-ternary-dark py-3 shadow-lg rounded-lg bg-indigo-50 focus:ring-1 focus:ring-indigo-900 hover:bg-indigo-500 text-gray-500 hover:text-white duration-500"
            aria-label="Download Resume"
          >
            <FiArrowDownCircle className="mr-3 h-6 w-6 duration-100"></FiArrowDownCircle>
            <span className="text-lg duration-100">Download CV</span>
          </a>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default AppBanner

