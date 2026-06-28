# 📱 Mobile Shop Manager

A modern desktop application for mobile shop inventory management built with Electron, React, and SQLite - solving real-world challenges faced by mobile shop owners.

## 🎯 The Problem We're Solving

Mobile shop owners struggle with:
- 📦 Tracking which devices are sold vs. in stock
- 👥 Managing customer information and purchase history
- 💰 Tracking loans and partial payments
- 📊 Understanding daily, monthly, and yearly income
- 🔄 Manual inventory management leading to errors

## ✨ Features

### ✅ Current Features
- **Device Management**: Add, edit, delete, and search devices
- **Inventory Tracking**: Separate views for "In Stock" and "Sold" devices
- **Brand Colors**: Automatic color coding based on device brand
- **Dashboard Stats**: Real-time statistics for total devices, stock, sold, and revenue
- **Search & Filter**: Quick search by brand, model, or IMEI
- **Collapsible Sidebar**: Smooth animations and modern UI
- **Local Database**: SQLite for fast, offline-first performance
- **Secure**: Context isolation, preload scripts, and secure IPC

### 🚀 Coming Soon
- 👥 Customer Management
- 💰 Sales & Loan Tracking
- 📊 Advanced Reporting
- 🤖 WhatsApp Integration for loan reminders
- ☁️ Cloud Backup & Multi-shop Support
- 💳 Subscription Management

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Electron** | Desktop application framework |
| **React** | UI library |
| **SQLite** | Local database |
| **TailwindCSS** | Styling |
| **Lucide React** | Icons |
| **Vite** | Build tool |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mobile-shop-manager.git

# Navigate to project
cd mobile-shop-manager

# Install dependencies
npm install

# Run in development mode
npm run dev
