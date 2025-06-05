import type { INodeProperties } from 'n8n-workflow';

export const resources: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	default: 'renders',
	placeholder: 'Resource',
	options: [
		{
			name: 'Render',
			value: 'renders',
		},
		{
			name: 'Template',
			value: 'templates',
		}
	],
};
