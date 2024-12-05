// ==UserScript==
// @name         OpenWebUI提示词助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为OpenWebUI添加快捷提示词按钮
// @author       Your name
// @match        http://182.44.3.73:6736/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
  "use strict";

  // 默认提示词配置
  const defaultPrompts = [
    {
      name: "通用助手",
      prompt:
        "我希望你作为一个专业的助手，帮助我解决各种问题。请用简洁、清晰的语言回答我的问题。",
    },
    {
      name: "外卖好评助手",
      prompt:
        "请你帮我写一则外卖好评，要求语言自然、真诚，突出商家的特色和优点，字数在50-100字之间。",
    },
    {
      name: "编程助手",
      prompt:
        "我希望你作为一个专业的程序员，帮助我解决编程相关的问题。请提供清晰的代码示例和详细的解释。",
    },
  ];

  // 初始化提示词
  function initPrompts() {
    const savedPrompts = GM_getValue("prompts");
    if (!savedPrompts) {
      GM_setValue("prompts", defaultPrompts);
    }
    return GM_getValue("prompts");
  }

  // 创建按钮样式
  const style = document.createElement("style");
  style.textContent = `
        .prompt-helper-btn {
            margin: 0 4px;
            padding: 2px 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            background: #f5f5f5;
        }
        .prompt-helper-btn:hover {
            background: #e5e5e5;
        }
        .prompt-helper-container {
            margin: 8px 0;
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }
    `;
  document.head.appendChild(style);

  // 创建按钮容器
  function createButtonContainer(textarea) {
    const container = document.createElement("div");
    container.className = "prompt-helper-container";
    return container;
  }

  // 创建单个按钮
  function createButton(prompt, container, textarea) {
    const btn = document.createElement("button");
    btn.className = "prompt-helper-btn";
    btn.textContent = prompt.name + " -";
    btn.onclick = () => {
      textarea.value = prompt.prompt;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";

      // 删除该提示词
      const prompts = GM_getValue("prompts");
      const newPrompts = prompts.filter((p) => p.name !== prompt.name);
      GM_setValue("prompts", newPrompts);
      refreshButtons(container, textarea);
    };
    return btn;
  }

  // 创建添加按钮
  function createAddButton(container, textarea) {
    const btn = document.createElement("button");
    btn.className = "prompt-helper-btn";
    btn.textContent = "+";
    btn.onclick = () => {
      const name = prompt("请输入提示词名称：");
      if (!name) return;
      const promptText = prompt("请输入提示词内容：");
      if (!promptText) return;

      const prompts = GM_getValue("prompts");
      prompts.push({ name, prompt: promptText });
      GM_setValue("prompts", prompts);
      refreshButtons(container, textarea);
    };
    return btn;
  }

  // 刷新按钮
  function refreshButtons(container, textarea) {
    container.innerHTML = "";
    const prompts = GM_getValue("prompts");
    prompts.forEach((prompt) => {
      container.appendChild(createButton(prompt, container, textarea));
    });
    container.appendChild(createAddButton(container, textarea));
  }

  // 主函数
  function init() {
    // 使用更精确的选择器来定位目标元素
    const targetDiv = document.querySelector("div.w-full.cursor-pointer");
    if (!targetDiv) {
      setTimeout(init, 1000);
      return;
    }
    console.log(targetDiv);

    const textareaContainer = document.querySelector('div[slot="content"]');
    if (!textareaContainer) {
      setTimeout(init, 1000);
      return;
    }
    console.log(textareaContainer);

    const textarea = textareaContainer.querySelector("textarea");
    if (!textarea) {
      setTimeout(init, 1000);
      return;
    }
    console.log(textarea);

    initPrompts();
    const container = createButtonContainer(textarea);
    // 将按钮容器插入到标题和文本框之间
    targetDiv.parentElement.insertBefore(
      container,
      targetDiv.nextElementSibling
    );
    refreshButtons(container, textarea);
  }

  // 启动脚本
  init();
})();
