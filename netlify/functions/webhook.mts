import verify from '../../verify';
export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('OK', {
      headers: {
         'access-control-allow-origin': '*',
         "Access-Control-Allow-Headers": "*",
         "Access-Control-Allow-Methods": "*"
      }});
  } else if (req.method === 'POST') {
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const { error } = await verify(authHeader);
      if (error) {
        return new Response(error, { status: 401, headers: {
          'access-control-allow-origin': '*',
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*"
       }});
      };

      try {
        const text = await req.text();
        const response = await fetch(process.env.WEBHOOK as string, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "username": "manage.icepcp.com",
            "content": text
          })
        });
        if (!response.ok) {
          return new Response('Error while sending notification', { status: response.status, headers: {
            'access-control-allow-origin': '*',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
         }});
        }
        return new Response("Notification sent", { status: 200, headers: {
          'access-control-allow-origin': '*',
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*"
       }});
      } catch (error) {
        return new Response(`Error: ${error}`, { status: 500, headers: {
          'access-control-allow-origin': '*',
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*"
       }});
      }

    } else {
      return new Response("Authorization header missing", { status: 400, headers: {
        'access-control-allow-origin': '*',
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
     }});
    }
  } else {
    return new Response("Method Not Allowed", { status: 405, headers: {
      'access-control-allow-origin': '*',
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "*"
   }});
  }
};