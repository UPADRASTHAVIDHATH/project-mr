@echo off
title PROJECT M.R — Health Risk & Emergency Response System
echo ======================================================================
echo           PROJECT M.R - INTELLIGENT EMERGENCY RESPONSE SYSTEM
echo ======================================================================
echo.
echo Starting FastAPI Backend on http://localhost:8008 ...
start "Project MR - Backend" cmd /k "cd /d C:\PROJECT MR\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8008 --reload"

echo Starting React + Vite Frontend on http://localhost:5173 ...
start "Project MR - Frontend" cmd /k "cd /d C:\PROJECT MR\frontend && npm.cmd run dev -- --port 5173 --strictPort --host 0.0.0.0"

echo.
echo ======================================================================
echo Both Backend (:8008) and Frontend (:5173) have been launched!
echo Open your browser at: http://localhost:5173
echo ======================================================================
