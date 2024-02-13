terraform {
  required_providers {
    helm = {
      source  = "hashicorp/helm"
      version = "2.12.1"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.25.2"
    }

    google = {
      source  = "hashicorp/google"
      version = "5.16.0"
    }
  }
}

provider "helm" {
  # Configuration options
  kubernetes {
    host                   = var.gke_cluster_host
    token                  = var.gke_cluster_token
    cluster_ca_certificate = var.gke_cluster_ca_certificate
  }
}

provider "kubernetes" {
  # Configuration options
}

provider "google" {
  # Configuration options
  region  = var.gcp_region
  project = var.gcp_project
}
