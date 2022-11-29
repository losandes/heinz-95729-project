resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "test_lambda" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = "./../deployable.zip"
  function_name = "handler"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "src.index.handler"

  runtime = "nodejs12.x"

  environment {
    variables = {
      foo = "bar"
    }
  }
}