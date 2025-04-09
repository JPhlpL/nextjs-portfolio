// data/accomplishmentsData.js
import { MdWork, MdSchool, MdStar } from "react-icons/md";

const accomplishmentsData = [
  {
    date: "2019",
    cardTitle: "Internet-of-Things: Monitoring and Controlling Electrical Appliances",
    image:
      "https://jphlpl-portfolio-bucket.s3.ap-southeast-1.amazonaws.com/accomplishments/Thesis2.jpg",
    cardDetailedText:
      "Our final capstone project that promotes an efficient and remote way of managing electrical appliances.",
    icon: MdWork,
    iconStyle: { background: "rgb(59, 130, 246)", color: "#fff" }, // Tailwind blue-500
    contentStyle: {
      background: "#f3f4f6", // Tailwind gray-100
      color: "#1f2937"       // Tailwind gray-800
    },
    contentArrowStyle: { borderRight: "7px solid #f3f4f6" }
  },
  {
    date: "2018",
    cardTitle: "Safety Driving Quiz Game App",
    image:
      "https://jphlpl-portfolio-bucket.s3.ap-southeast-1.amazonaws.com/accomplishments/Thesis1.jpg",
    cardDetailedText:
      "Our capstone project in Software Engineering Subject that I solely developed using Unity Engine C# with some Blender Assets.",
    icon: MdSchool,
    iconStyle: { background: "rgb(236, 72, 153)", color: "#fff" }, // Tailwind pink-500
    contentStyle: {
      background: "#f3f4f6", // Tailwind gray-100
      color: "#1f2937"       // Tailwind gray-800
    },
    contentArrowStyle: { borderRight: "7px solid #fef3c7" }
  },
  {
    date: "2017",
    cardTitle: "Special Recognition",
    image: "https://example.com/your-image.jpg",
    cardDetailedText: "Special recognition for outstanding contribution.",
    icon: MdStar,
    iconStyle: { background: "rgb(34, 197, 94)", color: "#fff" }, // Tailwind green-500
    contentStyle: {
      background: "#f3f4f6", // Tailwind gray-100
      color: "#1f2937"       // Tailwind gray-800
    },
    contentArrowStyle: { borderRight: "7px solid #e0f2fe" }
  }
];

export default accomplishmentsData;
