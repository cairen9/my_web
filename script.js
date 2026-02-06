// ==================== 响应式导航菜单 ====================

// 获取DOM元素
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-menu a');

// 移动端菜单切换
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // 阻止页面滚动（当菜单打开时）
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// 点击导航链接后关闭移动端菜单
if (navLinks && navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // 关闭移动端菜单
            if (navToggle) navToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // 更新活动状态
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// 滚动时导航栏效果
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // 添加滚动阴影效果
    if (navbar) {
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // 更新导航链接活动状态（基于滚动位置）
    if (navbar) {
        updateActiveNavLink();
    }
    
    lastScroll = currentScroll;
});

// 更新导航链接活动状态
function updateActiveNavLink() {
    if (!navLinks || navLinks.length === 0) return;
    
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ==================== 主题切换功能 ====================

const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// 检查本地存储中的主题设置
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// 切换主题
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // 应用新主题
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // 保存到本地存储
    localStorage.setItem('theme', newTheme);
    
    // 更新图标
    updateThemeIcon(newTheme);
    
    // 添加过渡动画
    document.body.style.transition = 'background-color 0.3s, color 0.3s';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
});

// 更新主题图标
function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// 检测系统主题偏好（如果用户未手动设置）
if (!savedTheme) {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
}

// ==================== Supabase 配置 ====================

// Supabase 配置
const SUPABASE_URL = 'https://oylnjffrjdjaooeaqtvl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95bG5qZmZyamRqYW9vZWFxdHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTAwMDMsImV4cCI6MjA4NTMyNjAwM30.1V70qcXvATKaBCVtK9sdLGK7-l2cxa4muLonpVGmiM8';

// 动态加载 Supabase 库并初始化
let supabaseClient = null;

async function initSupabase() {
    try {
        // 创建一个脚本来加载 Supabase 库
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
        script.onload = () => {
            try {
                // 使用全局的 supabase 对象
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                console.log('✅ Supabase 客户端初始化成功');
            } catch (error) {
                console.error('❌ Supabase 客户端初始化失败:', error);
            }
        };
        script.onerror = () => {
            console.error('❌ Supabase 库加载失败');
        };
        document.head.appendChild(script);
    } catch (error) {
        console.error('❌ Supabase 初始化失败:', error);
    }
}

// 初始化 Supabase
initSupabase();

// ==================== 全局函数 ====================

// 打开视觉艺术页面（全局函数，供 HTML onclick 调用）
function openVisualArt() {
    window.location.href = 'visual-art/';
}

// ==================== 联系表单验证和提交 ====================

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// 表单验证规则
const validators = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        validate: (value) => {
            if (value.trim().length < 2) {
                return '姓名至少需要2个字符';
            }
            if (value.trim().length > 50) {
                return '姓名不能超过50个字符';
            }
            return '';
        }
    },
    email: {
        required: true,
        validate: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return '请输入有效的邮箱地址';
            }
            return '';
        }
    },
    phone: {
        required: false,
        validate: (value) => {
            if (value.trim() && !/^[\d\s\-+()]+$/.test(value)) {
                return '请输入有效的电话号码';
            }
            return '';
        }
    },
    subject: {
        required: true,
        minLength: 2,
        maxLength: 100,
        validate: (value) => {
            if (value.trim().length < 2) {
                return '主题至少需要2个字符';
            }
            if (value.trim().length > 100) {
                return '主题不能超过100个字符';
            }
            return '';
        }
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 500,
        validate: (value) => {
            if (value.trim().length < 10) {
                return '消息内容至少需要10个字符';
            }
            if (value.trim().length > 500) {
                return '消息内容不能超过500个字符';
            }
            return '';
        }
    }
};

// 实时验证（当用户输入时）
document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
    field.addEventListener('blur', () => {
        validateField(field);
    });

    field.addEventListener('input', () => {
        // 清除错误状态（当用户开始输入时）
        const errorElement = document.getElementById(`${field.id}Error`);
        if (errorElement && errorElement.textContent) {
            field.classList.remove('error');
            errorElement.textContent = '';
        }
    });
});

// 验证单个字段
function validateField(field) {
    const fieldName = field.name;
    const validator = validators[fieldName];
    const errorElement = document.getElementById(`${field.id}Error`);

    // 如果没有对应的错误元素，跳过验证（可选字段可能没有错误提示）
    if (!errorElement) {
        return true;
    }

    // 清除之前的错误状态
    field.classList.remove('error');
    errorElement.textContent = '';

    // 检查必填字段
    if (validator.required && !field.value.trim()) {
        showError(field, errorElement, '此字段为必填项');
        return false;
    }

    // 如果字段有值，运行自定义验证
    if (field.value.trim() && validator.validate) {
        const error = validator.validate(field.value);
        if (error) {
            showError(field, errorElement, error);
            return false;
        }
    }

    return true;
}

// 显示错误信息
function showError(field, errorElement, message) {
    field.classList.add('error');
    errorElement.textContent = message;
}

// 表单提交处理
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
    
    // 验证所有字段
    const fields = contactForm.querySelectorAll('input, textarea');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // 如果验证通过，提交表单
    if (isValid) {
        submitForm();
    }
});

// 提交表单（直接提交到 Supabase）
async function submitForm() {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // 显示加载状态
    submitButton.disabled = true;
    submitButton.textContent = '发送中...';

    try {
        // 检查 Supabase 是否已初始化
        if (!supabaseClient) {
            throw new Error('Supabase 客户端未初始化，请刷新页面重试');
        }

        // 收集表单数据
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim() || null,
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // 插入数据到 Supabase
        const { data, error } = await supabaseClient
            .from('contact_messages')
            .insert([formData])
            .select();

        if (error) {
            throw error;
        }

        console.log('✅ 数据提交成功:', data);

        // 隐藏表单，显示成功消息
        contactForm.style.display = 'none';
        successMessage.classList.remove('hidden');

    } catch (error) {
        console.error('❌ 表单提交失败:', error);

        // 显示错误提示
        alert(`提交失败：${error.message || '未知错误'}\n请稍后重试或联系管理员`);

        // 重置按钮状态
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    } finally {
        // 无论成功或失败，都重置按钮（如果成功，表单已被隐藏）
        if (contactForm.style.display !== 'none') {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
}
}  // 闭合 if (contactForm)

// 重置表单
function resetForm() {
    contactForm.reset();
    contactForm.style.display = 'block';
    successMessage.classList.add('hidden');
    
    // 清除所有错误状态
    document.querySelectorAll('#contactForm .error').forEach(el => {
        el.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
}

// ==================== 页面加载完成后的初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    // 设置初始的导航链接活动状态
    updateActiveNavLink();
    
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 平滑滚动到锚点（兼容性处理）
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ==================== 实用功能 ====================

// 防抖函数（用于优化性能）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数（用于优化滚动事件性能）
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 将节流应用到滚动事件监听
const throttledScroll = throttle(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 100);

window.addEventListener('scroll', throttledScroll);

// 检测设备类型（用于响应式优化）
function isMobile() {
    return window.innerWidth <= 768;
}

function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

function isDesktop() {
    return window.innerWidth > 1024;
}

// 监听窗口大小变化
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // 关闭移动端菜单（如果窗口变大）
        if (!isMobile()) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});

// ==================== 性能优化 ====================

// 懒加载图片（当添加图片时可以使用）
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 添加淡入动画（当元素进入视口时）
function observeElements() {
    const elements = document.querySelectorAll('.about-card, .service-card');
    
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        elementObserver.observe(el);
    });
}

// 初始化动画观察器
document.addEventListener('DOMContentLoaded', observeElements);

console.log('✅ 网站加载完成！');
console.log('🎨 当前主题:', document.documentElement.getAttribute('data-theme') || 'light');
console.log('📱 设备类型:', isMobile() ? '手机' : isTablet() ? '平板' : '桌面');
console.log('🗄️ Supabase 状态:', supabaseClient ? '已连接' : '正在加载...');

// ==================== AI 聊天功能 ====================
class AIChatBot {
    constructor() {
        this.apiKey = (typeof window !== 'undefined' && window.ENV && window.ENV.VITE_IFLOW_API_KEY) ? window.ENV.VITE_IFLOW_API_KEY : 'sk-192e9f7472bf5f5efa593fd9c60b4f51';
        this.apiUrl = 'https://apis.iflow.cn/v1/chat/completions';
        this.model = 'glm-4.6';
        this.chatWindow = null;
        this.chatButton = null;
        this.chatMessages = null;
        this.chatInput = null;
        this.sendButton = null;
        this.init();
    }

    init() {
        this.getElements();
        this.bindEvents();
        console.log('🤖 AI聊天助手已初始化');
    }

    getElements() {
        this.chatButton = document.getElementById('ai-chat-button');
        this.chatWindow = document.getElementById('ai-chat-window');
        this.chatMessages = document.querySelector('.chat-messages');
        this.chatInput = document.getElementById('chat-input-field');
        this.sendButton = document.getElementById('send-message');
    }

    bindEvents() {
        if (!this.chatButton || !this.chatWindow) {
            console.error('AI聊天元素未找到');
            return;
        }

        // 聊天按钮点击事件
        const toggleBtn = document.getElementById('chat-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleChat());
        } else {
            console.error('聊天切换按钮未找到');
        }

        // 关闭按钮
        const closeBtn = document.getElementById('close-chat');
        closeBtn.addEventListener('click', () => this.hideChat());

        // 发送消息
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        const isVisible = this.chatWindow.style.display === 'flex';
        if (isVisible) {
            this.hideChat();
        } else {
            this.showChat();
        }
    }

    showChat() {
        this.chatWindow.style.display = 'flex';
        this.chatWindow.style.flexDirection = 'column';
        this.chatInput.focus();
    }

    hideChat() {
        this.chatWindow.style.display = 'none';
    }

    addMessage(text, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (isError) {
            contentDiv.classList.add('error');
        }
        
        contentDiv.textContent = text;
        messageDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(messageDiv);
        
        // 滚动到底部
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        return messageDiv;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // 添加用户消息
        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // 添加思考中提示
        const thinkingMsg = this.addMessage('AI正在思考...', 'assistant');
        thinkingMsg.classList.add('thinking');

        // 禁用发送按钮
        this.sendButton.disabled = true;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    stream: false,
                    max_tokens: 512,
                    temperature: 0.7,
                    top_p: 0.7,
                    top_k: 50,
                    frequency_penalty: 0.5
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // 移除思考中提示
            thinkingMsg.remove();
            
            // 添加AI回复
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const aiResponse = data.choices[0].message.content;
                this.addMessage(aiResponse, 'assistant');
            } else {
                throw new Error('无效的响应格式');
            }

        } catch (error) {
            console.error('AI请求失败:', error);
            thinkingMsg.remove();
            this.addMessage('抱歉，AI助手暂时无法回复，请稍后再试。', 'assistant', true);
        } finally {
            // 重新启用发送按钮
            this.sendButton.disabled = false;
        }
    }
}

// 页面加载完成后初始化AI聊天机器人
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AIChatBot();
        initVisualArtPage();
    });
} else {
    new AIChatBot();
    initVisualArtPage();
}

// ==================== 视觉艺术页面功能 ====================

// 初始化视觉艺术页面
function initVisualArtPage() {
    if (!window.location.pathname.includes('visual-art')) return;
    
    console.log('🎨 初始化视觉艺术页面');
    
    // 初始化标签页
    initTabs();
    
    // 初始化图片上传
    initImageUpload();
    
    // 初始化画廊
    initGallery();
    
    // 初始化模态框
    initModal();
    
    // 初始化可选字段折叠
    initOptionalFieldsToggle();
}

// 初始化可选字段折叠功能
function initOptionalFieldsToggle() {
    const toggleBtn = document.getElementById('toggleOptionalBtn');
    const optionalFields = document.getElementById('optionalFields');
    
    if (!toggleBtn || !optionalFields) return;
    
    toggleBtn.addEventListener('click', () => {
        const isExpanded = !optionalFields.classList.contains('hidden');
        
        if (isExpanded) {
            // 收起
            optionalFields.classList.add('hidden');
            toggleBtn.classList.remove('expanded');
        } else {
            // 展开
            optionalFields.classList.remove('hidden');
            toggleBtn.classList.add('expanded');
        }
    });
}

// 标签页切换
function initTabs() {
    const submitTab = document.getElementById('submitTab');
    const galleryTab = document.getElementById('galleryTab');
    const submitPanel = document.getElementById('submitPanel');
    const galleryPanel = document.getElementById('galleryPanel');
    
    if (!submitTab || !galleryTab) return;
    
    submitTab.addEventListener('click', () => switchTab('submit'));
    galleryTab.addEventListener('click', () => switchTab('gallery'));
    
    // 加载画廊
    loadGallery();
}

function switchTab(tabName) {
    const submitTab = document.getElementById('submitTab');
    const galleryTab = document.getElementById('galleryTab');
    const submitPanel = document.getElementById('submitPanel');
    const galleryPanel = document.getElementById('galleryPanel');
    
    if (tabName === 'submit') {
        submitTab.classList.add('active');
        galleryTab.classList.remove('active');
        submitPanel.classList.add('active');
        galleryPanel.classList.remove('active');
    } else {
        submitTab.classList.remove('active');
        galleryTab.classList.add('active');
        submitPanel.classList.add('active');
        galleryPanel.classList.remove('active');
        loadGallery(); // 切换到画廊时加载作品
    }
}

// 图片上传功能
function initImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const artImage = document.getElementById('artImage');
    const previewArea = document.getElementById('previewArea');
    const imagePreview = document.getElementById('imagePreview');
    const removeImage = document.getElementById('removeImage');
    
    if (!uploadArea || !artImage) return;
    
    // 点击上传
    uploadArea.addEventListener('click', () => {
        artImage.click();
    });
    
    // 文件选择
    artImage.addEventListener('change', handleImageSelect);
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    
    // 删除图片
    if (removeImage) {
        removeImage.addEventListener('click', removeUploadedImage);
    }
}

function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
        previewImage(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            document.getElementById('artImage').files = files;
            previewImage(file);
        }
    }
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

function previewImage(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('请选择图片文件！');
        return;
    }
    
    // 检查文件大小（5MB限制）
    if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB！');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        const previewArea = document.getElementById('previewArea');
        const uploadArea = document.getElementById('uploadArea');
        
        imagePreview.src = e.target.result;
        previewArea.classList.remove('hidden');
        uploadArea.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function removeUploadedImage() {
    const previewArea = document.getElementById('previewArea');
    const uploadArea = document.getElementById('uploadArea');
    const artImage = document.getElementById('artImage');
    
    previewArea.classList.add('hidden');
    uploadArea.style.display = 'block';
    artImage.value = '';
}

// 表单提交
function initGallery() {
    const artSubmitForm = document.getElementById('artSubmitForm');
    if (artSubmitForm) {
        artSubmitForm.addEventListener('submit', submitArtwork);
    }
}

async function submitArtwork(event) {
    event.preventDefault();
    
    const formData = {
        creatorName: document.getElementById('creatorName').value.trim(),
        artTitle: document.getElementById('artTitle').value.trim(),
        prompt: document.getElementById('prompt').value.trim(),
        aiModel: document.getElementById('aiModel').value,
        artStyle: document.getElementById('artStyle').value.trim(),
        description: document.getElementById('description').value.trim(),
        imageFile: document.getElementById('artImage').files[0]
    };
    
    // 验证必填字段
    const requiredFields = ['prompt'];
    let hasError = false;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        const errorElement = document.getElementById(field + 'Error');
        if (!formData[field] || formData[field] === '') {
            element.classList.add('error');
            if (errorElement) errorElement.textContent = '此字段为必填项';
            hasError = true;
        } else {
            element.classList.remove('error');
            if (errorElement) errorElement.textContent = '';
        }
    });
    
    // 验证图片
    if (!formData.imageFile) {
        const imageError = document.getElementById('artImageError');
        if (imageError) {
            imageError.textContent = '请上传作品图片！';
        }
        hasError = true;
    }
    
    if (hasError) {
        alert('请填写所有必填项并上传图片！');
        return;
    }
    
    // 显示加载状态
    const submitButton = event.target.querySelector('button[type="submit"]');
    const submitText = submitButton.querySelector('.submit-text');
    const loadingText = submitButton.querySelector('.loading-text');
    
    submitButton.disabled = true;
    submitText.style.display = 'none';
    loadingText.style.display = 'inline';
    
    try {
        // 1. 上传图片到 Supabase Storage
        const fileExt = formData.imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabaseClient.storage
            .from('artworks')
            .upload(fileName, formData.imageFile);
        
        if (uploadError) {
            throw new Error('图片上传失败: ' + uploadError.message);
        }
        
        // 2. 获取图片的公开URL
        const { data: { publicUrl: imageUrl } } = supabaseClient.storage
            .from('artworks')
            .getPublicUrl(fileName);
        
        // 3. 提交数据到 Supabase 数据库
        const { error: dbError } = await supabaseClient
            .from('artworks')
            .insert({
                prompt: formData.prompt,
                image_url: imageUrl,
                creator_name: formData.creatorName || '匿名创作者',
                art_title: formData.artTitle || '未命名作品',
                ai_model: formData.aiModel || '未知',
                art_style: formData.artStyle || '',
                description: formData.description || '',
                status: 'pending'
            });
        
        if (dbError) {
            throw new Error('数据提交失败: ' + dbError.message);
        }
        
        // 4. 显示成功消息
        document.getElementById('artSubmitForm').style.display = 'none';
        document.getElementById('successMessage').classList.remove('hidden');
        
        // 5. 重置表单
        setTimeout(() => {
            resetArtForm();
        }, 2000);
        
    } catch (error) {
        console.error('提交失败:', error);
        alert('❌ 提交失败: ' + error.message);
    } finally {
        // 恢复按钮状态
        submitButton.disabled = false;
        submitText.style.display = 'inline';
        loadingText.style.display = 'none';
    }
}

function resetArtForm() {
    document.getElementById('artSubmitForm').reset();
    document.getElementById('artSubmitForm').style.display = 'block';
    document.getElementById('successMessage').classList.add('hidden');
    removeUploadedImage();
}

// 画廊功能
function initModal() {
    const modal = document.getElementById('imageModal');
    const modalClose = document.getElementById('modalClose');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

async function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    try {
        // 从 Supabase 加载作品（只显示已通过的作品）
        const { data: artworks, error } = await supabaseClient
            .from('artworks')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        if (!artworks || artworks.length === 0) {
            galleryGrid.innerHTML = '<div class="no-results"><p>暂无作品，快来提交第一个作品吧！</p></div>';
            return;
        }
        
        renderGallery(artworks);
    } catch (error) {
        console.error('加载失败:', error);
        galleryGrid.innerHTML = '<div class="error"><p>❌ 加载失败，请稍后重试</p></div>';
    }
}

function renderGallery(artworks) {
    const galleryGrid = document.getElementById('galleryGrid');
    
    galleryGrid.innerHTML = artworks.map(artwork => `
        <div class="gallery-item" onclick="openModal('${artwork.id}')">
            <img src="${artwork.image_url}" alt="${artwork.art_title || '作品'}" loading="lazy">
            <div class="gallery-item-info">
                <div class="gallery-item-title">${artwork.art_title || '未命名作品'}</div>
                <div class="gallery-item-creator">by ${artwork.creator_name || '匿名创作者'}</div>
                <div class="gallery-item-style">${artwork.art_style || ''}</div>
                <div class="gallery-item-model">${artwork.ai_model || '未知模型'}</div>
            </div>
        </div>
    `).join('');
}

async function openModal(artworkId) {
    try {
        // 从 Supabase 获取作品详情
        const { data: artwork, error } = await supabaseClient
            .from('artworks')
            .select('*')
            .eq('id', artworkId)
            .single();
        
        if (error || !artwork) {
            console.error('获取作品详情失败:', error);
            return;
        }
        
        // 填充模态框内容
        document.getElementById('modalImage').src = artwork.image_url;
        document.getElementById('modalTitle').textContent = artwork.art_title || '未命名作品';
        document.getElementById('modalCreator').textContent = artwork.creator_name || '匿名创作者';
        document.getElementById('modalModel').textContent = artwork.ai_model || '未知模型';
        document.getElementById('modalStyle').textContent = artwork.art_style || '';
        document.getElementById('modalPrompt').textContent = artwork.prompt;
        
        const descriptionSection = document.getElementById('modalDescriptionSection');
        const descriptionElement = document.getElementById('modalDescription');
        
        if (artwork.description && artwork.description.trim() !== '') {
            descriptionElement.textContent = artwork.description;
            descriptionSection.classList.remove('hidden');
        } else {
            descriptionSection.classList.add('hidden');
        }
        
        document.getElementById('imageModal').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('打开模态框失败:', error);
    }
}

function closeModal() {
    document.getElementById('imageModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 搜索和筛选
function setupSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const styleFilter = document.getElementById('styleFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => filterGallery());
    }
    
    if (styleFilter) {
        styleFilter.addEventListener('change', () => filterGallery());
    }
}

async function filterGallery() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const styleFilter = document.getElementById('styleFilter')?.value || '';
    
    try {
        // 从 Supabase 加载所有已通过的作品
        const { data: artworks, error } = await supabaseClient
            .from('artworks')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        if (!artworks || artworks.length === 0) {
            renderGallery([]);
            return;
        }
        
        // 过滤搜索结果
        const filtered = artworks.filter(artwork => {
            const matchesSearch = !searchTerm || 
                (artwork.art_title && artwork.art_title.toLowerCase().includes(searchTerm)) ||
                (artwork.creator_name && artwork.creator_name.toLowerCase().includes(searchTerm)) ||
                (artwork.description && artwork.description.toLowerCase().includes(searchTerm));
            
            const matchesStyle = !styleFilter || artwork.art_style === styleFilter;
            
            return matchesSearch && matchesStyle;
        });
        
        renderGallery(filtered);
        
        const noResults = document.getElementById('noResults');
        if (filtered.length === 0 && artworks.length > 0) {
            noResults?.classList.remove('hidden');
        } else {
            noResults?.classList.add('hidden');
        }
    } catch (error) {
        console.error('搜索失败:', error);
    }
}

// TODO: 飞书多维表格集成
/*
async function submitToFeishu(artworkData) {
    // 飞书API配置
    const FEISHU_CONFIG = {
        appId: 'your_app_id',           // 需要用户填写
        appSecret: 'your_app_secret',   // 需要用户填写
        appToken: 'your_app_token',     // 需要用户填写
        tableId: 'your_table_id'        // 需要用户填写
    };
    
    try {
        // 1. 获取访问令牌
        const tokenResponse = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                app_id: FEISHU_CONFIG.appId,
                app_secret: FEISHU_CONFIG.appSecret
            })
        });
        
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.tenant_access_token;
        
        // 2. 上传图片到飞书（需要先上传到临时图片服务）
        // ... 图片上传逻辑 ...
        
        // 3. 添加记录到多维表格
        const recordData = {
            fields: {
                "创作者姓名": artworkData.creatorName,
                "作品标题": artworkData.artTitle,
                "AI提示词": artworkData.prompt,
                "AI模型": artworkData.aiModel,
                "作品风格": artworkData.artStyle,
                "创作描述": artworkData.description || '',
                "图片链接": imageUrl,  // 上传后的图片链接
                "创建时间": new Date().toISOString(),
                "状态": "待审核"
            }
        };
        
        const response = await fetch(`https://open.feishu.cn/open-apis/bitables/v1/apps/${FEISHU_CONFIG.appToken}/tables/${FEISHU_CONFIG.tableId}/records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recordData)
        });
        
        const result = await response.json();
        
        if (result.code === 0) {
            console.log('✅ 飞书多维表格提交成功');
            return true;
        } else {
            console.error('❌ 飞书提交失败:', result.msg);
            throw new Error(result.msg);
        }
        
    } catch (error) {
        console.error('飞书API调用失败:', error);
        throw error;
    }
}

async function loadFromFeishu() {
    // 从飞书多维表格加载所有作品
    // 实现分页加载逻辑
}
*/
