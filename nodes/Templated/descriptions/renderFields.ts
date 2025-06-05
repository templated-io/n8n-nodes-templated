import type { INodeProperties } from 'n8n-workflow';
import { showFor } from './utils';
import { renderPresend } from '../GenericFunctions';

const displayOpts = showFor(['renders']);

const displayFor = {
	resource: displayOpts(),
	createRender: displayOpts(['create']),
	retrieveRender: displayOpts(['retrieveRender']),
};

const renderOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	displayOptions: displayFor.resource.displayOptions,
	noDataExpression: true,
	default: 'create',
	options: [
		{
			name: 'Create a Render',
			value: 'create',
			action: 'Create a render',
			routing: {
				send: { preSend: [renderPresend] },
				request: {
					method: 'POST',
					url: '/v1/render',
				}
			},
		},
		{
			name: 'Retrieve a Render',
			value: 'retrieveRender',
			action: 'Retrieve a render',
			routing: {
				request: {
					method: 'GET',
					url: '=/v1/render/{{$parameter["renderId"]}}',
				},
			},
		},
	],
};

const renderFields: INodeProperties[] = [
	{
		displayName: 'Template ID',
		name: 'template',
		type: 'string',
		required: true,
		default: '',
		description: 'The template ID that you want to use',
		displayOptions: displayFor.createRender.displayOptions,
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
						description: 'The name of the layer',
					},
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						default: '',
						description: 'Replacement text you want to use',
					},
					{
						displayName: 'Image URL',
						name: 'image_url',
						type: 'string',
						default: '',
						description: 'Replacement image src for an image layer',
					},
					{
						displayName: 'Color',
						name: 'color',
						type: 'color',
						default: '',
						description: 'Color in hex format e.g. “#FF0000”',
					},
					{
						displayName: 'Background',
						name: 'background',
						type: 'color',
						default: '',
						description: 'Background color in hex format e.g. “#FF0000”',
					},
					{
						displayName: 'Font Family',
						name: 'font_family',
						type: 'string',
						default: '',
						description: 'Change the font family',
					},
					{
						displayName: 'Font Size',
						name: 'font_size',
						type: 'string',
						default: '',
						description: 'Change the font size. Use a CSS value like (“24px” or “12pt”).',
					},
					{
						displayName: 'Border Width',
						name: 'border_width',
						type: 'number',
						default: 0,
						description: 'Width of the object border',
					},
					{
						displayName: 'Border Color',
						name: 'border_color',
						type: 'color',
						default: '',
						description: 'Border color in hex format e.g. “#FF0000”',
					},
					{
						displayName: 'Fill',
						name: 'fill',
						type: 'color',
						default: '',
						description: 'Shape fill color in hex format e.g. “#FF0000”',
					},
					{
						displayName: 'Stroke',
						name: 'stroke',
						type: 'color',
						default: '',
						description: 'Shape stroke (border) color in hex format e.g. “#FF0000”',
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
		displayOptions: displayFor.createRender.displayOptions,
	},
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		default: '',
		description: 'A URL to POST the full Render object to upon rendering completed',
		displayOptions: displayFor.createRender.displayOptions,
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
		displayOptions: displayFor.createRender.displayOptions,
	},
	{
		displayName: 'Transparent',
		name: 'transparent',
		type: 'boolean',
		default: false,
		description: 'Whether make the background transparent when the render format is png. Default is false.',
		displayOptions: displayFor.createRender.displayOptions,
	},
	{
		displayName: 'Render ID',
		name: 'renderId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the render to retrieve',
		displayOptions: displayFor.retrieveRender.displayOptions,
	},
];

export { renderOperations, renderFields };
