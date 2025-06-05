import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TemplatedApi implements ICredentialType {
	name = 'templatedApi';
	displayName = 'Templated API';
	documentationUrl = 'https://templated.io/docs';
	properties: INodeProperties[] = [
			{
					displayName: 'Base URL',
					name: 'baseUrl',
					type: 'string',
					default: 'https://api.templated.io',
					description: 'Base URL for the Templated API',
			},
			{
					displayName: 'API Key',
					name: 'apiKey',
					type: 'string',
					typeOptions: {
							password: true,
					},
					default: '',
					description: 'Your API key for authenticating with the Templated API',
			},
	];

	authenticate: IAuthenticateGeneric = {
			type: 'generic',
			properties: {
					headers: {
						Authorization: '={{"Bearer " + $credentials.apiKey}}',
					},
			},
	};

	test: ICredentialTestRequest = {
			request: {
					method: 'GET',
					baseURL: '={{ $credentials.baseUrl }}',
					url: '/v1/templates',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
			},
	};
}
