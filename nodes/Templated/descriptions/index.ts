import { renderFields } from './renderFields';
import { templateFields } from './templateFields';
import {
	renderPresend,
	templatePresend,
	mergeRendersPresend,
	createTemplatePresend,
	updateTemplatePresend,
} from '../GenericFunctions';
import type { INodeProperties, INodeRequestSend, PreSendAction } from 'n8n-workflow';

/**
 * Builds `routing.send` with `preSend` as a non-enumerable property.
 *
 * n8n 1.58 to 1.83 copy the description of every `usableAsTool` node with `structuredClone`,
 * which throws on functions, so an enumerable `preSend` stopped n8n from starting.
 * Non-enumerable keys are skipped by that copy, while n8n's RoutingNode still reads
 * `send.preSend` by plain property access on the original description.
 */
function sendWithPreSend(preSend: PreSendAction): INodeRequestSend {
	const send: INodeRequestSend = {};
	Object.defineProperty(send, 'preSend', { value: [preSend], enumerable: false });
	return send;
}

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
				send: sendWithPreSend(renderPresend),
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
				send: sendWithPreSend(mergeRendersPresend),
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
				send: sendWithPreSend(templatePresend),
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
				send: sendWithPreSend(createTemplatePresend),
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
				send: sendWithPreSend(templatePresend),
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
				send: sendWithPreSend(templatePresend),
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
				send: sendWithPreSend(templatePresend),
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
				send: sendWithPreSend(templatePresend),
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
				send: sendWithPreSend(updateTemplatePresend),
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
