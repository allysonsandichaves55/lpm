import yargs from 'yargs/yargs';

const argv = yargs(process.argv.slice(2))
.command('password-file <filepath>', 'Create a password file', (yargs) => {
  yargs.positional('filepath', {
    describe: 'password file path',
    type: 'string',
  })
})
.command('new-password <filepath> <name> <password>', 'Create a password file', (yargs) => {
  yargs.positional('filepath', {
    describe: 'password file path',
    type: 'string',
  }).positional('name', {
    describe: 'what the password for'
  }).positional('password', {
    describe: 'the password'
  })
})
.command('list <filepath>', 'List passwords', (yargs) => {
  yargs.positional('filepath', {
    describe: 'password file path',
    type: 'string',
  })
})
.command('get <filepath> <name>', 'List passwords', (yargs) => {
  yargs.positional('filepath', {
    describe: 'password file path',
    type: 'string',
  }).positional('name', {
    describe: 'password name',
    type: 'string',
  })
})
.parseSync();

const command = argv._[0]; 

function passwordFile(filepath: string | unknown) {
    // START EXAMPLE //
    console.log(`password-file ${filepath}`);
    console.log();
    console.log(`Create a JSON file at (${filepath}) store the encrypted passwords`);
    // END EXAMPLE //
}

function newPassword(filepath: string | unknown, name: string | unknown, password: string | unknown) {
    // START EXAMPLE //
    console.log(`new-password ${filepath} ${name} ${password}`);
    console.log();
    console.log(`Create new name:password (${name}:${password}) pair in the password file (${filepath})`);
    // END EXAMPLE //
}

function listPasswords(filepath: string | unknown) {
    // START EXAMPLE //
    console.log(`list ${filepath}`);
    console.log();
    console.log(`List passwords in the password file (${filepath})`);
    console.log(`password names`);
    ['a', 'BB', 'CCC'].forEach(pw => console.log(pw));
    // END EXAMPLE //
}

function getPassword(filepath: string | unknown, name: string | unknown) {
    // START EXAMPLE //
    console.log(`get ${filepath} ${name}`);
    console.log();
    console.log(`Get a password by name from in the password file (${filepath})`);
    // END EXAMPLE //
}

if (command === 'password-file') {
    const { filepath } = argv;
    passwordFile(filepath);
}
if (command === 'new-password') {
    const { filepath, name, password } = argv;
    newPassword(filepath, name, password);
}
if (command === 'list') {
    const { filepath } = argv;
    listPasswords(filepath);
}
if (command === 'get') {
    const { filepath, name } = argv;
    getPassword(filepath, name);
}
