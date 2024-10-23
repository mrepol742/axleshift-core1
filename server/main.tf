terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.0"
    }
  }

  required_version = ">= 1.0"
}

provider "docker" {}

resource "docker_image" "core1_server" {
  name = "mrepol742/core1-server:latest"
  build {
    context = "."
  }
}

resource "docker_container" "core1_server" {
  image = docker_image.core1_server.image_id
  name  = "core1-server"
  command = ["node", "src/index.js"]
  ports {
    internal = 5051
    external = 5051
  }
}

output "image_id" {
  value = docker_image.core1_server.image_id
}
