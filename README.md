# Freight Core 1
[![Build CI](https://github.com/mrepol742/core1/actions/workflows/build.yml/badge.svg)](https://github.com/mrepol742/core1/actions/workflows/build.yml)
[![Docker CI](https://github.com/freight-capstone/core1/actions/workflows/docker.yml/badge.svg)](https://github.com/freight-capstone/core1/actions/workflows/docker.yml)
[![Dependabot Updates](https://github.com/freight-capstone/core1/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/freight-capstone/core1/actions/workflows/dependabot/dependabot-updates)
[![Terraform CI](https://github.com/freight-capstone/core1/actions/workflows/terraform.yml/badge.svg)](https://github.com/freight-capstone/core1/actions/workflows/terraform.yml)

## Pre-requisites
- Node.js v20.^ `sudo pacman -Sy nodejs`
- Docker `sudo pacman -Sy docker`
- Terraform `sudo pacman -Sy terraform`
- Grafana `sudo pacman -Sy grafana`
- PM2 `sudo pacman -Sy pm2`
- smee `sudo npm i --global smee-client`

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

- **Run Mobile App**  
  ```sh
  npm run app
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
