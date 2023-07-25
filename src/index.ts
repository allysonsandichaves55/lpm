import * as readline from "readline";
import { createDiffieHellmanGroup } from "crypto";
import yargs from "yargs/yargs";
import fs from "fs";
import crypto from "crypto";
import path from "path";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function displayMenu() {
  console.log("--- Menú ---");
  console.log("1. Help");
  console.log("2. Version");
  console.log("3. Password File");
  console.log("4. New Pasword");
  console.log("5. List");
  console.log("6. Get");
  console.log("7. Salir");
}

function handleMenuChoice(choice: string) {
  switch (choice) {
    case "1":
      console.log(
        "Has seleccionado la Opción 1, que vendria siendo el modulo de ayuda",
      );
      Help();
      break;
    case "2":
      console.log(
        "Has seleccionado la Opción 2, que vendria siendo el modulo de version",
      );
      Version();
      break;
    case "3":
      console.log(
        "Has seleccionado la Opción 3, que vendria siendo el modulo de crear un nuevo archivo de contrasenas",
      );
      passwordFile(filepath);
      break;
    case "4":
      console.log(
        "Has seleccionado la Opción 4, que vendria siendo el modulo de crear un nuevo par nombre:contraseña en el archivo de contraseñas",
      );
      newPassword(filepath, username, passwords);
      break;
    case "5":
      console.log(
        "Has seleccionado la Opción 5, que vendria siendo el modulo de listar los nombres de las contraseñas del archivo de contraseñas",
      );
      listPasswords(filepath);
      break;
    case "6":
      console.log(
        "Has seleccionado la Opción 6, que vendria siendo el modulo de obtener la contraseña por nombre desde el archivo de contraseñas.",
      );
      const name = "nuevoUsuario";
      getPassword(filepath, name);
      break;
    case "7":
      console.log("Saliendo del menú.");
      rl.close(); // Cierra la interfaz readline y termina el programa.
      break;
    default:
      console.log("Opción inválida, por favor selecciona un número del menú.");
      break;
  }
}

function askForChoice() {
  rl.question("Ingresa el número de tu elección: ", (answer) => {
    handleMenuChoice(answer);
    displayMenu();
    askForChoice(); // Vuelve a preguntar por la elección en un ciclo recursivo.
  });
}

displayMenu();
askForChoice();

/**********Codigo*********/
function Help() {
  console.log("=== Ayuda ===");
  console.log(
    "Este es un menú interactivo que te permite realizar diferentes acciones.",
  );
  console.log(
    'Selecciona un número del menú y presiona "Enter" para elegir una opción:',
  );
  console.log("1. Help: Muestra esta sección de ayuda.");
  console.log("2. Version: Muestra la versión de la aplicación.");
  console.log("3. Password File: Crea un nuevo archivo de contrasennas.");
  console.log(
    "4. New Password: Crear un nuevo par nombre:contraseña en el archivo de contraseñas",
  );
  console.log("5. List: Listar contrasenas");
  console.log(
    "6. Get: Obtener la contraseña por nombre desde el archivo de contraseñas.",
  );
  console.log("7. Salir: Cierra la aplicación.");
  console.log();
}

function Version() {
  console.log("Versión 1.0.0");
}

/*Yargs*/
const argv = yargs(process.argv.slice(2))
  .command("password-file <filepath>", "Create a password file", (yargs) => {
    yargs.positional("filepath", {
      describe: "password file path",
      type: "string",
    });
  })
  .command(
    "new-password <filepath> <name> <password>",
    "Create a password file",
    (yargs) => {
      yargs
        .positional("filepath", {
          describe: "password file path",
          type: "string",
        })
        .positional("name", {
          describe: "what the password for",
        })
        .positional("password", {
          describe: "the password",
        });
    },
  )
  .command("list <filepath>", "List passwords", (yargs) => {
    yargs.positional("filepath", {
      describe: "password file path",
      type: "string",
    });
  })
  .command("get <filepath> <name>", "List passwords", (yargs) => {
    yargs
      .positional("filepath", {
        describe: "password file path",
        type: "string",
      })
      .positional("name", {
        describe: "password name",
        type: "string",
      });
  })
  .parseSync();

const command = argv._[0];
const filepath = path.join(__dirname, "passwords.json");
passwordFile(filepath);

function generateKey(secretKey: string) {
  return crypto.pbkdf2Sync(secretKey, "salt", 10000, 32, "sha256");
}

function decryptData(encryptedData: string) {
  // Decodificar la información del archivo JSON

  const jsonData = JSON.parse(encryptedData);
  const iv = Buffer.from(jsonData.iv, "hex");
  const encryptedContent = Buffer.from(jsonData.encryptedData, "hex");

  try {
    // Desencriptar el contenido
    const secretKey = "yourSecretKey";
    const key = generateKey(secretKey);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedContent);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  } catch (err) {
    console.error("Error occurred while decrypting the data:", err);
    return ""; // Retorna null o algún valor adecuado en caso de error
  }
}

function passwordFile(filepath: string | unknown) {
  console.log(`password-file ${filepath}`);
  if (!filepath || typeof filepath !== "string") {
    console.log(
      "Error: Debes especificar la ruta del archivo de contraseñas como una cadena de texto.",
    );
    return;
  }

  const encryptedPasswords = [
    { username: "user1", password: "encryptedPassword1" },
    { username: "user2", password: "encryptedPassword2" },
    { username: "user3", password: "encryptedPassword3" },
  ];

  try {
    let encryptedPasswords: { username: string; password: string }[] = [];
    const fileContent = fs.readFileSync(filepath, "utf8");
    const decryptedData = decryptData(fileContent);
    encryptedPasswords = JSON.parse(decryptedData);

    // Verificar si el array de contraseñas está vacío antes de realizar operaciones
    if (encryptedPasswords.length === 0) {
      console.log(
        "El archivo de contraseñas está vacío o no se pudo desencriptar correctamente.",
      );
      return;
    }

    // Generate the 256-bit key
    const secretKey = "yourSecretKey";
    const key = generateKey(secretKey);

    // Encrypt the data using the generated key
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(decryptedData);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Save the encrypted data to the JSON file
    fs.writeFileSync(
      filepath,
      JSON.stringify({
        iv: iv.toString("hex"),
        encryptedData: encrypted.toString("hex"),
      }),
    );
  } catch (err) {
    console.error("Error occurred while creating the JSON file:", err);
  }
}

function newPassword(
  filepath: string | unknown,
  name: string | unknown,
  password: string | unknown,
) {
  // START EXAMPLE //
  if (!filepath || typeof filepath !== "string") {
    console.log(
      "Error: Debes especificar la ruta del archivo de contraseñas como una cadena de texto.",
    );
    return;
  }

  // Leer el contenido actual del archivo (si existe)
  let encryptedPasswords: { name: string; password: string }[] = [];
  /*try {
        const fileContent = fs.readFileSync(filepath, 'utf8');
        const decryptedData = decryptData(fileContent);
        encryptedPasswords = JSON.parse(decryptedData);
      } catch (err) {
        // El archivo no existe o no se pudo desencriptar, se asume que es un nuevo archivo.
      }*/
  try {
    const fileContent = fs.readFileSync(filepath, "utf8");
    const decryptedData = decryptData(fileContent);
    if (decryptedData === null) {
      throw new Error("Error de desencriptación");
    }
    encryptedPasswords = JSON.parse(decryptedData);
  } catch (err) {
    console.error(
      "Error occurred while reading or decrypting the password file:",
      err,
    );
    return;
  }

  // Agregar el nuevo par de username y password al arreglo de contraseñas
  if (typeof name === "string" && typeof password === "string") {
    encryptedPasswords.push({ name, password });
  }

  try {
    // Convertir el arreglo de contraseñas a formato JSON
    const encryptedData = JSON.stringify(encryptedPasswords);

    // Generar el 256-bit key
    const secretKey = "yourSecretKey";
    const key = generateKey(secretKey);

    // Encriptar el contenido
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(encryptedData);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Guardar el contenido encriptado en el archivo
    fs.writeFileSync(
      filepath,
      JSON.stringify({
        iv: iv.toString("hex"),
        encryptedData: encrypted.toString("hex"),
      }),
    );

    console.log(
      `New username:password pair added to the password file (${filepath})`,
    );
  } catch (err) {
    console.error(
      "Error occurred while adding the new username:password pair:",
      err,
    );
  }
}

// Para agregar un nuevo username y password, llamas a la función newPassword() con los valores correspondientes:

const username = "nuevoUsuario";
const passwords = "nuevaContraseña";
newPassword(filepath, username, passwords);

function listPasswords(filepath: string | unknown) {
  if (!filepath || typeof filepath !== "string") {
    console.log(
      "Error: Debes especificar la ruta del archivo de contraseñas como una cadena de texto.",
    );
    return;
  }

  // Leer el contenido actual del archivo (si existe)

  try {
    const fileContent = fs.readFileSync(filepath, "utf8");
    const decryptedData = decryptData(fileContent);
    const encryptedPasswords: { name: string; password: string }[] =
      JSON.parse(decryptedData);

    // Mostrar los nombres de las contraseñas
    console.log(`Passwords in the password file (${filepath}):`);
    encryptedPasswords.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.name}`);
    });
  } catch (err) {
    console.error("Error occurred while listing the passwords:", err);
  }
}

function getPassword(filepath: string | unknown, name: string | unknown) {
  if (
    !filepath ||
    typeof filepath !== "string" ||
    !name ||
    typeof name !== "string"
  ) {
    console.log(
      "Error: Debes especificar la ruta del archivo de contraseñas y el nombre como cadenas de texto.",
    );
    return;
  }

  try {
    const fileContent = fs.readFileSync(filepath, "utf8");
    const decryptedData = decryptData(fileContent);
    const encryptedPasswords: { name: string; password: string }[] =
      JSON.parse(decryptedData);

    // Buscar la contraseña por nombre en el arreglo de contraseñas
    const foundPassword = encryptedPasswords.find(
      (entry) => entry.name === name,
    );

    if (foundPassword) {
      console.log(`Password for ${name}: ${foundPassword.password}`);
    } else {
      console.log(`No password found for ${name}.`);
    }
  } catch (err) {
    console.error("Error occurred while getting the password:", err);
  }
}

if (command === "password-file") {
  const { filepath } = argv;
  passwordFile(filepath);
}
if (command === "new-password") {
  const { filepath, name, password } = argv;
  newPassword(filepath, name, password);
}
if (command === "list") {
  const { filepath } = argv;
  listPasswords(filepath);
}
if (command === "get") {
  const { filepath, name } = argv;
  getPassword(filepath, name);
}
