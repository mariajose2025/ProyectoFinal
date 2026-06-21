<script>
  import { link, push } from 'svelte-spa-router';
  import { currentUser } from '../../stores/auth';
  import { isAdmin } from '../../utils/permissions';
  import { logout } from '../../services/authService';

  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  async function handleLogout() {
    await logout();
    menuOpen = false;
    push('/');
  }
</script>

<nav class="navbar">
  <div class="navbar-brand">
    <a href="/" use:link class="navbar-logo">
      <img src="/logo.png" alt="Tienda La Cigarra" class="logo-img" />
    </a>
    <button class="menu-toggle" on:click={toggleMenu} aria-label="Menú">
      <span class="hamburger" class:open={menuOpen}></span>
    </button>
  </div>

  {#if $currentUser}
    <div class="navbar-menu" class:active={menuOpen}>
      <div class="nav-section">
        <span class="nav-section-title"><i class="fa-solid fa-house"></i> General</span>
        <a href="/admin" use:link class="nav-link" on:click={() => menuOpen = false}>Inicio</a>
        <a href="/nosotros" use:link class="nav-link" on:click={() => menuOpen = false}>Nosotros</a>
      </div>

      <div class="nav-section">
        <span class="nav-section-title"><i class="fa-solid fa-box-open"></i> Inventario</span>
        <a href="/admin/productos" use:link class="nav-link" on:click={() => menuOpen = false}>Productos</a>
        <a href="/admin/categorias" use:link class="nav-link" on:click={() => menuOpen = false}>Clasificación</a>
        <a href="/admin/proveedores" use:link class="nav-link" on:click={() => menuOpen = false}>Proveedores</a>
      </div>

      <div class="nav-section">
        <span class="nav-section-title"><i class="fa-solid fa-cart-shopping"></i> Operaciones</span>
        <a href="/admin/compras" use:link class="nav-link" on:click={() => menuOpen = false}>Compras</a>
        <a href="/admin/ventas" use:link class="nav-link" on:click={() => menuOpen = false}>Ventas</a>
        <a href="/admin/clientes" use:link class="nav-link" on:click={() => menuOpen = false}>Clientes</a>
        <a href="/admin/fiados" use:link class="nav-link" on:click={() => menuOpen = false}>Fiados</a>
      </div>

      {#if isAdmin($currentUser)}
        <div class="nav-section">
          <span class="nav-section-title"><i class="fa-solid fa-gear"></i> Administración</span>
          <a href="/admin/usuarios" use:link class="nav-link" on:click={() => menuOpen = false}>Usuarios</a>
          <a href="/admin/roles" use:link class="nav-link" on:click={() => menuOpen = false}>Roles</a>
          <a href="/admin/configuracion" use:link class="nav-link" on:click={() => menuOpen = false}>Configuración</a>
        </div>
      {/if}

      <div class="nav-section">
        <span class="nav-section-title"><i class="fa-solid fa-user"></i> Cuenta</span>
        <a href="/perfil" use:link class="nav-link" on:click={() => menuOpen = false}>Mi Perfil</a>
        <button class="btn-logout" on:click={handleLogout}><i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesión</button>
      </div>
    </div>
  {/if}
</nav>

<style>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #B31A1A;
    color: white;
    padding: 0.75rem 1rem;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .navbar-brand {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navbar-logo {
    display: flex;
    align-items: center;
  }

  .logo-img {
    height: 38px;
    width: auto;
    border-radius: 6px;
  }

  .menu-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .hamburger {
    display: block;
    width: 22px;
    height: 2px;
    background: #F2C12E;
    position: relative;
    transition: all 0.3s;
  }

  .hamburger::before,
  .hamburger::after {
    content: '';
    position: absolute;
    width: 22px;
    height: 2px;
    background: #F2C12E;
    transition: all 0.3s;
  }

  .hamburger::before { top: -7px; }
  .hamburger::after { top: 7px; }

  .hamburger.open { background: transparent; }
  .hamburger.open::before { transform: rotate(45deg); top: 0; }
  .hamburger.open::after { transform: rotate(-45deg); top: 0; }

  .navbar-menu {
    display: none;
    flex-direction: column;
    padding-top: 1rem;
    gap: 0.15rem;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
  }

  .navbar-menu.active {
    display: flex;
  }

  .nav-section {
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }

  .nav-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .nav-section-title {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    color: #F2C12E;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 0.4rem 0.75rem 0.2rem;
    opacity: 0.8;
  }

  .nav-section-title i {
    width: 16px;
    text-align: center;
  }

  .nav-link {
    color: rgba(255,255,255,0.9);
    text-decoration: none;
    padding: 0.7rem 0.75rem;
    border-radius: 6px;
    font-size: 0.95rem;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin: 0;
  }

  .nav-link:hover {
    background: rgba(242,193,46,0.15);
  }

  .nav-link i {
    width: 18px;
    text-align: center;
    color: #F2C12E;
    font-size: 0.85rem;
  }

  .btn-logout {
    background: rgba(255,255,255,0.1);
    color: white;
    border: 1px solid rgba(255,255,255,0.2);
    padding: 0.6rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: calc(100% - 0.5rem);
    margin: 0.25rem 0.25rem 0;
    justify-content: center;
  }

  .btn-logout:hover {
    background: rgba(255,255,255,0.2);
  }

  @media (min-width: 768px) {
    .menu-toggle { display: none; }

    .navbar {
      display: flex;
      align-items: center;
      padding: 0.6rem 1.5rem;
    }

    .navbar-brand { margin-right: 2rem; }

    .navbar-menu {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-top: 0;
      gap: 0.15rem;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      max-height: none;
      scrollbar-width: none;
    }

    .navbar-menu::-webkit-scrollbar { display: none; }

    .nav-section {
      margin-bottom: 0;
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.2rem;
    }

    .nav-section + .nav-section {
      margin-left: 0.5rem;
      padding-left: 0.75rem;
      border-left: 1px solid rgba(255,255,255,0.2);
    }

    .nav-section-title {
      display: none;
    }

    .nav-link {
      padding: 0.55rem 0.85rem;
      font-size: 0.85rem;
      margin: 0;
      white-space: nowrap;
      border-radius: 6px;
    }

    .nav-link i {
      display: none;
    }

    .btn-logout {
      padding: 0.5rem 0.85rem;
      margin: 0;
      font-size: 0.85rem;
      width: auto;
    }
  }
</style>
