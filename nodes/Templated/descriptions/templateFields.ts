import type { INodeProperties } from 'n8n-workflow';

const templateFields: INodeProperties[] = [
	{
		displayName: 'Template',
		name: 'templateId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The template to retrieve',
		displayOptions: {
			show: {
				operation: ['retrieveTemplate'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a template...',
				typeOptions: {
					searchListMethod: 'loadTemplates',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 6c32c8c8-f9d0-4e2f-8b5a-3f1a8d9c5b2e',
			},
		],
	},
	{
		displayName: 'Template',
		name: 'templateId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The template to retrieve layers for',
		displayOptions: {
			show: {
				operation: ['listTemplateLayers'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a template...',
				typeOptions: {
					searchListMethod: 'loadTemplates',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 6c32c8c8-f9d0-4e2f-8b5a-3f1a8d9c5b2e',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
							errorMessage: 'Not a valid template ID',
						},
					},
				],
			},
		],
	},
	{
		displayName: 'Template',
		name: 'templateId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The template to retrieve renders for',
		displayOptions: {
			show: {
				operation: ['listTemplateRenders'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a template...',
				typeOptions: {
					searchListMethod: 'loadTemplates',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 6c32c8c8-f9d0-4e2f-8b5a-3f1a8d9c5b2e',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}',
							errorMessage: 'Not a valid template ID',
						},
					},
				],
			},
		],
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 0,
		description: 'The page of the results you would like to retrieve. The initial page is 0.',
		displayOptions: {
			show: {
				operation: ['listTemplateRenders'],
			},
		},
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
		displayOptions: {
			show: {
				operation: ['listTemplateRenders'],
			},
		},
	},
];

export { templateFields };
