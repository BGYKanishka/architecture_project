output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}

output "alb_arn" {
  value = aws_lb.alb.arn
}

output "node_1_id" {
  value = aws_instance.web_1.id
}

output "node_2_id" {
  value = aws_instance.web_2.id
}

output "ec2_role_arn" {
  value = aws_iam_role.ec2_role.arn
}
