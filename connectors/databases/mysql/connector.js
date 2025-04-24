import mysqlx from "@mysql/xdevapi";
import dotenv from "dotenv";
const config = {
  table: "transaction",
  schema: "vinay",
  host: "localhost",
  port: 33060,
  user: "root",
  password: "vinay123",
};
dotenv.config();

export const performAction = async () => {
  return new Promise((resolve, reject) => {
    return mysqlx
      .getSession({
        user: config.user,
        password: config.password,
        host: config.host,
        port: config.port,
      })
      .then((session) => {
        const schema = session.getSchema(config.schema);

        return schema
          .existsInDatabase()
          .then((exists) => {
            if (exists) {
              return schema;
            }
          })
          .then(async (schema) => {
            const table = await schema.getTable(config.table);
            const data = await table
              .select("customer_id")
              .where("amount = :am")
              .bind("am", 2000)
              .execute();
            return data.fetchAll();
          })
          .then((data) => {
            session.close();
            resolve(data);
          });
      });
  });
};
