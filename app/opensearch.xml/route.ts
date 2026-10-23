/** Låter webbläsare lägga till AdRaze Search som sökmotor med ett klick. */
export function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>AdRaze Search</ShortName>
  <Description>AdRazes sökmotor utan logg.</Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Url type="text/html" method="get" template="${origin}/search?q={searchTerms}"/>
  <Url type="application/x-suggestions+json" method="get" template="${origin}/api/suggest?q={searchTerms}"/>
</OpenSearchDescription>`;
  return new Response(xml, { headers: { "Content-Type": "application/opensearchdescription+xml; charset=utf-8" } });
}
