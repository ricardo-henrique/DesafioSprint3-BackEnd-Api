document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '../pages/admin-login.html';
        return;
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '../pages/admin-login.html';
    });

    const form = document.getElementById('createItemForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearMessages();

        const name = document.getElementById('itemName').value.trim();
        const priceValue = document.getElementById('itemPrice').value;
        const price = parseFloat(priceValue);
        const imageFile = document.getElementById('itemImage').files[0];
        const isAvailable = document.getElementById('itemIsAvailable').checked;

        if (!name || isNaN(price) || price < 0) {
            displayError('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Salvando...';

            const formData = new FormData();
            formData.append('Name', name);
            // Substituir ponto por vírgula se necessário dependendo da cultura do servidor, mas geralmente o padrão americano funciona
            formData.append('Price', price.toString().replace('.', ',')); 
            formData.append('IsAvailable', isAvailable);
            
            if (imageFile) {
                formData.append('ImageFile', imageFile);
            }

            const response = await fetch('/api/Item', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                showSuccess('Item cadastrado com sucesso no cardápio!');
                form.reset();
                document.getElementById('itemName').focus();
            } else {
                let errorMsg = 'Erro ao criar o item. Tente novamente.';
                try {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        const data = await response.json();
                        if (data.errors) {
                            const allErrors = Object.values(data.errors).flat();
                            errorMsg = allErrors.join(' | ');
                        } else if (data.message || data.title) {
                            errorMsg = data.message || data.title;
                        }
                    } else {
                        const textData = await response.text();
                        if (textData) errorMsg = textData;
                    }
                } catch (err) {
                    console.error("Erro ao ler resposta de erro:", err);
                }
                displayError(errorMsg);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            displayError('Falha ao conectar com o servidor da API.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
});

function displayError(message) {
    const container = document.getElementById('form-error-container');
    container.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" style="animation: fadeIn 0.5s ease-in-out;" role="alert">
            <strong>Erro!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showSuccess(message) {
    const container = document.getElementById('form-success-container');
    container.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" style="animation: fadeIn 0.5s ease-in-out;" role="alert">
            <strong>Sucesso!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto limpar mensagem de sucesso após 4 segundos para a tela ficar limpa
    setTimeout(() => {
        container.innerHTML = '';
    }, 4000);
}

function clearMessages() {
    document.getElementById('form-error-container').innerHTML = '';
    document.getElementById('form-success-container').innerHTML = '';
}
