document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        const errors = validateForm(firstName, lastName, email, password, confirmPassword);

        if (errors.length > 0) {
            displayErrors(errors);
            return;
        }

        try {
            showLoadingState(true);
            await performSignup(firstName, lastName, email, password);
        } catch (error) {
            displayErrors([error.message]);
        } finally {
            showLoadingState(false);
        }
    });

    firstNameInput.addEventListener('focus', clearErrors);
    lastNameInput.addEventListener('focus', clearErrors);
    emailInput.addEventListener('focus', clearErrors);
    passwordInput.addEventListener('focus', clearErrors);
    confirmPasswordInput.addEventListener('focus', clearErrors);
});

function validateForm(firstName, lastName, email, password, confirmPassword) {
    const errors = [];

    if (!firstName) {
        errors.push('Primeiro nome é obrigatório');
    } else if (firstName.length < 2) {
        errors.push('Primeiro nome deve ter no mínimo 2 caracteres');
    }

    if (!lastName) {
        errors.push('Sobrenome é obrigatório');
    } else if (lastName.length < 2) {
        errors.push('Sobrenome deve ter no mínimo 2 caracteres');
    }

    if (!email) {
        errors.push('Email é obrigatório');
    } else if (!isValidEmail(email)) {
        errors.push('Formato de email inválido');
    }

    if (!password) {
        errors.push('Senha é obrigatória');
    } else if (password.length < 6) {
        errors.push('Senha deve ter no mínimo 6 caracteres');
    }

    if (!confirmPassword) {
        errors.push('Confirmação de senha é obrigatória');
    } else if (password !== confirmPassword) {
        errors.push('As senhas não conferem');
    }

    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function performSignup(firstName, lastName, email, password) {
    const response = await fetch('/api/Auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName
        })
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMessage = data.message || data.error || 'Erro ao registrar. Tente novamente.';
        throw new Error(errorMessage);
    }

    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }

    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    showSuccessMessage('Cadastro realizado com sucesso!');
    setTimeout(() => {
        window.location.href = '/index.html';
    }, 1500);
}

function displayErrors(errors) {
    let errorContainer = document.getElementById('error-container');

    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.id = 'error-container';
        errorContainer.className = 'alert alert-danger alert-dismissible fade show';
        errorContainer.setAttribute('role', 'alert');
        const form = document.getElementById('signupForm');
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
        const form = document.getElementById('signupForm');
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
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Cadastrando...';
        firstNameInput.disabled = true;
        lastNameInput.disabled = true;
        emailInput.disabled = true;
        passwordInput.disabled = true;
        confirmPasswordInput.disabled = true;
    } else {
        button.disabled = false;
        button.innerHTML = 'Cadastrar';
        firstNameInput.disabled = false;
        lastNameInput.disabled = false;
        emailInput.disabled = false;
        passwordInput.disabled = false;
        confirmPasswordInput.disabled = false;
    }
}
