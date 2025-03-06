# iReporter

## 🚀 Project Overview

iReporter is a platform that enables citizens to report corruption and call for government intervention on issues affecting their communities. Users can create reports, attach media, and track the status of their submissions as they are reviewed by authorities.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **State Management**: Context API / React Hooks
- **API Calls**: Axios
- **Authentication**: JWT-based authentication

### Backend
- **Framework**: Flask (Python)
- **Database**: PostgreSQL / SQLite
- **Authentication**: Flask-JWT
- **Email Notifications**: Flask-Mail

## ✨ Features

### User Features
1. **User Authentication**: Users can create accounts and log in.
2. **Create Reports**: Users can create two types of records:
   - **Red-Flag Reports**: Reports linked to corruption incidents.
   - **Intervention Reports**: Requests for government action on issues (e.g., infrastructure problems).
3. **Edit Reports**: Users can edit their reports before they are under review.
4. **Delete Reports**: Users can delete their reports before they are under review.
5. **Geolocation**: Users can attach and modify geolocation data to reports.
6. **Attach Media**: Users can upload images and videos to support their claims.
7. **Track Report Status**: Users receive real-time updates when an admin updates their report’s status.

### Admin Features
1. **Manage Reports**: Admins can update the status of reports to:
   - **Under Investigation**
   - **Resolved**
   - **Rejected**
2. **User Notifications**: Users receive email updates when the status of their reports changes.

## 🔧 Installation & Setup

### Backend Setup (Flask)
1. Clone the repository:
   ```bash
   git clone https://github.com/Mboya72/repotor.git
   cd repotor
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   flask run
   ```

### Frontend Setup (Next.js + Tailwind)
1. Clone the frontend repository:
   ```bash
   git clone https://github.com/Mboya72/repotor.git
   cd repotor
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📌 Usage
1. Sign up and log in.
2. Create a red-flag or intervention record.
3. Attach images/videos and geolocation to support your report.
4. Track your report status in real-time as the admin reviews it.

## 📜 Contribution
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature X'`
4. Push to the branch: `git push origin feature-name`
5. Create a pull request.

## 📜 License
This project is licensed under the MIT License.

---
**Made with ❤️ by Repotor Team**

