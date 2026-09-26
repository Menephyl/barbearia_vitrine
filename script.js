// --- Mock Data ---
const products = [
    {
        id: 1,
        name: "HyperX Cloud Alpha",
        category: "perifericos",
        price: 599.90,
        image: "https://images.pexels.com/photos/7862594/pexels-photo-7862594.jpeg?auto=compress&cs=tinysrgb&w=600",
        rating: 4.8,
        description: "Headset Gamer com drivers de câmara dupla e conforto premiado."
    },
    {
        id: 2,
        name: "Logitech G Pro X Superlight",
        category: "perifericos",
        price: 899.00,
        image: "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600",
        rating: 4.9,
        description: "Mouse sem fio ultraleve projetado para e-sports."
    },
    {
        id: 3,
        name: "Razer BlackWidow V4",
        category: "perifericos",
        price: 1299.99,
        image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600",
        rating: 4.7,
        description: "Teclado mecânico com switches verdes e iluminação Chroma RGB."
    },
    {
        id: 4,
        name: "NVIDIA RTX 4080 Super",
        category: "hardware",
        price: 8599.00,
        image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=600",
        rating: 5.0,
        description: "Placa de vídeo de última geração para jogos em 4K."
    },
    {
        id: 5,
        name: "Monitor Alienware 360Hz",
        category: "hardware",
        price: 3499.00,
        image: "https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=600",
        rating: 4.8,
        description: "Monitor gamer Full HD com taxa de atualização insana."
    },
    {
        id: 6,
        name: "Cadeira Gamer Secretlab",
        category: "acessorios",
        price: 2899.00,
        image: "https://images.pexels.com/photos/7858744/pexels-photo-7858744.jpeg?auto=compress&cs=tinysrgb&w=600",
        rating: 4.9,
        description: "Conforto ergonômico premium para longas sessões."
    },
    {
        id: 7,
        name: "Elgato Stream Deck",
        category: "acessorios",
        price: 1199.00,
        image: "https://images.pexels.com/photos/340152/pexels-photo-340152.jpeg?auto=compress&cs=tinysrgb&w=600",
        rating: 4.6,
        description: "Controlador de conteúdo avançado para streamers."
    },
    {
        id: 8,
        name: "SSD NVMe Samsung 2TB",
        category: "hardware",
        price: 999.00,
        image: "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=600",
        rating: 4.9,
        description: "Armazenamento ultrarrápido para load times instantâneos."
    }
];

// --- State ---
let cart = JSON.parse(localStorage.getItem('nexus_cart')) || [];
let activeCategory = 'all';

// --- DOM Elements ---
const productGrid = document.getElementById('productGrid');
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalValue = document.getElementById('cartTotalValue');
const toast = document.getElementById('toast');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartUI();
    setupEventListeners();
});

// --- Core Functions ---

function renderProducts(items) {
    productGrid.innerHTML = items.map(product => `
        <div class="card" data-aos="fade-up">
            <div class="card-img-wrapper">
                <span class="card-badge">Novo</span>
                <img src="${product.image}" alt="${product.name}" class="card-img" loading="lazy">
            </div>
            <div class="card-body">
                <span class="card-category">${product.category}</span>
                <h3 class="card-title">${product.name}</h3>
                <div class="stars">★★★★★ <span style="font-size:0.8rem; color:var(--text-muted)">(${product.rating})</span></div>
                <div class="card-price">R$ ${product.price.toFixed(2)}</div>
                <div class="card-actions">
                    <button class="btn btn-primary btn-block" onclick="addToCart(${product.id})">
                        Comprar
                    </button>
                    <button class="btn-icon" onclick="openQuickView(${product.id})" title="Espiar">
                        <i class='bx bx-show'></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`Adicionado: ${product.name}`);

    // Open cart automatically on add
    cartOverlay.classList.add('open');
    cartSidebar.classList.add('open');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    // Update Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Update List
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Seu carrinho está vazio.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)} x ${item.quantity}</div>
                    <div class="cart-item-remove" onclick="removeFromCart(${item.id})">Remover</div>
                </div>
            </div>
        `).join('');
    }

    // Update Total
    const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalValue.innerText = `R$ ${totalValue.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('nexus_cart', JSON.stringify(cart));
}

function showToast(message) {
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Quick View Modal ---
window.openQuickView = (id) => {
    const product = products.find(p => p.id === id);
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');

    content.innerHTML = `
        <img src="${product.image}" style="width:100%; border-radius:8px;">
        <div class="modal-info">
            <h2>${product.name}</h2>
            <p style="color:var(--text-muted); margin-bottom:1rem;">${product.description}</p>
            <span class="modal-price">R$ ${product.price.toFixed(2)}</span>
            <button class="btn btn-primary btn-block" onclick="addToCart(${product.id}); document.getElementById('quickViewModal').classList.remove('open');">
                Adicionar ao Carrinho
            </button>
        </div>
    `;
    modal.classList.add('open');
}

document.getElementById('closeQuickView').addEventListener('click', () => {
    document.getElementById('quickViewModal').classList.remove('open');
});

// --- Filters & Sort ---
function filterProducts() {
    let filtered = products;

    // Category
    if (activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === activeCategory);
    }

    // Search
    const query = searchInput.value.toLowerCase();
    if (query) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
    }

    // Sort
    const sortValue = sortSelect.value;
    if (sortValue === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered);
}

// --- Event Listeners ---
function setupEventListeners() {
    // Cart Toggle
    cartBtn.addEventListener('click', () => {
        cartOverlay.classList.add('open');
        cartSidebar.classList.add('open');
    });

    closeCart.addEventListener('click', () => {
        cartOverlay.classList.remove('open');
        cartSidebar.classList.remove('open');
    });

    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove('open');
            cartSidebar.classList.remove('open');
        }
    });

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            activeCategory = btn.dataset.category;
            filterProducts();

            // Update Title
            const titleMap = {
                'all': 'Destaques',
                'perifericos': 'Periféricos',
                'hardware': 'Hardware',
                'acessorios': 'Acessórios'
            };
            document.getElementById('categoryTitle').innerText = titleMap[activeCategory];
        });
    });

    // Search
    document.getElementById('searchBtn').addEventListener('click', filterProducts);
    searchInput.addEventListener('input', filterProducts);

    // Sort
    sortSelect.addEventListener('change', filterProducts);
}

// Global scope for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
