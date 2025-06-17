import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import {allProperties} from './descriptions';
import { loadTemplates } from './GenericFunctions';

export class Templated implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Templated',
		name: 'templated',
		icon: 'file:templated.svg',
		group: ['transform'],
		version: 1,
		subtitle: `={{
			{
				'createRender': 'Create a Render',
				'retrieveRender': 'Retrieve a Render',
				'retrieveTemplate': 'Retrieve a Template',
				'listTemplates': 'List All Templates',
				'listTemplateLayers': 'List Template Layers',
				'listTemplateRenders': 'List Template Renders',
				'mergeRenders': 'Merge Renders'
			}[$parameter["operation"]] || $parameter["operation"]
		}}`,
		description: 'Automate the generation of images and PDFs with Templated (https://templated.io).',
		defaults: {
			name: 'Templated',
		},
		inputs: ['main'],
		outputs: ['main'],
		// @ts-ignore - usableAsTool is available in newer n8n versions for AI tool integration
		usableAsTool: true,
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
			},
		},
		properties: allProperties,
	};

	methods = {
		loadOptions: {
			// Keep this for any future dropdown options
		},
		listSearch: {
			loadTemplates,
		},
	};
}
