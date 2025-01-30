# Simple App to test the AWS Bedrock SDK for Node.js

## install
```bash
pnpm install
```

## configure
```bash
cp .env.example .env
```
Then add the Bedrock Agent ID and Agent Alias ID you want to test to the `.env` file.

## run
> The application must be run on CLI authenticated with AWS credentials.
> Refer to [Authenticating AWS CLI with AWS Identity Center SSO](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html).
```bash
pnpm test
```