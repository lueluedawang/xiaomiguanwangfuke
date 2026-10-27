// ====================== 全局状态 ======================
// 登录状态（localStorage 持久化，刷新不丢失）
let isLogin = localStorage.getItem('isLogin') === 'true';

// 购物车（localStorage 持久化，刷新不丢失）
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 登录拦截：未登录时提示并弹出登录框，返回 false
function requireLogin(tip) {
    if (!isLogin) {
        alert(tip);
        openLoginModal();
        return false;
    }
    return true;
}

// ====================== 页面切换 ======================
function goPage(id) {
    const page = document.getElementById(id);
    if (!page) return;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    page.classList.add('active');
    // 同步顶部导航高亮
    document.querySelectorAll('.nav-menu a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === "javascript:goPage('" + id + "')");
    });
    window.scrollTo(0, 0);
}

// ====================== 首页轮播 ======================
let currentSlide = 0;
function goSlide(index) {
    currentSlide = index;
    document.getElementById('slider').style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
}
setInterval(() => {
    currentSlide = (currentSlide + 1) % 3;
    goSlide(currentSlide);
}, 4000);

// 轮播左右箭头切换
function prevSlide() {
    goSlide((currentSlide + 2) % 3);
}
function nextSlide() {
    goSlide((currentSlide + 1) % 3);
}

// ====================== 限时倒计时（到 0 停止） ======================
function countDown() {
    let time = 86400;
    const timer = setInterval(() => {
        if (time <= 0) {
            clearInterval(timer);
            return;
        }
        time--;
        const h = Math.floor(time / 3600);
        const m = Math.floor((time % 3600) / 60);
        const s = time % 60;
        document.getElementById('h').innerText = String(h).padStart(2, '0');
        document.getElementById('m').innerText = String(m).padStart(2, '0');
        document.getElementById('s').innerText = String(s).padStart(2, '0');
    }, 1000);
}

// ====================== 登录 / 注册弹窗 ======================
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
    switchTab('login');
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function switchTab(tab) {
    const loginBox = document.getElementById('loginBox');
    const regBox = document.getElementById('regBox');
    const tabLogin = document.getElementById('tabLogin');
    const tabReg = document.getElementById('tabReg');

    if (tab === 'login') {
        loginBox.style.display = 'block';
        regBox.style.display = 'none';
        tabLogin.style.color = '#222';
        tabLogin.style.borderBottom = '2px solid #ff6700';
        tabReg.style.color = '#666';
        tabReg.style.borderBottom = 'none';
    } else {
        loginBox.style.display = 'none';
        regBox.style.display = 'block';
        tabReg.style.color = '#222';
        tabReg.style.borderBottom = '2px solid #ff6700';
        tabLogin.style.color = '#666';
        tabLogin.style.borderBottom = 'none';
    }
}

// 密码可见/隐藏切换
function togglePwd(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// 标记登录成功
function markLoginSuccess() {
    isLogin = true;
    localStorage.setItem('isLogin', 'true');
    document.getElementById('loginText').innerText = '已登录';
}

// 登录
function doLogin() {
    const account = document.getElementById('loginAccount').value.trim();
    const pwd = document.getElementById('loginPwd').value.trim();
    const agree = document.getElementById('agreeCheck').checked;

    if (!account) { alert('请输入邮箱/手机号码/小米ID'); return; }
    if (!pwd) { alert('请输入密码'); return; }
    if (!agree) { alert('请先阅读并同意小米账号使用协议和隐私政策'); return; }

    markLoginSuccess();
    alert(`登录成功！\n账号：${account}`);
    closeLoginModal();
}

// 注册
function doReg() {
    const phone = document.getElementById('regPhone').value.trim();
    const code = document.getElementById('regCode').value.trim();
    const pwd = document.getElementById('regPwd').value.trim();

    if (!phone) { alert('请输入手机号码'); return; }
    if (!code) { alert('请输入验证码'); return; }
    if (!pwd) { alert('请设置密码'); return; }
    if (pwd.length < 6) { alert('密码长度不能少于6位'); return; }

    markLoginSuccess();
    alert(`注册成功！\n手机号：${phone}\n已自动登录`);
    closeLoginModal();
}

// 发送验证码（模拟）
function sendCode() {
    const phone = document.getElementById('regPhone').value.trim();
    if (!phone) { alert('请先输入手机号码'); return; }
    alert(`验证码已发送到 ${phone}\n（模拟功能，实际开发需要对接短信接口）`);
}

// 用户协议 / 隐私政策 / 帮助中心
function showUserAgree() {
    alert("《小米账号用户协议》\n\n1. 您注册小米账号即表示同意本协议所有条款；\n2. 账号仅限个人使用，禁止租借、售卖、共用；\n3. 请妥善保管账号密码，切勿泄露给他人；\n4. 严禁使用账号发布违法、违规、低俗内容；\n5. 违反平台规则，官方有权封禁或限制账号使用。");
}
function showPrivacy() {
    alert("《小米隐私政策》\n\n1. 我们仅收集注册必要手机号、账号信息；\n2. 不会私自向第三方出售、泄露您的个人信息；\n3. 您可随时查看、修改个人资料；\n4. 所有数据均做加密保护，保障用户隐私安全；\n5. 仅用于账号服务、安全校验与业务推送。");
}
function showHelp() {
    alert("帮助中心\n\n常见问题：\n1. 忘记密码：可通过手机号验证码重置；\n2. 账号无法登录：检查网络或核对账号密码；\n3. 收不到验证码：检查手机号是否正确、是否被拦截短信；\n4. 账号被锁定：请24小时后重试或联系官方客服。");
}

// ====================== 商品详情 ======================
function showDetail(name, desc) {
    if (!requireLogin('请先登录，再查看商品详情')) return;
    alert(`商品：${name}\n简介：${desc}`);
}

// ====================== 购物车 ======================
function addToCart(name, price) {
    if (!requireLogin('请先登录，再加入购物车')) return;
    const item = cart.find(i => i.name === name);
    if (item) item.count++;
    else cart.push({ name, price, count: 1 });
    saveCart();
    alert(`已将「${name}」加入购物车`);
}

function openCart() {
    goPage('cart');
    renderCart();
}

// 渲染购物车列表
function renderCart() {
    const listDom = document.getElementById('cartList');
    const emptyDom = document.getElementById('emptyCart');
    const totalBox = document.getElementById('cartTotalBox');
    const totalPriceDom = document.getElementById('cartTotalPrice');

    listDom.innerHTML = '';

    if (cart.length === 0) {
        emptyDom.style.display = 'block';
        totalBox.style.display = 'none';
        return;
    }

    emptyDom.style.display = 'none';
    totalBox.style.display = 'block';

    let total = 0;
    cart.forEach((item, index) => {
        const subtotal = item.price * item.count;
        total += subtotal;
        listDom.innerHTML += `
        <div style="display:grid; grid-template-columns:3fr 1fr 1.5fr 1fr 0.5fr; padding:20px 0; border-bottom:1px solid #eee; align-items:center;">
            <div style="color:#222;">${item.name}</div>
            <div style="text-align:center;">¥${item.price}</div>
            <div style="display:flex; justify-content:center; align-items:center; gap:10px;">
                <button onclick="changeCount(${index},-1)" style="width:26px;height:26px;border:1px solid #ddd;background:#fff;cursor:pointer;">-</button>
                <span>${item.count}</span>
                <button onclick="changeCount(${index},1)" style="width:26px;height:26px;border:1px solid #ddd;background:#fff;cursor:pointer;">+</button>
            </div>
            <div style="text-align:center; color:red; font-weight:bold;">¥${subtotal}</div>
            <div style="text-align:center;">
                <button onclick="delCartItem(${index})" style="border:none; background:none; color:#999; cursor:pointer;">删除</button>
            </div>
        </div>`;
    });

    totalPriceDom.innerText = `¥${total}`;
}

// 修改商品数量
function changeCount(index, num) {
    cart[index].count += num;
    if (cart[index].count < 1) cart[index].count = 1;
    saveCart();
    renderCart();
}

// 删除单个商品
function delCartItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// 去结算（演示）
function settleCart() {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, i) => sum + i.price * i.count, 0);
    alert(`结算演示\n共 ${cart.length} 种商品，合计 ¥${total}\n（演示站点，未接入真实支付）`);
}

// ====================== 小米商城产品数据 ======================
const shopProducts = [
    // 手机系列
    [
        { name: "小米15", price: 4299, desc: "骁龙8旗舰 徕卡影像", img: "https://p0.ssl.qhimgs1.com/t043de738a8deb3195e.jpg" },
        { name: "Redmi Note 14", price: 1499, desc: "千元旗舰 大电池", img: "https://doc-fd.zol-img.com.cn/t_s2000x2000/g7/M00/0D/09/ChMkK2elpWiIPh0dAAEE7rHNY6gAAosBALZs2oAAQUG428.jpg" },
        { name: "小米14 Ultra", price: 5999, desc: "专业影像旗舰", img: "https://p1.ssl.qhimgs1.com/t04579c1c3408242217.jpg" },
        { name: "Redmi K70", price: 2499, desc: "性能旗舰 高刷屏", img: "https://p1.ssl.qhimgs1.com/t04a673bda544affad7.jpg" }
    ],
    // 电视大屏
    [
        { name: "小米电视85寸", price: 4999, desc: "4K超高清 大屏影院", img: "https://p2.ssl.qhimgs1.com/t04fb448227332e8bd2.png" },
        { name: "小米电视65寸", price: 2999, desc: "超薄全面屏", img: "https://mercrt-fd.zol-img.com.cn/t_s640x599/g7/M00/0B/09/ChMkK2OazLyII93vAA2OSknnj_MAAKtgwEZms4ADY5i779.png" },
        { name: "Redmi 智能电视", price: 1799, desc: "高性价比之选", img: "https://p1.ssl.qhimgs1.com/t0485d19e6c12308437.jpg" },
        { name: "小米激光电视", price: 9999, desc: "100寸巨幕体验", img: "https://p0.ssl.qhimgs1.com/t040fe280203fb932ea.jpg" }
    ],
    // 笔记本电脑
    [
        { name: "小米笔记本Pro14", price: 5999, desc: "轻薄性能本", img: "https://p0.ssl.qhimgs1.com/t04396bf6094eed6d16.jpg" },
        { name: "RedmiBook 15", price: 3999, desc: "学生办公本", img: "https://img.cnmo.com/2151_600x1000/2150833.jpg" },
        { name: "小米游戏本", price: 7999, desc: "高性能游戏本", img: "https://2e.zol-img.com.cn/product/205_800x600/938/ceUa7TpZymB2.jpg" },
        { name: "Redmi G 游戏本", price: 5499, desc: "高性价比游戏本", img: "https://p2.ssl.qhimgs1.com/t03c44e3f67c4163452.jpg" }
    ],
    // 平板设备
    [
        { name: "小米平板7 Pro", price: 2999, desc: "2.8K高刷屏", img: "https://p1.ssl.qhimgs1.com/t04e104826928752ec7.jpg" },
        { name: "Redmi Pad", price: 1299, desc: "学习娱乐平板", img: "https://p1.ssl.qhimgs1.com/t043502c129b3cd05f1.jpg" },
        { name: "小米平板6", price: 2499, desc: "旗舰平板", img: "https://imgservice.suning.cn/uimg1/b2c/image/enPrhXVc8zW7LFMu5X_xlw.png" },
        { name: "Redmi Pad SE", price: 999, desc: "入门级平板", img: "https://p2.ssl.qhimgs1.com/t04d47ee993324d4d68.png" }
    ],
    // 智能家电
    [
        { name: "小米空气净化器", price: 899, desc: "高效除醛", img: "https://a.vpimg3.com/upload/merchandise/pdc/080/427/84237322871427080/0/XM-12140-1.jpg" },
        { name: "小米扫地机器人", price: 2499, desc: "智能扫拖一体", img: "https://p0.ssl.qhimgs1.com/t010656737e229c1e16.jpg" },
        { name: "小米空调", price: 2999, desc: "一级能效 智能控温", img: "https://p0.ssl.qhimgs1.com/t049feea4e639f494ce.jpg" },
        { name: "小米冰箱", price: 3999, desc: "风冷无霜", img: "https://p0.ssl.qhimgs1.com/t04abfe54036a90c37a.jpg" }
    ],
    // 路由器网络
    [
        { name: "小米路由器7000", price: 799, desc: "高速WiFi 全屋覆盖", img: "https://p2.ssl.qhimgs1.com/t040f3f60930616cb12.png" },
        { name: "Redmi 路由器AX6", price: 329, desc: "千兆双频", img: "https://p0.ssl.qhimgs1.com/t01fe4b0582dcd5fc36.jpg" },
        { name: "小米万兆路由器", price: 1999, desc: "电竞级网络", img: "https://p1.ssl.qhimgs1.com/t010ee671811ecdafbb.jpg" },
        { name: "小米信号放大器", price: 99, desc: "增强WiFi信号", img: "https://img14.360buyimg.com/pop/s400x400_jfs/t5944/106/8583344356/129248/5333df92/598966daNd209c795.jpg" }
    ]
];

// 切换商城分类
function changeShopCate(index) {
    const main = document.getElementById('shopMain');
    if (index < 6) {
        main.innerHTML = '';
        shopProducts[index].forEach(p => {
            main.innerHTML += `
            <div class="product-card">
                <img src="${p.img}" alt="${p.name}">
                <div class="product-name">${p.name}</div>
                <div class="product-price">¥${p.price}</div>
                <div class="product-btns">
                    <button onclick="showDetail('${p.name}','${p.desc}')">了解详情</button>
                    <button onclick="addToCart('${p.name}',${p.price})">加入购物车</button>
                </div>
            </div>`;
        });
    } else if (index === 6) {
        main.innerHTML = `
        <div class="shop-service">
            <h2>售后服务中心</h2>
            <p>全国联保 | 7天无理由退换 | 上门服务</p>
            <p>客服热线：400-100-5678</p>
            <p>服务时间：周一至周日 9:00-18:00</p>
        </div>`;
    } else {
        main.innerHTML = `
        <div class="shop-community">
            <h2>小米用户社区</h2>
            <p>在这里和米粉一起交流、分享、讨论</p>
            <p>热门话题：新品讨论、使用技巧、活动福利</p>
            <p>社区地址：community.mi.com</p>
        </div>`;
    }
}

// 搜索商品
function searchProduct() {
    const keyword = document.getElementById('searchInp').value.trim();
    if (!keyword) {
        alert('请输入搜索关键词');
        return;
    }
    const found = [];
    shopProducts.forEach(cate => {
        cate.forEach(p => {
            if (p.name.includes(keyword) || p.desc.includes(keyword)) {
                found.push(p);
            }
        });
    });
    const main = document.getElementById('shopMain');
    if (found.length > 0) {
        main.innerHTML = `<div style="grid-column:1/-1;margin-bottom:10px;">搜索结果：${found.length}个商品</div>`;
        found.forEach(p => {
            main.innerHTML += `
            <div class="product-card">
                <img src="${p.img}" alt="${p.name}">
                <div class="product-name">${p.name}</div>
                <div class="product-price">¥${p.price}</div>
                <div class="product-btns">
                    <button onclick="showDetail('${p.name}','${p.desc}')">了解详情</button>
                    <button onclick="addToCart('${p.name}',${p.price})">加入购物车</button>
                </div>
            </div>`;
        });
    } else {
        main.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:50px 0;color:#666;">未找到相关商品</div>`;
    }
}

// ====================== 小米汽车页面 ======================
function checkLoginGo(type) {
    if (!requireLogin('请先登录后再使用此功能')) return;
    switch (type) {
        case 'custom': alert('车型定制服务：登录成功，进入定制页面'); break;
        case 'store': alert('门店查询：登录成功，进入门店查询页面'); break;
        case 'service': alert('服务介绍：登录成功，进入服务介绍页面'); break;
        case 'testdrive': alert('预约试驾：登录成功，进入预约页面'); break;
    }
}

function showCarAllModel() {
    alert('所有车型页面：展示全部小米车型');
}
function showCarTech() {
    alert('核心技术：展示小米汽车技术亮点');
}
function showCarFactory() {
    alert('小米汽车工厂：介绍生产与制造');
}
function carTestDrive() {
    if (!requireLogin('请先登录后再预约试驾')) return;
    alert('预约试驾：登录成功，进入预约流程');
}
function carCustomize() {
    if (!requireLogin('请先登录后再开始选配')) return;
    alert('开始选配：登录成功，进入车型定制流程');
}

// ====================== IoT平台 ======================
function showIotSolution() {
    alert('了解更多：小米IoT解决方案\n覆盖智能家居、可穿戴设备、车载设备等多场景接入方案');
}
function showIotKit() {
    alert('了解更多：开发套件\n提供完整的SDK、示例代码和调试工具，快速完成设备开发');
}
function showIotMarket() {
    alert('了解更多：营销渠道\n接入小米IoT平台，共享小米全渠道流量与用户资源');
}
function showIotEco() {
    alert('了解更多：生态合作\n与全球开发者共建开放生态，实现跨品牌设备互联互通');
}
function showIotTrain() {
    alert('了解更多：培训与支持\n提供线上课程、技术文档和一对一技术支持，助力开发落地');
}
function showXiaomiVela() {
    alert('了解更多：Xiaomi Vela\n专为IoT设备打造的轻量级系统，低功耗、高稳定');
}
function joinIot() {
    if (!requireLogin('请先登录后再加入IoT平台')) return;
    alert('欢迎加入小米IoT开发者平台！\n正在为您跳转入驻流程...');
}
function openDoc() {
    alert('正在打开IoT平台文档中心...\n包含开发指南、API文档、接入规范等');
}
function showIotDiagram() {
    alert('IoT设备协同示意图说明：\n手机、电脑、智能家居设备可实现无缝联动，数据实时同步');
}
function learnMoreOpen() {
    alert('开放接入更多信息：\n- 支持Wi-Fi、蓝牙、Zigbee等多种协议接入\n- 提供标准化设备模型，降低开发门槛\n- 一键完成设备认证与上线');
}
function learnMoreEco() {
    alert('全生态协同更多信息：\n- 与HyperOS深度适配，实现跨设备流转\n- 支持设备间自动联动场景\n- 打通小米手机、平板、汽车、音箱等多终端');
}
function learnMoreSecurity() {
    alert('安全可靠更多信息：\n- 设备身份认证与数据加密传输\n- 隐私数据本地优先处理\n- 定期安全更新与漏洞修复');
}

// ====================== 小米有品 ======================
function alertSearch() {
    const keyword = document.getElementById('youpin-search').value;
    alert(`正在搜索商品：${keyword || '米家电动剃须刀Pro'}`);
}
function showCategory(name) {
    alert(`进入分类：${name}\n这里会加载该分类下的所有商品`);
}
function joinCrowdfunding(name, price) {
    alert(`参与众筹：${name}\n众筹价：¥${price}\n即将跳转到众筹详情页`);
}
function buyFlashSale(name, price) {
    if (!requireLogin('请先登录后再抢购')) return;
    const item = cart.find(i => i.name === name);
    if (item) item.count++;
    else cart.push({ name, price, count: 1 });
    saveCart();
    alert(`抢购成功！\n商品：${name}\n秒杀价：¥${price}\n已为你加入购物车`);
}
function learnMore(name) {
    alert(`查看商品详情：${name}\n这里会展示完整参数、评价和介绍`);
}

// 秒杀倒计时（动态更新）
function updateFlashCountdown() {
    const el = document.getElementById('flash-countdown');
    if (!el) return;
    let [h, m, s] = el.textContent.split(':').map(Number);
    if (s > 0) {
        s--;
    } else if (m > 0) {
        m--; s = 59;
    } else if (h > 0) {
        h--; m = 59; s = 59;
    } else {
        el.textContent = '00:00:00';
        return;
    }
    el.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
setInterval(updateFlashCountdown, 1000);

// ====================== 返回顶部 ======================
window.addEventListener('scroll', function () {
    const btn = document.querySelector('.back-top');
    if (window.scrollY > 300) btn.classList.add('show');
    else btn.classList.remove('show');
});
function backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====================== 图片放大镜（事件委托，动态渲染的商品图也生效） ======================
let zoomBox = null;
let zoomImg = null;
function initZoom() {
    document.addEventListener('mousemove', function (e) {
        const img = e.target.closest('.product-img img, .product-card > img');
        if (!img) {
            if (zoomBox) zoomBox.style.display = 'none';
            return;
        }
        if (!zoomBox) {
            zoomBox = document.createElement('div');
            zoomBox.className = 'zoom-box';
            zoomImg = document.createElement('img');
            zoomImg.className = 'zoom-img';
            zoomBox.appendChild(zoomImg);
            document.body.appendChild(zoomBox);
        }
        if (zoomImg.src !== img.src) zoomImg.src = img.src;
        zoomBox.style.display = 'block';
        zoomBox.style.left = e.pageX + 20 + 'px';
        zoomBox.style.top = e.pageY + 20 + 'px';
        const rect = img.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        zoomImg.style.left = -(x * zoomImg.offsetWidth - zoomBox.offsetWidth / 2) + 'px';
        zoomImg.style.top = -(y * zoomImg.offsetHeight - zoomBox.offsetHeight / 2) + 'px';
    });
}

// ====================== 页面加载初始化 ======================
window.addEventListener('load', function () {
    document.getElementById('loading').style.display = 'none';
    countDown();
    changeShopCate(0);
    initZoom();
    // 恢复登录状态显示
    if (isLogin) document.getElementById('loginText').innerText = '已登录';
});
