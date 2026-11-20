variable "project_name" {
  type = string
}

variable "alb_dns_name" {
  type = string
}

variable "cognito_domain_prefix" {
  type    = string
  default = "ap-southeast-2mlvws715o"
}

variable "cognito_callback_urls" {
  type = list(string)
  default = [
    "http://localhost:8080/login/oauth2/code/cognito",
    "http://localhost:5173/auth/callback"
  ]
}

variable "cognito_logout_urls" {
  type = list(string)
  default = [
    "http://localhost:5173/login",
    "http://localhost:3000/login"
  ]
}
