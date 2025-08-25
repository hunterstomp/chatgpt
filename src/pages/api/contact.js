export async function POST({ request }) {
  // stub: replace with your email/webhook later
  return new Response(JSON.stringify({ ok:true }), { status:200, headers:{ "content-type":"application/json" }});
}
export async function GET() {
  return new Response(JSON.stringify({ ok:false, hint:"Use POST /api/contact" }), { status:405, headers:{ "content-type":"application/json" }});
}
