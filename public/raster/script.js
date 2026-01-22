
// ==========================================
// CONFIG & STATE
// ==========================================
const state = {
    file: null,
    frames: [], // Array of ImageData
    params: {
        frameCount: 8,
        frameInterval: 0.5, // Seconds
        lineDensity: 10, // Pixels per line group (actually line spacing)
        lineThickness: 0.5, // Ratio (0.0 - 1.0)
        invertMask: false,
        scanDirection: 'horizontal', // 'horizontal' or 'vertical'
        xOffset: 2, // Pixels shift per frame index
        interlaceMode: true,
        showOverlay: true,
        gridOpacity: 0.9,
        lineColor: '#000000',
    },
    ui: {
        width: 0,
        height: 0,
        overlayX: 0,
        overlayY: 0,
        isDragging: false,
        lastMouseY: 0,
        // Canvas Output Dimensions (independent of video source)
        canvasWidth: 0,
        canvasHeight: 0,
        isResizing: false,
        resizeDir: null,
        lastResizeX: 0,
        lastResizeY: 0
    }
};

// ==========================================
// DOM ELEMENTS
// ==========================================
const els = {
    videoInput: document.getElementById('videoInput'),
    fileName: document.getElementById('fileName'),
    // processBtn: document.getElementById('processBtn'),
    canvasWrapper: document.getElementById('canvasWrapper'),
    status: document.getElementById('status'),
    loading: document.getElementById('loading'),
    exportBtn: document.getElementById('exportBtn'), // May be null if replaced
    exportZipBtn: document.getElementById('exportZipBtn'),
    exportScale: document.getElementById('exportScale'),
    
    // Inputs
    frameCount: document.getElementById('frameCount'),
    frameInterval: document.getElementById('frameInterval'),
    lineDensity: document.getElementById('lineDensity'),
    lineThickness: document.getElementById('lineThickness'),
    invertMask: document.getElementById('invertMask'),
    scanDirection: document.getElementById('scanDirection'),
    xOffset: document.getElementById('xOffset'),
    interlaceMode: document.getElementById('interlaceMode'),
    showOverlay: document.getElementById('showOverlay'),
    gridOpacity: document.getElementById('gridOpacity'),
    lineColor: document.getElementById('lineColor'),
    
    // Canvas Size Inputs
    canvasWidthInput: document.getElementById('canvasWidth'),
    canvasHeightInput: document.getElementById('canvasHeight'),

    // Value Labels
    frameCountVal: document.getElementById('frameCountVal'),
    frameIntervalVal: document.getElementById('frameIntervalVal'),
    lineDensityVal: document.getElementById('lineDensityVal'),
    lineThicknessVal: document.getElementById('lineThicknessVal'),
    xOffsetVal: document.getElementById('xOffsetVal'),
    gridOpacityVal: document.getElementById('gridOpacityVal'),

    // Preview
    videoPreviewContainer: document.getElementById('videoPreviewContainer'),
    videoPreview: document.getElementById('videoPreview')
};

// ==========================================
// VIDEO PROCESSOR
// ==========================================
class VideoProcessor {
    constructor() {
        this.video = document.createElement('video');
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.crossOrigin = "anonymous"; // Try to avoid tainting
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    }

    loadVideo(file) {
        return new Promise((resolve, reject) => {
            const url = URL.createObjectURL(file);
            
            // Setup internal processing video
            this.video.src = url;
            this.video.load();
            
            // Setup UI preview video
            els.videoPreview.src = url;
            els.videoPreviewContainer.style.display = 'block';

            const onLoaded = () => {
                state.ui.width = this.video.videoWidth;
                state.ui.height = this.video.videoHeight;
                this.canvas.width = state.ui.width;
                this.canvas.height = state.ui.height;
                
                // Ensure preview is also loaded?
                // Not strictly necessary for processing but good for UX
                
                resolve();
            };

            this.video.onloadedmetadata = onLoaded;
            this.video.onerror = () => reject(new Error("Video format not supported or file corrupted."));
        });
    }

    async extractFrames(count, interval) {
        const frames = [];
        const duration = this.video.duration;
        
        if (!duration || isNaN(duration)) {
             throw new Error("Cannot determine video duration.");
        }
        
        // Ensure we don't exceed duration
        const maxTime = Math.min(duration, count * interval);
        // Recalculate interval if video is too short
        const actualInterval = (maxTime < count * interval) ? (duration / count) : interval;

        for (let i = 0; i < count; i++) {
            const time = i * actualInterval;
            
            // Improved seek logic
            try {
                await this.seekTo(time);
            } catch (e) {
                console.warn(`Seek failed at ${time}s:`, e);
                // Continue anyway? Or stop?
            }
            
            this.ctx.drawImage(this.video, 0, 0);
            const imageData = this.ctx.getImageData(0, 0, state.ui.width, state.ui.height);
            frames.push(imageData);
            
            updateStatus(`已提取帧 ${i + 1}/${count}`);
        }
        return frames;
    }

    seekTo(time) {
        return new Promise((resolve, reject) => {
            // Safety timeout
            const timeout = setTimeout(() => {
                // If timeout, maybe we are close enough?
                // reject(new Error("Seek timeout"));
                console.warn("Seek timeout, proceeding anyway");
                resolve(); 
            }, 2000);

            const onSeek = () => {
                clearTimeout(timeout);
                this.video.removeEventListener('seeked', onSeek);
                resolve();
            };
            
            this.video.addEventListener('seeked', onSeek);
            this.video.currentTime = time;
            
            // Edge case: if currentTime is already there (e.g. 0), seeked might not fire?
            // But usually assigning property triggers it even if value is same.
            // Just in case check readyState
        });
    }
}

// ==========================================
// RASTER ENGINE
// ==========================================
class RasterEngine {
    constructor() {
        this.canvas = document.createElement('canvas');
        // This internal canvas holds the generated content (Video Size)
        this.ctx = this.canvas.getContext('2d');
    }

    // Renamed from render to generate to signify it creates the source artifact
    generate(frames, params) {
        if (!frames || frames.length === 0) return null;

        const w = state.ui.width; // Video Source Width
        const h = state.ui.height; // Video Source Height
        
        if (this.canvas.width !== w || this.canvas.height !== h) {
            this.canvas.width = w;
            this.canvas.height = h;
        }

        // Clear
        this.ctx.clearRect(0, 0, w, h);
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, w, h);

        const density = parseInt(params.lineDensity);
        const singleLineHeight = parseInt(params.lineDensity);
        const outputImage = this.ctx.createImageData(w, h);
        const buf = outputImage.data;

        // Parse Color
        const hex = params.lineColor || '#000000';
        const cr = parseInt(hex.slice(1, 3), 16);
        const cg = parseInt(hex.slice(3, 5), 16);
        const cb = parseInt(hex.slice(5, 7), 16);

        // Iterate over all pixels
        if (params.interlaceMode) {
            const isVertical = params.scanDirection === 'vertical';
            
            for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    
                    let frameIndex = 0;
                    
                    if (isVertical) {
                        const cycleIndex = Math.floor(x / singleLineHeight);
                        frameIndex = cycleIndex % frames.length;
                    } else {
                        const cycleIndex = Math.floor(y / singleLineHeight);
                        frameIndex = cycleIndex % frames.length;
                    }

                    const frame = frames[frameIndex];
                    let srcX = x;
                    let srcY = y;
                    
                    const offsetAmount = Math.floor(frameIndex * params.xOffset);
                    
                    if (isVertical) {
                        srcY = y - offsetAmount; 
                    } else {
                        srcX = x - offsetAmount; 
                    }
                    
                    if (srcX < 0 || srcX >= w || srcY < 0 || srcY >= h) {
                        const idx = (y * w + x) * 4;
                        buf[idx] = 255; buf[idx+1] = 255; buf[idx+2] = 255; buf[idx+3] = 255;
                        continue;
                    }
                    
                    const fData = frame.data;
                    const srcIdx = (srcY * w + srcX) * 4;
                    
                    const r = fData[srcIdx];
                    const g = fData[srcIdx + 1];
                    const b = fData[srcIdx + 2];
                    
                    let brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                    
                    if (params.invertMask) brightness = 255 - brightness;

                    const ink = (255 - brightness) * params.lineThickness; 
                    // Blend Logic
                    const inkRatio = ink / 255;
                    const outR = (1 - inkRatio) * 255 + inkRatio * cr;
                    const outG = (1 - inkRatio) * 255 + inkRatio * cg;
                    const outB = (1 - inkRatio) * 255 + inkRatio * cb;

                    const idx = (y * w + x) * 4;
                    buf[idx] = outR;
                    buf[idx+1] = outG;
                    buf[idx+2] = outB;
                    buf[idx+3] = 255;
                }
            }
        } else {
             // Non-interlaced (Composite)
             const isVertical = params.scanDirection === 'vertical';

             for (let y = 0; y < h; y++) {
                for (let x = 0; x < w; x++) {
                    let minVal = 255; // White (brightness)

                    for (let f = 0; f < frames.length; f++) {
                         const offsetAmount = Math.floor(f * params.xOffset);
                         
                         let srcX = x;
                         let srcY = y;
                         
                         if (isVertical) {
                             srcY = y - offsetAmount;
                         } else {
                             srcX = x - offsetAmount;
                         }
                         
                         if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h) {
                            const srcIdx = (srcY * w + srcX) * 4;
                            const r = frames[f].data[srcIdx];
                            const g = frames[f].data[srcIdx+1];
                            const b = frames[f].data[srcIdx+2];
                            
                            let brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                            if (params.invertMask) brightness = 255 - brightness;
                            
                            const ink = (255 - brightness) * params.lineThickness;
                            const val = 255 - ink; // Whiteness contribution
                            
                            // Multiply blend (darker wins)
                            minVal = (minVal * val) / 255;
                         }
                    }
                    
                    // Convert accumulated brightness (minVal) to Color
                    const inkRatio = (255 - minVal) / 255;
                    const outR = (1 - inkRatio) * 255 + inkRatio * cr;
                    const outG = (1 - inkRatio) * 255 + inkRatio * cg;
                    const outB = (1 - inkRatio) * 255 + inkRatio * cb;

                    const idx = (y * w + x) * 4;
                    buf[idx] = outR;
                    buf[idx+1] = outG;
                    buf[idx+2] = outB;
                    buf[idx+3] = 255;
                }
             }
        }

        this.ctx.putImageData(outputImage, 0, 0);
        return this.canvas;
    }
}

// ==========================================
// CANVAS MANAGER (New)
// ==========================================
class CanvasManager {
    constructor() {
        // This is the visible canvas in DOM
        this.displayCanvas = document.createElement('canvas');
        this.displayCanvas.id = 'resultCanvas';
        this.ctx = this.displayCanvas.getContext('2d');
        
        this.cachedRaster = null;
    }
    
    // Updates the size of the canvas container and internal canvas
    resize(w, h) {
        state.ui.canvasWidth = w;
        state.ui.canvasHeight = h;
        
        // Update Inputs
        els.canvasWidthInput.value = w;
        els.canvasHeightInput.value = h;
        
        // Resize actual canvas
        this.displayCanvas.width = w;
        this.displayCanvas.height = h;
        
        // Update Wrapper Size
        els.canvasWrapper.style.width = `${w}px`;
        els.canvasWrapper.style.height = `${h}px`;
        
        // Trigger Redraw
        this.draw();
    }
    
    setRasterSource(sourceCanvas) {
        this.cachedRaster = sourceCanvas;
        this.draw();
    }
    
    draw() {
        const w = state.ui.canvasWidth;
        const h = state.ui.canvasHeight;
        
        // Clear background
        this.ctx.fillStyle = '#fff'; // Artboard background
        this.ctx.fillRect(0, 0, w, h);
        
        if (this.cachedRaster) {
            // Draw Raster Image Centered
            const srcW = this.cachedRaster.width;
            const srcH = this.cachedRaster.height;
            
            const x = (w - srcW) / 2;
            const y = (h - srcH) / 2;
            
            this.ctx.drawImage(this.cachedRaster, x, y);
        }
    }
    
    getCanvas() {
        return this.displayCanvas;
    }
}

// ==========================================
// OVERLAY ENGINE (Barrier Grid)
// ==========================================
class OverlayEngine {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'overlayCanvas';
        this.ctx = this.canvas.getContext('2d');
    }

    render(params, width, height) {
        // Always match the output canvas size
        if (this.canvas.width !== width || this.canvas.height !== height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        
        this.ctx.clearRect(0, 0, width, height);

        if (!params.showOverlay) return this.canvas;

        OverlayEngine.drawToContext(this.ctx, params, width, height);
        
        return this.canvas;
    }

    static drawToContext(ctx, params, width, height) {
        const lineHeight = parseInt(params.lineDensity);
        const transparentSize = lineHeight;
        const opaqueSize = lineHeight * (params.frameCount - 1);
        const cycleSize = transparentSize + opaqueSize;
        
        // Parse Color
        const hex = params.lineColor || '#000000';
        const cr = parseInt(hex.slice(1, 3), 16);
        const cg = parseInt(hex.slice(3, 5), 16);
        const cb = parseInt(hex.slice(5, 7), 16);
        
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${params.gridOpacity})`;
        
        if (params.scanDirection === 'vertical') {
            // Vertical Mode: Bars are Vertical
            for (let x = 0; x < width + cycleSize; x += cycleSize) {
                 ctx.fillRect(x + transparentSize, 0, opaqueSize, height);
            }
        } else {
            // Horizontal Mode: Bars are Horizontal
            for (let y = 0; y < height + cycleSize; y += cycleSize) {
                ctx.fillRect(0, y + transparentSize, width, opaqueSize);
            }
        }
    }
}

// ==========================================
// APP ORCHESTRATOR
// ==========================================
const processor = new VideoProcessor();
const rasterizer = new RasterEngine();
const canvasManager = new CanvasManager();
const overlay = new OverlayEngine();

function init() {
    setupListeners();
    // Initialize canvas to default 500x500 so users see an artboard without uploading
    canvasManager.resize(500, 500);
}

function setupListeners() {
    // File Upload
    els.videoInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        state.file = file;
        els.fileName.textContent = file.name;
        updateStatus('正在加载视频...');
        
        try {
            await processor.loadVideo(file);
            updateStatus('视频已加载。准备处理。');
            
            // Initialize Canvas Size to Video Size
            canvasManager.resize(state.ui.width, state.ui.height);
            
            // Auto Process
            processContent();
        } catch (err) {
            updateStatus('加载视频出错: ' + err.message);
        }
    });

    // Extract Parameters (Frame Count & Interval) - Trigger Full Process
    ['frameCount', 'frameInterval'].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', () => {
             updateUIValues();
        });
        el.addEventListener('change', () => {
             processContent();
        });
    });

    // Process Content Logic
    async function processContent() {
        if (!state.file) return;
        
        updateParams();
        els.loading.classList.remove('hidden');
        
        try {
            updateStatus('正在提取帧...');
            // Extract
            state.frames = await processor.extractFrames(state.params.frameCount, state.params.frameInterval);
            
            updateStatus('正在生成光栅...');
            // Generate Raster (Heavy Operation)
            const source = rasterizer.generate(state.frames, state.params);
            canvasManager.setRasterSource(source);
            
            // Render Display
            renderDisplay();
            
            updateStatus('处理完成。');
        } catch (err) {
            console.error(err);
            updateStatus('错误: ' + err.message);
        } finally {
            els.loading.classList.add('hidden');
        }
    }

    // Live Parameter Updates
    const inputs = [
        'lineDensity', 'lineThickness', 'invertMask', 
        'xOffset', 'interlaceMode', 'showOverlay', 'gridOpacity', 'lineColor'
    ];
    
    inputs.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', (e) => {
            updateUIValues();
            updateParams();
            if (state.frames.length > 0) {
                // If parameters change, we MUST regenerate the raster
                const source = rasterizer.generate(state.frames, state.params);
                canvasManager.setRasterSource(source);
                renderDisplay();
            }
        });
    });

    // Scan Direction Change
    const dirSelect = document.getElementById('scanDirection');
    if (dirSelect) {
        dirSelect.addEventListener('change', () => {
             updateParams();
             if (state.frames.length > 0) {
                const source = rasterizer.generate(state.frames, state.params);
                canvasManager.setRasterSource(source);
                renderDisplay();
            }
        });
    }
    
    // Canvas Size Inputs
    els.canvasWidthInput.addEventListener('change', (e) => {
        const w = parseInt(e.target.value) || 100;
        canvasManager.resize(w, state.ui.canvasHeight);
        renderDisplay();
    });
    
    els.canvasHeightInput.addEventListener('change', (e) => {
        const h = parseInt(e.target.value) || 100;
        canvasManager.resize(state.ui.canvasWidth, h);
        renderDisplay();
    });

    // Overlay Dragging & Canvas Resizing
    const wrapper = els.canvasWrapper;
    
    // We need to distinguish between resizing handles and moving overlay
    // Use event delegation or check target
    
    wrapper.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Export
    if (els.exportBtn) els.exportBtn.addEventListener('click', downloadImage);
    if (els.exportZipBtn) els.exportZipBtn.addEventListener('click', downloadLayers);
}

function createExportCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
}

async function downloadLayers() {
    if (!state.frames.length && !canvasManager.cachedRaster) {
        alert("没有可导出的内容。请先处理视频。");
        return;
    }

    const scale = parseInt(els.exportScale.value) || 1;
    const w = state.ui.canvasWidth;
    const h = state.ui.canvasHeight;
    const targetW = w * scale;
    const targetH = h * scale;

    updateStatus(`正在生成 ${scale}x 分辨率导出文件...`);

    try {
        // 1. Generate Raster Layer (Bottom)
        const rasterCvs = createExportCanvas(targetW, targetH);
        const ctxRaster = rasterCvs.getContext('2d');
        
        ctxRaster.fillStyle = '#fff';
        ctxRaster.fillRect(0, 0, targetW, targetH);
        
        if (canvasManager.cachedRaster) {
            // Draw Raster Image Centered and Scaled
            const srcW = canvasManager.cachedRaster.width;
            const srcH = canvasManager.cachedRaster.height;
            
            const x = (w - srcW) / 2;
            const y = (h - srcH) / 2;
            
            ctxRaster.drawImage(
                canvasManager.cachedRaster, 
                x * scale, 
                y * scale, 
                srcW * scale, 
                srcH * scale
            );
        }

        // 2. Generate Overlay Layer (Top)
        const overlayCvs = createExportCanvas(targetW, targetH);
        const ctxOverlay = overlayCvs.getContext('2d');
        
        ctxOverlay.scale(scale, scale);
        
        // Force opacity to 1.0 for export to ensure the card is usable for printing
        const exportParams = { ...state.params, gridOpacity: 1.0 };
        OverlayEngine.drawToContext(ctxOverlay, exportParams, w, h);

        // 3. Download Separately
        // Function to trigger download
        const triggerDownload = (canvas, filename) => {
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setTimeout(() => URL.revokeObjectURL(url), 100);
                    resolve();
                }, 'image/png');
            });
        };

        await triggerDownload(rasterCvs, `raster_bottom_${scale}x.png`);
        // Small delay to ensure browser handles second download gracefully
        await new Promise(r => setTimeout(r, 500));
        await triggerDownload(overlayCvs, `overlay_top_${scale}x.png`);
        
        updateStatus("导出完成。");
        
    } catch (err) {
        console.error("Export failed:", err);
        updateStatus("导出失败: " + err.message);
        alert("导出失败: " + err.message);
    }
}

function updateParams() {
    state.params.frameCount = parseInt(els.frameCount.value);
    state.params.frameInterval = parseFloat(els.frameInterval.value);
    state.params.lineDensity = parseInt(els.lineDensity.value);
    state.params.lineThickness = parseFloat(els.lineThickness.value);
    state.params.invertMask = els.invertMask.checked;
    state.params.xOffset = parseInt(els.xOffset.value);
    state.params.interlaceMode = els.interlaceMode.checked;
    state.params.showOverlay = els.showOverlay.checked;
    state.params.gridOpacity = parseFloat(els.gridOpacity.value);
    state.params.lineColor = els.lineColor.value;
    
    const scanEl = document.getElementById('scanDirection');
    if(scanEl) state.params.scanDirection = scanEl.value;
}

function updateUIValues() {
    els.frameCountVal.textContent = els.frameCount.value;
    els.frameIntervalVal.textContent = els.frameInterval.value;
    els.lineDensityVal.textContent = els.lineDensity.value;
    els.lineThicknessVal.textContent = els.lineThickness.value;
    els.xOffsetVal.textContent = els.xOffset.value;
    els.gridOpacityVal.textContent = els.gridOpacity.value;
}

function updateStatus(msg) {
    els.status.textContent = msg;
}

function renderDisplay() {
    // 1. CanvasManager draws the cached raster onto the display canvas (Result)
    canvasManager.draw();
    
    // 2. OverlayEngine draws the grid onto its own canvas (Overlay)
    // It matches the Canvas Output Size
    const overlayCanvas = overlay.render(state.params, state.ui.canvasWidth, state.ui.canvasHeight);
    
    // 3. Inject if not already there
    // We need to ensure correct order: Result (Bottom), Resize Handles (Middle?), Overlay (Top)
    // Actually Overlay is top. Resize handles are UI.
    // The wrapper has handles permanently. We just need to append canvases if missing.
    
    const resultCanvas = canvasManager.getCanvas();
    if (!resultCanvas.parentNode) {
        els.canvasWrapper.appendChild(resultCanvas);
    }
    if (!overlayCanvas.parentNode) {
        els.canvasWrapper.appendChild(overlayCanvas);
    }
    
    // Reset Overlay Position logic?
    // If we resize, the overlay transform is still applied.
    overlayCanvas.style.transform = `translate(${state.ui.overlayX}px, ${state.ui.overlayY}px)`;
}

// Unified Mouse Handler
function handleMouseDown(e) {
    const target = e.target;
    
    // Check if Resizing
    if (target.classList.contains('resize-handle')) {
        state.ui.isResizing = true;
        state.ui.resizeDir = target.dataset.dir;
        state.ui.lastResizeX = e.clientX;
        state.ui.lastResizeY = e.clientY;
        e.preventDefault();
        return;
    }
    
    // Check if Overlay Drag
    if (target.id === 'overlayCanvas' && state.params.showOverlay) {
        state.ui.isDragging = true;
        state.ui.lastMouseY = e.clientY;
        state.ui.lastMouseX = e.clientX;
        target.style.cursor = 'grabbing';
        e.preventDefault();
    }
}

function handleMouseMove(e) {
    // Resizing Logic
    if (state.ui.isResizing) {
        const dx = e.clientX - state.ui.lastResizeX;
        const dy = e.clientY - state.ui.lastResizeY;
        
        let newW = state.ui.canvasWidth;
        let newH = state.ui.canvasHeight;
        
        const dir = state.ui.resizeDir;
        
        if (dir === 'right') newW += dx;
        if (dir === 'bottom') newH += dy;
        if (dir === 'left') newW -= dx; // Visual only? Or change width?
        if (dir === 'top') newH -= dy;
        
        // Enforce min size
        newW = Math.max(50, newW);
        newH = Math.max(50, newH);
        
        state.ui.lastResizeX = e.clientX;
        state.ui.lastResizeY = e.clientY;
        
        canvasManager.resize(newW, newH);
        renderDisplay();
        return;
    }

    // Overlay Drag Logic
    if (state.ui.isDragging) {
        const dy = e.clientY - state.ui.lastMouseY;
        const dx = e.clientX - state.ui.lastMouseX;
        
        state.ui.overlayY += dy;
        state.ui.overlayX += dx;
        
        state.ui.lastMouseY = e.clientY;
        state.ui.lastMouseX = e.clientX;
        
        const overlayCanvas = document.getElementById('overlayCanvas');
        if (overlayCanvas) {
            overlayCanvas.style.transform = `translate(${state.ui.overlayX}px, ${state.ui.overlayY}px)`;
        }
    }
}

function handleMouseUp() {
    state.ui.isResizing = false;
    state.ui.resizeDir = null;
    
    if (state.ui.isDragging) {
        state.ui.isDragging = false;
        const overlayCanvas = document.getElementById('overlayCanvas');
        if(overlayCanvas) overlayCanvas.style.cursor = 'grab';
    }
}

function downloadImage() {
    const canvas = document.getElementById('resultCanvas');
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `raster-motion-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Start
init();

// Mode switch UI (non-invasive)
function setupModeSwitch() {
    const enter = document.getElementById('enterDadoBtn');
    const exit1 = document.getElementById('exitDadoBtn');
    const exit2 = document.getElementById('exitDadoBtn2');
    const body = document.body;

    const enterHandler = () => {
        body.classList.add('dado-mode');
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('mode', 'dado');
            window.history.replaceState(null, '', url.toString());
        } catch {}
    };
    const exitHandler = () => {
        body.classList.remove('dado-mode');
        try {
            const url = new URL(window.location.href);
            url.searchParams.delete('mode');
            window.history.replaceState(null, '', url.toString());
        } catch {}
    };

    if (enter) enter.addEventListener('click', enterHandler);
    if (exit1) exit1.addEventListener('click', exitHandler);
    if (exit2) exit2.addEventListener('click', exitHandler);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupModeSwitch);
} else {
    setupModeSwitch();
}

// Enable DADO mode via URL query, e.g., ?mode=dado
try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('mode') === 'dado') {
        document.body.classList.add('dado-mode');
    }
} catch {}
