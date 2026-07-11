require("dotenv").config();
const app = require("./app");
const { conectarBaseDeDatos } = require("./models");

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await conectarBaseDeDatos();

    app.listen(PORT, () => {
      console.log(`🚀 MercaLocal API escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ No fue posible iniciar el servidor:", error.message);
    process.exit(1);
  }
}

main();
