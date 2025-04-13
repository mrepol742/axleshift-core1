# Axleshift Core 1
[![Build CI](https://github.com/mrepol742/axleshift-core1/actions/workflows/build.yml/badge.svg)](https://github.com/mrepol742/axleshift-core1/actions/workflows/build.yml)
[![Docker CI](https://github.com/axleshift/core1/actions/workflows/docker.yml/badge.svg)](https://github.com/axleshift/core1/actions/workflows/docker.yml)
[![Dependabot Updates](https://github.com/axleshift/core1/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/axleshift/core1/actions/workflows/dependabot/dependabot-updates)
[![Terraform CI](https://github.com/axleshift/core1/actions/workflows/terraform.yml/badge.svg)](https://github.com/axleshift/core1/actions/workflows/terraform.yml)

## Pre-requisites
- Node.js v23.^
- Mongodb v8^
- Redis v7.^
- Docker
- Terraform
- Grafana 
- PM2 
- smee

---

### **1. Setup and Initialization**

- **Install Dependencies**  
  ```sh
  npm run setup
  ```

- **Setup Environments**  
  ```sh
  npm run setup:env
  ```

---

### **2. Application Development**

- **Start Application**  
  ```sh
  npm run start
  ```

- **Lint Code**  
  ```sh
  npm run lint
  ```

- **Run Tests**  
  ```sh
  npm run test
  ```

- **Run Tests in Production Mode**  
  ```sh
  npm run post:production
  ```

---

### **3. Docker Commands**

- **Build Docker Image**  
  ```sh
  npm run docker
  ```

- **Run Docker Container**  
  ```sh
  npm run docker:run
  ```

---

### **4. Terraform Commands**

- **Run Terraform**  
  ```sh
  npm run terraform
  ```

---

### **5. Monitoring & Observability**

- **Start Prometheus Monitoring**  
  ```sh
  npm run prom
  ```

- **Restart Prometheus**  
  ```sh
  npm run prom:restart
  ```

- **Start Grafana**  
  ```sh
  npm run graf
  ```

- **Restart Grafana**  
  ```sh
  npm run graf:restart
  ```

---

### **6. Process Management**

- **Start PM2 (Process Manager)**  
  ```sh
  npm run pm2
  ```

- **Restart PM2**  
  ```sh
  npm run pm2:restart
  ```

---

## License

This project is licensed under the **MIT License with Commons Clause**.

- **Commercial Use Restriction**: You may not use the software for commercial purposes, as defined in the [LICENSE](LICENSE) file. Commercial use includes using the software as part of any service offered for a fee or any use that generates revenue either directly or indirectly.

See the full [LICENSE](LICENSE) file for more details.

## Disclaimer

This repository was previously part of the "Freight Capstone" GitHub organization. It has since been migrated to the "Axleshift" GitHub organization. Any references to "Freight Capstone" in the codebase, documentation, or related materials should now be understood as referring to "Axleshift."
