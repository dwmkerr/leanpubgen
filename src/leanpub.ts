import { generate } from "./generate";

const PROGRAM_NAME = "leanpub";

function help() {
  console.log(`${PROGRAM_NAME} usage:`);
  console.log(`  node ${PROGRAM_NAME} "root/for/docs" "output/folder"`);
}

async function program(argv: string[]) {
  //  Grab the path from the args.
  // if (argv.length < 3) {
  //   help();
  //   process.exit(1);
  // }
  // const rootPath = argv[2];
  // const targetPath = argv[3];

  console.log('args', argv);

  //  Hard code our parameters for now.
  const params = {
    basePath: "../effective-shell/docs",
    // sourceFilesPattern: "**/*.md*",
    sourceFilesPattern: "01-transitioning-to-the-shell/**/*.md*",
    outputPath: "./artifacts/e2e/output",
    sliceStart: undefined,
    sliceEnd: undefined,
  };

  const results = await generate(params);

  console.log(JSON.stringify(results, null, 2));
}

program(process.argv).catch(console.error);
