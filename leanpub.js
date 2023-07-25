const { generate } = require('./src/generate');

const PROGRAM_NAME = 'leanpub'

function help() {
  console.log(`${PROGRAM_NAME} usage:`)
  console.log(`  node ${PROGRAM_NAME} "root/for/docs" "output/folder"`)
}

async function program(argv) {
  //  Grab the path from the args.
  if (argv.length < 3) {
    help()
    process.exit(1)
  }
  const rootPath = argv[2]
  const targetPath = argv[3]

  const results = await generate({
    sourceFilesPattern: rootPath,
    outputPath: targetPath,
    sliceStart: 0,
    sliceLength: 3
  });

  console.log(JSON.stringify(results, null, 2));
}

program(process.argv).catch(console.error)
