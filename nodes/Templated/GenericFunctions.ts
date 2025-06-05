import type { IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';

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

const transformLayerConfig = (opts: IHttpRequestOptions): IHttpRequestOptions => {
	if (opts.body && typeof opts.body === 'object') {
		const layerConfig = (opts.body as any).layerConfig;

		if (layerConfig && typeof layerConfig === 'object') {
			// Extract the layerName to use as the key
			const layerName = layerConfig.layerName;
			
			if (layerName) {
				// Create a new layer object excluding empty or false properties
				const cleanedLayer = Object.entries(layerConfig).reduce((cleaned: Record<string, any>, [key, value]) => {
					// Skip layerName as it becomes the key, and remove properties that are empty, false, null, undefined, or 0
					if (key !== 'layerName' && value !== '' && value !== false && value !== null && value !== undefined && value !== 0) {
						cleaned[key] = value;
					}
					return cleaned;
				}, {} as Record<string, any>);

				// Create the layers object with layerName as key
				(opts.body as any).layers = {
					[layerName]: cleanedLayer
				};

				// Remove the original layerConfig
				delete (opts.body as any).layerConfig;
			}
		}
	}
	return opts;
};

// Legacy transform function for backward compatibility (if needed)
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

export async function renderPresend(
	this: IExecuteSingleFunctions,
	opts: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const params = getAllParams(this);

	opts.body = formatParams(
		params,
		{
			template: idFn,
			layerConfig: idFn,
			layers: idFn,
			webhookUrl: idFn,
			format: idFn,
			transparent: idFn,
		},
		{
			renders: transformSingleProp('renders'),
		},
	);

	// Transform the new layerConfig structure to layers object
	opts = transformLayerConfig(opts);
	
	// Also handle legacy layers structure for backward compatibility
	opts = transformLayers(opts);

	return opts;
}

export async function templatePresend(
	this: IExecuteSingleFunctions,
	opts: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const params = getAllParams(this);

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
