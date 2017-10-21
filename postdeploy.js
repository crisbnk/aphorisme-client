require('dotenv').config({ path: 'variables.env' });

var exec = require('child_process').exec;

exec(`aws cloudfront create-invalidation --distribution-id ${process.env.CF_DISTRIBUTION_ID} --paths '/*'`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});

// TODO - ADD YOUR_WWW_CF_DISTRIBUTION_ID
// aws cloudfront create-invalidation --distribution-id YOUR_CF_DISTRIBUTION_ID --paths '/*'
// && aws cloudfront create-invalidation --distribution-id WWW_CF_DISTRIBUTION_ID --paths '/*'
