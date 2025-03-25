import { useState } from 'react';
import { stackData } from '../../data/mainStackData';
import { stackHeading } from '../../data/mainStackData';
import AboutMainStackSingle from './AboutMainStackSingle';

function AboutMainStack() {
	const [clients, setClients] = useState(stackData);
	return (
		<div className="mt-10 sm:mt-20">
			<p className="font-general-medium text-2xl sm:text-3xl  text-center text-primary-dark dark:text-primary-light">
				{stackHeading}
			</p>
			<div className="grid grid-cols-2 sm:grid-cols-4 mt-10 sm:mt-14 gap-2">
				{clients.map((client) => (
					<AboutMainStackSingle
						title={client.title}
						image={client.img}
						key={client.id}
					/>
				))}
			</div>
		</div>
	);
}

export default AboutMainStack;
