import fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnv() {
  console.log("COnfiguracion del archivo .env para el proyecto de la biblioteca.");

  const answers = {};

  answers.MONGODB_URI = await askQuestion("Ingresa el MONGODB URI?: ");
  answers.JWT_SECRET = await askQuestion("Ingresa una clave secreta para JWT (larga y aleatoria): ");
  answers.DB_NAME = await askQuestion("Ingresa el nombre de la base de datos: ");

  rl.close();

  let envContent = "";
  for (const key in answers) {
    envContent += `${key}=${answers[key]}\n`;
  }

  try {
    fs.writeFileSync('.env', envContent);
    console.log("\n¡Archivo .env creado exitosamente");
    console.log("Renombra este archivo a '.env.local' para usarlo con Next.js.");
    console.log("Inicia la aplicación con 'npm run dev'.");
  } catch (error) {
    console.error("\nError al crear el archivo .env", error);
  }
}

setupEnv();