# 🌐 3-Tier Web Application on Azure Kubernetes Service (AKS)

This project demonstrates the deployment of a **production-style 3-tier web application** on **Azure Kubernetes Service (AKS)** with a **custom domain** and **HTTPS (TLS)** enabled.

The goal of this project is to understand how a real-world application is hosted securely on Kubernetes using managed cloud services and best practices.

---

## 🧱 Architecture Overview

The application follows a standard **3-tier architecture**:

- **Frontend** – React-based web UI
- **Backend** – Node.js (Express) REST API
- **Database** – MongoDB Atlas (managed, external)

All components are orchestrated using Kubernetes on Azure.

---

## 🔁 Request Flow

User Browser
↓
Custom Domain (DNS)
↓
NGINX Ingress Controller (AKS)
↓
Kubernetes Services
↓
Frontend / Backend Pods
↓
MongoDB Atlas

yaml
Copy code

---

## 🧰 Technology Stack

| Category                | Technology                     |
| ----------------------- | ------------------------------ |
| Cloud Platform          | Microsoft Azure                |
| Container Orchestration | Azure Kubernetes Service (AKS) |
| Frontend                | React                          |
| Backend                 | Node.js (Express)              |
| Database                | MongoDB Atlas                  |
| Ingress                 | NGINX Ingress Controller       |
| Security                | HTTPS with TLS                 |
| Certificates            | cert-manager + Let’s Encrypt   |

---

## 🌍 Domain & Networking

- A custom domain is mapped to the AKS cluster using **DNS A records**
- External traffic enters the cluster through a **single NGINX Ingress Controller**
- Traffic routing is handled using:
  - **Host-based routing** (domain)
  - **Path-based routing** (`/api` for backend)

This design avoids exposing pods directly and ensures controlled access.

---

## 🔐 HTTPS / TLS Security

To secure the application:

- **cert-manager** is used inside the cluster
- TLS certificates are issued automatically using **Let’s Encrypt**
- HTTPS is terminated at the Ingress level
- Certificates are automatically renewed without manual intervention

As a result, the application is accessible securely over HTTPS.

---

## 🔒 Security Best Practices Followed

- No NodePort exposure
- Pods are not publicly accessible
- Secrets are not hardcoded in the codebase
- Database is hosted outside the cluster
- HTTPS enforced for all external traffic

---

## 🎯 Project Objective

This project was built to:

- Understand AKS fundamentals
- Deploy a real 3-tier application on Kubernetes
- Configure Ingress and custom domains
- Secure applications using TLS
- Follow production-oriented Kubernetes practices

---

## 🧠 Interview Summary (Short & Crisp)

> “I deployed a three-tier web application on Azure Kubernetes Service.  
> The application is exposed using NGINX Ingress with a custom domain, and HTTPS is enabled using cert-manager and Let’s Encrypt.  
> The setup follows production-grade Kubernetes networking and security practices.”

---

## ✅ Current Status

- ✔ Application deployed on AKS
- ✔ Custom domain configured
- ✔ HTTPS enabled
- ✔ Secure and production-style architecture

---

## 📌 Future Enhancements

- CI/CD automation
- Blue–Green or Canary deployments
- Monitoring and logging
- Autoscaling

---
