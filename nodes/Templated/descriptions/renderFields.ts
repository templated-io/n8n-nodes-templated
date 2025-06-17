/* eslint-disable n8n-nodes-base/node-param-fixed-collection-type-unsorted-items */
import type { INodeProperties } from 'n8n-workflow';

const renderFields: INodeProperties[] = [
	{
		displayName: 'Template',
		name: 'template',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		description: 'The template to use for rendering',
		displayOptions: {
			show: {
				operation: ['createRender'],
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
		displayName: 'Format',
		name: 'format',
		type: 'options',
		options: [
			{ name: 'JPG', value: 'jpg' },
			{ name: 'PNG', value: 'png' },
			{ name: 'WEBP', value: 'webp' },
			{ name: 'PDF', value: 'pdf' },
		],
		default: 'jpg',
		description: 'Render format (jpg, png, webp, or pdf). Default is jpg.',
		displayOptions: {
			show: {
				operation: ['createRender'],
			},
		},
	},
	{
		displayName: 'Layers',
		name: 'layers',
		type: 'fixedCollection',
		placeholder: 'Add Layer',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		required: true,
		options: [
			{
				displayName: 'Layer',
				name: 'layer',
				values: [
					{
						displayName: 'Layer Name',
						name: 'layerName',
						type: 'string',
						default: '',
						description: 'The name of the layer. This is used to reference the layer in the template.',
					},
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						default: '',
						description: 'Replacement text for a text layer',
					},
					{
						displayName: 'Image URL',
						name: 'image_url',
						type: 'string',
						default: '',
						description: 'Replacement image for an image layer',
					},
					{
						displayName: 'Color',
						name: 'color',
						type: 'color',
						default: '',
						description: 'Text color in hex format e.g.	"#FF0000"',
					},
					{
						displayName: 'Background',
						name: 'background',
						type: 'color',
						default: '',
						description: 'Background color in hex format e.g.	"#FF0000"',
					},
					{
						displayName: 'Border Color',
						name: 'border_color',
						type: 'color',
						default: '',
						description: 'Border color in hex format e.g.	"#FF0000"',
					},
					{
						displayName: 'Border Width',
						name: 'border_width',
						type: 'number',
						default: 0,
						description: 'Width of the object border',
					},
					{
						displayName: 'Font Family',
						name: 'font_family',
						type: 'string',
						default: '',
						description: 'Change the font family',
					},
					{
						displayName: 'Fill',
						name: 'fill',
						type: 'color',
						default: '',
						description: 'Shape fill color in hex format e.g.	"#FF0000"',
					},
					{
						displayName: 'Stroke',
						name: 'stroke',
						type: 'color',
						default: '',
						description: 'Shape stroke (border) color in hex format e.g.	"#FF0000"',
					},
					{
						displayName: 'Hide',
						name: 'hide',
						type: 'boolean',
						default: false,
						description: 'Whether set to true to hide the layer',
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: ['createRender'],
			},
		},
	},
	{
		displayName: 'Transparent Background',
		name: 'transparent',
		type: 'boolean',
		default: false,
		description: 'Whether make the background transparent when the render format is png. Default is false.',
		displayOptions: {
			show: {
				operation: ['createRender'],
			},
		},
	},
	{
		displayName: 'Render ID',
		name: 'renderId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the render to retrieve',
		displayOptions: {
			show: {
				operation: ['retrieveRender'],
			},
		},
	},
	{
		displayName: 'Renders',
		name: 'renders',
		type: 'fixedCollection',
		placeholder: 'Add Render',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		required: true,
		options: [
			{
				displayName: 'Render',
				name: 'render',
				values: [
					{
						displayName: 'Render ID',
						name: 'renderId',
						type: 'string',
						default: '',
						placeholder: 'e.g. 94600fbf-8b9c-452e-a920-e3fbe4607d22',
						description: 'The ID of the render to merge',
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: ['mergeRenders'],
			},
		},
	},
	{
		displayName: 'Host File',
		name: 'host',
		type: 'boolean',
		default: true,
		description: 'Whether to host the merged PDF file and return a URL (true) or return the PDF file directly (false)',
		displayOptions: {
			show: {
				operation: ['mergeRenders'],
			},
		},
	},
];

export { renderFields };
