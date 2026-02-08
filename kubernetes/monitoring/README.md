# Kubernetes Monitoring Manifests

This directory will contain Kubernetes manifests for integrating monitoring solutions like Prometheus and Grafana.

## Placeholder for Prometheus/Grafana Setup

- **Prometheus**:
  - Deploy Prometheus Operator or Prometheus Helm Chart.
  - Configure `ServiceMonitor` or `PodMonitor` resources to scrape metrics from application services.
  - Dapr sidecars automatically expose Prometheus metrics at `http://localhost:9090/metrics` which can be scraped.
- **Grafana**:
  - Deploy Grafana Helm Chart.
  - Configure Prometheus as a data source.
  - Import dashboards for Dapr and application metrics.

This `README.md` serves as a placeholder. Actual manifests for Prometheus, Grafana, and their configurations would be placed here.
