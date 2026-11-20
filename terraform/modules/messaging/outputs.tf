output "queue_url" {
  value = aws_sqs_queue.email_queue.url
}

output "queue_arn" {
  value = aws_sqs_queue.email_queue.arn
}

output "dlq_url" {
  value = aws_sqs_queue.email_dlq.url
}

output "dlq_arn" {
  value = aws_sqs_queue.email_dlq.arn
}

output "sender_email" {
  value = aws_ses_email_identity.sender.email
}
