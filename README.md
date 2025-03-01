# lAIfe

Setup:

1. Git clone the repo
2. `python -m venv env`
3. `source env/bin/activate`
4. `pip install -r requirements.txt`



Start:

Run the Flask backend:

```
cd backend
python server.py
```

Run the React development server:

```
cd frontend
npm start
```



## Project Structure

```

├── frontend/              # React frontend
│   ├── public/
│   │   ├── index.html     # HTML entry point
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── App.js         # Main component
│   │   ├── index.js       # Entry point
│   │   ├── components/    # React components
│   │   │   └── ... 
│   │   ├── pages/         # Page components
│   │   │   └── ...
│   │   └── api.js         # API calls to backend
│   │
│   ├── package.json       # Dependencies
│   └── .gitignore
│
├── backend/               # Flask backend
│   ├── app.py             # Main Flask app
│   ├── models.py          # Database models (if needed)
│   ├── routes.py          # API endpoints
│   ├── requirements.txt   # Python dependencies
│   └── .gitignore
│
└── README.md              # Project documentation
```


