// 这段代码使用 Web Workers 来渲染颜色。
// Web Workers 运行在后台线程中，不会阻塞主线程，
// 因此可以在后台线程中执行计算密集型任务。

// 导入所需文件
importScripts('colorconversion.js', 'hsluv.js','render.js');

// 定义了一个变量, 用于指示是否有渲染任务正在进行。
let pendingRender = false;
// 定义了三个变量存储颜色值
let r = 0;
let g = 0;
let b = 0;

// Web Worker 的主函数
// 主线程向 Web Worker 发送消息时，onmessage 函数会被触发
onmessage = function(e)
{
    // 主线程发来一个包含颜色值的数组
    r = e.data[0];
    g = e.data[1];
    b = e.data[2];

    // 如果当前没有待处理的渲染任务
    if (!pendingRender)
    {
        // 创建一个新的渲染任务
        pendingRender = true;
        // 创建定时器，让渲染任务在 30 毫秒后执行。
        setTimeout(function()
        {
            // 任务完成
            pendingRender = false;
            // 调用 render 函数渲染颜色
            // 使用 postMessage 函数将渲染结果发送回主线程
            postMessage(render(r,g,b));
        }, 30);
    }
}