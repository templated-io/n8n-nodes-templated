import type { IExecuteSingleFunctions, IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';

const addOptName = 'additionalOptions';

const getAllParams = (execFns: IExecuteSingleFunctions): Record<string, unknown> => {
	const params = execFns.getNode().parameters;
	const keys = Object.keys(params);
	const paramsWithValues = keys
		.filter((i) => i !== addOptName)
		.map((name) => [name, execFns.getNodeParameter(name)]);

	const paramsWithValuesObj = Object.fromEntries(paramsWithValues);

	if (keys.includes(addOptName)) {
		const additionalOptions = execFns.getNodeParameter(addOptName);
		return Object.assign(paramsWithValuesObj, additionalOptions);
	}

	return paramsWithValuesObj;
};

const formatParams = (
	obj: Record<string, unknown>,
	filters?: { [paramName: string]: (value: any) => boolean },
	mappers?: { [paramName: string]: (value: any) => any },
) => {
	return Object.fromEntries(
		Object.entries(obj)
			.filter(([name, value]) => !filters || (name in filters ? filters[name](value) : false))
			.map(([name, value]) =>
				!mappers || !(name in mappers) ? [name, value] : [name, mappers[name](value)],
			),
	);
};

const idFn = (i: any) => i;

interface Layer {
	layerName: string;
	[key: string]: any; // Allow additional properties
}

const transformLayers = (opts: IHttpRequestOptions): IHttpRequestOptions => {
	if (opts.body && typeof opts.body === 'object') {
			const layers = (opts.body as any).layers;

			if (typeof layers === 'object' && Array.isArray(layers.layer)) {
					(opts.body as any).layers = layers.layer.reduce((acc: Record<string, any>, layer: Layer) => {
							if (layer.layerName) {
									// Create a new layer object excluding empty or false properties
									const cleanedLayer = Object.entries(layer).reduce((cleaned: Record<string, any>, [key, value]) => {
											// Remove properties that are empty, false, null, undefined, or 0
											if (value !== '' && value !== false && value !== null && value !== undefined && value !== 0) {
													cleaned[key] = value;
											}
											return cleaned;
									}, {} as Record<string, any>);

									// Remove the `layerName` property
									delete cleanedLayer.layerName;

									// Assign the cleaned layer object to the `layerName` key
									acc[layer.layerName] = cleanedLayer;
							}
							return acc;
					}, {});
			}
	}
	return opts;
};

const transformSingleProp = (prop: string) => (values: any) =>
	(values.itemChoice || []).map((i: any) => i[prop]);

export async function loadTemplates(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	try {
		const credentials = await this.getCredentials('templatedApi');
		
		const options: IHttpRequestOptions = {
			method: 'GET',
			baseURL: credentials.baseUrl as string,
			url: '/v1/templates',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		};

		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'templatedApi', options);
		
		if (Array.isArray(response)) {
			if (response.length === 0) {
				return { 
					results: [{
						name: 'No templates found',
						value: 'no-templates',
						description: 'Your account has no templates yet'
					}]
				};
			}

			let templates = response.map((template: any) => ({
				name: template.name || `Template ${template.id}`,
				value: template.id,
				description: template.description || `${template.width}x${template.height}`,
			}));

			// Apply filter if provided
			if (filter) {
				const filterLower = filter.toLowerCase();
				templates = templates.filter((template) =>
					template.name.toLowerCase().includes(filterLower) ||
					(template.description && template.description.toLowerCase().includes(filterLower))
				);
			}

			return {
				results: templates,
			};
		} else {
			return { 
				results: [{
					name: `Debug: Response type ${typeof response}`,
					value: 'debug',
					description: `Expected array, got: ${JSON.stringify(response).substring(0, 100)}`
				}]
			};
		}
	} catch (error) {
		// Return error info for debugging
		return { 
			results: [{
				name: `Error: ${error.message}`,
				value: 'error',
				description: 'Check credentials and API endpoint'
			}]
		};
	}
}

export async function renderPresend(
	this: IExecuteSingleFunctions,
	opts: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const params = getAllParams(this);

	// Handle resource locator for template parameter
	if (params.template && typeof params.template === 'object') {
		const templateLocator = params.template as { mode: string; value: string };
		params.template = templateLocator.value;
	}

	opts.body = formatParams(
		params,
		{
			template: idFn,
			layers: idFn,
			webhookUrl: idFn,
			format: idFn,
			transparent: idFn,
		},
		{
			renders: transformSingleProp('renders'),
		},
	);

	// Transform the layers array to an object
	opts = transformLayers(opts);

	return opts;
}

export async function templatePresend(
	this: IExecuteSingleFunctions,
	opts: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const params = getAllParams(this);

	// Handle resource locator for templateId parameter
	if (params.templateId && typeof params.templateId === 'object') {
		const templateLocator = params.templateId as { mode: string; value: string };
		params.templateId = templateLocator.value;
	}

	opts.body = formatParams(
			params,
			{
					templateId: (value) => typeof value === 'string' && value.trim().length > 0,
					page: (value) => typeof value === 'number',
					limit: (value) => typeof value === 'number',
			},
	);

	return opts;
}

export async function mergeRendersPresend(
	this: IExecuteSingleFunctions,
	opts: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const params = getAllParams(this);

	// Extract render IDs from the fixed collection
	const renderIds = (params.renders as { render: Array<{ renderId: string }> }).render.map(r => r.renderId);

	opts.body = {
		ids: renderIds,
		host: params.host,
	};

	return opts;
}
