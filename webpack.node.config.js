module.exports = {
  entry: "./src/server.js",
  output: {
    path: __dirname + "/build",
    filename: "encpass.node.js",
    library: {
      type: "umd2",
      
    },
  },
  target: "node",
  mode: "production",
};
