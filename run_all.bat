@echo off
start cmd /k "cd /d "RAG PIPELINE" && python "chat bot/app.py""
start cmd /k "cd /d "RAG PIPELINE" && python "AnalyticalGenAI/app.py""
start cmd /k "cd /d "RAG PIPELINE" && python run.py"
start cmd /k "cd /d "FloatChat" && npm start"
