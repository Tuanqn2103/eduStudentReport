# EduStudentReports

A web application for parents to enter student codes and view grades and comments.

## Tech Stack
- Frontend: Next.js (React)
- Backend: Node.js with Express (serverless via Vercel)
- Database: MongoDB (or JSON simulation for demo)
- Deployment: Vercel

## Project Structure
- `fe/`: Frontend application (Next.js)
- `be/`: Backend API (Express serverless functions)

## Setup
1. Clone the repo.
2. For FE: `cd fe && npm install && npm run dev`
3. For BE: Deploy serverless functions via Vercel or run locally with `cd be && npm install && npm start` (for testing)

## Deployment
- FE: Automatic on Vercel push.
- BE: Serverless functions in `be/api/` deployed via Vercel.



Dự án EduStudentReports là một ứng dụng web quản lý báo cáo học sinh, bao gồm:

Chức năng chính:

Giáo viên đăng nhập bằng số điện thoại (API login).
Học sinh nhập mã để xem báo cáo (tên, điểm số các môn, nhận xét).
Giáo viên cập nhật điểm số và nhận xét cho học sinh (API grades).
Công nghệ sử dụng:

Frontend: Next.js với TypeScript (.tsx), React.
Backend: Node.js với Express và TypeScript (.ts), MongoDB (Mongoose) để lưu trữ dữ liệu.
Triển khai: Vercel.
Dự án đang trong quá trình phát triển, với cấu trúc FE/BE riêng biệt và tích hợp cơ sở dữ liệu MongoDB thay thế JSON ban đầu.