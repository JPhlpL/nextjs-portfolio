import { v4 as uuidv4 } from 'uuid';

// Import images
import AWSImage from '../public/images/stacks/aws.png';
import FastApiImage from '../public/images/stacks/fastapi.png';
import JavaImage from '../public/images/stacks/java.png';
import LaravelImage from '../public/images/stacks/laravel.png';
import ModalImage from '../public/images/stacks/modal.png';
import MySQLImage from '../public/images/stacks/mysql.png';
import NextJSImage from '../public/images/stacks/nextjs.png';
import PostgreSQLImage from '../public/images/stacks/postgresql.png';
import PythonImage from '../public/images/stacks/python.png';
import SupabaseImage from '../public/images/stacks/supabase.png';
import VercelImage from '../public/images/stacks/vercel.png';
import TypescriptImage from '../public/images/stacks/typescript.png';
import DockerImage from '../public/images/stacks/docker.png';
import NginxImage from '../public/images/stacks/nginx.png';
import GithubImage from '../public/images/stacks/github.png';
import AzureImage from '../public/images/stacks/azure.png';

export const stackHeading = 'Current Stack';

export const stackData = [
	{
		id: uuidv4(),
		title: 'FastAPI',
		img: FastApiImage,
	},
	{
		id: uuidv4(),
		title: 'Laravel',
		img: LaravelImage,
	},
	{
		id: uuidv4(),
		title: 'NextJS',
		img: NextJSImage,
	},
	{
		id: uuidv4(),
		title: 'Java',
		img: JavaImage,
	},
	{
		id: uuidv4(),
		title: 'Python',
		img: PythonImage,
	},
	{
		id: uuidv4(),
		title: 'Typescript',
		img: TypescriptImage,
	},
	{
		id: uuidv4(),
		title: 'MySQL',
		img: MySQLImage,
	},
	{
		id: uuidv4(),
		title: 'PostgreSQL',
		img: PostgreSQLImage,
	},
	{
		id: uuidv4(),
		title: 'Supabase',
		img: SupabaseImage,
	},
	{
		id: uuidv4(),
		title: 'AWS',
		img: AWSImage,
	},
	{
		id: uuidv4(),
		title: 'Azure',
		img: AzureImage,
	},
	{
		id: uuidv4(),
		title: 'Modal',
		img: ModalImage,
	},
	{
		id: uuidv4(),
		title: 'Vercel',
		img: VercelImage,
	},
	{
		id: uuidv4(),
		title: 'Docker',
		img: DockerImage,
	},
	{
		id: uuidv4(),
		title: 'Github',
		img: GithubImage,
	},
	{
		id: uuidv4(),
		title: 'Nginx',
		img: NginxImage,
	},
];
