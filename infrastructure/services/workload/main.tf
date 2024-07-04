provider "local" {}

provider "null" {}

//variable "ssh_config" {}

locals {
    _ssh_config = {
        remote = {
            host = "172.16.2.10"
            user = "jyam"
            key = "~/.ssh/keys/cmc"
        },
        bastion = {
            host = "192.168.20.101"
            user = "hiragi"
            key = "~/.ssh/keys/cmc"
        },
    }
    //ssh_config = local._ssh_config[var.ssh_config]
    project_name    = "my-local-project"
    deployment_id   = "my-deployment-id"
}

resource "null_resource" "workload" {
    provisioner "remote-exec" {
        connection {
            type        = "ssh"
            user        = local._ssh_config.remote.user 
            host        = local._ssh_config.remote.host
            private_key = file(local._ssh_config.remote.key)
            agent       = false
            bastion_host = local._ssh_config.bastion.host
            bastion_user = local._ssh_config.bastion.user
            bastion_private_key = file(local._ssh_config.bastion.key)
        }
        inline = [
          "sudo apt-get update",
          "docker pull jyam39/artillery",
          "docker run -it --rm -e BEFAAS_DEPLOYMENT_ID=${local.deployment_id} jyam39/artilley"
        ]
    }
}