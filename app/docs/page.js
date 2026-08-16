// Purpose: Serves Swagger UI at http://localhost:3000/docs
// It reads /openapi.json (in the public folder), which describes every route
// and marks the protected ones with a padlock.

'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Swagger UI only works in the browser, so we turn off server-side rendering.
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function DocsPage() {
  return <SwaggerUI url="/openapi.json" />;
}
