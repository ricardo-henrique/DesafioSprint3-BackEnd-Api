document.addEventListener('DOMContentLoaded', function () {
    // Verificar autenticação
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/pages/admin-login.html';
        return;
    }

    // Carregar dados
    fetchUsers(token);
    fetchItems(token);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/pages/admin-login.html';
    });
});

async function fetchUsers(token) {
    try {
        const response = await fetch('/api/Auth/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao buscar usuários');
        }

        const users = await response.json();
        const tableBody = document.getElementById('usersTableBody');
        const emptyMessage = document.getElementById('usersEmptyMessage');
        const table = document.getElementById('usersTable');

        if (!users || users.length === 0) {
            emptyMessage.innerHTML = 'Nenhum usuário cadastrado.';
            table.style.display = 'none';
        } else {
            emptyMessage.style.display = 'none';
            table.style.display = 'table';

            let html = '';
            users.forEach(user => {
                let rolesHtml = '';
                if (user.roles && user.roles.length > 0) {
                    user.roles.forEach(role => {
                        let badgeClass = role.toLowerCase() === 'admin' ? 'badge-role-admin' : 'badge-role-customer';
                        rolesHtml += `<span class="badge ${badgeClass} me-1">${role}</span>`;
                    });
                } else {
                    rolesHtml = '<span class="text-muted">Sem permissões</span>';
                }

                html += `
                    <tr>
                        <td class="text-muted small">${user.id ? user.id.substring(0, 8) + '...' : ''}</td>
                        <td>${user.firstName || ''} ${user.lastName || ''}</td>
                        <td>${user.email || ''}</td>
                        <td>${rolesHtml}</td>
                    </tr>
                `;
            });
            tableBody.innerHTML = html;
        }

    } catch (error) {
        console.error(error);
        document.getElementById('usersEmptyMessage').innerHTML = '<span class="text-danger">Erro ao carregar usuários.</span>';
    }
}

async function fetchItems(token) {
    try {
        const response = await fetch('/api/Item', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Falha ao buscar itens');
        }

        const items = await response.json();
        const tableBody = document.getElementById('itemsTableBody');
        const emptyMessage = document.getElementById('itemsEmptyMessage');
        const table = document.getElementById('itemsTable');

        if (!items || items.length === 0) {
            emptyMessage.innerHTML = 'Nenhum item cadastrado.';
            table.style.display = 'none';
        } else {
            emptyMessage.style.display = 'none';
            table.style.display = 'table';

            let html = '';
            items.forEach(item => {
                const price = typeof item.price === 'number' ? `R$ ${item.price.toFixed(2)}` : (item.price || 'R$ 0,00');
                html += `
                    <tr>
                        <td class="text-muted">${item.id}</td>
                        <td class="fw-medium">${item.name}</td>
                        <td class="text-muted small">${item.description || 'Sem descrição'}</td>
                        <td class="fw-bold text-success">${price}</td>
                    </tr>
                `;
            });
            tableBody.innerHTML = html;
        }

    } catch (error) {
        console.error(error);
        document.getElementById('itemsEmptyMessage').innerHTML = '<span class="text-danger">Erro ao carregar itens.</span>';
    }
}
