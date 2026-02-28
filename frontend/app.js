// API URL configuration - change this to your production backend URL
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:8000/api/v1'
    : 'https://notes-app-backend-0g49.onrender.com/api/v1';

// State Management
let token = localStorage.getItem('token');
let isLogin = true;

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const authSubmit = document.getElementById('auth-submit');
const toggleAuth = document.getElementById('toggle-auth');
const authError = document.getElementById('auth-error');
const notesList = document.getElementById('notes-list');
const noteModal = document.getElementById('note-modal');
const noteForm = document.getElementById('note-form');
const addNoteBtn = document.getElementById('add-note-btn');
const logoutBtn = document.getElementById('logout-btn');
const closeModal = document.getElementById('close-modal');

// Initial UI Check
function init() {
    if (token) {
        showDashboard();
    } else {
        showAuth();
    }
}

// UI Transitions
function showAuth() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
}

function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    fetchNotes();
}

// Toggle between Login and Register
toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;
    authTitle.textContent = isLogin ? 'Welcome Back' : 'Create Account';
    authSubtitle.textContent = isLogin ? 'Please login to manage your notes.' : 'Join us to store your thoughts securely.';
    authSubmit.textContent = isLogin ? 'Login' : 'Register';
    document.getElementById('toggle-text').textContent = isLogin ? "Don't have an account?" : "Already have an account?";
    toggleAuth.textContent = isLogin ? 'Register' : 'Login';
    authError.classList.add('hidden');
});

// Authentication Logic
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    authError.classList.add('hidden');

    try {
        if (isLogin) {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Invalid credentials');
            const data = await response.json();
            token = data.access_token;
            localStorage.setItem('token', token);
            showDashboard();
        } else {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Registration failed');
            }
            alert('Registration successful! Please login.');
            isLogin = true;
            toggleAuth.click();
        }
    } catch (err) {
        authError.textContent = err.message;
        authError.classList.remove('hidden');
    }
});

// Notes Logic
async function fetchNotes() {
    try {
        const response = await fetch(`${API_URL}/notes/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) return logout();
        const notes = await response.json();
        renderNotes(notes);
    } catch (err) {
        console.error('Failed to fetch notes:', err);
    }
}

function renderNotes(notes) {
    if (notes.length === 0) {
        notesList.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-secondary);">No notes found. Create your first note!</div>';
        return;
    }

    notesList.innerHTML = notes.map(note => `
        <div class="glass-card note-card">
            <h3 style="margin-bottom: 1rem;">${note.title}</h3>
            <p style="color: var(--text-secondary); font-size: 0.93rem; line-height: 1.6;">${note.content}</p>
            <div class="note-actions">
                <button class="icon-btn delete-note" onclick="deleteNote('${note.id}')">🗑️</button>
            </div>
            <div style="margin-top: 1.5rem; font-size: 0.75rem; color: rgba(255,255,255,0.2);">
                ${new Date(note.created_at).toLocaleDateString()}
            </div>
        </div>
    `).join('');
}

async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
        const response = await fetch(`${API_URL}/notes/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) fetchNotes();
    } catch (err) {
        alert('Failed to delete note');
    }
}

// Note Modal Logic
addNoteBtn.addEventListener('click', () => noteModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => noteModal.classList.add('hidden'));

noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;

    try {
        const response = await fetch(`${API_URL}/notes/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });

        if (response.ok) {
            noteModal.classList.add('hidden');
            noteForm.reset();
            fetchNotes();
        } else {
            throw new Error('Failed to create note');
        }
    } catch (err) {
        alert(err.message);
    }
});

// Logout
function logout() {
    token = null;
    localStorage.removeItem('token');
    showAuth();
}

logoutBtn.addEventListener('click', logout);

// Start
init();
