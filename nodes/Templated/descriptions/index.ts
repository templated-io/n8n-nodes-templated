import { renderFields } from './renderFields';
import { templateFields } from './templateFields';
import {
	renderPresend,
	templatePresend,
	mergeRendersPresend,
	createTemplatePresend,
	updateTemplatePresend,
} from '../GenericFunctions';
import { INodeProperties } from 'n8n-workflow';

// Combined operations for better UX - no need for resource selection
const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'createRender',
	options: [
		// --- RENDER OPERATIONS ---
		{
			name: 'Create a Render',
			value: 'createRender',
			action: 'Create a render',
			description: 'Generate an image, video, or PDF from a template',
			routing: {
				send: { preSend: [renderPresend] },
				request: {
					method: 'POST',
					url: '/v1/render',
				},
			},
		},
		{
			name: 'Merge Renders',
			value: 'mergeRenders',
			action: 'Merge renders',
			description: 'Merge multiple renders into a single PDF',
			routing: {
				send: { preSend: [mergeRendersPresend] },
				request: {
					method: 'POST',
					url: '/v1/render/merge',
				},
			},
		},
		{
			name: 'Retrieve a Render',
			value: 'retrieveRender',
			action: 'Retrieve a render',
			description: 'Get details of a specific render',
			routing: {
				request: {
					method: 'GET',
					url: '=/v1/render/{{$parameter["renderId"]}}',
				},
			},
		},
		// --- TEMPLATE OPERATIONS ---
		{
			name: 'Clone a Template',
			value: 'cloneTemplate',
			action: 'Clone a template',
			description: 'Create a clone of an existing template (maintains link to source)',
			routing: {
				send: { preSend: [templatePresend] },
				request: {
					method: 'POST',
					url: '=/v1/template/{{$parameter["templateId"]}}/clone',
				},
			},
		},
		{
			name: 'Create a Template',
			value: 'createTemplate',
			action: 'Create a template',
			description: 'Create a new template programmatically with layers',
			routing: {
				send: { preSend: [createTemplatePresend] },
				request: {
					method: 'POST',
					url: '/v1/template',
				},
			},
		},
		{
			name: 'List All Templates',
			value: 'listTemplates',
			action: 'List all templates',
			description: 'Get a list of all templates in your account',
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
			description: 'Get all layers of a specific template',
			routing: {
				send: { preSend: [templatePresend] },
				request: {
					method: 'GET',
					url: '=/v1/template/{{$parameter["templateId"]}}/layers',
				},
			},
		},
		{
			name: 'List Template Pages',
			value: 'listTemplatePages',
			action: 'List template pages',
			description: 'Get all pages of a multi-page template',
			routing: {
				send: { preSend: [templatePresend] },
				request: {
					method: 'GET',
					url: '=/v1/template/{{$parameter["templateId"]}}/pages',
				},
			},
		},
		{
			name: 'List Template Renders',
			value: 'listTemplateRenders',
			action: 'List template renders',
			description: 'Get all renders created from a specific template',
			routing: {
				send: { preSend: [templatePresend] },
				request: {
					method: 'GET',
					url: '=/v1/template/{{$parameter["templateId"]}}/renders',
				},
			},
		},
		{
			name: 'Retrieve a Template',
			value: 'retrieveTemplate',
			action: 'Retrieve a template',
			description: 'Get details of a specific template',
			routing: {
				send: { preSend: [templatePresend] },
				request: {
					method: 'GET',
					url: '=/v1/template/{{$parameter["templateId"]}}',
				},
			},
		},
		{
			name: 'Update a Template',
			value: 'updateTemplate',
			action: 'Update a template',
			description: 'Update an existing template (layers, properties, or content)',
			routing: {
				send: { preSend: [updateTemplatePresend] },
				request: {
					method: 'PUT',
					url: '=/v1/template/{{$parameter["templateId"]}}',
				},
			},
		},
	],
};

export const allProperties: INodeProperties[] = [
	operations,
	...renderFields,
	...templateFields,
];
