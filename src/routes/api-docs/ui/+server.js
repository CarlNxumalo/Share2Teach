// src/routes/api-docs/ui/+server.js
import swaggerUi from 'swagger-ui-dist';

// GET endpoint for serving Swagger UI
export const GET = () => {
    const swaggerHtml = `
       <!DOCTYPE html>
<html>
<head>
    <title>API Docs</title>
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-bundle.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-standalone-preset.js"></script>
</head>
<body>
    <div id="swagger-ui"></div>
    <script>
        const ui = SwaggerUIBundle({
            url: '/api-docs', // Make sure this endpoint returns your Swagger docs
            dom_id: '#swagger-ui',
            presets: [
                SwaggerUIStandalonePreset,
                SwaggerUIBundle.presets.apis,
            ],
            layout: "StandaloneLayout",
        });
    </script>
</body>
</html>

    `;

    // Return the response correctly
    return new Response(swaggerHtml, {
        headers: {
            'Content-Type': 'text/html',
        },
    });
};
