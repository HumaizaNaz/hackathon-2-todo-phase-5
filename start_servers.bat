@echo off
echo Starting MCP Server on port 8003...
start cmd /k "cd mcp-server && python main.py"

timeout /t 3 /nobreak >nul

echo Starting AI Agent Server on port 8002...
start cmd /k "cd ai-agent && python main.py"

timeout /t 3 /nobreak >nul

echo Starting Backend API Server on port 8000...
start cmd /k "cd backend && call .venv\Scripts\activate && uvicorn main:app --reload --port 8000"

echo Servers started! MCP on http://localhost:8003, AI Agent on http://localhost:8002, Backend on http://localhost:8000
pause