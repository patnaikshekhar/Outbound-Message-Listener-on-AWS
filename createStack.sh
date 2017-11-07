STACK_NAME=test

echo "Deleting existing stack"
aws cloudformation delete-stack --stack-name $STACK_NAME
aws cloudformation wait stack-delete-complete --stack-name $STACK_NAME

echo "Deploying stack"
aws cloudformation deploy --stack-name $STACK_NAME --template stack.yml
aws cloudformation describe-stacks --stack-name $STACK_NAME --query 'Stacks[0].Outputs[0].OutputValue'


