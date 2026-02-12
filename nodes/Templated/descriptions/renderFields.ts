/* eslint-disable n8n-nodes-base/node-param-fixed-collection-type-unsorted-items */
import type { INodeProperties } from 'n8n-workflow';

const renderFields: INodeProperties[] = [
	// ===========================================
	// CREATE RENDER - Main Fields
	// ===========================================
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
			{ name: 'MP4 (Video)', value: 'mp4' },
			{ name: 'PDF', value: 'pdf' },
			{ name: 'PNG', value: 'png' },
			{ name: 'WEBP', value: 'webp' },
		],
		default: 'jpg',
		description: 'Render format. Default is jpg.',
		displayOptions: {
			show: {
				operation: ['createRender'],
			},
		},
	},

	// ===========================================
	// VIDEO OPTIONS (shown when format is mp4)
	// ===========================================
	{
		displayName: 'Duration (Ms)',
		name: 'duration',
		type: 'number',
		default: 5000,
		description: 'Duration of the video in milliseconds. Maximum is 90000 (90 seconds). Default is 5000 (5 seconds).',
		displayOptions: {
			show: {
				operation: ['createRender'],
				format: ['mp4'],
			},
		},
	},
	{
		displayName: 'FPS',
		name: 'fps',
		type: 'number',
		default: 30,
		description: 'Frames per second for the video. Minimum is 1, maximum is 60. Default is 30.',
		typeOptions: {
			minValue: 1,
			maxValue: 60,
		},
		displayOptions: {
			show: {
				operation: ['createRender'],
				format: ['mp4'],
			},
		},
	},

	// ===========================================
	// PDF OPTIONS (shown when format is pdf)
	// ===========================================
	{
		displayName: 'Flatten PDF',
		name: 'flatten',
		type: 'boolean',
		default: false,
		description: 'Whether to flatten the PDF. Recommended for print-ready documents.',
		displayOptions: {
			show: {
				operation: ['createRender'],
				format: ['pdf'],
			},
		},
	},
	{
		displayName: 'CMYK Color Mode',
		name: 'cmyk',
		type: 'boolean',
		default: false,
		description: 'Whether to use CMYK color mode. Recommended for print-ready documents.',
		displayOptions: {
			show: {
				operation: ['createRender'],
				format: ['pdf'],
			},
		},
	},

	// ===========================================
	// PNG OPTIONS (shown when format is png)
	// ===========================================
	{
		displayName: 'Transparent Background',
		name: 'transparent',
		type: 'boolean',
		default: false,
		description: 'Whether to make the background transparent. Only works with PNG format.',
		displayOptions: {
			show: {
				operation: ['createRender'],
				format: ['png'],
			},
		},
	},

	// ===========================================
	// LAYERS MODE SELECTOR
	// ===========================================
	{
		displayName: 'Layers Input Mode',
		name: 'layersMode',
		type: 'options',
		options: [
			{
				name: 'Simple (Form)',
				value: 'simple',
				description: 'Use form fields to modify layers - layer names loaded from template',
			},
			{
				name: 'Advanced (JSON)',
				value: 'json',
				description: 'Input layers as JSON object - for power users',
			},
		],
		default: 'simple',
		description: 'Choose how to specify layer modifications',
		displayOptions: {
			show: {
				operation: ['createRender'],
			},
		},
	},

	// ===========================================
	// LAYERS - SIMPLE MODE (Form with dropdown)
	// ===========================================
	{
		displayName: 'Layers',
		name: 'layers',
		type: 'fixedCollection',
		placeholder: 'Add Layer',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		options: [
			{
				displayName: 'Layer',
				name: 'layer',
				values: [
					{
						displayName: 'Layer Name or ID',
						name: 'layerName',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'loadTemplateLayers',
							loadOptionsDependsOn: ['template'],
						},
						default: '',
						required: true,
						noDataExpression: true,
						description: 'Select the layer to modify. List is loaded from your selected template. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Text',
						name: 'text',
						type: 'string',
						default: '',
						description: 'Replacement text for a text layer. For QR/Barcode layers, this is the encoded value.',
					},
					{
						displayName: 'Image URL',
						name: 'image_url',
						type: 'string',
						default: '',
						description: 'Replacement image URL for an image layer',
					},
					{
						displayName: 'Video URL',
						name: 'video_url',
						type: 'string',
						default: '',
						description: 'Replacement video URL for a video layer',
					},
					{
						displayName: 'Color',
						name: 'color',
						type: 'color',
						default: '',
						description: 'Text or shape color in hex format (e.g. "#FF0000")',
					},
					{
						displayName: 'Background',
						name: 'background',
						type: 'color',
						default: '',
						description: 'Background color in hex format',
					},
					{
						displayName: 'Fill',
						name: 'fill',
						type: 'string',
						default: '',
						description: 'Fill color for shapes. Supports hex or CSS gradients.',
					},
					{
						displayName: 'Hide',
						name: 'hide',
						type: 'boolean',
						default: false,
						description: 'Whether to hide the layer',
					},
					{
						displayName: 'Additional Properties',
						name: 'additionalProperties',
						type: 'collection',
						placeholder: 'Add Property',
						default: {},
						description: 'Add more properties like typography, positioning, borders, etc',
						options: [
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
								description: 'Font size (e.g. "24px" or "12pt")',
							},
							{
								displayName: 'Font Weight',
								name: 'font_weight',
								type: 'options',
								options: [
									{ name: '100', value: '100' },
									{ name: '200', value: '200' },
									{ name: '300', value: '300' },
									{ name: '400', value: '400' },
									{ name: '500', value: '500' },
									{ name: '600', value: '600' },
									{ name: '700', value: '700' },
									{ name: '800', value: '800' },
									{ name: '900', value: '900' },
									{ name: 'Bold', value: 'bold' },
									{ name: 'Normal', value: 'normal' },
								],
								default: 'normal',
							},
							{
								displayName: 'Letter Spacing',
								name: 'letter_spacing',
								type: 'string',
								default: '',
								description: 'Letter spacing (e.g. "2.5px")',
							},
							{
								displayName: 'Line Height',
								name: 'line_height',
								type: 'string',
								default: '',
								description: 'Line height (e.g. "1.5" or "24px")',
							},
							{
								displayName: 'Horizontal Align',
								name: 'horizontal_align',
								type: 'options',
								options: [
									{ name: 'Center', value: 'center' },
									{ name: 'Left', value: 'left' },
									{ name: 'Right', value: 'right' },
								],
								default: 'left',
								description: 'Horizontal text alignment',
							},
							{
								displayName: 'Vertical Align',
								name: 'vertical_align',
								type: 'options',
								options: [
									{ name: 'Bottom', value: 'bottom' },
									{ name: 'Center', value: 'center' },
									{ name: 'Top', value: 'top' },
								],
								default: 'top',
								description: 'Vertical text alignment',
							},
							{
								displayName: 'Secondary Color',
								name: 'color_2',
								type: 'color',
								default: '',
								description: 'Secondary color for text surrounded by *',
							},
							{
								displayName: 'Text Stroke Width',
								name: 'text_stroke_width',
								type: 'number',
								default: '',
								description: 'Text outline width in pixels',
							},
							{
								displayName: 'Text Stroke Color',
								name: 'text_stroke_color',
								type: 'color',
								default: '',
								description: 'Text outline color',
							},
							{
								displayName: 'Stroke',
								name: 'stroke',
								type: 'color',
								default: '',
								description: 'Stroke color for shapes',
							},
							{
								displayName: 'Border Width',
								name: 'border_width',
								type: 'number',
								default: '',
								description: 'Border width in pixels',
							},
							{
								displayName: 'Border Color',
								name: 'border_color',
								type: 'color',
								default: '',
							},
							{
								displayName: 'Border Radius',
								name: 'border_radius',
								type: 'string',
								default: '',
								description: 'Border radius (e.g. "10px" or "10%")',
							},
							{
								displayName: 'X Position',
								name: 'x',
								type: 'number',
								default: '',
								description: 'Horizontal position in pixels',
							},
							{
								displayName: 'Y Position',
								name: 'y',
								type: 'number',
								default: '',
								description: 'Vertical position in pixels',
							},
							{
								displayName: 'Width',
								name: 'width',
								type: 'number',
								default: '',
								description: 'Layer width in pixels',
							},
							{
								displayName: 'Height',
								name: 'height',
								type: 'number',
								default: '',
								description: 'Layer height in pixels',
							},
							{
								displayName: 'Rotation',
								name: 'rotation',
								type: 'number',
								default: '',
								description: 'Rotation in degrees',
							},
							{
								displayName: 'Opacity',
								name: 'opacity',
								type: 'number',
								default: '',
								description: 'Opacity (0-1)',
								typeOptions: {
									minValue: 0,
									maxValue: 1,
									numberStepSize: 0.1,
								},
							},
							{
								displayName: 'Object Fit',
								name: 'object_fit',
								type: 'options',
								options: [
									{ name: 'Contain', value: 'contain' },
									{ name: 'Cover', value: 'cover' },
									{ name: 'Fill', value: 'fill' },
									{ name: 'None', value: 'none' },
								],
								default: 'cover',
								description: 'How the image fits within its container',
							},
							{
								displayName: 'Filter',
								name: 'filter',
								type: 'string',
								default: '',
								description: 'CSS filter (e.g. "blur(4px) grayscale(50%)")',
							},
							{
								displayName: 'Link (PDF Only)',
								name: 'link',
								type: 'string',
								default: '',
								description: 'Clickable link URL',
							},
							{
								displayName: 'Barcode Format',
								name: 'barcode_format',
								type: 'options',
								options: [
									{ name: 'CODE128', value: 'CODE128' },
									{ name: 'CODE39', value: 'CODE39' },
									{ name: 'EAN13', value: 'EAN13' },
									{ name: 'EAN8', value: 'EAN8' },
									{ name: 'ITF14', value: 'ITF14' },
									{ name: 'UPC', value: 'UPC' },
								],
								default: 'CODE128',
							},
							{
								displayName: 'Rating',
								name: 'rating',
								type: 'number',
								default: '',
								description: 'Star rating value (0-5)',
								typeOptions: {
									minValue: 0,
									maxValue: 5,
									numberStepSize: 0.5,
								},
							},
							{
								displayName: 'HTML',
								name: 'html',
								type: 'string',
								default: '',
								description: 'Custom HTML content',
							},
						],
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: ['createRender'],
				layersMode: ['simple'],
			},
		},
	},

	// ===========================================
	// LAYERS - ADVANCED MODE (JSON)
	// ===========================================
	{
		displayName: 'Layers (JSON)',
		name: 'layersJson',
		type: 'json',
		default: '{}',
		description: 'JSON object with layer modifications. Keys are layer names, values are objects with properties to modify. Example: {"title": {"text": "Hello"}, "photo": {"image_url": "https://..."}}.',
		displayOptions: {
			show: {
				operation: ['createRender'],
				layersMode: ['json'],
			},
		},
	},

	// ===========================================
	// ADDITIONAL OPTIONS
	// ===========================================
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['createRender'],
			},
		},
		options: [
			{
				displayName: 'Render Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'A custom name for the render',
			},
			{
				displayName: 'Background Color',
				name: 'background',
				type: 'color',
				default: '',
				description: 'Override the template background color',
			},
			{
				displayName: 'Custom Width',
				name: 'width',
				type: 'number',
				default: '',
				description: 'Custom width for the render in pixels (100-5000)',
				typeOptions: {
					minValue: 100,
					maxValue: 5000,
				},
			},
			{
				displayName: 'Custom Height',
				name: 'height',
				type: 'number',
				default: '',
				description: 'Custom height for the render in pixels (100-5000)',
				typeOptions: {
					minValue: 100,
					maxValue: 5000,
				},
			},
			{
				displayName: 'Scale',
				name: 'scale',
				type: 'number',
				default: 1,
				description: 'Scale factor (0.1 to 3.0). Example: 0.5 renders at 50% size, 2 renders at 200% size.',
				typeOptions: {
					minValue: 0.1,
					maxValue: 3.0,
					numberStepSize: 0.1,
				},
			},
			{
				displayName: 'Async',
				name: 'async',
				type: 'boolean',
				default: false,
				description: 'Whether to create the render asynchronously. Use with webhook_url.',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhook_url',
				type: 'string',
				default: '',
				description: 'URL to POST the Render object to when completed',
			},
			{
				displayName: 'Merge Pages',
				name: 'merge',
				type: 'boolean',
				default: false,
				description: 'Whether to merge all pages into a single PDF',
			},
		],
	},

	// ===========================================
	// MULTI-PAGE SUPPORT
	// ===========================================
	{
		displayName: 'Multi-Page Content',
		name: 'pages',
		type: 'fixedCollection',
		placeholder: 'Add Page Content',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		description: 'Different layer modifications per page. When using this, the main Layers parameter is ignored.',
		displayOptions: {
			show: {
				operation: ['createRender'],
			},
		},
		options: [
			{
				displayName: 'Page',
				name: 'page',
				values: [
					{
						displayName: 'Page ID',
						name: 'pageId',
						type: 'string',
						default: '',
						required: true,
						description: 'Page identifier (e.g. "page-1", "page-2")',
					},
					{
						displayName: 'Layers JSON',
						name: 'layersJson',
						type: 'json',
						default: '{}',
						description: 'JSON object with layer modifications for this page',
					},
				],
			},
		],
	},

	// ===========================================
	// RETRIEVE RENDER
	// ===========================================
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

	// ===========================================
	// MERGE RENDERS
	// ===========================================
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
		description: 'Whether to host the merged PDF and return a URL (true) or return the file directly (false)',
		displayOptions: {
			show: {
				operation: ['mergeRenders'],
			},
		},
	},
];

export { renderFields };
