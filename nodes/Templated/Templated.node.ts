import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import {allProperties} from './descriptions';

export class Templated implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Templated',
		name: 'templated',
		icon: 'file:templated.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'n8n node to automate the generation of images and PDFs.',
		defaults: {
			name: 'Templated',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'templatedApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{ $credentials.baseUrl }}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: '={{"Bearer " + $credentials.apiKey}}',
			},
		},
		properties: allProperties,
	};
}
