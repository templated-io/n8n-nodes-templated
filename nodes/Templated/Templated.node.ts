import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import {allProperties} from './descriptions';
import { loadTemplates, loadTemplateLayers } from './GenericFunctions';

export class Templated implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Templated',
		name: 'templated',
		icon: 'file:templated.png',
		group: ['transform'],
		version: 1,
		subtitle: `={{
			{
				'createRender': 'Create a Render',
				'retrieveRender': 'Retrieve a Render',
				'mergeRenders': 'Merge Renders',
				'createTemplate': 'Create a Template',
				'updateTemplate': 'Update a Template',
				'retrieveTemplate': 'Retrieve a Template',
				'cloneTemplate': 'Clone a Template',
				'listTemplates': 'List All Templates',
				'listTemplateLayers': 'List Template Layers',
				'listTemplatePages': 'List Template Pages',
				'listTemplateRenders': 'List Template Renders'
			}[$parameter["operation"]] || $parameter["operation"]
		}}`,
		description: 'Automate the generation of images, videos, and PDFs with Templated (https://templated.io).',
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
			loadTemplateLayers,
		},
		listSearch: {
			loadTemplates,
		},
	};
}
