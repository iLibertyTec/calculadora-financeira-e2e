let visits = 0;

export const handler = {
  GET(): Response {
    return Response.json({ visits });
  },
  POST(): Response {
    visits += 1;
    return Response.json({ visits });
  },
};
