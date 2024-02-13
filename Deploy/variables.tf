variable "gke_cluster_host" {
  type        = string
  description = "Host Url for GKE cluster"
}

variable "gke_cluster_token" {
  type        = string
  description = "Token for GKE cluster"
}

variable "gke_cluster_ca_certificate" {
  type        = string
  description = "CA certificate for GKE cluster"
}

variable "gcp_region" {
  type        = string
  description = "Region where GKE cluster is created"
}

variable "gcp_project" {
  type        = string
  description = "Project ID for GKE cluster"
}
