import type { INodeProperties } from 'n8n-workflow';

const templateFields: INodeProperties[] = [
	// ===========================================
	// CREATE TEMPLATE
	// ===========================================
	{
		displayName: 'Template Name',
		name: 'templateName',
		type: 'string',
		required: true,
		default: '',
		description: 'The name of the template',
		displayOptions: {
			show: {
				operation: ['createTemplate'],
			},
		},
	},
	{
		displayName: 'Width',
		name: 'width',
		type: 'number',
		required: true,
		default: 1200,
		description: 'The width of the template in pixels (max 5000)',
		typeOptions: {
			minValue: 1,
			maxValue: 5000,
		},
		displayOptions: {
			show: {
				operation: ['createTemplate'],
			},
		},
	},
	{
		displayName: 'Height',
		name: 'height',
		type: 'number',
		required: true,
		default: 630,
		description: 'The height of the template in pixels (max 5000)',
		typeOptions: {
			minValue: 1,
			maxValue: 5000,
		},
		displayOptions: {
			show: {
				operation: ['createTemplate'],
			},
		},
	},
	{
		displayName: 'Layers (JSON)',
		name: 'layersJson',
		type: 'json',
		required: true,
		default: '[\n  {\n    "layer": "text-1",\n    "type": "text",\n    "text": "Hello World",\n    "x": 100,\n    "y": 100,\n    "width": 400,\n    "height": 50\n  }\n]',
		description: 'JSON array of layer objects. Each layer must have "layer" (name), "type" (text/image/shape), and positioning properties (x, y, width, height).',
		displayOptions: {
			show: {
				operation: ['createTemplate'],
			},
		},
	},

	// ===========================================
	// UPDATE TEMPLATE
	// ===========================================
	{
		displayName: 'Template',
		name: 'templateId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The template to update',
		displayOptions: {
			show: {
				operation: ['updateTemplate'],
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
		displayName: 'Replace All Layers',
		name: 'replaceLayers',
		type: 'boolean',
		default: false,
		description: 'Whether to replace all layers. When true, layers not included in the request will be removed. When false (default), only specified layers are updated.',
		displayOptions: {
			show: {
				operation: ['updateTemplate'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: ['updateTemplate'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The new name for the template',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A description of the template',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				default: 0,
				description: 'The new width of the template in pixels (max 5000)',
				typeOptions: {
					minValue: 1,
					maxValue: 5000,
				},
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				default: 0,
				description: 'The new height of the template in pixels (max 5000)',
				typeOptions: {
					minValue: 1,
					maxValue: 5000,
				},
			},
			{
				displayName: 'Layers (JSON)',
				name: 'layers',
				type: 'json',
				default: '',
				description: 'JSON array of layer objects to update. Only include layers you want to modify or add.',
			},
			{
				displayName: 'Pages (JSON)',
				name: 'pages',
				type: 'json',
				default: '',
				description: 'For multi-page templates, JSON array of page objects containing layers to update',
			},
		],
	},

	// ===========================================
	// RETRIEVE TEMPLATE
	// ===========================================
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

	// ===========================================
	// LIST TEMPLATE LAYERS
	// ===========================================
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

	// ===========================================
	// LIST TEMPLATE PAGES
	// ===========================================
	{
		displayName: 'Template',
		name: 'templateId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The template to retrieve pages for',
		displayOptions: {
			show: {
				operation: ['listTemplatePages'],
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

	// ===========================================
	// LIST TEMPLATE RENDERS
	// ===========================================
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

	// ===========================================
	// CLONE TEMPLATE
	// ===========================================
	{
		displayName: 'Template',
		name: 'templateId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The template to clone',
		displayOptions: {
			show: {
				operation: ['cloneTemplate'],
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
];

export { templateFields };
