document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Carrinho Vazio',
            text: 'Você precisa de itens no carrinho para fazer checkout.',
            confirmButtonColor: '#0d6efd',
            confirmButtonText: 'Voltar ao Cardápio'
        }).then(() => {
            window.location.href = 'home-page.html';
        });
        return;
    }

    const container = document.getElementById('checkoutItemsContainer');
    let subtotal = 0;

    cart.forEach((item, index) => {
        const imgUrl = item.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.className = 'd-flex align-items-center mb-3 pb-3 ' + (index < cart.length - 1 ? 'border-bottom' : '');
        div.innerHTML = `
            <img src="${imgUrl}" class="cart-item-img me-3" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'">
            <div class="flex-grow-1">
                <h6 class="mb-0 fw-bold">${item.name}</h6>
                <small class="text-muted">Quantidade: ${item.quantity}</small>
            </div>
            <div class="fw-bold">
                R$ ${itemTotal.toFixed(2).replace('.', ',')}
            </div>
        `;
        container.appendChild(div);
    });

    const totalStr = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('subtotal').textContent = totalStr;
    document.getElementById('total').textContent = totalStr;

    // Confirm Order Action
    document.getElementById('btnConfirmOrder').addEventListener('click', async () => {
        const btn = document.getElementById('btnConfirmOrder');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processando...';

        try {
            const payload = {
                items: cart.map(i => ({
                    itemId: i.id,
                    quantity: i.quantity
                }))
            };

            const response = await fetch('/api/Order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Falha ao registrar pedido na API.');
            }

            // Clear cart from local storage
            localStorage.removeItem('cart');

            // Success message and redirect
            Swal.fire({
                title: 'Pedido Confirmado!',
                text: 'Seu lanche já está sendo preparado. Acompanhe na aba Meus Pedidos.',
                icon: 'success',
                confirmButtonColor: '#0d6efd',
                confirmButtonText: 'Voltar à Tela Inicial'
            }).then(() => {
                window.location.href = 'home-page.html';
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Erro', 
                text: 'Ocorreu um erro ao enviar seu pedido.', 
                icon: 'error',
                confirmButtonColor: '#0d6efd'
            });
            btn.disabled = false;
            btn.textContent = 'Confirmar Pedido';
        }
    });
});
