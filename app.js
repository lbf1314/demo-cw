// 初始化 PIXI 应用
const app = new PIXI.Application({
    backgroundAlpha: 0,
    resizeTo: document.getElementById('pet-container')
});

// 将 PIXI 画布添加到容器中
document.getElementById('pet-container').appendChild(app.view);

// 注册 pixi-live2d-display 插件
// 修改: 使用新的 API 结构

// 创建宠物模型
let model = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

async function loadModel() {
    try {
        // 加载 Live2D 模型 (使用一个公开的示例模型)
        // 修改: 使用新的 API 调用方式
        const model = await PIXI.live2d.Live2DModel.from('https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json');
        
        // 设置模型初始位置和大小
        model.position.set(app.screen.width / 2, app.screen.height / 2);
        model.scale.set(0.3);
        model.anchor.set(0.5);
        
        // 启用交互
        model.interactive = true;
        model.buttonMode = true;
        
        // 添加点击事件
        model.on('pointerdown', onDragStart)
              .on('pointerup', onDragEnd)
              .on('pointerupoutside', onDragEnd)
              .on('pointermove', onDragMove);
        
        // 添加模型到舞台
        app.stage.addChild(model);
        
        // 显示拖拽提示
        showDragTip();
        
        // 绑定控制按钮事件
        bindControlEvents();
        
    } catch (error) {
        console.error('模型加载失败:', error);
        alert('模型加载失败，请检查网络连接');
    }
}

// 显示拖拽提示
function showDragTip() {
    const tip = document.getElementById('drag-tip');
    tip.style.opacity = '1';
    
    setTimeout(() => {
        tip.style.opacity = '0';
    }, 3000);
}

// 拖拽开始
function onDragStart(event) {
    isDragging = true;
    const point = event.data.global;
    dragOffset.x = point.x - model.position.x;
    dragOffset.y = point.y - model.position.y;
    model.alpha = 0.8; // 拖拽时半透明
}

// 拖拽结束
function onDragEnd() {
    isDragging = false;
    if (model) {
        model.alpha = 1;
    }
}

// 拖拽移动
function onDragMove(event) {
    if (isDragging && model) {
        const point = event.data.global;
        model.position.x = point.x - dragOffset.x;
        model.position.y = point.y - dragOffset.y;
    }
}

// 绑定控制按钮事件
function bindControlEvents() {
    document.getElementById('dance-btn').addEventListener('click', () => {
        if (model) {
            // 播放舞蹈动作 (假设模型有对应动作)
            model.motion('dance');
        }
    });
    
    document.getElementById('sleep-btn').addEventListener('click', () => {
        if (model) {
            // 播放睡觉动作
            model.motion('sleep');
        }
    });
    
    document.getElementById('happy-btn').addEventListener('click', () => {
        if (model) {
            // 播放开心动作
            model.motion('happy');
        }
    });
    
    document.getElementById('random-btn').addEventListener('click', () => {
        if (model) {
            // 随机播放一个动作
            const motions = model.internalModel.motionManager.motionGroups;
            if (motions && motions.length > 0) {
                const randomGroup = Object.keys(motions)[Math.floor(Math.random() * Object.keys(motions).length)];
                model.motion(randomGroup);
            }
        }
    });
}

// 窗口大小变化时调整模型位置
window.addEventListener('resize', () => {
    if (model) {
        // 保持模型在屏幕中心附近
        const ratioX = model.position.x / app.screen.width;
        const ratioY = model.position.y / app.screen.height;
        
        model.position.set(
            app.screen.width * ratioX,
            app.screen.height * ratioY
        );
    }
});

// 页面加载完成后初始化
window.addEventListener('load', loadModel);