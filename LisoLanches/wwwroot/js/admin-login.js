document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('adminLoginForm');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        clearErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const errors = validateForm(email, password);

        if (errors.length > 0) {
            displayErrors(errors);
            return;
        }

        try {
            showLoadingState(true);
            await performAdminLogin(email, password);
        } catch (error) {
            displayErrors([error.message]);
        } finally {
            showLoadingState(false);
        }
    });

    emailInput.addEventListener('focus', clearErrors);
    passwordInput.addEventListener('focus', clearErrors);
});

function validateForm(email, password) {
    const errors = [];

    if (!email) {
        errors.push('Email Administrativo é obrigatório');
    } else if (!isValidEmail(email)) {
        errors.push('Formato de email inválido');
    }

    if (!password) {
        errors.push('Senha é obrigatória');
    }

    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function performAdminLogin(email, password) {
    const response = await fetch('/api/Auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
    } else {
        const textData = await response.text();
        if (!response.ok) {
            throw new Error(textData || 'Erro ao fazer login. Verifique suas credenciais.');
        }
        data = textData;
    }

    if (!response.ok) {
        const errorMessage = (data && data.message) || (data && data.error) || 'Erro ao fazer login. Tente novamente.';
        throw new Error(errorMessage);
    }

    if (data && data.token) {
        localStorage.setItem('adminToken', data.token);
    }

    if (data && data.user) {
        localStorage.setItem('adminUser', JSON.stringify(data.user));
    }

    showSuccessMessage('Login administrativo realizado com sucesso!');
    setTimeout(() => {
        window.location.href = '/pages/admin-homepage.html';
    }, 1500);
}

function displayErrors(errors) {
    let errorContainer = document.getElementById('error-container');

    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.className = 'alert alert-danger alert-dismissible fade show';
        errorContainer.setAttribute('role', 'alert');
        const form = document.getElementById('adminLoginForm');
        form.parentElement.insertBefore(errorContainer, form);
    }

    let errorHtml = '<strong>Erro!</strong><ul class="mb-0" style="margin-top: 8px;">';
    errors.forEach(error => {
        errorHtml += `<li>${error}</li>`;
    });
    errorHtml += '</ul>';
    errorHtml += '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

    errorContainer.innerHTML = errorHtml;
    errorContainer.style.animation = 'fadeIn 0.5s ease-in-out';
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showSuccessMessage(message) {
    let successContainer = document.getElementById('success-container');

    if (!successContainer) {
        successContainer = document.createElement('div');
        successContainer.id = 'success-container';
        const form = document.getElementById('adminLoginForm');
        form.parentElement.insertBefore(successContainer, form);
    }

    successContainer.className = 'alert alert-success alert-dismissible fade show';
    successContainer.setAttribute('role', 'alert');
    successContainer.innerHTML = `<strong>Sucesso!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    successContainer.style.animation = 'fadeIn 0.5s ease-in-out';
}

function clearErrors() {
    const errorContainer = document.getElementById('error-container');
    const successContainer = document.getElementById('success-container');

    if (errorContainer) {
        errorContainer.remove();
    }

    if (successContainer) {
        successContainer.remove();
    }
}

function showLoadingState(isLoading) {
    const button = document.querySelector('.btn-login');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');

    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Entrando...';
        emailInput.disabled = true;
        passwordInput.disabled = true;
    } else {
        button.disabled = false;
        button.innerHTML = 'Entrar no Painel';
        emailInput.disabled = false;
        passwordInput.disabled = false;
    }
}
