const options = {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "product",
    },
  };
  
  const optionsSqlite3 = {
    client: "sqlite3",
    connection: {
      filename: "./DB/ecommerce.sqlite",
    },
    useNullAsDefault: true,
  };

  module.exports = {
    options,
    optionsSqlite3,
  };
  

 