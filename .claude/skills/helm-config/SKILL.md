# Helm Configuration Skill

## Purpose
Configure Helm charts for Kubernetes deployments, focusing on parameter management, template customization, and deployment customization.

## When to Use
- Creating or modifying Helm charts for applications
- Managing environment-specific configurations
- Customizing deployments with environment variables
- Handling secrets and configuration management
- Upgrading and maintaining Helm releases

## Configuration Steps

### 1. Values.yaml Structure
Organize configuration values hierarchically:

```yaml
# values.yaml
app:
  image:
    repository: my-app
    tag: "latest"
    pullPolicy: IfNotPresent
  replicaCount: 1
  service:
    type: ClusterIP
    port: 8000
  resources: {}
  env:
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: database-url
```

### 2. Template Customization
Create flexible templates that use values:

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "myapp.fullname" . }}
spec:
  replicas: {{ .Values.app.replicaCount }}
  selector:
    matchLabels:
      {{- include "myapp.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "myapp.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.app.image.repository }}:{{ .Values.app.image.tag }}"
          ports:
            - containerPort: {{ .Values.app.service.port }}
          env:
            {{- range .Values.app.env }}
            - name: {{ .name }}
              valueFrom:
                {{ .valueFrom | toYaml | nindent 14 }}
            {{- end }}
```

### 3. Secret Management
Handle sensitive data securely:

```yaml
# templates/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: {{ include "myapp.fullname" . }}-secrets
type: Opaque
data:
  {{- range $key, $value := .Values.secrets }}
  {{ $key }}: {{ $value | b64enc | quote }}
  {{- end }}
```

### 4. Upgrade and Maintenance
Best practices for managing Helm releases:

```bash
# Upgrade with new values
helm upgrade my-release ./my-chart --values new-values.yaml

# Rollback if issues occur
helm rollback my-release

# Check release status
helm status my-release
```

## Benefits
- Centralized configuration management
- Environment-specific deployments
- Secure handling of sensitive data
- Reproducible deployments
- Easy upgrades and rollbacks

## Best Practices
- Use semantic versioning for charts
- Validate templates with `helm lint`
- Test with `helm template` before deployment
- Use `--dry-run` flag for testing
- Keep secrets separate from templates