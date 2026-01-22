class RasterLineProcessor {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.originalImage = null;
        this.processedImageData = null;
        
        // 初始化滤镜参数保存功能
        this.savedFilterParams = this.loadSavedParams();
        
        this.initElements();
        this.initEventListeners();
        this.updateValueDisplays();
        
        // 恢复当前滤镜的保存参数
        this.restoreFilterParams(this.currentFilter);
        
        // 自动加载默认图片
        this.loadDefaultImage();
    }

    initElements() {
        // 获取所有控制元素
        this.elements = {
            imageInput: document.getElementById('imageInput'),

            blur: document.getElementById('blur'),
            grain: document.getElementById('grain'),
            gamma: document.getElementById('gamma'),
            blackPoint: document.getElementById('blackPoint'),
            whitePoint: document.getElementById('whitePoint'),
            showEffectOn: document.getElementById('showEffectOn'),
            showEffectOff: document.getElementById('showEffectOff'),
            useOriginalColorsOn: document.getElementById('useOriginalColorsOn'),
            useOriginalColorsOff: document.getElementById('useOriginalColorsOff'),
            useHalftoneOn: document.getElementById('useHalftoneOn'),
            useHalftoneOff: document.getElementById('useHalftoneOff'),
            threshold: document.getElementById('threshold'),
            gridAngle: document.getElementById('gridAngle'),
            ySquares: document.getElementById('ySquares'),
            xSquares: document.getElementById('xSquares'),
            minLineWidth: document.getElementById('minLineWidth'),
            maxLineWidth: document.getElementById('maxLineWidth'),
            pngFormat: document.getElementById('pngFormat'),
            svgFormat: document.getElementById('svgFormat'),
            exportBtn: document.getElementById('exportBtn'),
            dropZone: document.getElementById('dropZone')
        };

        // 添加状态跟踪
        this.showEffectEnabled = true;
        this.useOriginalColorsEnabled = true;
        this.useHalftoneEnabled = false;
        this.currentFilter = 'raster'; // 默认使用光栅效果
        this.currentCanvasSize = 200; // 默认画布大小200%

        // 值显示元素
        this.valueElements = {

            blurValue: document.getElementById('blurValue'),
            grainValue: document.getElementById('grainValue'),
            gammaValue: document.getElementById('gammaValue'),
            blackPointValue: document.getElementById('blackPointValue'),
            whitePointValue: document.getElementById('whitePointValue'),
            thresholdValue: document.getElementById('thresholdValue'),
            gridAngleValue: document.getElementById('gridAngleValue'),
            ySquaresValue: document.getElementById('ySquaresValue'),
            xSquaresValue: document.getElementById('xSquaresValue'),
            minLineWidthValue: document.getElementById('minLineWidthValue'),
            maxLineWidthValue: document.getElementById('maxLineWidthValue')
        };
    }

    initEventListeners() {
        // 文件上传
        this.elements.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // 拖拽上传 - 拖拽区域
        this.elements.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.elements.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        
        // 拖拽上传 - 画布区域（支持替换图片）
        const canvasArea = document.querySelector('.canvas-area');
        canvasArea.addEventListener('dragover', (e) => this.handleCanvasDragOver(e));
        canvasArea.addEventListener('drop', (e) => this.handleCanvasDrop(e));
        canvasArea.addEventListener('dragleave', (e) => this.handleCanvasDragLeave(e));
        
        // 添加防抖延迟处理（用于最终处理）
        this.processImageDebounced = this.debounce(() => {
            this.processImage();
        }, 100); // 减少到100ms，更快响应
        
        // 滑块控制 - 双重处理：实时预览 + 防抖优化
        Object.keys(this.elements).forEach(key => {
            if (this.elements[key].type === 'range') {
                // 添加实时预览（input事件）
                this.elements[key].addEventListener('input', () => {
                    this.updateValueDisplays();
                    // 立即进行轻量级预览
                    this.processImageInstant();
                });
                
                // 添加最终处理（change事件）
                this.elements[key].addEventListener('change', () => {
                    this.updateValueDisplays();
                    // 延迟进行完整处理
                    this.processImageDebounced();
                });
            }
        });

        // 开关按钮
        this.elements.showEffectOn.addEventListener('click', () => this.setShowEffect(true));
        this.elements.showEffectOff.addEventListener('click', () => this.setShowEffect(false));
        this.elements.useOriginalColorsOn.addEventListener('click', () => this.setUseOriginalColors(true));
        this.elements.useOriginalColorsOff.addEventListener('click', () => this.setUseOriginalColors(false));
        this.elements.useHalftoneOn.addEventListener('click', () => this.setUseHalftone(true));
        this.elements.useHalftoneOff.addEventListener('click', () => this.setUseHalftone(false));
        
        this.elements.pngFormat.addEventListener('click', () => this.setOutputFormat('png'));
        this.elements.svgFormat.addEventListener('click', () => this.setOutputFormat('svg'));

        // 导出功能
        this.elements.exportBtn.addEventListener('click', () => this.exportCanvas());

        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // 画布大小调整
        this.initCanvasSizeControl();

        // 滤镜选择器
        this.initFilterSelector();
        
        // 画布滚轮缩放
        this.initCanvasWheelZoom();
        
        // 初始化滤镜控制器显示状态
        this.updateFilterControls(this.currentFilter);
    }

    initCanvasSizeControl() {
        const canvasSizeBtn = document.getElementById('canvasSizeBtn');
        const canvasSizeDropdown = document.getElementById('canvasSizeDropdown');
        const canvasSizeOptions = document.querySelectorAll('.canvas-size-option');
        const canvasSizePercent = document.getElementById('canvasSizePercent');
        
        this.currentCanvasSize = 200; // 默认200%
        
        // 点击按钮切换下拉菜单
        canvasSizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = canvasSizeBtn.classList.contains('open');
            canvasSizeBtn.classList.toggle('open');
            canvasSizeDropdown.classList.toggle('open');
        });
        
        // 点击选项
        canvasSizeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const size = parseInt(option.dataset.size);
                this.setCanvasSize(size);
                
                // 更新UI状态
                canvasSizeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // 关闭下拉菜单
                canvasSizeBtn.classList.remove('open');
                canvasSizeDropdown.classList.remove('open');
            });
        });
        
        // 点击外部关闭下拉菜单
        document.addEventListener('click', () => {
            canvasSizeBtn.classList.remove('open');
            canvasSizeDropdown.classList.remove('open');
        });
        
        // 设置默认选中状态
        const defaultOption = document.querySelector(`[data-size="${this.currentCanvasSize}"]`);
        if (defaultOption) {
            defaultOption.classList.add('active');
        }
    }

    setCanvasSize(percentage) {
        this.currentCanvasSize = percentage;
        
        // 更新所有相关的UI显示
        const canvasSizePercent = document.getElementById('canvasSizePercent');
        if (canvasSizePercent) {
            canvasSizePercent.textContent = `${percentage}%`;
        }
        
        // 更新按钮显示的百分比
        const canvasSizeBtn = document.getElementById('canvasSizeBtn');
        if (canvasSizeBtn) {
            canvasSizeBtn.textContent = `${percentage}%`;
        }
        
        // 计算实际的画布尺寸（基于600px作为100%）
        const baseSize = 600;
        const actualSize = Math.round(baseSize * percentage / 100);
        
        // 更新画布大小
        if (this.originalImage) {
            this.resizeCanvasWithSize(actualSize);
        }
    }

    resizeCanvasWithSize(size) {
        if (!this.originalImage) return;

        const aspectRatio = this.originalImage.width / this.originalImage.height;
        
        if (aspectRatio > 1) {
            this.canvas.width = size;
            this.canvas.height = size / aspectRatio;
        } else {
            this.canvas.width = size * aspectRatio;
            this.canvas.height = size;
        }

        this.processImage();
    }

    initCanvasWheelZoom() {
        const canvasArea = document.querySelector('.canvas-area');
        let wheelTimer;
        
        // 优化的滚轮缩放实现
        canvasArea.addEventListener('wheel', (e) => {
            e.preventDefault(); // 阻止页面滚动
            
            // 检查是否有图片加载
            if (!this.originalImage) return;
            
            // 获取当前百分比
            let currentPercent = this.currentCanvasSize;
            
            // 固定步长，简单有效
            const zoomStep = 5;
            const minPercent = 10;
            const maxPercent = 200;
            
            // 根据滚轮方向调整百分比
            if (e.deltaY < 0) {
                // 向上滚动 - 放大
                currentPercent = Math.min(maxPercent, currentPercent + zoomStep);
            } else {
                // 向下滚动 - 缩小
                currentPercent = Math.max(minPercent, currentPercent - zoomStep);
            }
            
            // 先快速更新画布大小（不重新处理图像）
            this.updateCanvasSizeOnly(currentPercent);
            
            // 更新UI显示
            this.updateCanvasSizeDropdown(currentPercent);
            
            // 更新按钮显示的百分比
            const canvasSizeBtn = document.getElementById('canvasSizeBtn');
            if (canvasSizeBtn) {
                canvasSizeBtn.textContent = `${currentPercent}%`;
            }
            
            // 使用防抖机制，滚轮停止后才重新处理图像
            clearTimeout(wheelTimer);
            wheelTimer = setTimeout(() => {
                // 确保使用最新的百分比重新处理图像
                this.setCanvasSize(this.currentCanvasSize);
            }, 150); // 150ms后重新处理图像
            
        }, { passive: false });
    }

    updateCanvasSizeOnly(percentage) {
        this.currentCanvasSize = percentage;
        const canvasSizePercent = document.getElementById('canvasSizePercent');
        if (canvasSizePercent) {
            canvasSizePercent.textContent = `${percentage}%`;
        }
        
        // 改变画布大小，使用缓存的处理结果
        if (this.originalImage && this.lastProcessedCanvas) {
            const baseSize = 600;
            const actualSize = Math.round(baseSize * percentage / 100);
            const aspectRatio = this.originalImage.width / this.originalImage.height;
            
            if (aspectRatio > 1) {
                this.canvas.width = actualSize;
                this.canvas.height = actualSize / aspectRatio;
            } else {
                this.canvas.width = actualSize * aspectRatio;
                this.canvas.height = actualSize;
            }
            
            // 使用缓存的处理结果快速缩放
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.lastProcessedCanvas, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    updateCanvasSizeDropdown(percentage) {
        const canvasSizeOptions = document.querySelectorAll('.canvas-size-option');
        
        // 清除所有选中状态
        canvasSizeOptions.forEach(opt => opt.classList.remove('active'));
        
        // 如果当前百分比刚好匹配某个预设选项，则选中它
        const matchingOption = document.querySelector(`[data-size="${percentage}"]`);
        if (matchingOption) {
            matchingOption.classList.add('active');
        }
        // 如果不匹配预设选项，就不选中任何选项（表示自定义百分比）
    }

    updateValueDisplays() {
        Object.keys(this.valueElements).forEach(key => {
            const elementKey = key.replace('Value', '');
            if (this.elements[elementKey] && this.valueElements[key]) {
                this.valueElements[key].textContent = this.elements[elementKey].value;
            }
        });
    }

    // 防抖函数 - 优化性能
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // 优化的图像处理 - 添加性能检查
    processImageOptimized() {
        if (!this.originalImage) return;
        
        // 性能优化：对于大网格，降低处理频率
        const xSquares = parseInt(this.elements.xSquares.value);
        const ySquares = parseInt(this.elements.ySquares.value);
        const totalCells = xSquares * ySquares;
        
        // 如果网格过密，使用更长的防抖延迟
        if (totalCells > 20000) {
            if (this.heavyProcessDebounced) {
                this.heavyProcessDebounced();
                return;
            }
            this.heavyProcessDebounced = this.debounce(() => {
                this.processImage();
            }, 300);
            this.heavyProcessDebounced();
            return;
        }
        
        this.processImage();
    }

    // 轻量级实时预览函数
    processImageInstant() {
        if (!this.originalImage) return;
        
        // 检查网格密度，决定是否进行实时预览
        const xSquares = parseInt(this.elements.xSquares.value);
        const ySquares = parseInt(this.elements.ySquares.value);
        const totalCells = xSquares * ySquares;
        
        // 大幅提高阈值，让更多情况下能够实时预览
        if (totalCells > 40000) {
            // 超高密度时，跳过实时预览，只更新显示值
            this.updateValueDisplays();
            return;
        }
        
        // 对于高密度，使用简化版本的处理
        if (totalCells > 20000) {
            this.processImageLightweight();
        } else {
            // 中低密度时，进行完整处理
            this.processImage();
        }
    }

    // 轻量级光栅效果
    applyRasterLineEffectLightweight() {
        // 临时修改网格参数进行快速预览
        const originalXSquares = this.elements.xSquares.value;
        const originalYSquares = this.elements.ySquares.value;
        
        // 提高网格密度限制，更接近实际效果
        this.elements.xSquares.value = Math.min(120, parseInt(originalXSquares));
        this.elements.ySquares.value = Math.min(120, parseInt(originalYSquares));
        
        // 应用效果
        this.applyRasterLineEffect();
        
        // 恢复原始参数
        this.elements.xSquares.value = originalXSquares;
        this.elements.ySquares.value = originalYSquares;
    }

    // 轻量级点状效果
    applyDotsEffectLightweight() {
        const originalXSquares = this.elements.xSquares.value;
        const originalYSquares = this.elements.ySquares.value;
        
        // 点状效果可以支持更高密度
        this.elements.xSquares.value = Math.min(100, parseInt(originalXSquares));
        this.elements.ySquares.value = Math.min(100, parseInt(originalYSquares));
        
        this.applyDotsEffect();
        
        this.elements.xSquares.value = originalXSquares;
        this.elements.ySquares.value = originalYSquares;
    }

    // 轻量级纹理效果
    applyTextureEffectLightweight() {
        const originalXSquares = this.elements.xSquares.value;
        const originalYSquares = this.elements.ySquares.value;
        
        // 纹理效果是最复杂的，适当限制但仍然提高
        this.elements.xSquares.value = Math.min(80, parseInt(originalXSquares));
        this.elements.ySquares.value = Math.min(80, parseInt(originalYSquares));
        
        this.applyTextureEffect();
        
        this.elements.xSquares.value = originalXSquares;
        this.elements.ySquares.value = originalYSquares;
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadImage(file);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        this.elements.dropZone.classList.add('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        this.elements.dropZone.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.loadImage(files[0]);
        }
    }

    handleCanvasDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
        
        // 只在拖拽图片文件时显示效果
        const items = Array.from(event.dataTransfer.items);
        const hasImageFile = items.some(item => item.type.startsWith('image/'));
        
        if (hasImageFile) {
            const canvasArea = document.querySelector('.canvas-area');
            canvasArea.style.backgroundColor = 'rgba(26, 26, 26, 0.05)';
            canvasArea.style.borderRadius = '12px';
            canvasArea.style.transition = 'all 0.3s ease';
        }
    }

    handleCanvasDrop(event) {
        event.preventDefault();
        this.resetCanvasAreaStyle();
        
        const files = event.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.loadImage(files[0]);
        }
    }

    handleCanvasDragLeave(event) {
        // 只有当鼠标真正离开画布区域时才重置样式
        if (!event.currentTarget.contains(event.relatedTarget)) {
            this.resetCanvasAreaStyle();
        }
    }

    resetCanvasAreaStyle() {
        const canvasArea = document.querySelector('.canvas-area');
        canvasArea.style.backgroundColor = '';
        canvasArea.style.borderRadius = '';
        canvasArea.style.transition = '';
    }

    initFilterSelector() {
        const filterTriggerBtn = document.getElementById('filterTriggerBtn');
        const filterSidebar = document.getElementById('filterSidebar');
        const filterSidebarClose = document.getElementById('filterSidebarClose');
        const filterItems = document.querySelectorAll('.filter-sidebar .filter-item');
        const currentFilterIndicator = document.getElementById('currentFilterIndicator');

        // 打开滤镜侧边栏
        filterTriggerBtn.addEventListener('click', () => {
            filterSidebar.classList.add('open');
        });

        // 关闭滤镜侧边栏
        const closeSidebar = () => {
            filterSidebar.classList.remove('open');
        };

        filterSidebarClose.addEventListener('click', closeSidebar);

        // ESC键关闭侧边栏
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && filterSidebar.classList.contains('open')) {
                closeSidebar();
            }
        });

        // 点击侧边栏外部关闭
        document.addEventListener('click', (e) => {
            if (filterSidebar.classList.contains('open') && 
                !filterSidebar.contains(e.target) && 
                !filterTriggerBtn.contains(e.target)) {
                closeSidebar();
            }
        });

        // 滤镜选择
        filterItems.forEach(item => {
            item.addEventListener('click', () => {
                const filterType = item.dataset.filter;
                const filterName = item.querySelector('.filter-item-name').textContent;
                
                this.selectFilter(filterType);
                
                // 更新UI状态
                filterItems.forEach(opt => opt.classList.remove('active'));
                item.classList.add('active');
                
                // 更新触发按钮显示的当前滤镜
                currentFilterIndicator.textContent = filterName;
                
                // 自动关闭侧边栏
                closeSidebar();
            });
        });
    }

    selectFilter(filterType) {
        // 保存当前滤镜的参数
        this.saveCurrentFilterParams();
        
        this.currentFilter = filterType;
        console.log('切换到滤镜:', filterType);
        
        // 恢复该滤镜的保存参数
        this.restoreFilterParams(filterType);
        
        // 根据滤镜类型显示/隐藏相关控制器
        this.updateFilterControls(filterType);
        
        // 重新处理图像
        this.processImage();
    }

    updateFilterControls(filterType) {
        const gridAngleGroup = document.querySelector('#gridAngle').closest('.control-group');
        const halftoneGroup = document.querySelector('#useHalftoneOn').closest('.control-group');
        
        // 根据滤镜类型显示/隐藏相关控制器
        if (filterType === 'dots') {
            // 点状效果：隐藏网格角度，显示网点控制
            gridAngleGroup.style.display = 'none';
            halftoneGroup.style.display = 'block';
        } else if (filterType === 'texture') {
            // 纹理效果：隐藏网格角度和网点控制
            gridAngleGroup.style.display = 'none';
            halftoneGroup.style.display = 'none';
        } else {
            // 其他效果：显示网格角度，隐藏网点控制
            gridAngleGroup.style.display = 'block';
            halftoneGroup.style.display = 'none';
        }
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                // 隐藏拖拽区域，但画布区域仍然支持拖拽替换
                this.elements.dropZone.classList.add('hidden');
                this.resizeCanvas();
                this.processImage();

            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    resizeCanvas() {
        if (!this.originalImage) return;

        // 使用当前百分比计算画布大小
        const baseSize = 600;
        const actualSize = Math.round(baseSize * this.currentCanvasSize / 100);
        this.resizeCanvasWithSize(actualSize);
    }

    processImage() {
        if (!this.originalImage) return;

        // 清空画布
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制原始图像
        this.ctx.drawImage(this.originalImage, 0, 0, this.canvas.width, this.canvas.height);

        // 应用预处理
        this.applyPreprocessing();

        // 应用选择的滤镜效果
        if (this.showEffectEnabled) {
            this.applyCurrentFilter();
        }
        
        // 创建缓存画布以备快速缩放使用
        this.createProcessedCache();
    }

    createProcessedCache() {
        // 创建一个新的canvas作为缓存
        if (!this.cacheCanvas) {
            this.cacheCanvas = document.createElement('canvas');
            this.cacheCtx = this.cacheCanvas.getContext('2d');
        }
        
        // 将当前处理好的画布内容复制到缓存
        this.cacheCanvas.width = this.canvas.width;
        this.cacheCanvas.height = this.canvas.height;
        this.cacheCtx.drawImage(this.canvas, 0, 0);
        
        // 标记缓存有效
        this.lastProcessedCanvas = this.cacheCanvas;
    }

    applyPreprocessing() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        const blur = parseFloat(this.elements.blur.value);
        const gamma = parseFloat(this.elements.gamma.value);
        const blackPoint = parseInt(this.elements.blackPoint.value);
        const whitePoint = parseInt(this.elements.whitePoint.value);
        const grain = parseInt(this.elements.grain.value);

        // 应用模糊效果
        if (blur > 0) {
            this.ctx.filter = `blur(${blur}px)`;
            this.ctx.drawImage(this.canvas, 0, 0);
            this.ctx.filter = 'none';
        }

        // 重新获取图像数据进行其他处理
        const newImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const newData = newImageData.data;

        for (let i = 0; i < newData.length; i += 4) {
            let r = newData[i];
            let g = newData[i + 1];
            let b = newData[i + 2];

            // 应用Gamma校正
            r = Math.pow(r / 255, gamma) * 255;
            g = Math.pow(g / 255, gamma) * 255;
            b = Math.pow(b / 255, gamma) * 255;

            // 应用黑点和白点调节
            r = Math.max(0, Math.min(255, ((r - blackPoint) * 255) / (whitePoint - blackPoint)));
            g = Math.max(0, Math.min(255, ((g - blackPoint) * 255) / (whitePoint - blackPoint)));
            b = Math.max(0, Math.min(255, ((b - blackPoint) * 255) / (whitePoint - blackPoint)));

            // 添加颗粒噪声 - 超强版
            if (grain > 0) {
                // 多层噪声算法 - 更强烈的颗粒效果
                const baseIntensity = grain * 2.5; // 基础强度提升到2.5倍
                
                // 第一层：基础噪声
                let noise1 = (Math.random() - 0.5) * baseIntensity;
                
                // 第二层：强颗粒点 (50%概率)
                const strongGrain = Math.random() < 0.5 ? (Math.random() - 0.5) * baseIntensity * 1.5 : 0;
                
                // 第三层：极强颗粒点 (20%概率)
                const ultraGrain = Math.random() < 0.2 ? (Math.random() - 0.5) * baseIntensity * 3 : 0;
                
                // 合并所有噪声层
                const totalNoise = noise1 + strongGrain + ultraGrain;
                
                // 为每个颜色通道添加独立的噪声变化
                const rNoise = totalNoise + (Math.random() - 0.5) * grain * 0.3;
                const gNoise = totalNoise + (Math.random() - 0.5) * grain * 0.3;
                const bNoise = totalNoise + (Math.random() - 0.5) * grain * 0.3;
                
                r = Math.max(0, Math.min(255, r + rNoise));
                g = Math.max(0, Math.min(255, g + gNoise));
                b = Math.max(0, Math.min(255, b + bNoise));
            }

            newData[i] = r;
            newData[i + 1] = g;
            newData[i + 2] = b;
        }

        this.ctx.putImageData(newImageData, 0, 0);
        this.processedImageData = newImageData;
    }

    applyCurrentFilter() {
        switch (this.currentFilter) {
            case 'raster':
                this.applyRasterLineEffect();
                break;
            case 'dots':
                this.applyDotsEffect();
                break;
            case 'texture':
                this.applyTextureEffect();
                break;
            case 'none':
                // 无效果，只显示预处理后的图像
                break;
            default:
                this.applyRasterLineEffect();
        }
    }

    applyRasterLineEffect() {
        if (!this.processedImageData) return;

        const threshold = parseInt(this.elements.threshold.value);
        const ySquares = parseInt(this.elements.ySquares.value);
        const xSquares = parseInt(this.elements.xSquares.value);
        const minLineWidth = parseFloat(this.elements.minLineWidth.value);
        const maxLineWidth = parseFloat(this.elements.maxLineWidth.value);
        const gridAngle = parseFloat(this.elements.gridAngle.value);
        const useOriginalColors = this.useOriginalColorsEnabled;

        // 清空画布，设置为白色背景
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 计算缩放比例（基于600px标准尺寸）
        const baseSize = 600;
        const scaleFactor = Math.max(this.canvas.width, this.canvas.height) / baseSize;

        const cellWidth = this.canvas.width / xSquares;
        const cellHeight = this.canvas.height / ySquares;

        // 将角度转换为弧度
        const angleRad = (gridAngle * Math.PI) / 180;

        for (let y = 0; y < ySquares; y++) {
            for (let x = 0; x < xSquares; x++) {
                const cellX = x * cellWidth;
                const cellY = y * cellHeight;

                // 计算单元格内的平均亮度和颜色
                const cellData = this.getCellData(
                    Math.floor(cellX),
                    Math.floor(cellY),
                    Math.ceil(cellWidth),
                    Math.ceil(cellHeight)
                );

                // 根据亮度决定是否绘制线条以及线条粗细
                if (cellData.brightness < threshold) {
                    // 较暗的区域绘制较粗的线条，应用缩放因子保持一致的视觉效果
                    const baseLineWidth = minLineWidth + (maxLineWidth - minLineWidth) * (1 - cellData.brightness / 255);
                    const actualLineWidth = baseLineWidth * scaleFactor;
                    
                    // 根据用户选择使用原色或黑色
                    const color = useOriginalColors ? cellData.color : '#000000';
                    
                    // 计算线条在网格中心的位置
                    const centerX = cellX + cellWidth / 2;
                    const centerY = cellY + cellHeight / 2;
                    
                    this.drawAngledLine(centerX, centerY, cellWidth, cellHeight, actualLineWidth, color, angleRad);
                }
            }
        }
    }

    getAverageBrightness(x, y, width, height) {
        if (!this.processedImageData) return 128;

        let totalBrightness = 0;
        let pixelCount = 0;

        for (let py = Math.max(0, y); py < Math.min(this.canvas.height, y + height); py++) {
            for (let px = Math.max(0, x); px < Math.min(this.canvas.width, x + width); px++) {
                const index = (py * this.canvas.width + px) * 4;
                const r = this.processedImageData.data[index];
                const g = this.processedImageData.data[index + 1];
                const b = this.processedImageData.data[index + 2];
                
                // 计算亮度 (灰度值)
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                totalBrightness += brightness;
                pixelCount++;
            }
        }

        return pixelCount > 0 ? totalBrightness / pixelCount : 128;
    }

    getCellData(x, y, width, height) {
        if (!this.processedImageData) return { brightness: 128, color: '#000000' };

        let totalBrightness = 0;
        let totalR = 0, totalG = 0, totalB = 0;
        let pixelCount = 0;

        for (let py = Math.max(0, y); py < Math.min(this.canvas.height, y + height); py++) {
            for (let px = Math.max(0, x); px < Math.min(this.canvas.width, x + width); px++) {
                const index = (py * this.canvas.width + px) * 4;
                const r = this.processedImageData.data[index];
                const g = this.processedImageData.data[index + 1];
                const b = this.processedImageData.data[index + 2];
                
                // 计算亮度 (灰度值)
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                totalBrightness += brightness;
                
                // 累计RGB值计算平均颜色
                totalR += r;
                totalG += g;
                totalB += b;
                pixelCount++;
            }
        }

        if (pixelCount === 0) {
            return { brightness: 128, color: '#000000' };
        }

        const avgBrightness = totalBrightness / pixelCount;
        const avgR = Math.round(totalR / pixelCount);
        const avgG = Math.round(totalG / pixelCount);
        const avgB = Math.round(totalB / pixelCount);
        
        // 将RGB转换为十六进制颜色
        const color = `rgb(${avgR}, ${avgG}, ${avgB})`;

        return {
            brightness: avgBrightness,
            color: color
        };
    }

    drawVerticalLine(x, y, height, lineWidth, color = '#000000') {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y + height);
        this.ctx.stroke();
    }

    drawAngledLine(centerX, centerY, cellWidth, cellHeight, lineWidth, color, angleRad) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.lineCap = 'round';
        
        // 0度 = 垂直线条（90度旋转）, 90度 = 水平线条
        // 调整角度，让0度对应垂直线条
        const adjustedAngle = angleRad + Math.PI / 2;
        
        // 计算足够的线条长度以贯穿整个网格单元
        const maxDimension = Math.max(cellWidth, cellHeight);
        const lineLength = maxDimension * 1.2; // 稍微加长确保覆盖整个单元
        
        // 计算线条两端的坐标（以网格中心为基准）
        const halfLength = lineLength / 2;
        const startX = centerX - Math.cos(adjustedAngle) * halfLength;
        const startY = centerY - Math.sin(adjustedAngle) * halfLength;
        const endX = centerX + Math.cos(adjustedAngle) * halfLength;
        const endY = centerY + Math.sin(adjustedAngle) * halfLength;
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    setShowEffect(enabled) {
        this.showEffectEnabled = enabled;
        this.elements.showEffectOn.classList.toggle('active', enabled);
        this.elements.showEffectOff.classList.toggle('active', !enabled);
        this.processImage();
    }

    setUseOriginalColors(enabled) {
        this.useOriginalColorsEnabled = enabled;
        this.elements.useOriginalColorsOn.classList.toggle('active', enabled);
        this.elements.useOriginalColorsOff.classList.toggle('active', !enabled);
        this.processImage();
    }

    setUseHalftone(enabled) {
        this.useHalftoneEnabled = enabled;
        this.elements.useHalftoneOn.classList.toggle('active', enabled);
        this.elements.useHalftoneOff.classList.toggle('active', !enabled);
        this.processImage();
    }

    setOutputFormat(format) {
        this.elements.pngFormat.classList.toggle('active', format === 'png');
        this.elements.svgFormat.classList.toggle('active', format === 'svg');
    }

    exportCanvas() {
        const format = this.elements.pngFormat.classList.contains('active') ? 'png' : 'svg';
        
        if (format === 'png') {
            const link = document.createElement('a');
            link.download = 'raster-lines-effect.png';
            link.href = this.canvas.toDataURL('image/png');
            link.click();
        } else {
            this.exportSVG();
        }
    }

    exportSVG() {
        const svgContent = this.generateSVGFromCanvas();
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = 'raster-lines-effect.svg';
        link.href = URL.createObjectURL(blob);
        link.click();
    }

    generateSVGFromCanvas() {
        if (!this.originalImage || !this.processedImageData) {
            return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="white"/>
</svg>`;
        }

        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // 获取当前参数
        const threshold = parseInt(this.elements.threshold.value);
        const gridAngle = parseInt(this.elements.gridAngle.value);
        const xSquares = parseInt(this.elements.xSquares.value);
        const ySquares = parseInt(this.elements.ySquares.value);
        const minLineWidth = parseFloat(this.elements.minLineWidth.value);
        const maxLineWidth = parseFloat(this.elements.maxLineWidth.value);
        const useOriginalColors = this.useOriginalColorsEnabled;
        const useHalftone = this.useHalftoneEnabled;

        const cellWidth = width / xSquares;
        const cellHeight = height / ySquares;
        const baseSize = 600;
        const scaleFactor = Math.max(width, height) / baseSize;

        let svgContent = '';

        // 根据当前滤镜类型生成对应的SVG内容
        switch (this.currentFilter) {
            case 'raster':
                svgContent = this.generateRasterSVG(xSquares, ySquares, cellWidth, cellHeight, threshold, minLineWidth, maxLineWidth, gridAngle, useOriginalColors, scaleFactor);
                break;
            case 'dots':
                svgContent = this.generateDotsSVG(xSquares, ySquares, cellWidth, cellHeight, threshold, minLineWidth, maxLineWidth, useOriginalColors, useHalftone, scaleFactor);
                break;
            case 'texture':
                svgContent = this.generateTextureSVG(xSquares, ySquares, cellWidth, cellHeight, threshold, minLineWidth, maxLineWidth, useOriginalColors, scaleFactor);
                break;
            case 'none':
                svgContent = ''; // 无效果，只有白色背景
                break;
            default:
                svgContent = this.generateRasterSVG(xSquares, ySquares, cellWidth, cellHeight, threshold, minLineWidth, maxLineWidth, gridAngle, useOriginalColors, scaleFactor);
        }
        
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="white"/>
    ${svgContent}
</svg>`;
    }

    // 生成光栅线条效果的SVG
    generateRasterSVG(xSquares, ySquares, cellWidth, cellHeight, threshold, minLineWidth, maxLineWidth, gridAngle, useOriginalColors, scaleFactor) {
        const angleRad = (gridAngle * Math.PI) / 180;
        let svgLines = '';

        for (let y = 0; y < ySquares; y++) {
            for (let x = 0; x < xSquares; x++) {
                const cellX = x * cellWidth;
                const cellY = y * cellHeight;

                const cellData = this.getCellData(
                    Math.floor(cellX),
                    Math.floor(cellY),
                    Math.ceil(cellWidth),
                    Math.ceil(cellHeight)
                );

                if (cellData.brightness < threshold) {
                    const baseLineWidth = minLineWidth + (maxLineWidth - minLineWidth) * (1 - cellData.brightness / 255);
                    const actualLineWidth = baseLineWidth * scaleFactor;
                    const color = useOriginalColors ? cellData.color : '#000000';
                    
                    const centerX = cellX + cellWidth / 2;
                    const centerY = cellY + cellHeight / 2;
                    
                    // 生成SVG线条
                    const adjustedAngle = angleRad + Math.PI / 2;
                    const maxDimension = Math.max(cellWidth, cellHeight);
                    const lineLength = maxDimension * 1.2;
                    const halfLength = lineLength / 2;
                    
                    const startX = centerX - Math.cos(adjustedAngle) * halfLength;
                    const startY = centerY - Math.sin(adjustedAngle) * halfLength;
                    const endX = centerX + Math.cos(adjustedAngle) * halfLength;
                    const endY = centerY + Math.sin(adjustedAngle) * halfLength;
                    
                    svgLines += `<line x1="${startX.toFixed(2)}" y1="${startY.toFixed(2)}" x2="${endX.toFixed(2)}" y2="${endY.toFixed(2)}" stroke="${color}" stroke-width="${actualLineWidth.toFixed(2)}" stroke-linecap="round"/>\n`;
                }
            }
        }
        return svgLines;
    }

    // 生成点状效果的SVG
    generateDotsSVG(xSquares, ySquares, cellWidth, cellHeight, threshold, minSize, maxSize, useOriginalColors, useHalftone, scaleFactor) {
        let svgDots = '';

        for (let y = 0; y < ySquares; y++) {
            for (let x = 0; x < xSquares; x++) {
                const cellX = x * cellWidth;
                const cellY = y * cellHeight;

                const cellData = this.getCellData(
                    Math.floor(cellX),
                    Math.floor(cellY),
                    Math.ceil(cellWidth),
                    Math.ceil(cellHeight)
                );

                if (cellData.brightness < threshold) {
                    const baseDotSize = minSize + (maxSize - minSize) * (1 - cellData.brightness / 255);
                    const actualDotSize = baseDotSize * scaleFactor;
                    const color = useOriginalColors ? cellData.color : '#000000';
                    
                    const centerX = cellX + cellWidth / 2;
                    const centerY = cellY + cellHeight / 2;
                    
                    // 主圆点
                    svgDots += `<circle cx="${centerX.toFixed(2)}" cy="${centerY.toFixed(2)}" r="${(actualDotSize / 2).toFixed(2)}" fill="${color}"/>\n`;
                    
                    // 如果启用网点效果，添加装饰小点
                    if (useHalftone) {
                        const smallDots = 4;
                        const radius = actualDotSize * 0.8;
                        for (let i = 0; i < smallDots; i++) {
                            const angle = (i / smallDots) * Math.PI * 2;
                            const smallX = centerX + Math.cos(angle) * radius;
                            const smallY = centerY + Math.sin(angle) * radius;
                            const smallRadius = actualDotSize * 0.15;
                            
                            svgDots += `<circle cx="${smallX.toFixed(2)}" cy="${smallY.toFixed(2)}" r="${smallRadius.toFixed(2)}" fill="${color}"/>\n`;
                        }
                    }
                }
            }
        }
        return svgDots;
    }

    // 生成纹理效果的SVG
    generateTextureSVG(xSquares, ySquares, cellWidth, cellHeight, threshold, minLineWidth, maxLineWidth, useOriginalColors, scaleFactor) {
        let svgPaths = '';
        const noiseScale = 0.05;

        for (let y = 0; y < ySquares; y++) {
            for (let x = 0; x < xSquares; x++) {
                const cellX = x * cellWidth;
                const cellY = y * cellHeight;

                const cellData = this.getCellData(
                    Math.floor(cellX),
                    Math.floor(cellY),
                    Math.ceil(cellWidth),
                    Math.ceil(cellHeight)
                );

                if (cellData.brightness < threshold) {
                    const baseLineWidth = minLineWidth + (maxLineWidth - minLineWidth) * (1 - cellData.brightness / 255);
                    const actualLineWidth = baseLineWidth * scaleFactor;
                    const color = useOriginalColors ? cellData.color : '#000000';
                    
                    // 计算纹理参数
                    const strokeLength = Math.min(cellWidth, cellHeight) * 0.8;
                    const density = Math.max(2, Math.floor(Math.min(cellWidth, cellHeight) / 8));
                    
                    // 创建伪随机数生成器
                    const random = this.createSeededRandom(x * 10000 + y);
                    
                    // 在当前网格内生成多条纹理线
                    for (let i = 0; i < density; i++) {
                        const relativeX = random();
                        const relativeY = random();
                        const startX = cellX + relativeX * cellWidth;
                        const startY = cellY + relativeY * cellHeight;
                        const angle = this.pseudoNoise((x + relativeX) * noiseScale, (y + relativeY) * noiseScale) * Math.PI * 2;
                        const strokeVariation = random() * 0.5 + 0.5;
                        const endX = startX + Math.cos(angle) * strokeLength * strokeVariation;
                        const endY = startY + Math.sin(angle) * strokeLength * strokeVariation;
                        const midX = (startX + endX) / 2 + (random() - 0.5) * cellWidth / 4;
                        const midY = (startY + endY) / 2 + (random() - 0.5) * cellHeight / 4;
                        
                        // 生成二次贝塞尔曲线路径
                        svgPaths += `<path d="M${startX.toFixed(2)},${startY.toFixed(2)} Q${midX.toFixed(2)},${midY.toFixed(2)} ${endX.toFixed(2)},${endY.toFixed(2)}" stroke="${color}" stroke-width="${actualLineWidth.toFixed(2)}" fill="none" stroke-linecap="round"/>\n`;
                    }
                }
            }
        }
        return svgPaths;
    }

    loadDefaultImage() {
        // 自动加载dado.jpg作为默认图片
        const img = new Image();
        img.onload = () => {
            this.originalImage = img;
            // 隐藏初始拖拽区域，但画布区域仍然支持拖拽替换
            this.elements.dropZone.classList.add('hidden');
            this.resizeCanvas();
            this.processImage();
        };
        img.onerror = () => {
            console.log('默认图片加载失败，请手动上传图片');
        };
        img.src = './dado.jpg';
    }

    handleKeyboard(event) {
        if (event.ctrlKey) {
            switch (event.key) {
                case 'o':
                    event.preventDefault();
                    this.elements.imageInput.click();
                    break;
                case 's':
                    event.preventDefault();
                    this.exportCanvas();
                    break;
            }
        }
    }

    // 简化版图像处理（用于实时预览）
    processImageLightweight() {
        if (!this.originalImage) return;

        // 清空画布
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制原始图像
        this.ctx.drawImage(this.originalImage, 0, 0, this.canvas.width, this.canvas.height);

        // 简化的预处理（只应用关键效果）
        this.applyLightweightPreprocessing();

        // 应用选择的滤镜效果（简化版）
        if (this.showEffectEnabled) {
            this.applyCurrentFilterLightweight();
        }
    }

    // 轻量级预处理
    applyLightweightPreprocessing() {
        const gamma = parseFloat(this.elements.gamma.value);
        const blackPoint = parseInt(this.elements.blackPoint.value);
        const whitePoint = parseInt(this.elements.whitePoint.value);

        // 只应用关键的视觉调整，跳过耗时的模糊和颗粒
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // 应用Gamma校正
            if (gamma !== 1.0) {
                r = Math.pow(r / 255, gamma) * 255;
                g = Math.pow(g / 255, gamma) * 255;
                b = Math.pow(b / 255, gamma) * 255;
            }

            // 应用黑点和白点调节
            if (blackPoint !== 0 || whitePoint !== 255) {
                r = Math.max(0, Math.min(255, ((r - blackPoint) * 255) / (whitePoint - blackPoint)));
                g = Math.max(0, Math.min(255, ((g - blackPoint) * 255) / (whitePoint - blackPoint)));
                b = Math.max(0, Math.min(255, ((b - blackPoint) * 255) / (whitePoint - blackPoint)));
            }

            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
        }

        this.ctx.putImageData(imageData, 0, 0);
        this.processedImageData = imageData;
    }

    // 轻量级滤镜应用
    applyCurrentFilterLightweight() {
        if (this.currentFilter === 'raster') {
            this.applyRasterLineEffectLightweight();
        } else if (this.currentFilter === 'dots') {
            this.applyDotsEffectLightweight();
        } else if (this.currentFilter === 'texture') {
            this.applyTextureEffectLightweight();
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new RasterLineProcessor();
});

// 折叠功能
document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('h3');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const section = toggle.parentElement;
            const controls = section.querySelectorAll('.control-group');
            const isCollapsed = toggle.querySelector('.toggle').textContent === '+';
            
            controls.forEach(control => {
                control.style.display = isCollapsed ? 'block' : 'none';
            });
            
            toggle.querySelector('.toggle').textContent = isCollapsed ? '-' : '+';
        });
    });
});

// 扩展RasterLineProcessor类的方法
RasterLineProcessor.prototype.applyDotsEffect = function() {
    if (!this.processedImageData) return;
    
    // 获取参数（复用部分光栅参数）
    const threshold = parseInt(this.elements.threshold.value);
    const xSquares = parseInt(this.elements.xSquares.value);
    const ySquares = parseInt(this.elements.ySquares.value);
    const minSize = parseFloat(this.elements.minLineWidth.value);
    const maxSize = parseFloat(this.elements.maxLineWidth.value);
    const useOriginalColors = this.useOriginalColorsEnabled;
    const useHalftone = this.useHalftoneEnabled;

    // 清空画布为白色
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 计算缩放比例（基于600px标准尺寸）
    const baseSize = 600;
    const scaleFactor = Math.max(this.canvas.width, this.canvas.height) / baseSize;

    const cellWidth = this.canvas.width / xSquares;
    const cellHeight = this.canvas.height / ySquares;

    for (let y = 0; y < ySquares; y++) {
        for (let x = 0; x < xSquares; x++) {
            const cellX = x * cellWidth;
            const cellY = y * cellHeight;

            const cellData = this.getCellData(
                Math.floor(cellX),
                Math.floor(cellY),
                Math.ceil(cellWidth),
                Math.ceil(cellHeight)
            );

            if (cellData.brightness < threshold) {
                const baseDotSize = minSize + (maxSize - minSize) * (1 - cellData.brightness / 255);
                const actualDotSize = baseDotSize * scaleFactor;
                const color = useOriginalColors ? cellData.color : '#000000';
                
                const centerX = cellX + cellWidth / 2;
                const centerY = cellY + cellHeight / 2;
                
                // 根据网点开关选择绘制方法
                if (useHalftone) {
                    this.drawHalftoneDot(centerX, centerY, actualDotSize, color);
                } else {
                    this.drawDot(centerX, centerY, actualDotSize, color);
                }
            }
        }
    }
};

RasterLineProcessor.prototype.drawDot = function(x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    this.ctx.fill();
};

RasterLineProcessor.prototype.drawHalftoneDot = function(x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 添加小点装饰效果
    const smallDots = 4;
    const radius = size * 0.8;
    for (let i = 0; i < smallDots; i++) {
        const angle = (i / smallDots) * Math.PI * 2;
        const smallX = x + Math.cos(angle) * radius;
        const smallY = y + Math.sin(angle) * radius;
        
        this.ctx.beginPath();
        this.ctx.arc(smallX, smallY, size * 0.15, 0, Math.PI * 2);
        this.ctx.fill();
    }
};

RasterLineProcessor.prototype.applyTextureEffect = function() {
    if (!this.processedImageData) return;
    
    // 获取参数 - 使用与其他滤镜相同的网格化方式
    const threshold = parseInt(this.elements.threshold.value);
    const xSquares = parseInt(this.elements.xSquares.value);
    const ySquares = parseInt(this.elements.ySquares.value);
    const minLineWidth = parseFloat(this.elements.minLineWidth.value);
    const maxLineWidth = parseFloat(this.elements.maxLineWidth.value);
    const useOriginalColors = this.useOriginalColorsEnabled;

    // 清空画布为白色
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 计算缩放比例（基于600px标准尺寸）- 用于保持视觉一致性
    const baseSize = 600;
    const scaleFactor = Math.max(this.canvas.width, this.canvas.height) / baseSize;

    // 计算网格尺寸 - 使用与其他滤镜相同的方式
    const cellWidth = this.canvas.width / xSquares;
    const cellHeight = this.canvas.height / ySquares;

    this.ctx.lineCap = 'round';
    
    const noiseScale = 0.05;
    
    // 性能优化：对于高密度网格，减少纹理线条数量
    const totalCells = xSquares * ySquares;
    const performanceMode = totalCells > 25000; // 超过25000个网格启用性能模式

    // 使用网格化处理，与其他滤镜保持一致
    for (let y = 0; y < ySquares; y++) {
        for (let x = 0; x < xSquares; x++) {
            const cellX = x * cellWidth;
            const cellY = y * cellHeight;

            // 使用标准的getCellData方法获取网格数据
            const cellData = this.getCellData(
                Math.floor(cellX),
                Math.floor(cellY),
                Math.ceil(cellWidth),
                Math.ceil(cellHeight)
            );

            // 根据亮度决定是否绘制纹理
            if (cellData.brightness < threshold) {
                // 计算基础线宽，基于亮度调整，然后应用缩放因子保持视觉一致性
                const baseLineWidth = minLineWidth + (maxLineWidth - minLineWidth) * (1 - cellData.brightness / 255);
                const actualLineWidth = baseLineWidth * scaleFactor;
                
                // 设置线条样式
                this.ctx.lineWidth = actualLineWidth;
                this.ctx.strokeStyle = useOriginalColors ? cellData.color : '#000000';
                
                // 计算纹理参数 - 基于实际网格大小
                const strokeLength = Math.min(cellWidth, cellHeight) * 0.8;
                
                // 性能优化：根据模式调整密度
                let density;
                if (performanceMode) {
                    density = Math.max(1, Math.floor(Math.min(cellWidth, cellHeight) / 16)); // 减少密度
                } else {
                    density = Math.max(2, Math.floor(Math.min(cellWidth, cellHeight) / 8)); // 原始密度
                }
                
                // 创建当前网格的伪随机数生成器，基于网格索引而不是像素坐标，确保缩放时的一致性
                const random = this.createSeededRandom(x * 10000 + y);
                
                // 在当前网格内绘制多条纹理线
                for (let i = 0; i < density; i++) {
                    const relativeX = random(); // 网格内相对位置 0-1
                    const relativeY = random(); // 网格内相对位置 0-1
                    const startX = cellX + relativeX * cellWidth;
                    const startY = cellY + relativeY * cellHeight;
                    // 使用网格索引+相对位置来计算角度，确保缩放时保持一致
                    const angle = this.pseudoNoise((x + relativeX) * noiseScale, (y + relativeY) * noiseScale) * Math.PI * 2;
                    const strokeVariation = random() * 0.5 + 0.5;
                    const endX = startX + Math.cos(angle) * strokeLength * strokeVariation;
                    const endY = startY + Math.sin(angle) * strokeLength * strokeVariation;
                    
                    // 性能优化：在高密度模式下简化曲线为直线
                    if (performanceMode) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(startX, startY);
                        this.ctx.lineTo(endX, endY);
                        this.ctx.stroke();
                    } else {
                    const midX = (startX + endX) / 2 + (random() - 0.5) * cellWidth / 4;
                    const midY = (startY + endY) / 2 + (random() - 0.5) * cellHeight / 4;
                    
                    // 绘制二次贝塞尔曲线
                    this.ctx.beginPath();
                    this.ctx.moveTo(startX, startY);
                    this.ctx.quadraticCurveTo(midX, midY, endX, endY);
                    this.ctx.stroke();
                    }
                }
            }
        }
    }
};

// 伪噪声函数，用于创建纹理效果
RasterLineProcessor.prototype.pseudoNoise = function(x, y) {
    return (Math.sin(x * 0.3 + y * 0.2) + Math.cos(x * 0.7 + y * 0.5) + 2) / 4;
};

// 安全的伪随机数生成器，不影响全局Math.random
RasterLineProcessor.prototype.createSeededRandom = function(seed) {
    let currentSeed = seed;
    return function() {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
    };
};

// 参数保存和恢复功能
RasterLineProcessor.prototype.loadSavedParams = function() {
    try {
        const saved = localStorage.getItem('rasterProcessorFilterParams');
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        console.warn('无法加载保存的参数:', e);
        return {};
    }
};

RasterLineProcessor.prototype.saveCurrentFilterParams = function() {
    if (!this.currentFilter) return;
    
    // 收集当前所有参数
    const params = {
        blur: this.elements.blur.value,
        grain: this.elements.grain.value,
        gamma: this.elements.gamma.value,
        blackPoint: this.elements.blackPoint.value,
        whitePoint: this.elements.whitePoint.value,
        threshold: this.elements.threshold.value,
        gridAngle: this.elements.gridAngle.value,
        ySquares: this.elements.ySquares.value,
        xSquares: this.elements.xSquares.value,
        minLineWidth: this.elements.minLineWidth.value,
        maxLineWidth: this.elements.maxLineWidth.value,
        showEffectEnabled: this.showEffectEnabled,
        useOriginalColorsEnabled: this.useOriginalColorsEnabled,
        useHalftoneEnabled: this.useHalftoneEnabled
    };
    
    // 保存到当前滤镜的参数集合中
    this.savedFilterParams[this.currentFilter] = params;
    
    // 持久化到localStorage
    try {
        localStorage.setItem('rasterProcessorFilterParams', JSON.stringify(this.savedFilterParams));
        console.log(`已保存 ${this.currentFilter} 滤镜参数`);
    } catch (e) {
        console.warn('无法保存参数到localStorage:', e);
    }
};

RasterLineProcessor.prototype.restoreFilterParams = function(filterType) {
    let savedParams;
    let defaultParams;
    
    // 根据滤镜类型获取相应的预设参数
    if (filterType === 'dots') {
        savedParams = this.getDotsPresetParams();
        console.log('正在应用点状滤镜的预设参数');
    } else if (filterType === 'texture') {
        savedParams = this.getTextureDefaultParams();
        console.log('正在应用纹理滤镜的预设参数');
    } else {
        savedParams = this.savedFilterParams[filterType];
        
        // 获取默认参数以确保关键设置
        if (filterType === 'raster') {
            defaultParams = this.getRasterDefaultParams();
        }
        
        if (!savedParams) {
            console.log(`没有找到 ${filterType} 滤镜的保存参数，使用默认值`);
            if (defaultParams) {
                savedParams = defaultParams;
            } else {
                return;
            }
        } else {
            // 合并保存的参数和默认参数，确保关键设置得到保持
            if (defaultParams) {
                savedParams = { ...defaultParams, ...savedParams };
            }
            console.log(`正在恢复 ${filterType} 滤镜的保存参数`);
        }
    }
    
    // 恢复滑块参数
    if (this.elements.blur) this.elements.blur.value = savedParams.blur || this.elements.blur.value;
    if (this.elements.grain) this.elements.grain.value = savedParams.grain || this.elements.grain.value;
    if (this.elements.gamma) this.elements.gamma.value = savedParams.gamma || this.elements.gamma.value;
    if (this.elements.blackPoint) this.elements.blackPoint.value = savedParams.blackPoint || this.elements.blackPoint.value;
    if (this.elements.whitePoint) this.elements.whitePoint.value = savedParams.whitePoint || this.elements.whitePoint.value;
    if (this.elements.threshold) this.elements.threshold.value = savedParams.threshold || this.elements.threshold.value;
    if (this.elements.gridAngle) this.elements.gridAngle.value = savedParams.gridAngle || this.elements.gridAngle.value;
    if (this.elements.ySquares) this.elements.ySquares.value = savedParams.ySquares || this.elements.ySquares.value;
    if (this.elements.xSquares) this.elements.xSquares.value = savedParams.xSquares || this.elements.xSquares.value;
    if (this.elements.minLineWidth) this.elements.minLineWidth.value = savedParams.minLineWidth || this.elements.minLineWidth.value;
    if (this.elements.maxLineWidth) this.elements.maxLineWidth.value = savedParams.maxLineWidth || this.elements.maxLineWidth.value;
    
    // 恢复开关状态
    if (savedParams.showEffectEnabled !== undefined) {
        this.setShowEffect(savedParams.showEffectEnabled);
    }
    
    // 使用原色功能：始终优先保持开启状态
    this.setUseOriginalColors(savedParams.useOriginalColorsEnabled !== false);
    
    if (savedParams.useHalftoneEnabled !== undefined) {
        this.setUseHalftone(savedParams.useHalftoneEnabled);
    }
    
    // 更新显示值
    this.updateValueDisplays();
};

// 点状滤镜的预设参数
RasterLineProcessor.prototype.getDotsPresetParams = function() {
    return {
        blur: '0',
        grain: '0', 
        gamma: '1.4',
        blackPoint: '0',
        whitePoint: '255',
        threshold: '255',
        gridAngle: '95',
        ySquares: '78',
        xSquares: '78',
        minLineWidth: '1.7',
        maxLineWidth: '7.1',
        showEffectEnabled: true,
        useOriginalColorsEnabled: true,
        useHalftoneEnabled: false
    };
};

// 光栅滤镜的默认参数（保持使用原色开启）
RasterLineProcessor.prototype.getRasterDefaultParams = function() {
    return {
        useOriginalColorsEnabled: true,
        showEffectEnabled: true,
        useHalftoneEnabled: false
    };
};

// 纹理滤镜的默认参数（保持使用原色开启）
RasterLineProcessor.prototype.getTextureDefaultParams = function() {
    return {
        blur: '0',
        grain: '0',
        gamma: '1.7',
        blackPoint: '25',
        whitePoint: '230',
        threshold: '255',
        gridAngle: '0',
        ySquares: '120',
        xSquares: '110',
        minLineWidth: '0.6',
        maxLineWidth: '4.5',
        useOriginalColorsEnabled: true,
        showEffectEnabled: true,
        useHalftoneEnabled: false
    };
};