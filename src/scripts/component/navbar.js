class Navbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <nav class="navbar  navbar-dark bg-dark px-5">
            <h6><a class="navbar-brand" href="">COINFO</a></h6>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
            </div>
            </div>
            <div class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" id="search-input" type="search" placeholder="Cari nama koin" aria-label="Search">
            </div>
        </nav>
        `;
    }

}

customElements.define('nav-bar', Navbar);