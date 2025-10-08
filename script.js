// ===== SISTEMA PRINCIPAL DA APLICAÇÃO =====

class SyntaxLabsApp {
    constructor() {
        this.currentUser = null;
        this.currentLanguage = null;
        this.currentTab = 'inicio';
        this.theme = localStorage.getItem('theme') || 'dark';
        this.userProgress = this.loadUserProgress();
        
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.setupTabSystem();
        this.loadUserData();
        this.createParticles();
        this.createCodeAnimation();
        this.initializeCharts();
    }

    loadTheme() {
        document.body.setAttribute('data-theme', this.theme);
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
    }

    setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // Botão de entrar/juntar-se
        const joinButton = document.getElementById('joinButton');
        if (joinButton) {
            joinButton.addEventListener('click', () => {
                this.openProfileModal();
            });
        }

        // Botão de login no header
        const headerLoginBtn = document.getElementById('headerLoginBtn');
        if (headerLoginBtn) {
            headerLoginBtn.addEventListener('click', () => {
                if (this.currentUser) {
                    this.showUserMenu();
                } else {
                    this.openProfileModal();
                }
            });
        }

        // Toggle de tema
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Modal de perfil
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                this.closeProfileModal();
            });
        }

        // Fechar modal ao clicar fora
        const profileModal = document.getElementById('profileModal');
        if (profileModal) {
            profileModal.addEventListener('click', (e) => {
                if (e.target === profileModal) {
                    this.closeProfileModal();
                }
            });
        }

        // Tecla ESC para fechar modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Formulários de login e cadastro
        this.setupAuthForms();

        // Relatórios
        const generateFullReport = document.getElementById('generateFullReport');
        if (generateFullReport) {
            generateFullReport.addEventListener('click', () => {
                this.generateFullReport();
            });
        }

        const generateReportBtn = document.getElementById('generateReportBtn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => {
                this.generateCodeReport();
            });
        }

        // Filtros de relatório
        const reportPeriod = document.getElementById('reportPeriod');
        const reportType = document.getElementById('reportType');
        if (reportPeriod && reportType) {
            reportPeriod.addEventListener('change', () => this.updateCharts());
            reportType.addEventListener('change', () => this.updateCharts());
        }
    }

    setupTabSystem() {
        console.log('Configurando sistema de abas...');
        
        // Navegação por abas
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('Links encontrados:', navLinks.length);
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                console.log('Clicou na aba:', tabId);
                this.switchTab(tabId);
            });
        });

        // Ativar aba inicial
        this.switchTab('inicio');

        // Carregar dados iniciais
        this.loadRanking();
    }

    switchTab(tabId) {
        console.log('Trocando para aba:', tabId);
        
        // Remover active de todas as abas e links
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Ativar aba e link selecionados
        const targetTab = document.getElementById(tabId);
        const targetLink = document.querySelector(`[data-tab="${tabId}"]`);
        
        console.log('Target Tab:', targetTab);
        console.log('Target Link:', targetLink);
        
        if (targetTab) {
            targetTab.classList.add('active');
            console.log('Aba ativada:', tabId);
        } else {
            console.error('Aba não encontrada:', tabId);
        }
        
        if (targetLink) {
            targetLink.classList.add('active');
            console.log('Link ativado:', tabId);
        } else {
            console.error('Link não encontrado para aba:', tabId);
        }

        this.currentTab = tabId;

        // Executar ações específicas da aba
        this.onTabChange(tabId);
    }

    onTabChange(tabId) {
        console.log('Aba alterada para:', tabId);
        
        switch(tabId) {
            case 'programacao':
                this.initializeProgrammingSystem();
                break;
            case 'ranking':
                this.loadRanking();
                break;
            case 'aprendizados':
                this.loadProgressData();
                break;
            case 'relatorios':
                this.loadReportsData();
                break;
            case 'perfil':
                this.loadProfileData();
                break;
            case 'sobre':
                this.loadAboutData();
                break;
            case 'inicio':
                this.createCodeAnimation();
                break;
        }
    }

    initializeProgrammingSystem() {
        if (!window.advancedProgrammingSystem) {
            window.advancedProgrammingSystem = new AdvancedProgrammingSystem(this);
        }
        // Carregar linguagens baseado no status do usuário
        window.advancedProgrammingSystem.loadLanguages(this.currentUser);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
        
        this.createCodeAnimation();
        this.updateCharts();
    }

    // Animação do nome SyntaxLabs com códigos
    createCodeAnimation() {
        const logo = document.querySelector('.logo');
        if (!logo) return;

        // Remover animação anterior
        const existingAnimation = logo.querySelector('.code-animation');
        if (existingAnimation) {
            existingAnimation.remove();
        }

        const animationContainer = document.createElement('div');
        animationContainer.className = 'code-animation';
        
        const codeSnippets = [
            'function syntax() {',
            'const labs = "awesome";',
            'console.log("Syntax Labs");',
            'if (code) { learn(); }',
            'for (let i = 0; i < 10; i++)',
            'class SyntaxLabs {',
            'import { Code } from "syntax"',
            'def learn():',
            'print("Python")',
            '<div className="labs">',
            'public static void main',
            'System.out.println',
            '<?php echo "Labs"; ?>',
            'SELECT * FROM syntax',
            'git commit -m "feat"',
            'docker build -t labs',
            'npm start syntax',
            'python3 labs.py',
            'java -version',
            'node syntax.js'
        ];

        for (let i = 0; i < 12; i++) {
            const codeLine = document.createElement('div');
            codeLine.className = 'code-line';
            codeLine.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            codeLine.style.cssText = `
                position: absolute;
                color: ${this.theme === 'dark' ? 'rgba(74, 144, 226, 0.5)' : 'rgba(74, 144, 226, 0.4)'};
                font-family: 'Courier New', monospace;
                font-size: ${Math.random() * 10 + 8}px;
                white-space: nowrap;
                animation: floatCode ${Math.random() * 20 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                left: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.6 + 0.2};
                z-index: -1;
                font-weight: bold;
                text-shadow: 0 0 10px rgba(74, 144, 226, 0.3);
            `;
            animationContainer.appendChild(codeLine);
        }

        logo.appendChild(animationContainer);
    }

    // Sistema de Modal de Perfil
    openProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
            this.setupProfileOptions();
        }
    }

    closeProfileModal() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    closeAllModals() {
        this.closeProfileModal();
        document.querySelectorAll('.login-page').forEach(page => {
            page.style.display = 'none';
        });
        document.body.classList.remove('modal-open');
    }

    setupProfileOptions() {
        const profileOptions = document.querySelectorAll('.profile-option');
        profileOptions.forEach(option => {
            option.addEventListener('click', () => {
                const profile = option.getAttribute('data-profile');
                this.selectProfile(profile);
            });
        });
    }

    selectProfile(profile) {
        this.closeProfileModal();
        
        setTimeout(() => {
            if (!document.getElementById(profile + 'Login')) {
                this.createAuthPages(profile);
            }
            
            const loginPage = document.getElementById(profile + 'Login');
            if (loginPage) {
                loginPage.style.display = 'flex';
                document.body.classList.add('modal-open');
            }
        }, 300);
    }

    createAuthPages(profileType) {
        const title = profileType.charAt(0).toUpperCase() + profileType.slice(1);
        const subtitle = this.getProfileSubtitle(profileType);

        const loginHTML = `
            <div class="login-page" id="${profileType}Login">
                <div class="login-content">
                    <span class="close-modal" onclick="app.closeLoginPage('${profileType}Login')">&times;</span>
                    <h2 class="login-title">Login do ${title}</h2>
                    <p class="login-subtitle">${subtitle}</p>
                    
                    <form class="login-form" id="${profileType}LoginForm">
                        <div class="form-group">
                            <label for="${profileType}-email"><i class="fas fa-envelope"></i> E-mail</label>
                            <input type="email" id="${profileType}-email" name="email" placeholder="seu@email.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="${profileType}-password"><i class="fas fa-lock"></i> Senha</label>
                            <input type="password" id="${profileType}-password" name="password" placeholder="Sua senha" required>
                        </div>
                        
                        <button type="submit" class="login-button">ENTRAR NA PLATAFORMA</button>
                    </form>
                    
                    <button class="toggle-form" onclick="app.showRegisterForm('${profileType}')">
                        Primeira vez aqui? Cadastre-se
                    </button>
                    
                    <button class="back-button" onclick="app.closeLoginPage('${profileType}Login')">
                        <i class="fas fa-arrow-left"></i> Voltar
                    </button>
                </div>
            </div>
        `;

        const registerHTML = `
            <div class="login-page" id="${profileType}Register">
                <div class="login-content">
                    <span class="close-modal" onclick="app.closeLoginPage('${profileType}Register')">&times;</span>
                    <h2 class="login-title">Cadastro de ${title}</h2>
                    <p class="login-subtitle">${subtitle}</p>
                    
                    <form class="login-form" id="${profileType}RegisterForm">
                        <div class="form-group">
                            <label for="${profileType}-register-name"><i class="fas fa-user"></i> Nome Completo</label>
                            <input type="text" id="${profileType}-register-name" name="name" placeholder="Seu nome completo" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="${profileType}-register-email"><i class="fas fa-envelope"></i> E-mail</label>
                            <input type="email" id="${profileType}-register-email" name="email" placeholder="seu@email.com" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="${profileType}-register-password"><i class="fas fa-lock"></i> Senha</label>
                            <input type="password" id="${profileType}-register-password" name="password" placeholder="Crie uma senha segura" required minlength="6">
                        </div>
                        
                        <div class="form-group">
                            <label for="${profileType}-register-confirm-password"><i class="fas fa-lock"></i> Confirmar Senha</label>
                            <input type="password" id="${profileType}-register-confirm-password" name="confirmPassword" placeholder="Digite novamente sua senha" required>
                        </div>
                        
                        <button type="submit" class="login-button">CRIAR CONTA</button>
                    </form>
                    
                    <button class="toggle-form" onclick="app.showLoginForm('${profileType}')">
                        Já tem uma conta? Faça login
                    </button>
                    
                    <button class="back-button" onclick="app.closeLoginPage('${profileType}Register')">
                        <i class="fas fa-arrow-left"></i> Voltar
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', loginHTML);
        document.body.insertAdjacentHTML('beforeend', registerHTML);
        this.setupAuthHandlers(profileType);
    }

    getProfileSubtitle(profile) {
        const subtitles = {
            'estudante': 'Comece sua jornada na programação com cursos interativos',
            'profissional': 'Aprimore suas skills e aprenda novas tecnologias',
            'empresa': 'Capacite sua equipe com nossos planos corporativos'
        };
        return subtitles[profile] || 'Acesse a plataforma';
    }

    setupAuthForms() {
        // Login do Estudante (já existe no HTML)
        const estudanteLoginForm = document.getElementById('estudanteLoginForm');
        if (estudanteLoginForm) {
            estudanteLoginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin('estudante');
            });
        }

        // Cadastro do Estudante (já existe no HTML)
        const estudanteRegisterForm = document.getElementById('estudanteRegisterForm');
        if (estudanteRegisterForm) {
            estudanteRegisterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister('estudante');
            });
        }
    }

    setupAuthHandlers(profileType) {
        const loginForm = document.getElementById(profileType + 'LoginForm');
        const registerForm = document.getElementById(profileType + 'RegisterForm');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(profileType);
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(profileType);
            });
        }
    }

    handleLogin(profileType) {
        const formData = this.getFormData(profileType + 'LoginForm');
        
        if (!this.validateLoginForm(formData)) {
            return;
        }

        this.performLogin(profileType, formData);
    }

    handleRegister(profileType) {
        const formData = this.getFormData(profileType + 'RegisterForm');
        
        if (!this.validateRegisterForm(formData)) {
            return;
        }

        this.performRegister(profileType, formData);
    }

    getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};
        
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    validateLoginForm(data) {
        if (!data.email || !data.password) {
            this.showAlert('Por favor, preencha todos os campos.', 'error');
            return false;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showAlert('Por favor, insira um e-mail válido.', 'error');
            return false;
        }
        
        return true;
    }

    validateRegisterForm(data) {
        const requiredFields = ['name', 'email', 'password', 'confirmPassword'];
        for (let field of requiredFields) {
            if (!data[field]) {
                this.showAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
                return false;
            }
        }

        if (!this.isValidEmail(data.email)) {
            this.showAlert('Por favor, insira um e-mail válido.', 'error');
            return false;
        }

        if (data.password.length < 6) {
            this.showAlert('A senha deve ter pelo menos 6 caracteres.', 'error');
            return false;
        }

        if (data.password !== data.confirmPassword) {
            this.showAlert('As senhas não coincidem.', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async performLogin(profileType, data) {
        try {
            this.showLoading('Fazendo login...');
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.currentUser = {
                id: Date.now(),
                name: data.name || profileType.charAt(0).toUpperCase() + profileType.slice(1),
                email: data.email,
                profile: profileType,
                ...this.getProfileSpecificData(profileType)
            };
            
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            localStorage.setItem('authToken', 'simulated-token');
            
            this.hideLoading();
            this.showAlert('Login realizado com sucesso! 🎉', 'success');
            
            this.closeLoginPage(profileType + 'Login');
            this.updateUIAfterLogin();
            
        } catch (error) {
            this.hideLoading();
            this.showAlert('Erro ao fazer login. Tente novamente.', 'error');
        }
    }

    async performRegister(profileType, data) {
        try {
            this.showLoading('Criando sua conta...');
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.hideLoading();
            this.showAlert('Conta criada com sucesso! 🎉', 'success');
            
            this.showLoginForm(profileType);
            
        } catch (error) {
            this.hideLoading();
            this.showAlert('Erro ao criar conta. Tente novamente.', 'error');
        }
    }

    getProfileSpecificData(profileType) {
        const specificData = {
            profissional: {
                level: 'Pleno',
                points: 2000,
                specialty: 'Fullstack'
            },
            empresa: {
                plan: 'Corporate',
                employees: '51-200'
            },
            estudante: {
                level: 5,
                points: 1250
            }
        };
        
        return specificData[profileType] || {};
    }

    showLoginForm(profileType) {
        this.closeAllModals();
        setTimeout(() => {
            const loginPage = document.getElementById(profileType + 'Login');
            if (loginPage) {
                loginPage.style.display = 'flex';
                document.body.classList.add('modal-open');
            }
        }, 300);
    }

    showRegisterForm(profileType) {
        this.closeAllModals();
        setTimeout(() => {
            const registerPage = document.getElementById(profileType + 'Register');
            if (registerPage) {
                registerPage.style.display = 'flex';
                document.body.classList.add('modal-open');
            }
        }, 300);
    }

    closeLoginPage(pageId) {
        const page = document.getElementById(pageId);
        if (page) {
            page.style.display = 'none';
        }
        document.body.classList.remove('modal-open');
    }

    // Sistema de Ranking
    loadRanking() {
        const ranking = [
            { name: 'Ana Silva', points: 2850, level: 'Lenda', avatar: '👩‍💻' },
            { name: 'João Santos', points: 2420, level: 'Mestre', avatar: '👨‍💻' },
            { name: 'Maria Costa', points: 2180, level: 'Avançado', avatar: '👩‍🎓' },
            { name: 'Pedro Oliveira', points: 1950, level: 'Avançado', avatar: '👨‍🎓' },
            { name: 'Carla Rodrigues', points: 1720, level: 'Intermediário', avatar: '👩‍🔧' }
        ];

        const list = document.getElementById('rankingList');
        if (list) {
            list.innerHTML = ranking.map((user, index) => `
                <div class="ranking-item">
                    <span class="rank">${index + 1}º</span>
                    <span class="user-avatar">${user.avatar}</span>
                    <div class="user-info">
                        <strong>${user.name}</strong>
                        <span>${user.points} pontos • ${user.level}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(user.points / 3000) * 100}%"></div>
                    </div>
                </div>
            `).join('');

            this.setupRankingFilters();
        }
    }

    setupRankingFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.textContent;
                this.showAlert(`Ranking filtrado por: ${filter}`, 'info');
            });
        });
    }

    // Sistema de Progresso
    loadProgressData() {
        if (!this.currentUser) {
            this.showLoginPrompt();
            return;
        }
        this.updateProgressUI();
    }

    updateProgressUI() {
        if (!this.currentUser) {
            this.showLoginPrompt();
            return;
        }

        const userLevel = this.currentUser?.level || 1;
        const userPoints = this.currentUser?.points || 0;
        
        const levelElement = document.querySelector('.level');
        if (levelElement) {
            levelElement.textContent = userLevel;
        }
        
        const progressElement = document.querySelector('.level-progress .progress');
        if (progressElement) {
            const progressPercent = (userPoints % 1000) / 10;
            progressElement.style.width = `${progressPercent}%`;
            
            // Atualizar texto do progresso
            const progressText = progressElement.parentElement?.nextElementSibling;
            if (progressText) {
                progressText.textContent = `${progressPercent}% para o nível ${userLevel + 1}`;
            }
        }
        
        // Atualizar conquistas baseadas no nível do usuário
        this.updateAchievements();
    }

    updateAchievements() {
        const achievementsContainer = document.querySelector('.achievements');
        if (!achievementsContainer) return;
        
        const userLevel = this.currentUser?.level || 1;
        const userPoints = this.currentUser?.points || 0;
        
        const achievements = [
            { 
                icon: 'fas fa-code', 
                name: 'Primeiro Programa',
                unlocked: userPoints > 0
            },
            { 
                icon: 'fas fa-bug', 
                name: 'Caçador de Bugs',
                unlocked: userLevel >= 3
            },
            { 
                icon: 'fas fa-rocket', 
                name: 'Programador Jr',
                unlocked: userLevel >= 5
            },
            { 
                icon: 'fas fa-medal', 
                name: 'Mestre do Código',
                unlocked: userLevel >= 8
            }
        ];
        
        achievementsContainer.innerHTML = achievements.map(achievement => `
            <div class="achievement ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <i class="${achievement.icon} achievement-icon ${achievement.unlocked ? 'unlocked' : 'locked'}"></i>
                <span>${achievement.name} ${achievement.unlocked ? '✅' : '🔒'}</span>
            </div>
        `).join('');
    }

    // Sistema de Login/Logout
    updateUIAfterLogin() {
        const loginBtn = document.getElementById('headerLoginBtn');
        if (loginBtn) {
            loginBtn.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.name}`;
            loginBtn.onclick = () => this.showUserMenu();
        }
        
        // Atualizar todas as abas que podem conter conteúdo de login
        this.updateProgressUI();
        this.loadProgressData();
        
        // Recarregar linguagens se estiver na aba de programação
        if (this.currentTab === 'programacao' && window.advancedProgrammingSystem) {
            window.advancedProgrammingSystem.loadLanguages(this.currentUser);
        }
        
        // Atualizar perfil se estiver na aba de perfil
        if (this.currentTab === 'perfil') {
            this.loadProfileData();
        }
        
        // Atualizar relatórios se estiver na aba de relatórios
        if (this.currentTab === 'relatorios') {
            this.loadReportsData();
        }
        
        // Forçar atualização da aba atual
        this.onTabChange(this.currentTab);
        
        this.showAlert(`Bem-vindo de volta, ${this.currentUser.name}! 🎉`, 'success');
    }

    showUserMenu() {
        // Remover menu anterior se existir
        const existingMenu = document.querySelector('.user-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const loginBtn = document.getElementById('headerLoginBtn');
        if (!loginBtn) return;

        const menuHTML = `
            <div class="user-menu">
                <div class="user-menu-item" onclick="app.showProfile()">
                    <i class="fas fa-user"></i> Meu Perfil
                </div>
                <div class="user-menu-item" onclick="app.logout()">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </div>
            </div>
        `;
        
        const menu = document.createElement('div');
        menu.innerHTML = menuHTML;
        menu.className = 'user-menu';
        menu.style.cssText = `
            position: absolute;
            top: 70px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 10px 0;
            min-width: 180px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 1000;
            backdrop-filter: blur(15px);
        `;

        document.body.appendChild(menu);

        // Fechar menu ao clicar fora
        setTimeout(() => {
            const closeMenu = (e) => {
                if (!menu.contains(e.target) && e.target !== loginBtn) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            document.addEventListener('click', closeMenu);
        }, 100);
    }

    showProfile() {
        this.switchTab('perfil');
        // Remover menu
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.remove();
        }
    }

    logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            
            const loginBtn = document.getElementById('headerLoginBtn');
            if (loginBtn) {
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> ENTRAR';
                loginBtn.onclick = () => this.openProfileModal();
            }
            
            // Remover menu de usuário
            const userMenu = document.querySelector('.user-menu');
            if (userMenu) {
                userMenu.remove();
            }
            
            // Recarregar linguagens se estiver na aba de programação
            if (this.currentTab === 'programacao' && window.advancedProgrammingSystem) {
                window.advancedProgrammingSystem.loadLanguages(this.currentUser);
            }
            
            this.showAlert('Logout realizado com sucesso! 👋', 'info');
            this.switchTab('inicio');
        }
    }

    // Sistema de Progresso do Usuário
    loadUserProgress() {
        const savedProgress = localStorage.getItem('userProgress');
        if (savedProgress) {
            return JSON.parse(savedProgress);
        }
        
        // Progresso padrão
        return {
            linesOfCode: 1250,
            challengesCompleted: 24,
            studyTime: 45, // horas
            level: 5,
            languages: {
                'JavaScript': { progress: 85, challenges: 12 },
                'Python': { progress: 70, challenges: 8 },
                'HTML': { progress: 90, challenges: 10 },
                'CSS': { progress: 80, challenges: 6 },
                'Java': { progress: 60, challenges: 4 }
            },
            dailyActivity: this.generateDailyActivity(),
            challengePerformance: {
                successRate: 85,
                averageTime: 12,
                complexity: 60
            }
        };
    }

    generateDailyActivity() {
        const activity = [];
        for (let i = 0; i < 7; i++) {
            activity.push(Math.floor(Math.random() * 120) + 30); // 30-150 minutos
        }
        return activity;
    }

    saveUserProgress() {
        localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
    }

    // Sistema de Relatórios
    initializeCharts() {
        this.createLanguageProgressChart();
        this.createDailyActivityChart();
    }

    createLanguageProgressChart() {
        const ctx = document.getElementById('languageProgressChart');
        if (!ctx) return;

        const languageData = this.userProgress.languages;
        const languages = Object.keys(languageData);
        const progress = Object.values(languageData).map(lang => lang.progress);

        // Destruir chart anterior se existir
        if (this.languageChart) {
            this.languageChart.destroy();
        }

        this.languageChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: languages,
                datasets: [{
                    label: 'Progresso (%)',
                    data: progress,
                    backgroundColor: [
                        'rgba(74, 144, 226, 0.8)',
                        'rgba(155, 81, 224, 0.8)',
                        'rgba(66, 220, 219, 0.8)',
                        'rgba(255, 170, 0, 0.8)',
                        'rgba(0, 255, 136, 0.8)'
                    ],
                    borderColor: [
                        'rgba(74, 144, 226, 1)',
                        'rgba(155, 81, 224, 1)',
                        'rgba(66, 220, 219, 1)',
                        'rgba(255, 170, 0, 1)',
                        'rgba(0, 255, 136, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: this.theme === 'dark' ? '#ffffff' : '#2d3748'
                        },
                        grid: {
                            color: this.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: this.theme === 'dark' ? '#ffffff' : '#2d3748'
                        },
                        grid: {
                            color: this.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: this.theme === 'dark' ? '#ffffff' : '#2d3748'
                        }
                    }
                }
            }
        });
    }

    createDailyActivityChart() {
        const ctx = document.getElementById('dailyActivityChart');
        if (!ctx) return;

        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const activity = this.userProgress.dailyActivity;

        // Destruir chart anterior se existir
        if (this.dailyActivityChart) {
            this.dailyActivityChart.destroy();
        }

        this.dailyActivityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Minutos de Estudo',
                    data: activity,
                    borderColor: 'rgba(74, 144, 226, 1)',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: this.theme === 'dark' ? '#ffffff' : '#2d3748'
                        },
                        grid: {
                            color: this.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: this.theme === 'dark' ? '#ffffff' : '#2d3748'
                        },
                        grid: {
                            color: this.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: this.theme === 'dark' ? '#ffffff' : '#2d3748'
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        this.createLanguageProgressChart();
        this.createDailyActivityChart();
    }

    loadReportsData() {
        if (!this.currentUser) {
            this.showLoginPromptReports();
            return;
        }
        this.updateCharts();
    }

    showLoginPromptReports() {
        const reportsContainer = document.querySelector('.reports-container');
        if (reportsContainer) {
            reportsContainer.innerHTML = `
                <div class="login-prompt" style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-chart-bar" style="font-size: 4rem; margin-bottom: 20px; color: #4a90e2;"></i>
                    <h3 style="color: #4a90e2; margin-bottom: 15px;">Acesse Relatórios Detalhados</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 25px; max-width: 500px; margin-left: auto; margin-right: auto;">
                        Faça login para desbloquear relatórios completos do seu progresso, análises de desempenho e recomendações personalizadas.
                    </p>
                    <button onclick="app.openProfileModal()" style="padding: 12px 30px; background: #4a90e2; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 16px;">
                        <i class="fas fa-sign-in-alt"></i> Fazer Login para Acessar
                    </button>
                </div>
            `;
        }
    }

    generateFullReport() {
        if (!this.currentUser) {
            this.showAlert('Faça login para gerar relatórios completos.', 'warning');
            return;
        }

        const reportContent = this.createReportContent();
        this.showReportModal(reportContent);
    }

    generateCodeReport() {
        if (!window.advancedProgrammingSystem || !window.advancedProgrammingSystem.currentLanguage) {
            this.showAlert('Selecione uma linguagem e escreva algum código primeiro.', 'warning');
            return;
        }

        const code = document.getElementById('advancedCodeEditor')?.value;
        if (!code || !code.trim()) {
            this.showAlert('Escreva algum código para gerar o relatório.', 'warning');
            return;
        }

        const reportContent = this.createCodeAnalysisReport(code);
        this.showReportModal(reportContent);
    }

    createReportContent() {
        const progress = this.userProgress;
        const languages = progress.languages;
        
        return `
            <div class="report-header">
                <h2>Relatório de Progresso - Syntax Labs</h2>
                <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div class="report-section">
                <h3>📊 Estatísticas Gerais</h3>
                <div class="report-stats">
                    <div class="report-stat">
                        <span class="stat-number">${progress.linesOfCode}</span>
                        <span class="stat-label">Linhas de Código</span>
                    </div>
                    <div class="report-stat">
                        <span class="stat-number">${progress.challengesCompleted}</span>
                        <span class="stat-label">Desafios Concluídos</span>
                    </div>
                    <div class="report-stat">
                        <span class="stat-number">${progress.studyTime}h</span>
                        <span class="stat-label">Tempo de Estudo</span>
                    </div>
                    <div class="report-stat">
                        <span class="stat-number">Nível ${progress.level}</span>
                        <span class="stat-label">Nível Atual</span>
                    </div>
                </div>
            </div>

            <div class="report-section">
                <h3>🚀 Progresso por Linguagem</h3>
                <div class="languages-progress">
                    ${Object.entries(languages).map(([lang, data]) => `
                        <div class="language-progress-item">
                            <span class="language-name">${lang}</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${data.progress}%"></div>
                            </div>
                            <span class="progress-value">${data.progress}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="report-section">
                <h3>🎯 Desempenho em Desafios</h3>
                <div class="performance-stats">
                    <div class="performance-item">
                        <span>Taxa de Sucesso</span>
                        <span class="performance-value">${progress.challengePerformance.successRate}%</span>
                    </div>
                    <div class="performance-item">
                        <span>Tempo Médio</span>
                        <span class="performance-value">${progress.challengePerformance.averageTime}min</span>
                    </div>
                    <div class="performance-item">
                        <span>Nível de Complexidade</span>
                        <span class="performance-value">${progress.challengePerformance.complexity >= 70 ? 'Avançado' : progress.challengePerformance.complexity >= 40 ? 'Intermediário' : 'Iniciante'}</span>
                    </div>
                </div>
            </div>

            <div class="report-section">
                <h3>💡 Recomendações</h3>
                <div class="recommendations-list">
                    <div class="recommendation-item">
                        <i class="fas fa-arrow-up"></i>
                        <span>Foque em praticar Python para aumentar seu progresso atual de 70%</span>
                    </div>
                    <div class="recommendation-item">
                        <i class="fas fa-clock"></i>
                        <span>Estude por pelo menos 45 minutos diários para melhor consistência</span>
                    </div>
                    <div class="recommendation-item">
                        <i class="fas fa-project-diagram"></i>
                        <span>Inicie um projeto prático para aplicar seus conhecimentos</span>
                    </div>
                </div>
            </div>

            <div class="report-footer">
                <p><strong>Syntax Labs</strong> - Transformando desenvolvedores em experts</p>
                <p>Relatório gerado automaticamente pela plataforma</p>
            </div>
        `;
    }

    createCodeAnalysisReport(code) {
        const lines = code.split('\n').length;
        const words = code.split(/\s+/).length;
        const characters = code.length;
        const language = window.advancedProgrammingSystem.currentLanguage;

        // Análise básica do código
        const hasComments = code.includes('//') || code.includes('/*') || code.includes('#');
        const hasFunctions = code.includes('function') || code.includes('def ') || code.includes('void');
        const hasLoops = code.includes('for') || code.includes('while') || code.includes('forEach');
        
        let complexity = 'Baixa';
        if (lines > 50) complexity = 'Alta';
        else if (lines > 20) complexity = 'Média';

        return `
            <div class="report-header">
                <h2>Relatório de Análise de Código</h2>
                <p>Linguagem: ${language} | Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div class="report-section">
                <h3>📈 Métricas do Código</h3>
                <div class="code-metrics">
                    <div class="metric">
                        <span class="metric-label">Linhas de Código</span>
                        <span class="metric-value">${lines}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Palavras</span>
                        <span class="metric-value">${words}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Caracteres</span>
                        <span class="metric-value">${characters}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Complexidade</span>
                        <span class="metric-value">${complexity}</span>
                    </div>
                </div>
            </div>

            <div class="report-section">
                <h3>🔍 Análise Estrutural</h3>
                <div class="structural-analysis">
                    <div class="analysis-item ${hasComments ? 'positive' : 'warning'}">
                        <i class="fas fa-${hasComments ? 'check' : 'exclamation'}"></i>
                        <span>${hasComments ? 'Possui comentários' : 'Adicione comentários'}</span>
                    </div>
                    <div class="analysis-item ${hasFunctions ? 'positive' : 'warning'}">
                        <i class="fas fa-${hasFunctions ? 'check' : 'exclamation'}"></i>
                        <span>${hasFunctions ? 'Usa funções/métodos' : 'Considere usar funções'}</span>
                    </div>
                    <div class="analysis-item ${hasLoops ? 'positive' : 'info'}">
                        <i class="fas fa-${hasLoops ? 'check' : 'info'}"></i>
                        <span>${hasLoops ? 'Utiliza estruturas de repetição' : 'Pode usar loops para repetição'}</span>
                    </div>
                </div>
            </div>

            <div class="report-section">
                <h3>💡 Sugestões de Melhoria</h3>
                <div class="improvement-suggestions">
                    <div class="suggestion">
                        <i class="fas fa-lightbulb"></i>
                        <span>Adicione mais comentários para explicar a lógica complexa</span>
                    </div>
                    <div class="suggestion">
                        <i class="fas fa-code"></i>
                        <span>Considere dividir o código em funções menores e mais específicas</span>
                    </div>
                    <div class="suggestion">
                        <i class="fas fa-shield-alt"></i>
                        <span>Implemente tratamento de erros para tornar o código mais robusto</span>
                    </div>
                </div>
            </div>

            <div class="report-section">
                <h3>📝 Próximos Passos</h3>
                <div class="next-steps">
                    <div class="step">
                        <i class="fas fa-rocket"></i>
                        <span>Teste o código com diferentes entradas</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-bug"></i>
                        <span>Procure e corrija possíveis bugs</span>
                    </div>
                    <div class="step">
                        <i class="fas fa-expand"></i>
                        <span>Expanda a funcionalidade com novos recursos</span>
                    </div>
                </div>
            </div>
        `;
    }

    showReportModal(content) {
        const modal = document.getElementById('reportModal');
        const reportContent = document.getElementById('reportContent');
        
        if (modal && reportContent) {
            reportContent.innerHTML = content;
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
        }
    }

    closeReportModal() {
        const modal = document.getElementById('reportModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    printReport() {
        window.print();
    }

    downloadReport() {
        this.showAlert('Funcionalidade de download em desenvolvimento!', 'info');
    }

    showLoginPrompt() {
        const progressGrid = document.querySelector('.progress-grid');
        if (progressGrid) {
            progressGrid.innerHTML = `
                <div class="login-prompt" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <i class="fas fa-user-lock" style="font-size: 3rem; margin-bottom: 20px; color: #4a90e2;"></i>
                    <h3 style="color: #4a90e2; margin-bottom: 15px;">Faça login para ver seu progresso</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 25px;">Acompanhe sua evolução, conquistas e atividades recentes.</p>
                    <button onclick="app.openProfileModal()" style="padding: 12px 30px; background: #4a90e2; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold;">
                        <i class="fas fa-sign-in-alt"></i> Fazer Login
                    </button>
                </div>
            `;
        }
    }

    // ===== MÉTODOS DO PERFIL =====

    loadProfileData() {
        if (!this.currentUser) {
            this.showLoginPromptProfile();
            return;
        }
        
        this.updateProfileUI();
        this.loadProfileSettings();
    }

    updateProfileUI() {
        // Informações básicas
        document.getElementById('profileUserName').textContent = this.currentUser.name;
        document.getElementById('profileUserEmail').textContent = this.currentUser.email;
        document.getElementById('profileName').value = this.currentUser.name;
        document.getElementById('profileEmail').value = this.currentUser.email;
        document.getElementById('profileType').value = this.currentUser.profile.charAt(0).toUpperCase() + this.currentUser.profile.slice(1);
        
        // Data de cadastro
        const joinDate = new Date(this.currentUser.id).toLocaleDateString('pt-BR');
        document.getElementById('profileJoinDate').value = joinDate;
        
        // Estatísticas
        document.getElementById('profilePoints').textContent = this.currentUser.points || 0;
        document.getElementById('profileLevel').textContent = `Nível ${this.currentUser.level || 1}`;
        document.getElementById('profileRole').textContent = this.currentUser.profile.charAt(0).toUpperCase() + this.currentUser.profile.slice(1);
        
        // Progresso
        const progress = this.userProgress;
        document.getElementById('statLines').textContent = progress.linesOfCode;
        document.getElementById('statHours').textContent = `${progress.studyTime}h`;
        document.getElementById('statCompleted').textContent = `${Math.round((progress.challengesCompleted / 50) * 100)}%`;
        document.getElementById('statRank').textContent = '#42';
        
        document.getElementById('profileChallenges').textContent = progress.challengesCompleted;
        document.getElementById('profileLanguages').textContent = Object.keys(progress.languages).length;
        
        // Linguagens
        this.loadProfileLanguages();
    }

    loadProfileLanguages() {
        const grid = document.getElementById('profileLanguagesGrid');
        if (!grid) return;
        
        const languages = this.userProgress.languages;
        
        grid.innerHTML = Object.entries(languages).map(([lang, data]) => `
            <div class="language-progress-card">
                <div class="language-icon">
                    <i class="${this.getLanguageIcon(lang)}"></i>
                </div>
                <div class="language-info">
                    <h4>${lang}</h4>
                    <p>${data.progress}% concluído</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${data.progress}%"></div>
                    </div>
                </div>
                <div class="language-stats">
                    <span>${data.challenges} desafios</span>
                </div>
            </div>
        `).join('');
    }

    getLanguageIcon(language) {
        const icons = {
            'JavaScript': 'fab fa-js',
            'Python': 'fab fa-python',
            'HTML': 'fab fa-html5',
            'CSS': 'fab fa-css3-alt',
            'Java': 'fab fa-java',
            'PHP': 'fab fa-php',
            'C++': 'fas fa-code',
            'MySQL': 'fas fa-database',
            'Node.js': 'fab fa-node-js',
            'Lua': 'fas fa-moon',
            'Assembly': 'fas fa-microchip'
        };
        
        return icons[language] || 'fas fa-code';
    }

    loadProfileSettings() {
        // Carregar configurações salvas
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        
        document.getElementById('emailNotifications').checked = settings.emailNotifications !== false;
        document.getElementById('darkMode').checked = settings.darkMode || this.theme === 'dark';
        document.getElementById('aiAssistance').checked = settings.aiAssistance !== false;
        
        // Event listeners para configurações
        document.getElementById('emailNotifications').addEventListener('change', (e) => {
            this.saveSetting('emailNotifications', e.target.checked);
        });
        
        document.getElementById('darkMode').addEventListener('change', (e) => {
            this.saveSetting('darkMode', e.target.checked);
            if (e.target.checked) {
                this.theme = 'dark';
            } else {
                this.theme = 'light';
            }
            this.loadTheme();
        });
        
        document.getElementById('aiAssistance').addEventListener('change', (e) => {
            this.saveSetting('aiAssistance', e.target.checked);
        });
    }

    saveSetting(key, value) {
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        settings[key] = value;
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }

    showLoginPromptProfile() {
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer) {
            profileContainer.innerHTML = `
                <div class="login-prompt" style="text-align: center; padding: 60px 20px;">
                    <i class="fas fa-user" style="font-size: 4rem; margin-bottom: 20px; color: #4a90e2;"></i>
                    <h3 style="color: #4a90e2; margin-bottom: 15px;">Acesse seu Perfil</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 25px; max-width: 500px; margin-left: auto; margin-right: auto;">
                        Faça login para gerenciar suas informações, configurações e acompanhar seu progresso detalhado.
                    </p>
                    <button onclick="app.openProfileModal()" style="padding: 12px 30px; background: #4a90e2; color: white; border: none; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 16px;">
                        <i class="fas fa-sign-in-alt"></i> Fazer Login
                    </button>
                </div>
            `;
        }
    }

    // Métodos de ações do perfil
    editField(fieldId) {
        const input = document.getElementById(fieldId);
        if (input.hasAttribute('readonly')) {
            input.removeAttribute('readonly');
            input.focus();
            input.style.borderColor = '#4a90e2';
        } else {
            input.setAttribute('readonly', 'true');
            input.style.borderColor = '';
            
            // Salvar alteração
            if (fieldId === 'profileName') {
                this.currentUser.name = input.value;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.updateUIAfterLogin();
            }
        }
    }

    changeAvatar() {
        this.showAlert('Funcionalidade de alteração de avatar em desenvolvimento!', 'info');
    }

    exportData() {
        const userData = {
            user: this.currentUser,
            progress: this.userProgress,
            settings: JSON.parse(localStorage.getItem('userSettings') || '{}'),
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `syntax-labs-data-${new Date().getTime()}.json`;
        link.click();
        
        this.showAlert('Dados exportados com sucesso! 📥', 'success');
    }

    resetProgress() {
        if (confirm('Tem certeza que deseja reiniciar todo o seu progresso? Esta ação não pode ser desfeita.')) {
            this.userProgress = {
                linesOfCode: 0,
                challengesCompleted: 0,
                studyTime: 0,
                level: 1,
                languages: {},
                dailyActivity: [0, 0, 0, 0, 0, 0, 0],
                challengePerformance: {
                    successRate: 0,
                    averageTime: 0,
                    complexity: 0
                }
            };
            
            this.saveUserProgress();
            this.updateProfileUI();
            this.showAlert('Progresso reiniciado com sucesso! 🔄', 'success');
        }
    }

    deleteAccount() {
        if (confirm('ATENÇÃO: Esta ação irá excluir permanentemente sua conta e todos os dados. Tem certeza?')) {
            if (confirm('Digite "EXCLUIR" para confirmar:') === 'EXCLUIR') {
                this.logout();
                localStorage.removeItem('userProgress');
                localStorage.removeItem('userSettings');
                localStorage.removeItem('userAdvancedCode');
                this.showAlert('Conta excluída com sucesso. Esperamos vê-lo novamente! 👋', 'info');
            }
        }
    }

    loadAboutData() {
        console.log('Carregando dados sobre...');
    }

    showAlert(message, type = 'info') {
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">&times;</button>
        `;
        
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#00ff88' : type === 'warning' ? '#ffaa00' : '#4a90e2'};
            color: ${type === 'success' ? '#000' : '#fff'};
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 15px;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            font-weight: 600;
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }

    showLoading(message = 'Carregando...') {
        console.log('Loading:', message);
    }

    hideLoading() {
        console.log('Loading complete');
    }

    // Efeitos Visuais
    createParticles() {
        const particlesContainer = document.querySelector('.tech-bg');
        if (!particlesContainer) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: #4a90e2;
                border-radius: 50%;
                animation: float ${Math.random() * 10 + 5}s linear infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.3 + 0.1};
            `;
            particlesContainer.appendChild(particle);
        }
    }

    loadUserData() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUIAfterLogin();
        }
    }
}

// ===== SISTEMA DE PROGRAMAÇÃO AVANÇADO =====

class AdvancedProgrammingSystem {
    constructor(app) {
        this.app = app;
        this.currentLanguage = null;
        this.currentTheme = 'dark';
        this.codeHistory = [];
        this.isSaved = true;
        this.aiContext = [];
        this.pasteHandler = null;
        this.observer = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupLineNumbers();
        this.setupAI();
    }

    setupEventListeners() {
        console.log('Configurando event listeners do sistema de programação...');
        
        // Botões de ação
        const runButton = document.getElementById('runButton');
        if (runButton) runButton.addEventListener('click', () => this.runCode());
        
        const saveButton = document.getElementById('saveButton');
        if (saveButton) saveButton.addEventListener('click', () => this.saveCode());
        
        const clearButton = document.getElementById('clearButton');
        if (clearButton) clearButton.addEventListener('click', () => this.clearCode());
        
        const aiHelpButton = document.getElementById('aiHelpButton');
        if (aiHelpButton) aiHelpButton.addEventListener('click', () => this.getAIHelp());
        
        const clearConsole = document.getElementById('clearConsole');
        if (clearConsole) clearConsole.addEventListener('click', () => this.clearConsole());
        
        const editorTheme = document.getElementById('editorTheme');
        if (editorTheme) editorTheme.addEventListener('click', () => this.toggleEditorTheme());
        
        const sendAiQuestion = document.getElementById('sendAiQuestion');
        if (sendAiQuestion) sendAiQuestion.addEventListener('click', () => this.sendAIQuestion());

        // Entrada de texto da IA
        const aiQuestion = document.getElementById('aiQuestion');
        if (aiQuestion) {
            aiQuestion.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendAIQuestion();
            });
        }

        // Monitoramento do editor
        const editor = document.getElementById('advancedCodeEditor');
        if (editor) {
            editor.addEventListener('input', () => {
                this.onCodeChange();
                this.updateLineNumbers();
            });

            editor.addEventListener('keydown', (e) => {
                this.handleKeyDown(e);
            });

            editor.addEventListener('scroll', () => {
                this.syncLineNumbersScroll();
            });
        }

        // Filtro de dificuldade
        const difficultyFilter = document.getElementById('difficultyFilter');
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', (e) => {
                this.filterChallenges(e.target.value);
            });
        }
    }

    loadLanguages(user = null) {
        console.log('Carregando linguagens para usuário:', user);
        
        // Linguagens básicas para usuários não logados
        const basicLanguages = [
            { 
                name: 'JavaScript', 
                icon: 'fab fa-js', 
                description: 'Linguagem de programação web',
                extension: 'js',
                starterCode: `// Bem-vindo ao JavaScript!
// Escreva seu código abaixo e clique em Executar

function saudacao(nome) {
    return \\\`Olá, \\\${nome}! Bem-vindo ao Syntax Labs.\\\`;
}

// Exemplo de uso
console.log(saudacao("Programador"));

// Desafio: Crie uma função que some dois números
function somar(a, b) {
    return a + b;
}

// Teste sua função
console.log("Soma:", somar(5, 3));`
            },
            { 
                name: 'Python', 
                icon: 'fab fa-python', 
                description: 'Linguagem versátil e poderosa',
                extension: 'py',
                starterCode: `# Bem-vindo ao Python!
# Escreva seu código abaixo e clique em Executar

def saudacao(nome):
    return f"Olá, {nome}! Bem-vindo ao Syntax Labs."

# Exemplo de uso
print(saudacao("Programador"))

# Desafio: Crie uma função que some dois números
def somar(a, b):
    return a + b

# Teste sua função
print("Soma:", somar(5, 3))`
            },
            { 
                name: 'HTML', 
                icon: 'fab fa-html5', 
                description: 'Linguagem de marcação web',
                extension: 'html',
                starterCode: `<!DOCTYPE html>
<html>
<head>
    <title>Meu Primeiro Site</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-align: center;
            padding: 50px;
        }
    </style>
</head>
<body>
    <h1>🚀 Bem-vindo ao Syntax Labs!</h1>
    <p>Este é seu primeiro arquivo HTML.</p>
</body>
</html>`
            },
            { 
                name: 'CSS', 
                icon: 'fab fa-css3-alt', 
                description: 'Estilização para web',
                extension: 'css',
                starterCode: `/* Bem-vindo ao CSS! */
/* Estilize sua página web aqui */

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.button {
    background: #4a90e2;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.button:hover {
    background: #357abd;
}`
            },
            { 
                name: 'Java', 
                icon: 'fab fa-java', 
                description: 'Linguagem enterprise',
                extension: 'java',
                starterCode: `// Bem-vindo ao Java!
// Escreva seu código abaixo

public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, Syntax Labs!");
        
        // Desafio: Crie um método que some dois números
        int resultado = somar(5, 3);
        System.out.println("Soma: " + resultado);
    }
    
    public static int somar(int a, int b) {
        return a + b;
    }
}`
            }
        ];

        // Linguagens premium para usuários logados
        const premiumLanguages = [
            ...basicLanguages,
            { 
                name: 'PHP', 
                icon: 'fab fa-php', 
                description: 'Linguagem para web dinâmica',
                extension: 'php',
                starterCode: `<?php
// Bem-vindo ao PHP!
// Escreva seu código abaixo

function saudacao($nome) {
    return "Olá, " . $nome . "! Bem-vindo ao Syntax Labs.";
}

// Exemplo de uso
echo saudacao("Programador");

// Desafio: Crie uma função que some dois números
function somar($a, $b) {
    return $a + $b;
}

// Teste sua função
echo "Soma: " . somar(5, 3);
?>`
            },
            { 
                name: 'C++', 
                icon: 'fas fa-code', 
                description: 'Linguagem de alto desempenho',
                extension: 'cpp',
                starterCode: `// Bem-vindo ao C++!
// Escreva seu código abaixo

#include <iostream>
using namespace std;

string saudacao(string nome) {
    return "Olá, " + nome + "! Bem-vindo ao Syntax Labs.";
}

int somar(int a, int b) {
    return a + b;
}

int main() {
    // Exemplo de uso
    cout << saudacao("Programador") << endl;
    
    // Desafio: Teste a função somar
    cout << "Soma: " << somar(5, 3) << endl;
    
    return 0;
}`
            },
            { 
                name: 'MySQL', 
                icon: 'fas fa-database', 
                description: 'Banco de dados relacional',
                extension: 'sql',
                starterCode: `-- Bem-vindo ao MySQL!
-- Escreva suas queries abaixo

-- Criar um banco de dados
CREATE DATABASE syntax_labs;
USE syntax_labs;

-- Criar uma tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados
INSERT INTO usuarios (nome, email) VALUES 
('João Silva', 'joao@email.com'),
('Maria Santos', 'maria@email.com');

-- Consultar dados
SELECT * FROM usuarios;

-- Desafio: Crie uma query que conte usuários
SELECT COUNT(*) as total_usuarios FROM usuarios;`
            },
            { 
                name: 'Node.js', 
                icon: 'fab fa-node-js', 
                description: 'JavaScript no servidor',
                extension: 'js',
                starterCode: `// Bem-vindo ao Node.js!
// Escreva seu código abaixo

const http = require('http');

function saudacao(nome) {
    return \\\`Olá, \\\${nome}! Bem-vindo ao Syntax Labs.\\\`;
}

// Exemplo de uso
console.log(saudacao("Programador"));

// Desafio: Crie um servidor web simples
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from Syntax Labs!\\n');
});

console.log('Servidor rodando em http://localhost:3000');
// server.listen(3000);`
            },
            { 
                name: 'Lua', 
                icon: 'fas fa-moon', 
                description: 'Linguagem de script leve',
                extension: 'lua',
                starterCode: `-- Bem-vindo ao Lua!
-- Escreva seu código abaixo

function saudacao(nome)
    return "Olá, " .. nome .. "! Bem-vindo ao Syntax Labs."
end

-- Exemplo de uso
print(saudacao("Programador"))

-- Desafio: Crie uma função que some dois números
function somar(a, b)
    return a + b
end

-- Teste sua função
print("Soma:", somar(5, 3))`
            },
            { 
                name: 'Assembly', 
                icon: 'fas fa-microchip', 
                description: 'Linguagem de baixo nível',
                extension: 'asm',
                starterCode: `; Bem-vindo ao Assembly!
; Escreva seu código abaixo

section .data
    hello db 'Olá, Syntax Labs!',0xa
    hello_len equ $ - hello

section .text
    global _start

_start:
    ; Escrever mensagem
    mov eax, 4
    mov ebx, 1
    mov ecx, hello
    mov edx, hello_len
    int 0x80

    ; Sair
    mov eax, 1
    xor ebx, ebx
    int 0x80

; Desafio: Este é um código básico em Assembly NASM
; Tente entender cada instrução!`
            }
        ];

        const languages = user ? premiumLanguages : basicLanguages;
        const grid = document.getElementById('languagesGrid');
        
        if (grid) {
            // Limpar grid e mensagem informativa anterior
            grid.innerHTML = '';
            const existingInfo = document.querySelector('.languages-info');
            if (existingInfo) {
                existingInfo.remove();
            }

            grid.innerHTML = languages.map(lang => {
                const isPremium = !user && premiumLanguages.slice(basicLanguages.length).includes(lang);
                return `
                    <div class="language-card" data-lang="${lang.name}">
                        <i class="${lang.icon}"></i>
                        <h4>${lang.name}</h4>
                        <p>${lang.description}</p>
                        <small>Arquivo .${lang.extension}</small>
                        ${isPremium ? '<div class="premium-badge">PREMIUM</div>' : ''}
                    </div>
                `;
            }).join('');

            // Event listeners para seleção de linguagem
            document.querySelectorAll('.language-card').forEach(card => {
                card.addEventListener('click', () => {
                    const language = card.dataset.lang;
                    const languageData = languages.find(l => l.name === language);
                    
                    // Verificar se é uma linguagem premium para usuário não logado
                    const isPremiumLanguage = premiumLanguages.slice(basicLanguages.length).includes(languageData);
                    if (!user && isPremiumLanguage) {
                        this.showAlert('🔒 Esta linguagem está disponível apenas para usuários cadastrados!', 'warning');
                        return;
                    }
                    
                    this.selectLanguage(language, languageData);
                });
            });

            // Adicionar mensagem informativa apenas se usuário não estiver logado
            if (!user) {
                const infoMessage = document.createElement('div');
                infoMessage.className = 'languages-info';
                infoMessage.innerHTML = `
                    <div class="info-card">
                        <i class="fas fa-crown"></i>
                        <h4>Desbloqueie mais 6 linguagens!</h4>
                        <p>Faça login para acessar PHP, C++, MySQL, Node.js, Lua e Assembly</p>
                        <button class="premium-btn" onclick="app.openProfileModal()">
                            <i class="fas fa-rocket"></i> Fazer Login
                        </button>
                    </div>
                `;
                grid.parentNode.appendChild(infoMessage);
            }
        }
    }

    selectLanguage(languageName, languageData) {
        this.currentLanguage = languageName;
        
        // Atualizar UI
        const currentLanguageElement = document.getElementById('currentLanguage');
        if (currentLanguageElement) currentLanguageElement.textContent = languageName;
        
        const ideContainer = document.getElementById('advancedIdeContainer');
        if (ideContainer) ideContainer.style.display = 'block';
        
        const syntaxInfo = document.getElementById('syntaxInfo');
        if (syntaxInfo) syntaxInfo.textContent = `${languageName} • UTF-8`;
        
        // Carregar código inicial
        const editor = document.getElementById('advancedCodeEditor');
        if (editor && languageData) {
            editor.value = languageData.starterCode;
        }
        
        // Atualizar números de linha
        this.updateLineNumbers();
        this.loadChallenges(languageName);
        
        // Configurar controles de rolagem
        this.setupScrollControls();
        
        // Configurar detecção de largura do código
        this.setupCodeWidthDetection();
        
        // Configurar sincronização de scroll
        this.setupScrollSync();
        
        this.showAlert(`🎉 Ambiente ${languageName} carregado!`, 'success');
    }

    setupLineNumbers() {
        this.updateLineNumbers();
    }

    updateLineNumbers() {
        const editor = document.getElementById('advancedCodeEditor');
        const lineNumbers = document.getElementById('lineNumbers');
        
        if (!editor || !lineNumbers) return;
        
        const lines = editor.value.split('\n').length;
        
        let numbersHTML = '';
        for (let i = 1; i <= lines; i++) {
            numbersHTML += `<div class="line-number">${i}</div>`;
        }
        
        lineNumbers.innerHTML = numbersHTML;
    }

    syncLineNumbersScroll() {
        const editor = document.getElementById('advancedCodeEditor');
        const lineNumbers = document.getElementById('lineNumbers');
        
        if (editor && lineNumbers) {
            lineNumbers.scrollTop = editor.scrollTop;
        }
    }

    setupScrollSync() {
        const editor = document.getElementById('advancedCodeEditor');
        if (editor) {
            editor.addEventListener('scroll', () => {
                this.syncLineNumbersScroll();
            });
        }
    }

    setupScrollControls() {
        const ideContent = document.querySelector('.ide-content-advanced');
        const controlsSidebar = document.getElementById('ideControlsSidebar');
        const scrollIndicator = document.getElementById('scrollIndicator');
        
        if (ideContent && controlsSidebar && scrollIndicator) {
            ideContent.addEventListener('scroll', () => {
                // Mostrar controles quando o usuário rolar
                if (ideContent.scrollTop > 100) {
                    controlsSidebar.classList.add('active');
                    scrollIndicator.classList.add('active');
                } else {
                    controlsSidebar.classList.remove('active');
                    scrollIndicator.classList.remove('active');
                }
            });
            
            // Também mostrar controles quando o mouse entrar na área do IDE
            const ideContainer = document.querySelector('.advanced-ide-container');
            if (ideContainer) {
                ideContainer.addEventListener('mouseenter', () => {
                    controlsSidebar.classList.add('active');
                });
                
                ideContainer.addEventListener('mouseleave', () => {
                    // Manter visível apenas se houver scroll
                    if (ideContent.scrollTop <= 100) {
                        controlsSidebar.classList.remove('active');
                    }
                });
            }
        }
    }

    scrollToTop() {
        const ideContent = document.querySelector('.ide-content-advanced');
        if (ideContent) {
            ideContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    setupCodeWidthDetection() {
        try {
            const editor = document.getElementById('advancedCodeEditor');
            const codeContainer = document.querySelector('.code-editor-container');
            
            if (!codeContainer || !editor) {
                console.log('Elementos não encontrados para detecção de largura');
                return;
            }

            // Criar indicador
            const wideCodeIndicator = document.createElement('div');
            wideCodeIndicator.className = 'wide-code-indicator';
            wideCodeIndicator.textContent = 'CÓDIGO LARGO';
            codeContainer.appendChild(wideCodeIndicator);
            
            const checkCodeWidth = () => {
                try {
                    if (editor.scrollWidth > editor.clientWidth) {
                        codeContainer.classList.add('wide-code');
                        wideCodeIndicator.style.display = 'block';
                    } else {
                        codeContainer.classList.remove('wide-code');
                        wideCodeIndicator.style.display = 'none';
                    }
                } catch (error) {
                    console.error('Erro ao verificar largura:', error);
                }
            };
            
            // Configurar event listeners
            editor.addEventListener('input', checkCodeWidth);
            
            this.pasteHandler = () => {
                setTimeout(checkCodeWidth, 100);
            };
            editor.addEventListener('paste', this.pasteHandler);
            
            window.addEventListener('resize', checkCodeWidth);
            
            // Verificação inicial
            checkCodeWidth();
            
        } catch (error) {
            console.error('Erro em setupCodeWidthDetection:', error);
        }
    }

    onCodeChange() {
        this.isSaved = false;
        const fileStatus = document.getElementById('fileStatus');
        if (fileStatus) {
            fileStatus.textContent = '● Não Salvo';
            fileStatus.style.color = '#ffaa00';
        }
        
        this.updateCursorPosition();
    }

    updateCursorPosition() {
        const editor = document.getElementById('advancedCodeEditor');
        const cursorPosition = document.getElementById('cursorPosition');
        
        if (!editor || !cursorPosition) return;
        
        const text = editor.value.substring(0, editor.selectionStart);
        const lines = text.split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        
        cursorPosition.textContent = `Linha ${line}, Coluna ${column}`;
    }

    handleKeyDown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const editor = e.target;
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            
            editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 4;
            
            this.onCodeChange();
        }
        
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            this.runCode();
        }
        
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            this.saveCode();
        }
    }

    async runCode() {
        const code = document.getElementById('advancedCodeEditor')?.value;
        const output = document.getElementById('advancedConsoleOutput');
        
        if (!code || !code.trim()) {
            this.addConsoleOutput('⚠️ Editor vazio. Escreva algum código primeiro.', 'warning');
            return;
        }
        
        this.addConsoleOutput('🔄 Executando código...', 'info');
        
        try {
            let result;
            
            if (this.currentLanguage === 'JavaScript') {
                result = await this.executeJavaScript(code);
            } else if (this.currentLanguage === 'Python') {
                result = await this.executePython(code);
            } else if (this.currentLanguage === 'HTML') {
                result = await this.executeHTML(code);
            } else if (this.currentLanguage === 'CSS') {
                result = await this.executeCSS(code);
            } else if (this.currentLanguage === 'Java') {
                result = await this.executeJava(code);
            } else if (this.currentLanguage === 'PHP') {
                result = await this.executePHP(code);
            } else if (this.currentLanguage === 'C++') {
                result = await this.executeCpp(code);
            } else if (this.currentLanguage === 'MySQL') {
                result = await this.executeMySQL(code);
            } else if (this.currentLanguage === 'Node.js') {
                result = await this.executeNodeJS(code);
            } else if (this.currentLanguage === 'Lua') {
                result = await this.executeLua(code);
            } else if (this.currentLanguage === 'Assembly') {
                result = await this.executeAssembly(code);
            } else {
                result = '🔧 Execução para esta linguagem em desenvolvimento...';
            }
            
            this.addConsoleOutput(result, 'success');
            
        } catch (error) {
            this.addConsoleOutput(`❌ Erro: ${error.message}`, 'error');
        }
    }

    async executeJavaScript(code) {
        return new Promise((resolve, reject) => {
            try {
                const originalLog = console.log;
                let logs = [];
                
                console.log = (...args) => {
                    logs.push(args.map(arg => 
                        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                    ).join(' '));
                };
                
                const func = new Function(code);
                func();
                
                console.log = originalLog;
                
                const output = logs.length > 0 
                    ? logs.join('\n')
                    : '✅ Código executado com sucesso!';
                
                resolve(output);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    async executePython(code) {
        return `🐍 Simulação de execução Python\n\nSeu código:\n${code}\n\n💡 Dica: Use um ambiente Python para executar.`;
    }

    async executeHTML(code) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(code);
            newWindow.document.close();
            return '🌐 Página HTML aberta em nova janela!';
        } else {
            return '❌ Não foi possível abrir nova janela.';
        }
    }

    async executeCSS(code) {
        return `🎨 Simulação de execução CSS\n\nSeu código CSS:\n${code}\n\n💡 Dica: Use com HTML para ver os estilos aplicados.`;
    }

    async executeJava(code) {
        return `☕ Simulação de execução Java\n\nSeu código:\n${code}\n\n💡 Dica: Compile com javac e execute com java.`;
    }

    async executePHP(code) {
        return `🐘 Simulação de execução PHP\n\nSeu código:\n${code}\n\n💡 Dica: Execute em um servidor web com PHP.`;
    }

    async executeCpp(code) {
        return `⚡ Simulação de execução C++\n\nSeu código:\n${code}\n\n💡 Dica: Compile com g++ e execute o binário.`;
    }

    async executeMySQL(code) {
        return `🗄️ Simulação de execução MySQL\n\nSuas queries:\n${code}\n\n💡 Dica: Execute em um servidor MySQL.`;
    }

    async executeNodeJS(code) {
        return `🟢 Simulação de execução Node.js\n\nSeu código:\n${code}\n\n💡 Dica: Salve como arquivo .js e execute com node.`;
    }

    async executeLua(code) {
        return `🌙 Simulação de execução Lua\n\nSeu código:\n${code}\n\n💡 Dica: Execute com o interpretador Lua.`;
    }

    async executeAssembly(code) {
        return `⚙️ Simulação de execução Assembly\n\nSeu código:\n${code}\n\n💡 Dica: Assembly requer montagem específica.`;
    }

    addConsoleOutput(message, type = 'info') {
        const output = document.getElementById('advancedConsoleOutput');
        if (!output) return;
        
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = message;
        
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
        
        const lines = output.getElementsByClassName('console-line');
        if (lines.length > 100) {
            lines[0].remove();
        }
    }

    clearConsole() {
        const output = document.getElementById('advancedConsoleOutput');
        if (output) {
            output.innerHTML = '<div class="welcome-message"><p>🚀 <strong>Console limpo!</strong></p></div>';
        }
    }

    saveCode() {
        if (!this.currentLanguage) {
            this.showAlert('Selecione uma linguagem primeiro.', 'warning');
            return;
        }
        
        const code = document.getElementById('advancedCodeEditor')?.value;
        if (!code) return;
        
        const userCode = JSON.parse(localStorage.getItem('userAdvancedCode') || '{}');
        
        userCode[this.currentLanguage] = {
            code: code,
            timestamp: new Date().toISOString(),
            language: this.currentLanguage
        };
        
        localStorage.setItem('userAdvancedCode', JSON.stringify(userCode));
        
        this.isSaved = true;
        const fileStatus = document.getElementById('fileStatus');
        if (fileStatus) {
            fileStatus.textContent = '💾 Salvo';
            fileStatus.style.color = '#00ff88';
        }
        
        this.showAlert('✅ Código salvo com sucesso!', 'success');
    }

    clearCode() {
        if (confirm('Tem certeza que deseja limpar o código?')) {
            const editor = document.getElementById('advancedCodeEditor');
            if (editor) {
                editor.value = '';
                this.updateLineNumbers();
                this.addConsoleOutput('🧹 Editor limpo!', 'info');
            }
        }
    }

    toggleEditorTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        const editorContainer = document.querySelector('.editor-container');
        
        if (editorContainer) {
            if (this.currentTheme === 'light') {
                editorContainer.style.filter = 'invert(1) hue-rotate(180deg)';
                const editorTheme = document.getElementById('editorTheme');
                if (editorTheme) editorTheme.innerHTML = '<i class="fas fa-sun"></i> Tema';
            } else {
                editorContainer.style.filter = 'none';
                const editorTheme = document.getElementById('editorTheme');
                if (editorTheme) editorTheme.innerHTML = '<i class="fas fa-moon"></i> Tema';
            }
        }
    }

    // Sistema de IA
    setupAI() {
        this.aiContext = [
            {
                role: "system",
                content: "Você é um assistente de programação especializado em ajudar desenvolvedores."
            }
        ];
    }

    async getAIHelp() {
        const code = document.getElementById('advancedCodeEditor')?.value;
        
        if (!code || !code.trim()) {
            this.showAlert('Escreva algum código primeiro.', 'warning');
            return;
        }
        
        this.addAIMessage('Analisando seu código...', 'ai', 'analyzing');
        
        try {
            const analysis = await this.analyzeCode(code);
            this.addAIMessage(analysis, 'ai', 'analysis');
        } catch (error) {
            this.addAIMessage('Erro ao analisar o código.', 'ai', 'error');
        }
    }

    async analyzeCode(code) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const analysis = `🤖 **Análise do seu código:**
                
📊 **Estatísticas:**
• ${code.split('\n').length} linhas de código
• ${code.split(' ').length} palavras

💡 **Sugestões:**
1. Adicione comentários para explicar lógica complexa
2. Use nomes descritivos para variáveis
3. Continue praticando! 🚀`;
                
                resolve(analysis);
            }, 2000);
        });
    }

    addAIMessage(message, sender = 'ai', type = 'info') {
        const aiMessages = document.getElementById('aiMessages');
        if (!aiMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${type}`;
        
        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>${message.replace(/\n/g, '</p><p>')}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-avatar">👤</div>
                <div class="message-content">
                    <p>${message}</p>
                </div>
            `;
        }
        
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    async sendAIQuestion() {
        const aiQuestion = document.getElementById('aiQuestion');
        if (!aiQuestion || !aiQuestion.value.trim()) return;
        
        const question = aiQuestion.value;
        aiQuestion.value = '';
        
        this.addAIMessage(question, 'user');
        this.addAIMessage('Processando sua pergunta...', 'ai', 'analyzing');
        
        try {
            const response = await this.getAIResponse(question);
            this.addAIMessage(response, 'ai', 'response');
        } catch (error) {
            this.addAIMessage('Erro ao processar sua pergunta.', 'ai', 'error');
        }
    }

    async getAIResponse(question) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const responses = [
                    `💡 **Resposta para:** "${question}"\n\nSugestões:\n1. Valide entradas do usuário\n2. Use nomes descritivos\n3. Teste com diferentes casos`,
                    `🎯 **Sobre:** "${question}"\n\nRecomendações:\n• Revise a documentação\n• Teste diferentes casos\n• Considere tratamento de erros`
                ];
                
                resolve(responses[Math.floor(Math.random() * responses.length)]);
            }, 1500);
        });
    }

    loadChallenges(language) {
        const challengesGrid = document.getElementById('challengesGrid');
        if (!challengesGrid) return;
        
        const challenges = this.getChallengesForLanguage(language);
        
        if (challenges.length === 0) {
            challengesGrid.innerHTML = '<div class="no-challenges">Nenhum desafio disponível.</div>';
            return;
        }
        
        challengesGrid.innerHTML = challenges.map(challenge => `
            <div class="challenge-card-advanced" onclick="advancedProgrammingSystem.loadChallenge('${challenge.id}')">
                <h5>${challenge.title}</h5>
                <p>${challenge.description}</p>
                <div class="challenge-meta">
                    <span class="challenge-difficulty ${challenge.difficultyClass}">${challenge.difficulty}</span>
                    <span class="challenge-points">${challenge.points} pontos</span>
                </div>
            </div>
        `).join('');
    }

    getChallengesForLanguage(language) {
        const challenges = {
            'JavaScript': [
                {
                    id: 'js-1',
                    title: 'Calculadora Simples',
                    description: 'Crie uma calculadora básica.',
                    difficulty: 'Iniciante',
                    difficultyClass: 'difficulty-iniciante',
                    points: 100
                },
                {
                    id: 'js-2',
                    title: 'Validador de Formulário',
                    description: 'Valide dados de formulário.',
                    difficulty: 'Intermediário',
                    difficultyClass: 'difficulty-intermediario',
                    points: 200
                }
            ],
            'Python': [
                {
                    id: 'py-1',
                    title: 'Jogo da Forca',
                    description: 'Desenvolva o jogo da forca.',
                    difficulty: 'Iniciante',
                    difficultyClass: 'difficulty-iniciante',
                    points: 150
                },
                {
                    id: 'py-2',
                    title: 'Análise de Dados',
                    description: 'Analise um conjunto de dados.',
                    difficulty: 'Avançado',
                    difficultyClass: 'difficulty-avancado',
                    points: 300
                }
            ],
            'HTML': [
                {
                    id: 'html-1',
                    title: 'Portfólio Pessoal',
                    description: 'Crie seu portfólio online.',
                    difficulty: 'Iniciante',
                    difficultyClass: 'difficulty-iniciante',
                    points: 100
                }
            ],
            'CSS': [
                {
                    id: 'css-1',
                    title: 'Layout Responsivo',
                    description: 'Crie um layout que se adapte a diferentes telas.',
                    difficulty: 'Intermediário',
                    difficultyClass: 'difficulty-intermediario',
                    points: 180
                }
            ],
            'Java': [
                {
                    id: 'java-1',
                    title: 'Sistema Bancário',
                    description: 'Simule operações bancárias básicas.',
                    difficulty: 'Intermediário',
                    difficultyClass: 'difficulty-intermediario',
                    points: 250
                }
            ]
        };
        
        return challenges[language] || [];
    }

    loadChallenge(challengeId) {
        this.showAlert(`Desafio ${challengeId} carregado!`, 'info');
        
        const challengeCode = `// Desafio: ${challengeId}
// Implemente sua solução abaixo

console.log("Boa sorte! 🚀");`;
        
        const editor = document.getElementById('advancedCodeEditor');
        if (editor) {
            editor.value = challengeCode;
            this.updateLineNumbers();
        }
    }

    filterChallenges(difficulty) {
        this.showAlert(`Filtrando por: ${difficulty}`, 'info');
    }

    showAlert(message, type = 'info') {
        if (window.app && typeof window.app.showAlert === 'function') {
            window.app.showAlert(message, type);
        } else {
            console.log(`${type}: ${message}`);
        }
    }
}

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Carregado - Inicializando Syntax Labs...');
    window.app = new SyntaxLabsApp();
    
    window.openChatBot = function() {
        window.app.showAlert('Chatbot em desenvolvimento! 🤖', 'info');
    };
});