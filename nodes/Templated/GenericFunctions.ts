import type { IExecuteSingleFunctions, IHttpRequestOptions, ILoadOptionsFunctions, INodeListSearchResult, INodePropertyOptions } from 'n8n-workflow';

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

interface Layer {
	layerName: string;
	[key: string]: any; // Allow additional properties
}

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

/**
 * Load template layers for the dropdown
 */
export async function loadTemplateLayers(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	try {
		// Get the template ID from the template parameter
		const templateParam = this.getNodeParameter('template', 0) as { mode: string; value: string } | string;
		let templateId: string;

		if (typeof templateParam === 'object' && templateParam.value) {
			templateId = templateParam.value;
		} else if (typeof templateParam === 'string') {
			templateId = templateParam;
		} else {
			return [{
				name: 'Select a template first',
				value: '',
				description: 'Choose a template above to load its layers',
			}];
		}

		if (!templateId || templateId === 'no-templates' || templateId === 'error') {
			return [{
				name: 'Select a template first',
				value: '',
				description: 'Choose a template above to load its layers',
			}];
		}

		const credentials = await this.getCredentials('templatedApi');

		const options: IHttpRequestOptions = {
			method: 'GET',
			baseURL: credentials.baseUrl as string,
			url: `/v1/template/${templateId}/layers`,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		};

		const response = await this.helpers.httpRequestWithAuthentication.call(this, 'templatedApi', options);

		if (Array.isArray(response)) {
			if (response.length === 0) {
				return [{
					name: 'No layers found',
					value: '',
					description: 'This template has no editable layers',
				}];
			}

			return response.map((layer: any) => {
				const layerType = layer.type || 'unknown';
				return {
					name: layer.layer || layer.name || 'Unnamed',
					value: layer.layer || layer.name || '',
					description: `${layerType} layer`,
				};
			});
		}

		return [{
			name: 'Error loading layers',
			value: '',
			description: 'Unexpected response format',
		}];
	} catch (error) {
		return [{
			name: `Error: ${(error as Error).message}`,
			value: '',
			description: 'Failed to load layers',
		}];
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

	// Build the request body
	const body: Record<string, any> = {};

	// Required parameter
	if (params.template) {
		body.template = params.template;
	}

	// Format parameter
	if (params.format) {
		body.format = params.format;
	}

	// Video-specific parameters (only when format is mp4)
	if (params.format === 'mp4') {
		if (params.duration && params.duration !== 5000) {
			body.duration = params.duration;
		}
		if (params.fps && params.fps !== 30) {
			body.fps = params.fps;
		}
	}

	// PDF-specific parameters (only when format is pdf)
	if (params.format === 'pdf') {
		if (params.flatten === true) {
			body.flatten = true;
		}
		if (params.cmyk === true) {
			body.cmyk = true;
		}
	}

	// PNG-specific parameters (only when format is png)
	if (params.format === 'png') {
		if (params.transparent === true) {
			body.transparent = true;
		}
	}

	// Handle layers based on mode
	const layersMode = params.layersMode || 'simple';

	if (layersMode === 'json' && params.layersJson) {
		// Advanced JSON mode
		try {
			const layersObj = typeof params.layersJson === 'string'
				? JSON.parse(params.layersJson)
				: params.layersJson;
			if (Object.keys(layersObj).length > 0) {
				body.layers = layersObj;
			}
		} catch (e) {
			// If JSON parsing fails, skip
		}
	} else if (layersMode === 'simple' && params.layers && typeof params.layers === 'object') {
		// Simple form mode
		const layersInput = params.layers as { layer?: Layer[] };
		if (Array.isArray(layersInput.layer) && layersInput.layer.length > 0) {
			body.layers = transformLayersToObject(layersInput.layer);
		}
	}

	// Handle multi-page content
	if (params.pages && typeof params.pages === 'object') {
		const pagesInput = params.pages as { page?: Array<{ pageId: string; layersJson: string }> };
		if (Array.isArray(pagesInput.page) && pagesInput.page.length > 0) {
			body.pages = pagesInput.page.map((p) => {
				let layersObj = {};
				try {
					layersObj = typeof p.layersJson === 'string' ? JSON.parse(p.layersJson) : p.layersJson;
				} catch (e) {
					// If JSON parsing fails, use empty object
				}
				return {
					page: p.pageId,
					layers: layersObj,
				};
			});
			// When using pages, remove the layers parameter
			delete body.layers;
		}
	}

	// Handle additional options (getAllParams flattens them into params)
	if (params.name && typeof params.name === 'string' && (params.name as string).trim() !== '') {
		body.name = params.name;
	}
	if (params.background && typeof params.background === 'string' && (params.background as string).trim() !== '') {
		body.background = params.background;
	}
	if (params.width && (params.width as number) > 0) {
		body.width = params.width;
	}
	if (params.height && (params.height as number) > 0) {
		body.height = params.height;
	}
	if (params.scale && (params.scale as number) !== 1) {
		body.scale = params.scale;
	}
	if (params.async === true) {
		body.async = true;
	}
	if (params.webhook_url && typeof params.webhook_url === 'string' && (params.webhook_url as string).trim() !== '') {
		body.webhook_url = params.webhook_url;
	}
	if (params.merge === true) {
		body.merge = true;
	}

	opts.body = body;

	return opts;
}

/**
 * Transform the layers array into the API expected object format
 * Only includes properties that the user has explicitly set (non-default values)
 */
function transformLayersToObject(layers: Layer[]): Record<string, any> {
	const result: Record<string, any> = {};

	for (const layer of layers) {
		if (!layer.layerName) continue;

		const layerObj: Record<string, any> = {};

		// Process each layer property, excluding empty/default values
		for (const [key, value] of Object.entries(layer)) {
			// Skip the layerName as it becomes the key
			if (key === 'layerName') continue;

			// Handle nested additionalProperties collection
			if (key === 'additionalProperties' && typeof value === 'object' && value !== null) {
				for (const [propKey, propValue] of Object.entries(value)) {
					if (shouldIncludeValue(propKey, propValue)) {
						layerObj[propKey] = propValue;
					}
				}
				continue;
			}

			if (shouldIncludeValue(key, value)) {
				layerObj[key] = value;
			}
		}

		// Only add the layer if it has properties to modify
		if (Object.keys(layerObj).length > 0) {
			result[layer.layerName] = layerObj;
		}
	}

	return result;
}

/**
 * Check if a value should be included in the request
 */
function shouldIncludeValue(key: string, value: any): boolean {
	// Skip empty strings
	if (value === '') return false;

	// Skip false booleans - only include 'hide' when explicitly set to true
	if (value === false) return false;

	// Skip null/undefined
	if (value === null || value === undefined) return false;

	// Skip zero values for ALL numeric fields
	if (value === 0) return false;

	// Skip opacity if it's the default value of 1
	if (key === 'opacity' && value === 1) return false;

	// Skip default font_weight value
	if (key === 'font_weight' && value === 'normal') return false;

	// Skip default alignment values
	if (key === 'horizontal_align' && value === 'left') return false;
	if (key === 'vertical_align' && value === 'top') return false;

	// Skip default object_fit value
	if (key === 'object_fit' && value === 'cover') return false;

	// Skip default barcode format
	if (key === 'barcode_format' && value === 'CODE128') return false;

	return true;
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

export async function createTemplatePresend(
	this: IExecuteSingleFunctions,
	opts: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const params = getAllParams(this);

	const body: Record<string, any> = {};

	// Required parameters
	if (params.templateName) {
		body.name = params.templateName;
	}
	if (params.width) {
		body.width = params.width;
	}
	if (params.height) {
		body.height = params.height;
	}

	// Parse layers JSON
	if (params.layersJson) {
		try {
			const layers = typeof params.layersJson === 'string'
				? JSON.parse(params.layersJson)
				: params.layersJson;
			body.layers = layers;
		} catch (e) {
			// If JSON parsing fails, try to use as-is
			body.layers = params.layersJson;
		}
	}

	opts.body = body;

	return opts;
}

export async function updateTemplatePresend(
	this: IExecuteSingleFunctions,
	opts: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const params = getAllParams(this);

	// Handle resource locator for templateId parameter
	if (params.templateId && typeof params.templateId === 'object') {
		const templateLocator = params.templateId as { mode: string; value: string };
		params.templateId = templateLocator.value;
	}

	// Handle replaceLayers query parameter
	if (params.replaceLayers === true) {
		opts.qs = opts.qs || {};
		opts.qs.replaceLayers = 'true';
	}

	const body: Record<string, any> = {};

	// Handle update fields
	if (params.updateFields && typeof params.updateFields === 'object') {
		const updateFields = params.updateFields as Record<string, any>;

		if (updateFields.name && updateFields.name.trim() !== '') {
			body.name = updateFields.name;
		}
		if (updateFields.description && updateFields.description.trim() !== '') {
			body.description = updateFields.description;
		}
		if (updateFields.width && updateFields.width > 0) {
			body.width = updateFields.width;
		}
		if (updateFields.height && updateFields.height > 0) {
			body.height = updateFields.height;
		}

		// Parse layers JSON if provided
		if (updateFields.layers && updateFields.layers.trim() !== '') {
			try {
				const layers = typeof updateFields.layers === 'string'
					? JSON.parse(updateFields.layers)
					: updateFields.layers;
				body.layers = layers;
			} catch (e) {
				// If JSON parsing fails, skip
			}
		}

		// Parse pages JSON if provided
		if (updateFields.pages && updateFields.pages.trim() !== '') {
			try {
				const pages = typeof updateFields.pages === 'string'
					? JSON.parse(updateFields.pages)
					: updateFields.pages;
				body.pages = pages;
			} catch (e) {
				// If JSON parsing fails, skip
			}
		}
	}

	opts.body = body;

	return opts;
}
