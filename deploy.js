require('dotenv').config({ path: 'variables.env' });

var exec = require('child_process').exec;

exec(`aws s3 sync build/ s3://${process.env.S3_DEPLOY_BUCKET_NAME}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
