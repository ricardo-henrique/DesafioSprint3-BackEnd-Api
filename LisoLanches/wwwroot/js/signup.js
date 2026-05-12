document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const phoneInput = document.getElementById('phone');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();

        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const phone = phoneInput.value.trim();

        const errors = validateForm(fullname, email, password, confirmPassword, phone);

        if (errors.length > 0) {
            displayErrors(errors);
            return;
        }

        try {
            showLoadingState(true);
            await performSignup(fullname, email, password, phone);
        } catch (error) {
            displayErrors([error.message]);
        } finally {
            showLoadingState(false);
        }
    });

    fullnameInput.addEventListener('focus', clearErrors);
    emailInput.addEventListener('focus', clearErrors);
    passwordInput.addEventListener('focus', clearErrors);
    confirmPasswordInput.addEventListener('focus', clearErrors);
    phoneInput.addEventListener('focus', clearErrors);
});

function validateForm(fullname, email, password, confirmPassword, phone) {
    const errors = [];

    if (!fullname) {
        errors.push('Nome completo é obrigatório');
    } else if (fullname.length < 3) {
        errors.push('Nome completo deve ter no mínimo 3 caracteres');
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

    if (phone && !isValidPhone(phone)) {
        errors.push('Formato de telefone inválido');
    }

    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone) || phone === '';
}

async function performSignup(fullname, email, password, phone) {
    const response = await fetch('/api/Auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullname: fullname,
            email: email,
            password: password,
            phone: phone
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
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const phoneInput = document.getElementById('phone');

    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Cadastrando...';
        fullnameInput.disabled = true;
        emailInput.disabled = true;
        passwordInput.disabled = true;
        confirmPasswordInput.disabled = true;
        phoneInput.disabled = true;
    } else {
        button.disabled = false;
        button.innerHTML = 'Cadastrar';
        fullnameInput.disabled = false;
        emailInput.disabled = false;
        passwordInput.disabled = false;
        confirmPasswordInput.disabled = false;
        phoneInput.disabled = false;
    }
}
