// libs/shared/db/src/pg.ts
import postgres from 'postgres';

export const pg = postgres(process.env['DB']!, {
  max: process.env['NODE_ENV'] === 'development' ? 10 : 50,
  idle_timeout: 10,
  connect_timeout: 30,
  ssl: true,
  connection: {
    application_name: 'honey_frontend',
  },
  debug:
    process.env['DEBUG'] === 'true'
      ? function (connection, query, params) {
          const newQuery = query.replace(/\$(\d+)/g, (_, p1) => {
            const replace = params[p1 - 1];
            return typeof replace === 'string' ? `'${replace}'` : replace;
          });
          console.log(newQuery);
        }
      : false,
});
