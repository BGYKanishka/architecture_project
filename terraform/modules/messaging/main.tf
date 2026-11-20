# ==============================================================================
# Messaging Module: Amazon SQS Buffer Queue, DLQ & Amazon SES Identity
# ==============================================================================

# 1. Dead-Letter Queue (DLQ)
resource "aws_sqs_queue" "email_dlq" {
  name                      = "${var.project_name}-email-dlq"
  message_retention_seconds = 1209600 # 14 days

  tags = {
    Name = "${var.project_name}-email-dlq"
  }
}

# 2. Primary Email Queue
resource "aws_sqs_queue" "email_queue" {
  name                      = "${var.project_name}-email-queue"
  message_retention_seconds = 86400 # 1 day
  receive_wait_time_seconds = 20    # Long polling

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.email_dlq.arn
    maxReceiveCount     = 5
  })

  tags = {
    Name = "${var.project_name}-email-queue"
  }
}

# 3. Verified SES Sender Identity
resource "aws_ses_email_identity" "sender" {
  email = var.sender_email
}
