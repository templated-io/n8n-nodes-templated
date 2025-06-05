import type { INodeProperties } from 'n8n-workflow';
import { showFor } from './utils';

const displayOpts = showFor(['templates']);

const displayFor = {
	resource: displayOpts(),
	retrieveTemplate: displayOpts(['retrieveTemplate']),
	listTemplates: displayOpts(['listTemplates']),
	listTemplateLayers: displayOpts(['listTemplateLayers']),
	listTemplateRenders: displayOpts(['listTemplateRenders']),
};

const templateOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	displayOptions: displayFor.resource.displayOptions,
	noDataExpression: true,
	default: 'retrieveTemplate',
	options: [
		{
			name: 'Retrieve a Template',
			value: 'retrieveTemplate',
			action: 'Retrieve a template',
			routing: {
				request: {
					method: 'GET',
					url: '=/v1/template/{{$parameter["templateId"]}}',
				},
			},
		},
		{
			name: 'List All Templates',
			value: 'listTemplates',
			action: 'List all templates',
			routing: {
				request: {
					method: 'GET',
					url: '/v1/templates',
				},
			},
		},
		{
			name: 'List Template Layers',
			value: 'listTemplateLayers',
			action: 'List template layers',
			routing: {
				request: {
					method: 'GET',
					url: '=/v1/template/{{$parameter["templateId"]}}/layers',
				},
			},
		},
		{
			name: 'List Template Renders',
			value: 'listTemplateRenders',
			action: 'List template renders',
			routing: {
				request: {
					method: 'GET',
					url: '=/v1/template/{{$parameter["templateId"]}}/renders',
				},
			},
		},
	],
};

const templateFields: INodeProperties[] = [
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		required: true,
		default: '',
		description: 'The template ID of the template that you want to use',
		displayOptions: displayFor.retrieveTemplate.displayOptions,
	},
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		required: true,
		default: '',
		description: 'The template ID of the template to retrieve layers for',
		displayOptions: displayFor.listTemplateLayers.displayOptions,
	},
	{
		displayName: 'Template ID',
		name: 'templateId',
		type: 'string',
		required: true,
		default: '',
		description: 'The template ID of the template to retrieve renders for',
		displayOptions: displayFor.listTemplateRenders.displayOptions,
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 0,
		description: 'The page of the results you would like to retrieve. The initial page is 0.',
		displayOptions: displayFor.listTemplateRenders.displayOptions,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: displayFor.listTemplateRenders.displayOptions,
	},
];

export { templateOperations, templateFields };
