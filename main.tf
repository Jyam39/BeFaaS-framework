provider "aws" {
  version = "~> 2.0"
}

locals {
  name    = file("NAME")
  fn_file = "fn/${file("deploy.sum")}/fn.zip"
}

locals {
  fns = map(local.name, local.fn_file)
}

module "aws" {
  source    = "./aws"
  name      = local.name
  s3_bucket = local.name
  s3_key    = local.fn_file
}

module "google" {
  source     = "./google"
  gcs_bucket = local.name
  fns        = local.fns
}

output "aws_invoke_url" {
  value = module.aws.invoke_url
}

output "google_invoke_url" {
  value = module.google.invoke_url
}
