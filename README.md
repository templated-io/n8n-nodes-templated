# n8n-nodes-templated

This is an n8n community node. It lets you use Templated in your n8n workflows.

Templated is a powerful image and PDF generation service that allows you to create dynamic visual content from templates. With it's drag-and-drop editor and robust API, you can automate the creation of marketing images, social media posts, banners, PDFs, and more.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

With Templated you can create images or PDFs from dynamic templates. Here are the operations you can use:

| Name | Operation | Description | Documentation Link |
|------|-----------|-------------|-------------------|
| Create Render | render:create | Creates an image or PDF file with JSON data and your template. Supports JPEG, PNG, WebP, and PDF formats. | [Link](https://templated.io/docs/renders/create/) |
| Retrieve Render | render:retrieve | Retrieves a specific render by its ID to check status and get the generated file URL. | [Link](https://templated.io/docs/renders/retrieve/) |
| Retrieve Template | template:retrieve | Retrieves details of a specific template by its ID. | [Link](https://templated.io/docs/templates/retrieve/) |
| List All Templates | template:list | Lists all templates in your account with pagination and filtering options. | [Link](https://templated.io/docs/templates/list/) |
| List Template Layers | template:layers | Lists all available layers of a specific template for customization. | [Link](https://templated.io/docs/templates/layers/) |
| List Template Renders | template:renders | Lists all renders created from a specific template. | [Link](https://templated.io/docs/templates/renders/) |

## Credentials

To use this node, you need to authenticate with Templated using an API key.

### Prerequisites
1. Sign up for a [Templated account](https://templated.io)
2. Create templates using the Templated.io editor
3. Generate an API key from your account dashboard

### Authentication Setup
1. In n8n, create new credentials for "Templated API"
2. Enter your API key obtained from Templated
3. Test the connection to ensure it's working properly

## Compatibility

- **Minimum n8n version**: 0.174.0
- **Tested with n8n versions**: 0.174.0, 1.0.0+

This node uses the Templated API and should remain compatible with future versions of the service.

## Usage

This node is perfect for automating visual content creation in your workflows. Common use cases include:

- **Marketing Automation**: Generate personalized social media posts, banners, or ads
- **E-commerce**: Create product images with dynamic pricing or promotional text
- **Document Generation**: Generate certificates, invoices, or reports in PDF format
- **SaaS Applications**: Create user-specific images or documents
- **Social Media**: Automate the creation of branded posts with dynamic content

### Example Workflow
1. Trigger on new data (e.g., new product, customer, or event)
2. Use the Templated node to generate a personalized image or PDF
3. Share the generated content via email, social media, or file storage

The node integrates seamlessly with other n8n nodes, allowing you to pull data from databases, APIs, or webhooks to populate your templates dynamically.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Templated API documentation](https://templated.io/docs)
* [Template Gallery](https://templated.io/templates)
