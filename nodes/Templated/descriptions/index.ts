import { resources } from './resources';
import { renderFields, renderOperations } from './renderFields';
import { templateFields, templateOperations } from './templateFields';
import { INodeProperties } from 'n8n-workflow';

export const allProperties: INodeProperties[] = [
	resources,
	renderOperations,
	...renderFields,
	templateOperations,
	...templateFields,
];
