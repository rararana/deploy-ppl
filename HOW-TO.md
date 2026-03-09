# Hellow ges
ikutin ini buat pertama kali

```
# git clone
1. buka vscode
cd "path repo"
git clone https://gitlab-edu.itb.ac.id/ppl/if3250_k01_g01_ditdik.git 

# buat venv (opsional)
python -m venv .venv

# aktivasi venv (disesuaiin sm OP / shells yg dipake)
.\.venv\Scripts\Activate.ps1

# persiapan BE (janlup buat .env, kredensial postgres bener)
cd backend
copy .env.example .env
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --reload

# persiapan FE (terminal baru)
cd frontend
npm install
npm run dev

```