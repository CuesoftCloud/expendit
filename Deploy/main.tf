resource "helm_release" "expendit-release" {
  name  = "expendit"
  chart = "./Chart"
}
