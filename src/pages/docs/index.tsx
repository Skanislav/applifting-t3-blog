import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const SwaggerDocs: NextPage = () => {
    // Serve Swagger UI with our OpenAPI schema
    return <SwaggerUI url="/api/rest/openapi.json" />;
};

export default SwaggerDocs;