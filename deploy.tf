terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }
  }
}

provider "cloudflare" {
  # read token from $CLOUDFLARE_API_TOKEN
}

variable "CLOUDFLARE_ACCOUNT_ID" {
  # read account id from $TF_VAR_CLOUDFLARE_ACCOUNT_ID
  type = string
}

resource "cloudflare_d1_database" "db" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  name       = "cf-url-shortener-db"
}

resource "cloudflare_pages_project" "pages" {
  account_id        = var.CLOUDFLARE_ACCOUNT_ID
  name              = "cf-url-shortener"
  production_branch = "main"

  deployment_configs {
    production {
      d1_databases = {
        CF_URL_SHORTENER_DB = cloudflare_d1_database.db.id
      }
      compatibility_date  = "2024-07-12"
    }
  }
}
