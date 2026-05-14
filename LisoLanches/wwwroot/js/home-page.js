document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');

    if (!token) {
        // Redireciona para o login se não estiver logado
        window.location.href = '/index.html';
        return;
    }

    let user = {};
    if (userString && userString !== 'undefined') {
        try {
            user = JSON.parse(userString);
            document.getElementById('userNameHeader').textContent = `Olá, ${user.firstName || 'Cliente'}`;
        } catch (e) {
            console.warn("Nenhum usuário válido encontrado no cache local.");
        }
    }

    let menuItems = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load from localStorage

    // Init
    updateCartUI();
    loadMenuItems();

    // Event Listeners
    document.getElementById('btnLogout').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    });

    document.getElementById('btnCheckout').addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = '/pages/checkout.html';
        }
    });
    document.getElementById('historyModal').addEventListener('show.bs.modal', loadOrderHistory);

    // --- Funcionalidades Principais ---

    async function loadMenuItems() {
        const container = document.getElementById('menuItemsContainer');
        const loading = document.getElementById('loadingMenu');

        try {
            const response = await fetch('/api/Item');
            if (!response.ok) throw new Error('Falha ao carregar cardápio');

            menuItems = await response.json();

            loading.style.display = 'none';
            container.innerHTML = '';

            // Filtrar apenas itens disponíveis
            const availableItems = menuItems.filter(i => i.isAvailable !== false);

            if (availableItems.length === 0) {
                container.innerHTML = '<div class="col-12 text-center text-muted py-5">Nenhum item disponível no momento.</div>';
                return;
            }

            availableItems.forEach(item => {
                const imgUrl = item.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

                const card = document.createElement('div');
                card.className = 'col-12 col-md-6 col-lg-4 col-xl-3';
                card.innerHTML = `
                    <div class="card menu-card h-100">
                        <img src="${imgUrl}" class="menu-card-img" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
                        <div class="menu-card-body">
                            <h5 class="fw-bold mb-1">${item.name}</h5>
                            <p class="text-muted small mb-3">${item.description || 'Delicioso lanche feito na hora.'}</p>
                            <div class="mt-auto d-flex align-items-center justify-content-between">
                                <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                                <button class="btn btn-outline-primary rounded-circle" onclick="addToCart(${item.id})" style="width: 40px; height: 40px;">
                                    <i class="bi bi-plus-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            loading.innerHTML = '<span class="text-danger">Erro ao carregar o cardápio. Tente atualizar a página.</span>';
        }
    }

    window.addToCart = function (id) {
        const item = menuItems.find(i => i.id === id);
        if (!item) return;

        const existingItem = cart.find(i => i.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                quantity: 1
            });
        }

        updateCartUI();

        // Pequena notificação suave (toast)
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `${item.name} adicionado!`,
            showConfirmButton: false,
            timer: 1500
        });
    };

    window.updateCartQuantity = function (id, delta) {
        const itemIndex = cart.findIndex(i => i.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += delta;

            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1); // Remove if zero
            }
        }
        saveCart();
        updateCartUI();
    };

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartTotal = document.getElementById('cartTotal');
        const btnCheckout = document.getElementById('btnCheckout');
        const emptyMsg = document.getElementById('emptyCartMsg');

        // Calcular totais
        const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
        const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        cartCount.textContent = totalItems;
        cartTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyMsg.style.display = 'block';
            cartItemsContainer.style.display = 'none';
            btnCheckout.disabled = true;
            cartCount.textContent = '0';
            cartTotal.textContent = 'R$ 0,00';
            return;
        }

        // Renderizar itens
        emptyMsg.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        cartItemsContainer.innerHTML = '';

        cart.forEach(item => {
            const imgUrl = item.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80';

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${imgUrl}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'">
                <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold">${item.name}</h6>
                    <div class="text-primary fw-medium">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</div>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateCartQuantity(${item.id}, -1)"><i class="bi bi-dash"></i></button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, 1)"><i class="bi bi-plus"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });

        btnCheckout.disabled = false;
    }

    // --- Fim do Gerenciamento de Carrinho ---

    // --- Histórico de Pedidos ---
    async function loadOrderHistory() {
        const container = document.getElementById('historyContainer');
        const loading = document.getElementById('loadingHistory');

        loading.style.display = 'block';
        container.innerHTML = '';

        try {
            const response = await fetch('/api/Order/my-history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Falha ao buscar histórico');

            const orders = await response.json();
            loading.style.display = 'none';

            if (orders.length === 0) {
                container.innerHTML = '<div class="p-4 text-center text-muted">Você ainda não fez nenhum pedido.</div>';
                return;
            }

            // Ordenar por mais recente (assumindo que a API retorna OrderId crescente)
            orders.sort((a, b) => b.orderId - a.orderId);

            orders.forEach(order => {
                // Status Mapping (0 = Criado/Preparando, 1 = Enviado, etc. Adapte de acordo com a sua API)
                let statusBadge = '';
                let statusClass = '';

                // Mapeamento visual simples do Status
                if (order.status === 0 || order.status === "Pending") {
                    statusBadge = '<span class="badge bg-warning text-dark"><i class="bi bi-clock me-1"></i> Preparando</span>';
                } else if (order.status === 1 || order.status === "Delivered") {
                    statusBadge = '<span class="badge bg-success"><i class="bi bi-check2-circle me-1"></i> Entregue</span>';
                    statusClass = 'status-entregue';
                } else {
                    statusBadge = `<span class="badge bg-secondary">${order.status}</span>`;
                }

                const total = order.totalPrice ? order.totalPrice.toFixed(2).replace('.', ',') : '0,00';

                // Montar lista de itens do pedido (se existir no DTO de resposta)
                let itemsHtml = '';
                if (order.orderItems && order.orderItems.length > 0) {
                    itemsHtml = '<ul class="list-unstyled mt-2 mb-0 ms-2 small text-muted">';
                    order.orderItems.forEach(oi => {
                        const itemName = oi.item ? oi.item.name : `Item #${oi.itemId}`;
                        itemsHtml += `<li>${oi.quantity}x ${itemName}</li>`;
                    });
                    itemsHtml += '</ul>';
                }

                const div = document.createElement('div');
                div.className = `order-history-item ${statusClass}`;
                div.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1 fw-bold">Pedido #${order.orderId}</h6>
                            ${statusBadge}
                            ${itemsHtml}
                        </div>
                        <div class="text-end">
                            <div class="fw-bold text-primary mb-1">R$ ${total}</div>
                            <small class="text-muted"><i class="bi bi-calendar3"></i> Recente</small>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });

        } catch (error) {
            console.error(error);
            loading.innerHTML = '<div class="text-danger p-4 text-center">Erro ao carregar histórico.</div>';
        }
    }
});
