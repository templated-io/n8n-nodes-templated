import { renderFields } from './renderFields';
import { templateFields } from './templateFields';
import { renderPresend, templatePresend, mergeRendersPresend } from '../GenericFunctions';
import { INodeProperties } from 'n8n-workflow';

// Combined operations for better UX - no need for resource selection
const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'createRender',
	options: [
		{
			name: 'Create a Render',
			value: 'createRender',
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
		{
			name: 'Retrieve a Template',
			value: 'retrieveTemplate',
			action: 'Retrieve a template',
			routing: {
				send: { preSend: [templatePresend] },
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
				send: { preSend: [templatePresend] },
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
				send: { preSend: [templatePresend] },
				request: {
					method: 'GET',
					url: '=/v1/template/{{$parameter["templateId"]}}/renders',
				},
			},
		},
		{
			name: 'Merge Renders',
			value: 'mergeRenders',
			action: 'Merge renders',
			routing: {
				send: { preSend: [mergeRendersPresend] },
				request: {
					method: 'POST',
					url: '/v1/render/merge',
				},
			},
		}
	],
};

export const allProperties: INodeProperties[] = [
	operations,
	...renderFields,
	...templateFields,
];
